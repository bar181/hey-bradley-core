/**
 * P37 Sprint F P2 (A2) — Content / Design Route Classifier.
 *
 * Verifies classifyRoute(intent, text) returns 'content' | 'design' | 'ambiguous'
 * across representative phrasings. Pure-rule (no LLM); same stub-then-LLM mould
 * as P26 intent classifier and P34 assumptions engine.
 *
 * Pure-unit tests (no browser). ADR-066 (planned).
 */
import { test, expect } from '@playwright/test'
// NOTE: import directly from the specific module files (not the AISP barrel).
// The barrel transitively pulls @/store/configStore which imports JSON, which
// breaks raw Node ESM during Playwright test discovery. Existing pure-unit
// AISP tests (P34/P35) follow the same pattern.
import {
  classifyRoute,
  type AISPRoute,
} from '../src/contexts/intelligence/aisp/routeClassifier'
import { classifyIntent } from '../src/contexts/intelligence/aisp/intentClassifier'
import type { ClassifiedIntent } from '../src/contexts/intelligence/aisp/intentAtom'

/** Helper — assert the classification. */
function expectRoute(text: string, route: AISPRoute, classified?: ClassifiedIntent | null) {
  const i = classified === undefined ? classifyIntent(text) : classified
  const r = classifyRoute(i, text)
  expect(r.route, `text="${text}" rationale="${r.rationale}"`).toBe(route)
}

test.describe('P37 — classifyRoute (content)', () => {
  test('"rewrite the headline" → content (explicit content verb)', () => {
    expectRoute('rewrite the headline', 'content')
  })

  test('"regenerate the body copy" → content', () => {
    expectRoute('regenerate the body copy', 'content')
  })

  test('"rephrase the tagline" → content', () => {
    expectRoute('rephrase the tagline', 'content')
  })

  test('"change the headline to Welcome" → content (generic verb + copy noun)', () => {
    expectRoute('change the headline to Welcome', 'content')
  })

  test('"update the subheading" → content (update + copy noun)', () => {
    expectRoute('update the subheading', 'content')
  })

  test('"set the body copy to short and punchy" → content', () => {
    expectRoute('set the body copy to short and punchy', 'content')
  })
})

test.describe('P37 — classifyRoute (design)', () => {
  test('"hide the hero" → design (structural toggle)', () => {
    expectRoute('hide the hero', 'design')
  })

  test('"add a pricing section" → design (scaffold)', () => {
    expectRoute('add a pricing section', 'design')
  })

  test('"remove the footer" → design', () => {
    expectRoute('remove the footer', 'design')
  })

  test('"reset the theme" → design (reset is structural)', () => {
    expectRoute('reset the theme', 'design')
  })

  test('"change to dark mode" → design (design cue: dark mode)', () => {
    expectRoute('change to dark mode', 'design')
  })

  test('"make it brighter" → design (design cue: brighter)', () => {
    expectRoute('make it brighter', 'design')
  })

  test('"change the color palette" → design (palette cue)', () => {
    expectRoute('change the color palette', 'design')
  })

  test('"show the gallery" → design (structural toggle)', () => {
    expectRoute('show the gallery', 'design')
  })

  test('"get rid of the testimonials" → design (synonym → remove)', () => {
    expectRoute('get rid of the testimonials', 'design')
  })
})

test.describe('P37 — classifyRoute (ambiguous)', () => {
  test('"change something" → ambiguous (bare change, no signal)', () => {
    expectRoute('change something', 'ambiguous')
  })

  test('"update it" → ambiguous (bare update, no copy noun, no design cue)', () => {
    expectRoute('update it', 'ambiguous')
  })
})

test.describe('P37 — classifyRoute rationale + shape', () => {
  test('every classification returns a non-empty rationale', () => {
    const r = classifyRoute(null, 'rewrite the headline')
    expect(r.rationale.length).toBeGreaterThan(0)
  })

  test('null intent + verbless text → design (safe default)', () => {
    const r = classifyRoute(null, 'the weather is nice')
    expect(r.route).toBe('design')
  })

  test('null intent + content verb still routes to content (defence in depth)', () => {
    // The classifier should not require an AISP intent to detect explicit
    // content verbs — text scan alone is enough.
    const r = classifyRoute(null, 'rewrite the body')
    expect(r.route).toBe('content')
  })

  test('null intent + design cue still routes to design', () => {
    const r = classifyRoute(null, 'change to dark mode')
    expect(r.route).toBe('design')
  })

  test('returns AISPRoute union value (type guard)', () => {
    const r = classifyRoute(classifyIntent('hide the hero'), 'hide the hero')
    expect(['content', 'design', 'ambiguous']).toContain(r.route)
  })
})

test.describe('P37 — disambiguation: "change" verb', () => {
  // The hardest case the brief calls out: bare 'change' is the canonical
  // ambiguous trigger. Any of {copy noun, design cue, structural target} should
  // tip it; only the bare bare case should remain ambiguous.
  test('"change" + copy noun → content', () => {
    expectRoute('change the title', 'content')
    expectRoute('change the description', 'content')
  })

  test('"change" + design cue → design', () => {
    expectRoute('change the theme', 'design')
    expectRoute('change the background color', 'design')
  })

  test('"change" with no signal at all → ambiguous', () => {
    expectRoute('change something', 'ambiguous')
    expectRoute('change it', 'ambiguous')
  })
})
