// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 1 + Step 2.
// Decision record: docs/adr/ADR-044-json-patch-contract.md (to be authored Step 3)
// Strategy: agent-driven / hand-authored fixtures replace real LLM during dev/test

import type { LLMAdapter, LLMRequest, LLMResponse, LLMProviderName } from './adapter'

export type FixtureEnvelope = {
  patches: Array<{ op: 'add' | 'replace' | 'remove'; path: string; value?: unknown }>
  summary?: string
}

export interface FixtureEntry {
  // Match by exact userPrompt OR by regex on userPrompt.
  matchExact?: string
  matchPattern?: RegExp
  // Step 2: envelope can be a static object OR a function of the regex match
  // so fixtures can interpolate a captured headline back into the patch value.
  envelope: FixtureEnvelope | ((args: { match: RegExpExecArray }) => FixtureEnvelope)
  inTokens?: number
  outTokens?: number
}

export class FixtureAdapter implements LLMAdapter {
  private readonly fixtures: FixtureEntry[]

  constructor(fixtures: FixtureEntry[]) {
    this.fixtures = fixtures
  }

  name(): LLMProviderName {
    return 'simulated'
  }

  label(): string {
    return 'Fixture (no network)'
  }

  model(): string {
    return 'fixture-v1'
  }

  async testConnection(): Promise<boolean> {
    return true
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    let envelope: FixtureEnvelope | null = null
    let hit: FixtureEntry | null = null
    for (const f of this.fixtures) {
      if (f.matchExact !== undefined && f.matchExact === req.userPrompt) {
        hit = f
        envelope = typeof f.envelope === 'function'
          ? f.envelope({ match: [f.matchExact] as unknown as RegExpExecArray })
          : f.envelope
        break
      }
      if (f.matchPattern !== undefined) {
        const m = f.matchPattern.exec(req.userPrompt)
        if (m) {
          hit = f
          envelope = typeof f.envelope === 'function' ? f.envelope({ match: m }) : f.envelope
          break
        }
      }
    }
    if (!hit || !envelope) {
      return {
        ok: false,
        error: {
          kind: 'invalid_response',
          detail: `no fixture matched: "${req.userPrompt.slice(0, 80)}"`,
        },
      }
    }
    const inTokens = hit.inTokens ?? Math.ceil(req.userPrompt.length / 4)
    const outTokens = hit.outTokens ?? Math.ceil(JSON.stringify(envelope).length / 4)
    return { ok: true, json: envelope, tokens: { in: inTokens, out: outTokens }, cost_usd: 0 }
  }
}
