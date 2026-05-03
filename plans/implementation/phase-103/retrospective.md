# P103 — Retrospective

**Phase:** P103 / RC-RELEASE
**Sealed:** 2026-05-03

## Keep

- **Combined-sprint pattern (P102 + P103).** Token migration + live-wire + CF closures + release artifacts + closers all in one ~12-hour window. Worked because each wave's outputs were strictly disjoint: A1 owned Welcome+Onboarding hex, A2 owned Agentics SQLite-read, A3 owned CSS tokens + SQL comment block, B1 owned CHANGELOG+release-notes, B2 owned launch assets, A4+B3 owned ADRs + EOPs. Zero merge conflicts. Pattern reusable for future combined sprints.
- **"Boundary as artifact, not vibe" discipline.** ADR-133 mirrors ADR-109's structure verbatim (ship boundary / scope / Tier-2 / owner tasks / versioning). Future v3-RC1 cites ADR-082 + ADR-109 + ADR-133 as the lineage. Future re-scoping decisions cite the artifact, not memory.
- **Carry-forward registry honesty.** ADR-131 named 12 CFs at P101 seal; P102 + P103 closed 8 of 12 explicitly with file:line evidence; named CF#9 + CF#10 as POST-LAUNCH out-of-budget polish rather than absorbing them silently. The "named, not papered" discipline holds.
- **Owner-task enumeration.** `docs/launch/owner-launch-checklist.md` + ADR-133 D4 give the owner a finite, bounded list. Tag → BYOK smoke → demo video → social posts → beta share → AISP campaign. No "etc.", no "and other launch tasks". Owner work is sized.

## Drop

- **Optimistic projection language.** P102 A1+A2+A3 commit messages had "projection" persona scores (Grandma 86 / Framer 86 / Lars 88). The actual canonical scores belong to A4's ADR-132. B3 used placeholder language ("≥85/≥85/≥88 per ADR-132") instead of asserting numbers; correct call. Future combined sprints: W2 closers should NEVER assert numbers W1 didn't actually verify.
- **Pre-staging temptation.** W1 commit message said "Wave 2 closers (P102/A4 + P103/B3) follow." Resisting the temptation to pre-stage A4/B3 stub files in W1 was correct — clean handoff between waves matters more than commit-count vanity.

## Reframe

- **v2.0.0-RC1 is not "v1 + Agentic Workbench" — it's a paradigm shift.** v1 was a website builder with AISP. v2 is a **spec factory** where the markdown bundle IS the headline output. The Whiteboard mode is preserved for backward-compat; Planning + Agentics are the new center of gravity. Reframe the marketing language: v2 is for builders who want spec freedom + implementation autonomy, not for Whiteboard users who got incrementally more.
- **CF#9 + CF#10 deferral is a feature, not a failure.** Out-of-budget polish that didn't fit a 30-LOC fix-pass would have either bloated W1 or been silently absorbed. Naming them as POST-LAUNCH explicit deferrals is more honest than papering them.
- **Persona floor breaches at v1.0.0-RC1 vs v2.0.0-RC1.** v1 sealed at 88/100 with all floors clear. v2 sealed at composite 79–84/100 with 3 floor breaches at P101 (Grandma 84 / Framer 84 / Lars 85), then P102 lifted to projected 86/86/88. The v2 ceiling is honest about LIVE-LLM divergence risks (ADR-127 §9) that v1 never surfaced because v1's atom suite was smaller. **Lower honest score > higher optimistic score.**

## Velocity note

P102 + P103 combined: ~12 hours wall-clock for a 2-phase release-prep sprint. Per CLAUDE.md velocity calibration: ~6 phases/day = ~4 hours/phase target. P102+P103 came in at ~6 hours/phase — slightly above target, justified by the persona re-scoring discipline + 6-decision ADR-133 + EOP-triplet completeness. Not compressing for vanity-velocity; quality discipline is the brake per the CLAUDE.md effort estimation rule.

## Hand-off to owner

The agent-led work is DONE. The remaining v2.0.0-RC1 release work is enumerated in `docs/launch/owner-launch-checklist.md` and ADR-133 D4. Tag, smoke-test, record, post, share, campaign. Sequence is owner choice; no agent dispatch required.
