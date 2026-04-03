# Phase 5: Living Checklist — Chat Intelligence + Listen Integration

**Last Updated:** 2026-04-02 (Phase 5 kickoff)

---

## Simulated Chat v2

| # | Check | Severity | Status |
|---|-------|----------|--------|
| SC1 | 15+ recognized command patterns (up from 7) | P0 | TODO |
| SC2 | Multi-word intent detection works ("make the background blue") | P1 | TODO |
| SC3 | Compound commands work ("add testimonials and make it dark") | P1 | TODO |
| SC4 | Contextual responses reference what changed | P1 | TODO |
| SC5 | Typing indicator has personality (not just "Processing...") | P2 | TODO |
| SC6 | All existing 7 commands still work (no regressions) | P0 | TODO |

## Chat History Panel

| # | Check | Severity | Status |
|---|-------|----------|--------|
| CH1 | Scrollable conversation history in Chat tab | P0 | TODO |
| CH2 | Messages persist across tab switches (Builder/Chat/Listen) | P0 | TODO |
| CH3 | Clear history button works | P1 | TODO |
| CH4 | Session-scoped storage survives page navigation | P1 | TODO |
| CH5 | Visual timestamp grouping ("just now", "earlier") | P2 | TODO |

## Listen Mode Integration

| # | Check | Severity | Status |
|---|-------|----------|--------|
| LI1 | Listen transcript feeds into command parser | P0 | TODO |
| LI2 | Recognized spoken command applies JSON patch to builder | P0 | TODO |
| LI3 | Orb pulses on command recognition | P1 | TODO |
| LI4 | Transcript shows "Applying: [command]..." on recognition | P1 | TODO |
| LI5 | Unrecognized speech shows in transcript but does not modify builder | P0 | TODO |

## Unified Command Layer

| # | Check | Severity | Status |
|---|-------|----------|--------|
| UC1 | Shared command parser used by both Chat and Listen | P0 | TODO |
| UC2 | Consistent response messages across typed and spoken input | P1 | TODO |
| UC3 | Adding a new command in one place works for both inputs | P1 | TODO |

---

## Phase 5 Pass Criteria

| Severity | Rule | Result |
|----------|------|--------|
| P0 failures | BLOCKING | **TBD** |
| P1 failures | < 3 allowed | **TBD** |
| P2 failures | Informational | **TBD** |

## Test Results

- TBD — tests to be written alongside implementation
