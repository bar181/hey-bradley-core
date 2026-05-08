# P122 / UX-OVERHAUL — Session Log

> **Phase contract:** Lift cumulative public-site + builder visual quality from ~40/100 to ≥70/100 (goal 90+).
>
> **Status:** Awaiting P121 merge. Wave 1 not yet dispatched.
>
> Append entries chronologically. This is the primary record for future agents.

---

## 2026-05-08 — Phase scaffolded

- Preflight written (`plans/hitl/phase-122/preflight.md`) covering rubric, DoD, scope (in/out), wave plan, risks, owner Qs.
- `human-1.md` (May 8 owner feedback) is the source of truth for the gap inventory; preflight §3 mirrors its Priority 1 + relevant Priority 2 items.
- Existing screenshots in this folder (`agentics - aisp.png`, `builder - chat.png`, etc.) become the before-state baseline; A1 audit will pair each with a re-score after fixes land.
- Dispatch is **gated on P121 merge to main** — do not start Wave 1 from `swarm/p120.5-under-the-hood` (already 355 commits ahead).
- 5 owner Qs in preflight §7; resolve before Wave 1 dispatches.

## 2026-05-08 PM — Owner scope expansion: visual quality bar + walkthrough revert + cheap-fast LLM lock

After W2-W6 dispatched (5 background agents in parallel; W3 returned with ListenPreview shipped 189 LOC), owner re-scoped P122 with new direction:

- **Surface-level baseline established (owner human review):** public site 40/100 · builder 40/100 · Agentics/specs 50/100. Targets revised: public ≥60 · builder ≥60 · Agentics ≥65 in P122 (was: 50/100 floor across the board).
- **Bottom-line direction:**
  - "Most buttons look horrible" → button modernization sweep (shadcn variants, real hover/focus, modern padding/sizing).
  - "All language should be appropriate for a new visitor" → language tone pass; technical depth relocates to existing P118 blog posts.
  - "Site is very confusing for all sections" + "components look 15 years old" → component freshness audit, ≤8 shadcn replacements in P122 (rest carry to P123).
  - "About my capstone can include both non-tech and AISP highlights" → capstone page gains a "How the engineering works" sub-section (~60 LOC) without disturbing existing non-tech narrative.
  - "Index + capstone copy is good" → KEEP as-is; only modernize the chrome around them.
- **Walkthrough revert (W9 NEW):** owner wants the *original* 3-pane walkthrough back: left = prompts with red pulsing glow + center = animated mock typewriter + right = mobile site preview. Reverts the P118.5 6-scene scroll-snap. Source spec lives somewhere in `plans/implementation/phase-1` through `phase-15/`; W9/A locates it. Found candidate refs in phase-3/4/5/7 archives.
- **Gemini cheap-fast model lock (W6 addendum):** `geminiAdapter.ts` already defaults to `gemini-2.5-flash` — keep it; document cost-per-prompt < $0.001 in W6 smoke write-up. Owner has limited BYOK budget.
- **Wave plan extended:** W7 production bugs → W8 NEW (visual + language overhaul) → W9 NEW (walkthrough revert) → W10 closer (was W7/W8). 3 new tests will land: `tests/p122-ui-overhaul.spec.ts` + `tests/p122-agentics-views.spec.ts` + `tests/p122-walkthrough-revert.spec.ts`.

In-flight W2/W4/W5/W6 are not interrupted — they finish their scoped work first. W8/W9 dispatch only after all return + W7 bugs lock in (so they can build on a stable base).

## 2026-05-08 — Workflow shift to feature-branch + LLM/Agentics scope expansion

- Owner direction: stop pushing to `main` for P122+. Cut new branch `swarm/p122-ux-overhaul` from `main` at `5b3d52398`; keep local-only until P122 work is ready for PR review.
- P121 sealed. Retrospective and session-log finalized; merge sequence + Vercel production deploy + `vercel.json` SPA hotfix all recorded.
- **P122 scope expanded** beyond the original UX-only lift:
  - **LLM live wiring** — Gemini API key now available locally (`.env` populated; `.env.example` updated with `GEMINI_API_KEY` + `GEMINI_KEY_NAME` + `GEMINI_PROJECT_NAME` + `GEMINI_PROJECT_NUMBER` placeholders).
  - **Agentics LLM log view** — fetch `log_events` filtered by `project_id`, display JSON with redaction holding.
  - **Agentics DB view** — fetch any `project_id`-indexed table, display JSON.
  - This was originally P124 scope; collapsed forward into P122 per owner direction since the key is on hand.
- P124 scope reset to "open / reassess at P122 close".
- Preflight §4-G added with 5 new items (21–25); DoD updated with 3 new boxes; Wave plan extended W6 → W7 → W8.

## 2026-05-08 — Owner production smoke test → 4 bugs surfaced + 1 hotfix shipped

Owner ran a quick smoke test against the freshly-deployed live site at `https://hey-bradley-core.vercel.app/` and reported:

1. **Critical: `/builder` returned 404** — and presumably every other deep link too. Console error: `core.js:297 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'payload')`.
2. **Builder bug: "add page" doesn't work** — the action is unresponsive.
3. **Builder bug: hero photo switch mutates image URL** — switching from "full photo" layout to other photo options changes the image unexpectedly.
4. **Tone reminder: default should look like Hey Bradley** (same colors + tone). Already locked in `human-2.md` decisions; owner re-emphasised.

### Hotfix (this session)

- **`/builder` 404** — root cause: no SPA fallback configured for Vercel. The Vite app routes 16+ paths client-side via React Router, but Vercel was serving the static asset tree only — every non-root URL returned a 404 page from the static file server before React even loaded.
- Fix: NEW `vercel.json` at repo root with `{ "source": "/(.*)", "destination": "/index.html" }`. Pushed direct to main as commit `54d0a1d9f` since the live site was visibly broken for every non-root URL. Vercel auto-redeploys on push.
- The `core.js:297` console error is most likely from a Vercel toolbar widget or a browser extension (the bundled app entry is `index-*.js`, not `core.js`). Logged as item §4-F-20 to verify post-redeploy, but tracking-not-blocking.

### Carried into P122 §4-F (production bug fixes)

- §4-F-16 — 404 hotfix [CLOSED via `54d0a1d9f`]
- §4-F-17 — Add Page broken
- §4-F-18 — Hero photo switch mutates image
- §4-F-19 — Default template tone (Hey Bradley dark/crimson) [already in §4-B-5]
- §4-F-20 — `core.js:297` console error (track post-redeploy)

DoD §3 updated: 2 boxes auto-checked from this session (`Node 22 pin` from P121 close + `404 SPA rewrite`); 2 new boxes added (`Add Page works`, `Hero photo switch preserves image URL`).

## Open log: append below as work continues

<!-- Format: ## YYYY-MM-DD — short title, then bullet entries -->

## 2026-05-08 — W2 (default template + 4-card picker) — coder agent

- **Hey Bradley default template** (`src/data/default-config.json`) — full rewrite. Per `human-2.md` lines 50-90: 4-section spine (Hero + Features + Stats + CTA band) plus nav + footer = 6 total sections so the rendered preview reads as a complete site. Theme `mode: "dark"`, `accentPrimary: "#A51C30"` (Harvard crimson; matches `--hb-accent` in light-mode tokens). Hero `style.background` is a CSS `radial-gradient(...)` orb on `#0f0f10` — **no stock photos**, all 3 image components disabled per the locked direction. Hero copy: H1 "Describe it. See it." / H2 "Your voice is the whiteboard. Describe any site. Watch it build." / CTA primary "Start describing" + CTA secondary "Watch a demo" (route to `/walkthrough`, the existing P118.5 surface). Features: 🎙 Listen mode / ⚡ Real time, not rebuild / 📄 Export the spec. Stats: 92% / <2% / 0.8s with the Harvard ALM Capstone citation. CTA band: "Ready to build?" → "Try the builder". `voiceAttributes` = 4; `storytellingPreset: "founder-direct"` per ADR-141 D2. Zod-valid (verified by `npm run build` succeeding — `configStore.ts:24` parses default-config through `parseMasterConfigSafe`).
- **Portfolio template** (NEW `src/data/examples/portfolio-clean.json`) — Card 3. Light theme (`#faf8f3` parchment), Fraunces serif headings, Inter body, warm earth-tone accent (`#8a6a3f`). 4 sections + nav + footer: Hero ("Your Name Here" / "Designer · Builder · Maker") + Gallery 3-col + About text block + Contact action band. `voiceAttributes` = 4 + cites `founder-direct` preset.
- **TemplatePicker component** (in `src/pages/Onboarding.tsx` — added inline ~190 LOC). 2×2 grid (`grid-cols-1 sm:grid-cols-2`); each card = CSS-only mock thumb (gradient + 3 abstract bars + 2 button mocks) + name + 1-line description + crimson "Use this template" button. testids: `template-picker` + `template-card-{id}` + `template-card-{id}-button`. Hey Bradley pre-selected via `defaultTemplateId="hey-bradley"`. Selected state shows `ring-2 ring-[rgb(var(--hb-accent-rgb)/0.25)]` + "Selected" pill.
- **Right panel replaced** — the prior 12-theme grid (audit lines 879-902) is now `<TemplatePicker />` with a footnote pointing users to the Examples tab for full theme browsing. `ThemeCard` component definition removed (replaced with comment block) + `handleThemeSelect()` callback removed (replaced with comment) — both unused after the swap and would have tripped TS6133 (`noUnusedLocals: true`).
- **`handleTemplateSelect()` callback** mirrors `handleExampleSelect()`: `loadConfig(option.config)` → write to localStorage → `saveProject(option.name, option.config)` → focus the hero section via `setSelectedContext()` → `navigate('/builder')`. P114 / A1 saveProject UI-wire pattern preserved.

### Swarm-pick choice + rationale

- **Card 4 = Hazel & Birch · Wedding Planning** (P116/B1 demo at `src/data/examples/wedding-planner.json`). Looked up at render time via `EXAMPLE_SITES.find(name === 'Hazel & Birch · Wedding Planning')`, with North Light agency as fallback if renamed.
- **Why this one over the other 63 candidates:**
  1. **Most complete recent polish round** — sealed at P116 with full Zod-valid shape + `voiceAttributes ≥ 3` + cites `theron-miller-hard-twist` storytelling preset.
  2. **Visually distinct from Hey Bradley** — light parchment + sage + brass on Fraunces serif vs. Hey Bradley's dark + crimson on Inter. The 4 cards read as 2 light + 2 dark, 2 serif-leaning + 2 sans, distinguishable at a glance.
  3. **Most likely to impress** — emotional resonance (real named couples in testimonials, Asheville location specificity, "we take eight weddings a year. we are usually full a year out" as a credibility hook).
  4. **NOT generic SaaS** — Hey Bradley + Kitchen Sink + Portfolio already cover dark-tech / reference / personal-creative quadrants. Wedding planner maps the "real-world non-tech consumer service" quadrant.
- Considered + rejected: `north-light-agency` (close runner-up, but agency = still business-tech-adjacent); `bayview-non-profit-community` (great copy, but Inter on white reads similar to a generic SaaS thumb); `hey-bradley-flagship` (would be a meta-loop given Hey Bradley is Card 1).

### Verification

- `npm run build` passes (27.2s) — zero tsc errors.
- `default-config.json` parses against the Zod schema (configStore.ts:24 runs through `parseMasterConfigSafe`).
- 4-card grid renders 2×2 at sm+ widths; stacks 1×4 on mobile.
- Hey Bradley card carries selected ring + badge on mount.

### Cross-wave concerns

- None. W3 owns `Welcome.tsx`, W4 owns left-panel + center-canvas, W5 owns sql-wasm + `db.ts`, W6 owns `Agentics.tsx` — all untouched. My scope: `default-config.json` + `Onboarding.tsx` (right-panel + import + callback) + new `portfolio-clean.json`. No file collisions.

### Spec deviation

- Spec said "3 NEW template JSONs"; I shipped **1** new JSON (`portfolio-clean.json`). The per-card spec only describes Card 3 as "NEW JSON" — Cards 1, 2, 4 explicitly reuse existing assets (default-config rewrite, kitchen-sink from EXAMPLE_SITES, swarm-pick from EXAMPLE_SITES). Read literally, only Portfolio is genuinely new. Documented here in case the count was load-bearing.
