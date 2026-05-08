# Live LLM Testing Plan (post-RC)

**Status:** Planned (gated by owner BYOK provisioning)
**Phase:** post-P59 (post-RC test-library landing)
**ADR:** ADR-083 (corpus); plan does not require its own ADR until results land
**Owner:** Bradley Ross
**Not a defense gate.** Capstone defense passes on AgentProxy fixtures.

---

## Why this is post-RC

AgentProxy proves the **pipeline**: prompt parses → atom is well-shaped
→ patch applies → state updates → UI rerenders. That's mechanics, and
mechanics are deterministic.

Live LLMs prove **the LLMs**: does Anthropic Haiku 4.5 actually emit a
valid PATCH atom for "make the hero blue"? Does Gemini Flash hold
Σ-restriction? Does OpenRouter's free-tier Mistral hallucinate verb
strings outside the closed enum?

Different concerns. Don't conflate them. Conflating them was the
temptation that the moat-arc velocity check explicitly resisted —
shipping the moat through P58 required treating LLM-quality measurement
as a separate sprint, not a defense gate.

---

## Scope

**5 providers × 20 prompts × 3 runs each = 300 calls per execution.**

### Providers

| Tier | Provider                | Model              | Why                                         |
|------|-------------------------|--------------------|---------------------------------------------|
| 1    | Anthropic               | Haiku 4.5          | Tier-2 default; load-bearing for Sprint K   |
| 1    | Google                  | Gemini Flash       | Cost-floor; OpenRouter fallback comparison  |
| 1    | OpenAI                  | gpt-5-nano         | Industry baseline; capstone reviewer asks   |
| 1    | OpenRouter              | mistral-7b (free)  | Zero-cost smoke; demo-deck floor            |
| 0    | AgentProxy              | (deterministic)    | Control — the corpus's pipeline-only result |

### Top 20 prompts

Pulled from the four corpus files in `tests/prompts/` per ADR-083.
Selection rule: balance across atoms and difficulties.

- 5 PATCH (1 trivial / 2 easy / 2 medium)
- 4 INTENT (1 easy / 2 medium / 1 hard)
- 4 SELECTION (2 medium / 2 hard)
- 4 CONTENT (1 easy / 2 medium / 1 hard)
- 3 ASSUMPTIONS (3 hard — low-confidence is the point)

Selection is locked in `tests/prompts/live-top20.json` (built from
`prompt_id` references; no prompt text duplicated).

---

## Per-call assertions

For each `(provider, prompt, run)` tuple:

- Response parses as a valid Σ envelope for the expected atom (schema check from `tests/prompts/schema.json`).
- `verb` and `target` match the corpus-declared expected values.
- Latency `< 5000ms` (Sprint K badge floor).
- Cost `< $0.001` per call (corpus prompts are short by design).
- `redactKeyShapes` did not strip anything from the response (no leaked keys).

Failure of any assertion logs the call and continues. Assertions are
non-fatal at the per-call level; aggregate gates are the hard checks.

---

## Aggregate assertions

Per-provider success rate over 60 calls (20 prompts × 3 runs):

| Atom         | Floor | Rationale                                              |
|--------------|-------|--------------------------------------------------------|
| PATCH        | ≥90%  | Mechanics-heavy; verb/target are closed enums          |
| INTENT       | ≥70%  | Reasoning-heavy; verb mapping is the wobble            |
| SELECTION    | ≥70%  | Section-targeting needs ordinal disambiguation         |
| CONTENT      | ≥70%  | Tone-shaped; bounded by personality-engine routing     |
| ASSUMPTIONS  | ≥50%  | Low-confidence is expected; this is the tail           |

A provider falling below floor on PATCH is a release-blocking
regression. Below-floor on ASSUMPTIONS is an expected baseline; we
record it but don't gate on it.

---

## Cost ceiling

**$0.50 total per run ($0.10 per provider).**

Hard stop: if accumulated cost on any provider exceeds $0.10, stop
calls for that provider, mark remaining calls as `skipped-cost-cap`,
and continue with others. Total-run hard stop at $0.50.

Cost ceiling is enforced in the runner before each call (pre-flight
check against running total), not after. P20 CostPill semantics —
ADR-026 carry-forward.

---

## Output

`tests/results/live-llm-2026-MM-DD.json` — one file per execution.

Shape:

```json
{
  "run_id": "live-llm-2026-MM-DD-HHMM",
  "timestamp": "ISO-8601",
  "providers": ["anthropic", "google", "openai", "openrouter", "agentproxy"],
  "calls": [
    {
      "prompt_id": "by-atom/PATCH/0001",
      "provider": "anthropic",
      "run": 1,
      "latency_ms": 412,
      "cost_usd": 0.00021,
      "atom_valid": true,
      "verb_match": true,
      "target_match": true,
      "redaction_clean": true
    }
  ],
  "aggregates": {
    "anthropic": { "PATCH": 0.95, "INTENT": 0.80, ... }
  }
}
```

Results files are git-tracked (`tests/results/` is not gitignored).
Aggregates feed the README "live-tested" badge once two consecutive
runs hit floor.

---

## Owner-side prerequisites

Before any execution:

- BYOK keys for each Tier-1 provider (Anthropic, Google, OpenAI, OpenRouter)
- Cost cap pre-set to $1.00 in app settings (allows 2× headroom over the $0.50 plan)
- Demo project pre-loaded so the corpus prompts have a non-empty target state
- `tests/prompts/live-top20.json` reviewed + locked (changes invalidate prior runs)

---

## When this runs

Post-defense, post-RC tag, when owner has BYOK keys provisioned. **NOT
a defense gate.** The corpus + AgentProxy fixtures are sufficient for
the capstone presentation; the live matrix is a publish-time confidence
check that informs the README "live-tested" badge.

Cadence after first run: monthly during commercial-track ramp; weekly
once Tier-2 SaaS dashboard ships and providers are user-facing.
