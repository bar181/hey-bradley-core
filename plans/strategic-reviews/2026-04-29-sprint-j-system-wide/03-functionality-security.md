# Sprint J Comprehensive Review — Chunk 3 of 4
## Functionality + Security + Test Coverage

> Date: 2026-04-29 (post Sprint J seal commit 644200a)
> Reviewer lens: Functionality + Security + Test
> Verdict: **PASS**
> Score: **90 / 100**

## Headline grades

| Lens | Verdict | Score |
|---|---|---:|
| Sprint J feature inventory (P50/P51/P52/P53 work?) | **PASS** | 92 |
| Security boundary discipline (`redactKeyShapes`) | **PASS** | 96 |
| Test coverage breadth | **PASS** | 90 |
| Test coverage depth (runtime vs source-presence) | **PARTIAL** | 78 |
| AgentProxy / Fixture cost discipline | **PASS** | 100 |
| Cost-cap discipline (ADR-049) | **PASS** | 100 |
| Defensive coding consistency | **PASS** | 92 |
| Carryforward debt | **PASS** | 95 |

## 1. Sprint J feature inventory — does each work?

### P50 Personality engine + composition (✅ PASS)
- 5 distinct outputs verified by `tests/p50-personality-engine.spec.ts:P50.4` — `new Set(outputs).size === 5`.
- System prompt injection in `system.ts:161-166` (`renderPersonalityBlock`).
- chatPipeline composition wired in BOTH success returns (template-router AND LLM patch path) per `chatPipeline.ts:86-103` (`derivePersonalityMessage`).
- `personalityId` round-trips kv via `kv.ts` typed helpers.
- ChatMessage extension carries `personalityMessage` + `personalityId` to render via `ChatInput.tsx`.

### P51 PersonalityPicker + Onboarding step + 5 bubble styles (✅ PASS)
- Picker mounts above ReferenceManagement in SettingsDrawer (verified by p51 tests).
- Onboarding gate via `kv['onboarding_personality_asked']` flag (verified by p51 tests).
- 5 distinct bubble style branches present in ChatInput.tsx with `data-bubble-style={msg.personalityId}` (verified by p51 tests).
- Active-personality chip renders unconditionally in chat header.

### P52 ConversationLog + ShareSpec (✅ PASS)
- Tab registered in `uiStore.ts` ActiveTab + TabBar.tsx (expert: true) + CenterCanvas.tsx render branch.
- Joins `chat_messages ⨝ llm_logs` by `(session_id, created_at)` via `loadConversationLog` in `conversationLogExport.ts`.
- MD + JSON exports auto-download via Blob + URL.createObjectURL.
- ShareSpecButton clipboard data URL with toast confirmation; defensive try/catch + fallback console.log on clipboard API failure.

### P53 Mobile UX overhaul (✅ PASS)
- MobileLayout + MobileMenu + Builder responsive switch all on disk and tested.
- 3-tab nav (Chat / Listen / View) with sticky bottom; hamburger holds 6 advanced surfaces.
- Builder hidden via `hidden md:flex` wrapper in Builder.tsx; mobile layer is `md:hidden`.
- RealityTab sticky preview nav (testid `mobile-preview-stickynav`).
- ListenControls PTT mobile polish (max-md:rounded-full + active:scale-95 + touch-none).

## 2. Security boundary audit — `redactKeyShapes` discipline

**15 call sites across 15 files** (37 individual call instances). Full inventory:

| Site | File | Boundary type | Status |
|---|---|---|---|
| Definition | `intelligence/llm/keys.ts` | source | 🟢 |
| Persist (brand) | `persistence/repositories/brandContext.ts` | persist | 🟢 P46 fix-pass |
| Persist (codebase) | `persistence/repositories/codebaseContext.ts` | persist | 🟢 P46 fix-pass |
| Inject (system prompt) | `intelligence/prompts/system.ts` (`resolveBrandContextBlock`) | inject | 🟢 P46 fix-pass |
| Audit | `intelligence/llm/auditedComplete.ts` | audit | 🟢 |
| Adapter (openrouter) | `intelligence/llm/openrouterAdapter.ts` | error | 🟢 |
| Adapter utils | `intelligence/llm/adapterUtils.ts` | error | 🟢 |
| STT (web speech) | `intelligence/stt/webSpeechAdapter.ts` | error | 🟢 |
| Listen pipeline | `left-panel/listen/useListenPipeline.ts` | persist | 🟢 |
| Listen store | `store/listenStore.ts` | error | 🟢 |
| UI store | `store/uiStore.ts` | (chip text) | 🟢 |
| Export-strip | `persistence/exportImport.ts` | export | 🟢 |
| **Conversation log render** | `components/center-canvas/ConversationLogTab.tsx` | render | 🟢 P52 |
| **Conversation log export** | `contexts/specification/conversationLogExport.ts` | export | 🟢 P52 |
| **Share Spec bundle** | `contexts/specification/shareSpecBundle.ts` | export | 🟢 P52 |

**Sprint J-introduced security boundaries (3 new):**
- ConversationLogTab render — every text/hash painted goes through redactKeyShapes ✅
- conversationLogExport (MD + JSON) — every value redacted before serialization ✅
- shareSpecBundle — JSON serialized then redacted BEFORE base64 encoding ✅

**No gaps detected.** Defence-in-depth holds end-to-end.

**Σ-restriction adjacent check:** `kv['personality_id']` is intentionally NOT in SENSITIVE_KV_KEYS (per ADR-073) — verified by reading `exportImport.ts`. The personality preference SHIPS in `.heybradley` exports; this is the intended behavior (it's a UX preference, not a credential).

## 3. Test coverage — honest gaps

### Cumulative count: 617/617 PURE-UNIT GREEN

Sprint J added 4 specs:
- `p50-personality-engine.spec.ts` (15 cases)
- `p51-personality-ui.spec.ts` (15 cases)
- `p52-log-and-share.spec.ts` (21 cases)
- `p53-mobile-and-seal.spec.ts` (15 cases)

= **66 new cases** (target was ~65; close).

### What IS tested
- ✅ Source-level shape (file exists, exports present, LOC caps, testids present)
- ✅ Crystal Atom Σ stability (regex match against atom literals)
- ✅ Type-level personality engine API (`PERSONALITY_IDS`, `PERSONALITY_PROFILES`)
- ✅ Renderer determinism (same input → 5 distinct outputs by Set size)
- ✅ Per-mode visual markers (geek has Ω/Σ; fun has emoji; teacher has encouragement; etc.)
- ✅ ADR shapes (≤120 LOC, Status: Accepted, cross-refs)
- ✅ Wiki phase pin (P53)
- ✅ KISS dep guard (no new heavyweight deps)

### What ISN'T tested (honest gaps)

🟡 **Runtime composition trace** — the chatPipeline `derivePersonalityMessage` defensive try/catch is asserted at the source level (regex match for `try { … personalityEngine }`) but the actual *failure path* (suggester throws → null returned → pipeline still succeeds) is NOT exercised at runtime.

🟡 **Personality persistence across browser sessions** — `kv['personality_id']` round-trip is asserted at the kv-helper level but never tested in a browser session that actually writes-then-reloads.

🟡 **ConversationLog SQL join correctness** — `loadConversationLog` is tested for source presence (testid + function name) but the actual JOIN result on a populated DB is not asserted. If the merge-by-(session_id, created_at) logic has a bug, current tests miss it.

🟡 **Share Spec clipboard fallback** — the catch path (clipboard API unavailable) is asserted at source but not exercised at runtime.

🟡 **Mobile tab-switch behavior** — `MobileLayout.tsx` 3-tab state machine has zero runtime assertions. Source-level tests confirm the tabs exist; nothing confirms tab-switching works without a stuck-state.

🟡 **Onboarding gate logic** — `kv['onboarding_personality_asked']` flag is asserted to be referenced in source; the actual gate-then-skip flow is not runtime-tested.

**Why this matters:** the PURE-UNIT pattern is fast + cheap + first-pass-green. But it's source-presence verification, not behavior verification. The 617/617 green count is a strong signal of architectural discipline; it is NOT a strong signal of defect-free runtime.

**Recommendation:** add a small Playwright-with-browser suite (≤10 cases) covering:
- Onboarding personality pick → kv flag set → next reload skips the step
- Personality switch in Settings → next chat reply uses new tone
- ConversationLog renders rows after a mock chat
- Share Spec clipboard write succeeds in Chromium
- Mobile tab-switch preserves state

This complements the PURE-UNIT discipline without duplicating it.

## 4. AgentProxyAdapter / FixtureAdapter discipline

**$0 cost guard held.** No Sprint J path silently adds a new LLM call:
- `personalityEngine.renderPersonalityMessage` is pure-rule (verified by reading source — no `await`, no `import` of any adapter).
- `derivePersonalityMessage` in chatPipeline is wrapped in try/catch + dynamic-import; if it ever DID add an LLM call, defensive failure would still let the pipeline succeed. But it doesn't.
- ConversationLog reads existing `chat_messages` + `llm_logs` rows — read-only.
- Share Spec composes from existing exporters — no new LLM.

**example_prompts table coverage:** Sprint J added 0 new prompts. Was that the right call? **Yes** — composition is post-LLM, so per-personality fixtures aren't needed. The 5 modes generate from the SAME envelope; AgentProxy continues to serve a single envelope per prompt.

## 5. Cost-cap discipline (ADR-049)

Two-tier gate untouched:
- Soft gate (per-atom, e.g., `assumptionsLLM`) — unchanged
- Hard gate (`auditedComplete`) — unchanged
- Sprint J adds `~80 chars` to system prompt (the personality_layer block) when an explicit personality is set. Token impact: ~20 tokens per call. Negligible against the 2,400-token system prompt budget.

🟢 PASS.

## 6. Defensive coding consistency

Sprint J relies on dynamic imports + try/catch around composition + render boundaries. Audit:

| Site | Pattern | DEV warn? |
|---|---|---|
| `chatPipeline.deriveImprovements` (P48) | dynamic import + try/catch | ✅ DEV warn |
| `chatPipeline.derivePersonalityMessage` (P50) | dynamic import + try/catch | ✅ DEV warn |
| `system.ts.resolveBrandContextBlock` | sync read + try/catch | ✅ silent fail (intentional — kv unread on first boot) |
| `ConversationLogTab.loadConversationLog` | try/catch | 🟡 silent fail (no DEV warn) |
| `ShareSpecButton.composeShareSpecBundle` | per-field try/catch with DEV warn | ✅ |

**One inconsistency:** ConversationLogTab catches and silently returns `[]`. Acceptable for a power-user surface but a DEV warn would help debugging. 🟢 nice-to-have.

## 7. Carryforward debt

### Sprint J-originated (deferred to Sprint K opener)
- 🟡 S1: MobileMenu trigger caption (a11y polish)
- 🟡 S2: Drawer transition polish (Framer-tier feedback)
- 🟢 NTH 1: motion-reduce variant on hover scale
- 🟢 NTH 2: re-render personality previews with recent user input

All documented in `plans/implementation/phase-53/deep-dive/01-sprint-j-review.md`.

### Pre-existing (not Sprint J)
- 🔴 ChatInput.tsx ~950 LOC violates ≤500 cap (chronic, see Chunk 1 §5)
- 🔴 Onboarding.tsx ~810 LOC violates ≤500 cap (chronic)
- 🟡 SectionsSection.tsx ~600 LOC

## 8. Verdict — composite + must-fix

**Composite: 90/100 PASS.**

- Functionality: every Sprint J feature ships and works at the source level.
- Security: defence-in-depth holds; 3 new redactKeyShapes call sites added cleanly.
- Test breadth: PASS (66 new cases; ~615 cumulative GREEN).
- Test depth: PARTIAL — runtime behavior largely untested.
- Cost discipline: PASS.

🔴 **Must-fix (system-wide, not Sprint J-specific): 2** — both ChatInput.tsx + Onboarding.tsx LOC violations.

🟡 **Should-fix: 7** (Sprint J 2 + system-wide 5 from chunks 1+2)

## 9. Recommendations (ranked by impact)

1. **Add a Playwright runtime suite** (target ≤10 browser-based cases) covering the 5 honest gaps in §3. Highest leverage for category-product credibility — runtime tests prove the product *works*, not just compiles.
2. **Fix ChatInput.tsx LOC violation** — the chronic 950-LOC file is the single biggest defect-introduction risk in the codebase. Every Sprint touches it. Sprint K opener should split it into 4 components.
3. **DEV-warn on ConversationLog silent fail** — one-line fix, restores defensive-coding consistency.
