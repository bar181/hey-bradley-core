import northStarTemplate from './north-star-template.json'
import saddTemplate from './sadd-template.json'
import buildPlanTemplate from './build-plan-template.json'
import featuresTemplate from './features-template.json'
import humanSpecTemplate from './human-spec-template.json'
import aispTemplate from './aisp-template.json'

export type SpecType =
  | 'north-star'
  | 'sadd'
  | 'build-plan'
  | 'features'
  | 'human-spec'
  | 'aisp'

export interface SpecTemplateMetadata {
  generatedBy: string
  generatedAt: string
  siteTitle: string
  sectionCount: number
  componentCount?: number
  ambiguityTarget?: string
  crystalAtomComponents?: number
}

export interface SpecTemplateSection {
  id: string
  label: string
  required: boolean
  fields: string[]
  category_types?: string[]
  priority?: string
}

export interface SpecTemplate {
  type: SpecType
  version: string
  format: string
  description: string
  sections?: SpecTemplateSection[]
  metadata: SpecTemplateMetadata
  [key: string]: unknown
}

export const SPEC_TEMPLATES: Record<SpecType, SpecTemplate> = {
  'north-star': northStarTemplate as unknown as SpecTemplate,
  'sadd': saddTemplate as unknown as SpecTemplate,
  'build-plan': buildPlanTemplate as unknown as SpecTemplate,
  'features': featuresTemplate as unknown as SpecTemplate,
  'human-spec': humanSpecTemplate as unknown as SpecTemplate,
  'aisp': aispTemplate as unknown as SpecTemplate,
}

export const SPEC_TYPE_LABELS: Record<SpecType, string> = {
  'north-star': 'North Star',
  'sadd': 'Architecture (SADD)',
  'build-plan': 'Build Plan',
  'features': 'Features Specification',
  'human-spec': 'Specifications',
  'aisp': 'AISP Crystal Atom',
}

export function getSpecTemplate(type: SpecType): SpecTemplate {
  return SPEC_TEMPLATES[type]
}

export function getAllSpecTypes(): SpecType[] {
  return Object.keys(SPEC_TEMPLATES) as SpecType[]
}

export {
  northStarTemplate,
  saddTemplate,
  buildPlanTemplate,
  featuresTemplate,
  humanSpecTemplate,
  aispTemplate,
}
