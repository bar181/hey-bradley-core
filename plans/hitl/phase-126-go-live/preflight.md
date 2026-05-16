# P126 / GO LIVE — Preflight

> **Mission:** Production-ready chat-driven builder. Six discrete
> features, each reported incrementally per owner directive.
>
> **Branch:** `swarm/p126-go-live` (cut from `main` @ `28d259f2c` —
> the P125 visual-overhaul merge commit).
>
> **Predecessor:** P125 / Visual Overhaul merged to main 2026-05-16
> with composite ~71-73/100 (per `plans/hitl/phase-125/retrospective-addendum.md`).
> Production live at https://hey-bradley-core.vercel.app/.

---

## 1. Owner-locked decisions (per `human-2.md`)

- **Process:** understand → research → plan → ADR → decompose → TDD → implement → verify → optimize
- **Reporting:** report after each feature completes. **Do not bundle.**
- **No /api/demo-chat:** BYOK only via localStorage; no server-side key path on this branch
- **Default template:** Hey Bradley branded (dark, crimson, "Describe it. See it." hero)
- **Persistence:** chat history in localStorage under key `hey-bradley-session-log`
- **Low-confidence tone:** casual notes ("I had to guess on that one...") — NOT formal/apologetic
- **Status bar enrichment** (owner chat directive, lands inside F2): LLM key indicator (default vs provided), LLM status (green circle), version pill `POC 126.0`, default tone, specs-up-to-date check, plus 1-2 more concise flags

## 2. Feature roster

| # | Feature | Scope | Status |
|---|---|---|---|
| **F1** | Default template → Hey Bradley | Locate `defaultTemplate` in `src/lib/` or `src/contexts/`; swap SaaS for Hey Bradley template per P122 spec | pending |
| **F2a** | BYOK hover panel | New `src/components/shell/BYOKPanel.tsx`; top-right hover-expand; save runs Gemini smoke test; localStorage-only; ADR required | pending |
| **F2b** | Enriched StatusBar | Add to `src/components/shell/StatusBar.tsx`: LLM key indicator, LLM status (green dot), version pill, tone, specs-up-to-date, +1-2 flags | pending |
| **F3** | Chat history tab in Agentics | Log every event type (user prompt, LLM call, response, patch, error); reverse chrono; type badges; expandable; Export/Clear | pending |
| **F4** | Agentics specs card | Live: JSON / Chat History / structure. On-demand: North Star / AISP / Build Plan / Architecture / Features / Full Specs. Checklist + per-row refresh + master "Create Specifications" button | pending |
| **F5** | Low-confidence LLM responses | Confidence threshold in `geminiAdapter.ts` + listen handler; casual notes; link to Chat History tab | pending |
| **F6** | Live prompt test | Prompt "Update the hero section" → verify patch + chat-log + confidence note + Agentics update | pending |

## 3. ADRs to write

| ADR | Topic | Trigger |
|---|---|---|
| ADR-150 (or next free) | localStorage-only BYOK key storage + zero server transmission + redaction rules | F2 |
| ADR-151 | Session chat-history persistence pattern (`hey-bradley-session-log` localStorage key) | F3 |
| ADR-152 | LLM confidence threshold + low-confidence response convention | F5 |

(Owner directive: ADR step is mandatory per process discipline, even
when ADR adds ≤30 LOC of doc.)

## 4. Phase audit (per Step 0)

Triplet completeness for phases 121-125 (preflight + session-log + retrospective):

| Phase | preflight | session-log | retrospective | Other | Status |
|---|---|---|---|---|---|
| 121 | ✅ | ✅ | ✅ | 6 files archived | COMPLETE |
| 122 | ✅ | ✅ | ✅ | 9 files archived | COMPLETE |
| 123 | ✅ | ✅ | ✅ | 9 items archived (incl. screenshots/ dir, untracked `builder mode - right panel.png`) | COMPLETE |
| 124 | ✅ | ✅ | ❌ **MISSING** | 1 file archived | **GAP** |
| 125 | ✅ | ✅ | ✅ + addendum | 1 file archived | COMPLETE |

**Phase audit TODO:**
- [ ] **P124 `retrospective.md`** — never written. Reconstruct from
      session-log.md + the post-EOP commits (the Vercel demo-mode work
      P124 was scoped to). Either write a real retrospective OR
      document the gap explicitly with a one-paragraph "deferred to
      P126 audit, captured here" note. Pick during P126 implementation.

## 5. DoD — 10 completion gates (per `human-2.md`)

- [ ] Default template is Hey Bradley
- [ ] BYOK panel works with smoke test
- [ ] Chat history logs all event types
- [ ] Specs card shows checklist + button
- [ ] Low-confidence responses with link
- [ ] Live prompt test passes
- [ ] `npm run build` — zero errors
- [ ] Phase audit table in `preflight.md` (✅ this section)
- [ ] `session-log.md` updated throughout
- [ ] `retrospective.md` completed at end

## 6. Inherited carry-forwards (from P125.7 addendum)

| ID | Item | Routing |
|---|---|---|
| CF-P125-cinematic-screenshots | Real product thumbnails inside CinematicDemo | defer — needs asset acquisition |
| CF-P125-W8-blog-editorial | Blog editorial layout | defer |
| CF-P125-mobile-test | Real-device mobile QA at 320/375/414 px | defer |
| CF-P126-chat-mode-fix | Owner-stated, scope TBD | covered by F3 + F5 |
| CF-P126-chat-history-panel | Owner-stated | covered by F3 |
| CF-P126-arch2-legacy-sweep | Pre-existing hex literals in RealityTab/SpecWorkbench/TopBar/ThemeSimple | defer — separate token-migration phase |
| CF-P126-ineffective-dyn-import | 5 INEFFECTIVE_DYNAMIC_IMPORT warnings | defer — tech debt |

## 7. Risks

- **Smoke-test ping cost (F2):** owner's $1 first-launch cap (per ADR-150 D1 of P124). Each BYOK validation = ~1 token = ~$0.0000003. Negligible.
- **Chat history privacy:** localStorage is per-origin per-browser; safe boundary. ADR-151 must reaffirm no transmission.
- **Specs card LLM cost:** "Create Specifications" runs 6 LLM calls sequentially. Cost ceiling per click ≈ 6 × small-prompt ≈ $0.005. Warn in UI before triggering.
- **Default template swap (F1):** any persisted user state pointing at old template ID could break. Need migration check in store hydration.

## 8. Rollback plan

Each feature lands in its own commit on `swarm/p126-go-live`. If any
feature regresses production, revert that single commit — branch stays
useful for the rest. The whole branch promotes to main only after F6
passes the live prompt test.

---

*Branch `swarm/p126-go-live` cut from main @ `28d259f2c`. Phase audit
complete: 26 files archived across phases 121-125; one real gap
(P124 retrospective.md) documented above.*
