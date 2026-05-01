// Canonical Progress Evaluation Data — public-site refresh, Agent A2.
//
// Sources: plans/strategic-reviews/2026-04-29-sprint-j-system-wide/00-summary.md
//          plans/strategic-reviews/2026-04-29-product-evaluation.md
//
// Scoring rubric (1-10, 0.5 increments allowed):
//   excellent (9-10) — moat-grade; demoable; capstone-defending
//   strong    (7-8.5) — production-ready; minor polish remaining
//   partial   (4-6.5) — scaffolded but not load-bearing yet
//   gap       (1-3.5) — known weakness; honest in public

export type Verdict = 'excellent' | 'strong' | 'partial' | 'gap'

export interface ProgressItem {
  category: 'Architecture' | 'UX' | 'Engineering' | 'Moat' | 'Gaps'
  name: string
  score: number
  verdict: Verdict
  evidence: string
  reference?: string
}

export const HEADLINE_STATS = {
  codingDays: 2,
  daysToDefense: 14,
  phasesSealed: 52,    // P15 through P69 inclusive (OC-4 + OC-5 sealed in parallel)
  adrsAccepted: 96,    // ADR-096 added at P68/P69
  testsGreen: 730,     // P68/P69 OC-4 + OC-5 cumulative seal-gate
  sprintsSealed: 17,   // F, H, I, J, K, L, M, N, O, OC-1, OC-2, OC-3, OC-2.5, OC-2.5 W2, Polish Wave 1, Polish Wave 2/Close-the-Gap, OC-4/OC-5
} as const

export const PROGRESS_ITEMS: ProgressItem[] = [
  {
    category: 'Architecture',
    name: '5-atom AISP Crystal Atom architecture',
    score: 9.5,
    verdict: 'excellent',
    evidence: 'CONTENT, SELECTION, INSTRUCTION, ASSUMPTIONS, and core Crystal Atoms compose end-to-end through the spec layer. Verbatim LLM lift, Zod-typed, EXPERT trace pane lights up on every reply.',
    reference: 'ADR-053 / ADR-055 / ADR-064',
  },
  {
    category: 'Architecture',
    name: 'Σ-restriction discipline preserved across 79 ADRs',
    score: 10,
    verdict: 'excellent',
    evidence: 'Every ADR honors the Σ symbol budget — no widening waivers, no ADR over 120 LOC, cross-references intact through 79 Accepted decisions.',
    reference: 'docs/adr/',
  },
  {
    category: 'Architecture',
    name: 'DDD bounded contexts',
    score: 9,
    verdict: 'excellent',
    evidence: 'Persistence, intelligence, listen, project, and BYOK contexts each own their own store/schema/migration — no cross-context reach-throughs survived the system-wide review.',
    reference: 'src/contexts/',
  },
  {
    category: 'Moat',
    name: 'AISP visible by default on every reply',
    score: 9.5,
    verdict: 'excellent',
    evidence: 'Sprint L made the spec layer the headline feature — atom animations, primary tab, always-on traces. Reviewers called this the most important moat shift of the cycle.',
    reference: 'Sprint L · ADR-078',
  },
  {
    category: 'Moat',
    name: 'Speed visible — latency badge on every patch',
    score: 9,
    verdict: 'strong',
    evidence: 'Sprint K shipped per-reply latency capture and a UI badge so the speed advantage stops being a pitch deck claim and becomes lived experience.',
    reference: 'Sprint K · ADR-077',
  },
  {
    category: 'Moat',
    name: 'Premium templates ("designer made this")',
    score: 8.5,
    verdict: 'strong',
    evidence: 'Sprint M landed strongly opinionated templates with design discipline so the first impression is "designer-grade", not "stock Tailwind".',
    reference: 'Sprint M · ADR-079 · 3398702',
  },
  {
    category: 'UX',
    name: '5-mode personality system + Geek inline AISP',
    score: 8.5,
    verdict: 'strong',
    evidence: 'Personality engine composes tone, bubble style, and onboarding step without widening Σ. Geek mode renders inline AISP atoms; five distinct bubble styles ship.',
    reference: 'ADR-073 / ADR-074',
  },
  {
    category: 'UX',
    name: 'Mobile UX bifurcation — 3-tab nav, hamburger',
    score: 8.5,
    verdict: 'strong',
    evidence: 'Sprint J P53 overhauled the mobile shell — three-tab nav, hamburger drawer, EXPERT-tab parity — sealed at composite 89.75 system-wide.',
    reference: 'ADR-076 · 644200a',
  },
  {
    category: 'UX',
    name: 'Listen mode (voice → spec → code)',
    score: 9,
    verdict: 'excellent',
    evidence: 'Web-Speech PTT capture flows through the unified review-first voice UX and lands as a spec-layer patch, not a transcript blob. ListenReviewCard closes the loop.',
    reference: 'ADR-065 / ADR-066',
  },
  {
    category: 'Engineering',
    name: 'Test discipline — 244 PURE-UNIT GREEN',
    score: 9,
    verdict: 'strong',
    evidence: 'Curated PURE-UNIT seal gate stands at 244/244 GREEN. AgentProxy mocks the LLM surface so deterministic tests stay fast and isolated.',
    reference: 'P55 seal · 2944461',
  },
  {
    category: 'Engineering',
    name: '79 ADRs Accepted, ≤120 LOC each',
    score: 9.5,
    verdict: 'excellent',
    evidence: 'Every architectural decision is captured in a tight, dated ADR with cross-references to the phase that landed it. No ADR exceeds the 120-LOC budget.',
    reference: 'docs/adr/README.md',
  },
  {
    category: 'Engineering',
    name: 'Wave-gate sprint cadence',
    score: 8.5,
    verdict: 'strong',
    evidence: 'Each sprint runs as a 3-5 phase wave with seal gates, retros, and persona scoring. Six sprints sealed inside two coding days without quality regressions.',
    reference: 'plans/implementation/mvp-plan/STATE.md',
  },
  {
    category: 'Engineering',
    name: '7-agent parallel swarm validated',
    score: 8.5,
    verdict: 'strong',
    evidence: 'Sprint M ran a 7-agent parallel swarm with disjoint scopes and one-shot returns — no polling, no drift, all wave-gate checks held.',
    reference: 'Sprint M',
  },
  {
    category: 'Gaps',
    name: 'Distribution / GTM readiness',
    score: 4,
    verdict: 'gap',
    evidence: 'Open-core release, demo video, and Agentics Foundation beta are scoped to Sprint O (post-defense). No paid acquisition or install metrics yet.',
    reference: 'Sprint O · planned',
  },
  {
    category: 'Gaps',
    name: 'Hosted shareable spec link',
    score: 5,
    verdict: 'partial',
    evidence: 'Share Spec currently writes a clipboard data URL — works for one-to-one demos but no hosted view. Hosted route is Sprint N (post-defense).',
    reference: 'ADR-075 → ADR-080',
  },
  {
    category: 'Gaps',
    name: 'Learning flywheel scaffold',
    score: 5.5,
    verdict: 'partial',
    evidence: 'ReasoningBank + ruvector wiring is scaffolded with a scoped fix landed, but the runtime flywheel that learns from accepted patches is dormant.',
    reference: 'plans/deferred-features.md',
  },
  {
    category: 'Gaps',
    name: 'Tier-2 flagship proof (SaaS dashboard)',
    score: 3,
    verdict: 'gap',
    evidence: 'No Tier-2 SaaS-dashboard flagship yet. The open-core demo carries the capstone; Tier-2 proof is explicitly deferred to the commercial track.',
    reference: 'open-core-moat-roadmap.md',
  },
  {
    category: 'Gaps',
    name: 'Defense readiness',
    score: 9.5,
    verdict: 'excellent',
    evidence: 'Capstone-ready composite scored 92/100 at Sprint J seal; Sprints K/L/M added Speed Visible, Spec Unmissable, and Premium Templates with eight days of runway.',
    reference: 'product-evaluation.md',
  },
]
