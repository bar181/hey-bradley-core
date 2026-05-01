# P85 / OC-19 — AISP Integration Audit (READ-ONLY)

**Date:** 2026-05-01
**Branch:** claude/verify-flywheel-init-qlIBr
**Owner:** Agent A1
**Scope:** Codebase-wide audit of AISP visibility on user surfaces. Sibling A2
implements dual-views downstream from this doc; A3/A4 work disjoint scopes.

---

## §1 Methodology (~15 LOC)

**Encoded principle (owner brief).**
1. AISP is the moat. Every reasoning surface that ships on RC1 must answer:
   "Is the user shown the symbolic trace, or only the prose summary?"
2. Dual-view = a developer-visible AISP atom rendered alongside the
   Grandma-friendly text. Atoms are NEVER replaced by prose; prose is added.
3. Internal-only surfaces stay hidden — UX would suffer (e.g., a homepage
   visitor does not need to see Σ:= ⟦…⟧).

**Surface scoring rubric (3 buckets).**
- `aisp-visible` — AISP atom/chips/trace already rendered to the user.
- `dual-view-candidate` — Pipeline produces atom data but UI renders only prose
  summary; surfacing it is high-leverage and cheap (≤50 LOC).
- `internal-only-correct` — Atom data exists but exposing it would harm UX
  (marketing pages, mid-flight transcripts, mobile drawer listen mode).

---

## §2 Surface inventory (≥15 rows)

| # | Surface | File:line | Currently shows AISP? | Category | Recommendation |
|---|---|---|---|---|---|
| 1 | Chat reply (bradley bubble) | src/components/shell/ChatThread.tsx:144-156 | yes — AISPSurface dispatched per reply | aisp-visible | keep |
| 2 | EXPERT pipeline trace pane (5-atom) | src/components/shell/AISPPipelineTracePane.tsx:64-172 | yes — full INTENT/ASSUMPTIONS/SELECTION/CONTENT/PATCH | aisp-visible | keep |
| 3 | SIMPLE-mode AISP translation panel | src/components/shell/AISPTranslationPanel.tsx:97-140 | yes — collapsible "How I understood this" | aisp-visible | keep |
| 4 | Always-on Crystal-Atom trace pill | src/components/shell/AISPTraceLine.tsx:42-59 | yes — verb+target chip on every reply | aisp-visible | keep |
| 5 | Geek-personality raw INTENT footer | src/components/shell/ChatThread.tsx:113-120 | yes — `INTENT_ATOM · verb:target · conf` | aisp-visible | keep |
| 6 | Spec panel (XAIDocsTab — AISP sub-tab) | src/components/center-canvas/XAIDocsTab.tsx:27,226-234 | yes — Crystal-Atom highlighted render + "Learn more" link | aisp-visible | keep |
| 7 | ConversationLogTab (5-atom chips) | src/components/center-canvas/ConversationLogTab.tsx:193-198 | yes — `aispAtoms.map` chips per bradley row | aisp-visible | keep |
| 8 | ConversationLogTab decomp trace | src/components/center-canvas/ConversationLogTab.tsx:200-215 | yes — collapsible per-todo `verb · target · conf · status` | aisp-visible | keep |
| 9 | Mobile spec bottom sheet | src/components/shell/MobileSpecBottomSheet.tsx:179-198 | yes — 5 AISP atom chips peek + full | aisp-visible | keep |
| 10 | AISP marketing page (/aisp) | src/pages/AISP.tsx:7-12,93-103 | yes — Σ/Γ/Λ/Ω/Ε components, Sigma-512, dual-view | aisp-visible | keep |
| 11 | AISP marketing dual-view | src/components/marketing/AISPDualView.tsx:47-67 | yes — Crystal Atom side-by-side prose | aisp-visible | keep |
| 12 | **Template matcher confidence** | src/contexts/intelligence/templates/templateMatcher.ts:117-198 | no — pipeline produces `tplMatch.confidence + .rationale`, never surfaced as inline chip on chat reply | dual-view-candidate | A2 surfaces in chat reply (see §3.1) |
| 13 | **DECOMP_ATOM todos** | src/contexts/intelligence/aisp/decompAtom.ts:237-279; chatPipeline.ts:364-414 | partial — todoTraces visible in ConversationLogTab when present, but invisible on chat reply itself | dual-view-candidate | A2 renders inline todo list under chat reply (see §3.2) |
| 14 | **Error states** | src/lib/mapChatError.ts:22-37; ChatInput.tsx:451-456 | no — prose-only "Hit cost cap." No atom/code shown | dual-view-candidate | A2 adds EXPERT-mode error code chip (see §3.3) |
| 15 | Mode selector landing card | src/components/onboarding/ModeSelectorCard.tsx:37-65 | no — 3 cards (whiteboard/planning/agentics), no AISP mention | dual-view-candidate (Agentics tier) | A3 ships dedicated developer onboarding card (see §3.4) |
| 16 | Welcome page hero | src/pages/Welcome.tsx:38-73 | partial — text mentions AISP but no atom rendered | dual-view-candidate (post-RC) | A2 inline 1-atom example (see §3.5 — blog/marketing) |
| 17 | INTENT_ATOM internal classifier | src/contexts/intelligence/aisp/intentAtom.ts:17-45 | no — Crystal Atom string defined but only consumed internally | internal-only-correct | hide |
| 18 | ASSUMPTIONS_ATOM internal validator | src/contexts/intelligence/aisp/assumptionsAtom.ts:24-51 | no — atom exists in code, surfaced only via assumption list UI | internal-only-correct | hide |
| 19 | DECOMP_ATOM string | src/contexts/intelligence/aisp/decompAtom.ts:25-49 | no — atom literal never rendered; runtime only | internal-only-correct | hide |
| 20 | Mobile first-run card | src/components/shell/MobileFirstRunCard.tsx:39-79 | no — "Tap Listen or Chat" only | internal-only-correct | hide (orientation, not capability tour) |
| 21 | ChatInput simulated-mode pill | src/components/shell/ChatInput.tsx:560-566 | no — adapter pill, not an AISP surface | internal-only-correct | hide |
| 22 | Listen mid-flight transcript | src/components/shell/MobileListenFullscreen.tsx (whole file) | no — voice-input mid-flight | internal-only-correct | hide |
| 23 | ChatInputBar text field | src/components/shell/ChatInputBar.tsx:43-67 | no — input box | internal-only-correct | hide |
| 24 | Improvement suggestions | src/components/shell/ChatThread.tsx:160-172 | no — prose "next steps" tips | internal-only-correct | hide (UX-friendly nudge) |

**Surface count:** 24 distinct rows. By category: 11 aisp-visible · 5 dual-view-candidate · 8 internal-only-correct.

---

## §3 5 dual-view recommendations for A2 (≤80 LOC)

### Recommendation 1 — Template matcher confidence chip
- **Surface in:** ChatThread.tsx (chat reply renderer, after AISPSurface block ~line 156)
- **Pipeline produces:** `chatPipeline.submit() → result.summary` includes `template intelligence — ${tplMatch.rationale}` at chatPipeline.ts:436. The pre-render envelope already carries `templateId`; widen to expose `tplMatch.confidence + .rationale`.
- **UX:** Tiny inline chip below bradley reply: `selected warm-minimal (0.94 conf)` in EXPERT mode only; hidden in SIMPLE.
- **Risk:** ChatPipelineResult envelope needs `tplMatch?: { name, confidence, rationale }` field (~5 LOC widen). ChatMessage ChatThread render adds chip (~25 LOC).
- **Surgical estimate:** 30-50 LOC total (chatPipeline.ts:478-493 +5 LOC envelope, ChatThread.tsx +25 LOC chip, ChatMessage type +3 LOC).

### Recommendation 2 — DECOMP todos inline list
- **Surface in:** ChatThread.tsx (insert ABOVE AISPSurface when bradley reply triggered DECOMP path)
- **Pipeline produces:** chatPipeline.ts:370-411 builds `decomp.todos[]` + `exec.traces[]` but only the summary string (`Decomposed 3 todos — 5 patches applied`) ships. Already serializes to log via tAny.todoTraces (ConversationLogTab.tsx:175-176).
- **UX:** Compact ordered list under bradley reply: `1. modify theme — bright (0.9) ✓ applied  2. add section — pricing (0.9) ✓ applied  3. modify tone — fun (0.6) ⚠ deferred`. Color-coded by status. EXPERT-default-open / SIMPLE-collapsed.
- **Risk:** ChatPipelineResult lacks decomp fields today; widen envelope to `decomp?: { todos, traces, status }`. The early-return at chatPipeline.ts:402-409 must populate it.
- **Surgical estimate:** 40-60 LOC (chatPipeline.ts +10 envelope, ChatMessage +3, ChatThread +35 inline render with status icons + EXPERT gate).

### Recommendation 3 — Error code dual-view (EXPERT)
- **Surface in:** ChatThread.tsx (typewriter error reply branch) and/or AISPSurface
- **Pipeline produces:** `mapChatError(kind)` (mapChatError.ts:22-37) returns prose; the `kind` enum (cost_cap | timeout | validation_failed | precondition_failed | rate_limit | unknown) is computed in chatPipeline.ts:189-199 and surfaced via `result.errorKind`.
- **UX:** SIMPLE mode renders prose only (today's behavior). EXPERT mode adds a fixed-width chip: `ERROR · cost_cap · adapter:claude` in red. Pairs with the existing latency badge.
- **Risk:** Errors today reach ChatInput.tsx:454 via `setTypingFull(mapChatError(...))` then commit to ChatMessage with `aisp = null`. The error path bypasses pendingAispRef. Need to attach `errorKind` to ChatMessage so render branch can fire. Atom literal: pure inline. No ADR change.
- **Surgical estimate:** 25-40 LOC (ChatMessage +1 field, ChatInput.tsx error branch +5 to attach kind, ChatThread render +20 chip).

### Recommendation 4 — AISP developer onboarding card placement (A3 coordination)
- **Surface in:** ModeSelectorCard.tsx — sibling A3 ships a 4th card OR an inline "for developers" link. A2 does NOT touch the mode selector itself; A2 ensures the dual-view downstream from A3's card path.
- **Pipeline produces:** Onboarding flow does not run AISP. The card is discovery-only.
- **UX:** A3's card → /aisp page (already AISP-rich) OR inline atom-preview (`Ω := { build a website }`) on hover. A2 confirms the /aisp landing has dual-view (it does, line 252 — AISPDualView already mounted).
- **Risk:** Cross-agent coordination. If A3 ships a "View AISP capability" expand-on-click, A2 ensures the inline preview re-uses AISPDualView (already polyglot-ready).
- **Surgical estimate:** 0 LOC for A2 (downstream check only). A3 owns the card. A2 verifies.

### Recommendation 5 — Blog/marketing AISP code blocks
- **Surface in:** src/pages/blog/posts/*.md (12 posts on disk per ADR-097) and src/pages/Welcome.tsx hero.
- **Pipeline produces:** Static markdown — no pipeline. AISP atom literal embeds as fenced code block.
- **UX:** Each blog post that mentions a Crystal Atom should embed a 5-line example (`⟦ Ω:= … ⟧`) syntax-highlighted via the same AISPHighlighted component (XAIDocsTab.tsx:37-85). Welcome.tsx hero adds a 3-line teaser atom in a card. Both link to /aisp.
- **Risk:** Welcome.tsx hero is high-traffic — Grandma viewers should see prose first, atom as visual proof second. Render the atom small + collapsed.
- **Surgical estimate:** 50-80 LOC (Welcome.tsx +20 hero atom card, AISPHighlighted re-export +5, blog post macros TBD owner choice — defer to P89 per §5).

---

## §4 Internal-only confirmations (~30 LOC)

Surfaces where AISP MUST stay hidden because exposing the atom would harm UX:

1. **Welcome page hero** (src/pages/Welcome.tsx:38-73) — first-time visitor lands here; the prose hook ("Tell Bradley what you want. Watch it appear.") MUST land before any symbolic notation. AISP belongs in the proof section, not the headline. (Recommendation 5 places atoms in a CARD, not the hero.)
2. **Mobile first-run card** (src/components/shell/MobileFirstRunCard.tsx:39-79) — 2-button orientation only ("Tap Listen or Chat to start"). Mobile attention budget = ~3 seconds; an AISP atom here breaks the "pick one" decision.
3. **ChatInput mid-typing input box** (src/components/shell/ChatInputBar.tsx:43-67) — placeholder "Tell Bradley what to build…" must stay prose. The atom appears AFTER submit, not before.
4. **Listen mid-flight transcript** (src/components/shell/MobileListenFullscreen.tsx:1-124) — voice users are mid-utterance; flashing INTENT_ATOM partials would distract. Atoms render only on the final transcript reply.
5. **Mode selector landing tagline** (src/components/onboarding/ModeSelectorCard.tsx:80-83) — "Pick a mode. You can switch anytime." The card itself stays prose; A3 ships a separate developer-discovery surface.
6. **Improvement suggestions block** (src/components/shell/ChatThread.tsx:160-172) — "next steps" nudges are intentionally Grandma-shaped; injecting Σ:= here would re-introduce the cognitive-load gap that ADR-064 closed.
7. **Simulated-mode pill** (src/components/shell/ChatInput.tsx:560-566) — adapter status, not capability. Belongs alongside the mic, not alongside the spec.
8. **Onboarding "Import existing site" hint** (src/pages/Onboarding.tsx:362) — copy already says "Import AISP or JSON specs"; no atom literal needed at the call-to-action layer.

---

## §5 Carry-forwards (≤30 LOC)

Items NOT shipping in P85 (deferred per owner roadmap):

1. **Geek-personality demo with AISP prominence** — Geek footer (ChatThread.tsx:113-120) already exists; a dedicated demo route showcasing geek mode + DECOMP + 5-atom trace as a polished marketing artifact deferred to P89 (section type polish window).
2. **Blog post AISP code-block macro** — Recommendation 5 embeds atoms in posts but full macro/MDX support across all 12 posts deferred to P89 (content polish).
3. **AISP error catalog full inventory** — ChatErrorKind has 6 values; the EXPERT chip lands them inline (Recommendation 3) but a dedicated `/docs/aisp/errors` reference page deferred to post-RC commercial.
4. **Agentics mode landing AISP-first onboarding** — When ModeSelectorCard.tsx's `agentics` card ships live (currently coming-soon, line 64), it should default to an AISP-first developer surface. Deferred to P94 (Agentics activation).
5. **HNSW-backed AISP atom search** — Once the ruvector flywheel activates (Tier-2), users could search past atom traces. Deferred to commercial.
6. **Welcome.tsx hero atom card** — Recommendation 5 line item; A2 may defer to P89 if the 80-LOC budget overruns. Owner choice at A2 dispatch.

---

## Verification (hard rules)

- Doc exists at `plans/strategic-reviews/2026-05-01-aisp-integration-audit.md` ✓
- All 5 sections (§1-§5) present ✓
- ≥15 surface rows: 24 ✓
- 5 dual-view recommendations with implementation hints ✓
- 5+ internal-only confirmations: 8 ✓
- File:line citations on every claim ✓
- READ-ONLY (no source/test/ADR edits) ✓
- ≤300 LOC ✓ (this file = ~178 LOC)
