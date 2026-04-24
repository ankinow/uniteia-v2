/**
 * Tests for Editing Types
 *
 * Unit tests for Stage 3 (Editing) type definitions including
 * EditedEntry, EditingConfig, EditingValidationResult, and type guards.
 */

import { describe, it, expect } from "bun:test";
import {
  type EditedEntry,
  type EditingMetadata,
  type EditingConfig,
  type EditingValidationResult,
  DEFAULT_EDITING_CONFIG,
  isEditingMetadata,
  isEditedEntry,
  isEditingConfig,
  isEditingValidationResult,
} from "../../src/types/editing";
import type { WikiEntry, ValidationError } from "../../src/types/draft";
import type { Source } from "../../src/types/evidence";

// Helper: Create valid Source for testing
function createTestSource(): Source {
  return {
    url: "https://example.com",
    kind: "official",
    accessed_at: "2024-01-01T00:00:00Z",
    title: "Test Source",
  };
}

// Helper: Create valid WikiEntry for testing
function createTestWikiEntry(): WikiEntry {
  return {
    spec: "llm-wiki/1.0.0",
    title: "Test Entity",
    type: "ferramenta",
    value_proposition: "A test tool for testing",
    what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
    problems_solved: ["Problem 1", "Problem 2"],
    target_audience: "Testers",
    when_it_matters: "When testing",
    when_less_matters: "When not testing",
    short_formula: "Test = Success",
    sources: [createTestSource()],
  };
}

// Helper: Create valid EditingMetadata for testing
function createTestEditingMetadata(): EditingMetadata {
  return {
    edited_at: "2024-01-01T12:00:00Z",
    original_word_count: 100,
    edited_word_count: 85,
    edits_applied: ["Removed redundancy", "Improved clarity"],
  };
}

// Helper: Create valid EditedEntry for testing
function createTestEditedEntry(): EditedEntry {
  return {
    ...createTestWikiEntry(),
    editing_metadata: createTestEditingMetadata(),
  };
}

describe("EditingMetadata", () => {
  describe("isEditingMetadata", () => {
    it("should return true for valid EditingMetadata", () => {
      const metadata = createTestEditingMetadata();
      expect(isEditingMetadata(metadata)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isEditingMetadata(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isEditingMetadata(undefined)).toBe(false);
    });

    it("should return false for non-object types", () => {
      expect(isEditingMetadata("string")).toBe(false);
      expect(isEditingMetadata(123)).toBe(false);
      expect(isEditingMetadata(true)).toBe(false);
    });

    it("should return false for missing edited_at", () => {
      const metadata = {
        original_word_count: 100,
        edited_word_count: 85,
        edits_applied: ["edit1"],
      };
      expect(isEditingMetadata(metadata)).toBe(false);
    });

    it("should return false for missing original_word_count", () => {
      const metadata = {
        edited_at: "2024-01-01T12:00:00Z",
        edited_word_count: 85,
        edits_applied: ["edit1"],
      };
      expect(isEditingMetadata(metadata)).toBe(false);
    });

    it("should return false for missing edited_word_count", () => {
      const metadata = {
        edited_at: "2024-01-01T12:00:00Z",
        original_word_count: 100,
        edits_applied: ["edit1"],
      };
      expect(isEditingMetadata(metadata)).toBe(false);
    });

    it("should return false for missing edits_applied", () => {
      const metadata = {
        edited_at: "2024-01-01T12:00:00Z",
        original_word_count: 100,
        edited_word_count: 85,
      };
      expect(isEditingMetadata(metadata)).toBe(false);
    });

    it("should return false for non-string edited_at", () => {
      const metadata = {
        edited_at: 12345,
        original_word_count: 100,
        edited_word_count: 85,
        edits_applied: ["edit1"],
      };
      expect(isEditingMetadata(metadata)).toBe(false);
    });

    it("should return false for non-number word counts", () => {
      const metadata = {
        edited_at: "2024-01-01T12:00:00Z",
        original_word_count: "100",
        edited_word_count: 85,
        edits_applied: ["edit1"],
      };
      expect(isEditingMetadata(metadata)).toBe(false);
    });

    it("should return false for non-array edits_applied", () => {
      const metadata = {
        edited_at: "2024-01-01T12:00:00Z",
        original_word_count: 100,
        edited_word_count: 85,
        edits_applied: "edit1, edit2",
      };
      expect(isEditingMetadata(metadata)).toBe(false);
    });

    it("should return false for non-string items in edits_applied", () => {
      const metadata = {
        edited_at: "2024-01-01T12:00:00Z",
        original_word_count: 100,
        edited_word_count: 85,
        edits_applied: ["edit1", 123, "edit2"],
      };
      expect(isEditingMetadata(metadata)).toBe(false);
    });

    it("should accept empty edits_applied array", () => {
      const metadata = {
        edited_at: "2024-01-01T12:00:00Z",
        original_word_count: 100,
        edited_word_count: 100,
        edits_applied: [],
      };
      expect(isEditingMetadata(metadata)).toBe(true);
    });
  });
});

describe("EditedEntry", () => {
  describe("isEditedEntry", () => {
    it("should return true for valid EditedEntry", () => {
      const entry = createTestEditedEntry();
      expect(isEditedEntry(entry)).toBe(true);
    });

    it("should return true for EditedEntry with optional fields", () => {
      const entry: EditedEntry = {
        ...createTestEditedEntry(),
        pricing: {
          model: "subscription",
          starting_price: "10",
          currency: "USD",
        },
        alternatives: ["Alt 1", "Alt 2"],
        integrations: ["Int 1"],
        _body: "Test body content",
      };
      expect(isEditedEntry(entry)).toBe(true);
    });

    it("should return false for WikiEntry without editing_metadata", () => {
      const entry = createTestWikiEntry();
      expect(isEditedEntry(entry)).toBe(false);
    });

    it("should return false for null", () => {
      expect(isEditedEntry(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isEditedEntry(undefined)).toBe(false);
    });

    it("should return false for non-object types", () => {
      expect(isEditedEntry("string")).toBe(false);
      expect(isEditedEntry(123)).toBe(false);
      expect(isEditedEntry([])).toBe(false);
    });

    it("should return false when missing required WikiEntry fields", () => {
      const entry = {
        editing_metadata: createTestEditingMetadata(),
        title: "Test",
        // Missing other required fields
      };
      expect(isEditedEntry(entry)).toBe(false);
    });

    it("should return false for invalid editing_metadata", () => {
      const entry = {
        ...createTestWikiEntry(),
        editing_metadata: {
          edited_at: 12345, // Invalid type
          original_word_count: 100,
          edited_word_count: 85,
          edits_applied: ["edit1"],
        },
      };
      expect(isEditedEntry(entry)).toBe(false);
    });

    it("should return false for empty sources array", () => {
      const entry = {
        ...createTestWikiEntry(),
        editing_metadata: createTestEditingMetadata(),
        sources: [], // Invalid: must have at least 1 source
      };
      expect(isEditedEntry(entry)).toBe(false);
    });

    it("should ensure EditedEntry is assignable to WikiEntry", () => {
      // This is a compile-time check - if this compiles, the constraint is met
      const edited: EditedEntry = createTestEditedEntry();
      const wiki: WikiEntry = edited; // Should not require type assertion
      expect(wiki.title).toBe("Test Entity");
    });
  });
});

describe("EditingConfig", () => {
  describe("DEFAULT_EDITING_CONFIG", () => {
    it("should have expected default values", () => {
      expect(DEFAULT_EDITING_CONFIG.max_sentence_length).toBe(40);
      expect(DEFAULT_EDITING_CONFIG.redundancy_threshold).toBe(0.3);
      expect(DEFAULT_EDITING_CONFIG.min_fluency_score).toBe(0.7);
    });

    it("should be a valid EditingConfig", () => {
      expect(isEditingConfig(DEFAULT_EDITING_CONFIG)).toBe(true);
    });
  });

  describe("isEditingConfig", () => {
    it("should return true for valid EditingConfig", () => {
      const config: EditingConfig = {
        max_sentence_length: 40,
        redundancy_threshold: 0.3,
        min_fluency_score: 0.7,
      };
      expect(isEditingConfig(config)).toBe(true);
    });

    it("should return true for minimum valid values", () => {
      const config: EditingConfig = {
        max_sentence_length: 1,
        redundancy_threshold: 0,
        min_fluency_score: 0,
      };
      expect(isEditingConfig(config)).toBe(true);
    });

    it("should return true for maximum valid values", () => {
      const config: EditingConfig = {
        max_sentence_length: 100,
        redundancy_threshold: 1,
        min_fluency_score: 1,
      };
      expect(isEditingConfig(config)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isEditingConfig(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isEditingConfig(undefined)).toBe(false);
    });

    it("should return false for non-object types", () => {
      expect(isEditingConfig("string")).toBe(false);
      expect(isEditingConfig(123)).toBe(false);
      expect(isEditingConfig(true)).toBe(false);
    });

    it("should return false for missing max_sentence_length", () => {
      const config = {
        redundancy_threshold: 0.3,
        min_fluency_score: 0.7,
      };
      expect(isEditingConfig(config)).toBe(false);
    });

    it("should return false for missing redundancy_threshold", () => {
      const config = {
        max_sentence_length: 40,
        min_fluency_score: 0.7,
      };
      expect(isEditingConfig(config)).toBe(false);
    });

    it("should return false for missing min_fluency_score", () => {
      const config = {
        max_sentence_length: 40,
        redundancy_threshold: 0.3,
      };
      expect(isEditingConfig(config)).toBe(false);
    });

    it("should return false for non-number values", () => {
      const config = {
        max_sentence_length: "40",
        redundancy_threshold: 0.3,
        min_fluency_score: 0.7,
      };
      expect(isEditingConfig(config)).toBe(false);
    });

    it("should return false for max_sentence_length of 0", () => {
      const config = {
        max_sentence_length: 0,
        redundancy_threshold: 0.3,
        min_fluency_score: 0.7,
      };
      expect(isEditingConfig(config)).toBe(false);
    });

    it("should return false for negative max_sentence_length", () => {
      const config = {
        max_sentence_length: -1,
        redundancy_threshold: 0.3,
        min_fluency_score: 0.7,
      };
      expect(isEditingConfig(config)).toBe(false);
    });

    it("should return false for redundancy_threshold < 0", () => {
      const config = {
        max_sentence_length: 40,
        redundancy_threshold: -0.1,
        min_fluency_score: 0.7,
      };
      expect(isEditingConfig(config)).toBe(false);
    });

    it("should return false for redundancy_threshold > 1", () => {
      const config = {
        max_sentence_length: 40,
        redundancy_threshold: 1.1,
        min_fluency_score: 0.7,
      };
      expect(isEditingConfig(config)).toBe(false);
    });

    it("should return false for min_fluency_score < 0", () => {
      const config = {
        max_sentence_length: 40,
        redundancy_threshold: 0.3,
        min_fluency_score: -0.1,
      };
      expect(isEditingConfig(config)).toBe(false);
    });

    it("should return false for min_fluency_score > 1", () => {
      const config = {
        max_sentence_length: 40,
        redundancy_threshold: 0.3,
        min_fluency_score: 1.1,
      };
      expect(isEditingConfig(config)).toBe(false);
    });
  });
});

describe("EditingValidationResult", () => {
  describe("isEditingValidationResult", () => {
    it("should return true for valid EditingValidationResult with no errors", () => {
      const result: EditingValidationResult = {
        passed: true,
        redundancy_score: 0.15,
        fluency_score: 0.85,
        information_preserved: true,
        errors: [],
      };
      expect(isEditingValidationResult(result)).toBe(true);
    });

    it("should return true for valid EditingValidationResult with errors", () => {
      const errors: ValidationError[] = [
        { field: "content", rule: "redundancy", message: "Too much redundancy" },
      ];
      const result: EditingValidationResult = {
        passed: false,
        redundancy_score: 0.5,
        fluency_score: 0.6,
        information_preserved: false,
        errors,
      };
      expect(isEditingValidationResult(result)).toBe(true);
    });

    it("should return true for boundary values (0 and 1)", () => {
      const result: EditingValidationResult = {
        passed: false,
        redundancy_score: 0,
        fluency_score: 1,
        information_preserved: true,
        errors: [],
      };
      expect(isEditingValidationResult(result)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isEditingValidationResult(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isEditingValidationResult(undefined)).toBe(false);
    });

    it("should return false for non-object types", () => {
      expect(isEditingValidationResult("string")).toBe(false);
      expect(isEditingValidationResult(123)).toBe(false);
      expect(isEditingValidationResult(true)).toBe(false);
    });

    it("should return false for missing passed", () => {
      const result = {
        redundancy_score: 0.15,
        fluency_score: 0.85,
        information_preserved: true,
        errors: [],
      };
      expect(isEditingValidationResult(result)).toBe(false);
    });

    it("should return false for missing redundancy_score", () => {
      const result = {
        passed: true,
        fluency_score: 0.85,
        information_preserved: true,
        errors: [],
      };
      expect(isEditingValidationResult(result)).toBe(false);
    });

    it("should return false for missing fluency_score", () => {
      const result = {
        passed: true,
        redundancy_score: 0.15,
        information_preserved: true,
        errors: [],
      };
      expect(isEditingValidationResult(result)).toBe(false);
    });

    it("should return false for missing information_preserved", () => {
      const result = {
        passed: true,
        redundancy_score: 0.15,
        fluency_score: 0.85,
        errors: [],
      };
      expect(isEditingValidationResult(result)).toBe(false);
    });

    it("should return false for missing errors", () => {
      const result = {
        passed: true,
        redundancy_score: 0.15,
        fluency_score: 0.85,
        information_preserved: true,
      };
      expect(isEditingValidationResult(result)).toBe(false);
    });

    it("should return false for non-boolean passed", () => {
      const result = {
        passed: "true",
        redundancy_score: 0.15,
        fluency_score: 0.85,
        information_preserved: true,
        errors: [],
      };
      expect(isEditingValidationResult(result)).toBe(false);
    });

    it("should return false for non-number scores", () => {
      const result = {
        passed: true,
        redundancy_score: "0.15",
        fluency_score: 0.85,
        information_preserved: true,
        errors: [],
      };
      expect(isEditingValidationResult(result)).toBe(false);
    });

    it("should return false for non-boolean information_preserved", () => {
      const result = {
        passed: true,
        redundancy_score: 0.15,
        fluency_score: 0.85,
        information_preserved: "true",
        errors: [],
      };
      expect(isEditingValidationResult(result)).toBe(false);
    });

    it("should return false for non-array errors", () => {
      const result = {
        passed: true,
        redundancy_score: 0.15,
        fluency_score: 0.85,
        information_preserved: true,
        errors: "error",
      };
      expect(isEditingValidationResult(result)).toBe(false);
    });

    it("should return false for invalid error structure", () => {
      const result = {
        passed: true,
        redundancy_score: 0.15,
        fluency_score: 0.85,
        information_preserved: true,
        errors: [{ field: 123, rule: "test", message: "error" }], // field should be string
      };
      expect(isEditingValidationResult(result)).toBe(false);
    });

    it("should return false for errors missing required fields", () => {
      const result = {
        passed: true,
        redundancy_score: 0.15,
        fluency_score: 0.85,
        information_preserved: true,
        errors: [{ field: "content", rule: "test" }], // missing message
      };
      expect(isEditingValidationResult(result)).toBe(false);
    });
  });
});

describe("Type Assignability", () => {
  it("should allow EditedEntry to be assigned to WikiEntry", () => {
    // Compile-time check: EditedEntry extends WikiEntry
    const edited: EditedEntry = createTestEditedEntry();
    const wiki: WikiEntry = edited;
    expect(wiki.spec).toBe(edited.spec);
    expect(wiki.title).toBe(edited.title);
  });

  it("should preserve all WikiEntry fields in EditedEntry", () => {
    const edited: EditedEntry = createTestEditedEntry();
    // Access all WikiEntry fields
    expect(edited.spec).toBeDefined();
    expect(edited.title).toBeDefined();
    expect(edited.type).toBeDefined();
    expect(edited.value_proposition).toBeDefined();
    expect(edited.what_it_offers).toBeDefined();
    expect(edited.problems_solved).toBeDefined();
    expect(edited.target_audience).toBeDefined();
    expect(edited.when_it_matters).toBeDefined();
    expect(edited.when_less_matters).toBeDefined();
    expect(edited.short_formula).toBeDefined();
    expect(edited.sources).toBeDefined();
  });

  it("should have editing_metadata in EditedEntry", () => {
    const edited: EditedEntry = createTestEditedEntry();
    expect(edited.editing_metadata).toBeDefined();
    expect(edited.editing_metadata.edited_at).toBeDefined();
    expect(edited.editing_metadata.original_word_count).toBeDefined();
    expect(edited.editing_metadata.edited_word_count).toBeDefined();
    expect(edited.editing_metadata.edits_applied).toBeDefined();
  });
});
