/**
 * @orquestra/ai-core - Content Generator
 * SOTA 2026: AI-powered product content generation
 */

import { GEMINI_MODELS, GeminiProvider } from '../providers/gemini.js'

export interface ContentGenerationOptions {
  apiKey: string
  productName: string
  category: string
  features: string[]
  targetAudience?: string
  tone?: 'professional' | 'casual' | 'enthusiastic' | 'informative'
  contentType: 'description' | 'review' | 'comparison' | 'guide' | 'ranking'
}

export interface GeneratedContent {
  title: string
  content: string
  seoKeywords: string[]
  metaDescription: string
  model: string
}

export class ContentGenerator {
  private provider: GeminiProvider

  constructor(apiKey: string) {
    this.provider = new GeminiProvider({
      apiKey,
      model: GEMINI_MODELS.FLASH_2_0,
      temperature: 0.8,
    })
  }

  /**
   * Generate product content based on features and tone
   */
  async generate(options: ContentGenerationOptions): Promise<GeneratedContent> {
    const prompt = this.buildPrompt(options)

    const response = await this.provider.chat([{ role: 'user', content: prompt }])

    try {
      // Expecting JSON response if possible, or parsing structured text
      return this.parseResponse(response.content, response.model)
    } catch (error) {
      console.warn(
        '[CONTENT_GENERATOR] Failed to parse AI response as JSON, returning as-is',
        error,
      )
      return {
        title: options.productName,
        content: response.content,
        seoKeywords: [],
        metaDescription: '',
        model: response.model,
      }
    }
  }

  private buildPrompt(options: ContentGenerationOptions): string {
    return `
Generate high-quality ${options.contentType} for the following product:
- Name: ${options.productName}
- Category: ${options.category}
- Features: ${options.features.join(', ')}
${options.targetAudience ? `- Target Audience: ${options.targetAudience}` : ''}
- Tone: ${options.tone || 'informative'}

Requirements:
1. Provide a catchy, SEO-friendly title.
2. Write a comprehensive ${options.contentType} (200-500 words).
3. Include 5-10 SEO keywords.
4. Provide a meta description (max 160 characters).
5. Format the output as a valid JSON object with the following keys: "title", "content", "seoKeywords", "metaDescription".

JSON format is mandatory. Return ONLY the JSON object.
    `.trim()
  }

  private parseResponse(content: string, model: string): GeneratedContent {
    // Clean up markdown code blocks if present
    const cleanContent = content
      .replace(/^```json\n?/, '')
      .replace(/\n?```$/, '')
      .trim()
    const parsed = JSON.parse(cleanContent)

    return {
      title: parsed.title || '',
      content: parsed.content || '',
      seoKeywords: parsed.seoKeywords || [],
      metaDescription: parsed.metaDescription || '',
      model,
    }
  }
}
