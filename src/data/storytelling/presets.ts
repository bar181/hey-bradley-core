/**
 * Storytelling presets — 8 narrative archetypes
 *
 * Pure module per ADR-134. NO fs / React / store imports.
 * Each preset's samplePassage is real ~50-word prose in voice — NOT stub text.
 *
 * Authored by Hey Bradley P113 / A2.
 */

import type { StorytellingPreset } from "./index";

export const STORYTELLING_PRESETS: readonly StorytellingPreset[] = [
  {
    id: "don-miller-storybrand",
    name: "Don Miller story-brand",
    description:
      "Reader-as-hero framing with the brand as guide; problem first, plan next.",
    voiceAttributes: ["confident", "specific", "reader-as-hero"],
    openingPattern:
      "Open with the reader's concrete problem in their own language; never the brand.",
    bodyPattern:
      "Hero (reader) → Problem (specific) → Guide (brand) → Plan (3 steps) → Call (action) → Stakes (success / failure).",
    closePattern:
      "Single, unambiguous call to action that names the next step explicitly.",
    samplePassage:
      "You spent eight months building. Forty-seven cold emails. Three demos. Zero revenue. Most founders quit here. The ones who don't have one thing in common: they stopped pitching the product and started narrating the customer's problem. That's the move. That's the whole move. Here's how to make it.",
    bestFor: ["marketing", "about-page", "landing-page"],
  },
  {
    id: "theron-miller-hard-twist",
    name: "Theron Miller hard-twist",
    description:
      "Specific opening anecdote, then an unexpected pivot, then an earned observation.",
    voiceAttributes: ["specific", "unexpected", "earned"],
    openingPattern:
      "A small, concrete moment — sensory detail, named object or place, no abstraction.",
    bodyPattern:
      "Anecdote → unexpected turn that subverts the obvious read → an observation the reader couldn't have predicted from line one.",
    closePattern:
      "A short, plain sentence that lands the earned point without restating it.",
    samplePassage:
      "The first batch of beans I roasted in 2019 was burnt. Not slightly — burnt in the way that makes the room smell like a burned-out engine for two hours. I almost quit. Instead I went back the next day and burned a second batch. That's how you learn coffee. You burn it on purpose.",
    bestFor: ["blog", "long-form-essay", "newsletter"],
  },
  {
    id: "founder-direct",
    name: "Founder-direct",
    description:
      "Restrained-not-bro first-person; specific numbers; no hype words.",
    voiceAttributes: ["confident", "direct", "understated"],
    openingPattern:
      "First-person statement of fact with at least one specific number or date.",
    bodyPattern:
      "What we built → who it's for → what it costs → what it doesn't do — in that order, no adjectives doing heavy lifting.",
    closePattern:
      "A line you'd say across a table, not from a stage. Often a single sentence.",
    samplePassage:
      "We started in March 2023 with two engineers and a $40k seed. Eighteen months later we have 312 paying customers, a small team, and roughly seven hours of sleep each. The product is narrow on purpose. We are not the cheapest. We are not the biggest. We are the one that ships.",
    bestFor: ["about-page", "founder-letter", "investor-update"],
  },
  {
    id: "academic-rigor",
    name: "Academic-rigor",
    description:
      "Claim, then evidence, then counterargument, then cited sources — no hand-waving.",
    voiceAttributes: ["precise", "evidence-based", "thorough"],
    openingPattern:
      "Stated claim with scope conditions named (when, where, for whom).",
    bodyPattern:
      "Claim → primary evidence (data / citations) → strongest counterargument → response → limits of the result.",
    closePattern:
      "What this changes for the reader, plus what would falsify the claim.",
    samplePassage:
      "Among the 412 startups we tracked from 2018 to 2023, those that ran weekly customer interviews in months one through six had a 2.4× higher 18-month survival rate (p=0.003). The effect held controlling for funding stage and team size. The strongest counterargument — selection bias — is examined in §3 and partially survives.",
    bestFor: ["research-newsletter", "long-form", "whitepaper"],
  },
  {
    id: "dry-humor-narrator",
    name: "Dry-humor narrator",
    description:
      "Specific, dry, slightly over-precise — the joke is in the precision, not the punchline.",
    voiceAttributes: ["dry", "specific", "over-precise"],
    openingPattern:
      "A factual setup that's too detailed to be neutral but never winks at the reader.",
    bodyPattern:
      "Plain reportage of slightly absurd specifics; the narrator never breaks frame to acknowledge the absurdity.",
    closePattern:
      "A final detail, more precise than necessary, that lands the tone without commentary.",
    samplePassage:
      "The agency had four founders, three offices, and one functioning espresso machine. The machine was a 2007 Rancilio Silvia, descaled twice yearly by a man named Henrik who drove forty-three minutes each way and accepted payment exclusively in pastries. Most clients did not know about Henrik. The work, by all available measures, was excellent.",
    bestFor: ["blog", "agency-page", "about-page"],
  },
  {
    id: "beers-and-pizza-casual",
    name: "Beers-and-pizza casual",
    description:
      "Paragraphs not headings; specific anecdotes; real talk you'd say to a friend.",
    voiceAttributes: ["casual", "real", "specific"],
    openingPattern:
      "A direct address or a small story that drops the reader mid-conversation.",
    bodyPattern:
      "Long paragraphs, no bullet lists, contractions throughout, named specifics over abstractions; pacing comes from sentence-length variation.",
    closePattern:
      "A plain takeaway that doesn't try to sound like advice. Often just what you'd say next.",
    samplePassage:
      "So here's the part nobody tells you about the rebuild. We thought it'd take six weeks. It took fourteen. Four of those weeks were spent untangling a single migration that someone — and I'm not naming names but I am one of three suspects — had hand-edited in production at 2am. We laugh about it now. Mostly.",
    bestFor: ["blog", "retrospective", "newsletter"],
  },
  {
    id: "investigative-deep-dive",
    name: "Investigative deep-dive",
    description:
      "Lead with the question; follow the thread; name the gap; refuse easy answers.",
    voiceAttributes: ["curious", "thorough", "unflinching"],
    openingPattern:
      "A question the reader didn't know they had, framed concretely.",
    bodyPattern:
      "Question → first answer that doesn't hold → deeper source → contradicting source → what the gap reveals.",
    closePattern:
      "An honest acknowledgement of what's still unknown — never a tidy bow.",
    samplePassage:
      "Why does every coworking space in Brooklyn close on a Wednesday? The first three founders I called blamed staffing. The fourth blamed insurance. By the seventh call I had a different story: a 2019 zoning rider almost no one read. Nobody I spoke to could explain who lobbied for it. That, as it turns out, is the actual story.",
    bestFor: ["long-form-essay", "journalism", "newsletter"],
  },
  {
    id: "contrarian-tech",
    name: "Contrarian-tech",
    description:
      "The consensus is X; here's specifically why it's wrong; here's what to do instead.",
    voiceAttributes: ["contrarian", "sharp", "opinionated"],
    openingPattern:
      "Name the consensus position in one sentence, then disagree in the next.",
    bodyPattern:
      "Consensus → why it sounds right → why it's actually wrong (with specifics) → what the better default looks like.",
    closePattern:
      "A single sharp line stating the alternative. No softening clauses.",
    samplePassage:
      "Everyone says you should ship fast. They're wrong about what fast means. Fast isn't a one-week MVP that breaks in production for a month. Fast is shipping the smallest version of the right thing to the right ten users and watching them. The first kind of fast wastes time. The second kind compounds it.",
    bestFor: ["opinion-blog", "twitter-thread", "newsletter"],
  },
] as const;
