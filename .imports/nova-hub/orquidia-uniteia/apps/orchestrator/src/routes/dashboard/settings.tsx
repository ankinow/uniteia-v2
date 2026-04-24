/**
 * Settings Page - Orquidia Ops Center configuration
 * Manage connections and local system preferences.
 */

import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  type ServiceName,
  type SettingsData,
  getSettings,
  saveSystemSettings as saveSystemSettingsAction,
  testService,
} from '../../actions/settings'

export const Route = createFileRoute('/dashboard/settings')({
  loader: async () => {
    const settings = (await getSettings()) as SettingsData
    return { settings }
  },
  component: SettingsPage,
})

function SettingsPage() {
  const { settings: initialSettings } = Route.useLoaderData()
  const [settings, setSettings] = useState<SettingsData>(initialSettings)

  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<
    Partial<Record<ServiceName, { success: boolean; message: string }>>
  >({})

  useEffect(() => {
    setSettings(initialSettings)
  }, [initialSettings])

  const testConnection = async (service: ServiceName) => {
    setIsLoading(true)
    setTestResults((prev: Partial<Record<ServiceName, { success: boolean; message: string }>>) => ({
      ...prev,
      [service]: { success: false, message: 'Testing...' },
    }))

    try {
      const result = (await testService({ data: { service } })) as {
        success: boolean
        message?: string
      }

      setTestResults(
        (prev: Partial<Record<ServiceName, { success: boolean; message: string }>>) => ({
          ...prev,
          [service]: {
            success: result.success,
            message:
              result.message || (result.success ? 'Connection successful!' : 'Connection failed'),
          },
        }),
      )

      // Update settings status
      setSettings((prev: SettingsData) => ({
        ...prev,
        [service]: {
          ...prev[service],
          status: result.success ? 'valid' : 'invalid',
          lastTested: new Date().toISOString(),
        },
      }))
    } catch (error) {
      setTestResults(
        (prev: Partial<Record<ServiceName, { success: boolean; message: string }>>) => ({
          ...prev,
          [service]: {
            success: false,
            message: error instanceof Error ? error.message : 'Test failed',
          },
        }),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const persistSystemSettings = async () => {
    setIsLoading(true)
    try {
      const result = (await saveSystemSettingsAction({ data: settings.system })) as {
        success: boolean
      }
      if (result.success) alert('Settings saved successfully!')
      else alert('Failed to save settings')
    } catch (error) {
      alert(`Error saving settings: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return '#16a34a'
      case 'invalid':
        return '#dc2626'
      default:
        return '#9ca3af'
    }
  }

  const getStatusBgColor = (status: string) => {
    const color = getStatusColor(status)
    return `${color}20`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return 'OK'
      case 'invalid':
        return 'ERR'
      default:
        return '...'
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px' }}>
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <a href="/dashboard" style={{ color: '#6b7280', textDecoration: 'none' }}>
            Back to Dashboard
          </a>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Settings</h1>
        <p style={{ color: '#666', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
          Configure API keys, connections, and system preferences
        </p>
      </header>

      {/* API Connections */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>
          API Connections
        </h2>

        {/* Hyperbrowser */}
        <div
          style={{
            background: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #e5e5e5',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.125rem', margin: 0, fontWeight: '600' }}>Hyperbrowser</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                Cloud-based browser automation for product scraping
              </p>
            </div>
            <span
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                background: getStatusBgColor(settings.hyperbrowser.status),
                color: getStatusColor(settings.hyperbrowser.status),
              }}
            >
              {getStatusIcon(settings.hyperbrowser.status)} {settings.hyperbrowser.status}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => testConnection('hyperbrowser')}
              disabled={isLoading}
              style={{
                padding: '0.5rem 1rem',
                background: isLoading ? '#94a3b8' : '#0ea5e9',
                color: '#fff',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.875rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            {testResults.hyperbrowser && (
              <span
                style={{
                  fontSize: '0.875rem',
                  color: testResults.hyperbrowser.success ? '#16a34a' : '#dc2626',
                }}
              >
                {testResults.hyperbrowser.message}
              </span>
            )}
          </div>

          {settings.hyperbrowser.lastTested && (
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.75rem' }}>
              Last tested: {new Date(settings.hyperbrowser.lastTested).toLocaleString()}
            </p>
          )}
        </div>

        {/* Gemini */}
        <div
          style={{
            background: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #e5e5e5',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.125rem', margin: 0, fontWeight: '600' }}>Gemini AI</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                Google's AI for content generation and analysis
              </p>
            </div>
            <span
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                background: getStatusBgColor(settings.gemini.status),
                color: getStatusColor(settings.gemini.status),
              }}
            >
              {getStatusIcon(settings.gemini.status)} {settings.gemini.status}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => testConnection('gemini')}
              disabled={isLoading}
              style={{
                padding: '0.5rem 1rem',
                background: isLoading ? '#94a3b8' : '#0ea5e9',
                color: '#fff',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.875rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            {testResults.gemini && (
              <span
                style={{
                  fontSize: '0.875rem',
                  color: testResults.gemini.success ? '#16a34a' : '#dc2626',
                }}
              >
                {testResults.gemini.message}
              </span>
            )}
          </div>

          {settings.gemini.lastTested && (
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.75rem' }}>
              Last tested: {new Date(settings.gemini.lastTested).toLocaleString()}
            </p>
          )}
        </div>

        {/* Cloudflare */}
        <div
          style={{
            background: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #e5e5e5',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.125rem', margin: 0, fontWeight: '600' }}>Cloudflare</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                D1 Database and edge deployment
              </p>
            </div>
            <span
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                background: getStatusBgColor(settings.cloudflare.status),
                color: getStatusColor(settings.cloudflare.status),
              }}
            >
              {getStatusIcon(settings.cloudflare.status)} {settings.cloudflare.status}
            </span>
          </div>

          {settings.cloudflare.d1Database && (
            <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
              <p>Database binding: {settings.cloudflare.d1Database}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => testConnection('cloudflare')}
              disabled={isLoading}
              style={{
                padding: '0.5rem 1rem',
                background: isLoading ? '#94a3b8' : '#0ea5e9',
                color: '#fff',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.875rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            {testResults.cloudflare && (
              <span
                style={{
                  fontSize: '0.875rem',
                  color: testResults.cloudflare.success ? '#16a34a' : '#dc2626',
                }}
              >
                {testResults.cloudflare.message}
              </span>
            )}
          </div>

          {settings.cloudflare.lastTested && (
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.75rem' }}>
              Last tested: {new Date(settings.cloudflare.lastTested).toLocaleString()}
            </p>
          )}
        </div>
      </section>

      {/* System Settings */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>
          System Settings
        </h2>

        <div
          style={{
            background: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e5e5',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Memory Limit */}
            <div>
              <label
                htmlFor="memoryLimit"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Memory Safety Limit (MB)
              </label>
              <input
                id="memoryLimit"
                type="number"
                value={settings.system.memoryLimit}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    system: { ...prev.system, memoryLimit: Number(e.target.value) },
                  }))
                }
                min="200"
                max="1000"
                style={{
                  width: '200px',
                  padding: '0.5rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                }}
              />
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                Operations will abort if free memory falls below this threshold
              </p>
            </div>

            {/* Max Concurrent Operations */}
            <div>
              <label
                htmlFor="maxConcurrentOps"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Max Concurrent Operations
              </label>
              <select
                id="maxConcurrentOps"
                value={settings.system.maxConcurrentOps}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    system: { ...prev.system, maxConcurrentOps: Number(e.target.value) },
                  }))
                }
                style={{
                  width: '200px',
                  padding: '0.5rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                }}
              >
                <option value={1}>1 (Safest)</option>
                <option value={2}>2 (Recommended)</option>
                <option value={3}>3 (Risky)</option>
              </select>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                Higher values increase speed but risk memory exhaustion
              </p>
            </div>

            {/* Content Tone */}
            <div>
              <label
                htmlFor="contentTone"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Default Content Tone
              </label>
              <select
                id="contentTone"
                value={settings.system.contentTone}
                onChange={(e) =>
                  setSettings((prev: SettingsData) => ({
                    ...prev,
                    system: {
                      ...prev.system,
                      contentTone: e.target.value as SettingsData['system']['contentTone'],
                    },
                  }))
                }
                style={{
                  width: '200px',
                  padding: '0.5rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                }}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="technical">Technical</option>
                <option value="persuasive">Persuasive</option>
              </select>
            </div>

            {/* Auto Publish */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id="autoPublish"
                checked={settings.system.autoPublish}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    system: { ...prev.system, autoPublish: e.target.checked },
                  }))
                }
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
              <label htmlFor="autoPublish" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                Auto-publish generated content (skip review)
              </label>
            </div>
          </div>

          <div
            style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e5e5' }}
          >
            <button
              type="button"
              onClick={persistSystemSettings}
              disabled={isLoading}
              style={{
                padding: '0.625rem 1.5rem',
                background: isLoading ? '#94a3b8' : '#0070f3',
                color: '#fff',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </section>

      {/* System Info */}
      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>
          System Information
        </h2>

        <div
          style={{
            background: '#f0f9ff',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #0ea5e9',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Version</p>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: '0.25rem 0 0' }}>
                Orquidia v0.1.0
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Architecture</p>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: '0.25rem 0 0' }}>
                Local-Only Minimal
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                AGENTIC∞ Compliance
              </p>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: '0.25rem 0 0' }}>
                RSIP + MA-ToT + Eval-Dim
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Hardware Profile</p>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: '0.25rem 0 0' }}>
                Low-RAM Optimized (3.7GB)
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
