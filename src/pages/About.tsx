import { Link } from 'react-router-dom'
import { Sparkles, Heart, BookOpen, ArrowRight } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { useReveal } from '@/hooks/useReveal'

export function About() {
  const insightReveal = useReveal<HTMLElement>()
  const visionReveal = useReveal<HTMLElement>()
  const journeyReveal = useReveal<HTMLElement>()

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d1f12]">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/10 via-transparent to-amber-900/10" />
        <div className="relative max-w-5xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Meet Bradley.
          </h1>
          <p className="text-base md:text-xl text-[#6b5e4f] max-w-2xl mx-auto leading-relaxed">
            I&apos;m Bradley Ross, and I got tired of
            watching great ideas die in the gap between &ldquo;what I imagined&rdquo;
            and &ldquo;what got built.&rdquo; Hey Bradley is my answer.
          </p>
        </div>
      </section>

      {/* What this product is */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-lg md:text-xl text-[#2d1f12] leading-relaxed text-center">
            Hey Bradley is a website builder that works the way you talk. It&rsquo;s
            also the cleanest way to hand a finished website spec to your developer
            &mdash; or to your AI coding assistant.
          </p>
        </div>
      </section>

      {/* The Insight */}
      <section
        ref={insightReveal.ref}
        className={`py-12 md:py-20 bg-[#f1ece4] transition-all duration-700 ${insightReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#e8772e]/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#e8772e]" />
            </div>
            <h2 className="text-3xl font-bold">The Insight</h2>
          </div>
          <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">The Telephone Game</h3>
            <p className="text-[#6b5e4f] leading-relaxed">
              Every software project starts with a conversation. A founder describes
              their vision, a designer sketches wireframes, a PM writes tickets, a
              developer interprets code. Each handoff is a game of telephone &mdash;
              and research shows a large share of implementation intent is lost in
              translation. I wanted to build a tool that captures intent at the source
              and preserves it all the way to the finished product.
            </p>
          </div>
        </div>
      </section>

      {/* For engineers — soft pivot */}
      <section className="py-10 md:py-14 bg-[#faf8f5]">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
            <p className="text-[#6b5e4f] leading-relaxed">
              If you&rsquo;re an engineer, here&rsquo;s what powers it under the hood.
              I built a small symbolic language so AI tools and human developers see
              the same spec &mdash; every time.{' '}
              <Link to="/research" className="text-[#e8772e] hover:underline font-medium">
                Read the technical overview &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section
        ref={visionReveal.ref}
        className={`py-12 md:py-20 bg-[#f1ece4] transition-all duration-700 ${visionReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
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
              <h3 className="text-lg font-semibold mb-3 text-[#e8772e]">Fix the Translation Tax</h3>
              <p className="text-[#6b5e4f] leading-relaxed">
                A huge share of every software project goes to communicating intent.
                Hey Bradley targets that tax by making the conversation itself the
                single source of truth.
              </p>
            </div>
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3 text-[#e8772e]">A Clean Hand&#8209;Off</h3>
              <p className="text-[#6b5e4f] leading-relaxed">
                Describe what you want. Hey Bradley generates a clear spec your
                developer &mdash; or your AI coding assistant &mdash; can execute
                without guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section
        ref={journeyReveal.ref}
        className={`py-12 md:py-20 bg-[#faf8f5] transition-all duration-700 ${journeyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#e8772e]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#e8772e]" />
            </div>
            <h2 className="text-3xl font-bold">The Journey</h2>
          </div>
          <p className="text-[#6b5e4f] text-lg mb-8 max-w-3xl leading-relaxed">
            Hey Bradley grew in five stages, from a working demo to an open-source
            builder anyone can run on their own machine.
          </p>
          <div className="space-y-4">
            {[
              { stage: '1', name: 'Presentation', description: 'Working demo with canned simulations, themes, visual builder, and spec generation.', status: 'Complete' },
              { stage: '2', name: 'Pre-AI Builder', description: 'Full builder with image upload, brand management, project persistence, and color picker.', status: 'Complete' },
              { stage: '3', name: 'Real AI Modes', description: 'Real chat and listen modes across multiple AI providers, bring-your-own-key support, streaming responses, and intelligent suggestions.', status: 'Complete' },
              { stage: '4', name: 'Open Core', description: 'Public open-source release of the free builder, with three modes (Whiteboard / Planning / Agentics) and a clean export to your developer or AI tool.', status: 'Complete' },
              { stage: '5', name: 'What Comes Next', description: 'Cloud persistence, team collaboration, template marketplace, and hosted features &mdash; reserved for a future commercial tier so the open core stays free.', status: 'Future' },
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
      <section className="py-12 md:py-20 bg-gradient-to-b from-[#242424] to-[#1a1a1a] text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to try it?</h2>
          <p className="text-[#6b5e4f] mb-8">Jump into the builder and see what spec-driven development feels like.</p>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 md:flex-wrap">
            <Link to="/new-project" className="inline-flex items-center justify-center gap-2 w-full md:w-auto min-h-[44px] px-8 py-3 bg-[#e8772e] text-white font-semibold rounded-xl hover:bg-[#c45f1c] transition-colors shadow-lg">
              Try the open source version <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full md:w-auto min-h-[44px] px-8 py-3 border border-[#e8772e]/30 text-[#2d1f12] font-semibold rounded-xl hover:bg-[#f1ece4] transition-colors">
              Explore AISP <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#e8772e]/20 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#6b5e4f] mb-2">Built in the open &mdash; MIT licensed</p>
          <p className="text-sm text-[#6b5e4f]">Bradley Ross</p>
        </div>
      </footer>
    </main>
  )
}
