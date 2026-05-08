/**
 * P91 / AW-PLANNING-MAP (A2) — Sample process map for Planning mode.
 *
 * Hardcoded Hey Bradley arc P15-P20 used as the seed map for the
 * Planning mode centerpiece. Lives under src/data so it ships as a
 * static asset (no runtime fetch). Used by src/pages/Planning.tsx.
 *
 * Per ADR-116 three-mode product architecture + ADR-085 multi-page
 * MVP. ProcessMap shape comes from A1's ProcessMapSVG component.
 */
import type { ProcessMap } from '@/components/planning/ProcessMapSVG'

export const HEY_BRADLEY_SAMPLE_MAP: ProcessMap = {
  nodes: [
    { id: 'p15', phase: 15, label: 'Foundation', status: 'sealed', x: 60, y: 80 },
    { id: 'p16', phase: 16, label: 'Persistence (sql.js)', status: 'sealed', x: 220, y: 80 },
    { id: 'p17', phase: 17, label: 'LLM Provider', status: 'sealed', x: 380, y: 80 },
    { id: 'p18-gate', phase: 18, label: 'Chat Mode Gate', status: 'sealed', x: 540, y: 80, shape: 'diamond' },
    { id: 'p18', phase: 18, label: 'Real Chat Mode', status: 'sealed', x: 540, y: 200 },
    { id: 'p19', phase: 19, label: 'Listen Mode (STT)', status: 'sealed', x: 380, y: 320 },
    { id: 'p20', phase: 20, label: 'MVP Close', status: 'sealed', x: 220, y: 320 },
  ],
  edges: [
    { from: 'p15', to: 'p16', type: 'sequential' },
    { from: 'p16', to: 'p17', type: 'sequential' },
    { from: 'p17', to: 'p18-gate', type: 'sequential' },
    { from: 'p18-gate', to: 'p18', type: 'gate' },
    { from: 'p18', to: 'p19', type: 'sequential' },
    { from: 'p19', to: 'p20', type: 'sequential' },
  ],
  activeNodeId: 'p15',
}

export interface SampleNodeDetail {
  id: string
  description: string
  adrs: string[]
}

export const SAMPLE_NODE_DETAILS: Record<string, SampleNodeDetail> = {
  'p15': {
    id: 'p15',
    description: 'Site shell, theme system, brand locks established.',
    adrs: [],
  },
  'p16': {
    id: 'p16',
    description: 'Local sql.js + IndexedDB persistence; offline-first.',
    adrs: ['ADR-016'],
  },
  'p17': {
    id: 'p17',
    description: '3-provider BYOK abstraction with Claude / Gemini / OpenRouter.',
    adrs: ['ADR-026'],
  },
  'p18-gate': {
    id: 'p18-gate',
    description: 'Decision gate — does the chat pipeline produce valid JSON Patches?',
    adrs: [],
  },
  'p18': {
    id: 'p18',
    description: 'LLM responses parse into JSON Patches; applied to MasterConfig.',
    adrs: ['ADR-018', 'ADR-053'],
  },
  'p19': {
    id: 'p19',
    description: 'Web Speech STT wired with PTT mic + transcript-to-pipeline.',
    adrs: ['ADR-019'],
  },
  'p20': {
    id: 'p20',
    description: 'CostPill + AbortSignal cap; mvp-e2e regression suite.',
    adrs: ['ADR-020'],
  },
}
