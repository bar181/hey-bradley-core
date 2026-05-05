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

## Running the gates

Hey Bradley enforces architectural decisions via two automated checks introduced in P110 / ADR-138 and made owner-runnable in P111.

### Architecture invariants

```bash
npm run check:invariants
```

Runs `tests/architecture-invariants.spec.ts` — 12 fitness functions verifying ADR compliance (bundle gzip ≤800KB / hex literal ceiling 240 / atom-pure boundary `src/contexts/` ↛ `src/components/` / zero secret-shape columns in migrations / etc).

### ADR-lint

```bash
npm run check:adr-lint
```

Runs `scripts/adr-lint.ts` — maps changed files to governing ADRs via a 12-entry rule table and enforces commit-message citation when invoked with `--commit-msg <path>`. Exit 0 on PASS, 1 on VIOLATION.

### Combined

```bash
npm run check:gates
```

Runs both checks in sequence.

### Full gates runner (secrets + invariants + ADR-lint)

```bash
bash scripts/run-gates.sh
```

Chains all three gates with summary output. This is the script intended for the pre-commit hook.

### Pre-commit wire (owner action — currently sandbox-blocked)

To make the gates fire on every commit, append this line to `.husky/pre-commit`:

```sh
bash scripts/run-gates.sh || exit 1
```

Until this wire lands (sandbox-blocked at P110 / ADR-138 D3), run `npm run check:gates` (or `bash scripts/run-gates.sh`) manually before committing — or rely on CI to catch violations at PR time.

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

## Contributing templates

New starter packs ship as a JSON example under `src/data/examples/`. Mirror the shape of `src/data/examples/clinic.json` and verify against the Zod schema in `src/lib/schemas/masterConfig.ts` before submitting.

Requirements for a mergeable template:

- **≥6 sections, ≤14 sections** (typical premium templates run 8 — 12)
- **Theme palette: hex colors only** (`#RRGGBB` or `#RRGGBBAA`); no CSS variables, no `rgb(...)`, no named colors
- **No animation libraries** — `framer-motion`, `gsap`, `lottie`, `@react-spring`, `animejs` are all forbidden in this repo (per ADR-091 / ADR-094)
- **Visual-style filter** — declare a `visualStyle` from the existing enum (per ADR-096 / ADR-098)
- **`exampleQueries: readonly string[]`** — REQUIRED on all 51 Template-Intelligence entries (theme / section / content) per P73 / OC-TPL-AUDIT
- **No carousels and no stat-grid callouts** on marketing surfaces (per ADR-053; Don Miller / blog-style discipline)

Add at least one Playwright test asserting that the template renders without throwing, and run `npx tsc --noEmit` + `npm run build` before pushing.

## Contributing AISP reference implementations

The `examples/3rd-party-consumer/` directory ships polyglot AISP bundle parsers. The **stdlib-only** rule is non-negotiable for any reference implementation:

- **Zero dependencies.** No `package.json`. No `requirements.txt`. No `Cargo.toml`. No `go.sum`. The implementation must run on a freshly installed language toolchain with nothing else.
- **Bundle JSON is parsed via the language's standard library** (`JSON.parse` in TS / `json.loads` in Python / `encoding/json` in Go / `serde_json` is acceptable for Rust because it's de-facto stdlib but must be vendored or stated; …).
- **The bundle parsing surface is stable across `aisp-1.X` minor versions.** A reference impl that parses an `aisp-1.0` bundle MUST also parse `aisp-1.1`, `aisp-1.2`, etc.
- **Contributions in Go, Rust, Swift, Java, Kotlin, Ruby, PHP, C#, Elixir, Clojure, …** are welcome. Mirror the structure of `parse-aisp-typescript.ts` + `parse-aisp-python.py`: a parser function, a tiny `main` block that loads `sample-bundle.json`, and inline comments that map each Crystal Atom to its bundle field.
- **Walk the existing walkthrough first** — `docs/aisp-adoption/02-reference-implementation-walkthrough.md` annotates the canonical TS / Python parsers. Match that level of inline commentary.

## Bug reports + feature requests

File on GitHub Issues at `bar181/hey-bradley-core` with the appropriate label:

- **`bug`** — include a **reproducible repro**: env (browser + version), exact prompt or click-path, expected vs. actual behavior, console errors. Bugs filed without a repro will be closed `needs-info`.
- **`enhancement`** — feature requests should cite a **SOTA tool comparison** where relevant (Lovable, Framer, Claude Designer, v0, Replit Agent, …) and state which gap from `plans/strategic-reviews/2026-05-01-comprehensive-review-3-gaps-resolutions.md` it closes (P1 / P2 / P3).
- **`security`** — see `SECURITY.md` §8. Do NOT include real keys, even truncated.

## AISP RFC process

Breaking changes to the AISP bundle schema (`aisp-2.0+`) require an RFC issue. Minor `aisp-1.X` bumps that preserve backward-compat on the parsing surface do NOT require an RFC; just a CHANGELOG entry and a regression test.

A mergeable AISP RFC must contain:

1. **Motivation** — what problem does the breaking change solve? Why couldn't it be solved with an `aisp-1.X` minor bump?
2. **Alternatives considered** — at least two non-breaking shapes that were rejected, and why.
3. **Migration path** — concrete steps a `aisp-1.X` consumer takes to upgrade. Include a worked example bundle.
4. **Backward-compat shim plan** — either a translation layer that lets `aisp-1.X` consumers keep working unchanged, or an explicit deprecation timeline (minimum 6 months).

Cross-reference ADR-108. Tag the issue `aisp-rfc` + `breaking-change`.

## What we won't merge

- Backend code (this is the open-core SPA; backend lives in the commercial repo)
- API key inlining or analytics injections
- Features that break the BYOK trust boundary (read SECURITY.md for what that means)
- Carousels or stat-grid callouts on marketing pages (per ADR-053; Don Miller / blog-style discipline)
- New runtime dependencies that duplicate an existing utility (KISS + bundle-budget discipline)
- Animation libraries (`framer-motion` / `gsap` / `lottie` / `@react-spring` / `animejs`)

## Code of conduct

Be kind. Be direct. Disagreement is welcome; ad-hominem is not.

## Reporting security issues

See [SECURITY.md](SECURITY.md) §8.

## License

MIT — see [LICENSE](LICENSE).

---

*Last updated: 2026-04-27 (P20 MVP-close).*
