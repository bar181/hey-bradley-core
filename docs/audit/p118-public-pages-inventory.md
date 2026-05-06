# P118/W1 — Public-Page Inventory + Reframe Plan

## TL;DR
- **11 public pages audited** (Welcome / About / OpenCore / AISP / Research / HowIBuiltThis / Blog / Docs / BYOK / Progress + 12 blog post .md files surfaced via `/blog/:slug`).
- **6 pages keep current framing intact** (AISP / Docs / BYOK as engineer/functional surfaces; Blog as content surface; the 12 blog posts; Research candidate).
- **5 pages require W2 reframe** (Welcome — full Apple-style rewrite; About — strip scoreboard + numbers; OpenCore — strip phase numbers + add "for everyone else" entry; HowIBuiltThis — hide from MarketingNav OR strip-numbers; Progress — move under engineer track).
- **Recommended agentic-engineer track home:** `/research` (Research.tsx) — already a long-form story surface, already has competitor/landscape table, already image-first. Repurpose as the engineering-track entry; lift the "Research / for builders" link in footer from blog post 3 + add Easter-egg ribbon to `bar181/aisp-open-core`.

## Public route map (current)
- `/` → Welcome.tsx
- `/about` → About.tsx
- `/aisp` → AISP.tsx
- `/research` → Research.tsx
- `/open-core` → OpenCore.tsx
- `/how-i-built-this` → HowIBuiltThis.tsx (NOT linked in MarketingNav; reachable from OpenCore footer + cross-page links)
- `/docs` → Docs.tsx
- `/byok` → BYOK.tsx
- `/blog` → Blog.tsx
- `/blog/:slug` → BlogPost.tsx (12 posts on disk)
- `/progress` → Progress.tsx (NOT linked in MarketingNav; reachable from Welcome "Building in public")
- `/demo/listen`, `/demo/chat`, `/demo/full-site` → demo surfaces (out of scope this audit; they are interactive product demos, not story pages)
- `/spec/:hash` → SharedSpec.tsx (out of scope; user-generated spec viewer)
- `/new-project`, `/builder`, `/planning`, `/agentics` → product surfaces (out of scope; behind "Try Builder" CTA)

MarketingNav (`src/components/MarketingNav.tsx:3-11`) currently surfaces: About / AISP / BYOK / Open Core / Listen demo / Chat demo / Docs. Notably MISSING from nav: Blog, Research, How I Built This, Progress.

## Per-page audit

### `/` Welcome.tsx (315 LOC)
- **Current H1:** "Messy ideas → enterprise specs, instantly." (line 63)
- **Current eyebrow:** "Spec workbench · AISP-powered · Harvard ALM Capstone" (line 60)
- **Current value prop:** Engineer-first framing — "turns the conversation you're already having…into a formal spec your AI coding tool can execute"
- **Current sections:** Hero / Social proof bar (numbers!) / Recent projects (functional) / "The 55% problem" / "Building in public" / "Three ways in" / "What you get" / "Open core vs commercial" / Blog preview / Closing CTA / Footer
- **Numbers found:** L60 "Harvard ALM Capstone" / L72 9-atom AISP trace / L103-107 stats bar (~1582+ tests / 132 ADRs / 56 examples / 12 blog posts / composite 86.7/100 vs Lovable 80) / L155 "40-65%" / L177-179 "P11-P113" + "132 ADRs" + "~1582+ PURE-UNIT tests GREEN" + "86.7/100 vs Lovable 80" / L229 "21 themes. 51 example sites. 18 section types. 300 images" / L304 "Harvard ALM Capstone — May 2026"
- **Competitor mentions:** L107 "Lovable 80" / L179 "Lovable 80"
- **Jargon found:** L60 "AISP-powered" / L71-72 "AISP trace: INTENT → ASSUMPTIONS → DECOMP → SELECTION → CONTENT → PATCH → PROCESS → DDD → AGENT → spec" / L86 "Explore AISP" / L95 "Read the AISP spec" / L161 "AISP" / L225 "AISP Crystal Atom spec with under 2% ambiguity" / L231 "AISP spec" / L257 "AISP" / L305 "Creator of AISP"
- **Audience served today:** mixed (engineer + agentic-engineer leaning; consumer NOT served)
- **W2 verdict:** **REFRAME — full Apple-style 5-section rewrite per F1.** Scoreboard (L101-109) deleted. AISP atom trace (L70-73) moved to Research. Capstone framing eyebrow simplified. Numbers stripped. New H1: "Describe it. See it." (per owner brief).

### `/about` About.tsx (240 LOC)
- **Current H1:** "Meet Bradley." (line 19)
- **Current eyebrow:** "Harvard ALM Capstone 2026" (line 16)
- **Current value prop:** Bradley's personal story + capstone framing
- **Current sections:** Hero / Capstone scoreboard callout / The Insight (Telephone Game + Capstone) / The AISP Protocol / The Vision / The Capstone Journey (5 stages) / CTA / Footer
- **Numbers found:** L33 "As of P109 (May 2026)" / L37 "~99 phases through P109" / L40 "128 ADRs Accepted and ~1491+ PURE-UNIT tests GREEN" / L74 "512 symbols" / L99 "library of 512 mathematical symbols" / L110 "less than 2% ambiguity per atom" / L154 "More than half of development effort" / L162 "6 enterprise-grade specification documents" / L191 stage 4 ADRs/sprints inline / L192 "ADR-114"
- **Competitor mentions:** none
- **Jargon found:** L73-74 "AISP — the AI Symbolic Protocol" / L89 "The AISP Protocol" / L93 "What is AISP?" / L98-99 "AISP encodes intent…512 mathematical symbols" / L104 "Crystal Atom" / L107 "Crystal Atom" / L116 "AISP is open source" / L155 "AISP targets this bottleneck" / L191 "Crystal Atoms" / L221 "/onboarding" (broken — should be /new-project) / L235 "Creator of AISP"
- **Audience served today:** mixed (academic capstone + AISP enthusiast)
- **W2 verdict:** **REFRAME (light).** Strip scoreboard callout (L29-44). Replace "AISP Protocol" section with a 1-paragraph "If you're an engineer, here's what powers it" link to /research. Keep personal story; soften capstone framing. Fix `/onboarding` → `/new-project` (L221). Apply useReveal entrance animation per F3.

### `/open-core` OpenCore.tsx (452 LOC)
- **Current H1:** "The 55% problem nobody's solving." (line 17)
- **Current eyebrow:** "Open core · MIT License" (line 15)
- **Current value prop:** Engineering-deep open-core positioning + competitive framing
- **Current sections:** Hero / "AI solved the wrong half" / 55% stat callout (3 cards) / "What open core means" / "Spec-first development" / Fit & Value Chart (with competitor names) / AISP / Crystal Atom code example / How It Was Built (4 stat cards + checklist) / Two repositories / About Bradley / CTA / `<OpenCoreVsCommercial />` / Footer
- **Numbers found:** L70-71 "55%" / L75 "40-65%" / L79 "<2%" / L94 "21 themes, 51 example websites, 6 enterprise spec generators, 300+ media images, 13 image effects" / L108 "P85-P109" / L109 8-atom enumeration / L156 "25%" / L174 "55%" / L192 "75%" / L210 "95%" / L290 "128 Architecture Decision Records" / L297 "28K+" / L302 "~1491+" / L307 "128" / L312 "~99 phases (P11-P109)" / L351 "21 themes, 51 examples, 300+ images, 6 spec generators, 13 image effects" / L366 "512-symbol set" / L447 "Harvard ALM Capstone — May 2026"
- **Competitor mentions:** L151 "Lovable, v0, AI Studio" / L169 "Cursor, Copilot, Windsurf" / L187 "Claude Code, Codex, Devin"
- **Jargon found:** L80 "AISP Crystal Atoms" / L95 "AISP Crystal Atom output" / L109 "8-atom AISP Crystal Atom suite (PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD + AGENT)" / L177 "AISP Crystal Atoms" / L204 "Hey Bradley + AISP" / L227-244 entire AISP section + Crystal Atom code example with Σ/Γ/Λ/Ε / L290 "ADRs" / L320-330 atom checklist with Sprint refs / "ADR-103 + ADR-104" / "ADR-126" / "Sprint K/L/M" / L366 "Crystal Atom notation, 512-symbol set"
- **Audience served today:** engineer/agentic-engineer (deep technical positioning)
- **W2 verdict:** **REFRAME (moderate).** Add prominent "If you're not an engineer, start here →" link to `/` at top of hero. Strip phase numbers (L108, L312, L290) but KEEP "55%" framing as the engineer-tier headline. Strip competitor names from Fit chart (L151/169/187) — move that table to a dedicated blog post. Strip "(P11-P109)" → "since v1". Atom enumeration (L109, L320-330) survives but moves to a collapsible "For builders" panel. Crystal Atom code example (L249-259) STAYS — engineer audience self-selects here.

### `/aisp` AISP.tsx (291 LOC)
- **Current H1:** "AI Symbolic Protocol" (line 36)
- **Current eyebrow:** "AISP open core · MIT License" (line 33)
- **Current value prop:** Technical deep-dive on AISP for engineers/researchers
- **Current sections:** Hero / "What is AISP?" / 5 Crystal Atom Components / Sigma-512 Symbol Set / Ambiguity Comparison (chart + table) / Resources / `<AISPDualView />` / Adoption / Footer
- **Numbers found:** "512 symbols" / "<2%" / L226 "(Sprint L · ADR-078)" / L285 "Harvard ALM Capstone — May 2026"
- **Competitor mentions:** L123 "GPT-4, Claude, Gemini, and Llama"
- **Jargon found:** Whole page is AISP technical surface — by design.
- **Audience served today:** engineer / agentic-engineer / researcher (self-selecting)
- **W2 verdict:** **NO change this sprint.** Engineer audience self-selects at `/aisp`. Sole touch: footer cross-link to /research as "engineer track home".

### `/research` Research.tsx (316 LOC)
- **Current H1:** "The most expensive game of telephone in history." (line 23)
- **Current eyebrow:** "Capstone research" (line 21)
- **Current value prop:** Long-form 3-act storytelling about the spec gap; image-first; already Apple-adjacent
- **Current sections:** Hero (with cover image) / Act I — Problem / Intent Loss bar chart / Act II — Insight / Effort breakdown chart / Act III — Same Day Different Ending / The Landscape (competitor table) / What Becomes Possible / CTA / Footer
- **Numbers found:** L57 "40-65%" / L70-73 100/65/42/25% / L88 "98% intent preserved" / L124 "35% to about 15%" / L140-160 55%/25%/20% effort breakdown / L246-247 "5 seconds" + "<2% ambiguity" / L310 "Harvard ALM Capstone — May 2026"
- **Competitor mentions:** L123 "Cursor, Copilot, Claude Code" / L233 "Lovable / v0"
- **Jargon found:** L87 "AISP Crystal Atoms" / L245 "AISP specs" / L311 "Creator of AISP"
- **Audience served today:** mixed-leaning-engineer/storyteller (long narrative + tech demo)
- **W2 verdict:** **REPURPOSE (no rewrite this sprint).** Page is already image-first / story-led / Apple-adjacent. Designate as the **agentic-engineer-track home**. Add Easter-egg ribbon at top: link to `bar181/aisp-open-core` with copy "Read what's coming next →". Footer adds links to /aisp + /open-core + /how-i-built-this. The competitor table (L218-251) is appropriate here because the page is positioned as research; engineer audience expects competitive landscape.

### `/how-i-built-this` HowIBuiltThis.tsx (218 LOC)
- **Current H1:** "~99 Phases. One Human. Many Agents." (line 85)
- **Current value prop:** Engineering build story — phase trajectory + methodology + innovations + lessons
- **Current sections:** Hero / 6-stat bar / 13-row Phase Trajectory chart / Methodology / Technical Innovation / What I Learned / CTA
- **Numbers found:** L5-12 STATS (~28K LOC / 227 source files / ~99 phases / 128 ADRs / 5 bounded contexts / ~1491+ tests) / L14-29 PHASES table (every row has phase numbers + scores + hour estimates) / L48 "128 Architecture Decision Records" / L57 "less than 2% ambiguity per atom" / L88-93 "~99 sealed phases through P109…128 ADRs and 5 DDD bounded contexts" / L177-181 retrospective bullets with phase refs ("P19 went 66→88") / L181 COCOMO + "Composite 86.7/100 vs Lovable 80"
- **Competitor mentions:** L181 "Lovable 80"
- **Jargon found:** L15 "AISP Crystal Atoms" / L19 "ADR-054 DDD bounded contexts" / L20 "AISP Instruction Layer, LLM-Native AISP" / L21 "CONTENT_ATOM, ASSUMPTIONS_ATOM, Listen + AISP Unification, 5-atom AISP" / L25 "DECOMP_ATOM" / L27 "PROCESS_ATOM + DDD_ATOM + AGENT_ATOM (8-atom AISP suite)" / L28 "Section-enum drift regression guard" / L48 "ADR-045 / ADR-040 / ADR-043 / ADR-054 / ADR-126 / ADR-129 / ADR-130 / ADR-133/137" / L57 "AISP Crystal Atoms…512 symbols" / L91 "8-atom AISP suite" / L93 "5 DDD bounded contexts"
- **Audience served today:** engineer / agentic-engineer (deep build telemetry)
- **W2 verdict:** **HIDE from MarketingNav (already not linked) + KEEP as deep-link surface.** This is honest engineer telemetry; appropriate audience self-selects. W2 may either move under `/research/build-story` route OR keep at current path with a "← back to Research" header pill. No rewrite. Fix `/onboarding` → `/new-project` (L200). Numbers stay (engineer audience expects them).

### `/blog` Blog.tsx (212 LOC)
- **Current H1:** "Building Hey Bradley in public." (line 73)
- **Current eyebrow:** "The Hey Bradley blog" (line 70)
- **Current value prop:** Build journal index with tag filter + share-to-clipboard per post
- **Current sections:** Hero / Stats banner (4 numbers from HEADLINE_STATS) / Tag filter / 2-col post grid / Footer (with RSS)
- **Numbers found:** L10-15 STATS array reads from HEADLINE_STATS (codingDays / sprintsSealed / adrsAccepted / testsGreen) / L191 "Harvard ALM Capstone — May 2026"
- **Competitor mentions:** none on the page; competitor names live INSIDE individual blog post .md files (Lovable, Cursor, etc. — appropriate per new direction)
- **Jargon found:** L76 "AISP, the spec layer" / L194 "Creator of AISP" / L199 nav link to /aisp
- **Audience served today:** mixed (build-in-public readers + engineer leaning)
- **W2 verdict:** **REFRAME (light).** Strip stats banner (L82-93) — numbers don't belong on a blog index. Surface 3 NEW posts at top of grid (per F3 brief). Hero copy stays. Add tag-filter chip for "for-builders" to surface engineer-track posts. Subtle fade-in on cards (useReveal).

### `/docs` Docs.tsx (302 LOC)
- **Current H1:** "Documentation" (line 107)
- **Current value prop:** How-to-use-the-builder reference docs (Quick Start / Workflow / Section Types catalogue / Themes / Spec Generators)
- **Current sections:** Hero / Quick Start / Workflow Steps / 18 SECTION_TYPES table / 21 THEMES / 6 SPEC_GENERATORS
- **Numbers found:** L9 "21 professional themes or…51 pre-built example sites" / L14 "300-image media library" / L36-55 18 section types / L62-84 21 themes / L86-93 6 spec generators / L109-110 "{SECTION_TYPES.length} section types, {totalVariants} variants, {THEMES.length} themes, and {SPEC_GENERATORS.length} spec generators"
- **Competitor mentions:** none
- **Jargon found:** L19 "AISP specification documents" / L34 "ADR-100" / L34 "validateSectionType runtime helper" / L34 "ADR-104 + ADR-134 + ADR-137" / L92 "Crystal Atom specification…Typed fields"
- **Audience served today:** product user (functional reference; numbers ARE the content here — section count, theme count, etc.)
- **W2 verdict:** **NO change this sprint.** Functional reference; numbers ARE the value (catalogue counts). Engineer/builder audience self-selects. Sole touch: strip ADR refs from inline JS comments at L31-35 (cosmetic — they're already comments, not visible UI).

### `/byok` BYOK.tsx (202 LOC)
- **Current H1:** "No account. Your key. Your machine." (line 66)
- **Current eyebrow:** "Bring Your Own Key" (line 64)
- **Current value prop:** BYOK trust + provider list + cost framing
- **Current sections:** Hero / Why BYOK? / 5-provider table / 60-second walkthrough / closing
- **Numbers found:** L20 "$0.002 per chat" / L28 "$0.001 per chat" / L36 "$0" / L44 "$0" / L52 "$0" / L52 "18-prompt corpus" — all functional/practical (cost transparency)
- **Competitor mentions:** L15-22 "Anthropic" / "Claude" / L23-30 "Gemini / Google AI Studio" / L31-38 "OpenRouter" — these are SDK provider names, NOT competitors (they're partners that the user is bringing keys for); appropriate.
- **Jargon found:** L21 "AISP-style structured output" / L193 "Explore AISP"
- **Audience served today:** product user setting up their key (functional; engineer-leaning)
- **W2 verdict:** **NO change this sprint.** Functional surface. Numbers (costs) ARE the content.

### `/progress` Progress.tsx (251 LOC)
- **Current H1:** "Hey Bradley — built in 2 days, ready in 10." (line 73)
- **Current eyebrow:** "Building in public" (line 70)
- **Current value prop:** 6-stat bar + 18-row scoring rubric + persona scores + carry-forward registry
- **Current sections:** Hero / 6 STAT_CARDS / Blog teaser / Persona scores callout / Detailed evaluation by category / Footer
- **Numbers found:** L92-105 6 STAT_CARDS (codingDays / daysToDefense / phasesSealed / adrsAccepted / testsGreen / sprintsSealed) / L142 "Eighteen items, scored 1-10" / L146-173 persona callout (P102 / ADR-132 / Grandma 86 / Framer 86 / Lars 88 / +6.7 vs Lovable 80) / blog teaser excerpt (L52) — full Lovable comparison + atom names + ADR refs
- **Competitor mentions:** L50 + L52 "Lovable" / L173 "Lovable 80/100"
- **Jargon found:** L52 entire teaser excerpt loaded with AISP / Crystal Atom / atom names / sprint refs / "ADR-132" / L146-152 ADR-132 / persona score system / L173 "v2.0.0-RC1" / L201 "system-wide review (P102 / ADR-132 seal)"
- **Audience served today:** engineer / agentic-engineer (build-in-public deep telemetry)
- **W2 verdict:** **REPURPOSE — move under engineer track.** Phase numbers + scoring + ADR refs are legitimate engineer-track content. Either link only from /research (not from Welcome) OR keep current `/progress` path with header pill "← back to Research". Hero copy ("built in 2 days") could land in /research as a sidebar fact. Don't strip — relocate the entry point.

### `/blog/:slug` BlogPost.tsx (renders 12 .md files)
- **12 posts on disk:** aisp-made-visible / building-hey-bradley-with-hey-bradley / built-open-core-in-2-days-with-swarm / jira-vs-agentics / lovable-vs-hey-bradley / multi-page-mvp-stays-atomic / pm-architect-designer-now-one-person / six-sprints-two-days / spec-first-vs-vibe-coding / template-first-beats-llm-from-scratch / the-55-percent-problem / the-open-core-boundary
- **Frontmatter shape (sampled `the-55-percent-problem.md`):** `title`, `slug`, `date`, `excerpt`, `tags: ["aisp", "spec-first"]`. Sample 2 (`lovable-vs-hey-bradley.md`): `title`, `date`, `author`, `category`. **Frontmatter is INCONSISTENT across the 12 posts** (some have `slug` + `excerpt`, some have `author` + `category`). W2 should canonicalize frontmatter shape before adding 3 new posts; otherwise tag filter at `/blog` may regress.
- **W2 verdict:** Posts themselves stay as-is (per new direction, competitor names + jargon belong here). 3 NEW posts ship in F3. Confirm canonical frontmatter shape before authoring.

## Numbers + competitor names + jargon scan — public pages only

| Page | Numbers (line refs) | Competitor mentions | Jargon |
|---|---|---|---|
| Welcome.tsx | 60, 72, 103-107, 155, 175, 177-179, 229, 304 | L107 Lovable / L179 Lovable | L60, L71-72, L86, L95, L161, L225, L231, L257, L305, L308 |
| About.tsx | 33, 37, 40, 74, 99, 110, 154, 162, 191-192 | none | L73-74, L89, L93-99, L104-110, L116, L155, L191, L235 |
| OpenCore.tsx | 70-71, 75, 79, 94, 108-109, 156, 174, 192, 210, 290, 297, 302, 307, 312, 351, 366, 447 | L151 Lovable/v0/AI Studio / L169 Cursor/Copilot/Windsurf / L187 Claude Code/Codex/Devin | L80, L95, L109, L177, L204, L227-244, L249-259, L290, L320-330, L366 |
| AISP.tsx | hero/Sigma-512/<2%/L226/L285 | L123 GPT-4/Claude/Gemini/Llama (model names; appropriate) | full page (engineer surface; by design) |
| Research.tsx | 57, 70-73, 88, 124, 140-160, 246-247, 310 | L123 Cursor/Copilot/Claude Code / L233 Lovable/v0 | L87, L245, L311 (light) |
| HowIBuiltThis.tsx | L5-12 STATS (6 numbers) / L14-29 PHASES (13 rows × 3 fields) / L48, L57, L88-93, L177-181 | L181 Lovable | L15, L19-21, L25, L27-28, L48, L57, L91, L93, L211 |
| Blog.tsx | L10-15 (4 stats) / L191 | none on page (content only in posts) | L76, L194, L199 |
| Docs.tsx | L9, L14, L36-55 (18 rows), L62-84 (21 rows), L86-93 (6 rows), L109-110 | none | L19, L92 (light); ADR refs in JS comments only |
| BYOK.tsx | L20, L28, L36, L44, L52 (functional costs) / L52 "18-prompt corpus" | none (Anthropic/Google/OpenRouter are partners, not competitors) | L21, L193 (light) |
| Progress.tsx | L92-105 (6 stat cards) / L142, L146-173 / L52 teaser | L50, L52 Lovable / L173 Lovable | L52, L146-152, L173, L201 (heavy) |
| BlogPost.tsx (12 posts) | per-post (varies) | per-post (Lovable/Cursor/v0/Figma) — APPROPRIATE per new direction | per-post (AISP / Crystal Atoms / atom names) — APPROPRIATE |

## Per-page change plan for W2

| Page | Action | Cap | Lands in F# |
|---|---|---|---|
| Welcome.tsx | Apple-style 5-section rewrite (Hero "Describe it. See it." / Works the way you talk / Take it anywhere / Open core yours to keep / Closing CTA). Strip scoreboard L101-109. Strip 9-atom AISP trace L70-73. Move "55% problem" framing → /research entry. | ≤280 LOC (was 315) | F1 |
| About.tsx | Strip capstone scoreboard L29-44. Replace AISP Protocol section L82-131 with 1-paragraph "How it's built" + link to /research. Soften capstone framing. Fix `/onboarding` → `/new-project` L221. Apply useReveal. | ≤180 LOC delta (-60 LOC) | F3 |
| OpenCore.tsx | Add "If you're not an engineer, start here →" hero link to `/`. Strip phase numbers L108 + L312 + L290 → "since v1". Strip competitor names L151/169/187 from Fit chart (move chart to dedicated blog post). Atom enumeration L320-330 collapses into "For builders" panel. Keep "55%" framing. Keep Crystal Atom code example (engineer surface). | ≤120 LOC delta | F3 |
| AISP.tsx | NO change this sprint (engineer self-selects). | — | — |
| Research.tsx | Repurpose as agentic-engineer-track home. Add Easter-egg ribbon at top with link to `bar181/aisp-open-core` ("Read what's coming next →"). Add footer cross-links to /aisp + /open-core + /how-i-built-this. No content rewrite. | ≤30 LOC delta | F3 |
| HowIBuiltThis.tsx | KEEP as deep-link surface (already not in MarketingNav). Add header pill "← back to Research". Fix `/onboarding` → `/new-project` L200. Numbers stay. | ≤20 LOC delta | F3 |
| Blog.tsx | Strip stats banner L82-93. Surface 3 NEW posts at top. Add fade-in via useReveal. Keep tag filter. | ≤40 LOC delta | F3 |
| Docs.tsx | NO change this sprint (functional reference; numbers ARE the content). | — | — |
| BYOK.tsx | NO change this sprint (functional surface). | — | — |
| Progress.tsx | KEEP at /progress + add header pill "← back to Research". Remove the link from Welcome (Welcome rewrite F1 deletes "Building in public" section anyway). Engineer audience reaches it from /research footer. | ≤10 LOC delta | F3 |
| MarketingNav.tsx | Replace nav links: About / Blog / Research / Docs / BYOK / **Try Builder** (drop AISP + Listen demo + Chat demo + Open Core from primary nav; surface AISP + OpenCore from /research; demos move to a "Try" dropdown OR get rolled into the Builder CTA). | ≤30 LOC delta | F1 (touched same time as Welcome) |

## New visitor journey (post-W2)

```
                              [ Hey Bradley ] (logo)
                                       │
                  ┌────────────────────┼─────────────────────┐
                  ▼                    ▼                     ▼
            Marketing nav         Welcome (/)          Try Builder
        About│Blog│Research          Hero:              (CTA from
        Docs│BYOK│Try Builder    "Describe it.       every page)
                  │              See it."                   │
                  │                    │                    ▼
                  │     ┌──────────────┼───────────────┐    Builder
                  │     ▼              ▼               ▼   (product)
                  │  Section 2     Section 3       Section 4
                  │  "Works the    "Take it        "Open core,
                  │   way you       anywhere"      yours to keep"
                  │   talk"        (export +        (subtle Easter
                  │  (3 modes:     hand off)         egg → AISP
                  │   Builder /                     repo)
                  │   Chat /              │
                  │   Listen)             ▼
                  │                  Section 5
                  │              Closing CTA + footer
                  │
        ┌─────────┼─────────┐──────────────────┐
        ▼         ▼         ▼                  ▼
      About     Blog    Research            Docs / BYOK
     (story)  (12+3   (engineer          (functional ref)
              posts)   track home)
                          │
                ┌─────────┼──────────┬──────────────┐
                ▼         ▼          ▼              ▼
              /aisp   /open-core   /how-i-     /progress
            (AISP   (open-core    built-this  (build telemetry)
            tech)    boundary)   (build story)
                                       │
                                       ▼
                              github.com/bar181/
                              aisp-open-core
                            (Easter-egg ribbon)
```

The new flow has **3 entry points by audience**:
1. **Universal user** → home → 3 mode CTAs / blog / about. No numbers, no jargon, no competitors.
2. **Agentic engineer** → home (Section 4 Easter-egg) OR direct to /research → /aisp / /open-core / /how-i-built-this / /progress. Phase numbers + atom names + ADR refs survive here.
3. **Reader / build-in-public follower** → /blog → individual posts (competitor names + jargon allowed in posts).

## Recommendation: agentic-engineer-track home

**Use `/research` (Research.tsx) as-is.** Reasons:
1. Already image-first (cover image L13-17 + theme-agency L111 + example previews L268-269) — Apple-adjacent.
2. Already long-form story structure (Act I / Act II / Act III / Landscape / What Becomes Possible) — narrative-first like the new Welcome.
3. Already has the competitor landscape table (L218-251) appropriately scoped (research framing).
4. Already cross-references /aisp + /onboarding (now /new-project) + AISP repo.
5. Adding a new `/for-developers` route would split the audience and create the same engineering-vs-marketing dilemma the project is trying to escape.

**One blog frontmatter risk to flag:** the 12 existing posts have INCONSISTENT frontmatter (some have `slug` + `excerpt` + `tags`, others have `author` + `category` instead). Before F3 ships 3 new posts, W2 should pick one canonical shape (recommend the `the-55-percent-problem.md` shape — `title` / `slug` / `date` / `excerpt` / `tags[]`) and either backfill the 4 posts that don't conform OR ensure `lib/blogPosts.ts` handles both shapes (likely already does — listBlogPosts() / listBlogTags() runs without errors today). Confirm before F3 authors new posts.

## Easter-egg surface plan

The `bar181/aisp-open-core` link surfaces in **3 progressively-deeper places**:

1. **Welcome — Section 4 (subtle).** Section 4 ("Open core, yours to keep") closes with one-line: "What's coming next →" (anchor only, no logo, no count, no atom names). Cursor reveals the subtle hint that there's more under the hood for the curious.
2. **/research — Header ribbon (named).** Top of page, above hero: a single-line ribbon "Read what's coming next →" linking to `bar181/aisp-open-core`. Dismissable. Engineer audience that landed here is already self-selected.
3. **Blog post 3 footer (named).** The third NEW post (engineer-track post in F3) closes with explicit: "Want the underlying spec language? It's open-source at github.com/bar181/aisp-open-core."

Copy convention: use **"Read what's coming next →"** as the recurring phrase across all three surfaces — gives the link a recognizable shape regardless of where it appears.

## W2 dispatch readiness

- [x] All audit findings closable in W2 / 3 disjoint-scope agents
- [x] No surface-area conflicts between F1 / F2 / F3 (F1 owns Welcome.tsx + MarketingNav.tsx; F2 owns useReveal hook in src/hooks/; F3 owns About.tsx + OpenCore.tsx + Research.tsx + HowIBuiltThis.tsx + Blog.tsx + Progress.tsx + 3 new blog posts)
- [x] Sample blog frontmatter confirmed at `src/pages/blog/posts/the-55-percent-problem.md` (canonical) and `src/pages/blog/posts/lovable-vs-hey-bradley.md` (variant — flag for F3)
- [x] Welcome rewrite scope is genuinely 5 sections worth (not 8): Hero / Works the way you talk (3 modes) / Take it anywhere (export + hand off) / Open core yours to keep (Easter egg) / Closing CTA + footer. Section 6+ was scoreboard / blog preview / story copy — all of which migrate to /research, /blog, or /about.

## Honest carry-forwards beyond W2

- Frontmatter normalization across the 12 existing blog posts (some need backfill).
- `OpenCoreVsCommercial` component (L443) NOT audited — it's a separate import from `@/components/marketing/`; if it carries numbers or competitor names they need a follow-up F3 sub-task.
- `AISPDualView` component (L252 in AISP.tsx) NOT audited — same caveat.
- `/spec/:hash` SharedSpec page NOT audited (user-generated content surface).
- Demo routes (`/demo/listen`, `/demo/chat`, `/demo/full-site`) NOT audited (interactive product surfaces, not story pages).
- Internal product surfaces (`/builder`, `/new-project`, `/planning`, `/agentics`) explicitly out of scope per the brief.
