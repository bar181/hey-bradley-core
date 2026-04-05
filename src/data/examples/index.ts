import bakery from './bakery.json'
import launchpad from './launchpad.json'
import photography from './photography.json'
import consulting from './consulting.json'
import fitforge from './fitforge.json'
import florist from './florist.json'
import restaurant from './restaurant.json'
import education from './education.json'
import kitchenSink from './kitchen-sink.json'
import blank from './blank.json'
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
    theme: 'Tech Business',
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
  {
    name: 'FitForge Fitness',
    description: 'Boutique fitness studio with bold, energetic dark theme',
    theme: 'Creative',
    config: fitforge as unknown as MasterConfig,
  },
  {
    name: 'Bloom & Petal',
    description: 'Boutique florist with delicate, organic light theme',
    theme: 'Personal',
    config: florist as unknown as MasterConfig,
  },
  {
    name: 'The Corner Table',
    description: 'Farm-to-table restaurant with warm, inviting design',
    theme: 'Wellness',
    config: restaurant as unknown as MasterConfig,
  },
  {
    name: 'CodeCraft Academy',
    description: 'Online coding school with energetic, modern design',
    theme: 'Startup',
    config: education as unknown as MasterConfig,
  },
  {
    name: 'Kitchen Sink Demo',
    description: 'Every section type in one config — the full platform showcase',
    theme: 'SaaS',
    config: kitchenSink as unknown as MasterConfig,
  },
  {
    name: 'Blank Canvas',
    description: 'Minimal starting point — build from scratch',
    theme: 'Minimalist',
    config: blank as unknown as MasterConfig,
  },
]
