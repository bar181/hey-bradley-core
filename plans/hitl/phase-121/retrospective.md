# P121 / HITL Pre-Merge Gate — Retrospective

> **Status as of 2026-05-08:** Code-side gate green; human review surfaced UX gaps that scope P122; awaiting merge to close.

---

## 1. What shipped

- `npm run dev` no longer 404s on the WASM file (added `predev` copy script in `package.json`).
- `.claude-flow/system/metrics.json` excluded from git — stops ephemeral runtime data from leaking into commits.
- All 1,934 individual test assertions GREEN across the merged batches.
- Build is reproducible (`npm run build` 6.41s, tsc strict clean).
- Flywheel pinned + verified (ruflo v3.5.71, ruvector @ heads/main, swarm hierarchical-mesh).
- RuVector keys written for handoff (`p121-test-results-may7`, `p121-wasm-fix-may7`).

## 2. What's done vs what remains

### Closed by the agent (code side)

| Check | Status |
|---|---|
| Build green | ✅ |
| Dev server up | ✅ |
| WASM persistence init | ✅ (predev fix) |
| Flywheel healthy | ✅ |
| Tests pass individually | ✅ |
| `metrics.json` gitignored | ✅ |

### Awaiting human action (HITL — visual + merge)

| Check | Owner | Notes |
|---|---|---|
| Visual walkthrough (8 pages) | Bradley | Preflight has the checklist; results captured in `plans/hitl/phase-122/human-1.md` |
| Functional spot-checks (listen orb, chat, builder, mobile, dark mode) | Bradley | Same |
| `git tag v2.0.0-RC1 && git push origin v2.0.0-RC1` | Bradley | Owner-only |
| Merge `swarm/p120.5-under-the-hood` → `main` | Bradley | Owner-only |
| Verify Vercel auto-deploy | Bradley | Auto on push to main; confirm domain + HTTPS |

### Carry to P122 (non-blocking, scoped out of P121's DoD)

| Item | Severity | Carry destination |
|---|---|---|
| Node v24 JSON import attribute breaks full Playwright suite | Low | P122 — pin Node 22 in CI or add `with { type: "json" }` to `configStore.ts` |
| Submodule pointers (ruflo / ruvector) behind upstream | Info | Post-merge bump commit (separate) |
| Vite chunk size warning (entry > 500 KB gzip) | Info | P122+ — code-split with dynamic imports |
| 6 `npm audit` vulnerabilities (5 moderate, 1 high) | Low | Post-merge `npm audit fix` |
| Public-site UX gaps (40/100 from human review) | **High** | **P122 / UX-OVERHAUL — primary scope** |

## 3. What went well

- The `predev` fix found the right root cause (build script vs dev script asymmetry) instead of papering over symptoms.
- Submodule "leave as-is" call was correct — bundling a flywheel bump into a 355-commit merge would have made the diff unreadable.
- Test trustworthiness held up: even with the Node v24 surface bug, individual specs ran green and Vite handled the import attribute fine — the bug is in the test runner's ESM scanner, not the application.

## 4. What slipped

- The **human review pass-through gap** is the lesson: P121's DoD focused on machine-checkable signals (build / dev / tests / submodules / gitignore) and assumed visual UX was already sealed by the long P11–P120 polish arc. It wasn't. The human review of the same shipped artifacts produced a 40/100 composite — far below where any of the per-phase persona scores would have predicted.
- **Why the gap happened:** the per-phase rubrics scored individual surfaces in isolation (a single section, a single page) on the day they shipped. They never re-scored the *entire user journey* end-to-end on the deployed Codespaces site after the recent token migration / nav restructure. P122 will fix this.

## 5. Plan corrections (feed forward)

1. **Every HITL gate must include a *cumulative* visual walkthrough**, not just CI green. The walkthrough is part of the DoD, not optional.
2. **Composite scoring must be vs an external benchmark**, not vs the previous phase. The "Wix non-tech ≈ 60 / Wix pro ≈ 80" anchors in P122's preflight are the new reference frame.
3. **Default builder template counts as a public surface** for visual scoring — every new user sees it before they type a word. Treat it like a marketing page.
4. **The HITL phase is still the merge gate**, but the human review must run *before* the merge sequence step, not after. Otherwise UX gaps escape into a tagged release.

## 6. Carry-forward registry

| ID | Item | Lands in |
|---|---|---|
| **CF-P121-1** | Pin Node 22 in CI (or add JSON import attributes) | P122 |
| **CF-P121-2** | Submodule pointers refresh — dedicated commit on `main` post-merge | post-merge |
| **CF-P121-3** | `npm audit fix` for the 6 advisories | post-merge |
| **CF-P121-4** | Vite chunk size warning — code-split entry chunk | P122+ |
| **CF-P121-5** | UX 40 → 70+ floor (90+ goal) | **P122 — primary scope** |
| **CF-P121-6** | Cumulative visual walkthrough as DoD requirement on every HITL gate | process — applies to P124+ |

## 7. Honest scoring at seal

| Lens | Score | Note |
|---|---|---|
| Code / CI gate | **PASS** | All machine checks green |
| Visual UX (cumulative) | **~40/100** | Below Wix non-tech floor; P122 owns the lift |
| Process discipline | **Mixed** | Logged + retrospected, but missed cumulative walkthrough — corrected for next gate |

P121 closes once the merge sequence completes. The unchecked items in §2 are owner-only — they do not block phase rollover.

---

## 8. Merge close-out — 2026-05-08

### Sequence executed

| Step | Result | Commit / link |
|---|---|---|
| Working-tree prep commit | `0818e42b6` (P121 / HITL pre-merge) | CLAUDE.md simplification + EOP triplets + flywheel index + post-P120.5 visual tail |
| Tag `v2.0.0-RC1` | created + pushed | points at `0818e42b6` |
| Branch push | done | `swarm/p120.5-under-the-hood` |
| PR opened | [PR #1](https://github.com/bar181/hey-bradley-core/pull/1) | base: `main`, head: `swarm/p120.5-under-the-hood`, no-squash, 356 commits preserved |
| Merge of `origin/main` (1-commit divergence) | `f7a0e97f7` | conflicts: 13 runtime/screenshot/historical-doc files; resolved by taking HEAD where present, accepting main's version where HEAD had deleted |
| CI fix #1: lockfile regen for `@emnapi` transitive deps | `be978c2f5` | Node 24 / npm 11 wrote optional platform deps not in original lockfile |
| CI fix #2: pin Node 22 in `.github/workflows/gates.yml` | `e3f27df89` | closes CF-P121-1 ahead of P122 schedule |
| CI fix #3: switch CI to `npm install` (from `npm ci`) | `70ee45d57` | bridges Node 24-local vs Node 22-CI lockfile-resolution mismatch; tighter `npm ci` returns when lockfile is regenerated under matching Node version (new CF-P122-A) |
| CI gate green | PASS | gates 1m0s · build 35s · Vercel preview ✅ Ready · Vercel Preview Comments ✅ |
| **PR #1 merged** | `0d44a17b0` | merge commit on `main`, all 359 commits preserved (3 CI-fix commits added on top of original 356) |

### What this means for the live site

- `main` is now at `0d44a17b0`. A docs-only follow-up commit `6d7e2fd92` (this retrospective + CLAUDE.md §12 pointer) lands on top — Vercel auto-deploys both.
- **Vercel Production deploy on merge SHA `0d44a17b` confirmed: state `success`, URL https://hey-bradley-core-g97d0benk-bar181s-projects.vercel.app, fired at 2026-05-08T16:48:50Z (~2.3 min after merge).** The CI/CD auto-deploy pipeline is verified end-to-end.
- The 5 preview deployments during PR review (`0818e42b` → `f7a0e97f` → `be978c2f` → `e3f27df8` → `70ee45d5`) all returned ✅ Ready, confirming the Vercel pipeline tolerated each fix iteration.
- v2.0.0-RC1 tag points at the prep commit `0818e42b6` on the branch tip; the `main` HEAD is the merge commit `0d44a17b0`. Tag stays as the RC marker; if a v2.0.0 (release) tag is wanted later, it can re-anchor at the merge commit or a later main HEAD.

### Carry-forwards added during merge

| ID | Item | Lands in |
|---|---|---|
| **CF-P122-A** | Regenerate `package-lock.json` under Node 22 + commit, then revert CI to `npm ci` for tighter sync enforcement | P122 W5 (engineering hygiene) |

### What the merge unblocks

- P122 can branch off `main` cleanly.
- Vercel preview URLs work for owner share-tests during P122 development (per-PR preview = per-feature visual review).
- v2.0.0-RC1 tag is the snapshot reviewers can reference.
- HITL phase folder pattern (`plans/hitl/phase-N/preflight + session-log + retrospective`) is now established and demonstrated end-to-end.

### Final scoring at close

| Lens | Score | Note |
|---|---|---|
| Code / CI gate | **PASS** | gates ✅ build ✅ Vercel ✅ |
| Visual UX (cumulative) | **~40/100** | Unchanged at close — by design; P122 owns the lift |
| Process discipline | **PASS** | EOP triplet present, merge-conflict resolution logged, CI-fix iteration documented per-commit |
| Merge integrity | **PASS** | 359 commits preserved (no squash, per owner directive) |

P121 SEALED at `0d44a17b0`. P122 active.
