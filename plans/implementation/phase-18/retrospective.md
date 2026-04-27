# Phase 18 Retrospective

## Phase 18 — MVP Track CLOSED 2026-04-27

**Branch:** `claude/verify-flywheel-init-qlIBr`
**Final commit:** `15dc4d4`
**P17 baseline:** `8377ab7`

### Outcome

Phase 18 (Real Chat Mode — LLM → JSON Patches) closed with **20/20 DoD items
PASS** under the BLOCKING confirmation walk run on 2026-04-27.

The chat input now drives a full LLM pipeline (system prompt assembled with
the AISP Crystal Atom + path whitelist + compact 4 KB JSON + output rule;
adapter call routed through `auditedComplete`; tolerant response parser;
hardened patch validator with prototype-pollution + XSS + image-URL
allow-lists; atomic `applyPatches` via `structuredClone`; centralised
`inFlight` mutex). All 5 starter prompts resolve through the
`FixtureAdapter` in DEV — no real LLM is constructed in any DEV/test
path.

### Step 4 (live LLM smoke) deferred to human-triggered post-DoD task per the no-real-LLM mandate.

The two SDK adapters (`claudeAdapter.ts`, `geminiAdapter.ts`) ship in the
build (lazy-imported via `pickAdapter.ts`) but are not instantiated by the
DEV runtime. The first live round-trip with a personal Anthropic/Gemini key
is intentionally OUT of the P18 seal so that no production code path was
exercised against a real provider before merge — this matches P17's "BYOK
scaffold without live verification" pattern and keeps the MVP track
deterministic.

### What went well

- **Three commits, full DoD.** Step 2 wired the chat input, Step 3 added
  starters #2-#5 + add/remove + multi-patch + safety + ADRs, Fix-Pass
  closed all 4 reviewer must-fix items in one batch (13 named fixes).
- **Bundle discipline held.** Main JS gzip moved from 590.24 → 596.48 kB
  (+6.24 kB / +1.0%), well under the 800 kB cap. Both SDK adapters stay
  lazy-loaded.
- **Zero `any`, zero ungated `console`.** The Step-3 verifier flagged a
  single `let target: any = nextConfig` in `applyPatches.ts`; A6 cleaned
  it. Both `console.warn` lines added in P18 are `import.meta.env.DEV`-
  gated.
- **Safety regressions land before they're needed.** Prototype-pollution
  (`__proto__` own-key from `JSON.parse`), XSS regex on nested string
  leaves, and the image-URL allow-list (https + ext + named CDN /
  media-library host) all have golden Playwright coverage. The
  `Object.prototype.polluted === undefined` assertion runs in a real
  browser.
- **Fixture-only DEV.** A single grep proves no `new ClaudeAdapter` or
  `new GeminiAdapter` outside `pickAdapter.ts`. The "still no real LLM"
  promise from Step 2 held through Step 3 + Fix-Pass.

### What we'd do differently

- **Test-copy drift caught late.** The Step-3 verifier surfaced two
  failing `p18-step2-chat.spec.ts` assertions because the canned-fallback
  copy was reworded ("Hmm, I didn't catch that. Try one of: …") without a
  matching test update. Fixing the regex in the same commit as the copy
  change would have saved a fix-pass cycle.
- **Path-whitelist scope.** `EDITABLE_SECTION_TYPES` initially listed
  `theme` (not a section type). FIX 7 narrowed it to `['hero','blog','footer']`.
  Worth a sanity grep for "type ∈ SectionType" assertions next phase.
- **Image-URL allow-list path.** The spec said `mediaLibrary.json`; the
  actual catalog lives at `media/media.json`. The runtime falls back
  cleanly via the named-CDN list, but the cache-on-first-call code paths
  through both candidate paths — a small comment in ADR-044 §5 would
  prevent confusion in P19+.

### Files added / changed (P18 range)

**New schemas / pipeline:**
- `src/lib/schemas/patches.ts` (Zod envelope, ≤ 20 patches)
- `src/lib/schemas/patchPaths.ts` (whitelist + add/remove predicates)
- `src/contexts/intelligence/prompts/system.ts` (Crystal Atom builder)
- `src/contexts/intelligence/llm/responseParser.ts` (tolerant)
- `src/contexts/intelligence/llm/patchValidator.ts` (prototype-pollution + XSS + image)
- `src/contexts/intelligence/applyPatches.ts` (atomic, MultiPatchError)
- `src/contexts/intelligence/llm/fixtureAdapter.ts` (DEV adapter)
- `src/data/llm-fixtures/step-2.ts` (5 starter fixtures)
- `src/contexts/intelligence/llm/auditedComplete.ts` (centralised mutex)

**Wired changes:**
- `src/components/shell/ChatInput.tsx` (engine swap, mutex pre-check removed)
- `src/store/configStore.ts` (`applyPatches(JSONPatch[])` action)

**Tests (7 new):**
- `tests/p18-step1.spec.ts`
- `tests/p18-step2-chat.spec.ts`
- `tests/p18-step2-cap.spec.ts`
- `tests/p18-step3-multi.spec.ts`
- `tests/p18-step3-safety.spec.ts` (5 cases: nested script + proto-pollution + 3 image-URL)
- `tests/p18-step3-cap-edges.spec.ts`
- `tests/p18-step3-starters.spec.ts`

**ADRs (2 new):**
- `docs/adr/ADR-044-json-patch-contract.md` (Accepted)
- `docs/adr/ADR-045-system-prompt-aisp.md` (Accepted; AISP open-core repo cited)

### Carry-overs to P19

- **Real chat round-trip smoke** (Step 4) — human-triggered, post-DoD.
- **`mediaLibrary.json` vs `media/media.json` path canonicalisation** —
  small ADR-044 §5 amendment + cache invalidation seam.
- **Listen-mode parity** — P19 will reuse `auditedComplete`'s mutex,
  cost-cap projected pre-check, and audit-row write semantics; the
  blueprints already wired for it.

### Sealed

**Date:** 2026-04-27 (UTC)
**Ready for P19:** YES
