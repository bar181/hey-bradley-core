// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 2.
// Step-2 fixture library: real-shaped envelopes that drive the full chat
// pipeline (system-prompt → adapter → parser → validator → applier) without
// touching a network. Step 4 swaps these for ClaudeAdapter responses.
//
// HERO_HEADING_PATH is config-shape-dependent and matches the verified
// position in src/data/default-config.json (sections[1] is the hero, the
// headline component lives at components[1].props.text). Step 3 generalises
// this via a helper that scans for the section with type === 'hero'.

import type { FixtureEntry } from '@/contexts/intelligence/llm/fixtureAdapter'

const HERO_HEADING_PATH = '/sections/1/components/1/props/text'

export const STEP2_FIXTURES: FixtureEntry[] = [
  {
    // "Make the hero say 'Bake Joy Daily'." — single-quote, double-quote, or
    // bare. Trailing period optional. Captures the headline in group 1.
    matchPattern: /make\s+the\s+hero\s+say\s+["']?(.+?)["']?\.?\s*$/i,
    envelope: ({ match }) => {
      const headline = match[1]
      return {
        patches: [{ op: 'replace', path: HERO_HEADING_PATH, value: headline }],
        summary: `Updated hero headline to "${headline}".`,
      }
    },
  },
  {
    // Subheading variant — same hero section, different component path.
    matchPattern: /make\s+the\s+hero\s+subheading\s+say\s+["']?(.+?)["']?\.?\s*$/i,
    envelope: ({ match }) => ({
      patches: [
        { op: 'replace', path: '/sections/1/components/2/props/text', value: match[1] },
      ],
      summary: `Updated hero subheading to "${match[1]}".`,
    }),
  },
]
