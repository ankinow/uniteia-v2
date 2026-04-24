/**
 * Dashboard Layout Route - Auth Guard
 * SOTA 2026: Enforces authentication on all /dashboard/* routes
 *
 * Uses TanStack Router's beforeLoad to check auth before rendering.
 * In production: Validates Cloudflare Access JWT
 * In development: Bypasses with warning
 */

import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import * as React from 'react'
import { type AuthContext, getAuthContext } from '../lib/auth-middleware'

/**
 * Server function to check authentication status
 * Runs server-side via TanStack Start's createServerFn
 */
const checkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const auth = getAuthContext()
  return auth
})

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const auth = await checkAuth()

    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: { unauthorized: true },
      })
    }

    return { auth }
  },
  component: DashboardLayout,
})

const navLinkClasses = 'text-text-secondary text-sm no-underline transition hover:text-primary-600'

function DashboardLayout() {
  const { auth } = Route.useRouteContext() as { auth: AuthContext }

  return (
    <div className="min-h-screen bg-background">
      {/* Auth Status Banner */}
      {auth.isLocal && (
        <div className="bg-warning-light border-b border-warning px-4 py-2 text-xs text-warning-dark text-center">
          Development Mode - Auth bypassed. Configure CF Access for production.
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-background-elevated border-b border-border px-8 py-3 flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <a
            href="/dashboard"
            className="font-bold text-text-primary text-base no-underline"
          >
            Orquidia
          </a>
          <a href="/dashboard/content/generate" className={navLinkClasses}>
            Content
          </a>
          <a href="/dashboard/ai" className={navLinkClasses}>
            AI Studio
          </a>
          <a href="/dashboard/analytics" className={navLinkClasses}>
            Analytics
          </a>
          <a href="/dashboard/settings" className={navLinkClasses}>
            Settings
          </a>
        </div>
        <div className="text-xs text-text-muted">
          {auth.user?.email || 'Unknown'} {auth.isAdmin ? '(Admin)' : ''}
        </div>
      </nav>

      {/* Content */}
      <React.Suspense fallback={<div className="p-8">Loading...</div>}>
        <Outlet />
      </React.Suspense>
    </div>
  )
}
