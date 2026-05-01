# ADR-098 — Template Intelligence Architecture

**Status:** Accepted
**Date:** 2026-05-01
**Phase:** P72 / OC-TI (Template Intelligence) — planning ADR; execution lands at sprint open
**Cross-refs:** ADR-053 (INTENT_ATOM), ADR-057 (SELECTION_ATOM), ADR-060 (CONTENT_ATOM), ADR-064 (ASSUMPTIONS_ATOM), ADR-079 (Premium Templates), ADR-091 (Canonical Component Quality), ADR-096 (Template Library Expansion)

---

## Context

OC-3 + OC-4 shipped **37 full-MasterConfig templates** as JSON files in `src/data/examples/`. These work as **starter packs** — a user picks one on first run and the app loads the entire site config. They are NOT designed for mid-conversation template selection ("make it more fun") because:

- A full MasterConfig is too coarse for partial application — the user wants to change tone, not the whole site
- Tag-based search at the MasterConfig level is binary (pick one site, displace the current site)
- Content-tone shifts ("Don Miller story" → "fun casual") have no place in the MasterConfig schema

The mental model the open-core needs is **three independent layers** that compose at conversation time, with vector + tag search ranked by confidence and surfaced through ASSUMPTIONS_ATOM when ambiguous.

---

## Decision

Three-layer template intelligence architecture, layered ON TOP of the existing 37 MasterConfig starter packs (which stay as onboarding examples per ADR-079 + ADR-096):

### Layer 1 — Theme Template
**"What does it look like?"** Color palette, font pairing, spacing rhythm, border + shadow style.
Examples: "Warm minimal", "Dark tech", "Bright playful", "Corporate clean", "Retro bold".

### Layer 2 — Section Template
**"What sections exist and how are they arranged?"** Section list + per-section CSS overrides + layout variants per section.
Examples: SaaS landing (hero→features→pricing→cta), Personal brand (hero→story→work→contact), Product launch (problem→solution→proof→offer).

### Layer 3 — Content Template
**"What is the writing style?"** Tone + structure pattern + length + density.
Examples: Don Miller story (character→problem→guide→plan→success), Elevator pitch (hook→problem→solution→ask), Article (headline→lede→body→takeaway), Fun casual (short sentences, emoji, conversational).

---

## Matcher pattern

When the user says **"make this more fun"**:

1. **INTENT_ATOM** classifies → `modify · tone+visual`
2. **Template search** — vector + tag match across all 3 libraries → ranked candidates per layer
3. **LLM selects** best match with confidence score per layer
4. **Confidence threshold:**
   - `≥ 0.8` → apply patch directly (no clarification)
   - `< 0.8` → fire **ASSUMPTIONS_ATOM** with 2-3 ranked options + ambiguity rationale; user picks
5. **templateApplier** converts the selected template(s) → JSON patches against the current MasterConfig
6. **80/20 rule:** 80% of changes handled by templates; 20% custom-edited per the site's actual content

---

## Output format — JSON patches

Selected template(s) emit standard `JsonPatch[]` (per ADR-045 PATCH_ATOM) targeting:
- Theme paths: `/theme/colors/*`, `/theme/typography/*`, `/theme/radius`, `/theme/shadow/*`
- Section paths: `/sections/{id}/style/*`, `/sections/{id}/layout/*`, `/sections/{id}/variant`
- Content paths: `/sections/{id}/components/{id}/props/text` (with regenerated copy from the LLM following the content template's pattern)

The matcher returns a `TemplateMatch` envelope:

```ts
interface TemplateMatch {
  templateId: string
  layer: 'theme' | 'section' | 'content'
  confidence: number
  rationale: string
  patches: JsonPatch[]
}
```

Composable: a single user utterance can yield 1-3 matches (one per layer); ASSUMPTIONS_ATOM surfaces only the layer(s) below threshold.

---

## File layout (P72 sprint deliverables)

```
src/contexts/intelligence/templates/
├── themeLibrary.ts      — 15-20 theme templates
├── sectionLibrary.ts    — 10-15 section arrangement patterns
├── contentLibrary.ts    — 10-15 writing style templates
├── templateMatcher.ts   — vector/tag search → best match per layer
└── templateApplier.ts   — converts TemplateMatch → JsonPatch[]
```

Existing `library.ts` / `registry.ts` / `router.ts` (SELECTION_ATOM-aligned single-template selector for full MasterConfigs) stay untouched — they handle the starter-pack flow.

---

## Bounded-context impact

Within `intelligence/templates` aggregate (existing). Adds 5 new modules. No new bounded context.

---

## Out of scope
- Real vector store (HNSW activation deferred to Tier-2 per CLAUDE.md ruvector note); P72 ships keyword-tag matching with a deterministic similarity score, with a clean swap-in interface for HNSW later
- ML-trained ranking (deterministic + rule-based for open-core)
- Per-user template preferences (Tier-2)
- Template editor UI (sprint follow-up)

---

## Acceptance gates

- 5 new files in `src/contexts/intelligence/templates/`
- ≥ 15 theme templates, ≥ 10 section templates, ≥ 10 content templates
- Matcher returns ranked candidates with confidence per layer
- Confidence < 0.8 fires ASSUMPTIONS_ATOM (round-trip with existing assumptionStore)
- Applier emits valid JsonPatch[] against current MasterConfig
- ≥ 20-case PURE-UNIT test spec covering matcher + applier + 3 libraries

---

## Consequences

**Positive:**
- Mid-conversation template application — the actual UX users want
- 3-layer composition fits ADR-053+057+060+064 atom architecture cleanly
- Existing 37 starter-pack MasterConfigs are repositioned as onboarding examples (not wasted)
- Vector/tag matcher is the integration point where future HNSW activation slots in

**Negative:**
- Three new libraries to maintain alongside existing 37 templates
- Confidence-threshold tuning is empirical (will need adjustment from real usage)

**Mitigations:**
- Each library is small (10-20 entries); bar to add a new entry is low (matches the pattern of starter-packs)
- Threshold default 0.8 is documented; tunable per-deployment via config
