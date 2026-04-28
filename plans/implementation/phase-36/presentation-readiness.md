# Presentation Readiness Report

**Project:** Hey Bradley (Harvard ALM Capstone, May 2026)
**Sealed at:** P36 / 96-100 composite estimated (Grandma 82 / Framer 89 / Capstone 99 post-fix-pass)
**Date:** 2026-04-28
**Time to presentation:** ~3 days

## Demo Flow (recommended 5-step sequence)

1. **Voice → Review-First Trust Gate (P36 / ADR-065)** — Hold push-to-talk in Listen tab, say "hide the hero". `ListenReviewCard` renders ("HEARD: hide the hero / WILL: Hide the hero. [Approve][Edit][Cancel]"). Press Approve. Patch lands. Talking point: "ASR mis-transcriptions are silent and irreversible — the review gate kills the wrong-edit failure mode at $0 cost via rule-based preview."

2. **Chat → Template Fast-Path (Sprint B; P23-P25 / ADR-050/051/052)** — Type "make hero brighter" then `/hero-2 hide`. First request hits `make-it-brighter` template (no LLM). Second uses section-targeting parser + scope resolver. Talking point: "Template-first routing means $0 in dev across P15-P36 — the LLM is the fallback, not the entry point."

3. **Chat → 5-Atom AISP Pipeline + EXPERT Trace (P26-P35 / ADR-053/057/060/063/064)** — Switch right-panel to EXPERT. Type a low-confidence request like "spice it up". `ClarificationPanel` (P34) shows 3 ranked rephrasings from `generateAssumptionsLLM`. Pick one. Reveal `AISPPipelineTracePane` showing all 5 atoms in order: INTENT → ASSUMPTIONS → SELECTION → CONTENT → PATCH. Talking point: "Every reply is a debuggable AISP artifact. Five Crystal Atoms; each Σ-restricted; each with a confidence threshold and cost-cap reserve."

4. **Blueprints → AISP Translation Panel + AISP Dual View (P22 / P27 / ADR-055/056)** — Click `Blueprints` center tab → `AISP` sub-tab. Show the verbatim Crystal Atom (Ω/Σ/Γ/Λ/Ε) feeding the LLM and the validated output. Then jump to `/aisp` marketing page → `AISPDualView` component shows human-prose vs AISP side-by-side. Talking point: "AISP is math-first, 512 symbols, native to every LLM. Public repo at `bar181/aisp-open-core`. ~140× compression vs prose for instructions."

5. **BYOK → Cost Cap → Export (P17/P18b/P20/P35 / ADR-042/043/046/049/064)** — Settings: paste OpenAI key (`gpt-5-nano` default; added P35), watch `CostPill` go green/amber/red as cap edits. Trigger an LLM action. Open EXPERT Data tab → show `llm_logs` rows with redacted prompts + token splits. Click ZIP export → unzip → show SENSITIVE_KV_KEYS strip leaves no key in the bundle. Talking point: "Four paid providers + two free, $0.01 lifetime spend, husky+vite key-shape guard, 30-day llm_logs retention, deterministic export sanitization."

## Strongest Features to Show

- **5-atom AISP architecture across both surfaces (P35-P36 / ADR-064/065)** — Capstone-thesis exhibit; voice + text share every Crystal Atom + every clarification UX.
- **Review-first voice UX (P36 / ADR-065)** — Differentiator vs Wix ADI / Framer AI / Webflow AI; nobody else gates voice on a free preview.
- **Template-first router (Sprint B; P23-P25)** — Demonstrates sub-second free-tier path before any LLM call; shows 50× velocity claim concretely.
- **EXPERT Pipeline Trace pane (P35 / ADR-064)** — Visual proof of the AISP thesis at the chat surface; renders all 5 atoms inline under each reply.
- **BYOK matrix (P17/P18b/P35 / 6 providers)** — Claude/Gemini/OpenRouter/OpenAI paid + Gemini-free + OpenRouter-free Mistral; 2026 prices wired; key-shape guard at commit + build.
- **Cost-cap telemetry + AbortSignal (P20 / ADR-049)** — `CostPill` 3-tier UI; cap-edit clamp [0.10, 20.00]; AbortSignal plumbed across 6 adapters.
- **Frontend-only architecture (P16 / ADR-040/041)** — sql.js + IndexedDB; cross-tab Web Lock + BroadcastChannel; 12 themes, 17 examples, 16 section types, 300 images.
- **Audit + redaction trail (P18b / ADR-046/047)** — `llm_logs` table; ruvector deltas D1/D2/D3; SHA-256 prompt hash; redaction at write boundary; 30-day retention enforced at initDB.

## Gaps That Could Surface During Demo

- **ListenTab is ~875 LOC vs 500 hard cap (P36 R2 S3)** — Likelihood: low (visual surface unaffected); mitigation: do not open ListenTab.tsx in any code-walkthrough; talking point if asked — "P37 carryforward, hard-blocking next phase."
- **31/35 prompt coverage gate (P36)** — Likelihood: medium if reviewer probes edge phrasings ("dim it down a notch"); mitigation: stick to demoed phrasings; have 4 known-uncovered prompts memorized as "P37 push to 33/35".
- **Vercel deploy still owner-triggered (P20 carryforward)** — Likelihood: high if anyone asks for a live URL; mitigation: deploy in next 24h or demo entirely on `localhost:5173`.
- **Live BYOK 4-provider validation deferred from P35** — Likelihood: medium if reviewer wants to swap providers mid-demo; mitigation: pre-validate Claude + Gemini + OpenRouter + OpenAI keys the night before; default to mock/Fixture if any fail.
- **`pendingChatPrefill` is a global single-shot (P36 R2 S4)** — Likelihood: very low; only a panel reviewer would notice; mitigation: do not navigate-and-back during the Edit hand-off demo (step 1).
- **Clarification falls through silently when LLM returns 0 assumptions (P36 R1 L3)** — Likelihood: low with rule-based fallback floor; mitigation: pre-test the chosen "spice it up" prompt to confirm it returns ≥1 assumption.

## Slides Needed (titles only)

1. Hey Bradley — Conversational Site Builder w/ AISP (cover)
2. Problem — Why AI site builders make wrong edits (ASR mis-transcription + ambiguity model)
3. Thesis — AISP: math-first, 512 symbols, near-zero ambiguity (cite `bar181/aisp-open-core`)
4. Architecture — 5 Crystal Atoms (PATCH/INTENT/SELECTION/CONTENT/ASSUMPTIONS) w/ ADR refs
5. Pipeline — Template-first routing → AISP fallback → LLM (cost ladder, $0 → $0.01 lifetime)
6. Voice + Text Unification — Review-first gate (P36 / ADR-065) screenshot
7. EXPERT Pipeline Trace — debuggable replies (P35 / ADR-064) screenshot
8. BYOK Matrix — 6 providers, 2026 prices, key-shape guard, redaction
9. Velocity — P15 → P36 in <8 working days (~50× original estimate); discipline as brake
10. Quality Trajectory — Composite 74 → 96 (chart from STATE.md §6 + post-P22)
11. Capstone Surface — what's sealed (P15-P36) vs post-defense roadmap (Sprints F-K)
12. Demo (live; reference Demo Flow steps 1-5)
13. Open Source — `bar181/hey-bradley-core` + `bar181/aisp-open-core` + 45 ADRs
14. Limitations + Future Work (Sprint F P2 research; Sprint G interview mode; agentic support)
15. Q&A / Closing — capstone metrics + thanks

## Owner Actions Required (≤24h before presentation)

- **Deploy to Vercel** — close P20 owner-triggered carryforward; have a live URL as backup if localhost fails.
- **Pre-validate all 4 paid BYOK keys** — Claude / Gemini paid / OpenRouter paid / OpenAI `gpt-5-nano`; rotate any expired ones; closes P35-deferred 4-provider live check.
- **Rehearse the 5-step demo end-to-end twice** — once on localhost, once on Vercel; time it (target <8 min).
- **Pre-load demo example** — pick one of 17 examples (recommend `capstone` or `blog-standard`); seed it before walking on stage to skip the load-time lag.
- **Memorize the 4 uncovered prompts (gate 31/35)** — so you can deflect "what about X?" with "P37 carryforward, target 33/35".
- **Print 1-page ADR cheat-sheet** — ADR-045 (PATCH) / 053 (INTENT) / 057 (SELECTION) / 060 (CONTENT) / 064 (ASSUMPTIONS) / 065 (Listen unification) / 050 (Template-first) for fast Q&A reference.
- **Capture screenshots for slides 6-8** — review card, EXPERT trace pane with all 5 atoms expanded, BYOK matrix table; freeze them in case live demo glitches.
- **Run `npm run build` + `npm test` once** — confirm 269/269 GREEN (255 + 14 fix-pass) and clean build before stepping away from the laptop.
- **Skip P37 entirely** — see Recommendation below; do NOT start the Sprint F P2 research phase before the panel.
- **Dry-run on actual presentation hardware** — if using a borrowed projector or different display, test resolution + microphone permissions for Web Speech API the morning of.

## Recommendation

**Pause for presentation prep.** P36 sealed at 96/100 with the 5-atom architecture spanning both chat + voice — this is the capstone-thesis surface and starting P37 (research-heavy LLM-call audit + content-route evaluation per ADR-066/067) risks introducing pre-demo churn (e.g. forced ListenTab split per R2 S3) for zero presentation upside. The remaining 72 hours are best spent rehearsing the demo, deploying to Vercel, validating BYOK keys, and capturing slide screenshots — every hour after the panel will compound into Sprint F P2 with no penalty.
