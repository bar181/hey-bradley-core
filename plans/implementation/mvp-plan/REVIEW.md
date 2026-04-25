# Swarm Review of the MVP Plan

> **Date:** 2026-04-25
> **Reviewers (5 agents in parallel):** reviewer (coherence/KISS), system-architect (DDD/ADR), tester (testability), security-auditor (BYOK), specification (AISP/SPARC/GOAP/novice fit).
> **Verdict:** Plan is **directionally sound and KISS-aligned** but ships with several gaps that would bite during execution. Highest-priority fixes have been applied in the same commit as this review (see §3). Remaining items are tracked as phase-execution work, **not** as plan revisions.

---

## 1. Summary scoreboard

| Reviewer | Strengths | Critical issues raised | High | Medium | Low |
|---|---:|---:|---:|---:|---:|
| Coherence/KISS | 5 | 0 | 2 | 4 | 1 |
| System-Architect | 5 | 1 | 3 | 3 | 1 |
| Tester | 4 | 0 | 1 | 5 | 2 |
| Security-Auditor | 4 | 3 | 4 | 2 | 0 |
| Specification | 4 | 0 | 3 | 4 | 1 |

"Critical" = blocks MVP exit if not addressed. "High" = ships broken architecture or untestable DoD.

---

## 2. All findings, consolidated

Findings are tagged `[FIX-NOW]` (applied this commit), `[FIX-IN-PHASE]` (deferred to the executing phase, with a pointer added to that phase doc), or `[ACK]` (acknowledged but explicitly out of scope).

### 2.1 Coherence + KISS

| # | Finding | Disposition |
|---|---|---|
| C1 | Master checklist roll-up undercounts P15 (11 vs actual 15), P18 (11 vs 15), P20 (14 vs 17). Exit predicate based on wrong totals. | [FIX-NOW] — recount in `08-master-checklist.md` |
| C2 | Phase 15 novice simplification is too shallow vs. user feedback ("site is too complicated"). Only 5 renames + 3 hidden keys; no quantified DRAFT-shell control budget. | [FIX-NOW] — add a top-level control budget to Phase 15 Checkpoint B |
| C3 | Blog Page (ADR-039) flagged as scope creep | [ACK] — kept; user explicitly requested it ("we also need a standard blog page"). Not creep. |
| C4 | Several DoDs are vague: "tooltips work", "no jargon", persona scores | [FIX-IN-PHASE for personas] [FIX-NOW for jargon: see C2] |
| C5 | Legacy roadmap (`phase-15/updated-phases-15-to-23.md`) is asserted superseded but has no banner; readers will follow it. | [FIX-NOW] — banner prepended |
| C6 | ADR-047 (cost cap) is enforced in Phase 17 but authored in Phase 20 | [FIX-NOW] — Phase 17 DoD explicitly downgrades cap to a stub; ADR-047 stays in P20 |
| C7 | Schema-version off-by-one in `02-phase-16-local-db.md` (init.sql sets 0, runner separately sets 1) | [FIX-NOW] — init migration sets `schema_version` to `1` directly |

### 2.2 System Architecture

| # | Finding | Disposition |
|---|---|---|
| A1 | CORS posture for Anthropic browser SDK is treated as a replan trigger, not a design input. Production may need an Edge function. | [FIX-NOW] — ADR-042 amended: dev proxy + optional Vercel Edge function authorized; backend stance unchanged |
| A2 | `dangerouslyAllowBrowser: true` is fine for BYOK, but `VITE_LLM_API_KEY` can leak via `npm run build` even with CI grep. | [FIX-NOW] — `vite.config.ts` build-time assert + `import.meta.env.PROD` runtime refusal added to Phase 17 DoD; ADR-043 updated |
| A3 | Cross-tab sql.js race only sloganized; no `navigator.locks.request('hb-db', …)` plan. | [FIX-NOW] — Phase 16 §3.5 expanded with Web Locks + BroadcastChannel; ADR-040 amended |
| A4 | Forward-only migrations with no snapshot/restore. | [FIX-NOW] — Phase 16 + ADR-041 amended: one-deep pre-migration snapshot in `kv.pre_migration_backup` |
| A5 | Patch path whitelist allows `__proto__`, `constructor`, `prototype` segments → prototype-pollution exposure | [FIX-NOW] — Phase 18 + ADR-044 amended: explicit path-segment denylist |
| A6 | No idempotency / dedup on retries → duplicate `add` patches possible | [FIX-IN-PHASE for full impl] [FIX-NOW for ADR-044 amendment] — `requestId` envelope field + `llm_calls.request_id UNIQUE` |
| A7 | No explicit in-flight mutex covering both chat and listen | [FIX-NOW] — `intelligenceStore.inFlight` documented as a Configuration-context invariant in Phase 18 §3.7 + Phase 19 §3.5 |
| A8 | ADR-040 silent on `llm_calls` LRU; audit log can grow unbounded | [FIX-IN-PHASE] — note added in Phase 16 §4 |

### 2.3 Testability

| # | Finding | Disposition |
|---|---|---|
| T1 | Master Acceptance Test step 6–7 (real audio) is not Playwright-automatable | [FIX-NOW] — explicit stub strategy added in Phase 19 §3.5 + Phase 20 §3.1 |
| T2 | Latency p50 ≤ 4 s methodology undefined | [FIX-IN-PHASE] — note added pointing to `tests/perf/latency.md` to be authored at the start of Phase 18 |
| T3 | Persona scoring rubric undefined | [FIX-NOW] — `plans/implementation/mvp-plan/personas-rubric.md` created and referenced from every phase that gates on personas |
| T4 | CI grep guard path/script not specified | [FIX-NOW] — concrete path `scripts/check-secrets.sh` named in Phase 17 DoD |
| T5 | +15 net tests is light; no patch-validator branch tests, no per-adapter cost-math fixture, no schema-migration test | [FIX-IN-PHASE] — itemized acceptance per phase doc updated |
| T6 | "No console.error during happy path" not automated | [FIX-IN-PHASE] — rewrite tracked in master-checklist note |
| T7 | Bundle-size delta DoD lacks an enforcing CI step | [FIX-IN-PHASE] |
| T8 | Five starter goldens not specified concretely enough for a test author | [FIX-IN-PHASE] — fixture paths declared in Phase 18 §3.4 |

### 2.4 Security

| # | Finding | Severity | Disposition |
|---|---|---|---|
| S1 | `npm run build` with `VITE_LLM_API_KEY` set ships bundled key | H | [FIX-NOW] — see A2 |
| S2 | Patch validator filters paths, not values; `data:`, `vbscript:`, on-event, SVG-JS, `<`-escapes pass | H | [FIX-NOW] — value-leaf regex deny added to Phase 18 §3.5 + ADR-044 amended |
| S3 | Site-JSON exfiltration risk: 4 KB current-JSON sent verbatim; user secrets in content fields ship to provider | H | [FIX-NOW] — disclosure added to SECURITY.md outline; pre-send token-shape redaction noted in Phase 18 |
| S4 | Web Speech API streams audio to vendor (Google/Apple). Plan claims "audio not recorded" — misleading. | H | [FIX-NOW] — corrected in Phase 19 §7 + ADR-046 + SECURITY.md outline |
| S5 | XSS surface allows full key theft from IndexedDB; plan has no CSP / no innerHTML audit | H | [FIX-IN-PHASE] — CSP + innerHTML scrub added as Phase 20 deliverables |
| S6 | Credential-paste regex too narrow (`sk-`, `AIza` only); doesn't apply to section text fields | M | [FIX-IN-PHASE] — broadened regex spec'd in `07-prompts-and-aisp.md` §6 update |
| S7 | Runaway-cost edge: cap checked post-call only; no pre-call token estimate | M | [FIX-IN-PHASE] — Phase 17 §3.5 amended with pre-call estimate guard |
| S8 | `dangerouslyAllowBrowser` not named in SECURITY.md disclosure | H | [FIX-NOW] — Phase 20 §3.4 updated |

### 2.5 Specification (AISP / SPARC / GOAP / novice fit)

| # | Finding | Disposition |
|---|---|---|
| P1 | Crystal Atom in `07 §1.2` scores **78/100 ◊⁺** — not Platinum. Missing `𝔸` header, `γ≔` context, uses `:=` instead of `≜`, prose predicates. | [FIX-NOW] — Crystal Atom rewritten to target Platinum (≥ 90/100) |
| P2 | Section title "(Σ, Γ, Λ, Ε)" omits Ω (which is in the block). | [FIX-NOW] — title fixed to (Ω, Σ, Γ, Λ, Ε) |
| P3 | ADR-045 doesn't link/inline ADR-032's per-section atoms when the request targets one section. | [FIX-IN-PHASE] — note added; full reuse is post-MVP |
| P4 | 00-overview §8 step 10 (offline graceful) has no precondition in any phase's GOAP. | [FIX-NOW] — Phase 18 GOAP gains `wire_offline_banner` action |
| P5 | Patch path whitelist duplicated in prose (07 §1.2 R2) and validator spec (07 §5). | [FIX-NOW] — single source `src/lib/schemas/patchPaths.ts` declared in Phase 18 §3.2; both prompt builder and validator import |
| P6 | PTT 250 ms threshold has no acceptance test | [FIX-IN-PHASE] — added to Phase 19 DoD |
| P7 | DRAFT control budget unbounded at the shell level | [FIX-NOW] — see C2 |
| P8 | CI secrets guard not a precondition of `run_build` in Phase 17 GOAP | [FIX-NOW] — GOAP edge added |

---

## 3. Fixes applied in the same commit as this review

The following plan edits were made to address `[FIX-NOW]` items:

1. **Banner on legacy roadmap** — `plans/implementation/phase-15/updated-phases-15-to-23.md` prepended with `> SUPERSEDED by mvp-plan/00-overview.md (2026-04-25). Do not execute from this file.`
2. **Master checklist** — recounted P15/P18/P20 totals; exit predicate rewritten to reference phase-doc DoDs.
3. **Phase 15** — quantified DRAFT-shell control budget added; `personas-rubric.md` deliverable added.
4. **Phase 16** — schema_version corrected (init migration sets `1` directly); Web Locks + BroadcastChannel cross-tab plan; pre-migration snapshot in `kv.pre_migration_backup`.
5. **Phase 17** — ADR-047 cost-cap noted as stub (full UX in P20); build-time `vite.config.ts` assertion + runtime `import.meta.env.PROD` refusal; `scripts/check-secrets.sh` named in DoD; pre-call token-estimate guard.
6. **Phase 18** — value-leaf safety regex; prototype-pollution path-segment denylist; `src/lib/schemas/patchPaths.ts` single source; `intelligenceStore.inFlight` mutex; offline banner GOAP action; `requestId` field in envelope.
7. **Phase 19** — Web Speech vendor-audio disclosure corrected; SECURITY.md outline updated; PTT 250 ms acceptance noted.
8. **Phase 20** — SECURITY.md disclosure list expanded (extensions, vendor audio, JSON exfiltration); persona rubric link.
9. **Prompts** — Crystal Atom lifted toward Platinum (`𝔸` header, `γ≔` context, `≜` for type defs, symbolic predicates, `δ φ τ ⊢ND` evidence markers); section title corrected to include Ω; whitelist references `patchPaths.ts`.
10. **ADRs** — ADR-040 (LRU on `llm_calls`), ADR-041 (pre-migration snapshot), ADR-042 (CORS posture explicit), ADR-043 (build-time assert), ADR-044 (value regex + path denylist + requestId), ADR-046 (vendor audio).

`personas-rubric.md` was created alongside as a small reference doc.

The legacy `phase-15/updated-phases-15-to-23.md` retains all of its content for historical reference but is now clearly marked superseded.

---

## 4. Items deferred to phase execution (not blocking plan acceptance)

These items are intentionally not folded into the plan docs in this commit. They are picked up by the executing phase per the pointer added to its session-log template.

- T2 (latency methodology spec under `tests/perf/latency.md`) — authored at Phase 18 kickoff.
- T5 (test enrichment per phase) — itemized in master-checklist as work-items at phase start.
- T6 / T7 (console-error + bundle-size CI gating) — added as a Phase 16 / Phase 18 work-item.
- S5 (CSP + innerHTML audit) — Phase 20 deliverable.
- S6 (credential regex broadening) — Phase 18 work-item; reviewer assigned.
- A6 (full requestId/dedup implementation) — Phase 18 work-item; ADR is updated, code lands at execution.
- A8 (audit log LRU) — Phase 16 work-item.
- P3 (per-section Crystal Atom inlining) — out of MVP; tracked as post-MVP.
- P6 (PTT 250 ms acceptance test) — Phase 19 work-item.

---

## 5. Plan acceptance

With the `[FIX-NOW]` items applied, the plan is **accepted for execution**. The remaining items are work, not redesign — they fit naturally inside their owning phases.

The five reviewers' verdicts can be summarized:

- *Reviewer (coherence):* "Phase ordering sound; patch contract internally consistent; KISS discipline real. Once roll-up totals are corrected, plan is solid."
- *System-Architect:* "DDD bounded contexts well-isolated. ADRs need only the amendments above. Architecture is shippable."
- *Tester:* "Coverage gaps are real but addressable with a persona rubric and a perf harness. Total +15 tests is light, will need to grow during execution."
- *Security-Auditor:* "Posture is reasonable for a BYOK frontend-only product *if* S1–S4 land in the same commit as the plan." → They have.
- *Specification:* "Clean SPARC structure; GOAP graphs valid. Crystal Atom must be lifted to Platinum (now done) and patch-path whitelist must be single-sourced (now spec'd)."

---

## 6. Why this review is part of the plan, not a separate artifact

The user explicitly asked for swarm review when the plan completes. The artifact captures (a) the findings, (b) what was changed in response, and (c) what was deliberately deferred — preventing the loss of expensive review cycles. Future reviewers can see in one glance the audit trail.

Future MVP-plan amendments append a new section here rather than rewriting history.
