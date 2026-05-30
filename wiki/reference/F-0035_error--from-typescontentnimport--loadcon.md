# Error } from '~/types/content'\nimport { loadContent } from '~/utils/content-loa

Error } from '~/types/content'\nimport { loadContent } from '~/utils/content-loader'\n\nlet warmupDone = false\nbeforeAll(async () => {\n  if (!warmupDone) {\n    warmupDone = true\n    try {\n      await loadContent('apex', 'tencent-cloud-deal-stack-builders', 'en')\n    } catch {}\n  }\n}, 60_000)\n\ndescribe('loadContent', () => {\n  it('loads a valid English article and returns typed LlmWikiContent', async () => {\n    const result = await loadContent('apex', 'tencent-cloud-deal-stack-builde

---
- Domain: content
- Source: F-0035
- Eval-D⁹: 85
- Actionability: reference
- Promoted: 2026-05-30T04:37:50.135449+00:00
