import { Link } from 'react-router-dom'
import { ArrowRight, Code, BookOpen, Cpu } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { OpenCoreVsCommercial } from '@/components/marketing/OpenCoreVsCommercial'
import { useReveal } from '@/hooks/useReveal'

export function OpenCore() {
  const bottleneckReveal = useReveal<HTMLElement>()
  const modelReveal = useReveal<HTMLElement>()
  const methodReveal = useReveal<HTMLElement>()
  const aispReveal = useReveal<HTMLElement>()
  const builtReveal = useReveal<HTMLElement>()
  const reposReveal = useReveal<HTMLElement>()

  return (
    <main className="min-h-screen bg-[var(--hb-paper)] text-[var(--hb-ink)]">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/10 via-transparent to-[#A51C30]/5" />
        <div className="relative max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <p className="text-sm text-[var(--hb-ink-muted)] mb-3">
            <Link to="/" className="hover:text-[var(--hb-warm)] transition-colors">
              For everyone else, start here &rarr;
            </Link>
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--hb-warm)] mb-4 font-medium">Open core &middot; MIT License</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
            The 55% problem<br />nobody&apos;s solving.
          </h1>
          <p className="text-base md:text-xl text-[var(--hb-ink-muted)] leading-relaxed mb-8 max-w-2xl">
            AI made coding 3x faster. But coding was never the bottleneck.
            The real cost is everything that happens <em>before</em> the first line of code&mdash;the
            meetings, the specs, the &ldquo;that&rsquo;s not what I meant.&rdquo;
            Hey&nbsp;Bradley is built for that 55%.
          </p>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
            <Link
              to="/new-project"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto min-h-[44px] px-6 py-3 bg-[var(--hb-warm)] text-white font-semibold rounded-xl hover:bg-[var(--hb-warm-hover)] transition-colors shadow-lg"
            >
              Try the open source version
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/bar181/aisp-open-core"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto min-h-[44px] px-6 py-3 border border-[var(--hb-warm)]/30 text-[var(--hb-ink)] font-semibold rounded-xl hover:bg-[var(--hb-paper-soft)] transition-colors"
            >
              Explore AISP
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* The Bottleneck */}
      <section
        ref={bottleneckReveal.ref}
        className={`max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20 transition-all duration-700 ${bottleneckReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-red-400 font-medium mb-4">The bottleneck nobody talks about</p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">AI solved the wrong half of the problem.</h2>
        <div className="space-y-4 text-[var(--hb-ink-muted)] leading-relaxed max-w-3xl">
          <p>
            The last three years of AI investment compressed the &ldquo;writing code&rdquo; portion of software
            development from roughly 35% to about 15% of total effort. Genuine progress. But it created
            a new reality: <strong className="text-[var(--hb-ink)]">the concept-to-spec portion expanded to 55% of total effort.</strong>
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
            <div className="text-sm text-[var(--hb-ink-muted)] mt-2">of engineering effort is pre-code:<br />specs, architecture, alignment</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-red-400">40&ndash;65%</div>
            <div className="text-sm text-[var(--hb-ink-muted)] mt-2">of intent is lost in each<br />stakeholder-to-builder handoff</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-emerald-400">&lt;2%</div>
            <div className="text-sm text-[var(--hb-ink-muted)] mt-2">ambiguity in AISP Crystal Atoms&mdash;<br />what Hey Bradley generates</div>
          </div>
        </div>
      </section>

      {/* What Open Core Means */}
      <section
        ref={modelReveal.ref}
        className={`border-t border-white/5 transition-all duration-700 ${modelReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--hb-warm)] font-medium mb-4">The model</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">What &ldquo;open core&rdquo; means here.</h2>
          <div className="space-y-4 text-[var(--hb-ink-muted)] leading-relaxed max-w-3xl">
            <p>
              Open core is a development model: one codebase, one product, with a natural boundary.
              Everything that runs in your browser ships free under MIT. The visual builder, themes,
              example websites, spec generators, the media library, image effects, and the
              AISP Crystal Atom output&mdash;all open source.
            </p>
            <p>
              The boundary is infrastructure. Cloud persistence, real LLM integration, team workspaces,
              and hosted deployment are where a future commercial tier begins. But the core idea&mdash;turn
              ideas into precise, machine-readable specifications&mdash;is free and always will be.
            </p>
            <p>
              For engineers: the architecture has clear integration points where LLM connections, database
              layers, and auth systems attach. Any skilled engineer can wire their own API key, connect
              a database, or plug in a custom model. The architecture is yours.
            </p>
            <p>
              Since launch: three-mode product architecture (Whiteboard / Planning / Agentics),
              the full 8-atom AISP Crystal Atom suite, SpecWorkbench, the Export Claude Code markdown bundle,
              multi-page MVP, page-aware chat pipeline, comprehensive interaction logging, and schema guards.
            </p>
          </div>
        </div>
      </section>

      {/* Spec-First Development */}
      <section
        ref={methodReveal.ref}
        className={`border-t border-white/5 transition-all duration-700 ${methodReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-purple-400 font-medium mb-4">The methodology</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Spec-first development for<br />teams that don&rsquo;t write code.</h2>
          <div className="space-y-4 text-[var(--hb-ink-muted)] leading-relaxed max-w-3xl mb-12">
            <p>
              The shift has already happened. Developers at companies adopting agentic processes are
              no longer the bottleneck&mdash;they have tools for coding. The new bottleneck is
              <strong className="text-[var(--hb-ink)]"> going from idea to development</strong>. The frustration
              is the same everywhere: &ldquo;I know exactly what I want, but I can&rsquo;t get it out
              of my head and into a form the AI can execute.&rdquo;
            </p>
            <p>
              Hey Bradley is designed for this moment. A designer and a stakeholder sit in one meeting.
              The designer builds in real time. The stakeholder sees their vision take shape. When the
              meeting ends, enterprise specification documents exist&mdash;not as a separate
              documentation step, but as a natural byproduct of the conversation.
            </p>
            <p>
              Those specs are precise enough that any AI coding tool executes them on the first try.
              No interpretation. No telephone game. The meeting <em>is</em> the sprint.
            </p>
          </div>

          {/* The landscape — soft framing */}
          <div className="bg-white/[0.03] border border-[var(--hb-warm)]/20 rounded-2xl p-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Where Hey Bradley fits</h3>
            <p className="text-[var(--hb-ink-muted)] leading-relaxed text-center max-w-2xl mx-auto mb-4">
              AI builders, AI dev tools, and AI agents all serve the same spec.
              Hey Bradley produces it once, in a format every tool can read.
            </p>
            <p className="text-center">
              <Link
                to="/blog/why-we-built-this-the-honest-version"
                className="text-sm text-[var(--hb-warm)] font-medium hover:underline"
              >
                Read the comparison &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* AISP */}
      <section
        ref={aispReveal.ref}
        className={`border-t border-white/5 transition-all duration-700 ${aispReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400 font-medium mb-4">The protocol</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">AISP: why near-zero ambiguity<br />makes this possible.</h2>
          <div className="space-y-4 text-[var(--hb-ink-muted)] leading-relaxed max-w-3xl mb-10">
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
          <div className="bg-[#131825] border border-[var(--hb-warm)]/20 rounded-2xl p-6 font-mono text-sm leading-[2.2] overflow-x-auto text-[var(--hb-ink-muted)]">
            <span className="text-[#8a7a6d]">{'// Crystal Atom — five formal components. Nothing left to interpret.'}</span><br />
            <span className="text-[var(--hb-warm)] font-bold">{'⟦'}</span><br />
            {'  '}<span className="text-amber-400">&Omega;</span>{' := { Patient intake form with progress bar and confirmation }'}<br />
            {'  '}<span className="text-amber-400">&Sigma;</span>{' := { Form:{sections:[Demographics, History, Medications, Confirm]} }'}<br />
            {'  '}<span className="text-amber-400">&Gamma;</span>{' := { R1: reuse existing PatientAuth from src/auth/'}<br />
            {'         R2: validate against existing patient_records schema }'}<br />
            {'  '}<span className="text-amber-400">&Lambda;</span>{' := { route:="/intake/new", db:=patients, api:=POST /api/v2/intake }'}<br />
            {'  '}<span className="text-amber-400">&Epsilon;</span>{' := { V1: VERIFY 4 sections render, V2: progress bar advances per step }'}<br />
            <span className="text-[var(--hb-warm)] font-bold">{'⟧'}</span>
          </div>
          <p className="text-xs text-[var(--hb-ink-muted)] mt-3 text-center">
            AISP is open source.{' '}
            <a
              href="https://github.com/bar181/aisp-open-core"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--hb-warm)] hover:underline"
            >
              Explore the protocol &rarr;
            </a>
          </p>
        </div>
      </section>

      {/* How It Was Built */}
      <section
        ref={builtReveal.ref}
        className={`border-t border-white/5 transition-all duration-700 ${builtReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-medium mb-4">How it&apos;s built</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Agentic engineering,<br />from architecture to ship.</h2>
          <div className="space-y-4 text-[var(--hb-ink-muted)] leading-relaxed max-w-3xl mb-10">
            <p>
              Hey Bradley is itself built using the methodology it teaches. The whole codebase was
              developed through agentic workflows&mdash;multi-agent swarms coordinating across
              architecture, implementation, testing, and review. Every phase followed spec-first
              principles: define the intent precisely, then let AI agents execute.
            </p>
            <p>
              The project uses deep agentic engineering practices: hierarchical mesh topology for agent
              coordination, HNSW-indexed vector memory for pattern learning, domain-driven design with
              bounded contexts, and a 3-tier model routing system that selects the right AI for each
              task. Every decision documented as it was made.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/[0.03] border border-[var(--hb-warm)]/20 rounded-xl p-5">
              <div className="text-base font-semibold text-cyan-400">Honest scope</div>
              <div className="text-xs text-[var(--hb-ink-muted)] mt-1">Ship what we said we&rsquo;d ship</div>
            </div>
            <div className="bg-white/[0.03] border border-[var(--hb-warm)]/20 rounded-xl p-5">
              <div className="text-base font-semibold text-cyan-400">Documented decisions</div>
              <div className="text-xs text-[var(--hb-ink-muted)] mt-1">Every choice on the record</div>
            </div>
            <div className="bg-white/[0.03] border border-[var(--hb-warm)]/20 rounded-xl p-5">
              <div className="text-base font-semibold text-cyan-400">Tested before sealed</div>
              <div className="text-xs text-[var(--hb-ink-muted)] mt-1">Green tests, every phase</div>
            </div>
            <div className="bg-white/[0.03] border border-[var(--hb-warm)]/20 rounded-xl p-5">
              <div className="text-base font-semibold text-cyan-400">Public ledger</div>
              <div className="text-xs text-[var(--hb-ink-muted)] mt-1">Built in the open</div>
            </div>
          </div>

          {/* For builders */}
          <h3 className="mt-12 mb-4 text-lg font-semibold text-[var(--hb-ink)]">For builders, here&rsquo;s what&rsquo;s inside</h3>
          <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-[var(--hb-ink-muted)] leading-relaxed">
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>5-mode personality system (professional / fun / geek / teacher / coach)</span></li>
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>AISP atom trace visible on every reply</span></li>
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>Latency badge &mdash; speed shown on every patch</span></li>
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>Premium opinionated templates</span></li>
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>Mobile-native 3-tab nav with hamburger drawer</span></li>
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>Conversation Log &mdash; every prompt + reply in EXPERT mode</span></li>
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>Three-mode product (Whiteboard / Planning / Agentics)</span></li>
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>8 Crystal Atoms (PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD + AGENT)</span></li>
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>SpecWorkbench + Export Claude Code markdown bundle</span></li>
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>Multi-page MVP + page-aware chat pipeline</span></li>
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>TDD scaffold + KISS reviewer + Seal Panel</span></li>
            <li className="flex gap-2"><span className="text-[var(--hb-warm)]">&#10003;</span><span>Comprehensive interaction logging + schema guards</span></li>
          </ul>
        </div>
      </section>

      {/* The Repositories */}
      <section
        ref={reposReveal.ref}
        className={`border-t border-white/5 transition-all duration-700 ${reposReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-medium mb-4">The repositories</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8">Two open projects. One methodology.</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="https://github.com/bar181/hey-bradley-core"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/[0.03] border border-[var(--hb-warm)]/20 rounded-2xl p-8 hover:border-[var(--hb-warm)]/40 transition-colors no-underline"
            >
              <h3 className="text-lg font-semibold mb-2 text-[var(--hb-ink)]">Hey Bradley</h3>
              <p className="text-sm text-[var(--hb-ink-muted)] mb-1">The reference implementation</p>
              <p className="text-sm text-[var(--hb-ink-muted)] leading-relaxed mb-4">
                Visual builder that generates AISP specs from human interactions. React + TypeScript + Tailwind.
                Themes, examples, a deep media library, spec generators, and image effects &mdash; all open source.
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-[var(--hb-warm)] font-medium group-hover:underline">
                github.com/bar181/hey-bradley-core <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
            <a
              href="https://github.com/bar181/aisp-open-core"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/[0.03] border border-[var(--hb-warm)]/20 rounded-2xl p-8 hover:border-purple-500/40 transition-colors no-underline"
            >
              <h3 className="text-lg font-semibold mb-2 text-[var(--hb-ink)]">AISP Open Core</h3>
              <p className="text-sm text-[var(--hb-ink-muted)] mb-1">The specification protocol</p>
              <p className="text-sm text-[var(--hb-ink-muted)] leading-relaxed mb-4">
                Crystal Atom notation, the symbol set, tier assessment, validation tools, and the formal
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
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--hb-ink-muted)] font-medium mb-4">About the research</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Built by Bradley Ross.</h2>
          <div className="space-y-4 text-[var(--hb-ink-muted)] leading-relaxed max-w-3xl">
            <p>
              Hey Bradley is a research project built to demonstrate that the concept-to-spec gap
              is the defining bottleneck of modern software development&mdash;and that it&rsquo;s
              solvable.
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
            <Link to="/about" className="inline-flex items-center gap-2 text-sm text-[var(--hb-ink-muted)] hover:text-[var(--hb-ink)] transition-colors">
              <BookOpen className="w-4 h-4" /> About Hey Bradley
            </Link>
            <span className="text-neutral-700">|</span>
            <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[var(--hb-ink-muted)] hover:text-[var(--hb-ink)] transition-colors">
              <Code className="w-4 h-4" /> AISP Research
            </a>
            <span className="text-neutral-700">|</span>
            <Link to="/how-i-built-this" className="inline-flex items-center gap-2 text-sm text-[var(--hb-ink-muted)] hover:text-[var(--hb-ink)] transition-colors">
              <Cpu className="w-4 h-4" /> How It Was Built
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">The telephone game is over.</h2>
          <p className="text-[var(--hb-ink-muted)] max-w-xl mx-auto mb-8 leading-relaxed">
            Describe what you see. Watch it appear. Specs generated automatically.
            Any AI builds it. What you approved is what ships.
          </p>
          <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center justify-center gap-4">
            <Link
              to="/new-project"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto min-h-[44px] px-8 py-3 bg-[var(--hb-warm)] text-white font-semibold rounded-xl hover:bg-[var(--hb-warm-hover)] transition-colors shadow-lg"
            >
              Try the open source version <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/bar181/aisp-open-core"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto min-h-[44px] px-8 py-3 border border-[var(--hb-warm)]/30 text-[var(--hb-ink)] font-semibold rounded-xl hover:bg-[var(--hb-paper-soft)] transition-colors"
            >
              Explore AISP <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <OpenCoreVsCommercial />

      {/* Footer */}
      <footer className="border-t border-[var(--hb-warm)]/20 py-8 text-center text-sm text-[#8a7a6d]">
        <p>Built in the open &mdash; MIT licensed</p>
        <p className="mt-1">Bradley Ross &mdash; bar181@yahoo.com</p>
      </footer>
    </main>
  )
}
