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

#### F1 — Welcome.tsx reframe (THE primary surface) — Apple-style scroll story
**Owns:** `src/pages/Welcome.tsx` (full rewrite); 1 NEW shared hook `src/hooks/useReveal.ts` (≤40 LOC; intersection-observer fade-in; no new deps)

Apple-style 5-section scroll story. Story-first; no numbers; no competitor names; no jargon in first 100 words. **Each section is one idea, lots of whitespace, one image or animated element.**

**Section 1 — Hero (above fold)**
- H1: **Describe it. See it.**
- H2 (one sentence, plain English): "The website builder that finally works the way you talk."
- Primary CTA: "Start describing →" (links `/new-project`)
- Secondary CTA: "See how it works" (anchor scroll to Section 2)
- Visual: large animated SVG/CSS demo (no library) — typing animation of a sentence morphing into a styled hero section. Pure CSS keyframes + delayed render via the new `useReveal` hook. Falls back to static image if reduced-motion preferred.
- ZERO trust eyebrow on the hero — clean. Trust band moves to footer.

**Section 2 — "It works the way you talk."**
- Single sentence headline.
- One supporting sentence: "Speak it. Type it. Drag it. Whatever feels right today."
- Visual: 3 small icon-glyphs (mic / chat / drag) with subtle hover-scale; clicking each opens the relevant mode.
- This replaces the current 3-mode card grid (which is fine but reads like a feature list, not a story).

**Section 3 — "Take it anywhere."**
- Headline: "Take it anywhere."
- Story (3-4 sentences, no jargon, no numbers): introduces the export-to-AI-coding-tool handoff as a *story*. "When you're ready, hand the export to your developer — or to your AI coding assistant. They get the spec they wish every project came with. No clarifying calls. No re-explaining what you meant."
- Visual: animated card showing a JSON-shaped object morphing into a folder of files (CSS keyframes).
- Small link: "Read how the handoff works →" links to blog post 1.

**Section 4 — "Open core. Yours to keep."**
- Headline: "Open core. Yours to keep."
- Story (4 sentences): explains MIT / BYOK / no lock-in in user words. "Built in the open. Free to try. Bring your own API key. Take your work with you whenever you want."
- Visual: GitHub mark + `bar181/aisp-open-core` link (Easter egg — nod to upcoming developments without explaining them).
- Small link: "What's an Easter egg here? →" → links to a tiny `/easter-eggs` page (or repurposes `/research` as the home for the engineer-track + Easter eggs).

**Section 5 — Closing CTA + Trust ribbon**
- Single H2: "From your idea to a real site, in your words."
- One large CTA button: "Start describing →"
- Below: thin trust ribbon (12px, muted, single line): "Open source · MIT licensed · Built at Harvard"
- No numbers. No counts. No phase ledger. The work proves itself by being there.

**Removed from Welcome.tsx (moved out):**
- ❌ The 4-row competitor comparison table → moved to blog post 1
- ❌ "Spec workbench · AISP-powered · Harvard ALM Capstone" eyebrow
- ❌ "Messy ideas → enterprise specs, instantly." H1
- ❌ The AISP atom trace mono-font line
- ❌ Recent blog posts card (demoted; visible via `/blog`)
- ❌ Recent projects card (visible via `/builder` post-login)
- ❌ Test counts / ADR counts / phase numbers — anywhere

**Caps:**
- Welcome.tsx total ≤280 LOC (currently 315; the rewrite is leaner because we strip more than we add)
- useReveal hook ≤40 LOC; intersection-observer + reduced-motion respect
- Token compliance per ADR-087/091; mobile-first per ADR-090; ≤44px touch targets per ADR-112
- All animation is CSS keyframes + native intersection-observer JS — **NO** framer-motion, gsap, lottie, animejs, react-spring (KISS denylist per ADR-144 D5)

#### F2 — Three NEW blog posts (story-first; carry the comparison + numbers + technical depth)
**Owns:** `src/pages/blog/posts/describe-it-see-it.md` + `src/pages/blog/posts/why-we-built-this-the-honest-version.md` + `src/pages/blog/posts/the-handoff-that-changes-everything.md`

**Post 1 — `describe-it-see-it.md`** (universal narrative; the home-page visitor's blog jump)
- Open with a relatable story (boutique business owner / parent organizing a fundraiser / freelancer with a portfolio they keep meaning to refresh)
- Walk the story through the product: they describe → they see → they iterate → they ship
- ~800-1100 words; zero jargon for the first 70% of the post
- Voice: founder-direct preset (per ADR-141)
- The 4-row comparison table (WordPress / Wix / Lovable / Hey Bradley) lives HERE as a small mid-post artifact, not on the home page

**Post 2 — `why-we-built-this-the-honest-version.md`** (the "why now" story)
- The story behind the build — what was broken about every existing tool, what it felt like to use them, why the team started over
- Names competitors honestly but generously; names the universal pain point
- ~900-1200 words
- Voice: theron-miller-hard-twist preset
- This is where the "55% problem" / "everyone Wix lost" / "everyone Lovable frustrated" lines go — out of the way of the home page but findable in the blog

**Post 3 — `the-handoff-that-changes-everything.md`** (engineer-facing; the technical moat)
- The architectural insight: JSON-patch diffs vs rebuilds; spec IS the JSON; CLAUDE.md is the wrapper
- Cost arithmetic with rounded plain-English framing — "tens to hundreds of times cheaper per change" rather than literal numeric multipliers
- ~1100-1500 words
- Voice: founder-direct, more technical register
- Aimed at agentic engineers, indie devs, anyone evaluating the handoff seriously
- Links from `/research` (or new `/for-developers`) page

All 3 posts:
- Mirror existing blog frontmatter shape (read 2 existing posts to confirm)
- Include `voice:` attribute citing the storytelling preset
- Do not include phase numbers / ADR counts / test counts inside body copy

#### F3 — Public-page polish + animation rollout to siblings
**Owns:** `src/pages/About.tsx` + `src/pages/OpenCore.tsx` + `src/pages/Blog.tsx` + `src/pages/Research.tsx`
- **About.tsx**: keep "Meet Bradley" H1; story stays. **Strip the capstone scoreboard entirely** (the work proves itself; numbers leak academic framing into a consumer surface). Add a 2-sentence "what this is" paragraph above the journey: *"Hey Bradley is a website builder that works the way you talk. It's also the cleanest way to hand a finished website spec to your developer — or to your AI coding assistant."* Apply the `useReveal` hook to section transitions for the same fade-in story rhythm as Welcome.
- **OpenCore.tsx**: keep "55% problem" framing — but only as the *engineer-track* hero, not the consumer hero. Add a small soft-link at the top: "**For everyone else, start here →** /". Strip phase numbers from the body. Apply `useReveal`.
- **Blog.tsx**: ensure the 3 new posts (post 1 first; post 2 second; post 3 third by `published` date) surface at top of the index. Subtle fade-in on card scroll.
- **Research.tsx**: confirm or repurpose as the agentic-engineer track entry. Add an Easter-egg ribbon linking to `https://github.com/bar181/aisp-open-core` ("**Read what's coming next →**") with a hover-reveal description: this is where upcoming developments are sketched in public.
- Cap: ≤120 LOC delta total across the 4 files

### Wave 3 — Closer
- ADR-146 (Simple Messaging + Product-Market Fit Standard) ≤120 LOC
- `tests/p118-simple-messaging.spec.ts` (≥10 cases — H1 / table / blog count / About reframe / OpenCore link / no-jargon-first-paragraph soft-asserts)
- EOP triplet (preflight already at root; add session-log + retrospective)
- CLAUDE.md sync (P118 entry; Blog count 12 → 14; ADR ledger 136 → 137; positioning anchor change)
- `docs/adr/README.md` counter bump 136 → 137

## Core values to surface (Apple-style — story not list)

The owner's message names "Describe it. See it." as the headline. Beneath that, four core values must shine through the public surface (one per Welcome.tsx scroll section, deepened in the blog):

1. **It works the way you talk** — speech, chat, drag — meet the user where they are
2. **Take it anywhere** — the export-to-AI-coding-tool handoff IS the deployment story
3. **Open core. Yours to keep.** — MIT, BYOK, no lock-in, work travels with you
4. **Built in the open** — public repo, public ledger, public Easter eggs at `bar181/aisp-open-core` (where upcoming developments live before they ship)

These are the values, in the visitor's language. No phase numbers. No counts. No tribe-naming. The visitor is the hero.

## Visual & motion direction (Apple-pattern; KISS-compliant)

- **Whitespace dominates.** Each scroll section breathes. ≥120px vertical rhythm between sections on desktop, ≥80px on mobile.
- **One idea per section.** Each section says one thing and says it cleanly.
- **CSS animation only.** ADR-144 D5 KISS denylist still bars framer-motion, gsap, lottie, animejs, react-spring. We use CSS keyframes + intersection-observer fade-in (NEW `useReveal` hook ≤40 LOC) + native View Transitions where supported.
- **Image > paragraph.** Where text is doing too much work, replace it with a small illustration / SVG / animated CSS demo. The visual should reduce, not augment, the copy.
- **Reduced-motion respect.** Every animated element gates on `prefers-reduced-motion: reduce` and falls back to static.
- **Video deferred this sprint.** A real product-demo video is owner-recorded; provision a `<video>` slot in the Section 1 visual that's commented-out until owner uploads. Don't ship placeholder content.
- **Easter eggs allowed and named.** A subtle nod (link / hover-reveal / footer line) toward upcoming-but-unshipped features at `bar181/aisp-open-core`. The visitor who pokes around finds the next thing being built. The visitor who doesn't poke around isn't confused.

## Hard rules

1. **NO new dependencies** (animation included — CSS + native JS only; ADR-144 D5 KISS denylist enforced)
2. ADR-146 ≤120 LOC
3. Welcome.tsx total ≤280 LOC after rewrite
4. Each new blog post 800-1500 words; existing blog frontmatter shape preserved; voice attribute cites a Decision-2-of-ADR-141 storytelling preset
5. Token compliance per ADR-087/091; mobile-first per ADR-090 + 44px touch targets per ADR-112
6. Both tsc strict configs CLEAN
7. EOP triplet at phase root
8. **NO numbers on any public page.** No test counts, no ADR counts, no phase numbers, no market-size figures, no percentage claims, no LLM-cost multipliers. Numbers belong in the blog body where they can be sourced and contextualized.
9. **NO competitor names on any public page.** WordPress / Wix / Lovable / Bolt / Replit etc. live in blog posts. The home page does not name who failed the visitor before.
10. **NO Crystal-Atom / AISP / CLAUDE.md / DDD / JSON-patch jargon in any Welcome.tsx body copy.** Jargon lives in `/blog`, `/research`, `/aisp`, `/docs` — not on the consumer surface.
11. **The phrase "agentic engineer" never appears on Welcome.tsx.** It's allowed in `/research` and in blog post 3, where the audience self-selects.
12. **Reduced-motion respected on every animated element** (CSS `@media (prefers-reduced-motion)` or JS gate via `matchMedia`). Animation is decoration, never load-bearing.
13. **Easter-egg link to `bar181/aisp-open-core` is allowed and encouraged** in Section 4 ("Built in the open") and on Research — that's the "what's coming" surface.

## Acceptance gates

- 1 audit doc landed (`docs/audit/p118-public-pages-inventory.md`)
- Welcome.tsx reframed as 5-section Apple-style scroll story; H1 = "Describe it. See it."; zero numbers; zero competitor names
- 3 new blog posts at `src/pages/blog/posts/{describe-it-see-it,why-we-built-this-the-honest-version,the-handoff-that-changes-everything}.md`
- About.tsx scoreboard stripped + 2-sentence intro + useReveal applied
- OpenCore.tsx soft-link to `/` for non-developers + numbers stripped + useReveal applied
- Blog.tsx surfaces the 3 new posts at the top of the index
- Research.tsx confirms or becomes the agentic-engineer track + `bar181/aisp-open-core` Easter-egg ribbon
- NEW `src/hooks/useReveal.ts` (≤40 LOC; intersection-observer + reduced-motion gate)
- ADR-146 Accepted
- ≥10 P118 tests GREEN
- Cumulative regression preserved (~1669+ at P118 anchor)
- Both tsc strict configs CLEAN
- CLAUDE.md + ADR README synced (137 ADRs · 15 blog posts)
- Verified: zero `\d+` matches in Welcome.tsx body copy outside of `id`/`className`/coordinate-style attributes (sanity grep)
- Verified: zero competitor-name string literals in Welcome.tsx (`WordPress|Wix|Lovable|Bolt|Replit|Squarespace|Webflow|Framer`)

## Carry-forward (out of scope this sprint, captured for honesty)

- One-click hosted deploy → Tier-2 commercial; the export-to-Claude-Code handoff IS the deployment story at open-core
- Internationalized copy → post-RC owner-track
- A/B testing of the new H1 → post-RC analytics
- Video demo of "describe it · see it" flow → owner-action (cannot record from sandbox)
- Restaurant / non-profit / fiction site shapes weak per P117/A3 — schema-enum widening still pending; revisit P119+
