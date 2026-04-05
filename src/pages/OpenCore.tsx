import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Lock, Key, Sparkles, Globe, Code } from 'lucide-react'

const FREE_FEATURES = [
  'Full visual builder with drag-and-drop sections',
  '12 themes with 60+ section variants',
  '10 example websites across diverse industries',
  '6 enterprise spec generators (North Star, SADD, Build Plan, Features, Human Spec, AISP)',
  'Local project save and load (JSON export/import)',
  '258+ curated images in the media library',
  'Real-time preview canvas with responsive modes',
  'Hex color picker, font controls, and palette switching',
  'Brand and design locks for project identity protection',
  'Simulated chat and listen modes for demo workflows',
]

const COMING_FEATURES = [
  'AI chat mode with real LLM integration for natural language site building',
  'AI listen mode with voice-to-spec conversion',
  'Cloud persistence with Supabase (user accounts, saved projects)',
  'Team collaboration with role-based access control',
  'Brownfield analysis for existing codebases',
  'Custom theme builder with AI-powered suggestions',
  'Version history with spec diffing',
  'CI/CD integration for spec-to-deploy pipelines',
]

const TIERS = [
  {
    name: 'Community',
    price: 'Free',
    description: 'The full builder, 12 themes, 10 examples, 6 spec generators, and local persistence. Everything you need to design and spec a website.',
    features: ['Full visual builder', '12 themes, 60+ variants', '10 example sites', '6 spec generators', 'JSON export/import', '258+ media images', 'Brand and design locks'],
    cta: 'Start Building',
    ctaLink: '/new-project',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29/mo',
    description: 'AI-powered chat and listen modes, cloud persistence, and project sharing for teams that ship faster.',
    features: ['Everything in Community', 'AI chat mode (Claude)', 'AI listen mode (voice)', 'Cloud project storage', 'Shareable project links', 'Priority support', 'BYOK option included'],
    cta: 'Coming Soon',
    ctaLink: '#',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Team workspaces, brownfield codebase analysis, SSO, and dedicated onboarding for organizations.',
    features: ['Everything in Pro', 'Team workspaces', 'Brownfield analysis', 'SSO and RBAC', 'Dedicated onboarding', 'Custom integrations', 'SLA guarantee'],
    cta: 'Contact Us',
    ctaLink: '#',
    highlight: false,
  },
]

export function OpenCore() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0b0f1a]/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">Hey Bradley</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/about" className="text-neutral-500 hover:text-white transition-colors">About</Link>
            <Link to="/how-i-built-this" className="text-neutral-500 hover:text-white transition-colors">How I Built This</Link>
            <Link to="/docs" className="text-neutral-500 hover:text-white transition-colors">Docs</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Open Core, Open Future
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            The full builder is free and always will be. You get 12 themes, 10
            examples, 6 spec generators, and a visual builder that turns ideas into
            precise specifications. Commercial features add AI-powered modes, cloud
            persistence, and team collaboration.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-8">
            <Globe className="w-8 h-8 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Why Open Core?</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                Building one product and cutting the open-source release at the natural
                boundary where the next feature requires infrastructure. Everything
                that runs in your browser ships free. Cloud storage, real AI, and team
                features are where the commercial tier begins.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-8">
            <Code className="w-8 h-8 text-indigo-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">For Agentic Engineers</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                The open-source builder includes clear placeholders where LLM and
                database connections attach. Any skilled engineer can wire their own
                Claude API key, connect a Supabase instance, or plug in a custom LLM.
                You are not paying for tokens or hosting&mdash;the architecture is yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Free */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold">What&apos;s Free</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {FREE_FEATURES.map((feature) => (
            <div key={feature} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
              <Check className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-neutral-300">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What's Coming */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold">What&apos;s Coming (Commercial)</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {COMING_FEATURES.map((feature) => (
            <div key={feature} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
              <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
              <span className="text-neutral-300">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BYOK */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-amber-500/10 via-white/5 to-amber-500/5 border border-amber-500/20 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold">Bring Your Own Key (BYOK)</h2>
          </div>
          <p className="text-neutral-300 leading-relaxed max-w-2xl">
            When AI modes launch, you will be able to add your own Claude API key to
            unlock chat and listen modes without a subscription. Your key stays in
            your browser&apos;s local storage and is never sent to our servers. Full
            AI-powered building with zero vendor lock-in. The BYOK option will also
            be included in every Pro plan at no additional cost.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Path</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 flex flex-col ${
                tier.highlight
                  ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500/40'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
              <div className="text-3xl font-bold text-[#A51C30] mb-3">{tier.price}</div>
              <p className="text-neutral-400 text-sm mb-6">{tier.description}</p>
              <ul className="space-y-2 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={tier.ctaLink}
                className={`w-full text-center py-3 rounded-xl font-semibold transition-colors ${
                  tier.highlight
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : tier.ctaLink === '#'
                      ? 'bg-white/10 text-neutral-400 cursor-default'
                      : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-neutral-500 mb-6">The Community edition is available now. No sign-up required.</p>
        <Link
          to="/new-project"
          className="inline-flex px-8 py-3 bg-[#A51C30] text-white font-semibold rounded-xl hover:bg-[#8B1729] transition-colors shadow-lg"
        >
          Start Building for Free
        </Link>
      </section>
    </main>
  )
}
