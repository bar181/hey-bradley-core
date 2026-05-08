# Sprint J — Locked Execution Plan

> **Supersedes:** `02-sprint-j-plan.md` (which was a draft with open questions).
> **Status:** LOCKED on owner decisions. Ready for swarm dispatch. NOT YET dispatched — pending owner sign-off on this outline.
> **Pair this with:** `00-owner-brief-raw.md`, `01-audit.md`, and `plans/strategic-reviews/2026-04-29-product-evaluation.md` (captured-for-record concerns the owner has elected to defer).

---

## Locked decisions (per owner swarm instructions 2026-04-29)

| # | Decision | Locked value |
|---|---|---|
| D1 | Response shape architecture | **Option B — composition.** PATCH_ATOM Σ unchanged. `personalityEngine.render(envelope, personalityId, intentTrace) → string` runs AFTER patches land. |
| D2 | Phase count | **4 phases (P50–P53).** |
| D3 | Personality modes | **5 — `professional | fun | geek | teacher | coach`.** |
| D4 | Onboarding placement | **Extend `src/pages/Onboarding.tsx`** with a first-run personality step. Default `professional`, skip available. |
| D5 | Share-spec scope | **Clipboard data URL only.** No server, no hosted link in this sprint. |
| D6 | Personality vs CONTENT_ATOM tone | **Distinct.** Personality = chat-bubble voice. Tone = generated-content style. No unification. |
| D7 | Mobile UX scope | **In-sprint per owner override of north-star X8.** Bifurcation: Builder hidden on mobile (`md:hidden`); Chat / Listen / Preview available. |
| D8 | Test backbone | **AgentProxyAdapter / FixtureAdapter only.** $0 cost, no real keys. |
| D9 | Seal gates | **Composite ≥ 93, Grandma ≥ 84, target ~615/615 cumulative GREEN.** |

---

## North star (sprint-level)

**Wow factor is the metric.** A user opens Hey Bradley, picks a personality on first run, and feels the product change voice in real time. Toggling personalities mid-chat produces visibly distinct, screenshotable replies. Mobile users get a clean 3-tab experience without the desktop builder. Power users see every prompt + reply in a Conversation Log. A one-click Share button copies a data URL holding the full spec to the clipboard. **Zero Σ widening on any Crystal Atom.**

Demo line: *"Watch what happens when I switch from Executive mode to Geek mode mid-build."*

---

## Phase breakdown — 12 agents across 4 phases

### P50 — Personality Engine (3 parallel agents)

**Goal:** ship the engine + state + persistence + prompt injection. No UI yet.

| Agent | Owner-stated scope | Concrete files |
|---|---|---|
| **A1** | Create `personalityEngine.ts` — 5 modes, each defining tone rules / emoji policy / AISP visibility / suggestion style. Wire into `buildSystemPrompt()` as post-atom injection. Persist `personality_id` to kv. | NEW `src/contexts/intelligence/personality/personalityEngine.ts` (≤200 LOC) · `src/contexts/intelligence/prompts/system.ts` (+ `personality?` param, ≤25 LOC delta) · `src/contexts/persistence/repositories/kv.ts` (cheap getter/setter, ≤30 LOC) · `src/store/intelligenceStore.ts` (`personalityId` field + hydrate on init, ≤30 LOC) |
| **A2** | Wire `personalityEngine.render()` into `chatPipeline.ts` output. Compose personality message from existing `intentTrace` + envelope. Extend `ChatMessage` with `personalityMessage`. **No LLM call. No Σ widening.** | `src/contexts/intelligence/chatPipeline.ts` (defensive try/catch on render call; populate `result.personalityMessage`; ≤30 LOC delta) · `src/components/shell/ChatInput.tsx` (`personalityMessage` field on `ChatMessage`; pendingAispRef carries it; render under typewriter; ≤25 LOC delta) |
| **A3** | ADR-073 (composition pattern, no Σ widening) + 15 source-level tests verifying all 5 modes produce distinct messages from identical input. | NEW `docs/adr/ADR-073-personality-composition.md` (≤120 LOC) · NEW `tests/p50-personality-engine.spec.ts` (~15 cases) |

**Gate:** all 3 → tsc + cumulative regression GREEN → commit P50 → P51.

---

### P51 — Picker UI + Onboarding step + Chat-bubble styling (3 parallel agents)

**Goal:** make the engine visible. Live toggle works. First-run user is asked.

| Agent | Owner-stated scope | Concrete files |
|---|---|---|
| **A4** | `PersonalityPicker.tsx` — 5 cards with name + emoji + 1-line description + live preview of how the AI would respond to "make it brighter". Mount in Settings drawer. Active-personality chip in chat header. | NEW `src/components/settings/PersonalityPicker.tsx` (≤220 LOC; arrow-key nav mirroring P48 QuickAddPicker; `role="radiogroup"` + `aria-checked`) · `src/components/settings/SettingsDrawer.tsx` (mount above ReferenceManagement, ≤10 LOC delta) · `src/components/shell/ChatInput.tsx` (active-personality chip beside simulated/mock pill, ≤15 LOC delta) |
| **A5** | Extend `Onboarding.tsx` — new first-run step "How would you like me to talk to you?" with the 5 personality cards. Default `professional`. Skip available. 5 distinct chat bubble styles (font weight, emoji density, color accent). | `src/pages/Onboarding.tsx` (≤80 LOC delta — one new step BEFORE theme pick; reuse PersonalityPicker) · `src/components/shell/ChatInput.tsx` (5 styled bubble variants, Tailwind variants only; ≤30 LOC delta) |
| **A6** | ADR-074 + 15 source-level tests (picker exports + Settings mount + Onboarding step + 5 styled bubble variants present + active-personality chip). | NEW `docs/adr/ADR-074-personality-picker-and-onboarding.md` (≤120 LOC) · NEW `tests/p51-personality-ui.spec.ts` (~15 cases) |

**Gate:** all 3 → tsc + cumulative regression GREEN → commit P51 → P52.

---

### P52 — Conversation Log + Share Spec (3 parallel agents)

**Goal:** power-user surface + the viral-loop button.

| Agent | Owner-stated scope | Concrete files |
|---|---|---|
| **A7** | `ConversationLogTab.tsx` — EXPERT mode tab. Shows all prompts + AI replies joined from `chat_messages` + `llm_logs`. Filter by session / personality / provider. Export as MD or JSON. | NEW `src/components/center-canvas/ConversationLogTab.tsx` (≤300 LOC) · `src/store/uiStore.ts` (add `'CONVERSATION_LOG'` to `ActiveTab`) · `src/components/center-canvas/TabBar.tsx` (register tab, expert: true) · `src/components/center-canvas/CenterCanvas.tsx` (render branch) · NEW `src/contexts/specification/conversationLogExport.ts` (MD / JSON exporters, ≤120 LOC) |
| **A8** | `ShareSpecButton.tsx` — one click → builds full spec (North Star + SADD + AISP) → encodes to a data URL → copies to clipboard with toast confirmation. Viral mechanic. | NEW `src/components/shell/ShareSpecButton.tsx` (≤140 LOC) · `src/components/shell/ChatInput.tsx` (mount above input on desktop, ≤10 LOC delta) · NEW `src/contexts/specification/shareSpecBundle.ts` (compose + base64-encode, ≤80 LOC) |
| **A9** | ADR-075 + 20 tests (tab registration + export shapes + Share button testid + clipboard call site + privacy guard: ensure `redactKeyShapes` runs at export boundary). | NEW `docs/adr/ADR-075-conversation-log-and-share.md` (≤120 LOC) · NEW `tests/p52-log-and-share.spec.ts` (~20 cases) |

**Gate:** all 3 → tsc + cumulative regression GREEN → commit P52 → P53.

---

### P53 — Mobile UX + Sprint J Seal (3 parallel agents)

**Goal:** mobile becomes a real first-class surface (per owner D7). Sprint J seals.

| Agent | Owner-stated scope | Concrete files |
|---|---|---|
| **A10** | `MobileLayout.tsx` — 3-tab sticky nav (Chat / Listen / View). Builder hidden at `< md:`. Hamburger mounts all advanced features (specs, AISP, logs, settings, BYOK, brand voice, codebase upload, share spec). | NEW `src/components/shell/MobileLayout.tsx` (≤280 LOC) · NEW `src/components/shell/MobileMenu.tsx` (≤220 LOC; reuses existing components; no duplication) · `src/pages/Builder.tsx` (responsive switch — `md:hidden` for the new layer, desktop tri-pane at ≥768px; ≤25 LOC delta) |
| **A11** | Preview tab sticky nav. Listen mobile polish (bigger PTT button, press-state). Touch interactions verified across the 3 mobile tabs. | `src/components/center-canvas/RealityTab.tsx` (sticky top mini-nav on mobile preview, ≤30 LOC delta) · `src/components/left-panel/ListenTab.tsx` or `MobileLayout` (PTT mobile size + active press-state; ≤40 LOC delta) |
| **A12** | ADR-076 + 15 tests + brutal review (Grandma ≥84, composite ≥93) + fix pass + seal artifacts. Update `docs/wiki/llm-call-process-flow.md`. Update `docs/GROUNDING.md`. Target ~615/615 GREEN. | NEW `docs/adr/ADR-076-mobile-ux-overhaul.md` (≤120 LOC) · NEW `tests/p53-mobile-and-seal.spec.ts` (~15 cases) · NEW `plans/implementation/phase-53/deep-dive/01-sprint-j-review.md` (≤200 LOC) · `docs/wiki/llm-call-process-flow.md` (`Last verified: P53 sealed`) · `docs/GROUNDING.md` (Sprint J row + composite trajectory + carryforward update) |

**Gate:** all 3 → tsc + full cumulative regression GREEN → seal commit + push.

---

## ADRs to author (4 total)

| ADR | Phase | Title | Cross-references |
|---|---|---|---|
| **ADR-073** | P50 | Personality Engine + Composition (no Σ widening) | ADR-040 (kv), ADR-045 (PATCH_ATOM), ADR-053 (INTENT_ATOM), ADR-067/068 (Sprint H), ADR-070/071 (Sprint I) |
| **ADR-074** | P51 | Personality Picker + First-Run Onboarding step | ADR-070 (a11y), ADR-073 |
| **ADR-075** | P52 | Conversation Log Viewer + Share Spec | ADR-040, ADR-045, ADR-067 (export-strip discipline), ADR-073 |
| **ADR-076** | P53 | Mobile UX (north-star X8 bifurcation) | ADR-072 (P49 mobile polish — Tailwind-only precedent), ADR-073, ADR-074, ADR-075 |

Each ≤120 LOC per the agent-prompt cap.

---

## Test plan (~65 new cases, ~615 cumulative target)

| Spec | Phase | Cases | Pattern |
|---|---|---|---|
| `tests/p50-personality-engine.spec.ts` | P50 | ~15 | PURE-UNIT, source-level + direct module imports (avoid aisp barrel). Engine + state + system-prompt injection ordering. |
| `tests/p51-personality-ui.spec.ts` | P51 | ~15 | PURE-UNIT, source-level. Picker + Settings mount + Onboarding step + 5 bubble variants + chip. |
| `tests/p52-log-and-share.spec.ts` | P52 | ~20 | PURE-UNIT. Tab registration + MD/JSON export shape + Share button + redactKeyShapes at export boundary. |
| `tests/p53-mobile-and-seal.spec.ts` | P53 | ~15 | PURE-UNIT. md:hidden + 3 tabs + hamburger inventory + Builder hidden + ADR-076 shape + wiki phase pin ≥ P53. |

---

## Risks + mitigations

| # | Risk | Mitigation |
|---|---|---|
| R1 | Personality messages feel canned | Per-personality template variety + deterministic affirmation prefix tied to summary[0] (P48 improvementSuggester proved this pattern works at $0 cost) |
| R2 | Mobile layout regresses desktop | Tailwind `md:` breakpoint discipline; cumulative regression includes desktop assertion |
| R3 | Share-spec data URL leaks BYOK keys | redactKeyShapes runs at export boundary (P46 precedent). Tested explicitly in p52 |
| R4 | Onboarding step adds friction | Skip path defaults to `professional`; one click; no field entry |
| R5 | Conversation Log is power-user only and dilutes sprint focus | Subsumed under "wow factor" by being the first surface to read joined `chat_messages ⨝ llm_logs` — sets up the Tier-2 Supabase migration story |

---

## Sequence + commit cadence

```
P50 commit → push → P51 commit → push → P52 commit → push → P53 seal commit → push
```

Each phase commits as one unit (3 agents land in one commit per the established Sprint H/I cadence). Stream-resilient: even if a wave's third agent times out, the first two are committed and a single follow-up agent closes the gap.

---

## Seal format (owner-specified)

```
Sprint J Sealed
Composite: [X]/100
Personas: Grandma [X] / Framer [X] / Capstone [X]
Personalities: 5/5 distinct + screenshot-worthy toggle
Share spec: clipboard functional
Mobile: 3-tab nav live
Tests: [N]/[N] GREEN
Commit: [hash]
```

---

## What is INTENTIONALLY out of scope

Per owner D5/D6/D7 and `plans/strategic-reviews/2026-04-29-product-evaluation.md`:

- LLM-driven personality generation (Option A in `01-audit.md`)
- Hosted server-side share link (clipboard data URL only this sprint)
- Vector-DB learning flywheel
- AISP Live Trace (always-on visible in chat) — captured in strategic review as recommendation #1; deferred
- Tier 2 flagship dashboard proof point — deferred
- Personality auto-calibration

---

## Open questions BEFORE swarm dispatch

1. **ADR cross-references** — confirm the ADR-072 (P49 Tailwind-only mobile precedent) cross-link for ADR-076 is the right anchor. (Likely yes.)
2. **GROUNDING.md vs north-star X8** — does ADR-076 explicitly amend X8, or just narrow it operationally? Recommend: ADR-076 documents the bifurcation (Builder mobile = still out; Chat/Listen/Preview mobile = in) and references X8 as the prior ruling.
3. **Test count target** — owner stated 615; current cumulative is 550. Sprint J adds ~65. Math = 615. Confirmed.
4. **Capstone date pressure** — Sprint H + I each took ~2 days. Sprint J at 4 phases ≈ 1.5–2 days at velocity. Capstone is May 2026. Sprint J should fit comfortably; reaffirm before dispatch.

When these answer (or are accepted as-is), dispatch P50 Wave 1 (3 agents) in one message.
