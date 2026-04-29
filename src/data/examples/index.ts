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
import funBlog from './fun-blog.json'
import devPortfolio from './dev-portfolio.json'
import enterpriseSaas from './enterprise-saas.json'
import realEstate from './real-estate.json'
import lawFirm from './law-firm.json'
import capstone from './capstone.json'
import blogStandard from './blog-standard.json'
import saasFounder from './saas-founder'
import indiePortfolio from './indie-portfolio'
import { b2bAgencyConfig } from './b2b-agency'
import heyBradleyFlagship from './hey-bradley-flagship'
import aiEngineerPersonal from './ai-engineer-personal'
import localBusiness from './local-business'
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
  {
    name: 'The Daily Scoop',
    description: 'Playful food blog with recipes, photos, and casual voice',
    theme: 'Creative',
    config: funBlog as unknown as MasterConfig,
  },
  {
    name: 'Alex Chen — Dev Portfolio',
    description: 'Minimalist developer portfolio with technical tone',
    theme: 'Minimalist',
    config: devPortfolio as unknown as MasterConfig,
  },
  {
    name: 'CloudSync Enterprise',
    description: 'Enterprise SaaS platform with formal, trust-focused design',
    theme: 'SaaS',
    config: enterpriseSaas as unknown as MasterConfig,
  },
  {
    name: 'Summit Realty Group',
    description: 'Real estate agency with warm, trust-focused professional design',
    theme: 'Professional',
    config: realEstate as unknown as MasterConfig,
  },
  {
    name: 'Barrett & Associates',
    description: 'Law firm with elegant, refined design conveying authority',
    theme: 'Elegant',
    config: lawFirm as unknown as MasterConfig,
  },
  {
    name: 'Hey Bradley — Capstone',
    description: 'Research site with blog, gallery, and Don Miller storytelling — Harvard crimson palette',
    theme: 'Elegant',
    config: capstone as unknown as MasterConfig,
  },
  {
    name: 'Stories from the kitchen',
    description: 'Standard blog page — hero, single article, minimal footer; warm precision palette',
    theme: 'Personal',
    config: blogStandard as unknown as MasterConfig,
  },
  {
    name: 'Linewise — SaaS Founder',
    description: 'Founder-narrative SaaS template with whitespace-heavy slate/blue aesthetic',
    theme: 'SaaS',
    config: saasFounder,
  },
  {
    name: 'Maya Okafor — Indie Portfolio',
    description: 'Bold indie designer portfolio — oversized type, near-black canvas, coral accent',
    theme: 'Creative',
    config: indiePortfolio,
  },
  {
    name: 'Wheelhouse Studio — B2B Agency',
    description: 'B2B brand & build agency — warm clay/cream palette, process-focused, named case studies',
    theme: 'Agency',
    config: b2bAgencyConfig,
  },
  {
    name: 'Hey Bradley — Flagship',
    description: 'The Hey Bradley public site recreated as a Hey Bradley project — moat priorities, AISP architecture, scoreboard, open-core vs commercial.',
    theme: 'Platform',
    config: heyBradleyFlagship,
  },
  {
    name: 'Lars Halvorsen — AI Engineer Personal',
    description: 'Spec-first agentic engineer portfolio — monospace headings, deep navy, GitHub-flavored.',
    theme: 'Tech Business',
    config: aiEngineerPersonal,
  },
  {
    name: 'Marigold & Co. — Local Business',
    description: 'Family-owned florist on Main Street — warm photography, friendly serif, hours+location prominent. Defaults that work for non-technical owners.',
    theme: 'Wellness',
    config: localBusiness,
  },
]
