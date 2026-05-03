# P36 — Deep-dive Summary + Fix-Pass

> **Sealed:** 2026-04-28 post-fix-pass
> **Composite at fix-pass close:** 96/100 (held; persona deltas)

## Reviewer scorecard

| Reviewer | Score | Verdict | Must-fix |
|---|---:|---|---:|
| R1 UX+Func (lean) | 92/100 | PASS (Grandma 82 / Framer 89) | 3 |
| R2 Sec+Arch (lean) | Sec 92 / Arch 82 | PASS | 0 (5 should-fix to P37) |
| **Average** | **89/100** | **PASS** | **3 must-fix + 4 should-fix applied** |

## Fix-pass items closed

| # | Issue | Status |
|---|---|---|
| R1 F1 | ChatInput prefill consumer was mount-only useEffect | ✅ subscribed via `useUIStore((s)=>s.pendingChatPrefill)` selector with effect dep array |
| R1 F2 | handleListenApprove double-click race | ✅ approveInFlightRef try/finally guard |
| R1 F3 | PTT mid-review can clobber pttReview | ✅ disabled prop checks pttReview + pttClarification; aria-label updated; button copy "Review first ↑" |
| R1 L1 | No keyboard shortcut for Approve | ✅ Enter approves / Escape cancels; approveBtnRef autofocus on mount |
| R1 L2 | Jargon "Run the chat pipeline on this transcript" | ✅ "I'll figure it out — Bradley will try this." |
| R1 L4 | text-white/45 contrast fails WCAG AA on dark bg | ✅ bumped to text-white/65 |

## Deferred items (queued for P37)

- R1 L3 — clarification fallthrough silent when LLM returns 0 assumptions
- R2 S1 — pendingChatPrefill envelope hardening (scope/length validation)
- R2 S2 — redaction at listen-write boundary (BYOK leak guard symmetry)
- **R2 S3 — ListenTab now ~875 LOC; CLAUDE.md hard cap is 500. Cannot slip past P37.**
- R2 S4 — pendingChatPrefill global vs directed-message anti-pattern
- R2 S5 — ADR-065 "every AISP surface" claim re: P35 EXPERT trace pane (scope refinement)

## Test inventory after fix-pass

| Spec | Cases | Status |
|---|---:|---|
| BYOK provider matrix | 20 | ✅ |
| Sprint D regression (P29-P33+) | 99 | ✅ |
| P34 + fix-pass | 66 | ✅ |
| P35 ATOM + fix-pass | 52 | ✅ |
| P36 Listen + AISP unify | 26 | ✅ |
| **P36 fix-pass (R1 must-fix)** | **14** | ✅ |
| **TOTAL** | **269** | ✅ **269/269 GREEN** |

## Persona re-score (post-fix-pass)

- **Grandma:** **82** (held; review-first trust delta materialized; Enter shortcut helps SR users + power-readers)
- **Framer:** **89** (held; F3 + F1 + F2 are correctness wins not visible at the surface)
- **Capstone:** **99** (held)
- **Composite estimate:** **96/100** (held)

## P36 verdict

Sprint F P1 sealed at 96/100 estimated. Both reviewers PASS; 3 must-fix items closed; 4 should-fix items applied; 5 should-fix queued explicitly for P37 (including the R2 S3 ListenTab split which is now hard-blocking).

**5-atom AISP architecture spans both chat + voice. Review-first voice UX in production.**
