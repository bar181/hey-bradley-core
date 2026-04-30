# P64 / OC-3 — Templates Round 1 Preflight

> **Phase:** P64 · **Sprint:** OC-3 (P1 launch-blocking)
> **Date opened:** 2026-04-30 (drafted while OC-2 dispatches)
> **Status:** PENDING — opens after OC-2 seals
> **Predecessor:** P63 / OC-2 onboarding redesign
> **Strategic vision:** `plans/strategic-reviews/2026-04-30-three-mode-vision.md`

---

## Recon — current template inventory

23 templates total (17 JSON + 6 hand-curated TS). The 3rd-party reviewer
claim "10 templates, need 40+" was off; actual baseline is 23.

**Current vertical coverage (verified):**
- ✅ SaaS / dev tools (enterprise-saas, launchpad, kitchen-sink, dev-portfolio, indie-portfolio, saas-founder)
- ✅ Local business (bakery, florist, restaurant, real-estate, law-firm, education, fitforge, local-business)
- ✅ Personal brand (photography, ai-engineer-personal, indie-portfolio)
- ✅ Content / blog (fun-blog, blog-standard, capstone)
- ✅ Professional services (consulting, b2b-agency, law-firm)
- ❌ E-commerce / online store
- ❌ Conference / event landing
- ❌ Healthcare / wellness
- ❌ Podcast / audio show
- ❌ Non-profit / mission-driven

OC-3 Round 1 closes the **3 highest-leverage gaps**: e-commerce, conference,
podcast. OC-4 Round 2 adds healthcare + non-profit + search/filter UI.

---

## Three new templates this sprint

| Slug | Title | Vertical | Aesthetic |
|---|---|---|---|
| `coffee-roaster.json` | Beanstalk Coffee Co. | E-commerce (subscription product) | Warm earth tones · serif headings (Fraunces) · product-card grid |
| `dev-conference.json` | ShipFast Conf 2026 | Conference / event landing | Dark mode · monospace accents (JetBrains Mono) · countdown + speakers grid |
| `podcast-show.json` | Build Mode | Podcast (agentic engineering show) | Bold display type (Inter Display) · episode card list · audio-affordance UI |

Each template:
- Real, on-brand copy (no Lorem, no generic placeholder)
- Hero padding `80px 24px` (per OC-1 design discipline)
- Theme-token references where available; consistent `style:` block shape
- ≥ 6 sections (matches existing template shape)
- Vertical-distinct visual identity

---

## Hard rules

1. **NO copy reuse from existing templates.** Each new template owns its
   voice.
2. **NO new section types.** OC-7 owns those. If a vertical needs a new
   section (e.g., podcast needs an episode-card list), use existing
   `columns` or `gallery` with content-type-appropriate components.
3. **NO image library expansion.** Use existing media catalog (300 images)
   or text-only / CSS-gradient hero.
4. **NO hand-curated TS template format.** All three new templates are
   `.json` (matches existing JSON-template registry path).
5. **YES register all three** in `src/data/examples/index.ts` with proper
   slug, title, persona, aesthetic notes.
6. **NO shell commands inside agent.**

---

## Acceptance gates

- 3 new `.json` template files in `src/data/examples/`
- Each registered in `src/data/examples/index.ts` with metadata
- Each ≥ 6 sections, real-copy, vertical-distinct
- Each passes the OC-1 design-token discipline check (hero padding,
  no `system-ui`, no redundant `fontFamily`+`borderRadius` in hero `style:`)
- Test spec `tests/p64-oc3-templates-round1.spec.ts` (6+ PURE-UNIT cases)
- Cumulative test count: 405 + 6+ = 411+ GREEN
- `npx tsc --noEmit` clean

---

## Successor

OC-4 Templates Round 2 — adds healthcare + non-profit templates + search/
filter UI for the template browser. Single-agent dispatch, no owner blocker.
