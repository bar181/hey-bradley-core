# Phase 15 — Polish + Kitchen Sink + Blog + Novice Simplification

> **Stage:** A — Review & Polish
> **Estimated effort:** 8–14 hours (1–2 calendar weeks at part-time pace)
> **Prerequisite:** Phase 14 closed (74/100). Flywheel verified (this branch).
> **Successor:** Phase 16 — Local DB.

---

## North Star

> **A novice opens the deployed site, sees fewer choices, picks "Kitchen Sink" or "Blog Page", and watches a complete site render in under 3 seconds — with zero developer jargon visible in DRAFT mode.**

This phase is **subtractive**. We are removing complexity, not adding features. The two new things — Kitchen Sink and Blog Page — exist because the user explicitly requested them. Everything else is polish, fixes, and simplification.

---

## 1. Specification (S)

### 1.1 What changes

1. **Kitchen Sink example** is added to `src/data/examples/`. It is one site config that includes every section type and every variant we currently render, used as a regression-canary and a reference page. (`ADR-038`)
2. **Standard Blog Page** example is added — a single-page demo of the existing `blog` section type plus three short posts inline. Not a multi-page editor; just a pre-built blog landing. (`ADR-039`)
3. **Novice simplification pass.** In DRAFT mode the left panel hides any control whose label uses tech jargon (e.g., "Variant", "Layout Schema", "Slot Token"). They remain accessible in EXPERT mode unchanged.
4. **Stage-1 DoD fixes.** Close the 12 outstanding items from `master-backlog.md` Stage 1: AISP A+ fix, 6 spec generators present, image picker 200+, console scrub, design-lock toggle, etc.
5. **Branch name renames** in DRAFT to plain English: e.g., "Inspector" → "Edit", "Variant" → "Style", "Section Registry" → not shown in DRAFT.
6. **No new section types**, no new themes, no new effects. Polish only.

### 1.2 What does **not** change

- The 16 existing section types and their rendering code.
- The 12 themes.
- The store contract (`configStore`, `uiStore`, `projectStore`).
- The spec generators (those get a separate audit phase post-MVP).
- AISP output format (Crystal Atom remains).

### 1.3 Novice impact

- Fewer choices on first load → fewer abandons.
- The Kitchen Sink option lets a curious novice explore everything without committing.
- The Blog example gives a concrete, recognizable site type.
- Renaming "Variant"→"Style" in DRAFT removes the single most common confusion point reported in feedback.

---

## 2. Pseudocode (P)

```
ON onboarding load:
  show 4 starter cards: [Kitchen Sink, Blog Page, Bakery, SaaS]
  hide remaining 11 examples behind "More examples →" toggle
  default mode = DRAFT

ON DRAFT mode active:
  for each control in left panel:
    if control.taxonomy in {"variant","registry","schema","slot"}:
      hide
  for each label:
    if dictionary.draftRename[label] exists:
      replace label with dictionary.draftRename[label]

ON EXPERT mode active:
  show all controls; do not rename labels.
```

For Kitchen Sink and Blog:

```
LOAD example "kitchen-sink":
  config = read JSON from src/data/examples/kitchen-sink.json
  apply to configStore
  preview re-renders

LOAD example "blog-standard":
  same flow with src/data/examples/blog-standard.json
```

---

## 3. Architecture (A)

### 3.1 DDD context

`Configuration` (read/write), `Specification` (read-only) — no new context introduced this phase.

### 3.2 Files touched / created

| Action | Path | Purpose |
|---|---|---|
| CREATE | `src/data/examples/kitchen-sink.json` | One site with every section type + variant |
| CREATE | `src/data/examples/blog-standard.json` | Standard blog landing page |
| EDIT | `src/data/examples/index.ts` | Register the two new examples |
| CREATE | `src/lib/draftRename.ts` | DRAFT-mode label dictionary |
| EDIT | `src/components/left-panel/DraftPanel.tsx` | Apply the dictionary, hide jargon controls |
| EDIT | `src/components/shell/ModeToggle.tsx` | (no change unless tooltips added) |
| EDIT | `src/pages/Onboarding.tsx` | Show only 4 starter cards by default |
| CREATE | `docs/adr/ADR-038-kitchen-sink-example.md` | Kitchen Sink rationale |
| CREATE | `docs/adr/ADR-039-standard-blog-page.md` | Blog page rationale |
| EDIT | `plans/deferred-features.md` | Move "Marketplace" et al. to Post-MVP disposition |
| EDIT | `plans/implementation/mvp-plan/08-master-checklist.md` | Tick items as completed |

### 3.3 Files **not** touched

- Section renderer code (`src/templates/**`)
- Schemas (`src/lib/schemas/**`)
- Stores (`src/store/**`) — except possibly a `uiStore` selector for DRAFT-rename mode
- Spec generators (`src/lib/specGenerators/**`)

### 3.4 ADRs to author

#### ADR-038 — Kitchen Sink Reference Example

- **Decision:** Add a single example that exercises every shipped section type and variant, used as a manual regression target and as a "show me everything" onboarding choice.
- **Context:** Several Stage-1 DoD items reference a Kitchen Sink. Without it, novices have no concrete reference for what is possible.
- **Consequences:** One JSON file to maintain. Must be updated whenever a section variant is added or removed.
- **Status:** Accepted.

#### ADR-039 — Standard Blog Page

- **Decision:** Ship a single-page blog example (`blog-standard`) using the existing `blog` section type. Three inline posts, one nav, one footer. Not a multi-page editor; not a CMS.
- **Context:** The user requested a "standard blog page" for the MVP. Multi-page authoring is post-MVP.
- **Consequences:** Adds one example; no schema change; no new section type.
- **Status:** Accepted.

### 3.5 Directory rules (from CLAUDE.md)

- Examples live in `src/data/examples/` ✓
- Tests in `tests/` ✓
- ADRs in `docs/adr/` ✓
- Plans in `plans/implementation/` ✓

No file goes to root.

---

## 4. Refinement (R)

Three checkpoints. Each is a hard "stop and verify" before the next begins.

### 4.1 Checkpoint A — Examples

- Kitchen Sink loads; every section type renders; no console errors.
- Blog Page loads; three posts visible; navigation works.

### 4.2 Checkpoint B — Novice Simplification

- DRAFT mode shows ≤ 8 left-panel controls per section.
- All hidden EXPERT controls are still reachable via the EXPERT toggle.
- No DRAFT-mode label contains the words: variant, schema, registry, slot, namespace, registry, payload.

### 4.3 Checkpoint C — Stage-1 DoD close-out

Tick the remaining items in `master-backlog.md` Stage 1 (S1-01..S1-29). Items unfinished here move to `plans/deferred-features.md` with disposition `Post-MVP-Polish`.

### 4.4 Intentionally deferred

- Image picker scaling beyond 200 entries (post-MVP).
- Spec generator A+ for *every* section (only Hero gets the polish; ADR-044 audit is post-MVP).
- Console message *cosmetic* improvements (only error-level scrubbed).

---

## 5. Completion (C) — DoD Checklist

- [ ] `src/data/examples/kitchen-sink.json` exists, contains every section type at least once
- [ ] `src/data/examples/blog-standard.json` exists, contains nav + blog (3 posts) + footer
- [ ] Both examples are reachable from the Onboarding page as starter cards
- [ ] Onboarding shows exactly 4 starter cards by default; "More examples" reveals the rest
- [ ] DRAFT mode hides all jargon controls per `src/lib/draftRename.ts`
- [ ] EXPERT mode is unchanged
- [ ] ADR-038 and ADR-039 merged in `docs/adr/`
- [ ] `master-backlog.md` Stage 1 — every item is either ✓ DONE or moved to `deferred-features.md`
- [ ] No console errors when cycling through all 4 starters in a fresh tab
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds
- [ ] `npm test` passes; test count ≥ 102
- [ ] One new Playwright test: load Kitchen Sink → assert every section type ID appears in DOM
- [ ] One new Playwright test: load Blog → assert 3 post titles render
- [ ] `plans/implementation/mvp-plan/08-master-checklist.md` updated for this phase
- [ ] Session-log entry written

### Persona scoring targets

| Persona | Min |
|---|---|
| Grandma (DRAFT, novice) | 70 |
| Framer User (EXPERT) | 78 |
| Capstone Reviewer | 82 |

---

## 6. GOAP Plan

### 6.1 Goal state

```
goal := KitchenSinkLoads ∧ BlogLoads ∧ DraftSimplified ∧ Stage1Closed ∧ TestsPass(n ≥ previous)
```

### 6.2 Actions

| Action | Preconditions | Effects | Cost |
|---|---|---|---|
| `author_kitchen_sink_json` | repo clean | KitchenSinkExists | 2 |
| `author_blog_standard_json` | repo clean | BlogExists | 2 |
| `register_examples` | KitchenSinkExists ∧ BlogExists | ExamplesIndexed | 1 |
| `update_onboarding` | ExamplesIndexed | OnboardingShows4Starters | 1 |
| `add_draftRename_dict` | repo clean | RenameDictExists | 1 |
| `apply_draftRename_to_panel` | RenameDictExists | DraftSimplified | 2 |
| `author_adr_038` | KitchenSinkExists | ADR038Merged | 1 |
| `author_adr_039` | BlogExists | ADR039Merged | 1 |
| `close_stage1_items` | repo clean | Stage1Closed | 4 |
| `add_playwright_tests` | KitchenSinkExists ∧ BlogExists | TestsPass | 2 |
| `run_build_and_tests` | TestsPass ∧ Stage1Closed | GoalMet | 1 |

### 6.3 Optimal Plan (cost = 18)

```
1. author_kitchen_sink_json
2. author_blog_standard_json   ┐ run in parallel with #1
3. add_draftRename_dict        ┘
4. register_examples
5. update_onboarding           ┐
6. apply_draftRename_to_panel  ┘ parallel
7. author_adr_038              ┐
8. author_adr_039              ┘ parallel
9. close_stage1_items
10. add_playwright_tests
11. run_build_and_tests
```

### 6.4 Replan triggers

- **`KitchenSinkLoads = false`** during Checkpoint A → new action `fix_section_render(section_type)` inserted before continuing.
- **TS errors after `apply_draftRename_to_panel`** → revert dictionary entry that broke a typed prop, retry.
- **Test count drops** → halt; root-cause before any further commit (per ADR-043).

---

## 7. Sample Code Outlines (illustrative, KISS)

### 7.1 `src/lib/draftRename.ts`

```ts
export const DRAFT_RENAME: Record<string, string> = {
  Variant: 'Style',
  'Layout Schema': 'Layout',
  'Section Registry': 'Add Section',
  Slot: 'Spot',
  Inspector: 'Edit',
};

export const DRAFT_HIDE_KEYS = new Set([
  'schemaVersion',
  'registryNamespace',
  'slotToken',
]);
```

### 7.2 Onboarding starter list (DRAFT default)

```ts
const STARTERS = ['kitchen-sink', 'blog-standard', 'bakery', 'saas-landing'];
const HIDDEN_BY_DEFAULT = EXAMPLES.filter(e => !STARTERS.includes(e.id));
```

### 7.3 Kitchen Sink JSON (sketch — actual file is the source of truth)

```jsonc
{
  "spec": "aisp-1.2",
  "page": "kitchen-sink",
  "version": "1.0.0",
  "sections": [
    { "type": "navbar", "id": "nav-01", /* ... */ },
    { "type": "hero",   "id": "hero-01", /* ... */ },
    { "type": "features", "id": "feat-01", /* ... */ },
    /* one of every section type and variant */
    { "type": "footer", "id": "foot-01", /* ... */ }
  ]
}
```

The author of the JSON cycles through `src/templates/*` to ensure 1:1 coverage.

---

## 8. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Kitchen Sink scrolls forever and feels broken | M | Add a "Jump to section" sticky nav inside Kitchen Sink only |
| DRAFT renames break translations elsewhere | L | Dictionary is consumed only in `DraftPanel.tsx` selectors |
| Stage-1 close-out reveals deeper bugs | M | Time-box to 4 hours; over-budget items get deferred, not blocked-on |
| Console errors are environmental (Vite HMR), not real | L | Run with `vite build && vite preview` for the final scrub |

---

## 9. Hand-off to Phase 16

When this phase closes:

1. Master checklist updated (P15 column → all green).
2. Two new examples are linked from Onboarding.
3. ADR-038 and ADR-039 merged.
4. `master-backlog.md` Stage 1 has zero open items.
5. Phase 16 may begin: local DB.

A short note is appended to `phase-15/session-log.md` summarizing what shipped and what was deferred.
