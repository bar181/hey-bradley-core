# ADR-045: System Prompt = AISP Crystal Atom

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross
**Phase:** 18

---

## Context

ADR-044 fixes the LLM's *output* shape — a JSON patch envelope. That settles what the model returns, but not how the model is *framed* to return it reliably. Phase 18 needs the LLM to behave deterministically against the JSON contract on the first try, across two providers (Claude Haiku and Gemini Flash), under a tight token budget (`07-prompts-and-aisp.md` §7), and without a tool-use crutch (deferred per `07 §10`).

Plain English instructions ("only return JSON, no prose, follow this schema") were the obvious starting point. Early manual tests showed unacceptable rates of markdown fences, prose preamble, and hallucinated section types — the standard failure modes of free-form prompting against a structured contract.

AISP (the AI Symbolic Protocol, public reference: `https://github.com/bar181/aisp-open-core`, authored by the same creator as this project) is purpose-built for this: a math-first, symbol-dense framing designed for AI-to-AI communication with near-zero ambiguity. Its 512-symbol surface is understood natively by frontier LLMs without instructions. The Crystal Atom block (`Ω, Σ, Γ, Λ, Ε`) is exactly the shape we need to specify a contract.

---

## Decision

The Phase 18 system prompt embeds an **AISP Crystal Atom** describing the schema, the allowed ops, the valid section types, and a verification clause the model self-checks before emitting. The model's *response* remains plain JSON per ADR-044; AISP appears **only** in the system prompt.

### 1. Crystal Atom contents

The atom (per `07-prompts-and-aisp.md` §1.2) contains:

- **Ω (objective)** — apply user requests as JSON patches against the current `MasterConfig`.
- **Σ (schema)** — `Patch`, `Envelope`, `Section`, and the enumerated `SectionType` set.
- **Γ (rules)** — R1..R8: response shape, allowed paths, add-uniqueness, replace shape-match, remove existence, value safety, patch-count cap, "no prose / html / markdown / code-fences".
- **Λ (lexicon)** — `ALLOWED_OPS`, `SCHEMA_VERSION`, `DEFAULT_VARIANT`.
- **Ε (verification)** — V1..V3: parse check, rule check, first-char-is-`{` check the model performs *before* emitting.

The block is followed by the compacted current site JSON (≤ 4 KB, oldest sections kept), the site-context triple (`purpose`, `audience`, `tone`), the last six chat messages, and the output-rule paragraph (repeated at end for recency bias). Token budget targets ~2,400 tokens system-side (`07 §7`); the Crystal Atom itself is ~320 tokens.

### 2. Implementation pointer

`src/contexts/intelligence/prompts/system.ts` exports `buildSystemPrompt(ctx)`. The Crystal Atom is a template literal whose run-time slots (current JSON, history, site context, the injected `ALLOWED_PATHS` whitelist from ADR-044, and the 30-entry media-library sample from `07 §5.1`) are filled by `contextBuilder.ts`. Both prompt builder and `patchValidator.ts` import `ALLOWED_PATHS` from the same module — no drift (see ADR-044 §3).

### 3. Per-section atom inlining (deferred)

ADR-032 defined per-section Crystal Atoms. When a user request targets one section type, the prompt builder *may* inline the per-section atom in addition to the global one, narrowing the rule set the model must satisfy. Phase 18 Step 3 implements the **global atom only**; per-section inlining is a deferred optimization tracked in `mvp-plan/REVIEW.md` §2.5 (P3). The hook exists in `system.ts` but is feature-flagged off.

### 4. AISP in prompt only — not in response

The model returns plain JSON per ADR-044. AISP-in-response would require a parallel AISP parser layer to extract the patch envelope, doubling the validator surface for no measurable gain — the JSON envelope is already the contract. The Crystal Atom is the *framing*, not the *payload*.

---

## Trade-off

The Crystal Atom adds ~320 tokens to every system prompt. On Haiku at the documented per-turn budget (~2.4k in / ~1 k out, $0.0019/turn — `07 §7`), this is well under the cost cap (ADR-047). Anthropic prompt caching, when adopted post-MVP, reduces the marginal cost of the cached prefix toward zero. Compliance gains observed in early manual tests against both providers justify the cost today.

---

## Alternatives considered

- **Plain English prompt only.** Rejected. Higher ambiguity, worse compliance against the JSON contract in early tests; markdown fences and prose preamble appeared frequently.
- **AISP both in prompt AND response.** Rejected. Duplicate complexity. The JSON envelope (ADR-044) is sufficient as the contract; an AISP-encoded response would need its own parser and would not improve determinism.
- **Per-action specialized prompts (one prompt per starter).** Deferred to Phase 19+. The single global atom plus the four per-action wrappers in `07 §2` already cover the MVP surface.
- **Provider tool-use / function-calling as the framing.** Deferred per ADR-044 / `07 §10`. When adopted post-MVP, the Crystal Atom continues to live in the system prompt; the tool definition replaces the output-rule paragraph.

---

## Consequences

### Positive

- **First-try compliance is materially higher** than plain English on both Haiku and Gemini Flash in early tests (the rule we cared about: response starts with `{`, no fences, no prose).
- **Drift is structurally limited.** Σ and Γ are explicit; the validator enforces the same rules; a model that wanders outside Σ is caught at validate-time, not render-time.
- **Sets up AISP-as-orchestration without coupling MVP to it.** Phase 19 (listen) and Phase 20+ (cost-aware routing) inherit the same atom; per-section atoms (ADR-032) and post-section AISP tooling slot in behind the same module without contract changes.

### Negative

- **~320 extra tokens per request.** Acceptable per the budget table; mitigated further by prompt caching when adopted.
- **AISP literacy requirement on contributors.** The system-prompt source contains symbolic AISP. Mitigated by the public reference (`https://github.com/bar181/aisp-open-core`), the inline comments in `system.ts`, and the fact that contributors edit content slots, not the atom structure.

### Risks

- **A model regression silently weakens compliance.** Mitigated by the five golden envelopes in `tests/chat-real.spec.ts` (`07 §3`) and the audit log in `llm_calls`. A drop in the `valid_json` ratio is observable and triggers a replan per `04-phase-18 §6.4`.
- **Tokenizer treatment of AISP symbols varies by provider.** Mitigated by measuring per-provider token cost on each model bump (P17 already records this).

---

## Implementation pointer

- `src/contexts/intelligence/prompts/system.ts` — `buildSystemPrompt(ctx)`; the Crystal Atom template
- `src/contexts/intelligence/prompts/contextBuilder.ts` — current-JSON compaction, history pull, site-context join
- `src/contexts/intelligence/prompts/templates/index.ts` — the four per-action user-message wrappers (`07 §2`)
- `src/lib/schemas/patchPaths.ts` — `ALLOWED_PATHS` injected into the atom and consumed by the validator
- Phase 18 plan: `plans/implementation/mvp-plan/04-phase-18-real-chat.md`
- Prompt + AISP companion: `plans/implementation/mvp-plan/07-prompts-and-aisp.md`
- AISP reference: `plans/initial-plans/00.aisp-reference.md`
- AISP open-core repo: `https://github.com/bar181/aisp-open-core`

---

## Related ADRs

- ADR-026: AISP Output — establishes AISP as a first-class artifact in the project
- ADR-032: Section-Level Crystal Atoms — per-section atoms this prompt may later inline
- ADR-042: LLM Provider Abstraction — the adapter surface this prompt is shipped through
- ADR-044: JSON Patch Contract — the response shape this framing exists to elicit
