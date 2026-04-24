/**
 * Analytics Dashboard Page
 * Content-focused analytics dashboard
 */

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return (
    <main className="p-8 font-sans">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold m-0">Analytics</h1>
            <p className="text-text-secondary text-sm mt-1">
              Understand what content your audience prefers
            </p>
          </div>
          <div className="flex gap-2">
            <select
              className="border border-border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <a
              href="/dashboard"
              className="bg-surface hover:bg-surface-hover text-text-secondary no-underline px-4 py-2 rounded-md text-sm"
            >
              ← Back
            </a>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
        <StatCard title="Total Pages" value="--" icon="📄" description="Pages generated" />
        <StatCard title="Page Views" value="--" icon="👁️" description="Last 30 days" />
        <StatCard title="Avg. Read Time" value="--" icon="⏱️" description="Minutes" />
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
        <h2 className="text-lg font-semibold mb-2 text-primary-700 m-0">
          Analytics Dashboard
        </h2>
        <p className="text-text-muted m-0">
          Detailed analytics will be available soon. Check back for updates!
        </p>
      </div>
    </main>
  )
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string
  value: string
  icon: string
  description?: string
}) {
  return (
    <div className="bg-background-elevated border border-border p-5 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-text-muted text-sm m-0">{title}</p>
          <p className="text-2xl font-bold my-1">{value}</p>
          {description && (
            <p className="text-text-muted text-xs m-0">{description}</p>
          )}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}
