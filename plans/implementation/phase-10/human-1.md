Understood. The project continues beyond capstone — no LLM, no database, no GitHub connection, no file upload yet. Placeholders must be clearly labeled so nothing looks broken. Here's the updated grounding:

---

**SWARM: Phase 10 Sprints 3-5 — Updated Scope**

**What's deferred (requires LLM or database):**
- GitHub repo connection (brownfield analysis) → deferred to Stage 3
- File/image upload to server → deferred to Stage 3 (needs DB)
- Real chat with Claude API → deferred to Stage 3
- Real voice/listen with STT → deferred to Stage 3
- User accounts / saved projects on server → deferred to Stage 3

**What continues NOW (no LLM/DB needed):**
- JSON architecture improvements
- AISP spec generator quality
- Spec template refactoring
- New Hey Bradley website sections (landing, about, open core)
- Wiki documentation expansion
- UI polish and placeholder clarity

**CRITICAL RULE: Placeholders must be obvious and intentional.**

Any feature that's coming later must show a clear, polished "Coming Soon" state — not an empty screen, not a broken button, not a spinner that never resolves. Examples:

```
✅ CORRECT placeholder:
┌─────────────────────────────────────┐
│  🔗 GitHub Connect                  │
│  Connect your repo to generate      │
│  brownfield-aware specs             │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Coming in Pro version      │    │
│  │  Join the waitlist →        │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘

❌ WRONG placeholder:
- A "Connect GitHub" button that does nothing when clicked
- An empty panel with no explanation
- A loading spinner on the Listen tab that never resolves
- A text input in Chat that accepts typing but produces no response
```

For the onboarding page, the "Coming Soon" capabilities (Spec Upload, GitHub Connect, Project History) already have the right treatment — dashed borders, dimmed text, "COMING SOON" label. Apply this same pattern everywhere.

**Sprint 3: Brownfield notation in AISP output (P0, 1.5 hours).**

The AISP generator should include brownfield Γ rules as NOTATION — not as working features. When the spec generates, include:

```aisp
Γ := {
  R_brownfield: □ IF repo_connected THEN reuse(components, "src/components/"),
  R_design_sys: □ IF design_tokens THEN imports(tokens, "src/styles/"),
  % Note: brownfield analysis requires GitHub Connect (Pro)
}
```

The `□` (necessity) operator marks these as conditional — they activate when a repo is connected. The `%` comment makes clear this is a future capability. This demonstrates the brownfield NOTATION for the capstone without requiring a working GitHub integration.

**Sprint 4: Spec template JSON refactor (P1, 2 hours).** Generators consume JSON templates from `src/data/spec-templates/`. No functional change — output must be identical. This is architecture prep for community templates.

**Sprint 5: Quality pass + phase close (P1, 1.5 hours).** Full test suite (71+). AISP validation on generated output. Reproduction test with section-level Γ rules. Retrospective. Wiki update.

---

**Phase 11: Hey Bradley Website (Next Phase)**

Build these sections using Hey Bradley itself. No LLM or DB needed — all static content:

| Section | Content | Status |
|---------|---------|--------|
| Landing page | Don Miller story from hey-bradley-story.html | NEW |
| About | Bradley Ross, Harvard, AISP, Agentics Foundation | NEW |
| The bigger picture | Telephone game, SDD landscape, the 55% bottleneck | NEW |
| Open core | Two repos, tiers, what's free vs commercial | NEW |
| How I built this | Wiki guides, agentic methodology, phase scores | NEW |
| Documentation | Open-core getting started guide | NEW |

**Phase 12: UI Polish + Pre-LLM Ceiling**

Everything possible without LLM/DB:
- Theme creation wizard (pick colors, preview live)
- Section template marketplace (browse community JSON templates)
- Export to ZIP (download specs + JSON as a package)
- Spec comparison view (diff two versions)
- Keyboard shortcuts
- Performance optimization
- Accessibility audit
- 100+ Playwright tests

**The stop point:** When the next meaningful feature requires an LLM call (real chat, real listen, AI-generated content) or a database (user accounts, saved projects on server, uploaded files), we pause and plan Stage 3.

**SWARM: Execute Sprint 3 now. Brownfield notation in AISP output, then Sprint 4 template refactor, then Sprint 5 quality pass. Phase 10 closes when all 5 sprints are done and 71+ tests pass.**