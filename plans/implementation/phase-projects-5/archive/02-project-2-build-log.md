# Project 2 — GreenLane Startup Landing (Marcus / Don Miller)

5-PROJECTS sprint · Project 2 of 5. Persona: Marcus Reyes — technical founder, mid-30s, CEO of GreenLane, a fictional B2B SaaS that automates compliance reporting for clean-energy startups. Voice goal: confident, founder-direct, Don Miller "you-the-hero" framing — but landing, by turn 7, on "understated professional with conviction."

Audience: business buyers (compliance officers, CFOs, ESG investors). Story-brand arc: Hero (the founder) → Problem (paperwork tax) → Guide (GreenLane / Marcus) → Plan (3-step how-it-works) → CTA (book a demo).

## Per-turn build table

| # | User prompt (paraphrased) | Atom path | Sections / fields touched | Confidence | Voice delta |
|---|---------------------------|-----------|----------------------------|------------|-------------|
| 1 | Build a SaaS landing page for GreenLane — automated compliance reporting for clean-energy startups | INTENT → SELECTION → PATCH | site.title / site.purpose=saas / site.audience=business / theme.preset=saas / scaffold sections [menu, hero, columns, pricing, action, footer] | 0.88 | startup-bro baseline (`["bold","direct","fast"]`) |
| 2 | Lead with the customer's problem, not features. They're drowning in regulatory paperwork — make that visible | INTENT → CONTENT | insertAt /sections[1] new `text` "problem-01" two-column block; subtitle reframed from feature-led to customer-pain-led | 0.84 | unchanged |
| 3 | Hero copy should follow Don Miller — "You're a clean-energy founder. You're spending 40 hours a week on compliance reports instead of building product." | INTENT → PATCH (verbatim_capture) | sections[0].components[1].props.text ← verbatim hero headline; eyebrow → "Compliance reporting · automated · for clean-energy startups"; subtitle regenerated in Don-Miller-you-the-hero voice | 0.92 | shifts toward `["confident","direct"]` — the "you" framing locks in |
| 4 | Add a "How it works" section — 3 steps with icons (connect, automate, ship) | DECOMP → CONTENT (3 todos) | columns "how-it-works-01" with 3 feature-cards: Connect (plug icon) / Automate (zap icon) / Ship (send icon); content.heading "How GreenLane works" | 0.91 | inherits `["confident","direct"]` |
| 5 | Add pricing — 3 tiers: starter $299/mo, growth $999/mo, enterprise contact | DECOMP → PATCH (3 todos) | pricing "pricing-01" with 3 tiers; growth highlighted; `features` strings populated with concrete deliverables (frameworks, frequencies, support tiers) | 0.93 | inherits |
| 6 | Add a team section — me (Marcus, CEO/founder), Priya (CTO), and Diego (Head of Compliance) | DECOMP → CONTENT (3 todos) | team "team-01" with 3 team-members: Marcus Reyes / Priya Anand / Diego Marín; bios written in founder-direct voice | 0.94 | inherits |
| 7 | Make the voice slightly less startup-bro and more "understated professional with conviction" | INTENT (voice refinement) → CONTENT (regen 4 surfaces) | site.voiceAttributes ← `["confident","direct","understated"]`; regen subtitle / problem body / step descriptions / team bios with the new voice attribute applied | 0.89 | **voice locks: `["confident","direct","understated"]`** — adds restraint, removes hyperbole |
| 8 | Add a CTA: "See your compliance hours go to 4. Book a 20-minute demo." | INTENT → PATCH (verbatim_capture) | action "cta-01" with verbatim heading + supporting copy + button + fine-print; brand-accent gold (`#a8946a`) on button against deep-green (`#1f5d3a`) bg | 0.95 | final voice held |

## Brand-voice accumulator (turn-by-turn)

| Turn | `voiceAttributes` state | Trigger |
|------|-------------------------|---------|
| 1 | `["bold","direct","fast"]` (default startup baseline) | scaffold |
| 2 | `["bold","direct","fast"]` | no voice signal in prompt 2 |
| 3 | `["confident","direct","fast"]` (Don Miller you-the-hero shifts "bold" → "confident") | hero verbatim implies "you-the-hero" framing |
| 4 | `["confident","direct","fast"]` | no voice signal |
| 5 | `["confident","direct","fast"]` | no voice signal |
| 6 | `["confident","direct","fast"]` | no voice signal |
| 7 | **`["confident","direct","understated"]`** | explicit refinement: "less startup-bro, more understated professional with conviction" → drop "fast" (the bro-adjacent token), add "understated" |
| 8 | `["confident","direct","understated"]` | held |

## Don Miller story-brand arc (final layout)

| Section order | Type | Story-brand role | Owner |
|---------------|------|------------------|-------|
| -1 | menu | navigation | Marcus |
| 0 | hero | **Hero (you, the clean-energy founder)** + tagline = "Get your compliance hours back. Build the company." | Marcus + voice turn 3 |
| 1 | text (two-column) | **Problem (paperwork tax)** | turn 2 + voice turn 7 |
| 2 | columns (3-step) | **Plan / Guide (3-step how-it-works)** | turn 4 |
| 3 | pricing | **Plan (commitment ladder)** | turn 5 |
| 4 | team | **Guide (the founders who lived this problem)** | turn 6 |
| 5 | action (CTA) | **Call (book a demo, see hours go to 4)** | turn 8 |
| 6 | footer | trust | Marcus |

8 sections (excluding menu = 7 content sections + footer). Within `≥7, ≤12` budget. Single-page.

## Voice receipts — 4 illustrative regens at turn 7

**Hero subtitle (turn 7 regen)**

- Pre-turn-7: "GreenLane is the automated compliance platform built for clean-energy startups. Stop wasting cycles on paperwork. Move faster. Win bigger."
- Post-turn-7: "GreenLane connects to your existing systems, generates regulator-ready reports automatically, and gives you back the four-day work-week your investors thought you already had. The first report runs in under an hour. The next thousand run themselves."

**Problem body (turn 7 regen)**

- Pre-turn-7: "Compliance is killing your runway. Stop letting paperwork win. Get your time back."
- Post-turn-7: "If you are running a clean-energy startup right now, you already know the math. There are 17 active reporting frameworks. Three of them changed last quarter. Your customers are asking for one. Your auditor wants another. Your largest investor's ESG team has invented a third."

**Step 1 description (turn 7 regen)**

- Pre-turn-7: "Plug us in. Twenty minutes. Done."
- Post-turn-7: "Connect your data sources in under twenty minutes — utility meters, SCADA exports, accounting, payroll, the lot. We use the same read-only credentials your auditor already has. Nothing leaves your perimeter without your sign-off."

**Marcus bio (turn 7 regen)**

- Pre-turn-7: "Founder. Operator. Built GreenLane to crush compliance once and for all."
- Post-turn-7: "Spent four years running operations at a Series B solar startup. Wrote the compliance report by hand once. Decided that was enough for one career. Started GreenLane to make sure no other founder has to do it twice."

The post-turn-7 voice is recognizably Marcus — confident and direct, but the bro-cadence is gone. Specifics replace adjectives. Numbers replace claims. Restraint replaces hyperbole.

## Don Miller framing — receipts

- **Hero is the customer**, not the company. Headline: "You're a clean-energy founder. You're spending 40 hours a week on compliance reports instead of building product." (Subject = "you," not "GreenLane.")
- **Problem is named, not implied.** Section 1 enumerates the pain in concrete terms (17 frameworks, 3 changed last quarter, two-week quarterly tax) before any product claim is made.
- **Guide is the founder.** Marcus's bio in the team section closes the "I have done this; I am the right guide" loop ("Wrote the compliance report by hand once. Decided that was enough for one career.").
- **Plan is three steps** (Connect / Automate / Ship), each with one icon and one short paragraph.
- **Call is concrete and reversible.** "See your compliance hours go to 4. Book a 20-minute demo." — specific outcome, specific time commitment, specific revocability.

## Section-count + schema check

| Constraint | Required | Actual |
|------------|----------|--------|
| Sections ≥7, ≤12 | 7-12 | **8** (menu + hero + text + columns + pricing + team + action + footer) |
| Single-page | yes | yes (no `pages[]`) |
| Section types valid | 18-enum per ADR-100 / sectionTypeSchema | menu / hero / text / columns / pricing / team / action / footer — all in enum |
| Real opinionated copy (no Lorem) | yes | yes |
| `voiceAttributes` final | confident, direct, understated | matches |
| Tagline in Don Miller hook form | yes | "Get your compliance hours back. Build the company." |

## Sibling parallel

- Project 1 — Axon CLI dev (separate owned-files set)
- Project 3 — Sarah agency (separate owned-files set)
- Project 4 — Grandma listen (separate owned-files set)
- Project 5 — Lars agentic (separate owned-files set)

No shared mutable surface between projects; safe under disjoint-ownedFiles invariant per ADR-120 Γ R3 + Ε V1.

## Honest deferred

- Voice-attribute auto-derivation from free-form prose ("less startup-bro, more understated") — currently rules-based shim with hand-curated dictionary; full LLM-enriched voice classifier is post-RC commercial.
- Per-section voice diff visualization (pre-regen vs post-regen) — would help users understand what turn 7 actually changed; deferred to Tier-2 ConversationLog enrichment.
- Don Miller framework auto-detection (parse user prompt for "story brand" / "you-the-hero" lexicon and lock the framing) — deferred to template-intelligence Wave 2.
