/**
 * Dashboard Index Route - Content Management Focus
 * Dashboard for UniTeiaAI content management platform
 */

import { createFileRoute } from '@tanstack/react-router'
import { getContentByStatus } from '../../actions/content'

export const Route = createFileRoute('/dashboard/')({
  loader: async () => {
    const contentResult = await getContentByStatus({
      data: { status: 'draft', limit: 10 },
    })

    return {
      content: contentResult.pages || [],
      error: contentResult.error || null,
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { content, error } = Route.useLoaderData()
  const contentItems = content || []

  // Show error state if DB not available
  if (error) {
    return (
      <main className="p-8 font-sans">
        <div className="bg-warning-light border border-warning p-6 rounded-lg text-warning-dark max-w-[600px]">
          <h2 className="mt-0">⚠️ Database Unavailable</h2>
          <p>{error}</p>
          <p className="text-sm mt-4">
            <strong>Solution:</strong> Run the development server with remote D1 access:
          </p>
          <code className="block bg-white p-3 rounded text-sm mt-2">
            npx wrangler dev --remote
          </code>
        </div>
      </main>
    )
  }

  return (
    <main className="p-8 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold m-0">UniTeia Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1 mb-0">
            Content Management Portal
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        <StatCard title="Draft Content" value={String(contentItems.length)} icon="📝" />
        <StatCard title="Generated Pages" value="--" icon="📄" />
        <StatCard title="Published" value="--" icon="✅" />
      </div>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-xl mb-4">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <ActionButton href="/dashboard/content/generate" label="Generate Content" />
          <ActionButton href="/dashboard/ai" label="AI Studio" />
          <ActionButton href="/dashboard/analytics" label="View Analytics" />
          <ActionButton href="/dashboard/settings" label="Settings" />
        </div>
      </section>

      {/* Recent Content */}
      <section>
        <h2 className="text-xl mb-4">Recent Content</h2>
        {contentItems.length > 0 ? (
          <div className="bg-background-elevated border border-border rounded-lg overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Created</th>
                </tr>
              </thead>
              <tbody>
                {contentItems.slice(0, 5).map(
                  (item: {
                    id: string
                    title?: string
                    status?: string
                    content_type?: string
                    created_at?: number
                  }) => (
                    <tr key={item.id} className="border-b border-border">
                      <td className="px-4 py-3">
                        <div className="font-medium">{item.title || 'Untitled'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            `px-2 py-1 rounded text-xs capitalize ` +
                            (item.status === 'published'
                              ? 'bg-success-light text-success-dark'
                              : item.status === 'review'
                                ? 'bg-warning-light text-warning-dark'
                                : 'bg-surface text-text-secondary')
                          }
                        >
                          {item.status || 'draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : '--'}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-surface p-8 rounded-lg text-center">
            <p className="text-text-muted">No content found.</p>
            <a
              href="/dashboard/content/generate"
              className="inline-block mt-2 px-4 py-2.5 bg-primary-600 text-white rounded-md no-underline text-sm font-medium"
            >
              Generate Your First Content
            </a>
          </div>
        )}
      </section>
    </main>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: string
}) {
  return (
    <div className="bg-background-elevated border border-border p-5 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-text-secondary text-sm m-0">{title}</p>
          <p className="text-2xl font-bold mt-1 mb-0">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}

function ActionButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="px-4 py-2.5 bg-primary-600 text-white rounded-md no-underline text-sm font-medium"
    >
      {label}
    </a>
  )
}
