/**
 * Draft Gate Tests
 *
 * Comprehensive test suite for the Draft Quality Gate that validates
 * structure and minimum field density requirements.
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { validateDraftGate } from "../../src/gates/draft-gate";
import type { WikiEntry, DraftConfig, EntityType } from "../../src/types/draft";
import { DEFAULT_DRAFT_CONFIG } from "../../src/types/draft";
import type { Source } from "../../src/types/evidence";

/**
 * Create a valid wiki entry for testing
 */
function createValidWikiEntry(overrides: Partial<WikiEntry> = {}): WikiEntry {
  const defaultEntry: WikiEntry = {
    spec: "llm-wiki/1.0.0",
    title: "Test Platform",
    type: "plataforma" as EntityType,
    value_proposition: "A comprehensive platform for structured content generation",
    what_it_offers: [
      "Automated content generation pipeline",
      "Schema validation engine",
      "Multi-format output support",
    ],
    problems_solved: [
      "Manual content creation is time-consuming and error-prone",
      "Inconsistent content structure across entries and authors",
    ],
    target_audience: "Content teams and technical writers who need structured documentation",
    when_it_matters: "When building knowledge bases that need consistent structure and validation",
    when_less_matters: "When creating simple one-off documents without structural requirements",
    short_formula: "Schema + Pipeline + Validation = Structured Content at Scale",
    sources: [
      {
        url: "https://example.com/docs",
        kind: "official",
        accessed_at: "2025-01-15",
      },
    ],
  };

  return { ...defaultEntry, ...overrides } as WikiEntry;
}

describe("Draft Gate", () => {
  describe("Valid draft validation", () => {
    test("validates a complete valid draft", () => {
      const entry = createValidWikiEntry();
      const result = validateDraftGate(entry);

      expect(result.pass).toBe(true);
      expect(result.schemaValid).toBe(true);
      expect(result.densityMet).toBe(true);
      expect(result.missingFields).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
      expect(result.fieldCounts.what_it_offers).toBe(3);
      expect(result.fieldCounts.problems_solved).toBe(2);
      expect(result.fieldCounts.sources).toBe(1);
    });

    test("validates draft with optional fields", () => {
      const entry = createValidWikiEntry({
        pricing: {
          model: "subscription",
          starting_price: "$49/mo",
          has_free_tier: true,
        },
        alternatives: ["Alternative A", "Alternative B"],
        integrations: ["Integration X", "Integration Y"],
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(true);
      expect(result.schemaValid).toBe(true);
      expect(result.densityMet).toBe(true);
    });

    test("validates draft with minimum required fields", () => {
      const entry = createValidWikiEntry({
        what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
        problems_solved: ["Problem A", "Problem B"],
        sources: [
          {
            url: "https://example.com",
            kind: "primary",
            accessed_at: "2025-01-01",
          },
        ],
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(true);
      expect(result.fieldCounts.what_it_offers).toBe(3);
      expect(result.fieldCounts.problems_solved).toBe(2);
      expect(result.fieldCounts.sources).toBe(1);
    });
  });

  describe("Missing required field failures", () => {
    test("fails when title is missing", () => {
      const entry = createValidWikiEntry();
      delete (entry as any).title;

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.missingFields).toContain("title");
      expect(result.errors.some((e) => e.field === "title")).toBe(true);
    });

    test("fails when spec is missing", () => {
      const entry = createValidWikiEntry();
      delete (entry as any).spec;

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.missingFields).toContain("spec");
    });

    test("fails when type is missing", () => {
      const entry = createValidWikiEntry();
      delete (entry as any).type;

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.missingFields).toContain("type");
    });

    test("fails when value_proposition is missing", () => {
      const entry = createValidWikiEntry();
      delete (entry as any).value_proposition;

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.missingFields).toContain("value_proposition");
    });

    test("fails when what_it_offers is missing", () => {
      const entry = createValidWikiEntry();
      delete (entry as any).what_it_offers;

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.missingFields).toContain("what_it_offers");
    });

    test("fails when problems_solved is missing", () => {
      const entry = createValidWikiEntry();
      delete (entry as any).problems_solved;

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.missingFields).toContain("problems_solved");
    });

    test("fails when target_audience is missing", () => {
      const entry = createValidWikiEntry();
      delete (entry as any).target_audience;

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.missingFields).toContain("target_audience");
    });

    test("fails when when_it_matters is missing", () => {
      const entry = createValidWikiEntry();
      delete (entry as any).when_it_matters;

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.missingFields).toContain("when_it_matters");
    });

    test("fails when when_less_matters is missing", () => {
      const entry = createValidWikiEntry();
      delete (entry as any).when_less_matters;

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.missingFields).toContain("when_less_matters");
    });

    test("fails when short_formula is missing", () => {
      const entry = createValidWikiEntry();
      delete (entry as any).short_formula;

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.missingFields).toContain("short_formula");
    });

    test("fails when sources is missing", () => {
      const entry = createValidWikiEntry();
      delete (entry as any).sources;

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.missingFields).toContain("sources");
    });
  });

  describe("Field density failures", () => {
    test("fails when what_it_offers has less than 3 items", () => {
      const entry = createValidWikiEntry({
        what_it_offers: ["Only one item", "Second item"],
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.densityMet).toBe(false);
      expect(result.fieldCounts.what_it_offers).toBe(2);
      expect(result.errors.some((e) => e.field === "what_it_offers")).toBe(true);
    });

    test("fails when problems_solved has less than 2 items", () => {
      const entry = createValidWikiEntry({
        problems_solved: ["Only one problem"],
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.densityMet).toBe(false);
      expect(result.fieldCounts.problems_solved).toBe(1);
      expect(result.errors.some((e) => e.field === "problems_solved")).toBe(true);
    });

    test("fails when sources is empty", () => {
      const entry = createValidWikiEntry({
        sources: [],
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.densityMet).toBe(false);
      expect(result.fieldCounts.sources).toBe(0);
      expect(result.errors.some((e) => e.field === "sources")).toBe(true);
    });

    test("accepts custom density requirements", () => {
      const customConfig: DraftConfig = {
        minWhatItOffers: 2,
        minProblemsSolved: 1,
        minSources: 1,
        validateSchema: true,
        enforceDensity: true,
      };

      const entry = createValidWikiEntry({
        what_it_offers: ["Feature 1", "Feature 2"],
        problems_solved: ["Problem 1"],
      });

      const result = validateDraftGate(entry, customConfig);

      expect(result.densityMet).toBe(true);
      expect(result.pass).toBe(true);
    });
  });

  describe("Schema validation failures", () => {
    test("fails when spec has invalid format", () => {
      const entry = createValidWikiEntry({
        spec: "invalid-spec-format",
      } as any);

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.schemaValid).toBe(false);
      expect(result.errors.some((e) => e.rule === "pattern")).toBe(true);
    });

    test("fails when type is invalid enum", () => {
      const entry = createValidWikiEntry({
        type: "invalid_type" as any,
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.schemaValid).toBe(false);
      expect(result.errors.some((e) => e.rule === "enum")).toBe(true);
    });

    test("fails when title is not a string", () => {
      const entry = createValidWikiEntry({
        title: 123 as any,
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.schemaValid).toBe(false);
      expect(result.errors.some((e) => e.rule === "type")).toBe(true);
    });

    test("fails when what_it_offers is not an array", () => {
      const entry = createValidWikiEntry({
        what_it_offers: "not an array" as any,
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.schemaValid).toBe(false);
      expect(result.errors.some((e) => e.rule === "type")).toBe(true);
    });

    test("fails when sources have invalid URL format", () => {
      const entry = createValidWikiEntry({
        sources: [
          {
            url: "not-a-url",
            kind: "primary",
            accessed_at: "2025-01-01",
          },
        ],
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.schemaValid).toBe(false);
      expect(result.errors.some((e) => e.rule === "format")).toBe(true);
    });

    test("fails when accessed_at has invalid date format", () => {
      const entry = createValidWikiEntry({
        sources: [
          {
            url: "https://example.com",
            kind: "primary",
            accessed_at: "not-a-date",
          },
        ],
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.schemaValid).toBe(false);
      expect(result.errors.some((e) => e.rule === "format")).toBe(true);
    });
  });

  describe("Content quality checks", () => {
    test("fails when value_proposition is placeholder", () => {
      const entry = createValidWikiEntry({
        value_proposition: "TBD",
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.rule === "content_quality")).toBe(true);
    });

    test("fails when target_audience is placeholder", () => {
      const entry = createValidWikiEntry({
        target_audience: "TODO",
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.rule === "content_quality")).toBe(true);
    });

    test("fails when value_proposition is empty", () => {
      const entry = createValidWikiEntry({
        value_proposition: "",
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.rule === "content_quality")).toBe(true);
    });

    test("fails when value_proposition is whitespace only", () => {
      const entry = createValidWikiEntry({
        value_proposition: "   ",
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.rule === "content_quality")).toBe(true);
    });

    test("fails when what_it_offers contains placeholder", () => {
      const entry = createValidWikiEntry({
        what_it_offers: ["Valid feature", "FIXME", "Another valid feature"],
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.field === "what_it_offers[1]")).toBe(true);
    });

    test("fails when problems_solved contains placeholder", () => {
      const entry = createValidWikiEntry({
        problems_solved: ["Valid problem", "n/a"],
      });

      const result = validateDraftGate(entry);

      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.field === "problems_solved[1]")).toBe(true);
    });
  });

  describe("Invalid input handling", () => {
    test("fails when input is null", () => {
      const result = validateDraftGate(null);

      expect(result.pass).toBe(false);
      expect(result.schemaValid).toBe(false);
      expect(result.densityMet).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("fails when input is undefined", () => {
      const result = validateDraftGate(undefined);

      expect(result.pass).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("fails when input is a string", () => {
      const result = validateDraftGate("not an object");

      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.rule === "type_check")).toBe(true);
    });

    test("fails when input is an array", () => {
      const result = validateDraftGate([1, 2, 3]);

      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.rule === "type_check")).toBe(true);
    });

    test("fails when input is a number", () => {
      const result = validateDraftGate(42);

      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.rule === "type_check")).toBe(true);
    });
  });

  describe("Configuration options", () => {
    test("skips schema validation when validateSchema is false", () => {
      const config: DraftConfig = {
        ...DEFAULT_DRAFT_CONFIG,
        validateSchema: false,
      };

      const entry = createValidWikiEntry({
        type: "invalid_type" as any,
      });

      const result = validateDraftGate(entry, config);

      // Should still fail because type guard in isWikiEntry catches it
      expect(result.pass).toBe(false);
    });

    test("skips density enforcement when enforceDensity is false", () => {
      const config: DraftConfig = {
        ...DEFAULT_DRAFT_CONFIG,
        enforceDensity: false,
      };

      const entry = createValidWikiEntry({
        what_it_offers: ["Only one item"],
        problems_solved: ["Only one problem"],
      });

      const result = validateDraftGate(entry, config);

      // Should pass because density is not enforced
      expect(result.densityMet).toBe(true);
      expect(result.fieldCounts.what_it_offers).toBe(1);
      expect(result.fieldCounts.problems_solved).toBe(1);
    });

    test("uses custom minimum thresholds", () => {
      const config: DraftConfig = {
        minWhatItOffers: 5,
        minProblemsSolved: 3,
        minSources: 2,
        validateSchema: true,
        enforceDensity: true,
      };

      const entry = createValidWikiEntry({
        what_it_offers: ["F1", "F2", "F3", "F4"],
        problems_solved: ["P1", "P2"],
        sources: [
          { url: "https://example1.com", kind: "primary", accessed_at: "2025-01-01" },
          { url: "https://example2.com", kind: "primary", accessed_at: "2025-01-01" },
        ],
      });

      const result = validateDraftGate(entry, config);

      expect(result.densityMet).toBe(false);
      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.field === "what_it_offers")).toBe(true);
      expect(result.errors.some((e) => e.field === "problems_solved")).toBe(true);
    });
  });

  describe("Gate result metadata", () => {
    test("includes timestamp in result", () => {
      const entry = createValidWikiEntry();
      const before = new Date().toISOString();

      const result = validateDraftGate(entry);

      const after = new Date().toISOString();
      expect(result.timestamp).toBeDefined();
      expect(result.timestamp >= before).toBe(true);
      expect(result.timestamp <= after).toBe(true);
    });

    test("includes duration in result", () => {
      const entry = createValidWikiEntry();

      const result = validateDraftGate(entry);

      expect(result.durationMs).toBeDefined();
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });

    test("includes field counts in result", () => {
      const entry = createValidWikiEntry({
        what_it_offers: ["A", "B", "C", "D"],
        problems_solved: ["X", "Y", "Z"],
        sources: [
          { url: "https://example1.com", kind: "primary", accessed_at: "2025-01-01" },
          { url: "https://example2.com", kind: "primary", accessed_at: "2025-01-01" },
        ],
      });

      const result = validateDraftGate(entry);

      expect(result.fieldCounts.what_it_offers).toBe(4);
      expect(result.fieldCounts.problems_solved).toBe(3);
      expect(result.fieldCounts.sources).toBe(2);
    });
  });

  describe("Entity type validation", () => {
    test("validates all valid entity types", () => {
      const validTypes: EntityType[] = [
        "plataforma",
        "ferramenta",
        "curso",
        "servico",
        "produto",
        "framework",
        "metodologia",
      ];

      for (const type of validTypes) {
        const entry = createValidWikiEntry({ type });
        const result = validateDraftGate(entry);
        expect(result.pass).toBe(true);
      }
    });
  });

  describe("Pricing validation", () => {
    test("validates valid pricing information", () => {
      const entry = createValidWikiEntry({
        pricing: {
          model: "subscription",
          starting_price: "$49/mo",
          has_free_tier: true,
        },
      });

      const result = validateDraftGate(entry);
      expect(result.pass).toBe(true);
    });

    test("validates all valid pricing models", () => {
      const validModels = [
        "subscription",
        "one-time",
        "freemium",
        "usage-based",
        "enterprise",
        "free",
      ];

      for (const model of validModels) {
        const entry = createValidWikiEntry({
          pricing: { model: model as any },
        });
        const result = validateDraftGate(entry);
        expect(result.pass).toBe(true);
      }
    });

    test("fails when pricing model is invalid", () => {
      const entry = createValidWikiEntry({
        pricing: {
          model: "invalid-model" as any,
        },
      });

      const result = validateDraftGate(entry);
      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.rule === "enum")).toBe(true);
    });
  });

  describe("Source kind validation", () => {
    test("validates all valid source kinds", () => {
      const validKinds = [
        "primary",
        "official",
        "news",
        "blog",
        "review",
        "social",
        "academic",
        "documentation",
      ];

      for (const kind of validKinds) {
        const entry = createValidWikiEntry({
          sources: [
            {
              url: "https://example.com",
              kind: kind as any,
              accessed_at: "2025-01-01",
            },
          ],
        });
        const result = validateDraftGate(entry);
        expect(result.pass).toBe(true);
      }
    });

    test("fails when source kind is invalid", () => {
      const entry = createValidWikiEntry({
        sources: [
          {
            url: "https://example.com",
            kind: "invalid-kind" as any,
            accessed_at: "2025-01-01",
          },
        ],
      });

      const result = validateDraftGate(entry);
      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.rule === "enum")).toBe(true);
    });
  });

  describe("Pipeline metadata validation", () => {
    test("validates valid pipeline metadata", () => {
      const entry = createValidWikiEntry({
        pipeline_metadata: {
          pipeline_version: "1.0.0",
          spec_version: "llm-wiki/1.0.0",
          generated_at: "2025-01-15T10:00:00Z",
          duration_ms: 1500,
          quality_score: 85,
        },
      });

      const result = validateDraftGate(entry);
      expect(result.pass).toBe(true);
    });

    test("fails when quality_score exceeds maximum", () => {
      const entry = createValidWikiEntry({
        pipeline_metadata: {
          pipeline_version: "1.0.0",
          spec_version: "llm-wiki/1.0.0",
          generated_at: "2025-01-15T10:00:00Z",
          quality_score: 150, // Invalid: exceeds 100
        },
      });

      const result = validateDraftGate(entry);
      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.rule === "maximum")).toBe(true);
    });

    test("fails when quality_score is negative", () => {
      const entry = createValidWikiEntry({
        pipeline_metadata: {
          pipeline_version: "1.0.0",
          spec_version: "llm-wiki/1.0.0",
          generated_at: "2025-01-15T10:00:00Z",
          quality_score: -10, // Invalid: negative
        },
      });

      const result = validateDraftGate(entry);
      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.rule === "minimum")).toBe(true);
    });
  });
});
