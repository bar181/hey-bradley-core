# LLM Prompt Types in Hey Bradley — Reference

> **Date:** 2026-04-29 (post Sprint M seal at 3398702)
> **Source for:** the internal-agent smoke test at `tests/p57-llm-prompt-smoke.spec.ts`
> **Pair this with:** ADR-045 (PATCH_ATOM), ADR-053 (INTENT_ATOM), ADR-060 (CONTENT_ATOM), ADR-064 (ASSUMPTIONS_ATOM), ADR-073 (Personality composition — NOT an LLM call).

Hey Bradley has **4 LLM prompt surfaces + 1 composition layer**. Every LLM call routes through a single chokepoint (`auditedComplete()`) which writes to `llm_logs` + `llm_calls` per ADR-047. The composition layer is pure-rule, $0, no LLM call.

---

## 1. PATCH_ATOM — JSON-patch generator (the marquee)

**Files:**
- Builder: `src/contexts/intelligence/prompts/system.ts` — `buildSystemPrompt(ctx)`
- Caller: `src/contexts/intelligence/chatPipeline.ts` → `runLLMPipeline()`
- ADR: ADR-045

**System prompt (verbatim, abridged):**
```
You are Bradley, the JSON-patch generator behind the Hey Bradley site builder.
You produce ONLY a JSON object with a `patches` array.

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
  Γ := { R1..R8 — JSON shape, allowed paths, forbidden URI schemes, |patches|≤20 }
  Λ := { ALLOWED_OPS:={add,replace,remove}, SCHEMA_VERSION:="aisp-1.2" }
  Ε := { V1: VERIFY JSON.parse(response) ∈ Envelope, V2..V3 }
⟧
```

[+ optional brand context block]
[+ optional personality_layer block (Sprint J P50)]
ALLOWED PATHS (...): /sections, /theme, /page, /version, /siteContext/*
CURRENT JSON (truncated to 4 KB; oldest sections kept): {compactJson}
[+ optional SITE CONTEXT line]
[+ optional RECENT MESSAGES last 6 turns]

Output: return ONLY a JSON object matching `Envelope`. Do not include
explanations, markdown, or code fences. The first character of your
response must be "{".
```

**Sample user prompt (from `example_prompts` seed):**
```
Make the hero say "Bake Joy Daily"
```

**Expected response (verbatim from AgentProxy fixture):**
```json
{
  "patches": [
    {
      "op": "replace",
      "path": "/sections/1/components/1/props/text",
      "value": "Bake Joy Daily"
    }
  ],
  "summary": "Updated hero headline."
}
```

**What it does + how output is used:**
1. LLM returns `{patches, summary?}` envelope
2. `parseResponse()` validates JSON shape via Zod
3. `validatePatches()` enforces Γ rules (allowed paths, forbidden URIs, ≤20 patches)
4. `useConfigStore.getState().applyPatches()` applies the patches
5. Preview re-renders instantly
6. `summary` drives the typewriter chat reply

---

## 2. INTENT_ATOM — LLM intent classification fallback

**Files:**
- Caller: `src/contexts/intelligence/aisp/llmClassifier.ts` — `llmClassifyIntent(text)`
- Atom def: `src/contexts/intelligence/aisp/intentAtom.ts`
- ADR: ADR-053 / ADR-056

**System prompt (verbatim):**
```
You are an AISP-native intent classifier for the Hey Bradley site builder.

Below is the canonical Crystal Atom that defines your output contract:

[INTENT_ATOM verbatim — the same Crystal Atom literal]

Your job: read the user's input and return a JSON object matching this exact shape:
{
  "verb": "hide" | "show" | "change" | "remove" | "add" | "reset",
  "target": { "type": <one of allowed types>, "index": <1-based int or null> } | null,
  "params": { ...verb-specific } | undefined,
  "confidence": <number in [0,1]>,
  "rationale": "<short trace>"
}

Respond with ONLY the JSON object. No prose. No markdown fences.
```

**Sample user prompt:**
```
maek hero brigtter
```

**Expected response:**
```json
{
  "verb": "change",
  "target": { "type": "hero", "index": null },
  "params": null,
  "confidence": 0.91,
  "rationale": "maek = make typo; brigtter = brighter typo; user wants hero appearance change"
}
```

**Cost discipline:** fires ONLY when rule-based AISP returns confidence < 0.85 AND `sessionUsd < capUsd × 0.9` (Λ reserve). Returns null on parse failure → caller falls through to rule-based.

**Output use:** drives template-router canonical-text construction. If `confidence ≥ AISP_CONFIDENCE_THRESHOLD` (0.85) AND target is non-null, AISP wins; otherwise falls through to ASSUMPTIONS_ATOM.

---

## 3. CONTENT_ATOM — content generator (currently rule-based stub)

**Files:**
- Caller: `src/contexts/intelligence/aisp/contentGenerator.ts` — `generateContent(request)`
- Atom def: `src/contexts/intelligence/aisp/contentAtom.ts`
- ADR: ADR-060

**Status:** **NOT yet an LLM call.** Per ADR-060, current generator is a deterministic rule-based stub. Real LLM-call generation is future P38+ work.

**Current rule-based behavior (inputs → output):**
```
Input:  { text: "rewrite the headline to something punchy",
          sectionType: "hero" }
Logic:
  1. Extract any quoted phrase from text (regex /"([^"]+)"/)
  2. Infer tone from cue words (punchy → bold; warm → warm; etc.)
  3. Infer length from cue words (short → short; long → long; default short)
  4. Verify output passes Γ R1..R4 (length cap, tone enum, clean content scan)
Output: { text, tone, length, confidence, rationale }
```

**Sample output (rule-based stub):**
```json
{
  "text": "Stop guessing, start shipping",
  "tone": "bold",
  "length": "short",
  "confidence": 0.85,
  "rationale": "extracted quoted phrase 'Stop guessing, start shipping' · tone=bold from 'punchy' cue · length=short"
}
```

**When this becomes an LLM call (future):** the stub will be replaced by an `auditedComplete` call sending CONTENT_ATOM verbatim with `Λ.brand_voice` (P44 ADR-067) injected when brand context is loaded. Σ output contract stays unchanged.

**Output use:** slotted into template-router envelope by `registry.ts` — produces a final JSON `replace` patch on the target section's content field.

---

## 4. ASSUMPTIONS_ATOM — clarification engine

**Files:**
- Caller: `src/contexts/intelligence/aisp/assumptionsLLM.ts` — `generateAssumptionsLLM(req)`
- Atom def: `src/contexts/intelligence/aisp/assumptionsAtom.ts`
- ADR: ADR-064

**System prompt (verbatim):**
```
[ASSUMPTIONS_ATOM Crystal Atom verbatim]

Return ONLY a JSON object: {"items":[{...},...]} where each item has:
  id          — kebab-case identifier (a-z0-9-) ≤ 64 chars
  label       — human-readable button text ≤ 200 chars
  rephrasing  — canonical command text the pipeline can re-run, ≤ 100 chars
  confidence  — number in [0,1], descending across the list
  rationale   — optional short reason ≤ 500 chars

Rules:
  • Up to 3 items. Empty array allowed.
  • rephrasing MUST start with one of these verbs: hide, show, change, add, reset, remove
  • rephrasing MUST reference one of these section types: [ALLOWED_TARGET_TYPES list]
  • Output JSON only. No markdown, no commentary, no code fences.
```

**Sample user prompt (low-confidence trigger):**
```json
{
  "user_text": "make it pop",
  "intent": null
}
```

**Expected response:**
```json
{
  "items": [
    { "id": "brighten-theme", "label": "Brighten the theme colors",
      "rephrasing": "change theme accent to brighter", "confidence": 0.62,
      "rationale": "'pop' often means visual contrast" },
    { "id": "embolden-hero", "label": "Make the hero headline bolder",
      "rephrasing": "change hero headline weight to bold", "confidence": 0.51,
      "rationale": "'pop' can mean stronger typography" },
    { "id": "more-whitespace", "label": "Add more whitespace",
      "rephrasing": "change theme spacing to spacious", "confidence": 0.40,
      "rationale": "minimal layouts feel 'poppier'" }
  ]
}
```

**Discipline:** 12-second client timeout (R1 F3 fix-pass) → AbortController. Cost-cap reserve check at `sessionUsd ≥ capUsd × ASSUMPTIONS_COST_CAP_RESERVE` → fall back to rule-based. ATOM Σ/Γ validation rejects malformed output → fall back to rule-based. Every failure path returns the rule-based fallback so the user always has clarification options.

**Output use:** drives `ClarificationPanel` 3-button UI. User taps a card → its `rephrasing` re-fires the chat pipeline as canonical disambiguated text.

---

## 5. PERSONALITY (composition — NOT an LLM call)

**Files:**
- `src/contexts/intelligence/personality/personalityEngine.ts` — `renderPersonalityMessage(envelope, personalityId, intentTrace)`
- ADR: ADR-073

**Per ADR-073 (Sprint J P50):** the locked architectural decision was Option B (composition; no Σ widening). Personality runs AFTER `PATCH_ATOM` resolves, not within it. **Pure-rule, $0, no LLM call.**

**Sample composition (Geek mode):**
```
Input: envelope = { patches:[1 op], summary:"Updated theme accent" }
       personalityId = "geek"
       intentTrace = { verb:"change", target:{type:"hero"}, confidence:0.92 }

Output: "Locked in · Updated theme accent · [Ω→change Σ→hero @ 0.92] · patches=1"
```

**5 modes produce 5 distinct outputs from the same envelope:**
- `professional` — clean, no emoji
- `fun` — sarcastic + emoji + opinion
- `geek` — AISP classification inline (defense-critical default in Sprint L)
- `teacher` — encouraging + celebration emoji + simple words
- `coach` — action-oriented + CTA-flavored

**Output use:** rendered into `ChatMessage.personalityMessage` field — small italic block UNDER the typewriter primary text. Not in `llm_logs` (no LLM call). The personality choice IS captured in `chat_messages` via `personalityId` thread-through, joined at the ConversationLog view layer.

---

## auditedComplete — the single chokepoint

**File:** `src/contexts/intelligence/llm/auditedComplete.ts`
**ADR:** ADR-047

**Every** LLM call from PATCH/INTENT/CONTENT(future)/ASSUMPTIONS routes through `auditedComplete(adapter, request, opts)`:

1. **Pre-emptive `llm_logs` row** written BEFORE the LLM call (so cost-cap rejections + crashes still produce audit). UNIQUE constraint on `request_id` (UUID v4).
2. **Cost-cap gate** — if projected USD ≥ cap × 0.85, reject with `precondition_failed` + audit row.
3. **`adapter.complete()`** — the adapter (Anthropic / Gemini / OpenAI / OpenRouter / FixtureAdapter / **AgentProxyAdapter**) executes the call.
4. **Update `llm_logs`** with response + tokens + latency on completion. Failed adapters update SAME row, not duplicates.
5. **Also writes `llm_calls`** (legacy P18 audit) for legacy compat.
6. **`redactKeyShapes`** runs at every error/log boundary — BYOK keys never land in any log row (15 call sites, P46 fix-pass + ADR-067 export-strip).

**Retention:** 30-day auto-prune at `initDB`; 10K LRU cap on `llm_logs` (P23 C18).

**Surface:** Sprint J P52's **ConversationLogTab** (EXPERT mode) joins `chat_messages ⨝ llm_logs` by `(session_id, created_at)` and offers MD/JSON export — every prompt + reply visible to the power user.

**Internal-agent backbone:** **AgentProxyAdapter** (`src/contexts/intelligence/llm/agentProxyAdapter.ts`) reads `example_prompts` table and returns the stored `expected_envelope_json` for the matched user prompt. **No network call. No real LLM API.** This is the test backbone — $0 cost, 244 cumulative PURE-UNIT tests GREEN, no Anthropic / OpenAI / Gemini import in the call path.

---

## Verification

The internal-agent smoke test at `tests/p57-llm-prompt-smoke.spec.ts` asserts every claim in this document via source-level reads:

- **P57.1** PATCH_ATOM construction (Crystal Atom + ROLE_LINE + OUTPUT_RULE + Σ surface unchanged)
- **P57.2** INTENT_ATOM verbatim + JSON contract + cost-cap discipline + null-on-parse-fail
- **P57.3** CONTENT_ATOM is the rule-based stub (no `auditedComplete` / `adapter.complete` call yet)
- **P57.4** ASSUMPTIONS_ATOM verbatim + 12s client timeout + rule-based fallback on every failure path
- **P57.5** auditedComplete is the single chokepoint (PATCH + ASSUMPTIONS confirmed)
- **P57.6** AgentProxyAdapter — no `fetch` / no Anthropic / no OpenAI imports; provider='mock'
- **P57.7** Fixture corpus — ≥5 starter prompts + safety + edge cases
- **P57.8** This documentation file exists + covers all 4 prompt types + auditedComplete

Run: `npx playwright test tests/p57-llm-prompt-smoke.spec.ts --reporter=line`
Expected: 25/25 GREEN. Cost: $0. Real LLM calls: zero.
