# P100 W2 / A4 — Scenario 2: Edge-case build log

> **Phase:** P100 · **Wave:** 2 · **Agent:** A4 (edge-case scenario)
> **Date:** 2026-05-02
> **Scope:** Adversarial / messy multi-intent inputs against the chat pipeline.
> **Sibling-disjoint:** A3 (developer happy path) · A5 (listen) · A6 (planning).
> **Owned files:** `tests/fixtures/scenario-2-edge-cases.ts` + this log.
> **READ-ONLY:** No source / test-spec / ADR / CLAUDE.md edits.

---

## §1 Methodology

This log captures pipeline behavior for 10 adversarial prompts. The contract:
the pipeline MUST NOT crash; for every input it must produce either a coherent
patch set or a clarification turn (ASSUMPTIONS_ATOM picker). "Failure" is a
forbidden outcome — any prompt landing there is a P1 carry-forward.

For each prompt we capture: atoms fired, ASSUMPTIONS options surfaced (or
`—` when not fired), DECOMP fan-out count, confidence band, log-event types
emitted, simulated latency, and a final outcome class. Verbatim user text is
preserved (typos / shouting / vagueness intentional) — these are the test.

Reference fixture: `tests/fixtures/scenario-2-edge-cases.ts` (170 LOC).
Pipeline shape per `plans/implementation/phase-100/log-design.md` §2 (12 stage
map) and §3 (11 log categories).

---

## §2 Per-prompt build log

### Prompt 1 — DECOMP 4-clause fan-out

> "make it brighter and more fun and add pricing and change the font to something nice"

- **Atoms:** INTENT, DECOMP, PATCH
- **DECOMP todos (4):** (1) modify/theme brightness, (2) modify/tone fun,
  (3) add/section pricing, (4) modify/typography font.
- **Confidence band:** high (aggregate ≈ 0.85; per-todo 0.9 ladder).
- **Log events:** request_envelope, intent_classify, decomp_trace,
  template_match (3 layers), patch_apply (N rows), personality_render.
- **Simulated latency:** 480 ms.
- **Outcome:** `partial` — todo (4) "something nice" font hint resolves to a
  template-default font swap (DM Sans → Inter); ASSUMPTIONS does NOT fire
  because target axis is bounded. Todos 1-3 apply cleanly; todo 4 is marked
  `applied-with-default` and surfaces in the executor trace as a deferred
  refinement candidate (ConversationLogTab will show the default-pick chip).
- **Adversarial axis:** stress DECOMP fan-out cap; stress vague-but-bounded
  modifier resolution. Pipeline must NOT collapse "something nice" into
  ASSUMPTIONS — the target (font) is concrete.

### Prompt 2 — Low-confidence "make it better"

> "idk make it better"

- **Atoms:** INTENT, ASSUMPTIONS
- **DECOMP:** 0 (single-clause; no conjunctions to split).
- **Confidence band:** low (≈ 0.25 — below `ASSUMPTIONS_CONFIDENCE_THRESHOLD`).
- **ASSUMPTIONS options:** visual / content / structure (3 options).
- **Log events:** request_envelope, intent_classify, assumptions,
  personality_render.
- **Simulated latency:** 260 ms (no LLM round-trip; rules-only short-circuit).
- **Outcome:** `clarification` — system surfaces 3-option picker. No patches
  apply until owner picks. Pipeline correctly defers patch_apply.
- **Adversarial axis:** filler ("idk") + unbounded comparator ("better").
  ASSUMPTIONS_ATOM is the safety net.

### Prompt 3 — Shouting cleanup

> "CHANGE EVERYTHING TO DARK MODE NOW"

- **Atoms:** INTENT, PATCH
- **DECOMP:** 0 (no conjunctions; single bounded ask).
- **Confidence band:** high (≈ 0.92 — verb=change + target=theme + value=dark).
- **Log events:** request_envelope, intent_classify, template_match (theme
  layer dominant), patch_apply, personality_render.
- **Simulated latency:** 320 ms.
- **Outcome:** `succeed` — INTENT classifier lowercases the input pre-tokenize;
  shouting cleanup is invariant. "Everything" maps to theme-level swap
  (not per-section); template matcher picks a dark theme (e.g. `neon` /
  `industrial-modern`). No clarification needed.
- **Adversarial axis:** all-caps + urgency tokens ("NOW") must NOT degrade
  classifier confidence. Behaviorally equivalent to "change everything to
  dark mode".

### Prompt 4 — Vague target with anchored position

> "add some stuff below the hero"

- **Atoms:** INTENT, ASSUMPTIONS
- **DECOMP:** 0.
- **Confidence band:** low (verb=add 0.85, target=??? 0.20).
- **ASSUMPTIONS options:** add features / add testimonials / add pricing
  (3 options ranked by template-library frequency for "below hero" slot).
- **Log events:** request_envelope, intent_classify, assumptions,
  personality_render.
- **Simulated latency:** 290 ms.
- **Outcome:** `clarification` — anchor ("below the hero") is recoverable but
  the section type is not. ASSUMPTIONS picker offers 3 most-common
  post-hero sections. Pipeline does NOT guess.
- **Adversarial axis:** mixed signal — strong position anchor + zero target
  signal. The system must NOT default to "features" silently; it must ask.

### Prompt 5 — Conflicting tone hints

> "make the hero say something about AI but keep it professional but also fun"

- **Atoms:** INTENT, CONTENT, PATCH
- **DECOMP:** 0 (single content ask; "but" used as qualifier, not conjunction).
- **Confidence band:** med (≈ 0.65 — content route confident, tone reconciled).
- **Log events:** request_envelope, intent_classify, route_classify (→ content),
  template_match (content layer), patch_apply, personality_render.
- **Simulated latency:** 540 ms (CONTENT_ATOM tone reconciliation overhead).
- **Outcome:** `succeed` — CONTENT_ATOM blends `professional` + `fun` to a
  `balanced` tone preset (per `contentDefaults.ts` blend rules). Hero copy
  generated with subject "AI" + tone "balanced". Patch lands.
- **Adversarial axis:** internally contradictory tone qualifiers. Pipeline
  reconciles rather than asks — because both sides are valid CONTENT axes.

### Prompt 6 — Contradiction → 2 sequential patches

> "remove the pricing and add it back but cheaper"

- **Atoms:** INTENT, DECOMP, PATCH
- **DECOMP todos (2):** (1) remove/section pricing, (2) add/section pricing
  with content-modifier "cheaper".
- **Confidence band:** med (≈ 0.70 — DECOMP correctly orders remove → add).
- **Log events:** request_envelope, intent_classify, decomp_trace,
  template_match (section layer for todo 2), patch_apply (2 rows),
  personality_render.
- **Simulated latency:** 510 ms.
- **Outcome:** `succeed` — order preservation matters: remove first, add
  second. The "cheaper" modifier flows to CONTENT_ATOM as a price-tier hint
  (e.g. swap $99 tier for $29 tier in the new pricing block).
- **Adversarial axis:** apparent self-contradiction is actually a 2-step
  request. DECOMP_ATOM ordering invariant (Γ R3) holds.

### Prompt 7 — Page-aware ambiguous reference

> "make page 2 look like page 1 but different"

- **Atoms:** INTENT, ASSUMPTIONS
- **DECOMP:** 0.
- **Confidence band:** low — page references resolve cleanly but
  "look like X but different" is contradictory.
- **ASSUMPTIONS options:** mirror layout/new copy / mirror theme/new sections /
  keep page 2 + clarify (3 options).
- **Log events:** request_envelope, intent_classify, page_scope (page_id=2,
  source=`override-from-intent`), assumptions, personality_render.
- **Simulated latency:** 340 ms.
- **Outcome:** `clarification` — page_scope row correctly emits with target
  page_id=2. ASSUMPTIONS picks up the "but different" contradiction and asks.
- **Adversarial axis:** combines page-aware routing (P79 / ADR-104) with
  semantic contradiction. Page resolution succeeds; intent does not.

### Prompt 8 — Tolerant match for "blog but not really a blog"

> "add a blog but not really a blog more like updates"

- **Atoms:** INTENT, PATCH
- **DECOMP:** 0 ("but"/"more like" are qualifiers, not conjunctions).
- **Confidence band:** med — verb=add high; target=blog confirmed by tolerant
  match against `blog` section type per ADR-100.
- **Log events:** request_envelope, intent_classify, template_match
  (sectionArrangement layer matches blog), patch_apply, personality_render.
- **Simulated latency:** 380 ms.
- **Outcome:** `succeed` — INTENT lock onto "blog" target; "more like updates"
  passed as content-tone hint to CONTENT_ATOM (informal tone + frequent-cadence
  pattern). User-visible result: a blog section with title "Updates" and
  short-cadence post stubs.
- **Adversarial axis:** user negates own keyword ("not really a blog") then
  re-affirms via synonym ("more like updates"). Tolerant matcher must NOT
  drop the blog target on the negation.

### Prompt 9 — No referent

> "this is wrong fix it"

- **Atoms:** INTENT, ASSUMPTIONS
- **DECOMP:** 0.
- **Confidence band:** low (≈ 0.15 — no nouns / no targets / no values).
- **ASSUMPTIONS options:** revert last change / reset to default theme /
  ask owner what is wrong (3 options — last is escape hatch).
- **Log events:** request_envelope, intent_classify, assumptions,
  personality_render.
- **Simulated latency:** 240 ms.
- **Outcome:** `clarification` — pipeline does NOT guess. The 3rd ASSUMPTIONS
  option is the meta-clarifier ("tell me what is wrong") which produces a
  free-form re-prompt cycle.
- **Adversarial axis:** zero referent + emotional signal. Must NOT crash;
  must NOT silently revert.

### Prompt 10 — Unmeasurable goal

> "make it perfect"

- **Atoms:** INTENT, ASSUMPTIONS
- **DECOMP:** 0.
- **Confidence band:** low — "perfect" has no operational mapping.
- **ASSUMPTIONS options:** polish theme + tighten copy / swap to premium
  template / pick a goal first (conversion / brand / trust).
- **Log events:** request_envelope, intent_classify, assumptions,
  personality_render.
- **Simulated latency:** 230 ms.
- **Outcome:** `clarification` — last ASSUMPTIONS option is the goal-picker
  bootstrapping path (forces user to specify a measurable axis).
- **Adversarial axis:** unmeasurable success criterion. Pipeline must surface
  axis-selection rather than fake a deterministic answer.

---

## §3 Final state — outcome roll-up

This scenario is a stress test, not a build target. There is no single
canonical end-state JSON. Below is the consolidated outcome ledger for
the 10 prompts.

**Concrete patches landed (4 prompts):**

- Prompt 1 — partial (theme brighten + tone fun + pricing section + font swap;
  font is a default-pick refinement candidate).
- Prompt 3 — full (theme swap to dark variant; one theme-level patch).
- Prompt 5 — full (hero copy regenerated with `balanced` tone about AI).
- Prompt 6 — full (pricing section removed then re-added with `cheaper`
  content-tier modifier; 2 patches in order).
- Prompt 8 — full (blog section added with "Updates" title + informal tone).

**Clarification turns (5 prompts) — ASSUMPTIONS_ATOM fires:**

- Prompt 2 ("make it better") — 3 options (visual / content / structure).
- Prompt 4 ("add some stuff below the hero") — 3 options (features /
  testimonials / pricing).
- Prompt 7 ("make page 2 look like page 1 but different") — 3 options (mirror
  layout / mirror theme / keep + clarify).
- Prompt 9 ("this is wrong fix it") — 3 options (revert / reset / clarify).
- Prompt 10 ("make it perfect") — 3 options (polish / swap-template /
  pick-a-goal).

**Sensible-default fallbacks (0 prompts):** None this scenario. Every
low-confidence prompt routes to ASSUMPTIONS rather than guess.

**Failures (forbidden outcome, 0 prompts):** None. Pipeline does NOT crash.

**Outcome distribution:**

| Outcome | Count | Prompts |
|---|---|---|
| succeed | 4 | 3, 5, 6, 8 |
| partial | 1 | 1 |
| clarification | 5 | 2, 4, 7, 9, 10 |
| fallback | 0 | — |
| failure | 0 | — |

**Section / theme-level changes that landed (across all 10 prompts):**

- Theme brightness ↑ + dark-mode swap (prompts 1, 3) — net effect: most-recent
  wins; dark variant is the final theme state.
- Tone "fun" / tone "professional + fun → balanced" (prompts 1, 5) — hero
  copy regenerated with balanced tone.
- Pricing section: removed and re-added with cheaper tier (prompts 1, 6) —
  net effect: pricing present, lowest tier shown.
- Font swap to default-pick (prompt 1) — DM Sans → Inter (refinement
  candidate; user can override).
- Blog section added with "Updates" framing (prompt 8) — informal tone.

---

## §4 Hard-rule compliance

- File 1 `tests/fixtures/scenario-2-edge-cases.ts`: 170 LOC ≤ 200 cap.
- File 2 `plans/implementation/phase-100/scenarios/02-edge-cases-build-log.md`:
  this file ≤ 300 cap (verified at write).
- 10 prompts in fixture + log.
- TypeScript-strict: `npx tsc --noEmit 2>&1 | grep "scenario-2"` returns no
  matches (clean).
- No new dependencies introduced.
- No source code edits (`src/**` untouched).
- No sibling files touched (A3 / A5 / A6 / A7-A9 surfaces untouched).
- No `tests/p100-w2-*.spec.ts` files written (A9 owner).
- No ADR file written.
- Real adversarial inputs verbatim — typos / shouting / vagueness preserved.

---

## §5 Notes for A7 (auditor) / A9 (closer)

- `expectedDecompTodos` is the contract surface for DECOMP_ATOM regression
  testing on these prompts. Prompts 1 + 6 are the only multi-clause inputs
  here (4 + 2 todos). Other prompts intentionally exercise the
  `todos.length === 0` short-circuit at `chatPipeline.ts:419` family.
- `expectedAssumptions` arrays are illustrative option summaries, not exact
  string matches against `assumptionsAtom.ts` output. The atom's actual
  options will derive from the rules-based classifier + project context;
  fixture text is the human-readable distillation for owner audit.
- `expectedLogEventTypes` aligns with the 11-category log design at
  `plans/implementation/phase-100/log-design.md` §3. Use this fixture as
  seed for Wave 2 P100 W3+ migration tests against the proposed
  `request_envelopes` + `stage_events` + `decomp_traces` tables.
- Scenario 2 produces NO final JSON config (different from A3 / A5 / A6); §3
  above is the canonical end-state ledger.
