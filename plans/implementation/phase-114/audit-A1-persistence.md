# A1 — Persistence + Slug + Recall Audit

> **Phase:** P114 · **Sprint:** FEATURE-AUDIT + FIX · **Wave:** 1 (research-only)
> **Owned files (this run):** `plans/implementation/phase-114/audit-A1-persistence.md`
> **Predecessor audit:** `plans/strategic-reviews/2026-05-04-persistence-verify.md` (PARTIAL; 8 gaps)

## Summary

**Verdict: PARTIAL — confirms persistence-verify; adds 2 derived gaps.**

Persistence infrastructure is sound (sql.js + IDB + Web Locks + BroadcastChannel
+ pagehide flush + ADR-126 retention). The break is the upstream wire: every
Onboarding entry path writes to legacy `localStorage['hey-bradley-project']`,
NOT the `projects` table. `activeProject` stays `null`, autosave is a no-op,
`markSaved()` never fires, and the `/builder` URL has no recall handle. A user
who picks a theme today, edits for 30 minutes, and reloads tomorrow will see:
(a) "Unsaved" forever in TopBar, (b) zero entries in the `projects` table
*until* the next boot's `migrateLegacyLocalStorage` rescues the singleton as
slug `legacy-default`, and (c) Welcome.tsx still hides the projects list. **Two
NEW derived gaps surface from G1+G4:** G9 (`/builder` is mode-only — no slug
in URL) and G10 (the 4 default examples + 51 EXAMPLE_SITES never get a per-
project save handle, so picking the same example twice from Onboarding stomps
the prior session in the legacy singleton). Five concrete fixes total ~140 LOC.

## Q1 — Current project-creation flow

| Path | Trace | Storage layer landed |
| --- | --- | --- |
| **Welcome → "Start with your idea"** | `src/pages/Welcome.tsx:55` `<Link to="/new-project">` → routes to `<Onboarding>` | None yet (just navigation) |
| **Onboarding → "Start blank" (`handleStartNew`)** | `src/pages/Onboarding.tsx:535-540` calls `applyVibe('saas')` (configStore mutation), then `localStorage.setItem(STORAGE_KEY, JSON.stringify(config))` at line 538, then `navigate('/builder')` | **Legacy localStorage singleton** `'hey-bradley-project'`. NOT projects table. |
| **Onboarding → theme card (`handleThemeSelect`)** | `src/pages/Onboarding.tsx:500-506` calls `applyVibe(slug)`, reads `useConfigStore.getState().config`, `localStorage.setItem(STORAGE_KEY, ...)` at line 504, then navigates | **Same legacy singleton**. Both `handleStartNew` and `handleThemeSelect` overwrite the same `'hey-bradley-project'` key. |
| **Onboarding → example card (`handleExampleSelect`)** | `src/pages/Onboarding.tsx:508-517` calls `loadConfig(example.config)` (configStore), `localStorage.setItem(STORAGE_KEY, JSON.stringify(example.config))` at line 511, sets a hero context, navigates | **Same legacy singleton.** Each example pick overwrites the previous one — no per-example project row. |
| **Onboarding → ProjectCard "Open" (`handleOpenProject`)** | `src/pages/Onboarding.tsx:519-525` calls `loadProject(slug)` (projectStore — DOES read from `projects` table), then `loadConfig`, navigates | **Reads** the `projects` table via `repoGet(slug)` at `src/store/projectStore.ts:138-150`. **This is the only working path.** |
| **`migrateLegacyLocalStorage` rescue (one-time on boot)** | `src/main.tsx:54` calls migration; `src/contexts/persistence/legacyMigration.ts:78` upserts the singleton as slug `legacy-default` name `My Project` | **Projects table** — but only ONCE per browser, with a synthetic slug. |
| **autosave loop** | `src/contexts/persistence/autosave.ts:18-22` flush gates on `activeProject != null` — skips when null | **No-op for all 3 Onboarding paths above** until something else sets `activeProject`. |
| **`saveProject()` — UI callers** | `grep saveProject src/components/ src/pages/` returns 0 hits beyond store definition. `src/store/projectStore.ts:131-136` is the only definition. | **Zero UI surface** ever calls saveProject. CONFIRMED G1. |

**Net:** of 5 entry paths, only 1 (Open existing project) lands in the canonical
projects table. The other 4 land in the legacy singleton. The autosave loop is
correctly written but never observes a non-null `activeProject` in the new-user
flow, so it stays asleep.

## Q2 — Slug generation today

- **Schema:** `src/contexts/persistence/migrations/000-init.sql:5-11` declares
  `projects.id TEXT PRIMARY KEY` (`name` is non-PK NOT NULL). Slug = `id`.
- **Generation:** `src/store/projectStore.ts:51-58` `toSlug(name)` lowercases,
  trims, collapses `[^a-z0-9]+` to `-`, strips leading/trailing dashes, falls
  back to `'untitled'`. Pure function, deterministic from `name`.
- **Uniqueness:** PK enforces row uniqueness, but `repoUpsert` at
  `src/contexts/persistence/repositories/projects.ts:48-61` uses
  `INSERT OR REPLACE` — so two projects named "My Site" silently overwrite each
  other. No "name already exists" check, no "-2" suffix, no UUID fallback.
- **URL-safety:** `[^a-z0-9]+` → `-` is URL-safe by construction. No further
  encoding needed.
- **Legacy rescue slug:** `legacyMigration.ts:78` hard-codes `'legacy-default'`
  for the singleton (always one row, always overwrites prior `legacy-default`
  if re-migration ever ran — guarded by `FLAG_KEY` so it doesn't).

**Recommendation:** keep `toSlug()` as-is (covers 95% of users). Add a single
de-dup pass at `saveProject()` time: if `getProject(slug)` exists AND its
config differs, append `-2`, `-3`, etc. ~5 LOC.

## Q3 — Recall path proposal

**Three options:**

| Option | URL pattern | LOC | Pros | Cons |
| --- | --- | --- | --- | --- |
| **A — `/p/<slug>` route** | `/p/sweet-spot-bakery` | ~30 | Clean, shareable, semantic | New route in main.tsx; new page wrapper around Builder; depth in routing |
| **B — `?project=<slug>` query** | `/builder?project=sweet-spot-bakery` | ~15 | No new route; same page; same Suspense bundle | Less clean URL; query params get lost on hash navigation |
| **C — KV pointer + "Open <name>" CTA** | `/` (no URL handle) | ~10 | Minimal | Doesn't close G3+G4 — there's no shareable URL, no bookmarkable project state |

**Recommendation: B (`?project=<slug>` query param on `/builder`)** — closes G3
+ G4 in ~15 LOC because the existing `/builder` route already mounts `Builder`
component which has access to `useConfigStore` + `useProjectStore`. Add a
`useEffect` hook on Builder mount that reads `searchParams.get('project')` and
calls `loadProject(slug)` if present. Returning users land on `/builder?
project=sweet-spot-bakery` with the right config hydrated. Welcome
recent-projects card (Q4) generates these URLs directly. Lowest LOC; reuses
the existing Builder route; preserves bundle splits. Sketch:

```tsx
// src/pages/Builder.tsx — top of component
const [searchParams] = useSearchParams()
const loadProject = useProjectStore((s) => s.loadProject)
const loadConfig = useConfigStore((s) => s.loadConfig)
useEffect(() => {
  const slug = searchParams.get('project')
  if (!slug) return
  const cfg = loadProject(slug)
  if (cfg) loadConfig(cfg)
}, [searchParams])  // ~10 LOC
```

Welcome's recent-projects card emits `<Link to={`/builder?project=${slug}`}>` —
no new route needed. **Defer Option A to post-RC** if owner wants a polished
sharing surface.

## Q4 — Welcome recent-projects card

- **Existing layout** (`src/pages/Welcome.tsx`): hero → social-proof bar (lines
  80-88) → Don Miller story (lines 91-109) → Build Snapshot (lines 112-139) →
  Three Modes grid (lines 143-161) → "What you get" (lines 163-178) → Open
  Core (lines 181-190) → Blog preview (lines 192-219) → Closing CTA (lines
  221-243) → Footer (lines 246-257).
- **No `useProjectStore` import** today — confirming G4.
- **Cleanest insertion:** between social-proof bar (line 88) and the Story
  section (line 91). New `<section>` wrapping a 3-column grid; hide entirely
  when `projects.length === 0` so first-time-visitors see no empty card.
- **Card shape:** title + theme name + section-count + relative timestamp +
  "Open" link to `/builder?project=<slug>`. Use the `ProjectMeta` already
  shaped in `src/store/projectStore.ts:23-29`.

Sketch (~40 LOC):
```tsx
// src/pages/Welcome.tsx — between social-proof (line 88) and story (line 91)
const recentProjects = useProjectStore((s) => s.projects).slice(0, 3)
{recentProjects.length > 0 && (
  <section className="max-w-5xl mx-auto px-6 py-10" data-testid="welcome-recent-projects">
    <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--hb-warm)] mb-3 font-medium">
      Pick up where you left off
    </h2>
    <div className="grid md:grid-cols-3 gap-4">
      {recentProjects.map((p) => (
        <Link key={p.slug} to={`/builder?project=${p.slug}`}
              className="block p-5 rounded-xl border border-[rgb(var(--hb-warm-rgb)/0.2)] bg-white hover:border-[rgb(var(--hb-warm-rgb)/0.5)]">
          <h3 className="font-semibold text-base mb-1 text-[var(--hb-ink)]">{p.name}</h3>
          <p className="text-xs text-[var(--hb-ink-muted)]">{p.theme} · {p.sectionCount} sections</p>
          <p className="text-xs text-[var(--hb-ink-muted)] mt-1">{relTime(p.savedAt)}</p>
          <span className="text-xs text-[var(--hb-warm)] font-medium mt-3 inline-block">Open →</span>
        </Link>
      ))}
    </div>
  </section>
)}
```

`relTime()` is a 6-line helper — "2 hours ago" / "yesterday" / "3 days ago".

## Q5 — markSaved integration

- **Today:** `useConfigStore.markSaved` defined at `src/store/configStore.ts:491`
  → `set({ isDirty: false, lastSavedAt: new Date() })`. **Zero callers.**
  Confirmed G8.
- **TopBar render:** `src/components/shell/TopBar.tsx:31` reads `isDirty` from
  configStore; line 168-170 renders amber "Unsaved" / green "Saved" pill. The
  "Saved" path is dead because `isDirty` only flips back to false through
  `markSaved` (which is never called) or `loadConfig` (`configStore.ts:493`,
  used on project open).
- **Fix:** wire `markSaved()` inside autosave's `flush` after a successful
  `upsertProject`. `src/contexts/persistence/autosave.ts:26` is the call
  site — wrap in try/catch, on success call `useConfigStore.getState().markSaved()`.
  ~3 LOC. Closes G8 in one line.

```ts
// src/contexts/persistence/autosave.ts:18-33 — patched
const flush = (): void => {
  timer = null;
  const { activeProject, projects } = useProjectStore.getState();
  if (!activeProject) return;
  const meta = projects.find((p) => p.slug === activeProject);
  if (!meta) return;
  const { config } = useConfigStore.getState();
  try {
    upsertProject({ id: meta.slug, name: meta.name, config });
    useConfigStore.getState().markSaved();  // NEW — closes G8
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[autosave] upsertProject failed', err);
  }
};
```

## Q6 — Edge cases

| Edge case | Today | Recommendation |
| --- | --- | --- |
| **QuotaExceededError on `idbSet`** | `src/contexts/persistence/db.ts:174` writes oversized BLOB; failure bubbles as raw idb-keyval reject; `void persist().catch(...)` swallows in autosave path. User sees green "Saved" pill even after silent fail. | Wrap `idbSet` in try/catch named `QuotaExceededError`; surface via existing `PersistenceErrorBanner` pattern (`src/components/shell/PersistenceErrorBanner.tsx`). Add `navigator.storage.estimate()` soft-warn at >80% usage. ~25 LOC. **G7.** |
| **mobile Safari BFCache pagehide** | `src/contexts/persistence/db.ts:126-133` registers `pagehide` listener with `{ capture: true }` but no `sendBeacon`/`event.preventDefault`; async `idbSet` may not flush before page eviction. Best-effort by spec. | Add `void persist()` to `beforeunload` listener at `src/main.tsx:62-64` (currently only ends session). Even a partial belt+suspenders helps Chrome Android. ~3 LOC. **G2.** |
| **Two-tab same-project edit race** | `src/contexts/persistence/db.ts:177-178` Web Lock guards the `idbSet` write but NOT the in-memory tab state. Tab B's debounced flush after Tab A's invalidate stomps Tab A's edits. 800ms widens the window. | Acceptable single-user trade-off per persistence-verify §G5. **Document in TopBar** when 2+ tabs detected via BroadcastChannel handshake. ~15 LOC. Not P1 for P114 — defer. |
| **Same example picked twice** | `handleExampleSelect` overwrites legacy singleton each time; user never gets a per-example saved row. NEW gap **G10**. | Closes when fix #1 wires `saveProject(example.name, example.config)` instead of `localStorage.setItem(STORAGE_KEY, ...)`. Same fix closes G1 + G10. |
| **`/builder` reload without slug** | `/builder` mount today reads from configStore which was hydrated by `hydrateLastProjectAfterDB()` at `src/main.tsx:57` (reads `kv['lastProjectId']`). Works for the *last* project but not for direct-link to a specific older one. NEW gap **G9**. | Closes when fix #3 adds `?project=<slug>` recall in `Builder.tsx`. |

## Master fix list (Wave 2 dispatch input)

| # | Fix | LOC est | Priority | Closes |
| --- | --- | --- | --- | --- |
| 1 | `saveProject()` UI wire from Onboarding (3 entry points: handleThemeSelect / handleExampleSelect / handleStartNew) — replace `localStorage.setItem(STORAGE_KEY, ...)` with `useProjectStore.getState().saveProject(name, config)`. Generate name from theme slug or example.name; fall back to `Untitled <date>` for blank | ~30 | **P1** | G1, G10 |
| 2 | Welcome.tsx recent-projects card — `useProjectStore` import + 3-card grid between social-proof bar (line 88) and Story (line 91); hidden when `projects.length === 0`; links to `/builder?project=<slug>` | ~40 | **P1** | G4 |
| 3 | Builder.tsx `?project=<slug>` recall — `useSearchParams` + `useEffect` calling `loadProject(slug)` on mount when query param present | ~15 | **P1** | G9, G3 (partial) |
| 4 | autosave.ts `markSaved()` integration — call `useConfigStore.getState().markSaved()` inside flush after successful `upsertProject` | ~3 | **P1** | G8 |
| 5 | main.tsx `beforeunload` adds `void persist().catch(()=>{})` alongside `endActiveSession()` | ~3 | **P2** | G2 |
| 6 | db.ts `persist()` adds `QuotaExceededError` catch surfacing via PersistenceErrorBanner; `navigator.storage.estimate()` soft-warn at >80% | ~25 | **P2** | G7 |
| 7 | projectStore.ts `saveProject()` adds slug-collision pass: if `getProject(slug)` exists with different config, append `-2`/`-3` suffix | ~5 | **P2** | safety on Q2 dedup gap |
| 8 | Two-tab co-edit detection banner via BroadcastChannel handshake — TopBar shows "2 tabs editing" hint | ~15 | **P3** | G5 (mitigation) |

**Total LOC est: ~136** (P1 alone = ~88 LOC).

## Verdict

**PARTIAL. Persistence-verify report confirmed end-to-end with file:line evidence.**

- **8 gaps confirmed** (G1, G2, G3, G4, G5, G6, G7, G8 from persistence-verify).
- **2 derived gaps surfaced** (G9 — no slug in `/builder` URL; G10 — repeated
  example picks stomp legacy singleton).
- **8 fixes proposed** totaling ~136 LOC; **4 P1 fixes** total ~88 LOC close
  the load-bearing gaps (G1 + G4 + G8 + G9).

The single load-bearing fix is **#1 (saveProject UI wire)**. Without it, fixes
#2-#4 cannot be observed by the user (no projects exist to display, mark, or
recall). Wave 2 should ship #1-#4 in one parallel dispatch; #5-#7 are P2
quota/durability hardening; #8 is P3 polish.
