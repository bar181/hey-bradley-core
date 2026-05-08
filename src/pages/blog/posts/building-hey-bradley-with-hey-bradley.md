---
title: "Building Hey Bradley With Hey Bradley"
slug: "building-hey-bradley-with-hey-bradley"
date: "2026-05-01"
excerpt: "Most founders use their own product as a marketing checkbox. Eat your own dog food becomes a tweet. Actually building with what you ship reveals every gap, and the same week we found four of them, we shipped the fixes."
tags: ["meta", "process"]
---

# Building Hey Bradley With Hey Bradley

Most product founders use their own tools as a marketing line. "We eat our own dog food" goes on the About page, somebody screenshots the demo, and the actual experience of building with the product stays politely unexamined. The dog food gets a single bite. The gaps stay hidden.

We did the opposite, and it cost us about a week of unplanned work, and it was worth every hour.

You are probably building a product right now. You probably have an internal tool, a marketing site, a docs portal — surfaces you could ship using your own product instead of a generic builder or a hand-crafted Next.js app. You probably do not, because the moment you try, the gaps become unignorable. That is the whole point.

## What the marketing site actually is

The Hey Bradley marketing site you are reading this on was built using Hey Bradley. Not "inspired by." Not "based on a template that came from." Built using. The Welcome page hero, the social proof bar, the blog index, the demo routes, the Open Core landing — all of it came out of the same template library and the same chat surface that ships to public users. The mobile redesign that landed in P69 (ADR-090) shipped to the marketing site the same week it shipped to the product, because they are the same surface.

That decision had teeth. It meant every gap in the product was also a gap in our own funnel. Every missing template was a section we could not build without writing it by hand. Every clunky mobile interaction was a clunky mobile interaction in front of our own visitors. We could not hide.

## Four gaps the dog food revealed

Here are four specific surfaces where building with our own product surfaced a problem and the fix shipped within the same week.

**The first-run mobile card.** The original mobile entry was a 3-tab navigation with a hamburger and a fullscreen listen overlay buried two taps deep. Fine on paper. Awful in practice — when we tried to capture a Welcome-page demo on a phone, the card felt clunky, the affordance for "see your spec" was invisible, and the mic interaction had three modal layers between intent and audio capture. We rewrote it. ADR-090 supersedes ADR-076. The 3-tab nav is gone. The mobile surface is now a single chat surface with an inline mic and a peek-able spec bottom sheet. MobileLayout dropped from 188 to 177 LOC. The fix shipped the same week the gap surfaced.

**The chat input density.** The desktop ChatTab grew dense as we added pre-filled prompts, personality chips, latency badges, and the AISP trace. By Sprint J, the input was a 947-line component carrying every piece of state in the surface. We extracted ChatThread (ADR-093), pulled the input into a focused subcomponent, and the file dropped to 84 LOC. The change came directly from us trying to demo the product on a 13-inch MacBook screen and watching the input swallow the preview pane.

**The blog index sort.** The original Blog.tsx (118 LOC) rendered posts in import order, which is to say in the order I happened to write the markdown files. The third post we drafted was the most shareable. It was buried at position three because that is when I finished it. We watched ourselves about to ship a date-blind blog index from inside the product and added the date sort and the read-time chip in the same wave. P71 / OC-13 closed it.

**The template picker visual filter.** As the registry grew from 17 to 37 templates across OC-3 and OC-4, the picker got harder to scan. We tried to scope a Welcome-page-style demo for a healthcare visitor and could not find the right starting point in under fifteen seconds. The TemplateBrowsePicker gained a visual-style filter the next wave (P68). Same week. Same wave that shipped the new templates also shipped the way to find them.

Four gaps. Four fixes. Same week each time. None of them would have surfaced if we were demoing the product on a staging branch with a hand-rolled screenshot.

## Why this is hard and why it works

Building your marketing site with your own product means every release impacts your funnel. A flaky build is a broken marketing surface. A clunky mobile flow is a clunky mobile flow for every visitor. The pressure is real, and most teams flinch and ship a separate site instead.

The flinch costs you the feedback loop. The whole point of dogfooding is the loop — try, fail, fix, try again, with a tight enough cycle that the fix lands inside the memory of the failure. We are running a six-phase-per-day velocity. The gap-to-fix latency is hours, not weeks. That only works because we never built the parallel marketing site that would have hidden the gaps.

The other thing the loop does: it makes the product opinionated about the right things. Every cleanup wave (P66, P67, P67b, P67c) raised a polish standard because we, the team, kept walking into the rough edges before our users did. ADR-091 (Canonical Component Quality), ADR-094 (Professional Grade Standard), and ADR-095 (Library-Wide Polish Standard) all came out of dogfood pain, codified into permanent bars. The product gets harder to make worse over time because the standards are now part of the repo.

## The shippable rule

Build with what you ship. Ship what you would build with. If the second sentence is not true — if you would never use your own product to build the thing you actually need to build — that is the gap. Find it. Close it. Then dogfood your way into the next one.

Try the open source version →
