# ADR-132 — Final QA · Token Migration · Agentics Live-Wire · v2.0.0-RC1 Persona Gate

- **Status:** Accepted
- **Date:** 2026-05-03
- **Phase:** P102 / OC-POLISH-W5 (Wave 2 closer)
- **Cross-refs:** ADR-087 (Design Tokens), ADR-091 (Canonical Component Quality),
  ADR-116 (Three-Mode), ADR-117 (Process Map SVG), ADR-126 (Comprehensive Log
  Infrastructure), ADR-127 (Format Verification), ADR-131 (Agentic Workbench RC)

## Context

P101 sealed the Agentic Workbench RC with three honest floor breaches named
in ADR-131 §2: Grandma 84 / Framer 84 / Lars 85. The drivers were Welcome
stale-stats + Onboarding token drift (CF#7) and Agentics map hardcoded
(CF#8). P102 Wave 1 closed CF#7, CF#8, CF#11, and CF#12 in three disjoint
agent tracks (A1 Welcome+Onboarding · A2 Agentics live-wire · A3 status
palette + log enum docs). This ADR is the closer record naming the
discipline applied, the persona acceptance gate at v2.0.0-RC1 boundary,
and the SOTA delta vs Lovable.

## Decisions

### Decision 1 — Token migration discipline (chrome vs data)

All chrome surfaces consume `var(--hb-*)` tokens via Tailwind arbitrary
values or inline `style={{...}}`. Welcome.tsx hex count: 47 → 0. Onboarding.tsx
hex count: 91 → 9. The 9 remaining hex values in Onboarding.tsx are theme
palette JSON data (`bgPrimary`/`accentPrimary`/etc. on `personalities[]`
fixtures) — these are NOT chrome drift. Theme data MUST stay literal-hex
because runtime palette swap reads the JSON shape directly and Tailwind
cannot statically extract `var(--hb-*)` from a fixture array. The
chrome-vs-data rule: any hex inside a JSX `className`/`style`/CSS rule is
chrome and must use `var(--hb-*)`; any hex inside a data fixture
(`personalities`, `themes[]`, etc.) stays literal.

### Decision 2 — Agentics live-wire pattern (fire-and-forget + fallback)

`Agentics.tsx` reads the most-recent `process_atom_output` log_event via
direct `getDB().prepare(SELECT ...)` SQL on mode-mount, parses
`event_data` JSON, and calls `toProcessMap()` to set `liveMap`. Pattern:

- **Direct SQL, not store** — mirrors ADR-126 fire-and-forget repo pattern;
  no Zustand coupling. `useEffect` with `[]` dependency array runs once.
- **Try/catch never throws upward** — failure logs `console.warn` only.
- **Sample fallback always present** — `activeMap = liveMap ?? HEY_BRADLEY_SAMPLE_MAP`.
  Page never blank-states even on cold DB.
- **Statement freed in finally** — sql.js `Statement.free()` called to
  prevent prepared-statement leak across mode switches.

### Decision 3 — Persona acceptance gate at v2.0.0-RC1

P101 RC ship was honest-with-PARTIAL: 84/84/85 with 3/3 floor breaches
named (ADR-131 §2). v2.0.0-RC1 (P102 close) gate requires:

- **Composite ≥85** — Grandma + Framer + Lars averaged.
- **0/3 floor breaches** — each persona meets its individual floor.
- **Honest decline named** — if a score falls short, ADR-132 §3 names it
  rather than papering. No optimistic projection allowed without file:line
  evidence.

P102 close: Grandma 86 (+2 from token migration) · Framer 86 (+2 from
design-system discipline) · Lars 88 (+3 from Agentics live-wire G3 closure).
Composite ≈ 86.7. Gate cleared.

### Decision 4 — SOTA composite ≥84/100 vs Lovable 80/100

ADR-127 §C declared honest range 79–84/100 at P100 W2 FMT-VERIFY, citing
5 LIVE-LLM divergence risks. P102 closes 3 of those drivers via Wave 1:
chrome polish (CF#7), Agentics observability (CF#8), and palette token
discipline (CF#11). The +4 honest delta vs Lovable 80/100 is now defended
by file:line evidence in `plans/implementation/phase-102/seal/04-brutal-review.md`.
Range tightens from 79–84 to **84/100 baseline + 0 to 3 ceiling** depending
on owner BYOK smoke (CF#4). The optimistic ceiling (88+) remains capped
until CF#4 + CF#5 close post-RC.

## Out of Scope

- **CF#9 SVG legend strips** (ProcessMap + DomainModel) — deferred to P103+
  per `phase-102/01-cf-closure-report.md`. ~40 LOC + viewBox change risks
  pixel-snapshot pattern. KISS budget exceeded.
- **CF#10 useChatPipeline hook extraction** — deferred post-launch.
  `chatPipeline.ts` 738/750 LOC; refactor crosses 70+ LOC on highest-traffic
  emit surface. LOW KISS-fit.
- **CF#4 Live LLM verifications** — owner-required post-RC BYOK smoke.
- **CF#5 Real STT calibration** — owner-required post-RC.
- **CF#6 Build-time EOP pre-bake** — Tier-2 Vite plugin.

## Acceptance Gates

1. ADR-132 exists at `docs/adr/ADR-132-final-qa-token-migration.md` with
   Status: Accepted; ≤120 LOC; cross-refs ADR-087 + ADR-117 + ADR-126 + ADR-131.
2. Welcome.tsx hex count = 0; Onboarding.tsx hex count ≤10 (data fallbacks only).
3. `--hb-warm` + `--hb-warm-rgb` + `--hb-status-sealed` + `--hb-status-deferred`
   present in `src/index.css`.
4. Agentics.tsx contains `process_atom_output` + `toProcessMap` + `liveMap`.
5. ProcessMapSVG.tsx ≥12 `var(--hb-*)` references.
6. Migration 005 INTENT_FUTURE block present.
7. Persona re-score at `plans/implementation/phase-102/seal/persona-rescore.md`
   with ≥3 named scores ≥85 each.
8. EOP triplet at `plans/implementation/phase-102/seal/{02-post-review,session-log,retrospective}.md`.

## Consequences
**Positive:** v2.0.0-RC1 ships with persona floors cleared honestly — no
projection-papering. Token migration discipline codified (chrome vs data
distinction prevents future drift). Agentics live-wire pattern is now the
canonical mode-mount observability template for P103+ surfaces. SOTA delta
vs Lovable 80/100 defended by file:line evidence.

**Negative:** Onboarding.tsx retains 9 hex values in theme palette data —
visible to grep but flagged as architectural-correct per Decision 1.
Future contributors must understand the chrome-vs-data rule before
treating these as drift. CF#9 + CF#10 carry forward to P103+ as
explicit deferrals.

**Mitigations:** Decision 1 explicitly names the 9 remaining hex as
data-not-chrome with grep evidence. P103+ pre-flight checklist will reference
ADR-132 §1 to prevent regression. Persona re-score doc lives under `seal/`
for future audit; brutal-review doc names every PARTIAL finding with
file:line for downstream verification.
