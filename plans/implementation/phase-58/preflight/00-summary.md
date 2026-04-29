# P58 Preflight — Sprint O: Open Core RC (POST-DEFENSE)

> **Phase title:** Sprint O — Public Release: README/CLAUDE final + Demo Video + Agentics Foundation Beta
> **Status:** PLANNED (post-capstone-defense)
> **Successor of:** P57 (Sprint N — shareable output)
> **Canonical roadmap:** `plans/strategic-reviews/open-core-moat-roadmap.md`

## North Star

> **Hey Bradley ships publicly as the open-core RC.**
> All four moat priorities are visible in the public-facing artifact: speed (P54), spec (P55), premium output (P56), shareable artifact (P57). README rewrites the story around the moat — not around "I built a website builder." Demo video shows side-by-side Hey Bradley vs Lovable. Agentics Foundation beta opens to first 100 users.

This is the closing phase of the moat roadmap. After P58, the open-core arc is complete and the project re-evaluates which deferred items (Sprint G/H/I/J Agentic Support / Tier-2 flagship) to pull into commercial.

## Moat metric (the gate)

| Dimension | Target |
|---|---|
| Public GitHub release tagged `v1.0.0-RC1` | yes |
| README accurately tells the moat story (speed / spec / templates / share) | yes |
| CLAUDE.md final accuracy pass — counts, ADRs, phase ledger truthed | yes |
| Demo video published (Hey Bradley vs Lovable side-by-side) | yes |
| Agentics Foundation beta open to first 100 users | yes (signup form live; first cohort gated) |
| All 4 moat priorities visible in 30s of demo video | yes |

## Scope IN — 3 parallel agents

### A1 — README rewrite + CLAUDE.md final accuracy pass
- `README.md` — rewrite around the moat story:
  - Hook: "the spec layer between idea and code"
  - Speed: latency badge screenshot (P54 artifact)
  - Spec: AISP atom trace screenshot (P55 artifact)
  - Templates: 3-5 premium template gallery (P56 artifact)
  - Share: hosted-link demo (P57 artifact)
  - BYOK + open-core boundary: link to existing `09.post-mvp-open-core.md`
  - AISP cross-link to `bar181/aisp-open-core` (R4 risk mitigation per moat roadmap)
- `CLAUDE.md` — final accuracy pass (counts: ADR total, test total, phase ledger up to P58)
- ≤300 LOC delta across both files

### A2 — Demo video + Agentics Foundation beta launch
- Record Hey Bradley vs Lovable side-by-side demo (~90 seconds)
- Show all 4 moat priorities visibly within 30s of demo start
- Publish to project README + Agentics Foundation site
- Agentics Foundation beta signup form: simple Vercel form → KV row (reuses P57 infra) → first 100 cohort gated
- Demo-video script + raw recording lives in `plans/launch/p58/` (not source code)

### A3 — ADR-081 + final tests + EOP + persona final score
- NEW `docs/adr/ADR-081-open-core-rc.md` (≤160 LOC; full Accepted; cross-refs ALL prior ADRs in moat sequence: 077/078/079/080)
- Final regression: ALL prior PURE-UNIT cases GREEN; cumulative target 450+/450+
- Final persona re-score (Grandma + Framer + Capstone) — gate Grandma ≥85, Framer ≥92, Capstone ≥98
- Manual smoke checklist: BYOK adapters all 5 still work; mobile UX intact; share roundtrip works; AISP trace visible everywhere
- EOP: session-log + retrospective + ROADMAP_NEXT.md scaffold (commercial track planning)

## Locked decisions

- **D1 — `v1.0.0-RC1` semantic version.** Matches north-star §1 PMF version stamp (`product:="Hey Bradley", version:="1.0.0-RC1"`).
- **D2 — Beta cohort gated at 100.** Avoids server-cost surprise on Vercel KV; gives clean telemetry-readiness window for commercial-track planning.
- **D3 — Demo video shows Lovable side-by-side.** Direct comparison earns the moat story credibility; abstract "we have a thesis" loses every demo.
- **D4 — README leads with the moat, not the build journey.** "How I Built This" page already exists for the journey; README is the elevator pitch.
- **D5 — POST-DEFENSE only.** Public release does not happen before capstone defense, period.

## Scope OUT (deferred to commercial)

- Sprint G (Interview Mode), Sprint H (Upload + References), Sprint I remainder (Builder polish), original Sprint J (Agentic Support System) → commercial track planning kicks off in `ROADMAP_NEXT.md`
- Learning flywheel runtime / telemetry / Supabase migration → commercial
- Tier-2 SaaS dashboard flagship → commercial
- AISP conference talks / community growth plan → commercial

## DoD

- [ ] A1 README rewrite + CLAUDE.md accuracy pass landed
- [ ] A2 demo video published; Agentics Foundation beta signup live
- [ ] A3 ADR-081 full Accepted + final regression GREEN
- [ ] Final persona re-score: Grandma ≥85, Framer ≥92, Capstone ≥98
- [ ] Public GitHub release tagged `v1.0.0-RC1`
- [ ] tsc clean; build clean
- [ ] STATE.md final ledger row + CLAUDE.md roadmap updated; ROADMAP_NEXT.md scaffolded
- [ ] All 4 moat priorities (P54/P55/P56/P57) visible in public RC

## Risks

- **R1 — Demo video reveals an unexpected gap.** Mitigation: A2 recording is iterative; re-record after fix-pass if needed.
- **R2 — Beta cohort exceeds 100 fast.** Mitigation: D2 gate; surplus signups join waitlist.
- **R3 — Agentics Foundation beta server cost.** Mitigation: reuses P57 Vercel KV; expected cost <$5/mo at 100 users.
- **R4 — README rewrite conflicts with existing public-website pages (P22).** Mitigation: README is the GitHub face; public website pages are unchanged.
- **R5 — `v1.0.0-RC1` release reveals a regression in personality / mobile / share.** Mitigation: A3 manual smoke checklist + final regression GREEN gate.

## Cross-references

- `plans/strategic-reviews/open-core-moat-roadmap.md` (canonical reframe — Sprint O closes the arc)
- ALL prior moat ADRs: 077 (P54), 078 (P55), 079 (P56), 080 (P57)
- `01.north-star.md` §1 PMF version stamp `1.0.0-RC1`
- `09.post-mvp-open-core.md` (commercial-track boundary; ROADMAP_NEXT.md kicks off here)
- `2026-04-29-product-evaluation.md` §"What would make this an A" recs #6 (ship publicly), #9 (AISP adoption)

P58 is the public-launch phase. After P58, the moat is shipped, the open-core RC is live, and the project pivots to the commercial-track planning loop. Capstone is in the rearview; category positioning is the forward question.
