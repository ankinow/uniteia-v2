/**
 * YAML Frontmatter Parser Module
 *
 * Extracts and parses YAML frontmatter from markdown files.
 * Frontmatter is delimited by `---` at the start of the file.
 */

import { parse } from 'yaml';
import { readFile } from 'fs/promises';

/**
 * Parsed frontmatter result
 */
export interface ParsedFrontmatter {
  /** Parsed YAML data as JavaScript object */
  data: unknown;
  /** Body content after frontmatter (trimmed leading whitespace) */
  body: string;
}

/**
 * Error thrown when YAML parsing fails
 */
export class YAMLParseError extends Error {
  constructor(
    message: string,
    public readonly line: number | undefined,
    public readonly context: string | undefined
  ) {
    super(message);
    this.name = 'YAMLParseError';
  }
}

/**
 * Parse YAML frontmatter from a string
 *
 * Frontmatter must be at the start of the content, delimited by `---`.
 * Returns null if no frontmatter is found.
 *
 * @param content - Raw markdown content
 * @returns Parsed frontmatter and body, or null if no frontmatter
 * @throws YAMLParseError if YAML is malformed
 */
export function parseFrontmatter(content: string): ParsedFrontmatter | null {
  // Trim any leading whitespace to be forgiving
  const trimmed = content.trimStart();

  // Check for frontmatter delimiter at start
  if (!trimmed.startsWith('---')) {
    return null;
  }

  // Find the closing delimiter
  const closeDelimiterIndex = trimmed.indexOf('---', 3);

  // No closing delimiter found
  if (closeDelimiterIndex === -1) {
    return null;
  }

  // Extract the YAML content between delimiters
  const yamlContent = trimmed.slice(3, closeDelimiterIndex).trim();

  // Empty frontmatter (just two delimiters)
  if (yamlContent.length === 0) {
    return {
      data: {},
      body: trimmed.slice(closeDelimiterIndex + 3).trimStart(),
    };
  }

  // Parse the YAML
  try {
    const data = parse(yamlContent);

    // Extract body content after closing delimiter
    const body = trimmed.slice(closeDelimiterIndex + 3).trimStart();

    return { data, body };
  } catch (err) {
    // Extract line number and context from YAML parse error
    const error = err as Error;
    const lineMatch = error.message.match(/at line (\d+)/);
    const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;

    throw new YAMLParseError(
      `Failed to parse YAML frontmatter: ${error.message}`,
      line,
      yamlContent.split('\n').slice(0, line ? line + 2 : 3).join('\n')
    );
  }
}

/**
 * Parse YAML frontmatter from a file
 *
 * @param path - Path to the markdown file
 * @returns Parsed frontmatter and body, or null if no frontmatter
 * @throws YAMLParseError if YAML is malformed
 * @throws Error if file cannot be read
 */
export async function parseFrontmatterFromFile(
  path: string
): Promise<ParsedFrontmatter | null> {
  const content = await readFile(path, 'utf-8');
  return parseFrontmatter(content);
}
