# P86 — OC Polish Wave 4: Library 8.4 → 8.5+ (Preflight)

> **Phase:** P86 · **Sprint:** OC-POLISH-W4 · **Date:** 2026-05-01
> **Predecessor:** P85 sealed at `6ce19d7` (~1026+ GREEN, 110 ADRs, v1.0.0-RC1 + AISP visibility standard)
> **Companion:** P87 (Marketing Mobile, parallel)
> **Cross-refs:** ADR-087 (Design Tokens), ADR-091 (Canonical Component Quality), ADR-094 (Professional Grade Standard), ADR-095 (Library-Wide Polish)

## Mandate

Bring user-visible surfaces from ≥8.4 to ≥8.5 across the open-core library. **No new features.** Polish only. P85 audit identified candidates among the 8 "internal-only-correct" surfaces — but only the user-facing ones (mobile first-run card, ChatInput simulated-mode pill, ChatInputBar, improvement suggestions, listen mid-flight) are in scope. The 4 atom-internals (intentAtom/assumptionsAtom/decompAtom code) are correctly hidden — out of scope.

## 3 parallel agents · disjoint scopes

### A1 — Legacy surface polish sweep
**Owns:** read `plans/strategic-reviews/2026-05-01-aisp-integration-audit.md` first; identify USER-VISIBLE legacy surfaces below 8.5:
- `src/components/shell/MobileFirstRunCard.tsx` (mobile first-run UX; verify ADR-087/091/094 compliance)
- `src/components/shell/ChatInput.tsx` lines 560-566 (simulated-mode pill — token compliance, hover state)
- `src/components/shell/ChatInputBar.tsx` (input box — focus ring, placeholder, padding tokens)
- `src/components/shell/ChatThread.tsx` improvement-suggestions block lines 160-172 (typography rhythm, spacing)
- `src/components/shell/MobileListenFullscreen.tsx` (mid-flight transcript — only if obvious quick wins; defer otherwise)

**Constraints:** Surgical edits only — token-derived spacing/colors per ADR-087, hover-lift transitions per ADR-091, no animation libs. Each file ≤30 LOC of changes. NO refactors. NO new features. KISS — fix typography drift, padding inconsistencies, focus-visible rings, hover states.

DO NOT touch:
- `src/pages/Welcome.tsx`, `About.tsx`, `AISP.tsx`, `OpenCore.tsx`, `HowIBuiltThis.tsx`, `Docs.tsx`, `BYOK.tsx`, `Blog.tsx`, `Progress.tsx` (A2 owns Welcome; A4/P87 owns marketing mobile responsive)
- atom internals (`src/contexts/intelligence/aisp/*.ts`)
- ADR/test/plan/CLAUDE.md (A3 owns)

### A2 — Welcome page final polish + social proof
**Owns:**
- `src/pages/Welcome.tsx` (EDIT — 255 LOC; tighten hero headline to Don Miller problem-first framing; verify primary/secondary CTA copy is consistent: "Try Hey Bradley — free →" primary + "Explore AISP →" secondary; update social-proof line/component with current numbers: 701 tests, 110 ADRs, 41 templates, 12 blog posts, composite 82/100)
- Whatever component renders the social-proof bar (locate via `grep -rn "tests\|ADRs\|templates" src/pages/Welcome.tsx src/components/`; one component owns it)

**Constraints:** Don Miller voice = problem-first ("Your AI builds the wrong site 55% of the time"); concrete numbers only (no inflation); ADR-091 token compliance; backward-compat — heading slugs preserved if any anchor links exist.

DO NOT touch other marketing pages (A4/P87 owns mobile sweep across them).

### A3 — ADR-111 + score + tests + EOP
**Owns:**
- `docs/adr/ADR-111-final-polish-standard.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-087 + ADR-091 + ADR-094 + ADR-095)
  - Defines what "done" looks like for open-core library polish
  - 4 decisions: (1) all user-visible surfaces score ≥8.5 on ADR-094 rubric; (2) token-derived spacing/colors enforced via ADR-087; (3) canonical hover-lift + focus-visible per ADR-091; (4) "no new features" discipline maintained — Wave 4 closes the polish arc
- `tests/p86-final-polish.spec.ts` (NEW; ≥15 cases; Playwright):
  - P86.1 ADR-111 file shape (4)
  - P86.2 Welcome hero copy current (1) — contains updated CTAs + social proof numbers
  - P86.3 No hard-coded hex outside palette blocks in A1 surfaces (3) — MobileFirstRunCard / ChatInput simulated-pill / ChatInputBar source uses var(--hb-*) tokens
  - P86.4 Welcome page LOC stable (1) — ≤320 LOC after polish
  - P86.5 KISS — no animation libs (1)
  - P86.6 EOP triplet (3)
  - Plus 2 tolerance/buffer cases
- `plans/strategic-reviews/2026-05-01-p86-polish-scoring.md` (NEW; ≤200 LOC) — score every user-visible surface 1-10 post-fix; declare library-wide professional grade if ≥8.5 across all
- `plans/implementation/phase-86/{02-post-review.md, session-log.md, retrospective.md}` (NEW)
- `CLAUDE.md` sync — bump ADRs 110 → 111; tests +15; capabilities entry. **NOTE-FOR-P87/A5** to bump 111 → 112 in same combined commit.

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`; ROOT = `process.cwd()`.

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO new features — polish only
4. NO touching files outside owned list
5. NO shell commands inside agents (except tsc + targeted playwright run)
6. TypeScript-strict
7. KISS — surgical token-compliance + copy fixes only

## Acceptance gates (combined P86 + P87)
- All A1-touched user-visible surfaces ≥8.5 score
- Welcome page social-proof numbers current (701/110/41/12)
- ADR-111 + ADR-112 Accepted
- ≥15 P86 + ≥10 P87 tests GREEN
- Cumulative ≥725 session OC chain regression
- tsc strict clean
- Library-wide professional grade DECLARED if all surfaces ≥8.5
