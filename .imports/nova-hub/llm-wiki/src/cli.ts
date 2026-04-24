#!/usr/bin/env bun
/**
 * LLM-Wiki CLI Entry Point
 * 
 * Pipeline standalone para geração de conteúdo estruturado com qualidade máxima.
 * 
 * Usage:
 *   bun run src/cli.ts --entity "Galaxy.ai" --intent wiki_entry
 *   bun run src/cli.ts --help
 */

import { parseArgs } from "util";

const VERSION = "1.0.0";
const PIPELINE_VERSION = "1.0.0";

interface JobSpec {
  spec: string;
  entity: string;
  intent: string;
  locale: string;
  output: string;
  pipeline_version: string;
  generated_at: string;
}

/**
 * Parse CLI arguments
 */
function parseCliArgs() {
  try {
    const { values } = parseArgs({
      args: Bun.argv.slice(2),
      options: {
        entity: {
          type: "string",
          short: "e",
          description: "Entity name (product, service, platform)",
        },
        intent: {
          type: "string",
          short: "i",
          description: "Intent type (wiki_entry, comparison, etc)",
        },
        locale: {
          type: "string",
          short: "l",
          default: "pt-BR",
          description: "Locale for output (default: pt-BR)",
        },
        output: {
          type: "string",
          short: "o",
          default: "output",
          description: "Output directory (default: output)",
        },
        help: {
          type: "boolean",
          short: "h",
          description: "Show help",
        },
        version: {
          type: "boolean",
          short: "v",
          description: "Show version",
        },
      },
      strict: true,
      allowPositionals: false,
    });

    return values;
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    console.error("Use --help for usage information");
    process.exit(1);
  }
}

/**
 * Display help message
 */
function showHelp() {
  console.log(`
LLM-Wiki Pipeline v${VERSION}

Generate structured wiki entries with maximum quality.

USAGE:
  bun run src/cli.ts [OPTIONS]

OPTIONS:
  -e, --entity <name>     Entity name (product, service, platform)
  -i, --intent <type>     Intent type (wiki_entry, comparison, etc)
  -l, --locale <code>     Locale for output (default: pt-BR)
  -o, --output <dir>      Output directory (default: output)
  -h, --help              Show this help message
  -v, --version           Show version

EXAMPLES:
  # Generate a wiki entry
  bun run src/cli.ts --entity "Galaxy.ai" --intent wiki_entry

  # With custom locale
  bun run src/cli.ts --entity "Test" --intent wiki_entry --locale en-US

  # With custom output directory
  bun run src/cli.ts --entity "Test" --intent wiki_entry --output ./wiki
`);
}

/**
 * Display version
 */
function showVersion() {
  console.log(`llm-wiki v${VERSION}`);
  console.log(`pipeline: ${PIPELINE_VERSION}`);
}

/**
 * Generate job spec from arguments
 */
function generateJobSpec(args: ReturnType<typeof parseCliArgs>): JobSpec {
  const now = new Date().toISOString();
  
  return {
    spec: "llm-wiki/1.0.0",
    entity: args.entity || "",
    intent: args.intent || "",
    locale: args.locale || "pt-BR",
    output: args.output || "output",
    pipeline_version: PIPELINE_VERSION,
    generated_at: now,
  };
}

/**
 * Log startup information
 */
function logStartup(args: ReturnType<typeof parseCliArgs>) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({
    level: "info",
    timestamp,
    message: "CLI startup",
    version: VERSION,
    args: {
      entity: args.entity,
      intent: args.intent,
      locale: args.locale,
      output: args.output,
    },
  }));
}

/**
 * Main entry point
 */
function main() {
  const args = parseCliArgs();

  // Handle --help
  if (args.help) {
    showHelp();
    process.exit(0);
  }

  // Handle --version
  if (args.version) {
    showVersion();
    process.exit(0);
  }

  // Validate required arguments
  if (!args.entity) {
    console.error("Error: --entity is required");
    console.error("Use --help for usage information");
    process.exit(1);
  }

  if (!args.intent) {
    console.error("Error: --intent is required");
    console.error("Use --help for usage information");
    process.exit(1);
  }

  // Log startup
  logStartup(args);

  // Generate job spec
  const jobSpec = generateJobSpec(args);

  // Output job spec as JSON
  console.log(JSON.stringify(jobSpec, null, 2));
}

main();
