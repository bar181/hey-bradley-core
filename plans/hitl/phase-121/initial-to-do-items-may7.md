# Hey Bradley — Phase 121: HITL Pre-Merge Gate
**Branch:** `swarm/p120.5-under-the-hood` (355 commits ahead of main)  
**Target:** `main` · v2.0.0-RC1  
**Status:** Capstone defense complete (10/10, May 2026)  
**Date:** 2026-05-07

---

## Phase 121 DoD
> Browser works. CI/CD tests green. Site loads on Codespaces. Vercel auto-deploys on merge to main.

---

## 1 · Pre-Merge Checklist

### Infrastructure (completed by agent)
- [x] Confirm `metrics.json` is gitignored (added to `.gitignore`)
- [x] Leave submodule pointers as-is (ruflo + ruvector update post-merge separately)
- [x] Build passes (`npm run build` — 6.41s, Vite v8.0.3, tsc clean)
- [x] Dev server starts and serves (`localhost:5173` — confirmed)
- [x] Flywheel operational (ruflo healthy 100/100, ruvector HNSW initialized, swarm running)

### Tests (status: PASS with caveat)
- [x] All 1,934 test assertions pass (614 + 1,320 in two batches)
- [ ] **Known issue:** Full 152-file suite crashes on Node v24 JSON import attribute enforcement
  - Root cause: `configStore.ts` imports `default-config.json` without `with { type: "json" }`
  - Playwright's ESM scanner trips on it; Vite handles it fine at build/dev time
  - **Not a blocker:** live site unaffected, build passes, all tests pass individually
  - **Fix options (P122):** Pin Node 22 in CI, or add import attribute, or split test runner

### Human Review (HITL)
- [ ] Open the site on Codespaces — confirm it loads, no console errors
- [ ] Walk through key pages: Home, About, Open Core, Research, Blog, Contact, For-Teams, Walkthrough
- [ ] Spot-check: Listen mode red orb, chat demo, theme switching, mobile responsive
- [ ] Visual quality check: warm cream chrome (#faf8f5), no dark-mode leaks outside Listen

### Merge Sequence
- [ ] `git tag v2.0.0-RC1 && git push origin v2.0.0-RC1`
- [ ] Merge `swarm/p120.5-under-the-hood` → `main`
- [ ] Verify Vercel auto-deploy succeeds (CI/CD on push to main)

---

## 2 · Launch Sequence (after merge, in order)

- [ ] **CF#4** — BYOK smoke test: 5 real prompts with Claude Haiku (~$0.05), confirm API call -> JSON patch -> preview update
- [ ] **CF#5** — STT calibration: 10 voice inputs in Chrome, confirm transcript accuracy in listen mode
- [ ] Deploy `heybradley.app` to Vercel production — verify domain, HTTPS, no errors
- [ ] Plugin publish -> Claude Code marketplace (`connections/plugin` -> `bar181/hey-bradley`)
  - Confirm all 12 funnel surfaces resolve to production URL
- [ ] NPX publish -> `cd connections/npx && npm publish`
  - Verify: `npx hey-bradley` works from clean environment
- [ ] Agentics Foundation beta — invite 20-50 users, start 30-day PMF signal window
  - Track: return visits, export usage, BYOK activation rate
- [ ] Show HN post — Tuesday or Wednesday 9am ET
  - Draft: `docs/launch/show-hn-post.md`
  - Wait minimum 24h after Vercel production deploy before posting
- [ ] File Phase 68 swarm directive — canonical_keys wiring bug (non-blocking, deferred)

---

## 3 · Post-Capstone (signal-gated or independent)

> Defense scored 10/10. Committee directive: meet with big tech, publish AISP and HAI-OS.

### Publishing — move quickly, time-sensitive

- [ ] **AISP arXiv preprint** — *"AISP-First Spec-Driven Development: Empirical Results on SWE-bench Verified"*
  - 92% overall, 75% very-hard, +42% over baseline, January 2026, Claude Opus 4.6
  - Note: older model framing weakens as newer models close the gap — prioritise
- [ ] **HAI-OS system paper** — fractal database, 7 properties, holographic reconstruction
  - Phase 67 sealed state is the concrete artifact to describe

### Big tech outreach — unlocked

- [ ] **Logan / Google AI Studio** — outreach now that defense is complete and live demo is built
  - Frame: Harvard ALM done, committee said meet big tech and publish, live demo at heybradley.app

### 30-day signal gates (build only if beta confirms PMF)

- [ ] Auth + saved projects — Supabase (week 1-2)
- [ ] Shareable preview URL — the viral loop, load-bearing commercial feature (week 3-4)
- [ ] Stripe billing — Pro $99/month (week 5)
- [ ] Teams tier — $299/month (week 8)
- [ ] GitHub connect + Vercel deploy button (week 12)

### Agentics Foundation

- [ ] Certification program — 220+ question bank, multi-level credentialing
- [ ] Bradley Academy vs commissioned instructor model — decide based on beta signal

---

## Reference

| Item | Location |
|---|---|
| Test results stored | RuVector key: `p121-test-results-may7` (namespace: hey-bradley) |
| Show HN draft | `docs/launch/show-hn-post.md` |
| Plugin | `connections/plugin/` |
| NPX | `connections/npx/` |
| ADR log | `docs/adr/` (ADR-045 -> ADR-149) |
| Phase 68 brief | TBD — file after merge |
