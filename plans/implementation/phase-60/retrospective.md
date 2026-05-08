# Phase 60 — Retrospective

## Keep

- **Per-concern Playwright spec split.** One file per concern,
  sub-30s each, one bash invocation per spec. Bounds blast-radius and
  survives the upstream stream-idle pattern that killed prior waves.
- **Mechanical-data Python generators.** `scripts/p60-gen-data.py`
  produced the personality + LLM-matrix corpus deterministically and
  idempotently. Re-running is byte-stable. No agent loop required.
- **Pure-write agent pattern for closing passes.** Read + Edit +
  Write only on ADR / session-log / retrospective / CLAUDE.md agents.
  Zero timeout exposure on seal-pass artifacts.

## Drop

- **Any agent dispatch that runs `npx playwright test` mid-prompt.**
  The timeout pattern is now proven across P59 A1 (twice) and the
  P60 step 1 first attempt. Long shell commands inside an agent loop
  trigger upstream stream-idle. Banned on closing passes; on
  generative passes, only allowed when sized below the idle window.

## Reframe

- **"Agent loops with long shell commands" is the upstream
  stream-idle root cause.** Not a flaky tooling issue; not a model
  issue. Acknowledged here, codified in ADR-084, and now the
  selection criterion for whether a step ships via agent at all.
