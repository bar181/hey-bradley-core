# Sprint J — Personality + Onboarding + Mobile + Logs

> **Status:** DRAFT — owner review before any ADR / DDD / code is written.
> **Pair this with:** `00-owner-brief-raw.md`, `01-audit.md`.
> **Pivot rationale:** Sprint J originally was Agentic Support System, Sprint K was Release. Owner pivoted to presentation-wow + commercial-differentiation arc after Lovable mobile shipped 2026-04-27. See `00-owner-brief-raw.md`.
> **Test backbone:** AgentProxyAdapter / FixtureAdapter — $0 cost, no real keys.
> **Architectural assumption:** Option B (composition; no Σ widening) per `01-audit.md` §3 — pending owner confirmation.

---

## North Star

**A user opens Hey Bradley, picks a personality on first run, and feels the product change voice in real time. The 5 personalities are distinct enough that a 30-second demo toggling between them is shareable. Mobile users get a clean 3-tab experience without the desktop builder. Power users see every prompt + reply in a Conversation Log they can export. None of this widens any Crystal Atom Σ.**

Demo moment = "watch this" → toggle personality → identical input gives 5 distinct, in-character replies → screenshot-worthy.

---

## Success criteria

1. 5 personalities (`professional | fun | geek | teacher | coach`) produce **measurably distinct** chat-bubble messages for the same input (regex-asserted in tests).
2. First-run user is asked their personality before chat is enabled. Default `professional` if skipped.
3. Personality preference persists across sessions via `kv['personality_id']`.
4. Personality picker available in Settings drawer (live toggle).
5. Geek mode visibly surfaces AISP classification (`Ω→… Σ→… Γ→…`) in the bubble.
6. Builder hidden on mobile (<768px); 3-tab nav (Chat / Listen / Preview) + hamburger.
7. EXPERT mode has a "Conversation Log" tab joining `chat_messages` ⨝ `llm_logs`, filterable by personality + provider + date, exportable as Markdown / JSON.
8. PATCH_ATOM Σ unchanged. CONTENT_ATOM Σ unchanged. INTENT/SELECTION/ASSUMPTIONS Σ unchanged. **Zero Σ widening.**
9. Cumulative regression GREEN through P53.
10. Brutal review composite ≥ 90; Grandma ≥ 84 (teacher mode must not feel condescending).

---

## Phase plan — 4 phases (P50–P53)

### P50 — Personality Engine + State + System Prompt

**Goal:** ship the engine + state + persistence + prompt injection. No UI yet.

**Tasks (small, swarm-friendly):**

| # | Owner | Scope | Touch |
|---|---|---|---|
| T1 | A1 | Create `src/contexts/intelligence/personality/personalityEngine.ts` (≤200 LOC). Export `PERSONALITY_IDS`, type `PersonalityId`, `PERSONALITY_PROFILES` (per-id `{ label, description, emoji, tonePrompt, suggestionStyle, aispVisible }`), and `renderPersonalityMessage(envelope, personalityId, intentTrace?) → string`. Pure-rule + template-string per personality. Five distinct outputs verifiable from source. | NEW file |
| T2 | A2 | Add personality field to `intelligenceStore`: `personalityId: PersonalityId; setPersonality(id): Promise<void>` (writes `kv['personality_id']` + updates store). Hydrate on `init()` (default `professional` when kv miss). | `src/store/intelligenceStore.ts` |
| T3 | A3 | Extend `kv` repo with cheap `getPersonalityId() / setPersonalityId(id)` typed helpers (≤30 LOC). Export-strip: `kv['personality_id']` is NOT sensitive → ships in `.heybradley` exports. | `src/contexts/persistence/repositories/kv.ts` (or new `personality.ts` repo) |
| T4 | A4 | `buildSystemPrompt(ctx)` accepts optional `personality?: PersonalityId`. When set, append a `personality_layer` block AFTER the brand-context block: short instruction string from `PERSONALITY_PROFILES[id].tonePrompt`. PATCH_ATOM Σ unchanged. | `prompts/system.ts` |
| T5 | A5 | `chatPipeline.ts` → wire `useIntelligenceStore.getState().personalityId` into `buildSystemPrompt` and into the post-success composition. Add `personalityId` to `ChatPipelineResult`. Defensive try/catch on `renderPersonalityMessage`. | `chatPipeline.ts` |
| T6 | A6 | tests/p50-personality-engine.spec.ts (~15 cases): PERSONALITY_IDS closed enum; PROFILES has all 5; `renderPersonalityMessage` returns 5 distinct strings for the same envelope; geek output contains `Ω` AND `Σ`; teacher contains an emoji AND a celebration word; coach contains a CTA-flavored noun; kv round-trip; default `professional` on miss; system prompt injection ordering. | NEW |

**Gate:** all 6 → commit P50.

### P51 — Personality Picker UI + Onboarding step + Chat-bubble styling

**Goal:** make the engine visible. Live toggle works.

| # | Owner | Scope | Touch |
|---|---|---|---|
| T1 | A1 | NEW `src/components/settings/PersonalityPicker.tsx` (≤200 LOC): 5 cards (icon/emoji + name + description); active-card highlight; on click → `setPersonality()`; arrow-key nav (mirror P48 QuickAddPicker pattern); a11y `role="radiogroup"` + `aria-checked`. | NEW |
| T2 | A2 | Mount PersonalityPicker in `SettingsDrawer.tsx` near top (above ReferenceManagement so it's the first thing). | `SettingsDrawer.tsx` |
| T3 | A3 | Onboarding step — extend `src/pages/Onboarding.tsx` with a personality step BEFORE theme pick. New step renders the same PersonalityPicker; Skip → defaults to `professional`. | `Onboarding.tsx` (touch ≤ 60 LOC) |
| T4 | A4 | Chat-bubble styling per personality in `ChatInput.tsx`: tiny variants — Pro = clean, Fun = subtle accent border + emoji header, Geek = monospace hints + AISP overlay (reusing AISPTranslationPanel data), Teacher = warm accent, Coach = bold leading word. KISS — Tailwind variants only; no new components. | `ChatInput.tsx` (≤ 30 LOC) |
| T5 | A5 | Active-personality indicator in chat header (small chip beside the simulated/mock pill). Reuse the chip pattern from P44 brand-voice chip. | `ChatInput.tsx` |
| T6 | A6 | tests/p51-personality-ui.spec.ts (~15 cases): PersonalityPicker exports + 5 cards; aria-radiogroup; Settings mount; Onboarding step exists; ChatInput renders the 5 styled variants (source-level: each personalityId branch present); active-personality chip. | NEW |

**Gate:** all 6 → commit P51.

### P52 — Conversation Log viewer (EXPERT) + Share-spec button

**Goal:** power-user surface + the viral-loop button. Both are read-only views over existing data.

| # | Owner | Scope | Touch |
|---|---|---|---|
| T1 | A1 | NEW `src/components/center-canvas/ConversationLogTab.tsx` (≤300 LOC). Reads `chat_messages` joined with `llm_logs` by session_id + ordering. Filters: session, provider, personality, date. Columns: ts, role, personality, provider, prompt_hash, status, summary. | NEW |
| T2 | A2 | Add `'CONVERSATION_LOG'` to `ActiveTab` enum + `TabBar.tsx` (expert: true). Render in CenterCanvas. | `TabBar.tsx`, `uiStore.ts`, `CenterCanvas.tsx` |
| T3 | A3 | Export functions: `exportConversationLogMarkdown(filter): string`, `exportConversationLogJson(filter): string`. Pure DB reads + formatting. Live in a new `src/contexts/specification/conversationLogExport.ts`. | NEW |
| T4 | A4 | NEW `src/components/shell/ShareSpecButton.tsx` (≤120 LOC). One tap → builds AISP spec + human-readable plan via existing exporters → encodes to a data URL (or a base64 hash payload) → copies to clipboard with toast "Spec copied". KISS — no server upload. | NEW |
| T5 | A5 | Mount ShareSpecButton above the chat input on desktop. testid `share-spec-button`. | `ChatInput.tsx` (≤ 10 LOC) |
| T6 | A6 | tests/p52-log-viewer-and-share.spec.ts (~20 cases): tab registration; markdown export shape; json export shape; filter regex; ShareSpecButton testid + copy-to-clipboard call site; Σ-discipline regression — chat_messages + llm_logs read-only paths only. | NEW |

**Gate:** all 6 → commit P52.

### P53 — Mobile UX overhaul + Sprint J close

**Goal:** mobile becomes a real first-class surface. Sprint J seals.

| # | Owner | Scope | Touch |
|---|---|---|---|
| T1 | A1 | NEW `src/components/shell/MobileLayout.tsx` (≤250 LOC). Tailwind responsive (`md:hidden` for the new layer; show desktop tri-pane at ≥768px). 3-tab nav (Chat / Listen / Preview), sticky bottom input bar in Chat + Listen, hamburger menu top-right. Builder hidden on mobile entirely. | NEW |
| T2 | A2 | Hamburger menu mounts: PersonalityPicker, ReferenceManagement, BrandContextUpload, CodebaseContextUpload, BYOK settings, ShareSpecButton, Conversation Log link (EXPERT only). Reuse existing components. | NEW `MobileMenu.tsx` (≤200 LOC) |
| T3 | A3 | Preview tab on mobile gets a sticky top mini-nav so user can scroll the rendered site without losing builder context. KISS — Tailwind sticky + small chrome. | `RealityTab.tsx` |
| T4 | A4 | Listen mode mobile polish: hold-button affordance (existing PTT styled bigger / center on mobile); haptic-feeling visual press-state. No new audio surface. | `ListenTab.tsx` (≤ 40 LOC) |
| T5 | A5 | Sprint-J end-of-sprint brutal review (lean: 1 reviewer, ≤200 LOC report) covering P50/P51/P52/P53. Persona scoring rubric (Grandma ≥84 gate). | NEW `plans/implementation/phase-53/deep-dive/01-sprint-j-review.md` |
| T6 | A6 | tests/p53-mobile-and-seal.spec.ts (~15 cases): MobileLayout `md:hidden` pattern; 3 mobile tabs present; hamburger menu mounts the 6 advanced items; Builder hidden on mobile (assert the pane wrapper has a responsive hide); Preview sticky nav class; Listen mobile press-state class. ADR-076 file shape. Wiki phase pin ≥ P53. | NEW |
| T7 | seal | GROUNDING + presentation-readiness refresh; wiki "Last verified" → P53; STATE row + retrospective + roadmap entry. | meta files |

**Gate:** all 7 → seal commit + push.

---

## ADRs to author (after owner review)

| ADR | Phase | Title | Notes |
|---|---|---|---|
| **ADR-073** | P50 | Personality Engine + Composition (no Σ widening) | Documents Option B choice, the 5-mode taxonomy, the kv persistence key shape, and why we did NOT add a `message` field to PatchEnvelope. |
| **ADR-074** | P51 | Personality Picker + First-run Onboarding step | Documents the picker UX + onboarding step + chat-bubble styling decisions. |
| **ADR-075** | P52 | Conversation Log Viewer + Share Spec | Documents the EXPERT-mode tab + the read-only chat_messages ⨝ llm_logs join + the share-spec data URL approach. |
| **ADR-076** | P53 | Mobile UX overhaul | Documents the `md:hidden` Tailwind-only pivot (mirroring the Sprint I C11 closure approach), the hamburger inventory, and the deliberate Builder-hidden-on-mobile decision. |

Each ADR ≤ 120 lines (the agent-prompt cap). Cross-references: ADR-040 (kv) + ADR-045 (PATCH_ATOM) + ADR-053 (INTENT_ATOM) + ADR-067/068/069 (Sprint H references) + ADR-070/071/072 (Sprint I references).

## Tests to author

| Spec file | Phase | Cases | Pattern |
|---|---|---|---|
| `tests/p50-personality-engine.spec.ts` | P50 | ~15 | PURE-UNIT source-level reads + direct module imports (avoid aisp barrel). Engine + state + prompt injection. |
| `tests/p51-personality-ui.spec.ts` | P51 | ~15 | PURE-UNIT source-level reads. Picker + onboarding + chat-bubble variants + chip. |
| `tests/p52-log-viewer-and-share.spec.ts` | P52 | ~20 | PURE-UNIT. Tab registration + export shape + share button. |
| `tests/p53-mobile-and-seal.spec.ts` | P53 | ~15 | PURE-UNIT. md:hidden + tabs + hamburger + ADR shape + wiki pin. |

**Total new test cases:** ~65 across 4 spec files. Cumulative target after seal: ~615 GREEN.

## What is INTENTIONALLY out of scope

- LLM-driven personality message generation (Option A in `01-audit.md`). Composition is the seal-line; LLM enrichment is a future enhancement.
- Vector-DB learning layer / commercial flywheel (owner brief commercial section). Lives post-Sprint J.
- Any new BYOK provider or new LLM call path.
- Server-side share-spec hosting. Data-URL only for now.
- Personality auto-calibration. Manual picker only.

## Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | Personality messages feel canned / template-driven | Per-personality template variety + deterministic affirmation prefix tied to summary[0]; P48 improvementSuggester proved this pattern works. |
| R2 | Mobile layout regresses desktop | Tailwind `md:` breakpoint discipline; cumulative regression includes desktop assertion. |
| R3 | Conversation Log surface leaks BYOK keys via prompt_hash echo | All log rows already pass through `redactKeyShapes` at insert (P46 fix-pass); reaffirmed at export boundary. |
| R4 | Builder-hidden-on-mobile loses power-user features | Hamburger inventory is the safety valve; Settings/ReferenceManagement/Logs all reachable. |
| R5 | Onboarding step adds friction | Skip path defaults to `professional`; one click; no field entry. |

## Open questions for owner

1. **Option A vs Option B** for the response shape. Recommend B; please confirm.
2. **Onboarding placement:** extend `Onboarding.tsx` (recommended) or one-shot modal on Builder?
3. **Personality vs CONTENT_ATOM tone:** these are distinct concepts (chat-voice vs generated-content-tone). Confirm we keep them separate (no unification).
4. **Phase count:** 4 phases (P50–P53) drafted. Acceptable, or split P53 mobile into 2?
5. **Share-spec scope:** clipboard-copy data URL only. OK, or do we want a server-side short link (would push outside Sprint J)?

When the answers land, I'll author ADRs 073-076 and decompose Wave-1 of P50 into agent-shaped tasks for swarm dispatch.
