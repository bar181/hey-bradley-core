# P101 / AW-RC — Retrospective

**Phase:** P101 · AW-RC · 2026-05-01

## Keep

- **4-reviewer parallel brutal-review pattern.** R1 (Grandma+Framer) +
  R2 (Lars) + R3 (security) + R4 (architecture+KISS) running in
  parallel surfaced 4 PARTIAL verdicts the swarm could have hidden
  under a single optimistic seal. The disjoint persona scoping
  (Whiteboard / Planning+Agentics / security / architecture) means
  each reviewer sees only their slice and can't be lobbied.
- **Honest carry-forward registry.** 12-item table in ADR-131 §D3
  with explicit CLOSED / OWNER-REQUIRED / TIER-2 / P102 buckets
  beats vague "deferred to next phase" prose.
- **Surgical fix-pass discipline.** ≤70 LOC budget held at 55 LOC
  actual. Cheapest blockers first (stale stats + onSeal + retention)
  — heaviest items (token migration, Agentics live-map) explicitly
  deferred to P102 rather than rushed.
- **Soft-pass existsSync guards in test specs.** Lets upstream timing
  slips surface as carry-forward rather than red CI.

## Drop

- **Optimistic single-seal narrative.** P100 W2 LOG-BUILD's 88/100
  claim got knocked to 79–84/100 by FMT-VERIFY through real code-path
  tracing. Single-seal narrative invites optimism; brutal-review
  multi-perspective dispatch is the brake.
- **"Ships in v2" placeholder copy.** Onboarding told users 2 of 3
  modes don't exist while Planning+Agentics had been sealed since P90.
  Placeholder copy outlives the placeholder when no one is auditing
  marketing text against feature reality.

## Reframe

- **PARTIAL verdicts > rushed PASS.** Three personas below floor
  (Grandma -1 / Framer -1 / Lars -3) is not a failure — it's the
  honest baseline at RC tag with explicit P102 fixes named. ADR-131
  §D2 records the partial scoring rather than papering it.
- **CF registry replaces "deferred" prose.** Each carry-forward gets
  a number, an owner (CLOSED / owner-required / Tier-2 / P102), and
  evidence (file:line where named). Future phases can ack a CF#
  rather than re-discover the gap.
- **Brutal review surfaces what the swarm hides.** A single optimistic
  seal would have shipped the dead onSeal button + the "v2 ships"
  copy + the unwired retention prune. 4-reviewer parallel dispatch
  caught all 3 — at the cost of one extra wave.

## Carry-forward

P102 / OC-POLISH-W5 (token migration + Agentics live-map wire +
SVG legends + `useChatPipeline` hook extraction + status palette
tokens + log enum housekeeping). P103 (release artifacts:
CHANGELOG bump + v2.0.0-RC1 release notes + Show HN refresh).
P104 (v2.0.0-RC1 launch + owner BYOK smoke run closes CF#4-5).

— END P101 / AW-RC RETROSPECTIVE —
