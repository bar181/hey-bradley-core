import { Link } from 'react-router-dom'
import { Code, Clock, Users, FileText, Layers, Cpu, Atom, GitBranch, ArrowRight } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'

const STATS = [
  { icon: Code, label: 'Lines of TS/TSX', value: '~28K' },
  { icon: FileText, label: 'Source Files', value: '227' },
  { icon: Clock, label: 'Phases Sealed', value: '~99' },
  { icon: Layers, label: 'ADRs', value: '128' },
  { icon: Users, label: 'Bounded Contexts', value: '5' },
  { icon: Layers, label: 'Tests Passing', value: '~1491+' },
]

const PHASES = [
  { phase: 'P1-P10', name: 'POC Foundation', score: 80, hours: '~30h', description: '15 section types, 12 themes, JSON-driven architecture, AISP Crystal Atoms, Zod validation, 17 example sites' },
  { phase: 'P11-P14', name: 'Website + Marketing', score: 78, hours: '~16h', description: 'Marketing pages, enhanced demos, content intelligence, blog section, multi-page, ZIP export, a11y, 20 issue fixes' },
  { phase: 'P15-P16', name: 'Polish + Local DB', score: 84, hours: '~10h', description: 'DRAFT/EXPERT modes, kitchen sink, sql.js + IndexedDB, 5 typed CRUD repos, cross-tab Web Locks' },
  { phase: 'P17-P19', name: 'LLM Provider + Listen', score: 89, hours: '~20h', description: 'LLMAdapter, BYOK, real chat (LLM → JSON patches), 5-provider matrix, Web Speech STT, voice → pipeline, 18 fix-pass items' },
  { phase: 'P20-P21', name: 'MVP Close + ADRs', score: 88, hours: '~5h', description: 'Cost-cap UI, mvp-e2e, sealed-phase archive, 5 ADR amendments + ADR-054 DDD bounded contexts' },
  { phase: 'P22-P28', name: 'Sprints A-C', score: 89, hours: '~14h', description: 'Public website rebuild, Simple Chat (templates + router), section targeting, intent translation, AISP Instruction Layer, LLM-Native AISP, 2-step template selection' },
  { phase: 'P29-P38', name: 'Sprints D-F', score: 92, hours: '~22h', description: 'Template Library API, Template Persistence, CONTENT_ATOM, multi-section pipeline, ASSUMPTIONS_ATOM, Listen + AISP Unification, Command Triggers, 5-atom AISP in production' },
  { phase: 'P44-P53', name: 'Sprints H-J', score: 90, hours: '~18h', description: 'Brand Context Upload, Codebase Reference Ingestion, Builder UX polish + a11y, Quick-add picker, Improvement Suggestions, Personality Engine, Conversation Log, Mobile UX overhaul (3-tab nav)' },
  { phase: 'P54-P57', name: 'Moat K-N', score: 91, hours: '~12h', description: 'Latency badge (Speed Visible), AISP always-on (Spec Unmissable), Premium opinionated templates, static HTML export + hosted spec URL' },
  { phase: 'P58-P60', name: 'RC1 + QA', score: 90, hours: '~10h', description: 'v1.0.0-RC1 sealed (Open Core RC), 280-entry prompt corpus, Comprehensive QA Architecture (50 personality + 80 LLM matrix + flagship + persona templates)' },
  { phase: 'P61-P83', name: 'Open Core Arc', score: 86, hours: '~36h', description: 'Multi-page MVP, design tokens, mobile redesign, blog expansion (4→12), Template Intelligence (3-layer matcher), DECOMP_ATOM, FullSiteSimulator, agentic-product templates, AISP adoption (TS+Python reference impls)' },
  { phase: 'P84-P89', name: 'v1.0.0-RC1 Polish', score: 87, hours: '~10h', description: 'Release artifacts (CHANGELOG + Show HN + PH tagline + demo script), AISP visibility standard, polish wave 4, marketing mobile, section visual quality, Tier-2 boundary correction' },
  { phase: 'P90-P101', name: 'Agentic Workbench', score: 84, hours: '~22h', description: 'Three-mode product (Whiteboard / Planning / Agentics), Process Map SVG, PROCESS_ATOM + DDD_ATOM + AGENT_ATOM (8-atom AISP suite COMPLETE), SpecWorkbench, Export Claude Code markdown bundle, TDD scaffold, KISS reviewer, Seal Panel, comprehensive logging' },
  { phase: 'P102-P109', name: 'v2.0.0-RC1 Hardening', score: 88, hours: '~14h', description: 'Final QA + token migration + Agentics live-wire, Schema guards, RC blockers closure, Dead-code purge + atom-view inversion fix, Log integrity expansion (15/15 enum coverage), Test runtime shift (mobile viewports), ADR ledger truth-up, Section-enum drift regression guard' },
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
    title: '128 Architecture Decision Records',
    description:
      'Every significant choice is documented as an ADR. From state management (Zustand) to AISP Crystal Atoms (ADR-045) to local SQLite persistence (ADR-040) to BYOK trust boundaries (ADR-043) to the 5 DDD bounded contexts (ADR-054) to comprehensive LLM logging (ADR-126), KISS reviewer (ADR-129), Seal Panel (ADR-130), and the v2.0.0-RC1 boundary (ADR-133/137). Each ADR captures context, decision, and consequences.',
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
        <div className="relative max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            ~99 Phases. One Human. Many Agents.
          </h1>
          <p className="text-base md:text-xl text-[#6b5e4f] max-w-2xl mx-auto leading-relaxed">
            Hey Bradley shipped ~99 sealed phases through P109 — POC foundation,
            local persistence, real LLM chat across 5 providers, voice mode,
            open-core release, premium templates, three-mode product
            (Whiteboard / Planning / Agentics), the full 8-atom AISP suite,
            v2.0.0-RC1 ship boundary — and a documented architecture
            of 128 ADRs and 5 DDD bounded contexts. This is the build story.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-8">
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
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Phase Trajectory (P1-P109)</h2>
        <div className="space-y-3">
          {PHASES.map((p) => (
            <div key={p.phase} className="flex items-center gap-4">
              <div className="w-16 text-sm font-mono text-[#6b5e4f] shrink-0">{p.phase}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#2d1f12]">{p.name}</span>
                  <span className="text-sm text-[#6b5e4f]">{`${p.score}/100`} &middot; {p.hours}</span>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#A51C30] to-indigo-500 transition-all duration-500"
                    style={{ width: `${(p.score / maxScore) * 100}%` }}
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
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">The Methodology</h2>
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
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Technical Innovation</h2>
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
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">What I Learned</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
            <h3 className="text-lg font-semibold mb-3 text-emerald-400">What Worked</h3>
            <ul className="space-y-3 text-[#6b5e4f] text-sm leading-relaxed">
              <li>ADR-driven decisions prevented architectural drift across ~99 phases</li>
              <li>Brutal-honest reviewer swarms after major phases caught real bugs (P19 went 66→88 composite after fix-pass-2)</li>
              <li>JSON-first architecture made the entire app composable and testable</li>
              <li>$0 real-LLM cost across the open-core arc by using FixtureAdapter + AgentProxyAdapter as proxies</li>
              <li>COCOMO estimate against ~28K TS/TSX: ~$680K cost / 12-month schedule / 5+ person team. Actual: ~99 phases, single human + AI swarms. Composite 86.7/100 vs Lovable 80.</li>
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
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
        <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center justify-center gap-4">
          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto min-h-[44px] px-8 py-3 bg-[#e8772e] text-white font-semibold rounded-xl hover:bg-[#c45f1c] transition-colors shadow-lg"
          >
            Try the open source version <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/bar181/aisp-open-core"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto min-h-[44px] px-8 py-3 border border-[#e8772e]/30 text-[#2d1f12] font-semibold rounded-xl hover:bg-[#f1ece4] transition-colors"
          >
            Explore AISP <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </main>
  )
}
