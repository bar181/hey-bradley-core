# P101 / R1 — Brutal Review of Whiteboard Mode (Grandma + Framer)

> Wave 2 reviewer R1. READ-ONLY. Persona-scored, file:line cited.
> Scope: Whiteboard mode surfaces only — Builder shell, ChatInput stack
> (incl. ChatInputBar), MobileLayout, MobileListenFullscreen, Welcome,
> Onboarding. Planning + Agentics handled by R2.

## §1 Persona profiles

- **Grandma (floor ≥ 85):** non-technical user. First-time visitor. Wants
  a website built with as little jargon as possible. Cares about: clarity
  of next-step CTA, plain-English copy, button affordance ("is this
  clickable?"), error tolerance, mobile thumb reach. Penalises: jargon,
  dead-end copy, ambiguous icon-only buttons, illegible body text.
- **Framer (floor ≥ 85):** design-conscious user (Framer / Webflow / shop
  studio refugee). Cares about: typographic rhythm, token consistency,
  hover affordance (lift + colour), spacing harmony, no design drift
  across surfaces, restraint. Penalises: literal hex sprawl, mismatched
  border-radius, weak hover states, off-grid spacing, generic Tailwind
  defaults bleeding through.

## §2 Whiteboard surface inventory

Rubric (1-10 each axis): typography / spacing / token compliance /
accessibility / clarity-for-Grandma. Mean → surface score.

### S1. Builder shell — `src/pages/Builder.tsx`
- Lines 1-15. Pure delegating shell.
- Typo 9 / Spc 9 / Tok 10 / A11y 10 / Grandma 9 → **9.4 / 10**
- Notes: 14 LOC. `hidden md:flex` + `md:hidden` gate is correct (ADR-090).
  Zero hex literals. Zero copy. Inherits everything from children.

### S2. ChatInputBar — `src/components/shell/ChatInputBar.tsx`
- Typo 9 / Spc 9 / Tok 10 / A11y 9 / Grandma 8 → **9.0 / 10**
- Lines 38-42: `border-t border-hb-border bg-hb-surface` token-pure.
  Lines 53-54: `aria-label="Tell Bradley what to build"` + `aria-busy`.
  Line 65: send btn is 32×32 (`w-8 h-8`) — **fails 44×44 WCAG floor on
  mobile** even though parent surface is mobile-active.
- Line 52 placeholder "Tell Bradley what to build..." is friendly; the
  busy state "thinking..." is also clear. Grandma understands.
- Line 67: `<SendHorizontal size={16} />` — 16 px icon inside 32 px tap
  area. Framer reads this as cramped vs the 18-20 px lucide standard
  used in MobileLayout (line 143).

### S3. MobileLayout — `src/components/shell/MobileLayout.tsx`
- Typo 9 / Spc 9 / Tok 10 / A11y 9 / Grandma 7 → **8.8 / 10**
- Lines 75-106 token-pure. Mic btn (128-144) is 44×44 + token-driven +
  `active:scale-95` canonical mobile affordance. ARIA labels clean.
- Line 165 `<span>See Specs</span>` — **opaque jargon for Grandma**.
  "Specs" reads as engineer-speak; nothing on this surface explains what
  a spec is or why she'd want one. The pill is also visually identical
  to the inline mic in weight (both `min-h` pills, same z-10) — Grandma
  cannot tell which is the primary action.
- Line 96 `<h1>Hey Bradley</h1>` is the only brand mark; no tagline,
  no welcome state above the chat. First-time visitor sees an empty
  thread + two floating buttons.

### S4. MobileListenFullscreen — `src/components/shell/MobileListenFullscreen.tsx`
- Typo 9 / Spc 10 / Tok 10 / A11y 10 / Grandma 9 → **9.6 / 10**
- 44×44 floor met (line 113); 120 px mic minimum (line 81); ESC
  handler (44-51); `role="dialog" aria-modal="true"` (58-60); zero hex
  literals; pulsing ring is Tailwind `animate-pulse` only (91); transcript
  has `aria-live="polite"` (99). This is the strongest surface in the
  suite — Framer + Grandma both score it high.
- Tiny gap: line 102 placeholder "Tap mic to start" / "Listening..." is
  good but never tells the user what to *say*. A one-line hint
  ("e.g. 'make a coffee shop site'") would lift Grandma from 9 → 10.

### S5. Welcome (marketing landing) — `src/pages/Welcome.tsx`
- Typo 8 / Spc 8 / Tok 4 / A11y 8 / Grandma 8 → **7.2 / 10** ← BELOW FLOOR
- **47 literal hex colours** across the file (counted via `grep -cE`).
  Lines 33, 38, 41, 44, 51, 60, 67, 75, 76, 77, 91, 94, 98, 111, 116,
  127, 129, 145, 147, 149, 150, 178, 183, 189, 192, 196, 204, 206, 207,
  208, 221, 230, 232, 235, 241, 243, 244, 246, 247, 248. Brand orange
  `#e8772e` repeated ≥18 times. Framer reads this as raw — the rest of
  the app is `var(--hb-*)`-driven (per ADR-087); Welcome is the outlier.
- Line 77: hard-coded "**701** tests passing" / line 78 "**110** ADRs"
  / line 79 "**41** templates" / line 117 "71 phases sealed (P15-P85)"
  — **stale stats**. CLAUDE.md says ~1279+ tests, 130 ADRs, 43
  templates, 99 phases sealed. Framer + Grandma both notice "Built in 2
  days. Ready in 10." (line 114) reads as marketing fluff against the
  obvious 99-phase build.
- Line 81 "composite **82/100**" — also stale; CLAUDE.md P100 W2 FMT
  revised to 79→84/100. Trust hit if the visitor cross-checks.
- Lines 168-169 "12 themes. 17 example sites. 16 section types." —
  stale (now 21 themes / 43 examples / 18 section types).
- Hero h1 (line 41) is strong: "Your AI builds the wrong site 55% of
  the time." Grandma gets the hook. CTAs (49, 56, 65) clear.

### S6. Onboarding — `src/pages/Onboarding.tsx`
- Typo 8 / Spc 8 / Tok 3 / A11y 8 / Grandma 6 → **6.6 / 10** ← BELOW FLOOR
- **91 literal hex colours**. `#A51C30` (Harvard crimson) hard-coded
  ≥30× (lines 108, 111, 127, 174, 223, 255, 274, 299, ...). Token system
  (`var(--hb-accent)`) bypassed entirely. Framer scores this brutally —
  it's the largest single token-drift surface in the open-core repo.
- Lines 30-31 mode-hint copy: `"Planning mode ships in v2 — try
  Whiteboard for now."` and `"Agentics mode ships in v2 — try
  Whiteboard for now."` — **dead-end copy**. The rest of CLAUDE.md
  says Planning + Agentics shipped at P90-P99. Onboarding tells the
  user the modes don't exist. Grandma trusts the copy and never clicks
  through. Framer reads "v2" as a deferred-features cop-out.
- Line 108 `ProjectCard` hover-lift `hover:-translate-y-0.5` is
  canonical (good). But the same surface uses `hover:shadow-lg` +
  `hover:border-[#A51C30]/30` — Framer counts ≥3 different hover
  patterns on the same page (lines 108, 174, 255, 297-300).
- Line 308 "Coming Soon" pill reuses `text-[#9ca3af]` (off-token grey)
  — not the canonical `text-hb-text-muted`. Grandma sees two greys.

### Surface composite

| Surface | Score | Floor (8.5)? |
|---------|-------|--------------|
| Builder shell | 9.4 | PASS |
| ChatInputBar | 9.0 | PASS |
| MobileLayout | 8.8 | PASS |
| MobileListenFullscreen | 9.6 | PASS |
| Welcome | 7.2 | **FAIL** |
| Onboarding | 6.6 | **FAIL** |
| **Avg** | **8.4** | borderline |

## §3 Persona scoring

Per-surface dimensions weighted by persona relevance.

**Grandma (clarity 40 % + a11y 30 % + typography 20 % + spacing 10 %):**
- Builder 9.4 · CIB 8.8 · MobileLayout 8.4 · Listen 9.4 · Welcome 7.6
  · Onboarding 7.0 → weighted mean ≈ **8.43 / 10 → 84 / 100** ← below 85.

**Framer (typography 30 % + tokens 30 % + spacing 25 % + a11y 15 %):**
- Builder 9.5 · CIB 9.2 · MobileLayout 9.4 · Listen 9.7 · Welcome 6.6
  · Onboarding 5.8 → weighted mean ≈ **8.37 / 10 → 84 / 100** ← below 85.

**Composite: (84 + 84) / 2 = 84 / 100.**

Floor breach driven entirely by Welcome + Onboarding. The shell + chat +
listen surfaces are RC-grade; the marketing/onboarding entry path is not.

## §4 Honest gaps (top 5)

### G1. Onboarding tells the user 2 of 3 modes don't exist (BLOCKER)
- File: `src/pages/Onboarding.tsx:30-31`
- Drift: `"Planning mode ships in v2"` + `"Agentics mode ships in v2"`
  contradicts CLAUDE.md (P90 + P91-P99 sealed). Grandma trusts the copy
  and bails; Framer reads it as a v1 product with vapourware tabs.
- Fix: rewrite both lines to point at `/planning` + `/agentics` (≤ 4 LOC).
  Owner-A4 candidate post-Wave 2.

### G2. Onboarding token drift (91 hex literals; BLOCKER for Framer)
- File: `src/pages/Onboarding.tsx:108-308` (representative).
- Drift: `#A51C30`, `#e5e1dc`, `#1a1a1a`, `#9ca3af`, `#6b7280`, `#f0ede8`,
  `#faf8f5`, `#f3f4f6`, `#f87171` all hard-coded; `var(--hb-*)` never
  used. Violates ADR-087 across the highest-traffic entry surface.
- Fix: token-replace pass. Estimated 80-100 LOC across the file. Cannot
  be ≤30 LOC budget — flag as **post-RC P102** or Tier-2 polish pass.

### G3. Welcome stats stale by 6+ phases (BLOCKER for trust)
- File: `src/pages/Welcome.tsx:77-81`, `:114-118`, `:168-169`
- Drift: 701 tests / 110 ADRs / 41 templates / 71 phases / 82 composite.
  Reality: ~1279+ / 130 / 43 / 99 / 79-84.
- Fix: ≤8 LOC string updates. Grandma trust + Framer credibility both
  recover. Owner-A4 candidate.

### G4. Welcome hex sprawl (47 literals) breaks Framer cohesion
- File: `src/pages/Welcome.tsx:33-251` (representative).
- Drift: brand `#e8772e` + `#c45f1c` + `#6b5e4f` + `#2d1f12` + `#f1ece4`
  hard-coded. Welcome ships its own palette divorced from the AppShell
  token system. Framer notices on first scroll.
- Fix: same as G2 — needs a marketing-palette token suite or full
  token-migrate. ≤ 60-80 LOC. Post-RC P102 candidate.

### G5. MobileLayout "See Specs" pill is jargon to Grandma
- File: `src/components/shell/MobileLayout.tsx:148-166` (label line 165).
- Drift: "Specs" is engineer-speak. The pill is also visually equivalent
  in weight to the inline mic (both pills, both bottom-anchored, same
  z-10). Grandma cannot rank primary vs secondary action.
- Fix: rename to "See Plan" or "See AISP & plan" (≤ 2 LOC) AND
  de-emphasise the pill (border + text-muted, no accent hover) so the
  mic is clearly primary. ≤ 6 LOC.
- Bonus: ChatInputBar send button (`src/components/shell/ChatInputBar.tsx:65`)
  is 32×32 in mobile context — under WCAG 44 px floor when reached via
  MobileLayout. ≤ 3 LOC fix (`w-11 h-11` swap on `<md`).

## §5 Verdict

**Whiteboard mode RC-readiness: PARTIAL.**

The chat + listen + shell surfaces are unambiguously RC-grade
(Builder 9.4 / ChatInputBar 9.0 / MobileLayout 8.8 / Listen 9.6 — all
above the ADR-094 8.5 floor). The marketing/onboarding entry path
(Welcome 7.2 / Onboarding 6.6) drags both personas under their 85 floor.

### Blocker fixes for A4 to flag (P101 follow-on or post-RC)

1. **G1 — Onboarding mode-hint copy rewrite (≤ 4 LOC).** Pre-RC. Owner can
   ship inside the P101 window — straight string swap pointing at the
   live `/planning` + `/agentics` routes.
2. **G3 — Welcome stats truth-up (≤ 8 LOC).** Pre-RC. Same window.
   Trust-critical for Show HN / PH launches.
3. **G5a — "See Specs" → "See Plan" rename (≤ 2 LOC).** Pre-RC.
4. **G5b — ChatInputBar send btn 32×32 → 44×44 on mobile (≤ 3 LOC).**
   Pre-RC. WCAG floor.
5. **G2 + G4 — Welcome + Onboarding token migration (~150 LOC across two
   files).** **Post-RC P102 / OC-POLISH-W5.** Too large for the P101
   30-LOC budget; ship as a dedicated polish sprint.

### Net composite after blockers 1-4 (no token migration)

Grandma 84 → ~88 (mode-hint trust + send btn + spec-rename lifts).
Framer 84 → ~86 (stats truth-up + send-btn proportion lift).
Composite ≈ **87 / 100** — clears 85 floor for both personas.

### Net composite after full G2 + G4 token migration (P102)

Grandma ~89 / Framer ~92 / Composite ~91. Welcome + Onboarding both
clear 8.5; entry path matches the rest of the app's design discipline.

— END R1 / WHITEBOARD —
