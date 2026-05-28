/**
 * aether-sound.ts — WebAudio sound effects for UniTeia
 * Bundle-safe: <1KB, no dependencies (uses native WebAudio API)
 *
 * - ctClick(): CTA button sound — noise glitch → clean sine sweep
 *   Represents "noise converging to signal" in audio form
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  // Resume if suspended (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Play CTA click sound: noise burst → clean sine sweep
 * Duration: ~300ms, gentle and unobtrusive
 */
export function playCtaClick(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // ── Phase 1: Noise burst (glitch) — 0-60ms ──
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.15
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.12, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    noise.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now)
    noise.stop(now + 0.06)

    // ── Phase 2: Clean sine sweep (signal) — 60-300ms ──
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now + 0.06)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.3)

    const sigGain = ctx.createGain()
    sigGain.gain.setValueAtTime(0, now + 0.06)
    sigGain.gain.linearRampToValueAtTime(0.08, now + 0.1)
    sigGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc.connect(sigGain)
    sigGain.connect(ctx.destination)
    osc.start(now + 0.06)
    osc.stop(now + 0.3)
  } catch {
    // WebAudio not available — fail silently
  }
}
