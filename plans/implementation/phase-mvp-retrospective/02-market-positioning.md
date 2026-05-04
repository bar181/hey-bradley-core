# Hey Bradley — Market Positioning + Landscape

> Date: 2026-05-04 · Phase: MVP-RETRO
> Sources: `plans/strategic-reviews/2026-05-04-design-dev-bridge-positioning.md`, `src/pages/Welcome.tsx`, `docs/launch/show-hn-post.md`, `docs/launch/release-notes-v2.0.0-rc1.md`, `connections/README.md`

## Executive summary

Hey Bradley is a **spec workbench** — the bridge between the design stage (idea) and the dev stage (execution). The market gap it occupies is the absence of a shared artifact between people-with-ideas and tools-that-write-code; today that handoff is lossy, manual, and re-explained every session. The Welcome.tsx hero states this verbatim: "Messy ideas → enterprise specs, instantly." The primary go-to-market audience is L3-L5 developers using Cursor / Claude Code / Continue who pay the daily cost of context loss; the broader long-tail audience is design-stage founders, designers, and PMs who currently have no way to produce a structured handoff. One product, two stages, the spec is the shared artifact.

## 1. The actual value (where it lives)

### 1.1 The "messy ideas → enterprise specs" thesis

The Welcome.tsx hero (line 42) reads verbatim: **"Messy ideas → enterprise specs, instantly."** The subhead (lines 44-48) extends it: *"Hey Bradley turns the conversation you're already having — about what you're building, why, and how — into a formal spec your AI coding tool can execute without guessing."* The pitch is not "build websites faster" — it is "produce the spec that prevents the 55% silently-wrong AI coding output cited in the Show HN post." The value is not the rendered preview; the value is the AISP Crystal Atom output and the markdown spec bundle (per ADR-122) that downstream tooling consumes.

### 1.2 The bridge between design stage and dev stage

The strategic frame (per `2026-05-04-design-dev-bridge-positioning.md` §"The product, articulated cleanly") names what the product is: *"Hey Bradley is the bridge between the design stage and the dev stage. The two stages currently have no shared artifact. Hey Bradley makes the spec the shared artifact — produced in the design stage, consumed in the dev stage."* The diagram in the same doc shows today's broken handoff (whiteboard + Figma + scattered notes → lossy → Claude Code / Cursor) versus the bridged handoff (Hey Bradley spec `.aisp + CLAUDE.md` as the shared artifact between the two stages). The spec is the deliverable; the spec is the moat.

### 1.3 What competitors don't do

Three adjacent tool families exist; none of them occupy the bridge:

- **Chat-to-website builders** (Lovable, Framer AI, v0.dev) render UI from prompts. They are excellent at landing pages. They do not produce a structured spec; the rendered output IS the artifact, and that artifact does not survive a handoff to a different AI tool or a human reviewer.
- **IDE assistants** (Cursor, Continue, Aider) execute against context the user supplies. They do not help build the spec; they assume one exists in the user's head, and they reset that context every session.
- **Spec / RFC tools** (Notion templates, Linear specs, Confluence docs) are static. They do not auto-generate from an idea, they do not auto-export to AI tooling, and they have no symbolic representation an LLM can consume natively.

Hey Bradley occupies the GAP — the bridge nobody builds because both sides assume it exists. The chat-to-website tools assume the spec is implicit in the prompt; the IDE assistants assume the spec is in the user's head; the spec / RFC tools assume the spec gets written manually. Hey Bradley makes the spec the first-class output and the bridge artifact.

## 2. Target users

### 2.1 Group 1 — Design Stage (idea → spec)

Founders, designers, product owners. They have the idea but cannot produce the spec. Pain: *"I have the idea but I can't tell engineering what it actually is."* Value: see the idea visualized + hand over a structured spec.

Surfaces that serve them (per bridge doc §"Group 1"):

- **Listen mode** — voice transcription with cleanTranscript pipeline (per ADR-127); push-to-talk, Web Speech API.
- **Whiteboard / Builder mode** — visual iteration, "make it green", direct manipulation. Byte-equivalent to v1.0.0-RC1 per release notes.
- **Chat mode + Planning mode** — process map, north-star derivation, DDD domain model toggle.
- **Don Miller framing** in marketing copy — Welcome.tsx article §"The 55% problem" is the current articulation.

They produce the spec. They do not need to understand AISP. They never see the math-first 512-symbol notation directly.

### 2.2 Group 2 — Dev Stage (spec → execution)

L2-L9 developers. They receive the spec (or generate their own) and use it to coordinate AI tooling. Audience tier map per bridge doc §"Group 2 — audience tier map":

- **L2-L3** — Plugin + NPX surfaces. Take the spec, hand to Claude Code, ship. Surface = `connections/plugin/` + `connections/npx/`. Need = trivially-close-to-where-they-already-work entry point.
- **L3-L5 PRIMARY MARKET** — Cursor power users. Pain = "stop re-explaining my project every session." Surface = web app at heybradley.app + (post-MVP) Agentic IDE v0 with persistent context + session scope.
- **L5-L7** — AISP, wave-gate coordination, drift detection. Surface = web app + Agentics mode. Need = spec drift detection, swarm dispatch, wave-gate enforcement.
- **L8-L9** — Build the tools. Credibility partners; AISP RFC participants. Surface = the AISP open spec at `github.com/bar181/aisp-open-core`.

The AISP output is most valuable at L4-L6. The human-readable spec is sufficient at L2-L3.

### 2.3 Why L3-L5 is the primary market

Four reasons converge on the L3-L5 cohort as the primary go-to-market focus:

1. **Volume.** Cursor users are in the millions (industry estimate; precise number not knowable from outside). Claude Code adoption is growing fast. The L3-L5 cohort within those tools is the modal user — people shipping non-trivial code, not just demos.
2. **Willingness to pay.** L3-L5 developers already pay for AI tooling ($20+/month for Cursor, Copilot, Claude). They have established budgets for productivity tools.
3. **Daily pain.** Context loss across sessions is a recurring friction; the bridge doc names it as "the single biggest daily pain for L3-L5 Cursor users."
4. **Tool gap.** No incumbent tool today solves persistent project context + session scope as a product. CLAUDE.md and `.cursorrules` are manual; the workflow exists but the tooling does not.

Hey Bradley's plugin + NPX + web app combination is calibrated to this audience. Per `connections/README.md`: *"The connection layer is a top-of-funnel discovery surface for the AI coding tool you already use. The web app is THE product."*

## 3. Market sizing (honest estimate)

> All figures are order-of-magnitude estimates. Precise numbers are not knowable from outside the incumbent vendors and pre-launch.

### 3.1 TAM (total addressable)

All AI-coding-tool users who care about non-trivial project context. Order of magnitude:

- **Cursor users** — estimated low millions globally as of 2026 (vendor disclosures + GitHub star trajectory).
- **Claude Code users** — growing fast; new product in 2025; user count not publicly disclosed.
- **GitHub Copilot users** — millions; broader and more general than the L3-L5 cohort.
- **Continue / Aider / Codeium / Cline / other** — combined low millions, fragmented.
- **Coding agents in general** — Devin, Cognition, agent-platform users — emerging market, not sized.

TAM order of magnitude: **single-digit millions of developers** who use AI coding tools daily and would benefit from persistent project context. This is honest — the precise number depends on how strictly one defines "non-trivial project context" and "daily use."

### 3.2 SAM (serviceable addressable)

L3-L5 developers shipping non-trivial projects. Estimation paths:

- **Cursor power-user cohort** — likely 10-30% of total Cursor users; estimate **low hundreds of thousands**.
- **GitHub contributors with sustained activity** — proxy via active OSS contributors (per GitHub Octoverse). The "professional developer shipping multi-week projects with AI tooling" segment is a subset; estimate **hundreds of thousands globally**.

SAM order of magnitude: **hundreds of thousands of developers**. This is the cohort where Hey Bradley's bridge framing is most legible and most valuable.

### 3.3 SOM (serviceable obtainable for v1)

Realistic capture for the open-core MVP launch:

- **Month 1** — 100-500 users via Show HN + Product Hunt + Agentics Foundation beta share + organic AISP-curiosity traffic. Plausible based on similar open-core tools at launch.
- **Month 6** — 1,000-5,000 users if signal converges (per bridge doc §"Post-launch sequencing — DO NOT pre-build"); fewer if signal is silent (marketing problem, not product problem).
- **Year 1** — uncertain. Range: 1,000 (signal-silent) to 25,000 (signal-strong + Agentic IDE v0 ships in response to confirmed L3-L5 pain).

Honest about uncertainty. The launch is the experiment. The 17 owner-required tasks in `docs/launch/owner-launch-checklist.md` are the input; the L3-L5 signal is the output. The SOM is the hypothesis, not the forecast.

### 3.4 Adjacent markets (not v1)

Two adjacent markets exist but are not the v1 focus:

- **Design Stage exclusive users** (founders / PMs without dev background). Eventually larger TAM (every founder, every PM globally) but harder to monetize directly — they convert via the design stage but the value crystallizes when they hand the spec to a developer. The dev side is where willingness to pay is established.
- **Enterprise teams using AI tooling**. Needs Tier-2 commercial features (multi-tenant auth, sharing, RLS, hosted persistence). Per `release-notes-v2.0.0-rc1.md` §"Known limitations" + ADR-114 / ADR-115, the open-core path is byte-equivalent unchanged; commercial features are a separate repo, separate timeline. Enterprise unlocks only after open-core signal validates the wedge.

## 4. Competitive landscape

### 4.1 Direct competitors (none — by design)

No tool today does idea → spec → AI handoff as a workflow. The closest workflows are:

- **Notion + AI** — spec writers, but they don't auto-generate from idea or auto-export to AI tooling. Static doc, manual handoff.
- **Manual `.cursorrules` / CLAUDE.md authoring** — power users do this by hand. Hey Bradley is the tooling layer they wish existed.
- **None occupy the bridge.** That is the strategic positioning per the design/dev bridge doc — the GAP is real.

### 4.2 Adjacent competitors — chat-to-website builders

**Lovable, v0.dev, Framer AI.** They render UI from prompts; great for landing pages. They cannibalize the design-stage entry but not the dev-stage handoff. Per the Show HN post: *"Hey Bradley is not competing with chat-to-website builders — it is upstream of them. The output is a spec, not a rendered site."* The Welcome.tsx social-proof bar (line 86) names Lovable explicitly as the SOTA reference: composite **86.7/100 vs Lovable 80**. Hey Bradley's persona scores (Grandma 86 / Framer 86 / Lars 88, all at-or-above floor per ADR-132) are aligned with this positioning.

### 4.3 Adjacent competitors — IDE assistants

**Cursor, Aider, Continue, Codeium, Cline, GitHub Copilot.** They execute against context the user supplies. Better than nothing but context resets every session. This is the pain Hey Bradley directly removes for L3-L5 users — per the bridge doc §"Capability 1 — Persistent project context across sessions."

The current IDE assistants are not direct competitors; they are downstream consumers of the spec Hey Bradley produces. The connection layer (`connections/plugin/`, `connections/mcp/`, `connections/npx/`) is explicitly designed to make Hey Bradley a discovery surface FROM where they already work — not a replacement.

### 4.4 Adjacent competitors — manual spec authoring (CLAUDE.md / .cursorrules / system prompts)

The workflow Hey Bradley automates and visualizes already exists — power users hand-author CLAUDE.md / `.cursorrules` / system-prompt context blocks today. Hey Bradley is not creating a new behavior; it is the tooling layer for a behavior that already has product-market fit at the manual-effort tier. The bet: enough developers will pay (or use the open-core) to skip the manual authoring step and let the workbench handle it.

## 5. Differentiators

### 5.1 AISP Crystal Atoms

Formal mathematical spec; not arbitrary prose. 512-symbol math-first protocol designed for AI not humans. Per the AISP open spec (`github.com/bar181/aisp-open-core`), the goal is near-zero ambiguity — production hard-gate at Ambig < 0.02. Differentiator for the L5-L7 audience; underlying primitive that powers everything else. 8 atoms shipped at v2.0.0-RC1: PATCH, INTENT, SELECTION, CONTENT, ASSUMPTIONS, DECOMP, PROCESS, DDD, AGENT (per release notes §"8 Crystal Atoms").

### 5.2 The 3-mode product (Whiteboard / Planning / Agentics)

Per ADR-116. Same product surface adapts to three workflow stages: Whiteboard for visual iteration (design stage entry), Planning for phase + sprint decomposition (bridge surface), Agentics for multi-agent coordination with full AISP exposure (dev stage power-user surface). One product, three modes, route-derived layout — single source of truth is the URL, not the store.

### 5.3 The bridge artifact (markdown spec bundle per ADR-122)

The hand-off between design and dev stage. Single `.md` with `# === FILE: <path> ===` markers; six-plus logical files including CLAUDE.md preamble, process map, human spec, AISP spec, ADRs, agent wave scopes, TDD test spec. Claude Code / Cursor / any AI tool reads it. No JSZip, no archiver, no File System Access API — pure markdown, readable, git-versionable, LLM-ingestible, zero-dep. Per release notes: *"Bundle IS the canonical Hey Bradley OUTPUT. Spec freedom + implementation autonomy."*

### 5.4 Open-core + BYOK

Anti-lock-in. Trust boundary at every Σ block per ADR-043 — keys never cross to logs, never cross to Supabase (per ADR-114 D3), never persist beyond the session unless the user explicitly stores them. MIT-licensed open-core; commercial Tier-2 path documented but optional. The build runs without an account, without a server, without Hey Bradley's infrastructure. Per Welcome.tsx §"Open core vs commercial" — the open core is the entire current shipping artifact.

## 6. Pricing + business model (honest open questions)

### 6.1 Open core (free forever)

v2.0.0-RC1 ships open-core. sql.js + IndexedDB persistence; BYOK across Claude / Gemini / OpenRouter; everything works without a Hey Bradley account. The connection layer is similarly open: plugin, MCP server, NPX CLI all MIT-licensed. Per the release notes §"Known limitations," the open-core path is byte-equivalent unchanged — no commercial gates, no feature paywalls, no telemetry-required. This is the wedge.

### 6.2 Tier-2 commercial (signal-driven)

Listed in `release-notes-v2.0.0-rc1.md` §"Known limitations":

- Supabase auth, hosted share URLs, multi-tenant teams (ADR-114 / ADR-115)
- AI-powered review (KISS reviewer beyond rule-based)
- HNSW vector-DB activation (ruvector currently 0 indexed vectors; manually-curated static snapshot)
- Real-time observability dashboard, cross-session analytics, ML anomaly detection
- Tier-2 SaaS-dashboard flagship
- Native mobile apps
- Live-LLM evaluation harness

Per the bridge doc §"Hard rule — no pre-emptive Agentic IDE work" — DO NOT build until L3-L5 user signal validates demand. Three signals to watch: volume signal (L3-L5 dominant), pain signal (context loss top friction), conversion signal (Plugin → web app → Claude Code loop completes).

### 6.3 Pricing hypothesis (untested)

Order-of-magnitude only; no conversion data:

- **Free** — open-core; BYOK; sql.js + IndexedDB; no account
- **$9-29/month individual** — hosted share URLs, Supabase persistence, cross-device sync, team-of-one features
- **$49-99/month team** — multi-tenant, RLS-enforced sharing, team review surfaces, AI-powered KISS review
- **Enterprise** — custom; SSO, audit logs, on-prem option, SLA

These are anchors for hypothesis testing, not commitments. Await actual conversion data from the Month 1-6 cohort before pricing commitments harden.

## 7. Go-to-market signals to watch

Three signals named in the bridge doc §"Post-launch sequencing":

1. **Volume signal** — Are L3-L5 Cursor / Claude Code users the dominant cohort hitting `/spec-init` and `/spec-export` (the plugin commands)? If yes → primary market hypothesis confirmed.
2. **Pain signal** — Is "I can't keep my project context across sessions" the most-cited friction in user feedback? If yes → Agentic IDE v0 (the 2-capability sprint: persistent context + session scope) is the next product investment.
3. **Conversion signal** — Are L3-L5 users completing the Plugin → heybradley.app → back-to-Claude-Code loop? Or dropping at the handoff? If completing → bridge framing works as designed; if dropping → the handoff is too lossy and needs surface investment.

If all three positive → Agentic IDE v0 sprint (per bridge doc). If mixed → review whether the dev-stage primary market hypothesis is wrong; the design stage may be the load-bearing audience. If silent → marketing problem, not product problem.

## 8. Honest risks

Four risks named explicitly:

- **Risk 1: Cursor builds this themselves.** Cursor adds persistent context + session scope as a built-in feature; their distribution dwarfs Hey Bradley's. Mitigation: the AISP open spec is the moat — even if Cursor builds context tooling, it is unlikely to adopt a third-party math-first symbolic protocol; Hey Bradley becomes the AISP-native option for the L5-L7 cohort that values the protocol.
- **Risk 2: Anthropic builds this into Claude Code natively.** SessionStart hooks, project context, spec-aware execution land as Claude Code features. Mitigation: Hey Bradley's connection layer (per ADR-C03) is built ON the SessionStart hook primitive; the relationship is upstream, not competitive. The spec workbench is the value, not the hook.
- **Risk 3: AISP is too academic for L3-L5.** The math-first 512-symbol notation feels intimidating; users want simpler. Mitigation: Per the bridge doc §"Three-sentence pitch per audience" — L3-L5 sees the human-readable spec, not the AISP notation. The AISP layer is invisible to them; it powers the spec but doesn't surface in the UI unless they opt into Agentics mode.
- **Risk 4: Design-stage users don't pay; dev-stage users have free alternatives.** The classic open-core dilemma. Mitigation: the Tier-2 surfaces (hosted share URL, multi-tenant teams, persistence sync) are calibrated to converted teams, not individual converts; the wedge is open-core, the monetization is collaboration features.

Per the Show HN post line 29: *"The bet is the spec layer. If AISP doesn't survive contact with real third-party adoption, the moat collapses and Hey Bradley becomes another voice-to-code wrapper."*

## 9. Verdict

Yes — there is a market. The bridge between design stage and dev stage is real, the gap is real, and the competitive landscape supports the upstream-not-competing positioning. The L3-L5 Cursor / Claude Code cohort is the right primary market — high volume, established willingness to pay, daily pain, no incumbent solution. The next signal that confirms or kills the thesis is whether the Plugin → web app → Claude Code conversion loop completes for L3-L5 users in Month 1-6 — if yes, build Agentic IDE v0; if no, the design stage may be the load-bearing audience and the marketing emphasis shifts; if silent, the problem is awareness, not product.
