# P118 — Simple Messaging + Product-Market Fit — Preflight

> **Phase:** P118 · **Sprint:** SIMPLE-MESSAGING-AND-POSITIONING · **Date:** 2026-05-06
> **Branch:** swarm/p118-simple-messaging
> **Predecessor:** P117 sealed at `2d44cc0`

## Mandate

The owner has crystallized positioning that finally fits the product. Today's public messaging ("Spec workbench · AISP-powered · Harvard ALM Capstone" → "Messy ideas → enterprise specs, instantly") narrows Hey Bradley to a developer-tooling artifact and buries the universal pain point. The product actually solves the **largest underserved market in web software** — people who tried Wix / WordPress / Lovable and were failed by every existing tool.

This phase reframes the public surface around the simpler, more honest, more relatable positioning the owner stated:

> **Describe it. See it.**

Tech details and AISP/Crystal-Atom/CLAUDE.md depth move to a blog/resources tier. The visitor — not the architecture — is the hero.

## The owner's positioning (verbatim, locked as source of truth)

```
WordPress  → nightmare, even for devs
Wix        → 10 hours to learn, ceiling unclear
Lovable    → easiest but requires knowing what you want
             AND knowing when to stop
Hey Bradley → describe it, see it, done
              works for grandma AND the agentic engineer
```

**The two-stage product:**
- **Stage 1 (shipped):** anyone — grandma to L8 — describes a site, sees it live, iterates by talking or clicking. Real multi-page marketing sites with real copy and real design.
- **Stage 2 (the moat):** JSON + CLAUDE.md export is a machine-readable contract any developer hands to Claude Code → production site, zero clarifying questions.

**The architectural moat (named clearly for the first time):**
Every other builder regenerates from scratch. Hey Bradley sends a **JSON-patch diff** to a known schema. The LLM replies with a patch — not a rebuild. **10–100× cost advantage per interaction.** Cheap or free LLMs can power it accurately because the JSON IS the spec.

## Closer's editorial review of the messaging (honest)

### Strong (keep)
1. **"Describe it. See it."** is the right three-word lock — Apple-style; user-as-hero; zero jargon. Use as the H1 across the public surface.
2. **The 4-row builder comparison table** is the single most persuasive artifact in the message. It does in 5 lines what the current OpenCore "55% problem" hero does in 50 words. **Land it on the home page above the fold.**
3. **The two-stage frame** ("describe it → see it" then "hand the export to Claude Code → production") is honest and unique. No competitor can claim it.
4. **The JSON-patch insight as cost moat** is the right secondary frame — explain it ONCE in a single blog (the agentic-engineer-friendly one), not on the home page.
5. **"Works for grandma AND the agentic engineer"** is the right inclusivity framing — but lead with grandma; the engineer mention proves craft, not market.

### Watch out for (calibrate before shipping)
1. **"Done"** is doing a lot of work. The product produces a real multi-page site you can preview, iterate, and export — but **domain hosting / one-click deploy is NOT shipped**. The "done" promise has to land on the export-to-Claude-Code handoff, not on hosted publishing. Phrase as "describe it · see it · take it anywhere." Or: "describe it · see it · ship it (with your tools)." The handoff IS the deployment story today; we own that honestly.
2. **The market-size claim** ($6.3B → $31.5B by 2033; Lovable 8M / Bolt 5M / Replit 40M) is from the owner's source — it's powerful for a pitch deck, but **doesn't belong on a public marketing page**. It belongs in About, in a single paragraph, with a "Source: [linked report]" footnote. The public hero doesn't need numbers; it needs empathy.
3. **"Apple-style" positioning** is the right north star but a real risk if we drift toward over-promised polish. Apple gets to be cryptic because the brand pre-sells the product. We don't have that brand equity yet — every line of copy still has to teach. Keep the H1 cryptic ("Describe it. See it.") but the H2 must explicitly answer "for whom and what for" in plain English.
4. **The "agentic engineer" audience** is real but second-order. Surface it via a tab or a separate page (`/research` or `/for-developers`), not on the home page. Otherwise we'll lose grandma in the second paragraph.
5. **"Not a niche product for agentic engineers"** is the right line internally but **should not appear in any public copy** — naming the tribe you're not for sets up confusion. Just lead with the broader audience and let the engineer-friendly content live in the resources tab.

### What we should add that's not yet in the message
1. **One sentence about pricing reality.** Open-core / MIT / BYOK / free to try. The hostility to "another SaaS" is real.
2. **One sentence about what Hey Bradley deliberately is not.** Not a hosted publishing platform. Not a CMS. Not a code generator. It's the easiest place to *describe* a website + the cleanest *handoff* to whoever ships it.
3. **A single visible artifact of trust** — the Harvard ALM Capstone tag, ADR ledger count, or test count — but tucked into a small footer band, not in the hero. The current Welcome leads with three trust markers in the eyebrow; in the new design only one survives, smallest-text, in a footer ribbon.

### Net verdict on the owner's message
**9.0 / 10** — best public positioning the project has had since launch. The two calibrations needed before shipping are: (1) replace "done" with "ship it (with your tools)" until hosted deploy lands; (2) keep the engineer audience visible-but-secondary (separate page, not homepage). Everything else lands as written.

## Audit — current public-facing pages (what each does today)

| Page | Path | Current purpose | Audience served | Notes |
|---|---|---|---|---|
| **Welcome** | `/` (entry) | Spec-workbench framing; "Messy ideas → enterprise specs"; 3 mode cards (Builder/Chat/Listen); recent projects card; recent blog posts | Developer / agentic-engineer | **Primary reframe target — owns the H1 lock** |
| **About** | `/about` | "Meet Bradley" + Harvard ALM + capstone scoreboard ("As of P109") + journey | Engaged visitors / academics | Polish needed — keep narrative, demote scoreboard, reorder |
| **OpenCore** | `/open-core` | "The 55% problem" + open-core vs commercial; MIT license | Devs evaluating open-source seriousness | Keep "55%" framing as secondary positioning here; tighten to MIT + BYOK story |
| **AISP** | `/aisp` | AISP protocol explainer; 9-atom suite; adoption CTA | AISP adopters / agentic-engineers | Keep technical; link from new resources tab |
| **HowIBuiltThis** | `/how-i-built-this` | Build journey; tools used; capstone narrative | Curious devs / academics | Keep — lower-funnel artifact |
| **Docs** | `/docs` | API docs / module references | Developers | Keep |
| **BYOK** | `/byok` | BYOK key-storage explainer + provider matrix | Active users | Keep |
| **Blog** | `/blog` (+ `/blog/<slug>`) | 12 posts (built-open-core / 55-percent / spec-first / agentic-engineering / Lovable-vs-HB / etc) | All audiences | **Add 2 new posts this sprint — see Wave 2** |
| **Progress** | `/progress` | Build-in-public ledger | Followers / academics | Keep |
| **Research** | `/research` | (TBC — confirm content) | Academics | **Audit. Likely the home for engineer-track content if real.** |

The audit confirms the visitor journey today is **engineer → engineer → engineer** at every front door. P118 splits the audience into two visible tracks while keeping the engineer-track honest and rich.

## Plan — 3 disjoint waves

### Wave 1 — READ-ONLY public-page audit + per-page intent map
**Owns:** `docs/audit/p118-public-pages-inventory.md` (NEW; ≤350 LOC)
- Open every page in `src/pages/` reachable via `MarketingNav`
- For each: (a) current H1, (b) current value prop, (c) audience served, (d) which 1 thing must change
- Final table: page → keep / reframe / demote / new-link-target
- Site-map diagram (text) showing the new visitor journey: home → builder, home → resources, home → about, home → blog
- Identify the right home for the agentic-engineer track (recommend `/research` or new `/for-developers`)
- ZERO source code changes in Wave 1

### Wave 2 — Three parallel disjoint-scope fix agents

#### F1 — Welcome.tsx reframe (THE primary surface)
**Owns:** `src/pages/Welcome.tsx` (full rewrite of hero + 4-row table + below-fold sections)
- New H1: **"Describe it. See it."**
- New H2 (1 sentence, plain English): "The website builder that finally works the way you talk."
- Below H2: insert the **owner's 4-row comparison table** verbatim (WordPress / Wix / Lovable / Hey Bradley)
- Below table: 1 sentence: "For grandma. For the founder. For the agent that ships."
- Existing 3-mode card grid (Builder / Chat / Listen) stays — they're already user-language
- Below the cards: NEW honest-promise band: "describe it · see it · take it anywhere"
- Below promise: NEW "for the agentic engineer" small-link card → `/research` (lower-priority position, single line, not a hero)
- Footer ribbon: keep ONE trust marker (Harvard ALM tag or test count) in 12px text
- Recent blog posts card stays
- Recent projects card stays
- Token-compliant per ADR-087/091; mobile-first per ADR-090; ≤44px touch targets
- Cap: full file ≤320 LOC (current 315; surgical net delta)

#### F2 — Two NEW blog posts
**Owns:** `src/pages/blog/posts/describe-it-see-it.md` + `src/pages/blog/posts/the-json-that-changes-everything.md`
- Post 1: `describe-it-see-it.md` — narrative for the universal audience. Stories, not specs. Open with "Grandma's tutoring business" or similar relatable story. ~700-1000 words. Per-paragraph storytelling; no jargon for first 60% of post. Last 40% can introduce CLAUDE.md handoff for readers who want to dig deeper.
- Post 2: `the-json-that-changes-everything.md` — the technical insight. JSON-patch as architectural moat. 10-100× cost advantage. Spec IS the JSON. CLAUDE.md is just a wrapper. ~1000-1400 words. **Aimed at the agentic-engineer + indie-dev audience.** Cite real LLM cost arithmetic. Diagram the patch-vs-rebuild loop.
- Both posts use existing blog frontmatter shape (read 2 existing posts to mirror exactly)
- Each post must include `voice: ` attribute consistent with founder-direct or theron-miller-hard-twist storytelling preset (per ADR-141)

#### F3 — Public-page polish (About + OpenCore + Blog index card-treatment)
**Owns:** `src/pages/About.tsx` + `src/pages/OpenCore.tsx` + `src/pages/Blog.tsx`
- About.tsx: keep "Meet Bradley" H1; keep narrative; **demote** the capstone scoreboard from a hero callout to a small footer card; add a 2-sentence "what this product is" paragraph above the capstone narrative ("Hey Bradley is a website builder for everyone who's been failed by Wix / WordPress / Lovable. It's also the cleanest way to hand a website spec to Claude Code or any AI dev tool."); update P109 reference to current ADR/test count (post-P117: 136 ADRs, ~1659+ tests)
- OpenCore.tsx: keep "55% problem" frame as the *second-tier* positioning (still strong for dev audience); add a small "for non-developers, start here →" link at top pointing to `/`
- Blog.tsx: ensure the 2 new posts surface in the listing; verify the existing post grouping still works
- Cap: ≤80 LOC delta total across the 3 files

### Wave 3 — Closer
- ADR-146 (Simple Messaging + Product-Market Fit Standard) ≤120 LOC
- `tests/p118-simple-messaging.spec.ts` (≥10 cases — H1 / table / blog count / About reframe / OpenCore link / no-jargon-first-paragraph soft-asserts)
- EOP triplet (preflight already at root; add session-log + retrospective)
- CLAUDE.md sync (P118 entry; Blog count 12 → 14; ADR ledger 136 → 137; positioning anchor change)
- `docs/adr/README.md` counter bump 136 → 137

## Hard rules

1. NO new dependencies
2. ADR-146 ≤120 LOC
3. Welcome.tsx total ≤320 LOC after rewrite
4. Each new blog post 700-1400 words; existing frontmatter shape preserved
5. Token compliance per ADR-087/091
6. Mobile-first per ADR-090 + 44px touch targets
7. Both tsc strict configs CLEAN
8. EOP triplet at phase root
9. **NO market-size figures on any public page** (About is allowed one paragraph with cited footnote)
10. **NO Crystal-Atom / AISP / CLAUDE.md / DDD jargon in the first 100 words of Welcome.tsx** — those words live in the resources tier exclusively for Wave 2's F1
11. **The phrase "agentic engineer" appears at most ONCE in any public-page hero** — and only via a small link to a separate page

## Acceptance gates

- 1 audit doc landed (`docs/audit/p118-public-pages-inventory.md`)
- Welcome.tsx reframed with new H1 + 4-row table + honest-promise band
- 2 new blog posts at `src/pages/blog/posts/{describe-it-see-it,the-json-that-changes-everything}.md`
- About.tsx + OpenCore.tsx + Blog.tsx polished per F3
- ADR-146 Accepted
- ≥10 P118 tests GREEN
- Cumulative regression preserved (~1669+ at P118 anchor)
- Both tsc strict configs CLEAN
- CLAUDE.md + ADR README synced (137 ADRs · 14 blog posts)

## Carry-forward (out of scope this sprint, captured for honesty)

- One-click hosted deploy → Tier-2 commercial; the export-to-Claude-Code handoff IS the deployment story at open-core
- Internationalized copy → post-RC owner-track
- A/B testing of the new H1 → post-RC analytics
- Video demo of "describe it · see it" flow → owner-action (cannot record from sandbox)
- Restaurant / non-profit / fiction site shapes weak per P117/A3 — schema-enum widening still pending; revisit P119+
