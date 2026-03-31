import bakery from './bakery.json'
import launchpad from './launchpad.json'
import photography from './photography.json'
import consulting from './consulting.json'
import type { MasterConfig } from '@/lib/schemas'

export interface ExampleSite {
  name: string
  description: string
  theme: string
  config: MasterConfig
}

export const EXAMPLE_SITES: ExampleSite[] = [
  {
    name: 'Sweet Spot Bakery',
    description: 'Artisan bakery with warm, inviting design',
    theme: 'Wellness',
    config: bakery as unknown as MasterConfig,
  },
  {
    name: 'LaunchPad AI',
    description: 'SaaS platform with dark, technical aesthetic',
    theme: 'SaaS',
    config: launchpad as unknown as MasterConfig,
  },
  {
    name: 'Sarah Chen Photography',
    description: 'Portfolio with dramatic, visual-first layout',
    theme: 'Portfolio',
    config: photography as unknown as MasterConfig,
  },
  {
    name: 'GreenLeaf Consulting',
    description: 'Corporate site with clean, trust-focused design',
    theme: 'Professional',
    config: consulting as unknown as MasterConfig,
  },
]
