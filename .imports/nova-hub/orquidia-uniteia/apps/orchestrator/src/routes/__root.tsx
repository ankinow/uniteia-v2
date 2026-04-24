import { Outlet, createRootRoute } from '@tanstack/react-router'
import * as React from 'react'
import '../index.css'

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Orquidia - UniTeiaAI Intelligence Orchestrator' },
      { name: 'description', content: 'AI Agent Orchestration Platform' },
    ],
    links: [{ rel: 'icon', href: '/favicon.ico' }],
  }),
})

function RootComponent() {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </React.Suspense>
      </body>
    </html>
  )
}
