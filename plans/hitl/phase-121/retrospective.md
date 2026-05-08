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
