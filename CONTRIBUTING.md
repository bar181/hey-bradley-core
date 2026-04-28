# Contributing to Hey Bradley (open core)

> **First, thank you for considering a contribution.** This is a Harvard ALM capstone project, and the open-core repo welcomes issues, fixes, and well-scoped feature pull requests.

## Quick links

- [Getting Started](docs/getting-started.md) — clone + run + BYOK setup
- [SECURITY.md](SECURITY.md) — BYOK contract + reporting policy
- [docs/adr/](docs/adr/) — 44 architecture decision records
- [plans/implementation/](plans/implementation/) — phase-by-phase build history

## Setup

```bash
git clone https://github.com/bar181/hey-bradley-core.git
cd hey-bradley-core
npm install
npm run dev
```

## Branching

- Default branch: `main`
- Feature branches: `feature/<short-slug>` or `fix/<short-slug>`
- One feature/fix per PR; small focused commits preferred

## Commit messages

Follow conventional structure:

```
<type>: <short summary>

<body explaining WHY (not WHAT)>
<reference any ADR or carryforward item>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

## Pre-commit checks

Husky runs `scripts/check-secrets.sh` on every commit. Rejects 9 key-shape patterns (Anthropic, OpenAI, Google, HuggingFace, GitHub PAT, Groq, xAI, OpenRouter, generic JWT).

**Do NOT commit:**
- `.env.local` or any `.env.*` file with real keys (`.env.example` is the only env file tracked)
- Hard-coded API keys in source
- Real keys in test fixtures (use `sk-ant-FAKE...` synthetic strings)
- Real keys in committed logs, screenshots, or comments

## Verification before pushing

```bash
npx tsc --noEmit       # type check
npm run lint           # ESLint (v8 currently; v9 migration deferred post-MVP)
npm run build          # Vite build; production bundle
npx playwright test    # full Playwright suite
```

All four must pass. The husky pre-commit hook also catches secret-shape violations.

## Pull requests

1. Fork the repo + create a feature branch
2. Make your changes; add/update tests
3. Run the verification commands above
4. Push + open a PR with:
   - Description (what + why)
   - Cross-reference to relevant ADR if applicable
   - Test evidence (Playwright pass count, build size, etc.)

PRs are reviewed against:
- Behavioral correctness
- Test coverage (new code = new tests)
- ADR alignment (if changing architecture)
- Bundle-size budget (~800 KB gzip soft cap)
- 500-LOC-per-file soft cap (hard for new files; flagged for existing files >500 — see CLAUDE.md)

## Architecture decision records (ADRs)

Significant decisions get an ADR in `docs/adr/`. Numbering is sequential from 049 (open slots: see `docs/adr/README.md` for documented numbering gaps).

ADR template:

```markdown
# ADR-NNN: Title

**Status:** Proposed | Accepted | Superseded
**Date:** YYYY-MM-DD
**Deciders:** ...

## Context
What problem are we solving?

## Decision
What did we decide?

## Consequences
What follows from this decision (good and bad)?

## Cross-references
Other ADRs / docs / external specs.
```

## DDD bounded contexts

The codebase has 5 bounded contexts (per ADR-054):

1. **Configuration** — `src/store/configStore.ts` + `src/lib/schemas/`
2. **Persistence** — `src/contexts/persistence/`
3. **Intelligence** — `src/contexts/intelligence/` (LLM + STT + chat pipeline)
4. **Specification** — implicit via Blueprints + Crystal Atom
5. **UI Shell** — `src/components/` + `src/pages/`

When adding code, place it in the matching context. Cross-context coupling is documented in ADR-054.

## Code style

- TypeScript strict mode; no `as any`; no `@ts-ignore`
- Prefer composition + Zustand selectors over prop drilling
- Tailwind for styling; design tokens in `tailwind.config.ts`
- Tests: Playwright for behavior; vitest mock-first for unit (when added — currently Playwright-only)

## What we won't merge

- Backend code (this is the open-core SPA; backend lives in the commercial repo)
- API key inlining or analytics injections
- Features that break the BYOK trust boundary (read SECURITY.md for what that means)
- Carousels or stat-grid callouts on marketing pages (per ADR-053; Don Miller / blog-style discipline)

## Code of conduct

Be kind. Be direct. Disagreement is welcome; ad-hominem is not.

## Reporting security issues

See [SECURITY.md](SECURITY.md) §8.

## License

MIT — see [LICENSE](LICENSE).

---

*Last updated: 2026-04-27 (P20 MVP-close).*
