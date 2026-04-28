import { Link } from 'react-router-dom'
import { ArrowRight, Code, GitBranch, Layers, Target, Zap, BookOpen, Cpu } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { OpenCoreVsCommercial } from '@/components/marketing/OpenCoreVsCommercial'

export function OpenCore() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d1f12]">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/10 via-transparent to-[#A51C30]/5" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#e8772e] mb-4 font-medium">Open Source &middot; MIT License</p>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            The 55% problem<br />nobody&apos;s solving.
          </h1>
          <p className="text-xl text-[#6b5e4f] max-w-2xl mx-auto leading-relaxed">
            AI made coding 3x faster. But coding was never the bottleneck.
            The real cost is everything that happens <em>before</em> the first line of code&mdash;the
            meetings, the specs, the &ldquo;that&rsquo;s not what I meant.&rdquo;
            Hey&nbsp;Bradley is built for that 55%.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <a
              href="https://github.com/bar181/hey-bradley-core"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              hey-bradley-core
            </a>
            <a
              href="https://github.com/bar181/aisp-open-core"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-[#e8772e]/30 text-[#2d1f12] font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              <Code className="w-4 h-4" />
              aisp-open-core
            </a>
          </div>
        </div>
      </section>

      {/* The Bottleneck */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-red-400 font-medium mb-4">The bottleneck nobody talks about</p>
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">AI solved the wrong half of the problem.</h2>
        <div className="space-y-4 text-[#6b5e4f] leading-relaxed max-w-3xl">
          <p>
            The last three years of AI investment compressed the &ldquo;writing code&rdquo; portion of software
            development from roughly 35% to about 15% of total effort. Genuine progress. But it created
            a new reality: <strong className="text-[#2d1f12]">the concept-to-spec portion expanded to 55% of total effort.</strong>
          </p>
          <p>
            Companies adopting agentic workflows discovered this quickly. The agents can code. They
            can test. They can deploy. But they can&rsquo;t read your mind. The meetings, the requirements
            documents, the architecture decisions, the design intent&mdash;that 55% still runs on
            whiteboards, Google Docs, and hope. Every handoff degrades the signal. Industry research
            consistently finds 40&ndash;65% of implementation intent is lost in translation.
          </p>
          <p>
            This is the telephone game&mdash;and faster AI just plays it at higher speed.
          </p>
        </div>

        {/* Stat callout */}
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-red-400">55%</div>
            <div className="text-sm text-[#6b5e4f] mt-2">of engineering effort is pre-code:<br />specs, architecture, alignment</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-red-400">40&ndash;65%</div>
            <div className="text-sm text-[#6b5e4f] mt-2">of intent is lost in each<br />stakeholder-to-builder handoff</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-emerald-400">&lt;2%</div>
            <div className="text-sm text-[#6b5e4f] mt-2">ambiguity in AISP Crystal Atoms&mdash;<br />what Hey Bradley generates</div>
          </div>
        </div>
      </section>

      {/* What Open Core Means */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-[#e8772e] font-medium mb-4">The model</p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">What &ldquo;open core&rdquo; means here.</h2>
          <div className="space-y-4 text-[#6b5e4f] leading-relaxed max-w-3xl">
            <p>
              Open core is a development model: one codebase, one product, with a natural boundary.
              Everything that runs in your browser ships free under MIT. The visual builder, 12 themes,
              15 example websites, 6 enterprise spec generators, 300+ media images, 13 image effects,
              and the AISP Crystal Atom output&mdash;all open source.
            </p>
            <p>
              The boundary is infrastructure. Cloud persistence, real LLM integration, team workspaces,
              and hosted deployment are where a future commercial tier begins. But the core idea&mdash;turn
              ideas into precise, machine-readable specifications&mdash;is free and always will be.
            </p>
            <p>
              For engineers: the architecture has clear integration points where LLM connections, database
              layers, and auth systems attach. Any skilled engineer can wire their own API key, connect
              a Supabase instance, or plug in a custom model. The architecture is yours.
            </p>
          </div>
        </div>
      </section>

      {/* Spec-First Development */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-purple-400 font-medium mb-4">The methodology</p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Spec-first development for<br />teams that don&rsquo;t write code.</h2>
          <div className="space-y-4 text-[#6b5e4f] leading-relaxed max-w-3xl mb-12">
            <p>
              The shift has already happened. Developers at companies adopting agentic processes are
              no longer the bottleneck&mdash;they have tools for coding. The new bottleneck is
              <strong className="text-[#2d1f12]"> going from idea to development</strong>. The frustration
              is the same everywhere: &ldquo;I know exactly what I want, but I can&rsquo;t get it out
              of my head and into a form the AI can execute.&rdquo;
            </p>
            <p>
              Hey Bradley is designed for this moment. A designer and a stakeholder sit in one meeting.
              The designer builds in real time. The stakeholder sees their vision take shape. When the
              meeting ends, six enterprise specification documents exist&mdash;not as a separate
              documentation step, but as a natural byproduct of the conversation.
            </p>
            <p>
              Those specs are precise enough that any AI coding tool executes them on the first try.
              No interpretation. No telephone game. The meeting <em>is</em> the sprint.
            </p>
          </div>

          {/* Fit & Value Chart */}
          <div className="bg-white/[0.03] border border-[#e8772e]/20 rounded-2xl p-8">
            <h3 className="text-lg font-semibold mb-6 text-center">Where Hey Bradley fits in the AI development landscape</h3>
            <div className="space-y-5">
              {/* Vibe coding tools */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-[#2d1f12]">Vibe coding tools</span>
                    <span className="text-xs text-[#6b5e4f] ml-2">Lovable, v0, AI Studio</span>
                  </div>
                  <span className="text-xs text-red-400 font-medium">Start over at scale</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full w-[25%] bg-gradient-to-r from-red-500 to-red-400 rounded-full" />
                </div>
                <p className="text-xs text-[#6b5e4f] mt-1.5">
                  Fast prototypes, but throwaway output. When you need a real webapp with auth,
                  database, and CI/CD&mdash;you start from scratch.
                </p>
              </div>

              {/* Autocomplete tools */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-[#2d1f12]">AI autocomplete</span>
                    <span className="text-xs text-[#6b5e4f] ml-2">Cursor, Copilot, Windsurf</span>
                  </div>
                  <span className="text-xs text-amber-400 font-medium">Only as good as the prompt</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full w-[55%] bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                </div>
                <p className="text-xs text-[#6b5e4f] mt-1.5">
                  Powerful with precise specs. Feed them AISP Crystal Atoms and they one-shot
                  entire features. Without specs, they guess&mdash;and the telephone game continues.
                </p>
              </div>

              {/* Agentic coding tools */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-[#2d1f12]">Agentic coding</span>
                    <span className="text-xs text-[#6b5e4f] ml-2">Claude Code, Codex, Devin</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">Solves 15% of the effort</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full w-[75%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                </div>
                <p className="text-xs text-[#6b5e4f] mt-1.5">
                  The best code-writing tools available. Built for teams that adopt agentic
                  processes. But they solve the coding 15%&mdash;not the specification 55%.
                </p>
              </div>

              {/* Hey Bradley */}
              <div className="pt-3 border-t border-[#e8772e]/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold text-[#e8772e]">Hey Bradley + AISP</span>
                    <span className="text-xs text-[#6b5e4f] ml-2">Spec-first development</span>
                  </div>
                  <span className="text-xs text-[#e8772e] font-medium">Solves the other 55%</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-[#A51C30] to-[#d4a574] rounded-full" />
                </div>
                <p className="text-xs text-[#6b5e4f] mt-1.5">
                  Designed to complement every tool above. Generate the specs in one meeting,
                  then feed them to whichever coding tool your team uses. The meeting becomes
                  the sprint. What you approved is what ships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AISP */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400 font-medium mb-4">The protocol</p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">AISP: why near-zero ambiguity<br />makes this possible.</h2>
          <div className="space-y-4 text-[#6b5e4f] leading-relaxed max-w-3xl mb-10">
            <p>
              The AI Symbolic Protocol (AISP) is a math-first neural symbolic language with 512 symbols
              that all AI and LLM architectures understand natively&mdash;without instructions. It was
              created specifically for this translation problem: how do you capture human intent with
              enough precision that a machine executes it without interpretation?
            </p>
            <p>
              Traditional specs say &ldquo;add a form.&rdquo; AISP Crystal Atoms specify every field,
              every validation rule, every database table, every API endpoint, every route, and how to
              verify it works. There is no room for a developer or an AI to &ldquo;interpret&rdquo;&mdash;the
              specification <em>is</em> the implementation plan.
            </p>
            <p>
              Advanced methodology is available for intent decomposition using a fractal design pattern
              for a learning database that reduces LLM calls by 80%. Without this level of precision,
              the type of spec-first development Hey Bradley enables would not be possible.
            </p>
          </div>

          {/* Crystal Atom example */}
          <div className="bg-[#131825] border border-[#e8772e]/20 rounded-2xl p-6 font-mono text-sm leading-[2.2] overflow-x-auto text-[#6b5e4f]">
            <span className="text-[#8a7a6d]">{'// Crystal Atom — five formal components. Nothing left to interpret.'}</span><br />
            <span className="text-[#e8772e] font-bold">{'⟦'}</span><br />
            {'  '}<span className="text-amber-400">&Omega;</span>{' := { Patient intake form with progress bar and confirmation }'}<br />
            {'  '}<span className="text-amber-400">&Sigma;</span>{' := { Form:{sections:[Demographics, History, Medications, Confirm]} }'}<br />
            {'  '}<span className="text-amber-400">&Gamma;</span>{' := { R1: reuse existing PatientAuth from src/auth/'}<br />
            {'         R2: validate against existing patient_records schema }'}<br />
            {'  '}<span className="text-amber-400">&Lambda;</span>{' := { route:="/intake/new", db:=patients, api:=POST /api/v2/intake }'}<br />
            {'  '}<span className="text-amber-400">&Epsilon;</span>{' := { V1: VERIFY 4 sections render, V2: progress bar advances per step }'}<br />
            <span className="text-[#e8772e] font-bold">{'⟧'}</span>
          </div>
          <p className="text-xs text-[#6b5e4f] mt-3 text-center">
            AISP is open source.{' '}
            <a
              href="https://github.com/bar181/aisp-open-core"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e8772e] hover:underline"
            >
              Explore the protocol &rarr;
            </a>
          </p>
        </div>
      </section>

      {/* How It Was Built */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-medium mb-4">How it&apos;s built</p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Agentic engineering,<br />from architecture to ship.</h2>
          <div className="space-y-4 text-[#6b5e4f] leading-relaxed max-w-3xl mb-10">
            <p>
              Hey Bradley is itself built using the methodology it teaches. The entire 100K+ line
              codebase was developed through agentic workflows&mdash;multi-agent swarms coordinating
              across architecture, implementation, testing, and review. Every phase followed spec-first
              principles: define the intent precisely, then let AI agents execute.
            </p>
            <p>
              The project uses deep agentic engineering practices: hierarchical mesh topology for agent
              coordination, HNSW-indexed vector memory for pattern learning, domain-driven design with
              bounded contexts, and a 3-tier model routing system that selects the right AI for each
              task. 37 Architecture Decision Records document every significant choice.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/[0.03] border border-[#e8772e]/20 rounded-xl p-5">
              <Layers className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="text-2xl font-bold">100K+</div>
              <div className="text-xs text-[#6b5e4f] mt-1">lines of code, 171 source files</div>
            </div>
            <div className="bg-white/[0.03] border border-[#e8772e]/20 rounded-xl p-5">
              <Target className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="text-2xl font-bold">102</div>
              <div className="text-xs text-[#6b5e4f] mt-1">passing tests across 11 spec files</div>
            </div>
            <div className="bg-white/[0.03] border border-[#e8772e]/20 rounded-xl p-5">
              <Zap className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="text-2xl font-bold">37</div>
              <div className="text-xs text-[#6b5e4f] mt-1">Architecture Decision Records</div>
            </div>
            <div className="bg-white/[0.03] border border-[#e8772e]/20 rounded-xl p-5">
              <Cpu className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="text-2xl font-bold">15</div>
              <div className="text-xs text-[#6b5e4f] mt-1">agent swarm with HNSW memory</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Repositories */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-medium mb-4">The repositories</p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">Two open projects. One methodology.</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="https://github.com/bar181/hey-bradley-core"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/[0.03] border border-[#e8772e]/20 rounded-2xl p-8 hover:border-[#e8772e]/40 transition-colors no-underline"
            >
              <h3 className="text-lg font-semibold mb-2 text-[#2d1f12]">Hey Bradley</h3>
              <p className="text-sm text-[#6b5e4f] mb-1">The reference implementation</p>
              <p className="text-sm text-[#6b5e4f] leading-relaxed mb-4">
                Visual builder that generates AISP specs from human interactions. React + TypeScript + Tailwind.
                12 themes, 15 examples, 300+ images, 6 spec generators, 13 image effects.
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-[#e8772e] font-medium group-hover:underline">
                github.com/bar181/hey-bradley-core <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
            <a
              href="https://github.com/bar181/aisp-open-core"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/[0.03] border border-[#e8772e]/20 rounded-2xl p-8 hover:border-purple-500/40 transition-colors no-underline"
            >
              <h3 className="text-lg font-semibold mb-2 text-[#2d1f12]">AISP Open Core</h3>
              <p className="text-sm text-[#6b5e4f] mb-1">The specification protocol</p>
              <p className="text-sm text-[#6b5e4f] leading-relaxed mb-4">
                Crystal Atom notation, 512-symbol set, tier assessment, validation tools, and the formal
                ambiguity measurement methodology. The language that makes near-zero ambiguity possible.
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-purple-400 font-medium group-hover:underline">
                github.com/bar181/aisp-open-core <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* About Bradley */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6b5e4f] font-medium mb-4">About the research</p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Built by Bradley Ross.</h2>
          <div className="space-y-4 text-[#6b5e4f] leading-relaxed max-w-3xl">
            <p>
              Hey Bradley is a Harvard ALM capstone project in Digital Media Design, built to demonstrate
              that the concept-to-spec gap is the defining bottleneck of modern software development&mdash;and
              that it&rsquo;s solvable.
            </p>
            <p>
              The project represents deep research in agentic engineering: multi-agent swarm coordination,
              HNSW-indexed vector databases for pattern recognition, domain-driven design at scale, and
              the creation of AISP&mdash;a formal symbolic protocol designed to reduce specification ambiguity
              to near zero. The entire codebase was developed through the agentic methodology it describes.
            </p>
            <p>
              Bradley&rsquo;s work sits at the intersection of AI systems engineering and human-computer
              interaction: how do you build tools that let the people with the ideas&mdash;not just the
              people who write the code&mdash;participate directly in making those ideas real?
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/about" className="inline-flex items-center gap-2 text-sm text-[#6b5e4f] hover:text-[#2d1f12] transition-colors">
              <BookOpen className="w-4 h-4" /> About Hey Bradley
            </Link>
            <span className="text-neutral-700">|</span>
            <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#6b5e4f] hover:text-[#2d1f12] transition-colors">
              <Code className="w-4 h-4" /> AISP Research
            </a>
            <span className="text-neutral-700">|</span>
            <Link to="/how-i-built-this" className="inline-flex items-center gap-2 text-sm text-[#6b5e4f] hover:text-[#2d1f12] transition-colors">
              <Cpu className="w-4 h-4" /> How It Was Built
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">The telephone game is over.</h2>
          <p className="text-[#6b5e4f] max-w-xl mx-auto mb-8 leading-relaxed">
            Describe what you see. Watch it appear. Specs generated automatically.
            Any AI builds it. What you approved is what ships.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/new-project"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#e8772e] text-[#2d1f12] font-semibold rounded-xl hover:bg-[#c45f1c] transition-colors shadow-lg"
            >
              Try the Builder <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/bar181/hey-bradley-core"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 border border-[#e8772e]/30 text-[#2d1f12] font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              View Source on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-sm text-[#8a7a6d]">
        <p>Harvard ALM Capstone &mdash; Digital Media Design &mdash; May 2026</p>
        <p className="mt-1">Bradley Ross &mdash; Creator of AISP</p>
      </footer>
      <OpenCoreVsCommercial />
    </main>
  )
}
