# Phase 15 Retrospective

> **Note (2026-04-27):** Phase 15 was rerun under the MVP-narrowed scope (theme + hero + images + article-as-blog). The new MVP-track retrospective is at the top of this file; the original "Developer Assistance + Marketing Site Overhaul" retrospective is preserved below as historical context.

---

## Phase 15 — MVP Track (CLOSED 2026-04-27)

**Focus:** Polish + Kitchen Sink + Blog + Novice Simplification.
**Duration:** ~1 day (intensive 14-agent swarm execution).
**Composite Score:** 82/100.

### Persona Scoring (all PASS)

| Persona | Score | Target |
|---|---:|---:|
| Grandma (DRAFT, novice) | 70 | ≥ 70 |
| Framer User (EXPERT) | 88 | ≥ 78 |
| Capstone Reviewer | 84 | ≥ 82 |

### What Shipped

- `src/lib/draftRename.ts` — DRAFT-mode label dictionary
- `src/data/examples/blog-standard.json` — canonical novice starter (Hero + Blog/Article + Footer)
- `src/data/examples/kitchen-sink.json` — now contains all 16 canonical section types
- `src/components/shell/ChatExplainer.tsx` — 3-step "How it works" strip above chat input (DRAFT-only)
- `src/components/settings/SettingsDrawer.tsx` — single right-side drawer (Theme / Project / AI provider / Spending limit)
- DRAFT-mode narrowing: center tabs 5→2, section types 16→3 (hero/blog/footer), TopBar controls 8→5, ImagePicker scoped to 2 slots
- Onboarding: 4 default starter cards + "More examples" disclosure
- ~31 native `title=` tooltips across DRAFT-visible controls
- ADR-038 (Kitchen Sink Reference) + ADR-039 (Standard Blog Page) merged
- `personas-rubric.md` (252 lines, 3 personas × 5 dimensions)
- 2 new Playwright tests, both green (19.7s)

### Verification

- `npx tsc --noEmit`: clean
- `npm run build`: green (3.28s, 555.68 KB gzip JS, 16.11 KB gzip CSS)
- 13 commits across 4 implementation waves + 2 review fix-passes
- 4 specialized reviewers (KISS/scope, code-quality, UX-novice, persona-rubric) ran in parallel post-implementation

### Dimension Scores (MVP track)

| Dimension | Score | Notes |
|---|---:|---|
| Completeness | 90 | All Phase-15 plan items shipped except Stage-1 backlog reconciliation (deferred per narrowed-scope policy) |
| Code Quality | 85 | 8.5/10 from code-quality reviewer; type-safe; no `any`; no ungated `console.*`; one ship-blocker caught and fixed (W4) |
| Test Coverage | 75 | +2 Playwright tests; full suite not re-run end-to-end |
| UX Polish | 82 | Three persona scores all clear targets; DRAFT-mode narrowing consistent across surfaces |
| Documentation | 88 | Two new ADRs, full session log, master checklist updated, this retrospective |
| Architecture | 78 | KISS pivot applied (no new section type); minor `DRAFT_ALLOWED_SECTION_TYPES` duplication deferred; SectionsSection.tsx now 530 lines |

**Composite: 82/100** (weighted: Completeness 25, Code Quality 20, Tests 15, UX 15, Docs 15, Architecture 10).

### What Worked

1. **Swarm-of-small-tasks pattern.** 14 implementation agents across 4 waves. Each agent owned 1–4 file edits. Zero merge conflicts.
2. **KISS pivot during Wave 2.** When a Wave 1 agent invented an `article` section type that didn't exist in the schema enum, we pivoted to the existing `blog` type with `variant:"minimal"` — no schema change, no new template.
3. **4-reviewer parallel verification.** Combined coverage caught the `localStorage.clear()` blast radius, an EXPERT-mode regression in 4 simple editors, and a `ChatExplainer` jargon leak ("I update the JSON.").
4. **Tight commit cadence.** 13 small commits, easy to bisect.
5. **Personas scored honestly.** Grandma's 70/100 passes by 1 point; reviewer flagged exactly what would lift it.

### What Didn't Work / What I'd Do Differently

1. **Wave 1 agent #3 hallucinated `article` as a section type.** The fix took 1 wave of pivot work. *Lesson:* when a swarm agent will create new domain content, include the relevant schema/enum verbatim in the prompt.
2. **Wave 3 ship-blocker (TopBar `isDraft` undefined).** `tsc --noEmit` (root config) silently passed; only `tsc -b` (composite) caught it. *Lesson:* `npm run build` belongs in the verification swarm, not just `tsc --noEmit`.
3. **EXPERT regression in 4 simple editors.** ImagePicker DRAFT-scope agent removed it *unconditionally*. *Lesson:* "EXPERT unchanged" must be an explicit assertion in every DRAFT-narrowing prompt.
4. **`localStorage.clear()` blast radius.** Settings drawer agent followed the prompt literally. *Lesson:* security-sensitive ops need an explicit allowlist/denylist in the prompt.
5. **`ChatExplainer` jargon leak.** Step 2 read "I update the JSON." UX reviewer caught it; 1-line fix. *Lesson:* every novice-facing string should be Grandma-tested before commit.
6. **Doc drift.** CLAUDE.md says 37 ADRs and 102 tests; on disk: ADR-039 latest, test count not re-confirmed. *Lesson:* update CLAUDE.md before phase close.

### Deferred to Next Phase / Polish Pass

- Stage-1 backlog reconciliation (S1-01..S1-29) — out of P15 narrowed scope.
- `SectionsSection.tsx` extraction (530 lines vs 500-line guideline).
- `DRAFT_ALLOWED_SECTION_TYPES` move into `draftRename.ts` (currently duplicated).
- Storage-key central registry (`src/lib/storageKeys.ts`).
- EXPERT-mode inline section rename.
- Share-preview / Undo affordances in DRAFT.
- CLAUDE.md drift reconciliation (ADR count, test count, phase status).
- ESLint v9 flat-config migration (pre-existing).

### Phase 15 Commits (chronological)

| Commit | Wave | Summary |
|---|---|---|
| `8950b7c` | W1 | draftRename.ts |
| `7502e58` | W1 | ADR-038 + ADR-039 + blog-standard.json + personas-rubric.md |
| `d5c7d2b` | W2 | blog-standard pivot + kitchen-sink blog gap + DRAFT shell narrowing |
| `61360d4` | W2 | left-panel filter complete + session-log |
| `dbf73fc` | W3 | top-bar DRAFT budget + chat explainer |
| `34c6bcf` | W3 | Settings drawer mount + Onboarding 4 starters |
| `190967f` | W3 | tooltips + ImagePicker DRAFT scope (initial) |
| `9ae9858` | W3 | more tooltips + ImagePicker call-site updates |
| `56329dd` | W3 | final ImagePicker DRAFT removal in remaining simple editors |
| `20421a1` | W4 | fix TopBar.tsx ship-blocker (missing `isDraft`) |
| `82db7ef` | W4 | kitchen-sink.spec.ts ignore external CDN errors |
| `106d224` | Review | fix-pass A: DRAFT visibility cleanup |
| `7412b5b` | Review | fix-pass B: EXPERT preservation + storage safety |

### Hand-off to Phase 16

Phase 15 leaves the builder in a novice-friendly state with the LLM-editable surface (theme + hero + images + blog/article) clearly defined. Phase 16 begins implementing the local DB (sql.js + IndexedDB) per `plans/implementation/mvp-plan/02-phase-16-local-db.md`. No code from Phase 15 needs to be revisited as a precondition.

---

## Phase 15 — Original Track (Developer Assistance + Marketing Site Overhaul) — Historical

> Preserved for context. The MVP narrowing on 2026-04-25 superseded this scope; the work below shipped earlier and remains in the codebase.

**Phase:** 15 — Developer Assistance + Marketing Site Overhaul
**Duration:** 2026-04-06 to 2026-04-07 (2 sessions)
**Status:** CLOSED

---

## Dimension Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Features | 18/20 | All planned features shipped: tooltips (25+), shortcuts (4), error boundaries (2), AISP page, Research page, sticky nav. ESLint config deferred. |
| Code Quality | 16/20 | Zero console.logs, zero TS errors, build green. Bundle size documented but no code-splitting yet. ESLint v9 migration needed. |
| UX | 15/20 | Tooltips on all major controls. Keyboard shortcuts work. Empty states guide users. StoryBrand narrative on Welcome page. AISP/Research pages are strong. Mobile responsive needs deeper audit. |
| Specs | 14/20 | ADRs 038-043 are solid (swarm protocol, quality gates, test regression). AISP Platinum sample validated. No spec generator changes this phase. |
| Docs | 12/20 | Session logs and living checklist maintained well. Developer docs page not expanded beyond existing /docs. Wiki page created. |
| Demo | 10/20 | Browser preview captured. Marketing pages look good. No new demo flows added. Chat/Listen unchanged. |

**Composite Score: 85/100**

---

## What Shipped

1. **111 tests passing** — up from 90 (Phase 14 close) / 102 (Phase 14 baseline). 9 new Phase 15 tests + 3 test fixes.
2. **25+ tooltips** — CSS-only component, no external library. Covers TopBar, TabBar, LeftPanel, SectionsSection, SectionSimple, RightPanelTabBar.
3. **4 keyboard shortcuts** — Ctrl+P (preview), Ctrl+E (expert), ? (help), Escape (close). ShortcutHelp modal with kbd indicators.
4. **2 error boundaries** — ErrorBoundary wrapping all section renderers in RealityTab. SectionErrorFallback with recovery action.
5. **3 empty states** — No sections, no blueprints, no selection. All with helpful messaging and CTAs.
6. **AISP marketing page** — 5 Crystal Atom components, Sigma-512 symbol set, ambiguity comparison chart, GitHub link.
7. **Research page** — 3 research findings (55% bottleneck, 40-65% intent loss, landscape comparison).
8. **Sticky MarketingNav** — Consistent navigation across all 8 marketing pages with active-state indicators.
9. **ADRs 038-043** — Swarm Orchestration Protocol, Agent Roles, Human-Swarm Comms, Quality Gates, Grounding Auto-Gen, Test Regression Prevention.
10. **ruflo + RuVector submodules** — Initialized at upstreams/ for core flywheel reference.

## What Didn't Ship

1. **ESLint v9 migration** — eslint.config.js needed. ESLint effectively not running. Deferred to P16.
2. **Bundle code-splitting** — 2,060 KB single chunk. Vite warns. Deferred to P16.
3. **Developer docs expansion** — /docs page exists but not expanded with section reference, theme reference, JSON guide.
4. **Onboarding flow improvements** — First-visit detection, welcome overlay not implemented. Was in original P15 scope but deprioritized in favor of marketing overhaul.
5. **Toast/notification system** — Not implemented. Error boundary and empty states cover most cases.

## Lessons Learned

1. **Test selector brittleness** — CSS `[role="button"]` doesn't match native `<button>` implicit ARIA roles. Always use `getByRole()` in Playwright. This wasted ~30 min of debugging.
2. **UI evolution breaks tests** — Chat demo buttons moved behind a dialog. Tests need to track the current UI flow, not the Phase 3 flow. Tests are documentation of current behavior.
3. **Keyboard shortcuts in Playwright** — `page.keyboard.type('?')` works but is sensitive to focus state. Always blur inputs first with `document.activeElement.blur()` or click a non-input element.
4. **Swarm grounding pays off** — ADRs 038-043 made this session much smoother. The 5-stage protocol (INGEST → EXECUTE → VERIFY → CLOSE → HANDOFF) kept the work structured.
5. **Marketing pages > dev features for capstone** — AISP and Research pages directly serve the capstone defense narrative. More valuable than toast notifications.

## Risk Flags for Phase 16

- ESLint has been off for multiple phases. Technical debt accumulating.
- Bundle size (2 MB) will matter at scale. Code-splitting should happen before Phase 19.
- 13 image effects have not been audited since Phase 12. Some may be broken.
- Site context (purpose/audience/tone) has never been verified to actually affect spec output.
