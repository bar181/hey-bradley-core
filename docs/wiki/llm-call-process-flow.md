# Hey Bradley — LLM Call Process Flow

> **Status:** Living document — wiki / how-it-works guide
> **Last verified against code:** P49 sealed (commit will be set at seal time)
> **Cross-references:** ADR-045, ADR-053, ADR-057, ADR-060, ADR-064, ADR-065, ADR-066, ADR-067, ADR-068, ADR-069, ADR-070, ADR-071, ADR-072
> **Contributors:** Bradley Ross + claude-flow swarm (P18 → P49)

This is the canonical end-to-end picture of how a single user input — text in chat OR voice transcript in listen mode — flows through Hey Bradley's pipeline to produce a JSON-Patch envelope. Every box on the flow chart maps to a concrete module in `src/contexts/intelligence/`.

---

## The Full Flow (Sequential with Conditions)

```
User Input (text or voice transcript)
         │
         ▼
┌─────────────────────────────┐
│  REFERENCE CONTEXT (P44+P45)│  ← ADR-067 + ADR-068
│  brand_context (voice)      │
│  codebase_context (project) │
│  • injected into system     │
│    prompt + INTENT_ATOM Λ   │
│  • opt-in user uploads      │
│  • stripped from export     │
└────────────┬────────────────┘
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

**P37 (ADR-066) adds an UPSTREAM gate before INTENT_ATOM:** `parseCommand()` runs first; if the input matches a slash form or whitelisted voice phrasing, the host dispatches directly (open browser, prefill input, etc.) and **the atoms are skipped entirely.** This means a `/browse` turn fires zero atoms — there is no INTENT classification, no SELECTION, no audit row, and no AISP chip. The trade-off is a small EXPERT-pane gap on command turns, in exchange for a deliberate $0/0ms power-user shortcut. Non-command input flows into the existing 5-atom chain unchanged; `classifyRoute` then splits content vs design downstream of INTENT_ATOM but upstream of the LLM patch call.

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

## Command Triggers (P37)

P37 (ADR-066) adds an upstream gate **before** the AISP intent classifier. `parseCommand()` runs first in both `ChatInput.handleSend` and `ListenTab.submitListenFinal`; if it returns a typed `CommandTrigger`, the host short-circuits the atom pipeline entirely (no INTENT_ATOM, no SELECTION, no LLM call). This closes the "user already knows what they want" latency tax.

| Slash command | Voice equivalent(s)                       | Effect                                   |
|---------------|-------------------------------------------|------------------------------------------|
| `/browse`     | `browse templates`, `show me templates`   | Opens the TemplateBrowsePicker.          |
| `/template <name>` | `apply template <name>`, `use template <name>` | Apply a named template by id.            |
| `/generate`   | `generate content`, `write content`, `write copy` | Kick the content-generation pipeline.    |
| `/design`     | `design only`, `style only`               | Restrict next change to design (no copy).|
| `/content`    | `content only`, `copy only`               | Restrict next change to content (no style).|
| `/hide`       | (NL "hide the X" handled by INTENT_ATOM)  | Slash-only passthrough.                  |
| `/show`       | (NL "show the X" handled by INTENT_ATOM)  | Slash-only passthrough.                  |

All voice phrasings are whole-input, token-boundary anchored, case-insensitive — embedded matches inside prose are deliberately rejected to keep the false-positive rate at zero.

P37 also adds the **content vs design route classifier** (`classifyRoute`) — a pure-rule splitter that runs after AISP but before the LLM patch call. Content-route inputs (rewrite/regenerate/copy nouns) short-circuit the LLM patch path; design-route inputs proceed unchanged. Ambiguous inputs (bare `change` with no signal) fall through to the existing LLM patch path today; Sprint F P3 will route them through ASSUMPTIONS_ATOM.

---

## Reference Context Pipeline (Sprint H)

Sprint H (P44 + P45 + P46) adds **opt-in user-uploaded reference channels** to the pipeline. Two channels ship in production; both inject upstream of the LLM call without changing any existing atom contract.

### brand_context flow → CONTENT_ATOM Λ

`brand_context` is a TXT/MD upload (≤4 KB injection cap, full document in kv) representing the user's brand voice / style guide. The flow is:

1. User uploads via `BrandContextUpload` (P44 / ADR-067).
2. `writeBrandContext(text, meta)` chunks the body across `kv['brand_context_chunk_*']` rows + a `brand_context_manifest` JSON row.
3. At submit time, `buildSystemPrompt(ctx)` reads the head 4 KB via `readBrandContext()` and embeds it in the system prompt verbatim.
4. CONTENT_ATOM's Λ extends with an optional `brand_voice` channel: `{ present:𝔹, profile:𝕊≤4096, bias:{tone_preference?, lexicon_hints?} }`. Σ width and Γ rules R1..R4 / V1..V4 are unchanged — `brand_voice` is purely additive.
5. The AISPTranslationPanel renders a `voice: brand-aware` chip when the manifest is non-null at submit time.

### codebase_context flow → INTENT_ATOM Λ bias

`codebase_context` is a ZIP upload (≤32 KB injection cap, full archive head in kv) representing the user's project shape. The flow is:

1. User uploads via `CodebaseContextUpload` (P45 / ADR-068).
2. Client-side ZIP extraction reads a small allow-list of high-signal files (README, package.json, configs).
3. `detectProjectType(input)` — a pure rule cascade — picks one of 5 enum values: `saas-app | landing-page | static-site | portfolio | unknown`.
4. `writeCodebaseContext(text, meta)` persists the head + manifest under `kv['codebase_context_*']`.
5. `chatPipeline` reads `readCodebaseContextManifest().projectType` and threads it into `classifyIntent(text, projectType)`.
6. INTENT_ATOM's Λ extends with optional `project_context: { present:𝔹, type∈enum }`. The classifier biases target-candidate ranking ONLY (e.g. `saas-app` raises pricing/features/cta; `portfolio` raises gallery/hero). Σ width is unchanged; bias never overrides an explicit text match.

### ReferenceManagement summary (P46 / ADR-069)

`ReferenceManagement.tsx` renders **above** both upload widgets in `SettingsDrawer.tsx`. It reads manifests only — no chunk joins — so the drawer-open cost stays O(2). Per-row Clear buttons gate destructive action behind `window.confirm()`, mirroring the P34 ClarificationPanel pattern.

### Privacy posture (export-strip)

Both reference channels are user content. `exportImport.ts.isSensitiveKvKey` matches both prefixes (`brand_context_` + `codebase_context_`); `SENSITIVE_KV_KEYS` lists both manifest keys for back-compat. Uploaded references **never** ship inside `.heybradley` exports. The runtime DELETE sweep matches the prefixes via `LIKE` — both manifests AND chunks are stripped symmetrically.

### kv chunk shape

Identical motif for both channels (one persistence motif, two content types):
- `<channel>_manifest` → JSON `{ count, totalBytes, mimeType, name, uploadedAt, ... }`
- `<channel>_chunk_0..N-1` → string slices joined to reconstruct the body

`writeXContext` is delete-then-write atomic (clears prior chunks before writing new ones) — a smaller second upload cannot leave orphan chunk_N rows from a larger first upload.

### Cap math

| Channel | Injection cap | Chunk byte size | Rationale |
|---|---:|---:|---|
| `brand_context` | 4 KB | 10_000 UTF-16 cu | Brand voice guides are typically ≤2 KB; head-truncation is sufficient. |
| `codebase_context` | 32 KB | 10_000 UTF-16 cu | Codebase summaries are denser; allow-list keeps the head signal-rich. |

Both caps are enforced at **injection time**, not write time — the full upload always persists in kv (room for vector retrieval at a future phase).

---

## What's Missing (planned P38+)

- **LLM-driven route classifier** (P38) — promote `classifyRoute` from rule-based to LLM-driven when rule confidence is low (mirror P26 → P27 lift).
- **CONTENT_ATOM wiring on the content route** (P38) — currently the content route short-circuits to a friendly "wired in next phase" canned reply; P38 will dispatch the route to `generateContent` (CONTENT_ATOM verbatim → LLM).
- **Cost optimization for content path** (P38 research) — content gen is the largest remaining latency tax; streaming, cache, and small-context-window experiments planned.
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

## Sprint I — Builder UX Additions (P47 + P48 + P49)

Sprint I is a builder-mode UX sprint — none of these additions touch the AISP
pipeline or LLM contract, but they shift the surfaces around it. They are
surfaced here so future contributors reading this flow chart understand which
elements of the chat / listen experience are post-pipeline UX:

- **P47 / ADR-070** — `SectionsSection.tsx` collapse/expand per row (first
  section open by default, rest collapsed); 4-bucket categorized add picker
  (Hero & CTA / Content / Social Proof + Media / All); arrow-key list
  navigation (`ArrowUp` / `ArrowDown` / `Enter` / `Space`). Right-panel
  ARIA + focus + Escape handling across 5 simple-mode editors. ListenTab
  voice-pipeline contract unchanged.
- **P48 / ADR-071** — `QuickAddPicker.tsx` curated 6-card section panel
  (`hero` / `action` / `text` / `blog` / `pricing` / `footer`) mounted
  inside SectionsSection (does NOT replace the categorized picker).
  `improvementSuggester.ts` — pure-rule heuristic that surfaces 1-3
  `💡 Next steps` under each bradley reply via `chatPipeline.deriveImprovements`.
  Σ-restricted by construction: suggestions are advisory text only and do
  NOT widen INTENT_ATOM.
- **P49 / ADR-072** — Welcome.tsx vertical-snap carousel at `max-sm`
  (≤639px) — closes C11 carryforward from P22. Builder-mode `active:`
  Tailwind variants for touch parity on hover-driven affordances. No JS
  viewport detection; pure responsive CSS; zero new dependencies.

These three waves sit *outside* the pipeline boxes above — they shape the
surfaces feeding text into Step 1 (REFERENCE CONTEXT) and the surfaces
rendering the patch reply at Step N. The pipeline contract is unchanged.

---

*This document is updated at each phase seal. Last touched: P49 seal (Sprint I Wave 3 — Mobile Polish + C11 Closure). Source: swarm summary at session-1777381177219.*
