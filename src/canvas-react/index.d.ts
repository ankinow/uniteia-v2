// Stub declarations for canvas-react modules
// The actual code lives in .tsx files; tsc cannot typecheck them in a Qwik context.
// Vite handles the actual loading via dynamic import at runtime.

declare module '*CanvasIslandReact' {
  export function mountCanvas(container: HTMLElement, template: string, lang: string): void
  export function unmountCanvas(): void
}

declare module '*entry' {
  const entry: never
  export default entry
}
