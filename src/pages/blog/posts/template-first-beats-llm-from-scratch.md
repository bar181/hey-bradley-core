---
title: "Why Template-First Beats LLM-From-Scratch Every Time"
slug: "template-first-beats-llm-from-scratch"
date: "2026-05-01"
excerpt: "Lovable's pitch is a sentence becoming a website. The reality is a 60-70% match that takes five turns to drag toward 95%. Template-first inverts the math and lands at 90% on the first reply."
tags: ["templates", "product"]
---

# Why Template-First Beats LLM-From-Scratch Every Time

The pitch is seductive. Type a sentence, get a website. Lovable, v0, and a half dozen others all sell the same demo flow, and on stage it looks like the future. Then you try it on your actual idea and the reality lands. The first output is a 60-70% match. The hero font is wrong. The section order is generic. The tone is flat. You start typing again. Five turns later you are still iterating with a stranger who forgot what you said three turns ago, and the site is now a worse 75% match because the LLM has been re-rolling the whole layout each time.

You are probably the founder, the indie hacker, or the agency owner who wanted "fast." You are now spending an afternoon doing what should have taken ten minutes. The bottleneck is not the model. The bottleneck is the blank canvas.

## The blank-canvas tax

Every prompt-to-site tool starts the LLM at zero. No layout, no spacing, no color discipline, no opinion about whether a testimonial belongs above or below the pricing block. The model has to invent the entire surface from one sentence of prose. It is doing genuinely impressive work. It is also doing the wrong work for you.

Three failure modes follow. First, every reply re-rolls the whole site, so the polish you liked on turn three vanishes on turn four. Second, the model has no anchor for "what good looks like in this category," so a wellness coach gets the same chrome as a SaaS dashboard. Third, the conversation context window forgets your earlier requests, so by turn five you are arguing with a stranger about decisions you closed in turn one.

The output is plausible. It is also exhausting to drag toward 95%, and most builders give up at 80% and ship something they are quietly embarrassed by.

## Template-first inverts the math

Hey Bradley starts somewhere different. We ship 37 curated, on-brand templates across healthcare and wellness, creator and personal, dev tools and OSS, agency, blog, e-commerce, portfolio, and SaaS. Each one is opinionated. Each one already has the right typography pairing, the right vertical rhythm, the right section order for its category. The starting point is an 80% match to your idea, not a 0% match to anyone's.

Then chat does one thing only: it edits. Small targeted patches. Replace this headline. Swap the testimonial section for a pricing table. Tighten the hero subhead. The LLM never re-rolls the whole site, because the LLM is no longer responsible for the whole site. It is responsible for one patch at a time, applied to a known good base.

The result lands at 90% on the first reply, not the fifth. And every subsequent edit moves the number up, never down, because the patches stack on a stable foundation.

## Why the moat compounds

The Sprint M premium template work was the first proof. Three opinionated templates, each with locked design discipline, each ranked above the LLM-only output by every persona reviewer. Then OC-3 added three more. Then OC-4 added eleven — four healthcare and wellness, four creator and personal, three dev tools and OSS — bringing the registry to 37 and codifying the bar in ADR-096 (Template Library Expansion Standard).

Each template is a permanent asset. The LLM-from-scratch competitor has to re-prove the design every prompt. Hey Bradley proves it once, then ships it as a starting line for everyone who picks that category. The library compounds. The chat surface gets a smaller, easier job.

The flywheel is not "better model." The flywheel is "more curated starting points, narrower edits per turn." That is a defensible product surface, not a model arbitrage.

## What template-first asks of you

You have to pick a category. That is the only friction. You scroll a visual picker, see the 37 options sorted by visual style and intent, and tap the one that already feels close. Then you talk. The first reply is your site at 90%, and the last reply is your site at 95%, and you spent ten minutes total instead of an afternoon.

The tradeoff is real. You cannot ask for "a totally novel layout no other site has." If that is the requirement, blank-canvas tools are still the right call, and you should accept the iteration cost that comes with them. But the honest read on most projects is that you do not need a novel layout. You need a polished one that looks like it belongs in your category. Template-first nails that case and gets out of your way.

## The chat surface is the editor, not the architect

The deeper point is what the LLM is for. In blank-canvas tools, the LLM is the architect, the designer, the copywriter, and the developer all at once, on every turn. That is too many roles for one model and one sentence of input. In template-first tools, the LLM is the editor — a tightly scoped role with a clear input (your patch request), a clear context (the current template state), and a clear output (a deterministic patch). Editors are easier to be good at than architects. The model performs accordingly.

Sprint B P2 wired in section targeting via keyword scoping. Sprint C added the 5-atom AISP envelope so every patch is inspectable. Sprint M raised the template floor. ADR-096 codified the expansion bar. None of those moves are about a smarter model. All of them are about a smaller, better-defined job for the model to do.

## The takeaway

Blank-canvas builders sell speed-to-first-output. Template-first builders sell speed-to-95%. Those are different finish lines, and only one of them is where you actually want to be.

Try the open source version →
