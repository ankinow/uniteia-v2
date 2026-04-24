# Manual Verification Checklist - Phase 2 (Server Functions)

## Pre-requisites
- [ ] Ensure local D1 database is up to date: `bun x wrangler d1 execute DB --local --file=src/db/schema.sql` (Adjust binding name 'DB' if different in wrangler.toml)
- [ ] Ensure project is running: `bun run dev`

## Test Cases

### 1. Happy Path - Create Product
- [ ] Navigate to `/dashboard/products/new`.
- [ ] Fill in required fields:
  - **Title**: "Test Product A"
  - **Category**: "Eletrônicos"
  - **Affiliate Link**: "https://example.com/product-a"
- [ ] Click "Create Product".
- [ ] **Expected Result**: 
  - Redirects to `/dashboard/products`.
  - Database contains new row with matching title and slug.

### 2. Validation Failure (Client Side)
- [ ] Navigate to `/dashboard/products/new`.
- [ ] Leave "Title" empty.
- [ ] Click "Create Product".
- [ ] **Expected Result**: 
  - Browser validation prevents submission (HTML5 `required`).
  - Or if bypassed, Zod alert appears: "Validation failed..."

### 3. Server-Side Error Handling
- [ ] (Advanced) Temporarily modify `src/actions/products.ts` to throw an error (e.g., `throw new Error("Simulated DB Error")`) before `productQueries.create`.
- [ ] Attempt to submit valid form.
- [ ] **Expected Result**: 
  - Alert "Failed to create product" appears.
  - Console logs the error.

### 4. Data Integrity
- [ ] Check D1 Data:
  - Run `bun x wrangler d1 execute DB --local --command "SELECT * FROM products ORDER BY created_at DESC LIMIT 1"`
  - Verify `id` is a valid UUID.
  - Verify `created_at` is a timestamp.
  - Verify `is_active` is 1 (True).

## Code Review Audit
- [x] `src/actions/products.ts` imports `createServerFn`, `getEvent`, `z`, `ProductSchema`, `productQueries`.
- [x] `createServerFn` uses `.validator()` for type safety.
- [x] `getEvent().context.cloudflare.env.DB` accessed securely.
- [x] Frontend `new.tsx` awaits `createProduct({ data: ... })`.
