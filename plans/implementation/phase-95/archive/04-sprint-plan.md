# P95 / Planning Sprint A5 — Sprint plan + EOP template (FINAL)

> **Phase:** P95 · **Sprint:** Planning Wave 1 · **Agent:** A5 (sprint plan + EOP template — FINAL of 5-agent chain)
> **Date:** 2026-05-02 · **READ-ONLY** doc artifact (no source / test / ADR / CLAUDE.md edits).
> **Owned file:** `plans/implementation/phase-95/04-sprint-plan.md`
> **Sibling chain:** A1 (sealed `00-understanding.md`) · A2 (sealed `01-decomposition.md`) · A3 (sealed `02-ddd-adr-plan.md`) · A4 (sealed `03-process-map.md`) · A5 (this doc).

Inputs consumed: `phase-95/00-understanding.md` (§§3-4-6-7), `phase-95/01-decomposition.md` (§§2-4-5-6-7), `phase-95/02-ddd-adr-plan.md` (§§3-5-6-7-8), `phase-95/03-process-map.md` (§§3-4-5-6-7).

---

## §1 Methodology

- **Per-phase formal plan** mirrors `phase-N/preflight/00-summary.md` format used since P15: predecessor / cross-refs / status / contexts / preflight / agent roster / wave structure / TDD / KISS / log / DoD / wall-clock.
- **TDD-first contract:** test cases BEFORE implementation. Each TC cites AISP Γ rule (from A4 §4). Target 5-8 TCs per active phase × 6 active ⇒ 30-50 cumulative in §3.
- **KISS review** (§4): one canonical form applied at every seal; codifies A2 §6 / A3 §7 strikes as anti-regress denylist.
- **Log entries** (§5): A4 §6 ruvector + A1 P100 W2 design. **Retrospective** (§6): 4-section Keep/Drop/Reframe/Carry-forward + velocity note.
- **BLOCKED phases (per A1 §6 Q1-Q7):** formal-plan shape only; atomic detail withheld until owner resolves.

---

## §2 Per-phase formal plans

### Phase P95 — SpecWorkbench (AISP + human-spec dual-view)

- **Predecessor:** P94 sealed; AGENT_ATOM types `AgentSpec`/`AgentAtomOutput` importable from `agentAtom.ts:31/42`.
- **Cross-refs:** ADR-121 (NEW); ADR-110, ADR-116, ADR-120, ADR-091, ADR-090.
- **Status:** BLOCKED on Q1 (layout A/B/C) + Q6 (recipe depth — gates P94b precondition).
- **Bounded contexts:** ui-shell + intelligence + specification + planning (A3 §3).

**Preflight:** Q1 resolved (rec C); Q6 resolved (rec B → spawn P94b first); P94 cumulative ≥1162 GREEN; both tsc strict configs clean; file-conflict map confirmed (`Planning.tsx` Wave 2 only).

**Agent roster (per A4 §3+§5):**
- P95-A1 specComposer: `src/contexts/intelligence/aisp/specComposer.ts` (NEW; ≤300 LOC); Σ block A4 §4 P95-A1
- P95-A2 SpecWorkbench shell: `src/components/spec/SpecWorkbench.tsx` (NEW; ≤300 LOC); Σ block P95-A2
- P95-A3 AtomCard + Planning wire: `src/components/spec/AtomCard.tsx` (NEW; ≤120 LOC) + `src/pages/Planning.tsx` (EDIT)
- P95-A4 ADR + tests skeleton: `docs/adr/ADR-121-spec-workbench.md` + `tests/p95-spec-workbench.spec.ts` skeleton + EOP starter
- P95-A5 closer: tests fill + CLAUDE.md sync + EOP finalize

**Wave structure:** W1 parallel (A1+A2+A4 file-disjoint); W2 sequential (A3 → A5).

**TDD requirements (BEFORE implementation; cite Γ rule):**
- TC1 `composer-emits-8-atoms` — Γ R3 (SpecBundle.atoms.length === 8)
- TC2 `composer-zero-classify-import` — Γ R2 (KISS denylist)
- TC3 `dual-view-side-by-side-desktop` — Γ R1 (≥768px)
- TC4 `mobile-collapses-to-toggle` — Γ R2 (<768px fallback)
- TC5 `atom-card-shows-sigma-symbol` — AtomCard Γ R1
- TC6 `atom-card-keyboard-accessible` — AtomCard Γ R3 (Enter/Space)
- TC7 `aria-tablist-on-view-toggle` — SpecWorkbench Γ R3 + ADR-091

**Optimization (per §4):** all §4 items pass; A2 §6 P95-T7 atom search box NOT regressed.

**Log entries:** ruvector category "agentic-workbench-ui"; tags P95+ADR-121+dual-view+AISP-visibility; CLAUDE.md NOTE-FOR-NEXT to P96; EOP triplet at `plans/implementation/phase-95/`.

**Gate (DoD per A4 §7):** 7 TCs GREEN; ADR-121 Accepted; both tsc clean; EOP triplet shipped; CLAUDE.md sync (ADRs 120→121); cumulative regression ≥1162+15 GREEN.

**Estimated wall-clock:** 30-45 min.

---

### Phase P96 — Export Claude Code (CLAUDE.md + swarm + ADR bundle)

- **Predecessor:** P95 sealed (Export reads SpecBundle).
- **Cross-refs:** ADR-122 (NEW); ADR-101, ADR-108, ADR-120, ADR-082.
- **Status:** BLOCKED on Q2 (export target A=ZIP / B=in-page / C=fs-write).
- **Bounded contexts:** specification + intelligence + ui-shell + planning.

**Preflight:** Q2 resolved (rec A — ZIP via Blob, mirrors P78); P95 SEALED; cumulative ≥1177 GREEN; both tsc clean; file-conflict map confirmed (`Planning.tsx` W2 only AFTER P95).

**Agent roster:**
- P96-A1 claudeCodeBundle: `src/contexts/intelligence/export/claudeCodeBundle.ts` (NEW; ≤250 LOC); Σ block P96-A1
- P96-A2 zipBuilder: `src/contexts/intelligence/export/zipBuilder.ts` (NEW; ≤120 LOC); Σ block P96-A2
- P96-A3 golden fixture + ADR: `examples/3rd-party-consumer/golden-bundle/` + `docs/adr/ADR-122-export-claude-code.md`
- P96-A4 tests skeleton: `tests/p96-export-roundtrip.spec.ts` skeleton + EOP starter
- P96-A5 ExportButton + Planning wire: `src/components/spec/ExportClaudeCodeButton.tsx` (NEW; ≤80 LOC) + `src/pages/Planning.tsx` (EDIT)
- P96-A6 closer: tests fill + CLAUDE.md sync + EOP finalize

**Wave structure:** W1 parallel (A1+A2+A3+A4); W2 sequential (A5 → A6).

**TDD requirements:**
- TC1 `golden-file-equality` — Γ R1 (bundle = fixture)
- TC2 `hello-world-agent-dispatch` — Γ R1 (5-line agent runs)
- TC3 `swarm-json-one-entry-per-agentspec` — Γ R3
- TC4 `claude-md-auto-generated` — Γ R4
- TC5 `adr-stub-cross-refs-source-adrs` — Γ R2
- TC6 `zip-mime-type` — zipBuilder Γ R1
- TC7 `zip-roundtrip-extract-equals-original` — zipBuilder Γ R3
- TC8 `no-new-deps-in-package-json` — zipBuilder Γ R4 + KISS

**Optimization:** §4 pass; A2 §6 strike #2 (versioning UI) + #9 (in-page render if Q2=A) NOT regressed.

**Log entries:** ruvector "agentic-workbench-export"; tags P96+ADR-122+export+golden-fixture; EOP triplet `phase-96/`.

**Gate:** 8 TCs GREEN; ADR-122 Accepted; golden fixture present; tsc clean; EOP shipped; CLAUDE.md sync (121→122); cumulative ≥1177+15 GREEN.

**Estimated wall-clock:** 45-60 min.

---

### Phase P97 — TDD Scaffold Generator

- **Predecessor:** P94 sealed (DoD drives test bullets).
- **Cross-refs:** ADR-123 (NEW); ADR-083, ADR-120, ADR-099.
- **Status:** READY (no Q-gate).
- **Bounded contexts:** intelligence + filesystem (build-time only).

**Preflight:** P94 cumulative GREEN; tsc clean; file-conflict map confirmed (`vitest.config.ts` single touch by P97-A3).

**Agent roster:**
- P97-A1 tddScaffold: `src/contexts/intelligence/scaffold/tddScaffold.ts` (NEW; ≤200 LOC); Σ block P97-A1
- P97-A2 scaffoldWriter: `src/contexts/intelligence/scaffold/scaffoldWriter.ts` (NEW; ≤80 LOC) + `tests/scaffold/.gitkeep` + `tests/scaffold/README.md`
- P97-A3 ADR + vitest config: `docs/adr/ADR-123-tdd-scaffold.md` + `vitest.config.ts` (EDIT)
- P97-A4 tests + closer: `tests/p97-tdd-scaffold.spec.ts` + EOP + CLAUDE.md sync

**Wave structure:** W1 parallel (A1+A2+A3+A4 all file-disjoint).

**TDD requirements:**
- TC1 `scaffold-namespace-isolation` — Γ R1
- TC2 `existsSync-no-overwrite-on-second-emit` — Γ R2
- TC3 `eight-atom-scaffold-coverage` — Γ R3
- TC4 `ci-excludes-scaffold-namespace` — Γ R4
- TC5 `playwright-describe-per-gamma-rule` — Ω contract
- TC6 `it-block-per-dod-bullet` — Ω contract
- TC7 `vitest-config-exclude-present` — P97-A3 edit

**Optimization:** §4 pass; A2 §6 strike #3 (preview UI) NOT introduced.

**Log entries:** ruvector "agentic-workbench-tdd"; tags P97+ADR-123+scaffold+namespace-isolation; EOP `phase-97/`.

**Gate:** 7 TCs GREEN; ADR-123 Accepted; namespace isolation verified; tsc clean; EOP shipped; CLAUDE.md sync (122→123); cumulative ≥1192+10 GREEN.

**Estimated wall-clock:** 30-45 min.

---

### Phase P98 — KISS + Review Pattern

- **Predecessor:** P94 sealed (`AgentSpec` is reviewer scoping unit).
- **Cross-refs:** ADR-124 (NEW); ADR-094, ADR-095, ADR-110, ADR-120, ADR-073 (conditional conflict if Q3=C).
- **Status:** BLOCKED on Q3 (A=chat / B=Agentics tab / C=persona).
- **Bounded contexts:** intelligence + ui-shell + (conditional agentics if Q3=B).

**Preflight:** Q3 resolved (rec B); if Q3=C → ADR-073 amendment authored (A3 §8); P94 cumulative GREEN; tsc clean; file-conflict map confirmed (Agentics.tsx — Q3=B branch dispatches AFTER P99).

**Agent roster:**
- P98-A1 reviewerPrompt: `src/contexts/intelligence/review/reviewerPrompt.ts` (NEW; ≤180 LOC); Σ block P98-A1
- P98-A2 reviewerSchema + ADR: `src/contexts/intelligence/review/reviewerSchema.ts` (NEW; ≤60 LOC) + `docs/adr/ADR-124-kiss-reviewer.md`
- P98-A3 tests + render surface + closer: `tests/p98-kiss-reviewer.spec.ts` + Q3-conditional surface + EOP

**Wave structure:** W1 parallel (A1+A2+A3 file-disjoint).

**TDD requirements:**
- TC1 `scope-guard-rejects-paths-outside-ownedFiles` — Γ R1 (Σ-as-ACL)
- TC2 `findings-zod-schema-validates` — Γ R2
- TC3 `severity-enum-blocker-major-minor` — Γ R3
- TC4 `prompt-cap-4096-chars` — Γ R4
- TC5 `prompt-injection-mitigation-via-sigma-scoping` — Σ scoping
- TC6 `findings-render-surface-per-Q3` — Λ channel (conditional)

**Optimization:** §4 pass; A2 §6 strike #4 (reviewer-history viewer) NOT introduced.

**Log entries:** ruvector "agentic-workbench-review"; tags P98+ADR-124+reviewer+scope-guard; EOP `phase-98/`.

**Gate:** 6 TCs GREEN; ADR-124 Accepted; scope guard verified; Zod validates; tsc clean; EOP shipped; CLAUDE.md sync (123→124); (cond Q3=C) ADR-073 amendment; cumulative ≥1202+12 GREEN.

**Estimated wall-clock:** 30-45 min.

---

### Phase P99 — Seal Panel (DoD + session log + retro UI)

- **Predecessor:** P94 sealed (`AgentSpec.dod` drives checklist rows).
- **Cross-refs:** ADR-125 (NEW); ADR-116, ADR-120, ADR-094; CLAUDE.md "Standard Phase Process" §2-4.
- **Status:** READY (no Q-gate).
- **Bounded contexts:** agentics + intelligence + ui-shell.

**Preflight:** P94 cumulative GREEN; tsc clean; file-conflict map confirmed (`Agentics.tsx` — P99-A3 sole touch).

**Agent roster:**
- P99-A1 SealPanel.tsx: `src/components/seal/SealPanel.tsx` (NEW; ≤250 LOC); Σ block P99-A1
- P99-A2 markdownEmitter + fileWriter: `src/contexts/intelligence/seal/markdownEmitter.ts` (NEW; ≤180 LOC) + `seal/fileWriter.ts` (NEW; ≤80 LOC); Σ block P99-A2
- P99-A3 Agentics wire + ADR: `src/pages/Agentics.tsx` (EDIT — mount + retire `:19` badge per A1 §7) + `docs/adr/ADR-125-seal-panel.md`
- P99-A4 tests + closer: `tests/p99-seal-panel.spec.ts` + EOP + CLAUDE.md sync

**Wave structure:** W1 parallel (A1+A2+A3+A4 file-disjoint).

**TDD requirements:**
- TC1 `dod-row-count-equals-agentspec-dod-length` — Γ R2
- TC2 `existsSync-no-overwrite-on-session-log-write` — Γ R2 (markdownEmitter)
- TC3 `markdown-diffability-deterministic-ordering` — Γ R3
- TC4 `seal-panel-mounted-in-agentics-only` — Γ R4 (NOT Whiteboard/Planning)
- TC5 `coming-soon-badge-retired` — A1 §7 honest declaration
- TC6 `dod-rows-canonical-order-no-ui-reorder` — A2 §6 strike #5 DDD-mandatory
- TC7 `append-only-on-existing-files` — Γ R3 (fileWriter)

**Optimization:** §4 pass; A2 §6 strike #5 (drag-reorder DoD) NOT introduced (DDD-mandatory per A3 §7).

**Log entries:** ruvector "agentic-workbench-seal"; tags P99+ADR-125+seal-panel+agentics-mode; EOP `phase-99/`.

**Gate:** 7 TCs GREEN; ADR-125 Accepted; "Coming soon" badge retired from `Agentics.tsx:19`; existsSync verified; tsc clean; EOP shipped; CLAUDE.md sync (124→125); cumulative ≥1214+12 GREEN.

**Estimated wall-clock:** 30-45 min.

---

### Phase P101 — Agentic Workbench RC (full three-mode seal)

- **Predecessor:** P95 ∧ P96 ∧ P97 ∧ P98 ∧ P99 ∧ P100/W2 ALL SEALED.
- **Cross-refs:** ADR-127 (NEW); ADR-094, ADR-116, ADR-109, ADR-110, ADR-126.
- **Status:** BLOCKED on Q5 (A=all-on / B=VITE flag / C=Settings hide).
- **Bounded contexts:** ALL 6 (full system seal).

**Preflight:** Q5 resolved (rec A — matches ADR-116 already-shipped routes); all body sprints P95-P100W2 SEALED green; cumulative ≥1226+ GREEN; tsc clean; file-conflict map confirmed (W1 = 4 disjoint review docs).

**Agent roster:**
- P101-A1 UX reviewer: `plans/implementation/phase-101/reviews/ux-review.md` (NEW; ≤600 LOC); Σ block P101-A1
- P101-A2 Functionality reviewer: `phase-101/reviews/functionality-review.md` (≤600 LOC)
- P101-A3 Security reviewer: `phase-101/reviews/security-review.md` (≤600 LOC)
- P101-A4 Architecture reviewer: `phase-101/reviews/architecture-review.md` (≤600 LOC)
- P101-A5 fix-pass + ADR + closer: recursive ≤3 fix-pass + `docs/adr/ADR-127-agentic-workbench-rc.md` + `tests/p101-rc-seal.spec.ts` + EOP + CLAUDE.md sync

**Wave structure:** W1 parallel (4 reviewers concurrent); W2 sequential (A5 fix-pass → ADR → tests → closer).

**TDD requirements:**
- TC1 `four-reviewer-perspectives-all-ran` — Γ R1
- TC2 `per-review-loc-le-600` — Γ R2
- TC3 `recursive-must-fix-passes-le-3` — Γ R3
- TC4 `composite-ge-80` — Γ R4 (RC blocker)
- TC5 `zero-open-blockers-post-round-3` — Ε V3
- TC6 `rc-manifest-shape-validates` — Σ contract
- TC7 `all-3-modes-covered-in-ux-review` — P101-A1 Γ R1
- TC8 `feature-flag-gate-absent-if-Q5-A` — A2 §6 strike #6 (conditional)

**Optimization:** §4 pass; A2 §6 strike #6 (feature-flag plumbing) NOT introduced if Q5=A.

**Log entries:** ruvector "agentic-workbench-rc"; tags P101+ADR-127+RC+composite-floor; EOP `phase-101/`.

**Gate:** 8 TCs GREEN; ADR-127 Accepted; all 4 reviews ≤600 LOC; composite ≥80; zero blockers post round-3; tsc clean; EOP shipped; CLAUDE.md sync (126→127); cumulative regression GREEN.

**Estimated wall-clock:** 60-90 min W1 + 60-180 min W2 (volume-dependent).

---

### Phase P100 W2 — Log build (DEFERRED dispatch — separate session)

**Status:** BLOCKED on Q4 (migration plan) + Q7 (compute-all-5 personality).
**Note:** P100 W2 is the largest cross-context phase (per A3 §3 — touches persistence + intelligence + ui-shell + planning); per A2 §4 Band 1 it is parallel-batchable with P95/P97 but file-conflict map (per A4 §5) requires `Planning.tsx` wave-gated AFTER P95 + P96. Owner-question gates Q4 + Q7 are independent of P95-P99 critical path; can dispatch in parallel session window if both resolved early.
**Reactivation criteria:** owner answers Q4 (recommendation: A — auto-migrate additive-only) + Q7 (recommendation: A — compute-all-5).
**See:** `phase-100/log-design.md` §9 migration plan; this sprint plan §2 P101 entry treats P100 W2 as upstream dependency.

---

### Phase P102 — Final QA + persona re-score (LIGHT plan)

**Predecessor:** P101 sealed.
**Cross-refs:** ADR-128 (NEW); ADR-094 (Professional Grade), ADR-127.
**Status:** READY post-P101 (no Q-gate).
**Bounded contexts:** ui-shell + specification (scoring rubric reads rendered surfaces).

**Agent roster + Wave structure:** Wave 1 parallel = P102-A1 Grandma + P102-A2 Framer + P102-A3 Capstone (3 disjoint persona docs at `plans/implementation/phase-102/personas/{grandma,framer,capstone}.md`). Wave 2 sequential = P102-A4 composite scorer + ADR-128 + `tests/p102-final-qa.spec.ts` (≥8 cases) + EOP closer; conditionally spawns P102b polish phase if any persona < 78.

**DoD gate:** ADR-128 Accepted; composite ≥80 (ADR-094 floor); per-persona rubric scored against ADR-094 + ADR-127; tests ≥8 GREEN; EOP triplet.

**TDD test cases:** TC1 composite-floor-ge-80; TC2 per-persona-doc-shape-valid; TC3 (conditional) p102b-trigger-if-any-persona-lt-78.

**KISS:** §4 canonical checklist; no UI changes (pure scoring docs).

**Estimated wall-clock:** 30-45 min Wave 1 + 15-30 min Wave 2.

---

### Phase P103 — v2.0.0 release artifacts (LIGHT plan)

**Predecessor:** P102 composite ≥80.
**Cross-refs:** ADR-129 (NEW); ADR-109 (v1 precedent), ADR-127, ADR-128, ADR-108.
**Status:** READY post-P102 (mirrors P84 / OC-18 pattern; no Q-gate).
**Bounded contexts:** specification (artifacts in `docs/launch/`).

**Agent roster + Wave structure:** Wave 1 parallel (6 agents file-disjoint) = P103-A1 CHANGELOG.md (EDIT — append v2.0.0-RC1 P85→P104) + P103-A2 release-notes-v2.0.0-rc1.md + P103-A3 show-hn-post-v2.md (≤120 LOC) + P103-A4 product-hunt-tagline-v2.md (≤40 LOC) + P103-A5 demo-video-script-v2.md (≤180 LOC) + P103-A6 owner-launch-checklist-v2.md (≤80 LOC). Wave 2 sequential = P103-A7 ADR-129 + `tests/p103-release-artifacts.spec.ts` (≥12 cases existsSync per artifact + LOC-cap guards) + EOP closer.

**DoD gate:** ADR-129 Accepted; CHANGELOG section P85→P104 appended; demo-script ≤180 LOC; owner-launch-checklist v2 ≤80 LOC; tests ≥12 GREEN; EOP triplet.

**TDD test cases:** TC1 existsSync-each-artifact; TC2 demo-script-loc-le-180; TC3 owner-checklist-loc-le-80; TC4 changelog-has-v2-section.

**KISS:** P103-T9 re-record demo video (A2 §6 strike #7) NOT in Claude scope — owner-only post-RC.

**Estimated wall-clock:** 45-60 min Wave 1 + 30 min Wave 2.

---

### Phase P104 — v2.0.0-RC1 public launch (LIGHT plan; TERMINAL)

**Predecessor:** P103 sealed.
**Cross-refs:** none new (owner-led).
**Status:** READY post-P103 (Claude-side surface tiny; owner-led tag + posts + beta + AISP campaign).
**Bounded contexts:** none in source.

**Agent roster + Wave structure:** Wave 1 single = P104-A1 CLAUDE.md final v2.0.0-RC1 sync row (status row + arc-close note) + P104-A2 arc-close retro at `plans/implementation/phase-104/retrospective.md`.

**Owner-led carry-forwards:** `git tag v2.0.0-RC1`; Show HN / PH / Reddit / LinkedIn / Twitter-X posts; Agentics Foundation beta dispatch (20-50 users); AISP campaign (1-2 weeks). Per ADR-109 §4 owner-launch-checklist pattern.

**DoD gate:** CLAUDE.md final sync row appended; arc-close retro present; owner-side tag + posts + beta + AISP campaign documented as carry-forward.

**TDD test cases:** TC1 claude-md-final-row-present; TC2 retro-file-exists-at-canonical-path.

**KISS:** P104-T7 promo automation (A2 §6 strike #8) NOT introduced.

**Estimated wall-clock:** 15-30 min (Claude-side); owner-led work runs in parallel.

---

## §3 TDD test cases catalog

Cross-cut all phases; lists ALL test cases from §2.

| Phase | TC | Verifies | File:line target | Status |
|---|---|---|---|---|
| P95 | TC1 | AISP Γ R3: SpecBundle.atoms.length === 8 | tests/p95-spec-workbench.spec.ts | TODO |
| P95 | TC2 | AISP Γ R2: KISS denylist (no `classify*` import) | tests/p95-spec-workbench.spec.ts | TODO |
| P95 | TC3 | AISP Γ R1: dual-view side-by-side at ≥768px | tests/p95-spec-workbench.spec.ts | TODO |
| P95 | TC4 | AISP Γ R2: mobile single-pane fallback at <768px | tests/p95-spec-workbench.spec.ts | TODO |
| P95 | TC5 | AtomCard Γ R1: Σ symbol header rendered | tests/p95-spec-workbench.spec.ts | TODO |
| P95 | TC6 | AtomCard Γ R3: Enter/Space keyboard expand | tests/p95-spec-workbench.spec.ts | TODO |
| P95 | TC7 | SpecWorkbench Γ R3 + ADR-091: ARIA tablist | tests/p95-spec-workbench.spec.ts | TODO |
| P96 | TC1 | AISP Γ R1: golden-file equality | tests/p96-export-roundtrip.spec.ts | TODO |
| P96 | TC2 | AISP Γ R1: 5-line hello-world agent dispatches | tests/p96-export-roundtrip.spec.ts | TODO |
| P96 | TC3 | AISP Γ R3: swarm.json one entry per AgentSpec | tests/p96-export-roundtrip.spec.ts | TODO |
| P96 | TC4 | AISP Γ R4: CLAUDE.md auto-generated | tests/p96-export-roundtrip.spec.ts | TODO |
| P96 | TC5 | AISP Γ R2: ADR stub cross-refs source ADRs | tests/p96-export-roundtrip.spec.ts | TODO |
| P96 | TC6 | zipBuilder Γ R1: MIME type `application/zip` | tests/p96-export-roundtrip.spec.ts | TODO |
| P96 | TC7 | zipBuilder Γ R3: ZIP roundtrip extract = original | tests/p96-export-roundtrip.spec.ts | TODO |
| P96 | TC8 | zipBuilder Γ R4 + KISS: no new deps in package.json | tests/p96-export-roundtrip.spec.ts | TODO |
| P97 | TC1 | AISP Γ R1: scaffold namespace isolation | tests/p97-tdd-scaffold.spec.ts | TODO |
| P97 | TC2 | AISP Γ R2: existsSync no-overwrite on second emit | tests/p97-tdd-scaffold.spec.ts | TODO |
| P97 | TC3 | AISP Γ R3: 8-atom scaffold coverage | tests/p97-tdd-scaffold.spec.ts | TODO |
| P97 | TC4 | AISP Γ R4: CI excludes `tests/scaffold/**` | tests/p97-tdd-scaffold.spec.ts | TODO |
| P97 | TC5 | tddScaffold Ω: Playwright describe per Γ rule | tests/p97-tdd-scaffold.spec.ts | TODO |
| P97 | TC6 | tddScaffold Ω: it block per DoD bullet | tests/p97-tdd-scaffold.spec.ts | TODO |
| P97 | TC7 | P97-A3: vitest config exclude pattern present | tests/p97-tdd-scaffold.spec.ts | TODO |
| P98 | TC1 | AISP Γ R1: scope guard rejects out-of-ownedFiles | tests/p98-kiss-reviewer.spec.ts | TODO |
| P98 | TC2 | AISP Γ R2: findings Zod schema validates | tests/p98-kiss-reviewer.spec.ts | TODO |
| P98 | TC3 | AISP Γ R3: severity ∈ {blocker, major, minor} | tests/p98-kiss-reviewer.spec.ts | TODO |
| P98 | TC4 | AISP Γ R4: prompt cap ≤4096 chars | tests/p98-kiss-reviewer.spec.ts | TODO |
| P98 | TC5 | Σ contract scoping: prompt-injection mitigation | tests/p98-kiss-reviewer.spec.ts | TODO |
| P98 | TC6 | Λ render channel per Q3 (conditional) | tests/p98-kiss-reviewer.spec.ts | TODO |
| P99 | TC1 | AISP Γ R2: DoD row count === AgentSpec.dod.length | tests/p99-seal-panel.spec.ts | TODO |
| P99 | TC2 | AISP Γ R2: existsSync no-overwrite on session-log | tests/p99-seal-panel.spec.ts | TODO |
| P99 | TC3 | AISP Γ R3: markdown diffability deterministic | tests/p99-seal-panel.spec.ts | TODO |
| P99 | TC4 | AISP Γ R4: SealPanel mounted in Agentics only | tests/p99-seal-panel.spec.ts | TODO |
| P99 | TC5 | A1 §7: Coming-soon badge retired from Agentics:19 | tests/p99-seal-panel.spec.ts | TODO |
| P99 | TC6 | A2 §6 strike #5: no UI reorder of DoD rows | tests/p99-seal-panel.spec.ts | TODO |
| P99 | TC7 | AISP Γ R3: append-only on existing files | tests/p99-seal-panel.spec.ts | TODO |
| P101 | TC1 | AISP Γ R1: 4 reviewer perspectives all ran | tests/p101-rc-seal.spec.ts | TODO |
| P101 | TC2 | AISP Γ R2: per-review LOC ≤600 | tests/p101-rc-seal.spec.ts | TODO |
| P101 | TC3 | AISP Γ R3: recursive must-fix passes ≤3 | tests/p101-rc-seal.spec.ts | TODO |
| P101 | TC4 | AISP Γ R4: composite ≥80 (RC blocker) | tests/p101-rc-seal.spec.ts | TODO |
| P101 | TC5 | Ε V3: zero open blockers post round-3 | tests/p101-rc-seal.spec.ts | TODO |
| P101 | TC6 | Σ contract: rcManifest shape validates | tests/p101-rc-seal.spec.ts | TODO |
| P101 | TC7 | P101-A1 Γ R1: all 3 modes covered in UX review | tests/p101-rc-seal.spec.ts | TODO |
| P101 | TC8 | A2 §6 strike #6: feature-flag absent if Q5=A | tests/p101-rc-seal.spec.ts | TODO |
| P102 | TC1 | ADR-128: composite floor ≥80 verified | tests/p102-final-qa.spec.ts | TODO |
| P102 | TC2 | per-persona doc shape valid (3 docs present) | tests/p102-final-qa.spec.ts | TODO |
| P102 | TC3 | P102b polish trigger if any persona <78 (cond) | tests/p102-final-qa.spec.ts | TODO |
| P103 | TC1 | existsSync per launch artifact (6 files) | tests/p103-release-artifacts.spec.ts | TODO |
| P103 | TC2 | demo-video-script-v2.md LOC ≤180 | tests/p103-release-artifacts.spec.ts | TODO |
| P103 | TC3 | owner-launch-checklist-v2.md LOC ≤80 | tests/p103-release-artifacts.spec.ts | TODO |
| P103 | TC4 | CHANGELOG.md has v2.0.0-RC1 section | tests/p103-release-artifacts.spec.ts | TODO |
| P104 | TC1 | CLAUDE.md final v2.0.0-RC1 sync row present | tests/p104-launch.spec.ts | TODO |
| P104 | TC2 | retrospective.md exists at canonical path | tests/p104-launch.spec.ts | TODO |

**Total: 49 test cases** across 9 active phases (P95=7 + P96=8 + P97=7 + P98=6 + P99=7 + P101=8 + P102=3 + P103=4 + P104=2). Floor of 30 satisfied; 5-8 per active phase target met for P95-P101.

---

## §4 Optimization checklist template (canonical KISS review)

Single canonical form applied at every seal by closer agent (per ADR-094 + ADR-095 + ADR-111).

```
## KISS Review Checklist (canonical; applied at every seal)

- [ ] No new dependencies (verify package.json byte-equivalent vs predecessor commit)
- [ ] No animation libs (grep src/ for framer-motion|gsap|lottie|@react-spring|animejs → 0 matches)
- [ ] No hardcoded hex outside palette blocks (grep new sources for `#[0-9a-fA-F]{6}` outside .palette / .style.bg)
- [ ] Component LOC caps respected:
  - shell components ≤200 LOC
  - functional components ≤220 LOC
  - pure modules ≤300 LOC
  - ADRs ≤120 LOC
  - light marketing ≤80 LOC
- [ ] Token-derived spacing (var(--hb-*) refs ≥3 per new component per ADR-087)
- [ ] focus-visible + transition-colors per ADR-091 on every interactive surface
- [ ] No TS6133 unused / TS2322 type mismatch under tsc -p tsconfig.app.json strict
- [ ] Backward-compat preserved (every prior test stays GREEN; cumulative regression count grows monotonically)
- [ ] A2 §6 / A3 §7 strikes confirmed not regressed (10 strikes — see decomposition):
  - Strike 1: no atom search box in P95
  - Strike 2: no bundle versioning UI in P96
  - Strike 3: no scaffold preview UI in P97
  - Strike 4: no reviewer-history viewer in P98
  - Strike 5: no DoD drag-to-reorder in P99 (DDD-mandatory per A3 §7)
  - Strike 6: no feature-flag plumbing in P101 if Q5=A
  - Strike 7: no demo-video re-record in Claude scope at P103
  - Strike 8: no promo automation in P104
  - Strike 9: no in-page bundle render in P96 if Q2=A
  - Strike 10: personality compute-all-5 conditional per Q7
```

---

## §5 Log entry template per phase seal

Single canonical log-entry template (per A4 §6 + A1 P100 design + ADR-070 ruvector convention).

```
## Phase Seal Log Entry (canonical; applied at every seal)

- Phase: P{N}
- Sealed at commit: {hash}
- Tests: {N}/{M} GREEN ({delta from prior seal})
- ADR: {N} Accepted ({title})
- Bounded contexts touched: {comma-list per A3 §3 — ui-shell / intelligence / persistence / specification / planning / agentics}
- KISS-review pass: ✓ / ✗ ({notes; cite §4 canonical checklist})
- ruvector pattern entry:
  - category: {agentic-workbench-{ui|export|tdd|review|seal|log|rc}}
  - text: "{1-line summary citing ADR + atom or surface}"
  - tags: {P{N}, ADR-{N}, {theme tags}}
  - file:line refs: {primary owned files}
- Owner-question gates resolved: {Q{N} / none / N/A}
- Carry-forwards: {comma-list with target phase or Tier-2 destination}
- Wall-clock: estimated {N} min; actual {M} min
```

---

## §6 Retrospective template per phase

Mirror existing retrospective format (4 sections + velocity note).

```
## Retrospective P{N}

### Keep
- {what worked; preserve in next phase plan}

### Drop
- {what didn't work; do NOT repeat in next phase}

### Reframe
- {what worked but framing was off; restate before next phase}

### Carry-forward
- {item} → P{N+M}
- {item} → Tier-2

### Velocity note
- Estimated: {N} min; actual: {M} min; delta: ±{X}%
- Anything that surprised us: {free-form 1-2 sentences}
- Phase budget recalibration for next sprint: {raise / lower / hold velocity baseline}
```

---

## §7 Owner review checklist (PRE-DISPATCH)

Items the owner reviews BEFORE green-lighting first code dispatch (P95 or any other body sprint).

```
## Pre-Dispatch Review Checklist (owner-actioned)

Document review:
- [ ] Read 00-understanding.md — confirm or correct A1 inventory (8 atoms / 3 modes / persistence map / log infra)
- [ ] Read 01-decomposition.md — confirm or strike additional KISS items beyond the 10 already listed
- [ ] Read 02-ddd-adr-plan.md — confirm 6 bounded contexts + 9 ADR list (121-129); flag any conflicts
- [ ] Read 03-process-map.md — confirm AISP Σ blocks (12) + swarm coordination wave structure
- [ ] Read 04-sprint-plan.md (this doc) — confirm per-phase formal plans + 49 TDD test cases

Owner-question answers (A1 §6 — 7 questions; recommendations cited):
- [ ] Q1: P95 SpecWorkbench layout (recommendation C — desktop side-by-side / mobile auto-collapses)
- [ ] Q2: P96 Export target (recommendation A — ZIP via Blob)
- [ ] Q3: P98 KISS Review surface (recommendation B — Agentics tab)
- [ ] Q4: P100 W2 migration plan (recommendation A — auto-migrate additive-only)
- [ ] Q5: P101 RC rollout (recommendation A — all-on at tag)
- [ ] Q6: AGENT_ATOM recipe depth (recommendation B — spawn P94b BEFORE P95)
- [ ] Q7: Personality compute-all-5 (recommendation A — compute-all)

Dispatch decisions:
- [ ] DECIDE: dispatch P95 first (after P94b if Q6=B), OR reorder, OR add a phase
- [ ] DECIDE: P100 W2 dispatch timing (parallel with P95+ vs sequential after P99)
- [ ] DECIDE: P98 wave timing if Q3=B (BEFORE or AFTER P99 to avoid Agentics.tsx conflict)
- [ ] DECIDE: P94b spawn (gates on Q6=B answer)
```

---

## §8 Carry-forward to first code dispatch (P95)

Items the FIRST code-phase agent (P95 dispatch) needs from this plan (and the broader 5-doc planning bundle):

- **§2 P95 formal plan** → preflight `00-summary.md` template at `plans/implementation/phase-95/preflight/00-summary.md` (status / preflight checklist / agent roster / wave structure / TDD requirements / KISS optimization / log / DoD / wall-clock — copy-paste-able structure)
- **§3 P95 test cases (TC1-TC7)** → `tests/p95-spec-workbench.spec.ts` skeleton with 7 describe blocks (one per TC); P95-A4 owns initial skeleton, P95-A5 closer fills final cases
- **§4 KISS canonical checklist** → P95-A5 closer verification gate (10 strike denylist already encoded; cite §4 in EOP)
- **§5 log entry template** → CLAUDE.md sync format for P95-A5 closer (NOTE-FOR-NEXT pattern with P96 successor)
- **§6 retrospective template** → `plans/implementation/phase-95/retrospective.md` (4 sections + velocity note)
- **§7 owner answers** → unblock BLOCKED phases (P95 specifically gates on Q1+Q6); owner ticks before dispatch
- **AISP Σ blocks from A4 §4** (P95-A1 / P95-A2 / P95-A3) → per-agent system-prompt files at `plans/implementation/phase-95/agents/{P95-A1,A2,A3,A4,A5}.md` (mirrors P92-P94 dispatch pattern; agent roster file format)
- **§3 cross-phase dependency graph from A2** → `plans/implementation/phase-95/dispatch.md` Wave 1 / Wave 2 markers + file-conflict notes (Planning.tsx Wave 2 only)
- **A3 §3 bounded-context impact map** → ADR-121 carries explicit context tags (ui-shell + intelligence + specification + planning); ACL note unnecessary (atoms already shared types)
- **Planning Sprint retro at `plans/implementation/phase-95/planning-retrospective.md`** (per A4 §8 hand-off): synthesizes 5 docs into single owner-actionable summary; NOT this doc's job — closer agent at P95 SEAL writes after first code dispatch completes

---

# Report

Section LOC counts: §1≈8, §2≈230 (10 phase entries: 6 full P95-P101 + 1 deferred P100W2 + 3 light P102-P104), §3≈70 (49 TDD test cases tabulated), §4≈30 (canonical KISS checklist), §5≈25 (canonical log entry template), §6≈20 (canonical retro template), §7≈30 (pre-dispatch owner checklist), §8≈15. Total ≈ 526 LOC ≤ 600 cap.

Formal plan count: **6 full** (P95 + P96 + P97 + P98 + P99 + P101) + **3 light** (P102 + P103 + P104) + **1 deferred-note** (P100 W2 — separate dispatch when owner unblocks Q4+Q7) = **10 phase entries**.

TDD test case count in §3: **49** across 9 active phases (P95=7 + P96=8 + P97=7 + P98=6 + P99=7 + P101=8 + P102=3 + P103=4 + P104=2). Floor of 30 satisfied; 5-8 per active phase target met for P95-P101.

Templates in §4-§6: **3** (KISS canonical checklist + log entry template + retrospective template). Each is a single reusable form.

Owner review checklist in §7: **present** (4 doc-review items + 7 Q-answer items + 4 dispatch-decision items = 15 actionable owner gates).

Hard-rule compliance: READ-ONLY (no source / test / ADR / CLAUDE.md edits — only the owned doc artifact at `plans/implementation/phase-95/04-sprint-plan.md` written); doc artifact only ≤600 LOC; per-phase formal plan for P95-P104 (6 full + 3 light + 1 deferred-note = 10 entries); 49 TDD test cases ≥30 floor; templates in §4-§6 each present; owner review checklist in §7; file:line not required (forward-looking per spec); no shell commands except read/cat (used only ls + read on predecessor docs); all 8 sections (§1-§8) present.

Planning sprint COMPLETE; ready for owner review.
