# Pre-Launch Status — Hey Bradley v2.0.0-RC1

> Generated at P120.5 seal (anchor: `swarm/p120.5-under-the-hood`).
> Last updated: 2026-05-06.
> Companion document: `docs/launch/pre-launch-human-todos.md` (step-by-step owner actions).

## 1. Headline

**The product is sealed and tested. The story is locked. The launch is gated by 5 human-only actions.**

Eleven phases (P110 → P120 + a P118.5 follow-up + a P120.5 calibration) have shipped since `main` last advanced. Every phase reports both tsc strict configs CLEAN and tests GREEN at seal. The ADR ledger sits at 140 ADRs (highest-ID ADR-149). Cumulative test coverage is ~1725+ GREEN at the P120 anchor.

Nothing in this stack is merged into `main` yet. The owner is doing a single brutal-honest review pass before any of it ships. After that pass: a sequential merge, a tag, a push, a video, a smoke test, and a social rollout. That's the entire launch path.

## 2. Branch ledger

### Active swarm branches (P110 → P120.5)

| Branch | Status | Sealed at | Merged into main? | Notes |
|---|---|---|---|---|
| swarm/p110-adr-export | SEALED | `d33cdbd` | NO | ADR-138 + 17 tests; ADR enforcement architecture + export bundle completeness |
| swarm/p111-dogfood-gates | SEALED | `714dd3b` | NO | ADR-139 + 16 tests; DDD/ADR output priority + dogfood gates runner |
| swarm/p112-gap-closure | SEALED | `4f00ff7` | NO | ADR-140 + 20 tests; AISP score TS heuristic + ADR README CI drift guard + GH Actions gates |
| swarm/p113-quality-push | SEALED | `f6004ba` | NO | ADR-141 + 26 tests; AISP density Silver+ + 8 storytelling presets + 5 personas + voice extraction |
| swarm/p114-feature-audit-fix | SEALED | `a56206e` | NO | ADR-142 + 24 tests; persistence wire + cost cap + image picker + UX truth-up |
| swarm/p115-visual-quality | SEALED | `bfc3b73` | NO | ADR-143 + 22 tests; builder UX 7.5→8.6 + article SOTA + image interactions + bottom-15 lift + 3 demos |
| swarm/p116-final-polish | SEALED | `d9556f8` | NO | ADR-144 + 25 tests; 5 non-SaaS demos + bottom-N enum truth-up + inline edit hero + section-type swap |
| swarm/p117-section-capability | SEALED | `2d44cc0` | NO | ADR-145 + 22 tests; render completeness 16/18→18/18 + 6 vs-SOTA variants + cue map |
| swarm/p118-simple-messaging | SEALED | `20f869a` | NO | ADR-146 + 27 tests; "Describe it. See it." H1 lock + numbers/competitors/jargon stripped + 3 new blogs |
| swarm/p118.5-walkthrough | SEALED | `7f5fe54` | NO | ADR-147 + 22 tests; `/walkthrough` 6-scene scroll-snap; brand invisible until Scene 6 |
| swarm/p119-site-polish | SEALED | `e242836` (tip is strategic-review) | NO | ADR-148 + 24 tests; light/dark mode `.dark { --hb-* }` overrides + Harvard ALM math citation |
| swarm/p120-audience-routing | SEALED | `fd4f349` | NO | ADR-149 + 22 tests; For developers / For teams / Contact + blog 3-category filter + /guides redirect |
| swarm/p120.5-under-the-hood | SEALED | (this commit) | NO | No new ADR (calibrates ADR-149); nav rename + "Real time, not rebuild" section + 4 tests |

### Pre-stack swarm branches (older work; status unknown)

| Branch | Classification | Notes |
|---|---|---|
| swarm/connections-cta-pass | UNMERGED | Marketing-CTA work; superseded by P118 simple messaging |
| swarm/connections-phase-1 → 5 | UNMERGED | Connections series; predates P110 |
| swarm/mvp-retrospective | UNMERGED | Retrospective doc; possibly already absorbed into CLAUDE.md |
| swarm/pre-launch-sprint | UNMERGED | Earlier launch-prep attempt; superseded by P102/P103/P120.5 |
| eval/persistence-and-competitors | EXPERIMENTAL — can ignore | Eval-only; never intended for main |
| eval/website-quality-2026-05-04 | EXPERIMENTAL — can ignore | Eval-only |
| claude/verify-flywheel-init-qlIBr | EXPERIMENTAL — can ignore | Init-time scratch branch |

**Recommendation**: classify the `swarm/connections-*` and `swarm/mvp-retrospective` and `swarm/pre-launch-sprint` branches as superseded-by-P110+. They contain pre-RC work that the P110-P120.5 stack subsumes. If anything important lives in them, it's already been pulled forward by the audit + fix sprints (P114 / P117 / P118).

## 3. Stack shape — what merges in what order

The P-branches are stacked rebases, not parallel branches. Each phase's branch was created from the previous phase's tip:

```
main (84478b3 Harvard crimson palette, capstone example, SCC report)
  └─ swarm/p110-adr-export (d33cdbd)
       └─ swarm/p111-dogfood-gates (714dd3b)
            └─ swarm/p112-gap-closure (4f00ff7)
                 └─ swarm/p113-quality-push (f6004ba)
                      └─ swarm/p114-feature-audit-fix (a56206e)
                           └─ swarm/p115-visual-quality (bfc3b73)
                                └─ swarm/p116-final-polish (d9556f8)
                                     └─ swarm/p117-section-capability (2d44cc0)
                                          └─ swarm/p118-simple-messaging (20f869a)
                                               └─ swarm/p118.5-walkthrough (7f5fe54)
                                                    └─ swarm/p119-site-polish (ca1444b → e242836 strategic review)
                                                         └─ swarm/p120-audience-routing (fd4f349)
                                                              └─ swarm/p120.5-under-the-hood (this branch)
```

Verified via `git merge-base --is-ancestor swarm/p119-site-polish swarm/p120-audience-routing` → YES.

**Implication**: merging `swarm/p120.5-under-the-hood` into `main` will drag along every commit from P110 onward. The owner can choose either:

- **Option A — single big merge** (faster): `git merge swarm/p120.5-under-the-hood` from main; the linear stack fast-forwards or merges as one unit.
- **Option B — sequential merges** (cleaner audit trail): merge each phase branch in order, so the merge history matches the seal history.

Both end at the same tree state. Option B is recommended for a v2.0.0-RC1 because the merge-commit messages preserve the per-phase context, which is useful for forensic spelunking later. Option A is fine for a hotfix or a beta tag.

## 4. Recommended merge sequence to ship v2.0.0-RC1

```bash
# Verify clean state
git status                          # working tree clean
git checkout main                   # back to main
git pull origin main                # ensure up to date with remote

# Sequential merge (Option B — recommended for first RC)
git merge swarm/p110-adr-export                  # ADR-138
git merge swarm/p111-dogfood-gates               # ADR-139
git merge swarm/p112-gap-closure                 # ADR-140
git merge swarm/p113-quality-push                # ADR-141
git merge swarm/p114-feature-audit-fix           # ADR-142
git merge swarm/p115-visual-quality              # ADR-143
git merge swarm/p116-final-polish                # ADR-144
git merge swarm/p117-section-capability          # ADR-145
git merge swarm/p118-simple-messaging            # ADR-146
git merge swarm/p118.5-walkthrough               # ADR-147
git merge swarm/p119-site-polish                 # ADR-148
git merge swarm/p120-audience-routing            # ADR-149
git merge swarm/p120.5-under-the-hood            # no new ADR (calibrates ADR-149)

# Verify the world
npx tsc --noEmit
npx tsc -p tsconfig.app.json --noEmit
npx playwright test --project=chromium

# Tag + push
git tag v2.0.0-RC1
git push origin main --tags
```

### Conflict notes

The CLAUDE.md and `docs/adr/README.md` files are touched by every phase (truth-up bumps to ADR counter, test counts, ADR ledger entries). Sequential merge in seal-order resolves these cleanly because each phase's bump is forward-only and each phase's preflight reads its predecessor's CLAUDE.md as the baseline.

If a conflict surfaces on either file, the resolution is always **keep the most recent phase's version** — the later truth-up subsumes the earlier ones.

The `tests/p120-audience-routing.spec.ts` file was modified by P120.5 (the P120.2 describe was updated to assert "Under the hood" instead of "For developers"). Sequential merge handles this without conflict because P120.5's branch is a descendant of P120.

## 5. tsc + test status across the stack

Per-phase commit messages report `tsc CLEAN` (both `tsc --noEmit` and `tsc -p tsconfig.app.json --noEmit`) at every seal from P110 onward. P120.5 (this commit) verified locally: both clean.

Cumulative test coverage at P120 anchor: **~1725+ PURE-UNIT GREEN** under chromium. P120.5 adds 4 (5.5s run); revised P120.2 still GREEN. Net at P120.5 anchor: **~1729+ GREEN**.

**No branch is flagged as not-sealed-cleanly.** If any phase had failed tsc or had red tests, it would not have been sealed. The discipline held across all 11 phases.

Re-running the full test suite on every phase tip is too expensive for the sandbox. The recommended verification is a single full-suite run after the sequential merge lands on main (Step 9 of the human todo list).

## 6. Carry-forwards still open across P110 → P120.5

### Owner-action (cannot be sandbox-completed)

| ID | Description | Source | Time estimate |
|---|---|---|---|
| OWNER-1 | Tag `v2.0.0-RC1` | ADR-131 / ADR-133 / P120.5 retrospective | 30 sec |
| OWNER-2 | Push tag + branch to remote | ADR-131 / ADR-133 | 1 min |
| OWNER-3 | Live BYOK LLM smoke test ($0.05) | ADR-131 CF#4 / ADR-127 | 15 min |
| OWNER-4 | Real STT calibration with microphone | ADR-131 CF#5 / ADR-127 | 10 min |
| OWNER-5 | Record demo video | ADR-133 / `docs/launch/demo-video-script.md` | 60-90 min |
| OWNER-6 | Show HN post | ADR-133 / `docs/launch/show-hn-post.md` | 15 min |
| OWNER-7 | Product Hunt launch | ADR-133 / `docs/launch/product-hunt-tagline.md` | 30 min |
| OWNER-8 | LinkedIn / X / Reddit | ADR-133 owner-launch-checklist | 30 min |
| OWNER-9 | Agentics Foundation beta announcement | ADR-133 | 15 min |
| OWNER-10 | Husky pre-commit hook wire (`.husky/pre-commit`) | ADR-138 D3 / ADR-139 D3 / ADR-140 D3 | 5 min (sandbox-blocked, owner only) |

### Tier-2 commercial (deferred until commercial activation)

- Supabase persistence + multi-tenant team workspaces (ADR-114, ADR-115)
- Hosted share URL runtime
- HNSW vector-DB activation (ruvector flywheel)
- Native mobile (iOS / Android)
- Full WCAG 2.1 AAA pass
- Localization
- Live-LLM eval harness
- Commercial Tier-2 SaaS dashboard / Agentic Support System
- Mode toggle UI (light/dark switch chrome — `.dark { --hb-* }` tokens are wired since P119 but no UI toggle component ships at open-core)
- Team workspaces / shared cloud projects / SSO on `/for-teams` (named explicitly on the page so the deferral is honest — CF-P120-2)

### Future-phase candidates (post-launch, optional)

- Owner video walkthrough (CF-P118.5-1)
- A/B test on Welcome subtle-link copy variants (CF-P120-3)
- Mobile-nav hamburger if 7 nav items + Try Builder CTA crowd 375px viewport (CF-P120-4)
- Dedicated `/for-investors` or `/for-acquirers` page if signal volume warrants (CF-P120-1)
- ChatInput hook extraction CF#10 (P114 carry-forward)
- WorkflowTab live-wire (P114 carry-forward)
- BFCache mobile Safari (P114 / A1 G2)
- 2-tab race window on persistence (P114 / A1 G5)
- BYOK Remember encryption (P114 / A1 G6 — Tier-2 per ADR-043)
- Orphan project growth bound (P114 / A1 G8)

### Already CLOSED in P120 / P120.5 (do not re-open)

- Audience routing for developers + teams + contact (ADR-149)
- Blog 3-category filter via URL param
- Welcome H2 builder-comparison link
- Research Geek-mode Easter egg + Start-here entry strip
- About footer Work-with-us link
- "Under the hood" nav label (P120.5 calibration)
- "Real time, not rebuild" architecture-as-plain-English section on /research + /for-teams (P120.5)

## 7. The 5 human-only actions before launch (LOCKED)

These cannot be swarm-completed. Owner must perform.

1. **Tag `v2.0.0-RC1`** after the merge sequence lands on main. `git tag` requires owner authorization, and the version number is owner-decided.
2. **Push tag + branch to remote**. `git push origin main --tags` — owner-authorized push to `bar181/hey-bradley-core`.
3. **Record demo video**. Owner with screen recorder (Loom / OBS) + voice; ~2-3 min walkthrough of describe → see → export. Script lives at `docs/launch/demo-video-script.md` (P84 owner-launch-checklist).
4. **Live BYOK LLM smoke test ($0.05)**. Owner runs the chat pipeline end-to-end with a real Anthropic / OpenAI / Gemini API key to verify the cost cap correction from P114/F3 + production write paths from P107/A5 + storytelling preset wire from P114/F2 + voice extraction from P113/A4 all behave correctly with a live LLM. Documented as CF#4 since P102.
5. **Social rollout**. Show HN post, Product Hunt launch, LinkedIn long-form, X/Twitter thread, Reddit (r/programming + r/SideProject + r/LocalLLaMA), Agentics Foundation beta announcement (20-50 users). All copy lives at `docs/launch/{show-hn-post,product-hunt-tagline,agentics-foundation-beta}.md` (P84 / P103). Cannot post from sandbox.

### Optional 6th — owner-convenience

6. **Husky pre-commit hook wire**. Append `bash scripts/run-gates.sh || exit 1` to `.husky/pre-commit` after the existing `bash scripts/check-secrets.sh` line. Sandbox-blocked from `.husky/` modify since P102; owner can do this in any terminal session in 5 seconds. Documented in ADR-138 D3 / ADR-139 D3 / ADR-140 D3. Equivalent enforcement already runs in CI via `.github/workflows/gates.yml` (P112 / ADR-140 D3) — the husky wire is the local-machine convenience, not a launch blocker.

## 8. Honest known gaps at v2.0.0-RC1 seal

In the spirit of ADR-131 D2 (persona scoring acceptance honest with floor-breaches named, not papered):

- **Live-LLM behavior unverified**. The pipeline is wired and tested at the unit level, but no commit on this branch has executed against a real Anthropic / OpenAI / Gemini key. The 5 LIVE-LLM divergence risks documented in ADR-127 §9 (latency / schema-shape / cost / token-count / streaming) are theoretical until OWNER-3 runs.
- **Husky pre-commit is CI-only**. PR-time enforcement via `.github/workflows/gates.yml` is GREEN; local pre-commit is owner-action.
- **Mode toggle UI ships no chrome**. The `.dark { --hb-* }` tokens are wired, but the toggle component is Tier-2 commercial. Users have to add `.dark` to `<html>` in DevTools to see dark mode at v2.0.0-RC1.
- **Mobile-nav hamburger not shipped**. 7 primary nav items + Try Builder CTA at 375px is at the visible-crowding edge. Real-device testing during the human review may surface this; if so, P121 closes it.
- **3 weak site shapes carried forward from P117**: restaurant / non-profit / fiction site shapes scored 6/10 — schema enum widening per ADR-100 is the carry-forward (CF-P117-1).
- **The "55% of effort is concept-to-spec" framing** comes from industry research cited at ADR-141 / P113 + Research.tsx — sourced but not first-party measured. Owner-led empirical study is post-RC.

These are named here so that the human review session does not surface them as surprises. If any of these become launch blockers, the owner pulls launch. Otherwise, they ship as documented gaps in the v2.0.0-RC1 release notes.
