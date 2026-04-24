/**
 * Audit System for Orquidia Ops Center
 * SOTA 2026: Comprehensive audit logging for compliance
 *
 * Logs all admin actions to D1 audit_logs table
 */

import { getEvent } from 'vinxi/http'
import { getAuthContext } from './auth-middleware'

export interface AuditLogEntry {
  id: string
  timestamp: number
  userEmail: string
  userId?: string
  action: AuditAction
  resourceType: ResourceType
  resourceId?: string
  details?: Record<string, unknown>
  ipHash?: string
  userAgent?: string
  success: boolean
}

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'unpublish'
  | 'login'
  | 'logout'
  | 'settings_change'
  | 'api_key_test'
  | 'workflow_start'
  | 'workflow_complete'
  | 'workflow_failed'
  | 'content_generate'
  | 'content_review'
  | 'bulk_operation'

export type ResourceType =
  | 'product'
  | 'content_page'
  | 'generated_content'
  | 'category'
  | 'settings'
  | 'user'
  | 'workflow'
  | 'system'

interface BindingEnv {
  DB?: D1Database
}

function getDB(): D1Database | null {
  const event = getEvent()
  if (!event) return null
  return (event.context as { cloudflare?: { env?: BindingEnv } }).cloudflare?.env?.DB ?? null
}

function hashIP(ip: string): string {
  // Simple hash for privacy - in production use a proper hash
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return `ip-${Math.abs(hash).toString(16)}`
}

/**
 * Log an audit event to D1
 */
export async function logAuditEvent(
  action: AuditAction,
  resourceType: ResourceType,
  options: {
    resourceId?: string
    details?: Record<string, unknown>
    success?: boolean
  } = {},
): Promise<void> {
  const db = getDB()
  if (!db) {
    console.warn('[AUDIT] D1 not available, logging to console only')
    console.log('[AUDIT]', { action, resourceType, ...options })
    return
  }

  try {
    const auth = await getAuthContext()
    const event = getEvent()
    // Get headers from the request object (may be undefined in CLI mode)
    const headers = event?.node?.req?.headers || {}

    const ip = String(headers['cf-connecting-ip'] || headers['x-forwarded-for'] || 'unknown')
    const userAgent = headers['user-agent'] as string | undefined

    const userEmail = auth?.user?.email || 'anonymous'
    const userId = auth?.user?.sub

    const logEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: Math.floor(Date.now() / 1000),
      userEmail,
      userId,
      action,
      resourceType,
      resourceId: options.resourceId,
      details: options.details,
      ipHash: ip !== 'unknown' ? hashIP(ip) : undefined,
      userAgent,
      success: options.success ?? true,
    }

    await db
      .prepare(
        `INSERT INTO audit_logs (
          id, timestamp, user_email, user_id, action, resource_type,
          resource_id, details, ip_hash, user_agent, success
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        logEntry.id,
        logEntry.timestamp,
        logEntry.userEmail,
        logEntry.userId || null,
        logEntry.action,
        logEntry.resourceType,
        logEntry.resourceId || null,
        logEntry.details ? JSON.stringify(logEntry.details) : null,
        logEntry.ipHash || null,
        logEntry.userAgent || null,
        logEntry.success ? 1 : 0,
      )
      .run()

    console.log('[AUDIT] Logged:', action, resourceType, options.resourceId)
  } catch (error) {
    console.error('[AUDIT] Failed to log audit event:', error)
    // Don't throw - audit logging should not break main functionality
  }
}

/**
 * Log product creation
 */
export async function logProductCreate(
  productId: string,
  productData: Record<string, unknown>,
): Promise<void> {
  await logAuditEvent('create', 'product', {
    resourceId: productId,
    details: { product: sanitizeProductData(productData) },
    success: true,
  })
}

/**
 * Log product update
 */
export async function logProductUpdate(
  productId: string,
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): Promise<void> {
  await logAuditEvent('update', 'product', {
    resourceId: productId,
    details: {
      before: sanitizeProductData(before),
      after: sanitizeProductData(after),
      changedFields: getChangedFields(before, after),
    },
    success: true,
  })
}

/**
 * Log product deletion
 */
export async function logProductDelete(
  productId: string,
  productData: Record<string, unknown>,
): Promise<void> {
  await logAuditEvent('delete', 'product', {
    resourceId: productId,
    details: { product: sanitizeProductData(productData) },
    success: true,
  })
}

/**
 * Log content generation
 */
export async function logContentGeneration(
  contentId: string,
  workflowId: string,
  model: string,
): Promise<void> {
  await logAuditEvent('content_generate', 'content_page', {
    resourceId: contentId,
    details: { workflowId, model },
    success: true,
  })
}

/**
 * Log workflow events
 */
export async function logWorkflowEvent(
  workflowId: string,
  event: 'start' | 'complete' | 'fail',
  details?: Record<string, unknown>,
): Promise<void> {
  const action =
    event === 'start'
      ? 'workflow_start'
      : event === 'complete'
        ? 'workflow_complete'
        : 'workflow_start'

  await logAuditEvent(action, 'workflow', {
    resourceId: workflowId,
    details,
    success: event !== 'fail',
  })
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(options: {
  userEmail?: string
  action?: AuditAction
  resourceType?: ResourceType
  resourceId?: string
  startTime?: number
  endTime?: number
  limit?: number
  offset?: number
}): Promise<{ logs: AuditLogEntry[]; total: number }> {
  const db = getDB()
  if (!db) {
    return { logs: [], total: 0 }
  }

  const conditions: string[] = []
  const params: (string | number)[] = []

  if (options.userEmail) {
    conditions.push('user_email = ?')
    params.push(options.userEmail)
  }
  if (options.action) {
    conditions.push('action = ?')
    params.push(options.action)
  }
  if (options.resourceType) {
    conditions.push('resource_type = ?')
    params.push(options.resourceType)
  }
  if (options.resourceId) {
    conditions.push('resource_id = ?')
    params.push(options.resourceId)
  }
  if (options.startTime) {
    conditions.push('timestamp >= ?')
    params.push(options.startTime)
  }
  if (options.endTime) {
    conditions.push('timestamp <= ?')
    params.push(options.endTime)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const limit = options.limit ?? 50
  const offset = options.offset ?? 0

  try {
    const countResult = await db
      .prepare(`SELECT COUNT(*) as total FROM audit_logs ${whereClause}`)
      .bind(...params)
      .first<{ total: number }>()

    const logsResult = await db
      .prepare(
        `SELECT * FROM audit_logs ${whereClause}
         ORDER BY timestamp DESC
         LIMIT ? OFFSET ?`,
      )
      .bind(...params, limit, offset)
      .all<{
        id: string
        timestamp: number
        user_email: string
        user_id?: string
        action: AuditAction
        resource_type: ResourceType
        resource_id?: string
        details?: string
        ip_hash?: string
        user_agent?: string
        success: number
      }>()

    const logs = (logsResult.results ?? []).map(
      (row: {
        id: string
        timestamp: number
        user_email: string
        user_id?: string
        action: AuditAction
        resource_type: ResourceType
        resource_id?: string
        details?: string
        ip_hash?: string
        user_agent?: string
        success: number
      }) => ({
        id: row.id,
        timestamp: row.timestamp,
        userEmail: row.user_email,
        userId: row.user_id,
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id,
        details: row.details ? JSON.parse(row.details) : undefined,
        ipHash: row.ip_hash,
        userAgent: row.user_agent,
        success: Boolean(row.success),
      }),
    )

    return {
      logs,
      total: countResult?.total ?? 0,
    }
  } catch (error) {
    console.error('[AUDIT] Failed to query audit logs:', error)
    return { logs: [], total: 0 }
  }
}

// Helper functions
function sanitizeProductData(data: Record<string, unknown>): Record<string, unknown> {
  // Remove sensitive fields from audit logs
  const sensitive = ['affiliate_link', 'api_key', 'password', 'token']
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(data)) {
    if (!sensitive.includes(key)) {
      sanitized[key] = value
    } else {
      sanitized[key] = '[REDACTED]'
    }
  }

  return sanitized
}

function getChangedFields(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): string[] {
  const changed: string[] = []

  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changed.push(key)
    }
  }

  return changed
}
