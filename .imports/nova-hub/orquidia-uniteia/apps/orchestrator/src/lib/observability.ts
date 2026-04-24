/**
 * Observability System for Orquidia Ops Center
 * SOTA 2026: Metrics, alerts, and audit trails
 *
 * Features:
 * - Performance metrics (DB latency, AI generation time)
 * - Business metrics (content created, products added)
 * - Error tracking and alerting
 * - Integration with audit logs
 */

import { getEvent } from 'vinxi/http'

export interface MetricPoint {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

export interface AlertConfig {
  name: string
  condition: 'gt' | 'lt' | 'eq'
  threshold: number
  duration: number // seconds
  severity: 'warning' | 'critical'
}

interface BindingEnv {
  DB?: D1Database
}

function getBindings(): BindingEnv {
  const event = getEvent()
  return (event.context as { cloudflare?: { env?: BindingEnv } }).cloudflare?.env ?? {}
}

// In-memory metrics buffer (flushed to D1 periodically)
const metricsBuffer: MetricPoint[] = []
let lastFlush = Date.now()
const FLUSH_INTERVAL = 60000 // 1 minute

/**
 * Record a metric point
 */
export function recordMetric(name: string, value: number, tags?: Record<string, string>): void {
  const metric: MetricPoint = {
    name,
    value,
    timestamp: Date.now(),
    tags,
  }

  metricsBuffer.push(metric)

  // Flush if buffer is large or interval passed
  if (metricsBuffer.length > 100 || Date.now() - lastFlush > FLUSH_INTERVAL) {
    flushMetrics().catch(console.error)
  }
}

/**
 * Flush metrics buffer to D1
 */
async function flushMetrics(): Promise<void> {
  if (metricsBuffer.length === 0) return

  const db = getBindings().DB
  if (!db) {
    // Console fallback
    console.log('[METRICS]', JSON.stringify(metricsBuffer))
    metricsBuffer.length = 0
    return
  }

  try {
    const batch = metricsBuffer.splice(0, metricsBuffer.length)

    for (const metric of batch) {
      await db
        .prepare(
          `INSERT INTO metrics (
            id, name, value, timestamp, tags
          ) VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(
          crypto.randomUUID(),
          metric.name,
          metric.value,
          metric.timestamp,
          metric.tags ? JSON.stringify(metric.tags) : null,
        )
        .run()
    }

    lastFlush = Date.now()
  } catch (error) {
    console.error('[METRICS] Failed to flush:', error)
  }
}

/**
 * Track operation timing
 */
export async function trackOperation<T>(
  name: string,
  operation: () => Promise<T>,
  tags?: Record<string, string>,
): Promise<T> {
  const start = Date.now()

  try {
    const result = await operation()
    const duration = Date.now() - start

    recordMetric(`${name}_duration`, duration, { ...tags, status: 'success' })
    recordMetric(`${name}_count`, 1, { ...tags, status: 'success' })

    return result
  } catch (error) {
    const duration = Date.now() - start

    recordMetric(`${name}_duration`, duration, { ...tags, status: 'error' })
    recordMetric(`${name}_count`, 1, { ...tags, status: 'error' })
    recordMetric(`${name}_errors`, 1, {
      ...tags,
      error: error instanceof Error ? error.name : 'unknown',
    })

    throw error
  }
}

/**
 * Get metrics summary
 */
export async function getMetricsSummary(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<{
  totalRequests: number
  avgLatency: number
  errorRate: number
  topOperations: Array<{ name: string; count: number; avgDuration: number }>
}> {
  const db = getBindings().DB
  if (!db) {
    return {
      totalRequests: 0,
      avgLatency: 0,
      errorRate: 0,
      topOperations: [],
    }
  }

  const since =
    Date.now() -
    {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }[timeRange]

  try {
    // Total requests
    const totalResult = await db
      .prepare('SELECT COUNT(*) as count FROM metrics WHERE timestamp >= ?')
      .bind(since)
      .first<{ count: number }>()

    // Average latency
    const latencyResult = await db
      .prepare(
        'SELECT AVG(value) as avg FROM metrics WHERE name LIKE "%_duration" AND timestamp >= ?',
      )
      .bind(since)
      .first<{ avg: number }>()

    // Error rate
    const errorsResult = await db
      .prepare(
        'SELECT COUNT(*) as count FROM metrics WHERE name LIKE "%_errors" AND timestamp >= ?',
      )
      .bind(since)
      .first<{ count: number }>()

    // Top operations
    const operationsResult = await db
      .prepare(
        `SELECT
          name,
          COUNT(*) as count,
          AVG(value) as avg_duration
        FROM metrics
        WHERE name LIKE "%_duration" AND timestamp >= ?
        GROUP BY name
        ORDER BY count DESC
        LIMIT 10`,
      )
      .bind(since)
      .all<{ name: string; count: number; avg_duration: number }>()

    const total = totalResult?.count ?? 0
    const errors = errorsResult?.count ?? 0

    return {
      totalRequests: total,
      avgLatency: Math.round(latencyResult?.avg ?? 0),
      errorRate: total > 0 ? Math.round((errors / total) * 100) : 0,
      topOperations: (operationsResult.results ?? []).map(
        (op: { name: string; count: number; avg_duration: number }) => ({
          name: op.name.replace('_duration', ''),
          count: op.count,
          avgDuration: Math.round(op.avg_duration),
        }),
      ),
    }
  } catch (error) {
    console.error('[METRICS] Failed to get summary:', error)
    return {
      totalRequests: 0,
      avgLatency: 0,
      errorRate: 0,
      topOperations: [],
    }
  }
}

/**
 * Alert system
 */
export class AlertManager {
  private alerts: Map<string, AlertConfig> = new Map()
  private triggered: Map<string, number> = new Map()

  registerAlert(config: AlertConfig): void {
    this.alerts.set(config.name, config)
  }

  async check(metricName: string, value: number): Promise<void> {
    for (const [name, config] of this.alerts) {
      if (!metricName.includes(name)) continue

      const triggered = this.checkCondition(value, config)
      const lastTriggered = this.triggered.get(name) ?? 0

      if (triggered && Date.now() - lastTriggered > config.duration * 1000) {
        this.triggered.set(name, Date.now())
        await this.sendAlert(config, metricName, value)
      }
    }
  }

  private checkCondition(value: number, config: AlertConfig): boolean {
    switch (config.condition) {
      case 'gt':
        return value > config.threshold
      case 'lt':
        return value < config.threshold
      case 'eq':
        return value === config.threshold
      default:
        return false
    }
  }

  private async sendAlert(config: AlertConfig, metric: string, value: number): Promise<void> {
    const alert = {
      timestamp: new Date().toISOString(),
      severity: config.severity,
      alert: config.name,
      metric,
      value,
      threshold: config.threshold,
    }

    console.error('[ALERT]', JSON.stringify(alert))

    // Store in D1 for tracking
    const db = getBindings().DB
    if (db) {
      await db
        .prepare(
          `INSERT INTO alerts (
            id, timestamp, severity, name, metric, value, threshold
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          crypto.randomUUID(),
          Date.now(),
          config.severity,
          config.name,
          metric,
          value,
          config.threshold,
        )
        .run()
    }
  }
}

// Global alert manager
export const alertManager = new AlertManager()

// Register default alerts
alertManager.registerAlert({
  name: 'high_db_latency',
  condition: 'gt',
  threshold: 1000, // 1 second
  duration: 300, // 5 minutes
  severity: 'warning',
})

alertManager.registerAlert({
  name: 'high_error_rate',
  condition: 'gt',
  threshold: 10, // 10% error rate
  duration: 300,
  severity: 'critical',
})

alertManager.registerAlert({
  name: 'ai_generation_slow',
  condition: 'gt',
  threshold: 30000, // 30 seconds
  duration: 600,
  severity: 'warning',
})

/**
 * Dashboard metrics for UI
 */
export async function getDashboardMetrics(): Promise<{
  products: { total: number; active: number; published: number }
  content: { total: number; draft: number; review: number; published: number }
  workflows: { running: number; completed: number; failed: number }
  recentActivity: Array<{
    action: string
    user: string
    resource: string
    timestamp: number
  }>
}> {
  const db = getBindings().DB
  if (!db) {
    return {
      products: { total: 0, active: 0, published: 0 },
      content: { total: 0, draft: 0, review: 0, published: 0 },
      workflows: { running: 0, completed: 0, failed: 0 },
      recentActivity: [],
    }
  }

  try {
    // Product counts
    const productsResult = await db
      .prepare(
        `SELECT
          COUNT(*) as total,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN publish_status = 'published' THEN 1 ELSE 0 END) as published
        FROM products`,
      )
      .first<{ total: number; active: number; published: number }>()

    // Content counts
    const contentResult = await db
      .prepare(
        `SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
          SUM(CASE WHEN status = 'review' THEN 1 ELSE 0 END) as review,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published
        FROM content_pages`,
      )
      .first<{ total: number; draft: number; review: number; published: number }>()

    // Workflow counts
    const workflowsResult = await db
      .prepare(
        `SELECT
          SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
        FROM workflows`,
      )
      .first<{ running: number; completed: number; failed: number }>()

    // Recent activity from audit logs
    const activityResult = await db
      .prepare(
        `SELECT action, user_email, resource_type, timestamp
        FROM audit_logs
        ORDER BY timestamp DESC
        LIMIT 10`,
      )
      .all<{ action: string; user_email: string; resource_type: string; timestamp: number }>()

    return {
      products: {
        total: productsResult?.total ?? 0,
        active: productsResult?.active ?? 0,
        published: productsResult?.published ?? 0,
      },
      content: {
        total: contentResult?.total ?? 0,
        draft: contentResult?.draft ?? 0,
        review: contentResult?.review ?? 0,
        published: contentResult?.published ?? 0,
      },
      workflows: {
        running: workflowsResult?.running ?? 0,
        completed: workflowsResult?.completed ?? 0,
        failed: workflowsResult?.failed ?? 0,
      },
      recentActivity: (activityResult.results ?? []).map(
        (row: {
          action: string
          user_email: string
          resource_type: string
          timestamp: number
        }) => ({
          action: row.action,
          user: row.user_email,
          resource: row.resource_type,
          timestamp: row.timestamp,
        }),
      ),
    }
  } catch (error) {
    console.error('[METRICS] Failed to get dashboard metrics:', error)
    return {
      products: { total: 0, active: 0, published: 0 },
      content: { total: 0, draft: 0, review: 0, published: 0 },
      workflows: { running: 0, completed: 0, failed: 0 },
      recentActivity: [],
    }
  }
}
