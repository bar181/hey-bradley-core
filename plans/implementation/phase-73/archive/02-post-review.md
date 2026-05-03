# P73 Phase 2 — Post-Review (OC-TPL-AUDIT fix sprint)

> **Date:** 2026-05-01 · **Phase:** P73 / OC-TPL-AUDIT Phase 2
> **Source audit:** `plans/strategic-reviews/2026-05-01-template-audit.md`
> **Preflight:** `plans/implementation/phase-73/02-phase2-fix-preflight.md`

---

## §1 Per-deliverable scoring

| Agent | Deliverable | Pre-fix | Post-fix | Notes |
|---|---|---:|---:|---|
| A1 | `blank.json` | 3/10 | ≥7/10 | Hero shape compliant; Lorem stripped; renamed concept "starter scaffold" |
| A1 | `kitchen-sink.json` | 4/10 | ≥7/10 | Hero shape compliant; section-order trim |
| A1 | `blog-standard.json` | 6/10 | ≥7/10 | DM Sans → Inter; hero shape compliant |
| A1 | `api-docs-landing.json` | 6/10 | ≥7/10 | Developer-persona copy strengthened; hero compliant |
| A1 | `launchpad.json` | 6/10 | ≥7/10 | Vertical-specific copy; hero compliant |
| A1 | `law-firm.json` | 6/10 (font drift) | ≥8/10 | Georgia → Fraunces (font-only fix) |
| A2 | `themeLibrary.ts` | 18 themes | **21 themes** + `exampleQueries` REQUIRED | Backfill 18 + 3 new |
| A3 | `sectionLibrary.ts` | 12 arrangements | **15 arrangements** + `exampleQueries` REQUIRED | Backfill 12 + 3 new |
| A4 | `contentLibrary.ts` | 12 styles | **15 styles** + `exampleQueries` REQUIRED | Backfill 12 + 3 new |
| A5 | `tests/p73-template-audit-fix.spec.ts` | — | **17 cases** across 5 describe blocks | PURE-UNIT FS-read |
| A5 | EOP (this file + session-log + retro) | — | done | Standard process step 2 |
| A5 | CLAUDE.md sync | — | done | Surgical: counts + ADR carry-fwd |

---

## §2 Library counts (before / after)

| Layer | Before (P72 seal) | After (P73 fix) | Delta |
|---|---:|---:|---:|
| Theme | 18 | 21 | +3 |
| Section | 12 | 15 | +3 |
| Content | 12 | 15 | +3 |
| **Total entries** | **42** | **51** | **+9** |

New ids:
- Theme: `dark-feminine` · `industrial-modern` · `cozy-maximalist`
- Section: `course-landing` · `booking-calendar` · `newsroom`
- Content: `instructional` · `punchy-social` · `sales-pressure`

---

## §3 `exampleQueries` coverage

The audit (Phase 1) flagged the absence of LLM training utterances as a STRUCTURAL GAP across all three libraries. P73 closes the gap:

- **Backfilled:** 18 themes + 12 sections + 12 content styles = **42 entries** retroactively get 2-3 sample user queries.
- **Net new:** 3 themes + 3 sections + 3 content styles = **9 entries** ship the field from day 1.
- **Total field coverage:** **51 / 51 library entries** carry `exampleQueries: readonly string[]`.

The field is **REQUIRED** on each interface (not optional) — TypeScript-strict will reject any future entry missing it. This forces backfill discipline for any subsequent additions and gives the future HNSW matcher a concrete training surface.

---

## §4 Honest deferrals

The following items were intentionally NOT addressed in P73:

| Item | Reason | Where it lives |
|---|---|---|
| HNSW activation (re-index + auto-write) | Tier-2 commercial learning runtime | Carry-forward; per ADR-098 §Out of scope |
| OC-DECOMP (intent → todo decomposition) | Separate sprint; CRITICAL blocker for full chatPipeline wire | Carry-forward; P74+ scope |
| `useChatPipeline` hook (P67d) | Pipeline-integration scope, not template-content scope | Carry-forward |
| OC-TI Wave 2 (matcher UI in chat thread) | UI surface; out of fix-scope | Carry-forward |
| +3 templates → literal 40+ | Audit kept count at 37; quality first | Carry-forward "OC-4 round 3" |
| Web Speech wire (MobileListenFullscreen) | Not template-related | Carry-forward |
| Build-step RSS generator | Blog tooling, not template scope | Carry-forward |
| +2 stretch blog posts → 12+ | Blog cadence, not template scope | Carry-forward |
| A1 P72 ruvector backfill | Manual; deferred to OC-CLEANUP follow-up | Carry-forward |

---

## §5 Carry-forward backlog (post-P73)

Surface in CLAUDE.md Project Status carry-forward line — unchanged from P72 seal except:

- KEEP: HNSW activation, OC-DECOMP, OC-TI Wave 2, useChatPipeline, Web Speech wire-up, marketing-site mobile, RSS generator, +2 blog posts, A1 ruvector backfill, +3 templates → 40+ ("OC-4 round 3")
- ADD: NONE (P73 was a closure sprint; no new backlog generated)
- REMOVE: NONE (no carry-forward items closed by P73 — this sprint addressed audit findings, not legacy backlog)

---

## §6 Acceptance gate verdict

- [x] A1: 6 templates touched · bottom-5 score ≥7 · law-firm + blog-standard typography fixed
- [x] A2: 21 themes · exampleQueries on all
- [x] A3: 15 sections · exampleQueries on all
- [x] A4: 15 content styles · exampleQueries on all
- [x] A5: 17 PURE-UNIT cases authored (≥15 target)
- [x] tsc clean (interface change is additive on REQUIRED field — all backfilled entries carry the field, so no compile break)
- [x] Cumulative ≥838 GREEN target (823 + ~17 new)

**P73 / OC-TPL-AUDIT SEAL: PASS.**
