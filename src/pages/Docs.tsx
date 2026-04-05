import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Palette, Layout, FileText } from 'lucide-react'

const GETTING_STARTED = [
  { step: 1, title: 'Pick a Template', description: 'Choose from 10 themes and 8 example sites, or start from a blank canvas.' },
  { step: 2, title: 'Customize', description: 'Add, remove, and reorder sections. Tweak colors, fonts, images, and content in the visual builder.' },
  { step: 3, title: 'Export Your Spec', description: 'Generate up to 6 enterprise-grade specification documents with one click.' },
]

const SECTION_TYPES = [
  { type: 'menu', name: 'Top Menu', variants: 2, description: 'Navigation bar with logo and links' },
  { type: 'hero', name: 'Main Banner', variants: 4, description: 'Main banner with headline and button' },
  { type: 'columns', name: 'Content Cards', variants: 8, description: 'Cards with images, icons, and text' },
  { type: 'pricing', name: 'Pricing', variants: 3, description: 'Pricing plans and tiers' },
  { type: 'action', name: 'Action Block', variants: 4, description: 'Section with button and message' },
  { type: 'footer', name: 'Footer', variants: 4, description: 'Page footer with links' },
  { type: 'quotes', name: 'Quotes', variants: 4, description: 'Customer testimonials and quotes' },
  { type: 'questions', name: 'Questions', variants: 4, description: 'Frequently asked questions' },
  { type: 'numbers', name: 'Numbers', variants: 4, description: 'Key value propositions and stats' },
  { type: 'gallery', name: 'Gallery', variants: 4, description: 'Image gallery' },
  { type: 'image', name: 'Image', variants: 4, description: 'A big photo with optional text on top' },
  { type: 'divider', name: 'Spacer', variants: 3, description: 'A line or space between sections' },
  { type: 'text', name: 'Text', variants: 3, description: 'A block of text for articles or stories' },
  { type: 'logos', name: 'Logo Cloud', variants: 3, description: 'Show partner or sponsor logos in a row' },
  { type: 'team', name: 'Team', variants: 3, description: 'Team member cards with photos and roles' },
  { type: 'cta', name: 'Call to Action', variants: 2, description: 'Focused call-to-action section' },
  { type: 'features', name: 'Features', variants: 2, description: 'Feature highlights with icons' },
  { type: 'faq', name: 'FAQ', variants: 2, description: 'Expandable question-and-answer blocks' },
  { type: 'testimonials', name: 'Testimonials', variants: 1, description: 'Social proof and reviews' },
  { type: 'value-props', name: 'Value Props', variants: 1, description: 'Key selling points' },
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
]

const SPEC_GENERATORS = [
  { name: 'North Star', description: 'High-level project vision, goals, success metrics, and guiding principles for the entire site.' },
  { name: 'SADD', description: 'Software Architecture & Design Document covering tech stack, data flow, components, and deployment.' },
  { name: 'Build Plan', description: 'Sprint-by-sprint implementation plan with tasks, priorities, estimates, and dependencies.' },
  { name: 'Features', description: 'Detailed feature inventory mapping every section to acceptance criteria and user stories.' },
  { name: 'Human Spec', description: 'Plain-English specification readable by non-technical stakeholders with visual references.' },
  { name: 'AISP Spec', description: 'Machine-verifiable Crystal Atom specification for AI agents with typed fields and validation rules.' },
]

export function Docs() {
  const totalVariants = SECTION_TYPES.reduce((sum, s) => sum + s.variants, 0)

  return (
    <main className="min-h-screen bg-[#faf8f5] text-neutral-800">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Hey Bradley</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/about" className="text-neutral-500 hover:text-neutral-900 transition-colors">About</Link>
            <Link to="/open-core" className="text-neutral-500 hover:text-neutral-900 transition-colors">Open Core</Link>
            <Link to="/how-i-built-this" className="text-neutral-500 hover:text-neutral-900 transition-colors">How I Built This</Link>
          </div>
        </div>
      </nav>

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

      {/* Getting Started */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-neutral-900 mb-8">Getting Started</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {GETTING_STARTED.map((item) => (
            <div key={item.step} className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#A51C30] text-white flex items-center justify-center font-bold text-lg mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{item.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{item.description}</p>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
        <div className="grid md:grid-cols-2 gap-4">
          {SPEC_GENERATORS.map((spec) => (
            <div key={spec.name} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{spec.name}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{spec.description}</p>
            </div>
          ))}
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
