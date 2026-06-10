import { component$ } from '@builder.io/qwik'
import { BauhausCard } from './index'

export interface BauhausArticleCardProps {
  title: string
  summary?: string | undefined
  href: string
  image?: { src: string; alt: string }
  category?: string
  score?: number
}

/**
 * BauhausArticleCard — A high-impact, geometric article card.
 * Uses bold typography and a structured grid layout.
 */
export const BauhausArticleCard = component$<BauhausArticleCardProps>(
  ({ title, summary, href, image, category, score }) => {
    return (
      <BauhausCard
        href={href}
        class="flex flex-col h-full border-b md:border-b-0 md:border-r border-[var(--color-border)] last:border-0"
      >
        <div class="flex flex-col h-full">
          {category && (
            <span class="bauhaus-label text-[var(--color-accent)] mb-6">{category}</span>
          )}

          <h3 class="bauhaus-h2 mb-4 group-hover:text-[var(--color-headline)] transition-colors">
            {title}
          </h3>

          {summary && (
            <p class="text-sm line-clamp-3 mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
              {summary}
            </p>
          )}

          <div class="mt-auto pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
            {score !== undefined && (
              <div class="flex items-center gap-2">
                <span class="bauhaus-label opacity-40">Grade</span>
                <span class="font-mono text-lg font-black tracking-tighter">
                  {score.toFixed(0)}
                </span>
              </div>
            )}
            <span class="bauhaus-label group-hover:translate-x-1 transition-transform">
              Read Brief →
            </span>
          </div>
        </div>

        {/* Optional background image on hover (premium feel) */}
        {image && (
          <div
            class="absolute inset-0 z-[-1] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
            style={{
              backgroundImage: `url(${image.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-hidden="true"
          />
        )}
      </BauhausCard>
    )
  }
)
