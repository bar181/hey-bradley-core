# ADR-044: JSON Patch as the LLM Return Contract

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross
**Phase:** 18

---

## Context

Phase 18 wires the chat input to a real LLM (per ADR-042). That LLM mutates the active `MasterConfig`. The shape of that mutation is the single most important interface decision in Phases 18–22: it defines what the model is allowed to emit, what the renderer is allowed to trust, and where the validator draws its line. Phase 19 (real listen) and Phase 20 (cost cap) inherit the same contract unchanged.

Three forces shape the decision:

1. **Determinism.** Free-form prose and markdown are ambiguous. A novice typing one sentence must produce a deterministic, validatable output the renderer can apply atomically.
2. **Security surface.** Anything that lets the model emit code, HTML, or arbitrary JSON snapshots multiplies the attack surface and the validator's complexity.
3. **Cost.** Snapshot-replacement responses are large and lossy on partial updates. Patch responses are typically <1 KB on Haiku, well inside the per-turn budget (`07-prompts-and-aisp.md` §7).

---

## Decision

The LLM-output envelope is exactly:

```ts
{ patches: JSONPatch[], summary?: string }
```

with `op ∈ {add, replace, remove}` — an RFC-6902 subset that omits `move`, `copy`, and `test`.

### 1. Schema location

`PatchEnvelopeSchema` (Zod) lives in `src/lib/schemas/patches.ts`. `patches` is bounded `1..20`; `summary` is capped at 140 chars. This is the only shape accepted from the model.

### 2. Application

`applyPatches` in `src/contexts/intelligence/applyPatches.ts` clones the current JSON via `structuredClone`, applies every op sequentially, and on **any** single-op failure aborts the entire batch. No partial mutation ever reaches `configStore`. The caller falls back to the canned reply.

### 3. Path gate

`patchValidator.ts` (`src/contexts/intelligence/llm/patchValidator.ts`) imports `isAllowedPath` from `src/lib/schemas/patchPaths.ts`. That file is the **single source of truth** for the whitelist; the prompt builder injects the same array into the system prompt so the model and the validator never drift.

The whitelist (`07-prompts-and-aisp.md` §5) covers:

- `/theme/colors/{primary,secondary,accent,background,foreground,muted}`, `/theme/fonts/{heading,body}`, `/theme/spacing/{xs..xl}`, `/theme/radius`
- `/sections/0/...` (the hero) — heading text/level, subheading, cta, background, backgroundImage, layout variant
- `/sections/<article-idx>/...` (article-as-blog) — title, body, author, heroImage, background; index resolved at validate-time by scanning for `id == "article-01"`
- `/siteContext/{purpose,audience,tone}`

Add/remove are restricted to `/sections/-` (append) and `/sections/<n>` (remove); `add` payloads are type-validated against the per-section Zod schema. For MVP only `replace` is enabled in the validator (`04-phase-18-real-chat.md` §3.5); `add` and `remove` remain in the contract for post-MVP without re-opening the envelope.

### 4. Value-safety policy

Every string leaf in any patch's `value` is checked against `/(javascript:|data:text\/html|vbscript:|<script|on\w+=)/i`. One hit rejects the entire envelope. Path segments containing `__proto__`, `constructor`, or `prototype` are also rejected (prototype-pollution guard).

### 5. Image-typed paths

`backgroundImage` and `heroImage` values must be `https://`, point to an entry in `src/data/mediaLibrary.json` or to an allow-listed CDN host, and use `.jpg|.jpeg|.png|.webp`. No `data:`, `blob:`, `javascript:`, or `vbscript:` (`07-prompts-and-aisp.md` §5.1).

### 6. Trust boundary

The patch envelope is the **only** path through which an LLM mutates `MasterConfig`. The canned fallback (`cannedChat.ts`) now also produces patches through the same applier, so success and fallback paths share one mutation surface. Section renderers, undo/redo, and the audit log all observe a single shape.

---

## Why a subset of RFC-6902?

- `move` and `copy` re-encode information already expressible as `remove` + `add` and double the validator's reachable-path graph.
- `test` is a precondition op that adds round-trip complexity for marginal benefit in a UI-mutation context.
- The narrowed set keeps `patchValidator.ts` <300 lines and keeps the failure modes finite.

---

## Alternatives considered

- **Full RFC-6902** — rejected. Complexity for marginal gain; expands the validator and the failure surface.
- **Model-emitted code (JS/TS snippets).** Rejected. Re-introduces the entire RCE class of risk in a frontend-only app.
- **Full JSON snapshot replacement.** Rejected. Large payloads, lossy on partial updates, fights merge semantics, and explodes diff cost.
- **LangChain runnable graph as the contract.** Rejected. Out of MVP scope; adds dependency churn against an interface that fits in 30 lines (per ADR-042's reasoning).
- **Provider tool-use / function-calling.** Deferred. Both Anthropic and Gemini support it; we stay on raw JSON output for MVP to keep the abstraction provider-neutral. The same envelope slots in behind a tool definition later without changing the contract (`07-prompts-and-aisp.md` §10).

---

## Consequences

### Positive

- **Simpler validator and renderer.** One shape, one applier, one failure surface.
- **Predictable failure modes.** Malformed JSON, invalid path, invalid value — exhaustively enumerable; each maps to a banner + canned fallback.
- **Atomic by construction.** A clone + sequential apply with abort-on-fail means partial mutation is structurally impossible.
- **Forward-compatible.** A future tool-use upgrade lands behind the same envelope without touching call sites.

### Negative

- **Subset means some legitimate edits cost more ops.** A "move section 3 to position 1" becomes `remove` + `add`. Acceptable for MVP.
- **Path whitelist is narrow for MVP.** Edits outside theme/hero/article are rejected today; this is by design (`07-prompts-and-aisp.md` §5).

### Risks

- **Drift between prompt and validator.** Mitigated: both import `ALLOWED_PATHS` from `src/lib/schemas/patchPaths.ts`. A whitelist change updates both atomically.
- **Model emits prose preamble.** Mitigated: `responseParser.ts` strips fences/whitespace and refuses any response whose first char is not `{`; a single retry reminder is allowed before falling back.

---

## Implementation pointer

- `src/lib/schemas/patches.ts` — `PatchEnvelopeSchema`, `JSONPatchSchema`
- `src/lib/schemas/patchPaths.ts` — `ALLOWED_PATHS`, `isAllowedPath` (single source of truth)
- `src/contexts/intelligence/llm/patchValidator.ts` — path gate + value-safety regex + image rules
- `src/contexts/intelligence/applyPatches.ts` — `safeApply` clone-and-abort applier
- `src/contexts/intelligence/llm/responseParser.ts` — fence/whitespace strip; Zod parse
- `src/store/configStore.ts` — `applyPatches(patches)` selector
- Phase 18 plan: `plans/implementation/mvp-plan/04-phase-18-real-chat.md`
- Prompt + path companion: `plans/implementation/mvp-plan/07-prompts-and-aisp.md`

---

## Related ADRs

- ADR-001: JSON Single Source — the aggregate this contract mutates
- ADR-031: JSON Data Architecture — the section/theme schema patches are checked against
- ADR-040: Local SQLite Persistence — `kv` rows for `/siteContext/*` fields and the `llm_calls` audit row
- ADR-045: System Prompt = AISP Crystal Atom — the framing that tells the model to emit this contract

---

## Status as of P20

- Path-resolution helper (`src/data/llm-fixtures/resolvePath.ts`) closes blog-standard hero-corruption class (P19 fix-pass-2 F1).
- CSS-injection guard: `UNSAFE_VALUE_RE` adds `\burl\(` + `@import`; `IMAGE_PATH_RE` adds `imageUrl` (P19 fix-pass-2 F3).
- AbortSignal plumb-through (C20) NOT YET shipped — P20 Day 1 work.
