# P123 / W6 — Architecture Brutal-Honest Review

**Reviewer #4 of 4 (lens: Architecture).** Parallel siblings: UX / Functionality / Security.
**Date:** 2026-05-08 · **Branch:** `swarm/p122-ux-overhaul` · **Head:** `c616ec033` (P122 SEALED).
**Scope:** verify architectural invariants and atom-purity hold across P122 (W1–W11) + P123 work-in-progress.

---

## 1. Verdict

**PASS-WITH-FIX-PASS.**

All 12 architecture fitness functions GREEN. Atom-purity holds; LLM SDK confinement holds; bundle within budget; dependency baseline within ceiling. **However** three documented-vs-implementation drifts surfaced (one P1 ADR-ledger truth-up, one P1 ADR-150 implementation-checklist, one P2 D4 ordering). None of the three are runtime-incorrect — the system works. They are seal-discipline gaps.

---

## 2. ARCH 1–12 fitness function results

`npm run check:invariants` → **12 / 12 GREEN** (7.0s, single chromium worker).

| ID | Invariant | ADR | Result |
|----|-----------|-----|--------|
| ARCH.1  | Bundle entry chunk ≤800 KB gzip | ADR-102 | PASS — 617.3 KB / 800 KB (77 %) |
| ARCH.2  | Hex literals in `src/components/` ≤240 ceiling | ADR-087 | PASS |
| ARCH.3  | Zero secret-shape columns in migrations | ADR-043 | PASS |
| ARCH.4  | LLM SDK constructions confined to `intelligence/llm/` | ADR-047 | PASS |
| ARCH.5  | AISP testid presence in `SpecWorkbench` | ADR-110 | PASS |
| ARCH.6  | Atom-pure boundary (`contexts/` ↛ `components/`) | ADR-134 | PASS |
| ARCH.7  | `personalityEngine.ts` zero LLM imports | ADR-073 | PASS |
| ARCH.8  | Total deps ≤54 ceiling | ADR-102 | PASS — 27 deps + 20 devDeps = 47 / 54 |
| ARCH.9  | `chatPipeline.ts` threads `newRequestId` before log writes | ADR-126 | PASS |
| ARCH.10 | JSON-Patch paths validated via Zod regex | ADR-044 | PASS |
| ARCH.11 | Pre-commit hook chains `check-secrets.sh` | ADR-043 | PASS (adr-lint wire still owner-action) |
| ARCH.12 | `scripts/adr-lint.ts` rule table ≥6 ADR mappings | P110 / A1 | PASS |

Sibling drift guard: `tests/p112-adr-readme-drift.spec.ts` — **4 / 4 GREEN**, but only because the spec uses ±1 tolerance (see §5).

---

## 3. Atom-purity findings

**Direct grep, two scopes:**

- `src/contexts/intelligence/aisp/` — 0 imports from `@/components/*` or `@/pages/*`.
- `src/contexts/specification/` — 0 imports from `@/components/*` or `@/pages/*`. Also 0 `from 'fs'` and 0 `from 'node:*'` in `exportClaudeCode.ts` (atom-pure contract per ADR-122 D1 + ADR-134).

**`exportClaudeCode.ts` bundle check** (`src/contexts/specification/exportClaudeCode.ts:1`, 491 LOC):
- `files.push(...)` call sites = **12** → exceeds the ≥10 baseline locked by ADR-138 D1.
- W4b (`ListenPreview.tsx`) did NOT touch this surface; last commit on the file is `a23874762` (P111). Confirmed via `git log --oneline c616ec033 -- src/contexts/specification/exportClaudeCode.ts`.

**LLM SDK confinement (ARCH.4 expanded grep):** zero `new Anthropic` / `new OpenAI` / `new GoogleGenAI` outside `src/contexts/intelligence/llm/`.

**Verdict:** atom layer is uncontaminated. No P122/P123 code path leaks the view layer into the contexts layer.

---

## 4. File-size cap offenders

CLAUDE.md §6 policy: **≤500 LOC default**, per-component caps codified by ADR. Files currently >500 LOC:

| File | LOC | Cap source | Status | P122 delta |
|------|-----|------------|--------|-----------|
| `src/pages/Onboarding.tsx`                              | 1079 | none codified | **P1 — NEW offender** | +222 LOC in `c616ec033` |
| `src/demos/FullSiteSimulator.tsx`                       | 932  | none codified | pre-existing (P74) | unchanged |
| `src/contexts/intelligence/chatPipeline.ts`             | 798  | none codified | pre-existing (P114) | unchanged |
| `src/components/shell/ChatInput.tsx`                    | 741  | **ADR-095 ≤750** | within cap | +1 LOC |
| `src/components/left-panel/SectionsSection.tsx`         | 708  | none codified | pre-existing | +31 LOC |
| `src/contexts/intelligence/templates/themeLibrary.ts`   | 671  | data file | data file (acceptable) | unchanged |
| `src/store/configStore.ts`                              | 670  | none codified | pre-existing | unchanged |
| `src/components/center-canvas/RealityTab.tsx`           | 666  | none codified | pre-existing | unchanged |
| `src/components/center-canvas/ResourcesTab.tsx`         | 562  | none codified | pre-existing | unchanged |
| `src/components/right-panel/expert/SectionExpert.tsx`   | 549  | none codified | pre-existing | unchanged |
| `src/demos/ChatModeDemo.tsx`                            | 546  | demo file | pre-existing | unchanged |
| `src/demos/ListenModeDemo.tsx`                          | 535  | demo file | pre-existing | unchanged |
| `src/data/examples/index.ts`                            | 513  | data file | data file (acceptable) | unchanged |

**Onboarding.tsx is the new P1 offender.** P122 / W2 (4-card picker) added 222 net LOC, pushing the file from 857 → 1079 (216 % of the default 500 cap). It has no per-component ADR cap and no extraction precedent.

`ChatInput.tsx` continues to honour ADR-095 ≤750 (741 / 750, 9-LOC margin).

---

## 5. ADR drift / staleness

### P1 — ADR-150 not row-listed in `docs/adr/README.md`

- **Disk reality:** 141 ADR files; highest = `ADR-150-llm-update-contract.md`.
- **README header (`docs/adr/README.md:1`):** `Total files on disk: 140 · Highest-ID: ADR-149`. Off by 1 in both axes.
- **`docs/adr/README.md:229`** still reads `Policy: New ADRs MUST continue at ADR-150+` — but ADR-150 is *already on disk*, so the next free number is 151+.
- **`docs/adr/README.md:258`** still reads `next free number (currently ≥ 148)` — was already stale at P119/P120; P122 did not reconcile.
- **`docs/adr/README.md:276`** "Last updated 2026-05-07 (P120 / AUDIENCE-ROUTING …)" — no P122 row; the bucket "Post-RC hardening (P110-P120)" has not been renamed to include P122.
- The `tests/p112-adr-readme-drift.spec.ts` regression guard passes only because it uses `±1` tolerance. P122 / W6 spent the ±1 budget. The next ADR (ADR-151) would push drift to ±2 and the test would go RED.

### P1 — ADR-150 implementation checklist all unchecked

`docs/adr/ADR-150-llm-update-contract.md:113-119` ships **7 of 7 items still `[ ]`** at the bottom of the ADR file:

```
- [ ] geminiAdapter.ts:DEFAULT_MODEL = 'gemini-2.5-flash' — verify
- [ ] prompts/system.ts:PATCH_ATOM matches D4 ordering — verify
- [ ] chatPipeline.ts site-update call site emits the response_summary log per D6
- [ ] CostPill visible in Agentics layout per D7
- [ ] Smoke test in W6: 1 real prompt, log row written with all D6 fields, redaction holds
- [ ] Persona-Playwright verification (W11): chat-mode prompt → patch → log row
- [ ] Total P122 LLM smoke spend recorded in retrospective; must be < $0.05
```

The ADR was authored but the closing-tick step was skipped at seal time. Some items are demonstrably done (smoke results live at `docs/audit/p123-llm-smoke-results.md`); others are partial (D6 below); others are unverifiable from the artifact alone.

### P2 — ADR-150 D6 `result_kind` enum not wired

`docs/adr/ADR-150-llm-update-contract.md:80` declares the locked enum:
`result_kind ∈ {patch_applied, patch_validation_failed, parse_error, cap_short_circuit, fallback_canned}`.

Implementation surface in `src/contexts/intelligence/chatPipeline.ts` emits `response_summary` events with `stage` ∈ `{decomp, template, legacy-template, llm, canned-fallback}` (lines 545, 594, 646, 734, 779) — semantically adjacent but **not** the ADR-150 vocabulary. Grep for `patch_applied|patch_validation_failed|cap_short_circuit|fallback_canned` returns zero hits in `src/contexts/`.

`prompt_hash` (D6 SHA-256 line 79) IS wired — `src/contexts/persistence/repositories/llmLogs.ts:28,53,61` and migration `002-llm-logs.sql:22`. The `model` / `input_tokens` / `output_tokens` / `cost_usd` / `latency_ms` columns are likewise present. So D6 is **partially** satisfied: the column shape exists in `llm_logs`, but the `response_summary` event-data shape in `log_events` does not match the ADR-150 enum.

### P2 — ADR-150 D4 system-prompt ordering: documented vs. implemented

ADR-150 D4 (`docs/adr/ADR-150-llm-update-contract.md:51-61`) prescribes the order **Role → What is available → Requirements (no prose) → Current state → User prompt**.

`src/contexts/intelligence/prompts/system.ts:156-178` builds in this order: ROLE → CRYSTAL_ATOM (covers "What is available" + Requirements R8 symbolically) → brand → ALLOWED PATHS → CURRENT JSON → siteContext → history → personality → OUTPUT_RULE. The `OUTPUT_RULE` (`Output: return ONLY a JSON object...`) sits at position 9 — *after* current state. ADR-150 D4 wants it at position 3.

Mitigating: `CRYSTAL_ATOM` line 56 carries `R8: {prose,html,markdown,fences}=∅` symbolically up front, so the requirement is communicated, just split between two prompt sections. This is a documentation-vs-implementation gap, not a runtime violation.

### P3 — PATCH_ATOM SectionType matches canonical 18 (no drift)

`src/contexts/intelligence/prompts/system.ts:46` — SectionType enum exactly matches `src/lib/schemas/section.ts:5-13` (canonical 18 per ADR-100). PATCH_ATOM's `Γ R3` references `SectionType` correctly. **No drift.** P109 section-enum drift guard remains protective.

---

## 6. P1 architectural blockers (must fix before P123 seal)

1. **Truth-up `docs/adr/README.md` for ADR-150** — bump header `140 → 141`, `ADR-149 → ADR-150`; append the ADR-150 row to the "Post-RC hardening (P110-P120)" bucket (rename to P110-P122); fix line 229 `ADR-150+` → `ADR-151+`; fix line 258 `≥ 148` → `≥ 151`; refresh "Last updated" footer with P122 / P123 marker. Without this, the next ADR goes off the cliff (drift guard ±1 budget already spent).
2. **Tick the ADR-150 implementation checklist** — for each of the 7 items, mark `[x]` with file:line evidence OR explicitly downgrade the unmet items to a P123 carry-forward block at the bottom of the ADR. The current state ("ADR shipped, none of its own checklist verified") is the exact failure mode ADR-138 D2 was designed to prevent.
3. **Reconcile ADR-150 D6 vocabulary with `chatPipeline.ts` `response_summary.stage`** — either rewrite D6 to acknowledge the existing `stage` enum is the implementation, OR add the ADR-150 enum as a `result_kind` field alongside `stage` so log readers can filter on the contract vocabulary. Pick one; document the choice; close the gap.

None of the three blocks the build, ARCH suite, or runtime — they block seal-discipline integrity per ADR-138 + ADR-139 + ADR-140.

---

## 7. P2 hardening recommendations

1. **Codify `Onboarding.tsx` cap.** P122 / W2 added 222 LOC and the file is now 1079 LOC (216 % of default cap). Either ship a per-component ADR raising the cap explicitly (precedent: ADR-095 for ChatInput at 750), OR queue an extraction sprint (e.g., split the 4-card picker into `ProjectPicker.tsx` + `ThemePicker.tsx` + `ExamplePicker.tsx`). Without action, the next P122-style edit pushes the file to 1300+ with zero gate.
2. **Lower `tests/p112-adr-readme-drift.spec.ts` tolerance after the README truth-up.** P112 set `±1` to allow in-flight commits; once ADR-150 is row-listed, drop to `±0` for the disk-vs-header line and keep `±1` only for the "next free" advisory. Catches future drift one PR earlier.
3. **D4 ordering re-write.** Either (a) update `system.ts:buildSystemPrompt` to move `OUTPUT_RULE` before `CURRENT JSON`, OR (b) update ADR-150 D4 to acknowledge that the locked Σ in `CRYSTAL_ATOM` already carries the "no prose" requirement and the textual `OUTPUT_RULE` is a redundant belt-and-braces footer. Whichever is easier; document the choice.
4. **Wire `adr-lint.ts` to `.husky/pre-commit`** — owner-action carry-forward from ADR-138 D3 / ADR-139 D3 / ADR-140 D3. ARCH.11 is currently a soft pass with a `wire-pending` annotation. Five phases of "owner action required" is enough; either lift the sandbox restriction this sprint or move the lint to GitHub Actions only and stop pretending pre-commit will land.

---

## 8. P3 future-refactor notes

1. **Bundle headroom is shrinking.** 617 KB / 800 KB (77 % of cap, +183 KB headroom). P124 demo mode (`server-side key, IP rate limit`) plus any new dependency will push this fast. Plan a tree-shake pass or a route-lazy round before adding the next major chunk.
2. **`chatPipeline.ts` at 798 LOC** is the next "obvious" extraction candidate after `Onboarding.tsx` and ChatInput. The DECOMP / template / legacy / LLM dispatch branches are five `response_summary.stage` paths; they are already factored conceptually — extracting each as a `chatPipeline/<stage>.ts` module would drop the orchestrator to ~250 LOC without touching the atoms layer.
3. **`docs/adr/README.md:258`** ("currently ≥ 148") was stale at P119; this drift is a signal that the README maintainers are reading the header but not the body. A small `scripts/check-adr-readme-counter.ts` that re-derives both numbers from disk and rewrites them in place would close the loop without manual edits.
4. **`src/contexts/specification/exportClaudeCode.ts` at 491 LOC** is approaching the 500 default. ADR-138 D1 emits 12 logical files; if P124 adds the 13th (e.g. `walkthrough.md` for hosted-demo replay), the file crosses the cap. Pre-emptive extraction (e.g. `buildClaudeMd.ts` + `buildAdrBundle.ts` siblings) keeps the orchestrator small.
5. **Document a `docs/strategic-reviews/` vs `plans/strategic-reviews/` convention.** This review was filed under `docs/` per the dispatch instruction; the historical convention (P85, P109 audit) puts strategic reviews under `plans/strategic-reviews/`. Pick one; document the move.

---

## 9. Final verdict

**PASS-WITH-FIX-PASS.**

The system is architecturally sound. Atom layer is pure. LLM SDK is confined. JSON-Patch invariants hold. Bundle is within budget. Dependency ceiling is honoured. The 12 fitness functions encoded across ADR-043 / -044 / -047 / -073 / -087 / -102 / -110 / -126 / -134 are GREEN.

The seal-discipline drift is what blocks a clean P123 seal: ADR-150 was authored but its implementation checklist was not closed; the README ledger was not advanced for ADR-150; and ADR-150 D6's prescriptive `result_kind` enum doesn't match the implementation's `stage` enum.

**Three P1 fixes** in §6, **four P2 hardenings** in §7, **five P3 future-refactor notes** in §8.

If the three P1 items land in a P123 fix-pass commit (≤30 LOC across `docs/adr/README.md` + `ADR-150-llm-update-contract.md` plus a one-line `chatPipeline.ts` field rename or ADR rewrite), this becomes a clean PASS.

Honest call: **do the fix-pass, then seal.** The codebase deserves the discipline.

---

**Reviewer:** Architecture lens, P123 / W6 brutal-honest review.
**Lines:** 215 / 600 cap.
**Read-only.** No source files modified during this audit.
