/**
 * Web Fetcher Utilities
 *
 * Reusable HTTP request and HTML parsing utilities for Stage 1 (Research).
 * Provides rate-limited fetching, response size limits, timeout handling,
 * and Cheerio-based text extraction with charset detection.
 */

import * as cheerio from "cheerio";

/**
 * Fetcher configuration
 */
export interface FetcherConfig {
  /** Maximum response size in bytes (default: 5MB) */
  maxResponseSize: number;
  /** Request timeout in milliseconds (default: 30000) */
  timeout: number;
  /** Minimum time between requests in milliseconds (default: 1000) */
  rateLimitMs: number;
  /** Maximum content excerpt length (default: 5000) */
  maxExcerptLength: number;
}

/**
 * Default fetcher configuration
 */
export const DEFAULT_FETCHER_CONFIG: FetcherConfig = {
  maxResponseSize: 5 * 1024 * 1024, // 5MB
  timeout: 30000, // 30 seconds
  rateLimitMs: 1000, // 1 second between requests
  maxExcerptLength: 5000, // 5000 chars per excerpt
};

/**
 * Fetch result
 */
export interface FetchResult {
  /** The fetched URL */
  url: string;
  /** HTTP status code */
  statusCode: number;
  /** Response headers */
  headers: Record<string, string>;
  /** Raw body (text) */
  body: string;
  /** Detected charset */
  charset: string;
  /** Size in bytes */
  size: number;
  /** Time taken in milliseconds */
  duration: number;
}

/**
 * Parse result
 */
export interface ParseResult {
  /** Extracted title */
  title: string | undefined;
  /** Main text content (limited to maxExcerptLength) */
  excerpt: string;
  /** All text content before truncation */
  fullText: string;
  /** Detected charset */
  charset: string;
  /** Word count */
  wordCount: number;
}

/**
 * Fetch error types
 */
export type FetchErrorType =
  | "network_error"
  | "timeout"
  | "size_exceeded"
  | "invalid_response"
  | "encoding_error"
  | "rate_limited";

/**
 * Structured fetch error
 */
export class FetchError extends Error {
  constructor(
    public readonly type: FetchErrorType,
    public readonly url: string,
    message: string,
    public readonly statusCode?: number,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = "FetchError";
  }
}

/**
 * Rate limiter state
 */
class RateLimiter {
  private lastRequestTime: number = 0;

  constructor(private readonly minDelayMs: number) {}

  async waitForNextRequest(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    const remaining = this.minDelayMs - elapsed;

    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }

    this.lastRequestTime = Date.now();
  }
}

// Global rate limiter instance
const globalRateLimiter = new RateLimiter(DEFAULT_FETCHER_CONFIG.rateLimitMs);

/**
 * Fetch a URL with rate limiting, size limits, and timeout
 *
 * @param url - URL to fetch
 * @param config - Optional configuration overrides
 * @returns Fetch result with response data
 * @throws FetchError on network errors, timeout, or size exceeded
 */
export async function fetchUrl(
  url: string,
  config: Partial<FetcherConfig> = {}
): Promise<FetchResult> {
  const finalConfig = { ...DEFAULT_FETCHER_CONFIG, ...config };
  const rateLimiter = config.rateLimitMs
    ? new RateLimiter(config.rateLimitMs)
    : globalRateLimiter;

  // Wait for rate limit
  await rateLimiter.waitForNextRequest();

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout);

  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "LLM-Wiki-Research-Bot/1.0",
        Accept: "text/html,application/xhtml+xml,text/plain",
      },
    });
  } catch (err) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (err instanceof Error && err.name === "AbortError") {
      logFetchError(url, "timeout", undefined, duration);
      throw new FetchError("timeout", url, `Request timed out after ${finalConfig.timeout}ms`);
    }

    logFetchError(url, "network_error", undefined, duration, err);
    throw new FetchError(
      "network_error",
      url,
      `Network error: ${err instanceof Error ? err.message : String(err)}`,
      undefined,
      err instanceof Error ? err : undefined
    );
  }

  clearTimeout(timeoutId);
  const duration = Date.now() - startTime;

  // Check status code
  if (!response.ok) {
    logFetchError(url, "invalid_response", response.status, duration);
    throw new FetchError(
      "invalid_response",
      url,
      `HTTP error: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  // Check content length
  const contentLength = response.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > finalConfig.maxResponseSize) {
    logFetchError(url, "size_exceeded", response.status, duration);
    throw new FetchError(
      "size_exceeded",
      url,
      `Response too large: ${contentLength} bytes exceeds limit of ${finalConfig.maxResponseSize}`
    );
  }

  // Read body with size limit
  let body: string;
  try {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const chunks: Uint8Array[] = [];
    let totalSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalSize += value.length;
      if (totalSize > finalConfig.maxResponseSize) {
        reader.cancel();
        logFetchError(url, "size_exceeded", response.status, duration);
        throw new FetchError(
          "size_exceeded",
          url,
          `Response exceeded ${finalConfig.maxResponseSize} bytes during streaming`
        );
      }

      chunks.push(value);
    }

    // Detect charset from headers
    const contentType = response.headers.get("content-type") || "";
    const headerCharset = detectCharsetFromContentType(contentType);

    // Decode with charset
    const decoder = new TextDecoder(headerCharset || "utf-8");
    body = chunks.reduce((acc, chunk) => {
      return acc + decoder.decode(chunk, { stream: true });
    }, "");
  } catch (err) {
    if (err instanceof FetchError) throw err;

    logFetchError(url, "encoding_error", response.status, duration, err);
    throw new FetchError(
      "encoding_error",
      url,
      `Encoding error: ${err instanceof Error ? err.message : String(err)}`,
      response.status,
      err instanceof Error ? err : undefined
    );
  }

  // Convert headers to object
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Detect charset from meta tags if not in headers
  const headerCharset = detectCharsetFromContentType(
    response.headers.get("content-type") || ""
  );
  const metaCharset = headerCharset ? null : detectCharset(body);
  const charset = headerCharset || metaCharset || "utf-8";

  logFetchSuccess(url, response.status, body.length, duration);

  return {
    url,
    statusCode: response.status,
    headers,
    body,
    charset,
    size: body.length,
    duration,
  };
}

/**
 * Parse HTML with Cheerio and extract structured text
 *
 * @param html - HTML content to parse
 * @param config - Optional configuration overrides
 * @returns Parsed content with title and excerpt
 */
export function parseHtml(
  html: string,
  config: Partial<FetcherConfig> = {}
): ParseResult {
  const finalConfig = { ...DEFAULT_FETCHER_CONFIG, ...config };

  let $: cheerio.CheerioAPI;
  try {
    $ = cheerio.load(html);
  } catch (err) {
    logParseError("invalid_html", err);
    throw new Error(`Failed to parse HTML: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Extract title
  const title =
    $("head title").text().trim() ||
    $("meta[property='og:title']").attr("content") ||
    undefined;

  // Remove script, style, nav, header, footer, aside
  $(
    "script, style, nav, header, footer, aside, iframe, noscript"
  ).remove();

  // Get main content (prefer main, article, or body)
  let mainContent =
    $("main").text() ||
    $("article").text() ||
    $("#content").text() ||
    $("#main").text() ||
    $(".content").text() ||
    $(".main").text() ||
    $("body").text();

  // Clean up whitespace
  mainContent = mainContent
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();

  // Calculate word count
  const wordCount = mainContent.split(/\s+/).filter(Boolean).length;

  // Truncate to max excerpt length
  const excerpt =
    mainContent.length > finalConfig.maxExcerptLength
      ? mainContent.substring(0, finalConfig.maxExcerptLength) + "..."
      : mainContent;

  // Detect charset
  const charset = detectCharset(html);

  logParseSuccess(title, excerpt.length, wordCount);

  return {
    title,
    excerpt,
    fullText: mainContent,
    charset,
    wordCount,
  };
}

/**
 * Detect charset from Content-Type header
 *
 * @param contentType - Content-Type header value
 * @returns Detected charset or null
 */
export function detectCharsetFromContentType(
  contentType: string
): string | null {
  // Match charset with optional spaces and quotes
  const match = contentType.match(/charset\s*=\s*["']?([^"';\s]+)/i);
  return match ? normalizeCharset(match[1]) : null;
}

/**
 * Detect charset from HTML meta tags
 *
 * @param html - HTML content
 * @returns Detected charset or null
 */
export function detectCharset(html: string): string | null {
  // Check <meta charset="...">
  const metaCharsetMatch = html.match(/<meta\s+charset=["']?([^"'\s>]+)/i);
  if (metaCharsetMatch) {
    return normalizeCharset(metaCharsetMatch[1]);
  }

  // Check <meta http-equiv="Content-Type" content="...; charset=...">
  const httpEquivMatch = html.match(
    /<meta\s+http-equiv=["']?Content-Type["']?\s+content=["']?[^"']*charset=([^"'\s;]+)/i
  );
  if (httpEquivMatch) {
    return normalizeCharset(httpEquivMatch[1]);
  }

  return null;
}

/**
 * Normalize charset name to standard form
 */
function normalizeCharset(charset: string): string {
  const normalized = charset.toLowerCase().trim();

  // Common aliases
  const aliases: Record<string, string> = {
    "utf8": "utf-8",
    "utf-8": "utf-8",
    "iso-8859-1": "iso-8859-1",
    "latin1": "iso-8859-1",
    "latin-1": "iso-8859-1",
    "windows-1252": "windows-1252",
    "cp1252": "windows-1252",
    "ascii": "utf-8", // Default ASCII to UTF-8
  };

  return aliases[normalized] || normalized;
}

/**
 * Log fetch error for observability
 */
function logFetchError(
  url: string,
  errorType: FetchErrorType,
  statusCode: number | undefined,
  duration: number,
  cause?: unknown
): void {
  const logEntry = {
    level: "error",
    timestamp: new Date().toISOString(),
    message: "Fetch error",
    url,
    error_type: errorType,
    ...(statusCode !== undefined && { status_code: statusCode }),
    duration_ms: duration,
    ...(cause instanceof Error && { cause: cause.message }),
  };
  console.error(JSON.stringify(logEntry));
}

/**
 * Log successful fetch for observability
 */
function logFetchSuccess(
  url: string,
  statusCode: number,
  size: number,
  duration: number
): void {
  const logEntry = {
    level: "info",
    timestamp: new Date().toISOString(),
    message: "Fetch success",
    url,
    status_code: statusCode,
    size_bytes: size,
    duration_ms: duration,
  };
  console.log(JSON.stringify(logEntry));
}

/**
 * Log parse error for observability
 */
function logParseError(errorType: string, cause: unknown): void {
  const logEntry = {
    level: "error",
    timestamp: new Date().toISOString(),
    message: "Parse error",
    error_type: errorType,
    ...(cause instanceof Error && { cause: cause.message }),
  };
  console.error(JSON.stringify(logEntry));
}

/**
 * Log successful parse for observability
 */
function logParseSuccess(
  title: string | undefined,
  excerptLength: number,
  wordCount: number
): void {
  const logEntry = {
    level: "info",
    timestamp: new Date().toISOString(),
    message: "Parse success",
    ...(title && { title }),
    excerpt_length: excerptLength,
    word_count: wordCount,
  };
  console.log(JSON.stringify(logEntry));
}
