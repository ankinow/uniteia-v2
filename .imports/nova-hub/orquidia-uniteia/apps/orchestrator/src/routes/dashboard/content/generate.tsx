/**
 * Generate Content - Pure Educational Content (NEU)
 *
 * UniTeia portal: Create AI-generated educational/informational content
 * Focus on topics, guides, and hub pages without affiliate marketing.
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { createContentWorkflow } from '../../../actions/content'

export const Route = createFileRoute('/dashboard/content/generate')({
  component: GenerateContentPage,
})

type ContentType = 'hub' | 'comparison' | 'guide' | 'ranking'

function GenerateContentPage() {
  const [topic, setTopic] = useState('')
  const [contentType, setContentType] = useState<ContentType>('hub')
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState<'professional' | 'casual' | 'enthusiastic' | 'informative'>(
    'informative',
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ workflowId: string } | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await createContentWorkflow({
        data: {
          name: topic.trim(),
          templateType: contentType,
          keywords: [],
          tone,
          maxPages: 3,
          autoPublish: false,
          seoOptimize: true,
        },
      })

      if (!res.success) {
        setError(res.error || 'Failed to create workflow')
        return
      }

      setResult({ workflowId: res.workflowId })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="p-8 max-w-[900px] mx-auto font-sans">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold m-0">Generate Content</h1>
            <p className="mt-1 mb-0 text-text-secondary text-sm">
              Create educational content for UniTeia. Enter a topic to generate AI-powered articles.
            </p>
          </div>
          <a
            href="/dashboard"
            className="bg-surface hover:bg-surface-hover text-text-secondary no-underline px-4 py-2 rounded-md text-sm"
          >
            ← Back
          </a>
        </div>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <section
          className="bg-background-card border border-border p-5 rounded-lg"
        >
          <div className="flex flex-col gap-4">
            {/* Topic Input */}
            <div>
              <label
                htmlFor="topic"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                }}
              >
                Content Topic *
              </label>
              <input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., History of Traditional Art, Beginner Guide to Watercolor..."
                required
                type="text"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #0ea5e9',
                  fontSize: '1rem',
                }}
              />
            </div>

            {/* Content Type & Tone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label
                  htmlFor="contentType"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                  }}
                >
                  Content Type
                </label>
                <select
                  id="contentType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5',
                    background: '#fff',
                  }}
                >
                  <option value="hub">Hub (Overview Page)</option>
                  <option value="comparison">Comparison</option>
                  <option value="guide">Guide</option>
                  <option value="ranking">Ranking</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="tone"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                  }}
                >
                  Writing Tone
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as typeof tone)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5',
                    background: '#fff',
                  }}
                >
                  <option value="informative">Informative</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>
            </div>

            {/* Extra Prompt */}
            <div>
              <label
                htmlFor="prompt"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                }}
              >
                Additional Instructions (optional)
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="e.g., Focus on beginner concepts, include historical context, add practical examples..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                }}
              />
            </div>
          </div>
        </section>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #ef4444',
              color: '#991b1b',
              padding: '0.75rem',
              borderRadius: '8px',
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #22c55e',
              color: '#166534',
              padding: '0.75rem',
              borderRadius: '8px',
            }}
          >
            Workflow created successfully!
            <div style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.8 }}>
              Workflow ID: {result.workflowId}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: isLoading ? '#94a3b8' : '#0f172a',
              color: '#fff',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Creating...' : 'Generate Content'}
          </button>
        </div>
      </form>

      {/* Content Type Info */}
      <section style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e5e5' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
          Content Types Guide
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Hub</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              Overview page with multiple sub-topics and navigation to related content.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
              Comparison
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              Side-by-side analysis of different approaches, techniques, or materials.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Guide</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              Step-by-step instructions or comprehensive how-to articles.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
              Ranking
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              Top lists, best-of recommendations, or rated collections.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
