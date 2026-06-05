// src/routes/api/content/import/index.ts
// M2: UniTeia content import endpoint (Content Package Contract v1)
// POST /api/content/import
// Auth: Bearer <JWT> with scope content:import
// Schema: content-package-v1.json
// Rate: 10 packages/hour

import type { RequestHandler, RequestEvent } from '@builder.io/qwik-city';

// ── Config (from env or build-time) ──
const ALLOWED_SCOPES = ['content:import', 'content:write'];
const MAX_PACKAGES_PER_HOUR = 10;
const RATE_WINDOW_MS = 3600_000;

// In-memory rate limit store (resets on deploy — acceptable for SSG)
// Production: swap for CF KV or Durable Object
const rateStore = new Map<string, number[]>();

function getBearerToken(auth: string | null): string | null {
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7).trim();
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const window = now - RATE_WINDOW_MS;
  let timestamps = rateStore.get(clientId) ?? [];
  timestamps = timestamps.filter(t => t > window);
  if (timestamps.length >= MAX_PACKAGES_PER_HOUR) return false;
  timestamps.push(now);
  rateStore.set(clientId, timestamps);
  return true;
}

function validatePackageSchema(pkg: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required top-level
  if (!pkg.package_id || typeof pkg.package_id !== 'string') errors.push('package_id required (string)');
  if (!pkg.timestamp || typeof pkg.timestamp !== 'string') errors.push('timestamp required (ISO-8601)');
  if (!pkg.source || typeof pkg.source !== 'object') errors.push('source required (object)');
  if (!Array.isArray(pkg.posts) || pkg.posts.length === 0) errors.push('posts required (array, min 1)');
  if (pkg.posts && pkg.posts.length > 10) errors.push('max 10 posts per package');

  // Source validation
  if (pkg.source) {
    if (!pkg.source.agent) errors.push('source.agent required');
    if (!pkg.source.version) errors.push('source.version required');
  }

  // Post validation
  if (Array.isArray(pkg.posts)) {
    const validLangs = new Set(['pt', 'en', 'es', 'fr', 'de', 'it', 'ja', 'zh']);
    for (let i = 0; i < pkg.posts.length; i++) {
      const post = pkg.posts[i];
      if (!post.post_id) errors.push(`posts[${i}].post_id required`);
      if (!post.slug || !/^[a-z0-9-]+$/.test(post.slug)) errors.push(`posts[${i}].slug required (lowercase, hyphens)`);
      if (!post.title || post.title.length < 10) errors.push(`posts[${i}].title required (min 10 chars)`);
      if (!post.content || post.content.length < 100) errors.push(`posts[${i}].content required (min 100 chars)`);
      if (!post.lang || !validLangs.has(post.lang)) errors.push(`posts[${i}].lang must be one of: pt/en/es/fr/de/it/ja/zh`);
      if (!post.category) errors.push(`posts[${i}].category required`);
      if (post.content && post.content.length > 50000) errors.push(`posts[${i}].content max 50000 chars`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function verifySignature(pkg: any): boolean {
  // TODO: RSA signature verification with Hermes public key
  // For now: accept any non-empty signature (MVP mode)
  return typeof pkg.signature === 'string' && pkg.signature.length > 0;
}

export const onPost: RequestHandler = async (requestEvent: RequestEvent) => {
  const { request } = requestEvent
  const json = requestEvent.json.bind(requestEvent)
  // 1. Auth
  const auth = request.headers.get('Authorization');
  const token = getBearerToken(auth);
  if (!token) {
    json(401, { error: 'Unauthorized', detail: 'Bearer token required' });
    return;
  }

  // TODO: Validate JWT with Hermes public key
  // Extract client_id from JWT sub claim
  const clientId = 'hermes-daily-ops'; // placeholder

  // 2. Rate limit
  if (!checkRateLimit(clientId)) {
    json(429, {
      error: 'Too Many Requests',
      detail: `Max ${MAX_PACKAGES_PER_HOUR} packages/hour. Retry later.`,
      retry_after_seconds: 3600,
    });
    return;
  }

  // 3. Parse body
  let pkg: any;
  try {
    pkg = await request.json();
  } catch {
    json(400, { error: 'Bad Request', detail: 'Invalid JSON body' });
    return;
  }

  // 4. Schema validation
  const { valid, errors } = validatePackageSchema(pkg);
  if (!valid) {
    json(400, { error: 'Invalid package', detail: errors });
    return;
  }

  // 5. Signature verification
  if (!verifySignature(pkg)) {
    json(403, { error: 'Forbidden', detail: 'Invalid signature' });
    return;
  }

  // 6. Store posts (in-memory staging — SSG rebuild will consume)
  // In production: write to CF KV, SQLite, or trigger SSG rebuild
  const stagingId = `staging-${pkg.package_id}`;

  // Store in global staging map
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).__content_staging = (globalThis as any).__content_staging ?? {};
    (globalThis as any).__content_staging[stagingId] = {
      package: pkg,
      received_at: new Date().toISOString(),
      status: 'accepted',
    };
  }

  // 7. Queue SSG rebuild (placeholder — will integrate with wrangler deploy)
  console.log(`[content-import] Accepted ${stagingId}: ${pkg.posts.length} posts`);

  json(202, {
    status: 'accepted',
    staging_id: stagingId,
    package_id: pkg.package_id,
    posts_count: pkg.posts.length,
    estimated_rebuild_seconds: 120,
  });
};
