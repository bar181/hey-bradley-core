// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §1.1, §3.6
// Decision record: docs/adr/ADR-042-llm-provider-abstraction.md
// Canned fallback adapter — wraps cannedChat.parseChatCommand for parity with the
// pre-LLM chat experience. Phase 18 will wire the full envelope shape.

import { parseChatCommand } from '../../../lib/cannedChat';
import type {
  LLMAdapter,
  LLMProviderName,
  LLMRequest,
  LLMResponse,
} from './adapter';

const EMPTY_RESPONSE: LLMResponse = {
  ok: true,
  json: { patches: [] },
  tokens: { in: 0, out: 0 },
  cost_usd: 0,
};

export class SimulatedAdapter implements LLMAdapter {
  name(): LLMProviderName {
    return 'simulated';
  }

  label(): string {
    return 'Simulated (canned)';
  }

  model(): string {
    return 'simulated-v1';
  }

  async testConnection(): Promise<boolean> {
    return true;
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    // P20 C20: defensive abort check (canned response is synchronous but
    // the contract demands signal acknowledgement for uniformity).
    if (req.signal?.aborted) {
      return { ok: false, error: { kind: 'timeout' } };
    }
    // Phase 17 keeps the contract minimal: probe parseChatCommand for parity
    // with the pre-LLM chat path, then return an empty patch envelope so
    // callers can detect "no canned match" and fall back further. Phase 18
    // wires the real envelope shape to canned actions.
    void parseChatCommand(req.userPrompt);
    return EMPTY_RESPONSE;
  }
}
