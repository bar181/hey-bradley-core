# P126 — Session Log

> Running log of every dispatch, decision, and fix. Primary source for
> any later agent that needs to understand what happened in P126.

---

## 2026-05-16 — Step 0 (branch + scaffolds + phase audit)

- Switched off `swarm/p125-visual-overhaul` post-merge.
- `git checkout main && git pull origin main --ff-only`: main moves
  from `02c38a9ae` → `28d259f2c` (the P125 merge commit, by `bar181`
  at 16:33:43Z).
- Cut `swarm/p126-go-live` off main @ `28d259f2c`.
- Phase audit (phases 121-125): tabulated triplet completeness.
- Archived 26 non-triplet files across phases 121-125 via `git mv`
  into per-phase `archive/` dirs:
  - phase-121: 6 files (4 PNGs, 1 JPEG, `initial-to-do-items-may7.md`)
  - phase-122: 9 files (4 PNGs, 2 human-N.md owner instructions, 1 PNG, `walkthrough-revert-source.md`)
  - phase-123: 8 tracked + 1 untracked PNG; included full `screenshots/`
    dir (32 PNG captures from Loops 1-4 + verify cycle) + `verify-report.json` + `Home.html` reference + `PUBLISHABLE-REPORT.md`
  - phase-124: 1 file (`llm-live-vercel-site.md`)
  - phase-125: 1 file (`image-creation-list.md`)
- **Audit finding:** P124 `retrospective.md` was never written — only
  preflight + session-log exist. Captured as TODO in P126 preflight §4.
- Wrote P126 EOP triplet scaffolds:
  `plans/hitl/phase-126-go-live/{preflight.md, session-log.md, retrospective.md}`.
  preflight includes feature roster (F1-F6), ADR plan (ADR-150 BYOK,
  ADR-151 chat history, ADR-152 confidence), inherited carry-forwards,
  risks, rollback plan.

---

## 2026-05-16 — F6 retry (direct Gemini API, no Playwright)

Context: Initial F6 Playwright run hit a Claude API 500 (server-side, not
product). Owner directive: simplify, avoid Playwright, use `.env` Gemini key
with $10 phase budget, loop up to 5x until JSON output is optimal, log
everything, brutal-honest verification.

Strategy: New script `scripts/p126-f6-retry.mjs` calls `gemini-2.5-flash`
directly via `@google/genai` with the three owner-spec prompts. System
prompt embeds the real Hey Bradley flagship schema fragment so generated
patches use real array indices (`/sections/1/...` for the hero). Each
iteration grades sessions against owner-spec acceptance criteria (target
path + value + confidence band). Loop stops on composite ≥0.95 or 5 iter.

Result: **converged at iter-1, composite = 1.00**.

| Session | Prompt | Confidence | Patch op | Grade |
|---|---|---|---|---|
| 1 | Update the hero section | 0.6 | replace `/sections/1/components/1/props/size` → `display-lg` + casual lowConfidenceNote | 1.00 |
| 2 | Change the hero headline to Ship faster | 0.9 | replace `/sections/1/components/1/props/text` → `Ship faster` | 1.00 |
| 3 | Make it pop | 0.3 | replace headline size + accent `#E00050` + casual lowConfidenceNote | 1.00 |

Cost: $0.001472 total / $10 budget (0.015% used). Wall-clock 0.9–1.3 s
per call. No 500s, no precondition failures, no anti-pattern phrases.

Evidence:
- `e2e-evidence/iter-1/{system-prompt.txt, session-{1,2,3}.json, verdict.json}`
- `e2e-evidence/{session-1.json, session-2.json, session-3.json}` (winning iter promoted)
- `e2e-evidence/retry-summary.json`
- `e2e-evidence/retry-run.log` (full transcript)

UI assertions (preview DOM mutation, CostPill increment, in-app Chat
History link rendering) NOT exercised by this retry — they remain
owner-manual verification (carry-forward CF-P127-f6-ui-spot-check).
Playwright spec `tests/p126-e2e-chat-sessions.spec.ts` retained but not
re-run; owner can run it later when Claude API is healthy.

## 2026-05-16 — Build + gates verification (post-F6)

- `npm run build`: GREEN (vite 7.92s)
- Entry chunk gzip: **793.32 kB** ≤ 800 kB ARCH.1 cap (6.68 kB headroom)
- `npm run check:gates`: ARCH 12/12 PASS, ADR-lint PASS
- `bash scripts/check-secrets.sh`: clean (no key-shape patterns)
- Carry-over INEFFECTIVE_DYNAMIC_IMPORT warnings (5) match
  CF-P126-ineffective-dyn-import — deferred to dedicated tech-debt phase.

## 2026-05-16 — P126 seal

All 7 features (F1–F6 + F2b) shipped on `swarm/p126-go-live`. Composite
F6 grade 1.00. Gates green. Retrospective written. Branch ready for
owner review + merge to main.

---

*Append entries below as work proceeds. Format: `## YYYY-MM-DD — Topic`.*
