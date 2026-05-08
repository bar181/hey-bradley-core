# Third-Party Reviewer Feedback — 2026-04-30

> **Provenance:** Owner-supplied 3rd-party reviewer signal, captured verbatim
> at P61 phase open. Used as canonical reviewer voice for the launch plan
> in `02-launch-plan.md`.
> **Last confirmed sealed:** P60.5 at `dabc638` (AISP trace auto-expand,
> 395 cumulative tests GREEN, 84 ADRs, `v1.0.0-RC1` ready to tag).

---

## What the swarm was asked to review

Three things before the next session starts:

1. **Current state audit** — what is actually shipped vs what plans claim
2. **End-of-open-core gap analysis** — what's between now and public launch
3. **Additional functionality** — what would make the product genuinely
   better beyond the current roadmap

---

## Honest current state

| Area | Status | Gap |
|---|---|---|
| Core pipeline | ✅ Complete | None |
| AISP 5-atom architecture | ✅ Complete | None |
| Personality system | ✅ Complete | None |
| Mobile 3-tab nav | ✅ Complete | Polish needed |
| Templates | ⚠️ 10 templates | Need 40+ |
| Onboarding | ⚠️ 10 options | Too many — needs 3 |
| Listen mode | ⚠️ Basic | Need 50-prompt scenarios |
| Prompt library | ⚠️ 280 entries | Need 500+ |
| Visual floor | ⚠️ 4/10 (kitchen sink) | Lorem copy everywhere |
| LLM API testing | ❌ Not started | Waiting on keys |
| Blog | ⚠️ 4 posts | Need 12+ |
| AISP adoption | ❌ Not started | Highest strategic priority |

---

## 14 sprints to public launch (as proposed by reviewer)

| Sprint | Focus | Effort |
|---|---|---|
| OC-1 | Visual polish floor + Lorem replacement | 1 day |
| OC-2 | Onboarding redesign (3 choices not 10) | 1-2 days |
| OC-3 | Templates Round 1 (40+ total) | 1-2 days |
| OC-4 | Templates Round 2 (edge cases + search) | 1-2 days |
| OC-5 | Mobile UX overhaul | 1-2 days |
| OC-6 | Listen mode 50-prompt scenarios | 1-2 days |
| OC-7 | Prompt library 500+ entries | 1 day |
| OC-8 | Clean UI pass (tokens, states, motion) | 1-2 days |
| OC-9 | Spec quality + export polish | 1 day |
| OC-10 | Performance + accessibility | 1 day |
| OC-11 | Live LLM testing (needs API keys) | 1-2 days |
| OC-12 | Blog expansion (12+ posts) | 1 day |
| OC-13 | AISP adoption push | 1-2 weeks |
| OC-14 | Public launch RC final | 1 day |

Reviewer estimate: 2-3 weeks post-defense to public launch.

---

## Additional functionality worth considering (reviewer wishlist)

**High value, low effort:**
- Undo/redo for patches (currently irreversible)
- Section reorder by drag in mobile (touch-native)
- "Explain this spec" button — translates AISP to plain English for non-technical stakeholders
- Version history — see the site at any prior patch state

**High value, medium effort:**
- Multi-language support for the public site and onboarding
- A/B variant generator — "show me 3 versions of this hero"
- Spec comparison — diff two versions of the AISP output
- Claude Code handoff button — opens Claude Code with the spec pre-loaded

**Strategic (Tier-2 territory):**
- Team workspaces — multiple people on one project
- Client view — read-only spec link for stakeholders
- Spec versioning with git-style branching

---

## Reviewer recommended next step

OC-1 and OC-2 are the highest-impact pre-launch work. Visual floor and
onboarding redesign affect every first-time user. Everything else builds
on top of a good first impression.

> "Ready to dispatch OC-1 when you give the go."
