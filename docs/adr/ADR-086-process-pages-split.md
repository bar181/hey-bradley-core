# ADR-086 — Process Pages: Content vs Runtime Split

**Status:** Accepted
**Date:** 2026-04-30
**Phase:** P61 (planning) → P62..P75 OC-14, OC-15 execution
**Supersedes:** none
**Cross-refs:** ADR-035, ADR-079, ADR-082, ADR-085

## Context

P61 launch planning surfaced an owner-requested feature with two
distinct interpretations conflated in the original brief:

> "process section (eg show the user stories and create phase level
> processes that encourage agentic engineering... such as ability to
> handle database, llm calls, backend, dashboards, llm agents etc)"

This describes (a) a content type that DOCUMENTS a process and
(b) a runtime that EXECUTES processes. They are architecturally
distinct, with very different scope implications for open-core.

## Decision — three-way split

### (a) Process pages as CONTENT TYPE → open-core (OC-14)

A new template category that documents a methodology: user stories,
phase processes, agentic-engineering patterns. **Static content only.**
Existing section types absorb most needs (hero / columns / quotes /
numbers / blog); add 1-2 new section types if needed
("user-story-card", "phase-step"). Ships in open-core because output
is a static marketing/documentation site — no runtime, no server.

**Examples:** "Our Build Process" page documenting a 5-phase agile
methodology; "How We Use Agents" page describing Claude Code + AISP
hand-off; "Our 100× Velocity Postmortem" cross-linking phase logs.

### (b) Agentic-process TEMPLATES → open-core (OC-15)

Site templates **for products that USE agents**. The site is a
marketing site for an agentic product; it **isn't itself agentic**.
Existing 17-template registry extends with verticals like:

- "AI Agent Landing Page" (e.g., the marketing site for an agent SaaS)
- "Dashboard SaaS Marketing" (e.g., the marketing site for a dashboard product)
- "Developer-Tool Homepage" (e.g., the marketing site for a CLI/SDK)
- "LLM Application Landing" (e.g., the marketing site for a chat product)

These are TEMPLATES, not running agents. Ships in open-core under the
same template-library mechanism as ADR-079 Sprint M premium templates.

### (c) Agentic processes as RUNTIME → Tier-2 commercial only

Live LLM agents + database + backend + dashboards running INSIDE the
generated site. Requires server, auth, rate limits, key custody,
billing, abuse mitigation. **Open-core CANNOT ship this credibly** —
the BYOK + sql.js + IndexedDB architecture has no server-side
execution surface. Hard-deferred to Tier-2 commercial.

## Boundary — what each side ships

| Concern | Open-core (a) + (b) | Tier-2 (c) |
|---|---|---|
| Static documentation of a process | ✅ | — |
| Marketing template for agentic product | ✅ | — |
| Live LLM agent embedded in output | ❌ | ✅ |
| Database/CRUD inside output | ❌ | ✅ |
| User auth in output | ❌ | ✅ |
| Hosted dashboards | ❌ | ✅ |

## Bounded-context impact (DDD)

No new bounded context. `configuration` absorbs:

- Up to 2 new section types (`user-story-card`, `phase-step`) if
  existing 16 cannot express; preferred path is reuse of `columns` +
  `quotes` + `numbers`
- 4-6 new template-library entries (vertical extension only)

## Acceptance gates

- OC-14: at least 2 content-version process-page templates registered;
  output is pure static (no runtime imports, no fetch calls in
  emitted HTML)
- OC-15: at least 3 agentic-product-marketing templates registered;
  templates pass all P60-style audits (real copy, no Lorem,
  vertical-distinct visuals)
- Documentation in `README.md` Open-Core scope section explicitly
  states "Hey Bradley does not host agents; it generates marketing
  sites for products that use agents"

## Consequences

**Positive:**
- Resolves owner-requested feature without cracking open-core thesis
- Extends template library to higher-value verticals (AI agent
  products are a hot 2026 vertical)
- Clear customer narrative: "we make the marketing site; your agentic
  runtime is your problem (until Tier-2)"

**Negative:**
- Owner ambition for a runtime-agentic feature lives only in Tier-2
- Risk of confusion: customers may expect agents to RUN on output
  sites; documentation must be explicit

**Mitigations:**
- README + Docs page explicitly disclaim runtime-agent scope
- Templates emitted by OC-15 include footer note: "Wire your agents
  separately — see Tier-2 docs"
