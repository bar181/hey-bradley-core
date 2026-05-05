# P110 / ADR-EXPORT — Retrospective

> **Sprint:** ADR-EXPORT · **Sealed:** 2026-05-04
> **Predecessor:** P109 sealed at `09d0327`

## What to keep

- **2-agent disjoint-scope parallel + 1 closer pattern.** A1 owned `tests/architecture-invariants.spec.ts` + `scripts/adr-lint.ts`; A2 owned `src/contexts/specification/exportClaudeCode.ts` + `src/contexts/specification/types.ts`. Zero file-level overlap. Closer A3 added ADR-138 + p110 spec + EOP triplet + CLAUDE.md sync without touching A1/A2 outputs (commits `34f973a` + `ca662c8` immutable). Same shape as P107 / P108 / P109. Repeatable cadence.
- **Inversion-of-control for pure-module hooks.** P110 / A2 added a third callback to `buildClaudeCodeBundle` — `readAdr?: (id) => string | null`. Same IoC pattern P107 / ADR-135 used for `onEmit?` against the same module. Proves pure modules can grow side-effect hooks (observability, fs reads) without breaking atom purity (ADR-122 D1 + ADR-134) — caller supplies the side-effect; module stays declarative. The pattern is now reusable for any future "embedded resource" need (e.g. inline images, inline test fixtures).
- **Architecture invariants encoded as Playwright assertions.** A1 promoted ~10 ADRs from documentation discipline to CI-enforced fitness functions. The spec uses `test.skip()` soft-pass when the dependency surface is absent (`dist/` pre-build, `personalityEngine.ts` not yet on disk in a fork) so the regression baseline isn't broken — but HARD-asserts when the surface exists. Mirrors ADR-094 brutal-honest review pattern.
- **Pre-commit ADR-lint as advisory-by-default + block-when-wired.** A1's `scripts/adr-lint.ts` runs in two modes: advisory (`node scripts/adr-lint.ts`) prints the file → ADR mapping but never blocks; pre-commit (`--commit-msg <path>`) enforces ADR citation in the commit body. The owner wires the strict mode by appending one line to `.husky/pre-commit`. Additive — old commits not retroactively gated; new commits enforce.
- **Bundle as complete externalization of the workbench.** Pre-P110 the export bundle was a leaky abstraction — workbench showed DDD + ADR text + impl plan + TDD scaffold; bundle showed only stub links. P110 closes the gap: a downstream consumer reads one `.md` and sees the same surfaces the workbench user saw. Spec-factory framing reinforced.

## What to drop

- **Documentation-only ADR enforcement.** Pre-P110 the convention "cite the governing ADR in the commit message" relied on reviewer memory. Post-P110 the lint rule table catches "you touched `migrations/*.sql` without citing ADR-040" before the commit lands. Reviewer cycles compress.
- **Bundle file count baseline 6 (ADR-122 D4).** Replaced by ≥10 (ADR-138 D1) — the 6-file baseline was correct at P96 but the workbench surface grew 4 visible artifacts (DDD prose, ADR text, enriched plan, TDD scaffold) without the bundle catching up. Future bundle-completeness reviews should compare workbench surface area vs bundle file count at every ADR addition.
- **Manual hex-literal + dependency ceiling tracking.** ARCH.2 + ARCH.8 invariants now encode the P110 baseline as hard ceilings (240 hex, 54 deps); raising either requires a successor ADR with cost-benefit. Eliminates the "drift by 1 line at a time" failure mode.

## What to reframe

- **The "12 invariants" name is a floor, not a cap.** A1 shipped 12 because they were the highest-leverage P110 candidates — bundle ceiling, atom purity, BYOK redaction, secret-shape columns, LLM SDK confinement. The pattern is open-ended: any "X is the rule" ADR can grow a fitness-function assertion at the same sprint, not three phases later. ADR-100 → P109 drift-guard was the precedent; ARCH.1-12 generalises it.
- **Pre-commit hook wiring is owner-required, not blocked.** Sandbox restrictions prevent agent-side `.husky/` edits — but the owner pastes one line and the hook activates. This is the same shape as CF#4 BYOK live-LLM smoke ($0.05) + CF#5 STT calibration: owner-attestation work that does NOT block agent sealing. Documented in ADR-138 D3 and ARCH.11.
- **The export bundle is now ~50% of Hey Bradley's product surface.** Pre-P110 the bundle was an export afterthought; post-P110 it is the canonical externalization the consumer reads. Future bundle additions (e.g. AISP-Σ unparsed source, ProcessAtomOutput JSON dump for round-trip) should be evaluated at the spec-factory framing — does the consumer NEED this in their repo? If yes, add a logical file; if no, the workbench-only surface is correct.

## Velocity note

P110 estimated 3-4 hours per the post-P109 priority-list table; actual elapsed was ~2 hours from preflight commit (`5bdbcd5`) through Wave 1 (commits `34f973a` + `ca662c8`) to seal. Consistent with the velocity-corrected estimate. Two-agent disjoint-scope dispatch held — zero merge conflicts, zero cross-agent rework. Closer pattern (ADR + test spec + EOP + sync) ~45 min including 1 KISS-test fix (denylist scoped to NOT-pre-existing deps per P105.7 precedent — `jszip` is baseline for sprint-N share-spec archive).

## Quality discipline

- ADR-138 ≤ 120 LOC cap → 55 LOC actual.
- 4-decision structure (D1 export completeness / D2 invariants / D3 pre-commit lint / D4 backward compat) per multi-deliverable closer cadence.
- Cross-refs span 11 ADRs: ADR-102 + ADR-122 + ADR-126 + ADR-128 + ADR-134 + ADR-135 (primary) + ADR-043 + ADR-047 + ADR-073 + ADR-110 + ADR-116 + ADR-118 + ADR-044 + ADR-087 (secondary).
- Both tsc strict configs clean after Wave 1 commit (`ca662c8`); closer adds zero source code.
- KISS — no new dependencies (Node stdlib only for adr-lint; markdown bundle stays zero-dep).
- 17 net new GREEN p110 cases + 12 architecture invariants = 29 net new cases at this anchor.
- 268 cumulative regression (≥252 target).
- Pre-commit hook addition documented for owner action (ARCH.11 + ADR-138 D3); sandbox-blocked from auto-wire.
- Backward-compat preserved: `buildClaudeCodeBundle(phase, slug?, onEmit?, readAdr?)` — every parameter past the first is optional; existing 1/2/3-arg callers unchanged.

## Carry-forward

- **Owner: wire `scripts/adr-lint.ts` into `.husky/pre-commit`.** Append `node --experimental-strip-types --no-warnings scripts/adr-lint.ts --commit-msg "$1" || exit 1` after the existing `check-secrets.sh` line. ARCH.11 soft-passes until wired; once wired the assertion goes hard.
- **Tier-2 candidate: build-time `docs/adr/build-readme.ts` script.** Mechanical README rebuild from disk (P109 cadence note) — defer until the next ADR addition reveals stale-README pattern again.
- **Tier-2 candidate: ADR-lint rule table extension.** Current 12 file-pattern → ADR mappings cover the high-leverage cases; future additions could include `src/contexts/persistence/repositories/*` → ADR-016 + ADR-126, `tests/architecture-invariants.spec.ts` → ADR-138 (self-reference), etc. Defer until violations surface.

## Handoff

P110 closes 2 distinct architectural gaps (export bundle completeness + ADR enforcement) in one sprint via 2 parallel disjoint-scope tracks plus a closer ADR. The 12 architecture-invariants spec promotes ~10 ADRs from documentation to CI-enforced fitness functions. The bundle is now a complete externalization of the SpecWorkbench surface. ADR-lint runs advisory by default and strict when the owner wires it. Open-core remains owner-runnable; the pre-commit hook + ADR-lint + invariants suite catches drift before merge. Future agent sprints (if any) would land on owner request.
