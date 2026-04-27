// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 2 + Step 3,
//       plans/implementation/mvp-plan/07-prompts-and-aisp.md §3 (5 starter prompts).
//
// P19 Fix-Pass 2 (F1): hero/subheading/article fixtures now resolve their patch
// path against the active MasterConfig at call-time via ./resolvePath helpers.
// This closes the silent-corruption bug where hardcoded `/sections/1/...` paths
// wrote into the wrong section when the active example changed (e.g.
// blog-standard has hero at sections[0], not sections[1]). When the requested
// section/component is absent we return an empty-patch envelope with a friendly
// summary instead of writing into the wrong slot.

import type { FixtureEntry, FixtureEnvelope } from '@/contexts/intelligence/llm/fixtureAdapter'
import { useConfigStore } from '@/store/configStore'
import { heroHeadingPath, heroSubheadingPath, blogArticlePath } from './resolvePath'

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
      const path = heroHeadingPath(useConfigStore.getState().config)
      if (!path) {
        return {
          patches: [],
          summary: "I couldn't find a hero section to update. Add one first, then try again.",
        }
      }
      return {
        patches: [{ op: 'replace', path, value: headline }],
        summary: `Updated hero headline to "${headline}".`,
      }
    },
  },
  {
    // 4. Hero subheading variant — same hero section, first text-typed child.
    matchPattern: /make\s+the\s+hero\s+subheading\s+say\s+["']?(.+?)["']?\.?\s*$/i,
    envelope: ({ match }): FixtureEnvelope => {
      const path = heroSubheadingPath(useConfigStore.getState().config)
      if (!path) {
        return {
          patches: [],
          summary: "I couldn't find a hero subheading to update.",
        }
      }
      return {
        patches: [{ op: 'replace', path, value: match[1] }],
        summary: `Updated hero subheading to "${match[1]}".`,
      }
    },
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
    // 5. "Write a short blog article about <topic>" — multi-patch (title +
    // excerpt + author) against the article inside the blog section. Path is
    // resolved at call-time so this works on blog-standard AND any other
    // example that has a `blog` section with a `blog-article` component.
    matchPattern: /write\s+a\s+short\s+blog\s+article\s+about\s+(.+?)\.?\s*$/i,
    envelope: ({ match }): FixtureEnvelope => {
      const topic = match[1].trim()
      const config = useConfigStore.getState().config
      const titlePath = blogArticlePath(config, 'title')
      const excerptPath = blogArticlePath(config, 'excerpt')
      const authorPath = blogArticlePath(config, 'author')
      if (!titlePath || !excerptPath || !authorPath) {
        return {
          patches: [],
          summary: "I couldn't find a blog article to update. Switch to the blog example, or add a blog section first.",
        }
      }
      const title = `A short story about ${topic}`
      const excerpt = `Here is a brief reflection on ${topic} — what it taught me, and why it sticks. The first batch never works; the lesson is in the second.`
      const author = 'Bradley'
      return {
        patches: [
          { op: 'replace', path: titlePath, value: title },
          { op: 'replace', path: excerptPath, value: excerpt },
          { op: 'replace', path: authorPath, value: author },
        ],
        summary: `Wrote a 3-patch blog article about ${topic}.`,
      }
    },
  },
]
