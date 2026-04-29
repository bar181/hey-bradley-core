# Hey Bradley vs Lovable — 90-second demo script

> **Format:** timed shot list (VO / on-screen cue / browser action / takeaway)
> **Total runtime:** 90 seconds
> **Owner deliverable:** record per shot list; publish to README + Agentics Foundation
> **Recording mode:** AgentProxy active (so the demo costs $0 and latency is honest)

---

## 0:00–0:10 — Hook

- **VO:** "Lovable shipped voice. Hey Bradley shipped specs. Watch."
- **On-screen:** title card split-screen — "Lovable" left, "Hey Bradley" right. Both blank.
- **Browser action:** none. Title card only.
- **Takeaway:** the viewer expects a head-to-head, not a feature list.

## 0:10–0:25 — Lovable side: prompt → code, no spec

- **VO:** "Here's Lovable. Voice prompt in. Code out. Twelve commits. No spec. The founder still doesn't know what got built."
- **On-screen:** Lovable app. Voice prompt: "build me a coffee subscription landing page." Cuts to: commit log scrolling, then a confused-founder reaction shot (stock or owner B-roll).
- **Browser action:** open Lovable in left pane; press voice; speak the prompt; let it generate; scroll the commit feed.
- **Takeaway:** fast, impressive, and the spec layer is missing. Re-prompt is the only correction tool.

## 0:25–0:40 — Hey Bradley side: same prompt → atoms light up → spec auto-opens

- **VO:** "Same prompt into Hey Bradley. Watch the five atoms fire. The spec opens itself. The build happens at the same time."
- **On-screen:** Hey Bradley right pane. Voice prompt is the same coffee-subscription line. The five Crystal Atom chips animate in order: PATCH → INTENT → SELECTION → CONTENT → ASSUMPTIONS. Spec panel auto-opens. Preview pane shows the build.
- **Browser action:** click the push-to-talk mic; speak the prompt; release; the atom strip animates inline; spec primary tab takes focus.
- **Takeaway:** the moat is visible by default. You can see the spec form before the build lands.

## 0:40–0:55 — Personality toggle: Geek → Teacher

- **VO:** "Geek personality shows AISP inline. Teacher says it in plain English. Same atoms. Same spec. Different voice."
- **On-screen:** personality picker. Toggle to **Geek** — the AISP classification renders inline as `Ω→add Σ→pricing @ 0.94`. Toggle to **Teacher** — the same response renders as "Adding a pricing section. Confidence: 94%."
- **Browser action:** open personality picker; click Geek; observe inline symbolic; click Teacher; observe plain-English variant of the same atom payload.
- **Takeaway:** the spec is universal. Personality is the surface; AISP is the substrate.

## 0:55–1:10 — Share Spec → real URL → opens in another browser → static HTML downloads

- **VO:** "Share Spec. Real hosted URL. Opens anywhere. The static site downloads at the same time."
- **On-screen:** Share Spec button. Toast: "Link copied." Switch to a second browser window — paste — the spec page renders in the in-browser stub. A separate download tray shows the static HTML zip arriving.
- **Browser action:** click Share Spec; switch windows; Cmd+V into address bar; press Enter; spec loads. In parallel, downloads tray shows the static export.
- **Takeaway:** the spec survives Slack, DM, email. The build is portable HTML. Distribution is solved.

## 1:10–1:25 — Latency badge persistent through the run

- **VO:** "And every reply across that whole demo updated in under a second. We didn't fake it."
- **On-screen:** B-roll cuts back to the four prior moments — each one with the latency badge highlighted ("Updated in 0.8s", "Updated in 1.1s", "Updated in 0.9s", "Updated in 0.7s").
- **Browser action:** none — supercut overlay. Highlight the `data-testid="latency-badge"` element with a callout ring.
- **Takeaway:** speed is visible, measured, and consistent — not a marketing claim.

## 1:25–1:30 — CTA

- **VO:** "Hey Bradley. Open core. MIT. Version 1.0.0-RC1. Try it now."
- **On-screen:** end card — `github.com/bar181/hey-bradley-core` and `hey-bradley.com`. AISP cross-link: `github.com/bar181/aisp-open-core`. Capstone footer: "Bradley Ross · Harvard ALM Digital Media Design · May 2026."
- **Browser action:** static end card.
- **Takeaway:** the viewer has the link, the version, and the license. One click to install.

---

## Recording notes for the owner

- **Resolution:** 1080p (1920×1080) minimum; 60fps preferred for the atom-animation moment (0:25–0:40).
- **Audio:** clean lavalier or USB-C mic. VO recorded separately and mixed against silent screen capture for clean cuts.
- **Pre-load state:** open the bakery / coffee-subscription example in the Hey Bradley pane before recording — the demo is faster to follow with content already on screen than starting from a blank canvas.
- **AgentProxy active:** confirm AgentProxy provider is selected so the demo runs at $0 BYOK cost and the latency badge reflects the open path, not a paid-tier shortcut.
- **Atom animation timing:** rehearse the prompt twice before the hot take so the five atoms land on visible beats, not buried in a flurry.
- **Lovable side:** record on a separate device or tab. Do not splice — let the comparison feel honest. If Lovable's UX changes between record and publish, re-record the left pane only.
- **Re-record gate:** if any of the four moat priorities (speed / spec / templates / share) is not visibly demonstrated in the final cut within the first 30 seconds, re-record. Spec-unmissable failures are the most common cause.
- **Publish targets:** README hero (autoplay muted), Agentics Foundation Discord pinned post, capstone defense slide deck (90s clip), `hey-bradley.com` landing.
- **Cross-references:** moat priorities — `plans/strategic-reviews/open-core-moat-roadmap.md`. Sprint K (speed) sealed `44cc36c`. Sprint L (spec) sealed `2944461`. Sprint M (templates) ADR-079. Sprint N (share) ADR-080. Sprint O (this) ADR-081.
