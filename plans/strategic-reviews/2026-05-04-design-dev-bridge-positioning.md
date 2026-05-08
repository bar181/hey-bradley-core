# Strategic Context — Design Stage / Dev Stage Bridge + Agentic IDE v0 Vision

> **Saved:** 2026-05-04 · **Branch:** swarm/pre-launch-sprint · **Status:** Context — future-plans archive
> **Authority:** Owner strategic memo · **Predecessor:** Pre-Launch Sprint sealed at `ee460b1`
> **Disposition:** No swarm work to do. Ship MVP. Watch L3-L5 signal. Build Agentic IDE v0 *after* user data confirms the primary market.

## The product, articulated cleanly

Hey Bradley is **the bridge** between the design stage and the dev stage. The two stages currently have no shared artifact. Hey Bradley makes the spec the shared artifact — produced in the design stage, consumed in the dev stage.

Two distinct user groups. One product. The spec is the handoff.

## Two user groups (one product)

### Group 1 — Design Stage (idea → spec)

Founders, designers, product owners. They have the idea but can't produce the spec. They need to:
- See their idea visualized
- Have something structured to hand over

**Surfaces that serve them:**
- **Listen mode** — voice transcription with cleanTranscript pipeline (per ADR-127)
- **Whiteboard / Builder mode** — visual iteration, "make it green", direct manipulation
- **Chat mode + Planning mode** — process map, north-star derivation
- **Don Miller framing** in copy

They produce the spec. They don't need to understand AISP.

### Group 2 — Dev Stage (spec → execution)

L2–L9 developers. They receive the spec (or generate their own) and use it to coordinate AI tooling.

**Audience tier map:**

| Level | Surface | Need |
|-------|---------|------|
| L2-L3 | Plugin + NPX | Take the spec, hand to Claude Code, ship |
| **L3-L5 PRIMARY** | Cursor power users | Persistent context — stop re-explaining every session |
| L5-L7 | Wave coordination + AISP | Spec drift detection; swarm dispatch |
| L8-L9 | Build the tools | Credibility partners; AISP RFC participants |

The AISP output is most valuable at L4-L6. The human-readable spec is sufficient at L2-L3.

## The insight that clarifies everything

The design stage and dev stage are currently disconnected.

**Today's broken handoff:**
```
Design stage output: whiteboard + Figma + scattered notes
                    ↓ (lossy, manual, re-explained every session)
Dev stage input:   Claude Code / Cursor / swarm
```

**Hey Bradley's bridge:**
```
Design stage → Hey Bradley spec (.aisp + CLAUDE.md) → Dev stage
                  ↑ shared artifact ↑
```

This is why "messy ideas → enterprise specs" is exactly right — messy ideas come from the design stage, enterprise specs are what the dev stage needs.

## Priority stack — final confirmed

| # | What | Who it serves | Status |
|---|------|---------------|--------|
| 1 | Web app MVP + plugin launch | Design stage + L2-L5 devs | **READY (this sprint)** |
| 2 | **Agentic IDE v0** — persistent context across sessions | L3-L5 Cursor users (primary market) | DEFERRED until L3-L5 signal post-launch |
| 3 | Wave coordination + file ownership | L4-L6 moving up | Future |
| 4 | Spec drift detection | L5-L7 power users | Future |
| 5 | Level 2+ web app specs (entities/flows/integrations) | L3-L5 building real products | Future (per Pre-Launch Sprint deferral) |

## Agentic IDE v0 — minimum viable surface (post-MVP)

The minimum Agentic IDE for L3-L5 is **two capabilities** — not complex.

### Capability 1 — Persistent project context across sessions

Current Cursor pain:
```
Open session → re-explain project → AI starts fresh → rework
```

With Agentic IDE v0:
```
Open session → spec loaded automatically → AI knows the context
            → session ends → next session continues
```

### Capability 2 — Session scope (what the AI is allowed to touch)

```
"In this session you are implementing Phase 2: authentication.
 You own: src/auth/, src/middleware/
 You do not touch: src/billing/, src/dashboard/
 Gate condition: all tests green before Phase 3"
```

These two remove the single biggest daily pain for L3-L5 Cursor users.

**Existing primitive:** the SessionStart hook in the Claude Code plugin (per ADR-C03) already injects spec context. Agentic IDE v0 = that hook, made into a product surface.

**Does NOT require:** AISP discipline · wave-gate coordination · Crystal Atoms · drift detection. Those land in Priorities 3+ for L5-L7.

## Three-sentence pitch per audience

**For founders / designers / PMs (Design Stage):**
> Describe what you're building. See it. Get a spec your developer or Claude Code can actually use.

**For L3–L5 developers (primary market — Dev Stage):**
> Stop re-explaining your project every session. Hey Bradley keeps your spec alive — what you're building, what phase you're in, what the AI is allowed to touch.

**For L5–L7 engineers (power users):**
> AISP Crystal Atoms. Wave-gate coordination. Spec drift detection. The methodology you're doing manually — now it's the product.

## Marketing alignment check (current launch copy)

The current launch copy is **already aligned** with this strategic frame:

| Surface | Current copy | Alignment |
|---------|-------------|-----------|
| `src/pages/Welcome.tsx` hero | "Messy ideas → enterprise specs, instantly." | YES — design stage entry signal |
| `src/pages/Welcome.tsx` subhead | "...the conversation you're already having..." | YES — design stage framing |
| `docs/launch/show-hn-post.md` | "Hey Bradley — Messy ideas → enterprise specs..." | YES — bridge positioning |
| `docs/launch/product-hunt-tagline.md` | "Messy ideas → enterprise specs for Claude Code" | YES — Claude Code = dev stage entry |
| `connections/README.md` | "Plugin is Intentionally Incomplete" + workflow | YES — bridge framing |

**No marketing updates required** at MVP launch. The audience-specific pitches are post-launch refinements when targeted campaigns activate.

## Post-launch sequencing — DO NOT pre-build

**Watch for these signals before scaffolding Priority 2 (Agentic IDE v0):**

1. **Volume signal** — Are L3-L5 Cursor users the dominant cohort hitting `/spec-init` and `/spec-export`?
2. **Pain signal** — Is "I can't keep my project context across sessions" the most-cited friction in feedback?
3. **Conversion signal** — Are L3-L5 users completing the Plugin → heybradley.app → back-to-Claude-Code loop, or dropping at the handoff?

**If all three signal positive:** Agentic IDE v0 sprint with the 2-capability minimum (persistent context + session scope).

**If signal is mixed:** review whether the dev-stage primary market hypothesis is wrong. The design stage may be the load-bearing audience.

**If signal is silent:** marketing problem, not product problem. Focus on awareness before building more.

## Hard rule — no pre-emptive Agentic IDE work

This document is **context only**. The swarm should NOT:
- Plan Agentic IDE v0
- Scaffold session-scope enforcement
- Research persistent-context architectures
- Pre-build wave-gate coordination

The swarm SHOULD:
- Ship MVP per Pre-Launch Sprint seal `ee460b1`
- Watch for L3-L5 signal
- Build Priority 2 *after* user data confirms the market

## Cross-refs

- ADR-127 (cleanTranscript / listen mode) — Design Stage Group 1 surface
- ADR-116 (3-mode product architecture) — Whiteboard / Planning / Agentics
- ADR-C03 (SessionStart hook) — primitive that becomes Agentic IDE v0
- ADR-122 (markdown bundle export) — the bridge artifact
- ADR-133 (v2.0.0-RC1 boundary) — what ships at MVP
- `connections/docs/seal/retrospective.md` — connection-layer carry-forwards (CN-1..CN-8)
- `docs/launch/owner-launch-checklist.md` — 17 owner-required publish tasks

## Bottom line

Ship the MVP. The strategic frame is sharp. The current copy aligns. The Agentic IDE v0 is a 2-capability sprint waiting on L3-L5 user signal — don't pre-build.
