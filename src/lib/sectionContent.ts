import type { Section } from './schemas'

/** Type-safe content accessor. Returns the value or a fallback. */
export function getContent<T = string>(section: Section, key: string, fallback: T): T {
  const val = section.content?.[key]
  return (val as T) ?? fallback
}

/** Get string content with fallback */
export function getStr(section: Section, key: string, fallback = ''): string {
  const val = section.content?.[key]
  return typeof val === 'string' ? val : fallback
}

/** Get items array from content */
export function getItems(section: Section): Array<Record<string, unknown>> {
  const items = section.content?.items
  return Array.isArray(items) ? items : []
}

/** Resolve the CSS class name for the section's image effect. Returns '' for none/undefined. */
export function getImageEffectClass(section: Section): string {
  const effect = section.style?.imageEffect
  return effect && effect !== 'none' ? effect : ''
}
