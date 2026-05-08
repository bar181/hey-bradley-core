---
title: "Why We Built This: The Honest Version"
slug: "why-we-built-this-the-honest-version"
date: "2026-05-06"
voice: "theron-miller-hard-twist"
excerpt: "I just wanted to change a phone number. It took me forty minutes. I was the engineer. The frustration that built Hey Bradley wasn't from outside the industry — it was from inside, watching the tools we built fail the people we built them for."
tags: ["origin", "founders", "product"]
---

# Why We Built This: The Honest Version

The morning that decided it was a Saturday in March. My mother-in-law called and asked me, gently, the way she asks when she has already tried for an hour, whether I could change the phone number on her business website. I said yes. I had built the site three years earlier. I knew the platform. I logged in.

It took forty minutes. A settings tree. A "global" phone number and a "page-level" one. A third baked into a footer template in a different theme menu. A fourth in a contact-form plugin. I changed three of the four. The fourth I missed. She called Monday because a customer had tried the old number.

I was the engineer. I had built the site. I was the best-equipped person on earth for this task. It still took forty minutes and I still got it wrong. I sat at the kitchen table and tried to explain to her why this was hard, and the explanation made no sense out loud. She had said five words. "Change the phone number please." Nothing about those five words should have produced forty minutes of clicking and a missed string.

That is the moment that built this product. Not a market study. A Saturday morning at a kitchen table where the tools I had spent a career using turned out to be unfit for the person I was trying to help.

## The pivot that changed the question

I spent the next month thinking about it wrong. I thought the problem was the platform. So I tried other platforms — the visual one with the grid, the headless one with markdown files, the AI one that promised to do it all in one prompt. Each was better than the last. None were good enough.

Then a friend who teaches creative writing reframed it: "The problem is not that the tools are bad. The problem is that none of them were built for the way the people who *need* a website actually communicate."

That was it. That was the pivot.

The people who need a website do not communicate the way developers do. They do not enumerate. They do not specify in advance. They speak imprecisely, iteratively, visually. They start with a sentence, watch you build, and when something is wrong they point and say "not like that, more like…" and finish by gesturing. They do not know what they want until they see the wrong version. They do not know when to stop until they see the right one. The whole iteration is a conversation, not a brief.

Every tool in the market assumed a different user. The platform assumed someone willing to learn the settings tree. The visual editor assumed someone willing to learn the grid. The vibe-coder assumed someone with a clean prompt in mind, who would also know to stop typing when the result was good. None of those match the way Maren talks. They match the way I talk, after twenty years in software. They are tools built for the wrong cohort.

## The honest version of the failure modes

WordPress is a remarkable piece of infrastructure. It runs a third of the web. It is genuinely good for technical or semi-technical owners who are willing to invest a weekend in learning it. It is also unfit for anyone who is not, and the support ecosystem around it has spent twenty years pretending otherwise.

Wix shipped a real product. The drag-and-drop editor was a category leap. Millions of small businesses got online because of Wix who would not have otherwise. The cost of that win is a learning curve that is not 10 minutes — it is closer to 10 hours, and the ceiling is unclear until you hit it. Maren would hit it on day three.

Lovable, v0, Framer AI — the new vibe-coder generation — are the best of the recent wave. The first prompt is genuinely magic. The second prompt is a coin flip. They are optimized for a user who has the whole site in their head, types it once cleanly, and stops. That user exists. He is a designer with a portfolio idea, or a founder with a landing page in mind. He is not the user who says five words on a Saturday and waits for the phone number to update.

None of these tools are stupid. They were built for users who exist. The market they did not serve is the larger one, and the reason is that *building for that market is harder*. It requires a different load-bearing primitive — not "regenerate the page from a prompt" but "edit the page from a sentence, hold the context, never lose what the user already approved."

## The fix

You build around how non-technical people actually communicate.

You let them speak. The microphone is real, the transcription is the source of truth, the system keeps the words. You let them iterate. The second prompt does not regenerate the site — it patches it, the way a designer or a human collaborator would. You let them stop when they are done. The export is a clean handoff to whatever comes next.

And — the move that took the longest to figure out, and the harder thing to copy — you make the export something a developer or an AI coding agent can pick up without a single clarifying call. The artifact is unambiguous. The user described the site; the system captured the description as a spec; the spec is the contract the next person works against. No telephone game. No three rounds of "what did she actually want."

That is the part that goes in the next post. This post is just about why.

## The broader frame

Building software with AI as your assistant is the proper way to build software now. It is not a fad. It is the new default, and the people who learn it now will ship the next decade. Making it easy — accessible to the boutique business owner, the freelance therapist, the parent organizing the fundraiser — is the side effect of taking that idea seriously.

We are not trying to replace developers. We are trying to give the people who need a website a way to build one without becoming developers, and a way to hand the result to a developer when the time comes that does not require the developer to start over. The seams matter. The handoff matters. The honest version of why we built this is that the seams were broken, and one Saturday morning at a kitchen table the cost of that was forty minutes and a missed phone number.

We thought we could fix the seams. We are finding out.

If you want what describing-not-building feels like in practice, [Maren's story](/blog/describe-it-see-it).
