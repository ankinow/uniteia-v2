/**
 * AI Content Generation Page
 * Generate SEO-optimized content using AI
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/ai')({
  component: AIPage,
})

function AIPage() {
  return (
    <main className="p-8 font-sans">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold m-0">AI Content Studio</h1>
            <p className="text-text-secondary text-sm mt-1 mb-0">
              Generate SEO-optimized content with AI
            </p>
          </div>
          <a
            href="/dashboard"
            className="px-4 py-2 bg-surface hover:bg-surface-hover text-text-secondary rounded-md no-underline text-sm"
          >
            ← Back
          </a>
        </div>
      </header>

      {/* Provider Status */}
      <div className="flex gap-3 mb-6 text-sm">
        <span className="bg-success-light text-success-dark px-3 py-1.5 rounded-full font-medium">
          Gemini Flash 2.0
        </span>
        <span className="bg-surface text-text-secondary px-3 py-1.5 rounded-full">
          Fallback: OpenRouter
        </span>
      </div>

      {/* Content Types Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mb-8">
        <ContentTypeCard
          title="Product Review"
          description="Generate comprehensive product reviews with pros/cons, ratings, and affiliate CTAs"
          icon="📝"
          action="/dashboard/ai/review"
        />
        <ContentTypeCard
          title="Comparison Article"
          description="Create side-by-side product comparisons to help users choose"
          icon="⚖️"
          action="/dashboard/ai/comparison"
        />
        <ContentTypeCard
          title="Buying Guide"
          description="Generate in-depth buying guides for product categories"
          icon="📚"
          action="/dashboard/ai/guide"
        />
        <ContentTypeCard
          title="Product Description"
          description="Create SEO-optimized product descriptions for landing pages"
          icon="🏷️"
          action="/dashboard/ai/description"
        />
      </div>

      {/* Quick Generate */}
      <section className="bg-background-card p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Generate</h2>
        <form className="flex gap-4">
          <input
            type="text"
            placeholder="Enter a product URL or title..."
            className="flex-1 px-4 py-3 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
          />
          <select className="px-4 py-3 border border-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-600 focus:border-primary-600">
            <option value="review">Review</option>
            <option value="description">Description</option>
            <option value="summary">Summary</option>
          </select>
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium border-none cursor-pointer"
          >
            Generate
          </button>
        </form>
      </section>

      {/* Recent Generations */}
      <section className="bg-background-elevated border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold m-0">Recent Generations</h2>
        </div>
        <div className="p-12 text-center text-text-muted">
          <p className="mb-2">No content generated yet.</p>
          <p className="text-sm">
            Use the quick generate form above or select a content type to get started.
          </p>
        </div>
      </section>

      {/* AI Chat */}
      <section className="mt-8 bg-background-elevated border border-border rounded-lg">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold m-0">AI Assistant</h2>
          <p className="text-xs text-text-muted mt-1 mb-0">
            Ask questions about products, get content suggestions, or refine generated content
          </p>
        </div>
        <div className="p-6">
          <div className="bg-background-card p-4 rounded-lg mb-4 text-sm">
            <strong className="text-primary-600">AI:</strong> Olá! Sou o assistente AI da UniTeiaAI.
            Posso ajudar você a criar conteúdo de alta qualidade para seus produtos conectados. O
            que você gostaria de gerar hoje?
          </div>
          <form className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm border-none cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

// =============================================================================
// COMPONENTS
// =============================================================================

function ContentTypeCard({
  title,
  description,
  icon,
  action,
}: {
  title: string
  description: string
  icon: string
  action: string
}) {
  return (
    <a
      href={action}
      className="block bg-background-elevated border border-border rounded-lg p-5 no-underline text-inherit hover:border-primary-600 hover:shadow-md transition-colors"
    >
      <span className="text-3xl block mb-3">{icon}</span>
      <h3 className="text-base font-semibold mt-0 mb-2">{title}</h3>
      <p className="text-sm text-text-muted m-0 leading-relaxed">{description}</p>
    </a>
  )
}
