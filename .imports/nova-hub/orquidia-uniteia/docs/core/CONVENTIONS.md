# Coding Conventions

## Style Guide
- **Enforced by:** Biome (`biome.json`)
- **Indentation:** 2 spaces
- **Line Width:** 100 characters
- **Quotes:** Single quotes
- **Semicolons:** As needed (ASI)
- **Trailing Commas:** All (ES5+)

## TypeScript
- **Strict Mode:** Enabled (`strict: true`)
- **Module Resolution:** Bundler
- **Target:** ESNext
- **Imports:** Organized via Biome (`organizeImports: { enabled: true }`)
- **Paths:** Path aliases used for packages (e.g., `@orquestra/shared`)

## Best Practices (Inferred)
- **Validation:** Use Zod for all external inputs (`packages/shared`).
- **Types:** Share types via the `shared` package, do not duplicate.
- **Database:** Use ORM (Drizzle) for all database interactions.
- **Async:** Modern `async/await` patterns.
