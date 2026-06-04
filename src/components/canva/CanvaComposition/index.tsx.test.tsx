import { describe, expect, it, vi } from 'vitest'

// component$ is normally a QRL wrapper. In tests we unwrap it to the inner
// render fn so we can call it directly and inspect its return value (vdom tree).
const passthrough = <T,>(fn: T) => fn

// Provide the JSX runtime + component$ + createContextId so the source .tsx
// can be evaluated at module-load time.
vi.mock('@builder.io/qwik', () => ({
  component$: passthrough,
  Slot: () => null,
  createContextId: (id: string) => id,
  Fragment: Symbol.for('qwik.fragment'),
  jsx: (_type: unknown, props: unknown) => ({
    type: (_type as { displayName?: string })?.displayName ?? _type,
    props,
  }),
  jsxs: (_type: unknown, props: unknown) => ({
    type: (_type as { displayName?: string })?.displayName ?? _type,
    props,
  }),
  jsxDEV: (_type: unknown, props: unknown) => ({
    type: (_type as { displayName?: string })?.displayName ?? _type,
    props,
  }),
}))

// Stub ~/i18n/context so useCanvaI18n's getTranslation call resolves.
vi.mock('~/i18n/context', () => ({
  getTranslation: (_lang: string) => ({
    canva: {
      hero: { title: 'Design at the speed of thought', subtitle: '', cta: '' },
      concept: { central: 'One canvas, many shapes', satellite: { 1: '', 2: '' } },
      code: { step: { 1: { title: 'Define the prompt', body: '' }, 2: { title: '' } } },
      compare: { option: { a: '', b: 'UniTeia Canva' }, decision: { yes: '', no: '' } },
      timeline: { milestone: { 1: '', 2: '' } },
      summary: { takeaway: { 1: '', 2: '' }, nextstep: 'Open the canvas' },
    },
  }),
}))

const SAMPLE_REFS = [
  {
    shapeId: 'panel-manga-corner',
    style: 'manga-3d',
    mood: 'volumetric',
    x: 40,
    y: 40,
    w: 480,
    h: 360,
  },
  {
    shapeId: 'panel-stack-vertical',
    style: 'manga-chalk',
    mood: 'concept',
    x: 560,
    y: 40,
    w: 600,
    h: 360,
  },
  {
    shapeId: 'panel-spotlight',
    style: 'manga-comic',
    mood: 'panel',
    x: 40,
    y: 420,
    w: 720,
    h: 340,
  },
  {
    shapeId: 'panel-asymmetric',
    style: 'manga-ink',
    mood: 'atmosphere',
    x: 780,
    y: 420,
    w: 380,
    h: 200,
  },
]

describe('CanvaComposition', () => {
  it('imports cleanly', async () => {
    const mod = await import('./index')
    expect(mod.CanvaComposition).toBeDefined()
  })

  it('hero sceneType maps to canva.hero.title key', async () => {
    const { CanvaComposition } = await import('./index')
    // Render is a passthrough fn — call directly to get the vdom tree
    const render = CanvaComposition as unknown as (p: {
      refs: typeof SAMPLE_REFS
      lang: 'en'
      sceneType: 'hero'
    }) => unknown
    const vdom = render({ refs: SAMPLE_REFS, lang: 'en', sceneType: 'hero' }) as {
      type: string
      props: { 'data-scene-type'?: string; 'aria-label'?: string; children?: unknown }
    }
    // The component returns a <section> directly (no outer fragment wrap)
    expect(vdom.type).toBe('section')
    expect(vdom.props['data-scene-type']).toBe('hero')
    // aria-label should be the resolved hero title from the canva block
    expect(vdom.props['aria-label']).toBeTruthy()
    expect(typeof vdom.props['aria-label']).toBe('string')
    // The hero title (en) is 'Design at the speed of thought'
    expect(vdom.props['aria-label']).toMatch(/Design at the speed of thought/i)
  })

  it('renders one <image> per ref (4 refs → 4 images)', async () => {
    const { CanvaComposition } = await import('./index')
    const render = CanvaComposition as unknown as (p: {
      refs: typeof SAMPLE_REFS
      lang: 'en'
      sceneType: 'concept'
    }) => unknown
    const vdom = render({ refs: SAMPLE_REFS, lang: 'en', sceneType: 'concept' }) as {
      type: string
      props: { children?: unknown }
    }
    expect(vdom.type).toBe('section')
    // The section has children: [<h2>, <ShapeCanvas> (passthrough component$, inner = <svg>)]
    // Walk: section → children → find ShapeCanvas, then check inside its props
    const children = (vdom.props.children as unknown[]) ?? []
    // Find either a direct svg (if component$ was inlined) or a ShapeCanvas wrapper
    // whose props.children is the svg.
    const candidates = children as Array<{
      type: string
      props?: { children?: unknown }
    }>
    let svg: { type: 'svg'; props: { children?: unknown } } | undefined
    for (const c of candidates) {
      if (c.type === 'svg') {
        svg = c as { type: 'svg'; props: { children?: unknown } }
        break
      }
      // ShapeCanvas component$ was passthrough — calling the inner fn with its
      // props gives us the real return value (svg).
      if (typeof c.type === 'function') {
        try {
          const inner = (c.type as unknown as (p: unknown) => unknown)(c.props)
          if (inner && typeof inner === 'object' && (inner as { type: string }).type === 'svg') {
            svg = inner as { type: 'svg'; props: { children?: unknown } }
            break
          }
        } catch {
          // ignore
        }
      }
    }
    expect(svg).toBeDefined()
    const images = ((svg?.props.children as unknown[]) ?? []).filter(
      (c): c is { type: 'image' } =>
        typeof c === 'object' && c !== null && (c as { type: string }).type === 'image'
    )
    expect(images.length).toBe(4)
  })

  it('preserves x/y/w/h coordinates verbatim in the SVG image attrs', async () => {
    const { CanvaComposition } = await import('./index')
    const render = CanvaComposition as unknown as (p: {
      refs: typeof SAMPLE_REFS
      lang: 'en'
      sceneType: 'summary'
    }) => unknown
    const vdom = render({ refs: SAMPLE_REFS, lang: 'en', sceneType: 'summary' }) as {
      type: string
      props: { children?: unknown }
    }
    const children = (vdom.props.children as unknown[]) ?? []
    let svg: { type: 'svg'; props: { children?: unknown } } | undefined
    for (const c of children as Array<{
      type: string
      props?: { children?: unknown }
    }>) {
      if (c.type === 'svg') {
        svg = c as { type: 'svg'; props: { children?: unknown } }
        break
      }
      if (typeof c.type === 'function') {
        try {
          const inner = (c.type as unknown as (p: unknown) => unknown)(c.props)
          if (inner && typeof inner === 'object' && (inner as { type: string }).type === 'svg') {
            svg = inner as { type: 'svg'; props: { children?: unknown } }
            break
          }
        } catch {
          // ignore
        }
      }
    }
    expect(svg).toBeDefined()
    const images = ((svg?.props.children as unknown[]) ?? []).filter(
      (
        c
      ): c is {
        type: 'image'
        props: { x: number; y: number; width: number; height: number; 'data-shape-id': string }
      } => typeof c === 'object' && c !== null && (c as { type: string }).type === 'image'
    )
    // Build a map and assert each ref is preserved exactly
    const byShapeId = new Map(images.map(img => [img.props['data-shape-id'], img.props]))
    for (const ref of SAMPLE_REFS) {
      const props = byShapeId.get(ref.shapeId)
      expect(props).toBeDefined()
      expect(props?.x).toBe(ref.x)
      expect(props?.y).toBe(ref.y)
      expect(props?.width).toBe(ref.w)
      expect(props?.height).toBe(ref.h)
    }
  })
})
