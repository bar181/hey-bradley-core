# P126 / GO LIVE — Retrospective

> **Scaffold only — fill at end of phase per `human-2.md` directive.**

---

## §1 What shipped

| Feature | Commit(s) | Notes |
|---|---|---|
| F1 — Default template → Hey Bradley | — | — |
| F2a — BYOK hover panel | — | — |
| F2b — Enriched StatusBar | — | — |
| F3 — Chat history tab | — | — |
| F4 — Specs card | — | — |
| F5 — Low-confidence handling | — | — |
| F6 — Live prompt test | — | — |

## §2 ADRs authored

- [ ] ADR-150: BYOK localStorage-only key storage
- [ ] ADR-151: Session chat-history persistence (`hey-bradley-session-log`)
- [ ] ADR-152: LLM confidence threshold convention

## §3 What slipped

(Fill in: features deferred, ADRs deferred, gaps discovered.)

## §4 Completion gates (verbatim from `human-2.md`)

- [ ] Default template is Hey Bradley
- [ ] BYOK panel works with smoke test
- [ ] Chat history logs all event types
- [ ] Specs card shows checklist + button
- [ ] Low-confidence responses with link
- [ ] Live prompt test passes
- [ ] `npm run build` — zero errors
- [ ] Phase audit table in `preflight.md`
- [ ] `session-log.md` updated throughout
- [ ] `retrospective.md` completed at end

## §5 Build / gate snapshot

| Gate | Result | Detail |
|---|---|---|
| `npm run build` | — | — |
| TypeScript strict | — | — |
| `[secrets-guard]` | — | — |
| ARCH invariants 12/12 | — | — |
| ADR-lint | — | — |
| Gzip cap (ADR-102) | — | — |

## §6 Carry-forwards into P127

(Fill in: anything not closed; named with CF-P127-* prefix.)

## §7 Plan correction (feed-forward)

(What would I do differently next time?)

## §8 Verdict

(Seal? Continue? Promote?)

---

*To be completed at phase seal.*
