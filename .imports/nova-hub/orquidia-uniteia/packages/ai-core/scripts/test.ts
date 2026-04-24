const testGlobs = [
  new Bun.Glob('src/**/*.test.{ts,tsx,js,jsx}'),
  new Bun.Glob('src/**/*.spec.{ts,tsx,js,jsx}'),
  new Bun.Glob('src/**/_test_.{ts,tsx,js,jsx}'),
  new Bun.Glob('src/**/_spec_.{ts,tsx,js,jsx}'),
]

let found = 0

for (const glob of testGlobs) {
  for await (const _path of glob.scan({ cwd: process.cwd(), onlyFiles: true })) {
    found += 1
    break
  }
  if (found > 0) break
}

if (found === 0) {
  console.log('[ai-core:test] No test files found. Skipping.')
  process.exit(0)
}

const proc = Bun.spawn({
  cmd: ['bun', 'test'],
  cwd: process.cwd(),
  stdout: 'inherit',
  stderr: 'inherit',
})

process.exit(await proc.exited)
