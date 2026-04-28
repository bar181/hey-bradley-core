# ADR-068: Codebase Reference Ingestion

**Status:** Accepted
**Date:** 2026-04-28 (P45 Sprint H P2)
**Deciders:** Bradley Ross
**Phase:** P45

## Context

P44 (ADR-067) shipped the first reference channel — brand voice / style guide
upload — proving the kv-chunked persistence pattern + system-prompt injection
contract. P45 layers a **second** reference channel: full **codebase context**.
The user uploads a ZIP; a small set of high-signal files (README, package.json,
configs) is extracted; a pure-rule heuristic decides one of five enum project
types; the manifest carries that label so INTENT_ATOM can predict project shape
on every classification. Net cost remains effectively $0 — heuristic is
rule-based; AgentProxyAdapter covers the test surface; no extraction LLM runs.

## Decision

### Settings UI

`CodebaseContextUpload` lives in `src/components/settings/` and renders inside
`SettingsDrawer.tsx` directly below `BrandContextUpload`. Accepts `.zip` or
plain-text. Client-side ZIP extraction via JSZip; on success writes through
`writeCodebaseContext(text, meta)`. Source-side 5 MB ZIP cap rejects oversized
archives early.

### Repository (`codebaseContext.ts`)

Typed CRUD over `kv['codebase_context_*']` keys with chunked storage —
identical motif to `brandContext.ts` (P44 A1). Public surface:
`hasCodebaseContext`, `readCodebaseContextManifest`, `readCodebaseContext`,
`writeCodebaseContext`, `clearCodebaseContext`. Atomic delete-then-write;
idempotent clear.

Key shape:
- `codebase_context_manifest` → JSON
  `{ count, totalBytes, mimeType, name, uploadedAt, projectType, fileCount, sources }`
- `codebase_context_chunk_0..N-1` → string slices joined to reconstruct text

Manifest extends ADR-067's shape with three codebase-specific fields:
`projectType` (closed 5-enum), `fileCount` (number), `sources` (string[] of
extracted paths).

### Project-type heuristic (rule-based)

Pure function `inferProjectType(sources, fileSummary): ProjectType`. Closed
5-enum: `'saas-app' | 'marketing-site' | 'docs-site' | 'portfolio' | 'unknown'`.
Rules cascade: marketing-site (next/gatsby + marketing README) → saas-app
(next/react/vue + pricing/signup routes) → docs-site (mkdocs/docusaurus/
vitepress) → portfolio (index.html + portfolio keyword) → unknown. New types
via ADR amendment — no silent expansion.

### Privacy (export-strip)

`exportImport.ts.isSensitiveKvKey` extends the prefix match to include
`codebase_context_`; `SENSITIVE_KV_KEYS` lists `codebase_context_manifest` for
back-compat. Runtime DELETE sweep matches `codebase_context_%`. Uploaded
codebases are user content; never ship inside `.heybradley` exports.

### INTENT_ATOM Λ Extension

`intentAtom.ts` extends Λ with optional `project_context` channel:
`{ present:𝔹, type∈{saas-app,marketing-site,docs-site,portfolio,unknown} }`.
**Σ width is unchanged** — output shape `{verb, target, confidence, rationale}`
and Γ rules R1..R4 preserved. `project_context` ONLY biases target-candidate
ranking; it cannot introduce a new verb or target type.

### `classifyIntent` signature extension

`classifyIntent(text: string, projectType?: ProjectType)`. The optional
parameter is fully backward-compatible. When supplied AND it is one of the 5
enum values, the classifier biases ranking on the candidate target enum
(`'saas-app'` raises `pricing | features | cta`; `'portfolio'` raises
`gallery | hero`). Bias never overrides an explicit text match.

### `chatPipeline` integration

`chatPipeline.ts` reads `readCodebaseContextManifest()` inside a `try/catch`
(lazy import) and threads `manifest?.projectType` into
`classifyIntent(text, manifest?.projectType)`. The try/catch guarantees a
kv-read failure NEVER blocks the pipeline.

## Trade-offs

- **32 KB chunked cap (vs 4 KB brand).** Codebase summaries are dense. Full
  archive persists in kv; only the head reaches the LLM at injection time.
- **Rule-based heuristic, not LLM.** Deferred until a real corpus exists.
- **Closed 5-enum.** Expansion requires ADR amendment — deliberate guard rail.
- **Single archive, replace-on-upload.** Second upload cleanly replaces first.
- **5 MB ZIP cap.** Source-side guard in the upload widget; allow-list
  extracts only key files.

## Consequences

- (+) Foundation for context-aware routing across the pipeline.
- (+) Zero new migrations — `codebase_context_*` lives in existing kv table.
- (+) AgentProxyAdapter envelope unchanged — tests cost $0.
- (-) Five-enum coverage is narrow; CLI/SDK libs collapse into `unknown`.
- (-) 32 KB injection cap enforced at injection time, not write time. Mirrors
  ADR-067 discipline.

## Cross-references

- **ADR-040** — Local SQLite Persistence (kv table; no new migration).
- **ADR-046** — Multi-Provider LLM Architecture (export-strip registry).
- **ADR-053** — INTENT_ATOM Crystal Atom (Λ extended with `project_context`).
- **ADR-067** — Brand Context Upload (sibling pattern; same kv-chunked motif).

## Status as of P45 seal

- ADR-068 full Accepted ✅
- `codebaseContext.ts` repo + `CodebaseContextUpload.tsx` + Settings mount:
  TRACKED for Wave 2 (A4).
- INTENT_ATOM `project_context` + `classifyIntent` projectType + chatPipeline
  threading: TRACKED for Wave 2 (A5).
- Tests + ADR (this file): shipped Wave 2 (A6).
