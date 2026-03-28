# Level 3: Specification Engine — Retrospective & Test Plan

## Playwright Test Plan

### Phase 3.1 — Pillar Docs (XAI Docs Tab)

#### Test: XAI DOCS tab content accuracy
```
- Navigate to builder with a configured project
- Click XAI DOCS tab
- Verify North Star spec is rendered and contains project-specific content
- Verify Architecture spec reflects current section layout
- Verify Implementation Plan spec matches config state
- Assert no placeholder or template text remains in output
```

#### Test: HUMAN/AISP toggle
```
- Open XAI DOCS tab
- Verify HUMAN view is default
- Toggle to AISP view
- Verify content switches to @aisp Crystal Atom format
- Verify Crystal Atom markers (@aisp, field delimiters) are present
- Toggle back to HUMAN view
- Verify content returns to structured markdown
```

#### Test: Copy/export functionality
```
- Open XAI DOCS tab in HUMAN view
- Click copy button for North Star spec
- Verify clipboard contains expected markdown content
- Click export button
- Verify file download triggers with correct filename and content
- Repeat for AISP view — verify exported content is in Crystal Atom format
```

#### Test: Live updates when config changes
```
- Open XAI DOCS tab
- Note current spec content
- Switch to CONFIG tab and change site name
- Switch back to XAI DOCS tab
- Verify spec content reflects the updated site name
- Add a new section in the builder
- Verify Architecture spec now includes the new section
```

### Phase 3.2 — Site-Level Detail Specs

#### Test: Download zip
```
- Configure a project with multiple sections
- Navigate to XAI DOCS tab
- Click download/export all button
- Verify a .zip file is downloaded
- Verify download progress indicator appears and completes
```

#### Test: Verify zip contents
```
- Extract downloaded zip
- Verify presence of: north-star.md, architecture.md, implementation-plan.md
- Verify presence of per-section spec files for each configured section
- Verify presence of config.json matching current builder state
- Verify no extraneous or empty files
```

#### Test: Claude Code format validation
```
- Extract downloaded zip
- Open per-section spec files
- Verify each contains: section type, variant, content fields, CSS properties
- Verify specs include clear implementation instructions
- Verify config.json is valid JSON and parseable
- Verify the package is self-contained (no references to external resources)
```

---

## Retrospective

### What Went Well
_(To be filled after Level 3 completion)_

### What Could Be Improved
_(To be filled after Level 3 completion)_

### Key Decisions Made
_(To be filled after Level 3 completion)_

### Lessons Learned
_(To be filled after Level 3 completion)_

### Action Items for Future Levels
_(To be filled after Level 3 completion)_
