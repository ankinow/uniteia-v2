# M001 — JRPG-Style Sidebar + Open-Design Integration

## Project Description

Transform UniTeia v2's frontend into a JRPG/Dashboard-style interface with a retro sidebar (left), content area (right), donation integration via BuyMeACoffee, and open-design toolkit integration for development reference. The project uses Qwik-City + TailwindCSS on Cloudflare Pages with a brutalist aesthetic enhanced by subtle JRPG elements (scanlines, pixel fonts, Final Fantasy VI inspiration).

## Why This Milestone

UniTeia v2 needs a distinctive visual identity that aligns with its "Brutalist bones, JRPG whisper" motto. The current horizontal navigation doesn't reflect the editorial vision. A JRPG-style sidebar creates a dashboard-like experience that differentiates the platform while maintaining usability. Additionally, integrating the open-design repository (72 design systems, 31 skills) provides engineers with reference material during development. The donation button enables community support via BuyMeACoffee.

## User-Visible Outcome

- User sees a retro-styled sidebar on the left (desktop) with scanlines, pixel fonts, and JRPG aesthetics
- User can navigate through sidebar menu with JRPG-style cursor (►)
- User can click "SUPPORT" button in sidebar to donate via buymeacoffee.com/lermf
- User sees content rendered on the right side in a two-column layout
- User experiences the same header/navigation on mobile (sidebar hidden, header maintained)
- Developer can reference 72 design systems in `docs/design-reference/` from open-design clone
- Developer can access device frames in `public/frames-reference/` for UI work

## Completion Class

**Integration** — requires visual verification across desktop and mobile breakpoints, verification of BuyMeACoffee link functionality, and confirmation that open-design assets are properly referenced without affecting runtime.

## Final Integrated Acceptance

1. Desktop (≥768px): Sidebar visible on left (256px width), content on right, scanlines active, pixel font rendering
2. Mobile (<768px): Sidebar hidden, header with logo/navigation maintained, content full-width
3. SUPPORT button: Links to https://buymeacoffee.com/lermf, opens in new tab, displays ☕ icon + "SUPPORT" text
4. Open-design: Cloned to `.imports/open-design/`, design systems copied to `docs/design-reference/`, frames to `public/frames-reference/`
5. Multi-context: `CONTEXT-MAP.md` created, `docs/agents/` configured (completed in this session)
6. No sprites initially (as requested), pure CSS JRPG effects (scanlines, pixel borders, glows)

## Architectural Decisions

### Decision 1: Two-Column Layout via Flexbox

**Decision:** Use `flex` layout in `src/routes/layout.tsx` to create two-column design (sidebar + content) on desktop, single column on mobile.

**Rationale:** Qwik-City's layout system supports arbitrary markup; flexbox is native, requires no JS, and works with Tailwind utilities.

**Alternatives considered:**
- CSS Grid (rejected: overkill for simple two-column)
- Separate route for sidebar (rejected: breaks SPA navigation)

### Decision 2: Sidebar Hidden on Mobile (`hidden md:block`)

**Decision:** Use Tailwind's responsive classes to hide sidebar on mobile, show on desktop. Keep header visible on both.

**Rationale:** User explicitly requested "keep header on mobile." Sidebar would consume too much screen real estate on mobile.

**Alternatives considered:**
- Hamburger menu with collapsible sidebar (rejected: user didn't request, adds JS)
- Bottom navigation (rejected: breaks JRPG dashboard metaphor)

### Decision 3: Scanlines via CSS Repeating-Linear-Gradient

**Decision:** Implement JRPG scanline effect using pure CSS (no JS, no images).

**Rationale:** CSS scanlines are lightweight, don't affect performance, and can be toggled via class. Matches "JRPG whisper" motto without overwhelming the brutalist base.

**Alternatives considered:**
- SVG overlay (rejected: extra HTTP request)
- Canvas/CSS animation (rejected: unnecessary JS, performance cost)

### Decision 4: Press Start 2P Pixel Font via @font-face

**Decision:** Load Press Start 2P font via `@font-face` in `src/global.css`, use for sidebar logo and navigation.

**Rationale:** Authentic JRPG pixel font, widely available, woff2 format for performance. Used sparingly (logo + nav) to avoid readability issues.

**Alternatives considered:**
- System monospace (rejected: not JRPG enough)
- Custom pixel font (rejected: licensing, file size)

### Decision 5: Open-Design as Dev Tool (Not Runtime Dependency)

**Decision:** Clone open-design to `.imports/open-design/`, copy reference assets to `docs/` and `public/`, but do NOT import it as a runtime dependency.

**Rationale:** Open-design is for developer reference (72 design systems, 31 skills as inspiration). It should not affect the build or runtime.

**Alternatives considered:**
- NPM package (rejected: unnecessary runtime dependency)
- Git submodule (rejected: adds complexity, not needed for reference-only)

## Error Handling Strategy

- **Font loading failure:** Fall back to `font-mono` (JetBrains Mono) if Press Start 2P fails to load (use `font-display: swap`)
- **Open-design clone failure:** Log warning, continue without it (non-blocking)
- **BuyMeACoffee link failure:** Link should open in new tab (`target="_blank" rel="noopener"`) to avoid losing UniTeia page
- **Sidebar JS errors:** Sidebar is CSS-only (no Qwik $ attachment except for future interactivity), minimal error surface

## Risks and Unknowns

- **Risk:** Press Start 2P font may reduce readability for non-logo text. **Mitigation:** Use only for logo and short nav items, not body text.
- **Risk:** Scanlines may cause accessibility issues (migraine triggers). **Mitigation:** Use subtle opacity (0.03), allow user to disable via future toggle.
- **Unknown:** How will sidebar interact with existing `NavTree` component? **Current thinking:** Create new `SidebarNav` component, keep `NavTree` in header for mobile.
- **Unknown:** Will two-column layout affect existing responsive components? **Current thinking:** Should not, as content area uses `flex-1` and existing components are already responsive.

## Existing Codebase / Prior Art

- **`src/routes/layout.tsx`** — Main layout file to be modified for two-column structure
- **`src/components/site-shell.tsx`** — Wrapper component, may need adjustment for sidebar
- **`src/components/nav-tree.tsx`** — Existing navigation, will be adapted for sidebar
- **`src/global.css`** — Global styles, will receive pixel font + scanline CSS
- **`tailwind.config.js`** — Needs `font-pixel` family added
- **`AGENTS.md`** — Already updated with Agent skills section (this session)
- **`CONTEXT-MAP.md`** — Created this session for multi-context (8 contexts)
- **`docs/agents/`** — Created this session (issue-tracker.md, triage-labels.md, domain.md)

## Relevant Requirements

- **URL Law:** Slugs must follow `^[a-z]+(-[a-z]+){1,5}$` — sidebar navigation must use canonical URLs
- **SolarLanso Palette:** Sidebar must use `--void`, `--cyan`, `--deep`, `--bone` tokens
- **Dopamine Budget:** Max 1 JRPG whisper/viewport, animations ≤250ms (already in AGENTS.md)
- **i18n Law:** Sidebar must support 5 languages (en/pt/es/ja/zh), though initial implementation may be language-agnostic
- **WCAG 2.2 AA:** Contrast ratios must be maintained (15.2:1 bone-on-void already met)

## Scope

### In Scope
- JRPG-style sidebar (left, desktop only)
- Two-column layout (sidebar + content)
- SUPPORT donation button (BuyMeACoffee)
- Scanlines CSS effect
- Press Start 2P pixel font integration
- Open-design clone and asset copying
- Multi-context setup (completed)
- Agent skills configuration (completed)

### Out of Scope
- Sprites or character art (explicitly requested "no sprite initially")
- Mobile sidebar (keep header as-is on mobile)
- Dark/light mode toggle (against anti-goals)
- Animated transitions between routes (against dopamine budget)
- Backdrop blur or glassmorphism (against anti-goals)

### Non-Goals
- Replacing existing header (header stays on mobile)
- Changing content rendering (ArticleFrame, markdown processing unchanged)
- Modifying URL structure or i18n middleware

## Technical Constraints

- **Framework:** Qwik-City 2.x (resumability, no React)
- **CSS:** TailwindCSS 3.4+ + PostCSS pipeline
- **Runtime:** Bun 1.x
- **Deploy:** Cloudflare Pages (edge, no Node runtime)
- **Fonts:** Max 3 fonts (Inter, Geist, JetBrains Mono + Press Start 2P as display)
- **Performance:** JS per route ≤20KB gzip, CSS total ≤40KB gzip (from AGENTS.md hard limits)
- **Accessibility:** WCAG 2.2 AA, focus-visible required, no mouse-only interactions

## Integration Points

- **GitHub Issues:** `ankinow/uniteia-v2` (configured in docs/agents/issue-tracker.md)
- **BuyMeACoffee:** External link to https://buymeacoffee.com/lermf
- **Open-Design:** Local clone at `.imports/open-design/`, assets in `docs/design-reference/` and `public/frames-reference/`
- **Cloudflare Pages:** Edge caching for static assets (fonts, frames)

## Testing Requirements

### Visual Testing
- **Desktop (≥768px):** Sidebar visible, scanlines active, pixel font rendered
- **Mobile (<768px):** Sidebar hidden, header visible, content full-width
- **Cross-browser:** Chrome, Firefox, Safari (latest 2 versions)

### Functional Testing
- **SUPPORT button:** Opens https://buymeacoffee.com/lermf in new tab
- **Navigation:** Sidebar links work, proper hreflang attributes
- **Responsive:** No horizontal overflow at any breakpoint

### Accessibility Testing
- **Keyboard navigation:** Sidebar links focusable, skip links maintained
- **Screen reader:** aria-labels on SUPPORT button, sidebar navigation
- **Contrast:** Meets WCAG 2.2 AA (15.2:1 bone-on-void)

### Performance Testing
- **Lighthouse:** ≥95 (from AGENTS.md hard limit)
- **Font loading:** No render-blocking, `font-display: swap`
- **CSS:** Scanlines effect not causing repaints (use `pointer-events: none`)

## Acceptance Criteria

### Per Slice (to be expanded in ROADMAP.md)

1. **Slice 1: Open-Design Integration**
   - [ ] `.imports/open-design/` exists with cloned repo
   - [ ] `docs/design-reference/` contains copied design systems
   - [ ] `public/frames-reference/` contains device frames
   - [ ] `AGENTS.md` references open-design usage

2. **Slice 2: Sidebar Component**
   - [ ] `src/components/sidebar/index.tsx` created
   - [ ] Scanlines CSS in `src/components/sidebar/styles.css`
   - [ ] Press Start 2P loaded in `src/global.css`
   - [ ] `font-pixel` added to `tailwind.config.js`

3. **Slice 3: SUPPORT Donation Button**
   - [ ] `src/components/donation/index.tsx` created
   - [ ] Links to https://buymeacoffee.com/lermf
   - [ ] Opens in new tab with proper rel attributes
   - [ ] JRPG-style "item raro" gold gradient

4. **Slice 4: Two-Column Layout**
   - [ ] `src/routes/layout.tsx` modified for flex layout
   - [ ] Sidebar visible on desktop (`hidden md:block`)
   - [ ] Content area uses `flex-1`
   - [ ] Header maintained on mobile

5. **Slice 5: Multi-Context & Agent Skills (Completed)**
   - [ ] `CONTEXT-MAP.md` created at root
   - [ ] `docs/agents/` configured (issue-tracker, triage-labels, domain)
   - [ ] `AGENTS.md` updated with `## Agent skills` section

## Open Questions

1. **Sidebar navigation items:** Should sidebar duplicate header nav (Home, Topics) or have different items? **Current thinking:** Duplicate essential nav, add JRPG-specific items (status HUD, etc.)
2. **Sidebar collapse on desktop:** Should users be able to collapse sidebar on desktop? **Current thinking:** No (against simplicity), but could be future enhancement
3. **Scanline intensity:** 0.03 opacity is subtle — should it be configurable? **Current thinking:** Start fixed, add CSS custom property if needed
4. **Content alignment:** Should content area be centered or left-aligned with max-width? **Current thinking:** Follow existing editorial layout (centered with max-width from current design)

---

**Milestone created:** 2026-05-07  
**Milestone ID:** M001  
**Owner:** ankinow (github)  
**Operator:** LERMF (pt-BR)  
**Status:** Ready for planning (ROADMAP.md generation)
