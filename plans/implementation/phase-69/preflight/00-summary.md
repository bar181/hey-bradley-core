# P69 / OC-5 — Mobile Redesign

> **Phase:** P69 · **Sprint:** OC-5 (P1) — UNBLOCKED at last
> **Date:** 2026-05-01
> **Predecessor:** P67c sealed at `8d46ddf` (626 GREEN, mobile polish 8.5 estimated)
> **Companion:** P68 / OC-4 (Templates Round 2) running in parallel
> **ADR-090** previously reserved; A5 writes it FIRST as the gate

---

## Owner-locked UX decisions (5)

| # | Decision |
|---|---|
| 1 | Single surface + inline mic button |
| 2 | Pre-filled prompt, straight to chat |
| 3 | Bottom sheet for specs (swipe up, always reachable) |
| 4 | Full screen listen mode, large centered mic |
| 5 | Marketing site mobile = separate sprint later |

---

## Sequential dispatch — A5 first, then A6/A7/A8 parallel

### A5 — ADR-090 (Mobile UX Architecture)
**File:** `docs/adr/ADR-090-mobile-ux-redesign.md` (≤120 LOC)
**Gate:** A6/A7/A8 cannot dispatch until A5 lands

Captures 5 decisions verbatim with bounded-context impact + acceptance gates. NO code.

### A6 — Single chat surface + inline mic
**Owns:** `src/components/shell/MobileLayout.tsx` (heavy redesign; 188 LOC → ~120 LOC after removing 3-tab nav)

Replace 3-tab nav with single chat interface. Inline mic button on right side of input. Mic tap → transitions to listen mode (renders MobileListenFullscreen overlay from A7). Mic hold → push-to-talk.

### A7 — Listen fullscreen + spec bottom sheet
**Owns:** `src/components/shell/MobileListenFullscreen.tsx` (NEW) + `src/components/shell/MobileSpecBottomSheet.tsx` (NEW)

- ListenFullscreen: large centered mic, transcript below, Done button
- SpecBottomSheet: drag handle; half-open peek (AISP trace + export); full-open read (human spec + AISP + history + export)

### A8 — First-run + pre-filled prompt + tests + EOP
**Owns:** `src/components/shell/MobileFirstRunCard.tsx` (EDIT, surgical) + NEW `src/components/shell/MobilePreFilledPrompt.tsx` + tests + EOP docs

- First-run pre-filled prompt: "Try: make me a site about..."
- Personality pill above input on first load (disappears after first send)
- `tests/p69-oc5-mobile-redesign.spec.ts` (≥15 cases against ADR-090 decisions)
- session-log + retrospective + CLAUDE.md update

---

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs (Tailwind transitions + browser CSS only for bottom-sheet drag — `touch-action: pan-y` + `transform`)
3. NO new CSS files
4. Preserve `md:hidden` wrapper (mobile-only)
5. Existing P66/A3 mobile first-run kv flag preserved
6. NO breaking ChatInput orchestrator (mobile + desktop share state via stores)
7. Marketing site mobile NOT in scope (decision 5)
8. NO shell commands

## Acceptance gates
- ADR-090 Accepted
- MobileLayout single-surface chat + inline mic
- MobileListenFullscreen + MobileSpecBottomSheet exist
- Pre-filled prompt + personality pill on first run
- 15+ Playwright tests against ADR-090 decisions
- tsc clean
- Cumulative ≥660 GREEN (after both OC-4 + OC-5 land)

---

## Successor
OC-CLEANUP / OC-12 live-LLM / Polish Wave 4 (final 0.1 to library 8.5).
