# P80 / OC-15 — Agentic-Product Template Scoring

**Date:** 2026-05-01 · **Agent:** A2 (visual coherence + persona scoring) · **Mode:** READ-ONLY

Scope: 4 NEW agentic-product templates shipped by A1 in P80 / OC-15. Doc artifact only — no template edits.

---

## §1 Methodology

SOTA reference baselines (April 2026 sample): **Lovable AI templates avg ~8.0/10** (palette + opinionated copy + working CTAs); **Vercel AI SDK templates avg ~7.0/10** (clean code, generic copy, weaker positioning). We score each template 1-10 on four axes, average to a composite, and compare against the **8.0 SOTA floor**. Hard rule: a template under 8.0 is below SOTA but may still ship — call it out honestly. Token-compliance check (ADR-091): section-level `style` blocks may use palette hex (permitted); component-level `style: "filled" | "outline"` is a button variant token (compliant); a violation would be hardcoded color in component `props` (none found).

## §2 Per-template scoring table

| Template | Design | Positioning | Copy | Tokens | Composite | vs SOTA (8) |
|---|---|---|---|---|---|---|
| ai-agent-marketplace | 8 | 9 | 9 | 10 | **9.0** | **+1.0** |
| ai-coding-copilot | 9 | 10 | 9 | 10 | **9.5** | **+1.5** |
| ai-workflow-platform | 8 | 9 | 9 | 10 | **9.0** | **+1.0** |
| ai-support-copilot | 9 | 9 | 10 | 10 | **9.5** | **+1.5** |
| **Average** | **8.5** | **9.25** | **9.25** | **10.0** | **9.25** | **+1.25** |

All four templates clear the SOTA floor. Coding-copilot and support-copilot are the strongest; marketplace and workflow-platform trail by 0.5 on design (palette saturation balance) but match on copy and positioning.

## §3 Per-template polish notes

### ai-agent-marketplace — polish notes
- `src/data/examples/ai-agent-marketplace.json:88` — eyebrow badge stacks three claims ("1,200+ specialist agents · pay-per-task · zero retainer") that compete with the headline in line 95; consider trimming to two so the headline carries weight.
- `src/data/examples/ai-agent-marketplace.json:430` — pricing subheading "Pro pays for itself at ~$700/mo of agent spend" is sharp but unsupported elsewhere on the page; either link a 1-line ROI proof point near the tier or soften the claim to avoid asterisk territory.
- `src/data/examples/ai-agent-marketplace.json:191-271` — gallery uses generic Unsplash photo URLs for what should be agent listing card mockups; captions carry the load (price + integration count), but at scale these read as stock-photo filler. Carry-forward: replace with synthesized card screenshots when image pipeline supports it.

### ai-coding-copilot — polish notes
- `src/data/examples/ai-coding-copilot.json:191` — demo image at line 191 is a generic Unsplash code-on-monitor shot; caption (line 201) is excellent but the image undersells "spec-first diff preview". Same carry-forward as marketplace gallery — synthesized screenshot when available.
- `src/data/examples/ai-coding-copilot.json:244` — `"value": "0"` for "Autocomplete suggestions" is a great anti-feature stat but reads ambiguously without the description; the description recovers it ("By design — silent until you ask"), so this is a low-priority polish — could surface "0" larger or stylize as crossed-out for visual punch.
- `src/data/examples/ai-coding-copilot.json:399` — FAQ q-3 lists 10 first-class languages inline; consider 2-column or comma-wrapped list rendering to avoid wall-of-prose in the answer body.

### ai-workflow-platform — polish notes
- `src/data/examples/ai-workflow-platform.json:185-196` — all 12 logo entries point to the same Unsplash image URL (`photo-1599305445671-ac291c95aaa9`); names differ but the visual is a single placeholder. This is the most visible polish gap in the 4-template set. Carry-forward: source actual logo SVGs or use a uniform monochrome placeholder per brand.
- `src/data/examples/ai-workflow-platform.json:102` — hero subtitle is 67 words (above 30-60 standard); split the "180 integrations, 24 prebuilt agents" sentence into a separate line or move to the eyebrow which already carries the same fact (line 88) creating duplication.
- `src/data/examples/ai-workflow-platform.json:330` — CTA gradient `#f59e0b → #fb923c` is two adjacent oranges with low contrast lift; consider widening the second stop to `accentSecondary` or `bgSecondary` for a more dynamic gradient sweep matching the agent-marketplace pattern (line 440).

### ai-support-copilot — polish notes
- `src/data/examples/ai-support-copilot.json:226` — testimonial t-1 ends "CFO sent flowers" — funny and humanizing, but borders on too cute for a CFO-facing template positioned on hard ROI; consider keeping the humor but anchoring the prior sentence with the specific dollar figure ("canceled the $400k headcount plan").
- `src/data/examples/ai-support-copilot.json:378` — CTA gradient `#0d9488 → #f59e0b` (teal → orange) is bold but fights the warm-cream page palette; either soften to `#0d9488 → #5eead4` (within-family) or accept the contrast as deliberate. Calling it out as a coherence question, not a defect.
- `src/data/examples/ai-support-copilot.json:163` — `"$8.40"` cost-per-resolved-ticket-saved stat is precise but unanchored — readers don't know if that's per ticket, per month, or aggregate; description recovers partial context ("Average across the customer base") but adding a "(per ticket)" suffix on the value or label would lock it.

## §4 Top-3 cross-template recommendations

Roll-up of the polish items that would lift the composite most across all 4 templates:

1. **Image asset quality** (affects 3/4: marketplace gallery, coding demo, workflow logos) — Unsplash placeholders carry the visual load where synthesized product screenshots / real brand SVGs would 10× the credibility. Carry-forward to next template-audit sprint when image pipeline supports synthesis.
2. **Eyebrow/hero/subtitle deduplication** (affects 2/4: marketplace, workflow-platform) — eyebrow badge often repeats the same fact already in hero subtitle. Tighten to one canonical claim per region.
3. **Gradient contrast discipline on action CTAs** (affects 2/4: workflow-platform, support-copilot) — when both gradient stops sit in the same hue family (orange→orange) or fight the page palette (teal→orange on cream), the CTA loses pop. Establish a "gradient sweep ≥ 60° hue distance OR within-palette hue family" rule in the next templating standard ADR.

## §5 Honest declaration

Lovable's SOTA average is **~8.0**; our 4-template average is **9.25**, a +1.25 lift. Floor cleared by every template (lowest composite **9.0**, highest **9.5**). **No template ships below SOTA.** Templates do **not** need 10/10 to ship — the polish items in §3-§4 are quality-lift carry-forwards, not blockers. Honest call: image-asset quality is the single biggest visible-on-screen gap and will not be solved at template-authoring time — it lives downstream in the image-synthesis pipeline.

---

**Hard-rule compliance:** READ-ONLY (no source edits) · doc ≤200 LOC · §1-§5 present · 4-row scoring table populated · 4 polish-needed sections · file:line citations on every polish line · no shell commands beyond `ls`/`grep`/`wc`.
