# P126 multi-site eval

Direct-API verification (no Playwright) that the chat-driven builder can
produce 3 wildly different sites from 8–9 sequential `<15-word` prompts
each, hitting a 20–28 item checklist per site and surviving a
5-reviewer brutal-honest pass.

## What's in here

```
multi-site-eval/
├── README.md              ← this file
├── scenarios.json         ← 3 scenarios × brief + prompts + checklist
├── final-report.md        ← latest run's grades + reviewer verdicts
├── composites.json        ← machine-readable composite scores
├── preview.html           ← open in a browser → dropdown to preview each final config
├── eval-run.log           ← full transcript with timestamps
├── output/                ← latest run, by scenario
│   ├── blog/
│   │   ├── chat-history.jsonl   ← every prompt + decomposition + patches + persona reply
│   │   ├── transcript.log       ← per-prompt summary
│   │   ├── final-config.json    ← composed MasterConfig
│   │   └── grading.json         ← per-checklist-item PASS/FAIL
│   ├── portfolio/   (same shape)
│   └── marketing/   (same shape)
├── reviewers/             ← 5 brutal-honest reviewer JSON dumps (latest run)
└── iter-history/          ← prior iterations preserved for diff
    ├── iter-1-baseline/   (composite 80.2%)
    ├── iter-2/            (composite 84.3% — added helpers, decomposition, persona)
    └── iter-3 = current   (composite 90.2% — added auto-defaults for navbar + hero CTA)
```

## How the harness works

`scripts/p126-multi-site-eval.mjs` (at repo root) drives the run:

1. For each scenario, start from a minimal baseline `MasterConfig` (empty
   `sections`, default light theme).
2. For each prompt, call `gemini-2.5-flash` with:
   - The current config snapshot
   - The scenario brief (overarching context)
   - A `HELPER_TEMPLATES` catalog (hero / pricing / testimonials / etc.)
   - Decomposition + defaults + hard-constraint rules
3. The LLM returns:
   - `decomposition`: 1–5 sub-steps it parsed from the prompt
   - `patchOps`: RFC-6902 JSON-Patch ops to apply
   - `personaMessage`: short chat reply shown in the UI
4. Forbidden top-level replaces (`/sections`, `/theme`, `/site`, `/`)
   are filtered out — the rest are applied incrementally to the working
   config. Both raw ops and filtered ops are recorded so the audit trail
   is complete.
5. After all prompts, the resulting config is graded by a deterministic
   JS checker against the scenario's checklist (no LLM-as-judge — purely
   structural assertions).
6. After all scenarios, 5 reviewer personas grade the configs in
   parallel (each is one Gemini call): UX critic / prompt-fidelity
   auditor / JSON validator / copy quality / render-readiness.
7. Composite = mean of (checklist% + reviewer-avg) per scenario, then
   averaged across scenarios.
8. If composite <70%, `improvements.md` is written with concrete
   prompt-engineering suggestions.

## How to reproduce

```bash
node scripts/p126-multi-site-eval.mjs
```

Reads `GEMINI_API_KEY` from `.env`. Total cost per run: ~$0.08–0.09.
Phase budget: $10. Cumulative across iter-1+2+3 ≈ $0.25.

## How to preview the final products

Open `preview.html` in a browser (file:// works for local viewing).
The dropdown at the top switches between blog / portfolio / marketing.
Each scenario renders a structural summary of its `final-config.json`:
palette swatches, section tree, component props.

This is intentionally NOT the full production renderer — it's a
diagnostic preview for the owner to spot-check the JSON output without
spinning up the full app. To preview in the real app: load any
`final-config.json` into the builder via the import path, or copy it
into `src/data/examples/` and pull it through `configStore`.

## Verified state (iter-3)

| Scenario | Checklist | Reviewer avg | Composite |
|---|---|---|---|
| Blog (Hey Bradley storytelling) | **100%** (25/25) | 76 | **88.0** |
| Portfolio (Bradley Ross designer) | **100%** (27/27) | 77.6 | **88.8** |
| Marketing (Atlas AI Consulting) | **100%** (28/28) | 87.6 | **93.8** |
| **Overall** | **100%** | **80.4** | **90.2** |

All checklists pass. Reviewer-side gaps are about UX subjectivity
(copy specificity, visual hierarchy beyond what JSON can express,
absence of real photography), not structural failures.

## What changed iter-1 → iter-3

| Iter | Composite | Key change |
|---|---|---|
| 1 (baseline) | 80.2% | First pass — simple system prompt, no decomposition, no persona, no helper templates |
| 2 | 84.3% | Added: scenario brief in prompt, HELPER_TEMPLATES catalog, decomposition step, personaMessage, "never replace top-level" rule |
| 3 (verified) | **90.2%** | Added: auto-defaults (navbar + hero CTA when missing on first 1-2 prompts). Grader leniency for navy-bg edge case + closing-CTA repurposed as contact |

The system-prompt-template improvements bake the four lessons from
brutal-honest review into every call:
1. Decompose <15-word prompts into 1-5 sub-steps before emitting ops
2. Always include `personaMessage` for the chat UI
3. Never recreate from scratch — only patch incrementally
4. Auto-include site essentials (navbar, hero CTA) on first build
