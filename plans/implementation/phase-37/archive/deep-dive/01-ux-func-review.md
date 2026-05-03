# P37 — R1 UX/Func Review (Lean)
> **Score:** 87/100
> **Verdict:** PASS (Grandma 81 / Framer 89)

## Summary
P37 ships a clean, deliberate command gate + route classifier with strong surface parity (chat ↔ voice via the same `parseCommand`). Grandma is rescued by the empty-state hint and the friendly L3 fallthrough copy, but two real UX gaps remain: silent rejection of `/template` (no name) and missing "open the templates" voice phrasing. Framer-grade architectural separation is excellent — pure pre-classifier, ADR-066 well-scoped, KISS held.

## MUST FIX
- **F1: `/template` (no name) is a silent reject.**
  `SLASH_TEMPLATE_RE` requires a non-empty target; bare `/template` falls through `parseCommand`, then likely fails NL parsing too. Grandma types `/template` to discover the syntax and gets nothing back. Fix: detect bare `/template` and return a hint-bearing reply ("Try `/template bakery`. Or use `/browse`.") OR open the picker. `commandTriggers.ts:150,177-181`.

- **F2: `route='content'` short-circuit reply is dev-y / not Grandma-friendly.**
  Per the brief, chatPipeline currently replies "wired up in the next phase" when classifier returns `content`. A real user typing "rewrite the headline" sees a non-answer with no path forward. Fix: copy must be human ("Working on this — for now try a `/template` or describe a specific change like 'change the headline to X'") AND must NOT loop the user into the same dead-end if they retry.

## SHOULD FIX
- **L1: Voice vocabulary too narrow — "open the templates" / "open templates" miss.**
  `VOICE_PHRASES` has `browse templates`, `show me templates`, `show templates` but not `open templates`, `template browser`, `pick a template`. Voice users default to "open" idiomatically. Add 2-3 aliases; the whole-input anchor keeps false-positive risk near zero. `commandTriggers.ts:138-147`.

- **L2: `apply template <name>` voice form lacks "use template <name>" / "load template <name>" coverage.**
  `VOICE_TEMPLATE_RE` accepts `apply|use` but not `load|switch to|try`. Voice users say "load the bakery template". Two regex alternations; trivial. `commandTriggers.ts:152`.

- **L3: L3 fallthrough copy is mostly Grandma-friendly but the slash hint leaks dev syntax.**
  "Hmm — I'm a little unsure about that one. Try a different phrasing or type /browse to pick a template." The `/browse` literal is jarring for non-power users; better: "…or **tap the template button** to pick a starting point." If `/browse` MUST stay (as a discovery hook), wrap it with prose: "or type `/browse` (yes, with the slash) to see templates." `ChatInput.tsx:411-413`.

- **L4: `/design` and `/content` slash → prefill `"design only: "` / `"content only: "` then drop user in chat.**
  Listen surface (`useListenPipeline.ts:217,222`) tabs to chat with a colon-suffix prefill. Grandma sees a half-finished sentence in the input and a focused cursor — easy to miss the trailing space + colon convention. Either commit a clearer scaffold ("Design change: ") or render an inline hint chip "design-only mode active — type your change."

- **L5: 35/35 prompt coverage gate is meaningful for *route classifier* coverage but a minor vanity for *command coverage*.**
  The 6 `command-*` rows + 4 `voice-*` rows duplicate what `parseCommand` unit tests already prove (same regexes, same expected outcomes). The 9-category seed is a UX win for the Examples dialog and golden-envelope cross-provider runs; the command/voice rows are redundant against pure-unit. Keep them but acknowledge: gate is 80% real coverage, 20% accounting.

## Acknowledgments
- **A1:** Empty-state hint mentions `/browse` (per brief) AND first-message hint persists — good Grandma onboarding scaffold; commands are discoverable without docs.
- **A2:** `parseCommand` design tenets (whole-input only, no embedded matches) are exactly right — refusing "hey can you browse templates please" prevents surprise dispatches mid-prose. Documented in the module header.
- **A3:** Listen ↔ Chat hand-off via `pendingChatPrefill` + `setLeftPanelTab('chat')` for command kinds (`useListenPipeline.ts:200-225`) is clean — voice user says "browse templates", lands in chat with `/browse` prefilled. Surface parity preserved from ADR-065.
- **A4:** ListenTab split to 84-LOC orchestrator is exemplary — `useListenPipeline` (404 LOC, owns lifecycle), `useListenDemo` (orb), components for visuals. Hard cap respected; user sees zero behaviour change. PTT button + reply banner + review card all present and wired through `state` / `handlers`.
- **A5:** ListenReviewCard Edit button (`useListenPipeline.ts:258-264`) prefills the chat input with the transcript and tabs over — works exactly as P36 promised. The `pendingMessage` → `pendingChatPrefill` rename is consistent.
- **A6:** `classifyRoute` decision order is well-documented (rules 1-6, first-hit-wins, KISS) and the safe-default rule 6 (fall-through to design) is the right backward-compat call — every P15-P36 demo continues to work unchanged.
- **A7:** ADR-066 is unusually clear — explicit trade-offs (rule-based now / LLM later, ambiguous → ASSUMPTIONS_ATOM at P38, 5 voice phrasings deliberately small), Σ-restriction discipline maintained, cross-refs to ADR-053/057/060/064/065 anchor it in the atom architecture.
- **A8:** R1 F4 fix-pass — `setShowBrowsePicker(false)` on clarification AND `setClarification(null)` on `/browse` (`ChatInput.tsx:387,449-450`) — mutually-exclusive UI state correctly enforced.
- **A9:** R1 F1 fix-pass — `pendingPrefill` subscribed via store selector instead of mount-only effect (`ChatInput.tsx:188-194`) — resilient to ChatInput staying mounted across tab toggles. Right call.
- **A10:** Listen-write redaction symmetry (`redactKeyShapes` at persist boundary, `useListenPipeline.ts:164`) — BYOK leak guard is tight, matches assumptionStore. Security posture maintained.
- **A11:** `approveInFlightRef` double-click guard (`useListenPipeline.ts:245-256`) — standard React state-flip race correctly handled. Same pattern would belong in ChatInput's `/browse` open if rapid-fire taps become an issue.

## Persona scores
- **Grandma: 81** (+2 vs P36 81) — empty-state hint + friendly L3 copy lift discoverability; F1 silent `/template` reject and L3 dev-syntax in fallthrough drag her down ~3pts. Net flat — F1 fix would push 84+.
- **Framer: 89** (+0 vs P36 89) — pre-classifier + route split is textbook architectural separation; ADR-066 is a model ADR. Held flat by F2 dead-end content reply (Framer notices the loop) and the voice phrasing gap (L1).
- **Capstone: 99** (+0) — the bottleneck framing ("user already knows / content vs design latency") is exactly the kind of research-grade observation that scored P35 a 99 on capstone. ADR-066 carries it forward cleanly.

## Score
**87/100** — Solid PASS. F1 (silent `/template` reject) and F2 (content-route dead-end copy) are both <30min fixes and would lift the composite to ~91. L1-L4 are polish for Sprint F P3.
