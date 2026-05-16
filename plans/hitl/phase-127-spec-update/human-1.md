```
SWARM: Seal P126 → promote → then P127 spec pipeline

════════════════════════════════════════════════════════
STEP 1 — SEAL P126
════════════════════════════════════════════════════════
Complete plans/hitl/phase-126-go-live/retrospective.md
  Honest composite score (include multi-site eval 90.2%)
  All features: F1-F6 status
  Carry-forwards: CF-P127-f6-ui-spot-check,
    chat mode execution fix, ARCH.2 legacy sweep
  Cost: $0.25 multi-site + $0.001472 F6 E2E
Commit: "docs: seal P126 retrospective — 90.2% composite"
Push swarm/p126-go-live → confirm CI green
Merge PR to main → confirm production 200

════════════════════════════════════════════════════════
STEP 2 — CUT P127 BRANCH
════════════════════════════════════════════════════════
git checkout main && git pull origin main
git checkout -b swarm/p127-spec-updater
Scaffold:
  plans/hitl/phase-127-spec-update/preflight.md
  plans/hitl/phase-127-spec-update/session-log.md
  plans/hitl/phase-127-spec-update/retrospective.md
  plans/hitl/phase-127-spec-update/templates/ (7 files)
  scripts/p127-spec-updater.mjs
  runs/blog/ runs/portfolio/ runs/marketing/

════════════════════════════════════════════════════════
STEP 3 — F1: ADR-156
════════════════════════════════════════════════════════
Write docs/adr/ADR-156-spec-update-pipeline.md
  7-spec order (AISP first), AISP two-step,
  CSS/content split, 4KB summary cap,
  chunking strategy, $10 budget, validation gates,
  UI deferral rationale.

════════════════════════════════════════════════════════
STEP 4 — F2: PROMPT TEMPLATES (7 + 1 quality)
════════════════════════════════════════════════════════
One JSON file per spec in plans/hitl/phase-127-spec-update/templates/:
  aisp-emit.json, aisp-quality.json, north-star.json,
  features.json, architecture.json, css.json,
  build-plan.json, human-spec.json

Each template must contain:
  systemPrompt, exampleOutput, validation,
  allowedSections (enumerated — LLM adds NOTHING else),
  chunkStrategy (single|priority-chunked)

AISP template rules:
  Math-first · ⟦Ω⟧⟦Σ⟧⟦Γ⟧⟦Λ⟧⟦Ε⟧ blocks required
  Target Σ_512 symbol set · Ambig(D) < 0.02
  Prose ONLY for exact phrases or comments
  Reference plans/initial-plans/00.aisp-reference.md

CSS template: JSON shape only —
  palette, typography, spacing keys, no prose

Human Spec template: ≤300 words, no AISP symbols

════════════════════════════════════════════════════════
STEP 5 — F4: DETERMINISTIC PARSERS
════════════════════════════════════════════════════════
scripts/parsers.mjs — extract without LLM:
  site title, brand strings, section types+counts,
  palette hex, typography, component type summary
Output: structural summary capped at 4KB
  (drop component props text, keep types+counts+brand)
Unit test against all 3 P126 fixtures.

════════════════════════════════════════════════════════
STEP 6 — F3+F5: PIPELINE + VALIDATION
════════════════════════════════════════════════════════
scripts/p127-spec-updater.mjs:
  1. Parse MasterConfig via parsers.mjs
  2. Run 7 specs in order, each gated by prior output
  3. AISP: call aisp-emit → validate → call aisp-quality
  4. Each LLM call: record timestamp, tokens, cost, ms
  5. Save chat-history.jsonl per site (JSONL, one entry
     per call with sequence+timestamp+wallClockMs+cost)
  6. Validate each output before proceeding:
     AISP: 5 ⟦⟧ headers + ≜ + ≥1 ∀ — FAIL if missing
     North Star: 3 required lines ≤30 lines
     Features: 5-15 items with priority
     Architecture: bounded contexts + data flow + ≥3
     CSS: valid JSON with palette+typography+spacing
     Build Plan: table ≥3 phases with phase/scope/DoD
     Human Spec: ≤300 words, no ⟦⟧ symbols
  7. On validation FAIL: retry once, then mark FAIL+log

════════════════════════════════════════════════════════
STEP 7 — F6+F7: RUN ON 3 P126 EXAMPLES
════════════════════════════════════════════════════════
Input for each site:
  plans/hitl/phase-126-go-live/multi-site-eval/
    iter-history/iter-3-verified/output/{site}/
    final-config.json

Run full pipeline for blog, portfolio, marketing.
Save per site in runs/{site}/:
  specs/aisp.md, north-star.md, features.md,
  architecture.md, css.md, build-plan.md,
  human-spec.md
  chat-history.jsonl (all calls, with timing)
  timing.json (per-spec ms)
  cost.json (per-spec + total)
  validation.json (PASS/FAIL per spec)
  index.md (summary table: spec | status | cost | ms)

Budget: ≤$10 total. Expected ≈$0.15.

════════════════════════════════════════════════════════
COMPLETION GATES
════════════════════════════════════════════════════════
[ ] P126 sealed and merged to main, production 200
[ ] ADR-156 committed
[ ] 8 prompt templates authored and validated
[ ] parsers.mjs unit tests pass on 3 fixtures
[ ] p127-spec-updater.mjs runs without error
[ ] All 21 specs (7×3) PASS validation
[ ] All 3 index.md reports written
[ ] chat-history.jsonl includes clock time per call
[ ] Total cost ≤ $10
[ ] Build stays green (no production code touched)
[ ] session-log.md updated, retrospective.md scaffolded

Report after Step 1 (P126 sealed), then after Step 7
(all 3 sites complete). Surface any validation FAIL
immediately — do not skip or relax.
```
```
SWARM: P127 Process Instructions
════════════════════════════════════════════════════════

MINDSET
You are building a backend pipeline, not a UI.
No production code is touched this phase.
Script-only. Every decision gets an ADR or a comment.
If confidence is low on any template design decision,
log the assumption in session-log.md and proceed.
Surface failures immediately. Never silently relax
a validation gate or skip a required block.

════════════════════════════════════════════════════════
PROCESS: understand → research → plan → ADR →
  decompose → implement → verify → optimize
════════════════════════════════════════════════════════

PHASE 0 — UNDERSTAND BEFORE WRITING ANYTHING
  Read the full preflight document.
  Read plans/initial-plans/00.aisp-reference.md in full.
  Understand the AISP five-block structure before
  authoring any template. The AISP template is the
  foundation every other template depends on.
  Read the 3 P126 final-config.json files to
  understand what MasterConfig actually looks like.
  Do not begin F2 until you have read all three.

PHASE 1 — RESEARCH (parallel)
  Agent A: Study AISP reference. Map required symbols,
    block headers, prose rules, Ambig(D) guarantee.
    Produce a one-page summary of what a valid AISP
    spec must contain. This feeds template authoring.
  Agent B: Study all 3 P126 MasterConfig files.
    Identify every field the deterministic parser
    must extract. List them explicitly. This feeds
    parsers.mjs design.
  Agent C: Study the P126 multi-site eval chat-history
    files. Understand what the LLM was asked and what
    it returned. Identify what went well and what
    produced low-quality output. This feeds prompt
    template design.
  All agents write findings to session-log.md before
  any implementation begins.

PHASE 2 — PLAN AND ADR
  Write ADR-156 based on research findings.
  ADR must answer: why this spec order, why AISP
  two-step, why CSS and content are separate calls,
  why deterministic parsing before LLM, why 4KB cap,
  why template-driven with limited allowed sections.
  Get the ADR committed before writing any template.
  The ADR is the contract. Templates implement it.

PHASE 3 — DECOMPOSE
  Break F2 into 8 subtasks (one per template).
  Break F4 into one subtask per MasterConfig field
  category (brand, sections, palette, typography).
  Break F3 into the pipeline stages (not one big task).
  Break F5 into one validator per spec type.
  Assign one agent per subtask where possible.
  Write the decomposition to session-log.md.

PHASE 4 — TEMPLATE AUTHORING RULES
  Each template is a self-contained contract.
  The system prompt must tell the LLM exactly what
  format to return and what it is forbidden to add.
  The allowedSections list is exhaustive — if a key
  is not in the list, the LLM must not return it.
  The exampleOutput must be realistic, not trivial.
  Every template must have a validation field that
  describes exactly what regex or structural check
  will be run on the output.
  Author AISP template first. Review it against the
  AISP reference before moving to any other template.
  CSS template: JSON shape only, no prose in output.
  Human Spec template: enforce ≤300 words explicitly
  in the system prompt and in the validation field.

PHASE 5 — PARSER DESIGN RULES
  Parsers are deterministic. No LLM involved.
  One function per field category.
  If a field is missing from MasterConfig, return
  a safe default and log the gap — do not throw.
  The 4KB cap is a hard constraint. If the summary
  exceeds 4KB, drop component-level props text first,
  then drop style objects, then drop layout details.
  Always preserve: site title, brand strings, section
  types, section counts, palette hex, typography keys.
  Write unit tests against all 3 P126 fixtures before
  the pipeline calls any parser in production.

PHASE 6 — PIPELINE ORDERING RULES
  AISP runs first, always.
  Each subsequent spec receives the prior spec's
  output as additional context, compressed.
  Never send raw long-form content to the LLM.
  If MasterConfig contains blog post body text,
  strip it. Send section type and word count only.
  Each LLM call must have a template loaded before
  the call is made. No ad-hoc prompts.
  If a validation gate fails, retry once with the
  same template and a correction note appended.
  If retry fails, mark the spec FAIL in
  validation.json, log the error, and continue
  to the next spec. Do not halt the pipeline.

PHASE 7 — LOGGING RULES
  Every LLM call gets one entry in chat-history.jsonl.
  Required fields per entry: sequence, timestamp (ISO),
  spec name, wallClockMs, tokensIn, tokensOut, costUsd,
  promptSummary (not the full prompt — 100 chars max),
  validationResult (PASS/FAIL), retried (bool).
  Log to session-log.md after each spec completes.
  Do not batch log at the end.

PHASE 8 — VERIFY BEFORE OPTIMIZE
  Run the full pipeline against blog first.
  Review all 7 outputs before running portfolio.
  Fix any template or parser issues found in blog
  before running the remaining two sites.
  Optimization (reducing token count, improving
  prompt quality) happens after all 3 runs complete
  and all gates pass.

PHASE 9 — RETROSPECTIVE
  Complete retrospective.md at seal with:
    Honest assessment of each template quality
    Any validation FAIL events and root cause
    Cost actual vs estimate
    What to improve for the UI phase (P128)
    Carry-forwards explicitly listed

════════════════════════════════════════════════════════
ESCALATION RULES
  Escalate to owner if:
    AISP validation fails after retry on all 3 sites
    Total cost exceeds $5 (half budget, early warning)
    Any parser produces wrong output on a fixture
    A template produces non-parseable output twice
  Do not escalate for single retries that succeed.
  Do not escalate for minor prompt tuning decisions.
  Document all escalation candidates in session-log.md
  even if you resolve them without escalating.
════════════════════════════════════════════════════════
```

No. The process instructions cover the pipeline build and the run command but do not explicitly instruct the swarm to save the output artifacts for each of the three sites. Add this block:

```
════════════════════════════════════════════════════════
PHASE 10 — RUN AND SAVE ALL 3 SITE SPEC BUNDLES
════════════════════════════════════════════════════════

After all gates pass on the pipeline, run the full
spec update process for all 3 P126 example sites.

INPUT for each site:
  plans/hitl/phase-126-go-live/multi-site-eval/
  iter-history/iter-3-verified/output/{site}/
  final-config.json

  Sites: blog · portfolio · marketing

RUN ORDER: blog first, review outputs, fix any
  template issues, then portfolio, then marketing.
  Do not run all three in parallel — blog is the
  validation pass for the pipeline.

SAVE the following files for each site under
  runs/{site}/

  specs/aisp.md
  specs/north-star.md
  specs/features.md
  specs/architecture.md
  specs/css.md
  specs/build-plan.md
  specs/human-spec.md

  chat-history.jsonl
    One line per LLM call, JSONL format.
    Required fields: sequence, timestamp (ISO 8601),
    spec_name, wallClockMs, tokensIn, tokensOut,
    costUsd, validationResult, retried.

  timing.json
    Per-spec wall clock ms.

  cost.json
    Per-spec costUsd + pipeline total.

  validation.json
    Per-spec PASS or FAIL with reason on FAIL.

  index.md
    Summary table: spec | status | costUsd | ms
    Plus total cost and total wall clock for the site.

CONFIRM after each site:
  All 7 specs saved as .md files — readable prose
  or valid AISP notation as appropriate.
  validation.json shows PASS for all 7 specs.
  chat-history.jsonl has one entry per LLM call
  with clock time present on every row.
  index.md renders correctly as markdown.

Do not seal P127 until all 3 sites have complete
artifact trees and all validation.json files show
PASS on all 7 specs.

Report the index.md content for each site when done.
════════════════════════════════════════════════════════
```

This closes the gap. The swarm now has explicit instructions to run the pipeline, save every artifact per site, confirm validation, and report the index before sealing.
