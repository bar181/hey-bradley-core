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
import coffeeRoaster from './coffee-roaster.json'
import devConference from './dev-conference.json'
import podcastShow from './podcast-show.json'
// P68 / OC-4 Templates Round 2 — Healthcare/Wellness (A1)
import clinic from './clinic.json'
import wellnessCoach from './wellness-coach.json'
import mentalHealthPractice from './mental-health-practice.json'
import telehealth from './telehealth.json'
// P68 / OC-4 Templates Round 2 — Creator/Personal Brand (A2)
import founderStory from './founder-story.json'
import creatorYoutuber from './creator-youtuber.json'
import speaker from './speaker.json'
import researcherAcademic from './researcher-academic.json'
// P68 / OC-4 Templates Round 2 — Dev Tools/OSS (A3)
import cliTool from './cli-tool.json'
import ossLibrary from './oss-library.json'
import apiDocsLanding from './api-docs-landing.json'
// P80 / OC-15 — Agentic-product templates (A1)
import aiAgentMarketplace from './ai-agent-marketplace.json'
import aiCodingCopilot from './ai-coding-copilot.json'
import aiWorkflowPlatform from './ai-workflow-platform.json'
import aiSupportCopilot from './ai-support-copilot.json'
// E2E test sprint — 2 sites built end-to-end via simulated pipeline
import aispExecutive from './aisp-executive.json'
import aispDeveloperRetro from './aisp-developer-retro.json'
// E2E-TEST-2 — 3 multi-scenario pipeline-validation sites
import coffeeEssay from './coffee-essay.json'
import northLightAgency from './north-light-agency.json'
import indieCoffeeRoaster from './indie-coffee-roaster.json'
// 5-PROJECTS sprint — 5 persona-driven full-pipeline builds (post-P109)
import axonCli from './axon-cli.json'
import greenlaneStartup from './greenlane-startup.json'
import quattroStudio from './quattro-studio.json'
import mrsAlbrightTutoring from './mrs-albright-tutoring.json'
import bordoSpec from './bordo-spec.json'
// P113 / QUALITY-PUSH / A3 — 5 opinionated storytelling-voice example sites
import podcasterIndie from './podcaster-indie.json'
import courseCreatorTech from './course-creator-tech.json'
import contrarianBlog from './contrarian-blog.json'
import indieAuthorFiction from './indie-author-fiction.json'
import researchNewsletter from './research-newsletter.json'
import type { MasterConfig } from '@/lib/schemas'
import { validateSectionType } from '@/lib/schemas/section'

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
  {
    name: 'Beanstalk Coffee Co.',
    description: 'E-commerce subscription brand for an indie Brooklyn roaster — warm earth tones, Fraunces serif, transparent direct-trade voice.',
    theme: 'Wellness',
    config: coffeeRoaster as unknown as MasterConfig,
  },
  {
    name: 'ShipFast Conf 2026',
    description: 'Senior-engineer conference landing — dark canvas, JetBrains Mono accents, single-track agenda voice. Brooklyn, Oct 14-15.',
    theme: 'SaaS',
    config: devConference as unknown as MasterConfig,
  },
  {
    name: 'Build Mode — Podcast',
    description: 'Agentic-engineering podcast — deep purple canvas, indigo accent, episode-card layout, conversational inside-baseball voice.',
    theme: 'Creative',
    config: podcastShow as unknown as MasterConfig,
  },
  // P68 / OC-4 — Healthcare/Wellness (A1)
  {
    name: 'Clinic — Lakeside Family Health',
    description: 'Independent primary-care clinic — same-week appointments, longer visits, trust-blue palette and warm professional voice.',
    theme: 'Professional',
    config: clinic as unknown as MasterConfig,
  },
  {
    name: 'Wellness Coach — Aria Mendez',
    description: 'Holistic wellness coach — soft sage palette, Fraunces serif, narrative coaching voice and program-first CTAs.',
    theme: 'Wellness',
    config: wellnessCoach as unknown as MasterConfig,
  },
  {
    name: 'Mental Health — Hartwell Therapy',
    description: 'Therapy practice — calm muted palette, careful editorial copy, accessibility-first and consent-led.',
    theme: 'Wellness',
    config: mentalHealthPractice as unknown as MasterConfig,
  },
  {
    name: 'Telehealth — Caremeet',
    description: 'Consumer telehealth platform marketing — clean Inter sans, modern teal, on-demand visit voice.',
    theme: 'SaaS',
    config: telehealth as unknown as MasterConfig,
  },
  // P68 / OC-4 — Creator/Personal Brand (A2)
  {
    name: 'Founder Story — Marcus Hale',
    description: 'Solo-founder narrative landing — building Linkpath in public, editorial cream canvas, candid-narrative tone.',
    theme: 'Personal',
    config: founderStory as unknown as MasterConfig,
  },
  {
    name: 'Creator — Sloane Park',
    description: 'YouTuber/creator brand — bold modern Inter, video-first hero, sponsor + community CTAs.',
    theme: 'Creative',
    config: creatorYoutuber as unknown as MasterConfig,
  },
  {
    name: 'Speaker — Dr. Renata Vela',
    description: 'Keynote speaker — Playfair Display serif, deep navy authority palette, conference-talk reel and booking CTA.',
    theme: 'Elegant',
    config: speaker as unknown as MasterConfig,
  },
  {
    name: 'Academic — Dr. Theo Yamada',
    description: 'Academic / research personal brand — cream canvas, Fraunces serif, publication list and lab-link prominence.',
    theme: 'Personal',
    config: researcherAcademic as unknown as MasterConfig,
  },
  // P68 / OC-4 — Dev Tools/OSS (A3)
  {
    name: 'CLI Tool — rolldown',
    description: 'CLI / dev-tool product — JetBrains Mono, dark canvas, install-snippet hero, AISP-prominent spec voice.',
    theme: 'Tech Business',
    config: cliTool as unknown as MasterConfig,
  },
  {
    name: 'OSS Library — ConfigMesh',
    description: 'Open-source library landing — monospace headings, GitHub-flavored navy, ambiguity-collapsing AISP section, contributor + sponsor CTAs.',
    theme: 'Tech Business',
    config: ossLibrary as unknown as MasterConfig,
  },
  {
    name: 'API Docs — Pulse API',
    description: 'API documentation marketing — dense info, monospace accents, code-sample hero, spec-driven AISP block.',
    theme: 'Tech Business',
    config: apiDocsLanding as unknown as MasterConfig,
  },
  // P80 / OC-15 — Agentic-product templates (A1)
  {
    name: 'Atlas — AI Agent Marketplace',
    description: 'Curated marketplace for specialist AI agents — capability-tagged search, per-task pricing, one SDK across 1,200 agents. Indigo-violet on near-black canvas.',
    theme: 'Tech Business',
    config: aiAgentMarketplace as unknown as MasterConfig,
  },
  {
    name: 'Mileform — AI Coding Copilot',
    description: 'Spec-first IDE pair programmer — VS Code/JetBrains/Neovim, repo-aware diffs, JetBrains Mono headings, teal accent on graphite canvas.',
    theme: 'Tech Business',
    config: aiCodingCopilot as unknown as MasterConfig,
  },
  {
    name: 'Threadbase — AI Workflow Platform',
    description: 'Zapier-meets-AI flow builder — 180 integrations, every node an agent, amber accent on slate canvas, ops-friendly outcomes-first voice.',
    theme: 'Tech Business',
    config: aiWorkflowPlatform as unknown as MasterConfig,
  },
  {
    name: 'Solva — AI Support Copilot',
    description: 'Helpdesk copilot for support teams — Zendesk/Intercom/Front, 38% deflection ROI numbers, warm cream light theme with teal+amber accents.',
    theme: 'Professional',
    config: aiSupportCopilot as unknown as MasterConfig,
  },
  // E2E test sprint — 2 sites built end-to-end via simulated pipeline
  {
    name: 'AISP Executive Overview',
    description: 'Executive-level AISP overview — ROI, benefits, how it works (built end-to-end via simulated pipeline)',
    theme: 'Professional',
    config: aispExecutive as unknown as MasterConfig,
  },
  {
    name: 'AISP Developer Retro',
    description: 'Developer-focused AISP + agentic workflow — terminal aesthetic with dry humor',
    theme: 'Tech Business',
    config: aispDeveloperRetro as unknown as MasterConfig,
  },
  // E2E-TEST-2 — 3 multi-scenario pipeline-validation sites (built end-to-end via simulated AgentProxy)
  {
    name: 'The Pour Lab — Coffee Essay',
    description: 'Specialty coffee long-form blog — Hario V60 essay, warm-paper palette, Fraunces serif. Built via DECOMP-heavy long-form-paste pipeline.',
    theme: 'Personal',
    config: coffeeEssay as unknown as MasterConfig,
  },
  {
    name: 'North Light — Wes Anderson Agency',
    description: 'Four-person Vancouver creative agency — Wes Anderson voice, gold-on-deep-green palette, named case studies. Built via mixed chat+listen brand+contact pipeline.',
    theme: 'Agency',
    config: northLightAgency as unknown as MasterConfig,
  },
  {
    name: 'Switchback — Indie Coffee Roaster',
    description: 'Direct-trade Brooklyn coffee roaster — punchy listen-mode build with disfluency-stripped raw+cleaned transcripts. Warm-earth palette, conversational tone.',
    theme: 'Wellness',
    config: indieCoffeeRoaster as unknown as MasterConfig,
  },
  // 5-PROJECTS sprint — full-pipeline persona-driven builds with seeded log_events
  {
    name: 'Axon CLI — Agentic Code Review',
    description: 'Multi-page developer-tool landing (home + docs) for a hypothetical parallel-review CLI. Dark terminal, monospace, 30 parallel agents. Built via 10-prompt full-pipeline simulation.',
    theme: 'Tech Business',
    config: axonCli as unknown as MasterConfig,
  },
  {
    name: 'GreenLane — Compliance for Clean Energy',
    description: 'B2B SaaS landing with Don Miller story-brand framing. Voice arc from startup-bro to understated-professional across 8 chat turns. Deep-green palette, founder-direct copy.',
    theme: 'SaaS',
    config: greenlaneStartup as unknown as MasterConfig,
  },
  {
    name: 'Quattro Studio — Boutique Brand Agency',
    description: 'Austin agency for seed-to-Series-B startups. Polished/restrained voice. Case studies + portfolio gallery + contact form. Warm-cream + deep-navy + brass palette.',
    theme: 'Agency',
    config: quattroStudio as unknown as MasterConfig,
  },
  {
    name: 'Mrs. Albright\'s Tutoring',
    description: 'Retired English teacher offering remote tutoring. Built via 10 voice transcripts with disfluencies stripped via cleanTranscript. Warm-yellow palette, plain-spoken voice, larger body type for older eyes.',
    theme: 'Personal',
    config: mrsAlbrightTutoring as unknown as MasterConfig,
  },
  {
    name: 'Bordo — Wineries Spec',
    description: 'Agentic-engineering spec showcase. PROCESS_ATOM + DDD + AGENT atoms wired into a 6-prompt Planning-mode build. Includes TDD scaffold + KISS verdict + Seal panel + Claude Code bundle export.',
    theme: 'Tech Business',
    config: bordoSpec as unknown as MasterConfig,
  },
  // P113 / QUALITY-PUSH / A3 — 5 opinionated storytelling-voice example sites.
  // Each cites one of the 8 storytelling presets shipped by sibling A2.
  {
    name: 'Cassette · Season Four',
    description: 'Indie podcaster shipping season 4 — dry-humor narrator voice, over-precise specifics. Listener pull-quotes, sponsor tiers, episode tiles.',
    theme: 'Personal',
    config: podcasterIndie as unknown as MasterConfig,
  },
  {
    name: 'Concrete · Production Rust Course',
    description: 'Founder-direct tech-course creator running 8-week cohorts — confident, restrained-not-bro voice. Cites cohort dates and named students.',
    theme: 'Tech Business',
    config: courseCreatorTech as unknown as MasterConfig,
  },
  {
    name: 'The Slower Path · Opinion Blog',
    description: 'Contrarian-tech opinion blogger — sharp, controversial-adjacent takes about software. Archive of takes, reader replies, no Patreon.',
    theme: 'Personal',
    config: contrarianBlog as unknown as MasterConfig,
  },
  {
    name: 'Mira Chen · Fiction',
    description: 'Indie literary fiction author with 3 novels — Theron-Miller hard-twist voice. Specific opening anecdote pivots into the whole approach.',
    theme: 'Elegant',
    config: indieAuthorFiction as unknown as MasterConfig,
  },
  {
    name: 'Receipts · AI Policy Newsletter',
    description: 'Academic-rigor research newsletter on AI policy — claim + evidence + counterargument + sources. Free + paid tiers, named subscriber testimonials.',
    theme: 'Professional',
    config: researchNewsletter as unknown as MasterConfig,
  },
]

// ---------------------------------------------------------------------------
// P105 / RC-BLOCKERS-CLOSURE / A4 — validateSectionType production wire
// ---------------------------------------------------------------------------
// Closes A6 + B1 convergence: P104 shipped `validateSectionType` with a
// 10-entry alias map but had ZERO callers outside its declaration file. This
// dev-only pass iterates each EXAMPLE_SITES entry's sections (top-level +
// per-page) and surfaces alias / unknown-type warnings at module-load time.
// OBSERVATIONAL ONLY — no mutation; Zod (sectionTypeSchema) remains the strict
// source of truth for MasterConfig validation.
if (typeof console !== 'undefined' && import.meta.env.DEV) {
  for (const site of EXAMPLE_SITES) {
    const cfg = site.config
    for (const section of cfg.sections ?? []) {
      validateSectionType(section.type)
    }
    for (const page of cfg.pages ?? []) {
      for (const section of page.sections ?? []) {
        validateSectionType(section.type)
      }
    }
  }
}
