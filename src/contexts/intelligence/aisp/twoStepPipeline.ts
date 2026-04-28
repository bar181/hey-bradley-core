/**
 * P28 Sprint C P3 — A4: 2-step pipeline orchestrator.
 *
 * Combines Step 1 (template selection via templateSelector.ts) with the
 * existing template router. Step 2 is the modification — for the P28 baseline
 * registry (3 templates), Step 2 = invoke the selected template's envelope
 * with the user's input. Future templates that require LLM-modified content
 * (Sprint D content generators) will replace this Step 2 with an LLM call.
 *
 * Returns a structured `TwoStepResult` so the caller (chatPipeline) can:
 *   - apply patches if both steps succeed
 *   - surface step rationales in the AISPTranslationPanel
 *   - fall through gracefully on any stage failure
 *
 * ADR-057 (2-step AISP Template Selection).
 */
import { useConfigStore } from '@/store/configStore'
import { TEMPLATE_REGISTRY, type TemplateEnvelope } from '@/contexts/intelligence/templates'
import { selectTemplate, STEP1_THRESHOLD, type TemplateSelection } from './templateSelector'
import type { ClassifiedIntent } from './intentAtom'
import { generateContent } from './contentGenerator'
import type { GeneratedContent } from './contentAtom'
import { findSectionByType, heroHeadingPath } from '@/data/llm-fixtures/resolvePath'
import type { MasterConfig } from '@/lib/schemas'

/**
 * R4 architecture review F2 — extension hook for generator templates.
 * `heroHeadingPath` is the default resolver; future generator templates
 * that target other sections (e.g. blog body, footer text) register
 * their own resolver in this map. Unknown sectionType silently falls
 * back to hero so existing behavior is preserved.
 */
function resolveTargetPath(
  sectionType: string,
  config: MasterConfig,
): string | null {
  if (sectionType === 'hero') return heroHeadingPath(config)
  // Generic per-section heading resolver: first heading component within
  // the first matching section. P33+ generators that need per-section
  // logic (e.g. blog body via paragraph component) will get their own
  // case-branch here without disturbing the generator path itself.
  const idx = findSectionByType(config, sectionType)
  if (idx < 0) return null
  const components = config.sections[idx]?.components ?? []
  const headingIdx = components.findIndex((c) => c.type === 'heading')
  if (headingIdx >= 0) {
    return `/sections/${idx}/components/${headingIdx}/props/text`
  }
  return null
}

export interface TwoStepResult {
  step1: TemplateSelection
  step2: { applied: boolean; envelope: TemplateEnvelope }
  /** P33 — present when step 2 ran the generator path (kind:'generator'). */
  generated?: GeneratedContent
  totalConfidence: number
}

/**
 * Run the 2-step AISP pipeline.
 *   Step 1: LLM picks best-fit template ID (gated by STEP1_THRESHOLD = 0.7)
 *   Step 2: invoke the matched template's envelope with user-input regex match
 *
 * Returns null if Step 1 fails (caller falls through to P26 → P25 → P23 chain).
 */
export async function runTwoStepPipeline(
  userText: string,
  intent: ClassifiedIntent | null,
): Promise<TwoStepResult | null> {
  // Step 1 — LLM template selection
  const selection = await selectTemplate(userText, intent)
  if (!selection) return null

  // Step 2 — execute the matched template
  const tpl = TEMPLATE_REGISTRY.find((t) => t.id === selection.templateId)
  if (!tpl) return null

  const config = useConfigStore.getState().config

  // P33 / ADR-062 — kind dispatch. Generator path runs `generateContent`
  // (CONTENT_ATOM consumer) and produces a JSON-Patch envelope from the
  // generated text + section-aware defaults.
  if (tpl.kind === 'generator') {
    const sectionType = intent?.target?.type ?? 'hero'
    const generated = generateContent({ text: userText, sectionType })
    if (!generated) return null

    // Section-aware target resolution (R4 fix-pass: extension hook).
    const path = resolveTargetPath(sectionType, config)
    if (!path) return null

    const envelope: TemplateEnvelope = {
      patches: [{ op: 'replace', path, value: generated.text }],
      summary: `Rewrote ${sectionType} headline (${generated.tone}/${generated.length}): "${generated.text}"`,
    }
    return {
      step1: selection,
      step2: { applied: true, envelope },
      generated,
      totalConfidence: Math.min(selection.confidence, generated.confidence),
    }
  }

  // Patcher path (P28 baseline): regex envelope.
  const m = tpl.matchPattern.exec(userText)
  if (!m) {
    return null
  }
  const envelope = tpl.envelope({ text: userText, match: m, config })

  return {
    step1: selection,
    step2: { applied: envelope.patches.length > 0, envelope },
    totalConfidence: selection.confidence,
  }
}

export { STEP1_THRESHOLD }
