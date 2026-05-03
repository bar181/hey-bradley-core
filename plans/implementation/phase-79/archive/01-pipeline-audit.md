# P79 / OC-14 / A1 — Pipeline Page-Awareness Audit

**Owner:** Agent A1 (READ-ONLY audit)
**Branch:** `claude/verify-flywheel-init-qlIBr`
**Predecessor seal:** P78 / OC-11 multi-page MVP @ `a51cb88` (ADR-103)
**Question:** Where in the chat-→-patches pipeline does the active-page boundary leak?

---

## 1. Audit scope

Files read (READ-ONLY):

- `src/contexts/intelligence/chatPipeline.ts:1-538`
- `src/contexts/intelligence/applyPatches.ts:1-78`
- `src/contexts/intelligence/templates/templateApplier.ts:1-185`
- `src/contexts/intelligence/templates/templateMatcher.ts:100-200`
- `src/contexts/intelligence/aisp/todoExecutor.ts:1-183`
- `src/store/configStore.ts:1-671`
- `src/store/uiStore.ts:1-363`

Cross-cutting greps run:

- `grep -n "config.sections\|config\\.pages\|getActivePageSections\|activePageId\|activePage"` across all 5 pipeline files
- `grep -rn "applyPatches\|applyTemplateMatch\|matchTemplates"` across `src/contexts/intelligence/` + `src/store/`

Multi-page surface (truth source):

- `useUIStore.activePageId: string | null` — `src/store/uiStore.ts:170` (P78 / ADR-103; in-memory only)
- `useConfigStore.activePage: string | null` — `src/store/configStore.ts:116` (ADR-035 multi-page slice)
- `getActiveSections(config, activePage)` — `src/store/configStore.ts:91-97` (page-aware reader)
- `withUpdatedSections(config, activePage, sections)` — `src/store/configStore.ts:100-108` (page-aware writer)
- `useConfigStore.applyPatches(patches)` — `src/store/configStore.ts:125-130` (PAGE-NAÏVE — applies to root)

Critical asymmetry: `configStore` has a **page-aware section reader/writer pair** (used by `setSectionConfig` / `addSection` / `removeSection` / `reorderSections` / `duplicateSection` / `toggleSectionEnabled`) but the JSON-Patch path (`applyPatches`) bypasses both helpers and writes against the root config. Every pipeline patch site inherits this leak.

---

## 2. Call-site inventory

| file:line | call | classification | risk |
|---|---|---|---|
| `chatPipeline.ts:128` | `useConfigStore.getState().config.sections.map((s) => s.type)` (improvementSuggester input) | page-naïve | low — read-only feature input; wrong section list on non-home page → wrong improvement nudges |
| `chatPipeline.ts:206` | `useConfigStore.getState().applyPatches(parsed.envelope.patches)` (LLM JSON-patch path) | page-naïve | **HIGH** — LLM emits `/sections/{idx}/...` paths; resolves against root, not active page; on non-home page user's edits land in wrong page (or no-op if section absent at root) |
| `chatPipeline.ts:332` | `executeTodos(decomp, useConfigStore.getState().config)` (DECOMP_ATOM path; ADR-099) | page-naïve | **HIGH** — todoExecutor calls `applyTemplateMatch(match, config)` per todo; same `/sections/{idx}/*` mis-targeting |
| `chatPipeline.ts:335` | `useConfigStore.getState().applyPatches(exec.allPatches)` (DECOMP_ATOM apply) | page-naïve | **HIGH** — see :206; magnified by multi-clause input |
| `chatPipeline.ts:352` | `matchTemplates(text, useConfigStore.getState().config)` (OC-TI ranker) | N/A (read-only) | none — `matchTemplates` ignores `config` today (`templateMatcher.ts:120 void config`); future HNSW re-ranking may need page scope |
| `chatPipeline.ts:354` | `applyTemplateMatch(tplMatch, useConfigStore.getState().config)` (OC-TI section index resolution) | page-naïve | **HIGH** — `templateApplier.ts:117 const sections = config.sections` resolves wrong list; emits `/sections/{idx}/...` against root |
| `chatPipeline.ts:357` | `useConfigStore.getState().applyPatches(tiPatches)` (OC-TI apply) | page-naïve | **HIGH** — see :206 |
| `chatPipeline.ts:382` | `tryMatchTemplate(canonicalForTemplate)` (P23-25 template router) | N/A (text-only) | none — does not read `config` |
| `chatPipeline.ts:386` | `useConfigStore.getState().applyPatches(tpl.envelope.patches)` (template-router apply) | page-naïve | **HIGH** — same root-write leak; envelope paths assume single-page sections array |
| `applyPatches.ts:16` | `applyPatches(json, patches)` (pure JSON-Patch core) | N/A (root-agnostic) | none — pure RFC-6902 walker; takes whatever root caller passes; the bug is in the caller, not here |
| `templateApplier.ts:111-128` | `applySectionLayer(match, config)` — `config.sections.findIndex((s) => s.type === type)` + `/sections/${idx}/...` | page-naïve | **HIGH** — index resolved against root sections, but applied via root-write `applyPatches`; section may not exist at root yet exist on active page (or vice versa) |
| `templateApplier.ts:38-50` | `applyThemeLayer(match)` → `/theme/colors/*` etc. | N/A (theme is global) | none — `theme` is a single-page-spanning root field by design (theme is site-wide, not per-page) |
| `templateApplier.ts:143-160` | `applyContentLayer(match)` → `/_pendingContentStyle` | N/A (root-scoped intentionally) | none — transient hint consumed by CONTENT_ATOM at site scope |
| `todoExecutor.ts:142` | `matchTemplates(todo.details, config)` (per-todo) | N/A (read-only; matcher ignores config) | none — same as :352 |
| `todoExecutor.ts:152` | `applyTemplateMatch(match, config)` (per-todo) | page-naïve | **HIGH** — propagates wrong config to applier; A2 must inject active-page slice |
| `configStore.ts:125-130` | `applyPatches: (patches) => { ... pureApplyPatches(config, patches) ... }` (store action) | page-naïve | **HIGH (root cause)** — bypasses `getActiveSections` / `withUpdatedSections` helpers used by every other section mutator in the same store; this is the seam where the leak originates |

**Summary count:** 8 page-naïve sites with HIGH risk, 1 page-naïve with low risk, 6 N/A. Of the HIGH sites, **all 8 trace back to `configStore.applyPatches` (line 125)** — fix that one, and the other 7 collapse.

---

## 3. Integration recommendation

**Single-point insertion.** Patch `useConfigStore.applyPatches` (`configStore.ts:125-130`) to be page-aware. All other call sites become correct by inheritance. Rationale:

1. The root cause is one function. The other 7 HIGH sites are downstream consumers.
2. Pipeline-level guarding (e.g. wrapping in `chatPipeline.ts`) duplicates logic and leaves direct `applyPatches` callers (LLM:206, DECOMP:335, OC-TI:357, template:386) each needing the same wrapper. KISS says fix it once.
3. The store already has `getActiveSections` + `withUpdatedSections` helpers (lines 91-108) that handle the single-page / multi-page bifurcation. `applyPatches` just doesn't use them.

**Recommended shape (for A2/A3 to implement, NOT this audit):**

- Inside `configStore.applyPatches`: read `useUIStore.getState().activePageId` (or the existing `get().activePage`).
- Detect path prefix: patches whose `path` starts with `/sections/...` AND a multi-page mode is active → rewrite to `/pages/{idx}/sections/...` where `idx = config.pages.findIndex((p) => p.id === activePageId)`. Patches starting with `/theme/...` or `/_pendingContentStyle` pass through unchanged (theme is site-scope; content hint is transient).
- A `PageIterator` helper (per the brief) belongs here too — but as a single-call utility used inside the store, NOT a per-call-site wrapper. This keeps `chatPipeline.ts` and `templateApplier.ts` byte-identical for backward compat.

**Why NOT the per-apply-site wrapper:** four direct `applyPatches` call sites in `chatPipeline.ts` (206, 335, 357, 386) — every future pipeline path adds a 5th. Single-point fix amortizes the wire-up cost to zero.

**Secondary fix (LOW risk site):** `chatPipeline.ts:128` reads `config.sections` for `improvementSuggester`. Swap to `useConfigStore.getState().getActivePageSections().map((s) => s.type)` — one-line change, no API churn.

**Section-index resolution in `templateApplier.ts:117`:** `applySectionLayer` does `config.sections.findIndex(...)` to resolve `/sections/{idx}` for the patch path. After the store-level fix, the patch path itself is correct (root-relative), but the **index** is still computed against the wrong sections list. A2 must either (a) pass active-page sections into `applyTemplateMatch` (changes signature), OR (b) keep it as-is and let the store-level path-rewrite handle the `/sections/{idx}` → `/pages/{p}/sections/{idx}` translation BUT ensure the index points at a section that exists at the rewritten path. Option (b) is fragile when section types differ between pages. **Recommend option (a)** — change `applyTemplateMatch(match, config)` callers to pass `getActiveSections(config, activePageId)` slice, OR change the function signature to accept `sections` directly. This is A2 territory, not A1.

---

## 4. Backward-compat surface

Single-page assumptions that MUST remain working:

- **`config.pages` undefined / empty array** — `configStore.getActivePageSections` (`:514-521`) already returns `config.sections` in this case. The store-level `applyPatches` fix MUST mirror this guard so single-page projects (the default; `enableMultiPage` opt-in at `:527`) take the byte-identical path through `pureApplyPatches(config, patches)`.
- **`useUIStore.activePageId === null`** — also single-page mode; same root-write path. Confirmed at `uiStore.ts:266` (`activePageId: null` on init) and `uiStore.ts:284-287` (setter only writes on real change).
- **Theme + transient-hint patches** — `/theme/...` and `/_pendingContentStyle` paths must NEVER be rewritten to `/pages/{idx}/theme/...`. Theme is intentionally site-wide (`templateApplier.ts:38-50`); content hint is consumed at site scope (`templateApplier.ts:143-160`). Path-prefix guard in the store fix is mandatory.
- **History stack semantics** — `configStore.applyPatches:127` snapshots full `config` to `history` (HISTORY_LIMIT=100). Page-aware rewrites must NOT change the snapshot shape (still snapshot full root config) so undo/redo across page edits remains coherent.
- **Tests using `config.sections` directly** — likely many spec files assert on root `sections` array shape. The fix must preserve that assertion when `pages` is unset.
- **`enableMultiPage` migration (`configStore.ts:527-546`)** — copies `config.sections` into a new `Home` page's `sections` then leaves `config.sections` in place (it does NOT clear root sections post-migration; verified at `:537-540`). This means BOTH `config.sections` AND `config.pages[0].sections` exist after migration — the fix must treat `pages[0]` as the source of truth when `activePageId` is set, even when root `sections` is non-empty.
- **`templateMatcher.matchTemplates(query, config)` — `config` is currently `void`'d (`:118-120`).** API stability promise; A2 should NOT alter this signature even when wiring active-page scope.

---

## 5. Quick-win targets for A2 / A3

Ordered by dependency + LOC + blast radius:

1. **A2 / Step 1 — Patch `configStore.applyPatches` to be page-aware (root fix; ~25 LOC).**
   File: `src/store/configStore.ts:125-130`. Read `activePage` from `get()` (already in store; no `uiStore` cross-dep needed). Path-rewrite `/sections/...` → `/pages/{pageIdx}/sections/...` ONLY when `activePage !== null && config.pages?.length > 0`. Pass-through for theme / `_pendingContentStyle` / undefined-pages. Snapshot full root config to history (unchanged).

2. **A2 / Step 2 — Page-aware `applyTemplateMatch` signature (~10 LOC + caller updates).**
   File: `src/contexts/intelligence/templates/templateApplier.ts:111`. Change `applySectionLayer(match, config)` to resolve `findIndex` against `getActiveSections(config, activePage)` — either pass `sections: Section[]` directly OR accept `(match, config, activePage)`. Update 2 callers: `chatPipeline.ts:354`, `todoExecutor.ts:152` (read `useConfigStore.getState().activePage` at call site OR plumb through).

3. **A3 / Step 3 — Fix `improvementSuggester` input (~1 LOC).**
   File: `src/contexts/intelligence/chatPipeline.ts:128`. Replace `config.sections.map(...)` with `useConfigStore.getState().getActivePageSections().map(...)`. Trivial; no API churn.

4. **A3 / Step 4 — `PageIterator` helper for full-bundle export passes (~30 LOC; OPTIONAL for OC-14).**
   New helper that walks every page and applies the same template-bundle (used by P78 export `bundle.pages[]` emitter). Lives in `src/store/configStore.ts` or a new `src/contexts/intelligence/pageIterator.ts`. NOT required for chat pipeline correctness — only relevant if multi-page bulk-edit ("apply this theme to ALL pages") becomes a feature.

5. **A2 / Step 5 — Test fixtures.**
   Add a `tests/p79-pipeline-page-aware.spec.ts` covering: (a) single-page byte-identical path, (b) multi-page non-home active patch lands on correct page, (c) theme patch passes through to root, (d) section-not-on-active-page is no-op (graceful skip), (e) undo/redo across page boundary preserves history shape.

6. **A3 / Step 6 — `templateMatcher.matchTemplates` config use (DEFERRED; Tier-2).**
   Out of scope for OC-14. Leave `void config` as-is; revisit when HNSW re-ranking ships.

**Critical sequencing:** Steps 1 → 2 → 3 must land in that order. Step 1 alone makes the LLM path (`:206`), DECOMP path (`:335`), OC-TI apply (`:357`), and template-router apply (`:386`) all correct via the store fix. Step 2 then closes the section-index resolution gap. Step 3 is cosmetic / defensive.

---

**End of audit.** No source files modified.
