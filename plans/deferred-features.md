# Deferred Features - Historical Build Review

Features planned across phases but not yet implemented, with rationale and current status.

## Deferred Feature Table

| Feature | Original Phase | Rationale | Status |
|---------|---------------|-----------|--------|
| A/B variant testing | P12 README, P13 README | Too complex for pre-LLM stage; requires side-by-side rendering infrastructure | Deferred to post-LLM (P23+) |
| Custom section builder | P13 README | Requires LLM for dynamic content generation; template-based approach covers most use cases | Deferred to post-LLM (P23+) |
| Template marketplace | P11 README (P2) | Resources tab covers template browsing partially; full marketplace requires cloud infra | Partially addressed; full version deferred to P23+ |
| Multi-page support | P13 README (Sprint 3) | Architecture designed; requires stable section types and page routing | Planned for P13 |
| Blog section type | P13 README (Sprint 2) | ADR-034 required; needs article card variants and markdown support | Planned for P13 |
| Blog article editor with markdown | P13 README | Requires blog section type first; complex rich-text editing | Planned for P13 |
| ZIP export | P13 README (Sprint 4) | ADR-036 required; needs Blob API and manifest generation | Planned for P13 |
| Accessibility audit | P13 README (Sprint 4) | Baseline established conceptually; formal WCAG audit not yet executed | Planned for P13 |
| Real LLM integration (chat) | P5, P6, P8 README | Deliberately deferred until spec layer is solid; canned simulations used instead | Deferred to P23+ |
| Real voice mode (listen) | P5, P6, P8 README | Web Speech API STT deferred; scripted demos cover capstone needs | Deferred to P23+ |
| Auth and database (Supabase) | P8 README, P15 README | No external dependencies until post-capstone; localStorage covers MVP | Deferred to P15 |
| Cloud project persistence | P15 README | Requires Supabase integration; localStorage + JSON export covers pre-LLM needs | Deferred to P15 |
| Project sharing (public URLs) | P15 README | Requires cloud persistence first | Deferred to P15 |
| Version history per project | P15 README | Requires database; spec diffing planned for P16 | Deferred to P15-P16 |
| Image upload to Supabase storage | P15 README | Base64 data URIs used as MVP approach per ADR-029 | Deferred to P15 |
| User dashboard | P15 README | Requires auth and database | Deferred to P15 |
| Expert AISP editing with syntax highlighting | P16 README | Current AISP output is read-only; interactive editing needs custom editor | Deferred to P16 |
| AISP real-time validation engine | P16 README | Ambig(D) < 0.02 checking requires formal validator | Deferred to P16 |
| Spec diff viewer | P16 README | Side-by-side version comparison requires version history first | Deferred to P16 |
| Two-repo split (open-core vs pro) | P16 README | Build full product first, cut open-source at LLM/DB boundary | Deferred to P16 |
| Plugin architecture for custom generators | P16 README | 6 built-in generators cover capstone needs; plugin system adds complexity | Deferred to P16 |
| Tone selector | P12 README (Sprint 1) | Formal/Casual/Playful/Technical affects all generated copy | Planned for P12 |
| Audience picker | P12 README (Sprint 2) | Consumer/Business/Developer/Enterprise drives section suggestions | Planned for P12 |
| Site purpose declaration | P12 README (Sprint 3) | Portfolio/Marketing/SaaS/Blog/Agency shapes spec output | Planned for P12 |
| Brand guidelines template | P12 README (Sprint 4) | Voice rules, color rules, typography rules per project | Planned for P12 |
| Custom hex color input in palette editor | P6 (stretch), P7 (excluded), P9 Sprint 3 | Implemented in P9 | Complete |
| Scroll-triggered fade-in animations | P6 (stretch) | Nice-to-have visual polish; not critical for spec-driven focus | Deferred indefinitely |
| Print-friendly spec export (PDF) | P14 README | PDF formatting adds dependency; markdown export covers the need | Deferred to post-LLM |
| SEO content scoring | P14 README | Grade titles/descriptions/headings; requires heuristic engine | Deferred to P14+ |
| Copywriting assistant (pre-LLM) | P14 README | Template-based copy suggestions; partially covered by tone/audience system | Deferred to P14 |
| Accessibility report in specs | P14 README | WCAG compliance check in Build Plan output | Deferred to P14 |
| Brand voice guide in specs | P14 README | Tone, vocabulary, do's/don'ts in spec output | Deferred to P14 |
| Newsletter form webhook | P9 Sprint 3 | Configurable POST endpoint for email capture | Implemented in P9 |
| Theme creation wizard | P11 README | Pick colors, preview live, save as custom theme; requires UI complexity | Deferred to post-LLM |
| Food blog listen demo | P12 README, P13 README | Scripted demo sequence for blog use case; carried forward from P12 | Planned for P13 |
| Consolidated "Master Spec" view | P13 README (known debt) | Single combined view of all 6 specs; optional enhancement | Deferred indefinitely |
| Pre-LLM simulation phases | P13 README (P20-P22) | Simulated LLM responses, prompt templates, response validation before real AI | Planned for P20-P22 |
| Full feature review (comprehensive) | P17-P18 README | ADR-based review checklist applied to every section and feature | Planned for P17-P18 |

## Summary

- **Completed:** 2 features (custom hex color, newsletter webhook)
- **Planned for P12:** 4 features (tone, audience, purpose, brand guidelines)
- **Planned for P13:** 5 features (multi-page, blog section, blog editor, ZIP export, a11y audit)
- **Planned for P14-P18:** 7 features (review phases, copy polish, accessibility)
- **Deferred to P15-P16:** 8 features (auth, database, cloud, expert AISP, plugins)
- **Deferred to P20-P22:** 1 feature set (pre-LLM simulations)
- **Deferred to P23+ (post-LLM):** 5 features (real LLM, A/B testing, custom sections, marketplace, theme wizard)
- **Deferred indefinitely:** 2 features (scroll animations, master spec view)
