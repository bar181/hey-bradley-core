# Phase 1.1: Hero + JSON Core Loop — Log

**Status:** COMPLETE (w/ hotfix) | **Session:** S4 | **Score:** 33/48 (69%)

## Summary
Built the JSON foundation (Zod schemas, configStore, deepMerge), wired hero rendering from config, and created the bidirectional DATA tab. Hit a P0 bug with the custom regex syntax highlighter — rebuilt with CodeMirror 6.

## Key Decisions
- CodeMirror 6 approved, custom regex highlighters banned
- Playwright visual smoke tests now mandatory (ADR-011)
- Cardinal Sin #13 added to Swarm Protocol
- Default config extracted to src/data/default-config.json

## What Worked
- configStore architecture is clean and extensible
- deepMerge utility works correctly (ADR-007 rules)

## What Didn't Work
- Custom colorize() function shipped broken — dangerouslySetInnerHTML dumped raw HTML class names
- Zod .default({}) missing on nested objects caused blank screen
- Score lower (69%) due to DataTab items scored during broken state
