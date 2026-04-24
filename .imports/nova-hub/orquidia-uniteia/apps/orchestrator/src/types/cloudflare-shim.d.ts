// =============================================================================
// Cloudflare Workers Type Shim
// Provides global type declarations for Cloudflare Workers bindings.
// Compatible with @cloudflare/workers-types structure.
// =============================================================================

export {}

declare global {
  // D1 Database
  interface D1Database {
    prepare(sql: string): D1PreparedStatement
    exec(sql: string): Promise<D1Result>
    batch<T>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
    dump(): Promise<ArrayBuffer>
  }

  interface D1PreparedStatement {
    bind(...values: (string | number | boolean | null)[]): D1PreparedStatement
    first<T = Record<string, unknown>>(): Promise<T | null>
    all<T = Record<string, unknown>>(): Promise<D1Result<T>>
    run<T = Record<string, unknown>>(): Promise<D1Result<T>>
    raw(): Promise<unknown[]>
  }

  interface D1Result<T = Record<string, unknown>> {
    results: T[]
    success: boolean
    error?: string
    meta: D1Meta
  }

  interface D1Meta {
    changed_db_size: number
    changes: number
    duration: number
    last_row_id: number
    rows_read: number
    rows_written: number
    size_after: number
    size_before: number
  }

  // KV Namespace
  interface KVNamespace {
    get(key: string, options?: KVNamespaceGetOptions): Promise<string | null>
    get<T>(key: string, options: { type: 'json' }): Promise<T | null>
    get(key: string, options: { type: 'text' }): Promise<string | null>
    get(key: string, options: { type: 'arrayBuffer' }): Promise<ArrayBuffer | null>
    get(key: string, options: { type: 'stream' }): Promise<ReadableStream | null>
    put(
      key: string,
      value: string | ArrayBuffer | ArrayBufferView | ReadableStream,
      options?: KVNamespacePutOptions,
    ): Promise<void>
    delete(key: string): Promise<void>
    list(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult>
  }

  interface KVNamespaceGetOptions {
    cacheTtl?: number
  }

  interface KVNamespacePutOptions {
    expiration?: number
    expirationTtl?: number
    metadata?: unknown
  }

  interface KVNamespaceListOptions {
    prefix?: string
    cursor?: string
    limit?: number
  }

  interface KVNamespaceListResult {
    keys: KVNamespaceListKey[]
    cursor?: string
    list_complete: boolean
  }

  interface KVNamespaceListKey {
    name: string
    expiration?: number
    metadata?: unknown
  }

  // AI Binding
  interface Ai {
    run(
      model: string,
      inputs: Record<string, unknown>,
      options?: { gateway?: { id: string; skipCache?: boolean } },
    ): Promise<unknown>
  }

  // Vectorize Index
  interface VectorizeIndex {
    query(vector: number[], options?: VectorizeQueryOptions): Promise<VectorizeQueryResult>
    insert(vectors: VectorizeVector[]): Promise<VectorizeVector[]>
    upsert(vectors: VectorizeVector[]): Promise<VectorizeVector[]>
    deleteByIds(ids: string[]): Promise<void>
    getByIds(ids: string[]): Promise<VectorizeVector[]>
    describe(): Promise<VectorizeIndexInfo>
  }

  interface VectorizeQueryOptions {
    topK?: number
    filter?: Record<string, unknown>
    returnVectors?: boolean
    namespace?: string
  }

  interface VectorizeQueryResult {
    matches: VectorizeMatch[]
    count: number
  }

  interface VectorizeMatch {
    id: string
    score: number
    vector?: number[]
    metadata?: Record<string, unknown>
  }

  interface VectorizeVector {
    id: string
    vector?: number[]
    values?: number[]
    namespace?: string
    metadata?: Record<string, unknown>
  }

  interface VectorizeIndexInfo {
    name: string
    description?: string
    config: {
      dimensions: number
      metric: 'cosine' | 'euclidean' | 'dot-product'
    }
    vectorsCount: number
  }

  // R2 Bucket
  interface R2Bucket {
    head(key: string): Promise<R2Object | null>
    get(key: string, options?: R2GetOptions): Promise<R2Object | null>
    put(
      key: string,
      value: string | ArrayBuffer | ArrayBufferView | ReadableStream | Blob,
      options?: R2PutOptions,
    ): Promise<R2Object>
    delete(keys: string | string[]): Promise<void>
    list(options?: R2ListOptions): Promise<R2ListResult>
    createMultipartUpload(key: string, options?: R2MultipartOptions): Promise<R2MultipartUpload>
    resumeMultipartUpload(key: string, uploadId: string): R2MultipartUpload
  }

  interface R2Object {
    key: string
    size: number
    etag: string
    httpEtag: string
    httpMetadata: R2HttpMetadata
    customMetadata: Record<string, string>
    range?: { offset: number; length: number }
    checksums: R2Checksums
    uploaded: Date
    version: string
  }

  interface R2HttpMetadata {
    contentType?: string
    contentLanguage?: string
    contentDisposition?: string
    contentEncoding?: string
    cacheControl?: string
    cacheExpiry?: Date
  }

  interface R2Checksums {
    md5?: ArrayBuffer
    sha1?: ArrayBuffer
    sha256?: ArrayBuffer
    sha384?: ArrayBuffer
    sha512?: ArrayBuffer
  }

  interface R2GetOptions {
    onlyIf?: R2Conditional
    range?: { offset: number; length: number }
  }

  interface R2PutOptions {
    onlyIf?: R2Conditional
    httpMetadata?: R2HttpMetadata | Headers
    customMetadata?: Record<string, string>
    md5?: ArrayBuffer | string
    sha1?: ArrayBuffer | string
    sha256?: ArrayBuffer | string
    sha384?: ArrayBuffer | string
    sha512?: ArrayBuffer | string
  }

  interface R2ListOptions {
    prefix?: string
    cursor?: string
    delimiter?: string
    startAfter?: string
    limit?: number
    include?: ('httpMetadata' | 'customMetadata')[]
  }

  interface R2ListResult {
    objects: R2Object[]
    truncated: boolean
    cursor?: string
    delimitedPrefixes: string[]
  }

  interface R2Conditional {
    etagMatches?: string
    etagDoesNotMatch?: string
    uploadedBefore?: Date
    uploadedAfter?: Date
  }

  interface R2MultipartOptions {
    httpMetadata?: R2HttpMetadata
    customMetadata?: Record<string, string>
  }

  interface R2MultipartUpload {
    key: string
    uploadId: string
    uploadPart(
      partNumber: number,
      value: ReadableStream | ArrayBuffer | string,
    ): Promise<R2UploadedPart>
    abort(): Promise<void>
    complete(uploadedParts: R2UploadedPart[]): Promise<R2Object>
  }

  interface R2UploadedPart {
    partNumber: number
    etag: string
  }

  // Durable Objects
  interface DurableObjectNamespace {
    newUniqueId(options?: { jurisdiction?: 'eu' | 'fedramp' }): DurableObjectId
    idFromName(name: string): DurableObjectId
    idFromString(id: string): DurableObjectId
    get(id: DurableObjectId, options?: { locationHint?: string }): DurableObjectStub
  }

  interface DurableObjectId {
    toString(): string
    equals(other: DurableObjectId): boolean
  }

  interface DurableObjectStub {
    fetch(request: Request): Promise<Response>
    id: DurableObjectId
    name?: string
  }

  // Queue
  interface Queue {
    send(message: unknown, options?: QueueSendOptions): Promise<void>
    sendBatch(messages: Iterable<QueueMessage>): Promise<void>
  }

  interface QueueSendOptions {
    contentType?: string
  }

  interface QueueMessage {
    body: unknown
    contentType?: string
  }

  // Rate Limit
  interface RateLimit {
    limit(options: { key: string }): Promise<RateLimitResult>
  }

  interface RateLimitResult {
    success: boolean
  }

  // Workflow
  interface Workflow {
    create(id: string, params?: Record<string, unknown>): Promise<WorkflowInstance>
  }

  interface WorkflowInstance {
    id: string
    status(): Promise<WorkflowStatus>
  }

  interface WorkflowStatus {
    status: 'running' | 'paused' | 'errored' | 'terminated' | 'complete'
  }

  // Analytics Engine
  interface AnalyticsEngineDataset {
    writeDataPoint(event: AnalyticsEngineDataPoint): void
  }

  interface AnalyticsEngineDataPoint {
    blobs?: (string | null)[]
    doubles?: (number | null)[]
    indexes?: (string | null)[]
  }

  // Global binding constants
  const DB: D1Database
  const KV_STATIC_HTML: KVNamespace
  const KV_METADATA: KVNamespace
  const CACHE: KVNamespace
  const AI: Ai
  const VECTORIZE: VectorizeIndex
  const IMAGES: R2Bucket
  const CONTENT_QUEUE: Queue

  // Secrets
  const GEMINI_API_KEY: string
  const WORKERS_AI_TOKEN: string
  const OPENROUTER_API_KEY: string
  const CLOUDFLARE_API_TOKEN: string
}
