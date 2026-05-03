# P102 — 4-Reviewer Brutal Review (Wave 2 closer; A4 owns)

**Date:** 2026-05-03 · **Phase:** P102 / OC-POLISH-W5 (post-Wave-1 commit `57e7749`)
**Reviewers:** R1 UX-Design · R2 Functionality · R3 Security-BYOK · R4 Architecture-KISS
**Inputs reviewed:** A1 (Welcome.tsx + Onboarding.tsx) · A2 (Agentics.tsx live-wire) · A3 (CF#11 + CF#12)

---

## R1 — UX / Design Token Migration

**Verdict:** PASS

**Scope reviewed:** `src/index.css` +36 LOC; `src/pages/Welcome.tsx` (254 LOC; 47→0 hex);
`src/pages/Onboarding.tsx` (893 LOC; 91→9 hex); CSS diff against P101 baseline.

**Findings:**

1. **PASS — Welcome.tsx fully tokenized.** `grep -c "#[0-9a-fA-F]\{6\}"` returns 0.
   Marketing surface now consumes `--hb-paper`/`--hb-ink`/`--hb-warm` /
   `--hb-paper-soft` / `--hb-mkt-text` family consistently. Cross-mode
   readability defended.
2. **PASS — Onboarding.tsx 91→9 hex with 9 architectural-correct holdouts.**
   The 9 remaining values are inside the `personalities[]` JSON data array
   (`bgPrimary: '#0a0a1a'` etc.) — these are theme palette fallbacks read at
   runtime by the palette-swap renderer. Tailwind cannot statically extract
   `var(--hb-*)` from a fixture array; converting them would break palette
   swap. ADR-132 §1 codifies the chrome-vs-data rule.
3. **PASS — Token roster expanded to 22 mode-independent values** with RGB
   channel-form for Tailwind opacity arbitraries. `--hb-warm-rgb`
   (`232 119 46`) enables `bg-[rgb(var(--hb-warm-rgb)/0.15)]` syntax that
   `bg-[var(--hb-warm)]/15` cannot achieve on hex-valued tokens.
4. **MINOR — Status palette tokens consume in ProcessMapSVG only.**
   DomainModelSVG.tsx not yet updated (CF#9 deferred). Acceptable per
   `phase-102/01-cf-closure-report.md` — additive surface only.
5. **CAVEAT — No browser render verification.** This review scored from CSS
   diff + JSX structure only. Live render at 375/390/428px viewports is
   owner post-RC task.

**LOC:** R1 section ~28 LOC.

---

## R2 — Functionality (Agentics live-wire trace)

**Verdict:** PASS

**Scope reviewed:** `src/pages/Agentics.tsx` (228→263 LOC; +35); `useEffect`
SQL path; `toProcessMap` adapter; fallback semantics.

**Findings:**

1. **PASS — Direct SQL pattern correct.** `getDB().prepare(SELECT ... ORDER BY
   created_at DESC LIMIT 1)` returns the most recent `process_atom_output`
   event. `stmt.step()` then `stmt.getAsObject()` is the standard sql.js
   read pattern. Statement freed in `finally` block — no leak across
   mode switches.
2. **PASS — JSON parse guarded by shape check.** `if (p.phases && p.sprints
   && p.waves)` prevents `toProcessMap()` from being called with
   undefined-required fields. Optional fields (`agents`, `rationale`) get
   `?? []` / `?? ''` defaults.
3. **PASS — Sample fallback always present.** `activeMap = liveMap ??
   HEY_BRADLEY_SAMPLE_MAP`. Page never blank-states even on fresh DB
   without any Planning history.
4. **PASS — Fire-and-forget try/catch never throws upward.** Any sql.js
   error logs `console.warn` only; component continues to render with
   sample fallback. Mirrors ADR-126 D4 write-side discipline applied
   to read side.
5. **PASS — `useEffect([])` dependency array** runs once on mount.
   No re-fetch loop; no infinite render risk. Fresh DB writes from
   PlanningChatBar will surface on next Agentics mount, not live —
   acceptable for v2.0.0-RC1 scope.

**LOC:** R2 section ~27 LOC.

---

## R3 — Security / BYOK Trust Boundary

**Verdict:** PASS

**Scope reviewed:** All Wave 1 changed files for `sk-*` / `AIza*` / `apikey` /
`api_key` shapes; new persistence sites; redaction discipline.

**Findings:**

1. **PASS — Zero `sk-*` shapes added in Wave 1 surfaces.** `grep -nE
   "sk-[A-Za-z0-9]" src/pages/Welcome.tsx src/pages/Onboarding.tsx
   src/pages/Agentics.tsx src/components/planning/ProcessMapSVG.tsx
   src/index.css src/contexts/persistence/migrations/005-comprehensive-logs.sql`
   returns 0 matches.
2. **PASS — Zero `AIza*` (Google API key) shapes** in any Wave 1 surface.
3. **PASS — Zero `api_key`/`apikey`/`byok_key` columns added** to migration
   005 SQL. CF#12 INTENT_FUTURE block is comment-only — no schema change.
   BYOK trust boundary per ADR-043 + ADR-114 D3 intact.
4. **PASS — Agentics live-wire reads `event_data` only** — never reads
   `redacted_keys` field, never persists key shapes. The `process_atom_output`
   event_type carries process map JSON (phases/sprints/waves), not LLM
   response payloads where keys could leak.
5. **PASS — Fire-and-forget `console.warn` on error.** Does NOT throw
   upward into React render path; cannot create DoS surface from corrupt
   `event_data` JSON.

**LOC:** R3 section ~25 LOC.

---

## R4 — Architecture / KISS

**Verdict:** PASS

**Scope reviewed:** LOC caps; new dependency check; pattern reuse;
Decision-trail integrity.

**Findings:**

1. **PASS — LOC caps respected.**
   - Agentics.tsx 263/270 cap (margin: 7 LOC).
   - Welcome.tsx 254 LOC (1:1 swap delta from P101 baseline; no cap defined,
     additive-zero).
   - Onboarding.tsx 893 LOC (1:1 swap delta; ~70 LOC reduction net via
     consolidated `style={{}}` blocks).
   - index.css +36 LOC additive (no cap; mode-independent tokens only).
   - ProcessMapSVG.tsx 218 LOC (no cap change; status arms line-replace).
   - Migration 005 +10 LOC comment block (cap N/A; SQL comments inert).
2. **PASS — Zero new dependencies.** `package.json` unchanged. No
   `react-markdown` / `marked` / `remark` / `framer-motion` / animation lib
   imports added.
3. **PASS — Pattern reuse over invention.** Agentics live-wire mirrors
   ADR-126 fire-and-forget. Token migration mirrors ADR-087 design-token
   discipline. CF#11 status tokens consume the same `var(--hb-*)` syntax
   established at P65 / OC-2.5.
4. **PASS — ADR cross-ref chain intact.** ADR-132 cross-refs ADR-087 +
   ADR-091 + ADR-116 + ADR-117 + ADR-126 + ADR-127 + ADR-131 — every
   touched architectural decision named.
5. **PARTIAL → noted, not blocking — CF#9 + CF#10 deferred.**
   `phase-102/01-cf-closure-report.md` documents the LOC + risk rationale.
   Acceptable per ADR-131 §3 carry-forward registry pattern.

**LOC:** R4 section ~35 LOC.

---

## Composite Verdict

| Reviewer | Verdict | Blocker findings | Notes |
|----------|---------|------------------|-------|
| R1 UX | PASS | 0 | 1 minor (DomainModelSVG token holdout — CF#9 deferred) |
| R2 Functionality | PASS | 0 | All 5 trace steps clean |
| R3 Security | PASS | 0 | BYOK trust boundary intact; 0 key shapes |
| R4 Architecture | PASS | 0 | 1 noted (CF#9+CF#10 carry forward) |

**Result:** 4/4 PASS, zero blockers. P102 / OC-POLISH-W5 cleared for seal.
ADR-132 §3 persona acceptance gate met (composite 86.7 ≥ 85, 0/3 floor breaches).
v2.0.0-RC1 ready.

**Honest deferrals named (NOT papered):** CF#9 SVG legend strips · CF#10
useChatPipeline hook · CF#4 live LLM smoke (owner) · CF#5 STT calibration (owner).
