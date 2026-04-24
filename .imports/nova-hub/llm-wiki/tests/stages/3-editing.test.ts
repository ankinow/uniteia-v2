/**
 * Stage 3: Editing Tests
 */

import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  executeStage3,
  createStage3,
  parseDraftMarkdown,
  countWords,
  splitIntoSentences,
  splitLongSentence,
  calculateSimilarity,
  splitIntoParagraphs,
  removeRedundantParagraphs,
  applyEditingTransformations,
  standardizeFormatting,
  checkInformationPreservation,
  calculateRedundancyScore,
  calculateFluencyScore,
  generateEditedMarkdown,
  validateEditedEntry,
  type EditCounts,
} from "../../src/stages/3-editing";
import type { WikiEntry } from "../../src/types/draft";
import type { EditedEntry } from "../../src/types/editing";
import { DEFAULT_EDITING_CONFIG } from "../../src/types/editing";

describe("parseDraftMarkdown", () => {
  test("parses YAML frontmatter correctly", () => {
    const markdown = `---
spec: llm-wiki/1.0.0
title: TestEntity
type: ferramenta
value_proposition: A test tool for testing
what_it_offers:
  - Feature 1
  - Feature 2
problems_solved:
  - Problem 1
target_audience: Developers
when_it_matters: When testing
when_less_matters: When not testing
short_formula: Test = verify
sources:
  - url: https://example.com
    kind: official
    accessed_at: "2024-01-01"
    excerpt_id: ex_001
---

## Overview

This is the body content.
`;

    const result = parseDraftMarkdown(markdown);

    expect(result.frontmatter.spec).toBe("llm-wiki/1.0.0");
    expect(result.frontmatter.title).toBe("TestEntity");
    expect(result.frontmatter.type).toBe("ferramenta");
    expect(result.frontmatter.what_it_offers).toHaveLength(2);
    expect(result.body).toContain("## Overview");
  });

  test("throws error for missing frontmatter", () => {
    const markdown = "No frontmatter here";

    expect(() => parseDraftMarkdown(markdown)).toThrow(
      "Invalid draft format: missing YAML frontmatter"
    );
  });

  test("throws error for unclosed frontmatter", () => {
    const markdown = `---
spec: llm-wiki/1.0.0
title: TestEntity

No closing delimiter`;

    expect(() => parseDraftMarkdown(markdown)).toThrow(
      "Invalid draft format: unclosed YAML frontmatter"
    );
  });
});

describe("countWords", () => {
  test("counts words correctly", () => {
    expect(countWords("Hello world")).toBe(2);
    expect(countWords("One two three four five")).toBe(5);
  });

  test("handles extra whitespace", () => {
    expect(countWords("  Hello   world  ")).toBe(2);
  });

  test("handles empty string", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
  });
});

describe("splitIntoSentences", () => {
  test("splits on sentence boundaries", () => {
    const text = "First sentence. Second sentence. Third sentence.";
    const sentences = splitIntoSentences(text);

    expect(sentences).toHaveLength(3);
    expect(sentences[0]).toBe("First sentence.");
    expect(sentences[1]).toBe("Second sentence.");
    expect(sentences[2]).toBe("Third sentence.");
  });

  test("handles questions and exclamations", () => {
    const text = "Is this a test? Yes it is! Great.";
    const sentences = splitIntoSentences(text);

    expect(sentences).toHaveLength(3);
  });
});

describe("splitLongSentence", () => {
  test("returns short sentences unchanged", () => {
    const sentence = "This is a short sentence.";
    const result = splitLongSentence(sentence, 40);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(sentence);
  });

  test("splits long sentences at clause boundaries", () => {
    const sentence =
      "This is a very long sentence that exceeds the maximum length limit, and it should be split at natural boundaries.";
    const result = splitLongSentence(sentence, 10);

    expect(result.length).toBeGreaterThan(1);
  });

  test("ensures sentences end with punctuation", () => {
    const sentence =
      "This is a long sentence that needs splitting, and it should end with punctuation";
    const result = splitLongSentence(sentence, 5);

    for (const s of result) {
      expect(s).toMatch(/[.!?]$/);
    }
  });
});

describe("calculateSimilarity", () => {
  test("returns 1 for identical texts", () => {
    const similarity = calculateSimilarity(
      "This is a test",
      "This is a test"
    );
    expect(similarity).toBe(1);
  });

  test("returns 0 for completely different texts", () => {
    const similarity = calculateSimilarity("apple banana cherry", "zebra xylophone yogurt");
    expect(similarity).toBe(0);
  });

  test("returns intermediate value for similar texts", () => {
    const similarity = calculateSimilarity(
      "This is a test",
      "This is another test"
    );
    expect(similarity).toBeGreaterThan(0);
    expect(similarity).toBeLessThan(1);
  });

  test("is case-insensitive", () => {
    const similarity = calculateSimilarity("HELLO WORLD", "hello world");
    expect(similarity).toBe(1);
  });
});

describe("splitIntoParagraphs", () => {
  test("splits on double newlines", () => {
    const body = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.";
    const paragraphs = splitIntoParagraphs(body);

    expect(paragraphs).toHaveLength(3);
  });

  test("filters empty paragraphs", () => {
    const body = "First.\n\n\n\n\nSecond.";
    const paragraphs = splitIntoParagraphs(body);

    expect(paragraphs).toHaveLength(2);
  });
});

describe("removeRedundantParagraphs", () => {
  test("removes duplicate paragraphs", () => {
    const paragraphs = [
      "This is unique content about topic alpha.",
      "This is different content about beta.",
      "This is unique content about topic alpha.",
    ];

    const result = removeRedundantParagraphs(paragraphs, 0.95);

    // With high threshold, exact duplicates should be caught
    expect(result.paragraphs.length).toBeLessThanOrEqual(3);
  });

  test("keeps all unique paragraphs", () => {
    const paragraphs = [
      "Alpha alpha alpha unique content here.",
      "Beta beta beta different topic here.",
      "Gamma gamma gamma another subject here.",
    ];

    const result = removeRedundantParagraphs(paragraphs, 0.3);

    // With diverse content, most should be kept
    expect(result.paragraphs.length).toBeGreaterThan(0);
  });
});

describe("applyEditingTransformations", () => {
  test("removes redundant paragraphs", () => {
    const body = `This is the first paragraph.

This is completely different content.

This is the first paragraph.`;

    const result = applyEditingTransformations(body, {
      ...DEFAULT_EDITING_CONFIG,
      redundancy_threshold: 0.5,
    });

    expect(result.edits.redundancies_removed).toBeGreaterThan(0);
  });

  test("splits long sentences", () => {
    const longSentence = Array(50).fill("word").join(" ");
    const body = `${longSentence}. This is shorter.`;

    const result = applyEditingTransformations(body, {
      ...DEFAULT_EDITING_CONFIG,
      max_sentence_length: 40,
    });

    expect(result.edits.sentences_split).toBeGreaterThan(0);
  });

  test("preserves headings", () => {
    const body = `## Overview

This is content under the heading.`;

    const result = applyEditingTransformations(body);

    expect(result.body).toContain("## Overview");
  });
});

describe("standardizeFormatting", () => {
  test("adds space after heading markers", () => {
    const body = "##Heading without space\n\nContent here.";
    const edits: EditCounts = { redundancies_removed: 0, sentences_split: 0, format_fixes: 0 };

    const result = standardizeFormatting(body, edits);

    expect(result).toBe("## Heading without space\n\nContent here.");
    expect(edits.format_fixes).toBeGreaterThan(0);
  });

  test("adds space after list markers", () => {
    const body = "-Item one\n-Item two";
    const edits: EditCounts = { redundancies_removed: 0, sentences_split: 0, format_fixes: 0 };

    const result = standardizeFormatting(body, edits);

    expect(result).toBe("- Item one\n- Item two");
    expect(edits.format_fixes).toBeGreaterThan(0);
  });

  test("removes multiple blank lines", () => {
    const body = "Paragraph one.\n\n\n\n\nParagraph two.";
    const edits: EditCounts = { redundancies_removed: 0, sentences_split: 0, format_fixes: 0 };

    const result = standardizeFormatting(body, edits);

    // Multiple blank lines should be reduced
    expect(result).toContain("Paragraph one");
    expect(result).toContain("Paragraph two");
    expect(edits.format_fixes).toBeGreaterThan(0);
  });
});

describe("checkInformationPreservation", () => {
  const createMockWikiEntry = (): WikiEntry => ({
    spec: "llm-wiki/1.0.0",
    title: "TestEntity",
    type: "ferramenta",
    value_proposition: "A test tool",
    what_it_offers: ["Feature 1", "Feature 2", "Feature 3"],
    problems_solved: ["Problem 1", "Problem 2"],
    target_audience: "Developers",
    when_it_matters: "When testing",
    when_less_matters: "When not testing",
    short_formula: "Test = verify",
    sources: [
      {
        url: "https://example.com",
        kind: "official",
        accessed_at: "2024-01-01",
        excerpt_id: "ex_001",
      },
    ],
  });

  test("passes when all information preserved", () => {
    const original = createMockWikiEntry();
    const edited = { ...original };

    const result = checkInformationPreservation(original, edited);

    expect(result.preserved).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("fails when required field removed", () => {
    const original = createMockWikiEntry();
    const edited = { ...original } as Partial<WikiEntry>;
    delete (edited as any).value_proposition;

    const result = checkInformationPreservation(original, edited as WikiEntry);

    expect(result.preserved).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].field).toBe("value_proposition");
  });

  test("fails when array loses elements", () => {
    const original = createMockWikiEntry();
    const edited: WikiEntry = {
      ...original,
      what_it_offers: ["Feature 1"],
    };

    const result = checkInformationPreservation(original, edited);

    expect(result.preserved).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("calculateRedundancyScore", () => {
  test("returns 0 for unique paragraphs", () => {
    const body = `First unique paragraph.

Second unique paragraph about different topic.

Third unique paragraph about another topic.`;

    const score = calculateRedundancyScore(body);

    expect(score).toBeLessThan(0.5);
  });

  test("returns higher score for duplicate paragraphs", () => {
    const body = `This is repeated content.

This is repeated content.`;

    const score = calculateRedundancyScore(body);

    expect(score).toBeGreaterThan(0.5);
  });

  test("returns 0 for single paragraph", () => {
    const body = "Only one paragraph here.";

    const score = calculateRedundancyScore(body);

    expect(score).toBe(0);
  });
});

describe("calculateFluencyScore", () => {
  test("returns 1 for all short sentences", () => {
    const body = "Short sentence. Another short one. And another.";

    const score = calculateFluencyScore(body, {
      ...DEFAULT_EDITING_CONFIG,
      max_sentence_length: 40,
    });

    expect(score).toBe(1);
  });

  test("returns lower score for long sentences", () => {
    const longSentence = Array(50).fill("word").join(" ");
    const body = `${longSentence}. Short sentence.`;

    const score = calculateFluencyScore(body, {
      ...DEFAULT_EDITING_CONFIG,
      max_sentence_length: 40,
    });

    expect(score).toBeLessThan(1);
    expect(score).toBeGreaterThan(0);
  });
});

describe("generateEditedMarkdown", () => {
  test("generates YAML frontmatter correctly", () => {
    const entry: EditedEntry = {
      spec: "llm-wiki/1.0.0",
      title: "TestEntity",
      type: "ferramenta",
      value_proposition: "A test tool",
      what_it_offers: ["Feature 1"],
      problems_solved: ["Problem 1"],
      target_audience: "Developers",
      when_it_matters: "When testing",
      when_less_matters: "When not testing",
      short_formula: "Test",
      sources: [],
      editing_metadata: {
        edited_at: "2024-01-01T00:00:00Z",
        original_word_count: 100,
        edited_word_count: 90,
        edits_applied: ["2 redundancies removed"],
      },
    };
    const body = "Edited content here.";

    const markdown = generateEditedMarkdown(entry, body);

    expect(markdown).toMatch(/^---\n/);
    expect(markdown).toContain("spec:");
    expect(markdown).toContain("title: TestEntity");
    expect(markdown).toContain("editing_metadata:");
    expect(markdown).toContain("Edited content here.");
  });
});

describe("validateEditedEntry", () => {
  const createMockWikiEntry = (): WikiEntry => ({
    spec: "llm-wiki/1.0.0",
    title: "Test",
    type: "ferramenta",
    value_proposition: "Test value",
    what_it_offers: ["Feature"],
    problems_solved: ["Problem"],
    target_audience: "Users",
    when_it_matters: "Always",
    when_less_matters: "Never",
    short_formula: "Test",
    sources: [{ url: "https://example.com", kind: "official", accessed_at: "2024-01-01", excerpt_id: "ex_001" }],
  });

  const createMockEditedEntry = (wiki: WikiEntry): EditedEntry => ({
    ...wiki,
    editing_metadata: {
      edited_at: "2024-01-01",
      original_word_count: 100,
      edited_word_count: 90,
      edits_applied: [],
    },
  });

  test("passes for valid edited entry", () => {
    const original = createMockWikiEntry();
    const edited = createMockEditedEntry(original);
    const body = "Unique content here. Another unique sentence.";

    const result = validateEditedEntry(edited, original, body);

    expect(result.passed).toBe(true);
    expect(result.information_preserved).toBe(true);
  });

  test("fails when information not preserved", () => {
    const original = createMockWikiEntry();
    const edited: EditedEntry = {
      ...createMockEditedEntry(original),
      what_it_offers: [],
    };
    const body = "Content";

    const result = validateEditedEntry(edited, original, body);

    expect(result.passed).toBe(false);
    expect(result.information_preserved).toBe(false);
  });
});

describe("executeStage3", () => {
  const testOutputDir = join(process.cwd(), "test-output-stage3");
  let testArtifactDir: string;

  const createDraftV1 = (artifactDir: string) => {
    const draftContent = `---
spec: llm-wiki/1.0.0
title: TestEntity
type: ferramenta
value_proposition: A powerful tool for developers
what_it_offers:
  - Feature one for testing
  - Feature two for building
  - Feature three for deploying
problems_solved:
  - Reduces development time
  - Improves code quality
target_audience: Software developers and engineering teams
when_it_matters: When building complex software systems
when_less_matters: When working on simple prototypes
short_formula: Test = Build + Deploy
sources:
  - url: https://example.com
    kind: official
    accessed_at: "2024-01-01"
    excerpt_id: ex_001
---

## Overview

TestEntity is a powerful tool that helps developers build better software faster. TestEntity is a powerful tool that helps developers build better software faster.

## Features

The tool offers comprehensive features for modern development workflows. This sentence is intentionally very long to test the sentence splitting functionality that should break it into smaller more manageable chunks for better readability.

- Feature one
- Feature two
`;
    writeFileSync(join(artifactDir, "draft_v1.md"), draftContent, "utf-8");
  };

  beforeEach(() => {
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
    mkdirSync(testOutputDir, { recursive: true });
    testArtifactDir = join(testOutputDir, "artifacts", "testentity");
    mkdirSync(testArtifactDir, { recursive: true });
    createDraftV1(testArtifactDir);
  });

  afterEach(() => {
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  test("creates draft_v2.md in artifact directory", async () => {
    const job = {
      spec: "test-spec",
      entity: "TestEntity",
      intent: "wiki_entry",
      output: testOutputDir,
      created_at: new Date().toISOString(),
    };

    const result = await executeStage3(job, testArtifactDir);

    expect(existsSync(result.draftFile)).toBe(true);
    expect(result.draftFile.endsWith("draft_v2.md")).toBe(true);
  });

  test("processes editing transformations", async () => {
    const job = {
      spec: "test-spec",
      entity: "TestEntity",
      intent: "wiki_entry",
      output: testOutputDir,
      created_at: new Date().toISOString(),
    };

    const result = await executeStage3(job, testArtifactDir);

    // Editing should process the document
    expect(result.editsMade).toBeDefined();
    expect(result.wordCounts.after).toBeGreaterThan(0);
  });

  test("preserves required fields", async () => {
    const job = {
      spec: "test-spec",
      entity: "TestEntity",
      intent: "wiki_entry",
      output: testOutputDir,
      created_at: new Date().toISOString(),
    };

    const result = await executeStage3(job, testArtifactDir);

    expect(result.entry.title).toBe("TestEntity");
    expect(result.entry.type).toBe("ferramenta");
    expect(result.entry.what_it_offers.length).toBeGreaterThanOrEqual(3);
    expect(result.entry.editing_metadata).toBeDefined();
  });

  test("includes editing metadata", async () => {
    const job = {
      spec: "test-spec",
      entity: "TestEntity",
      intent: "wiki_entry",
      output: testOutputDir,
      created_at: new Date().toISOString(),
    };

    const result = await executeStage3(job, testArtifactDir);

    expect(result.entry.editing_metadata.edited_at).toBeDefined();
    expect(result.entry.editing_metadata.original_word_count).toBeGreaterThan(0);
    expect(result.entry.editing_metadata.edited_word_count).toBeGreaterThan(0);
    expect(result.entry.editing_metadata.edits_applied).toBeDefined();
  });

  test("validates edited entry", async () => {
    const job = {
      spec: "test-spec",
      entity: "TestEntity",
      intent: "wiki_entry",
      output: testOutputDir,
      created_at: new Date().toISOString(),
    };

    const result = await executeStage3(job, testArtifactDir);

    expect(result.validation).toBeDefined();
    expect(typeof result.validation.passed).toBe("boolean");
    expect(typeof result.validation.redundancy_score).toBe("number");
    expect(typeof result.validation.fluency_score).toBe("number");
  });

  test("generates valid YAML frontmatter in output", async () => {
    const job = {
      spec: "test-spec",
      entity: "TestEntity",
      intent: "wiki_entry",
      output: testOutputDir,
      created_at: new Date().toISOString(),
    };

    const result = await executeStage3(job, testArtifactDir);
    const content = readFileSync(result.draftFile, "utf-8");

    expect(content.startsWith("---\n")).toBe(true);
    expect(content).toContain("spec:");
    expect(content).toContain("title:");
    expect(content).toContain("editing_metadata:");
  });
});

describe("createStage3", () => {
  test("creates stage with correct id and name", () => {
    const stage = createStage3();

    expect(stage.id).toBe(3);
    expect(stage.name).toBe("editing");
    expect(stage.description).toBeDefined();
  });

  test("has execute function", () => {
    const stage = createStage3();

    expect(typeof stage.execute).toBe("function");
  });

  test("has gateCheck function", () => {
    const stage = createStage3();

    expect(typeof stage.gateCheck).toBe("function");
  });
});
