# Architecture Decision Records (ADR) Index

**Last updated:** 2026-05-07 (P119 / SITE-POLISH) · **Total files on disk:** 139 · **Highest-ID:** ADR-148

This directory contains the Architecture Decision Records for the Hey Bradley project. Each ADR captures one architectural decision, its context, and its consequences in immutable form.

> **Truth-up note:** Prior to P109 this README claimed 38 ADRs through ADR-048 (last touched 2026-04-27 / post-P19). Disk reality at P108 seal was 127 files through ADR-136 across 60+ phases. P109 / ADR-LEDGER-TRUTH-UP rebuilds the ledger to disk reality; the P109 closer added ADR-137 same-sprint. P110 / ADR-EXPORT added ADR-138; P111 / DOGFOOD-GATES added ADR-139 (130 files / ADR-139 highest-ID); P112 / GAP-CLOSURE added ADR-140; P113 / QUALITY-PUSH added ADR-141 (132 files / ADR-141 highest-ID); P114 / FEATURE-AUDIT + FIX added ADR-142; P115 / VISUAL-QUALITY-BUILDER-POLISH added ADR-143 (134 files / ADR-143 highest-ID); P116 / FINAL-POLISH added ADR-144 (135 files / ADR-144 highest-ID); P117 / SECTION-CAPABILITY-AUDIT-FIX added ADR-145 (136 files / ADR-145 highest-ID); P118 / SIMPLE-MESSAGING-AND-POSITIONING added ADR-146 (137 files / ADR-146 highest-ID); P118.5 / WALKTHROUGH added ADR-147 (138 files / ADR-147 highest-ID); P119 / SITE-POLISH added ADR-148 (139 files / ADR-148 highest-ID). Source-of-truth for every entry below is the actual ADR file's first heading.

---

## Format

Each ADR uses a consistent shape: a `# ADR-NNN: Title` first-line heading, a `Status:` line (`Proposed` → `Accepted` → optionally `Superseded by ADR-XXX`), and prose covering Context / Decision / Consequences / cross-references to related ADRs. ADRs are numbered append-only — once a number is assigned to a draft, that number is burned even if the draft is later rejected, withdrawn, or superseded. Do NOT re-use any of the documented gap numbers.

---

## ADRs by phase family

### Foundation (P11-P15) — JSON SSOT, brand, AISP pivot

- ADR-001 — JSON as Single Source of Truth
- ADR-005 — Zustand for State Management
- ADR-009b — Warm Light Chrome (Supersedes ADR-009)
- ADR-010 — JSON as Single Source of Truth (Reinforced)
- ADR-011 — Mandatory Visual Quality Gate
- ADR-012 — Three-Level JSON Hierarchy
- ADR-013 — Section Self-Containment
- ADR-014 — Template Superset
- ADR-015 — JSON Diff as Universal Update Format
- ADR-016 — Component-Level Configuration
- ADR-017 — Theme Names Use Invisible Design (Familiar Category Names)
- ADR-018 — Theme as Full JSON Template Replacement (with Meta Block)
- ADR-019 — 6-Slot Color Palette System
- ADR-020 — Component Visibility Per Theme
- ADR-021 — CSS Custom Properties for Theme Colors
- ADR-022 — Section Type Registry
- ADR-023 — Section Naming — Hybrid Approach
- ADR-024 — Layout Variants — 8 Per Section with Column Selector
- ADR-025 — Visual-First Section Design
- ADR-026 — AISP Spec as Primary Output
- ADR-027 — Micro-Interaction Standards
- ADR-028 — Section Headings and Subheadings
- ADR-029 — Pre-LLM MVP Architecture (Stage 2) — *Status: Proposed*
- ADR-030 — Spec Rendering Architecture — Markdown to Professional Documents — *Status: Proposed*
- ADR-031 — JSON Data Architecture — Standardized Schema with Metadata — *Status: Proposed*
- ADR-032 — AISP Section-Level Crystal Atoms
- ADR-033 — AISP Brownfield Integration — reuse(), extends(), imports() Operators — *Status: Proposed*
- ADR-038 — Kitchen Sink Reference Example — Single JSON Exercising Every Section Type
- ADR-039 — Standard Blog Page — Canonical Novice Starter

### Local DB + LLM stack (P16-P19) — sql.js, BYOK, JSON Patch, STT

- ADR-040 — Local SQLite Persistence — sql.js + IndexedDB
- ADR-040b — Migration 003 FK on `llm_logs.session_id` — Formal Deferral
- ADR-041 — Schema Versioning — Forward-Only SQL Migrations
- ADR-042 — LLM Provider Abstraction — Browser-only, BYOK + Env Var
- ADR-043 — API Key Storage & Trust Boundaries
- ADR-044 — JSON Patch as the LLM Return Contract
- ADR-045 — System Prompt = AISP Crystal Atom
- ADR-046 — Multi-Provider LLM Architecture — Five Adapters Behind One Interface
- ADR-047 — LLM Logging & Observability — `llm_logs` Alongside `llm_calls`
- ADR-048 — STT for Listen Mode — Web Speech API, Push-to-Talk Only

### MVP close + cleanup (P20-P22)

- ADR-049 — Cost-Cap Telemetry & Hard Cap
- ADR-050 — Template-First Chat Architecture
- ADR-051 — Intent Translator — Messy Input → Structured To-Do — *Status: Proposed (P21 stub; full content lands in P25)*
- ADR-052 — AISP Intent Classifier — Crystal Atom for Intent Recognition — *Status: Proposed (P21 stub; full content lands in P26)*
- ADR-053 — Public Site Information Architecture (P22)

### Sprint B (P23-P25) — Template-first chat + section targeting + intent translation

- ADR-051 — Section Targeting Syntax — `/type-N` Keyword Scoping (P24)
- ADR-052 — Intent Translator — Messy Input → Canonical Form (P25)

### Sprint C (P26-P28) — AISP instruction layer + LLM-Native AISP + 2-step selection

- ADR-053 — AISP Intent Classifier — Crystal Atom for Intent Recognition (P26)
- ADR-054 — DDD Bounded Contexts (Post-P20 Reality)
- ADR-055 — AISP Conversion + Verification — Authoring Phase Steps in Proper AISP Format
- ADR-056 — LLM-Native AISP Understanding — Capstone Thesis Claim (P27)
- ADR-057 — 2-Step AISP Template Selection (P28; SUPERSEDED — see below)

### Sprint D (P29-P33) — Template library + persistence + content generators

- ADR-058 — Template Library API
- ADR-059 — Template Persistence
- ADR-060 — Content Generators (CONTENT_ATOM)
- ADR-061 — Multi-section Content Pipeline (Section-aware Defaults)
- ADR-062 — Content + Template Bridge (kind dispatch)

### Sprint E (P34-P35) — Assumptions engine + LLM lift

- ADR-063 — Assumptions Engine + 3-Button Clarification UX
- ADR-064 — ASSUMPTIONS_ATOM Crystal Atom + LLM Lift + EXPERT Pipeline Trace

### Sprint F (P36-P38) — Listen+AISP unification + commands+route split

- ADR-065 — Listen + AISP Pipeline Unification (Review-First Voice UX)
- ADR-066 — Unified Command System + Content / Design Route Split

### Sprint H (P44-P46) — Reference uploads + brand context

- ADR-067 — Reference Upload + Brand Context Architecture
- ADR-068 — Codebase Reference Ingestion
- ADR-069 — Context Management (Reference Summary Surface)

### Sprint I (P47-P49) — Builder UX + quick-add + mobile polish

- ADR-070 — Builder UX Enhancement
- ADR-071 — Builder Enhancements — Quick-add Picker + Areas for Improvement
- ADR-072 — Sprint I Wave 3 — Mobile Polish + C11 Closure

### Sprint J (P50-P53) — Personality + conversation log + share + mobile UX

- ADR-073 — Personality Engine + Composition (No Σ Widening)
- ADR-074 — Personality Picker UI + First-Run Onboarding Step
- ADR-075 — Conversation Log Viewer + Share Spec
- ADR-076 — Mobile UX Overhaul (north-star X8 bifurcation) — *SUPERSEDED by ADR-090*

### Moat sprints K-N (P54-P57) — Speed visible / Spec unmissable / Premium templates / Shareable output

- ADR-077 — Speed Visible — Patch Latency Badge (P54 / Sprint K)
- ADR-078 — Spec Unmissable — AISP Always-On + Auto-Open + Primary Tab (P55 / Sprint L)
- ADR-079 — Premium Template Design System (P56 / Sprint M)
- ADR-080 — Public Site Refresh — Blog System + Progress Snapshot (P57 / Wave 1)
- ADR-081 — Shareable Output — Static HTML Export + Hosted Spec Link Stub + Attribution (P57 / Wave 2)

### RC + QA (P58-P60) — Open Core RC + test corpus + comprehensive QA

- ADR-082 — Open Core RC v1.0.0-RC1 — README + CLAUDE Final + Demo Video + Agentics Foundation Beta (P58)
- ADR-083 — Test Library Architecture (Prompt Corpus) (P59)
- ADR-084 — Comprehensive QA Architecture (P60)

### Open Core arc (P61-P83) — Multi-page + design tokens + mode arch + polish + templates + AISP adoption

- ADR-085 — Multi-Page MVP for Open-Core (OC-11) (P61)
- ADR-086 — Process Pages: Content vs Runtime Split (P61)
- ADR-087 — Design Token System + Component Quality Standard (P65 / OC-2.5)
- ADR-088 — Mode Architecture (Whiteboard / Planning / Agentics) (P63 / OC-2)
- ADR-089 — Agentics Data Model (Phases / Sprints / Waves / Agents) (P63 / OC-2)
- ADR-090 — Mobile UX Redesign (P69 / OC-5; supersedes ADR-076)
- ADR-091 — Canonical Component Quality Standard (P65b / OC-2.5 Wave 2)
- ADR-092 — Polish Sprint Architecture (P66 Wave 1)
- ADR-093 — Component Decomposition Standard (P67 / Polish Wave 2)
- ADR-094 — Professional Grade Standard (P67b / Close the Gap)
- ADR-095 — Library-Wide Polish Standard (P67c)
- ADR-096 — Template Library Expansion Standard (P68 / OC-4)
- ADR-097 — Blog Content Strategy (P71 / OC-13)
- ADR-098 — Template Intelligence Architecture (P72 / OC-TI)
- ADR-099 — DECOMP_ATOM — Multi-Clause Decomposition Crystal Atom (P74 / OC-DECOMP)
- ADR-100 — Section Type Completeness Standard (P75 / OC-7)
- ADR-101 — Spec Export Quality Standard (P76 / OC-9)
- ADR-102 — Performance + Accessibility Standard (P77 / OC-10)
- ADR-103 — Multi-Page MVP Wire (P78 / OC-11)
- ADR-104 — Page-Aware Chat Pipeline (P79 / OC-14)
- ADR-105 — Agentic-Product Templates (P80 / OC-15)
- ADR-106 — Prompt Library Completeness Standard (P81 / OC-16)
- ADR-107 — OC-CLEANUP Standard (P82 / OC-CLEANUP)
- ADR-108 — AISP Adoption Standard (P83 / OC-17)

### v1.0.0-RC1 + polish + Tier-2 foundation (P84-P89)

- ADR-109 — Open Core v1.0.0-RC1 Architecture (P84 / OC-18)
- ADR-110 — AISP Visibility Standard (P85)
- ADR-111 — Final Polish Standard (Library-Wide) (P86 / OC-POLISH-W4)
- ADR-112 — Marketing Site Mobile Standard (P87 / OC-5-MKT-MOBILE)
- ADR-113 — Section Type Visual Quality Standard (P88)
- ADR-114 — Supabase Architecture Decision (P89 / TIER2-FOUNDATION; now flagged Tier-2 planning)
- ADR-115 — Open Core / Commercial Feature Flag Architecture (P89; now flagged Tier-2 planning)

### Agentic Workbench arc (P90-P96) — Three-mode product + process map + 3 new atoms + workbench + export

- ADR-116 — Three-Mode Product Architecture (P90 / AW-MODE-ARCH)
- ADR-117 — Process Map SVG Architecture (P91 / AW-PROCESS-MAP)
- ADR-118 — PROCESS_ATOM (6th Crystal Atom) (P92 / AW-PROCESS-ATOM)
- ADR-119 — DDD_ATOM (7th Crystal Atom) (P93 / AW-DDD-ATOM)
- ADR-120 — AGENT_ATOM (8th + final Crystal Atom) (P94 / AW-AGENT-ATOM)
- ADR-121 — SpecWorkbench Architecture (P95 / SPEC-WORKBENCH)
- ADR-122 — Export Claude Code (Markdown Bundle) (P96 / AW-EXPORT-CLAUDE-CODE)

### Methodology surface + comprehensive logging (P97-P100)

- ADR-126 — Comprehensive LLM Interaction Logging (P100 W2 / LOG-BUILD)
- ADR-127 — Format Verification + Top-3 Atom-Helper Fixes (P100 W2 / FMT-VERIFY)
- ADR-128 — TDD Scaffold + AGENT_ATOM Production Wire (P97 / TDD-SCAFFOLD)
- ADR-129 — KISS Review Architecture (P98 / KISS-REVIEW)
- ADR-130 — Seal Panel + EOP Persistence (P99 / SEAL-PANEL)

### v2.0.0-RC1 boundary + RC1 hardening (P101-P109)

- ADR-131 — Agentic Workbench RC Architecture (P101 / AW-RC)
- ADR-132 — Final QA · Token Migration · Agentics Live-Wire · v2.0.0-RC1 Persona Gate (P102 / OC-POLISH-W5)
- ADR-133 — v2.0.0-RC1 Open Core Boundary (P103 / RC-RELEASE)
- ADR-134 — Dead-Code Purge + Atom→View Inversion Fix + Section-Enum Reconciliation (P106)
- ADR-135 — Log Integrity Expansion (event_type Wires + writeErrorEvent Helper) (P107)
- ADR-136 — Test Runtime Shift (Mobile Viewports + Behavioral Helper Coverage + p76 Audit Correction) (P108)
- ADR-137 — ADR Ledger Truth-Up + Section-Enum Drift Regression Guard (P109)

### Post-RC hardening (P110-P119)

- ADR-138 — Export Completeness Standard + ADR Enforcement Architecture (P110 / ADR-EXPORT)
- ADR-139 — Dogfood Gates + DDD/ADR Output Priority (P111 / DOGFOOD-GATES)
- ADR-140 — Gap Closure Stopgaps (AISP Score TS Heuristic + ADR README CI Drift Guard + GitHub Actions Gates) (P112 / GAP-CLOSURE)
- ADR-141 — Quality Push (AISP Density + Storytelling Library + Opinionated Personas + Voice Extraction) (P113 / QUALITY-PUSH)
- ADR-142 — Feature Audit + Fix (Persistence Wire + Cost Cap + Image Picker + UX Truth-Up) (P114 / FEATURE-AUDIT + FIX)
- ADR-143 — Visual Quality + Builder Polish (Builder UX ≥8.5 + Long-form Typography + Image Interactions + Bottom-15 Lift + 3 Demos) (P115 / VISUAL-QUALITY-BUILDER-POLISH)
- ADR-144 — Final Visual Quality Standard (5 Non-SaaS Demos + Bottom-N Enum Truth-Up + Inline Edit Hero + Section-Type Swap + 90% Quality Floor) (P116 / FINAL-POLISH)
- ADR-145 — Section Capability Standard (Render Completeness + vs-SOTA Variant Floor) (P117 / SECTION-CAPABILITY-AUDIT-FIX)
- ADR-146 — Simple Messaging + Product-Market Fit Standard (P118 / SIMPLE-MESSAGING-AND-POSITIONING)
- ADR-147 — Walkthrough Story Page (P118.5 / WALKTHROUGH)
- ADR-148 — Site Polish + Light/Dark Mode + Research Citation Standard (P119 / SITE-POLISH)

---

## Documented ID gaps

The following ADR numbers have NO files on disk by design. The historical record (and all cross-references in older session logs / retros) depends on these numbers staying burned.

| Range | Missing numbers | Disposition |
|---|---|---|
| Pre-MVP exploration (pre-P11) | **002, 003, 004** | Drafted during initial spec exploration. Re-scoped into ADR-001 (JSON SSOT) and ADR-005 (Zustand) before architecture pivot; never accepted. |
| Pre-P11 chrome | **006, 007, 008, 009** | Color/chrome iterations folded into ADR-009b ("Warm Light Chrome — Supersedes ADR-009"). Plain `ADR-009.md` was withdrawn; successor `ADR-009b` is the accepted record. |
| Pre-P15 JSON-architecture pivot | **034, 035, 036, 037** | Drafted during P14 marketing-review pivot. Re-scoped into ADR-031 (JSON Data Architecture) and ADR-029 (Pre-LLM MVP Architecture, Stage 2). 034-037 drafts were superseded before acceptance. |
| Reserved for future phases | **123, 124, 125** | Numbering gap left explicitly during the P97-P100 methodology arc; reserved for future ADR allocation. Do NOT re-use. |

**Policy:** New ADRs MUST continue at **ADR-149+**. Do NOT re-use any of the missing numbers above.

---

## Stub-then-superseded duplicates

Three ADR numbers have two files on disk: a P21-era Proposed stub and a later Accepted file under the same number. Both are kept on disk for historical traceability. The Accepted version is canonical.

- **ADR-051**
  - Stub: `ADR-051-intent-translator.md` — *Proposed (P21 stub; full content lands in P25 Sprint B Phase 3)*
  - Accepted: `ADR-051-section-targeting.md` — Section Targeting Syntax — `/type-N` Keyword Scoping (P24)
- **ADR-052**
  - Stub: `ADR-052-aisp-intent-classifier.md` — *Proposed (P21 stub; full content lands in P26 Sprint C Phase 1)*
  - Accepted: `ADR-052-intent-translator.md` — Intent Translator — Messy Input → Canonical Form (P25)
- **ADR-053**
  - Stub: `ADR-053-aisp-intent-classifier.md` — Accepted (P26 Sprint C Phase 1)
  - Accepted: `ADR-053-public-site-ia.md` — Public Site Information Architecture (P22)

---

## SUPERSEDED ADRs

- **ADR-076** (Mobile UX Overhaul, P53 / Sprint J Wave 4) → **SUPERSEDED by ADR-090** (Mobile UX Redesign, P69 / OC-5)
- **ADR-057** (2-Step AISP Template Selection, P28 / Sprint C Phase 3 — LLM-driven SELECTION_ATOM via twoStepPipeline) → **SUPERSEDED by ADR-134** (templateMatcher.ts canonical, P106)

---

## How to add a new ADR

1. **Filename:** `ADR-NNN-kebab-case-title.md` where `NNN` is the next free number (currently ≥ 148).
2. **First line:** `# ADR-NNN: Title` (or `# ADR-NNN — Title` per recent style; exact-case match to filename).
3. **Status field:** `Proposed` → `Accepted` → optionally `Superseded by ADR-XXX`. Never delete an ADR file once committed; mark it `Superseded` and link forward.
4. **Cross-references:** When a new ADR builds on or supersedes an existing one, link both directions (the older ADR gets a `Superseded by` line; the new ADR cites prior ADRs in its Context block).
5. **Phase tagging:** Reference the implementation phase in the ADR body (e.g., "Authored during P109 to address …") so future audits can re-derive the phase grouping above without spelunking through commit metadata.
6. **One decision per ADR.** If a single phase needs multiple decisions, create multiple ADRs (P11 produced 15, P14 produced 8 — that is the right cadence, not one mega-ADR).
7. **Cap:** Aim for ≤120 LOC per ADR (recent convention since the methodology arc).

---

## See also

- `plans/implementation/mvp-plan/08-master-checklist.md` — per-phase ADR checklists tied to DoD items.
- `CLAUDE.md` `## Project Status` block — top-line ADR count is mirrored here.
- `plans/strategic-reviews/2026-05-04-gaps-to-done/01-architecture-contracts.md` — A3 audit finding that drove this rebuild.

---

**Last updated:** 2026-05-07 (P119 / SITE-POLISH / single-agent closer — counter 138 → 139, ADR-148 row appended; bucket renamed "Post-RC hardening (P110-P119)"; policy line ADR-148+ → ADR-149+).
