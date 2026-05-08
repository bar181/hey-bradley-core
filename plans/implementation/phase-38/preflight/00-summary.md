# Phase 38 — Preflight 00 Summary

> **Phase title:** Sprint F P3 — Sprint Close + Presentation Prep
> **Status:** PREFLIGHT
> **Successor of:** P37 (Command Triggers + Route Split; sealed at composite 91)

## North Star

> **Close Sprint F. Run a full 4-reviewer end-of-sprint brutal review on the cumulative P36+P37 work. Lock the presentation readiness report. Ship the Vercel deploy.** No new features land in P38 — this is sweep-up + presentation gate.

## Scope IN

### A1 — Sprint F end-of-sprint brutal review (4 reviewers)
- R1 UX: Grandma ≥81, full voice + chat UX walk
- R2 Functionality: all 35 prompts, all 5 providers, listen → review → approve → update
- R3 Security: BYOK matrix, redaction, import lock, SENSITIVE_TABLE_OPS
- R4 Architecture: all LOC caps met, wiki current, ADRs complete

### A2 — Fix-pass to composite ≥96
Apply must-fix + select should-fix items. Persona re-walk against rubric. Target composite ≥96 (matches P36 ceiling).

### A3 — Presentation Readiness Report refresh
Update `docs/wiki/presentation-readiness.md` with:
- Top 5 demo moments (ranked)
- AISP thesis flow (exact 5-step demo to show)
- Gaps visible during demo (mitigations)
- Slide titles (10-12 slides)
- Owner actions before Day 10:
  - Vercel deploy confirmation
  - Live BYOK test (4 providers × 1 sample query)
  - Slide deck draft
  - Demo rehearsal (≥2 cycles)

### A4 — Owner-gated steps (NOT swarm-executable)
- Vercel deploy
- Live BYOK keys for 4 providers
- Final slide deck approval

## Scope OUT (Sprint G)

- Interview mode (Sprint G P39+)
- Multi-intent parsing (deferred)
- LLM-driven assumption generation (P36-style stubs are sufficient until deploy)
- Carryforward should-fix items deferred from P37 review (R1 L4-L5, R2 L1-L2-L4, R3 L1)

## Carryforward into P38 (from P37)

- R1 L4: `/design`/`/content` half-finished prefill scaffolds (UX polish)
- R1 L5: 35/35 prompt coverage gate honesty (already documented in retro; acceptable)
- R2 L1: command turns bypass audit envelope (decision: defer to Sprint G)
- R2 L2: voice command no confidence floor (defer to Sprint G)
- R2 L4: content-route LLM swap cost-cap parity (ships with content LLM)
- R3 L1: extract `dispatchCommand(cmd)` shared helper (refactor; defer)
- Vercel deploy live URL (owner-triggered)
- Live BYOK 4-provider validation (deferred since P35)

## DoD

- [ ] 4-reviewer Sprint F end-of-sprint review (R1+R2+R3+R4) all PASS
- [ ] Persona re-walk (Grandma / Framer / Capstone) against rubric
- [ ] Composite ≥96 post-fix-pass
- [ ] `docs/wiki/presentation-readiness.md` refreshed
- [ ] STATE.md row + CLAUDE.md roadmap updated
- [ ] Build green; full Sprint D-F regression GREEN
- [ ] **Owner gate:** Bradley reviews presentation readiness report BEFORE swarm proceeds to Sprint G

## Composite target: 96+ (Sprint F close climb)

## Cross-references

- ADR-065 (P36; Listen + AISP unification)
- ADR-066 (P37; Command system + route split)
- `phase-18/roadmap-sprints-a-to-h.md` Sprint F (compressed 4→3 phases)

P38 activates on owner greenlight after P37 seal.
