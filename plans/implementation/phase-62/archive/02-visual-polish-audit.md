# P62 / OC-1 — Visual Polish Audit

> **Phase:** P62 · **Sprint:** OC-1 · **Date:** 2026-04-30
> **Scope:** 17 JSON templates in `src/data/examples/*.json`. The 6
> hand-curated TS templates are the design ceiling reference — out of
> scope per preflight hard rules.

---

## Color discipline — hex codes inside `style:` blocks

Counts hex strings (`#rrggbb` / `#rgb` / `#rrggbbaa`) appearing as
literal values inside section `style:` blocks (not in `theme.palette`,
which is the legitimate token home).

| Template | Style-block hex count | Notes |
|---|---:|---|
| `kitchen-sink.json` | 32 | OFF-LIMITS this sprint (hard rule) |
| `capstone.json` | 26 | Worst non-kitchen-sink offender |
| `real-estate.json` | 16 | Tied 3rd; 14 are theme-palette duplicates |
| `law-firm.json` | 16 | |
| `enterprise-saas.json` | 16 | 2nd worst; also fontFamily override |
| `consulting.json` | 16 | |
| `education.json` | 15 | |
| `restaurant.json` | 14 | |
| `fun-blog.json` | 14 | |
| `florist.json` | 14 | |
| `fitforge.json` | 14 | |
| `dev-portfolio.json` | 14 | |
| `bakery.json` | 14 | |
| `photography.json` | 12 | |
| `launchpad.json` | 11 | |
| `blank.json` | 8 | by design — minimal canvas |
| `blog-standard.json` | 6 | cleanest |

**Pattern:** style-block hex values DUPLICATE `theme.palette` tokens
(e.g. capstone uses `#1a1a1a` in 6+ section backgrounds, identical to
`theme.palette.bgPrimary`). Future palette swaps require N inline
edits instead of 1 token edit.

---

## Typography discipline — `fontFamily` overrides on `hero` style

Hero `style.fontFamily` is redundant when it matches
`theme.typography.fontFamily`. Inline overrides defeat theme inheritance.

| Template | Theme `fontFamily` | Hero `style.fontFamily` | Drift? |
|---|---|---|---|
| `capstone.json` | Inter | Inter | redundant override |
| `enterprise-saas.json` | Inter | Inter | redundant override |
| `real-estate.json` | Inter | Inter | redundant override |
| `consulting.json` | Inter | Inter | redundant override |
| `kitchen-sink.json` | Inter | Inter | redundant (OFF-LIMITS) |
| `law-firm.json` | Georgia | Georgia | redundant override |
| `bakery.json` | Fraunces | Fraunces | redundant override |
| `florist.json` | Fraunces | Fraunces | redundant override |
| `restaurant.json` | Georgia | Georgia | redundant override |
| `dev-portfolio.json` | Inter | Inter | redundant override |
| `education.json` | Inter | Inter | redundant override |
| `fitforge.json` | Inter | Inter | redundant override |
| `launchpad.json` | Inter | Inter | redundant override |
| `photography.json` | Playfair Display | Playfair Display | redundant override |
| `fun-blog.json` | Playfair Display | Georgia | DRIFT — heading vs body mismatch |
| `real-estate.json` | Inter | Inter | redundant override |
| `blank.json` | Inter | (none) | clean |
| `blog-standard.json` | DM Sans | (none) | clean |

**`system-ui` audit:** zero JSON templates use `system-ui` as primary.

**Premium families** (hand-curated TS template ceiling): `Inter`,
`JetBrains Mono`, `Fraunces`, `Playfair Display`. All JSON templates
align except `fun-blog.json` (Playfair head + Georgia body, intentional).

---

## Spacing rhythm — hero `padding` consistency

Target standard: **`80px 24px` desktop hero** (matches `saas-founder`
desktop ratio adjusted for non-flagship containers; matches 12 of 17
JSON templates already).

| Template | Hero padding | Status |
|---|---|---|
| `bakery.json` | `80px 24px` | aligned |
| `consulting.json` | `80px 24px` | aligned |
| `dev-portfolio.json` | `80px 24px` | aligned |
| `education.json` | `80px 24px` | aligned |
| `fitforge.json` | `80px 24px` | aligned |
| `florist.json` | `80px 24px` | aligned |
| `fun-blog.json` | `80px 24px` | aligned |
| `kitchen-sink.json` | `80px 24px` | aligned (OFF-LIMITS) |
| `launchpad.json` | `80px 24px` | aligned |
| `law-firm.json` | `80px 24px` | aligned |
| `photography.json` | `80px 24px` | aligned |
| `real-estate.json` | `80px 24px` | aligned |
| `restaurant.json` | `80px 24px` | aligned |
| `enterprise-saas.json` | `96px 24px` | DRIFT (+16px taller) |
| `blog-standard.json` | `96px 24px` | DRIFT (acceptable for editorial single-article hero) |
| `capstone.json` | `100px 24px` | DRIFT (+20px taller, no editorial reason) |
| `blank.json` | `120px 24px` | by design — empty canvas needs vertical breathing room |

---

## Top 3 visually-weakest templates (improvement targets)

Selected by combined drift score: hex-discipline weight + hero-padding
drift + redundant typography override.

1. **`capstone.json`** — 26 style-block hex (worst non-kitchen-sink)
   + `100px 24px` hero pad (worst rhythm drift) + redundant
   `fontFamily: "Inter"` + redundant `borderRadius: "0px"` on hero.
2. **`enterprise-saas.json`** — 16 style-block hex + `96px 24px` hero
   pad drift + redundant `fontFamily: "Inter"` + redundant
   `borderRadius: "0px"` on hero.
3. **`real-estate.json`** — 16 style-block hex (tied 3rd) + redundant
   `fontFamily: "Inter"` + redundant `borderRadius: "0px"` on hero.
   Hero padding already `80px 24px` so improvement is pure typography
   discipline pass.
