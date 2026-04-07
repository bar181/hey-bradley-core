import { Link } from 'react-router-dom'
import { BarChart3, TrendingDown, ArrowRight } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'

const LANDSCAPE = [
  { tool: 'Whiteboard', produces: 'A photograph nobody looks at again', speed: 'Real-time', who: 'Everyone', intent: 'Dies after the meeting', intentColor: 'text-red-400' },
  { tool: 'Google Docs', produces: 'Requirements one person interpreted', speed: 'Days to write', who: 'Everyone', intent: 'Degrades 40-65% per handoff', intentColor: 'text-red-400' },
  { tool: 'Figma', produces: 'Mockups developers approximate', speed: 'Hours per screen', who: 'Designers', intent: 'Partial — visual only', intentColor: 'text-amber-400' },
  { tool: 'AI coding tools', produces: 'Code from prompts', speed: '30-60 sec', who: 'Engineers', intent: 'Only as precise as the prompt', intentColor: 'text-amber-400' },
  { tool: 'Hey Bradley', produces: 'Prototype + AISP specs', speed: '5 seconds', who: 'Everyone', intent: 'Preserved at <2% ambiguity', intentColor: 'text-emerald-400' },
]

export function Research() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white">
      <MarketingNav />

      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-emerald-900/10" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <BarChart3 className="w-4 h-4" />
            Research Findings
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            The data behind the problem.
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Industry research on the concept-to-spec bottleneck, intent loss per
            handoff, and where existing tools fall short.
          </p>
        </div>
      </section>

      {/* Finding 1: 55% bottleneck */}
      <section className="py-20 bg-[#111827]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">Finding #1</p>
              <h2 className="text-3xl font-bold mb-4">55% of development effort is concept-to-spec.</h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                The AI revolution solved the wrong half of the problem. It made the
                telephone game faster — building code from prompts in seconds — but it
                did not fix the telephone game itself. The concept-to-spec portion of
                development expanded to 55% of total effort. It became the bottleneck.
                And it still runs on whiteboards, Google Docs, and hope.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                This means more than half of every software project is spent trying to
                capture and communicate intent — not writing code. The tools changed.
                The bottleneck did not.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-6 text-center">Development Effort Breakdown</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">Concept-to-Spec</span>
                    <span className="text-blue-400 font-bold">55%</span>
                  </div>
                  <div className="h-6 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: '55%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">Implementation</span>
                    <span className="text-indigo-400 font-bold">25%</span>
                  </div>
                  <div className="h-6 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400" style={{ width: '25%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">Testing and Deployment</span>
                    <span className="text-emerald-400 font-bold">20%</span>
                  </div>
                  <div className="h-6 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Finding 2: 40-65% intent loss */}
      <section className="py-20 bg-[#0b0f1a]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-lg font-semibold mb-6 text-center">Intent Loss Per Handoff</h3>
                <div className="space-y-4">
                  {[
                    { step: 'Stakeholder idea', pct: 100, color: 'bg-emerald-400' },
                    { step: 'PM writes requirements', pct: 65, color: 'bg-amber-400' },
                    { step: 'Designer interprets', pct: 42, color: 'bg-orange-400' },
                    { step: 'Developer builds', pct: 25, color: 'bg-red-400' },
                  ].map((s) => (
                    <div key={s.step}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-400">{s.step}</span>
                        <span className="text-neutral-300 font-semibold">{s.pct}% intent remaining</span>
                      </div>
                      <div className="h-4 rounded-full bg-white/5 overflow-hidden">
                        <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-emerald-400 font-medium">With AISP Crystal Atoms</span>
                      <span className="text-emerald-400 font-bold">98% intent preserved</span>
                    </div>
                    <div className="h-4 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: '98%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <p className="text-sm font-semibold text-red-400 uppercase tracking-widest">Finding #2</p>
              </div>
              <h2 className="text-3xl font-bold mb-4">40-65% of intent is lost per handoff.</h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Industry research consistently finds that 40-65% of implementation
                intent is lost in translation at each handoff. A stakeholder describes
                something to a PM. The PM writes it down. A designer interprets the
                write-up. A developer approximates the design. By the time code ships,
                the original vision is barely recognizable.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                This is not a people problem. It is a language problem. There has never
                been a specification format designed to preserve intent through the
                entire pipeline — until AISP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Finding 3: The Landscape */}
      <section className="py-20 bg-[#111827]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-4">Finding #3</p>
          <h2 className="text-3xl font-bold mb-4">What people use today — and where intent goes to die.</h2>
          <p className="text-neutral-400 leading-relaxed max-w-2xl mb-12">
            Every existing tool solves part of the problem. None of them preserve
            intent from stakeholder to shipped product.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-neutral-400 pb-4 pr-4 font-medium">Tool</th>
                  <th className="text-left text-neutral-400 pb-4 pr-4 font-medium">What it produces</th>
                  <th className="text-left text-neutral-400 pb-4 pr-4 font-medium">Speed</th>
                  <th className="text-left text-neutral-400 pb-4 pr-4 font-medium">Who can use it</th>
                  <th className="text-left text-neutral-400 pb-4 font-medium">Does intent survive?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {LANDSCAPE.map((row) => (
                  <tr key={row.tool} className={row.tool === 'Hey Bradley' ? 'bg-emerald-500/5' : ''}>
                    <td className={`py-4 pr-4 font-semibold ${row.tool === 'Hey Bradley' ? 'text-emerald-400' : 'text-neutral-200'}`}>{row.tool}</td>
                    <td className="py-4 pr-4 text-neutral-400">{row.produces}</td>
                    <td className="py-4 pr-4 text-neutral-400">{row.speed}</td>
                    <td className="py-4 pr-4 text-neutral-400">{row.who}</td>
                    <td className={`py-4 ${row.intentColor}`}>{row.intent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The Insight */}
      <section className="py-20 bg-[#0b0f1a]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-4">The Insight</p>
          <h2 className="text-3xl font-bold mb-8">The whiteboard was always the most important tool.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <p className="text-neutral-400 leading-relaxed">
                Not the IDE. Not the CI/CD pipeline. Not the database. The whiteboard.
                The place where people stood around arguing about what to build.
                Sketching boxes and arrows. Pointing at a corner of the board and saying
                &ldquo;imagine it looks like this.&rdquo; That is where every real
                decision happened.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <p className="text-neutral-400 leading-relaxed">
                The AI revolution made the telephone game faster — but it did not fix
                the telephone game itself. Hey Bradley is the whiteboard that finally
                captures what you draw and converts it into specifications so precise
                that any AI builds it right on the first try.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-[#111827] to-[#0b0f1a] text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">See the research in action.</h2>
          <p className="text-neutral-400 mb-8">Try the builder and experience what spec-driven development feels like.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/new-project" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white text-neutral-900 hover:bg-neutral-100 transition-colors text-lg">
              Try the Builder <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/aisp" className="px-8 py-4 rounded-xl font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors text-lg">
              Learn about AISP
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#0b0f1a]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-neutral-500 mb-2">Harvard ALM Capstone &mdash; Digital Media Design &mdash; May 2026</p>
          <p className="text-sm text-neutral-500">Bradley Ross &mdash; Creator of AISP</p>
        </div>
      </footer>
    </main>
  )
}
