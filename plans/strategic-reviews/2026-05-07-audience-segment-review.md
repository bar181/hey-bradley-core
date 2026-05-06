# Audience Segment Review — Public Site Post-P119

> **Date:** 2026-05-07
> **Anchor:** P119 sealed at `ca1444b` (5 UX fixes + light/dark mode tokens + Harvard ALM Capstone math-first AISP context)
> **Surfaces in scope:** `/` Welcome · `/walkthrough` · `/about` · `/research` · `/aisp` · `/open-core` · `/blog` (15 posts incl. P118 trio) · `/docs` · `/byok` · MarketingNav

## Rubric (5 items per segment; 1-10 each; composite = mean)

1. **Find** — will they discover the right page from the front door?
2. **Get it** — does the messaging make sense in their language?
3. **Engage** — will they spend more than 90 seconds?
4. **Convert** — will they try the product (`/new-project` or `/walkthrough`)?
5. **Pay** — will they upgrade when a commercial tier ships?

Plus **Other** — single honest sentence naming the biggest unaddressed friction for this segment.

---

## Segment 1 — Big Tech / Funded Startup Acquirer (acqui-hire scenario)

| Rubric | Score | Notes |
|---|---|---|
| Find | 6 | Welcome lands them on a consumer pitch; they need /research and /open-core to evaluate craft + moat. No nav-level signal "this product is investable" |
| Get it | 7 | Once on /research the architectural moat is clear (telephone-game math + AISP); /open-core spec-first thesis intact |
| Engage | 7 | Bradley's About + Research + AISP read as serious work; the public ledger (commits, ADRs in repo) IS visible to anyone who looks; Easter-egg ribbon to bar181/aisp-open-core signals "more coming" |
| Convert | 5 | "Convert" for this segment = email or LinkedIn outreach. About has no contact path; About bottom CTA is "Try the open source version" — no investor/partner door. Major gap. |
| Pay | n/a (acqui-hire is the conversion) | Commercial tier irrelevant to this audience |

**Composite: 6.3 / 10**
**Other:** No "for investors / partners / acquirers" surface. Bradley's contact info, GitHub, capstone defense schedule, and a one-pager are all missing. The acquirer who lands here has no clear next step beyond starring the repo.

---

## Segment 2 — Agentic Engineers L5+ (senior, AI-native, evaluating the architecture)

| Rubric | Score | Notes |
|---|---|---|
| Find | 8 | Nav surfaces /research + /open-core directly; engineer-track entries clear once nav is read |
| Get it | 9 | /research math + /aisp ambiguity bars + the-handoff-that-changes-everything blog post hit hard. JSON-patch moat named explicitly. |
| Engage | 9 | Math-first AISP context (post-P119) gives them what they want — Harvard ALM Capstone citation lands as "this is real research, not pitch deck" |
| Convert | 8 | Easter-egg link to bar181/aisp-open-core is bait; they'll fork the repo even before trying the builder |
| Pay | 7 | Will pay for the *handoff format* in their stack; less likely to pay for a builder UI they don't need |

**Composite: 8.2 / 10**
**Other:** Highest-fit segment. Missing piece: a "for engineers" tab in MarketingNav that links straight to /research — currently the engineer-track entry is mid-nav at slot #3.

---

## Segment 3 — L4-L6 Developers (broader engineering audience)

| Rubric | Score | Notes |
|---|---|---|
| Find | 6 | Welcome is consumer-pitch; they may not realize there's an engineer track. The "For everyone else, start here →" link on /open-core is for non-engineers — they're already on the right page but the nav doesn't signal it |
| Get it | 8 | Once on /open-core or post 3, the value is clear |
| Engage | 7 | They'll read post 3 (handoff blog); /research math reads as Harvard-grade to a non-PhD engineer (good) |
| Convert | 6 | They'll try /new-project but bounce if the builder feels too consumer; need to see the export to convert seriously |
| Pay | 5 | Personal use yes; team adoption requires manager buy-in not addressed by the public site |

**Composite: 6.4 / 10**
**Other:** They land on Welcome → bounce or scroll-skim → may never reach the engineer tier. A 1-line "Are you a developer? See the spec output →" link in the Welcome footer or in MarketingNav as "For developers" tab would lift this segment 2-3 points.

---

## Segment 4 — Product Teams Transitioning Cursor → Claude Code (average dev firms)

| Rubric | Score | Notes |
|---|---|---|
| Find | 7 | The handoff blog post is bullseye but buried 3 clicks deep |
| Get it | 9 | "He opened it in his AI coding assistant. He didn't ask me a single clarifying question" (Walkthrough Scene 5) is THIS audience's pain, named precisely |
| Engage | 8 | /open-core spec-first framing + post 3 + Walkthrough cover the buying-committee story |
| Convert | 7 | Conversion path = team trial; needs an integration page that doesn't exist yet ("works with Claude Code, Cursor, Codeium, Windsurf") |
| Pay | 9 | Highest pay-likelihood segment — they have budget, are actively switching tools, and have a clear before/after value prop |

**Composite: 8.0 / 10**
**Other:** Missing dedicated landing page like `/for-teams` or `/integrations` showing the export → AI coding assistant flow with screenshots from each major tool. Closest existing surface is post 3, which is one user's narrative, not a procurement-grade reference.

---

## Segment 5 — Agencies / Standard Dev Firms

| Rubric | Score | Notes |
|---|---|---|
| Find | 6 | /open-core attracts them ("hand it to your developer"); Walkthrough's "my nephew" framing reads casual for B2B |
| Get it | 7 | Spec-first framing translates to agency client-comms problem; they recognize the deliverable shape |
| Engage | 6 | No case-study format; agencies want client wins with measurable handoff time saved |
| Convert | 6 | They'll try /new-project; need to see how the export goes to a real client |
| Pay | 8 | High budget; B2B SaaS-fluent; if commercial tier supports white-label or per-seat pricing they're prime |

**Composite: 6.6 / 10**
**Other:** Tonal mismatch — "my nephew" works for indie founders; B2B agencies need "we cut spec-to-ship from 3 weeks to 4 days for ClientName." No case-study content yet. Future blog post candidate: "How an agency would use Hey Bradley" (named hypothetical client; before/after handoff timeline).

---

## Segment 6 — Founder / Team with a New Idea (solo or 2-5 person)

| Rubric | Score | Notes |
|---|---|---|
| Find | 9 | Welcome H1 "Describe it. See it." is purpose-built for them |
| Get it | 9 | Walkthrough Scene 1 ("I needed a website. By Tuesday.") is the founder voice |
| Engage | 9 | Don Miller story-arc makes the visit feel like a journey; both CTAs (build now / share with developer later) match their two-mode reality |
| Convert | 8 | High intent; the friction-free /new-project + BYOK story is ideal |
| Pay | 8 | Founders pay for tools that save hours; Hey Bradley fits their tooling budget |

**Composite: 8.6 / 10**
**Other:** Bullseye segment for the current public site. Only gap: "from MVP to investor demo" framing — would speak to fundraising-mode founders specifically; current copy is more general.

---

## Segment 7 — WordPress / Wix Users (frustrated, non-technical)

| Rubric | Score | Notes |
|---|---|---|
| Find | 9 | Welcome H1 + 3-mode glyphs (Speak/Type/Adjust) speak directly to them |
| Get it | 8 | "It works the way you talk" is the right framing |
| Engage | 7 | Walkthrough Scene 5 ("AI coding assistant") introduces unfamiliar tech — confusion risk |
| Convert | 7 | They'll try /new-project but the export-to-developer pivot may feel beyond them |
| Pay | 8 | This audience already pays Wix / Squarespace monthly; they have established willingness to pay for SaaS website tools |

**Composite: 7.8 / 10**
**Other:** The export-to-developer pivot is double-edged — gives credibility BUT introduces tech jargon. Soften with "and when you're ready to grow, your developer can pick up exactly where you left off — no re-explaining." The current Walkthrough Scene 5 nephew/coding-assistant story is one beat too technical for this segment.

---

## Segment 8 — Lovable Users (already AI-builder fluent; shopping)

| Rubric | Score | Notes |
|---|---|---|
| Find | 7 | Welcome H1 differentiates implicitly; the actual comparison lives in blog post 1 (buried) |
| Get it | 9 | Once they reach post 1 (describe-it-see-it.md) — bullseye; the 4-row comparison table is in the blog body |
| Engage | 8 | Post 3 (handoff) gives them the architectural reason to switch (JSON-patch vs whole-rebuild) |
| Convert | 8 | Switching audiences are prime; BYOK + open-core lower switching friction |
| Pay | 9 | Lovable users actively pay for AI builders today; will pay for a better one |

**Composite: 8.2 / 10**
**Other:** The blog comparison table is the load-bearing artifact for this segment but it's buried. A small "Coming from another AI builder?" link near the Welcome H2 → blog post 1 would lift conversion 2-3 points.

---

## Segment 9 — Vibe Coders (informal, indie, AI-native)

| Rubric | Score | Notes |
|---|---|---|
| Find | 8 | They'll find Welcome via socials; the open-core + bar181/aisp-open-core Easter egg matches their tribe |
| Get it | 9 | "Describe it. See it." + Walkthrough Don Miller voice is exactly their aesthetic |
| Engage | 9 | They'll fork the repo, post the walkthrough on Twitter/X, share the comparison blog post |
| Convert | 8 | Friction-low entry; BYOK fits their LLM-tool habits |
| Pay | 6 | Vibe coders are budget-conscious; may stay on open-core perpetually unless commercial tier offers something they can't replicate (hosted persistence, team workspaces) |

**Composite: 8.0 / 10**
**Other:** This segment's loyalty is high but their lifetime-value is lowest. They're amplifiers, not revenue. The strategic value is referrals to Segment 4 (product teams) and Segment 6 (founders).

---

## Segment 10 — Grandma / Non-Technical Audience

| Rubric | Score | Notes |
|---|---|---|
| Find | 7 | Welcome is right; they may not find /walkthrough (currently a secondary CTA) |
| Get it | 9 | "The website builder that finally works the way you talk" is the entire pitch |
| Engage | 7 | Walkthrough is mobile-first scroll-snap (correct for this audience); but they may bounce on Scene 5 (nephew + AI coding assistant introduces tech they don't recognize) |
| Convert | 6 | High intent at hero; but need ZERO friction — any signup wall, any "API key" prompt, any error message in the builder will lose them |
| Pay | 7 | Will pay for a website tool that genuinely works (existing Wix/Squarespace customers prove this); price-sensitive |

**Composite: 7.2 / 10**
**Other:** The Listen mode (voice input) is a hidden moat for this segment — speaking is more accessible than typing. Currently presented as just "Speak" glyph in Section 2. Could be elevated to a hero-adjacent pitch ("Tell us what you want. Out loud, if you'd like.") to dial up the accessibility narrative.

---

## Composite ranking (highest-fit first)

| # | Segment | Composite | Pay-Likely | Priority |
|---|---|---|---|---|
| 1 | Founder / Team with new idea | **8.6** | High | Bullseye — current site is for them |
| 2 | Agentic Engineers L5+ | **8.2** | Medium-High | Strong fit; one nav improvement = 9.0 |
| 3 | Lovable users | **8.2** | High | Underserved on home page; blog post 1 needs surface |
| 4 | Vibe coders | **8.0** | Low (referrers) | Already amplifying; strategic-not-monetary |
| 5 | Product teams (Cursor → Claude Code) | **8.0** | High | Clearest commercial buyer; needs `/for-teams` |
| 6 | WordPress / Wix users | **7.8** | High | Hero lands; Scene 5 needs softening |
| 7 | Grandma / non-technical | **7.2** | Medium | Listen mode = moat; needs more visibility |
| 8 | Agencies / dev firms | **6.6** | High | Needs case-study content |
| 9 | L4-L6 devs (broad) | **6.4** | Medium | Need an "I'm a developer" door |
| 10 | Big Tech acquirer | **6.3** | n/a | No investor/partner contact path |

## Top 5 actionable improvements (ranked by leverage)

1. **Add `/for-developers` or "For developers" link in MarketingNav** — lifts Segment 2 (L5+) to 9.0 and Segment 3 (L4-L6) to 7.5+ in one move. ≤30 LOC. (Could repurpose `/research` as the destination.)
2. **Surface blog post 1 (the comparison) from Welcome H2 area** — small "Coming from another AI builder?" line linking to post 1 lifts Segments 7 + 8 (Lovable + WordPress/Wix users). ≤8 LOC.
3. **Add `/for-teams` page** — bullets for Cursor/Claude-Code/Codeium handoff with single screenshot per tool; lifts Segment 4 to 9.0; commercial-buying path. ≤200 LOC for the page.
4. **Add minimal `/contact` or `/work-with-me` page** with contact + LinkedIn + capstone-defense schedule + GitHub — closes Segment 1 (acquirer) gap. ≤80 LOC.
5. **Soften Scene 5 in Walkthrough for non-tech audience** — replace "AI coding assistant" with "the AI that helps him code" or similar plain-English. ≤4 LOC. Lifts Segment 7 + 10.

## Bottom-line reading

**Bullseye segments hit clean** (founders + agentic engineers + Lovable users + vibe coders + WordPress refugees). The simple-messaging reframe (P118 + P118.5) was the right call.

**Underserved segments name the next sprint:** acquirer (no investor door), L4-L6 devs (no developer entry-point), product teams (no integration page), agencies (no case studies). All are P120+ work.

**Highest-leverage single fix:** "For developers" nav entry — 30 LOC, lifts 2 segments by ~1 point each.

**Highest-revenue single fix:** `/for-teams` page — addresses the segment most likely to pay when commercial.

**Highest-strategic single fix:** `/contact` or investor surface — Segment 1 has no door at all today.

The site is **not yet bad for any segment**, but it is **explicitly optimized for two audiences (founders + agentic engineers)** with everyone else fitting in adjacent. P119 closes the visual-design + research-context gap; P120 should close the audience-routing gap.
