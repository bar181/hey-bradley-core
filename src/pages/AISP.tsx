import { Link } from 'react-router-dom'
import { Atom, BookOpen, BarChart3, ExternalLink, ArrowRight } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'
import { AISPDualView } from '@/components/marketing/AISPDualView'

const COMPONENTS = [
  { symbol: 'Ω', name: 'Objective', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', desc: 'The high-level goal in natural language. What the stakeholder actually wants, expressed once and preserved throughout the pipeline.' },
  { symbol: 'Σ', name: 'Structure', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', desc: 'Typed data schema. Components, fields, sections, and their relationships defined formally so no AI has to guess the shape.' },
  { symbol: 'Γ', name: 'Grounding', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', desc: 'References to existing systems. Reuse rules, API endpoints, database schemas, and component libraries already in the codebase.' },
  { symbol: 'Λ', name: 'Logistics', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', desc: 'Deployment configuration. Routes, databases, API paths, hosting targets, and infrastructure constraints.' },
  { symbol: 'Ε', name: 'Evaluation', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', desc: 'Verification criteria. Testable assertions that prove the implementation matches the objective. The built-in acceptance test.' },
]

const COMPARISONS = [
  { label: 'Ambiguity', traditional: '40-65%', aisp: '<2%' },
  { label: 'Machine-readable', traditional: 'No', aisp: 'Yes' },
  { label: 'Handoff loss', traditional: 'Degrades per step', aisp: 'Preserved' },
  { label: 'AI execution', traditional: 'Requires interpretation', aisp: 'Direct execution' },
  { label: 'Validation', traditional: 'Manual review', aisp: 'Formal verification' },
  { label: 'Audit trail', traditional: 'Scattered docs', aisp: 'Single typed atom' },
]

export function AISP() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d1f12]">
      <MarketingNav />

      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Atom className="w-4 h-4" />
            Open Standard &middot; MIT License
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            AI Symbolic Protocol
          </h1>
          <p className="text-xl text-[#6b5e4f] max-w-2xl mx-auto leading-relaxed mb-8">
            A math-first neural symbolic language with 512 symbols that all AI and
            LLM understand natively. The goal: near-zero ambiguity between what you
            specify and what gets built.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-purple-600 text-[#2d1f12] hover:bg-purple-500 transition-colors">
              <ExternalLink className="w-4 h-4" /> View on GitHub
            </a>
            <Link to="/new-project" className="px-6 py-3 rounded-xl font-semibold border border-white/30 text-[#2d1f12] hover:bg-white/10 transition-colors">
              Try in Builder
            </Link>
          </div>
        </div>
      </section>

      {/* What is AISP */}
      <section className="py-20 bg-[#f1ece4]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold">What is AISP?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3">The Problem It Solves</h3>
              <p className="text-[#6b5e4f] leading-relaxed">
                Traditional software specifications are written in natural language —
                prose that degrades every time it changes hands. A stakeholder describes
                their vision, a PM interprets it, a designer approximates it, and a
                developer guesses the rest. AISP replaces this telephone game with a
                formal notation that machines parse without interpretation and humans
                can still read.
              </p>
            </div>
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-3">How It Works</h3>
              <p className="text-[#6b5e4f] leading-relaxed">
                Every specification is a <strong className="text-[#2d1f12]">Crystal Atom</strong> — a
                self-contained unit with five typed components. Atoms compose into
                molecules (pages) and organisms (full applications). The 512 symbols
                in the Sigma set (&#931;&#8325;&#8321;&#8322;) provide mathematical
                precision that eliminates ambiguity while remaining compact enough for
                any LLM context window.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Components */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">The Five Crystal Atom Components</h2>
          <p className="text-[#6b5e4f] mb-12 max-w-2xl">Each atom encodes the complete specification in five formal components. Nothing is left to interpret.</p>
          <div className="grid md:grid-cols-5 gap-4">
            {COMPONENTS.map((c) => (
              <div key={c.symbol} className={`rounded-2xl border p-6 ${c.bg}`}>
                <span className={`text-4xl font-bold ${c.color} block mb-3`}>{c.symbol}</span>
                <h3 className="text-lg font-semibold text-[#2d1f12] mb-2">{c.name}</h3>
                <p className="text-sm text-[#6b5e4f] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sigma 512 */}
      <section className="py-20 bg-[#f1ece4]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">The Sigma-512 Symbol Set</h2>
              <p className="text-[#6b5e4f] leading-relaxed mb-6">
                AISP uses a curated library of 512 mathematical and logical symbols
                that all major LLMs understand natively — no fine-tuning, no special
                prompting. These symbols provide precise, unambiguous operators for
                defining relationships, constraints, types, and validation rules.
              </p>
              <p className="text-[#6b5e4f] leading-relaxed">
                The set covers: assignment operators, type constructors, logical
                quantifiers, set operations, temporal markers, verification assertions,
                and composition operators. Every symbol was tested against GPT-4,
                Claude, Gemini, and Llama to confirm native comprehension.
              </p>
            </div>
            <div className="bg-[#1a1d27] border border-[#e8772e]/20 rounded-2xl p-8 font-mono text-sm">
              <p className="text-[#6b5e4f] mb-4">// Sample symbols from Sigma-512</p>
              <div className="space-y-2 text-[#2d1f12]">
                <p><span className="text-purple-400">:=</span> &nbsp;Assignment (define as)</p>
                <p><span className="text-indigo-400">&#8658;</span> &nbsp;Implies (if-then)</p>
                <p><span className="text-emerald-400">&#8704;</span> &nbsp;Universal quantifier (for all)</p>
                <p><span className="text-amber-400">&#8712;</span> &nbsp;Element of (belongs to)</p>
                <p><span className="text-pink-400">&#8866;</span> &nbsp;Proves (verification)</p>
                <p><span className="text-cyan-400">&#10216; &#10217;</span> &nbsp;Typed pair delimiters</p>
                <p><span className="text-red-400">&#10214; &#10215;</span> &nbsp;Crystal Atom boundaries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ambiguity Comparison */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold">How It Achieves &lt;2% Ambiguity</h2>
          </div>
          <p className="text-[#6b5e4f] mb-12 max-w-2xl">
            Ambiguity is measured formally: the ratio of symbols requiring
            interpretation to total symbols in the spec. Traditional prose specs
            average 40-65%. AISP Crystal Atoms target under 2%.
          </p>

          {/* Visual bar chart */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-6">Ambiguity Comparison</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#6b5e4f]">Traditional Specs</span>
                    <span className="text-red-400 font-semibold">~50%</span>
                  </div>
                  <div className="h-4 rounded-full bg-white overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: '50%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#6b5e4f]">Google Docs PRD</span>
                    <span className="text-orange-400 font-semibold">~40%</span>
                  </div>
                  <div className="h-4 rounded-full bg-white overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400" style={{ width: '40%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#6b5e4f]">AI Prompt</span>
                    <span className="text-amber-400 font-semibold">~30%</span>
                  </div>
                  <div className="h-4 rounded-full bg-white overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: '30%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#6b5e4f]">AISP Crystal Atom</span>
                    <span className="text-emerald-400 font-semibold">&lt;2%</span>
                  </div>
                  <div className="h-4 rounded-full bg-white overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: '2%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison table */}
            <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-8 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-6">Feature Comparison</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8772e]/20">
                    <th className="text-left text-[#6b5e4f] pb-3 font-medium">Attribute</th>
                    <th className="text-center text-[#6b5e4f] pb-3 font-medium">Traditional</th>
                    <th className="text-center text-emerald-400 pb-3 font-medium">AISP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {COMPARISONS.map((row) => (
                    <tr key={row.label}>
                      <td className="py-3 text-[#2d1f12]">{row.label}</td>
                      <td className="py-3 text-center text-red-400">{row.traditional}</td>
                      <td className="py-3 text-center text-emerald-400">{row.aisp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-[#f1ece4]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Explore AISP</h2>
          <p className="text-[#6b5e4f] mb-10 max-w-xl mx-auto">
            AISP is open source and free to use. Dive into the specification,
            try it in the builder, or read the research.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-purple-600 text-[#2d1f12] hover:bg-purple-500 transition-colors">
              <ExternalLink className="w-4 h-4" /> GitHub Repo
            </a>
            <Link to="/new-project" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white text-neutral-900 hover:bg-neutral-100 transition-colors">
              Try in Builder <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/research" className="px-6 py-3 rounded-xl font-semibold border border-white/30 text-[#2d1f12] hover:bg-white/10 transition-colors">
              Read Research
            </Link>
          </div>
        </div>
      </section>

      <AISPDualView />

      {/* Footer */}
      <footer className="py-12 border-t border-[#e8772e]/20 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#6b5e4f] mb-2">Harvard ALM Capstone &mdash; Digital Media Design &mdash; May 2026</p>
          <p className="text-sm text-[#6b5e4f]">Bradley Ross &mdash; Creator of AISP &mdash; bar181@yahoo.com</p>
        </div>
      </footer>
    </main>
  )
}
