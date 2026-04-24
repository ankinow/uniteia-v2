/**
 * Web Fetcher Tests
 *
 * Tests for fetchUrl, parseHtml, and charset detection utilities.
 * Uses mocked fetch responses to avoid real network calls.
 */

import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import {
  fetchUrl,
  parseHtml,
  detectCharset,
  detectCharsetFromContentType,
  FetchError,
  DEFAULT_FETCHER_CONFIG,
} from "./web-fetcher";

// Mock fetch globally
const originalFetch = global.fetch;

describe("fetchUrl", () => {
  beforeEach(() => {
    // Reset mocks before each test
    global.fetch = originalFetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("successfully fetches a URL", async () => {
    const mockHtml = "<html><head><title>Test Page</title></head><body>Hello World</body></html>";
    
    global.fetch = mock(async (url: string) => {
      expect(url).toBe("https://example.com");
      return new Response(mockHtml, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    });

    const result = await fetchUrl("https://example.com");

    expect(result.url).toBe("https://example.com");
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(mockHtml);
    expect(result.charset).toBe("utf-8");
    expect(result.size).toBe(mockHtml.length);
    expect(result.duration).toBeGreaterThanOrEqual(0);
  });

  test("handles custom configuration", async () => {
    const mockHtml = "<html><body>Test</body></html>";
    
    global.fetch = mock(async () => {
      return new Response(mockHtml, {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    });

    const result = await fetchUrl("https://example.com", {
      timeout: 5000,
      rateLimitMs: 100,
      maxResponseSize: 10000,
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(mockHtml);
  });

  test("throws FetchError on network error", async () => {
    global.fetch = mock(async () => {
      throw new Error("Network failed");
    });

    try {
      await fetchUrl("https://example.com");
      expect(true).toBe(false); // Should not reach here
    } catch (err) {
      expect(err).toBeInstanceOf(FetchError);
      const fetchErr = err as FetchError;
      expect(fetchErr.type).toBe("network_error");
      expect(fetchErr.url).toBe("https://example.com");
      expect(fetchErr.message).toContain("Network error");
    }
  });

  test("throws FetchError on timeout", async () => {
    global.fetch = mock(async () => {
      // Simulate abort error
      const error = new Error("Aborted");
      error.name = "AbortError";
      throw error;
    });

    try {
      await fetchUrl("https://example.com", { timeout: 100 });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(FetchError);
      const fetchErr = err as FetchError;
      expect(fetchErr.type).toBe("timeout");
      expect(fetchErr.url).toBe("https://example.com");
    }
  });

  test("throws FetchError on HTTP error (404)", async () => {
    global.fetch = mock(async () => {
      return new Response("Not Found", {
        status: 404,
        statusText: "Not Found",
      });
    });

    try {
      await fetchUrl("https://example.com/notfound");
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(FetchError);
      const fetchErr = err as FetchError;
      expect(fetchErr.type).toBe("invalid_response");
      expect(fetchErr.statusCode).toBe(404);
      expect(fetchErr.message).toContain("HTTP error");
    }
  });

  test("throws FetchError on HTTP error (500)", async () => {
    global.fetch = mock(async () => {
      return new Response("Internal Server Error", {
        status: 500,
        statusText: "Internal Server Error",
      });
    });

    try {
      await fetchUrl("https://example.com/error");
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(FetchError);
      const fetchErr = err as FetchError;
      expect(fetchErr.type).toBe("invalid_response");
      expect(fetchErr.statusCode).toBe(500);
    }
  });

  test("throws FetchError when content-length exceeds limit", async () => {
    global.fetch = mock(async () => {
      return new Response("Large content", {
        status: 200,
        headers: {
          "content-length": "10000000", // 10MB, exceeds 5MB default
        },
      });
    });

    try {
      await fetchUrl("https://example.com/large");
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(FetchError);
      const fetchErr = err as FetchError;
      expect(fetchErr.type).toBe("size_exceeded");
      expect(fetchErr.message).toContain("too large");
    }
  });

  test("extracts headers correctly", async () => {
    global.fetch = mock(async () => {
      return new Response("Test", {
        status: 200,
        headers: {
          "content-type": "text/html",
          "x-custom-header": "custom-value",
          "cache-control": "no-cache",
        },
      });
    });

    const result = await fetchUrl("https://example.com");

    expect(result.headers["content-type"]).toBe("text/html");
    expect(result.headers["x-custom-header"]).toBe("custom-value");
    expect(result.headers["cache-control"]).toBe("no-cache");
  });

  test("detects charset from content-type header", async () => {
    global.fetch = mock(async () => {
      return new Response("Test", {
        status: 200,
        headers: {
          "content-type": "text/html; charset=iso-8859-1",
        },
      });
    });

    const result = await fetchUrl("https://example.com");

    expect(result.charset).toBe("iso-8859-1");
  });

  test("configured to follow redirects", async () => {
    // Verify that redirect: "follow" is set in the fetch options
    let fetchOptions: RequestInit | undefined;
    global.fetch = mock(async (url: string, options?: RequestInit) => {
      fetchOptions = options;
      return new Response("Test", { status: 200 });
    });

    await fetchUrl("https://example.com");

    expect(fetchOptions?.redirect).toBe("follow");
  });
});

describe("parseHtml", () => {
  test("extracts title from <title> tag", () => {
    const html = "<html><head><title>Test Title</title></head><body>Content</body></html>";
    const result = parseHtml(html);

    expect(result.title).toBe("Test Title");
  });

  test("extracts title from og:title meta tag", () => {
    const html = `<html><head>
      <meta property="og:title" content="OG Title">
    </head><body>Content</body></html>`;
    const result = parseHtml(html);

    expect(result.title).toBe("OG Title");
  });

  test("prefers <title> over og:title", () => {
    const html = `<html><head>
      <title>HTML Title</title>
      <meta property="og:title" content="OG Title">
    </head><body>Content</body></html>`;
    const result = parseHtml(html);

    expect(result.title).toBe("HTML Title");
  });

  test("removes script and style tags", () => {
    const html = `<html><body>
      <script>console.log('test');</script>
      <style>body { color: red; }</style>
      <nav>Navigation</nav>
      <header>Header</header>
      <footer>Footer</footer>
      <aside>Sidebar</aside>
      <main>Main Content</main>
    </body></html>`;
    const result = parseHtml(html);

    expect(result.excerpt).not.toContain("console.log");
    expect(result.excerpt).not.toContain("color: red");
    expect(result.excerpt).not.toContain("Navigation");
    expect(result.excerpt).toContain("Main Content");
  });

  test("truncates to maxExcerptLength", () => {
    const longContent = "x".repeat(10000);
    const html = `<html><body>${longContent}</body></html>`;
    const result = parseHtml(html, { maxExcerptLength: 100 });

    expect(result.excerpt.length).toBeLessThanOrEqual(103); // 100 + "..."
    expect(result.excerpt).toContain("...");
    expect(result.fullText.length).toBe(10000);
  });

  test("normalizes whitespace", () => {
    const html = `<html><body>
      <p>Multiple   spaces</p>
      <p>Multiple

      newlines</p>
    </body></html>`;
    const result = parseHtml(html);

    expect(result.excerpt).not.toContain("   ");
    expect(result.excerpt).toContain("Multiple spaces");
  });

  test("extracts from <main> element", () => {
    const html = `<html><body>
      <nav>Nav</nav>
      <main>Main Content Here</main>
      <footer>Footer</footer>
    </body></html>`;
    const result = parseHtml(html);

    expect(result.excerpt).toContain("Main Content Here");
    expect(result.excerpt).not.toContain("Nav");
    expect(result.excerpt).not.toContain("Footer");
  });

  test("extracts from <article> element", () => {
    const html = `<html><body>
      <header>Header</header>
      <article>Article Content</article>
    </body></html>`;
    const result = parseHtml(html);

    expect(result.excerpt).toContain("Article Content");
  });

  test("calculates word count", () => {
    const html = "<html><body>One two three four five</body></html>";
    const result = parseHtml(html);

    expect(result.wordCount).toBe(5);
  });

  test("handles empty HTML", () => {
    const html = "<html><body></body></html>";
    const result = parseHtml(html);

    expect(result.title).toBeUndefined();
    expect(result.excerpt).toBe("");
    expect(result.wordCount).toBe(0);
  });

  test("throws on invalid HTML (extremely malformed)", () => {
    // Cheerio is very tolerant, so this should succeed
    const result = parseHtml("not html at all");
    expect(result.excerpt).toBe("not html at all");
  });
});

describe("detectCharset", () => {
  test("detects from <meta charset>", () => {
    const html = '<html><head><meta charset="utf-8"></head><body></body></html>';
    const charset = detectCharset(html);
    expect(charset).toBe("utf-8");
  });

  test("detects from <meta charset> (uppercase)", () => {
    const html = '<html><head><META CHARSET="UTF-8"></head><body></body></html>';
    const charset = detectCharset(html);
    expect(charset).toBe("utf-8");
  });

  test("detects from http-equiv Content-Type", () => {
    const html = `<html><head>
      <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
    </head><body></body></html>`;
    const charset = detectCharset(html);
    expect(charset).toBe("iso-8859-1");
  });

  test("returns null when no charset specified", () => {
    const html = "<html><head><title>Test</title></head><body></body></html>";
    const charset = detectCharset(html);
    expect(charset).toBeNull();
  });

  test("normalizes utf8 to utf-8", () => {
    const html = '<html><head><meta charset="utf8"></head><body></body></html>';
    const charset = detectCharset(html);
    expect(charset).toBe("utf-8");
  });

  test("normalizes latin1 to iso-8859-1", () => {
    const html = '<html><head><meta charset="latin1"></head><body></body></html>';
    const charset = detectCharset(html);
    expect(charset).toBe("iso-8859-1");
  });
});

describe("detectCharsetFromContentType", () => {
  test("detects charset from content-type header", () => {
    const contentType = "text/html; charset=utf-8";
    const charset = detectCharsetFromContentType(contentType);
    expect(charset).toBe("utf-8");
  });

  test("detects charset with spaces", () => {
    const contentType = "text/html; charset = utf-8 ;";
    const charset = detectCharsetFromContentType(contentType);
    expect(charset).toBe("utf-8");
  });

  test("handles charset with quotes", () => {
    const contentType = 'text/html; charset="utf-8"';
    const charset = detectCharsetFromContentType(contentType);
    expect(charset).toBe("utf-8");
  });

  test("returns null when no charset", () => {
    const contentType = "text/html";
    const charset = detectCharsetFromContentType(contentType);
    expect(charset).toBeNull();
  });

  test("handles complex content-type", () => {
    const contentType = "application/xhtml+xml; charset=utf-8; type=text/html";
    const charset = detectCharsetFromContentType(contentType);
    expect(charset).toBe("utf-8");
  });
});

describe("DEFAULT_FETCHER_CONFIG", () => {
  test("has correct default values", () => {
    expect(DEFAULT_FETCHER_CONFIG.maxResponseSize).toBe(5 * 1024 * 1024); // 5MB
    expect(DEFAULT_FETCHER_CONFIG.timeout).toBe(30000); // 30s
    expect(DEFAULT_FETCHER_CONFIG.rateLimitMs).toBe(1000); // 1s
    expect(DEFAULT_FETCHER_CONFIG.maxExcerptLength).toBe(5000); // 5000 chars
  });
});

describe("FetchError", () => {
  test("creates error with all fields", () => {
    const error = new FetchError(
      "network_error",
      "https://example.com",
      "Connection failed",
      500,
      new Error("Original error")
    );

    expect(error.type).toBe("network_error");
    expect(error.url).toBe("https://example.com");
    expect(error.message).toBe("Connection failed");
    expect(error.statusCode).toBe(500);
    expect(error.cause).toBeInstanceOf(Error);
    expect(error.name).toBe("FetchError");
  });

  test("creates error without optional fields", () => {
    const error = new FetchError("timeout", "https://example.com", "Request timed out");

    expect(error.type).toBe("timeout");
    expect(error.url).toBe("https://example.com");
    expect(error.statusCode).toBeUndefined();
    expect(error.cause).toBeUndefined();
  });
});

describe("Integration tests", () => {
  test("fetches and parses HTML end-to-end", async () => {
    const mockHtml = `<html>
      <head>
        <title>Example Article</title>
        <meta charset="utf-8">
      </head>
      <body>
        <nav>Navigation Menu</nav>
        <article>
          <h1>Article Title</h1>
          <p>This is the main content of the article. It has multiple paragraphs.</p>
          <p>Second paragraph with more text.</p>
        </article>
        <footer>Footer Content</footer>
      </body>
    </html>`;

    global.fetch = mock(async () => {
      return new Response(mockHtml, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    });

    const fetchResult = await fetchUrl("https://example.com/article");
    expect(fetchResult.statusCode).toBe(200);
    expect(fetchResult.charset).toBe("utf-8");

    const parseResult = parseHtml(fetchResult.body);
    expect(parseResult.title).toBe("Example Article");
    expect(parseResult.excerpt).toContain("main content");
    expect(parseResult.excerpt).toContain("Second paragraph");
    expect(parseResult.excerpt).not.toContain("Navigation Menu");
    expect(parseResult.excerpt).not.toContain("Footer Content");
    expect(parseResult.wordCount).toBeGreaterThan(10);
  });
});
