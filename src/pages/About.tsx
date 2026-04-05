import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Cpu, Users, BookOpen, Atom } from 'lucide-react'

export function About() {
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
            <Link to="/open-core" className="text-neutral-500 hover:text-neutral-900 transition-colors">Open Core</Link>
            <Link to="/how-i-built-this" className="text-neutral-500 hover:text-neutral-900 transition-colors">How I Built This</Link>
            <Link to="/docs" className="text-neutral-500 hover:text-neutral-900 transition-colors">Docs</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/5 via-transparent to-amber-50/30" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <span className="inline-flex items-center gap-2 bg-[#A51C30]/10 text-[#A51C30] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Harvard ALM Capstone 2026
          </span>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">
            Meet Bradley
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            I&apos;m Bradley Ross, a Harvard ALM candidate building the future of
            spec-driven development. Hey Bradley is my capstone project&mdash;an
            AI-first website builder powered by a new kind of protocol.
          </p>
        </div>
      </section>

      {/* The AISP Protocol */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#A51C30]/10 flex items-center justify-center">
            <Atom className="w-5 h-5 text-[#A51C30]" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">The AISP Protocol</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">What is AISP?</h3>
            <p className="text-neutral-600 leading-relaxed">
              The <strong>AI Symbolic Protocol</strong> is a proof-based specification
              format that eliminates ambiguity from software documentation. Instead of
              vague descriptions that lose meaning as they pass from stakeholder to
              developer, AISP encodes intent as structured, machine-verifiable atoms.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Crystal Atoms</h3>
            <p className="text-neutral-600 leading-relaxed">
              Every section in a Hey Bradley spec is a <strong>Crystal Atom</strong>&mdash;a
              self-contained unit with typed fields, variant rules, and validation
              constraints. Atoms compose into molecules (pages) and organisms (full
              sites), creating specifications that AI agents can execute without guesswork.
            </p>
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="bg-neutral-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold">The Vision</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3 text-[#A51C30]">The Telephone Game</h3>
              <p className="text-neutral-400 leading-relaxed">
                Software specs degrade every time they change hands. Stakeholders
                describe intent, PMs write tickets, developers interpret code. Each
                handoff introduces drift. AISP eliminates that drift entirely.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3 text-[#A51C30]">The 55% Bottleneck</h3>
              <p className="text-neutral-400 leading-relaxed">
                Research shows up to 55% of development rework comes from
                miscommunicated requirements. Spec-driven development with AISP
                targets this bottleneck by making specifications the single source of
                truth that both humans and AI can parse.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3 text-[#A51C30]">Spec-Driven Development</h3>
              <p className="text-neutral-400 leading-relaxed">
                Write your spec, not your code. Hey Bradley generates 6 enterprise-grade
                specification documents from a single config. AI agents use those specs
                to build exactly what was specified&mdash;no more, no less.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built with Agentic Engineering */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#A51C30]/10 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-[#A51C30]" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">Built with Agentic Engineering</h2>
        </div>
        <p className="text-neutral-600 text-lg mb-8 max-w-3xl leading-relaxed">
          Hey Bradley wasn&apos;t built the traditional way. One human orchestrating
          up to 30 AI agents in parallel swarms, producing 91K lines across 470 files
          in under 50 hours.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Lines of Code', value: '91,533' },
            { label: 'Files', value: '470' },
            { label: 'AI Agents', value: '30+' },
            { label: 'Development Hours', value: '~46' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-neutral-200 p-6 text-center shadow-sm"
            >
              <div className="text-3xl font-bold text-[#A51C30] mb-1">{stat.value}</div>
              <div className="text-sm text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-neutral-400" />
            <h3 className="text-lg font-semibold text-neutral-900">The Team</h3>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            1 human + AI agent swarms (up to 14 parallel). Using SPARC methodology,
            ADR-driven architecture decisions, and hierarchical mesh topologies to
            coordinate coder, reviewer, tester, planner, and researcher agents across
            every sprint.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Ready to try it?</h2>
        <p className="text-neutral-500 mb-8">Jump straight into the builder or read the docs first.</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/new-project"
            className="px-8 py-3 bg-[#A51C30] text-white font-semibold rounded-xl hover:bg-[#8B1729] transition-colors shadow-lg"
          >
            Get Started
          </Link>
          <Link
            to="/docs"
            className="px-8 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-100 transition-colors"
          >
            Read the Docs
          </Link>
        </div>
      </section>
    </main>
  )
}
