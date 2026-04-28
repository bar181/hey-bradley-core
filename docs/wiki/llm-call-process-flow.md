# Hey Bradley — LLM Call Process Flow

> **Status:** Living document — wiki / how-it-works guide
> **Last verified against code:** P36 sealed (commit `5f0a84c`)
> **Cross-references:** ADR-045, ADR-053, ADR-057, ADR-060, ADR-064, ADR-065
> **Contributors:** Bradley Ross + claude-flow swarm (P18 → P36)

This is the canonical end-to-end picture of how a single user input — text in chat OR voice transcript in listen mode — flows through Hey Bradley's pipeline to produce a JSON-Patch envelope. Every box on the flow chart maps to a concrete module in `src/contexts/intelligence/`.

---

## The Full Flow (Sequential with Conditions)

```
User Input (text or voice transcript)
         │
         ▼
┌─────────────────────────────┐
│  GATE: Template Match?      │  ← P23 / ADR-050
│  confidence ≥ 0.8 →         │
│  skip LLM entirely          │
└────────────┬────────────────┘
             │ no match / low confidence
             ▼
┌─────────────────────────────┐
│  INTENT_ATOM (P26)          │  ← Crystal Atom Ω Σ Γ Λ Ε
│  Classifies: verb + target  │     ADR-053
│  + section + confidence     │
│  + rationale                │
└────────────┬────────────────┘
             │
      ┌──────┴──────┐
      │             │
   ≥ 0.7         < 0.7
      │             │
      │             ▼
      │   ┌──────────────────────┐
      │   │ ASSUMPTIONS_ATOM(P35)│  ← Crystal Atom
      │   │ Generates 1-3 ranked │     ADR-064
      │   │ clarification options│
      │   │ + confidence scores  │
      │   └──────────┬───────────┘
      │              │
      │   IF interactive mode (chat/listen):
      │   Show 3-button clarification UX
      │   User picks OR types option 4
      │   Accepted assumption locked to
      │   project context (kv ring buffer)
      │              │
      └──────┬───────┘
             │ intent confirmed
             ▼
┌─────────────────────────────┐
│  ROUTER (P23-P24)           │  ← ADR-050 + ADR-051
│  Routes to:                 │
│  • patch    (style/layout)  │
│  • generate (content)       │
│  • template (structure)     │
│  • scoped   (/hero-1 etc)   │
└────────────┬────────────────┘
             │
      ┌──────┴──────┐
      │             │
   patch         generate
      │             │
      ▼             ▼
┌──────────┐  ┌──────────────┐
│SELECTION │  │CONTENT_ATOM  │
│ATOM (P28)│  │(P31)         │
│Step 1:   │  │Generates     │
│Pick best │  │actual copy   │
│template  │  │(headline,    │
│Step 2:   │  │CTA, body)    │
│Modify it │  └──────┬───────┘
└────┬─────┘         │
     └──────┬────────┘
            │
            ▼
┌─────────────────────────────┐
│  LLM CALL (auditedComplete) │
│  • Cost-cap pre-check       │
│  • AbortSignal (12s timeout)│
│  • Crystal Atom as system   │
│    prompt verbatim          │
│  • Zod response validation  │
│  • Path-whitelist check     │
│  • Value-safety regex       │
│  • Prototype pollution guard│
└────────────┬────────────────┘
             │
      ┌──────┴──────┐
      │             │
   success       failure
      │             │
      ▼             ▼
┌──────────┐  ┌──────────────┐
│Atomic    │  │mapChatError  │
│applyPatch│  │cost_cap /    │
│→ JSON    │  │timeout /     │
│merge →   │  │rate_limit /  │
│preview   │  │invalid_resp  │
│updates   │  │→ user message│
└──────────┘  └──────────────┘
             │
             ▼
┌─────────────────────────────┐
│  AUDIT LOG (llm_logs table) │  ← ADR-046 + ADR-047
│  prompt_hash + provider +   │
│  tokens + cost + latency +  │
│  status — 1 row per call    │
└─────────────────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  AISPSurface dispatcher     │  ← P34/P35 + ADR-064
│  Picks ONE panel by mode:   │
│  • SIMPLE: Translation      │
│    panel (Grandma view)     │
│  • EXPERT: full 5-atom      │
│    pipeline trace           │
│  Shows user:                │
│  • Which path was taken     │
│  • Intent classification    │
│  • Assumptions made         │
│  • Template selected        │
│  • EXPERT: full trace       │
└─────────────────────────────┘
```

---

## Key Design Principles

### Conditions that skip LLM entirely

| Condition | Path | Cost |
|---|---|---|
| Template match ≥ 0.8 confidence | direct patch (P23) | **$0** |
| Cost cap exceeded | hard stop, user notified | $0 |
| Timeout (12s) | AbortSignal cancels SDK call | partial |
| Rule-classifier preview (Listen review) | client-side preview only | $0 |

The template-first design (ADR-050) is the **single largest cost optimization**. ~70% of common phrasings hit a template; the LLM is only consulted on miss.

### Conditions that add a clarification step

| Trigger | Action |
|---|---|
| Intent confidence < 0.7 OR null target | ASSUMPTIONS_ATOM fires |
| Interactive mode (chat or listen) | Shows 3 buttons + free-text escape |
| Voice mode (P36 / ADR-065) | ListenReviewCard fires BEFORE pipeline; same clarification card on low confidence after |
| LLM Σ/Γ validation fails | Falls back to rule-based assumptions stub |

### The "thinking mode" equivalent (AISPTranslationPanel + AISPPipelineTracePane)

A single user request flows through 5 atoms; the AISPSurface (ADR-064) renders one panel based on mode:

```
Step 1 — I heard:        "make it brighter"
Step 2 — I think you mean: verb=modify, target=theme, confidence=0.65
Step 3 — I assumed:      warm color palette (you confirmed)
Step 4 — I selected:     template: warm-professional
Step 5 — I will:         patch hero.backgroundColor + nav.color
```

In **SIMPLE mode** (Grandma): collapsed "How I understood this" — verb + target + template chip.
In **EXPERT mode** (Framer / Capstone reviewer): full 5-atom trace inline.

---

## The 5-atom Crystal Atom Architecture

Each atom is verbatim AISP per `bar181/aisp-open-core ai_guide` — Ω Σ Γ Λ Ε structure. Each has a Σ-restriction calibrated to its purpose; smaller Σ = lower hallucination rate = lower confidence threshold.

| # | Atom | ADR | Phase | Σ scope | Threshold | Cost reserve |
|---|---|---|---|---|---:|---:|
| 1 | **PATCH_ATOM** | 045 | P18 | full JSON-Patch envelope | n/a (validator) | n/a |
| 2 | **INTENT_ATOM** | 053 | P26 | verb + target + params | 0.85 | 0.85 |
| 3 | **SELECTION_ATOM** | 057 | P28 | templateId + confidence + rationale | 0.7 | 0.75 |
| 4 | **CONTENT_ATOM** | 060 | P31 | text + tone + length | 0.7 | 0.85 |
| 5 | **ASSUMPTIONS_ATOM** | 064 | P35 | up to 3 ranked clarifications | 0.7 | 0.65 |

The atoms compose: a single user request can fire 0 (template hit), 1 (template miss → INTENT match → patch), 2 (template miss → INTENT → SELECTION), or up to 4 LLM calls (INTENT → ASSUMPTIONS → SELECTION → CONTENT → patch). Cost-cap reserves ensure the multi-stage path doesn't starve later atoms.

---

## BYOK Provider Matrix (P35)

User picks a provider from the menu; the adapter chooses the cheap-and-fast default model automatically. Specific model IDs are not user-selectable — keeps the menu clean and ensures costs stay predictable.

| Provider | Default Model | Cost (in/out per 1M) | SDK |
|---|---|---|---|
| Anthropic | `claude-haiku-4-5-20251001` | $1.00 / $5.00 | `@anthropic-ai/sdk` |
| Google | `gemini-2.5-flash` | $0.30 / $2.50 | `@google/genai` |
| OpenAI | `gpt-5-nano` | $0.05 / $0.40 | `openai` |
| OpenRouter | `mistralai/mistral-7b-instruct:free` | $0 / $0 | native fetch |
| Simulated | (canned) | $0 / $0 | — |
| Mock | (DB fixtures) | $0 / $0 | — |

All 4 paid providers honor `req.signal` for AbortSignal cancellation. All errors funnel through `redactKeyShapes` → `classifyError` to prevent BYOK key leaks via SDK error message echoes.

---

## What's New as of P36

The Listen surface (voice / Push-to-Talk) now shares **every** AISP UX surface with the chat input:

- **Listen Review Card** (`ListenReviewCard.tsx`) — Approve / Edit / Cancel BEFORE the chat pipeline fires. Closes the silent ASR-mistranscription failure mode from P19. Action preview is computed client-side via the rule-based classifier (no LLM cost). Enter approves; Escape cancels.
- **Listen Clarification Card** — same 3-button + escape pattern as ChatInput's ClarificationPanel. Voice-styled. Mirrors P34 / ADR-063.
- **AISP feedback chip** in the Listen reply banner — verb · target · template id.
- **`uiStore.pendingChatPrefill`** single-shot — Edit hand-off pushes the transcript to ChatInput on tab switch.

ADR-065 documents the review-first voice rationale: **voice has a fundamentally different error model than text.** ASR mis-transcriptions are silent + irreversible. The 1-click review gate trades latency for honesty.

---

## What's Missing (planned P37+)

- **Command triggers** (P37) — `/hero` / `/blog` / `/footer` / `/theme` short-circuit the INTENT_ATOM call and route directly to a section-specific LLM call. Closes the "user already knows what they want" latency tax.
- **Content vs design split** (P37 research) — content updates via LLM are slow vs the JSON design fast-path. Investigating: separate `/content` slash command, UI toggle (Design / Content), article-page mode (design fast → content second), or streaming content generation.
- **LLM call audit** (P37 doc) — single canonical document mapping every call site, prompt template, expected Σ, fallback path, and latency baseline.
- **Interview mode** (Sprint G P41-P44) — LLM asks questions proactively rather than waiting for low confidence.
- **Multi-intent parsing** (C03, deferred) — "make it brighter and hide the nav" currently only processes the first intent; Sprint H+ candidate.
- **Listen review at low ASR confidence threshold** — even on high-confidence transcripts, allow user to cancel within a 1s window before fire.

---

## Where to Read More

- **Crystal Atom source (verbatim AISP)** — `src/contexts/intelligence/aisp/` (intentAtom / contentAtom / assumptionsAtom / templateSelector / twoStepPipeline)
- **System prompt (PATCH_ATOM)** — `src/contexts/intelligence/prompts/system.ts` (ADR-045)
- **LLM adapters** — `src/contexts/intelligence/llm/` (4 paid + 2 free; uniform LLMAdapter contract)
- **Pipeline orchestrator** — `src/contexts/intelligence/chatPipeline.ts` (single entry point for chat + listen)
- **Audit log schema** — `src/contexts/persistence/migrations/002-llm-logs.sql` (ADR-046 + ADR-047)
- **AISP reference** — `plans/initial-plans/00.aisp-reference.md` + `https://github.com/bar181/aisp-open-core`

---

*This document is updated at each phase seal. Last touched: P36 seal. Source: swarm summary at session-1777381177219.*
