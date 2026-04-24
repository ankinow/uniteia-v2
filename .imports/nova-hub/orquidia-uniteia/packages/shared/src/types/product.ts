/**
 * @uniteia/shared/types/product
 * Product-specific types with layered architecture
 */

// ============================================================================
// CORE PRODUCT TYPES
// ============================================================================

/**
 * ProductBase: Minimal required fields for any product representation
 */
export interface ProductBase {
  id: string
  slug: string
  title: string
  affiliate_link: string
  category: string
  is_active: boolean
}

/**
 * Product: Full product type for business logic
 */
export interface Product extends ProductBase {
  description: string
  image: string
  thumbnail_url?: string
  price?: number
  price_original?: number
  original_price?: number
  discount_percentage?: number
  subcategory?: string
  brand?: string
  score: number
  priority: number
  is_published: boolean
  created_at: number
  updated_at: number

  // AI-generated content
  structuredReview?: StructuredReview
  specs?: Record<string, string | number>
  specs_json?: string

  // SEO & GEO
  meta_title?: string
  meta_description?: string
  keywords?: string[]

  // Marketplace-specific
  ml_item_id?: string
  commission_rate?: number
  rating?: number
  currency?: string
  metadata_json?: string
}

/**
 * ProductDTO: API response format
 */
export interface ProductDTO extends Omit<Product, 'specs_json' | 'metadata_json'> {
  url: string
  savings?: number
}

/**
 * ProductSEO: Schema.org compliant
 */
export interface ProductSEO {
  '@context': 'https://schema.org'
  '@type': 'Product'
  name: string
  description: string
  image: string
  url: string
  brand?: { '@type': 'Brand'; name: string }
  offers?: {
    '@type': 'Offer'
    price: number
    priceCurrency: string
    availability: string
    url: string
  }
}

export interface StructuredReview {
  verdict: string
  pros: string[]
  cons: string[]
  score: number
  summary?: string
  analysis?: string
}

// ============================================================================
// AFFILIATE TYPES
// ============================================================================

export interface AffiliateClick {
  id: string
  product_slug: string
  referrer?: string
  user_agent?: string
  ip_hash: string
  country?: string
  clicked_at: number
}

export interface AffiliateCookie {
  id: string
  session_id: string
  product_slug: string
  expires_at: number
  created_at: number
}

export interface AffiliateAttribution {
  source: string
  campaign?: string
  medium?: string
  product_slug: string
  expires_at: number
  first_touch: number
}

// ============================================================================
// CONTENT TYPES
// ============================================================================

export interface Article {
  id: string
  slug: string
  title: string
  content_markdown: string
  excerpt?: string
  author?: string
  published_at?: number
  updated_at: number
  category: string
  tags?: string[]
  featured_image?: string
  is_published: boolean
}

export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  icon?: string
  parent_id?: string
  priority: number
  product_count: number
}

export interface NeuralInsight {
  id: string
  product_id: string
  insight_type: 'verdict' | 'pros_cons' | 'comparison' | 'trend'
  content_markdown: string
  confidence_score: number
  generated_at: number
  model_version?: string
}
