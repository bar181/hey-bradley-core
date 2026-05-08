# P122 / UX-OVERHAUL — Session Log

> **Phase contract:** Lift cumulative public-site + builder visual quality from ~40/100 to ≥70/100 (goal 90+).
>
> **Status:** Awaiting P121 merge. Wave 1 not yet dispatched.
>
> Append entries chronologically. This is the primary record for future agents.

---

## 2026-05-08 — Phase scaffolded

- Preflight written (`plans/hitl/phase-122/preflight.md`) covering rubric, DoD, scope (in/out), wave plan, risks, owner Qs.
- `human-1.md` (May 8 owner feedback) is the source of truth for the gap inventory; preflight §3 mirrors its Priority 1 + relevant Priority 2 items.
- Existing screenshots in this folder (`agentics - aisp.png`, `builder - chat.png`, etc.) become the before-state baseline; A1 audit will pair each with a re-score after fixes land.
- Dispatch is **gated on P121 merge to main** — do not start Wave 1 from `swarm/p120.5-under-the-hood` (already 355 commits ahead).
- 5 owner Qs in preflight §7; resolve before Wave 1 dispatches.

## 2026-05-08 — Owner production smoke test → 4 bugs surfaced + 1 hotfix shipped

Owner ran a quick smoke test against the freshly-deployed live site at `https://hey-bradley-core.vercel.app/` and reported:

1. **Critical: `/builder` returned 404** — and presumably every other deep link too. Console error: `core.js:297 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'payload')`.
2. **Builder bug: "add page" doesn't work** — the action is unresponsive.
3. **Builder bug: hero photo switch mutates image URL** — switching from "full photo" layout to other photo options changes the image unexpectedly.
4. **Tone reminder: default should look like Hey Bradley** (same colors + tone). Already locked in `human-2.md` decisions; owner re-emphasised.

### Hotfix (this session)

- **`/builder` 404** — root cause: no SPA fallback configured for Vercel. The Vite app routes 16+ paths client-side via React Router, but Vercel was serving the static asset tree only — every non-root URL returned a 404 page from the static file server before React even loaded.
- Fix: NEW `vercel.json` at repo root with `{ "source": "/(.*)", "destination": "/index.html" }`. Pushed direct to main as commit `54d0a1d9f` since the live site was visibly broken for every non-root URL. Vercel auto-redeploys on push.
- The `core.js:297` console error is most likely from a Vercel toolbar widget or a browser extension (the bundled app entry is `index-*.js`, not `core.js`). Logged as item §4-F-20 to verify post-redeploy, but tracking-not-blocking.

### Carried into P122 §4-F (production bug fixes)

- §4-F-16 — 404 hotfix [CLOSED via `54d0a1d9f`]
- §4-F-17 — Add Page broken
- §4-F-18 — Hero photo switch mutates image
- §4-F-19 — Default template tone (Hey Bradley dark/crimson) [already in §4-B-5]
- §4-F-20 — `core.js:297` console error (track post-redeploy)

DoD §3 updated: 2 boxes auto-checked from this session (`Node 22 pin` from P121 close + `404 SPA rewrite`); 2 new boxes added (`Add Page works`, `Hero photo switch preserves image URL`).

## Open log: append below as work continues

<!-- Format: ## YYYY-MM-DD — short title, then bullet entries -->
