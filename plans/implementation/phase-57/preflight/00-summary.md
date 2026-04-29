# P57 Preflight — Sprint N: Shareable Output + Viral Mechanic (POST-DEFENSE)

> **Phase title:** Sprint N — Static HTML Export + Hosted Spec URL
> **Status:** PLANNED (post-capstone-defense)
> **Successor of:** P56 (Sprint M — premium templates) → capstone defense window → P57
> **Canonical roadmap:** `plans/strategic-reviews/open-core-moat-roadmap.md`

## North Star

> **Hey Bradley produces a shareable URL that survives Slack / Twitter / iMessage.**
> Sprint J shipped a clipboard data URL. That won't survive most messengers (they truncate, they strip, they refuse). Sprint N replaces it with (1) a static-HTML export the user can host anywhere AND (2) a hosted-link backbone (Vercel KV or Supabase read-only row) that gives a real URL.

This is moat priority #4 (shareable artifact) from the open-core moat roadmap. The viral mechanic.

## Moat metric (the gate)

| Dimension | Target |
|---|---|
| Static HTML export produces self-contained `.zip` | yes (no server required, opens in any browser) |
| Hosted spec URL works in Slack | yes (manual paste-test) |
| Hosted spec URL works in Twitter DM | yes (manual paste-test) |
| Hosted spec URL works in iMessage | yes (manual paste-test) |
| "Built with Hey Bradley" attribution viewable on shared output | yes (footer or watermark; not removable in default export) |
| Replaces Sprint J ShareSpecButton clipboard data URL | yes (ADR-075 superseded by ADR-080) |

## Scope IN — 3 parallel agents

### A1 — Static HTML export
- NEW `src/contexts/export/staticHtmlExport.ts` (≤180 LOC) — generates a self-contained `.zip` from project JSON spec
- Output bundle: `index.html` + `style.css` + `images/` + `aisp.json` + `README.txt` (the human-readable spec)
- "Built with Hey Bradley" footer rendered into the HTML; attribution preserved by default
- Reuses existing render pipeline (no new server-side rendering)
- ≤220 LOC total module + tests

### A2 — Hosted shareable spec link
- Single-endpoint server stub: Vercel KV preferred (zero-cost; existing Vercel deploy from P20)
- POST `/api/share` accepts spec JSON → returns short URL `https://{host}/s/{id}`
- GET `/s/{id}` renders read-only spec view (HTML; reuses A1 static HTML rendering)
- Replaces Sprint J `ShareSpecButton` clipboard data URL behavior
- Migration path: existing `ShareSpecButton` continues to work; new "Hosted link" CTA added alongside
- ≤200 LOC total (server stub + client wiring)

### A3 — ADR-080 + tests + EOP
- NEW `docs/adr/ADR-080-shareable-output.md` (≤140 LOC; full Accepted; **supersedes ADR-075** clipboard-only share semantics; cross-refs ADR-049 cost-cap discipline — share is read-only, no LLM call)
- NEW `tests/p57-static-export.spec.ts` (~10 PURE-UNIT cases): zip structure; HTML self-contained; attribution footer present; no path traversal in image refs
- NEW `tests/p57-hosted-share.spec.ts` (~8 cases): POST/GET roundtrip via mock; URL format; spec readback fidelity
- Manual paste-test checklist (Slack / Twitter / iMessage / email) — owner runs before seal
- EOP: session-log + retrospective + P58 preflight scaffold

## Locked decisions

- **D1 — Vercel KV preferred.** Existing Vercel deploy from P20; zero infrastructure cost. Supabase read-only row is the fallback if Vercel KV proves insufficient.
- **D2 — Read-only sharing.** No write-back from shared link to source project. Avoids OAuth / user-account scope creep.
- **D3 — Attribution baked in.** "Built with Hey Bradley" footer cannot be stripped via standard export flow. Explicit ADR-080 decision; commercial tier may unlock removal.
- **D4 — Static export ships first; hosted link ships second.** A1 lands without infra; A2 layers the URL on top.
- **D5 — POST-DEFENSE phase.** Sprint N ships AFTER capstone defense to avoid contaminating the demo with inflight infra changes.

## Scope OUT (deferred)

- Public release / README rewrite → P58
- Demo video → P58
- Learning flywheel runtime / telemetry → commercial track
- Multi-page export polish → commercial track (current output is single-page; multi-page export is functional but not flagship)

## DoD

- [ ] A1 static HTML export produces self-contained zip; "Built with Hey Bradley" footer preserved
- [ ] A2 hosted spec URL roundtrip via Vercel KV (or Supabase fallback); POST/GET working
- [ ] A3 ADR-080 full Accepted (supersedes ADR-075 clipboard-only) + ~18 PURE-UNIT tests GREEN
- [ ] Manual paste-test passes in Slack + Twitter + iMessage
- [ ] tsc clean; cumulative regression GREEN
- [ ] STATE.md row + CLAUDE.md roadmap updated; P58 preflight scaffolded

## Risks

- **R1 — Server adds infra cost / footprint.** Mitigation: D1 (Vercel KV is essentially zero-cost at expected open-core volume; <100 shares/day projected).
- **R2 — Vercel KV vendor lock-in.** Mitigation: D2 read-only contract is portable; Supabase fallback documented in ADR-080.
- **R3 — Attribution removal pressure.** Mitigation: D3 (open-core tier preserves; commercial tier may unlock).
- **R4 — Static export breaks on complex multi-page projects.** Mitigation: A1 ships single-page first; multi-page is commercial-track follow-up.
- **R5 — Pre-defense contamination.** Mitigation: D5 (POST-DEFENSE only; no Sprint N work touched before capstone seal).

## Cross-references

- `plans/strategic-reviews/open-core-moat-roadmap.md` (canonical reframe — Sprint N = priority 4)
- ADR-075 (Sprint J ShareSpecButton — clipboard data URL; SUPERSEDED by ADR-080)
- ADR-049 (cost-cap discipline — share is read-only, no LLM)
- `2026-04-29-product-evaluation.md` §"What would make this an A" rec #2 (hosted shareable artifact)
- `2026-04-29-sprint-j-system-wide/04-performance-and-forward.md` §6 rec #10

P57 is the viral-mechanic phase. Without it, distribution stays at D+ regardless of how good the spec or templates are. With it, "Built with Hey Bradley" becomes screenshot-bait on dev Twitter.
