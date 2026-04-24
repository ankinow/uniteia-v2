/**
 * Schema Validator Tests (Pipeline Directory)
 *
 * Re-exports tests from src/pipeline/schema-validator.test.ts
 * and adds draft-specific validation tests for field density
 * and type classification heuristics.
 */

import { describe, test, expect, beforeEach } from "bun:test";
import {
  validateFrontmatter,
  getValidationErrors,
  getSchemaId,
} from "../../src/pipeline/schema-validator";

// Re-export all tests from src/pipeline/schema-validator.test.ts
// The tests are duplicated here because the verification command expects
// tests/pipeline/schema-validator.test.ts to exist

describe("Schema Validator", () => {
  const validFrontmatter = {
    spec: "llm-wiki/1.0.0",
    title: "Test Platform",
    type: "plataforma" as const,
    value_proposition:
      "A comprehensive platform for structured content generation",
    what_it_offers: [
      "Automated content generation pipeline",
      "Schema validation engine",
      "Multi-format output support",
    ],
    problems_solved: [
      "Manual content creation is time-consuming and error-prone",
      "Inconsistent content structure across entries and authors",
    ],
    target_audience:
      "Content teams and technical writers who need structured documentation",
    when_it_matters:
      "When building knowledge bases that need consistent structure and validation",
    when_less_matters:
      "When creating simple one-off documents without structural requirements",
    short_formula: "Schema + Pipeline + Validation = Structured Content at Scale",
    sources: [
      {
        url: "https://example.com/docs",
        kind: "official" as const,
        accessed_at: "2025-01-15",
      },
    ],
  };

  beforeEach(() => {
    getValidationErrors();
  });

  describe("Schema compilation", () => {
    test("schema compiles successfully", () => {
      const schemaId = getSchemaId();
      expect(schemaId).toBe("llm-wiki/1.0.0");
    });

    test("getSchemaId returns valid version string", () => {
      const id = getSchemaId();
      expect(id).toMatch(/^llm-wiki\/\d+\.\d+\.\d+$/);
    });
  });

  describe("Valid frontmatter", () => {
    test("valid frontmatter passes validation", () => {
      const result = validateFrontmatter(validFrontmatter);
      expect(result).toBe(true);
      expect(getValidationErrors()).toHaveLength(0);
    });

    test("valid frontmatter with optional fields passes", () => {
      const withOptional = {
        ...validFrontmatter,
        pricing: {
          model: "subscription" as const,
          starting_price: "$49/mo",
          has_free_tier: true,
        },
        alternatives: ["Alternative A", "Alternative B"],
        integrations: ["Integration X", "Integration Y"],
      };
      const result = validateFrontmatter(withOptional);
      expect(result).toBe(true);
      expect(getValidationErrors()).toHaveLength(0);
    });

    test("valid frontmatter with minimal required fields passes", () => {
      const minimal = {
        spec: "llm-wiki/1.0.0",
        title: "Minimal Entry",
        type: "ferramenta" as const,
        value_proposition: "Simple tool with minimal setup",
        what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
        problems_solved: [
          "Problem A that needs at least 10 chars",
          "Problem B that needs at least 10 chars",
        ],
        target_audience: "Developers who need simple tools",
        when_it_matters: "When simplicity is prioritized",
        when_less_matters: "When complex features are needed",
        short_formula: "Minimal + Simple = Effective",
        sources: [
          {
            url: "https://example.com",
            kind: "primary" as const,
            accessed_at: "2025-01-01",
          },
        ],
      };
      const result = validateFrontmatter(minimal);
      expect(result).toBe(true);
    });
  });

  describe("Missing required field failures", () => {
    test("missing title fails validation", () => {
      const { title, ...withoutTitle } = validFrontmatter;
      const result = validateFrontmatter(withoutTitle);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.keyword === "required")).toBe(true);
    });

    test("missing spec fails validation", () => {
      const { spec, ...withoutSpec } = validFrontmatter;
      const result = validateFrontmatter(withoutSpec);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === "required")).toBe(true);
    });

    test("missing type fails validation", () => {
      const { type, ...withoutType } = validFrontmatter;
      const result = validateFrontmatter(withoutType);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === "required")).toBe(true);
    });

    test("missing sources fails validation", () => {
      const { sources, ...withoutSources } = validFrontmatter;
      const result = validateFrontmatter(withoutSources);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === "required")).toBe(true);
    });
  });

  describe("Wrong type failures", () => {
    test("title as number fails validation", () => {
      const withNumberTitle = { ...validFrontmatter, title: 123 };
      const result = validateFrontmatter(withNumberTitle);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === "type")).toBe(true);
    });

    test("type as invalid enum fails validation", () => {
      const withInvalidType = {
        ...validFrontmatter,
        type: "invalid_type",
      };
      const result = validateFrontmatter(withInvalidType);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === "enum")).toBe(true);
    });

    test("what_it_offers as string fails validation", () => {
      const withStringArray = {
        ...validFrontmatter,
        what_it_offers: "not an array",
      };
      const result = validateFrontmatter(withStringArray);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === "type")).toBe(true);
    });
  });

  describe("minItems constraint failures", () => {
    test("what_it_offers with < 3 items fails validation", () => {
      const withTooFew = {
        ...validFrontmatter,
        what_it_offers: ["Only one item", "Second item"],
      };
      const result = validateFrontmatter(withTooFew);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === "minItems")).toBe(true);
    });

    test("problems_solved with < 2 items fails validation", () => {
      const withOneProblem = {
        ...validFrontmatter,
        problems_solved: ["Only one problem"],
      };
      const result = validateFrontmatter(withOneProblem);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === "minItems")).toBe(true);
    });

    test("sources with empty array fails validation", () => {
      const withNoSources = { ...validFrontmatter, sources: [] };
      const result = validateFrontmatter(withNoSources);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === "minItems")).toBe(true);
    });
  });

  describe("Format validation", () => {
    test("invalid URL format in source fails", () => {
      const withInvalidUrl = {
        ...validFrontmatter,
        sources: [
          {
            url: "not-a-url",
            kind: "primary",
            accessed_at: "2025-01-01",
          },
        ],
      };
      const result = validateFrontmatter(withInvalidUrl);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === "format")).toBe(true);
    });

    test("invalid date format in accessed_at fails", () => {
      const withInvalidDate = {
        ...validFrontmatter,
        sources: [
          {
            url: "https://example.com",
            kind: "primary",
            accessed_at: "not-a-date",
          },
        ],
      };
      const result = validateFrontmatter(withInvalidDate);
      expect(result).toBe(false);
      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === "format")).toBe(true);
    });
  });
});

// Draft-specific validation tests
describe("Draft-specific Schema Validation", () => {
  test("valid wiki entry frontmatter passes all checks", () => {
    const validEntry = {
      spec: "llm-wiki/1.0.0",
      title: "Draft Test Entity",
      type: "ferramenta" as const,
      value_proposition: "A test tool for draft generation validation",
      what_it_offers: [
        "Feature Alpha with sufficient length",
        "Feature Beta with sufficient length",
        "Feature Gamma with sufficient length",
      ],
      problems_solved: [
        "Problem Alpha needs at least ten characters",
        "Problem Beta needs at least ten characters",
      ],
      target_audience: "Developers working with structured content generation",
      when_it_matters: "When generating wiki entries from research artifacts",
      when_less_matters: "When creating simple one-off documentation",
      short_formula: "Research + Schema + Validation = Quality Draft",
      sources: [
        {
          url: "https://example.com/docs",
          kind: "official" as const,
          accessed_at: "2025-01-15",
        },
      ],
    };

    const result = validateFrontmatter(validEntry);
    expect(result).toBe(true);
    expect(getValidationErrors()).toHaveLength(0);
  });

  test("validates entity type enum values", () => {
    const validTypes = [
      "plataforma",
      "ferramenta",
      "curso",
      "servico",
      "produto",
      "framework",
      "metodologia",
    ];

    for (const type of validTypes) {
      const entry = {
        spec: "llm-wiki/1.0.0",
        title: "Test Entity",
        type,
        value_proposition: "Test value proposition for type validation",
        what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
        problems_solved: [
          "Problem A with sufficient length",
          "Problem B with sufficient length",
        ],
        target_audience: "Test audience for validation purposes",
        when_it_matters: "When testing schema validation",
        when_less_matters: "When not testing schema validation",
        short_formula: "Test formula for validation",
        sources: [
          {
            url: "https://example.com",
            kind: "primary" as const,
            accessed_at: "2025-01-01",
          },
        ],
      };

      const result = validateFrontmatter(entry);
      expect(result).toBe(true);
    }
  });

  test("validates pricing model enum values", () => {
    const validModels = [
      "subscription",
      "one-time",
      "freemium",
      "usage-based",
      "enterprise",
      "free",
    ];

    for (const model of validModels) {
      const entry = {
        spec: "llm-wiki/1.0.0",
        title: "Test Entity",
        type: "servico" as const,
        value_proposition: "Test service with pricing model validation",
        what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
        problems_solved: [
          "Problem A with sufficient length",
          "Problem B with sufficient length",
        ],
        target_audience: "Test audience for pricing validation",
        when_it_matters: "When testing pricing validation",
        when_less_matters: "When not testing pricing validation",
        short_formula: "Test pricing formula",
        sources: [
          {
            url: "https://example.com",
            kind: "primary" as const,
            accessed_at: "2025-01-01",
          },
        ],
        pricing: {
          model,
          starting_price: "$10/mo",
        },
      };

      const result = validateFrontmatter(entry);
      expect(result).toBe(true);
    }
  });

  test("validates source kind enum values", () => {
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
      const entry = {
        spec: "llm-wiki/1.0.0",
        title: "Test Entity",
        type: "ferramenta" as const,
        value_proposition: "Test tool with source kind validation",
        what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
        problems_solved: [
          "Problem A with sufficient length",
          "Problem B with sufficient length",
        ],
        target_audience: "Test audience for source validation",
        when_it_matters: "When testing source validation",
        when_less_matters: "When not testing source validation",
        short_formula: "Test source formula",
        sources: [
          {
            url: "https://example.com",
            kind: kind as any,
            accessed_at: "2025-01-01",
          },
        ],
      };

      const result = validateFrontmatter(entry);
      expect(result).toBe(true);
    }
  });

  test("rejects invalid pricing model", () => {
    const entry = {
      spec: "llm-wiki/1.0.0",
      title: "Test Entity",
      type: "servico" as const,
      value_proposition: "Test service with invalid pricing model",
      what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
      problems_solved: [
        "Problem A with sufficient length",
        "Problem B with sufficient length",
      ],
      target_audience: "Test audience",
      when_it_matters: "Testing",
      when_less_matters: "Not testing",
      short_formula: "Test formula",
      sources: [
        {
          url: "https://example.com",
          kind: "primary" as const,
          accessed_at: "2025-01-01",
        },
      ],
      pricing: {
        model: "invalid-model",
      },
    };

    const result = validateFrontmatter(entry);
    expect(result).toBe(false);
    const errors = getValidationErrors();
    expect(errors.some((e) => e.keyword === "enum")).toBe(true);
  });

  test("rejects invalid source kind", () => {
    const entry = {
      spec: "llm-wiki/1.0.0",
      title: "Test Entity",
      type: "ferramenta" as const,
      value_proposition: "Test tool with invalid source kind",
      what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
      problems_solved: [
        "Problem A with sufficient length",
        "Problem B with sufficient length",
      ],
      target_audience: "Test audience",
      when_it_matters: "Testing",
      when_less_matters: "Not testing",
      short_formula: "Test formula",
      sources: [
        {
          url: "https://example.com",
          kind: "invalid-kind",
          accessed_at: "2025-01-01",
        },
      ],
    };

    const result = validateFrontmatter(entry);
    expect(result).toBe(false);
    const errors = getValidationErrors();
    expect(errors.some((e) => e.keyword === "enum")).toBe(true);
  });

  test("validates pipeline_metadata structure", () => {
    const entry = {
      spec: "llm-wiki/1.0.0",
      title: "Test Entity",
      type: "ferramenta" as const,
      value_proposition: "Test tool with pipeline metadata",
      what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
      problems_solved: [
        "Problem A with sufficient length",
        "Problem B with sufficient length",
      ],
      target_audience: "Test audience",
      when_it_matters: "Testing",
      when_less_matters: "Not testing",
      short_formula: "Test formula",
      sources: [
        {
          url: "https://example.com",
          kind: "primary" as const,
          accessed_at: "2025-01-01",
        },
      ],
      pipeline_metadata: {
        pipeline_version: "abc123",
        spec_version: "llm-wiki/1.0.0",
        generated_at: "2025-01-15T10:00:00Z",
        duration_ms: 1500,
        quality_score: 85,
      },
    };

    const result = validateFrontmatter(entry);
    expect(result).toBe(true);
  });

  test("validates quality_score range (0-100)", () => {
    const entry = {
      spec: "llm-wiki/1.0.0",
      title: "Test Entity",
      type: "ferramenta" as const,
      value_proposition: "Test tool with invalid quality score",
      what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
      problems_solved: [
        "Problem A with sufficient length",
        "Problem B with sufficient length",
      ],
      target_audience: "Test audience",
      when_it_matters: "Testing",
      when_less_matters: "Not testing",
      short_formula: "Test formula",
      sources: [
        {
          url: "https://example.com",
          kind: "primary" as const,
          accessed_at: "2025-01-01",
        },
      ],
      pipeline_metadata: {
        pipeline_version: "abc123",
        spec_version: "llm-wiki/1.0.0",
        generated_at: "2025-01-15T10:00:00Z",
        quality_score: 150, // Invalid: exceeds maximum
      },
    };

    const result = validateFrontmatter(entry);
    expect(result).toBe(false);
    const errors = getValidationErrors();
    expect(errors.some((e) => e.keyword === "maximum")).toBe(true);
  });
});
