# Brutal Honest Review — 6-Persona Assessment

**Date:** 2026-04-04
**Reviewer:** AI Swarm (code-level review of all major components)
**Build:** Phase 10 closed, 71 tests, 91K lines

---

## Composite Score: 45.8/100

| Persona | Score | Verdict |
|---------|-------|---------|
| 1. Wix/Squarespace Grandma | 38 | Landing page scares away, too much jargon |
| 2. Framer Power User | 42 | No inline editing, no visual variant previews |
| 3. Agentic Engineer | 61 | Build Plan is useful, but workflow is manual/disconnected |
| 4. Lovable/Bolt User | 29 | "It doesn't actually build the website?" |
| 5. Harvard Capstone Reviewer | 72 | Technical depth is A-level, presentation is B-level |
| 6. First-Time Cold Open | 33 | No clear value prop in first 10 seconds |

---

## The Core Problem

**Hey Bradley has a 70/100 backend with a 35/100 frontend.**

The Build Plan generator and AISP Crystal Atom generator are legitimately good. The spec output quality is the product's unfair advantage. Everything else in the UI is making it harder for users to discover this value.

---

## Persona 1: Wix/Squarespace Grandma (38/100)

**First 5 seconds:** "Dark screen with a chat that types by itself. Where's the Make a Website button?"

**Works:**
1. Onboarding page (`/new-project`) is well-designed — 1-2-3 steps, example cards with previews
2. Section names use grandma-friendly labels (Main Banner, Content Cards, Action Block)
3. Simple/Expert tabs signal a two-track approach

**Broken/Confusing:**
1. Landing page (Welcome.tsx) — disabled input field, 30-second forced animation, fake AI conversation
2. "AISP" means nothing. "Crystal Atom Platinum" is intimidating. Tab labels Data/Specs/Pipeline are developer jargon.
3. No "publish" or "see my website" button anywhere

**Most impactful change:** Replace Welcome.tsx with 3 big buttons: Start from Scratch, Browse Templates, Open Saved Project

**Would they use it?** No.

---

## Persona 2: Framer Power User (42/100)

**First 5 seconds:** "Developer side project, not a design tool. Where's the visual editing?"

**Works:**
1. 3-panel layout follows Figma/Framer pattern
2. Variant system exists (centered, split, minimal)
3. 8 examples span decent variety

**Broken/Confusing:**
1. No visual editing on canvas — can't click a heading and edit inline
2. Typography system is theme-level only (no per-element control)
3. Variant picker has no visual thumbnails

**Most impactful change:** Add inline text editing on canvas

**Would they use it?** No.

---

## Persona 3: Agentic Engineer — THE KEY PERSONA (61/100)

**First 5 seconds:** "Oh interesting — AISP specs and build plans I can paste into Claude Code."

**Works:**
1. Build Plan generator produces section-by-section implementation instructions with exact CSS, props, variants
2. AISP Crystal Atoms with typed schemas, verification rules, per-section Γ/Λ/Ε — academically impressive
3. 6 spec views from one config — complete documentation suite

**Broken/Confusing:**
1. No "paste into Claude Code" guided workflow — user must figure out what to DO with the spec
2. Chat tab is canned pattern matching, not AI — "build me a SaaS landing page" produces nothing useful
3. No import from existing codebase — brownfield notation exists but repo connection is placeholder

**Most impactful change:** Add "Send to AI" workflow modal with exact prompt + one-click copy

**Would they use it?** Maybe — if the guided workflow existed.

---

## Persona 4: Lovable/Bolt User (29/100)

**First 5 seconds:** "Wait, this doesn't actually BUILD the website?"

**Works:**
1. Visual builder gives more control than a text prompt
2. Specs are more reproducible than Lovable's variable output
3. Exact hex colors in spec (Lovable guesses from prompt)

**Broken/Confusing:**
1. Landing page says "AI Website Builder" — there is NO AI. False advertising.
2. No deployment. Lovable deploys with one click.
3. Entire product requires an external tool (Claude Code) to produce value

**Most impactful change:** Rebrand honestly as "AI Spec Generator for Developers" OR add actual AI generation

**Would they use it?** No.

---

## Persona 5: Harvard Capstone Reviewer (72/100)

**First 5 seconds:** "Working prototype with genuine technical depth. AISP is novel."

**Works:**
1. AISP protocol is genuinely innovative — formal notation with quantifiers, typed schemas, verification rules
2. 6-spec generation pipeline shows systems thinking
3. Code quality visible — typed interfaces, Zustand stores, DDD patterns

**Broken/Confusing:**
1. Demo flow is fragile — 30s animation trap on landing page
2. 88% reproduction claim not verifiable from UI — no side-by-side comparison
3. "AI Website Builder" overpromises — reviewer will note lack of actual AI

**Most impactful change:** Add reproduction demo showing Hey Bradley preview vs Claude output side-by-side

**Would they grade A?** B+ to A- range. A requires: fix landing page, demonstrate reproduction live, honest framing.

---

## Persona 6: First-Time Cold Open (33/100)

**First 5 seconds:** "Dark screen, fake chat, disabled input. Is this a demo video?"

**Works:**
1. Animated chat is visually engaging passively
2. "Get Started" button eventually leads to good onboarding
3. Example preview cards provide visual "aha"

**Broken/Confusing:**
1. First 10 seconds communicate nothing about what the product does
2. Landing → builder requires 3 page transitions, first is 30s animation trap
3. "Aha moment" (spec generation) requires 4 cognitive leaps, none guided

**Most impactful change:** Replace landing hero with 10-second value proposition + demo GIF

**Would they tell a friend?** No.

---

## Top 10 Improvements (Impact vs Effort)

| # | Improvement | Impact | Effort | Files |
|---|------------|--------|--------|-------|
| 1 | **Replace Welcome.tsx landing page** — static hero, value prop, demo GIF, 3 CTAs | Critical | Medium | Welcome.tsx |
| 2 | **Add "Send to AI" workflow** — modal after copy with exact Claude Code prompt | High | Low | XAIDocsTab.tsx |
| 3 | **Remove "AI Website Builder" claims** — honest "Spec Generator" language | High | Trivial | Welcome.tsx |
| 4 | **Rename center tabs** — Preview/Data/Specs/Pipeline → Preview/Blueprints (hide Data/Pipeline) | High | Trivial | TabBar.tsx |
| 5 | **Add inline text editing** on canvas preview | High | High | New components |
| 6 | **Guide to Specs tab** — tooltip/nudge after first section edit | Medium | Low | TabBar.tsx |
| 7 | **Visual variant previews** — thumbnails in right panel | Medium | Medium | SimpleTab.tsx |
| 8 | **Reproduction demo** — side-by-side Hey Bradley vs Claude output | High | High | New component |
| 9 | **Fix Chat tab** — add structured command autocomplete | Medium | Medium | ChatInput.tsx |
| 10 | **Listen tab honesty** — connect to Web Speech API or relabel as "Demo" | Low-Med | Medium | ListenTab.tsx |

---

## Phase 10 Remaining Checklist

- [ ] Landing page overhaul — kill 30s animation, add clear value prop
- [ ] Honest messaging — remove "AI Website Builder" from all pages
- [ ] Rename confusing tabs — hide Data/Pipeline, rename Specs → Blueprints
- [ ] Add "How to Use This Spec" instructions in XAIDocsTab
- [ ] Fix Chat tab — label as "Commands" or add command docs
- [ ] Fix Listen tab — relabel "Start Listening" to "Demo Mode"
- [ ] Auto-select hero on builder load
- [ ] Mobile landing page — showcase hidden on mobile

---

## Phase 11 Requirements

| # | Feature | Priority | Dependencies |
|---|---------|----------|-------------|
| 1 | Claude API integration (generate site from spec) | P0 | API key, billing |
| 2 | Real chat (LLM-powered config modification) | P0 | Claude API |
| 3 | Reproduction scoring (visual diff) | P0 | Claude API output |
| 4 | Export to React+Tailwind code | P1 | Code generation |
| 5 | Brownfield repo connection | P1 | GitHub API |
| 6 | Speech-to-text (real Listen mode) | P1 | Web Speech API or Whisper |
| 7 | User accounts + cloud persistence | P2 | Supabase |
| 8 | Hey Bradley website (about, open core, docs) | P1 | Static content |

---

## Bottom Line

The product is a **70/100 backend** with a **35/100 frontend**.

The Build Plan generator and AISP Crystal Atoms are the unfair advantage. The spec output quality IS the product. Everything else in the UI is hiding this value behind jargon, misleading claims, and a self-indulgent landing page.

**Fix the frontend. Be honest about what it is. Guide users to the value.**
