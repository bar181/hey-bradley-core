/**
 * AISPDualView — Crystal Atom side-by-side with human-readable spec.
 * Used on /aisp page (and reusable on /how-it-works).
 * F1 from P22 brutal-review pass-1.
 */

const CRYSTAL_ATOM = `⟦
  Ω := { Build a marketing site for X }
  Σ := {
    Site:{theme:Theme, sections:[Section]},
    Section:{type:SectionType, id:𝕊, layout:Layout, content:Content},
    Theme:{preset:Preset, palette:Palette, typography:Type}
  }
  Γ := {
    R1: ∀ s∈sections : unique(s.id),
    R2: ∀ s : s.type ∈ SectionType,
    R3: ∀ patches : patch.path ∈ AllowList
  }
  Λ := { spec_version := "aisp-1.2", max_sections := 20 }
  Ε := {
    V1: VERIFY JSON.parse(export) ∈ Site,
    V2: VERIFY Ambig(spec) < 0.02
  }
⟧`

const HUMAN_SPEC = `Goal
  Build a marketing site for X.

Schema
  A Site has a Theme + array of Sections.
  Each Section has a type, id, layout, and content.
  Each Theme has a preset, palette, and typography.

Rules
  R1 — every section has a unique ID.
  R2 — every section type is one of the recognized types.
  R3 — every patch operation targets an allow-listed JSON path.

Limits
  Spec version: aisp-1.2.
  Max sections: 20.

Verification
  V1 — the exported JSON parses as a valid Site.
  V2 — measured ambiguity is under 2%.`

export function AISPDualView() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16" data-testid="aisp-dual-view">
      <h2 className="text-3xl font-bold mb-2 text-[#2d1f12]">Crystal Atom + Human Spec</h2>
      <p className="text-[#6b5e4f] mb-8 leading-relaxed max-w-2xl">
        AISP outputs are math-first &mdash; LLMs read them natively. Humans read
        the right column. Both columns describe the same site, with under 2%
        semantic gap between them.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#1f1a14] text-[#faf8f5] rounded-2xl p-6 overflow-x-auto">
          <p className="text-xs uppercase tracking-[0.15em] text-[#e8772e] mb-3 font-medium">AISP (machine-readable)</p>
          <pre className="text-sm font-mono leading-relaxed whitespace-pre">{CRYSTAL_ATOM}</pre>
        </div>
        <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.15em] text-[#e8772e] mb-3 font-medium">Human-readable</p>
          <pre className="text-sm font-mono leading-relaxed whitespace-pre text-[#2d1f12]">{HUMAN_SPEC}</pre>
        </div>
      </div>
      <p className="text-sm text-[#6b5e4f] mt-6 max-w-2xl">
        See the full AISP grammar at{' '}
        <a
          href="https://github.com/bar181/aisp-open-core"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#e8772e] underline hover:no-underline"
        >
          bar181/aisp-open-core
        </a>{' '}
        &mdash; the open-source 512-symbol vocabulary.
      </p>
    </section>
  )
}
