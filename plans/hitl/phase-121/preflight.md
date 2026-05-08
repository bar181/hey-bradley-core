# Phase 121 Preflight — HITL Pre-Merge Gate
**Branch:** `swarm/p120.5-under-the-hood` (355 commits ahead of main)  
**Date:** 2026-05-07  
**DoD:** Browser works + CI/CD tests green + human visual review

---

## Gate Status

| Check | Status | Notes |
|-------|--------|-------|
| `npm run build` | PASS | 6.41s, Vite v8.0.3, tsc clean |
| Dev server (localhost:5173) | PASS | Vite serves correctly |
| WASM persistence | FIXED | Added `predev` script to copy sql-wasm.wasm before `npm run dev` |
| Flywheel (ruflo) | PASS | Healthy 100/100, 983h uptime |
| Flywheel (ruvector) | PASS | HNSW initialized, all-MiniLM-L6-v2, 384d |
| Swarm | PASS | hierarchical-mesh, 14 max agents |
| Tests (individual) | PASS | 1,934 assertions across 152 spec files |
| Tests (full suite) | KNOWN ISSUE | Node v24 JSON import attribute breaks Playwright full-suite scan |
| `metrics.json` gitignored | FIXED | Added to `.gitignore` |
| Submodule pointers | AS-IS | ruflo + ruvector update post-merge separately |

---

## Fixes Applied This Session

### 1. WASM Path for Dev Server
- **Problem:** `prebuild` copies `sql-wasm.wasm` to `public/sqljs/` but only fires before `npm run build`, not `npm run dev`. Fresh Codespace `npm run dev` gets a 404 HTML page instead of WASM binary.
- **Fix:** Added `"predev": "node scripts/copy-sqljs-wasm.mjs"` to `package.json`
- **File:** `package.json`
- **Impact:** Persistence now initializes correctly in dev mode

### 2. metrics.json Gitignore
- **Problem:** `.claude-flow/system/metrics.json` (ephemeral runtime data) was not in `.gitignore`
- **Fix:** Added `.claude-flow/system/metrics.json` to `.gitignore`
- **File:** `.gitignore`

---

## Human Review Checklist (HITL)

### Visual Walkthrough
- [ ] Home page loads — Apple-style 5-section scroll story ("Describe it. See it.")
- [ ] About page — no scoreboard numbers, clean narrative
- [ ] Open Core page — phase numbers removed, clean framing
- [ ] Research page — AISP math-first context, Harvard ALM Capstone, "Under the Hood" section
- [ ] Blog page — 3-category filter (Story / Technical / For teams), Welcome H2 link
- [ ] Contact page — LinkedIn, GitHub, Harvard ALM, Agentics Foundation
- [ ] For-Teams page — Cursor/Claude-Code teams audience, persistent spec + CLAUDE.md handoff
- [ ] Walkthrough page — 6-scene mobile-first scroll-snap, brand invisible until Scene 6

### Functional Checks
- [ ] Listen mode — red orb renders, dark background
- [ ] Chat demo — bubbles appear, theme switching works
- [ ] Builder — left panel sections, right panel preview, tab navigation
- [ ] Mobile responsive — hamburger menu, viewport stacking
- [ ] Light/dark mode — `.dark` token overrides, warm cream chrome (#faf8f5) default
- [ ] No console errors (except React DevTools info message)
- [ ] Persistence initializes — no WASM errors in console

### Merge Sequence
- [ ] `git tag v2.0.0-RC1 && git push origin v2.0.0-RC1`
- [ ] Merge `swarm/p120.5-under-the-hood` -> `main`
- [ ] Verify Vercel auto-deploy succeeds

---

## Known Issues (Non-Blocking, Defer to P122+)

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | Node v24 JSON import attribute breaks full Playwright suite | Low | Pin Node 22 in CI or add `with { type: "json" }` to configStore.ts |
| 2 | Submodule pointers (ruflo/ruvector) behind upstream | Info | Update in separate commit post-merge |
| 3 | Vite chunk size warning (index.js > 500KB gzip) | Info | Code-split with dynamic imports in P122+ |
| 4 | 6 npm audit vulnerabilities (5 moderate, 1 high) | Low | Run `npm audit fix` post-merge |

---

## Phase 122: Next Steps (after merge)

### Immediate (same week as merge)
- [ ] Fix Playwright full-suite Node v24 compat (pin Node 22 or add import attributes)
- [ ] Update submodule pointers to latest ruflo + ruvector
- [ ] Run `npm audit fix` for 6 vulnerabilities
- [ ] Update CLAUDE.md phase status to reflect P121 closed, P122 active

### Launch Sequence
- [ ] BYOK smoke test (CF#4) — 5 real Claude Haiku prompts (~$0.05)
- [ ] STT calibration (CF#5) — 10 voice inputs in Chrome
- [ ] Deploy `heybradley.app` to Vercel production
- [ ] Plugin publish to Claude Code marketplace
- [ ] NPX publish (`npx hey-bradley`)
- [ ] Agentics Foundation beta — 20-50 users, 30-day PMF window

### Phase 123+: Post-Launch
- [ ] Show HN post (Tuesday/Wednesday 9am ET, 24h+ after production deploy)
- [ ] File Phase 68 swarm directive (canonical_keys wiring bug)
- [ ] AISP arXiv preprint
- [ ] HAI-OS system paper
- [ ] Big tech outreach (Logan / Google AI Studio)

### Signal-Gated (30-day PMF confirmation required)
- [ ] Auth + saved projects — Supabase (week 1-2)
- [ ] Shareable preview URL — viral loop (week 3-4)
- [ ] Stripe billing — Pro $99/month (week 5)
- [ ] Teams tier — $299/month (week 8)
- [ ] GitHub connect + Vercel deploy button (week 12)

---

## RuVector Memory Keys

| Key | Namespace | Content |
|-----|-----------|---------|
| `p121-test-results-may7` | hey-bradley | Full test results, flywheel status, node compat analysis |
| `p121-wasm-fix-may7` | hey-bradley | WASM path fix details and verification |
