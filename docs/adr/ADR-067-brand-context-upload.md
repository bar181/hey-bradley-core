# ADR-067: Reference Upload + Brand Context Architecture

**Status:** Accepted
**Date:** 2026-04-28 (P44 Sprint H P1)
**Deciders:** Bradley Ross
**Phase:** P44

## Context

Sprint H opens with reference upload — the first phase to inject user-supplied documents into the LLM pipeline. Focus for P44 is **brand voice / style guide** uploads (TXT/MD direct; PDF/DOCX deferred to a follow-up phase if extraction libraries land). Codebase context (the second reference channel) ships at P45 and reuses the same persistence + injection pattern documented here.

The bottleneck the upload pipeline addresses is the same one Sprint G's interview mode targeted from a different angle: the model has no durable memory of who the user is, what they sound like, or the constraints of their domain. Brand context provides that memory through a single uploaded document the user already owns.

## Decision

### Settings UI (Brand Context section)

A new `BrandContextUpload` component lives in `src/components/settings/` and renders inside `SettingsDrawer.tsx` between the existing LLM settings and Spending limit panels. It accepts `.txt | .md` files, performs client-side text extraction (no server round-trip), and on success writes through `writeBrandContext(text, meta)`.

### Repository (`brandContext.ts`)

Typed CRUD over `kv['brand_context_*']` keys with chunked storage. The repo splits text on a `CHUNK_BYTES` boundary (default `10_000` UTF-16 code units) and writes one row per chunk plus a manifest. Public surface: `hasBrandContext`, `readBrandContextManifest`, `readBrandContext`, `writeBrandContext`, `clearBrandContext`. `writeBrandContext` is delete-then-write atomic so a smaller new doc cannot leave orphan chunks.

Key shape:
- `brand_context_manifest` → JSON `{ count, totalBytes, mimeType, name, uploadedAt }`
- `brand_context_chunk_0..N-1` → string slice, joined in order to reconstruct the full document

### Privacy (export-strip)

`exportImport.ts.isSensitiveKvKey` matches the `brand_context_` prefix; `SENSITIVE_KV_KEYS` lists `brand_context_manifest` for back-compat with the existing test fixture. Uploaded brand documents are user content and never ship inside a `.heybradley` export.

### System Prompt Injection (`buildSystemPrompt`)

`SystemPromptCtx.brandContext?: string` extends the prompt builder context. The injected block is capped at `BRAND_CONTEXT_BYTE_CAP = 4096` UTF-16 code units (the full document remains in kv; only the head reaches the LLM). When the field is omitted, the builder falls back to `readBrandContext()`. Pass an empty string to suppress.

### CONTENT_ATOM Λ Extension

`contentAtom.ts` extends Λ with an optional `brand_voice` channel: `{ present:𝔹, profile:𝕊≤4096, bias:{tone_preference?, lexicon_hints?} }`. Σ width is unchanged — V5 only re-asserts V2 when brand is active so downstream traces can flag brand-aware runs without breaking the strict P31 output contract.

### AISPTranslationPanel "voice: brand-aware" chip

When the most recent classification ran with brand context active, the panel surfaces a small chip alongside the existing `template:` chip. Source-of-truth for the flag is `readBrandContextManifest() !== null` evaluated at submit time and threaded through the pipeline result.

## Trade-offs

- **~$0 cost.** No extraction LLM. Client-side text extraction only; PDF/DOCX libraries deferred until a real corpus appears.
- **4KB injection cap.** The full document persists; only the head hits the LLM. Sufficient for brand voice guidelines (typically <2KB); larger guides will be summarised at a future phase.
- **Chunked reads cost N kv lookups.** Acceptable; N is small (≤2 for the 4KB-cap document) and reads are sql.js-local.
- **No semantic embedding.** Vector retrieval is post-MVP. The 4KB cap is sufficient when the document is the brand-voice guide itself; embeddings become valuable for codebase context (P45+).
- **Single document, replace-on-upload.** No stacked uploads at P44. A second upload cleanly replaces the first; this is the idempotency contract.

## Consequences

- (+) Foundation for P45 codebase context (same persistence + injection channel; different content type + larger cap).
- (+) AgentProxyAdapter fixture corpus is enough to test the end-to-end channel without burning LLM tokens.
- (+) `user_templates` chunking pattern (P30) generalises into kv chunking — one persistence motif for both shapes.
- (+) Composite expected to climb on Capstone (concrete reference-injection demo) + Framer (one-click upload UX).
- (-) `BrandContextUpload` component owns extraction failure surfaces — a corrupt or oversized file must produce a clear UX error, not a silent kv write.
- (-) The 4KB cap is enforced at injection time, not at write time — a 50KB upload still persists in full and only the head reaches the LLM. This is deliberate (room for vector retrieval later) but must be documented in the Settings UI.

## Cross-references

- **ADR-040** — Local SQLite Persistence (kv table + sql.js boot).
- **ADR-041** — Schema Versioning (no new migration; brand_context_* lives in the existing kv table).
- **ADR-046** — Multi-Provider LLM Architecture (export-strip registry; `SENSITIVE_KV_KEYS`).
- **ADR-050** — Template-First Chat Architecture (CONTENT_ATOM consumer surface).
- **ADR-060** — CONTENT_ATOM (Λ extended with optional `brand_voice`).
- **ADR-064** — AISPSurface chip pattern (template chip → brand-aware chip reuses the same affordance).

## Status as of P44 seal

- `brandContext.ts` repo: shipped (A1) ✅
- `exportImport.isSensitiveKvKey` brand_context_ prefix: shipped (A1) ✅
- `buildSystemPrompt` brandContext field type: shipped (A1) ✅
- `contentAtom` Λ brand_voice channel: shipped (A2) ✅
- ADR-067 full Accepted ✅
- BrandContextUpload UI + system prompt body injection + AISPTranslationPanel chip + contentGenerator brandContext signature: TRACKED for Wave 2 / next sub-phase.
