# Sprint J — Audit of existing capabilities + gaps

> **Scope:** What already exists vs. what the owner brief (00-owner-brief-raw.md) needs.
> **Status:** Read-only research. No code touched.
> **Owner review needed:** §3 architectural choice (Option A vs Option B for personality response shape).

---

## 1. What already exists

| Surface | File | What it gives us |
|---|---|---|
| **Envelope schema** | `src/lib/schemas/patches.ts` | `{ patches: [...], summary?: string≤140 }`. Optional `summary` is already a per-turn message channel. |
| **PATCH_ATOM** | `src/contexts/intelligence/prompts/system.ts` (CRYSTAL_ATOM) | Verbatim AISP. Σ width is treated as inviolable across ADR-045/053/057/060/064/067/068. |
| **chat_messages table** | `migrations/000-init.sql` | id, session_id, role∈('user','bradley','system'), text, created_at. NO personality column. |
| **llm_logs table** | `migrations/002-llm-logs.sql` | full forensic trail (provider, model, tokens, prompt_hash, status, retry chain). NO personality column. |
| **AgentProxyAdapter** | `src/contexts/intelligence/llm/agentProxyAdapter.ts` | DB-backed mock; reads `example_prompts.expected_envelope_json` by prompt match. $0 cost. |
| **example_prompts** | `migrations/001-example-prompts.sql` | golden corpus for AgentProxy. Currently 1 envelope per prompt — no personality dimension. |
| **kv table** | `migrations/000-init.sql` | already used for `brand_context_*`, `codebase_context_*`, `cost_cap_usd`, BYOK. Personality preference fits naturally. |
| **intelligenceStore** | `src/store/intelligenceStore.ts` | adapter + provider + cap + inFlight. NO personality field. |
| **Settings drawer** | `src/components/settings/SettingsDrawer.tsx` | already mounts ReferenceManagement + BrandContextUpload + CodebaseContextUpload. New PersonalityPicker plugs in cleanly. |
| **Onboarding** | `src/pages/Onboarding.tsx` (740 LOC) | already a multi-step "new project" flow that picks a vibe (saas, bakery, capstone, …). Personality picker = one new step. |
| **EXPERT tab bar** | `src/components/center-canvas/TabBar.tsx` | 5 tabs (Preview / Blueprints / Resources / Data / Pipeline). Adding "Conversation Log" = 6th tab. |
| **buildSystemPrompt** | `prompts/system.ts` | already accepts `configJson, history, siteContext, brandContext`. Adding `personality` follows the same pattern. |
| **AISPTranslationPanel** | `src/components/shell/AISPTranslationPanel.tsx` | already shows verb/target/confidence/rationale + brand-voice chip + route. Geek-mode AISP overlay reuses this. |
| **Improvement suggester** | `src/contexts/intelligence/aisp/improvementSuggester.ts` | P48 — pure-rule, ≤3 suggestions, $0. Personality-aware re-skin is a tiny addition. |
| **Mobile** | Welcome.tsx (P49 max-sm carousel only) | Builder.tsx assumes desktop tri-pane. No responsive layout. |

## 2. Gaps to close (mapped to owner brief)

| # | Gap | Owner brief reference |
|---|---|---|
| G1 | No `personalityId` field anywhere (state, kv, schema, prompt context) | Personality engine vision |
| G2 | LLM response shape lacks a personality message channel | Dual response format |
| G3 | No personality picker UI in Settings | Personality UI |
| G4 | No first-run / onboarding personality step | Owner addition this turn |
| G5 | No chat-bubble styling per personality | Wave 2 vision |
| G6 | No EXPERT "Conversation Log" tab joining `chat_messages` ⨝ `llm_logs` | Log viewer vision |
| G7 | No mobile responsive layout (3-tab mobile nav, hamburger, Builder hidden) | Mobile UX recommendation |
| G8 | No share-your-spec button | Wow-factor #4 |
| G9 | AgentProxy returns one envelope per prompt — no personality variants for tests | A2 in original P50 brief |
| G10 | No mobile listen-mode hold-button polish (current PTT is desktop-tested) | Wow-factor #2 |

## 3. Architectural choice — needs owner decision

The owner brief says LLM returns `{ patches: [...], message: string, personalityId: PersonalityId }`. This **widens PATCH_ATOM Σ**, which is a direct violation of the Σ-restriction discipline that ADR-045/053/057/060/064/067/068 all enforce.

Two paths:

### Option A — Σ widening (owner's literal vision)
- Add `message` + `personalityId` to `PatchEnvelopeSchema`.
- LLM returns all 3 fields in one call.
- AgentProxy needs a personality column on `example_prompts` OR per-personality rows.
- Pro: single LLM call; the personality message can be richer / generative.
- Con: every existing fixture needs a `message`; broader Σ = more hallucination surface; breaks the "no Σ widening" guard rail.
- New migration required (chat_messages + example_prompts adds).

### Option B — Composition (recommended)
- PATCH_ATOM Σ stays exactly `{ patches, summary? }`. **No LLM contract change.**
- A new `personalityEngine.render(envelope, personalityId, intentTrace)` composes the chat-bubble message AFTER the patches land.
- Composition is template + rule based (mirrors the P48 improvementSuggester pattern). $0 cost.
- Geek-mode AISP overlay comes for free — `intentTrace` is already in scope at the chat-bubble render.
- Optional: Wave-N future enhancement plugs in an LLM-driven personality re-write if cost budget allows.
- Pro: 5-atom architecture preserved; AgentProxy unchanged; presentation narrative ("we do not widen Σ") survives.
- Con: personality messages feel template-driven, not generative — same trade-off P48 made.

**My recommendation: Option B.** It matches Hey Bradley's existing AISP discipline (every prior phase rejected Σ widening) and ships faster.

## 4. Other decisions for owner

1. **First-run personality picker placement** — extend `Onboarding.tsx` (existing multi-step flow) OR a one-shot modal on Builder when `kv['personality_id']` is unset. **Recommend: extend Onboarding.**
2. **Default personality** — owner brief says `professional`. Keep.
3. **Mobile scope** — owner brief calls for full mobile UX overhaul (3-tab nav + hamburger + hide Builder). This is a layout phase, not polish. Belongs in its own phase.
4. **Conversation Log viewer + Share-spec** — both are read-only surfaces over existing data; can ship in one phase.
5. **Sprint size** — owner asked 3-6 phases. Audit suggests 4 phases is a clean fit; 5 if mobile gets split.
