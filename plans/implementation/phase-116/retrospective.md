# P116 — Retrospective

> **Phase:** P116 · **Sprint:** FINAL-POLISH · **Branch:** swarm/p116-final-polish · **Date:** 2026-05-06

## Outcome at a glance

| Track | Goal | Result |
|---|---|---|
| B1 | 5 non-SaaS demos (59 → 64) | 5/5 shipped; voiceAttributes ≥3 each (4 each); preset-cited each |
| B2 | 90% of 64 templates ≥7 | 63/64 = **98.4%** (target was 58/64) |
| B3 | F1 inline edit + F2 section-type swap | Both shipped (199 LOC; 4 files; pure helpers) |
| B4 | ADR-144 + 10 P116 tests + EOP + sync | ADR-144 (55 LOC) + 18 cases + triplet + sync |

## Final polish outcomes

### Corpus diversification (B1)
EXAMPLE_SITES 59 → 64. Non-SaaS verticals added: boutique service / restaurant /
non-profit / professional service / venue. Honest audit "20-30% of templates
read AI-generated" gap narrowed. The 5 new demos collectively cover:
boutique wedding planning (Asheville), neighborhood food truck (East Austin),
501(c)(3) non-profit (Oakland), independent therapist (Portland), and small
live-music venue (Pittsburgh). Real named entities, real locations, real prices,
real testimonials. Each cites a Decision-2-of-ADR-141 storytelling preset.

### Template quality floor (B2)
98.4% of 64 templates score ≥7 (target 90% / 58 of 64). 1 intentionally-minimal
scaffold (`blank`) exempt. The B2 lift was *not* visible-quality copy work
(P115/A5 already closed that). The lift was the silent-default leak: 15
templates carried invalid `purpose`/`audience`/`tone` values that Zod's
`.optional().default(...)` quietly defaulted. The visual output looked fine, but
downstream consumers (matcher / decomp / LLM context) saw the *fallback* tone,
not the intended one. Now the spec is honest.

### Builder UX final friction (B3)
- **Inline edit on hero** (double-click headline → contentEditable → Enter/blur
  saves → Escape reverts). Tight scope: hero only this sprint.
  `InlineEditable.tsx` + `useHeroInlineCommit` shared. ARIA: `role="textbox"` +
  `aria-multiline="true"` + per-instance `aria-label`. Visual: `ring-2` accent
  while editing; `cursor-text` always; `title` attr for discoverability.
- **Section-type swap** (text ↔ quotes ↔ numbers ↔ image; preserves
  id/enabled/order). `sectionTypeSwap.ts` ships compatible-only matrix.
  Incompatible swaps (e.g. hero ↔ pricing) explicitly rejected — user
  re-creates the section instead.
- Lovable delta should narrow further (P115 closed -1.5 → -0.4; P116 inline
  edit closes the in-place editing depth gap).

## Keep

- **Disjoint-scope parallel agents pattern** (B1 / B2 / B3 sealed in one Wave-1
  commit `df4bb84`; closer in Wave 2). Same recipe as P113 / P115 — no merge
  conflicts because each agent owns a disjoint file set.
- **Pure modules for new helpers.** `sectionTypeSwap.ts` is `import`-only; no
  React deps. `InlineEditable.tsx` is a single component file with an embedded
  hook. No new directories, no new bundles.
- **No new dependencies.** P116 closes 4 gaps with stdlib + existing
  contentEditable + existing Zustand wiring. KISS denylist preserved.
- **Audit-first then fix.** B2 wrote `docs/audit/p116-template-scoring-final.md`
  before touching any template. The audit identified the silent-default leak as
  a *spec contract* gap, not a *visual* gap — fixed the right thing.

## Drop

- **Speculative inline-edit fan-out.** Not extending `InlineEditable` to
  column headings / pricing tier names / blog card titles this sprint. The
  shared component contract needs to stabilize against real hero usage first.
- **Schema-changing section swaps.** Hero ↔ footer or pricing ↔ team would
  require dropping/replacing all components, which is closer to "delete +
  re-add" than "swap." Out of scope. Compatible-only matrix is the right floor.
- **Lifting `blank.json` to 7+.** The intentional minimal-scaffold premise of
  `blank` is the on-page promise: clean slate that reshapes itself. Lifting it
  defeats that promise; B2 explicitly preserved it at 6.8.

## Reframe

- **"Visual quality" is two gaps, not one.** P115/A5 covered the *visible* copy
  gap; P116/B2 covered the *spec contract* gap (silent enum defaults). Both can
  live underneath the same audit headline ("templates read AI-generated") but
  the fixes are in different files and serve different consumers (humans vs the
  matcher/decomp/LLM pipeline). Future audits should call these out separately.
- **Inline edit is a *Builder UX* gap, not a *visual* gap.** P115/A1 closed the
  canvas-side Builder UX gap (chevron rotation, drag-handle hover-reveal,
  delete-confirm caption). P116/B3 closes the *form-vs-canvas asymmetry* — the
  right-panel form was the only edit path; now the canvas is editable too.

## Carry-forward

1. **Inline edit fan-out beyond hero** — column heading / pricing tier name /
   blog card title / list item; defer until shared component contract
   stabilizes against hero-usage feedback.
2. **Section-type swap matrix expansion** — currently 4 swappable types; growing
   to hero/footer/pricing/team requires per-type safe-default seed components,
   which is harder than the 4 current types.
3. **Full Σ_512 AISP scoring** — TS heuristic stopgap from P112/ADR-140 covers
   ~40-symbol regex subset; full canonical scorer pending ADR-C07 Wave 4 WASM
   crate (60-day upstream window).
4. **LLM-enriched voice extraction** — CF#4 BYOK owner-required.
5. **Husky pre-commit wire** — sandbox-blocked from `.husky/` modify; CI gates
   workflow at `.github/workflows/gates.yml` provides PR-time equivalent
   enforcement per ADR-140 D3.

## Numbers

- Files touched (Wave 1 + Wave 2): 31 (29 from `df4bb84` + 6 from closer)
- New code lines (Wave 1 + Wave 2): ~1700
- New tests: 18 cases / 10 describes (P116.1-P116.10)
- Cumulative GREEN at P116 anchor: 337 (P115 baseline) + 18 P116 = **355** (target ≥347)
- ADR ledger: 134 → 135 (+ ADR-144)
- EXAMPLE_SITES: 59 → 64
- ADR-144: 55 LOC ≤120 cap
- tsc strict CLEAN both configs

## How it works (operator-runnable)

```sh
# Run the P116 spec only
npx playwright test tests/p116-final-polish.spec.ts --reporter=line

# Run all gates (per ADR-139 D3)
npm run check:gates
# OR equivalently:
bash scripts/run-gates.sh
```

The 5 new B1 demos appear in the EXAMPLE_SITES picker UI in Builder mode.
The Shuffle icon appears in the SectionsSection action bar for any section
whose type ∈ {text, quotes, numbers, image}. Double-clicking the hero headline
or subhead in the rendered preview enters inline-edit mode (Enter/blur saves;
Escape reverts).
