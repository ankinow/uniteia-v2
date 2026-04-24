-- Orquidia-uniteia D1 Schema
-- SOTA 2026: UniTeiaAI Admin & Edge-Native Platform

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    thumbnail_url TEXT,
    affiliate_link TEXT NOT NULL,
    price REAL,
    price_original REAL,
    discount_percentage REAL,
    category TEXT NOT NULL,
    subcategory TEXT,
    brand TEXT,
    score INTEGER DEFAULT 0,
    priority INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE,
    specs TEXT, -- JSON string
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT, -- JSON string or comma-separated
    created_at INTEGER NOT NULL, -- unixepoch()
    updated_at INTEGER NOT NULL, -- unixepoch()
    created_by TEXT, -- User email from CF Access
    updated_by TEXT, -- User email from CF Access
    publish_status TEXT DEFAULT 'draft' -- 'draft', 'review', 'published', 'archived'
);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    parent_id TEXT,
    priority INTEGER DEFAULT 0,
    product_count INTEGER DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- CLICKS TABLE (Analytics)
CREATE TABLE IF NOT EXISTS clicks (
    id TEXT PRIMARY KEY,
    product_slug TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip_hash TEXT NOT NULL,
    country TEXT,
    clicked_at INTEGER NOT NULL, -- unixepoch()
    FOREIGN KEY (product_slug) REFERENCES products(slug)
);

-- AI TASKS TABLE (Tracking generations)
CREATE TABLE IF NOT EXISTS ai_tasks (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'review', 'article', 'description'
    status TEXT NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
    input_data TEXT, -- JSON string
    output_data TEXT, -- JSON string
    error TEXT,
    model TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    created_by TEXT -- User email from CF Access
);

-- CONTENT PAGES TABLE (Staging workflow)
CREATE TABLE IF NOT EXISTS content_pages (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT, -- JSON string
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'review', 'published', 'archived'
    product_id TEXT, -- Optional link to product
    template_type TEXT DEFAULT 'review', -- 'review', 'comparison', 'guide', 'landing'
    seo_score INTEGER, -- 0-100
    generated_by TEXT, -- AI model used
    generation_batch_id TEXT, -- For grouping batch generations
    html_content TEXT, -- Pre-rendered HTML for publishing
    published_at INTEGER, -- unixepoch()
    published_by TEXT, -- User who published
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- AUDIT LOGS TABLE (Compliance & Security)
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    timestamp INTEGER NOT NULL, -- unixepoch()
    user_email TEXT NOT NULL,
    user_id TEXT, -- CF Access sub
    action TEXT NOT NULL, -- 'create', 'update', 'delete', 'publish', 'login', 'settings_change'
    resource_type TEXT NOT NULL, -- 'product', 'content_page', 'settings', 'user'
    resource_id TEXT,
    details TEXT, -- JSON string with before/after values
    ip_hash TEXT, -- Hashed IP for security
    user_agent TEXT,
    success BOOLEAN NOT NULL
);

-- WORKFLOWS TABLE (Batch content generation)
CREATE TABLE IF NOT EXISTS workflows (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'content_generation', 'product_import', 'bulk_update'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'cancelled'
    config TEXT, -- JSON string with workflow configuration
    progress INTEGER DEFAULT 0, -- 0-100
    total_items INTEGER DEFAULT 0,
    completed_items INTEGER DEFAULT 0,
    failed_items INTEGER DEFAULT 0,
    results TEXT, -- JSON string with results summary
    error TEXT,
    started_at INTEGER,
    completed_at INTEGER,
    created_at INTEGER NOT NULL,
    created_by TEXT
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_publish_status ON products(publish_status);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);
CREATE INDEX IF NOT EXISTS idx_clicks_product_slug ON clicks(product_slug);
CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_content_pages_status ON content_pages(status);
CREATE INDEX IF NOT EXISTS idx_content_pages_batch ON content_pages(generation_batch_id);
CREATE INDEX IF NOT EXISTS idx_content_pages_product ON content_pages(product_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_created_by ON workflows(created_by);
