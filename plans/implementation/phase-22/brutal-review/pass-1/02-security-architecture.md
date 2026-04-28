# P22 Brutal Review — Pass 1 — Chunk 2: Security + Architecture

> Combined R3 (Security/privacy) + R4 (Architecture/maintainability) findings.
> ≤600 LOC.

---

## Part C — R3: Security + Privacy holistic

### C.1 Threat surface introduced by P22

P22 is doc-only-on-the-public-surface, code-light on the app side. The ONLY new surface is `/byok` and the compressed Welcome. New attack vectors:

| Vector | Mitigation present? | Status |
|---|:---:|---|
| External link injection (Welcome `<a href=` to GitHub repo) | ✅ `target="_blank" rel="noopener noreferrer"` | OK |
| BYOK page leaking key during walkthrough screenshots | n/a (no screenshots embedded) | OK |
| AISP page revealing system-prompt secrets if dual-view embeds the live Crystal Atom | DEFERRED (F1) | check during F1 implementation |
| `/byok` route accidentally bypasses route guards | n/a (no auth in open-core) | OK |
| MarketingNav DOM XSS via NAV_LINKS — none (static array) | ✅ static literal | OK |

### C.2 Privacy disclosures on the public site

Per ADR-053 + R3 P19 brutal-review residuals, public-site MUST surface:

| Disclosure | Where | Status |
|---|---|---|
| BYOK key never leaves browser | BYOK §"Why BYOK" + §"Stays in browser" | ✅ explicit |
| Voice → Apple/Google STT vendor (browser-mediated) | BYOK §"Goes to your provider" | ✅ explicit |
| OpenRouter sees prompts + model + origin | BYOK provider-table note | ✅ explicit (this was P20 carryforward C06; P22 closes it) |
| Listen transcripts persist locally + ship in `.heybradley` exports | BYOK §"Stays in browser" | ✅ explicit |
| 30-day llm_logs retention | BYOK §"Stays in browser" | ✅ explicit |
| DEV-mode VITE_LLM_API_KEY inlined | NOT mentioned on public site | ⚠️ acceptable (developer-only concern; covered in CLAUDE.md + ADR-043) |
| Multi-tab same-origin IndexedDB sharing | NOT mentioned on public site | ⚠️ acceptable (low-impact per R3 P19 finding §6) |
| GitHub PAT / OpenAI / etc. NOT used | n/a (negative claim) | OK |

**Net:** P22 BYOK page closes 4 of the 5 R3 P19 "privacy disclosure gaps" (G1 voice, G2 OpenRouter, G3 BYOK kv storage, G4 multi-tab not mentioned but low-impact, G5 DEV-key not mentioned but developer-scope, G6 listen transcript clarification). **Strong privacy posture**.

### C.3 Security posture findings

| # | Finding | Severity | Fix |
|---|---|---|---|
| SEC1 | BYOK page provider table has external links to console.anthropic.com / aistudio.google.com / openrouter.ai/keys but they are NOT actually rendered as links — they appear as plain text. Visitor must copy-paste. | LOW UX (not security per se) | Add `<a href>` with rel="noopener" — fix-pass-1 ~5m |
| SEC2 | Welcome footer email `bar181@yahoo.com` exposes plain mailto-able text — bot-scrapeable | LOW privacy | Acceptable; owner-decision (already exposed in README + author-block) |
| SEC3 | Welcome links to `/onboarding` but not to `/builder` even though Builder.tsx is a 5-LOC stub — orphan route concern (F7) | LOW | Resolve `/builder` (redirect to /onboarding OR remove) |
| SEC4 | `/research` removed from main nav but route still active — orphan link | LOW | Acceptable (Research stays accessible; just less prominent) |
| SEC5 | No CSP / SRI headers documented for marketing pages (Vercel-side concern) | DEFERRED (P20) | covered by P20 SECURITY.md (when authored) |

**No HIGH-severity security findings.** Strong posture preserved from P19/P20 work.

### C.4 SECURITY.md cross-reference

ADR-043 references SECURITY.md (not yet authored — P20 deliverable). BYOK page should cross-link to SECURITY.md once it ships. **Add to fix-pass-1 plan as conditional:** if SECURITY.md lands during P22, add `<Link to="/security">` from BYOK page bottom.

---

## Part D — R4: Architecture + Maintainability

### D.1 Welcome.tsx compression analysis

| Metric | Pre-P22 | Post-P22 | Δ |
|---|---:|---:|---:|
| LOC | 918 | 165 | -753 |
| Helper consts | 8 (HeroShowcase + INITIAL_SHOWCASE + HERO_SHOWCASES + …) | 1 (MODES) | -7 |
| Inline framer-motion AnimatePresence | yes | NO | -1 dep |
| useState/useEffect/useRef | 3 | 0 | -3 |
| External imports | 8 (framer-motion + 7 lucide icons + brad_pixar.webp) | 4 (Link + 4 lucide icons) | -4 |
| File complexity (cyclomatic est.) | high | low | huge |

**Verdict:** cleanest single-file simplification of any phase to date. **(+) High maintainability gain.**

### D.2 BYOK.tsx architecture

| Aspect | Status | Notes |
|---|---|---|
| LOC | 165 | OK; under target ≤200 |
| Components | 1 (default export) | OK; appropriate for a leaf marketing page |
| State | 0 | Pure render; correct |
| External deps | Link + lucide-react + MarketingNav | minimal |
| Reusable extraction candidates | PROVIDERS table → could be a shared `<ProviderCard>` IF reused on /open-core | LOW (defer to extraction trigger: 3+ uses) |

**Verdict:** clean. ✅

### D.3 Theme inconsistency (architectural concern)

| Page | Theme | Justification (per ADR-053) |
|---|---|---|
| Welcome | warm-cream `#faf8f5` + orange accent `#e8772e` | new (matches in-product app) |
| BYOK | warm-cream | new |
| About | dark `#1a1a1a` + crimson `#A51C30` | unchanged from prior |
| AISP | dark | unchanged |
| Research | dark | unchanged |
| OpenCore | dark | "intentional dark island" per ADR-053 |
| HowIBuiltThis | dark | "intentional dark island" per ADR-053 |
| Docs | dark | unchanged |
| Onboarding | (in-product theme tokens) | n/a |
| Builder | stub | n/a |
| NotFound | unspecified | n/a |

**Architectural problem:** ADR-053 marks 2 pages as "intentional dark islands" (OpenCore + HowIBuiltThis) — but in reality 6 of 8 marketing pages are dark. Calling them "islands" misrepresents the situation. **The actual rule is the reverse: warm-cream is the exception (Welcome + BYOK), dark is the default.**

**Architectural decision needed in fix-pass-1:**
- **Option A:** Convert all dark pages to warm-cream (consistent w/ in-product app; ~1h work; addresses Grandma persona)
- **Option B:** Convert Welcome + BYOK to dark (consistent w/ existing 6 pages; ~30m; loses warm-cream simplicity)
- **Option C:** Keep split; add visible nav-cue when transitioning (theme-strip indicator); update ADR-053 to be honest about which is the default

**Recommended (per A5 Don Miller framing + Grandma persona):** Option A. Warm-cream is the visual identity of the in-product app; marketing should match.

### D.4 Stub + orphan routes

| Route | Component | Status | Recommendation |
|---|---|---|---|
| `/builder` | Builder.tsx (5 LOC stub) | Reachable from MarketingNav "Try Builder" button | Resolve: redirect to `/onboarding` OR expand stub OR remove route + nav button |
| `/new-project` | Onboarding (route alias) | Welcome footer + nav route to it | Verify both `/onboarding` and `/new-project` map to same component (currently `/new-project` → Onboarding per main.tsx:53) |
| `/research` | Research.tsx | Active route; NOT in main nav | OK — accessible via direct link; intentional |

**F7 carryforward:** consolidate route naming: pick `/onboarding` OR `/new-project`, redirect the other.

### D.5 Marketing component reuse opportunities

A5 plan called for 3 NEW components: `ModeTiles.tsx` / `AISPDualView.tsx` / `OpenCoreVsCommercial.tsx`. P22 initial seal inlined these in Welcome instead.

**Should they be extracted?** Per CLAUDE.md "three similar lines is better than a premature abstraction" rule:

| Candidate | Reuse count today | Extract? |
|---|---:|---|
| ModeTiles (Builder/Chat/Listen tiles) | 1 (Welcome only) | NO — premature; inline is fine until 2nd use site |
| AISPDualView | 0 (deferred via F1) | YES once implemented (F1 implementation should ship as a component for /aisp + /how-it-works dual-use) |
| OpenCoreVsCommercial | 1 (Welcome only) — F4 wants 2nd use on /open-core | YES once F4 lands; should be a shared component |

**F4 implementation should extract OpenCoreVsCommercial as a component, not inline.**

### D.6 main.tsx duplicated Routes

The router in `src/main.tsx` has TWO `<Routes>` blocks (lines 51-62 success path + lines 77-88 persistence-error fallback). Adding a route to the public site requires editing both. P22 added `/byok` to both correctly via `replace_all=true` Edit.

**Architectural smell:** route definition duplication across 2 sites. **Refactor candidate:** extract a single `<AppRoutes>` component referenced by both branches.

| Severity | Fix |
|---|---|
| LOW (works correctly) | post-MVP refactor; ADR amendment to ADR-026 (3-tier model routing) covers app-shell concerns |

**Not must-fix.** Acceptable carryforward.

### D.7 ADR-053 internal consistency check

ADR-053 §"Theme alignment" claims warm-cream is the default for marketing pages. **Reality after P22 initial seal:** only 2 of 8 pages are warm-cream. ADR is currently mis-stated.

**Fix:** EITHER (a) bring all pages to warm-cream (Option A above) AND ADR-053 is correct, OR (b) keep theme split AND amend ADR-053 to acknowledge the dark-default reality.

**Recommended:** Option A (matches Don Miller direction + Grandma persona + the original A5 §3.2 recommendation).

### D.8 Architecture must-fix queue (R4)

| # | Item | Severity | Effort |
|---|---|---|---:|
| ARC1 | Theme unification (Option A) — convert About/AISP/Research/OpenCore/HowIBuiltThis/Docs to warm-cream | HIGH (UX-binding) | 1h |
| ARC2 | OpenCoreVsCommercial component extraction (during F4 implementation) | LOW | folded into F4 |
| ARC3 | Resolve `/builder` stub or remove (F7) | LOW | 5m |
| ARC4 | ADR-053 amendment if Option A NOT chosen | LOW | 10m (only if Option B/C) |

**Total architecture fix-pass-1:** ~1.5h.

---

## Combined R3 + R4 must-fix queue (de-duplicated)

| # | Item | Severity | Effort | Notes |
|---|---|---|---:|---|
| 1 | Theme unification (Option A: all marketing pages warm-cream) | HIGH | 1h | Closes ARC1 + UX F2; addresses Grandma 62→70+ |
| 2 | SEC1 — Make BYOK provider URLs clickable | LOW | 5m | UX/security improvement |
| 3 | F7/ARC3 — Resolve /builder stub | LOW | 5m | Orphan route cleanup |
| 4 | F4 — OpenCore delineation (extracted as `<OpenCoreVsCommercial>` component for reuse on Welcome too) | MED | 20m (was 15; +5 for extraction) | Architecture-clean implementation |

## Composite estimate update (post-pass-1 review)

After Chunk 1 (R1+R2) + Chunk 2 (R3+R4) findings consolidated:

**Fix-pass-1 effort:** ~4h (R1+R2 = 3h + R3+R4 = 1.5h - dedup ~30m for theme/F2/ARC1 overlap = 4h)

**Estimated composite after fix-pass-1:**
- Grandma: 62 → **74** (theme unified +8; BYOK expanded +1; Welcome footer +0; clear navigation +3 = +12)
- Framer: 78 → **84** (AISP dual-view +3; OpenCore delineation +2; clean theme +1 = +6)
- Capstone: 75 → **88** (AISP dual-view +5; COCOMO restored +3; OpenCore delineation +2; clean theme +1; capability sweep +2 = +13)
- **Composite: 72 → 82** (+10)

**P22 final-seal target: 82 composite.** With pass-1 fix-pass, estimated to land at exactly 82. If short, pass-2 closes the gap.

## Cross-link to next chunk

`03-fix-pass-plan.md` — consolidated must-fix queue (all 4 perspectives) + per-item file-by-file decomposition.
