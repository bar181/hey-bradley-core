import { Link } from 'react-router-dom'
import { Sparkles, Heart, Atom, BookOpen, GraduationCap, ArrowRight } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'

export function About() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d1f12]">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/10 via-transparent to-amber-900/10" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-[#e8772e]/20 text-[#e8772e] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <GraduationCap className="w-4 h-4" />
            Harvard ALM Capstone 2026
          </span>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Meet Bradley.
          </h1>
          <p className="text-xl text-[#6b5e4f] max-w-2xl mx-auto leading-relaxed">
            I&apos;m Bradley Ross, a Harvard Extension ALM candidate who got tired of
            watching great ideas die in the gap between &ldquo;what I imagined&rdquo;
            and &ldquo;what got built.&rdquo; Hey Bradley is my answer.
          </p>
        </div>
      </section>

      {/* The Insight */}
      <section className="py-20 bg-[#f1ece4]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#e8772e]/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#e8772e]" />
            </div>
            <h2 className="text-3xl font-bold">The Insight</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3">The Telephone Game</h3>
              <p className="text-[#6b5e4f] leading-relaxed">
                Every software project starts with a conversation. A founder describes
                their vision, a designer sketches wireframes, a PM writes tickets, a
                developer interprets code. Each handoff is a game of telephone &mdash;
                and research shows 40-65% of implementation intent is lost in
                translation. I wanted to build a tool that captures intent at the source
                and preserves it all the way to the finished product.
              </p>
            </div>
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3">The Capstone</h3>
              <p className="text-[#6b5e4f] leading-relaxed">
                Hey Bradley is my Harvard Extension capstone project for the ALM in
                Digital Media Design. It explores a question that matters: can we create
                a specification format so precise that AI agents can execute it without
                guesswork? The answer is AISP &mdash; the AI Symbolic Protocol &mdash;
                a math-first notation system with 512 symbols that any LLM understands
                natively. The platform you see here is the proof that it works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AISP */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Atom className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold">The AISP Protocol</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3">What is AISP?</h3>
              <p className="text-[#6b5e4f] leading-relaxed">
                The <strong className="text-[#2d1f12]">AI Symbolic Protocol</strong> is a proof-based
                specification format that eliminates ambiguity from software
                documentation. Instead of vague descriptions that lose meaning as they
                pass from stakeholder to developer, AISP encodes intent as structured,
                machine-verifiable atoms. It uses a library of 512 mathematical symbols
                that all major LLMs understand without any special training.
              </p>
            </div>
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3">Crystal Atoms</h3>
              <p className="text-[#6b5e4f] leading-relaxed">
                Every section in a Hey Bradley spec is a <strong className="text-[#2d1f12]">Crystal
                Atom</strong> &mdash; a self-contained unit with typed fields, variant rules,
                and validation constraints. Atoms compose into molecules (pages) and
                organisms (full sites), creating specifications that AI agents can
                execute without guesswork. The target: less than 2% ambiguity per atom.
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white border border-[#e8772e]/20 rounded-2xl p-8">
            <p className="text-[#6b5e4f] leading-relaxed text-sm">
              AISP is open source and available at{' '}
              <a
                href="https://github.com/bar181/aisp-open-core"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 underline hover:text-purple-300"
              >
                github.com/bar181/aisp-open-core
              </a>
              . It is designed for AI, not humans &mdash; a math-first neural symbolic
              language where the goal is near-zero ambiguity between what you specify
              and what gets built.
            </p>
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-20 bg-[#f1ece4]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#2d1f12]" />
            </div>
            <h2 className="text-3xl font-bold">The Vision</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3 text-[#e8772e]">End the Telephone Game</h3>
              <p className="text-[#6b5e4f] leading-relaxed">
                Software specs degrade every time they change hands. Hey Bradley
                captures your vision at the source and locks it into a format that
                cannot be misunderstood &mdash; by humans or machines.
              </p>
            </div>
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3 text-[#e8772e]">Fix the 55% Bottleneck</h3>
              <p className="text-[#6b5e4f] leading-relaxed">
                More than half of development effort goes to communicating intent.
                Spec-driven development with AISP targets this bottleneck by making
                specifications the single source of truth.
              </p>
            </div>
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3 text-[#e8772e]">Spec-Driven Development</h3>
              <p className="text-[#6b5e4f] leading-relaxed">
                Write your spec, not your code. Hey Bradley generates 6 enterprise-grade
                specification documents from a single config. When AI agents use those
                specs, they produce exactly what was specified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#e8772e]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#e8772e]" />
            </div>
            <h2 className="text-3xl font-bold">The Capstone Journey</h2>
          </div>
          <p className="text-[#6b5e4f] text-lg mb-8 max-w-3xl leading-relaxed">
            Hey Bradley is a Harvard Extension ALM capstone exploring whether AI
            agents can execute formal specifications without human interpretation.
            The project spans five stages from presentation through open-source
            release and beyond.
          </p>
          <div className="space-y-4">
            {[
              { stage: '1', name: 'Presentation', description: 'Capstone demo with canned simulations, themes, visual builder, and spec generation.', status: 'Complete' },
              { stage: '2', name: 'Pre-LLM MVP', description: 'Full builder with image upload, brand management, project persistence, and color picker.', status: 'Complete' },
              { stage: '3', name: 'LLM MVP', description: 'Real AI chat and listen modes, BYOK API keys, streaming responses, and intelligent suggestions.', status: 'Planned' },
              { stage: '4', name: 'Open Core', description: 'Public open-source release of the free builder. Commercial features split to a pro tier.', status: 'Planned' },
              { stage: '5', name: 'Post-Open-Core', description: 'Cloud persistence, team collaboration, template marketplace, and enterprise features.', status: 'Future' },
            ].map((item) => (
              <div key={item.stage} className="flex items-start gap-4 bg-white border border-[#e8772e]/20 rounded-xl p-6">
                <div className="w-8 h-8 rounded-full bg-[#e8772e] text-[#2d1f12] flex items-center justify-center font-bold text-sm shrink-0">
                  {item.stage}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.status === 'Complete' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.status === 'Planned' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-white/10 text-[#6b5e4f]'
                    }`}>{item.status}</span>
                  </div>
                  <p className="text-sm text-[#6b5e4f]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-[#242424] to-[#1a1a1a] text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to try it?</h2>
          <p className="text-[#6b5e4f] mb-8">Jump into the builder and see what spec-driven development feels like.</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/new-project" className="inline-flex items-center gap-2 px-8 py-3 bg-[#e8772e] text-[#2d1f12] font-semibold rounded-xl hover:bg-[#c45f1c] transition-colors shadow-lg">
              Start Building <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/docs" className="px-8 py-3 border border-[#e8772e]/30 text-[#2d1f12] font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Read the Docs
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
