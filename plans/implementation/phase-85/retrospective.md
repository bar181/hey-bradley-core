# P85 — Retrospective (AISP Integration Audit)

> **Phase:** P85 · **Sprint:** OC-AISP-AUDIT · **Date:** 2026-05-01

## Keep

- **Audit-first / impl-second 2-wave structure.** A1 (READ-ONLY surface inventory) → A2 (surgical edits informed by audit) is the same pattern that worked at P78 OC-11 and P79 OC-14. Reusable for any future "where should X surface?" sprint.
- **existsSync-guarded sibling-agent surfaces.** Tests P85.4 + P85.5 skip-pass when A2 hasn't shipped yet. This pattern (also used at P84 / P83 / P82) lets parallel agents run without red-cascading the seal-gate.
- **Principle ADR + reference component + tests + audit doc as a unit.** Four artifacts (ADR-110 + AISPDeveloperCard + spec + audit) cover the principle (the WHY), one reference implementation (the WHAT), the gate (the VERIFICATION), and the inventory (the WHERE). Future visibility-style sprints should ship all four.
- **Standalone component + carry-forward mount.** A3's developer card ships unmounted; mount lands in P94 when the Agentics landing surface ships. Pattern lets us land the artifact early without blocking on a yet-to-exist surface.

## Drop

- **Don't expand AISP-only labels.** ADR-110 §2 says human-primary + AISP-collapsible-secondary. Any future PR proposing AISP-only labels (no human text) gets rejected at review. The dual-view standard is the floor, not a ceiling.
- **Don't add AISP to marketing pages.** ADR-110 §3 keeps marketing / hero / pricing internal-only by default. Surfacing AISP on the landing hero would add jargon for novice users without offsetting upside.

## Reframe

- **"Visibility audit" reframed as "principle-encoding sprint".** P85 is not feature work; it's standard-encoding work. The deliverables are the standard (ADR-110), the inventory (audit doc), the first reference implementation (developer card), and the test gate. Treating it as feature work would have inflated A2's scope; treating it as governance work kept Wave 2 surgical.
- **Carry-forwards have phase-of-origin pointers.** P94 (developer card mount), P89 (geek demo + blog macro), Tier-2 (error catalog + ruvector suggestions). Nothing silent-drops; every deferred item has a rationale and a target phase.

## Carry-forward

1. **P94:** Mount `AISPDeveloperCard` in Agentics mode landing surface (when that surface ships)
2. **P89 candidate:** Geek-personality demo flow showing AISP trace prominently
3. **P89 candidate:** Blog post AISP code-block macro (pattern for embedding AISP snippets inside blog posts)
4. **Tier-2 commercial:** Comprehensive AISP error catalog UI (full taxonomy + filterable browse)
5. **Tier-2 learning runtime:** Ruvector-pattern-driven AISP suggestions ("users who said X also produced Y atom")

## Velocity note (post-RC pace)

P85 is the **first post-RC sprint**. The OC arc (P74 → P84) sealed v1.0.0-RC1 in 11 sprints over a few working days at ~6 phases/day velocity. P85 confirms the post-RC pace stays at the same velocity: principle-encoding sprints (small ADR + reference component + spec + audit) are roughly 1-sprint scope at this velocity.

The post-RC pace deliberately avoids feature sprints in the immediate post-seal window. P85 is governance; P86-P88 candidates are similar-scope cleanup or principle work. Feature sprints (P89+) re-enter the queue once the post-RC owner-led tasks (BYOK smoke, demo video, Show HN, Agentics Foundation beta) ship.

## Process note: "Agentics mode landing wiring deferred to P94 by design"

The AISPDeveloperCard ships unmounted this sprint. This is **not a slip** — it's the explicit design. The Agentics mode landing surface does not yet exist; rather than scaffold a surface just to mount the card, we ship the card standalone and mount when the surface ships in P94. The carry-forward pointer (P94) is documented in ADR-110 §"Five dual-view candidates" and in `session-log.md` carry-forward table.

This pattern (ship the artifact early, mount when the surface ships) keeps sprint scope tight and avoids surface scaffolding work that would inflate the sprint without adding user value at this seal.
