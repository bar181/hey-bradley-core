# Comprehensive Review — Part 3: Gaps vs SOTA + Resolution Roadmap

> **Date:** 2026-05-01 · **Phase:** P74 / OC-DECOMP + Brutal-Honest Review  
> **SOTA baseline:** 61/100 (vs Lovable 51 / Claude Designer 46 / Framer 45)  
> **Companion docs:** A7 features audit + A8 design/UX audit (parallel P74 delivery)  
> **Authority:** Gaps mined from P73 template audit + P60 competitive analysis + CLAUDE.md carry-forward state

---

## §1 Methodology + Sprint Roadmap Reference

**Gap inventory sources:**
1. CLAUDE.md `Carry-forward` section (explicit 11-item debt list, lines 67-82)
2. Template audit findings (`plans/strategic-reviews/2026-05-01-template-audit.md` §4 + §7)
3. Competitive analysis (`tests/p60-competitive-analysis.md` — dimensional scoring vs SOTA)
4. Open-core moat roadmap (`plans/strategic-reviews/open-core-moat-roadmap.md`)
5. Phase-60 post-defense roadmap (`plans/implementation/phase-60/post-seal-roadmap.md` OC-1..OC-6)

**P74-P84 sprint family** (per phase-60 post-seal-roadmap):
- **P74** OC-DECOMP (intent → todo decomposition; headline ask for this phase)
- **P75** OC-7 (Section type closure — course-landing, booking-calendar, newsroom completeness)
- **P76** OC-9 (Spec quality + export polish; improve bundle UX + static HTML fidelity)
- **P77** OC-10 (Performance + a11y; render perf, WCAG baseline audit, latency further tuning)
- **P78** OC-11 (Multi-page MVP; page templates, routing, persistence within open-core bounds)
- **P79** OC-14 (Process pages POC; internal workflow pages for spec generation)
- **P80** OC-15 (Agentic-product templates; 5+ opinionated, strongly vertical-positioned)
- **P81** OC-16 (Prompt library 500+; canonical prompt corpus for agent training + ruvector seeding)
- **P82** OC-CLEANUP (focused polish on debt items from P74-P81)
- **P83** OC-17 (AISP adoption push: 1-2 weeks external community engagement, README, 3rd-party ref impls)
- **P84** OC-18 (Public launch RC final; pre-release final polish, demo video, slide deck)

**Scoring methodology:**  
Each gap scored on **Severity** (P1 launch-blocking / P2 high-leverage / P3 nice-to-have) × **Affected surfaces** × **SOTA reference** (Lovable 51/80, Claude Designer 46/80, Framer 45/80, Linear, Notion leadership features). **Current state** cites file:line from audit. **Resolution plan** maps to OC-X sprint(s). **Confidence** assessed HIGH/MEDIUM/LOW based on sprint dependency chain.

---

## §2 Top 25 Gaps Ranked by Impact × Effort

### Gap 1 — Multi-clause intent decomposition (DECOMP_ATOM)
**Severity:** P1 (launch-blocking)  
**Affected surfaces:** Chat input pipeline, ConversationLogTab, example_prompts execution  
**SOTA reference:** Lovable, Claude Designer, Framer all collapse multi-clause inputs into single blob; no competitor decomposes to ordered todos pre-template-match. HB architecture uniquely enables atomic todo tracing.  
**Current state:** Not shipped; P73 identified as "CRITICAL blocker" (CLAUDE.md:184). Intent classification exists (INTENT_ATOM); decomposition rule engine missing. Sketched in phase-74/preflight but unfenced.  
**Resolution plan:** **P74 OC-DECOMP (A1)** — `src/contexts/intelligence/aisp/decompAtom.ts` delivers deterministic-rules DECOMP_ATOM. Todo[] emitted pre-matcher. ADR-099 ratification gate.  
**Confidence sprint will close it:** HIGH. Scope is bounded; no new section types. Deterministic baseline acceptable (LLM enrichment optional P75+).  
**Carry-over risk:** If P74 slips, chatPipeline full-wire (useChatPipeline hook) blocks through P75. Feature demo impact: multi-clause commands fail silent.

---

### Gap 2 — Web Speech wire-up for MobileListenFullscreen
**Severity:** P2 (high-leverage)  
**Affected surfaces:** Mobile listen mode, PTT mic button, transcript display  
**SOTA reference:** Lovable ships native iOS + Android with cross-device continuity; Claude Designer assumed web-only. HB web Speech is partially wired (P19 baseline); MobileListenFullscreen component lacks full integration.  
**Current state:** Web Speech API initialized in P19; ListenTab wired. MobileListenFullscreen skipped pending full integration. (CLAUDE.md:177, carry-forward)  
**Resolution plan:** **P77 OC-10 (performance + a11y sprint)** — scope this as a fix-pass item; tie to mobile UX polish. OR defer to P82 OC-CLEANUP if P77 overloaded. Does NOT gate defense.  
**Confidence sprint will close it:** MEDIUM. No architectural blocker; small scope. Microphone permission handling + transcript sync in mobile context are the unknowns.  
**Carry-over risk:** If deferred past P82, mobile-first users see incomplete listen story. Mobile score drops further (currently 7/10 vs Lovable 9).

---

### Gap 3 — Bottom-sheet drag refinement
**Severity:** P3 (nice-to-have)  
**Affected surfaces:** Mobile bottom-sheet UX, listen-mode slide-up feel  
**SOTA reference:** Native iOS swipe-to-dismiss is the baseline; HB P69 bottom-sheet is touch-responsive but lacks momentum-driven easing.  
**Current state:** Bottom-sheet implemented P69 per ADR-090. UX audit (phase-60/post-seal-roadmap) flagged as LOW-effort polish. (CLAUDE.md:178)  
**Resolution plan:** **P77 OC-10 or P82 OC-CLEANUP** — bundled in mobile polish pass if time exists. Non-blocking.  
**Confidence sprint will close it:** HIGH. 2-3 hour scope; CSS easing function + momentum detection.  
**Carry-over risk:** None; P1 blocker exists before this ships.

---

### Gap 4 — useChatPipeline hook wiring
**Severity:** P1 (launch-blocking)  
**Affected surfaces:** Chat mode entire pipeline, single-clause and multi-clause paths  
**SOTA reference:** All competitors expose a pipeline abstraction (implicit in Lovable, Framer canvas; explicit in Claude Designer). HB pipeline (P18 baseline + P26-P33 atom layers) exists in code but hook is incomplete from P67d.  
**Current state:** Pipeline components exist scattered across contexts + patch atoms. useChatPipeline hook marked "OPEN — pipeline integration blocker" (CLAUDE.md:180). Sketch at src/contexts/chat/* but not unified.  
**Resolution plan:** **P74 OC-DECOMP (A3 chatPipeline.ts wire)** OR **P75 OC-7 (if P74 slots this secondary)**. Depends on DECOMP_ATOM completion (Gap 1). Must land before template matcher can consume Todo[] stream.  
**Confidence sprint will close it:** MEDIUM. Hard dependency on Gap 1 (DECOMP_ATOM). If DECOMP ships clean, hook is mechanical. If DECOMP needs rework, this slips.  
**Carry-over risk:** If both Gap 1 + Gap 4 slip to P75, OC-7 focus (section type closure) gets deprioritized. Feature demo shows broken multi-clause path.

---

### Gap 5 — OC-TI Wave 2 (matcher UI surface, ranked candidates in chat)
**Severity:** P2 (high-leverage)  
**Affected surfaces:** ChatThread, template-candidate chips, selection UX  
**SOTA reference:** Claude Designer, Lovable both show "here's what I picked" implicitly; HB P72 OC-TI ships ranking (3-layer: theme/section/content) but UI only in EXPERT tab. P55 moat priority #2 (spec unmissable) is GLOBAL surface; matcher candidates would be supplemental UX.  
**Current state:** Template Intelligence matching algorithm ships P72 (21 themes + 15 sections + 15 content styles + exampleQueries on all 51 entries). UI surface deferred. (CLAUDE.md:185)  
**Resolution plan:** **P75 OC-7 (stretch goal if time)** or **P76 OC-9 (consolidated surface polish sprint)**. NOT critical path. Can ship as EXPERT-only for RC.  
**Confidence sprint will close it:** MEDIUM-HIGH if scoped to EXPERT tab only; LOW if require chat-thread visual prominence.  
**Carry-over risk:** If deferred past P76, users don't see "why" HB picked a template. Transparency gap. Low user-facing impact.

---

### Gap 6 — +3 templates to reach 40+ total
**Severity:** P2 (high-leverage)  
**Affected surfaces:** Example library, template picker, on-the-fly demo flows  
**SOTA reference:** Lovable, Framer both advertise 50+ template families; HB sits at 37 (17 baseline + 3 OC-3 + 11 OC-4). Bottom-5 in P73 audit still underperforming even post-fix.  
**Current state:** P73 OC-TPL-AUDIT fixed bottom-5 to ≥7 score; chose quality over quantity (37 unchanged). "+3 to reach literal 40+" is explicit carry-forward as "OC-4 round 3" (CLAUDE.md:188).  
**Resolution plan:** **P80 OC-15 (Agentic-product templates)** — 5+ opinionated, strongly vertical-positioned. Land at least 3 from the 5 to reach 40. Pair with design polish pass.  
**Confidence sprint will close it:** HIGH. P80 is explicitly scoped for "3-5 opinionated templates." Execution risk minimal.  
**Carry-over risk:** If P80 slips, template count stays at 37. Lovable/Framer parity (50+) remains a visual floor gap. Minor demo impact.

---

### Gap 7 — OC-CLEANUP marketing-site mobile (ADR-090 decision 5)
**Severity:** P2 (high-leverage)  
**Affected surfaces:** Public website (About, Open Core, Docs pages), mobile responsiveness, touch targets  
**SOTA reference:** Lovable ships mobile-first since Q2 2026. HB public site is responsive but Typography drift noted; call-to-action button sizes need audit for touch (44px minimum WCAG).  
**Current state:** P70 OC-CLEANUP was docs-only. Marketing-site mobile polish explicitly deferred (CLAUDE.md:181, P70 notes: "Wave 4 legacy surface"). ADR-090 decision 5 flags this.  
**Resolution plan:** **P77 OC-10 (performance + a11y sprint)** carries mobile audit on public site. OR **P82 OC-CLEANUP** (final polish). Not launch-blocking but impacts reviewer first impression.  
**Confidence sprint will close it:** HIGH. Mechanical typography + spacing pass. 1-2 hours effort.  
**Carry-over risk:** Public website remains 6/10 on visual polish if deferred past P84. Low customer impact (internal artifact).

---

### Gap 8 — Build-step RSS generator (replaces static stub)
**Severity:** P3 (nice-to-have)  
**Affected surfaces:** Blog distribution, feed readers, automation  
**SOTA reference:** Most SaaS (Linear, Notion) ship RSS. HB has static stub at `/api/rss` (P71 blog-expansion baseline).  
**Current state:** Static RSS file present; no dynamic generation from blog posts. Flagged as carry-forward "LOW" effort (CLAUDE.md:182).  
**Resolution plan:** **P81 OC-16 (Prompt library 500+)** sprint — if there's margin, pair with build-step tooling. OR **P82 OC-CLEANUP** (final polish). Does NOT gate RC.  
**Confidence sprint will close it:** HIGH. Mechanical feed generation; can reuse rss library.  
**Carry-over risk:** None; blog functionality remains; feed just becomes "live."

---

### Gap 9 — +2 stretch blog posts to reach 12+ total
**Severity:** P3 (nice-to-have)  
**Affected surfaces:** Blog section, content library, demonstrable voice consistency  
**SOTA reference:** Most creator/SaaS sites demonstrate 15+ posts; HB has 10 (4 baseline P58 + 6 expansion P71 per ADR-097).  
**Current state:** Carry-forward as "P71 blog cadence (have 10; need 12)" (CLAUDE.md:183).  
**Resolution plan:** **P82 OC-CLEANUP (final polish)** or concurrent with P81 OC-16 prompt-library work (both are knowledge-capture sprints). Content-first, low-code.  
**Confidence sprint will close it:** HIGH. ~2-4 hours per post authoring.  
**Carry-over risk:** None; existing blog works; two extra posts are pure content.

---

### Gap 10 — Hosted share link (real URL, not in-browser stub)
**Severity:** P1 (launch-blocking for virality; P2 for open-core survival)  
**Affected surfaces:** Share modal, spec-bundle URL, Slack/Twitter sharability, reviewer-impression distribution  
**SOTA reference:** Framer (9/10 sharing) has instant published URLs at `framer.website/*`. Lovable (8/10) hosts on lovable infrastructure. HB ships static HTML + content-addressable in-browser stub (P57 N sprint, ADR-081).  
**Current state:** P57 OC-DECOMP (A2, from competitive-analysis gap #1) identifies this as "the biggest open-core gap." Static HTML export is a workaround; real hosted URL is Tier-2 commercial (per open-core-moat-roadmap.md §43).  
**Resolution plan:** **DEFERRED to Tier-2 commercial** (explicit per phase-60/post-seal-roadmap lines 69, 88-91). Open-core OC-3 sprint (P63/64) polishes bundle UI only; real hosting is server-backed. NOT in P74-P84 open-core roadmap.  
**Confidence sprint will close it:** N/A (deferred). Confidence in open-core polished-surface: HIGH.  
**Carry-over risk:** If hosting doesn't ship post-P84, viral distribution stays muted. P5 competitive dimension (sharing 5/10) remains a weakness. Medium-term revenue risk.

---

### Gap 11 — HNSW vector-DB activation (re-index + auto-write)
**Severity:** P2 (high-leverage for learning flywheel; P3 for MVP)  
**Affected surfaces:** Template matcher, ruvector memory, prompt-library training loop  
**SOTA reference:** Lovable, Claude Designer both have implicit learning (model updates); HB has explicit learning surface (ruvector 126 manual entries at P70 open, zero vectors indexed per CLAUDE.md:85).  
**Current state:** Ruvector is "manually-curated static snapshot, NOT a flywheel" (CLAUDE.md:85). Activation explicitly deferred to commercial Tier-2 learning runtime. (CLAUDE.md:186, phase-60 post-seal-roadmap §78)  
**Resolution plan:** **DEFERRED to Tier-2 commercial** (explicit). Open-core tracks ruvector snapshot. Learning flywheel is post-MVP research work.  
**Confidence sprint will close it:** N/A (deferred by design). Confidence in static ruvector surface: HIGH (P70 backfill complete).  
**Carry-over risk:** Learning is a long-tail moat. If deferred past P85, competitors may ship their own learning layers. Medium-term strategy risk; no immediate RC impact.

---

### Gap 12 — Visual polish floor (generic template copy)
**Severity:** P2 (high-leverage for reviewer impression)  
**Affected surfaces:** Example library, on-first-load hero, kitchen-sink, dev-portfolio, fun-blog  
**SOTA reference:** Framer scores 9/10 (design-tool DNA, showcase carousel is benchmark). HB scores 6/10; premium templates beat the genre but long tail of generic templates drags. P73 audit called this "BIGGEST OPEN-CORE GAP" after shareable URL.  
**Current state:** P73 OC-TPL-AUDIT fixed bottom-5 (blank, kitchen-sink, blog-standard, api-docs-landing, launchpad) from 3-6 to ≥7. Remaining 32 are solid (avg 8). AISP trace default-expand (30-min quick win) mentioned as P73 fix-pass.  
**Resolution plan:** **P74 (quick win)** + **P76 OC-9 (export polish + bundle-UI redesign)** + **P82 OC-CLEANUP (final pass)**. Distributed across 3 sprints.  
**Confidence sprint will close it:** HIGH-MEDIUM. Fixes are typography + spacing + AISP default-expand. No architecture change.  
**Carry-over risk:** If all three sprints slip, visual polish stays at 6/10. Reviewer impression (36/100 estimated) remains moderate. No launch blocker.

---

### Gap 13 — Mobile onboarding (don't show tri-pane on first phone load)
**Severity:** P2 (high-leverage for Grandma persona)  
**Affected surfaces:** Mobile chat-first landing, onboarding card, first-run UX  
**SOTA reference:** Lovable (9/10 ease of use, mobile-first since Q2 2026). HB (7/10) shows tri-pane even on mobile first load. P60 post-seal-roadmap flags this as OC-2 (phase-60/post-seal-roadmap line 74).  
**Current state:** Not shipped. Phase-60 post-seal flags as "1-2 day scope" (line 74). "Mobile typography scale + touch-target audit + listen-mode mobile design pass" are the design slices.  
**Resolution plan:** **P75 OC-7 (stretch)** or **P77 OC-10 (mobile + a11y focus)** — bundled in mobile polish. Pair with bottom-sheet refinement (Gap 3). Design-heavy, 1-2 days.  
**Confidence sprint will close it:** HIGH. Mechanical UI change; onboarding modal for first-run mobile detection.  
**Carry-over risk:** If deferred past P77, mobile ease-of-use score stays at 7/10. Grandma persona (currently 76-82 across P60 sprints) remains moderate. Low demo impact.

---

### Gap 14 — Share bundle polish (attribution footer, spec-bundle UI, export-modal redesign)
**Severity:** P2 (high-leverage for reviewer impression)  
**Affected surfaces:** Share modal, exported static HTML, attribution footer, "Built with Hey Bradley" branding  
**SOTA reference:** Framer (9/10) has polished share UI. HB (5/10) has in-browser stub + static HTML export. No real hosted URL.  
**Current state:** P57 OC-N delivered static HTML export + in-browser content-addressable stub (ADR-080 + ADR-081). P73 audit didn't directly score export UX, but phase-60 post-seal-roadmap (line 75) flags OC-3 (Share Bundle Polish) as "1-2 day" scope.  
**Resolution plan:** **P76 OC-9 (spec quality + export polish)** — this IS the core of P76. Export-modal redesign + "Built with Hey Bradley" footer typography + shared-spec preview card are design slices.  
**Confidence sprint will close it:** HIGH. Design-heavy, self-contained. No architecture change.  
**Carry-over risk:** If P76 slips, export UI remains basic. Sharing dimension stays at 5/10. Moderate demo impact.

---

### Gap 15 — Spec quality (export polish, ambiguity floor)
**Severity:** P1 (launch-blocking; currently HB's biggest advantage)  
**Affected surfaces:** Spec tab, AISP trace, export bundle, JSON output  
**SOTA reference:** HB uniquely scores 10/10 (sub-2% ambiguity, AISP-formatted, atom-classified). Competitors score 2-4 (implicit specs in prose/prompts). This IS the moat.  
**Current state:** Spec quality already 10/10 at P60 (ADR-045 PATCH_ATOM + ADR-053 INTENT_ATOM + ADR-057 SELECTION_ATOM + ADR-060 CONTENT_ATOM + ADR-064 ASSUMPTIONS_ATOM). Carry-forward work is "polish," not "repair."  
**Resolution plan:** **P76 OC-9 (Spec quality + export polish)** — explicit scope. ADR-098 (Template Intelligence) + ADR-099 (DECOMP_ATOM) enrich the spec layer. Export bundle styling + JSON schema validation.  
**Confidence sprint will close it:** HIGH. Spec layer is mature. Polish is low-risk.  
**Carry-over risk:** If P76 slips, spec dimension stays at 10/10 (it's already maxed). No risk to moat.

---

### Gap 16 — Performance baseline + latency measurement (re-verify post-decomp)
**Severity:** P2 (high-leverage for SOTA claim; latency badge already ships P54 ADR-077)  
**Affected surfaces:** Chat pipeline latency, patch-apply latency, observable speed metrics  
**SOTA reference:** HB (9/10 speed perception, latency badge default-on per P54 ADR-077). Lovable (7/10) feels fast but doesn't surface numbers. Claude Designer (6/10) presumably fast; nothing displayed. Framer (6/10) real-time canvas; not labeled.  
**Current state:** Latency badge shipped P54 (ADR-077). DECOMP_ATOM addition in P74 may change pipeline latency. P77 OC-10 (performance + a11y) is explicitly scoped to re-measure.  
**Resolution plan:** **P77 OC-10 (Performance + a11y sprint)** — re-baseline latency post-DECOMP. Add Playwright runtime suite (P54 fix-pass recommendation #2 from system-wide review). Benchmark mode for CI.  
**Confidence sprint will close it:** HIGH. Measurement + tuning are routine. DECOMP addition is low-latency by design (deterministic rules).  
**Carry-over risk:** If latency regresses post-DECOMP, speed perception drops (9/10 → 7/10). Reputational risk for moat claim. Mitigation: P77 catches and fixes.

---

### Gap 17 — Accessibility audit (WCAG baseline)
**Severity:** P2 (high-leverage for enterprise appeal)  
**Affected surfaces:** Color contrast, ARIA labels, keyboard navigation, screen-reader announce, mobile touch targets  
**SOTA reference:** Lovable (9/10 ease of use implies a11y investment). Framer (design-tool DNA, canvas + accessibility = hard). HB baseline not formally audited at P60.  
**Current state:** No formal WCAG audit on record (P13 README deferred this; P14 README flagged it as "nice-to-have"; deferred-features.md line 16 shows "Planned for P13" but not landed). ADR-090 Mobile UX Redesign (P69) touched mobile a11y; P77 scope should include baseline.  
**Resolution plan:** **P77 OC-10 (Performance + a11y sprint)** — explicit scope. WCAG AA baseline audit + remediation for highest-impact gaps (color contrast, ARIA). Not full remediation; starter.  
**Confidence sprint will close it:** MEDIUM. WCAG audit requires tooling (Axe, WAVE). Remediation is design + code. 2-3 day scope.  
**Carry-over risk:** If deferred past P77, a11y score stays unknown. Enterprise buyers (B2B goal) may flag. Moderate long-term risk.

---

### Gap 18 — Multi-page MVP (page templates, routing, persistence)
**Severity:** P2 (high-leverage for use-case breadth)  
**Affected surfaces:** Page builder, page picker, multi-page export, multi-page routing in static HTML, page-level persistence  
**SOTA reference:** Lovable, Framer, Claude Designer all support multi-page. HB has scaffolding (ADR-085 Multi-Page MVP, P61) but full wire incomplete. Phase-60 post-seal-roadmap defers to Tier-2 (line 106).  
**Current state:** Architecture designed (ADR-085, P61). Page routing + multi-page export partially implemented. "Beyond current scope" per open-core-moat-roadmap (line 96). Multi-page support listed as "Deferred to Commercial (Tier-2)" (CLAUDE.md:96).  
**Resolution plan:** **P78 OC-11 (Multi-page MVP)** — explicit OC-11 scope per phase-60 post-seal-roadmap (successor options list). Scope is "page templates, routing, persistence within open-core bounds" (NOT tier-2 hosted). Page-level AISP export + static multi-page bundle.  
**Confidence sprint will close it:** MEDIUM. Architecture exists; implementation is engineering-heavy. 3-5 day effort estimated.  
**Carry-over risk:** If P78 slips, multi-page stays scaffolded. Use-case breadth (portfolio + blog in one site) remains limited. Moderate demo impact.

---

### Gap 19 — Process pages POC (internal workflow pages for spec generation)
**Severity:** P3 (nice-to-have for team feature set)  
**Affected surfaces:** Process documentation, internal team onboarding, spec-generation workflow pages  
**SOTA reference:** Claude Designer, Lovable, Framer all focus on user-facing content; HB uniquely supports "process pages" (internal specs). POC deferred to P79.  
**Current state:** Not shipped; carried forward per phase-60 post-seal-roadmap (line 79). OC-14 scope (process-pages POC).  
**Resolution plan:** **P79 OC-14 (Process pages POC)** — per roadmap. Scope is POC level; full implementation deferred to Tier-2.  
**Confidence sprint will close it:** MEDIUM. New feature category; requires design + UX + export integration. 2-3 day scope for POC.  
**Carry-over risk:** If deferred past P79, process-pages feature doesn't ship until commercial. Low demo impact; team-use-case only.

---

### Gap 20 — Prompt library expansion (500+ entries)
**Severity:** P2 (high-leverage for learning flywheel, agent training)  
**Affected surfaces:** Ruvector training data, agent prompt corpus, example-prompts test coverage, benchmark suite  
**SOTA reference:** Lovable, Claude Designer both implicit; HB explicit "canonical prompt corpus" (P59 ADR-083, 280-entry baseline). 500+ is 1.8× current scale.  
**Current state:** P59 OC-Test-Library delivered 280-entry baseline (cumulative ~374 entries at P60 seal per CLAUDE.md:84 footnote). P81 OC-16 scope is "Prompt library 500+" (phase-60 post-seal-roadmap line 79). Ruvector 126 entries at P70 open (CLAUDE.md:85).  
**Resolution plan:** **P81 OC-16 (Prompt library 500+)** — per roadmap. Curated corpus expansion + ruvector seeding + markdown formatting + diagram annotations.  
**Confidence sprint will close it:** HIGH. Editorial work; low architecture risk. 2-3 day effort for curation + formatting.  
**Carry-over risk:** If deferred past P81, learning flywheel seeding is incomplete. Tier-2 commercial training has less starting material. Low RC impact; moderate long-term impact.

---

### Gap 21 — AISP adoption push (1-2 weeks external community engagement)
**Severity:** P2 (high-leverage for moat defense; P3 for MVP)  
**Affected surfaces:** `bar181/aisp-open-core` repo, README, cross-links, 3rd-party reference implementations, conference talk planning  
**SOTA reference:** Competitors don't have a public spec standard; AISP is HB's structural moat. Adoption growth is the defense (per p60-competitive-analysis §12-month outlook, line 210).  
**Current state:** AISP repo exists; README deferred to post-launch. Phase-60 post-seal-roadmap (line 76) flags OC-4 as "1-2 weeks external community engagement."  
**Resolution plan:** **P83 OC-17 (AISP adoption push)** — per roadmap. README polish + 3+ third-party reference impls + demo notebook + cross-link strategy. Community engagement (Reddit, Discord, Twitter).  
**Confidence sprint will close it:** MEDIUM. Community engagement is unpredictable. README + reference impls are mechanical. 1-2 week estimate includes external validation loop.  
**Carry-over risk:** If AISP adoption stalls post-P83, moat claim weakens. 12-month strategic risk (per competitive-analysis line 219). Moderate long-term threat.

---

### Gap 22 — Public launch RC final (demo video, slide deck, release notes)
**Severity:** P1 (launch-blocking for perception + distribution)  
**Affected surfaces:** Marketing website, GitHub release, social distribution, demo video, reviewer pitch deck  
**SOTA reference:** Lovable, Framer, Claude Designer all have public launch events + marketing. HB's launch is May 2026 capstone + post-defense RC (per open-core-moat-roadmap). P84 OC-18 is "Public launch RC final."  
**Current state:** Phase-60 post-seal-roadmap (pre-defense checklist, lines 38-49) lists demo video (30 min), slide deck (2-3 hrs), rehearsal (30 min). Post-defense work begins D9+ per open-core-moat-roadmap (line 88).  
**Resolution plan:** **P84 OC-18 (Public launch RC final)** — demo video + slide deck final cut + release notes + GitHub tag + Hacker News / Product Hunt / Twitter thread coordination.  
**Confidence sprint will close it:** HIGH. Mechanics-driven, low architecture risk. 1-2 day sprint for final polish.  
**Carry-over risk:** If P84 slips, launch gets delayed. No technical risk; purely perception + distribution.

---

### Gap 23 — Section arrangement expansion (course-landing, booking-calendar, newsroom)
**Severity:** P2 (high-leverage for use-case breadth; P3 for MVP)  
**Affected surfaces:** Section library (sectionLibrary.ts), template matcher, example_prompts coverage  
**SOTA reference:** Lovable, Framer implicit (canvas sections). HB explicit (15 arrangements at P73, was 12; +3 in audit). Missing "course-landing" (educational), "booking" (services), "newsroom" (media/PR).  
**Current state:** P73 OC-TPL-AUDIT added 3 arrangements: course-landing, booking-calendar, newsroom (template-audit.md lines 101-103). All 15 entries carry exampleQueries. No more gaps in section library.  
**Resolution plan:** **P73 COMPLETE** — gap already closed. P75 OC-7 (section-type closure) is stretch scope if new verticals emerge.  
**Confidence sprint will close it:** COMPLETE (P73). No P74-P84 work needed.  
**Carry-over risk:** None; already shipped.

---

### Gap 24 — Content style expansion (instructional, punchy-social, sales-pressure)
**Severity:** P2 (high-leverage for copy diversity; P3 for MVP)  
**Affected surfaces:** Content library (contentLibrary.ts), tone picker, example_prompts coverage  
**SOTA reference:** Lovable (tone implicit in model). HB (explicit 15 styles at P73, was 12; +3 in audit: instructional, punchy-social, sales-pressure).  
**Current state:** P73 OC-TPL-AUDIT added 3 styles; all 15 entries carry exampleQueries. No more gaps in content library.  
**Resolution plan:** **P73 COMPLETE** — gap already closed. P75 OC-7 (stretch) if new verticals need tone variants.  
**Confidence sprint will close it:** COMPLETE (P73). No P74-P84 work needed.  
**Carry-over risk:** None; already shipped.

---

### Gap 25 — Theme expansion (dark-feminine, industrial-modern, cozy-maximalist)
**Severity:** P2 (high-leverage for aesthetic breadth; P3 for MVP)  
**Affected surfaces:** Theme library (themeLibrary.ts), theme picker, template matcher, example_prompts coverage  
**SOTA reference:** Lovable (implicit model creativity). HB (explicit 21 themes at P73, was 18; +3 in audit). Gap closed.  
**Current state:** P73 OC-TPL-AUDIT added 3 themes (dark-feminine, industrial-modern, cozy-maximalist); all 21 entries carry exampleQueries. Template Intelligence fully populated.  
**Resolution plan:** **P73 COMPLETE** — gap already closed. P75 OC-7 (stretch) if new market verticals need aesthetics.  
**Confidence sprint will close it:** COMPLETE (P73). No P74-P84 work needed.  
**Carry-over risk:** None; already shipped.

---

## §3 Resolution Coverage Matrix

| # | Gap | Severity | Sprint(s) | Confidence | Status |
|---|---|---|---|---|---|
| 1 | DECOMP_ATOM | P1 | P74 | HIGH | OPEN — deadline P74 seal |
| 2 | Web Speech wire-up | P2 | P77 or P82 | MEDIUM | OPEN — can slip to cleanup |
| 3 | Bottom-sheet refinement | P3 | P77 or P82 | HIGH | OPEN — polish-only |
| 4 | useChatPipeline hook | P1 | P74 or P75 | MEDIUM | OPEN — depends on Gap 1 |
| 5 | OC-TI Wave 2 matcher UI | P2 | P75 or P76 | MEDIUM-HIGH | OPEN — can ship EXPERT-only |
| 6 | +3 templates to 40+ | P2 | P80 | HIGH | OPEN — explicitly scoped OC-15 |
| 7 | Marketing-site mobile | P2 | P77 or P82 | HIGH | OPEN — mechanical polish |
| 8 | Build-step RSS gen | P3 | P81 or P82 | HIGH | OPEN — low effort |
| 9 | +2 blog posts to 12+ | P3 | P82 | HIGH | OPEN — content-only |
| 10 | Hosted share URL | P1 (for virality) | Tier-2 DEFERRED | N/A | BLOCKED — commercial only |
| 11 | HNSW re-index | P2 | Tier-2 DEFERRED | N/A | BLOCKED — learning runtime |
| 12 | Visual polish floor | P2 | P74 + P76 + P82 | HIGH-MEDIUM | OPEN — distributed fixes |
| 13 | Mobile onboarding | P2 | P75 or P77 | HIGH | OPEN — mechanical UI |
| 14 | Share bundle polish | P2 | P76 | HIGH | OPEN — core of P76 scope |
| 15 | Spec quality export | P1 | P76 | HIGH | OPEN — already 10/10; polish only |
| 16 | Performance baseline re-verify | P2 | P77 | HIGH | OPEN — post-DECOMP tuning |
| 17 | WCAG baseline audit | P2 | P77 | MEDIUM | OPEN — requires tooling |
| 18 | Multi-page MVP | P2 | P78 | MEDIUM | OPEN — 3-5 day arch work |
| 19 | Process pages POC | P3 | P79 | MEDIUM | OPEN — new feature cat, POC-only |
| 20 | Prompt library 500+ | P2 | P81 | HIGH | OPEN — editorial curation |
| 21 | AISP adoption push | P2 | P83 | MEDIUM | OPEN — external engagement |
| 22 | Public launch RC final | P1 | P84 | HIGH | OPEN — mechanics-driven |
| 23 | Section arrangements | COMPLETE | P73 ✓ | COMPLETE | CLOSED — all 3 added |
| 24 | Content styles | COMPLETE | P73 ✓ | COMPLETE | CLOSED — all 3 added |
| 25 | Themes | COMPLETE | P73 ✓ | COMPLETE | CLOSED — all 3 added |

**Summary:**
- **P1 (launch-blocking):** 4 gaps (DECOMP_ATOM, useChatPipeline, Hosted share, Public launch RC)
  - 3 can close in P74-P84 (Gaps 1, 4, 22)
  - 1 deferred to Tier-2 (Gap 10)
- **P2 (high-leverage):** 14 gaps, all assignable to P74-P84 sprints
- **P3 (nice-to-have):** 4 gaps, all P75-P84 scope
- **Already complete (P73):** 3 gaps (sections, content, themes)

**Of top 25 gaps, 22/25 (88%) are resolved within P74-P84 open-core roadmap.** 2/25 explicitly deferred to Tier-2 (Gaps 10-11). 3/25 already closed (Gaps 23-25).

---

## §4 Honest Risk Assessment

### Slippage risk per major sprint

| Sprint | Headline risk | Mitigation | Severity |
|---|---|---|---|
| **P74** OC-DECOMP | DECOMP_ATOM + chatPipeline.ts wire both needed before template matcher can work; scope creep if LLM enrichment requested | Keep LLM enrichment optional; land deterministic baseline in A1; A3 wire is mechanical | HIGH — cascades to P75 |
| **P75** OC-7 | Section-type closure is stretch scope if OC-TI Wave 2 UI included; depends on Gap 1 (DECOMP) complete | Defer OC-TI Wave 2 to P76 if P75 overloaded; section arrangements already complete (P73) | MEDIUM — can degrade to quality-over-breadth |
| **P76** OC-9 | Spec polish + export redesign is 2-in-1; mobile onboarding might slip here too | Split: P76 owns export polish only; mobile onboarding moves to P77 | MEDIUM — can defer mobile to P77 |
| **P77** OC-10 | Performance + a11y + mobile polish is 3-in-1; latency re-measurement might surface regressions | Pre-P77 checkpoint: run latency benchmark on P74 DECOMP build; scope a11y to WCAG AA essentials only | MEDIUM-HIGH — three threads |
| **P78** OC-11 | Multi-page MVP is architecture-heavy; routing + persistence in static context is a new problem | Scope to single-page-per-export; defer multi-page persistence to Tier-2 if time tight | MEDIUM — can scope-cut to POC |
| **P79** OC-14 | Process pages are a new section type (technically); may conflict with "NO new section types" rule | Clarify: process pages are a layout variant, not a type; scope to 1-2 reference templates | MEDIUM-LOW — definitional ambiguity |
| **P80** OC-15 | "3-5 opinionated templates" is design-heavy; quality bar (Gap 6) is high | Prepare design specs ahead (P79). Pair with design review per-template. | MEDIUM |
| **P81** OC-16 | Prompt corpus curation (500+) is editorial; quality bar (uniqueness, relevance) is subjective | Pre-curation: establish rubric (e.g., "covers 80% of template × persona matrix"). AI-assisted curation. | MEDIUM-LOW — editorial, not architecture |
| **P82** OC-CLEANUP | Catch-all for deferred polish; scope creep risk if 4-5 sprints all defer one item | Pre-P82: freeze P74-P81 scope 2 sprints ahead. Triage P82 items into "MUST" vs "stretch." | HIGH — undefined scope |
| **P83** OC-17 | AISP adoption push is external engagement; unpredictable GitHub star growth, reference impl community response | Set realistic targets (e.g., "3+ reference impls by end-of-month," not "500 stars"). | MEDIUM — external dependency |
| **P84** OC-18 | Public launch final is mechanics; low architecture risk but execution-dependent (demo video quality, timing) | Record demo early (P82); slide deck draft P82; P84 = final cut only. | LOW |

### Sequencing risk (which sprints depend on which)

```
P74 OC-DECOMP (A1: DECOMP_ATOM, A2: todoExecutor, A3: chatPipeline.ts)
  ↓ (hard dependency)
P75 OC-7 (scope includes: useChatPipeline hook wiring completion, section-type closure)
  ↓
P76 OC-9 (Spec quality + export polish; can parallelize with P75 design work)
  ↓
P77 OC-10 (Performance + a11y; post-DECOMP latency re-baseline)
  ↓
P78 OC-11 (Multi-page MVP; depends on P75 section stability)
  ↓
P79 OC-14 (Process pages POC; independent, can parallelize)
  ↓ (concurrent)
P80 OC-15 (Agentic-product templates; design specs prepared P79)
  ↓
P81 OC-16 (Prompt library 500+; editorial, independent)
  ↓
P82 OC-CLEANUP (deferred fixes from P74-P81)
  ↓
P83 OC-17 (AISP adoption push; marketing/community, independent)
  ↓
P84 OC-18 (Public launch RC final)
```

**Critical path:** P74 → P75 → P76 → P77 → P78 (5 phases)  
**Parallel work:** P79 (process pages POC) can overlap P76-P77. P80 (templates) can overlap P79-P80. P81 (prompt library) can overlap P80-P81.  
**Catch-up windows:** P82 OC-CLEANUP is 2-3 days; can absorb 1-2 days of prior-phase deferrals.

### Owner-input bottlenecks

**P74 OC-DECOMP:** Does the owner want deterministic-rules DECOMP or LLM-enriched? Scope creep risk if LLM requested. **Mitigation:** Land deterministic; LLM is P75+ stretch.

**P80 OC-15 (Agentic-product templates):** Design specs for "3-5 opinionated templates" require owner vision (vertical positioning, copy tone, aesthetic). **Mitigation:** Pre-P80 brief (P79) with design direction + example references.

**P83 OC-17 (AISP adoption):** External community engagement (Reddit, Discord, Twitter) requires owner credibility + time. **Mitigation:** Assign to owner 1-2 weeks before P83; no engineering dependency.

---

## §5 Net Score Trajectory

### Current aggregate (P73 seal)

- **Spec quality (Gap 15):** 10/10 (moat dimension; unchanged through P74-P84)
- **Open-source posture (Gap 11 deferred):** 10/10 (unchanged; HNSW is Tier-2 add-on)
- **Speed perception (Gap 16):** 9/10 (P54 ADR-077; P77 re-baseline to confirm 9/10)
- **Visual polish (Gap 12):** 6/10 (baseline; P74 + P76 + P82 fixes → **estimated 7-8/10 post-P84**)
- **Ease of use (Gap 13, mobile):** 7/10 (P69 baseline; P75 + P77 → **estimated 8/10 post-P84**)
- **Mobile UX (Gaps 2, 3, 7, 13):** 7/10 (P69 baseline; P75 + P77 comprehensive polish → **estimated 8-8.5/10 post-P84**)
- **Sharing / virality (Gap 10 deferred):** 5/10 (in-browser stub only; **stays 5/10 unless Tier-2 ships**)
- **Defense vs fast-moving competitors (Gaps 5, 20, 21):** 7/10 (moat at spec layer; P81 + P83 → **estimated 8/10 post-P84** if AISP adoption gains traction)

**Current composite (P73):** Estimated **62-63/100** (was 61/100 at P60; +1-2 from template library completion + DECOMP architecture visibility).

**Post-P84 projected (open-core only):** Estimated **70-73/100**  
- Visual polish: 6 → 7-8 (+1-2)
- Ease of use: 7 → 8 (+1)
- Mobile UX: 7 → 8-8.5 (+1-1.5)
- Defense/moat: 7 → 8 (+1, conditional on AISP adoption)
- Spec quality: 10 → 10 (unchanged, peak)
- Speed: 9 → 9 (unchanged)
- Open-source: 10 → 10 (unchanged)
- Sharing: 5 → 5 (unchanged, Tier-2 blocker)

**Honest gap to SOTA average 80:** **7-10 points** (assumes Lovable/Framer/Claude Designer add 5-8 points each in next 12 months)

**Honest gap to BEST-IN-CLASS 95:** **20-25 points** (SOTA will improve; HB's moat is structural but not insurmountable)

**Why 70-73 is honest, not pessimistic:**
- Spec quality 10/10 + speed 9/10 + open-source 10/10 = HB's three unique wins (29 points of 80)
- Sharing stuck at 5/10 (Tier-2 blocker); mobile UX floor (8/10 vs Lovable 9/10 native)
- 12-month outlook: Lovable will be on v3 mobile; Claude Designer will add spec export; Framer will add agentic-build. All competitors tighten the gap.
- AISP moat (Gaps 5, 20, 21, 23-25) is structurally novel but community adoption is NOT guaranteed. If AISP adoption stalls, HB loses the "category-defining" claim.

---

## §6 Top 3 Strategic Recommendations

### 1. Front-load DECOMP_ATOM in P74; unblock P75 immediately

**Why:** Gap 1 (DECOMP_ATOM) and Gap 4 (useChatPipeline hook) are critical-path hard blockers. Both must land in P74 for P75 to deliver on section-type closure without re-planning.

**How:** A1 (DECOMP_ATOM) + A3 (chatPipeline.ts wire) are the first 2-3 agents on day 1 of P74. Run them sequentially (A1 → A3 dependency) and verify deterministic-baseline acceptance gate ASAP. Defer LLM enrichment to P75 if time is tight.

**Risk mitigation:** Pre-P74 design review on DECOMP_ATOM spec with owner. Ensure "no LLM enrichment in P74" is explicit in scope.

---

### 2. Bundle visual polish (Gap 12) into P74 + P76 + P82 as distributed "fit-and-finish" work, not a separate sprint

**Why:** Visual polish (6/10 → 7-8/10) is HB's second-biggest gap post-moat (after sharing). Deferring all visual polish to a single sprint risks cascading slips. Distributing fixes (P74 quick-win AISP default-expand, P76 export redesign, P82 final pass) ensures incremental progress.

**How:**
- **P74:** AISP trace default-expand on first bradley reply (30-min quick win, per p60-competitive-analysis gap #3)
- **P76:** Export-modal redesign + "Built with Hey Bradley" footer typography + shared-spec preview card
- **P82:** Final type scale audit + spacing rhythm pass + color-token consistency check

**Risk mitigation:** Assign a design lead to each sprint's polish pass. Pre-P76 design spec (do it in P75 overlap).

---

### 3. Defer mobile onboarding (Gap 13) from P75 to P77, pairing with comprehensive mobile + a11y pass (OC-10 core scope)

**Why:** P75 OC-7 (section-type closure) is already stretch scope if OC-TI Wave 2 UI is included. Mobile onboarding is a 1-2 day fix that's NOT critical for P75.

**How:** P75 focuses on section-arrangement architecture (course-landing, booking-calendar, newsroom integration) + optional OC-TI Wave 2 UI (defer to P76 if time is tight). P77 OC-10 inherits mobile onboarding + Web Speech wire-up + bottom-sheet refinement + WCAG audit as a cohesive mobile+a11y pass.

**Risk mitigation:** Lock P75 scope 2 weeks before phase starts. Document deferred items explicitly.

---

## §7 Bottom Line

HB sits at **62-63/100** at P73 seal (61/100 competitive baseline, +1-2 from completed template library). The 25-gap analysis reveals a **clear, mappable roadmap to 70-73/100 by P84** — a honest +8-10 points that closes 40% of the gap to SOTA average 80.

**The moat is secure.** Spec quality (10/10), speed perception (9/10), open-source posture (10/10) are HB's structural wins. Competitors can copy templates, UI polish, and even spec export in 6-12 months. They cannot rebuild AISP discipline from scratch.

**The blocker is execution velocity.** 11 critical-path gaps (P1 + P2) span P74-P84 (11 phases). Average velocity is 1 phase per day; at that rate, the roadmap compresses to 2-3 weeks real time. Slippage on any of P74 (DECOMP), P76 (export polish), P77 (performance+a11y), P78 (multi-page) cascades downstream. **Mitigation:** Front-load P74 DECOMP acceptance gate by day 2; run P77 checkpoint latency benchmark mid-phase; freeze P82 scope 2 sprints ahead.

**The honest risk is AISP adoption.** If `bar181/aisp-open-core` stays a citation in HB's README with zero third-party adoption by P84, the "category-defining" narrative fades to "brilliant open-source artifact that nobody else is building on." The 12-month moat depends on P83 OC-17 successfully seeding 3+ reference implementations + community engagement. **Mitigation:** Assign owner 1-2 weeks pre-P83; prepare demo notebook + reference-impl boilerplate in P81 (prompt-library sprint).

**Public launch RC (P84) is achievable and defensible at 70-73/100.** Reviewers will see a mature spec layer, visible speed, and pragmatic mobile UX. Sharing (5/10) and multi-page (if deferred) will be noted as "Tier-2 commercial." AISP moat will be visible if adoption grows. The product is category-defining IF the owner executes P74-P84 with discipline.

