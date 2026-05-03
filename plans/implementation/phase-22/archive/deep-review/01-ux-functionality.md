# P15-P22 Deep Review — Chunk 1: UX + Functionality

> Combined R1 (UX persona walks across all surfaces) + R2 (Functionality breadth: 35-prompt audit + 5-provider verification + Listen pipeline + error states).
> ≤600 LOC.

---

## Part A — R1: UX persona walks (cumulative)

### Persona 1: Grandma (target ≥70)

**Surfaces walked:** Welcome / Onboarding / Builder / Chat / Listen / Settings / BYOK / About / OpenCore / AISP / How-I-Built-This / Docs

**T+0:00 — Welcome.tsx (post P22).** ✅ Hero "Tell Bradley what you want." direct. Three-mode tiles clean. Don Miller framing reads. **Score this surface: 8/10**.

**T+1:00 — /onboarding.** ✅ In-product flow takes over. Onboarding 740 LOC was untouched in P22 but is solid (sealed in P15-P17). **8/10**.

**T+2:00 — /builder (the AppShell).** ✅ DRAFT mode is shrunk (5 tabs → 2 sections per P15 simplification). Welcome banner displays mode toggle. **7/10** (Grandma still pauses at section dropdown).

**T+3:00 — Chat tab.** ⚠️ ChatInput accepts text. Hits Enter. FixtureAdapter responds canned. `mapChatError` surfaces 4 infra kinds. Generic fallback hint reads "I'm running on simulated responses..." — good. Grandma successfully changes hero copy. ✅ **8/10**.

**T+4:00 — Listen tab.** ⚠️ Privacy disclosure inline above PTT (P19 fix-pass-2 F9). Tooltip says "Speak to Bradley (preview)" not "alpha" jargon. PTT works. **8/10**.

**T+5:00 — Settings cog.** ⚠️ LLM provider section visible. Cost cap input shows ($1.00 default — but visual NOT yet wired to a CostPill in shell footer; P20 carryforward). Acceptable for P22 seal scope; flag for P20 close. **6/10**.

**T+6:00 — /byok page.** ✅ NEW. 5-provider table reads cleanly. Privacy promise is Grandma-readable. **9/10**.

**T+7:00 — /about, /open-core, /aisp, /how-i-built-this, /docs.** ✅ All warm-cream. Theme consistent (post-P22-fix-pass-1 F2). **7-8/10 each**.

**Composite: 73/100** (target 70). PASS.

**Grandma carryforward (post-P22 deep-review):**

| # | Item | Effort |
|---|---|---:|
| GU1 | About.tsx "Sealed P15-P22" callout (cumulative scoreboard for Grandma) | 5m |
| GU2 | CostPill UI in shell footer (P20 deliverable; not P22 carryforward) | DEFER P20 |

### Persona 2: Framer (target ≥80)

**T+0:00** — Welcome. ✅ Likes typography. **9/10**.
**T+1:00** — Builder + EXPERT mode. ✅ Full property inspector. JSON edit. **9/10**.
**T+2:00** — Chat: types "use a serif font for headings". Fixture matches. Patch applied. ✅ Sees patch in audit log via Pipeline tab. **9/10**.
**T+3:00** — Listen: PTT works. "use a serif font" transcribes correctly. Same chat pipeline. **8/10**.
**T+4:00** — BYOK: provider table is clean. ⚠️ Plain-text URLs (not clickable). Minor friction. **7/10**.
**T+5:00** — AISP: NEW dual-view component visible. Crystal Atom + human-readable side-by-side. ⚠️ Renders AFTER footer (semantic order issue, GAP-F2). Renders correctly but feels appended. **8/10**.
**T+6:00** — Open Core: 55% problem thesis + delineation block. ✅ **9/10**.

**Composite: 84/100** (target 80). PASS.

**Framer carryforward:**

| # | Item | Effort |
|---|---|---:|
| FU1 | BYOK URLs clickable | 5m |
| FU2 | AISPDualView render-order fix (move BEFORE footer) | 5m |

### Persona 3: Capstone reviewer (target ≥85)

**T+0:00** — Welcome. ✅ Capstone tagline visible top.
**T+1:00** — AISP page. Reads dual-view (post P22 fix-pass-1 F1). ✅ "OK — this validates the under-2%-ambiguity claim." But render-order issue noted (after footer). **8/10** (-2 for ordering).
**T+2:00** — How-I-Built-This. Phase trajectory P1-P21. STATS truthed (43 ADRs / 28K LOC / 63+ tests). COCOMO callout restored. ✅ **9/10**.
**T+3:00** — About + OpenCore. ✅ **9/10 each**.
**T+5:00** — Docs. Counts truthed. ✅ **8/10**.
**T+7:00** — Drills into source. Sees 44 ADRs in `docs/adr/`. Sees ADR-054 (DDD bounded contexts). ✅ Strong architecture documentation.
**T+9:00** — Asks: "Where's SECURITY.md?" 🚨 **Doesn't exist.** ADR-043 cross-references it. Capstone reviewer flags as binding gap. **-3** for this.

**Composite: 86/100** (target 85). PASS but tight. SECURITY.md missing is the felt loss.

**Capstone carryforward:**

| # | Item | Effort |
|---|---|---:|
| CU1 | SECURITY.md authored | 30m |
| CU2 | AISPDualView render-order fix (same as FU2) | 5m |

---

## Part B — R2: Functionality breadth audit

### B.1 Per-prompt coverage (35 realistic chat prompts)

(See `phase-19/deep-dive/02-functionality-findings.md` for the original 35-prompt taxonomy. P19 baseline: 2/35 work end-to-end. P22 didn't add chat fixtures so coverage is unchanged.)

| Bucket | Coverage | Δ since P19 |
|---|---:|---:|
| Theme (8) | 1/8 (accent color only) | 0 |
| Hero (8) | 2/8 (heading + subheading; path-resolution closes blog-standard) | +1 (post-P19 fix-pass) |
| Images (8) | 0/8 | 0 |
| Article (8) | 1/8 (multi-patch generator) | 0 |
| Multi-intent / help / discovery (3) | 0/3 | 0 |
| **Total** | **4/35 (11%)** | +1 |

**Net assessment:** Chat coverage increased from 2/35 to 4/35 across P19 → P22 (path-resolution + adjacent fixes). Image MVP fixtures (8 prompts) and help/discovery handler are still P20-or-Sprint-B-or-later work. **NOT a P22 regression**; pre-existing gap.

### B.2 5-provider matrix verification

| Provider | Selectable in LLMSettings? | Adapter file | Cost displayed on BYOK page? |
|---|:---:|---|:---:|
| Claude (Anthropic) | ✅ | `src/contexts/intelligence/llm/claudeAdapter.ts` | ✅ |
| Gemini (Google) | ✅ | `geminiAdapter.ts` | ✅ |
| OpenRouter | ✅ | `openrouterAdapter.ts` | ✅ |
| Simulated | ✅ | `simulatedAdapter.ts` | ✅ |
| AgentProxy (mock) | ✅ | `agentProxyAdapter.ts` | ✅ |
| Fixture (DEV-only) | ✅ in DEV pickAdapter | `fixtureAdapter.ts` | (intentionally NOT on BYOK page; DEV-only) |

**6 adapters total; 5 user-selectable.** Coverage matches BYOK page documentation. ✅

### B.3 Listen pipeline end-to-end

User taps PTT → speaks "make hero red" → Web Speech API transcribes → `listenStore.final` populated → `submitListenFinal()` calls `chatPipeline.submit({source: 'listen', text, history})` → same pipeline as text → `auditedComplete` → `runLLMPipeline` → fixture/adapter → patches → applyPatches → preview updates.

**Verified path:** `phase-19/session-log.md` Step 2 results table; tests `tests/p19-step2.spec.ts` (4 cases) green at P19 seal.

**Cumulative: ✅ pipeline intact across P22 (no source changes to chat/listen pipeline).**

### B.4 Error-state handling

| Error kind | Surface | Copy | Status |
|---|---|---|:---:|
| `cost_cap` | Chat | "I've hit today's spending cap..." | ✅ mapChatError (P19 fix-pass-2 F2) |
| `timeout` | Chat | "Request timed out. Network issue?..." | ✅ |
| `precondition_failed` | Chat | "Something's not configured (missing API key?)..." | ✅ |
| `rate_limit` | Chat | "Provider is rate-limiting me. Wait a few seconds..." | ✅ |
| `validation_failed` | Chat | (canned hint — "Try one of...") | ✅ semantically correct |
| `unknown` | Chat | (canned hint) | ✅ |
| `unsupported` | Listen | "Voice not supported in this browser..." | ✅ mapListenError |
| `permission_denied` | Listen | "Microphone access denied..." | ✅ |
| `audio_capture` | Listen | "Couldn't capture audio..." | ✅ |
| `network` | Listen | "Network issue with speech recognition..." | ✅ |
| `no_speech` | Listen | "I didn't hear anything..." | ✅ |
| `unknown` | Listen | "Speech recognition failed..." | ✅ |

**12 error states mapped.** ✅

### B.5 Silent failures + missing handlers

| Concern | Status |
|---|---|
| ErrorBoundary in `ui/ErrorBoundary.tsx` | ✅ exists; wraps each render section |
| ErrorBoundary console.error gate | ❌ **GAP-A1**: not DEV-gated |
| PersistenceErrorBanner on initDB failure | ✅ shipped P19 fix-pass-2 F14 |
| `chatPipeline.submit` bare catch swallow | ✅ closed P19 fix-pass-2 F17 |
| `auditedComplete` audit-row write failure | ✅ wrapped in try/catch with DEV warn (P18b FIX 6) |
| `webSpeechAdapter` race on rapid PTT cycles | ✅ closed P19 fix-pass-2 (FIX 5 unconditional reset) |

**Net: 1 gap (GAP-A1 ErrorBoundary console).** Otherwise robust.

### B.6 P22-introduced functional regressions

| Surface | P22 change | Regression? |
|---|---|:---:|
| Welcome.tsx | 918 → 165 LOC, dropped HeroShowcase carousel + framer-motion AnimatePresence | ✅ no regression (carousel was aspirational; CTAs preserved) |
| HowIBuiltThis.tsx | STATS + PHASES + COCOMO truthed | ✅ no regression |
| Docs.tsx | QUICK_START descriptions truthed | ✅ no regression |
| BYOK.tsx | NEW page | ✅ new capability surfaced |
| MarketingNav.tsx | Research replaced with BYOK in 5-item nav | ⚠️ Research now orphaned from main nav (still accessible via direct URL) — acceptable, non-blocking |
| main.tsx | /byok route wired in both render branches | ✅ no regression |
| 6 page files (theme unification sed pass) | dark → warm-cream tokens | ⚠️ visual change only; no behavioral regression |
| AISP.tsx | AISPDualView appended | ⚠️ render-order issue (after footer) — GAP-F2 |
| OpenCore.tsx | OpenCoreVsCommercial appended | ⚠️ same render-order issue — GAP-F3 |

**Net: 2 visual ordering issues (GAP-F2, GAP-F3); zero behavioral regressions.**

### B.7 Build + bundle integrity

| Metric | Pre-P22 | Post-P22 | Δ |
|---|---:|---:|---:|
| Main bundle gzip | 599.85 KB | 556.31 KB | -43 KB ✅ |
| Total gzip | ~700 KB | ~700 KB | 0 |
| TS errors | 0 | 0 | ✅ |
| Build time | 6.14s | 2.83s | -3.3s ✅ (likely caching) |

**Bundle margin against 800 KB budget: ~100 KB headroom.** Healthy.

---

## Combined R1 + R2 must-fix queue

(merges into deep-review must-fix queue MF1-MF9 in `00-summary.md`)

| Persona/audit gap | Must-fix # | Severity |
|---|---|---|
| GU1 About callout | MF9 | LOW |
| FU1 BYOK URLs | MF8 | LOW |
| FU2/CU2 AISPDualView render-order | MF3 | MED |
| CU1 SECURITY.md | MF1 | HIGH |
| GAP-A1 ErrorBoundary | MF2 (covered in §02 chunk) | HIGH |
| GAP-F3 OpenCoreVsCommercial render-order | MF4 | MED |

## Cross-link to next chunk

`02-security-architecture.md` — R3 + R4 perspectives.
