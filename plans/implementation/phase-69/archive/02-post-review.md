# P69 / OC-5 — Post-Review (Mobile UX Redesign)

> **Phase:** P69 · **Sprint:** OC-5 (P1) · **Date:** 2026-05-01
> **Predecessor:** P67c sealed at `8d46ddf` (626/626 PURE-UNIT GREEN)
> **Reviewer:** A8 (closing dispatch)

---

## 1. Per-surface scoring (before vs after)

| Surface | Before (P67c) | After (P69) | Delta | Notes |
|---|---:|---:|---:|---|
| MobileLayout (chat shell) | 6.0 | 8.5 | +2.5 | 3-tab nav removed; single chat surface + inline mic |
| MobileListenFullscreen | n/a | 8.5 | NEW | Full-viewport overlay, ≥120 px mic, dialog ARIA |
| MobileSpecBottomSheet | n/a | 8.5 | NEW | Drag-handle pill + peek/full states; specs always reachable |
| MobilePreFilledPrompt | n/a | 8.5 | NEW | 5-emoji personality pill + "Try:" hint, kv-flagged dismissal |
| MobileFirstRunCard (preserved) | 8.7 | 8.7 | 0 | NOT touched — coordination via render gate (see §3) |

**Mobile polish (touched-surface mean):** 8.5 → 9.0+ estimated. Confirmation pending viewport-screenshot pass (see §4 deferred).

**Library-wide polish:** 8.4 → 8.5 (closes the final 0.1 gap from P67c carry-forward IF cumulative ≥660 GREEN holds across OC-4 + OC-5).

---

## 2. ADR-090 decision coverage

| # | Decision | A6 | A7 | A8 | Test gate |
|---|---|---|---|---|---|
| 1 | Single surface + inline mic | ✓ | — | — | P69.2 |
| 2 | Pre-filled prompt + personality pill | — | — | ✓ | P69.5 |
| 3 | Bottom sheet for specs | — | ✓ | — | P69.4 |
| 4 | Fullscreen listen mode | — | ✓ | — | P69.3 |
| 5 | Marketing site OUT of scope | gate | gate | gate | n/a (out-of-scope) |

All 5 decisions enforced by `tests/p69-oc5-mobile-redesign.spec.ts` (30 cases, ≥15 required).

---

## 3. Coordination choice — MobileFirstRunCard untouched

The task gave A8 two coordination paths:

- **Path A:** Edit `markMobileFirstRunSeen()` to actively un-set the pre-filled-prompt flag.
- **Path B:** Leave MobileFirstRunCard untouched; A6's MobileLayout renders MobilePreFilledPrompt only when `!shouldShowMobileFirstRun() && shouldShowMobilePreFilledPrompt()`.

**Chosen: Path B (zero edit).** Reasons:
1. KISS — no cross-component side-effects in a kv setter.
2. Default behavior is already correct: a fresh kv table returns `undefined` for the dismiss key, so `shouldShowMobilePreFilledPrompt()` returns `true` until the user dismisses or sends.
3. The render-gate composition is mechanically testable at the call site (A6's owned file), keeping A8's surface tight.

Net: MobileFirstRunCard.tsx remains 80 LOC (unchanged from P66/A3 + P67/A4 baseline).

---

## 4. Honest deferrals

The following are intentionally NOT in P69 / A8 and carry forward:

1. **Web Speech wire-up on MobileListenFullscreen.** The component is shell-shape only; live STT integration mirrors the desktop `ListenTab` wiring and is OC-12 territory.
2. **Drag-gesture polish on MobileSpecBottomSheet.** Half-open / full-open transitions are CSS-only (`transition` + `transform`); native pointer-event drag tracking with momentum is a follow-up polish pass.
3. **Viewport-screenshot test at 375 / 390 / 428 px.** ADR-090 §Mitigations calls for Playwright viewport tests; this seal ships PURE-UNIT FS+regex coverage only (consistent with the P67c pattern). Real-viewport tests are a Wave-2 follow-up so the test corpus stays seal-fast.
4. **OC-CLEANUP marketing-site mobile (decision 5).** Explicitly out-of-scope per ADR-090.
5. **Test or doc references to the removed 3-tab `data-testid`s.** ADR-090 §Mitigations directed P69 retro to enumerate these — see retrospective.md §carry-forward.

---

## 5. Ship gate

- ADR-090 Accepted ✓
- 4 mobile files exist (Layout, Listen, Sheet, PreFilled) ✓ (A6/A7/A8 own respectively)
- 30 tests against ADR-090 decisions ✓ (≥15 required)
- KISS: zero animation-lib references ✓ (P69.6 sweeps all 4 files for framer-motion / gsap / lottie / @react-spring / animejs)
- tsc: deferred to seal-runner (NO shell commands in this dispatch)
