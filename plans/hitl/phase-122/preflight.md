# P122 / UX-OVERHAUL — Preflight

> **Mission:** First lift in a 3-phase staged climb. P122 takes cumulative public-site + builder visual quality from ~40/100 to **≥50/100** AND brings live LLM (Gemini BYOK) online with Agentics observability surfaces (LLM log + DB view). P123 lifts to ≥65. P124 was originally scoped as LLM-key — owner moved that into P122 since the key is available locally now.
>
> **Why staged:** Owner re-scoped after `human-2.md` (May 8). A single 40 → 70+ shot risks scope creep and a leaky UX surface where some pages move while others lag. Two 50/65 milestones with retrospectives between them keep regression risk low.
>
> **Branch:** `swarm/p122-ux-overhaul` (cut from `main` at `5b3d52398` on 2026-05-08, **local-only — do not push without owner sign-off**). Workflow shifted from direct-to-main pushes (used during the P121 merge week) back to feature-branch + PR-review for all P122+ changes. Hotfixes can still go direct to main but should be the exception, not the rule.

---

## 1. Owner decisions — LOCKED (from `human-2.md`, 2026-05-08)

| # | Question | Locked answer |
|---|---|---|
| 1 | Default template | Hey Bradley site — dark theme, crimson accents, professional |
| 2 | Landing preview card | Listen-mode-style preview (less prominent, scaled-down, opacity ~0.85) |
| 3 | Nav + messaging | **Do not touch** — nav is fine, hero copy stays |
| 4 | Builder UI scope | Critical fixes only; target 50/100 |
| 5 | Gemini API key | Phase 124 — not this phase |

**Do-not-touch list (P122):** `MarketingNav.tsx`, `Welcome.tsx` hero copy, AISP Crystal Atom view, Listen mode core UI, `BlogPost.tsx`, `About.tsx`, `Docs.tsx`, builder logic, LLM adapter code, `src/lib/blogPosts.ts`.

---

## 2. Scoring rubric (anchored to external benchmarks)

**Per-surface baseline (owner human review 2026-05-08):**

| Surface | Today | P122 target | P123 target |
|---|---:|---:|---:|
| Public site (`/`, `/capstone`, `/walkthrough`, `/blog`) | **40/100** | **60/100** | 75 |
| Builder (`/builder` whiteboard mode) | **40/100** | **60/100** | 75 |
| Agentics / specs (`/agentics`) | **50/100** | **65/100** | 75 |

**Anchors:**

| Score | Anchor | Meaning |
|---|---|---|
| **40** | Where Hey Bradley is today | Buttons "look horrible" (owner verbatim), language is engineer-jargon, components feel 15 years old, site is confusing across all sections |
| **60** | A simple Wix site a non-tech person built | Modern + readable; nothing reads as broken, dated, or jargon-heavy; new visitor understands what the product is in 5 seconds |
| **80** | Pro-built Wix public page | Confident typography, intentional whitespace, every empty/loading/error state designed |
| **90+** | Show HN-ready | Stripe / Linear / Vercel marketing parity |

A surface scores the *minimum* of its weakest dimension (visual / functional / responsive / a11y / language clarity for a new visitor).

**Owner direction — bottom line for P122:**

1. **Simpler approach.** Most buttons currently look horrible — proper design discipline throughout (shadcn primitives, modern typography, intentional padding, real hover/focus states).
2. **New-visitor language.** All copy should be approachable for someone who has never seen Hey Bradley before. The capstone-page tone (mix of non-tech narrative + AISP highlights for the curious) is the model — keep that.
3. **Where details live.** Public pages stay visitor-friendly; technical / engineering depth moves to the **blog** so the audience self-selects.
4. **Confusion is the enemy.** Site is currently confusing across sections; modernize the visual language and prune any UI that doesn't earn its place.
5. **What to keep:** index (`/`) copy is good; capstone page copy is good — leave them. Modernize the surrounding chrome (buttons, spacing, dark/light tokens) but don't rewrite the words.

## 3. DoD (every box must check to seal P122)

- [ ] Build passes: `npm run build` zero errors.
- [ ] Dev server: no console errors (React DevTools info message excluded).
- [ ] Default template: Hey Bradley dark/crimson site renders on first load (replaces "Welcome to Your Website").
- [ ] Template picker: 4 cards visible and selectable (Hey Bradley pre-selected, Kitchen Sink, Portfolio, swarm-pick).
- [ ] Landing preview: `<ListenPreview />` component, no skeleton.
- [ ] Left panel: zero horizontal scrollbar at 1200px wide.
- [ ] Chat toolbar: SHARE SPEC + EXPORT + SIMULATED MODE + PROFESSIONAL all visible at 1280px.
- [ ] Agentics grid: 7 cards fill cleanly, no orphan cell.
- [ ] "+ Add Section" button replaces "More Sections" label.
- [x] CI: Node 22 pinned in `.github/workflows/gates.yml` (closes CF-P121-1; closed early in P121 commit `e3f27df89`).
- [ ] WASM: dev server initialises sql.js without console errors (closes CF-P121 follow-up).
- [x] **404 on deep links** — `vercel.json` SPA rewrite shipped (commit `54d0a1d9f`).
- [ ] **Add Page in Builder works** — `addPage` action wires correctly from button to store; new page renders in the page list.
- [ ] **Hero photo switch preserves image URL** — switching layouts in the hero editor does not silently mutate `imageUrl`.
- [ ] **Gemini BYOK end-to-end smoke** — local `.env` key successfully drives chat → JSON-Patch → preview update; cost cap respected; no key leakage in `log_events`.
- [ ] **Agentics → LLM Log view** — button fetches `log_events` filtered by `project_id`, renders JSON, redaction holds.
- [ ] **Agentics → Database view** — button fetches selectable table filtered by `project_id`, renders JSON.
- [ ] **Per-surface re-score**: Public ≥60, Builder ≥60, Agentics ≥65 (lowest persona must hit floor).
- [ ] **New-visitor assessment doc** at `docs/audit/p122-new-visitor-assessment.md`.
- [ ] **Button modernization** complete across public + builder + Agentics primary CTAs.
- [ ] **Language jargon strip** complete on public surfaces (excluding `/capstone` body copy and index hero).
- [ ] **Capstone page**: AISP "How the engineering works" sub-section added (≤60 LOC) without disrupting non-tech narrative.
- [ ] **Walkthrough**: 3-pane design (prompts + typewriter + mobile preview) live; original P118.5 6-scene version removed; reduced-motion holds.
- [ ] **Gemini model lock**: `gemini-2.5-flash` confirmed in `geminiAdapter.ts`; smoke-test cost recorded < $0.001/prompt.
- [ ] EOP triplet: `preflight.md` (this file) · `session-log.md` · `retrospective.md`.

## 4. Scope (in)

### A — Audit (Wave 1, no code changes)

1. Inventory shadcn primitives present in `src/components/ui/`.
2. Grep `src/components/` for inline `style={{`, `overflow-x`, scrollbar refs.
3. Identify where the "Welcome to Your Website" default template lives.
4. Identify onboarding / template-selection rendering surface.

### B — Default template + onboarding (Wave 2)

5. Replace default template config with Hey Bradley dark/crimson site:
   - Section 1 hero: "Describe it. See it." subhead "Your voice is the whiteboard." + crimson gradient orb (no stock photo).
   - Section 2 features: 3 dark cards (🎙 Listen mode · ⚡ Real-time · 📄 Export spec).
   - Section 3 stats: 92% / <2% / 0.8s.
   - Section 4 CTA band: "Ready to build?" + "Try the builder".
6. Add 4-card 2×2 template picker (Hey Bradley default-selected · Kitchen Sink · Portfolio · swarm-pick).
   - Swarm-pick rationale documented in session-log.

### C — Landing page preview (Wave 3)

7. New `src/components/marketing/ListenPreview.tsx` — 30/70 split, pulsing crimson orb + waveform (left), mini-browser-chrome with stylised hero (right). Max 640px width, opacity 0.85, dark card.
8. Replace skeleton card in `Welcome.tsx` with `<ListenPreview />`.

### D — Builder critical UI (Wave 4)

9. Left-panel horizontal scroll: `overflow-x: hidden` + `min-w-0` on flex children + wrap content in shadcn `<ScrollArea type="vertical">`.
10. Chat toolbar clipping: shadcn `<ScrollArea>` horizontal on the toolbar row OR `flex-wrap`.
11. Agentics card grid orphan: swarm picks A (`auto-fill minmax(200px, 1fr)`) or B (add 8th "Export Bundle" card wired to existing export action).
12. "More Sections" → shadcn `<Button variant="outline" size="sm">+ Add Section</Button>`.

### E — Engineering hygiene (Wave 5, P121 carry-forwards)

13. Pin Node 22 in `.github/workflows/gates.yml` (`node-version: '22'`). **CLOSED early during P121 merge sequence (commit `e3f27df89`).**
14. sql.js WASM at `public/sql-wasm.wasm`; update `db.ts` `initSqlJs({ locateFile: () => '/sql-wasm.wasm' })`; ensure not in `.gitignore`.
15. **CF-P122-A** — regenerate `package-lock.json` under Node 22 + commit, then revert CI from `npm install` back to `npm ci` (currently `npm install --no-audit --no-fund` per `e3f27df89` + `70ee45d57`).

### H — New-visitor visual + language overhaul (Wave 8, NEW per owner direction 2026-05-08 PM)

> **Owner direction (verbatim):** "Bottom line we need a much more simple approach — proper design throughout (eg most of the buttons looks horrible) — all language should be appropriate for a new visitor (the about my capstone can include both non-tech and also the highlights for AISP), overall the site is very confusing for all sections and all components look like they are 15 years old and require enhancements. A full assessment from a new user needs to be completed."

26. **New-user assessment audit (read-only, runs as W8/A).** A persona-driven walk: imagine a non-technical visitor who arrived from a Twitter post. Walk every public surface (`/`, `/capstone`, `/walkthrough`, `/blog`, `/contact`, `/aisp`) + the builder default + the Agentics view. Score each on 4 dimensions (visual modernity / language clarity / button-and-component quality / new-visitor confidence). Output: `docs/audit/p122-new-visitor-assessment.md` with per-surface scoring + named blockers + 3-5 highest-leverage fixes. NO code changes.

27. **Button modernization sweep (W8/B).** Every primary CTA + every secondary button across the public site + builder + Agentics gets a shadcn `Button` upgrade with proper variants (`default`, `outline`, `ghost`, `link`), real hover/focus states, modern padding (px-4 py-2 minimum), and consistent sizing. Strip every raw `<button className="bg-...">` from the surfaces in scope. Token-locked colors (`var(--hb-warm)` for primary, `var(--hb-ink)` for outline borders, etc.). No new component library — shadcn is already there.

28. **Language tone pass (W8/C).** Per-surface copy rewrite for new-visitor accessibility: strip remaining engineer jargon from public surfaces (AISP / Crystal Atom / JSON-Patch / DDD / bounded context / 𝛴 / Σ symbol blocks). Keep the index + capstone copy as-is (owner approved); modernize headings + button labels + section intros only on `/`, `/walkthrough`, `/blog`, `/contact`, and the builder + Agentics empty states. Technical depth relocates to the existing blog posts (`describe-it-see-it.md` / `the-handoff-that-changes-everything.md` / `why-we-built-this-the-honest-version.md` from P118) — those exist and absorb anything stripped.

29. **Component freshness audit (W8/D).** Identify any UI components that "look 15 years old" — likely candidates: section editors with raw `<input>` instead of shadcn Input, raw `<select>` instead of shadcn Select, plain unstyled `<div>` cards without rounded-lg / shadow / proper border, hand-rolled tab systems instead of shadcn Tabs. Replace with shadcn primitives. Bound the sweep to a budget — max 8 component swaps in P122; carry the rest to P123.

30. **Capstone page enhancement (W8/E).** Per owner: "the about my capstone can include both non-tech and also the highlights for AISP". Today the capstone page is non-tech-only narrative. ADD a sub-section ("How the engineering works" or similar) that surfaces 3-5 AISP highlights (Crystal Atom flow / JSON-Patch architecture / 90% intent preservation across handoffs) for the technical reader, in plain-English-with-a-link to the deeper blog post. Keep the existing non-tech narrative ABOVE this addition. Total addition ≤ 60 LOC.

### I — Walkthrough revert to original 3-pane design (Wave 9, NEW per owner direction 2026-05-08 PM)

> **Owner direction (verbatim):** "The walkthrough needs to revert back to the original (eg left side was the prompts (needs to be updated with the red pulsing glow), then show animated mock typewriter mode to show updates, and on right side show a mobile site as the preview) — this should be available as an html import from phase 1-15."

31. **Locate the original walkthrough HTML (W9/A).** Search `plans/implementation/phase-1` through `phase-15/` for the original 3-pane walkthrough. Likely candidates already surfaced: `plans/implementation/phase-3/archive/`, `plans/implementation/phase-4/archive/`, `plans/implementation/phase-5/archive/human-2.md`, `plans/implementation/phase-7/archive/wiki.html`. Identify the source-of-truth file. Output: 1-paragraph note in W9 session-log naming the file + key visual/animation specs.

32. **Replace `Walkthrough.tsx` with the original 3-pane design (W9/B).** The current 6-scene scroll-snap walkthrough (P118.5 work) gets replaced by the original 3-pane layout:
   - **Left pane:** scrolling list of example prompts (small typed-input cards, owner-provided copy from the original) styled with a **red pulsing glow** matching the listen-mode orb. Reuse `orb-pulse` keyframe (per W3 — already proven reusable).
   - **Center pane:** animated mock typewriter that "types" updates as if responding to the active prompt. CSS-only — `@keyframes` step animation. No JS frameworks.
   - **Right pane:** mobile-shaped frame (rounded-3xl, narrow width ~390px) showing a stylised site preview that updates as the typewriter "applies" each change.
   - All 3 panes operate together: the active prompt highlights → typewriter types → preview updates → loop.
   - Reduced-motion gates everything — when `prefers-reduced-motion: reduce`, freeze the whole sequence at the first prompt + final preview state.
33. **Carry-forward removed scenes:** the 6-scene scroll-snap version had owner-locked copy (per P118.5 retrospective). If the original walkthrough doesn't carry the same copy, add a `> Note:` block at the bottom of the new walkthrough linking to `/blog/describe-it-see-it` so visitors who wanted the 6-scene narrative still find it.
34. **Test:** `tests/p122-walkthrough-revert.spec.ts` — assert 3 pane testids exist, `prefers-reduced-motion` gate honored, no `framer-motion`/`gsap`/`@react-spring` imports.

### J — Gemini cheap-fast model lock (Wave 6 addendum)

35. **Cheap-fast Gemini model only.** `geminiAdapter.ts` already defaults to `gemini-2.5-flash` — keep it. Do NOT switch to `pro` or any expensive variant. Document the choice in W6's smoke-test write-up: model name, in-token rate, out-token rate, expected per-prompt cost. Owner has limited BYOK budget; keep every smoke prompt under $0.001.
36. **Cap default `VITE_LLM_MAX_USD`** stays at `1.00` per `.env.example`. Owner confirms cap at session level; CostPill must visibly tick during smoke tests.
37. **Smoke-test budget across P122 → P124: max 10 LLM calls / $1.00 total.** P122 W6: 1 smoke prompt. W11 (NEW persona-Playwright verify): 2 prompts max. P123: 3-4 prompts max. P124: 1-2 prompts max. Total ≤ 10. Each retrospective records actual spend.

### K — LLM Update Contract (NEW, codified at ADR-150)

> See `docs/adr/ADR-150-llm-update-contract.md` for the full contract. P122 / W6 implements; P123+ inherits.

38. **Model lock**: `gemini-2.5-flash` (or equivalent cheap-fast tier — Haiku 4.5 / `gpt-4o-mini` / `gpt-5-nano`). Pro/opus/sonnet-class FORBIDDEN for the site-update call.
39. **Response shape**: JSON-Patch array only. Never full site JSON. Never prose. Never code fences. The path-whitelist validator (ADR-044) rejects anything else.
40. **Code-driven merge**: the merge of LLM-returned patches into current site config happens in `applyPatches` (deterministic code). LLM never asked to merge.
41. **System prompt structure** (D4 in ADR-150): role → what is available to update (18 canonical types + path schema) → requirements (JSON-Patch array, no prose) → current-state slice (computed by code, never full site) → user prompt verbatim.
42. **Logging**: every site-update call writes `llm_logs` row + `response_summary` log_events row with `model` + `input_tokens` + `output_tokens` + `cost_usd` + `latency_ms` + `prompt_hash` + `result_kind` + `request_id`. Redaction via `redactKeyShapes` runs at write time.
43. **Cost cap visibility**: CostPill visible in every mode where a site-update can be issued — builder (chat + listen) + Agentics (LLM-Log header) + future P124 demo.

### G — LLM live wiring + Agentics observability (Wave 6, NEW per owner direction 2026-05-08)

> **Owner direction:** Gemini key is available locally now (see `.env.example` for the env-var names; the actual key lives in the gitignored `.env`). P122 ships the wiring + the observability surfaces that make BYOK testing safe.

21. **Gemini API key wiring (local)** — confirm `geminiAdapter.ts` reads `VITE_LLM_API_KEY` (or per-provider `GEMINI_API_KEY` if the adapter supports both). Verify a chat-mode submit with the key set successfully calls Gemini and returns a JSON-Patch through the pipeline. Do not commit `.env`. The 4 NEW `.env.example` entries (`GEMINI_API_KEY`, `GEMINI_KEY_NAME`, `GEMINI_PROJECT_NAME`, `GEMINI_PROJECT_NUMBER`) document what's expected.

22. **Agentics → LLM Log view** — NEW button + display in the Agentics surface (probably inside `SpecWorkbench.tsx` or a new `LLMLogPanel.tsx` next to it). Click → query `log_events` table where `project_id = activeProjectId` (uses existing `idx_log_events_project` index from migration 005) → render JSON list. Show event_type + request_id + created_at + redacted payload. Reuse `comprehensiveLogs.ts` repo (already exposes `getEventsForRequest` + similar). No new schema. The Agentics mode is already AISP-prominent per ADR-110, so this fits the surface intent.

23. **Agentics → Database view** — NEW button + display in the same area. Click → list all tables that have a `project_id` column (`projects` · `sessions` · `llm_logs` · `log_events` · `edit_history` · `messages` · `user_templates`) → user picks a table → fetch rows where `project_id = activeProjectId` → render JSON output. Simple read-only fetch, no edit. Reuse the existing `db.ts` connection. Add a "Copy JSON" button so owner can paste into bug reports.

24. **BYOK trust boundary preserved** — both new views MUST redact key shapes per ADR-043 + ADR-114 D3. The `comprehensiveLogs.ts` write path already calls `redactKeyShapes`; the read path inherits redacted data automatically. Do NOT introduce a fresh code path that bypasses redaction. Re-verify with a `tests/p122-agentics-views.spec.ts` assertion that grep'd output contains zero `sk-` / `AIza` shapes.

25. **Cost cap visible during BYOK testing** — confirm `CostPill` from ADR-049 surfaces in the Agentics layout too (currently in shell footer only). Owner needs to see live cap consumption while running BYOK smoke tests, not switch to chat mode to peek.

### F — Production bug fixes (Wave 7, owner-reported from live site 2026-05-08)

16. **404 on deep links** — `https://hey-bradley-core.vercel.app/builder` (and every non-root URL) returned 404 because no SPA fallback was configured. **CLOSED via hotfix `54d0a1d9f` (NEW `vercel.json` with `{ "source": "/(.*)", "destination": "/index.html" }`)** pushed direct to main 2026-05-08; Vercel auto-redeploy fires.
17. **"Add page" doesn't work in Builder** — owner reported the add-page action is unresponsive. Fix: trace `addPage` action in `uiStore` / `configStore`; verify the wired button calls it; verify the new-page section list renders. Likely scope: `src/components/left-panel/PageSelector.tsx` or `src/store/configStore.ts`.
18. **Hero photo switch silently mutates image** — when editing the hero and switching from "full photo" layout to other photo options, the image URL changes unexpectedly. Either (a) the layout-switch is incorrectly resetting the image URL field, or (b) a default image is being injected on layout change. Fix: trace hero layout-switch handler; preserve current `imageUrl` across layout changes (only structural fields should change).
19. **Default template tone — confirmation** — owner re-emphasised: "default should look like Hey Bradley (same colors and tone)". Already in §4-B-5 above; this is the locked direction, not a new ask. Noted for emphasis: dark + crimson (`#A51C30`), no stock photos, Hey Bradley brand voice ("Describe it. See it.").
20. **`core.js:297` console error** — `TypeError: Cannot read properties of undefined (reading 'payload')` reported on production. Likely from a Vercel toolbar / GitHub-Copilot-extension runtime, not from app code (the bundled app entry is `index-*.js`, not `core.js`). Verify post-hotfix; if it persists, isolate via console + browser-extension-disabled test. **Tracking, not blocking.**

## 5. Scope (out — explicitly)

- Resizable panels (`ResizablePanelGroup`) → P123.
- Loading-state / error-state / toast harness → P123 once visible surfaces are sealed.
- `/api/demo-chat` Gemini edge function → **P124** (owner provides key).
- `npm audit fix` → owner-action post-merge from P121.
- Submodule pointer refresh → owner-action post-merge from P121.
- Public site footer / below-fold stats and steps → P123 (already declared in P122 preflight v1, dropped after owner re-scope).
- Anything outside the surfaces named in §4.

## 6. Wave plan

| Wave | Agents | Disjoint scope | Output |
|---|---|---|---|
| **W1** | A1 audit (read-only) | scan-only | `docs/audit/p122-ui-baseline.md` + scoring per §2 |
| **W2** | A2 default template + picker | template configs + onboarding render | Hey Bradley template live + 4-card picker |
| **W3** | A3 landing preview | new `ListenPreview.tsx` + `Welcome.tsx` swap | skeleton replaced |
| **W4** | A4 builder critical UI | left panel + chat toolbar + agentics grid + add-section button | 4 fixes ship |
| **W5** | A5 engineering hygiene | `.github/workflows/gates.yml` + `public/sql-wasm.wasm` + `db.ts` | CI + WASM clean |
| **W6** | A6 LLM + Agentics observability | `geminiAdapter` verify + `LLMLogPanel.tsx` + `DBPanel.tsx` in Agentics + redaction tests | live LLM + 2 obs views |
| **W7** | A7 production bug fixes | `addPage` action wire + hero layout-switch image preservation + tone of default template re-confirm | 3 bugs closed (404 already done as hotfix) |
| **W8** | A8 visual + language overhaul | new-visitor assessment audit + button modernization sweep + language tone pass + component freshness audit + capstone AISP highlights | public 40 → 60 / builder 40 → 60 / Agentics 50 → 65 |
| **W9** | A9 walkthrough revert | locate phase-1-15 original spec + replace `Walkthrough.tsx` with 3-pane design (prompts + typewriter + mobile preview) + reduced-motion + tests | walkthrough surface restored |
| **W10** | Closer | ADR-150 (if architectural) + `tests/p122-ui-overhaul.spec.ts` + `tests/p122-agentics-views.spec.ts` + `tests/p122-walkthrough-revert.spec.ts` + EOP triplet + CLAUDE.md §12 update | seal |

W1 must complete before W2-W5 dispatch (the audit's findings drive shadcn-component + file-location decisions). W2-W5 fan out in parallel disjoint scopes.

## 7. Risks + known unknowns

| Risk | Mitigation |
|---|---|
| Template picker becomes the single largest UX add — could blow the LOC budget | Owner-cap each template JSON ≤ 200 LOC; picker component ≤ 180 LOC |
| `<ListenPreview />` mock could feel cheap if the orb / waveform animation is wrong | Reuse the existing keyframes from real `MobileListenFullscreen.tsx`; do not invent new animation curves |
| 50/100 self-score is subjective | Re-score uses 3 personas (Grandma / Framer / Capstone) per `feedback_quality_bar.md`; floor = lowest persona must hit 50 |
| Node 22 pin could surface unrelated CI breaks | Land in W5 last; if it breaks anything, revert that single line — do not block the phase |

## 8. Success exit

When DoD §3 is all-true:
- Re-score ≥ 50 across all touched surfaces (lowest persona).
- Update `CLAUDE.md` §12 pointer (P122 sealed, P123 active).
- Move CF-P121-1 (Node 22 pin) and the WASM cleanup to **CLOSED** in `plans/master-backlog.md`.
- Tag candidate: `v2.0.1` (patch — no new ADR-class architectural change).
- File P123 preflight on close, capturing the next 50 → 65 lift.

If 40 ≤ score < 50 at seal attempt, do NOT seal. File `phase-122-fix-pass-1`, pick the lowest-scoring surface, ship a tight ≤100 LOC fix, re-score. Maximum 2 fix-passes before escalating to owner re-scope.
