/**
 * OpenCoreVsCommercial — explicit delineation block.
 * Used on /open-core (and reusable on Welcome).
 * F4 from P22 brutal-review pass-1.
 */

const OPEN_CORE = [
  'MIT-licensed; clone, fork, self-host',
  'Single-page sites; chat + listen + builder modes',
  'BYOK keys; runs entirely in your browser',
  'Local storage (sql.js + IndexedDB); no backend',
  '`.heybradley` zip exports for full project portability',
  '5-provider LLM matrix; cost cap; 30-day audit retention',
]

const COMMERCIAL = [
  'Hosted demo without BYOK; account-based',
  'Multi-page sites + complex SPAs (dashboards, web apps)',
  'Supabase auth + persistence; team workspaces',
  'Upload references (style guides, brand voice, codebases)',
  'Agentic support system for existing codebases',
  'Commercial tiers (Starter / Pro / Enterprise)',
]

export function OpenCoreVsCommercial() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16" data-testid="open-core-vs-commercial">
      <h2 className="text-3xl font-bold mb-2 text-[#2d1f12]">Open core vs commercial</h2>
      <p className="text-[#6b5e4f] mb-8 leading-relaxed max-w-2xl">
        This repo is the open core &mdash; everything you need to build a
        single-page marketing site with AISP specs locally. The commercial
        version (separate repo, post-MVP) adds the heavier features.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#e8772e]/30 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.15em] text-[#e8772e] mb-3 font-medium">Open core (this repo)</p>
          <ul className="space-y-2 text-sm text-[#2d1f12] leading-relaxed">
            {OPEN_CORE.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[#e8772e]">&#10003;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-[#8a7a6d]/30 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.15em] text-[#8a7a6d] mb-3 font-medium">Commercial (separate repo, post-MVP)</p>
          <ul className="space-y-2 text-sm text-[#2d1f12] leading-relaxed">
            {COMMERCIAL.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[#8a7a6d]">&#10003;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
