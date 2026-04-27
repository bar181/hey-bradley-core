// DRAFT-mode label dictionary for builder UI polish.
// Rationale: plans/implementation/mvp-plan/01-phase-15-polish-kitchen-sink.md
// (see §1.1 for the policy and §7.1 for the original sketch).

export const DRAFT_RENAME: Record<string, string> = {
  Variant: 'Style',
  'Layout Schema': 'Layout',
  'Section Registry': 'Add Section',
  Slot: 'Spot',
  Inspector: 'Edit',
  'Property Inspector': 'Edit',
  'Schema Version': 'Version',
}

export const DRAFT_HIDE_KEYS: Set<string> = new Set([
  'schemaVersion',
  'registryNamespace',
  'slotToken',
  'namespace',
  'payload',
])

export function applyDraftLabel(label: string): string {
  return Object.prototype.hasOwnProperty.call(DRAFT_RENAME, label)
    ? DRAFT_RENAME[label]
    : label
}
