# Strategic Review — Hey Bradley as a Category-Level Product

> **Date:** 2026-04-29
> **Author:** Claude Code (brutal-honest evaluation per owner request)
> **Scope:** Hey Bradley as a whole, measured against the full 10-sprint commercial arc. NOT the personality sprint, NOT the capstone.
> **Pair this with:** `plans/initial-plans/01.north-star.md`, `plans/implementation/phase-18/strategic-vision.md`, `plans/implementation/sprint-j-personality/01-audit.md`.
> **Status:** Captured for the record. Acted on or deferred per owner.

---

## Headline grades

| Lens | Grade |
|---|:---:|
| Capstone artifact (May 2026 defense) | **A-** |
| Open-source project | **A-** |
| Category-defining product (10-sprint commercial arc) | **B-** |
| Distribution / GTM readiness | **D+** |
| Defensibility against Lovable + Claude Designer + Cursor (12-month horizon) | **C** |

**One-liner:** A beautifully engineered product that has not yet proven it is a category.

---

## What's genuinely excellent

1. **The 5-atom AISP Crystal Atom architecture is structurally novel.** Most "AI-driven design" products are LLM wrappers. Having a closed symbolic protocol with Σ-restriction discipline across PATCH / INTENT / SELECTION / CONTENT / ASSUMPTIONS is real architectural innovation. Academically defensible AND commercially defensible.

2. **The 55% framing is correct and underexploited.** "Ambiguity removal between 'I have an idea' and 'I have a spec to feed an AI builder'" is empty white space. Lovable starts at code. Figma starts at pixels. Nobody owns the spec layer.

3. **Listen Mode is a real differentiator.** Voice → spec → code is something nobody else does end-to-end. Lovable mobile does voice → code; the missing spec layer is the moat.

4. **Engineering rigor is tier-1.** 73 ADRs, 550 PURE-UNIT tests, multi-reviewer brutal-review pattern, Σ-discipline enforced across 5 atoms. Enterprise-grade hygiene that most early-stage products lack.

5. **Open-core boundary is clean.** BYOK + local SQLite + ZIP export = $0 cost to self-host. Tier 2/3 = OAuth + Supabase + multi-page + agentic. Tier separation is well-designed and commercially sound.

---

## What's broken (the brutal part)

### 1. The thesis is invisible to users
The 5-atom architecture is the single biggest moat and is buried in EXPERT mode behind a tab nobody clicks. Sub-2% ambiguity is a prose claim, not a measured runtime metric the user sees. **The moat is currently words on a page, not pixels on a screen.** Single most existential issue. Every demo where the AISP isn't visible is a demo Lovable wins.

### 2. The pixel ratio is backwards
Builder Mode takes ~80% of the screen. Spec Mode is a sub-tab. If "the spec is the product," the spec needs to be the hero of at least one mode. Current product reads as "website builder that writes a spec on the side." Should read as "spec generator that draws a website on the side."

### 3. "Why now" loses to Lovable on visceral grounds
- Lovable: "vibe-code in 20 minutes on your phone" → instantly understood
- Hey Bradley: "specifications matter, sub-2% ambiguity" → a thesis

Theses lose to visceral pitches every time unless the thesis is made visceral. It hasn't been.

### 4. Marketing sites are the weakest possible proof point
60-70% of "websites" but a tiny slice of "software being built." Critics will say "you proved your thesis on the easiest 5%." The category claim isn't defensible until Tier 2 ships dashboards / complex SPAs / actual app surfaces. **AISP hasn't been stress-tested on auth flows, state management, integration tests, infra** — which is where agentic engineers actually struggle.

### 5. Distribution story is missing
Open core on GitHub gets a few hundred stars at best. There is no viral mechanic in the product. No hosted share link. No "look what I made" artifact. AISP is academic, not viral. The Linear-meets-React-Devtools live AISP trace could be screenshot-bait on dev Twitter, but it isn't built. **Currently the GTM plan is "ship to GitHub and hope."**

### 6. Three-mode PMF makes the weakest leg load-bearing
PMF ≜ Builder + Listen + Specs (all three required). Listen is excellent. Specs is the moat but invisible. **Builder is mid vs Webflow/Squarespace/Framer.** Engineering is being spent on the leg that's both weakest AND least differentiating. Sprint I shipped builder polish; that was correct for capstone, wrong for category.

### 7. The learning flywheel is unscaffolded
The owner named it explicitly in the 10-sprint plan: "learning database to refine UX, understand prompts, infer use." That's the actual commercial moat. **Nothing in the open core previews it.** By the time Tier 2 ships Supabase + vector DB + telemetry, competitors will have shipped their own learning loops on broader datasets. Should scaffold the schema NOW (local-only, opt-in, anonymous) so v1.0 launch has 6 months of telemetry pattern in place when commercial ships.

### 8. North-star X8 (mobile out of scope) is too broad
"Mobile builder UI = no" is correct. "Mobile listen + read spec = no" is reactive thinking, not strategic. A founder with an idea on a walk should be able to voice-capture, get a spec, and read it on their phone. Builder hidden on mobile = right. Listen + Spec read-only available = right. **The blanket ruling needs refinement.**

### 9. "Not a website builder competitor" is undermined by the UX
When 80% of the screen is a website builder, the disclaimer "we're not a builder, we're a spec platform" loses to pixels. Either the positioning is wrong or the UX is wrong. **The pixels are louder than the thesis.**

### 10. Capstone vs commercial optimization creates dissonance
Capstone wants academic rigor (ADRs, AISP discipline, test counts). Category product wants traction, distribution, time-to-wow. The product optimizes hard for the former. **The pivot to optimize for the latter hasn't happened yet.** It needs to happen the day after capstone, not 6 sprints later.

---

## Structural risks (the existential ones)

| # | Risk | Why it's existential |
|---|---|---|
| **R1** | Lovable / Claude Designer / Cursor close the spec gap with brute-force LLM | Once they do, the AISP moat is gone unless it's locked in as a public, adopted standard. **Time pressure is real and 6-12 months max.** |
| **R2** | Tier 3 (Agentic Support System) is research-grade, not productization | "Hey Bradley uses Hey Bradley" is a cute pitch; operationally it's spec'ing arbitrary codebases. The 10-sprint plan needs to be honest about which sprints are research vs which ship. |
| **R3** | Engineering rigor outpaces traction | Sprint planning rigor exceeds most early-stage products. This is a strength until it's a problem. **Ship to humans soon or the rigor doesn't matter.** |
| **R4** | AISP adoption is the moat's foundation | If AISP doesn't get adopted by the broader agentic-engineer community, HB's positioning weakens over time. **AISP needs its own growth plan.** It can't just live in `bar181/aisp-open-core` and hope. |
| **R5** | Marketing-site scope = small SAM | Acceptable for capstone. Inadequate for category. Tier 2 expansion to non-marketing software needs to ship before "category" is a defensible word. |

---

## What would make this an A as a category product

In ranked order of leverage:

1. **Make the moat visible.** AISP live trace always-on (not in EXPERT). Atoms light up during chat. Σ values inline. Screenshot-bait for dev Twitter. **Existential, not optional.**

2. **Ship a hosted shareable spec artifact before May.** Real URL, not data URL. The viral mechanic. "Look what I designed in 5 minutes — Hey Bradley wrote the AISP spec — built by Claude Code overnight."

3. **Reverse the pixel ratio in at least one mode.** "Spec Mode" where the AISP and human-readable plan are the hero, builder is a sidebar preview. Three modes, three heroes.

4. **Scaffold the learning flywheel NOW in the open core.** Local-only, opt-in, anonymous telemetry. Surface "what I've learned about your project" in EXPERT. By Tier 2 ship date, the pattern is real and migration to Supabase is mechanical.

5. **Pick ONE flagship Tier 2 proof point and build it.** A SaaS dashboard spec that Claude Code can actually implement. Until this exists, "category" is a word.

6. **Ship the open-core RC publicly even if lean.** GitHub release, blog post, dev Twitter, demo URL. Don't keep polishing in private. Public release teaches what to build next.

7. **Refine north-star X8.** Mobile listen + read-only spec = ship. Mobile builder = stay out. Bifurcate the ruling.

8. **Set a "first 100 users" milestone.** Without this, every sprint plan is theoretical. Telemetry from real users beats persona scoring.

9. **AISP adoption plan.** Conference talks, dev community engagement, reference implementations in other tools. Hey Bradley's moat is AISP's reach.

10. **Defer polish-layer work (personality, mobile UX, conversation log) to post-launch.** They will not save the category claim.

---

## Direct synthesis

Hey Bradley is a **structurally innovative product with an unusually rigorous engineering foundation, currently positioned as a category candidate but operating as a polished open-source artifact.** The thesis is correct. The moat is real. The execution discipline is rare. **What's missing is making the moat legible, building the viral mechanic, scaffolding the learning loop, and proving Tier 2 with at least one non-marketing flagship.**

If those four things ship in the next 6 sprints, this is an A category product with a credible $50M-ARR thesis behind it.

If polish ships as the marquee instead, it stays a B- category product that people respect but don't buy.

---

## Owner's response

Owner reviewed and elected to proceed with personality sprint (Sprint J) as planned. Recommendations 1, 2, 4, 5, 7 above are deferred to a future sprint. This document is captured for the record so the recommendations can be revisited post-Sprint-J seal.
