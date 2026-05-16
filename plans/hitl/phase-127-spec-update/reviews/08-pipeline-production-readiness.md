# Reviewer 8 — Pipeline production readiness (engine)

**Composite: 87 / 100 — trustworthy for design partners, not yet GA.**

## Per-axis scores

- **Architecture correctness: 88.** Templates-as-data, AISP-first ordering, 2-step quality pass, deterministic preprocessing with 4KB cap, validation gates + 1 retry, and step-1 fallback are all sound. Hard fail per spec maps cleanly to UI badges. Loses points: only 1 retry, no per-step idempotency / resume, "STALE" path described in ADR is not implemented (script just writes FAIL).

- **Cost discipline: 95.** Actual run $0.043 / 3 sites (~$0.014/site) vs $0.05/site budget. 65× headroom held. `thinkingBudget:0` keeps Flash cheap; budget cap loop in `main()` is real. Minor: cap is checked only between sites, not between specs.

- **Verifiability: 92.** The 4-axis verifier (2 deterministic + 1 LLM repro + fact-completeness) is the strongest piece; third parties can re-run it on any AISP doc. `chat-history.jsonl` + `validation.json` + `cost.json` per site is excellent. Minor: only `userPromptHash` is stored, not the full prompt — true reproducibility requires the template version too.

- **Operability: 80.** Clear ISO-timestamped log, per-site `index.md`, top-level `run-summary.md`. Failures are traceable. Gaps: no template version/hash captured; no `--site` / `--spec` selective re-run flag; no rate-limit / retry-on-429 handling on the Gemini call; sequential per-site (parallel-by-site would halve wall-clock with no risk).

- **Code quality: 82.** One 419-line file is borderline (CLAUDE.md ≤500 ok); functions are small and pure. Issues: custom 32-bit string hash instead of `crypto.createHash('sha1')`; `readDotEnv` reinvents `dotenv`; `validateSpec`'s table-row counter does `length - 2` which goes negative on malformed tables; no unit tests on validators or `extractAispBlock`.

## Top issue before GA
Capture **template hash + git SHA + model+temperature** in every `chat-history.jsonl` entry and copy the resolved templates into `runs/<site>/templates-snapshot/`. Without that, a passing run today is not reproducible after a template edit tomorrow — fatal for paying customers chasing a regression.

## Architectural insight to preserve
**AISP-first ordering with formal Ω/Γ block extraction reused as input to downstream specs**. That's what kills the cross-spec drift problem; treat it as the load-bearing wall and never let a refactor collapse the sequence into a single big call.
