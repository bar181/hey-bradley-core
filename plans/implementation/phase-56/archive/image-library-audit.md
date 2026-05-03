# P56 Image Library Audit — Sprint M Wave 1, Agent A6

**Owner:** A6 (data-only) | **Sprint:** M | **Date:** 2026-04-29

## 1. Current State (`src/data/media/images.json` v1.0.0)

- **Total:** 300 images across **13 categories**
- **By category (count):**
  - food 40 | technology 36 | business 36 | nature 34 | people 26 | abstract 24 | products 21 | creative 20 | fitness 20 | architecture 20 | real-estate 13 | healthcare 5 | education 5
- **Schema (per entry):** `id`, `url`, `thumbnail`, `category`, `subcategory`, `tags[]`, `mood`, `color_dominant`, `orientation`, `description`, `ai_prompt_context`
- **URL convention:** `https://images.unsplash.com/photo-{id}?w=1200&auto=format&q=80` (full) and `?w=400&auto=format&q=60` (thumb). New entries adopt the spec-stated `?w=1200&q=80&auto=format&fit=crop` pattern with `fit=crop` added — Unsplash CDN accepts both, no breakage.

## 2. Identified Gaps for Sprint M Templates

| Template | Gap | Existing pool |
|---|---|---|
| **A1 SaaS Founder** (clean, blue/slate) | Only 1 `business-startup-*` and 4 `business-office-*`; no founder-portrait-with-laptop, no stylized-product-screenshot, no SaaS-pricing-bg gradient | thin |
| **A2 Indie Portfolio** (bold, high-contrast) | Most `creative-*` entries are mid-contrast; no bold black/dark portfolio shots, sparse typography samples, no dark-mode work tiles | weakest gap |
| **A3 B2B Agency** (warm tones, process) | Most `business-meeting-*` and `people-team-*` are cool/neutral; no warm-toned client/handshake/case-study product shots | medium |

## 3. Additions — `src/data/media/images-sprint-m-additions.json`

- **25 new curated entries** (separate file to keep schema risk at zero):
  - **9 SaaS Founder** — `saas-founder-*`, `saas-product-*`, `saas-workspace-*`, `saas-team-*`, `saas-code-*`, `saas-pricing-bg-*`, `saas-meeting-*` (blue/slate palette `#3b82f6` / `#475569` / `#0f172a`)
  - **8 Indie Portfolio** — `indie-portfolio-work-*`, `-art-*`, `-design-sample-*`, `-studio-*`, `-portrait-*`, `-abstract-*`, `-process-*`, `-typography-*` (high-contrast `#0a0a0a` / `#171717`)
  - **8 B2B Agency** — `agency-team-warm-*`, `-process-*`, `-meeting-warm-*`, `-case-study-*`, `-product-shot-*`, `-leadership-*`, `-office-warm-*`, `-handshake-*` (warm tones `#a16207` / `#854d0e` / `#7c2d12`)
- **Categories used:** business, people, technology, abstract, creative, products (all pre-existing — no new categories introduced)
- **Subcategories used:** all map to existing subcategory values surveyed via audit script

## 4. Schema Risk: **NONE**

- New entries placed in **separate file** `images-sprint-m-additions.json` — main catalog untouched
- Every field matches main-catalog schema 1:1
- All categories already in `images.json.categories[]`
- ImagePicker.tsx imports only `images.json` — additions file is dormant until a future merge phase wires it in (or it can be merged manually by appending `entries[]` into `images[]` and bumping `total`)

## 5. Verification

- `node -e` JSON parse: **valid**, 25 entries, 0 duplicate IDs, 0 URL-pattern violations
- `npx tsc --noEmit`: **exit 0** (data-only change; no TS impact)
- No React component edits; no template edits; no A4 doc touched

## 6. Handoff Notes

- A future phase (or A1/A2/A3 template wiring) can merge `entries[]` into `images.json.images[]` and update `total: 300 → 325`. KISS.
- Picker still works unchanged today — additions file is staged, non-breaking.
