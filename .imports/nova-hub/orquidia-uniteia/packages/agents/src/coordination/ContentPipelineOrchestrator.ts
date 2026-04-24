/**
 * Content Pipeline Orchestrator
 * Coordinates multiple specialized agents for content creation and triage
 * with human-in-the-loop interaction through improved UI.
 * Uses the unified BaseAgent.process() interface.
 */

import { EditingAgent } from '../editing/EditingAgent.js'
import { FeedbackAgent } from '../feedback/FeedbackAgent.js'
import { LearningAgent } from '../learning/LearningAgent.js'
import { ResearchAgent } from '../research/ResearchAgent.js'
import { SeoAgent } from '../seo/SeoAgent.js'
import { TriageAgent } from '../triage/TriageAgent.js'
import { ValidationAgent } from '../validation/ValidationAgent.js'
import { WritingAgent } from '../writing/WritingAgent.js'

export interface ContentRequest {
  id: string
  prompt: string
  contentType: 'blog' | 'faq' | 'tutorial' | 'review' | 'news'
  targetAudience: string
  tone: 'professional' | 'casual' | 'educational' | 'enthusiastic'
  length: 'short' | 'medium' | 'long'
  keywords?: string[]
  humanRefinements?: string[]
  status: 'pending' | 'processing' | 'review' | 'approved' | 'published'
}

export interface AgentResult {
  success: boolean
  content?: string
  metadata?: Record<string, unknown>
  errors?: string[]
  confidenceScore?: number
}

export class ContentPipelineOrchestrator {
  private researchAgent = new ResearchAgent()
  private writingAgent = new WritingAgent()
  private editingAgent = new EditingAgent()
  private seoAgent = new SeoAgent()
  private validationAgent = new ValidationAgent()
  private triageAgent = new TriageAgent()
  private learningAgent = new LearningAgent()
  private feedbackAgent = new FeedbackAgent()

  /**
   * Main pipeline execution for content creation.
   * Each agent uses the unified process() method with domain-specific input shapes.
   */
  async processContentRequest(request: ContentRequest): Promise<AgentResult> {
    try {
      // Step 1: Research phase
      const researchResult = await this.researchAgent.process({
        query: request.prompt,
        sources: [],
      })
      if (!researchResult.success) {
        return { success: false, errors: ['Research phase failed'] }
      }

      // Step 2: Writing phase
      const writingResult = await this.writingAgent.process({
        research: {
          sources: [],
          keyFacts: [request.prompt],
          statistics: {},
          trendingTopics: [],
          competitorAnalysis: [],
          visualElements: [],
        },
        template: request.humanRefinements?.join('\n') ?? '',
        tone: request.tone,
        targetLength: this.lengthToWords(request.length),
      })
      if (!writingResult.success) {
        return { success: false, errors: ['Writing phase failed'] }
      }

      const draft = (writingResult.data as Record<string, unknown>)?.draft as string

      // Step 3: Editing phase
      const editingResult = await this.editingAgent.process({ draft })
      if (!editingResult.success) {
        return { success: false, errors: ['Editing phase failed'] }
      }

      const edited = (editingResult.data as Record<string, unknown>)?.edited as string

      // Step 4: SEO optimization
      const seoResult = await this.seoAgent.process({
        content: edited,
        keywords: request.keywords ?? [],
      })
      if (!seoResult.success) {
        return { success: false, errors: ['SEO optimization failed'] }
      }

      const seoContent = (seoResult.data as Record<string, unknown>)?.optimizedContent as string ?? edited

      // Step 5: Validation and fact-checking
      const validationResult = await this.validationAgent.process({
        content: seoContent,
      })
      if (!validationResult.success) {
        return {
          success: false,
          errors: ['Content validation failed'],
          confidenceScore: validationResult.confidence,
        }
      }

      // Step 6: Quality triage
      const triageResult = await this.triageAgent.process({
        content: seoContent,
        metadata: {
          request,
          validationScore: validationResult.confidence ?? 0,
        },
      })

      return {
        success: true,
        content: seoContent,
        metadata: {
          qualityTier: (triageResult.data as Record<string, unknown>)?.tier ?? 'standard',
          processingTime: Date.now(),
          agentPipeline: 'complete',
        },
        confidenceScore: validationResult.confidence ?? 0.5,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        errors: [`Orchestration error: ${message}`],
      }
    }
  }

  /**
   * Process human feedback and refine prompts
   */
  async processHumanFeedback(feedback: unknown): Promise<void> {
    await this.feedbackAgent.process({ feedback })
    await this.learningAgent.process({
      data: feedback,
      context: 'user_feedback',
    })
  }

  /**
   * Health check for all agents
   */
  async healthCheck(): Promise<Record<string, boolean>> {
    const agents = {
      research: this.researchAgent,
      writing: this.writingAgent,
      editing: this.editingAgent,
      seo: this.seoAgent,
      validation: this.validationAgent,
      triage: this.triageAgent,
      learning: this.learningAgent,
      feedback: this.feedbackAgent,
    }

    const results: Record<string, boolean> = {}
    for (const [name, agent] of Object.entries(agents)) {
      try {
        results[name] = await agent.healthCheck()
      } catch {
        results[name] = false
      }
    }
    return results
  }

  private lengthToWords(length: 'short' | 'medium' | 'long'): number {
    switch (length) {
      case 'short':
        return 500
      case 'medium':
        return 1500
      case 'long':
        return 3000
      default:
        return 1000
    }
  }
}
