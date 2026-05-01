# AISP Bundle Schema Reference

Spec version: **`aisp-1.2`** (constant `BUNDLE_VERSION` in
[`shareSpecBundle.ts`](../../src/contexts/specification/shareSpecBundle.ts)).

## Top-level fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `generatedAt` | ISO-8601 string | yes | UTC timestamp at compose time |
| `version` | string | yes | `aisp-1.X` ladder; minor versions are backward-compatible for adopters |
| `slug` | string | yes | kebab-case from `site.title` (e.g. `"Coffee Roaster"` → `"coffee-roaster"`) |
| `filenames` | `BundleFilenames` | yes | per-file artifact names (see below) |
| `site` | `SiteConfig` | yes | title, description, author, tone, tagline, etc. |
| `theme` | `ThemeConfig` | yes | preset, mode, palette, typography, spacing, borderRadius |
| `sections` | `Section[]` | yes | ordered section configs (see Section Type table below) |
| `pages` | `BundlePageEntry[]` | no | **multi-page only** — present iff `pages.length > 1` |
| `atoms` | `AispAtoms` | no | trace of the AISP atoms that produced the bundle |
| `northStar` / `sadd` / `aisp` / `masterConfig` | string \| object | no | spec-generator outputs |

The composer is `composeShareSpecBundle(config)` in
[`shareSpecBundle.ts`](../../src/contexts/specification/shareSpecBundle.ts).

## File naming convention

Per-file artifacts (when an adopter exports each spec separately) follow the
pattern `{slug}-{file}-v{version}.{ext}`:

| File | Pattern |
|------|---------|
| North Star | `{slug}-northstar-v{ver}.md` |
| Human Spec | `{slug}-human-spec-v{ver}.md` |
| **AISP** | `{slug}-aisp-v{ver}.txt` |
| Master config | `{slug}-config-v{ver}.json` |
| Manifest | `{slug}-manifest-v{ver}.json` |

The full bundle (all of the above merged into one JSON) is conventionally
named `{slug}-bundle-v{version}.json`.

## Per-atom shapes

The runtime types live under
[`src/contexts/intelligence/aisp/`](../../src/contexts/intelligence/aisp/). The
JSON-emitted shapes mirror the `interface` for each atom:

### INTENT (`atoms.intent`) — ADR-053

`ClassifiedIntent` from
[`intentAtom.ts`](../../src/contexts/intelligence/aisp/intentAtom.ts):

```
{ verb: 'hide'|'show'|'change'|'remove'|'add'|'reset',
  target: { type: <enum-21>, index: number|null, pageId?: string },
  params?: object,
  confidence: number,    // [0,1]; ≥0.85 = AISP win
  rationale: string }
```

### ASSUMPTIONS (`atoms.assumptions`) — ADR-064

`AssumptionAtomItem[]` from
[`assumptionsAtom.ts`](../../src/contexts/intelligence/aisp/assumptionsAtom.ts).
Fires only when INTENT confidence < 0.7. Up to 3 ranked items.

```
{ items: [ { id, label, rephrasing, confidence, rationale? } ],
  count: 0..3 }
```

### SELECTION (`atoms.selection`) — ADR-057

`TemplateSelection` from
[`templateSelector.ts`](../../src/contexts/intelligence/aisp/templateSelector.ts):

```
{ templateId: string, confidence: number, rationale: string }
```

### CONTENT (`atoms.content`) — ADR-060

`GeneratedContent` from
[`contentAtom.ts`](../../src/contexts/intelligence/aisp/contentAtom.ts):

```
{ text: string,
  tone: 'neutral'|'playful'|'authoritative'|'warm'|'bold',
  length: 'short'|'medium'|'long',   // max-chars 60/160/400
  confidence: number, rationale: string }
```

### PATCH (`atoms.patch`) — ADR-045

RFC-6902 JSON-Patch envelope with confidence:

```
{ operations: [ { op, path, value? } ], confidence: number }
```

## Multi-page layout (ADR-103 / ADR-104)

When `config.pages.length > 1` the composer emits a `bundle.pages` array. Each
entry is a `BundlePageEntry`:

```
{ pageId: string,
  title: string,
  humanSpec: string|null,
  northstar: string|null,
  filenames: BundleFilenames }
```

Single-page mode (default) skips `pages` entirely so consumers can branch on
`'pages' in bundle && bundle.pages.length > 1`.

Page-aware patches use the `pageId` field on `IntentTarget` to override the
active-page scope (P82 / OC-CLEANUP). See
[ADR-104 — Page-Aware Chat Pipeline](../../docs/adr/ADR-104-page-aware-chat-pipeline.md).

## Versioning policy

- The `version` field uses an `aisp-1.X` ladder.
- Minor version bumps (1.2 → 1.3) are **backward-compatible** for adopters: new
  optional fields may appear; existing fields keep their shape and meaning.
- Major version bumps (1.x → 2.x) signal a **breaking** schema change and will
  ship with a migration note in `docs/aisp-adoption/`.
- Adopters SHOULD branch on `bundle.version.startsWith('aisp-1.')` and treat
  any unknown field as ignorable.
