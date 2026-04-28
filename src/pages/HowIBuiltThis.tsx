import { Link } from 'react-router-dom'
import { Code, Clock, Users, FileText, Layers, Cpu, Atom, GitBranch } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'

const STATS = [
  { icon: Code, label: 'Lines of TS/TSX', value: '~28K' },
  { icon: FileText, label: 'Source Files', value: '227' },
  { icon: Clock, label: 'Dev Hours', value: '~60' },
  { icon: Layers, label: 'ADRs', value: '43' },
  { icon: Users, label: 'Bounded Contexts', value: '5' },
  { icon: Layers, label: 'Tests Passing', value: '63+' },
]

const PHASES = [
  { phase: 'P1-P10', name: 'POC Foundation', score: 80, hours: '~30h', description: '15 section types, 12 themes, JSON-driven architecture, AISP Crystal Atoms, Zod validation, 17 example sites' },
  { phase: 'P11', name: 'Website + Demos', score: 83, hours: '~4h', description: 'Marketing pages, enhanced chat/listen demos, brand locks' },
  { phase: 'P12', name: 'Content Intelligence', score: 78, hours: '~4h', description: 'Site context, 13 image effects, Resources tab' },
  { phase: 'P13', name: 'Advanced Features', score: 76, hours: '~4h', description: 'Blog section, multi-page, ZIP export, a11y' },
  { phase: 'P14', name: 'Marketing Review', score: 74, hours: '~4h', description: '20 issues fixed, AISP validation, UI/UX cleanup' },
  { phase: 'P15', name: 'Polish + Novice Mode', score: 82, hours: '~4h', description: 'DRAFT/EXPERT modes, kitchen sink, blog example, jargon hidden' },
  { phase: 'P16', name: 'Local Database', score: 86, hours: '~6h', description: 'sql.js + IndexedDB, 5 typed CRUD repos, cross-tab Web Locks' },
  { phase: 'P17', name: 'LLM Provider Abstraction', score: 88, hours: '~5h', description: 'LLMAdapter interface, BYOK, husky pre-commit, vite build-time guard' },
  { phase: 'P18', name: 'Real Chat Mode', score: 89, hours: '~6h', description: 'LLM → JSON patches, AISP Crystal Atom system prompt, validator + applier + audit log' },
  { phase: 'P18b', name: 'Provider Expansion', score: 90, hours: '~3h', description: '5-provider matrix (Claude / Gemini / OpenRouter / Simulated / AgentProxy mock), llm_logs observability' },
  { phase: 'P19', name: 'Listen Mode', score: 88, hours: '~6h', description: 'Web Speech STT, push-to-talk, voice → chat pipeline; 4 brutal reviews + 18 fix-pass items' },
  { phase: 'P20', name: 'MVP Close', score: 'TBD', hours: '~4h', description: 'Cost-cap UI, SECURITY.md, mvp-e2e, Vercel deploy, persona re-score (in flight)' },
  { phase: 'P21', name: 'Cleanup + ADRs', score: 95, hours: '~1h', description: 'Sealed-phase archive, 5 ADR amendments + 4 stubs + ADR-054 DDD bounded contexts' },
]

const METHODOLOGY = [
  {
    icon: Cpu,
    title: 'SPARC Methodology',
    description:
      'Specification, Pseudocode, Architecture, Refinement, Completion. Each phase follows a structured 5-step process. Specs become pseudocode become architecture become tested features.',
  },
  {
    icon: Users,
    title: 'Agentic Swarms',
    description:
      'Up to 14 AI agents running in parallel hierarchical mesh topologies. Coder, reviewer, tester, planner, and researcher agents coordinated through a single human orchestrator.',
  },
  {
    icon: Layers,
    title: '43 Architecture Decision Records',
    description:
      'Every significant choice is documented as an ADR. From state management (Zustand) to AISP Crystal Atoms (ADR-045) to local SQLite persistence (ADR-040) to BYOK trust boundaries (ADR-043) to the 5 DDD bounded contexts (ADR-054). Each ADR captures context, decision, and consequences.',
  },
]

const INNOVATIONS = [
  {
    icon: Atom,
    title: 'AISP Crystal Atoms',
    description:
      'A math-first specification format with 512 symbols that LLMs understand natively. Each section becomes a verifiable atom with typed fields, variant rules, and validation constraints. Target: less than 2% ambiguity per atom.',
  },
  {
    icon: GitBranch,
    title: 'JSON-Driven Architecture',
    description:
      'The entire site is a single MasterConfig JSON object validated by Zod schemas. Themes, sections, components, and metadata are all data, not code. The builder is a configuration UI, not a code editor.',
  },
  {
    icon: Code,
    title: 'Local-Only by Design',
    description:
      'No backend. No analytics. No telemetry. sql.js + IndexedDB persist your work locally. BYOK keys never leave your browser. `.heybradley` zip exports are full project portability with sensitive data stripped.',
  },
]

export function HowIBuiltThis() {
  const maxScore = 100

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d1f12]">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/10 via-transparent to-indigo-600/10" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            21 Phases. One Human. Many Agents.
          </h1>
          <p className="text-xl text-[#6b5e4f] max-w-2xl mx-auto leading-relaxed">
            Hey Bradley shipped 21 sealed phases through P21 — POC foundation,
            local persistence, real LLM chat across 5 providers, voice mode, and
            a documented architecture of 43 ADRs and 5 DDD bounded contexts. This
            is the build story.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white border border-[#e8772e]/20 rounded-xl p-4 text-center">
              <stat.icon className="w-5 h-5 text-[#e8772e] mx-auto mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-[#6b5e4f] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Phase Trajectory */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">Phase Trajectory (P1-P21)</h2>
        <div className="space-y-3">
          {PHASES.map((p) => (
            <div key={p.phase} className="flex items-center gap-4">
              <div className="w-16 text-sm font-mono text-[#6b5e4f] shrink-0">{p.phase}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#2d1f12]">{p.name}</span>
                  <span className="text-sm text-[#6b5e4f]">{p.score === 'TBD' ? 'in flight' : `${p.score}/100`} &middot; {p.hours}</span>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#A51C30] to-indigo-500 transition-all duration-500"
                    style={{ width: `${typeof p.score === 'number' ? (p.score / maxScore) * 100 : 50}%` }}
                  />
                </div>
                <p className="text-xs text-[#8a7a6d] mt-1">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-[#6b5e4f] mt-6">
          Scores reflect feature completeness, code quality, test coverage, and
          design polish evaluated at each phase gate. The trajectory shows
          compounding returns as architecture stabilized and review discipline
          tightened.
        </p>
      </section>

      {/* Methodology */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">The Methodology</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {METHODOLOGY.map((m) => (
            <div key={m.title} className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <m.icon className="w-8 h-8 text-[#e8772e] mb-4" />
              <h3 className="text-lg font-semibold mb-3">{m.title}</h3>
              <p className="text-[#6b5e4f] text-sm leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Innovation */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">Technical Innovation</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {INNOVATIONS.map((item) => (
            <div key={item.title} className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <item.icon className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
              <p className="text-[#6b5e4f] text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What I Learned */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">What I Learned</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
            <h3 className="text-lg font-semibold mb-3 text-emerald-400">What Worked</h3>
            <ul className="space-y-3 text-[#6b5e4f] text-sm leading-relaxed">
              <li>ADR-driven decisions prevented architectural drift across 21 phases</li>
              <li>Brutal-honest reviewer swarms after major phases caught real bugs (P19 went 66→88 composite after fix-pass-2)</li>
              <li>JSON-first architecture made the entire app composable and testable</li>
              <li>$0 real-LLM cost across P15-P19 by using FixtureAdapter + AgentProxyAdapter as proxies</li>
              <li>COCOMO estimate against ~28K TS/TSX: ~$680K cost / 12-month schedule / 5+ person team. Actual: ~60 hours, single human + AI swarms. Compression ratio ~140&times;.</li>
            </ul>
          </div>
          <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
            <h3 className="text-lg font-semibold mb-3 text-amber-400">What Was Hard</h3>
            <ul className="space-y-3 text-[#6b5e4f] text-sm leading-relaxed">
              <li>Stale plan claims — counts drifted faster than docs could keep up; P21 cleanup truthed everything</li>
              <li>Path-resolution bug between fixtures and active config silently corrupted patches until P19 fix-pass-2 F1</li>
              <li>Velocity surprised me — original 4-6 day phase estimates were 10-50× conservative</li>
              <li>Resisting the urge to ship to a real LLM before the validator + cost-cap + audit chain was solid</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/onboarding"
            className="px-8 py-3 bg-[#e8772e] text-[#2d1f12] font-semibold rounded-xl hover:bg-[#c45f1c] transition-colors shadow-lg"
          >
            Try the Builder
          </Link>
          <Link
            to="/docs"
            className="px-8 py-3 border border-[#e8772e]/30 text-[#2d1f12] font-semibold rounded-xl hover:bg-white/10 transition-colors"
          >
            Read the Docs
          </Link>
        </div>
      </section>
    </main>
  )
}
