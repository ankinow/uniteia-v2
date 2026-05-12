export interface TagMapping {
  categories: Record<string, string[]>
}

export function mapTags(tags: Record<string, string[]>): TagMapping {
  return {
    categories: { ...tags },
  }
}
