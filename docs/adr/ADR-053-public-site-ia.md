# ADR-053: Public Site Information Architecture

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross
**Phase:** P22 (Public Website Rebuild)

## Context

Through P19, the public site = 10 page components in `src/pages/` (~3,400 LOC). `Welcome.tsx` was 918 LOC dominated by an 8-hero-showcase carousel with aspirational copy. `HowIBuiltThis.tsx` claimed 33 ADRs + 100K LOC + 71+ tests (actual: 43 ADRs / 28K LOC / 63+ tests). `Docs.tsx` claimed 10 examples + 258 media + 6 specs (actual: 17 / 300 / Blueprints generates 7 sub-specs).

Per A3 website assessment (`phase-22/wave-1/A3-website-assessment.md`), the site over-stated aspirations and under-represented shipped capabilities. Per owner directive: "less is more impactful — Don Miller / StoryBrand simple + blog-style."

## Decision

### Information architecture

5-page marketing nav: **About / AISP / BYOK / Open Core / Docs**.

Per page: blog-style article structure (long-form prose; ONE primary CTA; ONE secondary). No carousels. No stat-grid callouts. Drop multi-column comparison tables in favor of inline emphasis.

### Page roster (post-rebuild)

| Page | Route | Content shape | Primary CTA |
|---|---|---|---|
| Welcome | `/` | Hero + 55%-problem story + 3 modes + what-you-get + open-core-vs-commercial + closing CTA | Try it now → /onboarding |
| About | `/about` | Bradley + capstone + insight | Try the Builder → /onboarding |
| AISP | `/aisp` | What AISP is + dual-view example + cross-link to bar181/aisp-open-core | Try it → /onboarding |
| BYOK | `/byok` (NEW) | Why BYOK + 5 providers + 60-second setup + privacy promise + cost cap | Open the builder → /onboarding |
| Open Core | `/open-core` | 55% problem thesis + open-core-vs-commercial delineation | hey-bradley-core repo |
| Docs | `/docs` | Quick start + workflow + 16 sections + 12 themes | Try the Builder → /onboarding |
| How I Built This | `/how-i-built-this` | 21-phase trajectory + methodology + innovations + lessons | Try the Builder → /onboarding |
| Research | `/research` | AISP research bibliography (unchanged) | Read AISP repo |
| Onboarding | `/onboarding` | (in-product flow; not part of marketing rebuild) | n/a |
| Builder | `/builder` | (resolve: keep stub OR remove) | n/a |
| NotFound | `*` | 404 | Home |

### StoryBrand 7-part copy structure (applied per page)

1. **Character** — visitor with a website-spec problem
2. **Problem** — 55% pre-code phase eats time; AI tools can't read minds
3. **Guide** — Hey Bradley (empathetic voice; you've been here)
4. **Plan** — talk → site appears → specs export to your AI tool
5. **Call** — primary CTA per page
6. **Failure avoided** — your idea dies in the telephone game
7. **Success** — your idea, made visible, with executable specs

### Theme alignment

Marketing pages adopt warm-cream tokens matching the in-product app: `#faf8f5` bg, `#f1ece4` surface, `#e8772e` accent, `#2d1f12` text. **Universal across all marketing pages post-P22 fix-pass-1 F2.** The earlier "intentional dark island" caveat for OpenCore + HowIBuiltThis is **withdrawn** — they now match the warm-cream baseline. Crimson `#A51C30` and dark `#1a1a1a` tokens swept out of all 11 marketing pages.

### Content density rules

- Headlines ≤ 8 words
- Lede ≤ 35 words
- Body sections ≤ 200 words each
- Code blocks for AISP examples only
- Stats inline (not callout cards)

## Consequences

- (+) Site truthfully reflects shipped capabilities (5-provider matrix / Web Speech STT / cost cap / `.heybradley` export)
- (+) Welcome.tsx 918 → ~165 LOC (massive simplification)
- (+) New BYOK page surfaces a critical capability previously buried in Settings
- (+) Grandma persona walk improves (less to navigate; clear primary CTA per page)
- (+) Open-core-vs-commercial delineation explicit on Welcome (no confusion about Supabase)
- (-) Loss of visual flash from carousel + stat cards; mitigated by typography + composition
- (-) Migration cost: ~10 page refactors + new BYOK page (this phase)
- (-) AISP dual-view component deferred (could land in P22 fix-pass or P25 Sprint B P3)
- (-) OpenCore.tsx still uses crimson `#A51C30` accent + dark theme; theme-token unification deferred to P22 fix-pass

## Cross-references

- A3 Website assessment (`phase-22/wave-1/A3-website-assessment.md`)
- A5 Website rebuild plan (`phase-22/A5-website-rebuild-plan.md`)
- ADR-029 (no backend) — informs the open-core-vs-commercial delineation
- ADR-040 (local SQLite persistence) — informs the BYOK privacy promise
- ADR-043 (BYOK trust boundaries) — referenced from BYOK page
- ADR-046 (multi-provider LLM architecture) — informs the 5-provider table on BYOK page
- bar181/aisp-open-core ai_guide — AISP page content source

## Status as of P22 seal

- Welcome.tsx, HowIBuiltThis.tsx, Docs.tsx counts truthed
- BYOK page authored at `/byok`; nav updated
- Open-core-vs-commercial delineation appears on Welcome (and OpenCore in fix-pass)
- AISP dual-view component deferred to P22 fix-pass
- Theme-token unification across all 11 pages deferred to fix-pass
- Persona reviews not yet conducted (binding gate for P22 close — runs in fix-pass / brutal-review)
