# Hey Bradley — Code Analysis Report (SCC)

**Generated:** 2026-04-08
**Tool:** scc v3 (Sloc Cloc and Code) — COCOMO cost estimation
**Scope:** Full project excluding node_modules, .git, dist, upstreams

---

## Full Project Summary

```
─────────────────────────────────────────────────────────────────────────────────
Language            Files       Lines    Blanks  Comments       Code Complexity
─────────────────────────────────────────────────────────────────────────────────
Markdown              514     117,658    22,526         0     95,132          0
TypeScript            194      25,616     2,225     1,000     22,391      2,515
JSON                   66      24,186         5         0     24,181          0
HTML                   29      17,031     1,260       474     15,297          0
Shell                  28       4,666       774       495      3,397        550
JavaScript             20       7,303       947       804      5,552      1,088
Plain Text              3           3         0         0          3          0
BASH                    2          42        10        10         22          7
SVG                     2          25         0         0         25          0
YAML                    2         225        17        21        187          0
CSS                     1         421        24        17        380          0
JSONL                   1          36         0         0         36          0
License                 1         201        32         0        169          0
SQL                     1         305        66        72        167          0
─────────────────────────────────────────────────────────────────────────────────
Total                 864     197,718    27,886     2,893    166,939      4,160
─────────────────────────────────────────────────────────────────────────────────
Estimated Cost to Develop (organic) $5,824,800
Estimated Schedule Effort (organic) 26.87 months
Estimated People Required (organic) 19.26
─────────────────────────────────────────────────────────────────────────────────
Processed 7,472,941 bytes (7.47 MB)
```

---

## Source Code Only (src/)

```
─────────────────────────────────────────────────────────────────────────────────
Language            Files       Lines    Blanks  Comments       Code Complexity
─────────────────────────────────────────────────────────────────────────────────
TypeScript            178      22,886     1,779       678     20,429      2,333
JSON                   45      23,080         0         0     23,080          0
Markdown                3         667       142         0        525          0
CSS                     1         421        24        17        380          0
─────────────────────────────────────────────────────────────────────────────────
Total                 227      47,054     1,945       695     44,414      2,333
─────────────────────────────────────────────────────────────────────────────────
Estimated Cost to Develop (organic) $1,450,411
Estimated Schedule Effort (organic) 15.84 months
Estimated People Required (organic) 8.13
─────────────────────────────────────────────────────────────────────────────────
Processed 1,736,071 bytes (1.74 MB)
```

---

## COCOMO Cost Breakdown

### Full Project (all code + docs + plans + wiki)

| Metric | Value |
|--------|-------|
| **Total Lines** | 197,718 |
| **Code Lines** | 166,939 |
| **Estimated Cost** | **$5,824,800** |
| **Schedule** | **26.87 months** |
| **Team Size** | **19.26 people** |

### Source Code Only (TypeScript + JSON + CSS)

| Metric | Value |
|--------|-------|
| **Total Lines** | 47,054 |
| **Code Lines** | 44,414 |
| **Estimated Cost** | **$1,450,411** |
| **Schedule** | **15.84 months** |
| **Team Size** | **8.13 people** |

---

## Key Metrics Comparison (April 5 vs April 8)

| Metric | April 5 | April 8 | Delta |
|--------|---------|---------|-------|
| **Total Files** | 801 | 864 | +63 (+7.9%) |
| **Total Lines** | 183,971 | 197,718 | +13,747 (+7.5%) |
| **Code Lines** | 155,218 | 166,939 | +11,721 (+7.5%) |
| **TS Files (all)** | 182 | 194 | +12 (+6.6%) |
| **TS Code Lines** | 19,935 | 22,391 | +2,456 (+12.3%) |
| **TS Code Lines (src)** | 18,398 | 20,429 | +2,031 (+11.0%) |
| **JSON Lines** | 23,375 | 24,181 | +806 (+3.4%) |
| **CSS Lines** | 380 | 380 | 0 (unchanged) |
| **Markdown Files** | 493 | 514 | +21 (+4.3%) |
| **Markdown Lines** | 92,017 | 95,132 | +3,115 (+3.4%) |
| **HTML Pages** | 19 | 29 | +10 (+52.6%) |
| **Shell Scripts** | 27 | 28 | +1 (+3.7%) |
| **Complexity** | 3,929 | 4,160 | +231 (+5.9%) |
| **COCOMO Cost (full)** | $5,396,484 | $5,824,800 | +$428,316 (+7.9%) |
| **COCOMO Cost (src)** | $1,373,940 | $1,450,411 | +$76,471 (+5.6%) |
| **Processed Bytes** | 6.76 MB | 7.47 MB | +0.71 MB (+10.5%) |

---

## Language Breakdown

### By Percentage of Code Lines

| Language | Code Lines | % of Total | Role |
|----------|-----------|------------|------|
| Markdown | 95,132 | 57.0% | Documentation (ADRs, plans, guides, wiki, logs, checklists, retrospectives) |
| JSON | 24,181 | 14.5% | Data (themes, examples, palettes, media, sequences, templates, schemas) |
| TypeScript | 22,391 | 13.4% | Application code (React components, stores, generators, schemas, helpers) |
| HTML | 15,297 | 9.2% | Wiki pages (phase guides, project wiki, capstone showcase, story pages) |
| JavaScript | 5,552 | 3.3% | Scripts (preview generation, JSON validation, config) |
| Shell | 3,397 | 2.0% | Automation scripts |
| CSS | 380 | 0.2% | Styling (index.css with theme vars, prose overrides, effects) |
| YAML | 187 | 0.1% | Configuration |
| License | 169 | 0.1% | License |
| SQL | 167 | 0.1% | Database schema |
| JSONL | 36 | 0.0% | Structured data |
| SVG | 25 | 0.0% | Icons |
| BASH | 22 | 0.0% | Shell scripts |

### TypeScript Breakdown (178 src files, 20,429 code lines)

| Category | Files | Estimated Lines | Description |
|----------|-------|----------------|-------------|
| Components | 58 | ~9,700 | Shell (TopBar, PanelLayout), panels (Left, Right), canvas, UI, listen mode |
| Templates | 69 | ~4,900 | Section renderers (hero, columns, pricing, etc.) — 69 variants across 21 types |
| Pages | 10 | ~4,200 | Welcome, Onboarding, Builder, About, AISP, Research, OpenCore, HowIBuiltThis, Docs, NotFound |
| Spec Generators | 8 | ~2,000 | 6 generators + helpers + sectionRules |
| Lib/Utilities | 8 | ~925 | persistence, sectionContent, cn, useThemeVars |
| Store | 3 | ~880 | Zustand (configStore, uiStore, projectStore) |
| Schemas | 5 | ~450 | Zod (masterConfig, section, layout, style) |
| Data Exports | 10 | ~240 | index.ts files for themes, examples, spec-templates |
| Hooks | 2 | ~8 | Custom React hooks |

### JSON Breakdown (45 files, 23,080 lines)

| Category | Files | Lines | Description |
|----------|-------|-------|-------------|
| Examples | 15 | 8,251 | 15 pre-built websites (bakery, launchpad, restaurant, etc.) |
| Themes | 12 | 7,646 | 12 visual presets (saas, agency, portfolio, blog, wellness, etc.) |
| Media | 4 | 5,025 | 300 images, 41 videos, 13 effects |
| Spec Templates | 7 | 680 | Output templates for 6 generators + schema |
| Config | 2 | 434 | Default config + template config |
| Projects | 2 | 400 | Schema + example project |
| Sequences | 2 | 193 | Chat + listen simulation data |
| Palettes | 1 | 86 | Color variants (12 themes x 5) |
| Fonts | 1 | 39 | 5 font families |

---

## Complexity Analysis

| Metric | Value |
|--------|-------|
| **Cyclomatic Complexity** | 4,160 total |
| **TypeScript Complexity** | 2,515 (60% of total) |
| **JavaScript Complexity** | 1,088 (26% of total) |
| **Shell Complexity** | 557 (13% of total) |
| **Complexity per Line** | 0.025 (low — well-structured code) |
| **Files > 500 lines** | 2 (configStore.ts ~635, Welcome.tsx ~760) |

---

## Effort Context

### Actual Development

| Phase | Duration | Key Output |
|-------|----------|------------|
| Phase 1-3 | ~12 hours | Core builder (scaffolding, themes, panels) |
| Phase 4-6 | ~12 hours | Examples, chat/listen simulation, polish |
| Phase 7-8 | ~8 hours | Demo flow, kitchen sink, image library |
| Phase 9 | ~10 hours | Pre-LLM MVP (upload, save/load, pricing, specs, react-markdown) |
| Phase 10 | ~4 hours | JSON architecture, AISP section-level atoms |
| Phase 11 | ~6 hours | Enhanced demos, website pages, content expansion, brand locks |
| Phase 12 | ~6 hours | New themes/examples, expanded media, sprint variants, shell scripts |
| Phase 13 | ~6 hours | Blog section, multi-page, ZIP export, a11y, 100+ tests |
| Phase 14 | ~4 hours | Marketing review: 20 issues fixed, AISP validation, UI/UX cleanup |
| Phase 15-16 | ~6 hours | Developer assistance, image effects audit, wiki expansion |
| **Total** | **~74 hours** | **197,718 lines across 864 files** |

### COCOMO vs Actual

| Metric | COCOMO Estimate | Actual |
|--------|----------------|--------|
| Cost | $5.82M | ~$0 (capstone project + AI agents) |
| Schedule | 26.87 months | ~74 hours (~9.25 working days) |
| Team | 19.26 people | 1 human + AI agent swarms (up to 15 parallel) |

**The ~470x schedule compression** is achieved through:
1. AI agent swarms executing 5-15 tasks in parallel
2. Automated code generation with human review gates
3. AISP specification-driven development reducing interpretation overhead
4. Pre-built component libraries (React, Tailwind, shadcn/ui, Zustand)

---

## Current Asset Inventory

| Asset | Count | Change from April 5 |
|-------|-------|---------------------|
| **Themes** | 12 | 0 (unchanged) |
| **Examples** | 15 | 0 (unchanged) |
| **Images** | 300 | 0 (unchanged) |
| **Videos** | 41 | 0 (unchanged) |
| **Effects** | 13 | 0 (unchanged) |
| **Section Types** | 21 | 0 (unchanged) |
| **Section Variants** | 69 | 0 (unchanged) |
| **Spec Generators** | 6 | 0 (unchanged) |
| **Spec Templates** | 7 | 0 (unchanged) |
| **Test Files** | 11 | +1 |
| **Test Cases** | 102 | +15 |
| **Wiki Pages (HTML)** | 22 | +6 (story, ruflo, ruvector, standalone guides) |
| **ADRs** | 37 | +32 |
| **Website Pages** | 10 | +6 (About, AISP, Research, OpenCore, HowIBuiltThis, Docs) |
| **Shell Scripts** | 28 | +1 |
| **Markdown Docs** | 514 | +21 |

---

## Quality Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Playwright Tests | 102 | All passing |
| TypeScript Errors | 0 | Clean build |
| `as any` Casts | 0 | Eliminated |
| ADRs | 37 | Architecture decisions documented |
| Section Variants | 69 | Across 21 section types |
| Spec Generators | 6 | react-markdown rendered |
| Phase Score (latest) | 74/100 | Phase 14 CLOSED |

---

## April 8 Session Highlights

- Fixed Vercel deploy TS2352 error (configStore.ts window cast)
- Rewrote Open Core page: removed pricing, added 55% bottleneck narrative, spec-first methodology, fit & value chart
- Home page overhaul: 3 modes (Listen/Chat/Builder) with images, chat demo with manual start, scoped scroll fix, theme showcase grid
- Research page rewrite: blog-format Don Miller narrative with inline images and visualizations
- Updated favicon to custom Bradley "B" icon
- ScrollToTop component for proper page navigation

---

*Generated by scc v3 — https://github.com/boyter/scc*
*Report created for Hey Bradley capstone project — Harvard ALM 2026*
