export type GraphEdgeKind =
  | 'translated-as'
  | 'belongs-to-niche'
  | 'tagged-with'
  | 'related-to'
  | 'canonical-route'
  | 'alias-route'

export interface GraphEdge {
  from: string
  to: string
  kind: GraphEdgeKind
  weight?: number
  reason?: string
}
