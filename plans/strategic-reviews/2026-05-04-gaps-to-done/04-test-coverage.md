# Track D — Test Coverage & Honest Gaps Audit

**Date:** 2026-05-04 · **Branch:** claude/verify-flywheel-init-qlIBr · **Anchor:** P104 SCHEMA-GUARDS SEALED
**Mission:** Brutal-honest deep-dive of the test surface. RESEARCH ONLY.
**Sibling tracks:** A (ADR contracts), B (Pipeline), C (Persistence), E (UI)

---

## Summary

**TL;DR — The test suite is a documentation-and-grep harness, not a behavior verifier.**

- Cumulative literal `test(` count across `tests/**/*.spec.ts` = **1,952** (CLAUDE.md anchor claim "~1335+ at P104" is OFF in the OPPOSITE direction — actual is HIGHER, but the gap is qualitative not quantitative)
- **42** top-level `test.skip` invocations (excludes the conditional `test.skip(true, …)` soft-pass pattern that fires inside test bodies, which adds another **45**)
- **1,038** `existsSync` calls across spec files — **average 7.9 per spec**; P100W2 alone has 44
- Of **131** `*.spec.ts` files, **only 26** ever call `page.goto` (Playwright bootstrap). All P75–P104 specs are **pure-unit FS-read regex matchers** with `// PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.` headers
- Of **131** spec files, **only 23** use relative imports (`from '../...'`) and **only 3** use `@/` path-alias imports — i.e. the test corpus barely loads source modules; it greps strings inside files instead
- The single Playwright project is `Desktop Chrome`. **Zero mobile viewport runs.** All "375/390/428" matches are doc-text searches (e.g. `expect(src).toContain('375px')`)
- `cleanTranscript` (P100 W2 FMT-VERIFY claim "called from listen-capture pre-submit") has **ZERO behavioral coverage** — only one existsSync check in p100-w2-fmtverify.spec.ts asserting the file is on disk
- The "P101 7-step e2e smoke" file is a misnomer — it `expect(src).toMatch(/regex/)` against source files. No e2e execution
- Persona scoring (Grandma 86 / Framer 86 / Lars 88) is verified by **a single regex** that counts `\b(8[5-9]|9[0-9]|100)/100\b` substrings in the rescore markdown — does not connect to runtime evidence
- Live-LLM smoke (CF#4) and STT calibration (CF#5) are documented as owner-required post-RC tasks; both have **zero automated coverage**

**The seal-gate ratchet is working as designed for KISS pure-unit gates.** It's NOT working as a runtime regression suite. The cumulative count claim is technically correct in literal `test(` count but obscures that ~85% of those tests assert `expect(string).toMatch(regex)` against source files rather than calling source code.

---

## Method

1. Counted literal `test(` and `it(` occurrences across all `tests/**/*.spec.ts` (Playwright + e2e subfolder)
2. Counted soft-pass guards (`existsSync` and conditional `test.skip(true, ...)`)
3. Mapped each post-P75 spec file to {LOC, cases, existsSync count, hard-gate cases}
4. Verified Playwright config — single chromium project, no mobile
5. Cross-referenced P102 brutal review verdicts against actual hard-test enforcement
6. Traced `cleanTranscript` / atom helpers / live-LLM / STT through grep + source

No tests were executed. Static-only audit.

---

## Test inventory (P75 onward — most relevant to RC + Agentic Workbench arc)

| File | LOC | Cases | existsSync | Hard-gate cases |
|---|---|---|---|---|
| p75-section-type-closure.spec.ts | — | 27 | 10 | mostly hard (file shape on shipped surfaces) |
| p76-spec-export-quality.spec.ts | — | **0** | 2 | **0** (suite is empty — only 2 existsSync probes) |
| p77-perf-and-a11y.spec.ts | — | 17 | 17 | low (1:1 with existsSync) |
| p78-multipage-mvp.spec.ts | — | 19 | 24 | low |
| p79-page-aware-pipeline.spec.ts | — | 14 | 23 | very low |
| p80-agentic-product-templates.spec.ts | — | 13 | 21 | very low |
| p81-prompt-library.spec.ts | — | 16 | 25 | low |
| p82-oc-cleanup.spec.ts | — | 15 | 24 | low |
| p83-aisp-adoption.spec.ts | — | 16 | 31 | very low |
| p84-rc-final.spec.ts | — | 15 | 30 | very low |
| p85-aisp-integration.spec.ts | — | 15 | 30 | very low |
| p86-final-polish.spec.ts | — | 15 | 26 | very low |
| p87-marketing-mobile.spec.ts | — | 12 | 25 | very low |
| p88-section-visual.spec.ts | — | 12 | 18 | low |
| p89-tier2-foundation.spec.ts | — | 19 | 32 | very low |
| p89b-supabase-cleanup.spec.ts | — | 8 | 11 | very low |
| p90-mode-architecture.spec.ts | 259 | 18 | 28 | very low |
| p91-process-map.spec.ts | 228 | 19 | 29 | very low |
| p92-process-atom.spec.ts | 182 | 16 | 25 | very low |
| p93-ddd-atom.spec.ts | 195 | 17 | 29 | very low |
| p94-agent-atom.spec.ts | 199 | 15 | 29 | very low |
| p95-spec-workbench.spec.ts | 235 | 17 | 34 | very low |
| p96-export-claude-code.spec.ts | 229 | 16 | 31 | very low |
| p97-tdd-scaffold.spec.ts | 212 | 15 | 29 | very low |
| p98-kiss-review.spec.ts | 233 | 15 | 30 | very low |
| p99-seal-panel.spec.ts | 243 | 18 | 31 | low (3 ADR/EOP hard, rest soft) |
| p100-w2-comprehensive-logs.spec.ts | 333 | 30 | 44 | very low |
| p100-w2-fmtverify.spec.ts | 187 | 17 | 20 | low |
| p101-rc.spec.ts | 175 | 14 | 19 | low |
| p101-7step-e2e-smoke.spec.ts | 229 | 15 | 4 | regex-against-src (NO runtime) |
| p101-verb-classifier.spec.ts | 122 | 15 | 2 | regex re-implemented locally |
| p102-final-qa.spec.ts | 211 | 22 | 24 | low |
| p104-seed-smoke.spec.ts | 196 | 12 | 4 | medium (JSON.parse fixture; CHECK-enum compare) |

**P76 anomaly:** zero `test(` calls. The file is structurally a placeholder. P76 / OC-9 (Spec Export Quality) seal claim is unverified by tests at this anchor.

---

## Cumulative count truth-up

| Metric | Value |
|---|---|
| Literal `test(` (top-level + indented) across `tests/**/*.spec.ts` | **1,952** |
| Literal `it(` cases | 24 |
| `test.skip(...)` (whole-test skip with no condition) | 42 |
| Conditional `test.skip(true, ...)` inside running tests (soft-pass-after-bootstrap) | 45 |
| **Net "actually runs" upper bound** | **1,952 - 42 = 1,910** |
| **Net "asserts something behavioral" estimate** | **~250–300** (only 26 specs do `page.goto`; recent specs are pure-text grep) |

**CLAUDE.md anchor claim:** *"Cumulative regression at this anchor: P101 (25) + P102 (22) + P-E2E-2 (22) + P104 (12) = 81 GREEN (≥79 target)"* — the **81** number is the CHANGE since prior anchor. The historical headline `~1335+` is a CUMULATIVE-since-baseline figure and is plausibly within counting error of the 1,952 literal grep, but the literal grep includes:
- 95 cases inside `tests/e2e/` legacy phase11/12/13/15 specs that are not in the rolling regression suite
- ~50+ duplicates from p33-fix-pass / p34-fix-pass / p35-fix-pass / p36-fix-pass (4 fix-pass spec files exist)
- ~120 cases in the prompt-library matrices that compile a corpus rather than verify behavior

**Honest "behavioral runtime regression" count:** likely **<400** of the 1,952. The rest are file-shape / regex / EOP-triplet existence asserts.

---

## Coverage gaps — ranked

### D1 — `cleanTranscript` (P100 W2 FMT-VERIFY ADR-127) has zero behavioral coverage

- **Severity:** P1 (trust-breaking — ADR-127 D3 names this as a closure of dead-code state)
- **Where:** `src/contexts/intelligence/stt/transcriptCleanup.ts` (44 LOC) wired at `chatPipeline.ts:327` for `opts.source === 'listen'`
- **What:** `cleanTranscript()` is invoked pre-submit but no test exercises a listen-source utterance with disfluencies and asserts the cleaned form. The only test (`p100-w2-fmtverify.spec.ts:160`) is `existsSync(TRANSCRIPT_CLEANUP)`
- **Evidence:** `grep -rnE 'cleanTranscript' tests/*.spec.ts` returns the single file existence check — no `expect(cleanTranscript('um like uh hello')).toBe(...)`
- **Fix LOC est:** ~30 LOC unit spec with 5–8 cleanup-pattern cases

### D2 — Atom helpers `isUnmeasurableGoal` + `hasContradiction` regex-only

- **Severity:** P2 (helpers wired at `chatPipeline.ts:396-397` but coverage is "import the literal regex into chatPipeline")
- **Where:** `intentAtom.ts:197` exports `UNMEASURABLE_GOAL_RE`; `decompAtom.ts:284` exports `CONTRADICTION_RE`
- **What:** `p100-w2-comprehensive-logs.spec.ts:260-274` only checks `/UNMEASURABLE_GOAL_RE|isUnmeasurableGoal/.test(srcFile)`. `p100-w2-fmtverify.spec.ts:151-158` checks chatPipeline source contains the IDENTIFIER `hasContradiction`. Neither calls the function with a sample input
- **Evidence:** ADR-127 D3 claim "consulted at chatPipeline submit + emitted as flags" is verified at the import-and-call-site level only
- **Fix LOC est:** ~40 LOC table-driven test (positive + negative cases per regex)

### D3 — `validateEventType` / `validateSectionType` (P104 SCHEMA-GUARDS) — runtime invocation never tested

- **Severity:** P1 (P104 is the most recent seal; tests are still source-grep only)
- **Where:** `src/contexts/persistence/repositories/comprehensiveLogs.ts` (validateEventType); `src/lib/schemas/section.ts` (validateSectionType)
- **What:** P104 spec file `tests/p104-seed-smoke.spec.ts:137-167` checks `expect(src).toMatch(/export\s+function\s+validateEventType\s*\(/)` and `expect(src).toMatch(/validateEventType\s*\(\s*event\.eventType\s*\)/)`. The fixture round-trip (e2e2-seed.json against migration CHECK enum) is a re-implementation of the same allow-list in TypeScript, NOT calling the validator
- **Evidence:** spec line 137-167; allow-list at line 24-40 mirrors migration CHECK enum but never imports the validator
- **Fix LOC est:** ~50 LOC; import VALID_LOG_EVENT_TYPES + validateEventType + assert remap behavior + drop-invalid-rows behavior

### D4 — Mobile viewport coverage = zero runs

- **Severity:** P1 (ADR-090, ADR-091, ADR-112 + ADR-113 all promise 375/390/428 readability; live measurement is "owner post-RC task")
- **Where:** `playwright.config.ts:20` — single project `chromium` with `Desktop Chrome` device
- **What:** `grep '375|390|428' tests/*.spec.ts` returns 4 files but inspection shows: (a) `p67b-close-the-gap.spec.ts` does `expect(src).toContain('375px')` against the audit doc — not a render test; (b) `p65-oc25-design-tokens.spec.ts` matches `0.375rem` token; (c) `system-review-screenshots.spec.ts:line` uses `test.use({ viewport: { width: 375, height: 812 } })` for screenshots only — and that file is `.spec.ts` but contains no behavioral asserts; (d) `llm-adapter.spec.ts` matches `0.375` numerically (cost calc)
- **Evidence:** zero `projects:` entries for Pixel/iPhone in `playwright.config.ts`
- **Fix LOC est:** ~10 LOC config + ~80 LOC of touch-target + reflow asserts on 4–5 critical surfaces

### D5 — Live-LLM smoke (CF#4) — no automated harness exists

- **Severity:** P2 by design (owner-gated per ADR-131 + ADR-133); P1 from a "we don't know if v2.0.0-RC1 actually talks to Claude/Gemini/OpenRouter" angle
- **Where:** `tests/llm-adapter.spec.ts` is the only candidate. It uses cost-calc unit tests; no live network call
- **What:** `docs/launch/owner-launch-checklist.md:10-12` names "BYOK smoke test — 5 prompts × 3 providers; budget ~$0.05" as `[ ]` open. No CI-skipped gated harness exists. The ADR-131 5-LIVE-LLM-divergence-risk register is not test-backed
- **Evidence:** `grep -rE 'process\.env\..*(API|KEY|TOKEN)|VITE_' tests/*.spec.ts` returns 3 specs (p18-step3-cap-edges, p89-tier2-foundation, p89b-supabase-cleanup) — none invoke a live provider
- **Fix LOC est:** ~150 LOC env-gated harness + 5 prompts × 3 providers + cost-cap assertion; can ship as `tests/livellm/*.spec.ts` excluded from default project

### D6 — STT smoke (CF#5) — no microphone test path

- **Severity:** P2 (owner-gated like CF#4)
- **Where:** Web Speech API behind `webkitSpeechRecognition` (P19 spec set: p19-step1/2/3-edges)
- **What:** `tests/p19-step1.spec.ts` to `p19-step3-edges.spec.ts` are the most recent listen-mode tests, dated Phase 19 (long pre-RC). `cleanTranscript` (P100 W2) added LATER and has its own gap (D1). No fixture-driven cleanTranscript→pipeline integration spec exists
- **Evidence:** `grep -lE 'cleanTranscript' tests/*.spec.ts` returns empty (only the existsSync check in p100-w2-fmtverify)
- **Fix LOC est:** ~80 LOC; mock Web Speech recognition events + drive cleanTranscript + assert chatPipeline emit

### D7 — `tests/p76-spec-export-quality.spec.ts` is empty (0 cases)

- **Severity:** P1 (P76 / OC-9 ADR-101 seal claim is unverified — silent failure mode)
- **Where:** `tests/p76-spec-export-quality.spec.ts`
- **What:** `grep -cE "^\s*test\(" tests/p76-spec-export-quality.spec.ts` returns **0**. Only 2 `existsSync` calls. Spec exists as a placeholder
- **Evidence:** above grep; CLAUDE.md anchor claims `~10 P76 OC-9 Spec Export Quality` — not present in this file
- **Fix LOC est:** spec covering ADR-101's 4 standards: canonical export modal CTAs / valid HTML5 / versioned AISP filenames / ≥3-heading spec generators ≈ 80 LOC

### D8 — Persona scores are doc-grep, not behavior-derived

- **Severity:** P2 (UX claim severity)
- **Where:** `tests/p102-final-qa.spec.ts:179-194`
- **What:** `expect(src).toMatch(/Grandma/)` + `(scores.length ≥ 3 where score ≥ 85)`. Test passes if the markdown file contains the string "Grandma" and three `\b(8[5-9]|9[0-9]|100)/100\b` patterns. ADR-132 §3 acceptance gate ("composite ≥85, 0/3 floor breaches") is verified by counting integers in a markdown file — there is NO mechanism that ties any of the score values to runtime measurements (no Lighthouse run, no axe-core run, no usability fixture)
- **Evidence:** test source lines 175–195 above; rescore markdown is hand-authored
- **Fix LOC est:** structurally hard — would require automated persona simulation. Honest documentation-fix: add NOTE in spec that this verifies file shape only

### D9 — `p101-verb-classifier.spec.ts` re-implements regex locally instead of importing classifier

- **Severity:** P2 (drift risk — if `intentClassifier.ts` regex narrows, test still passes)
- **Where:** `tests/p101-verb-classifier.spec.ts:38-40`
- **What:** the spec defines `const FORGET_RE = /\bforget\b/i` LOCALLY and asserts against this local regex, then separately greps the source file for the substring `\\bforget\\b`. If source flips word-boundary or adds negative-lookbehind, both checks pass while behavior diverges
- **Evidence:** lines 38-40 explicit comment: *"We replicate them locally for word-boundary correctness asserts to avoid pulling in the runtime module."*
- **Fix LOC est:** ~20 LOC; replace local regex with `import { classifyIntent } from '@/contexts/intelligence/aisp/intentClassifier'`

### D10 — P101 "7-step e2e smoke" is regex-against-source, not e2e

- **Severity:** P1 (the file NAME implies e2e; the BEHAVIOR is grep)
- **Where:** `tests/p101-7step-e2e-smoke.spec.ts`
- **What:** Header says *"Verifies the 7-step methodology fires end-to-end"* but every test body is `expect(src).toMatch(/.../)`. There is no orchestration that fires Step 1→7 and observes side effects. The "smoke" misnamer is a discipline failure
- **Evidence:** `grep -nE 'page\.|browser|sql\.js|getDB' tests/p101-7step-e2e-smoke.spec.ts` returns nothing meaningful
- **Fix LOC est:** rename to `p101-7step-source-presence.spec.ts` (5 LOC) OR build real e2e (~250 LOC)

### D11 — `writeLogEvent` runtime never sql-asserted

- **Severity:** P1 (ADR-126 + ADR-127 + ADR-130 all hinge on persistence side-effects; tests verify call-site presence not row-write)
- **Where:** `chatPipeline.ts` has 7 `emit() → writeLogEvent` sites. Tests grep for `'writeLogEvent'` substring count
- **What:** P100 W2 spec at line 197 asserts `countMatches(s, 'writeLogEvent') ≥ 3`. Nothing opens an in-memory sql.js DB, runs the pipeline, and queries `SELECT * FROM log_events`
- **Evidence:** P104 P100W2 spec lines; `grep -lE 'sql\.js|getDB' tests/*.spec.ts` shows tests reference sql.js in COMMENTS ("PURE-UNIT (no sql.js boot)") not code
- **Fix LOC est:** ~120 LOC sql.js bootstrap fixture + 3 scenario re-runs + row-count + redaction shape asserts

### D12 — Crystal Atoms (PROCESS / DDD / AGENT) — 5 specs, zero call-site behavior tests

- **Severity:** P2 (atoms are pure modules; LLM-pathed enrichment deferred)
- **Where:** `tests/p92-process-atom.spec.ts` / p93-ddd-atom / p94-agent-atom — all assert source file shape
- **What:** Of 5 spec files referencing `classifyAgents|agentAtom|AGENT_ATOM` (p101-rc, p101-7step, p97, p94, p95), none call `classifyAgents(waveCtx)` and assert the returned `AgentSpec[]` is non-empty / has disjoint ownedFiles. Same for `classifyProcess` and `classifyContexts`
- **Evidence:** `grep -nE "from '@/contexts/intelligence/aisp/agentAtom'" tests/*.spec.ts` returns 0
- **Fix LOC est:** ~60 LOC per atom × 3 atoms = 180 LOC (pure transformations easy to test)

### D13 — Soft-pass guard creep — average 7.9 existsSync per spec; 44 in P100W2

- **Severity:** P2 (drift indicator; guards are cheap to add and never removed)
- **Where:** sorted list at top of report
- **What:** P100W2 has 44 existsSync calls across 30 cases (1.5×). P74-decomp-and-highlights has 35 over 30 cases (1.2×). The pattern is **"soft-pass-when-deferred"** — A_n surfaces that haven't shipped yet still let the spec go GREEN. This was justified at A1/A4/A7 dispatch boundaries but never retired post-seal
- **Evidence:** existsSync count vs case count above
- **Fix LOC est:** systematic retire — for each sealed phase, demote `if (!existsSync(X)) return` to `expect(existsSync(X)).toBe(true)` in a fix-pass

### D14 — Fixtures vs runtime — fixtures only loaded as JSON, never replayed against real DB

- **Severity:** P2 (E2E-TEST claim "end-to-end via simulated AgentProxy" depends on this)
- **Where:** `tests/fixtures/scenario-{1,2,3,4}-*.json` (4 scenario fixtures from P100 W2)
- **What:** `tests/fixtures/scenario-1-axon-cli.ts` exists as a TS scenario script, but the `tests/p100-w2-comprehensive-logs.spec.ts` does NOT execute it. The fixture JSONs are emitted by hand. The 35-row e2e2-seed.json is loaded with `JSON.parse` and grep'd against an inline allow-list. Never `INSERT`'d into an actual table
- **Evidence:** P104 + P100W2 spec source; no `.exec(insertSql)` in any spec
- **Fix LOC est:** ~100 LOC sql.js bootstrap + replay harness covering all 4 scenarios

### D15 — `useChatStore` / `useUIStore` / pipeline integration tests are ALL pre-P56

- **Severity:** P3 (older stores still tested; new state slices like `activePageId` only file-grep tested)
- **Where:** Only 5 specs touch the actual stores: p36-fix-pass, p36-listen-enhanced, p37-carryforward, p54-speed-visible, p79-page-aware-pipeline
- **What:** `useChatStore`/`useUIStore` are referenced post-P55 only via source-grep. P78's `addPage`/`removePage`/`renamePage` actions verified by `expect(src).toContain('addPage')` not by Zustand-state assertion
- **Evidence:** `grep -lE 'useChatStore|useUIStore|chatPipeline\.submit|writeLogEvent\(' tests/*.spec.ts` returns 5 specs, latest is p79
- **Fix LOC est:** Zustand store unit tests are cheap — ~40 LOC per slice

---

## Soft-pass guard analysis

**Total `existsSync` across spec files:** 1,038 across 131 files (avg 7.9)

**Highest soft-pass concentration (likely all-pass-even-if-surface-deleted):**

| Spec | existsSync | cases | Ratio | Verdict |
|---|---|---|---|---|
| p100-w2-comprehensive-logs.spec.ts | 44 | 30 | 1.47 | Each existsSync gates ≈1.5 cases — high soft-pass risk |
| p74-decomp-and-highlights.spec.ts | 35 | 30 | 1.17 | Similar |
| p95-spec-workbench.spec.ts | 34 | 17 | 2.00 | Every case has a corresponding guard — ALL would soft-pass if SpecWorkbench.tsx deleted |
| p89-tier2-foundation.spec.ts | 32 | 19 | 1.68 | Same risk; offset by the BYOK denylist hard-gate |
| p99-seal-panel.spec.ts | 31 | 18 | 1.72 | A7 SealPanel is gated; only ADR + EOP triplet are hard |
| p83-aisp-adoption.spec.ts | 31 | 16 | 1.94 | High soft-pass |

**Pattern observation:** The seal discipline was *"hard-gate on closer-owned ADR + EOP triplet; soft-pass on upstream agent surfaces."* This was correct at dispatch time (A_n could timing-slip). It is INCORRECT at post-seal — those surfaces shipped, the soft-pass should be retired. Of ~1,038 existsSync calls across the 131 spec files, an estimated **~600** are post-seal soft-pass guards that no longer protect against timing-slip but DO protect against accidental file deletion.

**The 45 conditional `test.skip(true, ...)` calls** are even softer — they don't fail, they don't pass, they vanish from the GREEN count entirely.

---

## Persona scoring honest verification

Tracing each P102 persona claim from `plans/implementation/phase-102/seal/persona-rescore.md` to test-evidence:

| Persona | Claimed | Test enforcement | Backing evidence |
|---|---|---|---|
| Grandma | 86/100 | `p102-final-qa.spec.ts:186-194` regex `\b(8[5-9]|9[0-9]|100)/100\b` count ≥3 | **None runtime.** Backed by `grep -c "#[0-9a-fA-F]\{6\}" Welcome.tsx → 0` (file shape, not a Grandma persona simulation) |
| Framer | 86/100 | Same regex test | **None runtime.** Backed by token-count claim ("18→22 mode-independent values") — verified by `grep` on `index.css` |
| Lars | 88/100 | Same regex test | **None runtime.** Backed by `grep -nE 'process_atom_output' Agentics.tsx` — file-shape proxy for "live-wire works" |

**Verdict:** Persona scores in P102 (and P101 floors) are not test-enforced beyond "the markdown file mentions the persona name and contains a number ≥85". The composite 86.7 / 0-floor-breaches gate is **a documentation contract**, not a behavior contract.

Honest reading of `04-brutal-review.md`:
- All 4 reviewers (R1 UX / R2 Functionality / R3 Security / R4 Architecture) returned **PASS** with **0 blockers**
- R1 explicitly says *"CAVEAT — No browser render verification. This review scored from CSS diff + JSX structure only. Live render at 375/390/428px viewports is owner post-RC task."*
- R2 functionality trace is paper-only ("`getDB().prepare(SELECT ...)` returns the most recent row" — VERIFIED via reading the line of code, not running it)
- R3 BYOK security: real `grep -nE "sk-[A-Za-z0-9]"` against source files — this IS a behavioral check, but only on source, not on emitted log_events at runtime
- R4 architecture: LOC caps + dependency-set check — these ARE genuine static checks

**Honest persona-rescore status:** the +2/+2/+3 deltas are owner-attested and reviewer-attested. They are NOT test-attested. CLAUDE.md's *"persona floors all cleared"* claim is a paper claim until live-render + live-LLM smoke run.

---

## Live-LLM / STT smoke status

### Live-LLM (CF#4)

**Status:** No automated coverage. `docs/launch/owner-launch-checklist.md:10-11`:

> - [ ] BYOK smoke test — 5 prompts × 3 providers (Claude / Gemini / OpenRouter); budget ~$0.05
> - [ ] Verify CF#4 — schema rejection / latency / Crystal Atom compliance / cost cap with real Haiku

**Blocker for what:** ADR-131 §1 5-LIVE-LLM-divergence risks register depends on this; ADR-127 §A "AgentProxy response shape MATCHES Zod schema for happy path" is bench-tested only against fixtures (`scenario-{1..4}-*-final.json`). Until owner runs CF#4, the v2.0.0-RC1 launch claim "BYOK works" is unverified.

**Recommendation:** Build env-gated `tests/livellm/byok-smoke.spec.ts` that runs only when `VITE_LIVE_LLM_KEY` is set in CI. ~150 LOC.

### STT (CF#5)

**Status:** No automated coverage beyond `cleanTranscript` existsSync. P19 specs (p19-step1/2/3-edges) cover Web Speech bootstrap but predate ADR-127's `cleanTranscript` module.

**Blocker for what:** ADR-127 D3 "NEW `cleanTranscript` module called from listen-capture pre-submit" is verified at the IMPORT level only. Real-microphone-driven cleanup quality is owner post-RC.

**Recommendation:** Mock-Web-Speech fixture spec + cleanTranscript unit table. ~80 LOC.

---

## Carry-forward registry (Track D perspective)

| ID | Description | Severity | Owner |
|---|---|---|---|
| TD-CF-1 | `cleanTranscript` no behavioral coverage (D1) | P1 | runtime-fix |
| TD-CF-2 | `validateEventType`/`validateSectionType` not invoked at runtime (D3) | P1 | runtime-fix |
| TD-CF-3 | `p76-spec-export-quality.spec.ts` is empty (D7) | P1 | content-fix |
| TD-CF-4 | Mobile viewport 0 runs (D4) | P1 | playwright config |
| TD-CF-5 | "P101 7-step e2e smoke" misnamed (D10) | P1 | rename or rebuild |
| TD-CF-6 | Live-LLM smoke harness missing (D5) | P2/owner | env-gated CI |
| TD-CF-7 | STT/cleanTranscript integration missing (D6) | P2/owner | mock-WebSpeech |
| TD-CF-8 | `writeLogEvent` runtime never sql-asserted (D11) | P1 | sql.js fixture |
| TD-CF-9 | Crystal Atom call-site behavior tests missing (D12) | P2 | unit specs |
| TD-CF-10 | Soft-pass guard creep — ~600 obsolete (D13) | P2 | systematic prune |
| TD-CF-11 | Atom helper regex coverage incomplete (D2) | P2 | unit specs |
| TD-CF-12 | Persona scoring not behavior-tied (D8) | P2 | document-or-fix |
| TD-CF-13 | Verb classifier regex re-implemented (D9) | P2 | import-and-call |
| TD-CF-14 | Fixtures never replayed against DB (D14) | P2 | replay harness |
| TD-CF-15 | Store-state integration tests stop at P79 (D15) | P3 | Zustand specs |

---

## Honest declaration

This audit is static-only. No tests were executed. The literal `test(` count of 1,952 is verifiable via `grep -rE "^\s*(test|it)\(" tests/ --include='*.spec.ts' | wc -l` from `cwd=/home/user/hey-bradley-core`.

The qualitative claim that ~85% of post-P75 tests are pure-text-grep against source files is supported by:
- `grep -lE "from '@/" tests/*.spec.ts` returns 3 files
- `grep -lE "from '\.\." tests/*.spec.ts` returns 23 files
- 131 - 26 (page.goto specs) = 105 specs that bootstrap nothing

The claim that persona scoring is not behavior-tied is supported by direct inspection of `tests/p102-final-qa.spec.ts:186-194` against `plans/implementation/phase-102/seal/persona-rescore.md`.

Live-LLM (CF#4) and STT (CF#5) are owner-required per `docs/launch/owner-launch-checklist.md` and ADR-131 §3 / ADR-133 §4 — this is honestly named in the codebase. Track D notes them as test-suite gaps, not codebase-honesty gaps.

The seal-gate ratchet is doing its job for KISS + ADR + EOP-triplet enforcement. It is NOT doing the job of catching runtime regressions — that job is owner-attested ("ran a seed; saw lights blink") at the velocity tier this codebase ships at. Honest naming of the gap is the deliverable.

**End of Track D.**
