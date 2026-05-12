# Content Teaching Pattern

> How UniTeia structures educational content for maximum clarity and retention.

---

## 1. The UniTeia Teaching Formula

Every lesson follows this structure:

```
PROMISE  →  EXPLAIN  →  ANALOGIZE  →  SUMMARIZE  →  NEXT
```

| Phase | Component | Purpose |
|-------|-----------|---------|
| **Promise** | `<LessonHero>` | Set expectations, reduce anxiety |
| **Explain** | `<LessonBlock>` | Deliver core content in chunks |
| **Analogize** | `<AnalogyBox>` | Connect to familiar concepts |
| **Summarize** | `<SummaryBoard>` | Reinforce key takeaways |
| **Next** | `<NextLessonCard>` | Maintain momentum |

---

## 2. The Promise Phase

Start every lesson with a clear promise:

### Good Promise
> "In 5 minutes, you will understand how neural networks learn from data."

### Bad Promise
> "This article covers neural networks." (vague, no benefit)

### LessonHero Usage

```tsx
<LessonHero
  title="What is a Neural Network?"
  promise="In 5 minutes, you will understand how machines learn."
  lang="en"
/>
```

---

## 3. The Explain Phase

Break content into digestible blocks:

### Rules

1. **One concept per block** — never combine unrelated ideas
2. **Max 3 paragraphs** — if longer, split into multiple blocks
3. **Action optional** — only add if there's a relevant interactive element

### Tones

| Tone | Use Case | Visual |
|------|----------|--------|
| `default` | Normal content | Standard depth card |
| `highlight` | Key concepts | Cyan accent border |
| `warning` | Common mistakes | Orange accent border |

### Example

```tsx
<LessonBlock
  title="What are Layers?"
  body="A neural network has multiple layers. Each layer transforms the data in a specific way. The first layer receives raw input. The last layer produces the final answer."
  tone="default"
/>

<LessonBlock
  title="The Hidden Layers"
  body="Between input and output are 'hidden' layers. These do the heavy lifting. They find patterns humans cannot see."
  tone="highlight"
/>

<LessonBlock
  title="Common Mistake"
  body="More layers is not always better. Too many layers can make the network slow and prone to overfitting."
  tone="warning"
/>
```

---

## 4. The Analogize Phase

Analogies bridge the gap between new concepts and existing knowledge.

### Rules

1. **Use familiar domains** — cooking, sports, everyday objects
2. **Keep it concrete** — avoid abstract analogies
3. **One analogy per box** — don't stack multiple metaphors

### Good Analogies

> "A neural network is like a team of specialists voting on an answer. Each specialist sees different clues, and the majority wins."

> "Training a model is like teaching a child to recognize cats. You show many pictures, correct mistakes, and eventually they get it."

### Bad Analogies

> "It's like quantum mechanics but for data." (equally confusing)

### Example

```tsx
<AnalogyBox
  analogy="Think of a neural network like a factory assembly line. Raw materials (data) enter at one end. Each station (layer) adds something. A finished product (prediction) comes out the other end."
/>
```

---

## 5. The Summarize Phase

Reinforce what was learned with a checklist:

### Rules

1. **3-5 items max** — more than 5 dilutes focus
2. **Start with verbs** — "Understand", "Recognize", "Apply"
3. **Match the promise** — summary should fulfill the initial promise

### Example

```tsx
<SummaryBoard
  items={[
    "Neural networks have layers that transform data",
    "Hidden layers find patterns automatically",
    "More layers is not always better",
    "Training is like teaching through examples"
  ]}
/>
```

---

## 6. The Next Phase

Maintain learning momentum:

### Rules

1. **Always provide a next step** — never leave the learner stranded
2. **Use real hrefs** — no placeholder links
3. **Clear labels** — "Next up", "Continue", "Try it"

### Example

```tsx
<NextLessonCard
  href="/en/n/ai-agents/training-basics"
  title="Training Your First Model"
  label="Next up"
/>
```

---

## 7. Visual Annotations

Use handdraw visuals to emphasize key points:

### When to Use

- **Arrow** — pointing to important elements
- **Circle** — highlighting specific items in diagrams

### Example

```tsx
<div class="relative">
  <img src="/diagrams/network.svg" alt="Neural network diagram" />
  <HanddrawArrow direction="right" class="absolute top-4 left-8" />
  <HanddrawCircle class="absolute top-12 left-24" />
</div>
```

---

## 8. JRPG Progress

For multi-part lessons, show progress:

```tsx
<QuestProgress
  steps={["Introduction", "Core Concepts", "Practice", "Quiz"]}
  current={1}
/>
```

This appears at the top of the lesson, giving learners a sense of position and completion.

---

## 9. Complete Lesson Structure

```tsx
export default component$(() => {
  return (
    <article class="flex flex-col gap-8">
      {/* Progress */}
      <QuestProgress
        steps={["Intro", "Layers", "Training", "Quiz"]}
        current={0}
      />

      {/* Promise */}
      <LessonHero
        title="What is a Neural Network?"
        promise="In 5 minutes, you will understand how machines learn."
        lang="en"
      />

      {/* Explain */}
      <LessonBlock
        title="The Basic Idea"
        body="A neural network is a computer system inspired by the human brain..."
        tone="default"
      />

      <LessonBlock
        title="Key Insight"
        body="Networks learn by adjusting connections based on errors..."
        tone="highlight"
      />

      {/* Analogize */}
      <AnalogyBox
        analogy="A neural network is like a team voting on an answer."
      />

      {/* Summarize */}
      <SummaryBoard
        items={[
          "Neural networks are brain-inspired",
          "They have layers of connected nodes",
          "Learning happens through error correction"
        ]}
      />

      {/* Next */}
      <NextLessonCard
        href="/en/n/ai-agents/layers-explained"
        title="Understanding Layers"
        label="Next up"
      />
    </article>
  );
});
```

---

## 10. Anti-Patterns

### DO NOT

- Skip the promise (confuses learners)
- Use jargon without explanation
- Stack multiple analogies (pick the best one)
- End without a next step
- Use placeholder content

### DO

- Start with clear expectations
- Explain one concept at a time
- Use concrete, familiar analogies
- Always provide forward momentum
- Write real content or leave slots empty
