# ADR-069: Context Management (Reference Summary Surface)

**Status:** Accepted
**Date:** 2026-04-28 (P46 Sprint H P3)
**Deciders:** Bradley Ross
**Phase:** P46

## Context

P44 (ADR-067) shipped the first reference channel — brand voice / style guide
upload. P45 (ADR-068) layered the second channel — codebase context with a
rule-based project-type heuristic. Both channels persist through the same
kv-chunked motif and inject into the LLM pipeline (system prompt + AISP atoms).

P46 closes the lifecycle loop with a unified **management surface**: a single,
read-only summary view of every active reference, with per-reference Clear
buttons. No new persistence; no behavior changes to the upload widgets or the
injection contract. This is pure UX work that promotes the two existing
upload widgets from "fire-and-forget" to "fire, see, manage".

## Decision

### `ReferenceManagement.tsx` summary panel

A new `ReferenceManagement` component lives in `src/components/settings/` and
renders inside `SettingsDrawer.tsx` **above** the existing `BrandContextUpload`
and `CodebaseContextUpload` widgets. Source order in the drawer JSX is:

```
<LLMSettings />
<ReferenceManagement />     ← summary (P46)
<BrandContextUpload />      ← upload widget (P44)
<CodebaseContextUpload />   ← upload widget (P45)
```

The summary precedes the upload widgets so the user sees their current
references first, with the upload widgets directly below as the "add / replace"
affordance.

### Manifest-only reads

The component imports `readBrandContextManifest` + `readCodebaseContextManifest`
ONLY — it never calls `readBrandContext` / `readCodebaseContext`. Manifests are
single-row reads; full reads force chunk-joins (N kv lookups). This keeps the
drawer-open cost at O(2) regardless of upload size.

### Per-reference Clear buttons (window.confirm gate)

Each row carries a Clear button gated by `window.confirm()`. This mirrors the
existing P34 ClarificationPanel "destructive action" pattern and the
SettingsDrawer's `Clear local data` button. Confirmation copy is reference-
specific ("Remove the uploaded brand voice document?" / "Remove the uploaded
codebase context?"). On confirm: call `clearBrandContext()` / `clearCodebaseContext()`
and bump a local refresh counter to re-read manifests.

### Empty state + privacy footer

When no references exist, the panel renders "No references uploaded yet."
A persistent footer reminds users: *"References are stored locally only and
stripped from .heybradley exports."* Honest privacy posture; no surprises.

### `data-testid` surface

Stable testids for end-to-end coverage:
`reference-management`, `reference-row-brand`, `reference-row-codebase`,
`reference-clear-brand`, `reference-clear-codebase`.

## Trade-offs

- **Pure UX work, no LLM, no backend.** Ships in a single Wave 3 agent slot.
- **Manifest-only reads** keep memory footprint trivial (≤200 bytes per row).
- **`window.confirm` is heavy-handed** but matches the existing P34 destructive-
  action pattern. A custom modal is deferred (Sprint I+ if multiple references
  per channel land).
- **No preview / edit-in-place.** Users can clear and re-upload, not edit the
  body inline. Deferred — keeps the surface read-only.
- **No semantic embedding signal** in the row metadata (token count is the
  only "size" hint). Vector retrieval is post-MVP; the row schema can extend
  later without breaking the testid contract.

## Consequences

- (+) Sprint H closes with the full reference lifecycle: upload → store →
  inject → manage. End-to-end story is shippable.
- (+) Foundation for Sprint I+ (multiple references per channel, prioritization
  controls, semantic-context selection).
- (+) Persona scoring expected to climb on Framer (one-glance reference state)
  and Capstone (lifecycle is now demoable end-to-end).
- (-) `ReferenceManagement` and the upload widgets read the same manifests
  independently; the upload widgets re-sync on next drawer mount. A shared
  store is overkill at two channels — revisit at Sprint I if needed.

## Cross-references

- **ADR-040** — Local SQLite Persistence (kv table; no new migration).
- **ADR-046** — Multi-Provider LLM Architecture (export-strip registry).
- **ADR-067** — Brand Context Upload (P44 — first reference channel).
- **ADR-068** — Codebase Reference Ingestion (P45 — second reference channel).

## Status as of P46 seal

- `ReferenceManagement.tsx` summary panel: shipped (A7) ✅
- `SettingsDrawer.tsx` mount above upload widgets: shipped (A7) ✅
- Wiki update + tests + ADR (this file): shipped (A8) ✅
