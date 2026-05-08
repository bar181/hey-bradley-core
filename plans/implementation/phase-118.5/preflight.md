# P118.5 / WALKTHROUGH — Preflight

**Mandate:** ship a section-like walkthrough story page at `/walkthrough` per CF-P118-1, gated on owner answers to 4 open questions.

**Owner answers (locked; do not paraphrase):**

- **Q1 Auto-advance:** OFF. Visitor-paced. The story earns the next scene; the timer doesn't.
- **Q2 Scene 1 line:** "I needed a website. By Tuesday." Keep the deadline.
- **Q3 Scene 5 character:** "My nephew." Relatable beats universal.
- **Q4 CTA order:** Start describing → `hey-bradley-core` → `aisp-open-core`.

**Owner additions:**

- Scene 4 changelog reads like a friend talking, not a commit log.
- Scene 6 close line LOCKED: "From your idea to a real site, in your words."
- Brand invisible until Scene 6 (no "Hey Bradley" in Scenes 1-5 prose).
- Mobile-first scroll-snap.
- No numbers / no jargon / no competitor names in body copy.
- ≤220 words total on the page.

## Deliverables (single commit, atomic)

1. `src/pages/Walkthrough.tsx` — ≤220 LOC, default-export component, 6 scroll-snap scenes
2. Route registration in `src/main.tsx` (lazy + Suspense pattern)
3. Three link entry-points wired (Welcome Section 1 / About below personal story / describe-it-see-it.md footer)
4. `docs/adr/ADR-147-walkthrough-story-page.md` — ≤120 LOC, 3 decisions
5. `tests/p118.5-walkthrough.spec.ts` — ≥10 describes, 18+ cases all GREEN
6. EOP triplet at `plans/implementation/phase-118.5/`
7. ADR README + CLAUDE.md sync

## Hard rules

- No new dependencies (KISS denylist per ADR-144 D5)
- ADR-147 ≤120 LOC; Walkthrough.tsx ≤220 LOC; body word count ≤220
- Tests ≥10 describes, 18+ cases all GREEN under chromium
- Both tsc strict configs CLEAN
- Reduced-motion honored on every animated element
- Brand "Hey Bradley" / "heybradley" does NOT appear in Scenes 1-5 prose
- Scene 6 close line LOCKED literal
- Three CTAs in locked order
- Scene 4 changelog: friend voice not commit-log voice

## Cross-refs

- ADR-146 (Simple Messaging) — primary parent; this sprint closes CF-P118-1
- ADR-090 (Mobile UX) — mobile-first scroll-snap honors mobile redesign
- ADR-091 (Canonical Component Quality) — token compliance + focus-visible
- ADR-094 (Professional Grade Standard) — surface ≥8.5 on rubric
- ADR-141 (Storytelling presets) — Don Miller voice is `don-miller-storybrand` preset
- ADR-144 (KISS denylist) — animation deps explicitly rejected
