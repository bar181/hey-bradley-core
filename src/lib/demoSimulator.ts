import { useConfigStore } from '@/store/configStore'
import type { MasterConfig } from '@/lib/schemas'

export interface DemoStep {
  caption: string
  delayMs: number
  action: () => void
}

export interface DemoSequence {
  name: string
  steps: DemoStep[]
}

/** Friendly captions per section type shown during the demo sequence */
const sectionCaptions: Record<string, string> = {
  hero: 'adding a hero section...',
  columns: 'now some features...',
  quotes: 'customers love reviews...',
  questions: 'answering common questions...',
  numbers: 'showing the numbers...',
  gallery: 'adding a photo gallery...',
  team: 'introducing the team...',
  logos: 'adding trusted partners...',
  pricing: 'setting up pricing...',
  action: 'and a way to take action...',
  footer: 'wrapping up with a footer...',
  image: 'adding a beautiful image...',
  text: 'adding some content...',
  divider: 'adding a divider...',
}

/** Base delay between each section reveal (ms) */
const STEP_INTERVAL = 1800
/** Initial pause before the first section appears (ms) */
const INITIAL_DELAY = 1500
/** Max random jitter added to each step for natural pacing (ms) */
const JITTER_MAX = 400

/**
 * Build a timed demo sequence from a MasterConfig.
 *
 * The sequence:
 * 1. Loads the config with all non-menu sections disabled
 * 2. Pauses briefly (theme caption)
 * 3. Enables each originally-enabled section one-by-one
 * 4. Shows a final "ready!" caption
 */
export function buildDemoSequence(config: MasterConfig, name: string): DemoSequence {
  const enabledSections = config.sections.filter(s => s.enabled && s.type !== 'menu')

  const steps: DemoStep[] = []

  // Step 1: Load config with all non-menu sections disabled
  steps.push({
    caption: `let's build ${name}...`,
    delayMs: 0,
    action: () => {
      const modifiedConfig: MasterConfig = {
        ...config,
        sections: config.sections.map(s => ({
          ...s,
          enabled: s.type === 'menu', // only menu starts enabled
        })),
      }
      useConfigStore.getState().loadConfig(modifiedConfig)
    },
  })

  // Step 2: Theme caption (theme already applied via loadConfig)
  steps.push({
    caption: 'picking the right style...',
    delayMs: INITIAL_DELAY,
    action: () => {
      // intentionally empty -- theme was applied in step 1
    },
  })

  // Step 3+: Enable sections one-by-one with natural timing
  enabledSections.forEach((section, idx) => {
    steps.push({
      caption: sectionCaptions[section.type] || `adding ${section.type}...`,
      delayMs: INITIAL_DELAY + (idx + 1) * STEP_INTERVAL + Math.random() * JITTER_MAX,
      action: () => {
        useConfigStore.getState().toggleSectionEnabled(section.id)
      },
    })
  })

  // Final step
  steps.push({
    caption: `${name} is ready!`,
    delayMs: INITIAL_DELAY + (enabledSections.length + 1) * STEP_INTERVAL,
    action: () => {
      // intentionally empty -- just a caption
    },
  })

  return { name, steps }
}

/**
 * Build a demo sequence from a MasterConfig using custom caption strings.
 *
 * Each caption corresponds to a demo step:
 * - Caption 0 → load config with all non-menu sections disabled
 * - Caption 1 → theme pause (no section enabled)
 * - Captions 2..N-2 → enable sections one-by-one in order
 * - Caption N-1 → final "ready" caption (no action)
 *
 * If there are more section-enable captions than sections, the extras
 * are shown as cosmetic pauses. If fewer, remaining sections batch-enable
 * on the last section caption.
 */
export function buildDemoFromCaptions(
  config: MasterConfig,
  name: string,
  captions: { text: string; delay: number }[],
): DemoSequence {
  const enabledSections = config.sections.filter(s => s.enabled && s.type !== 'menu')
  const steps: DemoStep[] = []

  captions.forEach((cap, idx) => {
    steps.push({
      caption: cap.text,
      delayMs: cap.delay,
      action: () => {
        if (idx === 0) {
          // Load config with everything disabled except menu
          const modifiedConfig: MasterConfig = {
            ...config,
            sections: config.sections.map(s => ({
              ...s,
              enabled: s.type === 'menu',
            })),
          }
          useConfigStore.getState().loadConfig(modifiedConfig)
        } else if (idx === 1) {
          // Theme pause — no action
        } else if (idx < captions.length - 1) {
          // Enable a section (map caption index to section index)
          const sectionIdx = idx - 2
          if (sectionIdx < enabledSections.length) {
            useConfigStore.getState().toggleSectionEnabled(enabledSections[sectionIdx].id)
          }
        }
        // Last caption is the "ready" message — no action
      },
    })
  })

  return { name, steps }
}

export type DemoCleanup = () => void

/**
 * Run a demo sequence, firing caption callbacks and actions on a timed schedule.
 *
 * Returns a cleanup function that cancels all pending timers when called.
 */
export function runDemo(
  sequence: DemoSequence,
  onCaption: (text: string) => void,
  onComplete: () => void,
): DemoCleanup {
  const timers: ReturnType<typeof setTimeout>[] = []
  let cancelled = false

  sequence.steps.forEach((step) => {
    const timer = setTimeout(() => {
      if (cancelled) return
      onCaption(step.caption)
      step.action()
    }, step.delayMs)
    timers.push(timer)
  })

  // Fire onComplete after the last step + a 2 s pause
  const lastDelay = sequence.steps[sequence.steps.length - 1]?.delayMs ?? 0
  const completeTimer = setTimeout(() => {
    if (!cancelled) onComplete()
  }, lastDelay + 2000)
  timers.push(completeTimer)

  return () => {
    cancelled = true
    timers.forEach(clearTimeout)
  }
}
