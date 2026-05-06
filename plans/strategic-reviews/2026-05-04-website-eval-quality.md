# Website Eval — Marketing + Blog + Spec Quality Audit

> Date: 2026-05-04 · Branch: `eval/website-quality-2026-05-04`
> Scope: Dimensions 4-5 (sibling agent owns 1-3)
> Method: read-only review of 5 marketing examples + 3 blog examples + 12 published posts + 3 spec generators + 4 Crystal Atoms + 1 spec-bundle exporter
> AISP δ scores from `src/lib/aisp-score/scoreAisp()` (per-atom Σ block; ADR-140 stopgap)

---

## Dim 4A — Marketing site quality

| Site | File | Sections | Real prose? | Specific numbers? | Voice cohesion | Score |
|------|------|----------|-------------|-------------------|----------------|-------|
| GreenLane | `src/data/examples/greenlane-startup.json` | menu/hero/text(problem)/columns(steps)/pricing/team/action/footer | YES | "17 frameworks", "40 hrs/wk", "$299/$999", "80+ startups", "SOC 2 Type II" | "Marcus" voice — direct, founder, Don-Miller framing intact (`:99`, `:130`) | **9.5** |
| Quattro Studio | `src/data/examples/quattro-studio.json` | menu/hero/text(positioning)/case-study/gallery/team/contact-form/footer | YES (long-form) | "6-8 engagements/yr", "8-14 wks", "$80k+", 3 case studies w/ 3.2x step-up + 64% ACV + 41% pipeline (`:107-125`) | "Polished, restrained, confident" voice ATTRS — copy matches; Canela serif heading on warm-paper palette is on-brand (`:38`) | **9.6** |
| AISP for Executives | `src/data/examples/aisp-executive.json` | menu/hero/columns(value-props)/(more) | YES | "55%", "<2%", "200-800 engineers", "$0.0002", concrete ROI bullets | Executive register intact ("trustworthy/executive/specific" — `:16`); CFO/CTO targeting clean | **9.0** |
| Linewise (saas-founder) | `src/data/examples/saas-founder/index.ts` | menu/hero/columns/numbers/text(story)/pricing/quotes/action/footer | YES | "1,200+ teams", "4.2x revenue lift", "<5 min", "$49/$149" | Maya Okafor founder voice; pricing copy "respects the runway" reads founder-led not generic SaaS (`:136`) | **9.2** |
| Mrs. Albright Tutoring | `src/data/examples/mrs-albright-tutoring.json` | menu/hero/text(who)/text(approach long-form)/contact-form/footer | YES | "32 years", "Roosevelt High", "1988", grade dropdown 9-12, real differentiated bio (`:79`, `:111`) | Warm/encouraging/plain-spoken voice cohesion 10/10; Lora serif + warm-paper palette on-brand for retired teacher | **9.5** |

**Verdict: 9.4/10 average.** Every sampled marketing site carries founder-voice prose with specific numbers, real names, real orgs (Pentagram, Frog, Big Four, Roosevelt High, Stripe). Zero Lorem detected. Templates differ by purpose+audience+tone+voiceAttributes (e.g. saas-founder/`:30` `['direct','founder-led','plainspoken']` vs Quattro/`:16` `['polished','restrained','confident']`); palettes/typography track. No two sites read the same.

---

## Dim 4B — Blog quality

| Site | File | Article shape | Length | Voice | Score |
|------|------|---------------|--------|-------|-------|
| The Pour Lab (long-form import) | `src/data/examples/coffee-essay.json` | hero/article(5 subheads, ~500 words/section)/pull-quote/testimonials/CTA/footer | LONG (≥3000 words; `:77-93`) | First-person, specific (Hario V60, 94°C, 60g/L SCA ratio) | **9.7** |
| The Daily Scoop (chat-built) | `src/data/examples/fun-blog.json` | menu/hero/text(intro)/(more) | Medium — Playful intro `:136` "honest food reviews, easy weeknight recipes, kitchen disaster story" | Generic playful blogger; `voiceAttributes` field absent (`:13`) | **7.0** |
| Stories from the kitchen (template) | `src/data/examples/blog-standard.json` | hero/(template baseline) | Short — single hero subtitle `:101` "weigh their flour and trust their hands" | "Warm, conversational, honest" `:13`; one-paragraph framing | **7.5** |

### Listen-built vs chat-built

The published `mrs-albright-tutoring.json` (P5-PROJECTS persona-driven listen-mode build) reads MORE specific than chat-built `fun-blog.json`: it carries 32-year career detail, specific school name, Lora typography choice matched to retired-teacher persona. Listen mode pulled real biography from voice transcript. Chat-built fun-blog reads generic-blogger ("honest food reviews"). The listen-built artifact is BETTER, not worse — counter-intuitive but the dataset supports it.

### 12 published blog posts (`src/pages/blog/posts/`)

Length: 49-76 lines each (678 total — `wc -l`); avg ~57 lines = real essay length, not stub. Sample reads (`aisp-made-visible.md`, `lovable-vs-hey-bradley.md`, `six-sprints-two-days.md`):
- Specific frame ("55% problem", "wave-gate pattern", "1M-token Opus context")
- Specific dates (`2026-04-27 Lovable shipped`)
- Comparison tables, blockquotes, real ADR cross-refs (ADR-078 `lovable-vs-hey-bradley.md:40`)
- Founder voice throughout — "We" not "they"; opinionated; quotable

**Blog post score: 9.0/10.** Twelve posts, all real prose, all specific, all comparative or technical-narrative. ADR-097 floor (12 posts) met materially, not just numerically.

---

## Dim 5 — Spec quality

### 5A — Human spec quality

`src/lib/specGenerators/northStarGenerator.ts:20-80` `generateNorthStar(config)` and `saddGenerator.ts:12-45` `generateSADD(config)` are pure transforms over `MasterConfig`. Read like founder-authored vision docs:
- North Star: "What we're building" / "Why it matters" / "What success looks like" / "Out of scope" / "Roadmap" — `:60-80`
- SADD: tech stack + component arch + design tokens + data model — `:31-32` "everything an engineering team needs to implement the site from specification"
- 5 sibling generators: humanSpec/aispSpec/buildPlan/features (per `src/lib/specGenerators/index.ts`)

Sample human-readable output `connections/docs/00-understanding.md` is 100+ lines of executive summary + ground-truth inventory + ADR cross-refs that a non-coder could follow.

**Score 8.5/10.** A human can understand the project in 5 minutes without reading code. -1 for placeholder fallbacks ("_(No tagline... fill these in via the chat...)_" — `northStarGenerator.ts:73`); -0.5 for SADD requiring reader to know what "Σ"/"Γ"/"Λ"/"Ε" mean if AISP block is included inline.

### 5B — AISP spec quality (reproduction)

Σ/Γ/Λ/Ε structure complete on every atom inspected:
- INTENT_ATOM `intentAtom.ts:17-45` — Verb/Target/params with R1-R4 enumerated; 18-type Σ enum verbatim
- DDD_ATOM `dddAtom.ts:15-30` — contexts/relationships with Γ R1-R4 (|contexts|≤8; 4 relationship kinds)
- AGENT_ATOM `agentAtom.ts:49-64` — agents with disjoint ownedFiles invariant Ε V1
- PROCESS_ATOM `processAtom.ts:42-48` — 5/4/7 fan-out caps explicit
- skill-spec-init `connections/docs/specs/aisp/skill-spec-init.aisp` — 33-line crystal atom with Errors enum (EDescTooShort/EDescTooLong/EMcpUnavailable/ETierBelowTarget) + Ε V5 BYOK redaction guard

**δ Density measurements (via inlined `scoreAisp()` per ADR-140):**

| Atom | δ | Tier | Ambig | parse_total |
|------|---|------|-------|-------------|
| INTENT_ATOM | 0.262 | Bronze | 0.01 | 29 |
| DDD_ATOM | 0.195 | Reject | 0.01 | 16 |
| AGENT_ATOM | 0.213 | Bronze | 0.01 | 16 |
| PROCESS_ATOM | 0.266 | Bronze | 0.01 | 7 |
| skill-spec-init | 0.276 | Bronze | 0.01 | 33 |
| rust-build-crystal-atom | 0.333 | Bronze | 0.01 | 27 |

Honest finding: Ambig is excellent (≤0.01 across all atoms — zero TBD/TODO/FIXME tokens), but δ density falls in Bronze tier (0.20-0.33), NOT Platinum/Gold the project narrative claims. ADR-140 D1 names this — `Ambig` here is fuzzy-marker count not parse-tree shape; `δ` regex covers ~40-symbol subset of full Σ_512. **The atoms are concrete and reproducible — but "Platinum-tier" framing in marketing copy does not match the heuristic-as-shipped today.** Canonical scorer pending ADR-C07 Wave 4 WASM crate.

Could another developer/AI reproduce from these atoms? **MOSTLY YES.** Σ schema enums are concrete (no TBD); Γ rules numbered and testable; Λ logistics name fallback paths; Ε validation explicit. The atom + its TS reflection (`ALLOWED_TARGET_TYPES = [...]`) are sufficient.

**Score 8.0/10.** -2 for δ-tier honesty gap; -0 for completeness.

### 5C — Agentic process quality

PROCESS_ATOM (`processAtom.ts:42-48`) emits Phase/Sprint/Wave/AgentScope; AGENT_ATOM (`agentAtom.ts:31-39`) inflates each AgentScope into AgentSpec with `ownedFiles[]` + `dod[]` + `inputs[]` + `outputs[]`. Disjoint-ownedFiles invariant codified:
- AGENT_ATOM Γ R3 + Ε V1 enforce per-wave disjoint ownedFiles (`agentAtom.ts:55,60`)
- Wave-gated dispatch documented in PROCESS_ATOM Λ ("parallel waves ⟺ wave.parallel; sprint gate requires DoD" — `:46`)
- `ROLE_RECIPES` table (`agentAtom.ts:76-107`) provides 5 deterministic role kinds (schema-design/test-coverage/ui-component/closer-tests/closer-docs) with DoD checklists pre-populated

Bundle exporter `exportClaudeCode.ts` emits ≥10 logical files post-P110/ADR-138, with DDD+ADR leading the bundle (`:89-138` `buildClaudeMd` preamble: Bounded contexts → Cited ADRs → AISP atoms → Implementation plan → Methodology). The 7-step methodology is named line `:135-136`.

Could another AI execute the spec without supervision? **YES with caveats.** AGENT_ATOM emits role/scope/inputs/outputs/dod — sufficient for an autonomous swarm to pick up. CAVEAT: `ROLE_RECIPES` covers 5 roles; novel projects requiring (say) infra-engineer / data-scientist / doc-writer fall to `FALLBACK_RECIPE` (`agentAtom.ts:109-114`) which is intentionally generic.

**Score 8.5/10.** Process is reproducible at the wave-gate level; Σ contract + ROLE_RECIPES + bundle-emit-order all ship; AgentProxy live-LLM dispatch remains inert (CF#4 owner-required) — paper trail is complete but live dispatch is stub.

---

## Composite spec quality verdict

| Tier | Reproducible? | Evidence |
|------|--------------|----------|
| **Human reader** | YES | northStar + SADD + humanSpec read like real founder/PM docs |
| **AI agent (Claude / Cursor)** | YES (mostly) | bundle export ships ≥10 files; AISP Σ blocks complete; DDD+ADR lead the preamble |
| **Autonomous swarm** | YES with role-recipe gap | wave-gate pattern + disjoint ownedFiles + DoD per agent codified; 5 hard-coded role recipes; novel roles fall to FALLBACK |

**Composite spec quality = 8.3/10.** Above SOTA (Lovable produces no spec; v0 produces only code). Below internal narrative ("Platinum tier") because ADR-140-stopgap δ scoring lands Bronze on real atoms.

---

## Honest gaps named

1. **AISP δ tier framing overstates reality.** Real atoms score Bronze (δ 0.20-0.33) on ADR-140 stopgap heuristic. CLAUDE.md and marketing copy reference "Platinum δ ≥ 0.75" implying produced atoms hit Platinum; they do not (yet). Either upgrade scoring (await ADR-C07 Wave 4) or qualify the claim.

2. **Chat-built blog is weaker than listen-built.** `fun-blog.json` reads generic ("honest food reviews", `:136`) vs `mrs-albright-tutoring.json` which carries 32-year career arc + specific Roosevelt High biography pulled from listen transcript. INTENT_ATOM voice-attribute extraction works better on speech than chat.

3. **5 fixed role recipes constrain agentic reproduction.** `agentAtom.ts:76-107` covers schema-design + test-coverage + ui-component + closer-tests + closer-docs only. `FALLBACK_RECIPE` (`:109`) is generic ("acceptance criteria met / tests added"). An autonomous swarm given a project that needs infra-engineer or data-scientist roles falls to a noisy DoD.

4. **AgentProxy live-LLM path inert at v2.0.0-RC1.** Per CF#4 owner-required, all 8 atoms ship `buildXAtom()`/`parseXResponse()` paths but no LLM smoke test (`connections/docs/00-understanding.md:48`). Spec quality is currently a deterministic baseline; live-LLM enrichment unverified.

5. **`fun-blog.json` and `blog-standard.json` lack `voiceAttributes`.** `:13` shows only `tone: 'casual'`. North Star generator (`northStarGenerator.ts:69`) prints "_(No tagline or description set yet — fill these in via the chat...)_" placeholder text when fields are absent. The placeholder ships in spec output for these examples — minor honesty gap visible to anyone exporting these specs.

---

## Citations

- Marketing samples: `src/data/examples/{greenlane-startup,quattro-studio,aisp-executive,saas-founder/index,mrs-albright-tutoring}.{json,ts}`
- Blog samples: `src/data/examples/{coffee-essay,fun-blog,blog-standard}.json` + `src/pages/blog/posts/*.md` (12 files)
- Spec generators: `src/lib/specGenerators/{northStarGenerator,saddGenerator,humanSpecGenerator}.ts`
- AISP atoms: `src/contexts/intelligence/aisp/{intentAtom,dddAtom,agentAtom,processAtom}.ts`
- AISP samples: `connections/docs/specs/aisp/{skill-spec-init,rust-build-crystal-atom}.aisp`
- Bundle exporter: `src/contexts/specification/exportClaudeCode.ts:89-138,200-238`
- Scorer: `src/lib/aisp-score/{index,symbolTable}.ts` (ADR-140 stopgap)
