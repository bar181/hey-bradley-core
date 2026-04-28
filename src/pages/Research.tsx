import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'

export function Research() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d1f12]">
      <MarketingNav />

      {/* Hero — blog-style with image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/60 via-[#1a1a1a]/80 to-[#1a1a1a]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-28 text-center">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">Research</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            The most expensive game of telephone in history.
          </h1>
          <p className="text-xl text-[#6b5e4f] max-w-2xl mx-auto leading-relaxed">
            Every piece of software ever built started the same way: a picture in
            someone&rsquo;s head. This is the story of what happens to that picture&mdash;and
            what changes when the telephone game ends.
          </p>
        </div>
      </section>

      {/* Blog article flow */}
      <article className="max-w-3xl mx-auto px-6">

        {/* Act I */}
        <section className="py-16 border-t border-white/5">
          <p className="text-sm font-semibold text-red-400 uppercase tracking-widest mb-6">Act I &mdash; The Problem Nobody Fixed</p>
          <p className="text-lg text-[#2d1f12] leading-relaxed mb-6">
            A nurse imagines a better patient intake form. A bakery owner sees the website she
            wants. A founder has the dashboard that will change everything. The picture is vivid,
            specific, and completely trapped inside their skull.
          </p>
          <p className="text-lg text-[#2d1f12] leading-relaxed mb-6">
            Then the telephone game begins. She describes it to someone who writes it down.
            The write-up goes to a designer who interprets it. The design goes to a developer
            who approximates it. Each handoff degrades the signal&mdash;industry research
            consistently finds that <strong className="text-[#2d1f12]">40&ndash;65% of implementation
            intent is lost</strong> in translation between stakeholders and builders.
          </p>
          <p className="text-lg text-[#2d1f12] leading-relaxed mb-10">
            The result: three revision cycles. Six weeks of calendar time. A final product
            that nobody loves&mdash;because it&rsquo;s a copy of a copy of a copy of a sketch
            of a dream.
          </p>

          {/* Intent loss visualization */}
          <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8 mb-10">
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
                    <span className="text-[#6b5e4f]">{s.step}</span>
                    <span className="text-[#2d1f12] font-semibold">{s.pct}% intent remaining</span>
                  </div>
                  <div className="h-4 rounded-full bg-white overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-[#e8772e]/20">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-emerald-400 font-medium">With AISP Crystal Atoms</span>
                  <span className="text-emerald-400 font-bold">98% intent preserved</span>
                </div>
                <div className="h-4 rounded-full bg-white overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-400" style={{ width: '98%' }} />
                </div>
              </div>
            </div>
          </div>

          <blockquote className="border-l-4 border-neutral-600 pl-6 py-2 mb-6">
            <p className="text-xl italic text-[#6b5e4f]">
              &ldquo;I described exactly what I wanted. What I got back looked nothing like it.&rdquo;
            </p>
            <cite className="block mt-3 text-sm text-[#6b5e4f] not-italic">&mdash; Every person who ever commissioned software</cite>
          </blockquote>
        </section>

        {/* Act II */}
        <section className="py-16 border-t border-white/5">
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-6">Act II &mdash; The Insight</p>
          <h2 className="text-3xl font-bold mb-8">The whiteboard was always<br />the most important tool.</h2>

          <div className="float-right ml-8 mb-6 w-72 hidden md:block">
            <img src="/previews/theme-agency.png" alt="Website taking shape in Hey Bradley" className="rounded-xl border border-[#e8772e]/20 shadow-lg w-full" />
            <p className="text-xs text-[#6b5e4f] mt-2 text-center">A website materializes during a team discussion</p>
          </div>

          <p className="text-lg text-[#2d1f12] leading-relaxed mb-6">
            Not the IDE. Not the CI/CD pipeline. Not the database. The whiteboard.
            The place where people stood around arguing about what to build. Sketching
            boxes and arrows. Pointing at a corner of the board and saying &ldquo;imagine
            it looks like <em>this</em>.&rdquo; That&rsquo;s where every real decision happened.
          </p>
          <p className="text-lg text-[#2d1f12] leading-relaxed mb-6">
            In the last three years, the technology industry invested billions in making
            the execution faster. AI coding tools&mdash;Cursor, Copilot, Claude Code&mdash;compressed
            the &ldquo;writing code&rdquo; portion of development from 35% to about 15% of total effort.
            Genuine achievements.
          </p>
          <p className="text-lg text-[#2d1f12] leading-relaxed mb-6">
            But nobody improved the whiteboard itself. Nobody built a tool for <strong className="text-[#2d1f12]">the
            moment of creation</strong>&mdash;the meeting where someone says &ldquo;imagine it looks
            like this&rdquo; and everyone needs to see the same thing.
          </p>

          {/* Effort breakdown */}
          <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8 my-10 clear-both">
            <h3 className="text-lg font-semibold mb-6 text-center">Development Effort Breakdown (2025)</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#6b5e4f]">Concept-to-Spec <span className="text-red-400">(the bottleneck)</span></span>
                  <span className="text-red-400 font-bold">55%</span>
                </div>
                <div className="h-6 rounded-full bg-white overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: '55%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#6b5e4f]">Implementation</span>
                  <span className="text-indigo-400 font-bold">25%</span>
                </div>
                <div className="h-6 rounded-full bg-white overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400" style={{ width: '25%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#6b5e4f]">Testing and Deployment</span>
                  <span className="text-emerald-400 font-bold">20%</span>
                </div>
                <div className="h-6 rounded-full bg-white overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
            <p className="text-xs text-[#6b5e4f] mt-4 text-center">
              AI accelerated coding (35% → 15%) but the spec work expanded to fill the gap.
            </p>
          </div>

          <p className="text-lg text-[#2d1f12] leading-relaxed">
            The AI revolution solved the wrong half of the problem. It made the telephone game
            faster&mdash;but it didn&rsquo;t fix the telephone game itself.
          </p>
        </section>

        {/* Act III */}
        <section className="py-16 border-t border-white/5">
          <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-6">Act III &mdash; The Same Day, Different Ending</p>
          <h2 className="text-3xl font-bold mb-8">What happens when the<br />telephone game ends.</h2>

          <p className="text-lg text-[#2d1f12] leading-relaxed mb-8">
            A nurse has been frustrated with the patient intake form for two years.
            She knows exactly what it should look like. Today she opens Hey&nbsp;Bradley.
          </p>

          <div className="space-y-6 mb-10">
            {[
              { time: "10:00 AM", title: "The Idea", text: "She says: \"Patient intake form with a progress bar, clear sections for medical history, and a confirmation screen.\" The form takes shape on screen while she talks." },
              { time: "10:20 AM", title: "The Specs", text: "Twenty minutes of adjustments. The form looks exactly like what she imagined. Underneath, six enterprise specification documents were generated automatically." },
              { time: "11:30 AM", title: "The Build", text: "IT pastes the specs into an AI coding tool. The form is built — and it integrates with the existing system because the specs understood what was already there." },
              { time: "12:00 PM", title: "Production", text: "Deployed. Patients use the new form that afternoon. No Jira ticket. No six-month backlog. No \"that's not what I meant.\"" },
            ].map((step) => (
              <div key={step.time} className="flex gap-5 items-start">
                <div className="shrink-0 w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  {step.time.replace(' AM', '').replace(' PM', '')}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#2d1f12] mb-1">{step.title}</h4>
                  <p className="text-[#6b5e4f] leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-lg text-[#2d1f12] leading-relaxed">
            The nurse didn&rsquo;t learn to code. She didn&rsquo;t learn to write user stories.
            She described what she saw&mdash;and the system captured her intent with enough
            precision that the handoff was lossless. <strong className="text-[#2d1f12]">The telephone
            game didn&rsquo;t happen.</strong> There was nothing to misinterpret.
          </p>
        </section>

        {/* The Landscape */}
        <section className="py-16 border-t border-white/5">
          <p className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-6">The Landscape</p>
          <h2 className="text-3xl font-bold mb-8">What people use today&mdash;and<br />where intent goes to die.</h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8772e]/20">
                  <th className="text-left text-[#6b5e4f] pb-4 pr-4 font-medium">Tool</th>
                  <th className="text-left text-[#6b5e4f] pb-4 pr-4 font-medium">What it produces</th>
                  <th className="text-left text-[#6b5e4f] pb-4 pr-4 font-medium">Speed</th>
                  <th className="text-left text-[#6b5e4f] pb-4 font-medium">Does intent survive?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { tool: 'Whiteboard', produces: 'A photograph nobody looks at again', speed: 'Real-time', intent: 'Dies after the meeting', color: 'text-red-400' },
                  { tool: 'Google Docs', produces: 'Requirements one person interpreted', speed: 'Days', intent: 'Degrades 40-65% per handoff', color: 'text-red-400' },
                  { tool: 'Figma', produces: 'Mockups developers approximate', speed: 'Hours', intent: 'Partial — visual only', color: 'text-amber-400' },
                  { tool: 'Lovable / v0', produces: 'Throwaway prototypes', speed: '2-5 min', intent: 'Output is rebuilt from scratch', color: 'text-red-400' },
                  { tool: 'AI coding tools', produces: 'Code from prompts', speed: '30-60 sec', intent: 'Only as precise as the prompt', color: 'text-amber-400' },
                ].map((row) => (
                  <tr key={row.tool}>
                    <td className="py-4 pr-4 font-semibold text-neutral-200">{row.tool}</td>
                    <td className="py-4 pr-4 text-[#6b5e4f]">{row.produces}</td>
                    <td className="py-4 pr-4 text-[#6b5e4f]">{row.speed}</td>
                    <td className={`py-4 ${row.color}`}>{row.intent}</td>
                  </tr>
                ))}
                <tr className="bg-emerald-500/5">
                  <td className="py-4 pr-4 font-semibold text-emerald-400">Hey Bradley</td>
                  <td className="py-4 pr-4 text-[#2d1f12]">Prototype + AISP specs</td>
                  <td className="py-4 pr-4 text-emerald-400 font-semibold">5 seconds</td>
                  <td className="py-4 text-emerald-400 font-semibold">Preserved at &lt;2% ambiguity</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-lg text-[#2d1f12] leading-relaxed">
            The last column is the one that matters. Every existing tool either loses the original
            intent, requires specialized skills, or produces output that&rsquo;s thrown away.
            Hey Bradley is the first tool where the intent articulated in the meeting
            <strong className="text-[#2d1f12]"> survives all the way to production</strong> with
            mathematical precision.
          </p>
        </section>

        {/* What Becomes Possible */}
        <section className="py-16 border-t border-white/5">
          <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-6">What Becomes Possible</p>
          <h2 className="text-3xl font-bold mb-8">When everyone can build,<br />everything changes.</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <img src="/previews/example-fitforge.png" alt="FitForge example site" className="rounded-xl border border-[#e8772e]/20 w-full" />
            <img src="/previews/example-florist.png" alt="Florist example site" className="rounded-xl border border-[#e8772e]/20 w-full" />
          </div>

          <p className="text-lg text-[#2d1f12] leading-relaxed mb-6">
            <strong className="text-[#2d1f12]">Software stops being a department and becomes a capability.</strong> Marketing
            doesn&rsquo;t submit a ticket for a landing page&mdash;they build it during the planning
            meeting. Operations doesn&rsquo;t wait six months for a dashboard&mdash;they describe it
            and deploy it that afternoon.
          </p>
          <p className="text-lg text-[#2d1f12] leading-relaxed mb-6">
            <strong className="text-[#2d1f12]">Decisions happen with artifacts, not arguments.</strong> &ldquo;I
            think the dashboard should show X&rdquo; becomes &ldquo;let me show you X&rdquo;&mdash;five
            seconds later, everyone evaluates a concrete thing instead of debating an abstraction.
          </p>
          <p className="text-lg text-[#2d1f12] leading-relaxed">
            The organizations that operate at this speed don&rsquo;t just build faster. They
            <strong className="text-[#2d1f12]"> learn</strong> faster, respond faster, iterate faster.
            The speed of software becomes the speed of organizational thought.
          </p>
        </section>
      </article>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#242424] text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">See the research in action.</h2>
          <p className="text-[#6b5e4f] mb-8">Try the builder and experience what spec-driven development feels like.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/new-project" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white text-neutral-900 hover:bg-neutral-100 transition-colors text-lg">
              Try the Builder <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/open-core" className="px-8 py-4 rounded-xl font-semibold border border-white/30 text-[#2d1f12] hover:bg-white/10 transition-colors text-lg">
              Open Core &amp; Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#e8772e]/20 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#6b5e4f] mb-2">Harvard ALM Capstone &mdash; Digital Media Design &mdash; May 2026</p>
          <p className="text-sm text-[#6b5e4f]">Bradley Ross &mdash; Creator of AISP</p>
        </div>
      </footer>
    </main>
  )
}
