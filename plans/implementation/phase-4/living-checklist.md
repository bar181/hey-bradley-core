# Phase 4: Living Checklist

**Purpose:** Single source of truth for Phase 4 acceptance criteria.

---

## Example Websites (4.1)

| # | Check | Severity |
|---|-------|----------|
| E1 | At least 3 example website JSONs exist with unique copy/images | P0 |
| E2 | "Try an Example" UI accessible from onboarding or TopBar | P0 |
| E3 | Click example → loads JSON → builder shows the site | P0 |
| E4 | Each example uses a different theme | P0 |
| E5 | Each example has 5+ enabled sections | P1 |

## Simulated Chat (4.2)

| # | Check | Severity |
|---|-------|----------|
| C1 | Chat input sends user message and displays it | P0 |
| C2 | At least 5 canned commands produce visible changes | P0 |
| C3 | Chat history shows user + Bradley messages | P0 |
| C4 | "Processing..." indicator during delay | P1 |
| C5 | No page errors during chat interaction | P0 |

## Simulated Listen Mode (4.3)

| # | Check | Severity |
|---|-------|----------|
| L1 | LISTEN toggle shows dark overlay with red orb | P0 |
| L2 | "START LISTENING" button visible | P0 |
| L3 | Typewriter text sequence runs (~10-15s) | P0 |
| L4 | After sequence: example website loads in preview | P0 |
| L5 | Toggle back to BUILD dismisses overlay | P0 |
| L6 | Red orb has pulsing/breathing animation | P1 |

## XAI Docs (4.4)

| # | Check | Severity |
|---|-------|----------|
| X1 | HUMAN view shows structured spec from current JSON | P1 |
| X2 | AISP view shows @aisp formatted output | P1 |
| X3 | Both views update when config changes | P1 |
| X4 | Copy to clipboard works | P1 |
| X5 | Export downloads .md file | P2 |

## Workflow Pipeline (4.5)

| # | Check | Severity |
|---|-------|----------|
| W1 | Pipeline steps visible in Workflow tab | P1 |
| W2 | Steps animate sequentially during listen simulation | P1 |
| W3 | Completed steps show green check | P2 |

---

## Phase 4 Pass Criteria

| Severity | Rule |
|----------|------|
| P0 failures | **BLOCKING** — cannot close Phase 4 |
| P1 failures | Should fix, can close with documented exceptions |
| P2 failures | Log for backlog |

**Overall pass:** Zero P0 failures.
