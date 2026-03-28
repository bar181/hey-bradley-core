import type { Section } from './schemas'

/**
 * Updates a component's props within a section's components[] array.
 * Returns the new components array for use with setSectionConfig.
 */
export function updateComponentProps(
  section: Section,
  componentId: string,
  propsUpdate: Record<string, unknown>
): Record<string, unknown>[] {
  return section.components.map((c) => {
    if (c.id !== componentId) return c
    return { ...c, props: { ...c.props, ...propsUpdate } }
  })
}

/**
 * Toggles a component's enabled state within a section's components[] array.
 */
export function toggleComponentEnabled(
  section: Section,
  componentId: string
): Record<string, unknown>[] {
  return section.components.map((c) => {
    if (c.id !== componentId) return c
    return { ...c, enabled: !c.enabled }
  })
}

/**
 * Sets a component's enabled state within a section's components[] array.
 */
export function setComponentEnabled(
  section: Section,
  componentId: string,
  enabled: boolean
): Record<string, unknown>[] {
  return section.components.map((c) => {
    if (c.id !== componentId) return c
    return { ...c, enabled }
  })
}
