# Phase 52 — Retrospective

## Keep

- Atomic per-wave commit cadence — even when 2 of 3 agents timed out, the
  one clean agent (A8) shipped end-to-end usable code without splitting
  the wave.
- `loadConversationLog` shape from A7's partial export landed clean and
  was directly usable by the manual-write ConversationLogTab.
- `redactKeyShapes` boundary discipline at every render + export boundary
  carried forward from P46/ADR-067 — applied without any thinking.
- ADR-075 cross-references chained correctly (ADR-040/067/073/074); no
  circular ADR refs.

## Drop

- Three-agent waves with 600-word prompts on a network-unstable day.
  Two of three timed out. Smaller prompts + more agents (or sequential
  fallback) would have been more resilient.
- Reliance on swarm to write tests + EOP artifacts — when the test agent
  times out, none of the test file lands. Future: split tests into a
  separate sequential follow-up wave so a partial timeout doesn't stall
  the seal.

## Reframe

- Agent prompts as **resilient contracts**, not orchestration. Each agent
  should be able to be re-dispatched from a clean slate if it failed,
  without needing context from a sibling agent's output.
- Manual-write fallback is a **feature**, not a workaround. Stream
  timeouts are a known Sprint J reality; document the pattern for Sprint K.
