// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 1
// Step-1 fixture library: hand-authored envelopes that stand in for real LLM output.
// Path verified against src/data/default-config.json — sections[0] is the menu/navbar
// and sections[1] is the hero whose headline lives at components[1].props.text.

import type { FixtureEntry } from '@/contexts/intelligence/llm/fixtureAdapter';

export const STEP1_FIXTURES: FixtureEntry[] = [
  {
    matchExact: 'PHASE18_STEP1',
    envelope: {
      patches: [
        {
          op: 'replace',
          path: '/sections/1/components/1/props/text',
          value: 'Hello from LLM',
        },
      ],
      summary: 'Step 1 wire test: replaces hero heading.',
    },
  },
];
