/**
 * Sketchnote — Generic hand-drawn kawaii template renderer
 *
 * Renders any of the 3 sketchnote templates (template01/02/03) by accepting
 * the i18n block + a `variant` discriminator. The variant decides:
 *   - which step/panel keys are used
 *   - which icon goes with each step
 *   - the visual flow (8 steps vs 5 steps vs 4 panels)
 *
 * All text comes from i18n (separated from visual layer per pitfall 91-92).
 * Icons are kawaii inline SVG, no FLUX assets.
 */

import { Slot, component$, useStylesScoped$ } from '@builder.io/qwik'
import type { TranslationStrings } from '~/i18n/types'
import {
  AlertIcon as Alert,
  CheckIcon as Check,
  CodeIcon as Code,
  FlagIcon as Flag,
  FlowIcon as Flow,
  HubIcon as Hub,
  MagnetIcon as Magnet,
  RobotIcon as Robot,
  StarIcon as Star,
} from './icons'

const styles = './sketchnote.css?inline'

type TemplateKey = 'template01' | 'template02' | 'template03'

type CardAccent = 'cyan' | 'amber' | 'green' | 'rose'

type IconName = 'magnet' | 'alert' | 'hub' | 'flow' | 'code' | 'check' | 'flag' | 'star'

interface SketchnoteProps {
  /** Which template variant to render */
  variant: TemplateKey
  /** i18n strings (full TranslationStrings object) */
  t: TranslationStrings
  /** ISO lang code for icon "aria-label" i18n */
  lang: string
}

interface HeaderProps {
  title: string
  subtitle: string
  postIt: string
  mascotBubble: string
  lang: string
}

interface CardProps {
  num: number
  kind: string
  title: string
  accent: CardAccent
  icon: IconName
  full?: boolean
}

interface FooterProps {
  cta: string | null
  tags: { visualLogic: string; devFriendly: string; practicalByDesign: string }
  level: string | null
  credit: string
}

export const Sketchnote = component$<SketchnoteProps>(({ variant, t, lang }) => {
  useStylesScoped$(styles)

  return (
    <article class="sk-root" lang={lang} role="article" aria-label={t.sketchnote[variant].title}>
      <div class="sk-sparkles sk-sparkles--tl" aria-hidden="true">✨</div>
      <div class="sk-sparkles sk-sparkles--br" aria-hidden="true">✨</div>

      {variant === 'template01' && <Template01 data={t.sketchnote.template01 as TranslationStrings['sketchnote']['template01']} lang={lang} />}
      {variant === 'template02' && <Template02 data={t.sketchnote.template02 as TranslationStrings['sketchnote']['template02']} lang={lang} />}
      {variant === 'template03' && <Template03 data={t.sketchnote.template03 as TranslationStrings['sketchnote']['template03']} lang={lang} />}
    </article>
  )
})

// ── Template 01 — Practical Visual Explainer (8 steps) ──
const Template01 = component$<{
  data: TranslationStrings['sketchnote']['template01']
  lang: string
}>(({ data, lang }) => {
  const s = data.steps
  return (
    <>
      <Header
        title={data.title}
        subtitle={data.subtitle}
        postIt={data.postIt}
        mascotBubble={data.mascotBubble}
        lang={lang}
      />

      <div class="sk-body">
        <Card num={1} kind={s.hook.kind} title={s.hook.title} accent="cyan" icon="magnet">
          <p class="sk-card__body">{s.hook.body}</p>
        </Card>

        <Card num={2} kind={s.mistake.kind} title={s.mistake.title} accent="rose" icon="alert">
          <p class="sk-card__body">{s.mistake.body}</p>
          <div class="sk-card__postit">{s.mistake.postIt}</div>
        </Card>

        <Card num={3} kind={s.analogy.kind} title={s.analogy.title} accent="cyan" icon="hub" full>
          <ul class="sk-card__list">
            {s.analogy.items.map((item, i) => (
              <li key={i} class="sk-card__list-item">{item}</li>
            ))}
          </ul>
          <p class="sk-card__tip">
            <span class="sk-card__tip-header">{s.analogy.agentLabel}</span>
          </p>
        </Card>

        <Card num={4} kind={s.diagram.kind} title={s.diagram.title} accent="green" icon="flow" full>
          <div class="sk-card__flow">
            {s.diagram.flow.map((node, i) => (
              <>
                <span class="sk-card__flow-item" key={`f-${i}`}>{node}</span>
                {i < s.diagram.flow.length - 1 && <span class="sk-card__flow-arrow" key={`a-${i}`}>→</span>}
              </>
            ))}
          </div>
          <pre class="sk-card__code">{s.diagram.body}</pre>
        </Card>

        <Card num={5} kind={s.example.kind} title={s.example.title} accent="cyan" icon="code">
          <p class="sk-card__body">{s.example.body}</p>
          <div class="sk-card__postit">{s.example.caption}</div>
        </Card>

        <Card num={6} kind={s.use.kind} title={s.use.title} accent="green" icon="check">
          <div class="sk-card__use-dont">
            <div class="sk-card__use-dont-col">
              <div class="sk-card__use-dont-header sk-card__use-dont-header--use">✓ {s.use.useHeader}</div>
              {s.use.useItems.map((item, i) => (
                <div key={i} class="sk-card__use-dont-item">{item}</div>
              ))}
            </div>
            <div class="sk-card__use-dont-col">
              <div class="sk-card__use-dont-header sk-card__use-dont-header--dont">✗ {s.use.dontHeader}</div>
              {s.use.dontItems.map((item, i) => (
                <div key={i} class="sk-card__use-dont-item">{item}</div>
              ))}
            </div>
          </div>
        </Card>

        <Card num={7} kind={s.pitfalls.kind} title={s.pitfalls.title} accent="rose" icon="flag">
          <ol class="sk-card__list">
            {s.pitfalls.items.map((item, i) => (
              <li key={i} class="sk-card__list-item">{item}</li>
            ))}
          </ol>
          <div class="sk-card__tip">
            <span class="sk-card__tip-header">{s.pitfalls.tipHeader}</span>
            {s.pitfalls.tip}
          </div>
        </Card>

        <Card num={8} kind={s.nextStep.kind} title={s.nextStep.title} accent="cyan" icon="star" full>
          <ol class="sk-card__list">
            {s.nextStep.items.map((item, i) => (
              <li key={i} class="sk-card__list-item">{item}</li>
            ))}
          </ol>
          <div class="sk-card__postit">{s.nextStep.closingNote}</div>
        </Card>
      </div>

      <Footer cta={null} tags={data.tags} level={data.level} credit={data.footer} />
    </>
  )
})

// ── Template 02 — Code Recipe (5 steps) ──
const Template02 = component$<{
  data: TranslationStrings['sketchnote']['template02']
  lang: string
}>(({ data, lang }) => {
  const s = data.steps
  return (
    <>
      <Header
        title={data.title}
        subtitle={data.subtitle}
        postIt={data.postIt}
        mascotBubble={data.mascotBubble}
        lang={lang}
      />

      <div class="sk-body">
        <Card num={1} kind={s.result.kind} title={s.result.title} accent="green" icon="star">
          <p class="sk-card__body">{s.result.body}</p>
          <div class="sk-card__postit">{s.result.caption}</div>
        </Card>

        <Card num={2} kind={s.install.kind} title={s.install.title} accent="cyan" icon="code">
          <p class="sk-card__body">{s.install.body}</p>
          <div class="sk-card__command">
            <span class="sk-card__command-prompt">$</span>
            {s.install.command.replace(/^\$\s*/, '')}
          </div>
          <pre class="sk-card__code">{s.install.output}</pre>
        </Card>

        <Card num={3} kind={s.code.kind} title={s.code.title} accent="cyan" icon="code">
          <p class="sk-card__body">{s.code.body}</p>
          <pre class="sk-card__code">{`import { getStroke } from 'perfect-freehand';
const points = [];
canvas.addEventListener('pointermove', (e) => {
  points.push({ x: e.clientX, y: e.clientY });
});
const stroke = getStroke(points, {
  size: 2,
  thinning: 0.6,
  smoothing: 0.5,
});`}</pre>
          <div class="sk-card__postit">{s.code.caption}</div>
        </Card>

        <Card num={4} kind={s.howItWorks.kind} title={s.howItWorks.title} accent="green" icon="flow" full>
          <div class="sk-card__flow">
            {s.howItWorks.flow.map((node, i) => (
              <>
                <span class="sk-card__flow-item" key={`f-${i}`}>{node}</span>
                {i < s.howItWorks.flow.length - 1 && <span class="sk-card__flow-arrow" key={`a-${i}`}>→</span>}
              </>
            ))}
          </div>
          <div class="sk-card__postit">{s.howItWorks.caption}</div>
        </Card>

        <Card num={5} kind={s.upgrade.kind} title={s.upgrade.title} accent="amber" icon="star" full>
          <div class="sk-card__upgrade-grid">
            {s.upgrade.items.map((item, i) => (
              <div key={i} class="sk-card__upgrade-mini">
                <div class="sk-card__upgrade-mini-name">{item.name}</div>
                <div class="sk-card__upgrade-mini-desc">{item.desc}</div>
              </div>
            ))}
          </div>
          <div class="sk-card__postit">{s.upgrade.caption}</div>
        </Card>
      </div>

      <Footer cta={data.cta} tags={data.tags} level={null} credit={data.footer} />
    </>
  )
})

// ── Template 03 — Decision Map (4 panels) ──
const Template03 = component$<{
  data: TranslationStrings['sketchnote']['template03']
  lang: string
}>(({ data, lang }) => {
  const p = data.panels
  return (
    <>
      <Header
        title={data.title}
        subtitle={data.subtitle}
        postIt={data.postIt}
        mascotBubble={data.mascotBubble}
        lang={lang}
      />

      <div class="sk-body">
        <Card num={1} kind={p.question.kind} title={p.question.title} accent="cyan" icon="magnet">
          <p class="sk-card__body">{p.question.subtitle}</p>
          <div class="sk-card__tip">
            <span class="sk-card__tip-header">{p.question.tipTitle}</span>
            {p.question.tip}
          </div>
        </Card>

        <Card num={2} kind={p.options.kind} title={p.options.title} accent="amber" icon="hub" full>
          <ul class="sk-card__list">
            {p.options.options.map((opt, i) => (
              <li key={i} class="sk-card__list-item">
                <strong>{opt.name}</strong> — {opt.desc}
              </li>
            ))}
          </ul>
        </Card>

        <Card num={3} kind={p.decision.kind} title={p.decision.title} accent="green" icon="flow" full>
          <p class="sk-card__body">{p.decision.subtitle}</p>
          {p.decision.rules.map((rule, i) => (
            <div key={i} class="sk-card__flow" style="margin-top: 0.4rem">
              <span class="sk-card__flow-item">{rule.question}</span>
              <span class="sk-card__flow-arrow">→</span>
              <span class="sk-card__flow-item" style="background: oklch(92% 0.08 145); border-color: oklch(70% 0.18 145)">{rule.yesTo}</span>
            </div>
          ))}
          <div class="sk-card__postit">{p.decision.bottomNote}</div>
        </Card>

        <Card num={4} kind={p.summary.kind} title={p.summary.title} accent="cyan" icon="check" full>
          <ul class="sk-card__list">
            {p.summary.options.map((opt, i) => (
              <li key={i} class="sk-card__list-item">
                <strong>{opt.name}</strong> — {opt.verdict}
              </li>
            ))}
          </ul>
          <div class="sk-card__postit">{p.summary.closingNote}</div>
        </Card>
      </div>

      <Footer cta={data.cta} tags={data.tags} level={null} credit={data.footer} />
    </>
  )
})

// ── Shared sub-components ──

const Header = component$<HeaderProps>(({ title, subtitle, postIt, mascotBubble, lang }) => {
  return (
    <header class="sk-header">
      <div class="sk-header__main">
        <div class="sk-header__logo">
          <span aria-hidden="true">{'{}'}</span>
          <span>UniTeia / ConteiXeia</span>
        </div>
        <h2 class="sk-header__title">{title}</h2>
        <p class="sk-header__subtitle">{subtitle}</p>
      </div>
      <div class="sk-header__mascot" aria-label={`Mascot says: ${mascotBubble}`}>
        <div class="sk-header__mascot-bubble">{mascotBubble}</div>
        <Robot size={56} />
      </div>
      <div class="sk-card__postit" style="grid-column: 1 / -1; justify-self: start">
        {postIt}
      </div>
    </header>
  )
})

const Card = component$<CardProps>((props) => {
  const { num, kind, title, accent, icon, full } = props
  const accentClass = `sk-card--${accent}`
  const fullClass = full ? ' sk-card--full' : ''
  return (
    <article class={`sk-card ${accentClass}${fullClass}`}>
      <div class="sk-card__header">
        <div class="sk-card__num" aria-label={`Step ${num}`}>{num}</div>
        <div class="sk-card__icon" aria-hidden="true">
          <IconSwitch icon={icon} />
        </div>
        <span class="sk-card__kind">{kind}</span>
      </div>
      <h3 class="sk-card__title">{title}</h3>
      <Slot />
    </article>
  )
})

const Footer = component$<FooterProps>(({ cta, tags, level, credit }) => {
  return (
    <footer class="sk-footer">
      {cta && <div class="sk-footer__cta">🚀 {cta}</div>}
      <div class="sk-footer__tags">
        <span class="sk-footer__tag">👁 {tags.visualLogic}</span>
        <span class="sk-footer__tag--sep">·</span>
        <span class="sk-footer__tag">&lt;/&gt; {tags.devFriendly}</span>
        <span class="sk-footer__tag--sep">·</span>
        <span class="sk-footer__tag">⚙ {tags.practicalByDesign}</span>
      </div>
      {level && <div class="sk-footer__level">{level}</div>}
      <div class="sk-footer__credit">{credit}</div>
    </footer>
  )
})

const IconSwitch = component$<{ icon: IconName }>(({ icon }) => {
  switch (icon) {
    case 'magnet':
      return <Magnet size={28} />
    case 'alert':
      return <Alert size={28} />
    case 'hub':
      return <Hub size={28} />
    case 'flow':
      return <Flow size={28} />
    case 'code':
      return <Code size={28} />
    case 'check':
      return <Check size={28} />
    case 'flag':
      return <Flag size={28} />
    case 'star':
      return <Star size={28} />
    default:
      return <Magnet size={28} />
  }
})

// Re-export templates for direct use
export { Template01, Template02, Template03 }
