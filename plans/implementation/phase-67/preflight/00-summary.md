# P67 / Polish Wave 2 — Preflight (Close 7.3 → 8.5)

> **Phase:** P67 · **Sprint:** Polish Wave 2 (P1)
> **Date opened:** 2026-04-30
> **Status:** OPEN — owner-authorized 5-agent parallel dispatch
> **Predecessor:** P66 Polish Wave 1 sealed at `34699d4` (528/528 GREEN, 7.3/10 score)
> **Mandate:** Professional level = 8.5+; this sprint closes the 1.2-point gap

---

## Wave 2 sub-modules — 5 parallel agents, disjoint files

### A1 — ChatInput decomposition (ADR-093 enforcement target)

**Owns:** `src/components/shell/ChatInput.tsx` (1013 LOC) + 3 NEW files:
- `src/components/shell/ChatInputBar.tsx` — input field + mic button + send
- `src/components/shell/ChatInputQuickActions.tsx` — quick reference buttons + history panel
- `src/components/shell/ChatInputPersonalityPopover.tsx` — personality inline selector

**Plus collision-resolution:** A4's "personality popover smooth fade-in (transition-opacity duration-150)" lands inside `ChatInputPersonalityPopover.tsx` — A1 owns it.

**Acceptance:** ChatInput.tsx orchestrator <250 LOC; all 3 new files exist; all exports unchanged; existing tests still pass.

### A2 — Builder UX sweep + collapse animation

**Owns:** all 17 SectionSimple files + QuickAddPicker.tsx + delete-confirmation pattern.

`SectionSimple.tsx` already has the collapse-by-default pattern from P66/A5. A2 sweeps the same pattern across the 16 OTHER editors:
- BlogSectionSimple, CTASectionSimple, DividerSectionSimple, FAQSectionSimple, FeaturesSectionSimple, FooterSectionSimple, GallerySectionSimple, ImageSectionSimple, LogosSectionSimple, NavbarSectionSimple, PricingSectionSimple, TeamSectionSimple, TestimonialsSectionSimple, TextSectionSimple, ValuePropsSectionSimple, plus SectionHeadingEditor (header pattern reference)

Plus:
- Consistent header across all editors: section name + type badge + delete button
- Inline "Are you sure?" delete confirmation (no modal)
- QuickAdd empty state when no sections added
- **Collision-resolution:** A4's "Section collapse/expand smooth height transition (transition-all duration-200)" lands inside this sweep — A2 owns it.

### A3 — Marketing + CTA consistency + nav

**Owns:** `src/components/MarketingNav.tsx` + 7 marketing pages (`OpenCore.tsx`, `AISP.tsx`, `Research.tsx`, `About.tsx`, `HowIBuiltThis.tsx`, `Docs.tsx`, `BYOK.tsx`) + Welcome.tsx (already done; verify).

Tasks:
- Every page: exactly ONE primary CTA "Try the open source version →" + ONE secondary "Explore AISP →"
- Add `/demo/listen` + `/demo/chat` links to MarketingNav
- LLM banner consolidation: keep banner in Onboarding only; remove duplicates if found in Builder / chat surfaces (Onboarding is canonical entry point for first-time setup)
- Social proof bar: verify HEADLINE_STATS reflects current (528 tests, 91 ADRs, 61/80) — bump if needed in `src/data/progress-eval.ts`

### A4 — Animation polish (orthogonal scope only)

**Owns:** `src/components/shell/MobileFirstRunCard.tsx` + `src/demos/ListenModeDemo.tsx` + `src/demos/ChatModeDemo.tsx`.

Tasks (3, all orthogonal — no collision with A1/A2):
- MobileFirstRunCard: slide-up entrance (Tailwind `transition-transform duration-300 translate-y-4 → translate-y-0` on mount)
- ListenModeDemo: realistic inter-step pause timing (already has step durations; may need an extra "thinking" beat between steps — 600-800ms blank pause)
- ChatModeDemo: typewriter speed calibration (currently 35ms/char; tune to 28-40ms/char range with slight randomness for human feel — keep deterministic enough that tests still pass)

### A5 — ADR-093 + tests + EOP closer

**Owns:**
- `docs/adr/ADR-093-component-decomposition-standard.md` (NEW; ≤120 LOC)
- `tests/p67-polish-wave2.spec.ts` (NEW; ≥15 cases)
- `plans/implementation/phase-67/{02-post-review.md, session-log.md, retrospective.md}`

ADR-093 captures: file-size cap (≤300 LOC for non-canonical components, ≤200 LOC for canonical), 1-component-per-file rule, decomposition trigger threshold (file >700 LOC = decompose).

Tests assert (≥15 cases):
- ChatInput.tsx ≤250 LOC
- ChatInputBar / ChatInputQuickActions / ChatInputPersonalityPopover all exist
- 17 SectionSimple files all contain `useState` + `aria-expanded` (collapse pattern propagated)
- Demo routes `/demo/listen` + `/demo/chat` referenced in MarketingNav.tsx (or NavLinks somewhere)
- `Try the open source version` string appears in 4+ marketing pages
- `Explore AISP` string appears in 4+ marketing pages
- LLM banner key (`hb-onboarding-llm-banner-dismissed`) only appears in Onboarding.tsx (consolidation check)
- HEADLINE_STATS shows `testsGreen: 528` (or current) and `adrsAccepted: 91` (or current; bump if needed)
- ADR-093 ≤120 LOC, Status: Accepted, refs ADR-091 + ADR-092

---

## Hard rules (all 5 agents)

1. NO new dependencies. NO library imports.
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs.
3. NO new CSS files. Tailwind only.
4. NO copy changes (CTAs are owner-supplied verbatim).
5. NO breaking JSON config contract or section-renderer behavior.
6. NO touching files outside owned list.
7. NO shell commands inside agents.
8. TypeScript-strict.

---

## Acceptance gates

- A1: ChatInput.tsx ≤250 LOC; 3 new files exist
- A2: 17 SectionSimple files all collapse-by-default; consistent header + inline delete-confirm
- A3: 7 marketing pages have CTA + nav consistency; demos linked
- A4: 3 animation polish items shipped (mobile slide-up + listen pause + chat typewriter)
- A5: ADR-093 Accepted; ≥15 tests passing; EOP artifacts written
- Cumulative: 528 + 15+ = 543+ GREEN; tsc clean; adjacent regression GREEN

---

## Successor

OC-4 Templates Round 2 (healthcare + non-profit + search) OR OC-5 Mobile UX (blocked on owner UX-spec) OR Polish Wave 3 if score < 8.5.
