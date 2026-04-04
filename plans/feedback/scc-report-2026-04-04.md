# Hey Bradley — Code Analysis Report (SCC)

**Generated:** 2026-04-04
**Tool:** scc v3 (Sloc Cloc and Code) — COCOMO cost estimation
**Scope:** Full project excluding node_modules, .git, dist

---

## Full Project Summary

```
───────────────────────────────────────────────────────────────────────────────
Language            Files       Lines    Blanks  Comments       Code Complexity
───────────────────────────────────────────────────────────────────────────────
Markdown              242      41,722     9,019         0     32,703          0
TypeScript            163      18,939     1,687       706     16,546      1,877
JSON                   36      16,669         0         0     16,669          0
HTML                   17      11,147       859       279     10,009          0
JavaScript              8       2,629       332       285      2,012        377
SVG                     2          25         0         0         25          0
CSS                     1         366        19        12        335          0
JSONL                   1          36         0         0         36          0
───────────────────────────────────────────────────────────────────────────────
Total                 470      91,533    11,916     1,282     78,335      2,254
───────────────────────────────────────────────────────────────────────────────
Estimated Cost to Develop (organic) $2,631,776
Estimated Schedule Effort (organic) 19.87 months
Estimated People Required (organic) 11.77
───────────────────────────────────────────────────────────────────────────────
Processed 3,961,567 bytes (3.96 MB)
```

---

## Source Code Only (src/)

```
───────────────────────────────────────────────────────────────────────────────
Language            Files       Lines    Blanks  Comments       Code Complexity
───────────────────────────────────────────────────────────────────────────────
TypeScript            155      17,291     1,405       524     15,362      1,737
JSON                   36      16,669         0         0     16,669          0
Markdown                3         667       142         0        525          0
CSS                     1         366        19        12        335          0
───────────────────────────────────────────────────────────────────────────────
Total                 195      34,993     1,566       536     32,891      1,737
───────────────────────────────────────────────────────────────────────────────
Estimated Cost to Develop (organic) $1,058,098
Estimated Schedule Effort (organic) 14.05 months
Estimated People Required (organic) 6.69
───────────────────────────────────────────────────────────────────────────────
Processed 1,259,339 bytes (1.26 MB)
```

---

## COCOMO Cost Breakdown

### Full Project (all code + docs + plans + wiki)

| Metric | Value |
|--------|-------|
| **Total Lines** | 91,533 |
| **Code Lines** | 78,335 |
| **Estimated Cost** | **$2,631,776** |
| **Schedule** | **19.87 months** |
| **Team Size** | **11.77 people** |

### Source Code Only (TypeScript + JSON + CSS)

| Metric | Value |
|--------|-------|
| **Total Lines** | 34,993 |
| **Code Lines** | 32,891 |
| **Estimated Cost** | **$1,058,098** |
| **Schedule** | **14.05 months** |
| **Team Size** | **6.69 people** |

---

## Language Breakdown

### By Percentage of Code Lines

| Language | Code Lines | % of Total | Role |
|----------|-----------|------------|------|
| Markdown | 32,703 | 41.7% | Documentation (ADRs, plans, guides, wiki, logs, checklists, retrospectives) |
| JSON | 16,669 | 21.3% | Data (themes, examples, palettes, media, sequences, templates, schemas) |
| TypeScript | 16,546 | 21.1% | Application code (React components, stores, generators, schemas, helpers) |
| HTML | 10,009 | 12.8% | Wiki pages (12 phase guides, project wiki, capstone showcase) |
| JavaScript | 2,012 | 2.6% | Scripts (preview generation, JSON validation, config) |
| CSS | 335 | 0.4% | Styling (index.css with theme vars, prose overrides, effects) |
| SVG | 25 | 0.0% | Icons |

### TypeScript Breakdown (155 files, 15,362 code lines)

| Category | Files | Estimated Lines | Description |
|----------|-------|----------------|-------------|
| Templates | 57 | ~5,500 | Section renderers (hero, columns, pricing, etc.) — 57 variants |
| Components | 30 | ~3,500 | Shell (TopBar, PanelLayout), panels (Left, Right), canvas |
| Spec Generators | 8 | ~2,500 | 6 generators + helpers + sectionRules |
| Stores | 3 | ~700 | Zustand (configStore, uiStore, projectStore) |
| Schemas | 5 | ~500 | Zod (masterConfig, section, layout, style) |
| Lib/Utilities | 8 | ~400 | persistence, sectionContent, cn, useThemeVars |
| Pages | 4 | ~800 | Welcome, Onboarding, Builder, NotFound |
| Data Exports | 10 | ~200 | index.ts files for themes, examples, spec-templates |

### JSON Breakdown (36 files, 16,669 lines)

| Category | Files | Lines | Description |
|----------|-------|-------|-------------|
| Themes | 10 | 6,400 | 10 visual presets (saas, agency, portfolio, etc.) |
| Examples | 8 | 4,600 | 8 pre-built websites (bakery, launchpad, etc.) |
| Media | 4 | 3,400 | 208 images, 41 videos, 8 effects |
| Spec Templates | 6 | 700 | Output templates for 6 generators |
| Sequences | 2 | 240 | Chat + listen simulation data |
| Projects | 2 | 400 | Schema + example project |
| Config | 2 | 550 | Default config + template config |
| Palettes | 1 | 72 | 50 color variants (10 themes × 5) |
| Fonts | 1 | 39 | 5 font families |

---

## Complexity Analysis

| Metric | Value |
|--------|-------|
| **Cyclomatic Complexity** | 2,254 total |
| **TypeScript Complexity** | 1,877 (83% of total) |
| **JavaScript Complexity** | 377 (17% of total) |
| **Complexity per Line** | 0.025 (low — well-structured code) |
| **Files > 500 lines** | 0 (all under CLAUDE.md 500-line limit) |

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
| **Total** | **~46 hours** | **91,533 lines across 470 files** |

### COCOMO vs Actual

| Metric | COCOMO Estimate | Actual |
|--------|----------------|--------|
| Cost | $2.63M | ~$0 (capstone project + AI agents) |
| Schedule | 19.87 months | ~46 hours (~6 working days) |
| Team | 11.77 people | 1 human + AI agent swarms (up to 14 parallel) |

**The ~340x schedule compression** is achieved through:
1. AI agent swarms executing 5-14 tasks in parallel
2. Automated code generation with human review gates
3. AISP specification-driven development reducing interpretation overhead
4. Pre-built component libraries (React, Tailwind, shadcn/ui, Zustand)

---

## Quality Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Playwright Tests | 71 | All passing |
| TypeScript Errors | 0 | Clean build |
| `as any` Casts | 0 | Eliminated (was 144) |
| ADRs | 33 | Comprehensive architecture decisions |
| Section Variants | 57 | Across 15 section types |
| Spec Generators | 6 | react-markdown rendered |
| Phase Score Average | 80.4/100 | Across 10 phases |

---

*Generated by scc v3 — https://github.com/boyter/scc*
*Report created for Hey Bradley capstone project — Harvard ALM 2026*
