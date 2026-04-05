import { Link } from 'react-router-dom'
import { ArrowLeft, Code, Clock, Users, DollarSign, FileText, Layers, Cpu } from 'lucide-react'

const STATS = [
  { icon: Code, label: 'Lines of Code', value: '91,533' },
  { icon: FileText, label: 'Files', value: '470' },
  { icon: Clock, label: 'Dev Hours', value: '~46' },
  { icon: DollarSign, label: 'COCOMO Estimate', value: '$2.63M' },
  { icon: Users, label: 'COCOMO Team Size', value: '11.77' },
  { icon: Layers, label: 'Tests Passing', value: '71' },
]

const PHASES = [
  { phase: 'P1', name: 'Scaffolding', score: 52, hours: '~4h' },
  { phase: 'P2', name: 'Themes & Config', score: 55, hours: '~4h' },
  { phase: 'P3', name: 'Section Templates', score: 62, hours: '~4h' },
  { phase: 'P4', name: 'Examples & Polish', score: 76, hours: '~4h' },
  { phase: 'P5', name: 'Chat Simulation', score: 75, hours: '~4h' },
  { phase: 'P6', name: 'Listen Mode', score: 78, hours: '~4h' },
  { phase: 'P7', name: 'Demo Flow', score: 85, hours: '~4h' },
  { phase: 'P8', name: 'Kitchen Sink', score: 87, hours: '~4h' },
  { phase: 'P9', name: 'Pre-LLM MVP', score: 92, hours: '~10h' },
  { phase: 'P10', name: 'JSON Architecture', score: 92, hours: '~4h' },
]

const METHODOLOGY = [
  {
    icon: Cpu,
    title: 'SPARC Methodology',
    description:
      'Specification, Pseudocode, Architecture, Refinement, Completion. Each phase follows a structured 5-step process with dedicated AI agents for each step.',
  },
  {
    icon: Users,
    title: 'Agentic Swarms',
    description:
      'Up to 14 AI agents running in parallel hierarchical mesh topologies. Coder, reviewer, tester, planner, and researcher agents coordinated through a single human orchestrator.',
  },
  {
    icon: Layers,
    title: 'ADR-Driven Architecture',
    description:
      '33 Architecture Decision Records document every significant choice. From state management (Zustand) to spec formats (AISP atoms) to deployment (Vercel CI/CD).',
  },
]

export function HowIBuiltThis() {
  const maxScore = 100

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
            <Link to="/open-core" className="text-neutral-500 hover:text-white transition-colors">Open Core</Link>
            <Link to="/docs" className="text-neutral-500 hover:text-white transition-colors">Docs</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/10 via-transparent to-indigo-600/10" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            91,533 Lines in 7 Days
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            One human, 30+ AI agents, and a methodology that compressed 20 months
            of COCOMO-estimated work into under 50 hours.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <stat.icon className="w-5 h-5 text-[#A51C30] mx-auto mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-neutral-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Phase Trajectory */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">Phase Trajectory</h2>
        <div className="space-y-3">
          {PHASES.map((p) => (
            <div key={p.phase} className="flex items-center gap-4">
              <div className="w-10 text-sm font-mono text-neutral-500 shrink-0">{p.phase}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-300">{p.name}</span>
                  <span className="text-sm text-neutral-500">{p.score}/100 &middot; {p.hours}</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#A51C30] to-indigo-500 transition-all duration-500"
                    style={{ width: `${(p.score / maxScore) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-neutral-500 mt-6">
          Average phase score: 80.4/100. Score reflects feature completeness, code quality,
          test coverage, and design polish evaluated at each phase gate.
        </p>
      </section>

      {/* Methodology */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">The Methodology</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {METHODOLOGY.map((m) => (
            <div key={m.title} className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <m.icon className="w-8 h-8 text-[#A51C30] mb-4" />
              <h3 className="text-lg font-semibold mb-3">{m.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COCOMO Comparison */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">COCOMO vs Actual</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Metric</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-400">COCOMO Estimate</th>
                <th className="px-6 py-4 text-sm font-semibold text-neutral-400">Actual</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-white/5">
                <td className="px-6 py-4 text-neutral-300">Cost</td>
                <td className="px-6 py-4 text-neutral-400">$2.63M</td>
                <td className="px-6 py-4 text-emerald-400 font-semibold">~$0</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-6 py-4 text-neutral-300">Schedule</td>
                <td className="px-6 py-4 text-neutral-400">19.87 months</td>
                <td className="px-6 py-4 text-emerald-400 font-semibold">~46 hours</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-neutral-300">Team</td>
                <td className="px-6 py-4 text-neutral-400">11.77 people</td>
                <td className="px-6 py-4 text-emerald-400 font-semibold">1 human + AI swarms</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-neutral-500 mt-4">
          ~340x schedule compression achieved through parallel AI agent swarms, automated code
          generation with human review gates, and AISP spec-driven development.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/new-project"
            className="px-8 py-3 bg-[#A51C30] text-white font-semibold rounded-xl hover:bg-[#8B1729] transition-colors shadow-lg"
          >
            Try the Builder
          </Link>
          <Link
            to="/docs"
            className="px-8 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
          >
            Read the Docs
          </Link>
        </div>
      </section>
    </main>
  )
}
