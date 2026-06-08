import { component$ } from '@builder.io/qwik'

export type BonecoEmotion = 'happy' | 'thinking' | 'teaching' | 'excited' | 'confused'

export interface BonecoProps {
  id?: string
  emotion?: BonecoEmotion
  scale?: number
  pointing?: 'left' | 'right'
  class?: string
}

/**
 * Boneco — The unified UniTeia mascot.
 * A cartoon hand-drawn puppet with multiple emotions.
 */
export const Boneco = component$<BonecoProps>(
  ({ id, emotion = 'teaching', scale = 1, pointing, class: className }) => {
    const colors = {
      happy: {
        skin: 'oklch(0.80 0.08 60)',
        hair: 'oklch(0.25 0.03 280)',
        eye: 'oklch(0.15 0.02 280)',
      },
      thinking: {
        skin: 'oklch(0.78 0.06 55)',
        hair: 'oklch(0.30 0.04 270)',
        eye: 'oklch(0.15 0.02 280)',
      },
      teaching: {
        skin: 'oklch(0.82 0.07 65)',
        hair: 'oklch(0.20 0.03 290)',
        eye: 'oklch(0.12 0.02 280)',
      },
      excited: {
        skin: 'oklch(0.85 0.10 70)',
        hair: 'oklch(0.25 0.04 275)',
        eye: 'oklch(0.15 0.02 280)',
      },
      confused: {
        skin: 'oklch(0.75 0.05 50)',
        hair: 'oklch(0.28 0.03 285)',
        eye: 'oklch(0.15 0.02 280)',
      },
    }
    const c = colors[emotion] || colors.teaching
    const s = (n: number) => Math.round(n * scale)

    return (
      <svg
        viewBox="0 0 64 88"
        width={s(64)}
        height={s(88)}
        class={['boneco-puppet', emotion ? `boneco-${emotion}` : '', className]}
        data-boneco-id={id}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hair */}
        <ellipse cx={s(32)} cy={s(16)} rx={s(14)} ry={s(10)} fill={c.hair} opacity="0.9" />
        {/* Head */}
        <ellipse
          cx={s(32)}
          cy={s(22)}
          rx={s(11)}
          ry={s(12)}
          fill={c.skin}
          stroke={c.skin}
          stroke-width="0.5"
        />
        {/* Eyes */}
        <circle cx={s(27)} cy={s(20)} r={s(2)} fill={c.eye} />
        <circle cx={s(37)} cy={s(20)} r={s(2)} fill={c.eye} />
        {/* Eye highlights */}
        <circle cx={s(28)} cy={s(19)} r={s(0.8)} fill="oklch(1 0 0 / 0.6)" />
        <circle cx={s(38)} cy={s(19)} r={s(0.8)} fill="oklch(1 0 0 / 0.6)" />
        {/* Smile / expression */}
        {emotion === 'happy' || emotion === 'excited' ? (
          <path
            d={`M${s(27)},${s(27)} Q${s(32)},${s(32)} ${s(37)},${s(27)}`}
            stroke={c.eye}
            stroke-width={s(1.5)}
            fill="none"
            stroke-linecap="round"
          />
        ) : emotion === 'thinking' ? (
          <circle cx={s(32)} cy={s(27)} r={s(2)} fill="oklch(0.60 0.05 280 / 0.3)" />
        ) : emotion === 'confused' ? (
          <path
            d={`M${s(26)},${s(27)} Q${s(32)},${s(25)} ${s(38)},${s(27)}`}
            stroke={c.eye}
            stroke-width={s(1.5)}
            fill="none"
            stroke-linecap="round"
          />
        ) : (
          <path
            d={`M${s(27)},${s(27)} Q${s(32)},${s(30)} ${s(37)},${s(27)}`}
            stroke={c.eye}
            stroke-width={s(1.5)}
            fill="none"
            stroke-linecap="round"
          />
        )}
        {/* Body */}
        <rect
          x={s(24)}
          y={s(34)}
          width={s(16)}
          height={s(20)}
          rx={s(3)}
          fill="oklch(0.40 0.10 265 / 0.7)"
        />
        {/* Arms */}
        <path
          d={`M${s(24)},${s(38)} L${s(14)},${s(48)}`}
          stroke={c.skin}
          stroke-width={s(3)}
          stroke-linecap="round"
        />
        {pointing && (
          <path
            d={`M${s(36)},${s(38)} L${s(pointing === 'right' ? 54 : 18)},${s(38)}`}
            stroke={c.skin}
            stroke-width={s(3)}
            stroke-linecap="round"
          />
        )}
        <path
          d={`M${s(40)},${s(38)} L${s(50)},${s(48)}`}
          stroke={c.skin}
          stroke-width={s(3)}
          stroke-linecap="round"
        />
        {/* Legs */}
        <path
          d={`M${s(27)},${s(54)} L${s(22)},${s(68)}`}
          stroke={c.skin}
          stroke-width={s(3)}
          stroke-linecap="round"
        />
        <path
          d={`M${s(37)},${s(54)} L${s(42)},${s(68)}`}
          stroke={c.skin}
          stroke-width={s(3)}
          stroke-linecap="round"
        />
      </svg>
    )
  }
)
