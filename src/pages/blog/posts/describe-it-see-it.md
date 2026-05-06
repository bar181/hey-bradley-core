---
title: "Describe It. See It. Done."
slug: "describe-it-see-it"
date: "2026-05-06"
voice: "founder-direct"
excerpt: "Maren runs a therapy practice in Portland. She paid $4,200 for a site she never updated. Last Tuesday she described her practice into a chat box, and by dinner she had a homepage she actually wanted to send to her mailing list."
tags: ["product", "user-story", "open-core"]
---

# Describe It. See It. Done.

Maren runs a small therapy practice in Portland. Two years ago she paid someone $4,200 for a website she never updated, because the developer ghosted her after the second invoice. The site had a stock photo of a stethoscope on the homepage. She is a therapist. She does not own a stethoscope. For two years she meant to fix it. For two years it stayed.

Last Tuesday, she described her practice into a chat box. A real homepage appeared in the time it took her tea to steep. The headline was hers — almost word-for-word, because she said it out loud and the system kept it. She spent the next hour iterating by talking. "Make this section warmer." "Move the contact form up." "The photo of the office is fine but make the copy underneath it less clinical." By dinner she had something she actually wanted to send to her mailing list. By Wednesday morning she did.

This is the post about how that feels. The technical readers can read the next one.

## The shape of the universal problem

There is a market most builder tools forgot existed. It is the boutique business owner. The parent organizing the school fundraiser. The freelance therapist with a website she has been meaning to update since the last election. The professional service provider whose Yelp page outranks her own domain because the domain still says "Coming soon" three years in.

These people do not need a developer. They need a website. The two have always been confused.

They have tried things. They have tried:

- The platform with the 12-page settings tree and the support article that says "this is easy" above seven nested tabs.
- The visual editor that asks you to learn its grid system before you can move a button.
- The AI builder that does everything beautifully on the first prompt — and on the second prompt regenerates the whole site, loses the headline, swaps the photo, and asks "would you like me to try again?"

None of these are bad products. They are good products built for a user who already knows what they want, already knows when to stop, and already knows the platform's vocabulary. That user exists. They are not the same person as Maren.

## Where the existing tools sit

```
WordPress  → nightmare, even for devs
Wix        → 10 hours to learn, ceiling unclear
Lovable    → easiest but requires knowing what you want
             AND knowing when to stop
Hey Bradley → describe it, see it, done
              works for grandma AND the agentic engineer
```

That is the table. It is not a takedown. WordPress is genuinely good for what WordPress is good for. Wix shipped a product that made a generation of small businesses possible. Lovable is the best vibe-coder out there and the team is doing real work. The table just sketches who each tool was actually built for.

Hey Bradley was built for the user who wants to *describe* the website, not *build* it.

## What it actually feels like

You open the page. There is a microphone. There is a text box. You can use either one. You start with a sentence — "I run a small bakery in Asheville, the bread is the thing, we're closed Mondays" — and the system listens. Not generic-listen. Real listen. The headline in the result quotes you. The hours-of-operation copy is pulled from what you said about Mondays. The photo placeholder knows it is a bakery, so the suggested images are bakery images, not stock-cubicle.

Then you iterate. You say "the headline is good, but the section under it should be about the sourdough starter, my customers ask about that one." A patch lands. The headline doesn't move. The section under it changes. Your iteration is local — the rest of the site is *unchanged*, because the system is editing the site, not regenerating it.

This is the second-prompt problem solved. Other AI builders ace the first prompt and crash on the second. Hey Bradley iterates because it knows what changed and what didn't. You can spend an hour talking to it without losing the homepage you started with.

When you are ready, you export. The export is not a one-time download of a static screenshot. It is a spec — a document that any developer or AI coding assistant can pick up and continue, because the spec is the source of truth, and the rendered site is just one view of it. The next time Maren changes her phone number, she changes it herself in 30 seconds. The next time she wants a new section, she describes the new section. The next time she wants to hand the whole thing to a developer for a redesign, the developer gets a clean spec, not a tangle of templates.

## Back to Maren

The site is up. She has it. She is not paying anyone $200 a month to host changes she could make herself in a sentence. The stock photo of the stethoscope is gone. The photo of her actual office, with her actual chair and her actual plant, is on the homepage. The copy says what she would say if you walked into her office, because she said it out loud and the system kept it.

This is what describe-it-see-it means. You speak. It builds. You iterate. It exports. The website is yours. The work that used to require a developer, a designer, and three rounds of "no, more like this" is now a conversation that takes the time it takes you to drink your tea.

If you are technical and want to know what is happening under the hood — how the iteration stays clean, why the export works the way it does, what the developer on the receiving end actually gets — read [the handoff that changes everything](/blog/the-handoff-that-changes-everything) next.
