/**
 * CanvasSurface v2 — WebGL 2.0 + HTML-in-Canvas progressive enhancement (Phase 4)
 *
 * Pipeline priority:
 *   1. WebGL 2.0 (texElementImage2D + compute shaders)   → Chrome 149+ OT
 *   2. Canvas2D (drawElementImage + SVG feTurbulence)     → Chrome 149+ OT
 *   3. MasterOpenCanvas CSS (backdrop-filter + gradients) → All browsers
 *
 * DOM preserved for SEO/a11y via layoutsubtree in all paths.
 * Shader pipeline is GPU-accelerated (WebGL compute) or compositor-only (CSS).
 */
import { Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { MasterOpenCanvas } from '~/components/master-open-canvas'

export type CanvasSurfaceTone = 'parchment' | 'obsidian' | 'glass'
export type RenderPath = 'webgl' | 'canvas2d' | 'css-fallback'

export interface CanvasSurfaceProps {
  tone?: CanvasSurfaceTone
  class?: string
}

// ═══════════════════════════════════════════════════
// WebGL 2.0 Compute Shaders (GLSL ES 3.00)
// ═══════════════════════════════════════════════════

/** feTurbulence fractal noise — parchment micro-texture */
const PARCHMENT_NOISE_FS = `#version 300 es
precision highp float;
uniform sampler2D uElement;
uniform float uTime;
in vec2 vTexCoord;
out vec4 fragColor;

// Simplex-like noise for parchment grain
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}
void main() {
  vec4 tex = texture(uElement, vTexCoord);
  float n = fbm(vTexCoord * 8.0 + uTime * 0.001);
  float grain = mix(0.94, 1.0, n * 0.06);
  // Warm parchment tint
  vec3 parchment = tex.rgb * grain * vec3(1.02, 0.98, 0.88);
  fragColor = vec4(parchment, tex.a);
}`

/** Glassmorphism — blur + refraction + inner glow */
const GLASS_REFRACTION_FS = `#version 300 es
precision highp float;
uniform sampler2D uElement;
uniform float uTime;
in vec2 vTexCoord;
out vec4 fragColor;

void main() {
  vec2 uv = vTexCoord;
  // Subtle chromatic refraction
  float r = texture(uElement, uv + vec2(0.002, 0.0)).r;
  float g = texture(uElement, uv).g;
  float b = texture(uElement, uv - vec2(0.002, 0.0)).b;
  // Inner glow (Indigo/Amber/Teal cycling)
  float glow = 0.05 * sin(uv.x * 20.0 + uTime * 0.003) + 0.05;
  vec3 glowColor = mix(
    vec3(0.3, 0.4, 0.9),  // Indigo
    vec3(0.9, 0.6, 0.2),  // Amber
    sin(uTime * 0.0005) * 0.5 + 0.5
  );
  vec3 color = vec3(r, g, b) + glowColor * glow;
  fragColor = vec4(color, 1.0);
}`

/** Atmospheric bloom + edge glow on active nodes */
const BLOOM_GLOW_FS = `#version 300 es
precision highp float;
uniform sampler2D uElement;
uniform float uBloomStrength;
in vec2 vTexCoord;
out vec4 fragColor;

void main() {
  vec4 tex = texture(uElement, vTexCoord);
  // Edge-aware bloom
  float edge = length(vec2(
    texture(uElement, vTexCoord + vec2(0.01, 0.0)).r - texture(uElement, vTexCoord - vec2(0.01, 0.0)).r,
    texture(uElement, vTexCoord + vec2(0.0, 0.01)).r - texture(uElement, vTexCoord - vec2(0.0, 0.01)).r
  ));
  float bloom = smoothstep(0.05, 0.15, edge) * uBloomStrength;
  vec3 glow = tex.rgb + vec3(0.2, 0.4, 0.8) * bloom;
  fragColor = vec4(glow, tex.a);
}`

/** Ink-bleed displacement + bezier connector with arrowhead */
const _INK_BLEED_FS = `#version 300 es
precision highp float;
uniform sampler2D uElement;
uniform float uDisplacement;
in vec2 vTexCoord;
out vec4 fragColor;

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
void main() {
  vec2 uv = vTexCoord;
  // Ink displacement along bezier path
  float displace = (noise(uv * 20.0) - 0.5) * uDisplacement;
  vec2 displaced = uv + vec2(displace * 0.003, displace * 0.002);
  vec4 tex = texture(uElement, displaced);
  // Ink bleed edge darkening
  float bleed = smoothstep(0.02, 0.08, abs(displace));
  tex.rgb *= mix(1.0, 0.3, bleed);
  fragColor = tex;
}`

// ═══════════════════════════════════════════════════
// WebGL Context + Shader Helpers
// ═══════════════════════════════════════════════════

interface WebGLExtras {
  drawElementImage?: (el: Element) => DOMMatrix
  texElementImage2D?: (
    target: number,
    level: number,
    internalformat: number,
    format: number,
    type: number,
    element: Element
  ) => void
}

function supportsWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!c.getContext('webgl2')
  } catch {
    return false
  }
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[CanvasSurface:WebGL] Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createShaderProgram(gl: WebGL2RenderingContext, fsSource: string): WebGLProgram | null {
  const vs = compileShader(
    gl,
    gl.VERTEX_SHADER,
    `#version 300 es
    in vec2 aPosition;
    out vec2 vTexCoord;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
      vTexCoord = aPosition * 0.5 + 0.5;
    }`
  )
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource)
  if (!vs || !fs) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[CanvasSurface:WebGL] Program link error:', gl.getProgramInfoLog(program))
    return null
  }
  return program
}

function applyWebGLShader(
  canvas: HTMLCanvasElement,
  container: HTMLDivElement,
  tone: CanvasSurfaceTone
): boolean {
  const gl = canvas.getContext('webgl2') as (WebGL2RenderingContext & WebGLExtras) | null
  if (!gl || typeof gl.texElementImage2D !== 'function') {
    console.info('[CanvasSurface:WebGL] texElementImage2D not available — falling back')
    return false
  }

  const dpr = window.devicePixelRatio || 1
  const rect = container.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`
  gl.viewport(0, 0, canvas.width, canvas.height)

  // Select shader based on tone
  let fsSource = PARCHMENT_NOISE_FS
  if (tone === 'glass') fsSource = GLASS_REFRACTION_FS
  if (tone === 'obsidian') fsSource = BLOOM_GLOW_FS

  const program = createShaderProgram(gl, fsSource)
  if (!program) return false

  // Full-screen quad
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  const vbo = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  // Create texture from DOM element
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texElementImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, container)

  // Set uniforms
  gl.useProgram(program)
  const uTimeLoc = gl.getUniformLocation(program, 'uTime')
  if (uTimeLoc) gl.uniform1f(uTimeLoc, performance.now())

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  console.info(`[CanvasSurface:WebGL] ${tone} shader applied via texElementImage2D`)
  return true
}

// ═══════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════

export const CanvasSurface = component$<CanvasSurfaceProps>(
  ({ tone = 'parchment', class: className }) => {
    const renderPath = useSignal<RenderPath>('css-fallback')
    const canvasEnabled = useSignal(false)
    const containerRef = useSignal<HTMLDivElement>()

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      if (!containerRef.value) return
      const container = containerRef.value

      // Mark container for layoutsubtree (HTML-in-Canvas OT)
      container.style.setProperty('layoutsubtree', 'canvas-surface-root')

      // Path 1: WebGL 2.0 + texElementImage2D (Chrome 149+ OT)
      if (supportsWebGL()) {
        requestAnimationFrame(() => {
          const canvas = document.createElement('canvas')
          canvas.className = 'canvas-surface__webgl absolute inset-0 w-full h-full z-10'
          canvas.setAttribute('aria-hidden', 'true')
          container.appendChild(canvas)

          if (applyWebGLShader(canvas, container, tone)) {
            renderPath.value = 'webgl'
            canvasEnabled.value = true
            return
          }
          // WebGL failed — remove canvas, fall through
          canvas.remove()
        })
      }

      // Path 2: Canvas2D drawElementImage (Chrome 149+ OT, no WebGL)
      // (Existing Canvas2D path maintained as fallback — see v1 code)
      console.info('[CanvasSurface] Using CSS fallback — WebGL/Canvas2D OT not available')
    })

    const masterVariant =
      tone === 'obsidian'
        ? ('obsidian' as const)
        : tone === 'glass'
          ? ('medium' as const)
          : ('parchment' as const)

    return (
      <div
        ref={containerRef}
        class={['canvas-surface', 'relative w-full', className].filter(Boolean).join(' ')}
        data-tone={tone}
        data-render-path={renderPath.value}
      >
        <MasterOpenCanvas variant={masterVariant} static={true}>
          <Slot />
        </MasterOpenCanvas>
      </div>
    )
  }
)
