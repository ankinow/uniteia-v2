import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main
      style={{
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Orquidia</h1>
        <p style={{ color: '#666', fontSize: '1.125rem' }}>UniTeiaAI Intelligence Orchestrator</p>
      </header>

      <section
        style={{
          background: '#f5f5f5',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>System Status</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}>✅ Orchestrator: Online</li>
          <li style={{ marginBottom: '0.5rem' }}>✅ AI Core: Ready (Gemini + OpenRouter)</li>
          <li style={{ marginBottom: '0.5rem' }}>✅ Database: D1 Connected</li>
          <li>🔐 Auth: Cloudflare Access</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Access Dashboard</h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Secure access via Cloudflare Zero Trust. Sign in to access the admin dashboard.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a
            href="/dashboard"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: '#0070f3',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '500',
            }}
          >
            Go to Dashboard
          </a>
        </div>
      </section>

      <section
        style={{
          background: '#f0f9ff',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Features</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155' }}>
          <li style={{ marginBottom: '0.5rem' }}>Product & Affiliate Management</li>
          <li style={{ marginBottom: '0.5rem' }}>AI-Powered Content Generation</li>
          <li style={{ marginBottom: '0.5rem' }}>Real-time Analytics Dashboard</li>
          <li style={{ marginBottom: '0.5rem' }}>Multi-Provider AI (Gemini, OpenRouter)</li>
          <li>Zero Trust Auth with Cloudflare</li>
        </ul>
      </section>

      <footer style={{ color: '#999', fontSize: '0.875rem' }}>
        <p>Orquidia v0.1.0 | SOTA 2026 | Edge-Native AI Platform</p>
      </footer>
    </main>
  )
}
