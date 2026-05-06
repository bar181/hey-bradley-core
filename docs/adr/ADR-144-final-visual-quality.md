# ADR-144 — Final Visual Quality Standard (5 Non-SaaS Demos + Bottom-N Enum Truth-Up + Inline Edit Hero + Section-Type Swap + 90% Quality Floor)

- **Status:** Accepted
- **Date:** 2026-05-06
- **Phase:** P116 / FINAL-POLISH
- **Cross-refs (primary):** ADR-091 (Canonical Component Quality — InlineEditable inherits the same hover/focus contract), ADR-094 (Professional Grade Standard — ≥7.0 floor extended to 90% of corpus), ADR-100 (Section Type Completeness — swap matrix preserves the canonical 18 enum), ADR-141 (Storytelling Preset Library — every new demo cites a preset id), ADR-143 (Visual Quality + Builder Polish — predecessor sprint closed Builder UX 7.5→8.6; P116 closes the in-place editing depth gap)

## Context

The P115 honest audit named one residual gap: "Visual output still reads AI-generated on 20-30% of templates." Two sub-gaps drove that read. **Corpus skew** — of 59 example sites at P115 close, the dominant verticals were SaaS (8), tech / dev tools (6), and portfolios / agencies (8); under-represented were neighborhood service businesses, food, non-profits, healthcare-like professional services, and venues with calendar surface area. Pattern-matching consumers noticed the skew. **Silent enum defaults** — Zod's `.optional().default(...)` quietly swallowed 15 templates' invalid `purpose` / `audience` / `tone` values; downstream pipeline (matcher / decomp / LLM context) saw the *fallback* tone, not the *intended* tone. Visual output looked fine, but the spec was lying to itself.

P115 / A1 closed the canvas-side Builder UX gap (chevron rotation + drag-handle hover-reveal + delete-confirm caption + transition-colors). What remained was *in-place editing depth*. Lovable's killer move is "double-click to edit anything inline." The right-panel form-edit path covers structure but breaks flow when you just want to retype a headline. This sprint adds inline edit on the highest-traffic surface (hero headline + subhead) and pairs it with a section-type swap so the Builder canvas stops being a one-way street.

3 disjoint Wave-1 agents (B1 / B2 / B3) sealed at `df4bb84`. B4 (this commit) authors ADR-144 + 10 P116 tests + EOP triplet + CLAUDE.md sync.

## Decisions

### Decision 1 — 5 NEW non-SaaS demos correct corpus skew (closes B1; 59 → 64)

Five named-entity demos lifted, each in a distinct under-represented quadrant. **`wedding-planner.json`** — Hazel & Birch, Asheville NC; Hazel Linwood + Sam Cordell; sage + cream Fraunces serif; eight weddings a year; cites `theron-miller-hard-twist`. **`food-truck-restaurant.json`** — Tio's Tortillería, East Austin; Beto + Adriana Reyna; six tacos with real prices; grandmother Esperanza's 1971 cast-iron press; cites `founder-direct`. **`non-profit-community.json`** — Bayview Books for Kids, Oakland 501(c)(3); 12,400 books to 47 Title-I schools since 2019; named volunteer + foundation testimonials; cites `investigative-deep-dive`. **`freelance-therapist.json`** — Maren Ahoyade LMFT, Portland Buckman SE; license #T1538; EMDR + IFS + Gottman trained; 22-client practice; cites `founder-direct`. **`local-events-venue.json`** — The Lampshade Lounge, Pittsburgh Bloomfield; Pris Karimov + Theo Marsh; 90-cap room; 6 upcoming shows with band names + dates + cover prices; cites `dry-humor-narrator`. Each Zod-valid + voiceAttributes ≥3 (each ships 4) + cites a Decision-2-of-ADR-141 preset by id.

### Decision 2 — Bottom-N enum truth-up closes the silent-default leak (closes B2)

15 templates carried invalid `purpose` / `audience` / `tone` values that Zod silently defaulted away (e.g. `tone: "trustworthy"` → `casual` on `clinic.json`). Each fixed to the closest canonical value with documented rationale: `purpose: "product"` → `saas`; `tone: "trustworthy"` → `warm`; `audience: "ml-platform-team"` → `enterprise`. Plus 5 templates with legacy `align: "flex-start"` (CSS literal, pre-Zod tightening) corrected to canonical `start`. `blank.json` voiceAttributes expanded `+ "demonstrative"` and tagline + brandName sharpened to make the starter-scaffold purpose explicit. After this pass downstream consumers (matcher / decomp / LLM context) see the *intended* enum value, not the fallback. The visual output was already fine; the *spec contract* is now honest.

### Decision 3 — Inline edit on hero headline + subhead (closes B3 / F1; tight scope by design)

NEW shared component `src/components/shared/InlineEditable.tsx` (79 LOC) + companion `useHeroInlineCommit(section)` hook. Pattern: double-click on the rendered headline / subhead → `contentEditable={true}` → `Enter` or blur commits via `setSectionConfig` → `Escape` reverts to original via `originalRef`. Visual treatment: `ring-2 ring-[var(--hb-accent)]` plus `bg-[var(--hb-accent)]/5` while editing; `cursor-text outline-none` always; `title="Double-click to edit"` discoverability. ARIA: `role="textbox"` + `aria-multiline="true"` + per-instance `aria-label`. **Scope is hero only this sprint** — `HeroSplit.tsx` + `HeroCentered.tsx` are the only call sites. Extending to other section types (section-list / column heading / pricing tier name) is intentionally deferred so the shared component contract stabilizes against real usage before fan-out.

### Decision 4 — Section-type swap matrix (text/quotes/numbers/image; closes B3 / F2)

NEW pure module `src/lib/sectionTypeSwap.ts` (43 LOC) ships a 4-element compatible-swap matrix: `text` ↔ `quotes` ↔ `numbers` ↔ `image`. Incompatible swaps (e.g. hero ↔ pricing) are rejected — the user re-creates the section instead. `swapCandidates(type)` returns the 3 valid targets for any swappable type; `defaultComponentsFor(type)` ships the canonical seed components (e.g. text → `{heading, body, sidebar}`; quotes → 2 quotes with named author + role; numbers → 3 stats with value + label; image → 1 hero-style image). UI surface: a `<Shuffle />` icon dropdown in the SectionsSection action bar visible only when `isSwappable(section.type)` returns true. Preserves `id` + `enabled` + `order` per swap; only `type` and `components` change. Closes the canvas one-way-street gap without touching the Zod section schema.

### Decision 5 — 90% template quality floor declared (closes B2 acceptance gate)

Per the B2 audit (`docs/audit/p116-template-scoring-final.md`), **63 of 64 templates score ≥7.0 (98.4%)**. The single intentional sub-7 template is `blank.json` (composite 6.8 by design — minimal-scaffold premise; lifting it to 7 would defeat the on-page promise of "clean slate that reshapes itself"). 90% target = 58 of 64; actual = 63 of 64; margin = 5 templates above floor. P115 / A5 closed 14 of 15 in the previous bottom-15 cohort; P116 / B2 closes the silent-default leak that survived that pass. The **5 percentage points of margin** above the 90% floor are the buffer against future drift; if a single template regresses the corpus stays above the gate.

## Consequences

- **Closeable / closed:** 4 of 4 P116 gaps (corpus skew / silent enum defaults / no-inline-edit / no-section-swap). Builder UX in-place editing depth gap (Lovable parity) closed for hero; matcher / decomp / LLM context now sees honest enum values; corpus 59 → 64 with 5 non-SaaS verticals; section-type swap preserves canonical 18 enum.
- **Backward-compat preserved:** No new dependencies; no Zod schema changes; existing templates compile unchanged; `InlineEditable` is opt-in (templates without it render exactly as before); section-swap only fires when user clicks the shuffle dropdown.
- **Honest carry-forward:** Inline edit fan-out beyond hero (column headings / pricing tier names / list items / blog card titles) deferred until the shared component contract stabilizes against real usage; `blank.json` intentionally below the 7.0 floor (1 of 64 = 1.6%); section-type swap matrix limited to 4 types this sprint (hero / footer / pricing / etc. swaps deferred — schema diversity makes safe defaults harder); full Σ_512 AISP scoring still pending ADR-C07 Wave 4 WASM crate per ADR-140; LLM-enriched voice extraction CF#4 owner-required.

## Acceptance Gates

1. ADR-144 ≤120 LOC; Status: Accepted.
2. 5 new demos exist + Zod-valid + voiceAttributes ≥3 each.
3. EXAMPLE_SITES count ≥64.
4. HeroSplit.tsx + HeroCentered.tsx import `InlineEditable` from shared module.
5. SectionsSection.tsx imports section-swap helpers + has Shuffle icon.
6. `src/lib/sectionTypeSwap.ts` exports SWAPPABLE_TYPES with text + quotes + numbers + image.
7. `src/components/shared/InlineEditable.tsx` exports `InlineEditable` component + `useHeroInlineCommit` hook.
8. EOP triplet at `plans/implementation/phase-116/`.
9. KISS no-new-deps boundary preserved.
10. ≥10 P116 tests GREEN under chromium.
