/**
 * Draft Types Tests
 *
 * Test suite for draft generation types, type guards,
 * field density validation, and type classification heuristics.
 */

import { describe, test, expect } from "bun:test";
import {
  isEntityType,
  isPricingModel,
  isWikiEntry,
  isDraftConfig,
  isDraftOutput,
  classifyEntityType,
  checkFieldDensity,
  DEFAULT_DRAFT_CONFIG,
  DEFAULT_TYPE_HEURISTICS,
  type WikiEntry,
  type DraftConfig,
  type EntityType,
  type FieldCounts,
} from "../../src/types/draft";
import type { ResearchBrief, Source } from "../../src/types/evidence";

describe("isEntityType", () => {
  test("returns true for valid entity types", () => {
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
      expect(isEntityType(type)).toBe(true);
    }
  });

  test("returns false for invalid entity types", () => {
    expect(isEntityType("invalid")).toBe(false);
    expect(isEntityType("")).toBe(false);
    expect(isEntityType(null)).toBe(false);
    expect(isEntityType(undefined)).toBe(false);
    expect(isEntityType(123)).toBe(false);
  });
});

describe("isPricingModel", () => {
  test("returns true for valid pricing models", () => {
    const validModels = [
      "subscription",
      "one-time",
      "freemium",
      "usage-based",
      "enterprise",
      "free",
    ];
    for (const model of validModels) {
      expect(isPricingModel(model)).toBe(true);
    }
  });

  test("returns false for invalid pricing models", () => {
    expect(isPricingModel("invalid")).toBe(false);
    expect(isPricingModel("")).toBe(false);
    expect(isPricingModel(null)).toBe(false);
    expect(isPricingModel(undefined)).toBe(false);
  });
});

describe("isWikiEntry", () => {
  test("returns true for valid WikiEntry", () => {
    const validEntry: WikiEntry = {
      spec: "llm-wiki/1.0.0",
      title: "Test Entity",
      type: "ferramenta",
      value_proposition: "A test tool for testing purposes",
      what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
      problems_solved: ["Problem 1", "Problem 2"],
      target_audience: "Developers and testers",
      when_it_matters: "When testing systems",
      when_less_matters: "When not testing",
      short_formula: "Test = Verify + Assert",
      sources: [
        {
          url: "https://example.com",
          kind: "official",
          accessed_at: "2024-01-15",
        },
      ],
    };
    expect(isWikiEntry(validEntry)).toBe(true);
  });

  test("returns true for WikiEntry with optional fields", () => {
    const entryWithOptional: WikiEntry = {
      spec: "llm-wiki/1.0.0",
      title: "Test Platform",
      type: "plataforma",
      value_proposition: "A comprehensive platform",
      what_it_offers: ["Feature A", "Feature B", "Feature C"],
      problems_solved: ["Problem A", "Problem B"],
      target_audience: "Enterprise users",
      when_it_matters: "Enterprise scenarios",
      when_less_matters: "Small teams",
      short_formula: "Platform = Tools + Integration",
      sources: [
        {
          url: "https://example.com",
          kind: "official",
          accessed_at: "2024-01-15",
        },
      ],
      pricing: {
        model: "subscription",
        starting_price: "$49/mo",
        has_free_tier: true,
      },
      alternatives: ["Alternative A", "Alternative B"],
      integrations: ["Integration 1", "Integration 2"],
      _body: "Additional markdown content",
    };
    expect(isWikiEntry(entryWithOptional)).toBe(true);
  });

  test("returns false for invalid WikiEntry objects", () => {
    expect(isWikiEntry(null)).toBe(false);
    expect(isWikiEntry(undefined)).toBe(false);
    expect(isWikiEntry({})).toBe(false);
    expect(isWikiEntry({ spec: "llm-wiki/1.0.0" })).toBe(false);
    expect(
      isWikiEntry({
        spec: "llm-wiki/1.0.0",
        title: "Test",
        type: "invalid_type",
      })
    ).toBe(false);
    expect(
      isWikiEntry({
        spec: "llm-wiki/1.0.0",
        title: "Test",
        type: "ferramenta",
        what_it_offers: "not-an-array",
      })
    ).toBe(false);
  });

  test("requires at least one source", () => {
    const entryNoSources = {
      spec: "llm-wiki/1.0.0",
      title: "Test",
      type: "ferramenta",
      value_proposition: "Test value",
      what_it_offers: ["A", "B", "C"],
      problems_solved: ["P1", "P2"],
      target_audience: "Testers",
      when_it_matters: "Testing",
      when_less_matters: "Not testing",
      short_formula: "Test",
      sources: [],
    };
    expect(isWikiEntry(entryNoSources)).toBe(false);
  });
});

describe("isDraftConfig", () => {
  test("returns true for valid DraftConfig", () => {
    expect(isDraftConfig(DEFAULT_DRAFT_CONFIG)).toBe(true);
  });

  test("returns true for custom DraftConfig", () => {
    const customConfig: DraftConfig = {
      minWhatItOffers: 5,
      minProblemsSolved: 3,
      minSources: 2,
      validateSchema: false,
      enforceDensity: true,
    };
    expect(isDraftConfig(customConfig)).toBe(true);
  });

  test("returns false for invalid DraftConfig objects", () => {
    expect(isDraftConfig(null)).toBe(false);
    expect(isDraftConfig(undefined)).toBe(false);
    expect(isDraftConfig({})).toBe(false);
    expect(isDraftConfig({ minWhatItOffers: "3" })).toBe(false);
  });
});

describe("isDraftOutput", () => {
  test("returns true for valid DraftOutput", () => {
    const validEntry: WikiEntry = {
      spec: "llm-wiki/1.0.0",
      title: "Test",
      type: "ferramenta",
      value_proposition: "Test value",
      what_it_offers: ["A", "B", "C"],
      problems_solved: ["P1", "P2"],
      target_audience: "Testers",
      when_it_matters: "Testing",
      when_less_matters: "Not testing",
      short_formula: "Test",
      sources: [
        {
          url: "https://example.com",
          kind: "official",
          accessed_at: "2024-01-15",
        },
      ],
    };

    const validOutput = {
      entry: validEntry,
      draftFile: "/test/draft_v1.md",
      artifactDir: "/test/artifacts",
      validation: {
        passed: true,
        schemaValid: true,
        densityMet: true,
        errors: [],
        warnings: [],
      },
      fieldCounts: {
        what_it_offers: 3,
        problems_solved: 2,
        sources: 1,
      },
    };
    expect(isDraftOutput(validOutput)).toBe(true);
  });

  test("returns false for invalid DraftOutput objects", () => {
    expect(isDraftOutput(null)).toBe(false);
    expect(isDraftOutput(undefined)).toBe(false);
    expect(isDraftOutput({})).toBe(false);
    expect(isDraftOutput({ entry: "not-an-entry" })).toBe(false);
  });
});

describe("classifyEntityType", () => {
  const createMockBrief = (content: string): ResearchBrief => ({
    entity: "TestEntity",
    generated_at: "2024-01-15T10:00:00Z",
    source_count: 1,
    successful_extractions: 1,
    confidence_score: 0.8,
    sources: [],
    extracts: [
      {
        source_id: "test",
        content,
        relevance_score: 0.9,
        status: "success",
        extracted_at: "2024-01-15T10:00:00Z",
      },
    ],
    key_findings: [],
  });

  test("classifies plataforma from keywords", () => {
    const brief = createMockBrief("This is a platform for building applications");
    const type = classifyEntityType("TestPlatform", brief);
    expect(type).toBe("plataforma");
  });

  test("classifies ferramenta from keywords", () => {
    const brief = createMockBrief("A CLI tool for developers");
    const type = classifyEntityType("TestTool", brief);
    expect(type).toBe("ferramenta");
  });

  test("classifies curso from keywords", () => {
    const brief = createMockBrief("Online course for learning programming");
    const type = classifyEntityType("TestCourse", brief);
    expect(type).toBe("curso");
  });

  test("classifies servico from keywords", () => {
    const brief = createMockBrief("Cloud API service for developers");
    const type = classifyEntityType("TestService", brief);
    expect(type).toBe("servico");
  });

  test("classifies produto from keywords", () => {
    const brief = createMockBrief("A software product for teams");
    const type = classifyEntityType("TestProduct", brief);
    expect(type).toBe("produto");
  });

  test("classifies framework from keywords", () => {
    const brief = createMockBrief("A JavaScript framework for building UIs");
    const type = classifyEntityType("TestFramework", brief);
    expect(type).toBe("framework");
  });

  test("classifies metodologia from keywords", () => {
    const brief = createMockBrief("A methodology for agile development");
    const type = classifyEntityType("TestMethodology", brief);
    expect(type).toBe("metodologia");
  });

  test("defaults to produto when no match", () => {
    const brief = createMockBrief("Some generic content without keywords");
    const type = classifyEntityType("TestEntity", brief);
    expect(type).toBe("produto");
  });

  test("uses custom heuristics when provided", () => {
    const brief = createMockBrief("Custom keyword test");
    const customHeuristics = [
      {
        type: "plataforma" as EntityType,
        keywords: ["custom"],
        patterns: [/custom/i],
      },
    ];
    const type = classifyEntityType("Test", brief, customHeuristics);
    expect(type).toBe("plataforma");
  });

  test("weights pattern matches higher than keywords", () => {
    const brief = createMockBrief("This is a platform platform platform");
    const type = classifyEntityType("Test", brief);
    expect(type).toBe("plataforma");
  });

  test("considers key_findings in classification", () => {
    const brief: ResearchBrief = {
      entity: "TestEntity",
      generated_at: "2024-01-15T10:00:00Z",
      source_count: 1,
      successful_extractions: 1,
      confidence_score: 0.8,
      sources: [],
      extracts: [],
      key_findings: ["This is a training course for developers"],
    };
    const type = classifyEntityType("TestEntity", brief);
    expect(type).toBe("curso");
  });

  test("considers entity name in classification", () => {
    const brief = createMockBrief("Some generic content");
    const type = classifyEntityType("Platform Pro", brief);
    expect(type).toBe("plataforma");
  });
});

describe("checkFieldDensity", () => {
  const createValidEntry = (
    whatItOffers: number = 3,
    problemsSolved: number = 2,
    sources: number = 1
  ): WikiEntry => ({
    spec: "llm-wiki/1.0.0",
    title: "Test Entity",
    type: "ferramenta",
    value_proposition: "Test value proposition",
    what_it_offers: Array(whatItOffers)
      .fill(null)
      .map((_, i) => `Feature ${i + 1}`),
    problems_solved: Array(problemsSolved)
      .fill(null)
      .map((_, i) => `Problem ${i + 1}`),
    target_audience: "Test audience",
    when_it_matters: "Test context",
    when_less_matters: "Test opposite context",
    short_formula: "Test formula",
    sources: Array(sources)
      .fill(null)
      .map(
        (_, i): Source => ({
          url: `https://example.com/${i}`,
          kind: "official",
          accessed_at: "2024-01-15",
        })
      ),
  });

  test("passes with minimum requirements", () => {
    const entry = createValidEntry(3, 2, 1);
    const result = checkFieldDensity(entry, DEFAULT_DRAFT_CONFIG);
    expect(result.met).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.counts.what_it_offers).toBe(3);
    expect(result.counts.problems_solved).toBe(2);
    expect(result.counts.sources).toBe(1);
  });

  test("passes with more than minimum", () => {
    const entry = createValidEntry(5, 3, 2);
    const result = checkFieldDensity(entry, DEFAULT_DRAFT_CONFIG);
    expect(result.met).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("fails when what_it_offers is below minimum", () => {
    const entry = createValidEntry(2, 2, 1);
    const result = checkFieldDensity(entry, DEFAULT_DRAFT_CONFIG);
    expect(result.met).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe("what_it_offers");
    expect(result.errors[0].rule).toBe("min_items");
  });

  test("fails when problems_solved is below minimum", () => {
    const entry = createValidEntry(3, 1, 1);
    const result = checkFieldDensity(entry, DEFAULT_DRAFT_CONFIG);
    expect(result.met).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe("problems_solved");
  });

  test("fails when sources is below minimum", () => {
    const entry = createValidEntry(3, 2, 0);
    const result = checkFieldDensity(entry, DEFAULT_DRAFT_CONFIG);
    expect(result.met).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe("sources");
  });

  test("fails with multiple violations", () => {
    const entry = createValidEntry(1, 1, 0);
    const result = checkFieldDensity(entry, DEFAULT_DRAFT_CONFIG);
    expect(result.met).toBe(false);
    expect(result.errors).toHaveLength(3);
  });

  test("respects custom config thresholds", () => {
    const customConfig: DraftConfig = {
      minWhatItOffers: 5,
      minProblemsSolved: 3,
      minSources: 2,
      validateSchema: true,
      enforceDensity: true,
    };
    const entry = createValidEntry(4, 3, 2);
    const result = checkFieldDensity(entry, customConfig);
    expect(result.met).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe("what_it_offers");
  });

  test("includes value in error for debugging", () => {
    const entry = createValidEntry(2, 2, 1);
    const result = checkFieldDensity(entry, DEFAULT_DRAFT_CONFIG);
    expect(result.errors[0].value).toBe(2);
  });
});

describe("DEFAULT_DRAFT_CONFIG", () => {
  test("has correct default values", () => {
    expect(DEFAULT_DRAFT_CONFIG.minWhatItOffers).toBe(3);
    expect(DEFAULT_DRAFT_CONFIG.minProblemsSolved).toBe(2);
    expect(DEFAULT_DRAFT_CONFIG.minSources).toBe(1);
    expect(DEFAULT_DRAFT_CONFIG.validateSchema).toBe(true);
    expect(DEFAULT_DRAFT_CONFIG.enforceDensity).toBe(true);
  });

  test("has default type heuristics", () => {
    expect(DEFAULT_DRAFT_CONFIG.typeHeuristics).toBeDefined();
    expect(DEFAULT_DRAFT_CONFIG.typeHeuristics!.length).toBeGreaterThan(0);
  });
});

describe("DEFAULT_TYPE_HEURISTICS", () => {
  test("covers all entity types", () => {
    const types = DEFAULT_TYPE_HEURISTICS.map((h) => h.type);
    const allTypes: EntityType[] = [
      "plataforma",
      "ferramenta",
      "curso",
      "servico",
      "produto",
      "framework",
      "metodologia",
    ];
    for (const type of allTypes) {
      expect(types).toContain(type);
    }
  });

  test("each heuristic has keywords", () => {
    for (const heuristic of DEFAULT_TYPE_HEURISTICS) {
      expect(heuristic.keywords.length).toBeGreaterThan(0);
    }
  });

  test("some heuristics have patterns", () => {
    const withPatterns = DEFAULT_TYPE_HEURISTICS.filter(
      (h) => h.patterns && h.patterns.length > 0
    );
    expect(withPatterns.length).toBeGreaterThan(0);
  });
});
