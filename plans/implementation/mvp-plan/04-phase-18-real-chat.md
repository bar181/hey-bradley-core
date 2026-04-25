# Phase 18 — Real Chat Mode (LLM → JSON Patches)

> **Stage:** C — Real LLM
> **Estimated effort:** 5–7 days
> **Prerequisite:** Phase 17 closed (adapter + BYOK + audit log live).
> **Successor:** Phase 19 — Real Listen.

---

## North Star

> **A novice types one sentence into chat. Within a few seconds the preview reflects exactly that change. The LLM returns only a JSON patch; the renderer does the rest.**

This is the keystone of the MVP. The user explicitly said the LLM's job is "returning the JSON updates (similar to the example in chat)". Everything in this phase is in service of that single loop.

---

## 0. Interactive Validation — Build the Loop in Three Steps

> **Directive:** do not implement Phase 18 as a single push. Stage it. Each step is a working, demonstrable end-to-end loop; later steps add depth without redesigning.

### Step 1 — Wire the loop (≈ 4 hours)

**Goal:** prove that *one* round trip — browser → LLM → JSON → store → re-render — actually works on this hardware, this network, this key.

**Scope (kept deliberately small):**
- Hardcoded user prompt button (e.g., a temporary **[Run Step 1 test]** button in `LLMSettings.tsx`): clicking it calls `adapter.complete()` once with a fixed system prompt and a fixed user prompt: *"Return a JSON object that replaces the hero heading text with the string 'Hello from LLM'."*
- The system prompt is the *minimum viable* version — only `Σ` and `Γ:R1, R8` from the Crystal Atom (envelope shape + JSON-only output rule). No history, no site JSON, no site context.
- Response is parsed with a 3-line tolerant `JSON.parse` (no Zod yet).
- Apply directly via `configStore.applyPatches(envelope.patches)`.
- No fallback, no validator, no audit, no cost meter.

**Acceptance for Step 1:**
- [ ] Pressing the test button changes the visible hero heading to "Hello from LLM" within 8 s.
- [ ] On failure (network/parse) the button shows a one-line error toast; nothing is mutated.
- [ ] One screenshot in `phase-18/session-log.md` showing before/after.

**Why this matters:** if Step 1 doesn't work, nothing downstream will. It's also the smallest possible thing the user can demo to confirm "yes the LLM is driving the JSON".

### Step 2 — One real user prompt end-to-end (≈ 1–2 days)

**Goal:** wire the actual chat input to the same loop, with one prompt template, full validation, on a real golden test.

**Scope:**
- Remove the temporary test button. The chat input itself drives the loop.
- One starter prompt is wired: *"Make the hero say '{your headline}'."*
- Build out the full system prompt from `07-prompts-and-aisp.md` §1 (Crystal Atom + current JSON + output rule).
- `responseParser.ts` Zod-validates against `PatchEnvelopeSchema`.
- `patchValidator.ts` enforces the path whitelist for the `replace` op only.
- One Playwright test: type the prompt → assert heading text changed.
- Audit log row written for every call (success and failure).
- Latency timed and recorded; expect ≤ 4 s p50 on Haiku.

**Acceptance for Step 2:**
- [ ] Typing *"Make the hero say 'Bake Joy Daily.'"* updates the preview within 4 s p50.
- [ ] `tests/chat-real.spec.ts` golden envelope passes against a mocked adapter.
- [ ] An invalid response shape (forced via fixture) reverts cleanly with an inline banner.
- [ ] `llm_calls` table contains the corresponding row (status, tokens, cost).

**Why this matters:** by the end of Step 2, the contract is real: prompt → patch → render is the whole product, not a bench test.

### Step 3 — Advanced: full DoD (≈ 2–3 days)

**Goal:** bring Phase 18 to the full Definition of Done in §5 below.

**Scope (anything not in Steps 1–2):**
- All 5 starter prompts pass golden tests (`07 §3`).
- `add` and `remove` ops fully validated (sections + theme paths).
- Multi-patch apply atomic; abort the whole batch on any failure.
- Canned `cannedChat.parseChatCommand` fallback wired for parse / network / validate failures.
- In-flight mutex (`intelligenceStore.inFlight`) prevents concurrent calls from chat or listen.
- Cost-cap pre-check (stub from Phase 17) refuses calls above ceiling.
- Unsafe value regex (`javascript:`, `data:text/html`, prototype-pollution path segments) rejected by validator.
- Two negative tests in `tests/chat-fallback.spec.ts` (parse fail + network fail).
- ADR-044 and ADR-045 merged.

**Acceptance for Step 3:** every DoD item in §5 below ✓.

### Staging summary

| Step | What works at the end | Effort | Demo to user? |
|---|---|---:|---|
| 1 | One hardcoded round-trip mutates the hero | 4 h | Yes — "the wire works" |
| 2 | One real user prompt with validation | 1–2 d | Yes — "the contract works" |
| 3 | All 5 starters, fallback, audit, mutex | 2–3 d | Yes — "the phase is shippable" |

The user gates each transition. If Step 1 reveals a CORS or key issue, we resolve it *there* — not after writing 700 lines of validator code.

---

## 1. Specification (S)

### 1.1 What changes

1. The chat input invokes `intelligenceStore.adapter.complete(...)` instead of `parseChatCommand(...)`.
2. The system prompt is the **AISP Crystal Atom** described in `07-prompts-and-aisp.md` plus the current site JSON, current site context (purpose/audience/tone), and the JSON-patch schema.
3. The LLM **must return only** `{ "patches": JSONPatch[] }`. No prose, no code.
4. The response is parsed by `responseParser.ts`, validated by `patchValidator.ts`, and applied to `configStore`.
5. On any failure (network, parse, validate) → graceful banner + fallback to `cannedChat.parseChatCommand` for the same input. **Demos never break.**
6. Chat history persists to DB (already wired in P16).

### 1.2 What does **not** change

- Section renderers.
- The chat UI (typewriter playback stays). We swap the engine, not the look.
- `cannedChat.ts` stays as the fallback.

### 1.3 Novice impact

- Same UX as today, with vastly more capability.
- Same error path: a calm banner, never a crash.

---

## 2. Pseudocode (P)

```
on user submit "<userText>":
  add userMessage(text=userText) to chatStore
  ctx = buildContext()    // current JSON + site context + history (last 6)
  sysPrompt = buildSystemPrompt(ctx)
  req = { systemPrompt: sysPrompt, userPrompt: userText, schema: PatchEnvelopeSchema }
  res = await adapter.complete(req)

  if res.ok:
    parsed = parseResponse(res.json)              // Zod
    if !parsed.success:
      retryOnce(req with reminder)
    if still fails:
      fallback(userText)                          // canned
      return
    invalidPatches = validatePatches(parsed.data.patches, currentJSON)
    if invalidPatches.length > 0:
      fallback(userText)                          // safer than partial apply
      return
    configStore.applyPatches(parsed.data.patches) // single store mutation
    add bradleyMessage(typewriter(summary(parsed.data.patches)))
    db.llm_calls.insert({ ok, tokens, cost, patches })
  else:
    fallback(userText)
```

Fallback is the *same* `parseChatCommand` and `parseMultiPartCommand` already used. If the canned path also has nothing for this input, Bradley replies: *"I didn't catch that. Try 'Add a pricing section' or 'Make the hero say …'."*

---

## 3. Architecture (A)

### 3.1 DDD context

`Intelligence` writes to the `Configuration` aggregate via the patch contract. No new context.

### 3.2 Files touched / created

| Action | Path | Purpose |
|---|---|---|
| CREATE | `src/contexts/intelligence/prompts/system.ts` | System-prompt builder (AISP Crystal Atom) |
| CREATE | `src/contexts/intelligence/prompts/contextBuilder.ts` | Compresses current JSON + history into the user message envelope |
| CREATE | `src/contexts/intelligence/llm/responseParser.ts` | Zod-validated `{patches:[…]}` extractor; tolerant to leading/trailing prose |
| CREATE | `src/contexts/intelligence/llm/patchValidator.ts` | Path/type checks against current JSON |
| CREATE | `src/contexts/intelligence/applyPatches.ts` | Bridge to `configStore` (RFC-6902 subset) |
| CREATE | `src/lib/schemas/patches.ts` | Zod schema for `JSONPatch[]` |
| EDIT | `src/components/shell/ChatInput.tsx` | Swap engine; keep typewriter; banner on fallback |
| EDIT | `src/store/configStore.ts` | Add `applyPatches(patches)` selector that runs validators + commits |
| EDIT | `src/lib/cannedChat.ts` | Export a unified `cannedFallback(input)` used by both modes |
| CREATE | `docs/adr/ADR-044-json-patch-contract.md` | Decision record |
| CREATE | `docs/adr/ADR-045-system-prompt-aisp.md` | Decision record |
| CREATE | `tests/chat-real.spec.ts` | Mocks `LLMAdapter`; asserts patch round-trip |
| CREATE | `tests/chat-fallback.spec.ts` | Forces error; asserts canned fallback |
| EDIT | `src/store/intelligenceStore.ts` | Add `lastFailureReason` for banner UX |

### 3.3 ADRs to author

#### ADR-044 — JSON Patch as the LLM Return Contract

- **Decision:** All LLM-driven mutations to `MasterConfig` arrive as `{ "patches": JSONPatch[] }` where the patch op is restricted to `add|replace|remove`. The LLM may not emit any other shape.
- **Why a subset?** `move`, `copy`, `test` add complexity for marginal gain. Restriction simplifies the validator and reduces failure modes.
- **Why not full RFC-6902?** Same.
- **Status:** Accepted.

#### ADR-045 — System Prompt = AISP Crystal Atom

- **Decision:** The system prompt embeds an AISP Crystal Atom describing the schema, allowed ops, valid section types, and the verification clause that the model must self-check before answering.
- **Rationale:** AISP's published goal is <2% ambiguity. The Crystal Atom format gives the model an explicit Σ (schema) and Γ (rules); compliance is then naturally high.
- **Trade-off:** Slightly longer system prompt; mitigated by Anthropic prompt caching (post-MVP).
- **Status:** Accepted.

### 3.4 The patch envelope schema

```ts
// src/lib/schemas/patches.ts
import { z } from 'zod';

export const JSONPatchSchema = z.object({
  op: z.enum(['add', 'replace', 'remove']),
  path: z.string().regex(/^\/(?:[^\/~]|~0|~1)*(?:\/(?:[^\/~]|~0|~1)*)*$/),
  value: z.unknown().optional(),
});

export const PatchEnvelopeSchema = z.object({
  patches: z.array(JSONPatchSchema).min(1).max(20),
  // Optional, used only for typewriter caption:
  summary: z.string().max(140).optional(),
});

export type PatchEnvelope = z.infer<typeof PatchEnvelopeSchema>;
```

### 3.5 Patch validation rules

`patchValidator.ts` rejects any patch where:

- The path resolves into something outside `/sections/...` or `/theme/...` or top-level whitelisted keys (`/page`, `/version`, `/siteContext/*`).
- An `add` to `/sections/-` (append) carries an unknown `type`.
- A `replace` writes a value whose Zod section schema fails.
- A `remove` references an ID that does not exist.
- A patch path includes script tags or any `javascript:` URL in a string value.

Failure → return list of reasons → caller falls back to canned reply.

### 3.6 Apply step

```ts
// src/contexts/intelligence/applyPatches.ts
import { applyPatch } from 'fast-json-patch'; // tiny dep, deterministic, well-tested

export function safeApply(json: unknown, patches: JSONPatch[]) {
  // Clone + apply atomically; if any single op throws, abort the whole batch.
  const cloned = structuredClone(json);
  for (const p of patches) applyPatch(cloned, [p], true, true);
  return cloned;
}
```

`configStore.applyPatches` calls `safeApply(currentJson, patches)`, then sets the result, then notifies subscribers (single render).

### 3.7 Chat input wiring

```tsx
// pseudocode in ChatInput.tsx
async function onSubmit(text: string) {
  appendUserMessage(text);
  const adapter = useIntelligenceStore.getState().adapter;
  const sys = buildSystemPrompt({ json: configStore.getState().json, history: lastN(6) });
  const r = await adapter.complete({ systemPrompt: sys, userPrompt: text, schema: PatchEnvelopeSchema });
  if (r.ok) {
    const env = PatchEnvelopeSchema.safeParse(r.json);
    if (!env.success) return fallback(text);
    const errs = validatePatches(env.data.patches, configStore.getState().json);
    if (errs.length) return fallback(text);
    configStore.getState().applyPatches(env.data.patches);
    appendBradleyMessage(env.data.summary ?? defaultSummary(env.data.patches));
    auditOk(r, env.data.patches);
  } else {
    fallback(text);
    auditFail(r);
  }
}
```

(The real implementation reuses the existing typewriter machinery.)

### 3.8 Few-shot starter prompts

See `07-prompts-and-aisp.md` §3 for full templates. The chat ships with five starter prompts visible in the lightbulb dialog:

1. *Make the hero say "{your headline}".*
2. *Add a pricing section with three plans.*
3. *Change the accent color to forest green.*
4. *Remove the testimonials section.*
5. *Make this site for a Brooklyn bakery.*

These map cleanly to one-or-two-patch outputs and act as guardrails for the model.

---

## 4. Refinement (R)

### 4.1 Checkpoints

- **A — Single-patch happy path.** *"Make the hero headline say 'Bake Joy Daily.'"* → one `replace` patch → preview updates. Latency under 4 s on Haiku.
- **B — Multi-patch.** *"Add a pricing section with three plans."* → one `add` patch with a populated section.
- **C — Unsafe input.** *"Inject a `<script>alert(1)</script>` into the hero."* → patch validator rejects → fallback message.
- **D — Validation failure.** Force a malformed JSON response (test fixture) → 1 retry → fallback. Observable in `llm_calls` audit.
- **E — Network failure.** Disconnect, type a known canned phrase → falls back to canned reply.
- **F — Cost cap.** Spike the per-call usage to exceed cap → calls hard-stop with banner.

### 4.2 Intentionally deferred

- Streaming token rendering (the typewriter on summary string is sufficient).
- Multi-turn memory beyond the last 6 messages.
- Tool-use / function-calling (we use plain JSON; switching to tool-use is a post-MVP upgrade behind the same envelope).

---

## 5. Completion (C) — DoD Checklist

- [ ] `applyPatches` is the *only* path through which LLM output mutates `configStore`
- [ ] `PatchEnvelopeSchema` is the *only* shape accepted from the model
- [ ] System prompt is built deterministically from `buildSystemPrompt`
- [ ] Five canned "easy wins" produce successful patches against Haiku
- [ ] Validator rejects out-of-scope paths and unsafe values
- [ ] Fallback reuses `cannedChat.parseChatCommand` cleanly
- [ ] Latency p50 ≤ 4 s on Haiku for single-patch prompts (measured from input submit to render)
- [ ] `tests/chat-real.spec.ts` mocks the adapter; asserts patches apply
- [ ] `tests/chat-fallback.spec.ts` forces both error and parse failure paths
- [ ] All five starter prompts have a passing test
- [ ] No `console.error` during a happy-path run
- [ ] ADR-044 and ADR-045 merged
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds
- [ ] Test count ≥ previous + 5
- [ ] Master checklist updated

---

## 6. GOAP Plan

### 6.1 Goal state

```
goal := PatchSchemaDefined ∧ SystemPromptBuilt ∧ ParserOk ∧ ValidatorOk ∧ ApplyOk
        ∧ FallbackOk ∧ FiveStartersGreen ∧ AuditWritten ∧ TestsPass
```

### 6.2 Actions

| Action | Preconditions | Effects | Cost |
|---|---|---|---|
| `define_patch_schema` | repo clean | PatchSchemaDefined | 1 |
| `build_system_prompt` | PatchSchemaDefined | SystemPromptBuilt | 2 |
| `build_response_parser` | PatchSchemaDefined | ParserOk | 1 |
| `build_patch_validator` | PatchSchemaDefined ∧ ConfigSchemaKnown | ValidatorOk | 2 |
| `wire_apply_patches` | ValidatorOk | ApplyOk | 2 |
| `swap_chat_engine` | ApplyOk ∧ AdapterReady | EngineSwapped | 2 |
| `wire_fallback` | EngineSwapped ∧ CannedAvailable | FallbackOk | 1 |
| `validate_five_starters` | EngineSwapped | FiveStartersGreen | 3 |
| `wire_audit_log` | EngineSwapped ∧ DBReady | AuditWritten | 1 |
| `author_adr_044_045` | PatchSchemaDefined ∧ SystemPromptBuilt | ADRsMerged | 1 |
| `add_chat_real_test` | ApplyOk | RealTestPass | 1 |
| `add_chat_fallback_test` | FallbackOk | FallbackTestPass | 1 |
| `run_build` | RealTestPass ∧ FallbackTestPass | GoalMet | 1 |

### 6.3 Optimal plan (cost = 19)

```
1. define_patch_schema
2. build_system_prompt        ┐ parallel
3. build_response_parser      │
4. build_patch_validator      ┘
5. wire_apply_patches
6. swap_chat_engine
7. wire_fallback              ┐
8. wire_audit_log             ┘ parallel
9. author_adr_044_045         ┐ parallel
10. add_chat_real_test        │
11. add_chat_fallback_test    ┘
12. validate_five_starters
13. run_build
```

### 6.4 Replan triggers

- Haiku consistently emits prose preamble → tighten the system prompt's "Output **only** the JSON object" instruction; do **not** weaken the schema.
- `applyPatch` mutates the store but render does not update → confirm `configStore` selector subscriptions; do **not** add a manual re-render call.
- Latency exceeds 6 s p50 → reduce `last N` history from 6 to 3; remove example sites from system prompt.

---

## 7. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Model includes prose around JSON | H | Tolerant parser strips first/last to JSON object; if still fails, retry with reminder, then fall back |
| Model invents section types | M | Validator restricts to known types; rejected patches → fallback |
| Patch crashes mid-batch | M | Atomic apply on a clone; abort whole batch on any failure |
| User input is multi-step too complex | M | Five canned starters set expectations; longer prompts may produce >20 patches → reject by schema |
| Fast-typing user submits 10 prompts | M | Disable input while a request is in flight; queue length 1 |

---

## 8. Hand-off to Phase 19

- `applyPatches` is callable from anywhere.
- The chat input is provider-driven with canned fallback.
- Phase 19 reuses this same pipeline; only the *input source* changes from text to STT.
