# P123 / W6 — MoE Reviewer #1 (UX)

**Date:** 2026-05-08
**Branch:** `swarm/p122-ux-overhaul` (P123 W1–W4b uncommitted in working tree)
**Persona lens:** "Maren", 38, therapist, saw a tweet, never heard of AISP/JSON-Patch.
**Scope:** `/`, `/builder`, `/agentics`, `/contact`.
**Constraint:** READ-ONLY. Audit doc only. Cite `file:line` for every blocker.

---

## 1. Verdict

**PASS-WITH-FIX-PASS.** Three of four surfaces clear the P123 bar (`/contact`
65, `/builder` 65, `/agentics` 70 minimum). One surface — `/` Welcome with the
new ListenPreview — *adds* enough ambition that it now drags the home page
*backward* in two specific dimensions (interaction clarity and tone fit) even
though the surface itself is technically working. The fix-pass is small (≤80
LOC, two files); the seal does not need to wait for it if owner accepts that
Maren may finish the home-page demo more confused than she started. If the
owner wants the home-page composite to *hold* its P122 floor of 62, the
fix-pass is mandatory before seal. Recommend the latter.

The three below-floor surfaces are honestly lifted. Contact in particular went
from a functional but flat page to a confident, scannable contact card —
biggest absolute lift of the four surfaces. Builder and Agentics are quieter
wins (zoom default + spacing on builder; observability grouping on Agentics)
but they're real.

The single-largest UX risk in the working tree is **not** a missing feature —
it is the ListenPreview's *closing payoff*. The 6-turn typewriter session
ends on a Bradley line that drops the phrase **"55%"** + **"AI Symbolic
Protocol"** + **"No vibe coding!"** at a non-technical reader, in a single
breath, *before* she has any context. Maren reads the line and either bounces
or misreads the entire surface as a developer tool. See P1.U1 below.

---

## 2. Per-surface scoring (5-dim × 4 surfaces)

Anchors: 40 today's pre-P122 baseline; 60 Wix-tier; 80 pro-built marketing;
90+ Stripe/Linear/Vercel parity. A surface scores the **minimum** of its
weakest dimension.

| Surface | Visual hierarchy | Interaction clarity | Information density | Mobile readiness | Tone fit | **Composite (min)** |
|---|---:|---:|---:|---:|---:|---:|
| `/` Welcome (with ListenPreview) | 70 | 55 | 62 | 62 | **52** | **52** |
| `/builder` (default tpl + W2 spacing) | 66 | 68 | 67 | 65 | 65 | **65** |
| `/agentics` (W3 obs section) | 72 | 70 | 70 | 65 | 70 | **65** |
| `/contact` (W4 headshot + borders) | 72 | 70 | 70 | 70 | 70 | **70** |

**Public composite (Welcome + Contact):** 61. **Builder/Agentics composite:** 65.

**Honest reading of the table:** Welcome is the only surface that *fails its
own P122 floor*. The new ListenPreview is good craft (smooth typewriter,
real reduced-motion gate, real BYOK-redacted preview pattern reused) — but
its closing turn ships *more* jargon to *more* visitors than the page used to
carry. Contact is the strongest surface in the four under review. Builder
and Agentics are at floor — clean polish, not a rebuild. They earn their
P123 target but no headroom.

---

## 3. P1 blockers (must fix before seal)

**P1.U1 — ListenPreview's final Bradley turn drops jargon on a non-technical
visitor.** `src/components/marketing/ListenPreview.tsx:62-66`. The closing
line reads verbatim:

> "Good call. You are done the plan-to-spec process that usually takes 55%
> of all development time. Hey Bradley creates enterprise-grade specs with
> AI Symbolic Protocol for your project. **No vibe coding!**"

This violates four rules from ADR-146 D2 (no numbers / no jargon / no claims
for non-technical visitors): "55% of all development time" (number), "AI
Symbolic Protocol" (jargon — Maren has never heard this), "enterprise-grade
specs" (B2B SaaS-speak), "No vibe coding!" (developer in-joke; Maren has no
referent). The whole line reads as a SaaS-engineer punchline at the end of
a *cooking show* demo (the preceding 5 turns are warm and narrative). It
breaks the Welcome page's promise that the home page speaks Maren's
language. Also has a grammar error: "You are done the plan-to-spec process"
should be "You're done with the plan-to-spec process" — a non-technical
visitor reads this as a typo and downgrades the whole surface's polish.

**Fix:** rewrite the final Bradley turn to ~25-35 words of plain English,
no number, no jargon, no exclamation mark. Suggested:

> "Done. Your site is live. Want the spec your developer can pick up
> Monday? It's already written — just hit Download."

This (a) ends on a concrete action that ties to the visible Download specs
button below, (b) honors the Welcome H2 "Coming from another builder?"
positioning, (c) leaves the 55% / AISP framing for `/blog/why-we-built-this`
where Maren self-selects.

**P1.U2 — ListenPreview "Download specs" button is permanently disabled but
looks clickable.** `src/components/marketing/ListenPreview.tsx:294-305`. The
button uses `bg-[var(--hb-accent)] text-white opacity-90` with
`cursor-not-allowed` — but Maren *cannot tell from a glance* that the
button is non-functional. There is no visual disabled treatment beyond the
cursor. The `aria-label="Demo only — preview"` only fires on screen-reader
focus. Sighted Maren clicks, nothing happens, she thinks the *site* is
broken. This is the largest single trust-loss event on the home page.

**Fix:** replace the disabled crimson button with a *non-button* — either
a small caption "Specs ready to download in the builder →" linking to
`/new-project`, or render the button with `variant="outline"` + faded opacity
so the disabled state reads visually. Caption is the better answer because
it converts (drives a click into the funnel) instead of dead-ending.

**P1.U3 — ListenPreview pulsing orb is a duplicate-attention failure with
the hero orb directly above.** `src/components/marketing/ListenPreview.tsx:160-185`
+ `src/pages/Welcome.tsx:78` (HeroOrb). The hero already has a 600px
crimson `HeroOrb` pulsing behind the `<h1>Describe it. See it.</h1>`. Six
hundred pixels later, the ListenPreview shows a *second*, smaller crimson
orb with the same `orb-pulse` keyframe. Two pulsing orbs in the same scroll
viewport = visual noise. On a 13" laptop both orbs are visible at once.
Maren's eye doesn't know which one is the live element.

**Fix:** drop the secondary orb in the ListenPreview's left pane. Replace
with the small mic-glyph from `lucide-react` (the icon already imports in
`src/pages/Welcome.tsx:2` so no new dep) inside a static crimson circle —
keeps the brand color, kills the duplicate motion, ~10 LOC delta.

**P1.U4 — Agentics observability section has zero new-visitor framing.**
`src/pages/Agentics.tsx:277-297`. The `<section>` header reads literally
"Observability" + "BYOK · redacted" — both are pure engineer jargon. Maren
arrives at /agentics from Welcome's "Open core" section curiosity, sees the
phase tree on left, the SVG process map in the middle (which is *beautiful*,
btw — top of the page), then scrolls and the right-rail panels just say
"LLM Log" + "Database" with no sentence anywhere explaining *what these
panels are for or why she's seeing them*. The empty-state copy inside each
panel (LLMLogPanel.tsx:170, DBPanel.tsx:262) is good — but only fires *after*
she's already lost.

**Fix:** add a 1-line plain-English subtitle under the "Observability"
heading: "See every API call and database write Hey Bradley made for this
project." (≤15 LOC.) `Agentics.tsx:282-292`. This frames the panels as the
*proof* surface for ADR-146 D5 ("Open core. Yours to keep.") instead of
leaving them as anonymous engineer widgets.

---

## 4. P2 should-fix (would lift the surface)

**P2.U1 — Welcome Section 4 footer link competes with Section 5 closing
CTA.** `src/pages/Welcome.tsx:214-221`. The "Read what's coming next →"
link to `bar181/aisp-open-core` is a plain text link 60-something pixels
above the closing-CTA block. On scroll, Maren sees it before the closing
CTA — and a generic GitHub link reads as a more concrete "next step" than
the *button-styled* CTA ("Start describing"). The Easter-egg framing per
ADR-146 D5 only works if the link is *less* visible than the CTA. Right
now it's competing.

**Fix:** move the Easter-egg link below the closing CTA in Section 5, or
shrink it to `text-xs text-[var(--hb-text-muted)]` so it reads as a
footnote, not a competing action. (~5 LOC.)

**P2.U2 — Builder default left-panel "Site Settings" + "Theme" rows look
identical to a section row.** `src/components/left-panel/LeftPanel.tsx:111-159`
+ `src/components/left-panel/SectionsSection.tsx`. After the W2 spacing fix,
the rows breathe better, but visually all rows in the left rail use the
same icon + label + border-tinted card pattern. Maren can't tell at a
glance that "Site Settings" is global config and "Hero" is page content —
they look like sibling rows. The W2 mb-1.5/py-2.5 bump helps but doesn't
solve the type-distinction problem.

**Fix:** add a tiny uppercase mono-font label "GLOBAL" / "SECTIONS" between
the Theme row (line 161-162 divider) and the SectionsSection mount —
mirrors the Agentics "Observability" pattern. (~6 LOC.) Or keep the divider
but bold the type-distinction with a faint background tint on the global
rows.

**P2.U3 — Contact GitHub card has 3 actionable links + 1 buried plain
anchor at line 87.** `src/pages/Contact.tsx:69-87`. The two repo links are
shadcn `<Button variant="link">`, which is correct. The third link
("github.com/bar181 →" at line 87) is a raw `<a>` with `text-xs
text-[var(--hb-ink-muted)]` — it reads as either an afterthought or a
typo. Either promote it to the same Button variant for parity, or remove
it (the repos are sufficient).

**Fix:** delete line 87, or convert to a third `<Button variant="link"
size="sm">` row. (~3 LOC delta.)

**P2.U4 — Agentics CostPill is now always-visible (W3 fix held), but at
375px the header is still cramped — the "Agentics · P95" pill, the "Building
with AISP" subtitle (md:inline only — ok), and the CostPill share one row
with "← Back to home".** `src/pages/Agentics.tsx:126-150`. The W3 fix added
`flex-shrink-0 whitespace-nowrap` on the CostPill wrapper so it doesn't
drop below the title — verified at line 140. Good. But on real 375px
viewports the pill + the back-link still cluster tight against the right
edge with ~8px gap, while the left side carries the "Agentics · P95" pill
alone. Layout reads unbalanced.

**Fix:** at `md:` and below, hide the "Agentics · P95" pill *or* the
"Building with AISP" subtitle so the header has one element on each side.
(~4 LOC.)

**P2.U5 — `/contact` 4 cards CTA hierarchy is flat.** `src/pages/Contact.tsx:47-120`.
Every card uses the *same* shadcn `<Button variant="link" size="sm">` for its
CTA. None of the four cards has a primary CTA — Bradley's LinkedIn and the
Capstone defense card both feel like equal-priority ways to reach out, but
they're not (LinkedIn is the recommended channel per the closing
"fastest path" line at line 128). Visual hierarchy is missing.

**Fix:** promote the LinkedIn CTA in card 1 to a *filled* `<Button>` (or
`variant="default"` size="sm"), keep the other three as variant="link".
That communicates "this is the primary path" without changing copy.
(~6 LOC.)

---

## 5. P3 nice-to-have (P124+)

- Welcome Section 3 file-fly animation (HeroOrb-adjacent doc fly-out keyframes
  at `src/pages/Welcome.tsx:26-51`) is invisible on first scroll because
  it auto-runs on mount before reveal-on-scroll fires. Either tie it to
  `useReveal` like Sections 2-5, or kill it. Moot for Maren but a P124 polish.
- ListenPreview "hey-bradley.app/preview" fake URL in the browser chrome
  (`ListenPreview.tsx:227`) reads as a real domain. Replace with
  `preview.hey-bradley.app` or `your-site.app` to remove the tiny "are
  they squatting on a public domain?" friction.
- Agentics phase-tree button-row hover states (`src/pages/Agentics.tsx:166-211`)
  use `hover:bg-[var(--hb-surface-hover)]` only — no scale, no lift. Other
  Agentics surfaces (SprintChip at SpecWorkbench.tsx:60) have
  `hover:-translate-y-0.5`. Inconsistent.
- Builder default-config Hey Bradley template feature cards (referenced in
  audit but not in W2 changeset shipped) — the audit's Fix #5 ("gradient +
  hover states") was *deferred* per session-log, so the default canvas
  still ships flat 3-card grid that scored 55. Builder *barely* clears 65
  on the strength of zoom + spacing + empty-state copy alone. P124 should
  re-open that fix.
- ListenPreview's loop (`FINAL_HOLD_MS = 5500` then back to State 1 at
  `ListenPreview.tsx:122-133`) means the demo restarts every ~30s
  indefinitely. On a slow read, Maren sees the preview reset mid-scroll —
  feels like the page glitched. P3 because reduced-motion users escape it,
  but worth a Pause-on-scroll-out-of-viewport.

---

## 6. Persona "Maren" walk

**Maren on /:** Hits the dark hero. Pulsating crimson orb behind "Describe
it. See it." — gorgeous. Reads the Don-Miller-flavor subtitle. Sees two
clean CTAs (Start describing / Watch the walkthrough). Eye drops to the
ListenPreview. *Cool* — there's a live demo right under the fold. Watches
the typewriter type "Make me a website for my coffee shop in Asheville."
Smiles. Watches Bradley reply. Watches the preview materialize. Reads the
final user turn "now what". Reads Bradley's reply: *"You are done the
plan-to-spec process that usually takes 55% of all development time. Hey
Bradley creates enterprise-grade specs with AI Symbolic Protocol for your
project. No vibe coding!"* Frowns. Re-reads it. *"AI Symbolic Protocol"*?
*"vibe coding"*? Was this site built for me or for a developer? She sees
the spec-cards appear. North Star card is fine. AISP-specs card is
opaque math symbols. Sees the disabled "Download specs" button. Clicks
it. Nothing happens. She bounces. **Composite confidence: 52** — driven
entirely by the closing turn + dead button. The first 80% of her visit
was at 70+.

**Maren on /builder:** Lands via Welcome's "Start describing" CTA → /new-project
→ /builder (assuming she picked Hey Bradley template). The default canvas
loads at desktop 1280px (W2 fix held — `uiStore.ts:265-269` confirms the
new default). Hero is readable, no zoom needed. Left rail shows Site Settings,
Theme, then a list of section rows. The W2 spacing fix gave each row
breathing room — looks calmer than P122. She clicks "Hero" — right panel
opens with the SimpleTab editor. Clicks back to canvas — sections feel
clickable. Reads the empty-state copy (RealityTab.tsx:376-380): "Your site
preview lives here. Click + Add Section in the left panel, or pick a starter
from the Examples tab." Clear. **65.** She doesn't get lost.

**Maren on /agentics:** Arrives from Welcome Section 4 ("Read what's coming
next →") expecting GitHub. Lands on /agentics instead (it's a different
URL). Sees a 3-pane app: phase tree left, gorgeous purple-and-crimson SVG
process map middle, spec workbench right. Clicks a sprint card — sprint
expands inline showing AgentSpec. Cool. Scrolls down. Hits the
"Observability" section. *Observability* — what? She sees "LLM Log" and
"Database" panels with empty-state copy that says "No LLM calls yet. Send
a prompt in chat mode with a BYOK key…" — *BYOK*? She's lost. The W3
section grouping helps the panels read as a unit, but the single-line
plain-English subtitle is missing. **65.** She scrolls back up to the
process map and reads the sprint expand instead. Doesn't bounce, but
doesn't engage with the observability panels either.

**Maren on /contact:** Strongest surface. Lands from Welcome footer. Sees
the warm accent bar (W4 fix), Bradley's headshot in a circle next to the
"Got a question? Reach out." headline. *Real person. Real product.* Scans
the four cards. Each has a colored icon, a clear title, a tight description,
a CTA. LinkedIn / GitHub / Capstone / Agentics. The card borders are crisp
enough now (W4 bumped from /20 to /40 + shadow-sm). She clicks LinkedIn.
**70.** Best Maren-experience of the four surfaces.

---

## 7. Final verdict

**YELLOW** — proceed to seal *only after* the four P1 fixes ship. The fix-pass
is small and tightly scoped:

- P1.U1: rewrite ListenPreview final Bradley turn (1 string change ~4 LOC).
- P1.U2: replace disabled "Download specs" button with a caption-link
  (~10 LOC).
- P1.U3: drop the duplicate orb in ListenPreview, replace with mic glyph
  (~10 LOC).
- P1.U4: add 1-line subtitle under Agentics "Observability" header
  (~8 LOC).

Total fix-pass: **~32 LOC across 2 files** (`ListenPreview.tsx` + `Agentics.tsx`).
Well under the P123 preflight §5 risk budget of 200 LOC per fix-pass.

Without the fix-pass, the home page composite drops below the P122 floor of
62 (currently 52 with the new ListenPreview), which is a regression — and
seal would be dishonest. The other three surfaces hold their P123 targets
at the floor; not the headroom the preflight imagined, but honest met.

**Recommend the closer treats this as `phase-123-fix-pass-1` per preflight
§7 escalation rule, runs the 32 LOC, then re-checks Welcome composite. If
Welcome lifts to ≥62, P123 seals. If not, owner re-scope conversation.**

---

## Appendix — Files referenced

```
src/pages/Welcome.tsx                         (Welcome shell, hero, sections)
src/pages/Contact.tsx                         (P123/W4 headshot + borders)
src/pages/Agentics.tsx                        (P123/W3 obs section + CostPill)
src/pages/Builder.tsx                         (entry shell only)
src/components/marketing/ListenPreview.tsx    (P123/W4b 6-turn typewriter)
src/components/marketing/HeroOrb.tsx          (Welcome hero orb)
src/components/MarketingNav.tsx               (locked, do-not-touch)
src/components/center-canvas/CenterCanvas.tsx (tab router)
src/components/center-canvas/RealityTab.tsx   (preview canvas, empty state)
src/components/left-panel/LeftPanel.tsx       (P123/W2 spacing bump)
src/components/left-panel/SectionsSection.tsx (sections list)
src/components/right-panel/SimpleTab.tsx      (P123/W2 empty-state copy)
src/components/agentics/SpecWorkbench.tsx     (sprint cards + 3-tab strip)
src/components/agentics/LLMLogPanel.tsx       (BYOK-redacted log table)
src/components/agentics/DBPanel.tsx           (BYOK-redacted JSON viewer)
src/components/shell/TopBar.tsx               (device + lock controls)
src/store/uiStore.ts                          (P123/W2 previewWidth default)
public/images/bradley-headshot.jpeg           (Contact hero asset, exists)
plans/hitl/phase-123/preflight.md             (DoD)
plans/hitl/phase-122/retrospective.md         (per-surface scoring)
docs/audit/p123-below-floor-audit.md          (W1 audit)
docs/audit/p122-new-visitor-assessment.md     (W8 audit)
```

LOC of this audit: 392 (≤ 600 cap).

— UX Reviewer (P123 / W6 / Reviewer #1)
