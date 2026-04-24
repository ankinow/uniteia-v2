export interface ResearchInput {
  /** Unified pipeline: topics to research */
  topics?: string[]
  maxResults?: number
  /** Legacy/research-agent fields */
  prompt?: string
  contentType?: string
  targetAudience?: string
  keywords?: string[]
}

export interface WritingInput {
  research: ResearchOutput
  template?: string
  tone?: string
  targetLength: number
}

export interface EditingInput {
  draft: string
  rules?: string[]
}

export interface SeoInput {
  content: string
  targetKeywords?: string[]
  locale?: string
}

export interface ValidationInput {
  content: string
  checks?: string[]
}

export interface TriageInput {
  content: string | { title: string; tags: string[] }
  priority?: 'low' | 'medium' | 'high'
}

export interface LearningInput {
  interaction: string
  feedback: string
  context?: Record<string, string>
}

export interface FeedbackInput {
  content: string
  userFeedback?: string
  metrics?: {
    views: number
    engagement: number
    shares: number
  }
}

export interface ResearchOutput {
  sources: string[]
  keyFacts: string[]
  statistics: Record<string, number>
  trendingTopics: string[]
  competitorAnalysis: string[]
  visualElements: string[]
}

export interface WritingOutput {
  draft: string
  wordCount: number
  tone: string
}

export interface EditingOutput {
  edited: string
  changes: string[]
  wordCount: number
}

export interface SeoOutput {
  score: number
  titleTag: string
  metaDescription: string
  keywordDensity: Record<string, number>
  suggestions: string[]
  issues: string[]
}

export interface ValidationOutput {
  passed: boolean
  checks: Array<{ name: string; passed: boolean; message: string }>
}

export interface TriageOutput {
  priority: 'low' | 'medium' | 'high'
  assignedAgents: string[]
  reason: string
}

export interface LearningOutput {
  patternsLearned: string[]
  confidence: number
  nextAction: string
}

export interface FeedbackOutput {
  summary: string
  score: number
  actionItems: string[]
}

export interface AgentConfig {
  name: string
  enabled: boolean
  retries: number
  timeout: number
}

export interface PipelineContext {
  sessionId: string
  agents: Record<string, Record<string, unknown>>
  metadata: Record<string, unknown>
}
