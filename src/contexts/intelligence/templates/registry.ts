/**
 * P23 Sprint B Phase 1 — Template Registry.
 *
 * Three first-class templates. Each runs BEFORE the LLM call in chatPipeline.
 * On match: patches apply directly, $0 LLM cost, audit recorded as
 * source='template' in chat_messages.
 *
 * Templates differ from fixtures (step-2.ts):
 *   - Fixtures: DEV-only LLM proxy via FixtureAdapter interface
 *   - Templates: production-ready chatPipeline short-circuit (no LLM call)
 *
 * Registry is intentionally TINY (3 entries). Sprint B Phase 2 (P24) adds
 * section targeting (`/hero-1` syntax). Sprint B Phase 3 (P25) adds intent
 * translation. Sprint C (P26-P28) bridges to AISP-driven template selection.
 */

import { findSectionByType, heroHeadingPath } from '@/data/llm-fixtures/resolvePath'
import type { Template } from './types'

const ACCENT_PATH_DEFAULT = '/theme/palette/accentPrimary'
const BG_SECONDARY_PATH_DEFAULT = '/theme/palette/bgSecondary'

/**
 * Template 1 — "make it brighter" / "brighten" — bumps theme accent + bgSecondary
 * toward a brighter shade. Uses fixed brighter-cream palette per design tokens.
 */
const MAKE_IT_BRIGHTER: Template = {
  id: 'make-it-brighter',
  label: 'Brighten theme',
  description: 'Lighten the page background and accent for a sunnier feel.',
  matchPattern: /^\s*(?:make\s+(?:it\s+|the\s+(?:page|site|theme)\s+)?brighter|brighten\s+(?:it|the\s+(?:page|site|theme))?)\s*[!.?]*\s*$/i,
  envelope: () => ({
    patches: [
      // brighter cream + warmer accent
      { op: 'replace', path: ACCENT_PATH_DEFAULT, value: '#f59455' },
      { op: 'replace', path: BG_SECONDARY_PATH_DEFAULT, value: '#fef9f3' },
    ],
    summary: 'Brightened theme: warmer accent + lighter surface.',
  }),
}

/**
 * Template 2 — "hide the hero" / "hide the footer" / "hide the blog" — toggles
 * `enabled: false` on the matched section. Returns friendly empty-patch when
 * section absent from active config.
 */
const HIDE_SECTION: Template = {
  id: 'hide-section',
  label: 'Hide section',
  description: 'Hide a top-level section (hero / blog / footer / features / etc).',
  matchPattern: /^\s*hide\s+(?:the\s+)?([a-z-]+)\s*[!.?]*\s*$/i,
  envelope: ({ match, config }) => {
    const sectionType = match[1].toLowerCase()
    const sectionIdx = findSectionByType(config, sectionType)
    if (sectionIdx < 0) {
      return {
        patches: [],
        summary: `I can't find a "${sectionType}" section to hide. Try: hide the hero / hide the footer / hide the blog.`,
      }
    }
    return {
      patches: [
        { op: 'replace', path: `/sections/${sectionIdx}/enabled`, value: false },
      ],
      summary: `Hid the ${sectionType} section.`,
    }
  },
}

/**
 * Template 3 — "change the headline to X" / "set the headline to X" — replaces
 * the hero heading text. Resolves via heroHeadingPath (active-config aware).
 */
const CHANGE_HEADLINE: Template = {
  id: 'change-headline',
  label: 'Change headline',
  description: "Replace the hero heading with new text.",
  matchPattern: /^\s*(?:change|set|update)\s+the\s+headline\s+to\s+["']?(.+?)["']?\s*[!.?]*\s*$/i,
  envelope: ({ match, config }) => {
    const text = match[1].trim()
    const path = heroHeadingPath(config)
    if (!path) {
      return {
        patches: [],
        summary: "I couldn't find a hero heading to update. Try switching to a starter that has one.",
      }
    }
    return {
      patches: [{ op: 'replace', path, value: text }],
      summary: `Changed headline to "${text}".`,
    }
  },
}

export const TEMPLATE_REGISTRY: readonly Template[] = [
  MAKE_IT_BRIGHTER,
  HIDE_SECTION,
  CHANGE_HEADLINE,
] as const
