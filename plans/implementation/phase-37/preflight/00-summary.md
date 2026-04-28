# Phase 37 — Preflight 00 Summary

> **Phase title:** Sprint F P2 — Command Triggers + LLM-Call Audit + Content-Route Research
> **Status:** PREFLIGHT (research-first phase per owner mandate at P36 seal)
> **Successor of:** P36 (Listen + AISP Unification)

## North Star

> **Audit every user-input path + every LLM call. Produce a single canonical document.** Investigate command triggers (e.g., user types `hero` → skip the LLM intent-classifier and route directly to a hero-section LLM call). Evaluate content-route alternatives — current bottleneck: content updates via LLM are slow vs JSON design patches; need separate code paths.

## Mandate (verbatim from owner)

> "add to a phase the review of all user inputs and the logic flow - this will include a full document outlining every llm call and template to use - a known bottle neck is for any content creation - we may need to evaluate alternatives as updating content via llm takes too long compared to a fast json update for the design work. We will need to investigate options such as a separate option or command that triggers the content route (eg llm call using content existing plus user content related guidelines - or a separate tab or toggle for the content - for example if a user wants an article page - then the design is one fast process and a second llm call for the content building). This will take some research on best practices and evaluation of different options"

## Scope IN — Research deliverables

### A1 — Full LLM-call audit
- Map every existing LLM call site: chatPipeline (PATCH_ATOM), llmClassifyIntent (INTENT_ATOM), templateSelector (SELECTION_ATOM), generateContent (CONTENT_ATOM stub), assumptionsLLM (ASSUMPTIONS_ATOM)
- For each: prompt template, expected input/output Σ, cost-cap reserve, fallback path, latency baseline
- Surface: `docs/llm-call-audit.md` (single canonical doc)

### A2 — Command triggers proposal
- Catalog of fast-path triggers (no INTENT_ATOM call):
  - `/hero` — direct hero-section update flow
  - `/blog` — direct blog-section flow
  - `/footer` — direct footer flow
  - `/theme` — direct theme update
  - `/content` — switch to content route (see A3)
  - `/design` — design-only route (current default)
- ADR-066 candidate: `Command Trigger Protocol — Fast-path Routing`

### A3 — Content vs Design route split
- Current: ONE pipeline; CONTENT_ATOM stub + JSON-Patch share the same path. Slow on content because content generation is open-ended.
- Proposed alternatives (compare):
  - **Option A** — Separate `/content` slash command + dedicated content-only LLM call (existing JSON + user content guidelines as system prompt)
  - **Option B** — UI toggle in left-panel: Design / Content radio; switches active pipeline
  - **Option C** — Article-page mode: design pipeline runs first (fast), then content pipeline runs second (LLM-paid, separate progress UI)
  - **Option D** — Streaming content generation: same call, but stream output to UI so user sees progress
- Decision matrix: latency / cost / UX / implementation complexity

### A4 — Research artifacts
- Best-practice survey: how do other AI website builders (Wix ADI / Framer AI / Webflow AI) split design vs content?
- Capstone-defense angle: AISP gives us a structural advantage — Σ-restriction means content prompts can be tightly bounded

## Scope OUT (P38+)

- IMPLEMENTATION of any chosen content-route option (deferred; this phase is research)
- Multi-agent coordination across content + design routes
- Content-quality measurement + A/B testing harness

## Files (planned)

| File | Type | Purpose |
|---|---|---|
| `docs/llm-call-audit.md` | NEW | Full audit doc (A1) |
| `docs/command-triggers-proposal.md` | NEW | Fast-path catalog (A2) |
| `docs/content-route-evaluation.md` | NEW | A/B/C/D comparison + recommendation (A3) |
| `docs/adr/ADR-066-command-trigger-protocol.md` | NEW | Decision (formal) |
| `docs/adr/ADR-067-content-route-architecture.md` | NEW | Decision (formal) |
| `tests/p37-llm-call-audit.spec.ts` | NEW | Source-level audit-doc completeness check |

## DoD

- [ ] LLM-call audit doc covers all 5 atoms + every adapter call site
- [ ] Command-triggers proposal lists ≥6 fast-path triggers with prompt-skip rationale
- [ ] Content-route evaluation compares ≥4 options w/ recommendation
- [ ] ADR-066 (command triggers) full Accepted
- [ ] ADR-067 (content route) full Accepted
- [ ] +5 PURE-UNIT tests
- [ ] Build green
- [ ] Seal artifacts + P38 preflight

## Composite target: 96+ (research phase; net-new value lands at P38 implementation)

## Carryforward into P37 — must-clear items from P36 review

**Hard-blocking (P36 R2 S3):**
- **ListenTab.tsx ~875 LOC** vs CLAUDE.md 500-LOC hard cap. C04-style split required: extract review/clarification handlers + state into a custom hook (e.g. `useListenPipeline`) so ListenTab is back below 500 LOC.

**Soft (queued):**
- R1 L3 — clarification fallthrough silent when LLM returns 0 assumptions (add user-facing message)
- R2 S1 — pendingChatPrefill envelope hardening (scope/length validation)
- R2 S2 — redaction at listen-write boundary (BYOK leak guard symmetry with assumptionStore)
- R2 S4 — pendingChatPrefill global vs directed-message anti-pattern (refactor)
- R2 S5 — ADR-065 "every AISP surface" claim re: P35 EXPERT trace pane (scope refinement)

**Other carryforward:**
- 31/35 → push 33/35 prompt coverage
- Vercel deploy still owner-triggered
- Live BYOK 4-provider validation deferred from P35

## Cross-references

- ADR-053 (INTENT_ATOM) — current intent classifier
- ADR-057 (SELECTION_ATOM) — template selection
- ADR-060 (CONTENT_ATOM) — content generation stub
- ADR-064 (ASSUMPTIONS_ATOM) — clarification
- ADR-065 (Listen + AISP) — voice+text unified pipeline
- `phase-18/roadmap-sprints-a-to-h.md` Sprint F (compressed 4→3 phases)

P37 activates on owner greenlight.
