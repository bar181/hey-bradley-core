# ADR-090 — Mobile UX Redesign

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P69 / OC-5 (Mobile Redesign Sprint, P1)
- **Cross-refs:** ADR-076 (Sprint J P53 mobile 3-tab nav — **SUPERSEDED** by this ADR), ADR-088 (Mode Architecture), ADR-091 (Canonical Component Quality), ADR-094 (Professional Grade Standard), ADR-095 (Library-Wide Polish Standard)

## Context

Sprint J P53 (ADR-076) shipped a 3-tab mobile nav (Builder hidden / Chat / Listen) as the first mobile pass. P67b reviewer-impression audit + competitive analysis flagged the resulting mobile shell as a **6/10** surface — well below the ADR-094 ≥8 per-surface bar. P67c lifted the touched-surface mean to 8.8 but mobile-shell-specific gaps persisted: the desktop tri-pane mental model bled onto mobile, specs were hidden behind tab clicks, first-run required 3+ taps to reach the builder, and listen vs chat was a hard mode switch rather than a fluid interaction. At P67c close the owner reframed the problem: **mobile is its own surface with its own UX language, not a "smaller desktop"**. ADR-090 captures the 5 owner-locked architectural decisions that drive the redesign and gates A6/A7/A8 implementation.

## Decision — 5 owner-locked commitments

1. **Single surface + inline mic.** Mobile renders ONE surface — chat thread + input row. No 3-tab nav. The mic button lives **inline at the right side of the input bar**. Tap mic = transition to fullscreen listen overlay (decision 4); tap-and-hold mic = push-to-talk feel.
2. **Pre-filled prompt straight to chat.** First-run mobile load shows a single chat surface with a pre-filled prompt placeholder (e.g., `"Try: make me a site about..."`). The 5-personality picker pill renders **above** the input on first load and is dismissible after first send. The existing P66/A3 `MobileFirstRunCard` kv flag is preserved as the one-shot mechanism but is consolidated into the chat surface (no separate landing card screen).
3. **Bottom sheet for specs.** Specs are NEVER hidden behind a tab. A "See Specs" affordance is **always visible** at the bottom edge of the chat. Tap → bottom sheet slides up with two states:
   - *Half-open (peek):* AISP atom trace + Export button
   - *Full-open (read):* human spec + AISP + history + Export
   - Drag handle visible at top of sheet; native CSS `transform` + `transition` only (no library, no Framer Motion).
4. **Fullscreen listen mode.** Tapping the inline mic transitions to a full-viewport listen overlay (`z-30 fixed inset-0` above the chat). Large centered mic icon (≥120px), live transcript below the mic, single "Done" button bottom-right. Tap mic again to toggle recording state. Closing returns to the chat surface with the transcript appended as a user message.
5. **Marketing site mobile = separate sprint.** This ADR governs **only** the builder/chat surface mobile shell. The marketing pages (Welcome / OpenCore / AISP / Research / Blog / Progress / Docs) are explicitly out of scope; their mobile pass is a future polish sprint.

## Bounded-context impact (DDD)

Lives within the `ui-shell` bounded context (per ADR-087 DDD doc). Adds 3 mobile-specific aggregates:

- **MobileChatSurface** — replaces the 3-tab `MobileLayout` with a single chat surface (heavy redesign of `MobileLayout.tsx`, A6).
- **MobileSpecBottomSheet** — NEW; drag-handle bottom sheet with half/full-open states (A7).
- **MobileListenFullscreen** — NEW; full-viewport listen overlay (A7).

NO new bounded context. State stays in existing stores: `uiStore.appMode`, `intelligenceStore.personalityId`, `configStore` for spec-bundle access. ADR-090 is a **shell-redesign aggregate** layered alongside ADR-091 / ADR-092 / ADR-093 / ADR-094 / ADR-095; future mobile sprints inherit those quality bars by reference.

## Quality bar (enforced by `tests/p69-oc5-mobile-redesign.spec.ts` at A8)

- `src/components/shell/MobileLayout.tsx` contains **no 3-tab nav references** (`data-testid` for the Builder / Chat / Listen tabs removed; ADR-076 surface deprecated).
- Inline mic button present in the mobile chat input row (`data-testid="mobile-inline-mic"`).
- `src/components/shell/MobileSpecBottomSheet.tsx` exists with drag-handle pattern + half-open and full-open states.
- `src/components/shell/MobileListenFullscreen.tsx` exists with `z-30 fixed inset-0` overlay pattern + ≥120px centered mic.
- Pre-filled prompt placeholder (`"Try: make me a site about..."` literal) appears on first-run mobile load.
- Personality pill rendered above the input on first run; dismissed after first send (kv-flagged, preserves P66/A3 behavior).
- Viewport-specific Playwright tests at **375 / 390 / 428 px** against each of the 5 decisions (≥15 cases total).

## Out of scope

- Marketing site mobile pass (decision 5 — future sprint).
- Real device audit beyond Chromium devtools simulator (decision 5).
- Native mobile app shell (Tier-2 commercial track).
- Per-mode UI variants for Planning / Agentics modes (AW work, separate ADR).
- `useChatPipeline` hook extraction (carry-forward from ADR-095, P67d work — unrelated to mobile shell).

## Consequences

**Positive.** Mobile UX matches the reviewer expectation of "smaller, focused, magical" rather than "smaller desktop". The bottom-sheet pattern proves the spec-layer thesis on mobile — specs are **always reachable, never buried**. The inline mic = zero-mode-switch interaction (tap to enter listen, tap to exit, transcript flows back into the same chat). The pre-filled prompt removes the cold-start staring-at-blank-input problem that the P67b mobile audit flagged. The 5 decisions are mechanically testable, so drift is detectable at CI rather than at hand-review.

**Negative.** Sprint J P53 / ADR-076's 3-tab nav becomes legacy and is formally **superseded** — the `MobileLayout.tsx` rewrite breaks any external test or doc that references the old tab `data-testid`s. Touch-target audits must re-run for the new surfaces (inline mic, drag handle, "See Specs" affordance, fullscreen Done button).

**Mitigations.** A8 ships viewport-specific Playwright tests at 375 / 390 / 428 px against THIS ADR's decisions before the seal; ADR-076 is marked **Superseded by ADR-090** in the ADR ledger; the P69 retrospective enumerates any test or doc references to the removed 3-tab `data-testid`s for follow-up cleanup.
