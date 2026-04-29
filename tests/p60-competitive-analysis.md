# Hey Bradley vs Claude Designer / Lovable / Framer — Competitive Analysis

> Scored 1-10 per dimension. Brutal honest. Tier-1 reviewer perspective.
>
> Date: 2026-04-30 · Hey Bradley v1.0.0-RC1 · post-P60 step 4
> Reference grade: `plans/strategic-reviews/2026-04-29-product-evaluation.md`
> graded HB **B-** for category-defining product. Scores below are
> consistent with that grade — no inflation.
>
> Method: read-only audit; no live competitor benchmarking; based on
> public artifacts + training-data knowledge of competitor products as
> of April 2026.

---

## Headline scorecard

| # | Dimension | HB | Claude Designer | Lovable | Framer | Winner |
|---|---|---:|---:|---:|---:|---|
| 1 | Visual polish (default output looks designed) | 6 | 8 | 7 | 9 | Framer |
| 2 | Ease of use (Grandma persona — first 30 sec) | 7 | 8 | 9 | 5 | Lovable |
| 3 | Spec quality (machine-readable for Claude Code) | **10** | 4 | 3 | 2 | **HB** |
| 4 | Mobile UX (3-tab nav, voice-first, hamburger) | 7 | 5 | **9** | 6 | Lovable |
| 5 | Speed perception (latency badge / atom animation) | **9** | 6 | 7 | 6 | **HB** |
| 6 | Sharing / virality (real URL surviving Slack) | 5 | 6 | 8 | **9** | Framer |
| 7 | Open-source posture (license, BYOK, self-host) | **10** | 1 | 1 | 1 | **HB** |
| 8 | Defense vs fast-moving competitors (12-mo outlook) | 7 | 8 | 7 | 7 | Claude Designer |
| | **TOTAL / 80** | **61** | **46** | **51** | **45** | **HB** |

---

## Per-dimension breakdown

### 1. Visual polish — Hey Bradley: 6/10

Sprint M shipped 3 opinionated premium templates (SaaS founder, indie
portfolio, B2B agency); P60 step 2 added 2 more (AI engineer personal,
local business) plus the Hey Bradley flagship recreation. The templates
read as "designer made this" within their genre — `src/data/examples/
saas-founder/index.ts` proves the bar. But the kitchen-sink + many
generic templates still ship Lorem-adjacent placeholder copy.

- **Claude Designer (8)**: opinionated frontier-model design judgment —
  but no public deployment yet so this is partly hypothetical.
- **Lovable (7)**: AI-generated sites trend toward gradient soup +
  emoji-heavy hero — recognizable at 5 paces.
- **Framer (9)**: design-tool DNA; canvas-first; the showcase carousel
  is the genre benchmark.

### 2. Ease of use (Grandma persona, 30s) — Hey Bradley: 7/10

Sprint J personality picker + Sprint L always-on AISP trace + first-run
onboarding flow give Grandma a recoverable path. The local-business
template (P60) is purpose-built for non-technical owners. But desktop
tri-pane is dense; first-time users still see 3 panels of tabs.

- **Claude Designer (8)**: chat-first; one input, one output; minimal
  onboarding. Strong default.
- **Lovable (9)**: best-in-class for non-technical; mobile-first since
  April 2026 launch. Hard to beat the prompt → page time.
- **Framer (5)**: canvas tool; learning curve. Wins on power-user;
  loses on Grandma.

### 3. Spec quality (machine-readable) — Hey Bradley: 10/10

The defensible win. **ZERO** competitor produces an AISP-formatted spec.
HB ships sub-2% ambiguity, atom-classified, exportable as a single
artifact a Claude Code agent can implement on first attempt. ADR-045
(PATCH_ATOM) + ADR-053 (INTENT_ATOM) + ADR-057 (SELECTION_ATOM) +
ADR-060 (CONTENT_ATOM) + ADR-064 (ASSUMPTIONS_ATOM) — all five atoms
emit a deterministic trace per reply. `src/contexts/specification/
shareSpecBundle.ts` exports the bundle.

- **Claude Designer (4)**: outputs design files; a Claude Code agent
  has to interpret them. Some spec residue but not first-class.
- **Lovable (3)**: outputs code, not spec. The spec layer is implicit
  in the prompt history; not extractable.
- **Framer (2)**: outputs design files + sometimes code; no spec layer.

### 4. Mobile UX — Hey Bradley: 7/10

Sprint J shipped 3-tab mobile nav + hamburger drawer + listen-mode
mobile polish. Builder hidden on mobile per north-star X8 narrowing.
Functional, not magical. No native app. No cross-device continuity.

- **Lovable (9)**: native iOS + Android since April 2026 with cross-
  device continuity. The benchmark.
- **Framer (6)**: responsive design canvas; no mobile authoring app.
- **Claude Designer (5)**: web-only assumed; nothing public on mobile.

### 5. Speed perception — Hey Bradley: 9/10

Sprint K ADR-077 ships a latency badge on every successful patch:
"Updated in 0.8s". Sprint L atom animations during pipeline execution
make the speed visible BEFORE the patch lands. Both default-on, no mode
toggle. No competitor surfaces this.

- **Lovable (7)**: feels fast in the prompt → preview turn; doesn't
  surface a measured number.
- **Claude Designer (6)**: presumably fast; nothing visibly displayed.
- **Framer (6)**: real-time canvas; not labeled as "speed."

### 6. Sharing / virality — Hey Bradley: 5/10

Sprint N ADR-081 ships static HTML export + content-addressable
in-browser URL stub + "Built with Hey Bradley" attribution toggle.
The hosted URL only works in the same browser that wrote it (open-core
constraint per ADR-081 §honesty-note). Tier-2 commercial replaces with
real Supabase row.

- **Framer (9)**: published sites at framer.website/* — instant share
  link, survives any messenger. The genre benchmark.
- **Lovable (8)**: hosted on lovable infrastructure; share link works.
- **Claude Designer (6)**: assumed share path; nothing public yet.

This is HB's biggest open-core gap. Static HTML is a workaround. Real
hosted share is Tier-2 commercial.

### 7. Open-source posture — Hey Bradley: 10/10

MIT license, full source on GitHub, BYOK keys, runs entirely in browser
via sql.js + IndexedDB, $0 ongoing cost. AgentProxy fixture adapter
gives full pipeline coverage with no real LLM call. Self-host trivial.

- **Claude Designer / Lovable / Framer (1 each)**: closed-source SaaS.

The only competitor in the OSS lane that ships AISP. Period.

### 8. Defense vs fast-moving competitors (12-mo outlook) — HB: 7/10

The AISP moat is **structurally novel** — competitors can copy speed-
visible (1 sprint), spec-unmissable (1 sprint), premium templates (1
sprint), shareable output (1 sprint). They cannot copy a coherent
5-atom Crystal Atom architecture without rebuilding from first
principles; AISP is owned by the same author and cross-published as
open-core at `bar181/aisp-open-core`.

- **Claude Designer (8)**: backed by Anthropic; can ship a spec layer
  in months if they decide to. They have the LLM tier that makes it
  cheap.
- **Lovable (7)**: keeps shipping fast; mobile-first stance is hard to
  catch. But the spec gap widens against them, not narrows.
- **Framer (7)**: design-tool incumbent; brand strength; can add
  spec-export but it would feel bolted on.

12-month risk: if Anthropic decides AISP-style spec is a feature for
Claude Designer, HB's category claim narrows. Mitigation: AISP
adoption growth via the open-core repo + reference implementations in
3rd-party tools.

---

## Top 3 gaps to close before public RC

| # | Gap | Effort | Impact |
|---|---|---|---|
| 1 | **Hosted share link** (real URL, not in-browser stub) — bag 4-5 dimension points instantly. Vercel KV stub + 1 endpoint. | 1-2 days | very high |
| 2 | **Visual polish floor** — replace remaining placeholder-copy templates (kitchen-sink, dev-portfolio, etc.) with real-copy versions; targets visual-polish 6 → 8. | 1 day | high |
| 3 | **AISP visible by default** — Sprint L shipped this. But the chat-bubble already has 3+ chips; reviewers report "AISP atom buried 2 clicks deep" (per reviewer-impression audit). Default-expand the trace pane on first reply per session. | 30 min | medium |

---

## Where Hey Bradley wins clearly

1. **Spec quality (10/10)** — only product in this set that produces
   sub-2% ambiguity machine-readable artifacts. No competitor approaches
   this.
2. **Open-source posture (10/10)** — only OSS option; only product
   with $0 cost backbone via AgentProxy.
3. **Speed perception (9/10)** — the latency badge + atom animations
   are unique to this product.

---

## Where Hey Bradley loses today

1. **Mobile UX (7 vs Lovable 9)** — Lovable has a native app shipped
   Q2 2026; HB is web-only. This is the hardest gap to close cheaply.
2. **Sharing / virality (5 vs Framer 9)** — open-core stub vs hosted-
   real. Tier-2 closes this; open-core can't.
3. **Visual polish at default (6 vs Framer 9)** — Framer's design-tool
   DNA shows; HB's premium templates beat the genre defaults but the
   long tail of generic templates drags the floor.

---

## 12-month outlook

**April 2027 reality check.** Lovable will be on v3 mobile; Claude
Designer will be GA with a spec-export feature; Framer will have
shipped agentic-build features. The non-spec dimensions (visual polish,
ease of use, sharing) will be commodity by then.

**Where Hey Bradley still holds a moat in April 2027:**

- **AISP as a public standard.** If `bar181/aisp-open-core` reaches
  ~500 GitHub stars and 3+ third-party reference implementations, the
  spec format itself becomes infrastructure. HB ships the canonical
  reference implementation; competitors compete with HB on AISP, not
  with AISP itself.
- **Tier-2 Agentic Support System.** The original Sprint J/K/L scope
  (deferred per the moat roadmap) — "Hey Bradley uses Hey Bradley to
  spec arbitrary codebases" — is research-grade work no competitor is
  attempting. Ship even one Tier-2 flagship dashboard that AISP
  delivers on, and the category claim is permanent.
- **Spec layer commercial moat.** Lovable + Cursor + Devin can all ship
  vibe-coded apps; none of them produce a hand-off spec for the next
  team that picks the codebase up. HB's spec is the "documentation
  the AI agent left behind" — that's a B2B narrative no one else owns.

**12-month risk to plan for:**
- Anthropic enters the spec-layer space → HB's defense is AISP
  community adoption + Tier-2 commercial proof.
- Lovable adds a "share spec" button → HB's defense is the depth and
  fidelity of the AISP atoms; surface-feature parity isn't the same as
  the discipline.
- AISP fails to gain external adoption → HB stays a brilliant open-
  source artifact but loses the "category-defining" claim. This is the
  most consequential single risk.

**Bottom line:** Hey Bradley today is genuinely the only product in this
category producing machine-readable specs at sub-2% ambiguity. The 4
moat sprints (K/L/M/N) closed the visible-polish gap enough that
"category-defining" is plausibly defensible. The 12-month moat depends
on Tier-2 commercial proof + AISP community adoption — those are the
two posts that hold the rest up.
