# Hey Bradley — Phase 6 Session Grounding (New Session)

**Date:** April 3, 2026  
**Project:** JSON-driven marketing website specification platform for Harvard capstone (May 2026)  
**Repo:** github.com/bar181/hey-bradley-core  
**Tech:** Vite + React 18 + TypeScript + Tailwind + shadcn/ui + Zustand + Zod  
**Vercel:** CI/CD already configured and deploying from main

---

## 1. WHAT HEY BRADLEY IS

A platform where users describe a website → see it build in real-time → get production-ready AISP specifications. Three interaction modes: Builder (click to edit), Chat (type commands), Listen (voice with red pulsing orb).

**The output is NOT HTML.** The output is AISP specifications — structured documents that any AI coding agent (Claude Code, Cursor) can use to reproduce the site. The XAI DOCS tab generates these specs live from the project JSON.

**Pipeline:** Ideation → Hey Bradley → Specs + JSON → Claude Code → Production Site

---

## 2. WHAT'S BEEN BUILT (Phases 1-6 Session 1)

| What | Status |
|------|--------|
| 15 section types | Done (hero, menu, content-cards, pricing, action, quotes, questions, numbers, gallery, footer, image, divider, text, logos, team) |
| 47+ variant renderers | Done (62 template files) |
| 10 themes with full JSON replacement | Done (invisible design names: SaaS, Agency, Portfolio, etc.) |
| 6-slot color palette system | Done (10 curated palettes) |
| 3-tab left panel (Builder/Chat/Listen) | Done |
| Chat with 6+ canned commands | Done |
| Listen mode with red pulsing orb | Done |
| Full-page preview mode | Done |
| Onboarding page with theme selection | Done |
| Welcome splash page | Done |
| Section CRUD (add/remove/duplicate/reorder) | Done |
| ImagePicker (50 images, 10 videos) | Done |
| Undo/redo (100 steps) | Done |
| localStorage persistence | Done |
| Data Tab with CodeMirror | Done |
| Responsive preview (mobile/tablet/desktop) | Done |
| Playwright tests (26 passing) | Done |
| Section headings above card grids | Done (Phase 6 S1) |
| Scroll-triggered entrance animations | Done (Phase 6 S1) |
| AISP spec generation in XAI DOCS | Done (Phase 6 S1) |
| Micro-interactions (hover, shadows, transitions) | Done (Phase 6 S1) |
| Neutral default text (replaced SaaS jargon) | Done (Phase 6 S1) |

### Phase 6 Session 1 Delivery (Last Session)

- 75 files changed, 4,323 insertions, 490 deletions
- ADR-026: AISP Output as Primary Output
- Section headings on all grid templates
- useScrollReveal hook with IntersectionObserver
- Micro-interactions (button hover, card shadows, tab transitions)
- AISP Platinum-tier spec generation
- Neutral default text across templates
- Loop 1 review scored 65/100
- Loop 2 fix agent was running (top 5 fixes) when session ended

---

## 3. CURRENT PERSONA SCORES

| Persona | Score | Key Gap |
|---------|-------|---------|
| Agency Designer | 68 | Missing resting card shadows, uniform spacing |
| Grandma | 58 | SaaS defaults, can't upload photos, "More Sections" invisible |
| Startup Founder | 70 | No publish/export, single pricing variant |
| Harvard Professor | 72 | "Can I see the output?" → AISP specs now answer this |
| **Composite** | **67** | Target: **80+** |

---

## 4. GENERAL RULES FOR THE SWARM

### Design Rules
1. **No developer jargon in user-facing UI.** "Hero" is OK. "CTA" is NOT. Use the hybrid naming: Columns, Action, Quotes, Questions, Numbers, Gallery, Menu, Footer.
2. **Every interactive element needs:** hover feedback (200ms), focus ring, active state, disabled visual. Cards need `shadow-sm` resting + `shadow-lg hover` + `-translate-y-1 hover`.
3. **All colors come from the 6-slot palette.** No hardcoded hex in templates. Use `section.style.color`, `section.style.background`, or `color-mix()` for derived colors.
4. **Section headings above every card grid.** Read from `section.content.heading` + `section.content.subheading`.
5. **Respect `prefers-reduced-motion`.** All animations must check this media query.
6. **Harvard HMS brand palette for builder chrome.** Crimson #A51C30 accent. Dark mode: #2C2C2C panels. Light mode: #F7F5F2 panels. No navy/indigo.
7. **Max 8-10 controls in SIMPLE tab per section.** Layout cards + Element toggles + Media. Content in collapsed accordion.
8. **Right panel hides in Chat and Listen modes.** Center canvas expands to fill the space.

### Code Rules
9. **No code without Playwright verification.** Cardinal Sin #13 — screenshot what you built before committing.
10. **Use Tailwind classes, not inline styles,** except for dynamic values (gradients, background images, colors from JSON).
11. **Use shadcn/ui components** for all interactive elements (Button, Switch, Accordion, Dialog, Tabs).
12. **Zod schema validates all JSON.** Any new field needs a schema update.
13. **`data-testid` on all editor inputs.** Playwright must be able to find every control.

### Process Rules
14. **Research before code.** For any new feature: web search best practices, document findings, write ADR if architectural.
15. **Phase-level DoD is fixed.** Sub-phase tasks are agile.
16. **Run `npx tsc --noEmit && npx vite build` before every commit.** Zero errors.
17. **Take screenshots after visual changes.** Compare against the design intent.

---

## 5. PHASE 6 REMAINING WORK

Phase 6 Session 1 completed the research, ADRs, and most visual polish. What remains:

### 5.1 Verify Loop 2 Fixes Landed

The Loop 2 fix agent was implementing 5 fixes when the session ended. Check if these committed:
1. Section headings consistency across all grid templates
2. Resting card shadows (`shadow-sm`) on all card templates  
3. AISP syntax highlighting in XAI DOCS
4. Example JSON configs updated with headings
5. Spacing variation per section type

If any didn't land, implement them.

### 5.2 Example Websites (3 More Needed)

Only `bakery.json` exists. Create:
- `launchpad-ai.json` — SaaS theme, dark, 6 sections, technical copy
- `sarah-chen-photography.json` — Portfolio theme, overlay hero, Gallery section, artistic copy
- `greenleaf-consulting.json` — Professional theme, light, Numbers section, corporate copy

Add "Try an Example" buttons to onboarding page AND chat tab quick-demo area.

### 5.3 Canned Demo Simulation

`src/lib/demoSimulator.ts` — timed sequence that loads an example JSON and reveals sections one-by-one with typewriter captions in the chat. Wire to chat quick-demo buttons and listen tab "Watch a Demo."

### 5.4 Listen Mode Orb Polish

The orb must look cinematic — three CSS layers (solid core + blurred mid-ring + ambient glow). During simulation: pulse accelerates, glow intensifies. After: slow return to idle.

### 5.5 Re-Score to 75+

After implementing the above, run the 4-persona brutal review. Target 75+ composite. If below 75, identify top 3 fixes and iterate once more.

---

## 6. KEY FILES

| File | Purpose |
|------|---------|
| `src/store/configStore.ts` | All state: patches, CRUD, undo/redo, theme switching |
| `src/store/uiStore.ts` | UI state: selected context, preview width, panel visibility |
| `src/data/themes/*.json` | 10 theme JSON files |
| `src/data/default-config.json` | Starting project config |
| `src/data/examples/bakery.json` | Example website |
| `src/components/left-panel/LeftPanel.tsx` | 3-tab panel (Builder/Chat/Listen) |
| `src/components/right-panel/SimpleTab.tsx` | Per-section SIMPLE editors dispatch |
| `src/components/center-canvas/RealityTab.tsx` | Preview renderer |
| `src/components/center-canvas/XAIDocsTab.tsx` | AISP spec generation |
| `src/templates/*/` | 62 template renderer files |
| `src/lib/cannedChat.ts` | Chat command parser |
| `docs/adrs/` | Architectural decision records |

---

## 7. SWARM INSTRUCTIONS

**Start by checking what Loop 2 delivered.** Run `git log --oneline -5` to see the latest commits. Run `npx vite build` to verify clean build. Run `npx playwright test` to verify all tests pass. Take screenshots of the builder in SaaS theme (dark) and Personal theme (light) to assess current visual state.

**Then execute in this order:**

1. **Verify/fix Loop 2 items** (section headings, card shadows, AISP highlighting, spacing)
2. **Create 3 example JSONs** (SaaS, Photography, Consulting) with real copy and images
3. **Build demo simulator** + wire to chat buttons and listen tab
4. **Polish the listen mode orb** for cinematic quality
5. **Run 4-persona brutal review** — target 75+
6. **Fix top 3 issues** from the review
7. **Commit, push, verify Vercel deploy works**

**The product has enough features.** Do not add new section types or variants. Focus entirely on: visual polish, AISP spec quality, example websites, and the canned demo simulation. The capstone demo is won by 10 sections that look perfect with a stunning listen mode animation, not by 15 sections with rough edges.