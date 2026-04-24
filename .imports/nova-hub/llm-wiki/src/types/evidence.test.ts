import { describe, test, expect } from "bun:test";
import {
  isSourceKind,
  isSource,
  isExtractionStatus,
  isExtract,
  isResearchBrief,
  type Source,
  type Extract,
  type ResearchBrief,
} from "./evidence";

describe("isSourceKind", () => {
  test("returns true for valid source kinds", () => {
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
      expect(isSourceKind(kind)).toBe(true);
    }
  });

  test("returns false for invalid source kinds", () => {
    expect(isSourceKind("invalid")).toBe(false);
    expect(isSourceKind("")).toBe(false);
    expect(isSourceKind(null)).toBe(false);
    expect(isSourceKind(undefined)).toBe(false);
    expect(isSourceKind(123)).toBe(false);
  });
});

describe("isSource", () => {
  test("returns true for valid Source object", () => {
    const validSource: Source = {
      url: "https://example.com",
      kind: "official",
      accessed_at: "2024-01-15",
    };

    expect(isSource(validSource)).toBe(true);
  });

  test("returns true for Source with optional fields", () => {
    const sourceWithOptional: Source = {
      url: "https://example.com",
      kind: "blog",
      accessed_at: "2024-01-15",
      excerpt_id: "ex_001",
      title: "Example Title",
    };

    expect(isSource(sourceWithOptional)).toBe(true);
  });

  test("returns false for invalid Source objects", () => {
    expect(isSource(null)).toBe(false);
    expect(isSource(undefined)).toBe(false);
    expect(isSource({})).toBe(false);
    expect(isSource({ url: "https://example.com" })).toBe(false);
    expect(
      isSource({
        url: "https://example.com",
        kind: "invalid",
        accessed_at: "2024-01-15",
      }),
    ).toBe(false);
    expect(
      isSource({
        url: 123,
        kind: "official",
        accessed_at: "2024-01-15",
      }),
    ).toBe(false);
  });
});

describe("isExtractionStatus", () => {
  test("returns true for valid extraction statuses", () => {
    const validStatuses = ["pending", "success", "failed", "skipped"];

    for (const status of validStatuses) {
      expect(isExtractionStatus(status)).toBe(true);
    }
  });

  test("returns false for invalid extraction statuses", () => {
    expect(isExtractionStatus("invalid")).toBe(false);
    expect(isExtractionStatus("")).toBe(false);
    expect(isExtractionStatus(null)).toBe(false);
    expect(isExtractionStatus(undefined)).toBe(false);
  });
});

describe("isExtract", () => {
  test("returns true for valid Extract object", () => {
    const validExtract: Extract = {
      source_id: "https://example.com",
      content: "Extracted content here",
      relevance_score: 0.85,
      status: "success",
      extracted_at: "2024-01-15T10:30:00Z",
    };

    expect(isExtract(validExtract)).toBe(true);
  });

  test("returns true for Extract with optional fields", () => {
    const extractWithOptional: Extract = {
      source_id: "https://example.com",
      content: "Extracted content",
      relevance_score: 0.9,
      status: "success",
      extracted_at: "2024-01-15T10:30:00Z",
      title: "Page Title",
      key_facts: ["fact1", "fact2"],
      metadata: { author: "John Doe" },
    };

    expect(isExtract(extractWithOptional)).toBe(true);
  });

  test("returns false for invalid Extract objects", () => {
    expect(isExtract(null)).toBe(false);
    expect(isExtract(undefined)).toBe(false);
    expect(isExtract({})).toBe(false);
    expect(
      isExtract({
        source_id: "https://example.com",
        content: "test",
        status: "success",
        extracted_at: "2024-01-15",
      }),
    ).toBe(false); // missing relevance_score
  });
});

describe("isResearchBrief", () => {
  test("returns true for valid ResearchBrief object", () => {
    const validBrief: ResearchBrief = {
      entity: "Test Entity",
      generated_at: "2024-01-15T10:30:00Z",
      source_count: 5,
      successful_extractions: 4,
      confidence_score: 0.8,
      sources: [],
      extracts: [],
      key_findings: ["finding1", "finding2"],
    };

    expect(isResearchBrief(validBrief)).toBe(true);
  });

  test("returns true for ResearchBrief with optional fields", () => {
    const briefWithOptional: ResearchBrief = {
      entity: "Test Entity",
      generated_at: "2024-01-15T10:30:00Z",
      source_count: 5,
      successful_extractions: 4,
      confidence_score: 0.8,
      sources: [
        {
          url: "https://example.com",
          kind: "official",
          accessed_at: "2024-01-15",
        },
      ],
      extracts: [
        {
          source_id: "https://example.com",
          content: "content",
          relevance_score: 0.9,
          status: "success",
          extracted_at: "2024-01-15T10:30:00Z",
        },
      ],
      key_findings: ["finding1"],
      synthesis: "Test synthesis",
      gaps: ["gap1"],
      next_steps: ["step1"],
    };

    expect(isResearchBrief(briefWithOptional)).toBe(true);
  });

  test("returns false for invalid ResearchBrief objects", () => {
    expect(isResearchBrief(null)).toBe(false);
    expect(isResearchBrief(undefined)).toBe(false);
    expect(isResearchBrief({})).toBe(false);
    expect(
      isResearchBrief({
        entity: "Test",
        generated_at: "2024-01-15",
        // missing required fields
      }),
    ).toBe(false);
  });
});
