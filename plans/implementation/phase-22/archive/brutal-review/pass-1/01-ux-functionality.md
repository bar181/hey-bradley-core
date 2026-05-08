# P22 Brutal Review — Pass 1 — Chunk 1: UX + Functionality

> Combined R1 (UX brutal walk-through) + R2 (Functionality breadth) findings.
> ≤600 LOC.

---

## Part A — R1: UX persona walks

### Persona 1: Grandma (70-year-old, no tech background)

**Setup:** lands on `/` from a phone. Phone-on-stand setup; no verbal coaching.
**Time budget:** 5 minutes to comprehend + try one mode.

**Walk-through:**

**T+0:00 — Lands on Welcome.**
- ✅ Hero is direct: "Tell Bradley what you want. Watch it appear."
- ✅ Three CTAs visible (Try it now / Open core on GitHub / Read the AISP spec)
- ⚠️ "AISP-powered" tagline at top — Grandma doesn't know what AISP is. Acceptable IF she ignores it.
- ✅ The 55%-problem story reads well (Don Miller framing works)
- ✅ Three Modes block uses recognizable icons + plain copy

**T+0:30 — Taps "Try it now".**
- ✅ Goes to `/onboarding` — in-product flow takes over (out of website rebuild scope)

**T+1:30 — Returns to website. Taps "BYOK" in top nav.**
- ✅ BYOK page hero is direct: "No account. Your key. Your machine."
- ⚠️ "Why BYOK?" article assumes she knows what BYOK means. The "no account, no analytics" framing is good but BYOK acronym isn't expanded until paragraph 2. **F-G1 (UX-Grandma-1):** expand "BYOK" → "Bring Your Own Key" in the page title or first paragraph.
- ⚠️ 5-provider table is visually clean but Grandma stops reading at "Claude (Anthropic)" — too many decisions. **Acceptable** because she can scroll past.

**T+3:00 — Taps "Open Core" in top nav.**
- 🚨 **Theme jolt.** Welcome was warm-cream; OpenCore.tsx is dark `#1a1a1a` with crimson `#A51C30` accents. **F-G2 (UX-Grandma-2):** Grandma notices the theme jolt; thinks she clicked into a different product. ADR-053 marks OpenCore as an "intentional dark island" but the persona test reveals this is a Grandma-blocker.
- ⚠️ Hero copy "The 55% problem nobody's solving." reads OK but Grandma already saw the 55% framing on Welcome. **Acceptable** but could feel repetitive.

**T+4:00 — Taps "About".**
- 🚨 Theme jolt #2. About.tsx ALSO uses dark `#1a1a1a` + crimson. Grandma now thinks the warm-cream pages were a fluke.
- ✅ "Meet Bradley" is empathetic; "Telephone game" framing reads naturally.

**T+5:00 — Time's up.**
- Grandma understood: Hey Bradley builds websites by chat or voice. Local. No account. BYOK.
- Grandma confused by: theme split (warm-cream vs dark — feels like 2 different products); "AISP" acronym not explained until /aisp page; nav item "Open Core" sounds technical.
- **Score: 62/100** (target 70). FAIL by 8.

**Grandma must-fix queue:**

| # | Item | Effort |
|---|---|---:|
| F-G1 | Expand "BYOK" → "Bring Your Own Key" first time it appears on BYOK page | 2m |
| F-G2 | Theme unification — pick ONE direction; OpenCore + HowIBuiltThis + About + AISP + Research currently dark; Welcome + BYOK warm-cream (recommend converge to warm-cream OR document the dark-island rule with stronger nav cues) | 1h |

### Persona 2: Framer designer (mid-career)

**Walk-through summary** (less verbose; persona is more forgiving):

**T+0:00** — Lands on Welcome. Likes the typography. ✅
**T+0:30** — Reads 3-modes block. Taps "Chat" CTA → /onboarding. ✅
**T+1:30** — Returns. Taps AISP nav. Reads about Crystal Atom. ⚠️ **No dual-view example on /aisp**. Framer expected to see the math-first format SIDE-BY-SIDE with a human-readable spec — that was the A5 plan's centerpiece. Without it, AISP feels abstract.
**T+3:00** — Taps BYOK. Reads provider table. Likes the cost-cap explainer.
**T+4:00** — Taps Open Core. Reads 55% thesis. Likes the GitHub CTAs.

**Score: 78/100** (target 75). PASS, but AISP dual-view absence is the felt-loss.

**Framer must-fix queue:**

| # | Item | Effort |
|---|---|---:|
| F-F1 | AISP dual-view component on /aisp page (SAME as F1 in summary) | 30m |

### Persona 3: Capstone reviewer (Harvard ALM panel)

**Walk-through summary:**

**T+0:00** — Lands on Welcome. ✅ Hero good. "Harvard ALM Capstone" tagline visible top — cites credibility.
**T+0:30** — Taps About. Reads Bradley's framing. ✅
**T+1:30** — Taps AISP. ⚠️ Capstone reviewer EXPECTS to see AISP in action — math-first format demo. Today /aisp page exists but does NOT have the dual-view (deferred). **Major credibility loss for the thesis.**
**T+3:00** — Taps "How I Built This" (NOT in main nav; reviewer found it via direct URL). 🚨 **WHAT?** Phase trajectory now shows P1-P21 with current scores — much better than prior version. STATS bar truthed. ✅
**T+4:00** — Notices COCOMO comparison gone. Reviewer asks: "How do you justify the 340x compression claim now?" Without COCOMO comparison, the build-story loses one of its most-quoted lines.
**T+5:00** — Taps Open Core. Reads 55% thesis. ✅
**T+7:00** — Taps BYOK. ✅ Reviewer appreciates the privacy promise. Asks: "Where's SECURITY.md?" — out of scope (P20 deliverable, not yet shipped).

**Score: 75/100** (target 85). FAIL by 10. Capstone-blocker = AISP dual-view + COCOMO loss.

**Capstone must-fix queue:**

| # | Item | Effort |
|---|---|---:|
| F-C1 | AISP dual-view component (SAME as F1 + F-F1) | 30m |
| F-C2 | Restore single COCOMO callout in HowIBuiltThis.tsx (without inflated LOC; use truthful 28K LOC + ~60h actual = compression ratio still significant) | 10m |
| F-C3 | "How I Built This" not in main nav; reviewer found via URL — add it OR keep cleaner 5-item nav (deferred to fix-pass-2 per nav cap) | — |

---

## Part B — R2: Functionality breadth + LLM coverage

### B.1 Per-page functional audit

| Page | Renders? | Links resolve? | Capabilities accurate? | Theme | Notes |
|---|:---:|:---:|:---:|---|---|
| `/` (Welcome) | ✅ | ✅ all 3 hero CTAs + footer + nav | ✅ | warm-cream | New; 165 LOC down from 918 |
| `/byok` (NEW) | ✅ | ✅ CTA → /onboarding works | ✅ | warm-cream | New; 165 LOC; Don Miller blog-style |
| `/about` | ✅ | ✅ | ⚠️ stale | dark | Refers to "P15-P19" implicitly; could cite P15-P21 sealed |
| `/aisp` | ✅ | ✅ | 🚨 **missing dual-view** | dark | F1 carryforward |
| `/research` | ✅ | ✅ | ⚠️ unverified | dark | Not touched this seal; verify counts |
| `/open-core` | ✅ | ✅ | ⚠️ stale (refers to old roadmap) | dark | F4 — needs delineation block |
| `/how-i-built-this` | ✅ | ✅ | ✅ refreshed | dark | New STATS + PHASES + Don Miller |
| `/docs` | ✅ | ✅ | ✅ | dark? | QUICK_START truthed; verify rest |
| `/onboarding` | ✅ | ✅ | n/a (in-product) | n/a | unchanged |
| `/builder` | ⚠️ stub | ⚠️ | n/a | n/a | F7 — orphan route |
| `*` (NotFound) | ✅ | ✅ | ✅ | n/a | unchanged |

### B.2 Capability coverage on the public site (post-rebuild)

| Capability | On marketing site? | Where |
|---|:---:|---|
| 5-provider LLM matrix | ✅ | BYOK page provider table |
| Web Speech STT | ⚠️ partial | Welcome 3-modes block mentions Listen but no demo |
| AISP Crystal Atom | ⚠️ partial | /aisp page exists but NO dual-view (F1) |
| BYOK + cost cap | ✅ | BYOK page has both |
| sql.js + IndexedDB local persistence | ✅ | BYOK privacy promise + Welcome "local-only" |
| `.heybradley` zip export | ✅ | Welcome "What you get" + BYOK "stays in your browser" |
| 16 section types / 12 themes / 17 examples / 300 media | ✅ | Welcome "What you get" + Docs |
| 4 website pages | ✅ implicit | Pages exist |
| 15+ chat commands | ⚠️ NOT mentioned | Welcome "Try Chat" doesn't enumerate |
| 4 listen demos | ⚠️ NOT mentioned | Welcome 3-modes mentions Listen but doesn't enumerate |
| 7 Blueprint sub-tabs | ⚠️ Docs mentions "AISP specs" but doesn't enumerate | |

### B.3 Realistic visitor questions — does the site answer?

| Question | Answered? | Where |
|---|:---:|---|
| "What does Hey Bradley do?" | ✅ | Welcome hero |
| "How is it different from Lovable / v0 / Claude designer?" | ⚠️ | OpenCore "55% problem" implies it; never says "Hey Bradley vs X" |
| "Do I need an account?" | ✅ | BYOK page hero: "No account." |
| "How much does it cost?" | ✅ | BYOK page provider table per-row + cost-cap |
| "What about my privacy?" | ✅ | BYOK privacy promise |
| "How do I deploy a site I built here?" | ⚠️ | Welcome "What you get" mentions `.heybradley` zip but no deploy walkthrough |
| "Is the source code available?" | ✅ | Welcome CTA + GitHub link |
| "What's AISP?" | ⚠️ partial | /aisp page exists but lacks dual-view (F1) |
| "How does Listen mode actually work?" | ⚠️ | Welcome mentions Web Speech API; no demo embed or video |
| "Can I see a live demo?" | ⚠️ | "Try it now" → /onboarding is the demo, but no embedded preview on Welcome |

### B.4 Functional gaps that would catch a visitor

| # | Gap | Severity | Fix |
|---|---|---|---|
| FN1 | `/aisp` has no dual-view component | HIGH | F1 — implement AISPDualView |
| FN2 | `/open-core` doesn't delineate open-core vs commercial in a structured block | MED | F4 — add OpenCoreVsCommercial inline block |
| FN3 | `/about`, `/aisp`, `/research` capability counts not refreshed | MED | F5 — sweep |
| FN4 | No visible demo embed; only "Try it now" CTAs that route away | LOW | post-MVP — embed iframe of /onboarding mini-version |
| FN5 | "How is Hey Bradley different from Lovable" never answered explicitly | LOW | acceptable; covered indirectly via 55%-problem framing |
| FN6 | Welcome footer doesn't link to BYOK / AISP / How-I-Built-This | LOW | minor; nav covers it |

### B.5 Content density audit (per ADR-053 rules)

| Page | Headlines ≤8 words? | Lede ≤35 words? | Body sections ≤200 words? |
|---|:---:|:---:|:---:|
| Welcome | ✅ | ✅ | ✅ |
| BYOK | ✅ | ✅ | ✅ |
| HowIBuiltThis | ⚠️ "21 Phases. One Human. Many Agents." (6 words ✓) | ✅ | ⚠️ "Phase Trajectory" section 14 phases listed; visual not text-heavy |
| Docs | ⚠️ verify | ⚠️ | ⚠️ verify |
| About | ⚠️ untouched; verify | ⚠️ | ⚠️ |
| AISP | ⚠️ untouched | ⚠️ | ⚠️ |
| Research | ⚠️ untouched | ⚠️ | ⚠️ |
| OpenCore | ⚠️ "The 55% problem nobody's solving." (7 words ✓ but needs F4) | ⚠️ | ⚠️ |

### B.6 Consolidated must-fix from Part B

| # | Item | Effort |
|---|---|---:|
| F-FN1 | AISP dual-view (SAME as F1) | 30m |
| F-FN2 | OpenCoreVsCommercial inline block on /open-core (F4) | 15m |
| F-FN3 | Stale capability sweep on About + AISP + Research (F5) | 20m |
| F-FN4 | Restore COCOMO callout in HowIBuiltThis (F-C2) | 10m |

---

## Combined R1 + R2 must-fix queue (de-duplicated)

| # | Item | Severity | Effort | Persona impact |
|---|---|---|---:|---|
| 1 | AISP dual-view component on /aisp | HIGH (Capstone-binding) | 30m | C +10, F +3 |
| 2 | Theme unification (recommend warm-cream everywhere; OpenCore+HowIBuiltThis stay dark as documented islands) | HIGH (Grandma-binding) | 1h | G +8 |
| 3 | "BYOK" expanded to "Bring Your Own Key" first occurrence | LOW (Grandma) | 2m | G +1 |
| 4 | OpenCore.tsx delineation block | MED | 15m | C +2, G +1 |
| 5 | About + AISP + Research capability sweep | MED | 20m | C +2 |
| 6 | Restore COCOMO callout in HowIBuiltThis | LOW (Capstone-thesis) | 10m | C +3 |
| 7 | Persona walks recorded | HIGH (binding gate) | 30m | n/a (verification) |

**Total fix-pass-1 effort from R1+R2:** ~3h.
**Estimated composite delta after fix-pass-1:** Grandma 62→72 / Framer 78→82 / Capstone 75→85 = **76 → 80 composite** (+8).

## Cross-link to next chunk

`02-security-architecture.md` — R3 + R4 perspectives.
