# ADR-108 — AISP Adoption Standard

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P83 / OC-17
- **Cross-refs (primary):** ADR-053 (INTENT_ATOM — first Crystal Atom), ADR-082 (Open Core RC — public release boundary), ADR-098 (Template Intelligence Architecture — 3-layer library shape)
- **Cross-refs (secondary):** ADR-097 (Blog Content Strategy — cadence floor), ADR-104 (Page-Aware Pipeline — bundle.pages[] shape), ADR-107 (OC-CLEANUP — pre-RC discipline)

## Context

107 ADRs through P82 / OC-CLEANUP land the open-core arc at the RC threshold. AISP (the 5-atom symbolic protocol — INTENT / DECOMP / SELECTION / CONTENT / ASSUMPTIONS) is the moat. But a spec is only a moat if 3rd-party tools can consume it without reverse-engineering Hey Bradley's internals.

P83 / OC-17 ships the **adoption surface**: the README rewrite, the canonical `docs/aisp-adoption/` guide tree, and polyglot reference impls at `examples/3rd-party-consumer/` (TypeScript + Python, stdlib-only) that prove the bundle JSON is consumable cold by an external developer.

Owner brief originally read "1-2 weeks community engagement". Reframe at preflight: the engagement window is **post-RC marketing work**, not a code-sprint deliverable. P83 ships the docs that make engagement possible; P84+ ships the engagement itself.

## Decision

ADR-108 names four standards that govern the AISP adoption surface from P83 forward.

### 1. AISP bundle JSON is the public adoption surface

The bundle JSON shape (top-level fields, atom shapes, version field, slug-naming convention `{slug}-aisp-v{version}.txt`) is the **single public contract** for 3rd-party consumers. Minor versions (`aisp-1.X`) are backward-compat for adopters; breaking changes require a major bump (`aisp-2.0`) and the RFC process deferred to P84 OC-18.

### 2. `docs/aisp-adoption/` is the canonical adoption guide tree

Three docs land in P83 and are the canonical reference:
- `00-getting-started.md` — what AISP is + the 5 atoms + where to get a sample bundle
- `01-bundle-schema.md` — schema reference (top-level + atom shapes + version + slug)
- `02-reference-implementation-walkthrough.md` — line-by-line walkthrough of the polyglot ref impls

Future adoption docs MUST land in this tree; ad-hoc adoption notes scattered across `docs/` are out of standard.

### 3. Reference impls in TypeScript + Python prove polyglot consumability with zero deps

`examples/3rd-party-consumer/` ships 4 files: README + `parse-aisp-typescript.ts` + `parse-aisp-python.py` + `sample-bundle.json`. Both parsers MUST run with stdlib-only JSON parsing — no `package.json`, no `requirements.txt`. Polyglot floor proves the spec is not language-coupled.

### 4. External community engagement is post-RC, not a code-sprint deliverable

The 1-2 week marketing/advocacy/conference window is **post-RC** work. P83 ships the docs that make community engagement possible; the engagement itself is P84+ and is owner-led marketing, not agent-led code.

## Out of scope (Tier-2 / post-RC carry-forwards)

- **Live community engagement campaign** — DEFERRED post-RC (owner-led, not agent-led).
- **AISP RFC process for breaking changes** — DEFERRED to P84 / OC-18 candidate (versioning policy + governance).
- **Localization of adoption guide** — DEFERRED to Tier-2 (English-only floor for v1; mirrors ADR-106 disfluency-coverage decision).
- **Hosted reference-impl playground** — DEFERRED to Tier-2 (pairs with hosted share URL on Vercel KV / Supabase).
- **Live demo of 3rd-party consumer running** — DEFERRED to P84 (parser smoke-runs at CI time; full demo post-RC).

## Acceptance gates per decision

1. **D1:** Sample bundle in `examples/3rd-party-consumer/sample-bundle.json` validates against the documented schema in `docs/aisp-adoption/01-bundle-schema.md`. Both parsers extract atoms without error.
2. **D2:** All three adoption guide docs exist at `docs/aisp-adoption/`; each is ≤200 LOC; cross-linked from README "Adopting AISP" section.
3. **D3:** `examples/3rd-party-consumer/` contains exactly 4 files (README + TS parser + Python parser + sample bundle); no `package.json` / no `requirements.txt`; both parsers stdlib-only.
4. **D4:** ADR-108 Accepted; cross-refs ADR-053 + ADR-082 + ADR-098.
5. **D5:** ≥12 P83 tests GREEN in `tests/p83-aisp-adoption.spec.ts` with existsSync guards on cross-agent surfaces (A1 / A2).

## Consequences

**Positive:**
- 3rd-party adopters can consume AISP without reading Hey Bradley source. Spec becomes a real moat, not just internal jargon.
- Polyglot floor (TS + Python, stdlib-only) proves the bundle is not language-coupled — broadens adoption surface to any JSON-capable runtime.
- Two-phase cadence (P83 docs → P84 engagement) keeps the code-sprint scope honest and avoids conflating doc work with marketing work.

**Negative:**
- Adoption guide quality is owner-judged at seal — no automated test gates content fidelity. Mitigated by P83.5 KISS rule (no animation libs) + LOC caps + cross-agent existsSync test coverage.
- The Tier-2 carry-forward column grows by 4 items (engagement campaign, RFC process, localization, hosted playground). Mitigation: enumerated explicitly in P83 retrospective with originating-rationale per item.

**Mitigations:**
- `existsSync` guards on A1 / A2 surfaces in `tests/p83-aisp-adoption.spec.ts` keep the seal-gate honest under parallel-dispatch timing — pattern carried forward from P74 / P78 / P79 / P82.
- P83 retrospective enumerates every Tier-2 deferred item with rationale; no silent drops.
