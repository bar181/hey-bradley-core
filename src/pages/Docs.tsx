import { Link } from 'react-router-dom'
import { BookOpen, Palette, Layout, FileText, Zap, ExternalLink } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'

const QUICK_START = [
  {
    step: 1,
    title: 'Pick a Theme',
    description: 'Choose from 12 professional themes or start with one of 10 pre-built example sites. Each theme includes a full color palette, font stack, and section styling.',
  },
  {
    step: 2,
    title: 'Add and Customize Sections',
    description: 'Add sections like hero banners, pricing tables, testimonials, galleries, and more. Reorder them with drag-and-drop, tweak colors with the hex picker, and swap images from the 258+ media library.',
  },
  {
    step: 3,
    title: 'Generate Specs',
    description: 'Click the Blueprints tab to generate up to 6 enterprise-grade specification documents. Export your entire project as JSON to hand off to any developer or AI agent.',
  },
]

const WORKFLOW_STEPS = [
  { label: 'Pick theme or example', detail: 'Start from a pre-built site or choose a blank canvas with your preferred theme.' },
  { label: 'Customize in the builder', detail: 'Use SIMPLE mode for easy edits or EXPERT mode for full control over JSON, colors, fonts, and section variants.' },
  { label: 'Preview your site', detail: 'Toggle preview mode to see your site as visitors would. Check desktop, tablet, and mobile views.' },
  { label: 'Generate specifications', detail: 'Open the Blueprints tab to produce North Star, Architecture, Build Plan, Features, Specifications, and AISP documents.' },
  { label: 'Export and build', detail: 'Download your config as JSON. Hand it to a developer, feed it to an AI agent, or use the AISP spec for automated implementation.' },
]

const SECTION_TYPES = [
  { type: 'menu', name: 'Navigation Bar', variants: 2, description: 'Navigation bar with logo and links' },
  { type: 'hero', name: 'Hero', variants: 4, description: 'Main banner with headline, image, and call-to-action' },
  { type: 'columns', name: 'Content Cards', variants: 8, description: 'Cards with images, icons, and text in grid layouts' },
  { type: 'pricing', name: 'Pricing', variants: 3, description: 'Pricing plans and tier comparison' },
  { type: 'action', name: 'Action Block', variants: 4, description: 'Section with button and message for conversions' },
  { type: 'footer', name: 'Footer', variants: 4, description: 'Page footer with links and branding' },
  { type: 'quotes', name: 'Quotes', variants: 4, description: 'Customer testimonials and social proof' },
  { type: 'questions', name: 'Questions', variants: 4, description: 'Frequently asked questions with accordion' },
  { type: 'numbers', name: 'Numbers', variants: 4, description: 'Key metrics, stats, and value propositions' },
  { type: 'gallery', name: 'Gallery', variants: 4, description: 'Image gallery with lightbox and effects' },
  { type: 'image', name: 'Image', variants: 4, description: 'Full-width photo with optional text overlay' },
  { type: 'divider', name: 'Spacer', variants: 3, description: 'Visual separator between sections' },
  { type: 'text', name: 'Text', variants: 3, description: 'Long-form content for articles or about pages' },
  { type: 'logos', name: 'Logo Cloud', variants: 3, description: 'Partner or sponsor logos in a row' },
  { type: 'team', name: 'Team', variants: 3, description: 'Team member cards with photos and roles' },
  { type: 'cta', name: 'Call to Action', variants: 2, description: 'Focused conversion section' },
  { type: 'features', name: 'Features', variants: 2, description: 'Feature highlights with icons and descriptions' },
  { type: 'faq', name: 'FAQ', variants: 2, description: 'Expandable question-and-answer blocks' },
  { type: 'testimonials', name: 'Testimonials', variants: 1, description: 'Social proof and customer reviews' },
  { type: 'value-props', name: 'Value Props', variants: 1, description: 'Key selling points for your product' },
]

const THEMES = [
  { slug: 'saas', name: 'Tech Business', color: '#6366F1', description: 'Software products, developer tools, tech platforms' },
  { slug: 'agency', name: 'Agency', color: '#EC4899', description: 'Design studios, creative agencies, marketing firms' },
  { slug: 'portfolio', name: 'Portfolio', color: '#F59E0B', description: 'Photographers, designers, artists, visual creatives' },
  { slug: 'startup', name: 'Startup', color: '#10B981', description: 'Launch pages, coming soon, MVPs, product announcements' },
  { slug: 'personal', name: 'Personal', color: '#8B5CF6', description: 'Personal brands, resumes, freelancers, portfolios' },
  { slug: 'professional', name: 'Professional', color: '#1E40AF', description: 'Consulting, law firms, finance, B2B services' },
  { slug: 'wellness', name: 'Wellness', color: '#059669', description: 'Health, yoga, meditation, coaching, wellness' },
  { slug: 'minimalist', name: 'Minimalist', color: '#1F2937', description: 'Pure typography and whitespace, stripped to essentials' },
  { slug: 'creative', name: 'Creative', color: '#DC2626', description: 'Music, entertainment, events, art, expressive brands' },
  { slug: 'blog', name: 'Blog', color: '#7C3AED', description: 'Writers, publishers, newsletters, content creators' },
  { slug: 'elegant', name: 'Elegant', color: '#D4A574', description: 'Luxury brands, high-end services, refined experiences' },
  { slug: 'neon', name: 'Neon', color: '#00FF88', description: 'Gaming, nightlife, crypto, cutting-edge tech' },
]

const SPEC_GENERATORS = [
  { name: 'North Star', description: 'High-level project vision, goals, success metrics, and guiding principles. The "why" behind everything.' },
  { name: 'Architecture (SADD)', description: 'Software Architecture and Design Document covering tech stack, component structure, data flow, and deployment.' },
  { name: 'Build Plan', description: 'Sprint-by-sprint implementation plan with tasks, priorities, time estimates, and dependencies.' },
  { name: 'Features', description: 'Detailed feature inventory mapping every section to acceptance criteria and user stories.' },
  { name: 'Specifications', description: 'Plain-English specification readable by non-technical stakeholders. No jargon, clear visual references.' },
  { name: 'AISP Spec', description: 'Machine-verifiable Crystal Atom specification for AI agents. Typed fields, validation rules, and mathematical precision.' },
]

export function Docs() {
  const totalVariants = SECTION_TYPES.reduce((sum, s) => sum + s.variants, 0)

  return (
    <main className="min-h-screen bg-[#faf8f5] text-neutral-800">
      <MarketingNav />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-[#A51C30]" />
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">Documentation</h1>
        <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
          Everything you need to build with Hey Bradley &mdash; {SECTION_TYPES.length} section
          types, {totalVariants} variants, {THEMES.length} themes, and {SPEC_GENERATORS.length} spec generators.
        </p>
      </section>

      {/* Quick Start */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="w-6 h-6 text-[#A51C30]" />
          <h2 className="text-3xl font-bold text-neutral-900">Quick Start</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {QUICK_START.map((item) => (
            <div key={item.step} className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#A51C30] text-white flex items-center justify-center font-bold text-lg mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{item.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/new-project"
            className="inline-flex px-8 py-3 bg-[#A51C30] text-white font-semibold rounded-xl hover:bg-[#8B1729] transition-colors shadow-lg"
          >
            Open the Builder
          </Link>
        </div>
      </section>

      {/* Workflow */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-neutral-900 mb-8">Full Workflow</h2>
        <div className="space-y-4">
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-4 bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">{step.label}</h3>
                <p className="text-sm text-neutral-500">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section Reference */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Layout className="w-6 h-6 text-[#A51C30]" />
          <h2 className="text-3xl font-bold text-neutral-900">Section Reference</h2>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                <th className="px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Variants</th>
              </tr>
            </thead>
            <tbody>
              {SECTION_TYPES.map((s, i) => (
                <tr key={s.type} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                  <td className="px-6 py-3 font-mono text-sm text-[#A51C30]">{s.type}</td>
                  <td className="px-6 py-3 text-sm font-medium text-neutral-900">{s.name}</td>
                  <td className="px-6 py-3 text-sm text-neutral-500 hidden md:table-cell">{s.description}</td>
                  <td className="px-6 py-3 text-sm text-neutral-600 text-right">{s.variants}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-neutral-200 bg-neutral-50">
                <td className="px-6 py-3 font-semibold text-sm text-neutral-900" colSpan={3}>Total</td>
                <td className="px-6 py-3 font-semibold text-sm text-neutral-900 text-right">{totalVariants}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Theme Reference */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Palette className="w-6 h-6 text-[#A51C30]" />
          <h2 className="text-3xl font-bold text-neutral-900">Theme Reference</h2>
        </div>
        <p className="text-neutral-500 mb-6">
          Each theme includes a primary palette, 4 alternative palettes, a dark/light
          alternate mode, and custom typography. Switch between them in the builder
          sidebar.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {THEMES.map((t) => (
            <div key={t.slug} className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm text-center">
              <div
                className="w-12 h-12 rounded-xl mx-auto mb-3 shadow-inner"
                style={{ backgroundColor: t.color }}
              />
              <h3 className="text-sm font-semibold text-neutral-900">{t.name}</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-snug">{t.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spec Reference */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-6 h-6 text-[#A51C30]" />
          <h2 className="text-3xl font-bold text-neutral-900">Spec Generator Reference</h2>
        </div>
        <p className="text-neutral-500 mb-6">
          Hey Bradley generates 6 specification documents from your site config. Open
          the Blueprints tab in the builder to see them all.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {SPEC_GENERATORS.map((spec) => (
            <div key={spec.name} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{spec.name}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{spec.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-neutral-900 mb-8">Resources</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://github.com/bar181/aisp-open-core"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:border-[#A51C30]/30 transition-colors"
          >
            <ExternalLink className="w-5 h-5 text-[#A51C30] shrink-0" />
            <div>
              <h3 className="font-semibold text-neutral-900 text-sm">AISP Protocol Guide</h3>
              <p className="text-xs text-neutral-400">Open-source reference for the AI Symbolic Protocol</p>
            </div>
          </a>
          <a
            href="https://github.com/bar181/hey-bradley-core"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:border-[#A51C30]/30 transition-colors"
          >
            <ExternalLink className="w-5 h-5 text-[#A51C30] shrink-0" />
            <div>
              <h3 className="font-semibold text-neutral-900 text-sm">GitHub Repository</h3>
              <p className="text-xs text-neutral-400">Source code, issues, and documentation</p>
            </div>
          </a>
          <Link
            to="/how-i-built-this"
            className="flex items-center gap-3 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:border-[#A51C30]/30 transition-colors"
          >
            <ExternalLink className="w-5 h-5 text-[#A51C30] shrink-0" />
            <div>
              <h3 className="font-semibold text-neutral-900 text-sm">How I Built This</h3>
              <p className="text-xs text-neutral-400">Phase-by-phase development story and methodology</p>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <Link
          to="/new-project"
          className="inline-flex px-8 py-3 bg-[#A51C30] text-white font-semibold rounded-xl hover:bg-[#8B1729] transition-colors shadow-lg"
        >
          Start Building
        </Link>
      </section>
    </main>
  )
}
