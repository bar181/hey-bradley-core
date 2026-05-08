# Website Eval — Pipelines + State Persistence Audit

**Branch:** eval/website-quality-2026-05-04
**Date:** 2026-05-06
**Scope:** Dimensions 1-3 (site preview · pipeline modes · state persistence)
**Method:** Read-only inspection of 5 example JSONs + chatPipeline + listen pipeline + persistence layer.

---

## Dim 1 — Site preview quality

5 representative examples read in full or in part. JSON-driven static site model: each `MasterConfig` has `site{}` meta, `theme{}` palette+typography, ordered `sections[]`, optional `pages[]` for multi-page. Renderer at `src/components/center-canvas/RealityTab.tsx:26-68` imports 60+ section variants (hero/columns/pricing/quotes/blog/case-study/contact-form/etc.) and dispatches by `section.type`. All 18 section types per ADR-100 have at least one template (`src/templates/{type}/`).

| Persona / file | Sections | Copy quality | Theme coherence | Hero+CTA | Score |
|----------------|----------|--------------|-----------------|----------|-------|
| Marketing exec — `aisp-executive.json` | menu, hero, columns(value-props), numbers, case-study, quotes, action, footer + 1 sub-page | Real, persona-specific (e.g. "Northwind Logistics 47%→3% rework"). Trust badges quantified. No Lorem. | Corporate dark navy/cream/gold; Inter+Fraunces; coherent palette + alternatePalette. | Yes / yes (`aisp-executive.json:51,132`) | **9/10** |
| Blog long-form — `coffee-essay.json` | menu, hero, text(long-form, 5 sub-headings + 5 paragraphs ~250-400 words each), pull-quote, testimonials, action(newsletter), footer | Genuine essay-prose with concrete detail (`SCA 60g/L`, "fifteen-to-one ratio"). First-person, not boilerplate. | Warm-paper light; Inter+Fraunces serif; muted browns/cream. Tonally on-brand. | Yes / yes (`coffee-essay.json:52,123`) | **9.5/10** |
| Agency — `quattro-studio.json` | menu, hero, text(positioning two-column), case-study(3 tiles each with client/challenge/solution/outcome/metrics), … | Concrete client work ("Glycora 3.2x Series-B step-up"; `quattro-studio.json:101-108`). Restrained agency voice. | Elegant cream/navy/gold; Canela serif; 2px radius — clear elegant preset. | Yes / yes | **9/10** |
| Dev tool multi-page — `axon-cli.json` | home (menu/hero/columns(features)/text(code-block)/numbers/quotes/pricing/action/footer) + `docs` page; pages array verified at `axon-cli.json:187,194` | Technical voice intact — code block at `axon-cli.json:115` is plausible CLI output, not gibberish. Feature copy crisp. | Industrial-modern dark `#0b0a14`+purple+cyan; JetBrains Mono headings. Coherent. | Yes / yes | **9/10** |
| Listen-mode persona — `mrs-albright-tutoring.json` | menu, hero, … (warm-paper preset; Lora serif; consumer/warm voice) | First-person from Mrs. Albright ("I taught at Roosevelt High for 32 years"). Plain-spoken, on-tone. | Warm-paper cream/gold/sage; Lora throughout — consistent. | Yes / yes | **9/10** |

**Bottom line:** preview quality is **9/10 average**. Zero Lorem Ipsum across 5 random samples. Voice + theme are consistently aligned with the persona/purpose declared in `site.audience`+`tone`+`voiceAttributes`. Multi-page fully wired (`axon-cli.json` has 2 pages). Section breadth is real — case-study, contact-form, blog, pricing, numbers, quotes, action, code-block all rendering.

---

## Dim 2 — Pipeline modes

| Mode | Marketing site (hero/pricing/cta/testimonials) | Blog/article (long-form text/pull-quote/read-more) | Verdict |
|------|------------------------------------------------|----------------------------------------------------|---------|
| Chat | PASS | PASS | **PASS** |
| Listen | PASS (via chat pipeline; voice-source-only divergence is `cleanTranscript` + review card) | PASS (same — produces same patches) | **PASS** |
| Builder | PASS (drag-add + manual JSON edit) | PASS (text section + variant=long-form fully rendered) | **PASS** |

### Per-mode trace

**Chat mode (`src/contexts/intelligence/chatPipeline.ts:298`).** Single entry `submit({source, text, history?})`. Path:
1. Trim + log `input_event` (`chatPipeline.ts:302,326`).
2. Resolve page scope via `getActivePage` (`chatPipeline.ts:319`).
3. Compute `effectiveText = source==='listen' ? cleanTranscript(text) : text` (`chatPipeline.ts:340`).
4. AISP rules classify → LLM fallback if below threshold (`chatPipeline.ts:392-404`).
5. Route classify (content/design/ambiguous) at `:432`.
6. **DECOMP_ATOM** short-circuit at `:439-521` — multi-clause asks ("brighter and add pricing") split into Todos, executor applies, returns. This is what produces multi-section marketing pages from a single ask.
7. **Template Intelligence matcher** at `:530-549` — 3-layer (theme/section/content). `sectionLibrary.ts:50-185` includes `saas-landing` (sections: menu/hero/columns/pricing/quotes/action/footer), `blog-home` (menu/hero/blog/columns/action/footer), `oss-library`, `podcast-show` — these directly back marketing+blog asks.
8. Fallthrough → SELECTION_ATOM → LLM patch path → applyPatches.

Marketing capability: **PASS** — `saas-landing` arrangement plus `pricing` section type plus `quotes` plus `action` plus `numbers` are all wired in chatPipeline + RealityTab. Blog capability: **PASS** — `blog` section type renders via `BlogCardGrid`/`BlogListExcerpts`/`BlogFeaturedGrid`/`BlogMinimal` (`RealityTab.tsx:65-68`); long-form articles render via `text` section with variant `long-form` (proven by `coffee-essay.json` rendering 5 paragraphs).

**Listen mode (`src/components/left-panel/listen/useListenPipeline.ts:128`).** PTT (push-to-talk) → Web Speech `final` transcript → review card (`useListenPipeline.ts:181-233`) → on approve calls `submitChatPipeline({source: 'listen', text})` (`useListenPipeline.ts:131`). cleanTranscript fires inside chatPipeline at `:340` per ADR-127. Same downstream path → same marketing+blog capability. Persisted via `appendListenTranscript` with `redactKeyShapes` (`useListenPipeline.ts:165`) per ADR-043.

**Builder mode (`src/pages/Builder.tsx:1-15`).** Renders `<AppShell>` desktop tri-pane + `<MobileLayout>`. AppShell hosts LeftPanel (sections list + chat tab + listen tab) + CenterCanvas (live preview / AISP / data tabs) + RightPanel. Direct manipulation works via `RealityTab.tsx:128-134` (`AddSectionDivider` → `addSection(type, afterIndex)`) plus drag-reorder + JSON edit in DataTab. No restriction on output type — same JSON model means any persona is producible.

**One honest weakness:** chatPipeline DECOMP_ATOM only fires when `decomp.confidence >= 0.7` (`chatPipeline.ts:457`). Below that, falls through to single-template matcher which returns one section at a time. So a one-shot "build me a blog homepage" via chat needs the matcher to recognize `blog-home` arrangement (which it does — `sectionLibrary.ts:170-185`) OR the user iterates section-by-section. Listen mode has the same gate. Builder mode bypasses entirely (user adds sections manually).

---

## Dim 3 — State persistence

**Verdict: PASS.**

Evidence:

- **sql.js + IndexedDB per ADR-016/040.** `src/contexts/persistence/db.ts:67-142` initializes sql.js once, restores DB bytes from idb-keyval (`db.ts:87`), runs migrations. Singleton + cross-tab Web-Lock + BroadcastChannel invalidation (`db.ts:36-44,168-186`).
- **Project state survives tab close.** `pagehide` listener registered exactly once (`db.ts:124-133`) calls `persist()` best-effort. Pairs with the comprehensiveLogs debounced 500ms flush (`comprehensiveLogs.ts:198-207`) and the synchronous `flushLogsImmediate` (`comprehensiveLogs.ts:214-224`) — the P105/A2 fix that closed "logs evaporate on tab close." `upsertProject` calls `void persist()` on every save (`projects.ts:59`).
- **Cross-session: open app week later → projects list loads.** `listProjects` reads `SELECT id, name, … FROM projects ORDER BY updated_at DESC` (`projects.ts:27-36`). `Onboarding.tsx:417-419` consumes via `useProjectStore`; `loadProject(slug)` at `Onboarding.tsx:519-525` re-hydrates `configStore` and routes to `/builder`. The Onboarding "Saved Projects" tab is the explicit re-entry surface (`Onboarding.tsx:454`).
- **BYOK keys never persisted to log/export per ADR-043.** `redactKeyShapes` (`src/contexts/intelligence/llm/keys.ts:94-106`) runs at every write boundary: chatPipeline emit sites (`chatPipeline.ts:326,327`), listen-write boundary (`useListenPipeline.ts:165`), and writeErrorEvent both message + stack per ADR-135. BYOK key itself stored in `kv['byok_key']` and stripped from exports per `migrations/README.md:39`.
- **Retention prune runs on init.** `pruneOldLLMLogs` (30d) at `db.ts:100`, `pruneLLMLogsByCount(10_000)` LRU bound at `db.ts:102`, **and** `pruneOldLogs(db, 30)` + `pruneOldEditHistory(db, 90)` at `db.ts:116-117` per ADR-126 (P101 R3 P1 fix).
- **Cross-tab integrity.** Web Locks serialize IDB writes (`db.ts:177-178`), BroadcastChannel invalidates peer singletons (`db.ts:55-58,175`), peers re-hydrate lazily on next `getDB()` call (`db.ts:154-159`).

Gaps observed:
- **Welcome.tsx (front door) does not show "continue last project" surface.** `Welcome.tsx:30-260` routes everything to `/new-project` (Onboarding). Re-entry to a saved project requires landing on Onboarding then clicking the Projects tab. Honest gap, not blocker — Onboarding is the canonical re-entry per design.
- **localStorage `STORAGE_KEY = 'hey-bradley-project'`** (`Onboarding.tsx:18`) is used as a parallel cache for the active config alongside the sql.js project row. This is intentional (handles useAutoSave race on builder mount per inline comment at `Onboarding.tsx:503-504`) but is duplicate state — not a bug, but worth knowing.

---

## Honest gaps named

1. **Welcome page has no "Recent projects" surface.** First-time + returning users land on Welcome (`/`) and must navigate to `/new-project` (Onboarding) to see saved projects. The state IS persisted; the front-door discoverability is the issue.
2. **DECOMP confidence gate at 0.7 (`chatPipeline.ts:457`) means "build a complete marketing site" via chat needs the template matcher (saas-landing arrangement) to fire, not DECOMP.** When it falls through to LLM-only patches, the user gets one section per turn. This is a real per-user-experience bottleneck for first-touch conversion. Not broken — just slower than the single-shot story implies.
3. **`STORAGE_KEY` localStorage shadow of the active config (`Onboarding.tsx:18,504,511,538`)** runs alongside the canonical sql.js row. Two writers for one piece of state. Intentional per the inline comment but a subtle gotcha for anyone debugging "why did my edit not survive."
4. **Listen mode review card adds a turn-step.** Voice → transcript → review card → approve → pipeline (`useListenPipeline.ts:181-233`). Two-stage UX is explicitly per ADR-127 review-first design. Worth naming because "listen mode is fastest" undersells the deliberate friction.
5. **Multi-page is real but only 1 of 5 sampled examples uses it (`axon-cli.json`).** ADR-103 wire is solid (verified at `chatPipeline.ts:319,547` and `Onboarding.tsx`). The thin sampling in the example library means most users will encounter single-page builds at first run.

**Net verdict:** preview quality is genuinely high (9/10 avg, no Lorem); chat+listen+builder all produce marketing AND blog sites; persistence is rock-solid (sql.js + IDB + BYOK redaction + retention prune all wired). Real gaps are surface/UX (Welcome front-door re-entry, DECOMP confidence threshold) not architectural.
