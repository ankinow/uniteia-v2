/**
 * Product Fetching Service
 * SOTA 2026: Fetches product data from affiliate links
 *
 * Supports:
 * - Mercado Livre affiliate links
 * - Amazon affiliate links
 * - Shopee affiliate links
 */

import { scrapeProduct } from '@orquestra/ai-core/economic'
import { z } from 'zod'

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null
  if (Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function getNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

// ============================================================================
// TYPES
// ============================================================================

export interface ProductFetchResult {
  success: boolean
  data?: {
    title: string
    description?: string
    price?: number
    original_price?: number
    image?: string
    thumbnail_url?: string
    category: string
    subcategory?: string
    brand?: string
    specs?: Record<string, string | number>
    meta_title?: string
    meta_description?: string
    warnings?: string[]
  }
  error?: string
  warnings?: string[]
}

export interface MarketplaceConfig {
  domains: string[]
  name: string
  affiliateParam: string
  currency: string
}

// ============================================================================
// MARKETPLACE CONFIGURATIONS
// ============================================================================

const MARKETPLACES: Record<string, MarketplaceConfig> = {
  'mercadolivre.com': {
    domains: ['mercadolivre.com', 'mercadolivre.com.br'],
    name: 'Mercado Livre',
    affiliateParam: 'gad_id',
    currency: 'BRL',
  },
  'amazon.com': {
    domains: ['amazon.com', 'amazon.com.br'],
    name: 'Amazon',
    affiliateParam: 'tag',
    currency: 'BRL',
  },
  'shopee.com': {
    domains: ['shopee.com', 'shopee.com.br'],
    name: 'Shopee',
    affiliateParam: 'affiliate_source',
    currency: 'BRL',
  },
}

// ============================================================================
// URL PARSING
// ============================================================================

/**
 * Extract marketplace and product ID from affiliate URL
 */
function parseAffiliateUrl(
  url: string,
): { marketplace: string; productId: string; baseUrl: string } | null {
  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.replace('www.', '')

    for (const [marketplace, config] of Object.entries(MARKETPLACES)) {
      if (config.domains.some((domain) => hostname.includes(domain))) {
        // Extract product ID based on marketplace patterns
        let productId = ''

        if (marketplace === 'mercadolivre.com') {
          // Mercado Livre: /MLB123456789 or ?p=MLB123456789
          const pathMatch = parsedUrl.pathname.match(/\/(MLB\d+)/)
          if (pathMatch) {
            productId = pathMatch[1]
          } else {
            const searchParams = new URLSearchParams(parsedUrl.search)
            productId = searchParams.get('p') || ''
          }
        } else if (marketplace === 'amazon.com') {
          // Amazon: /dp/B123456789 or /gp/product/B123456789
          const pathMatch = parsedUrl.pathname.match(/\/(dp|product)\/([A-Z0-9]+)/)
          if (pathMatch) {
            productId = pathMatch[2]
          }
        } else if (marketplace === 'shopee.com') {
          // Shopee: /i.123456789 or /product/123/456
          const pathMatch = parsedUrl.pathname.match(/\/i\.(\d+)/)
          const productMatch = parsedUrl.pathname.match(/\/product\/\d+\/(\d+)/)

          if (pathMatch) {
            productId = pathMatch[1]
          } else if (productMatch) {
            productId = productMatch[1]
          }
        }

        if (productId) {
          return {
            marketplace,
            productId,
            baseUrl: `${parsedUrl.protocol}//${hostname}`,
          }
        }
      }
    }

    return null
  } catch {
    return null
  }
}

// ============================================================================
// FETCHING FUNCTIONS
// ============================================================================

/**
 * Fetch product data from Mercado Livre
 */
async function fetchMercadoLivre(productId: string): Promise<ProductFetchResult> {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${productId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = (await response.json()) as unknown
    const record = asRecord(data)

    const pictures = asArray(record?.pictures)
    const firstPicture = asRecord(pictures[0])
    const firstPictureUrl = getString(firstPicture?.url)

    const description = asRecord(record?.description)
    const reviews = asRecord(record?.reviews)
    const brand = asRecord(record?.brand)

    return {
      success: true,
      data: {
        title: getString(record?.title) ?? '',
        description: getString(description?.plain_text) || getString(record?.description),
        price: getNumber(record?.price),
        original_price: getNumber(record?.original_price),
        image: firstPictureUrl,
        thumbnail_url: firstPictureUrl,
        category: getString(record?.category_id) ?? 'unknown',
        subcategory: getString(record?.category_id),
        brand: getString(brand?.name),
        specs: (() => {
          const specs: Record<string, string | number> = {}

          const condition = getString(record?.condition)
          const soldQuantity = getNumber(record?.sold_quantity)
          const availableQuantity = getNumber(record?.available_quantity)
          const reviewsCount = getNumber(reviews?.total)
          const rating = getNumber(reviews?.rating_average)

          if (condition !== undefined) specs.condition = condition
          if (soldQuantity !== undefined) specs.sold_quantity = soldQuantity
          if (availableQuantity !== undefined) specs.available_quantity = availableQuantity
          if (reviewsCount !== undefined) specs.reviews_count = reviewsCount
          if (rating !== undefined) specs.rating = rating

          return specs
        })(),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Mercado Livre product',
    }
  }
}

/**
 * Fetch product data from Amazon (via scraping)
 */
async function fetchAmazon(productId: string): Promise<ProductFetchResult> {
  try {
    const url = `https://www.amazon.com.br/dp/${productId}`
    const result = await scrapeProduct({ url })

    if (!result.success) {
      throw new Error(result.error || 'Failed to scrape Amazon')
    }

    const title = result.title ?? ''
    const price = result.price
    const image = result.image
    const description = result.description

    return {
      success: true,
      data: {
        title,
        price,
        image,
        description,
        category: 'electronics',
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Amazon product',
    }
  }
}

/**
 * Fetch product data from Shopee
 */
async function fetchShopee(productId: string): Promise<ProductFetchResult> {
  try {
    // Attempting API fetch first as it's faster
    const response = await fetch(
      `https://shopee.com.br/api/v4/item/get?itemid=${productId}&shopid=1`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      },
    )

    if (response.ok) {
      const data = (await response.json()) as unknown
      const record = asRecord(data)
      const recordData = asRecord(record?.data)
      const item = asRecord(recordData?.item)

      if (item) {
        const priceMin = getNumber(item.price_min)
        const priceMaxBeforeDiscount = getNumber(item.price_max_before_discount)
        return {
          success: true,
          data: {
            title: getString(item.name) ?? '',
            description: getString(item.description),
            price: priceMin !== undefined ? priceMin / 100000 : undefined,
            original_price:
              priceMaxBeforeDiscount !== undefined ? priceMaxBeforeDiscount / 100000 : undefined,
            image: getString(item.image),
            thumbnail_url: getString(item.image),
            category: String(item.catid ?? ''),
            subcategory: String(asRecord(item.item_dlc)?.dlc_id ?? ''),
            brand: getString(item.brand),
            specs: (() => {
              const specs: Record<string, string | number> = {}

              const sold = getNumber(item.sold)
              const liked = getNumber(item.liked)
              const rating = getNumber(asRecord(item.item_rating)?.rating_star)
              const reviewsCount = getNumber(asRecord(item.item_rating)?.rating_count)

              if (sold !== undefined) specs.sold = sold
              if (liked !== undefined) specs.liked = liked
              if (rating !== undefined) specs.rating = rating
              if (reviewsCount !== undefined) specs.reviews_count = reviewsCount

              return specs
            })(),
          },
        }
      }
    }

    // Fallback to Hyperbrowser scraping if API fails or blocks
    console.log(`[FETCH] Shopee API failed for ${productId}, falling back to Hyperbrowser...`)
    const url = `https://shopee.com.br/product/1/${productId}`
    const result = await scrapeProduct({ url })

    if (!result.success) {
      throw new Error(result.error || 'Failed to scrape Shopee')
    }

    return {
      success: true,
      data: {
        title: result.title ?? '',
        price: result.price,
        image: result.image,
        category: 'shopee-scraping',
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Shopee product',
    }
  }
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Main function to fetch product data from affiliate link
 */
export async function fetchProductFromAffiliateLink(
  affiliateLink: string,
): Promise<ProductFetchResult> {
  const parsed = parseAffiliateUrl(affiliateLink)

  if (!parsed) {
    return {
      success: false,
      error: 'Invalid or unsupported affiliate URL',
    }
  }

  const { marketplace, productId } = parsed

  switch (marketplace) {
    case 'mercadolivre.com':
      return fetchMercadoLivre(productId)
    case 'amazon.com':
      return fetchAmazon(productId)
    case 'shopee.com':
      return fetchShopee(productId)
    default:
      return {
        success: false,
        error: `Unsupported marketplace: ${marketplace}`,
      }
  }
}

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

export const AffiliateLinkSchema = z.object({
  url: z
    .string()
    .url()
    .refine((url) => {
      const parsed = parseAffiliateUrl(url)
      return parsed !== null
    }, 'Must be a valid affiliate link from supported marketplace'),
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get marketplace info from URL
 */
export function getMarketplaceInfo(url: string): MarketplaceConfig | null {
  const parsed = parseAffiliateUrl(url)
  return parsed ? MARKETPLACES[parsed.marketplace] : null
}

/**
 * Clean and generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 80)
}

/**
 * Generate SEO metadata from product data
 */
export function generateMetadata(data: ProductFetchResult['data']) {
  if (!data) return { meta_title: '', meta_description: '' }

  return {
    meta_title: `${data.title} - ${data.category}`,
    meta_description:
      data.description?.substring(0, 160) ||
      `Compre ${data.title} com os melhores preços e ofertas.`,
    keywords: [data.title, data.category, data.brand, 'conectados', 'ofertas']
      .filter(Boolean)
      .join(', '),
  }
}
