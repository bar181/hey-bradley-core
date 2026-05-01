# P69 / OC-5 — Retrospective (Mobile UX Redesign)

> **Phase:** P69 · **Sprint:** OC-5 (P1) · **Date:** 2026-05-01
> **Format:** Keep / Drop / Reframe / Carry-forward (standard P-series retro shape)

---

## Keep

- **5 owner-locked decisions, ADR-first.** A5 wrote ADR-090 BEFORE A6/A7/A8 dispatched. The decision matrix in `02-post-review.md` (5×4) made test-gate authoring mechanical. This pattern (decision → ADR → test gate → implementation) compresses review cycles.
- **PURE-UNIT FS+regex test pattern** (P69.1 → P69.6, 30 cases). Continues the P67c lineage: seal-fast, deterministic, no browser bootstrap. Mirrors `tests/p67c-library-polish.spec.ts` exactly.
- **Path-B coordination (zero edit on MobileFirstRunCard).** Render-gate composition kept the kv flags free of cross-component side effects. Documented choice up-front in post-review §3.
- **kv-flag pattern reuse** (`mobile_first_run_seen` + `mobile_prefilled_prompt_dismissed`). Mirrors P66/A3 verbatim — no new persistence concept introduced.
- **Tailwind-only animations.** `transition-all duration-300 ease-out` slide-down on entrance keeps the KISS rule intact. P69.6 enforces this mechanically.

## Drop

- **The original "edit `markMobileFirstRunSeen()` to un-set the prefill flag" path.** Tempting (one-liner) but buries cross-component coupling in a setter. Path B is simpler and more honest about the dependency graph.
- **Inline-style spacing literals** (e.g. `style={{ padding: tokens.spacing[...] }}`). MobileFirstRunCard still uses these (P66/A3 pattern); A8's new file uses Tailwind class tokens (`px-3 py-3 mx-3 my-2`) consistent with the ADR-091 / ADR-095 polish direction.

## Reframe

- **Mobile is its own surface, not a "smaller desktop".** ADR-090 §Context bakes this in. P53 / ADR-076's 3-tab nav was the right *first* mobile pass (it surfaced the friction); P69's redesign is the right *second* pass (it addresses the friction). ADR-076 is now formally **superseded by ADR-090** in the ADR ledger.
- **First-run UX = banner, not landing page.** P66/A3 shipped a 3-card "Listen / Chat / Skip" landing card. P69 keeps the card as the one-shot first-launch intro, then layers the persistent banner (`MobilePreFilledPrompt`) above the chat input on the *second* mobile load. Two kv flags, two distinct UX moments — clean.
- **Personality picker on mobile = pill row, not modal.** Desktop uses `ChatInputPersonalityPopover`. Mobile uses an above-input chip strip. Different surface, different idiom; same `setPersonality` from `intelligenceStore`.

## Carry-forward

These are **explicitly NOT** P69 work and require their own dispatch:

1. **Web Speech wire-up on `MobileListenFullscreen`** — shell-shape only at P69 seal; live STT mirrors desktop `ListenTab` pattern. **Owner:** OC-12 live-LLM sprint.
2. **Drag-gesture polish on `MobileSpecBottomSheet`** — half-open / full-open via CSS `transform`; native pointer-event drag tracking with momentum is the next polish. **Owner:** Polish Wave 4 candidate.
3. **OC-CLEANUP marketing-site mobile (decision 5).** ADR-090 explicitly out-of-scope; future polish sprint. **Owner:** TBD.
4. **Viewport-screenshot tests at 375 / 390 / 428 px.** ADR-090 §Mitigations directed Playwright viewport coverage; P69 ships PURE-UNIT only (FS+regex) for seal-speed. **Owner:** Wave-2 follow-up.
5. **Removal of stale 3-tab `data-testid` references in tests / docs.** ADR-090 §Mitigations enumerated this. P69.2 enforces non-presence in `MobileLayout.tsx`; downstream cleanup is bookkeeping. **Owner:** OC-CLEANUP.
6. **`useChatPipeline` hook extraction** (carry-forward from ADR-095, P67d). Unrelated to mobile shell. **Owner:** P67d when scheduled.

---

## Closing

P69 / OC-5 closes the mobile-shell gap that P67b reviewer-impression flagged at 6/10. ADR-090 supersedes ADR-076 cleanly. 30 PURE-UNIT tests gate the 5 decisions; cumulative target ≥656 (A8 alone) or ≥660 (combined OC-4 + OC-5 land per preflight). Mobile polish 8.5 → 9.0+ estimated, pending viewport-screenshot follow-up.

Owner choice for next: OC-CLEANUP / OC-12 / Polish Wave 4.
