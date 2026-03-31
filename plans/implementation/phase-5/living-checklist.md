# Phase 5: Living Checklist — Simulated Chat

**Purpose:** Single source of truth for Phase 5 acceptance criteria.

---

## Chat Input

| # | Check | Severity | Status |
|---|-------|----------|--------|
| C1 | Chat input accepts text and sends on Enter | P0 | |
| C2 | User message appears in chat bubble | P0 | |
| C3 | "Bradley" response appears after delay | P0 | |
| C4 | At least 6 canned commands produce visible changes | P0 | |
| C5 | "Processing..." indicator during delay | P1 | |
| C6 | No page errors during chat interaction | P0 | |

## Canned Commands

| # | Command | Expected Result | Severity | Status |
|---|---------|-----------------|----------|--------|
| K1 | "dark" / "dark mode" | Swap to dark palette | P0 | |
| K2 | "light" / "light mode" | Swap to light palette | P0 | |
| K3 | "add testimonials" | Enable testimonials section | P0 | |
| K4 | "remove pricing" | Disable pricing section | P0 | |
| K5 | "headline Build Something" | Update hero headline | P0 | |
| K6 | "theme agency" | Apply Agency theme | P0 | |
| K7 | Unrecognized input | Helpful fallback message | P1 | |

## Chat UI

| # | Check | Severity | Status |
|---|-------|----------|--------|
| U1 | Chat history scrollable | P1 | |
| U2 | Chat visible in left panel | P0 | |
| U3 | User and Bradley messages visually distinct | P1 | |

---

## Pass Criteria

| Severity | Rule |
|----------|------|
| P0 failures | **BLOCKING** |
| P1 failures | Should fix, can close with documented exceptions |

**Overall pass:** Zero P0 failures.
