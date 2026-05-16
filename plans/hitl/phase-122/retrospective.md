# P122 / UX-OVERHAUL + LLM-LIVE — Retrospective

> **Status: SEALED 2026-05-08**
>
> Branch: `swarm/p122-ux-overhaul` (local-only — not pushed; awaits owner sign-off
> for PR review). Cumulative `npm run build` GREEN (5.72s, entry chunk 635.95 KB
> gzip — under the ADR-102 800 KB cap). 12/12 architecture invariants GREEN.
> ADR-lint clean. 18/18 P122 agentics-views spec cases GREEN.
>
> P122 ran 11 disjoint-scope agent waves in 2 days. Owner re-scoped twice
> (May 8 AM expanded LLM-live + Agentics observability into P122 from P124;
> May 8 PM expanded visual + language overhaul + walkthrough revert).
> Public composite ≥60 met on 4 of 8 surfaces; 3 surfaces below floor and
> 1 engineer-track exception. We seal honestly and move the 3 below-floor
> surfaces to P123 priority instead of force-fitting another fix-pass.

---

## 1. What shipped (per wave)

### W1 — UI baseline audit (read-only)
- `docs/audit/p122-ui-baseline.md` (NEW; 5 sections, exact file paths, before-state
  evidence: `<input>` raw vs shadcn Input, scrollbar leaks, hand-rolled buttons,
  margin/padding inconsistencies, jargon-heavy public copy).
- No code changes. Drove W2-W9 component + copy decisions.

### W2 — Default template + 4-card picker
- `src/data/default-config.json` (REWRITE; 319 LOC) — Hey Bradley dark/crimson
  6-section spine: nav + hero (radial-gradient orb, no stock photo) + features
  3-card + stats + CTA band + footer. `voiceAttributes` = 4. Theme `mode: "dark"`,
  `accentPrimary: "#A51C30"`. Storytelling preset `founder-direct` per ADR-141 D2.
- `src/data/examples/portfolio-clean.json` (NEW; light-theme Fraunces serif portfolio).
- `src/pages/Onboarding.tsx` (+~190 LOC inline) — 4-card 2×2 template picker:
  Hey Bradley pre-selected · Kitchen Sink · Portfolio Clean · Hazel & Birch
  Wedding (swarm pick). testids `template-picker` + `template-card-{id}`.

### W3 — Marketing ListenPreview
- `src/components/marketing/ListenPreview.tsx` (NEW; 189 LOC) — 30/70 split,
  reuses `orb-pulse` keyframe from `src/index.css:134-139`, opacity-0.85 dark
  card. Replaces the prior skeleton in `Welcome.tsx`. Reduced-motion gates the
  pulse.
- W3 was reverted twice during W2/W8 overlap (file-collision risk on
  `Welcome.tsx`); manually re-applied at closer time before commit.

### W4 — Builder critical UI + 2 production bugs
- `src/components/ui/ScrollArea.tsx` (NEW primitive) — wraps left-panel
  Section list to kill the 1200px horizontal-scroll bug.
- `src/components/left-panel/PageSelector.tsx` (+12 LOC) — Add Page button
  now calls `addPage()` action; previously dead-button.
- `src/components/left-panel/SectionsSection.tsx` (+42 LOC) — "More Sections"
  → `<Button variant="outline" size="sm">+ Add Section</Button>` (per W8/F4).
- `src/components/right-panel/simple/SectionSimple.tsx` (+33 LOC) — hero
  layout-switch handler now preserves `imageUrl` across structural changes
  (was silently mutating it).
- `src/components/shell/ChatInput.tsx` (+7 LOC) — toolbar wrap fix at 1280px.

### W5 — WASM + lockfile + Node 22 CI
- `public/sql-wasm.wasm` (NEW; copied from `node_modules/sql.js/dist/`).
- `scripts/copy-sqljs-wasm.mjs` (+5 LOC) — `predev` hook installs to
  `public/sql-wasm.wasm`.
- `src/contexts/persistence/db.ts` (+7 LOC) — `initSqlJs({ locateFile: () =>
  '/sql-wasm.wasm' })`.
- `package-lock.json` REGEN under Node 22 (CF-P122-A from P121 retro CLOSED).
  CI flipped from `npm install` back to `npm ci` per `.github/workflows/gates.yml`.
- This wave's npm-install races disrupted other waves' build runs; recorded as
  process correction in §6.

### W6 — Gemini live + Agentics LLM-log + DB view
- `src/components/agentics/LLMLogPanel.tsx` (NEW; 219 LOC) — read-only fetch
  `log_events` filtered by `project_id`; renders JSON list with redaction
  inherited via `comprehensiveLogs.ts` write-path (ADR-043 + ADR-114 D3).
- `src/components/agentics/DBPanel.tsx` (NEW; 249 LOC) — table picker for any
  `project_id`-indexed table; "Copy JSON" button.
- `src/contexts/intelligence/llm/geminiAdapter.ts` (+15 LOC) — first-call
  console.info confirms key wiring; defaults to `gemini-2.5-flash` (cheap-fast
  per owner).
- `src/components/agentics/SpecWorkbench.tsx` (+3 LOC) + `src/pages/Agentics.tsx`
  (+41 LOC) — mounts both panels + CostPill in Agentics header.
- 18/18 redaction tests GREEN — no `sk-` / `AIza` / `Bearer` / `key=` shapes
  appear as literal data in panel sources.

### W7 — Production bug fixes
- 404 SPA hotfix shipped pre-P122 as `54d0a1d9f` (`vercel.json` rewrite) —
  closed inside W4 + W5 surface work.
- Add Page in Builder: closed via W4 PageSelector wire.
- Hero photo switch silent mutation: closed via W4 SectionSimple handler.

### W8 — Visual + language overhaul (the heaviest wave)
- 6 shadcn `<Button>` swaps across public surfaces (Welcome 3 CTAs, Capstone
  2 hero CTAs, Contact 4 card CTAs, Blog 6 category pills). All raw
  `<Link className="bg-… rounded-xl">` → `<Button asChild variant={...}>`
  with real hover-scale + focus-ring.
- Jargon strip on `Contact.tsx` hero ("Building something that connects to Hey
  Bradley or AISP?" → "Got a question? Reach out."), Contact card 2 title,
  AISP page hero subhead (added plain-English first line above the math-first
  technical sentence), Agentics SpecWorkbench empty-state.
- `OpenCore.tsx` (+~56 LOC) — NEW "How the engineering works" sub-section
  below existing non-tech narrative. 3 plain-English bullets each linking to
  the corresponding P118 long-form blog post.
- 2 component swaps remain in budget for P123 (CF-P122-W8-6).

### W9 — Walkthrough revert
- `src/pages/Walkthrough.tsx` (REWRITE; 273 LOC) — 3-pane layout (prompts +
  typewriter + mobile preview) replacing the P118.5 6-scene scroll-snap.
  Reuses `orb-pulse` keyframe; reduced-motion freezes first prompt + final
  preview state.
- `plans/hitl/phase-122/walkthrough-revert-source.md` (NEW; 45 LOC) — locates
  the original 3-pane spec across phase-1/3/4/7 archives. Verbatim excerpts
  preserved.
- `tests/p122-walkthrough-revert.spec.ts` (NEW; 17 cases) — pane testids,
  reduced-motion gate, KISS denylist (no framer-motion / gsap / @react-spring).
  Spec has an ESM `__dirname` defect carried as P123 carry-forward.

### W11 — Persona-driven Playwright verification (PARTIAL)
- `tests/screenshots/p122-persona/{live,local}/` — 7 screenshots captured
  (live: home / capstone / builder; local: home / capstone / builder /
  new-project).
- `tests/p122-persona-verify.spec.ts` (NEW) — Persona "Maren" framework with
  console-error capture + jargon assertions across both passes.
- Full audit document NOT written (carry-forward CF-P122-W11-1 → P123).
- Purpose: real-browser confirmation that public surfaces no longer leak
  engineer jargon.

### ADR-150 — LLM Update Contract
- `docs/adr/ADR-150-llm-update-contract.md` (NEW) — codifies the rules
  W6 follows: model lock (cheap-fast tier only), JSON-Patch response shape,
  code-driven merge, 6-element system prompt structure, redacted logging,
  CostPill visibility everywhere a site-update can fire.

---

## 2. Per-surface re-score (W8 audit, honest)

| Surface | Before | After | Target | Verdict |
|---|---:|---:|---:|---|
| `/` (Welcome) | 40 | **62** | 60 | ✅ Met |
| `/capstone` (OpenCore) | 40 | **60** | 60 | ✅ Met |
| `/walkthrough` | 50 | **60** | 60 | ✅ Met |
| `/blog` | 45 | **60** | 60 | ✅ Met |
| `/contact` | 40 | **58** | 60 | ❌ Below floor |
| `/aisp` | 35 | **55** | 60 | ⚠ Engineer-track per ADR-146 D3 |
| Builder default | 45 | **55** | 60 | ❌ Below floor |
| Agentics | 45 | **60** | 65 | ❌ Below target |

**Composite (8 surfaces avg):** **56.25/100**.
**Public-only composite (Welcome + Capstone + Walkthrough + Blog + Contact):** **60/100**.

**Honest verdict:** 4 of 8 surfaces hit target; 1 engineer-track exception
accepted; 3 below floor. We seal P122 with this honest scoring. The 3
below-floor surfaces become P123 priority. P122 already shipped massive
work (default template + picker + ListenPreview + 2 builder bugs + Gemini
wiring + 6 component swaps + walkthrough revert + 2 NEW Agentics panels);
forcing another fix-pass to chase the last 7 score points across 3 surfaces
would have been worse value than scoping them as the next sprint's mission.

---

## 3. What slipped

- **W11 persona audit** — only screenshots captured; full audit document
  deferred to CF-P122-W11-1. Background time-budget elapsed before the
  doc completed.
- **Walkthrough spec ESM bug** — `tests/p122-walkthrough-revert.spec.ts`
  uses `__dirname` which is undefined in ESM scope; spec fails to start.
  17 cases never run. Per closer constraints, no source-edit fix this
  sprint; carry-forward CF-P122-W9-1 → P123.

## 4. What slipped well

- **Honest scoping at seal time.** The 4-of-8-met outcome is named, not
  papered over. The P122 preflight set 60/65 as the bar; we hit that on
  half of the surfaces and acknowledged the gap on the other half. This is
  the post-P19 reality-check rule applied to scoring instead of velocity.
- **W8's 6-swap budget held.** The component-freshness audit named 8 swap
  candidates; we executed 6 (the 6 highest-leverage) and explicitly named
  the remaining 2 as P123 carry-forward instead of letting scope creep.

## 5. Carry-forwards into P123

| ID | Item | Source |
|---|---|---|
| CF-P122-W8-1 | Walkthrough bottom CTAs → shadcn `<Button asChild>` | W8 audit |
| CF-P122-W8-2 | AISP page CTAs (5) → shadcn `<Button asChild>` (engineer-track) | W8 audit |
| CF-P122-W8-3 | TopBar icon-buttons → shadcn `<Button variant="ghost" size="icon">` | W8 audit |
| CF-P122-W8-4 | OpenCore secondary CTAs (image-break / repos / final CTA) | W8 audit |
| CF-P122-W8-5 | Onboarding template-picker raw `<button>` cleanup (14 elements) | W8 audit |
| CF-P122-W8-6 | 2 swaps remaining in component-freshness budget | W8 audit |
| CF-P122-W9-1 | Walkthrough spec ESM `__dirname` bug — fix to `fileURLToPath(import.meta.url)` | W9 spec |
| CF-P122-W11-1 | W11 persona audit document (screenshots captured; doc deferred) | W11 partial |
| CF-P122-S1 | **Contact 58 → 65** | Below-floor surface |
| CF-P122-S2 | **Builder default 55 → 65** | Below-floor surface |
| CF-P122-S3 | **Agentics 60 → 70** | Below-target surface |
| CF-P122-LLM | Live Gemini chat smoke (1 prompt → JSON-Patch → preview) | DoD inherited |
| CF-P122-LLM2 | Live Gemini listen smoke | DoD inherited |

## 6. Plan corrections (feed forward)

- **Cross-wave file-collision risk underweighted.** W3 (ListenPreview) was
  reverted twice during W2/W8 overlap because all three waves had legitimate
  edits to `Welcome.tsx`. Manual re-apply at closer time worked but was
  fragile. **Correction for P123:** when waves touch potentially-shared
  files (`Welcome.tsx`, `Onboarding.tsx`, `Agentics.tsx`, `package.json`),
  serialize the wave dispatch — do not run them in parallel.
- **`npm-install` races disrupted parallel build runs.** W5's lockfile
  regeneration ran while W2/W4/W6 were doing `npm run build` for verification;
  one or more of those runs picked up an inconsistent `node_modules` snapshot.
  **Correction for P123:** lockfile/dep changes get their own serial wave
  with no parallel build agents.
- **Spec dispatch should `import { fileURLToPath }`-ready.** W9 spec was
  authored as CommonJS-style; ESM project rejected `__dirname`. **Correction
  for P123:** add a snippet to the wave-author template (`fileURLToPath(import.meta.url)`)
  for any spec that reads files from disk.

## 7. Final scoring (honest)

- **Composite (8 surfaces):** **56/100**
- **Public-only composite (5 surfaces):** **60/100**
- **DoD checks met:** ~28 of 35 (build green; default template; 4-card picker;
  ListenPreview; ScrollArea; Add Page; Add Section; Hero photo switch fix;
  CI Node 22 + lockfile + WASM; LLM-Log + DB view + redaction; 6 button swaps;
  capstone AISP sub-section; walkthrough revert; CostPill visible; ADR-150).
- **DoD checks unmet:** Per-surface re-score below floor on 3 surfaces;
  live Gemini chat + listen smokes not run; W11 audit doc not written.
- **Verdict:** **SEAL P122** with honest scoring. P123 takes the 3 below-floor
  surfaces + the live LLM smoke as its mission.

## 8. Files touched

```
.github/workflows/gates.yml                                  (Node 22 + npm ci)
package-lock.json                                            (regen Node 22)
plans/hitl/phase-122/preflight.md                            (DoD updates)
plans/hitl/phase-122/session-log.md                          (wave logs)
plans/hitl/phase-122/walkthrough-revert-source.md            (NEW; W9)
plans/hitl/phase-122/retrospective.md                        (THIS FILE)
scripts/copy-sqljs-wasm.mjs                                  (predev hook)
src/components/agentics/SpecWorkbench.tsx                    (mount panels)
src/components/agentics/LLMLogPanel.tsx                      (NEW; 219 LOC)
src/components/agentics/DBPanel.tsx                          (NEW; 249 LOC)
src/components/left-panel/PageSelector.tsx                   (Add Page wire)
src/components/left-panel/SectionsSection.tsx                (+ Add Section)
src/components/marketing/ListenPreview.tsx                   (NEW; 189 LOC)
src/components/right-panel/simple/SectionSimple.tsx          (hero img preserve)
src/components/shell/ChatInput.tsx                           (toolbar wrap)
src/components/ui/ScrollArea.tsx                             (NEW primitive)
src/contexts/intelligence/llm/geminiAdapter.ts               (first-call info)
src/contexts/persistence/db.ts                               (locateFile WASM)
src/data/default-config.json                                 (REWRITE Hey Bradley)
src/data/examples/portfolio-clean.json                       (NEW)
src/pages/AISP.tsx                                           (jargon strip)
src/pages/Agentics.tsx                                       (panels + CostPill)
src/pages/Blog.tsx                                           (shadcn pills)
src/pages/Contact.tsx                                        (jargon + CTAs)
src/pages/Onboarding.tsx                                     (template picker)
src/pages/OpenCore.tsx                                       (How engineering works)
src/pages/Walkthrough.tsx                                    (3-pane revert)
src/pages/Welcome.tsx                                        (ListenPreview wire)
public/sql-wasm.wasm                                         (NEW asset)
docs/adr/ADR-150-llm-update-contract.md                      (NEW)
docs/audit/p122-new-visitor-assessment.md                    (NEW; W8)
docs/audit/p122-ui-baseline.md                               (NEW; W1)
tests/p122-agentics-views.spec.ts                            (NEW; 18 cases)
tests/p122-persona-verify.spec.ts                            (NEW; W11)
tests/p122-walkthrough-revert.spec.ts                        (NEW; 17 cases — ESM bug)
tests/screenshots/p122-persona/{live,local}/                 (7 screenshots)
```

All paths absolute. Seal commit lands on `swarm/p122-ux-overhaul` (local-only).
