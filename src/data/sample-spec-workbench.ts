/**
 * P95 / AW-SPEC-WORKBENCH (A2) — Sample seed data for SpecWorkbench.
 *
 * Hardcoded Hey Bradley arc P15-P20 as PhaseCard[] for the Planning +
 * Agentics right-panel SpecWorkbench. Mirrors sample-process-map.ts
 * style: ships as a static asset (no runtime fetch), zero deps.
 *
 * Three PhaseCards covering the MVP arc:
 *   - 'foundation'  : P15-P16 (site shell + persistence)
 *   - 'intelligence': P17-P19 (LLM provider + chat + listen)
 *   - 'polish'      : P20    (MVP close)
 *
 * Per ADR-116 three-mode product architecture + ADR-118 PROCESS_ATOM
 * + ADR-120 AGENT_ATOM + ADR-053 INTENT_ATOM AISP convention.
 */
import type { PhaseCard } from '@/components/agentics/SpecWorkbench'

export const HEY_BRADLEY_SAMPLE_PHASES: readonly PhaseCard[] = [
  {
    id: 'foundation',
    phase: 15,
    name: 'Foundation',
    status: 'sealed',
    sprints: [
      {
        id: 's15-shell',
        name: 'Site Shell + Brand Locks',
        status: 'sealed',
        agentCount: 3,
        keyDeliverable: 'Theme system, brand tokens, mode shell',
      },
      {
        id: 's16-db',
        name: 'Persistence (sql.js + IndexedDB)',
        status: 'sealed',
        agentCount: 2,
        keyDeliverable: 'Offline-first local DB with migrations',
      },
    ],
    humanSpec: {
      northStar:
        'Establish the design and persistence foundation that every later phase composes on top of. Brand locks and theme tokens lock visual identity; sql.js + IndexedDB locks offline-first data without server dependency. The user experience target: open the app, see a polished surface, never lose work.',
      sadd:
        'Two bounded contexts: (1) Design System owns hb-* CSS variables, theme presets, and brand assertions; (2) Persistence owns sql.js bootstrap, IndexedDB BLOB pin, and the migration runner. Public APIs: useTheme(), saveProject(), loadProject(). Both contexts are read-only stable for downstream consumers.',
      implementationPlan:
        'P15 ships AppShell, theme tokens, and the kitchen-sink demo. P16 wires sql.js with a 4-table schema (projects/sessions/messages/preferences) and a migration runner. Tests: render AppShell with each theme; round-trip a project through saveProject / loadProject. Ship at the close of each phase with a brutal-honest review pass before moving on.',
    },
    aispSpec:
      'Σ := { theme: ThemePreset, project: ProjectRecord, migration: MigrationStep[] }\n' +
      'Ω := { Lock visual identity + offline-first persistence before any feature work }\n' +
      'Γ := { R1: |themes| ≥ 6, R2: schema versioned, R3: brand tokens via var(--hb-*) only }\n' +
      'Λ := { theme set at boot from storage; migrations run idempotent on schema gap }\n' +
      'Ε := { V1: VERIFY all colors via tokens, V2: VERIFY round-trip save/load }',
    adrRefs: [
      { id: 'ADR-016', title: 'Local Database (sql.js + IndexedDB)' },
      { id: 'ADR-087', title: 'Design Token System' },
    ],
  },
  {
    id: 'intelligence',
    phase: 17,
    name: 'Intelligence',
    status: 'sealed',
    sprints: [
      {
        id: 's17-llm',
        name: 'LLM Provider Abstraction (BYOK)',
        status: 'sealed',
        agentCount: 4,
        keyDeliverable: 'Claude / Gemini / OpenRouter adapters + BYOK',
      },
      {
        id: 's18-chat',
        name: 'Real Chat Mode (LLM → JSON Patches)',
        status: 'sealed',
        agentCount: 3,
        keyDeliverable: 'JSON-Patch pipeline + INTENT_ATOM router',
      },
      {
        id: 's19-listen',
        name: 'Listen Mode (Web Speech STT)',
        status: 'sealed',
        agentCount: 2,
        keyDeliverable: 'PTT mic + transcript-to-pipeline relay',
      },
    ],
    humanSpec: {
      northStar:
        'Make the product think. The user types or speaks; the system answers in valid spec patches. The provider matrix means no vendor lock; the chat pipeline means no manual JSON; listen mode means no keyboard barrier. Together, this is the intelligence layer that justifies "AI-native".',
      sadd:
        'Three bounded contexts: (1) LLM Provider — adapter interface with Claude / Gemini / OpenRouter implementations and BYOK key storage in localStorage; (2) Chat Pipeline — INTENT_ATOM classifier → routeClassifier → patch applicator; (3) Speech — Web Speech API wrapper with PTT lifecycle. Boundary: keys stay local; transcripts feed the same pipeline as typed input.',
      implementationPlan:
        'P17 ships the adapter matrix with a BYOK setup card. P18 wires INTENT_ATOM + routeClassifier and the patch applicator; ChatTab posts user input through the pipeline. P18b adds llm_logs observability. P19 wires Web Speech STT with a push-to-talk mic; transcripts route through the same chat pipeline as text. Tests: provider-matrix integration, JSON-Patch round-trip, transcript-to-patch end-to-end.',
    },
    aispSpec:
      'Σ := { provider: LLMAdapter, patch: JSONPatch[], transcript: STTResult }\n' +
      'Ω := { User input (text|voice) → LLM → valid JSONPatch[] → MasterConfig }\n' +
      'Γ := { R1: |providers| ≥ 3, R2: BYOK keys never leave localStorage, R3: patches validate against schema }\n' +
      'Λ := { sequential: classify → route → patch → apply; STT branch parallel to type branch }\n' +
      'Ε := { V1: VERIFY no key in network egress, V2: VERIFY patch shape, V3: VERIFY transcript routes }',
    adrRefs: [
      { id: 'ADR-026', title: '3-Tier Model Routing' },
      { id: 'ADR-018', title: 'Real Chat Mode' },
      { id: 'ADR-019', title: 'Listen Mode (Web Speech STT)' },
      { id: 'ADR-053', title: 'AISP INTENT_ATOM' },
    ],
  },
  {
    id: 'polish',
    phase: 20,
    name: 'Polish',
    status: 'sealed',
    sprints: [
      {
        id: 's20-mvp-close',
        name: 'Verify, Cost Caps, MVP Close',
        status: 'sealed',
        agentCount: 3,
        keyDeliverable: 'CostPill + AbortSignal cap + mvp-e2e suite',
      },
    ],
    humanSpec: {
      northStar:
        'Close the MVP. Make every cost visible (CostPill), make every long-running call cancellable (AbortSignal), and lock a regression suite (mvp-e2e) that proves the foundation + intelligence arcs hold. The user sees a number per call; the developer sees a green bar before every commit.',
      sadd:
        'Two boundary additions to existing contexts: (1) Chat Pipeline gains a CostPill adapter that aggregates token counts per turn; (2) LLM Provider adapters gain AbortSignal threading from UI to fetch. New artifact: tests/mvp-e2e.spec.ts as the seal-gate regression suite. No new bounded contexts — pure cross-cutting hardening.',
      implementationPlan:
        'P20 ships CostPill (UI badge + token aggregator), wires AbortSignal through every adapter, and authors the mvp-e2e regression suite that exercises the full chat + listen + persistence loop. Quality gate: 88/100 composite (Grandma 76 / Framer 87 / Capstone 91). Carry-forward: 18 fix-pass items rolled to P21 cleanup phase.',
    },
    aispSpec:
      'Σ := { cost: TokenCount, abort: AbortSignal, regression: E2ESpec[] }\n' +
      'Ω := { Make cost visible + every call cancellable + every seal regression-tested }\n' +
      'Γ := { R1: every LLM call surfaces token count, R2: every adapter accepts AbortSignal, R3: e2e ≥ 1 spec/concern }\n' +
      'Λ := { CostPill aggregates per turn; AbortSignal cancels on unmount; e2e runs pre-seal }\n' +
      'Ε := { V1: VERIFY token count > 0, V2: VERIFY abort → no leaked fetch, V3: VERIFY suite green }',
    adrRefs: [{ id: 'ADR-020', title: 'MVP Close (CostPill + AbortSignal)' }],
  },
] as const

/** Map ProcessMap node.id (e.g. 'p15') → PhaseCard.id ('foundation'). */
export const NODE_TO_PHASE_ID: Readonly<Record<string, string>> = {
  p15: 'foundation',
  p16: 'foundation',
  p17: 'intelligence',
  p18: 'intelligence',
  'p18-gate': 'intelligence',
  p19: 'intelligence',
  p20: 'polish',
}
