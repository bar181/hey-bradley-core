// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 2 + Step 3,
//       plans/implementation/mvp-plan/07-prompts-and-aisp.md §3 (5 starter prompts).
//
// Step 3 EXTENDS this file in place (kept the STEP2_FIXTURES export name so
// pickAdapter does not need to change). 5 starter prompts are now wired:
//   1. hero heading        — replace /sections/1/components/1/props/text
//   2. theme/accent color  — replace /theme/palette/accentPrimary (default-config)
//                            and /theme/colors/accent (narrowed-schema configs)
//   3. serif heading font  — replace /theme/typography/headingFamily
//   4. hero subheading     — replace /sections/1/components/2/props/text
//   5. blog article body   — multi-patch: title + excerpt + author against the
//                            blog-standard active config (article lives at
//                            /sections/1/components/0/props on blog-standard).
//
// HERO_HEADING_PATH and HERO_SUBHEADING_PATH match default-config.json (sections[1]
// is the hero, components[1] is the headline, components[2] is the subtitle).

import type { FixtureEntry, FixtureEnvelope } from '@/contexts/intelligence/llm/fixtureAdapter'

const HERO_HEADING_PATH = '/sections/1/components/1/props/text'
const HERO_SUBHEADING_PATH = '/sections/1/components/2/props/text'

/** Tiny color-name → hex map for the accent-color starter. */
const COLOR_HEX: Record<string, string> = {
  green: '#14532d',
  blue: '#1e3a8a',
  red: '#991b1b',
  orange: '#c2410c',
  purple: '#581c87',
  black: '#0a0a0a',
  white: '#ffffff',
}

export const STEP2_FIXTURES: FixtureEntry[] = [
  {
    // 1. "Make the hero say 'Bake Joy Daily'." — single/double-quote or bare.
    matchPattern: /make\s+the\s+hero\s+say\s+["']?(.+?)["']?\.?\s*$/i,
    envelope: ({ match }): FixtureEnvelope => {
      const headline = match[1]
      return {
        patches: [{ op: 'replace', path: HERO_HEADING_PATH, value: headline }],
        summary: `Updated hero headline to "${headline}".`,
      }
    },
  },
  {
    // 4. Hero subheading variant — same hero section, different component.
    matchPattern: /make\s+the\s+hero\s+subheading\s+say\s+["']?(.+?)["']?\.?\s*$/i,
    envelope: ({ match }): FixtureEnvelope => ({
      patches: [{ op: 'replace', path: HERO_SUBHEADING_PATH, value: match[1] }],
      summary: `Updated hero subheading to "${match[1]}".`,
    }),
  },
  {
    // 2. "Change the (theme|accent) color to (green|blue|...)" — map name → hex.
    matchPattern: /change\s+the\s+(?:theme|accent)\s+(?:color\s+)?to\s+([a-z]+)\.?\s*$/i,
    envelope: ({ match }): FixtureEnvelope => {
      const name = match[1].toLowerCase()
      // FIX 6: bail on unknown color names — emit an empty patches array with
      // a friendly summary so the chat surfaces "no patch applied" instead of
      // silently writing forest green for "puce", "chartreuse", etc.
      if (!(name in COLOR_HEX)) {
        return {
          patches: [],
          summary: `I don't know the color '${name}'. Try green, blue, red, orange, purple, black, or white.`,
        }
      }
      const hex = COLOR_HEX[name]
      return {
        // default-config.json uses /theme/palette/accentPrimary; the narrowed
        // path whitelist in patchPaths.ts allows /theme/colors/accent. We patch
        // the path that exists in the active config — default-config here.
        patches: [{ op: 'replace', path: '/theme/palette/accentPrimary', value: hex }],
        summary: `Changed accent color to ${name} (${hex}).`,
      }
    },
  },
  {
    // 3. "Use a serif font for headings" → Instrument Serif (one replace).
    matchPattern: /use\s+a\s+serif\s+font\s+for\s+headings\.?\s*$/i,
    envelope: (): FixtureEnvelope => ({
      patches: [{ op: 'replace', path: '/theme/typography/headingFamily', value: 'Instrument Serif' }],
      summary: 'Switched headings to Instrument Serif.',
    }),
  },
  {
    // 5. "Write a short blog article about <topic>" — multi-patch (title + body
    // + author) against the article inside the blog section. blog-standard.json
    // has the article at sections[1].components[0]; we hardcode this for Step 3.
    // The test resets the active config to blog-standard before sending.
    matchPattern: /write\s+a\s+short\s+blog\s+article\s+about\s+(.+?)\.?\s*$/i,
    envelope: ({ match }): FixtureEnvelope => {
      const topic = match[1].trim()
      const title = `A short story about ${topic}`
      const excerpt = `Here is a brief reflection on ${topic} — what it taught me, and why it sticks. The first batch never works; the lesson is in the second.`
      const author = 'Bradley'
      return {
        patches: [
          { op: 'replace', path: '/sections/1/components/0/props/title', value: title },
          { op: 'replace', path: '/sections/1/components/0/props/excerpt', value: excerpt },
          { op: 'replace', path: '/sections/1/components/0/props/author', value: author },
        ],
        summary: `Wrote a 3-patch blog article about ${topic}.`,
      }
    },
  },
]
