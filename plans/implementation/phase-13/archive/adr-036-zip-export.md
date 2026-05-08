# ADR-036: ZIP Export

**Status:** Accepted  
**Date:** 2026-04-05  
**Phase:** 13 Sprint 4

## Context

Users need to export their site specs and config as a downloadable package. Currently, the Blueprints tab allows downloading individual spec files one at a time. Users want a single-click "Export All" that bundles everything together for handoff to developers, AI tools, or archival.

## Decision

Export as a ZIP file containing all specs (Markdown), AISP spec, JSON config, and a README overview. We use the JSZip library for browser-side ZIP generation and triggering a download — no server required, works fully offline.

### Export Contents

```
project-export/
  specs/north-star.md
  specs/architecture.md
  specs/build-plan.md
  specs/features.md
  specs/human-spec.md
  specs/aisp.aisp
  config.json
  README.md
```

## Consequences

- **Simple:** Pure client-side, no server infrastructure needed
- **Offline-capable:** Works without network connectivity
- **Portable:** ZIP is universally understood and easy to share
- **Dependency:** Adds JSZip (~100KB gzipped) as a runtime dependency
- **No images:** Export includes specs and config only; images are referenced by URL in the config
