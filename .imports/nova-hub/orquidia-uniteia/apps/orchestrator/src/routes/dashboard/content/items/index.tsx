/**
 * Content Items List - Pure Content Management
 * Lista todos os conteúdos criados no sistema
 */

import { createFileRoute } from '@tanstack/react-router'
import { getContentByStatus } from '../../../../actions/content'

export const Route = createFileRoute('/dashboard/content/items/')({
  loader: async () => {
    const result = await getContentByStatus({
      data: { status: 'published', limit: 50 },
    })

    return {
      content: result.pages || [],
      error: result.error || null,
    }
  },
  component: ContentItemsPage,
})

function ContentItemsPage() {
  const { content, error } = Route.useLoaderData()
  const items = content || []

  if (error) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            padding: '1rem',
            borderRadius: '8px',
            color: '#92400e',
          }}
        >
          <strong>⚠️ Database Unavailable</strong>
          <p>{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Content Items</h1>
          <p style={{ color: '#666', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
            Manage your generated content ({items.length} items)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="/dashboard/content/generate"
            style={{
              padding: '0.625rem 1rem',
              background: '#0070f3',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            + New Content
          </a>
          <a
            href="/dashboard"
            style={{
              padding: '0.625rem 1rem',
              background: '#f5f5f5',
              color: '#333',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            ← Back
          </a>
        </div>
      </header>

      {/* Content Table */}
      {items.length > 0 ? (
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e5e5' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '500' }}>
                  Title
                </th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '500' }}>
                  Type
                </th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '500' }}>
                  Status
                </th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '500' }}>
                  Created
                </th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '500' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map(
                (item: {
                  id: string
                  title?: string
                  template_type?: string
                  status?: string
                  content_type?: string
                  created_at?: number
                  slug?: string
                }) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: '500' }}>{item.title || 'Untitled'}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        {item.slug ? `/${item.slug}` : ''}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          background: '#f3f4f6',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          textTransform: 'capitalize',
                        }}
                      >
                        {item.template_type || 'hub'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <span
                        style={{
                          background:
                            item.status === 'published'
                              ? '#dcfce7'
                              : item.status === 'review'
                                ? '#fef3c7'
                                : '#f3f4f6',
                          color:
                            item.status === 'published'
                              ? '#166534'
                              : item.status === 'review'
                                ? '#92400e'
                                : '#374151',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          textTransform: 'capitalize',
                        }}
                      >
                        {item.status || 'draft'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : '--'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <a
                        href={`/dashboard/content/items/${item.id}`}
                        style={{ color: '#0070f3', textDecoration: 'none', fontSize: '0.875rem' }}
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            background: '#f9fafb',
            padding: '3rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No content found in database.</p>
          <a
            href="/dashboard/content/generate"
            style={{
              padding: '0.625rem 1rem',
              background: '#0070f3',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            + Create First Content
          </a>
        </div>
      )}
    </main>
  )
}
