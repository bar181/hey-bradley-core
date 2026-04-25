# Prompts & AISP — System Prompt, Few-Shot Examples, Action Templates

> Companion to Phase 18 (real chat). All prompt material in one place.
> **Scope:** the LLM returns JSON patches *only*. AISP appears in the **system** prompt, never in the model's response.

---

## 1. The System Prompt (canonical form)

The system prompt is built at request time by `buildSystemPrompt(ctx)` where `ctx = { json, history, siteContext }`. The prompt has **four parts** in this order:

1. **Role** (1 sentence)
2. **AISP Crystal Atom** (the spec)
3. **The current site JSON** (compressed, with comments stripped)
4. **The output rule** (one paragraph, repeated at end)

### 1.1 Role line

> You are *Bradley*, the JSON-patch generator behind the Hey Bradley site builder. You produce **only** a JSON object with a `patches` array.

### 1.2 The Crystal Atom (Σ, Γ, Λ, Ε)

Use exactly this block, filled with run-time values where bracketed:

```aisp
⟦
  Ω := { Apply user request as JSON patches against current MasterConfig }
  Σ := {
    Patch       := { op: 𝔼{add,replace,remove}, path: 𝕊, value: 𝕁 ?},
    Envelope    := { patches: [Patch] (1..20), summary: 𝕊 (≤140) ? },
    Section     := { type: SectionType, id: 𝕊, layout: Layout, content: Content, style: Style },
    SectionType := 𝔼{ navbar, hero, features, pricing, action, quotes, questions, numbers,
                      gallery, logos, team, image, divider, text, blog, footer }
  }
  Γ := {
    R1: response.shape == Envelope ∧ response.format == application/json,
    R2: ∀ p ∈ patches : p.path startsWith /sections OR p.path startsWith /theme
                        OR p.path ∈ {/page,/version,/siteContext/purpose,/siteContext/audience,/siteContext/tone},
    R3: ∀ add to /sections/- : value.type ∈ SectionType ∧ unique(value.id),
    R4: ∀ replace : new value matches Σ for that path,
    R5: ∀ remove : p.path resolves to existing node,
    R6: forbid scripts, javascript:, data: URIs in any string value,
    R7: |patches| ≤ 20,
    R8: prose, html, markdown, code-fences = ∅
  }
  Λ := {
    ALLOWED_OPS := {add, replace, remove},
    SCHEMA_VERSION := "aisp-1.2",
    DEFAULT_VARIANT := "default"
  }
  Ε := {
    V1: VERIFY JSON.parse(response) ∈ Envelope,
    V2: VERIFY ∀ p : evaluate(R2..R6) = true,
    V3: VERIFY first character of response is "{"
  }
⟧
```

### 1.3 Current site JSON

A compacted version (no whitespace, no comments) of the active `MasterConfig`. Capped at 4 KB:

```text
CURRENT JSON (truncated to 4 KB; oldest sections kept):
{"spec":"aisp-1.2","page":"index","version":"1.0.0","sections":[{...},{...},...]}
SITE CONTEXT: { purpose: "{purpose}", audience: "{audience}", tone: "{tone}" }
RECENT MESSAGES (last 6):
- user: …
- bradley: …
```

### 1.4 The output rule (final paragraph)

> **Output**: return only a JSON object matching `Envelope`. Do not include explanations, markdown, or code fences. The first character of your response must be `{`. If the user's request is unsafe, off-topic, or impossible, return `{"patches":[],"summary":"<short reason>"}`.

---

## 2. Per-Action Templates

These are *user-prompt fragments* that wrap the raw user input. They live in `src/contexts/intelligence/prompts/templates/`.

### 2.1 Default (free-form)

```text
USER: {{userText}}
```

The system prompt does the heavy lifting; the user message is the user's literal text.

### 2.2 Disambiguation guard

If `userText.length < 4`, prepend:

```text
USER: I just wrote "{{userText}}" — interpret it as a website-editing instruction. If unclear, return an empty patches array with a one-line summary asking what I meant.
```

### 2.3 Site context update (specialized)

If the input clearly targets purpose/audience/tone (e.g., starts with "Make this site for…"), wrap as:

```text
USER: Update the site context. Request: "{{userText}}"
Then propose 1–3 patches (e.g. update /siteContext/purpose, change theme accents to match tone). Do not add or remove sections.
```

### 2.4 Bulk content (rare, kept for completeness)

If the input mentions ≥3 sections in one breath (e.g., kitchen sink), wrap as:

```text
USER: Multi-section update. Apply each separately as patches. Request: "{{userText}}". Cap at 20 patches; defer extra changes with a summary line.
```

The router that picks 2.1/2.2/2.3/2.4 is a **simple switch**. No heuristics, no LLM-based routing. Keep it KISS.

---

## 3. Five Starter Prompts (user-facing)

These appear in the lightbulb dialog as one-tap examples for novices. Each was chosen because it produces a clean 1–3-patch result.

| # | Prompt | Expected patch shape |
|---|---|---|
| 1 | *Make the hero say "Bake Joy Daily."* | `replace /sections/0/content/heading/text "Bake Joy Daily."` |
| 2 | *Add a pricing section with three plans.* | `add /sections/- {…full pricing section…}` |
| 3 | *Change the accent color to forest green.* | `replace /theme/colors/accent "#14532d"` |
| 4 | *Remove the testimonials section.* | `remove /sections/<idx-of-testimonials>` |
| 5 | *Make this site for a Brooklyn bakery.* | up to 3: replace `/siteContext/purpose`, `/siteContext/audience`, `/theme/colors/accent` |

Each starter has a recorded "golden" expected envelope used as a unit test in `tests/chat-real.spec.ts`.

---

## 4. Few-Shot Examples (in the system prompt; optional)

Few-shot examples are **off by default** to keep tokens low. If a checkpoint shows the model struggles, enable two examples by setting `VITE_LLM_FEW_SHOT=true`. Examples are short and intentionally diverse:

### 4.1 Example A — single replace

```text
EXAMPLE
USER: Make the hero say "Hello world"
RESPONSE:
{"patches":[{"op":"replace","path":"/sections/0/content/heading/text","value":"Hello world"}],"summary":"Updated hero headline."}
```

### 4.2 Example B — append a section

```text
EXAMPLE
USER: Add a simple pricing section
RESPONSE:
{"patches":[{"op":"add","path":"/sections/-","value":{"type":"pricing","id":"pricing-01","layout":{"display":"grid","columns":3},"content":{"plans":[{"name":"Starter","price":"$0","features":["1 site"]},{"name":"Pro","price":"$20","features":["5 sites","custom themes"]},{"name":"Team","price":"$99","features":["20 sites","priority support"]}]},"style":{"background":"#faf8f5"}}}],"summary":"Added a 3-plan pricing section."}
```

If a third example is enabled later, prefer one with `remove` to balance op coverage.

---

## 5. Path Whitelist (validator-side)

The patch validator (Phase 18) enforces that every patch path matches one of:

```
/page
/version
/sections                         (only as /sections/- with op=add)
/sections/{n}                     (op in {replace, remove})
/sections/{n}/content/**          (op in {add, replace, remove})
/sections/{n}/layout/**           (op in {add, replace, remove})
/sections/{n}/style/**            (op in {add, replace, remove})
/theme/**                         (op in {add, replace, remove})
/siteContext/purpose              (op in {add, replace})
/siteContext/audience             (op in {add, replace})
/siteContext/tone                 (op in {add, replace})
```

`{n}` is bounded by current section count + 1. Anything else is rejected before apply.

---

## 6. Safety Filter

Before sending the call:

- Strip leading/trailing whitespace.
- If `userText` matches a regex of credential-shaped strings (`sk-…`, `AIza…`, OAuth tokens, JWTs), refuse the call locally with a banner: *"Looks like you pasted a key. Use the Settings panel for that."* Do not send the text to the LLM.
- If `userText` contains `<script` or `javascript:` outside a code-fence demonstration, allow but flag for the validator (which will reject any patch that introduces those values).

After receiving the response:

- Strip any leading `​` / BOM.
- Strip code-fence wrapping if present (`/^```(?:json)?\s*([\s\S]*?)\s*```$/`).
- Refuse if the trimmed first character is not `{`.

These rules cost <50 LOC and prevent the most common drift modes.

---

## 7. Cost-Sensitive Token Budget

Per request:

| Slot | Tokens (target) | Notes |
|---|---|---|
| Role | 25 | fixed |
| Crystal Atom | 320 | fixed; cache-friendly |
| Current JSON | ≤ 1,200 | hard cap at 4 KB raw → ~1k tokens |
| Last 6 messages | ≤ 600 | summarized inline |
| Output rule | 60 | fixed |
| User message | ≤ 200 | typical |
| **System total** | **≤ 2,400** | aim for 2k typical |

`VITE_LLM_MAX_TOKENS_OUT = 1024` covers the full envelope including a 20-patch worst case.

Cost on Haiku at ≤ 2.4k in / ≤ 1k out per request ≈ **$0.0019/turn** — well under cap.

---

## 8. Failure-Mode Handbook

| Symptom | Likely cause | First fix |
|---|---|---|
| Response starts with markdown fence | Model paraphrasing | Tighten output rule; strip in parser; do not weaken schema |
| Response has prose preamble | Same | Same |
| Patches reference non-existent IDs | Hallucination | Validator rejects; banner says "Hmm, I made up an ID, please rephrase" |
| All 5 starters fail | System prompt drift or wrong model | Run `testConnection`; re-pin model |
| Spike in cost | Loop in retries | Cap retries at 1; `chatPipeline` lock prevents concurrent calls |
| Same input → different patches every time | Temperature too high | Set `temperature: 0.2` for chat; expose flag in `LLMSettings` later |

---

## 9. Glossary (LLM-specific)

| Term | Meaning |
|---|---|
| **Envelope** | The single JSON object the model returns: `{ patches, summary? }` |
| **Crystal Atom** | The structured AISP block in the system prompt |
| **Path whitelist** | Regex set the validator enforces |
| **Golden expected envelope** | The test fixture for each starter prompt |
| **Few-shot off** | Default; saves tokens; flips on if accuracy drops |

---

## 10. Decision: We do **not** use tool-use / function-calling for MVP

- Both Anthropic and Gemini support tool-use; they would let us specify the schema as a tool.
- We deliberately stay with raw JSON output to keep the abstraction provider-neutral and KISS.
- Post-MVP: introduce tool-use under the same `LLMAdapter`. The envelope shape does not change.

---

## 11. Decision: We do **not** stream tokens for MVP

- Streaming would require partial-JSON parsing, which is fragile.
- The patch envelope is small (≤ 1 KB typical); end-to-end p50 ≤ 4 s on Haiku is acceptable.
- The typewriter remains in the UI for *summary* text, not for the JSON.

---

## 12. Where this file feeds into code

| File | What it imports from here |
|---|---|
| `src/contexts/intelligence/prompts/system.ts` | The Crystal Atom (template literal) |
| `src/contexts/intelligence/prompts/contextBuilder.ts` | The current-JSON compaction rules and 4 KB cap |
| `src/contexts/intelligence/prompts/templates/index.ts` | The 4 per-action wrappers |
| `src/contexts/intelligence/llm/responseParser.ts` | The strip/normalize rules in §6 |
| `src/contexts/intelligence/llm/patchValidator.ts` | The path whitelist in §5 |
| `tests/chat-real.spec.ts` | The golden envelopes for the 5 starters in §3 |
