import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Lock, Key, Sparkles } from 'lucide-react'

const FREE_FEATURES = [
  'Full visual builder with drag-and-drop sections',
  '10 themes with 57 section variants',
  '8 example websites to start from',
  '6 enterprise spec generators (North Star, SADD, Build Plan, Features, Human Spec, AISP)',
  'Local project save and load (JSON)',
  'Image upload and management',
  'Real-time preview canvas',
  'Hex color picker and font controls',
]

const COMING_FEATURES = [
  'AISP intent agents that parse natural language into specs',
  'Hosted LLM chat and listen modes',
  'Cloud persistence and project sharing',
  'Team collaboration with role-based access',
  'Brownfield analysis for existing codebases',
  'Custom theme builder with AI suggestions',
  'Version history and spec diffing',
  'CI/CD integration for spec-to-deploy pipelines',
]

const TIERS = [
  {
    name: 'Community',
    price: 'Free',
    description: 'Everything you need to build and generate specs locally.',
    features: ['Full builder access', '10 themes, 57 variants', '8 examples', '6 spec generators', 'Local save/load', 'Image upload'],
    cta: 'Get Started',
    ctaLink: '/new-project',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29/mo',
    description: 'AI-powered modes and cloud features for serious builders.',
    features: ['Everything in Community', 'AI chat mode', 'AI listen mode', 'Cloud persistence', 'Project sharing links', 'Priority support'],
    cta: 'Coming Soon',
    ctaLink: '#',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Team collaboration, brownfield analysis, and dedicated support.',
    features: ['Everything in Pro', 'Team workspaces', 'Brownfield codebase analysis', 'SSO and RBAC', 'Dedicated onboarding', 'Custom integrations'],
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
            The full builder is free and always will be. Commercial features add
            AI-powered modes, cloud persistence, and team collaboration.
          </p>
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
            Add your Claude API key to unlock AI chat and listen modes today&mdash;no
            subscription needed. Your key stays in your browser&apos;s local storage and
            is never sent to our servers. Full AI-powered building with zero vendor lock-in.
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
    </main>
  )
}
