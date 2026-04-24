export interface SimilaritySearchResult {
  id: string
  score: number
  metadata?: Record<string, string>
}

export interface ClassificationResult {
  category: string
  confidence: number
  allScores: Array<[string, number]>
}
