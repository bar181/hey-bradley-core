# Hey Bradley — 3:15 demo video script (v2.0.0-RC1)

> **Format:** timed shot list (VO / on-screen / browser action / takeaway)
> **Total runtime:** 3:15
> **Owner deliverable:** record per shot list; publish to README + AISP repo + launch threads
> **Recording mode:** AgentProxy active so the demo costs $0 and the latency badge is honest

---

## 0:00–0:15 — Hook: the 55% problem

- **VO:** "Cited research puts LLM coding sessions at roughly 55% silently wrong. The output runs. It compiles. It just isn't what you asked for. Hey Bradley v2.0.0-RC1 fixes that with three modes and a spec layer you can read before any code lands."
- **On-screen:** title card. "55% silently wrong" stat in large type. Cut to Hey Bradley landing page.
- **Browser action:** open `hey-bradley.com`.
- **Takeaway:** the problem is verification, not generation.

## 0:15–0:45 — Whiteboard mode

- **VO:** "Mode one. Whiteboard. Type or speak a prompt. Eight Crystal Atoms classify the utterance before any patch lands. INTENT, ASSUMPTIONS, SELECTION, CONTENT, PATCH — plus DECOMP if you said two things at once. Voice goes through the same spec layer as text. No bypass."
- **On-screen:** main chat. Type "make the hero brighter and add a pricing section". Atom chips animate in order. DECOMP splits the compound. Latency badge shows sub-second response. Open Conversation Log to show ranked template candidates with confidence scores.
- **Browser action:** type compound prompt; observe DECOMP split + atom trace; open Conversation Log tab.
- **Takeaway:** every choice is auditable. Every classification has a confidence score and an alternative.

## 0:45–1:30 — Planning mode (PROCESS + DDD)

- **VO:** "Mode two. Planning. Type a project description. PROCESS_ATOM decomposes it into phases, sprints, waves, agents — rendered as a Process Map. Toggle the view. Same description through DDD_ATOM emits bounded contexts and relationships — rendered as a Domain Model. Two atoms, two views, one chat bar."
- **On-screen:** `/planning`. PlanningChatBar at top of left panel. Type "ship a coffee subscription site with auth, payments, and a customer dashboard". Process Map renders nodes for each phase. Click view-toggle to swap to Domain Model. Bounded contexts appear (Auth / Payment / Dashboard / Core / Infrastructure) with partnership and customer-supplier relationships drawn between them.
- **Browser action:** navigate to `/planning`; type project description; observe Process Map render; toggle to Domain Model; click a context to see detail.
- **Takeaway:** project planning is the same chat bar, two atoms, fan-out to two visualizations.

## 1:30–2:15 — Agentics mode (the spec factory)

- **VO:** "Mode three. Agentics. The spec factory. SpecWorkbench shows three tabs — Human, AISP, ADR. Sprint cards expand to reveal AgentSpec scopes with disjoint owned-files and Definition-of-Done checklists. Run the KISS Review. PASS equals zero P1 blockers. Seal the phase. The Seal Panel renders post-review, session-log, and retrospective as three markdown cards."
- **On-screen:** `/agentics`. SpecWorkbench mounted. Click through Human / AISP / ADR tabs. Click a sprint card — AgentSpec list expands. Click "Run KISS Review" — verdict pill renders (PASS / BLOCK with severity counts). Click "Seal phase" — three EOP cards appear.
- **Browser action:** navigate to `/agentics`; cycle SpecWorkbench tabs; expand sprint card; trigger KISS Review; trigger Seal.
- **Takeaway:** the methodology arc is feature-complete. Spec → bundle → tests → gate → seal-with-receipts.

## 2:15–2:45 — Export Claude Code

- **VO:** "Click Export Claude Code. A single markdown file downloads with file markers. CLAUDE.md preamble, process map, human spec, AISP atoms, ADRs, agent wave scopes — six logical files in one bundle. Drop it into any LLM agent's context. Claude Code, Cursor, your own pipeline. Spec freedom plus implementation autonomy."
- **On-screen:** click Export Claude Code button in SpecWorkbench header. Browser downloads `phase-spec-bundle.md`. Open in editor — show `# === FILE: <path> ===` markers and content sections. Cut to a terminal where awk one-liner splits the bundle into a directory tree.
- **Browser action:** click export; show download tray; open file in editor; demo split-by-marker pattern.
- **Takeaway:** the bundle IS the canonical Hey Bradley OUTPUT. Downstream consumer reads it and writes implementation in their own repo.

## 2:45–3:00 — Adoption: polyglot, stdlib-only

- **VO:** "Third-party adoption ships today. TypeScript parser, Python parser, sample bundle. Standard library only. Zero npm, zero pip. Drop into any project in five minutes."
- **On-screen:** GitHub view of `examples/3rd-party-consumer/`. Show `parse-aisp-typescript.ts`, `parse-aisp-python.py`, `sample-bundle.json`. Cut to `docs/aisp-adoption/` — three-doc tree.
- **Browser action:** open repo; navigate to examples folder; open both parsers; open adoption docs.
- **Takeaway:** adoption is a five-minute integration, not a vendor lock-in.

## 3:00–3:15 — Outro

- **VO:** "Hey Bradley v2.0.0-RC1. Open core. MIT. Three modes. Eight Crystal Atoms. Spec repo at aisp-open-core. Build repo at hey-bradley-core. Try it."
- **On-screen:** end card. `github.com/bar181/hey-bradley-core` + `github.com/bar181/aisp-open-core` + `hey-bradley.com`. Capstone footer: "Bradley Ross · Harvard ALM Digital Media Design · May 2026."
- **Browser action:** static end card.
- **Takeaway:** version, license, links.

---

## Concrete shipped numbers (cite on screen if helpful — as of P109 / FINAL-CLEANUP)

- 237 cumulative regression GREEN / ~1491+ cumulative session GREEN at P109 anchor
- 128 ADRs Accepted on disk (IDs run ADR-001 — ADR-137 with documented gaps)
- 51 EXAMPLE_SITES (17 baseline + 26 OC expansion + 2 E2E + 3 E2E-TEST-2 + 5 5-PROJECTS persona-driven full-pipeline)
- 12 blog posts (ADR-097 floor met at P82)
- 18 section types (ADR-100 widening)
- 21 themes / 15 section arrangements / 15 content styles
- 8 Crystal Atoms — AISP suite COMPLETE (5 baseline INTENT/ASSUMPTIONS/SELECTION/CONTENT/PATCH + DECOMP + PROCESS + DDD + AGENT)
- 3 modes — Whiteboard / Planning / Agentics (ADR-116)
- 109 phases sealed (P11 → P109) + 5-PROJECTS + FINAL-CLEANUP
- Persona scores — Grandma 86 / Framer 86 / Lars 88 (ADR-094 rubric; ADR-132 P102 re-score; 0/3 floor breaches)
- SOTA composite 86.7/100 vs Lovable 80/100 (ADR-133 v2.0.0-RC1 boundary)

## Recording notes

- 1080p minimum; 60fps for the atom-animation moments at 0:30 and 1:50.
- Clean lavalier or USB-C mic. VO recorded separately and mixed against silent screen capture.
- Pre-load the coffee-subscription example state so 1:00–1:30 is fast to follow.
- AgentProxy provider selected so latency badge reflects the open path, not a paid shortcut.
- Re-record gate: if speed / 8-atom suite / 3-mode flow / Claude Code export / adoption isn't visibly demonstrated by 3:00, re-record.
- Publish targets: README hero (muted autoplay), AISP repo README, launch HN/PH posts, capstone defense deck.

## Cross-references

- Moat priorities: `plans/strategic-reviews/open-core-moat-roadmap.md`
- Sprint K speed: ADR-077 (P54)
- Sprint L spec: ADR-078 (P55)
- Sprint N share: ADR-081 (P57)
- ADR-104 page-aware pipeline (P79 / OC-14)
- ADR-108 AISP adoption (P83 / OC-17)
- ADR-116 Three-Mode Product Architecture (P90 / AW-MODE-ARCH)
- ADR-118 PROCESS_ATOM (P92) / ADR-119 DDD_ATOM (P93) / ADR-120 AGENT_ATOM (P94)
- ADR-121 SpecWorkbench (P95) / ADR-122 Export Claude Code (P96)
- ADR-128 TDD Scaffold (P97) / ADR-129 KISS Review (P98) / ADR-130 Seal Panel (P99)
- ADR-131 Agentic Workbench RC (P101)
- AISP spec: `github.com/bar181/aisp-open-core`
