import { describe, it, expect } from "vitest"
import path from "node:path"
import fs from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { validateCoreFile, validateCoreObject } from "../schema/validate-core"
import yaml from "yaml"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GOLDEN = path.join(__dirname, "golden", "llm-agents-primer", "core.yaml")

describe("schema", () => {
  it("validates the golden core.yaml", async () => {
    const r = await validateCoreFile(GOLDEN)
    expect(r.ok).toBe(true)
  })

  it("rejects core missing required fields", () => {
    const bad = { spec: "core/1", id: "x" }
    const r = validateCoreObject(bad)
    expect(r.ok).toBe(false)
  })

  it("rejects invalid lang", async () => {
    const raw = await fs.readFile(GOLDEN, "utf8")
    const parsed = yaml.parse(raw)
    parsed.lang = "fr" // not in enum
    const r = validateCoreObject(parsed)
    expect(r.ok).toBe(false)
  })
})
