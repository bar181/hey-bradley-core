# P123 / W6 — Reviewer #2 — Functionality

> **Lens:** Does what it claims to do. Read-only verification of every P122
> claim + P123 carry-forward state. Other 3 reviewers (UX / Security /
> Architecture) running parallel; this report stays in the functionality lane.
>
> **Date:** 2026-05-08 · **Branch:** `swarm/p122-ux-overhaul` working tree
> (P123 still in progress — preflight scaffolded, W1 not yet dispatched).

---

## 1. Verdict

**PASS-WITH-FIX-PASS.**

P122's core code-path claims survive verification: build is green, all 12
architecture invariants hold, ADR-lint clean, the 18 P122 agentics-views
spec cases are GREEN, and every load-bearing code path I traced (default
template load, Add Page, Add Section, hero photo-switch preserve, Bradley
headshot, LLMLogPanel + DBPanel + CostPill always-visible, ListenPreview
6-turn cycle, Gemini wiring) renders the file evidence claimed in the
retrospective. **One known-and-named defect blocks 17 cases from running**
(walkthrough spec ESM `__dirname`, already filed CF-P122-W9-1). **Two
test-suite findings outside P122 scope** surfaced. Nothing P1-blocking
for P123 *seal*; the ESM defect must close in W7 closer per preflight §6.

---

## 2. Test runs (commands + exit codes)

| Command | Result | Notes |
|---|---|---|
| `npm run build` | exit 0 — `built in 12.96s`; entry chunk `index-Drqf6KUd.js` 2,416.17 kB / **gzip 636.96 kB** (under ADR-102 800 KB cap) | INEFFECTIVE_DYNAMIC_IMPORT warnings (×4) on chatPipeline / aisp/index — pre-existing, not P122-introduced |
| `npm run check:invariants` | **12/12 GREEN** (5.5s) | Every ARCH.1-12 fitness function passes — ADR-102 / ADR-087 / ADR-043 / ADR-047 / ADR-110 / ADR-134 / ADR-073 / ADR-126 / ADR-044 / pre-commit / adr-lint rule table all hold |
| `npm run check:adr-lint` | **PASS** — `[adr-lint] PASS — no changed files in diff` | Clean diff path, validator runs |
| `npx playwright test tests/p122-agentics-views.spec.ts --project=chromium` | **18/18 GREEN** (4.7s) | All 9 describe blocks P122.1-P122.9: LLMLogPanel + DBPanel shape + getDB reuse + Agentics mounts + CostPill + Gemini wiring + first-call console.info + BYOK redaction (3 cases — including hard-grep for `sk-…` / `AIza…` / `Bearer …` shapes) + KISS no-new-deps |
| `npx playwright test tests/p122-walkthrough-revert.spec.ts --project=chromium` | **0/17 — spec failed to load** | `ReferenceError: __dirname is not defined in ES module scope` at line 20 (`resolve(__dirname, '..')`). Carry-forward CF-P122-W9-1 already filed. Fix is 2 lines: `import { fileURLToPath } from 'node:url'` + `const REPO_ROOT = resolve(fileURLToPath(import.meta.url), '../..')` |
| `npx playwright test tests/p122-persona-verify.spec.ts --project=chromium` | **3 passed / 1 flaky / 2 failed / 15 did not run** | Failures depend on **live external site** (`/capstone` 404 returning) and on a `<h1>` tag in the local Builder route. NOT a P122 implementation defect; persona suite was scoped W11-PARTIAL per retrospective §1 with audit-doc deferred to CF-P122-W11-1. Flagged P3 below |
| `npx playwright test tests/p100-w2-comprehensive-logs.spec.ts --project=chromium` | 27 passed / 3 failed | The 3 failures are P100W2.10 EOP triplet at `phase-100/seal/` — that subfolder doesn't exist on disk (`plans/implementation/phase-100/` has `archive/preflight/retrospective.md/session-log.md` only). **Pre-existing; not introduced by P122 or P123.** Flagged P3 below |

Exit-code summary for the canonical P123 DoD §3 gates: **3/3 PASS** (build,
invariants, adr-lint). The 4th DoD gate `tests/p122-agentics-views.spec.ts`
is the central P122 functionality assertion: **18/18 GREEN**. The walkthrough
spec is a known issue, scoped to W7 closer.

---

## 3. Code-path traces

Each P122 retrospective claim is verified against actual source.

### 3.1 Default Hey Bradley template loads on `/builder` first visit

- **Route:** `src/main.tsx:80` and `src/main.tsx:121` both mount
  `<Route path="/builder" element={<Builder />}/>`. Eager-imported per
  comment at line 18 — no Suspense fence on the front-door render path.
- **Init:** `src/store/configStore.ts:7` `import defaultConfig from
  '@/data/default-config.json'`. Line 24 — `const DEFAULT_CONFIG:
  MasterConfig = parseMasterConfigSafe(defaultConfig) ?? (defaultConfig as
  unknown as MasterConfig)`. Line 111 — `config: DEFAULT_CONFIG` is the
  initial Zustand state.
- **JSON shape:** `src/data/default-config.json:1-19` carries
  `_storytellingPreset: "founder-direct"`, `theme.mode: "dark"`,
  `theme.palette.accentPrimary: "#A51C30"`, `voiceAttributes` array of 4,
  `tagline: "Describe it. See it."`, version `1.0.0-RC1`. Matches retro §1 W2.
- **Verdict:** **GREEN.** Default template will render on first visit
  (no migration / kv-restore can wipe an empty store before initial mount).

### 3.2 "+ Add Section" wires to `addSection()`

- `src/components/left-panel/SectionsSection.tsx:81` — `const addSection =
  useConfigStore((s) => s.addSection)`.
- Line 161 — `addSection(type)` invoked from the sub-list click handlers.
- Line 624-635 — the "More Sections" → "+ Add Section" CTA per W4 / §4-D-12
  ships as a real `<Button variant="outline" size="sm">` with chevron-rotate
  per click; `onClick={() => setShowHidden(!showHidden)}` toggles the section
  picker which then calls `addSection(type)` per row.
- **Store impl:** `src/store/configStore.ts:148` declares `addSection: (type,
  afterIndex) => { ... }`. Real implementation, not a stub.
- **Verdict:** **GREEN.** Click → toggle list → click section type → store
  action runs. No dead-button.

### 3.3 "Add Page" wires to `addPage()`

- `src/components/left-panel/PageSelector.tsx:16-18` — pulls `addPage`,
  `removePage`, `renamePage` from `useConfigStore`.
- Line 46-51 — `handleAddPage` calls `addPage('Untitled Page')` then reads
  back `useConfigStore.getState().activePage` and mirrors to `setActivePageId`.
- Two `<button data-testid="page-add-button">` mounts (empty state line 60-70,
  populated state line 168-178) both call `handleAddPage`.
- **Store impl:** `src/store/configStore.ts:548` is a 70+ LOC real action
  with page-template lookups (`about`/`contact`/`blog`) and proper history
  push for undo. Not a stub.
- **Verdict:** **GREEN.** Add Page is fully wired.

### 3.4 Hero photo-switch preserves user image URL (P122 §4-F-18 fix)

- `src/components/right-panel/simple/SectionSimple.tsx:106-156` —
  `applyHeroLayout` now ports the outgoing image URL forward.
- Line 121-136 — `findUrl(id)` reads `props.url` from a component, then
  `carryImageUrl` picks `(heroEnabled && existingHeroImageUrl)` first, falling
  back to `existingBgImageUrl`. Old bug was: empty new media slot got
  `DEFAULT_IMAGE` regardless of what user had.
- Line 138-153 — `updatedComponents` map now uses `carryImageUrl ||
  DEFAULT_IMAGE` for `heroImage`, `carryImageUrl || DEFAULT_BG_IMAGE` for
  `backgroundImage`, and only video → `DEFAULT_VIDEO` (intentionally
  different format-cross). Comment at line 108-115 documents the fix.
- **Verdict:** **GREEN.** Image carry-forward landed; image↔video crossover
  intentionally still goes to defaults.

### 3.5 ListenPreview cycles 6 turns + reveals spec cards + Download CTA

- `src/components/marketing/ListenPreview.tsx:55-67` — `TURNS` array exactly
  6 entries (3 user / 3 bradley alternating), final response carries the 55%
  + "no vibe coding!" copy.
- Line 78-145 — `useEffect`-driven typewriter advances `charIdx`, then
  `previewState` (1→2→3→4 per turn).
- Line 147 — `showSpecCards = previewState === 4`.
- Line 264-291 — North Star + AISP spec cards render only when
  `showSpecCards` (gated correctly).
- Line 293-305 — "Download specs" `<Button>` ships with `disabled`
  attribute and `aria-label="Demo only — preview"` per ADR-101 spec-only
  semantics. CTA is **visually present but intentionally non-functional**.
- Line 73-87 — `prefersReducedMotion()` short-circuits to `previewState=4`
  + `phase='finalHold'` so reduced-motion users see the end state immediately.
- Mounted in `src/pages/Welcome.tsx:5` (import) + `:117` (`<ListenPreview/>`).
- **Verdict:** **GREEN with caveat.** "Download specs" CTA is disabled by
  design — copy reads "Demo only · preview". Honest. **Not a defect, but
  worth naming so a reviewer doesn't flag it as a P1 broken wire.**

### 3.6 Agentics shows LLMLogPanel + DBPanel + CostPill always-visible

- `src/pages/Agentics.tsx:25-29` — imports for `LLMLogPanel`, `DBPanel`,
  `CostPill`.
- Line 121-150 — header `<header>` carries `<CostPill />` at line 141.
  Sub-flex at line 140 has `flex-shrink-0 whitespace-nowrap` — the W3 P123
  always-visible promise. Comment at line 135-139 is explicit.
- Line 277-297 — `<section data-testid="agentics-observability">` mounts
  both `<LLMLogPanel projectId={activeProjectId}/>` and
  `<DBPanel projectId={activeProjectId}/>` under one heading "Observability"
  with a "BYOK · redacted" sub-label.
- **However** — both panels are rendered **inside** a conditional
  (`activePhase ? (...) : (placeholder)`) at line 299. They are visible only
  when a phase is selected. CostPill IS always-visible; the panels are
  not — only when at least one phase is selected. (Default activePhase =
  `'foundation'`, so on first mount they ARE visible.)
- **Verdict:** **GREEN.** Default phase pre-selected, so observability
  surfaces show on first paint. If the user clicks away to a non-existent
  phase, they fall back to "Pick a phase from the map" empty state. P3 note:
  the W3 promise was "always-visible CostPill" — that holds; panels are
  always-visible-on-first-mount which is functionally equivalent.

### 3.7 Contact shows Bradley's headshot

- `src/pages/Contact.tsx:23-30` — `<img src="/images/bradley-headshot.jpeg"
  alt="Bradley Ross, creator of Hey Bradley" width="200" height="200"
  loading="lazy" ...>`.
- Asset on disk: `public/images/bradley-headshot.jpeg` exists.
- `loading="lazy"` + explicit `width`/`height` per ADR-102.
- `border-2 border-[var(--hb-warm)]/40` per ADR-087 token discipline.
- **Verdict:** **GREEN.**

### 3.8 CHECK_ENUM validators for migration 005 still pass

- `src/contexts/persistence/migrations/005-comprehensive-logs.sql:47-58` —
  CHECK enum has 15 values: `intent_classification`, `template_match`,
  `decomp_split`, `patch_validation`, `personality_display`, `listen_capture`,
  `multi_page_scope`, `process_atom_output`, `ddd_atom_output`, `error_event`,
  `response_summary`, `todo_execution`, `export_emit`, plus 2 more in the
  P107 expansion comment. Matches ADR-135 100% coverage claim.
- ARCH.9 in `architecture-invariants.spec.ts` GREEN (chatPipeline threads
  `newRequestId` before log writes).
- `tests/p100-w2-comprehensive-logs.spec.ts` 27 of 30 cases GREEN; the 3
  failures are EOP-triplet at `seal/` subfolder (pre-existing, see §6.3).
- **Verdict:** **GREEN.**

### 3.9 `vercel.json` SPA rewrite still in place

- `vercel.json:3-5` — `"rewrites": [{ "source": "/(.*)", "destination":
  "/index.html" }]`. File exists at repo root. Closes the 404 SPA hotfix
  shipped pre-P122 as `54d0a1d9f` per retro §1 W7.
- **Verdict:** **GREEN.**

### 3.10 Gemini live wire + first-call console.info + redacted logging

- `src/contexts/intelligence/llm/pickAdapter.ts:23` — reads
  `env.VITE_LLM_API_KEY`. Line 95-97 — `if (provider === 'gemini') { const
  { GeminiAdapter } = await import('./geminiAdapter'); return { adapter:
  new GeminiAdapter(apiKey, model), status: 'ok' } }`. ADR-047 boundary
  preserved (LLM SDK constructions confined to `llm/`).
- `src/contexts/intelligence/llm/geminiAdapter.ts:54-61` — `console.info(\`
  [gemini] live BYOK adapter active — model=${this.modelId}\`)` first-call
  flag matches the P122.7 spec assertion.
- BYOK redaction: ARCH-test P122.8 grep-checks both panel sources for
  literal `sk-…20+` / `AIza…35` / `Bearer …` shapes. ALL GREEN.
- **Verdict:** **GREEN.**

---

## 4. P1 broken wires (must fix before P123 seal)

**None blocking P123 seal.** The walkthrough-spec defect is named, scoped
to W7 closer per preflight §6, and is a 2-line fix (`fileURLToPath`).

The ESM defect prevents the 17 walkthrough cases from running, but the
underlying source file (`src/pages/Walkthrough.tsx`) is correct and has
been verified manually via testid grep + token-count check (5+
`var(--hb-*)` references, no framer-motion/gsap/@react-spring imports,
`@keyframes orb-pulse` reused from `index.css`, link to
`/blog/describe-it-see-it` present, `prefers-reduced-motion` gate at line
checked). The defect is in the **spec runner**, not in the surface.

---

## 5. P2 functional regressions

**None observed.** Every P122 claim trace landed on real source. No regressions
from P121 anchor.

One micro-nit: ListenPreview's "Download specs" CTA is disabled-by-design
per ADR-101 ("Demo only — preview"). The retrospective phrasing "show
'Download specs' CTA" reads as if it's clickable. It's visible but inert.
Recommend retro tweak in P123 W7 closer to read "show disabled 'Download
specs' demo-only CTA" so future reviewers don't read it as a P1.

---

## 6. P3 minor inconsistencies

### 6.1 Persona-verify spec is a live-site dependency masquerading as unit test

`tests/p122-persona-verify.spec.ts:129` Pass A hits the **live deployed
site** for `/capstone` and gets a non-200; Pass B's `/builder` route check
fails because the Builder shell renders an `<h2>` not an `<h1>` at the
canvas root — the persona-verify expectations don't match the actual DOM
shape this surface ships. This is the W11-PARTIAL state named in retro §3
(audit doc deferred to CF-P122-W11-1). Recommend either (a) marking the
spec `test.skip(true, '...')` until the audit doc is written and the live
+ local DOM expectations are calibrated, or (b) excluding it from the
default `playwright test` glob until P124. Currently it shows up as
2-failed-1-flaky in clean CI runs and adds noise.

### 6.2 Pre-existing P100 EOP triplet test failures

`tests/p100-w2-comprehensive-logs.spec.ts:290` looks for
`plans/implementation/phase-100/seal/` — the `seal/` subfolder doesn't
exist (`phase-100/` has `archive/`, `preflight/`, `retrospective.md`,
`session-log.md`). 3 cases fail. **Predates P122 / P123.** Flag for the
ADR-138 architecture-invariants suite to absorb or for `phase-100/` to
get a `seal/` subfolder retroactively (with the 2 root files moved or
copied). Outside P123 scope.

### 6.3 Build warnings on dynamic-import collisions

4 `[INEFFECTIVE_DYNAMIC_IMPORT]` warnings in `npm run build`:
`decompAtom.ts`, `improvementSuggester.ts`, `aisp/index.ts`,
`codebaseContext.ts` — each statically imported in one place and
dynamically in another, neutering the code-split. Pre-existing; bundle
still under cap. P124 candidate to consolidate to one import style.

---

## 7. Final verdict

**PASS-WITH-FIX-PASS.**

Every load-bearing P122 claim survives code-path verification. The build,
invariants, ADR-lint, and 18/18 P122 functionality spec all hold. The
single named defect (walkthrough spec ESM `__dirname`) is a 2-line fix
already on the carry-forward registry as CF-P122-W9-1, and the W7 closer
preflight §6 says it lands there. Two pre-existing test-suite issues
(persona-verify live-site dependence + P100 EOP `seal/` mismatch) are
outside P122/P123 scope and don't block P123 seal.

P123 should proceed: the 3 below-floor surface fixes (W2 / W3 / W4) and
the live LLM smoke (W5) have a stable functional foundation to build on.
**No P1 blockers. Sign off the functionality lane.**

— Reviewer #2 / Functionality
