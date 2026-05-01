# Hey Bradley — 3:30 demo video script (v1.0.0-RC1)

> **Format:** timed shot list (VO / on-screen / browser action / takeaway)
> **Total runtime:** 3:30
> **Owner deliverable:** record per shot list; publish to README + AISP repo + launch threads
> **Recording mode:** AgentProxy active so the demo costs $0 and the latency badge is honest

---

## 0:00–0:15 — Hook: the 55% problem

- **VO:** "Cited research puts LLM coding sessions at roughly 55% silently wrong. The output runs. It compiles. It just isn't what you asked for. Hey Bradley fixes that with a spec layer you can read before any code lands."
- **On-screen:** title card. "55% silently wrong" stat in large type. Cut to Hey Bradley landing page.
- **Browser action:** open `hey-bradley.com`.
- **Takeaway:** the problem is verification, not generation.

## 0:15–0:45 — Listen mode

- **VO:** "Push to talk. Speak. Five Crystal Atoms classify the utterance before any patch lands — INTENT, ASSUMPTIONS, SELECTION, CONTENT, PATCH. Plus DECOMP if you said two things at once."
- **On-screen:** `/demo/listen`. PTT mic button held. Live transcript renders. Atom chips animate in order. Latency badge shows sub-second response.
- **Browser action:** navigate to `/demo/listen`; hold mic; say "make the hero brighter and add a pricing section"; release; observe DECOMP split + 5-atom trace.
- **Takeaway:** voice goes through the same spec layer as text. No bypass.

## 0:45–1:20 — Chat mode + template intelligence

- **VO:** "Type a prompt. Template Intelligence routes across three layers — 21 themes, 15 section arrangements, 15 content styles. Forty-one full templates. The matcher shows you which ones it considered and why."
- **On-screen:** main chat. Type "more agency vibes". Theme switches. Type "switch to dark feminine". Theme swaps again. Type "add testimonials and a CTA". Sections appear.
- **Browser action:** type each prompt; observe theme/section response; open Conversation Log tab to show ranked candidates with scores.
- **Takeaway:** the matcher is auditable. Every choice has a confidence score and an alternative.

## 1:20–1:55 — Multi-page (the page-aware win)

- **VO:** "Add a second page. Switch active. Type 'edit page 2 hero'. The patch lands on page 2 — not page 1. That's the page-aware pipeline. ADR-104."
- **On-screen:** PageSelector tabs in left panel. Click "Add page". Page 2 created. Click Page 2 to set active. Type "make the page 2 hero darker". Preview updates Page 2 only.
- **Browser action:** add page; switch active; issue scoped prompt; verify Page 1 untouched in preview tabs.
- **Takeaway:** the fix that should be obvious is shipped and tested. Single-page mode is byte-equivalent preserved.

## 1:55–2:30 — Full-site simulator

- **VO:** "Ten-step scripted flow. A coffee-subscription site builds itself in real time. Theme swap, typography upscale, gallery, testimonials, CTA. Five atoms emit at every step."
- **On-screen:** `/demo/full-site`. Auto-play through the 10 scripted steps. Progressive preview fills in. Atom trace logs in side panel.
- **Browser action:** navigate to `/demo/full-site`; let the scripted flow run; pause at step 10 to show final 5-atom spec bundle.
- **Takeaway:** what you saw in 90 seconds is what the spec layer encodes. Reproducible.

## 2:30–2:55 — Spec layer reveal

- **VO:** "Open Blueprints. Seven sub-tabs — North Star, Architecture, Build Plan, Features, Human Spec, AISP, JSON. The AISP tab is the moat. Math-first, 512 symbols, near-zero ambiguity. Every LLM understands it natively."
- **On-screen:** click Blueprints tab. Cycle through North Star → AISP → JSON. Show the 5-atom trace with confidence scores. Click "Export AISP" — versioned filename downloads.
- **Browser action:** open Blueprints; cycle sub-tabs; click export; show downloaded `aisp-bundle-v1.json` in tray.
- **Takeaway:** the spec is the bet. The spec is the deliverable.

## 2:55–3:15 — Adoption: polyglot, stdlib-only

- **VO:** "Third-party adoption ships today. TypeScript parser, Python parser, sample bundle. Standard library only. Zero npm, zero pip. Drop into any project."
- **On-screen:** GitHub view of `examples/3rd-party-consumer/`. Show `parse-aisp-typescript.ts`, `parse-aisp-python.py`, `sample-bundle.json`. Cut to `docs/aisp-adoption/` — three-doc tree.
- **Browser action:** open repo; navigate to examples folder; open both parsers; open adoption docs.
- **Takeaway:** adoption is a five-minute integration, not a vendor lock-in.

## 3:15–3:30 — Outro

- **VO:** "Hey Bradley. Open core. MIT. Version 1.0.0-RC1 today. Spec repo at aisp-open-core. Build repo at hey-bradley-core. Try it."
- **On-screen:** end card. `github.com/bar181/hey-bradley-core` + `github.com/bar181/aisp-open-core` + `hey-bradley.com`. Capstone footer: "Bradley Ross · Harvard ALM Digital Media Design · May 2026."
- **Browser action:** static end card.
- **Takeaway:** version, license, links.

---

## Concrete shipped numbers (cite on screen if helpful)

- 996+ pure-unit tests GREEN at P83 seal
- 108 ADRs Accepted on disk
- 41 templates (17 baseline + 24 expansion across OC-3 / OC-4 / OC-15)
- 12 blog posts (ADR-097 floor met at P82)
- 18 section types (ADR-100 widening)
- 21 themes / 15 section arrangements / 15 content styles
- 5 Crystal Atoms (INTENT / ASSUMPTIONS / SELECTION / CONTENT / PATCH) + DECOMP front-of-pipeline
- 4 modes (chat / listen / expert / mobile)
- 84 phases sealed (P11 → P83)

## Recording notes

- 1080p minimum; 60fps for the atom-animation moments at 0:30 and 2:00.
- Clean lavalier or USB-C mic. VO recorded separately and mixed against silent screen capture.
- Pre-load the coffee-subscription example state so 0:15–0:45 is fast to follow.
- AgentProxy provider selected so latency badge reflects the open path, not a paid shortcut.
- Re-record gate: if speed / spec / multi-page / adoption isn't visibly demonstrated by 3:00, re-record.
- Publish targets: README hero (muted autoplay), AISP repo README, launch HN/PH posts, capstone defense deck.

## Cross-references

- Moat priorities: `plans/strategic-reviews/open-core-moat-roadmap.md`
- Sprint K speed: ADR-077 (P54)
- Sprint L spec: ADR-078 (P55)
- Sprint N share: ADR-081 (P57)
- ADR-104 page-aware pipeline (P79 / OC-14)
- ADR-108 AISP adoption (P83 / OC-17)
- AISP spec: `github.com/bar181/aisp-open-core`
