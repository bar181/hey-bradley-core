# Phase 20 — Master Checklist

> **Status:** READY TO START (preflight approved 2026-04-27).
> **Effort:** 5–7 days; $0 in dev; ~$0.01 post-tag-smoke.
> **Capstone gate:** Grandma ≥70 / Framer ≥80 / Capstone ≥88. P19 already at 88; hold or exceed.
> **Companion docs:** `preflight/00-summary.md`, `preflight/01-scope-lock.md`, `preflight/02-fix-decomposition.md`, `preflight/03-c20-abortsignal-goap.md`, `preflight/MEMORY.md`, `01-strategic-alignment.md`.

---

## Day 1 (Mon) — Cost cap + AbortSignal infrastructure

### ADRs
- [ ] Author `docs/adr/ADR-049-cost-cap-telemetry.md` (replaces conflict with existing ADR-047 llm-logs)
- [ ] Update `06-phase-20-mvp-close.md` §3 to reference ADR-049 (not ADR-047)

### Cost-cap wiring (existing P20 DoD items 1–3)
- [ ] Create `src/components/shell/CostPill.tsx` (~80 LOC)
  - [ ] Subscribes to `intelligenceStore.sessionUsd` + `capUsd`
  - [ ] Renders `$0.07 / $1.00`; amber at 80%; red at 100%
  - [ ] `data-testid="cost-pill"` + `cost-pill-amber` + `cost-pill-red`
  - [ ] Hidden when sessionUsd === 0
- [ ] `src/store/intelligenceStore.ts`: add `capUsd: number` (default 1.00; loaded from kv on init)
- [ ] `src/store/intelligenceStore.ts`: add `setCapUsd(n)` action (clamps to [0.10, 20.00], writes kv)
- [ ] `src/contexts/intelligence/llm/auditedComplete.ts`: replace `getCapUsd()` env-only logic with kv-read + env override fallback
- [ ] `src/components/settings/LLMSettings.tsx`: add numeric cap input (range 0.10–20.00, step 0.01, persists on blur)

### C20 AbortSignal (per `preflight/03-c20-abortsignal-goap.md` §5)
- [ ] `LLMRequest.signal?: AbortSignal` added in `adapter.ts`
- [ ] Claude adapter passes `{ signal }` to SDK `messages.create`
- [ ] Gemini adapter races `req.signal` abort vs SDK promise
- [ ] OpenRouter adapter passes `signal` directly to `fetch`
- [ ] Fixture / simulated / agentProxy adapters acknowledge `req.signal?.aborted`
- [ ] `auditedComplete`: replace Promise.race with AbortController; abort at 30s
- [ ] `tests/p20-c20-abort.spec.ts` (NEW, ~80 LOC, 1 case + leak assertion)

### Day-1 tests (NEW)
- [ ] `tests/p20-cost-cap.spec.ts` (4 cases: under-cap / at-cap / over-cap / cap-edit-propagates)
- [ ] `tests/p20-c20-abort.spec.ts` (1 case)

### Day-1 verification
- [ ] All P15-P19 targeted Playwright still green (46/46)
- [ ] New 5 cases green
- [ ] `npm run build` + `tsc --noEmit` exit 0
- [ ] Day-1 commit pushed

---

## Day 2 (Tue) — SECURITY.md + privacy + FK

### SECURITY.md (P20 DoD item 8 + C07)
- [ ] Author `SECURITY.md` at repo root (~250 LOC, per `preflight/02-fix-decomposition.md` §B.1)
  - [ ] §1 Trust boundary
  - [ ] §2 BYOK contract (storage, send/never-send, DEV caveat)
  - [ ] §3 Per-provider data flow (Claude / Gemini / OpenRouter / simulated / mock)
  - [ ] §4 What leaves the browser
  - [ ] §5 What stays in the browser
  - [ ] §6 What `.heybradley` exports include
  - [ ] §7 Multi-tab visibility
  - [ ] §8 Reporting

### C06 — OpenRouter privacy hint
- [ ] `src/components/settings/LLMSettings.tsx`: add provider-tier hint when provider === 'openrouter' ("OpenRouter sees prompts, responses, model selection, your origin")

### C16 — FK on llm_logs.session_id
- [ ] `src/contexts/persistence/migrations/003-llm-logs-fk.sql` (NEW, ~10 LOC)
- [ ] Verify `PRAGMA foreign_keys = ON` runs at session level in `db.ts:initDB`
- [ ] Migration runs cleanly on existing P19-sealed DBs

### Day-2 verification
- [ ] All targeted Playwright green
- [ ] Migration 003 doesn't break existing schema
- [ ] Day-2 commit pushed

---

## Day 3 (Wed) — Master Acceptance Test + image fixtures + help handler

### `tests/mvp-e2e.spec.ts` (P20 DoD item 4)
- [ ] 10-step end-to-end Playwright spec
- [ ] Drives default-config → blog-standard switch
- [ ] Tests hero update + theme change + serif font + article gen + image swap (after C01)

### C01 — 8 image-MVP fixtures
- [ ] `src/data/llm-fixtures/step-2.ts`: append 8 entries (replace/swap/dim/brighten/rounded/square/centered/crop)
- [ ] `src/lib/schemas/patchPaths.ts`: add `borderRadius` + `objectPosition` paths
- [ ] Update `migrations/001-example-prompts.sql` to seed image prompts (closes AgentProxyAdapter bypass)
- [ ] `tests/p20-image-fixtures.spec.ts` (NEW, ~150 LOC, 8 cases)

### C02 — Help/discovery handler
- [ ] `src/data/llm-fixtures/step-2.ts`: append help fixture (regex covers "What can you do?", "Help", "Hi", "Hello", "I'm stuck", "Show me")
- [ ] Returns empty patches + friendly summary listing 5 starter patterns
- [ ] `tests/p20-help-handler.spec.ts` (NEW, ~50 LOC, 1 parametrized case across 6 phrasings)

### C15 — Import lock against malicious example_prompts
- [ ] `src/contexts/persistence/exportImport.ts`: `importBundle` re-seeds `example_prompts` from canonical migration 001
- [ ] `tests/p20-import-lock.spec.ts` (NEW, ~80 LOC)

### Day-3 verification
- [ ] All targeted Playwright green (now ~70 cases)
- [ ] `mvp-e2e.spec.ts` passes against `vite preview`
- [ ] Day-3 commit pushed

---

## Day 4 (Thu) — Vercel deploy + getting-started + Step 4 prep

### Vercel deploy (P20 DoD item 10)
- [ ] Confirm `vite.config.ts` `assetsInclude: ['**/*.wasm']` (or equivalent)
- [ ] Vercel project created; build green on first attempt
- [ ] Live URL recorded
- [ ] Build-time `VITE_LLM_API_KEY` assertion runs in Vercel build (verify CI grep)

### Getting started
- [ ] `docs/getting-started.md` (P20 DoD item 7) — 60-second BYOK walkthrough
- [ ] `README.md` updated with status + Vercel URL + screenshots + BYOK section

### Step 4 prep (live-LLM smoke, post-deploy human task)
- [ ] Document `VITE_LLM_LIVE_SMOKE=1` flag in README troubleshooting section
- [ ] Mark as "post-deploy, human-approved, ~$0.01 budget"
- [ ] `tests/p20-live-smoke.spec.ts.skip` (skipped scaffold; flips on env var)

### Day-4 verification
- [ ] Stranger-clone test: README.md + getting-started → working demo in <5 min
- [ ] Vercel preview URL works
- [ ] Day-4 commit pushed

---

## Day 5 (Fri) — Polish week kickoff: ListenTab split + mobile + sentinel + sprint-alignment task

### C04 — ListenTab.tsx split
- [ ] `src/components/left-panel/listen/OrbAnimation.tsx` (NEW, ~180 LOC)
- [ ] `src/components/left-panel/listen/DemoSimulator.tsx` (NEW, ~200 LOC)
- [ ] `src/components/left-panel/listen/PttSurface.tsx` (NEW, ~250 LOC)
- [ ] `src/components/left-panel/listen/OrbSettings.tsx` (NEW, ~80 LOC)
- [ ] `src/components/left-panel/ListenTab.tsx` reduced to ~80 LOC (composition root)
- [ ] All `data-testid` selectors preserved
- [ ] All P19 listen tests still green

### C11 — Vertical mobile carousel
- [ ] `src/pages/Welcome.tsx`: useMediaQuery '(max-width: 600px)' branch → vertical list
- [ ] Playwright case at `viewport: { width: 400, height: 800 }`

### C14 — SENSITIVE_TABLE_OPS sentinel test
- [ ] `tests/p20-sentinel.spec.ts` (NEW, ~60 LOC) — parses `migrations/*.sql`; flags any new sensitive column outside the registry

### CONTRIBUTING.md (P20 DoD item 8 — third doc)
- [ ] Standard OSS contribution guide (build / test / branch / PR / commit-style)

### deferred-features.md Disposition column (P20 DoD item 9)
- [ ] Add column to all 38 existing rows (Post-MVP-1 / Post-MVP-2 / Dropped)
- [ ] Cross-link from C03/C05/C08/C09/C10/C19 entries

### *** AGENT TASK (3rd-party feedback) — Day 5 OR Day 6 ***
- [ ] Spawn ONE agent with this scope:
  - [ ] Update `plans/implementation/phase-18/roadmap-sprints-a-to-h.md` — mark P18/P18b/P19 as complete with actual scores; note **deviation: P19 actually shipped Listen Mode (originally Sprint F P36-P39); original P19 "prompt template library" deferred to Sprint B/C**
  - [ ] Update `plans/implementation/phase-18/strategic-vision.md` — resolve the 6 strategic open questions based on decisions made through P15-P19 (e.g. AISP enforced from P18; Listen pulled forward; cost cap is per-session for now)
  - [ ] Confirm alignment with the broader P20–P46 sprint plan; flag any phases now obsolete or out-of-sequence
  - [ ] Output: 3 updated files + a `phase-20/strategic-alignment-report.md` summarizing the deviations and re-sequencing

### Day-5 verification
- [ ] All targeted Playwright green (~80 cases now)
- [ ] ListenTab tests confirm all selectors work post-split
- [ ] Day-5 commit pushed

---

## Day 6 (Mon W2) — Polish week + persona reviews

### C12 — AISP Blueprint sub-tab refresh
- [ ] `src/components/center-canvas/BlueprintsTab.tsx`: add AISP sub-tab
  - [ ] `<pre>` block with Crystal Atom from `prompts/system.ts`
  - [ ] External link to `bar181/aisp-open-core`
  - [ ] Active site's "AISP fingerprint" line

### C17 — parseMasterConfig Zod helper
- [ ] `src/lib/schemas/masterConfig.ts` (NEW, ~150 LOC) — Zod schema for MasterConfig
- [ ] Replace 11 `as unknown as MasterConfig` casts in `configStore.ts`
- [ ] Replace 17 casts in `data/examples/index.ts`
- [ ] Boot-time corruption detection works

### C18 — Audit log LRU bound
- [ ] `pruneOldLLMLogs` extended to also delete oldest beyond 10K row count

### Persona reviews (P20 DoD item 5 + 6)
- [ ] Pre-publish persona rubric `plans/implementation/phase-20/personas-rubric.md`
- [ ] Schedule 3 reviewers (Grandma + Framer + Capstone)
- [ ] Conduct review against Vercel preview URL
- [ ] Record scores in `plans/implementation/phase-20/personas.md`
- [ ] Verify Grandma ≥ 70 / Framer ≥ 80 / Capstone ≥ 88

### Day-6 verification
- [ ] All targeted Playwright green
- [ ] Personas hit targets (or replan triggered if miss; see `06-phase-20` §6.4)
- [ ] Day-6 commit pushed

---

## Day 7 (Tue W2) — Close-out

### Documentation
- [ ] `RETRO.md` written (P20 DoD item 12) — what to keep / drop / reframe
- [ ] `REVIEW.md` written (P20 DoD item 13) — swarm review summary

### Master checklist green
- [ ] `plans/implementation/mvp-plan/08-master-checklist.md` — 100% green for P15–P20
- [ ] All ADRs ticked; all DoD items ticked; persona scores recorded

### Tag + Step 4 smoke
- [ ] `git tag mvp-rc1` (or equivalent — owner-decided)
- [ ] Push tag
- [ ] **POST-TAG (human-approved):** Run Step 4 live-LLM smoke (`VITE_LLM_LIVE_SMOKE=1`); ~$0.01 budget; assert all 5 starter prompts work against real Haiku
- [ ] Record smoke result in `plans/implementation/phase-20/step-4-smoke-result.md`

### Final P20 verification
- [ ] No new `console.error` during Master Acceptance Test (P20 DoD item 14)
- [ ] Bundle margin still ≥0 KB under 800 KB budget
- [ ] Real-LLM cost: $0 dev + ~$0.01 smoke = ~$0.01 total

---

## Top-level rollups

### Items
- Original P20 DoD: 14
- Pulled-in must-fix carryforward: 6 (C01, C02, C06, C15, C16, C20)
- Pulled-in polish carryforward: 6 (C04, C11, C12, C14, C17, C18)
- ADR / doc closure: 2 (ADR-049, C13 doc fix)
- Day 5/6 sprint-alignment agent task: 1
- **Total: 29 line items**

### Tests
- Pre-P20 targeted: 46
- Day 1: +5 (cost-cap×4, abort×1)
- Day 3: +13 (mvp-e2e×10, image×8 ... actually image is a single parametrized + helper, count as 8 cases / mvp-e2e 10 single-step asserts ~ +13 effective)
- Day 5: +1 (sentinel)
- **Projected post-P20 targeted: 65+**

### Bundle budget
- Current: 599.85 KB main + 100 KB lazy = ~700 KB gzip
- Reserve for P20: ≤100 KB delta
- Hard cap: 800 KB

### $ Budget
- Dev cost: $0 (FixtureAdapter + AgentProxyAdapter + simulated)
- Step 4 smoke: ~$0.01 (5 starters × ~$0.002 each, real Haiku, post-tag, human-approved)

### Phase-18 strategic alignment (per Day 5/6 agent task)
- See `01-strategic-alignment.md` for the canonical mapping of P15-P19 actuals back onto the original phase-18 plan.

---

**Ready to start?** Approve the 9-item decision checklist in `preflight/00-summary.md` §8 → kick off Day 1 with cost-cap + ADR-049 + C20.
