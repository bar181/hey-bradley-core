# P102 — Persona Re-Score (Wave 2 closer; A4 owns)

**Date:** 2026-05-03 · **Phase:** P102 / OC-POLISH-W5
**Anchor:** ADR-131 §2 floor breaches (Grandma 84 / Framer 84 / Lars 85)
**Closure target:** ADR-132 §3 (composite ≥85, 0/3 floor breaches)

Re-scoring weighs A1+A2+A3 self-projections (+2/+2/+1) against own brutal-review
evidence in `04-brutal-review.md`. Conservative: do NOT exceed A1's projection
unless file:line evidence supports a higher mark.

---

## 1. Grandma — 86/100 (was 84; +2 — floor 85 cleared)

**Floor:** ≥85 (per ADR-131 §2). **Result: PASSED.**

- Welcome.tsx: 47 → 0 hex. Marketing surface reads consistently on dark/light
  chrome via `--hb-paper`/`--hb-ink`/`--hb-warm` tokens. Verified
  `grep -c "#[0-9a-fA-F]\{6\}" src/pages/Welcome.tsx` → 0.
- Onboarding.tsx: 91 → 9 hex (94% reduction). The 9 remaining are theme
  palette JSON data fallbacks per ADR-132 §1 — architectural-correct, not drift.
- `src/index.css` +36 LOC: `--hb-paper-soft` / `--hb-paper-tile` / `--hb-warm-rgb` /
  `--hb-mkt-text` family / `--hb-crimson-deep`.

**Why not 88+:** Grandma weights mobile + first-impression clarity. Welcome
stale-stats truth-up already credited in 84 baseline. The +2 is token hygiene,
felt indirectly via cross-mode consistency.

## 2. Framer — 86/100 (was 84; +2 — floor 85 cleared)

**Floor:** ≥85. **Result: PASSED.**

- Token roster grew ~15 → 22 mode-independent values. RGB channel-form
  (`--hb-warm-rgb`) enables Tailwind opacity arbitraries.
- Status palette tokens (`--hb-status-sealed`/`-deferred`) close ADR-117 D4
  literal-hex stopgap. ProcessMapSVG now 12 `var(--hb-*)` refs (was 10).
- Marketing gray scale (`--hb-mkt-text-*`) standardizes on-white card surfaces.

**Why not 88+:** Framer weights animation polish. P102 added zero new motion.
CF#9 + CF#10 deferred — both would lift Framer but neither shipped.

## 3. Lars — 88/100 (was 85; +3 — floor 88 cleared)

**Floor:** ≥88 (the only persona with higher floor; PARTIAL at RC ship). **Result: PASSED.**

- Agentics live-wire G3 (CF#8): `Agentics.tsx` reads most-recent
  `process_atom_output` from `log_events` on mode-mount. No more hardcoded
  `HEY_BRADLEY_SAMPLE_MAP` for users with real Planning history.
- Pattern compliance: Direct `getDB().prepare(SELECT ...)` mirrors ADR-126
  fire-and-forget. Try/catch never throws; statement freed in finally;
  sample fallback always present.
- Migration 005 INTENT_FUTURE block (CF#12) documents 5 declared-but-unwired
  event_types — schema discipline Lars rewards.

**Why not 91+:** R1 §6 of P101 brutal-review projected 91 if CF#7+CF#8+CF#9 all
closed. CF#9 deferred — that's the −3 vs optimistic ceiling. CF#4 owner-gated.

---

## 4. Composite — 86.7/100 (was 84.3; +2.4 — gate cleared)

| Persona | P101 | P102 | Δ | Floor | Pass |
|---------|------|------|---|-------|------|
| Grandma | 84 | 86 | +2 | 85 | YES |
| Framer | 84 | 86 | +2 | 85 | YES |
| Lars | 85 | 88 | +3 | 88 | YES |
| **Composite** | **84.3** | **86.7** | **+2.4** | **85** | **YES** |

**Gate verdict:** ADR-132 §3 cleared. v2.0.0-RC1 ships with 0/3 floor breaches.
SOTA delta vs Lovable 80/100: +6.7 composite, defended by file:line evidence
in `04-brutal-review.md`. Honest range per ADR-132 §4: 84/100 baseline +
0 to 3 ceiling pending CF#4/CF#5 owner work.

**Honest deferrals named:** CF#9 + CF#10 (deferred to P103+) cap Framer +
Lars at-or-just-over floor; not papered.
