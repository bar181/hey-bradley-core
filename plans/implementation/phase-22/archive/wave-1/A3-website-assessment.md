# A3 — Public Website Assessment + Rebuild Outline

> Author: coordinator (replacing timed-out swarm agent)
> Source HEAD: `eaa2410`
> Scope: open-core public site only; commercial Supabase version is OUT OF SCOPE (separate repo)

## Executive summary (≤150 words)

Current public-site surface = **10 page components** in `src/pages/` (~3,400 LOC total, dominated by Welcome 918 + Onboarding 740 + OpenCore 429). Major gaps: (1) **Welcome.tsx** rotates 8 hero showcases that don't reflect actual product; (2) **Docs.tsx** claims stale counts (10 examples → actually 17; 258 media → 300; 20 sections → 16); (3) **HowIBuiltThis.tsx** claims 33 ADRs (actually 38); (4) **OpenCore.tsx** leads with "55% problem" thesis (good, keep); (5) zero pages mention 5-provider matrix, BYOK flow, AISP-as-shipped, listen-mode-as-shipped. The rebuild should be **simpler** — single one-screen narrative + 3 modes + AISP demo + BYOK setup + commercial-vs-open-core delineation. Persona gate: Grandma ≥70.

## §A — Current page inventory

| File | LOC | Purpose | Status |
|---|---:|---|---|
| `Welcome.tsx` | 918 | Landing carousel | 🚨 Overengineered; 8 hero showcases mostly aspirational |
| `Onboarding.tsx` | 740 | Project starter flow | ✅ Solid, in-product |
| `OpenCore.tsx` | 429 | "The 55% problem" pitch | ✅ Thesis good; capability claims need refresh |
| `Research.tsx` | 308 | AISP research | ✅ Likely fine; verify counts |
| `Docs.tsx` | 275 | User-facing docs | ⚠️ Counts stale (10 → 17 examples, etc.) |
| `AISP.tsx` | 258 | AISP explainer | ✅ Likely fine |
| `HowIBuiltThis.tsx` | 247 | Build journey | ⚠️ "33 ADRs" stale (actually 38) |
| `About.tsx` | 223 | Bradley + capstone | ✅ Solid |
| `NotFound.tsx` | 20 | 404 | ✅ Fine |
| `Builder.tsx` | 5 | Stub | ⚠️ Missing |

## §B — Gap matrix (claims vs reality)

| Page | Claim | Reality | Status |
|---|---|---|---|
| Welcome | "Listen Mode" hero rotation | Listen mode SHIPPED P19 | ❌ Claim is real but copy reads aspirational |
| Welcome | "Builder Mode for fine tuning" | Builder shipped P11+ | ✅ |
| Welcome | CTAs `/new-project` and `/builder` | Routes exist; verify post-rebuild | ✅ |
| OpenCore | "AI made coding 3x faster" thesis | Outside Hey Bradley scope | ✅ keep |
| OpenCore | "<2% ambiguity" callout | AISP claim, true per `aisp-open-core` | ✅ |
| Docs | "12 themes" | 12 confirmed | ✅ |
| Docs | "10 pre-built example sites" | **17 examples** in `src/data/examples/` | 🚧 stale |
| Docs | "258+ media library" | **300 images** per CLAUDE.md | 🚧 stale |
| Docs | "20 section types" | **16 types** per CLAUDE.md (22 template dirs incl. variants) | 🚧 stale |
| HowIBuiltThis | "33 ADRs" | **38 ADRs** (highest 048; 11 numbering holes) | 🚧 stale |
| HowIBuiltThis | "P1-P11 phase table" | P1-P19 + P18b sealed; P20 in flight | 🚨 5 phases missing |
| HowIBuiltThis | "71+ tests" | **63 across 29 spec files (46 targeted)** | 🚧 stale |
| HowIBuiltThis | "100K+ lines / 470+ files" | ~63K lines / ~227 source files (per CLAUDE.md F15) | 🚨 inflated |
| HowIBuiltThis | "$2.63M COCOMO" | Estimate based on stale LOC | 🚧 recompute |
| About | Harvard ALM May 2026 capstone | Confirmed | ✅ |
| AISP | Crystal Atom + 512 symbols | Shipped P18 | ✅ |

## §C — Capabilities NOT visible on current site (📦 missing)

These shipped capabilities are NOT mentioned/demonstrated on the public site and should be in the rebuild:

| Capability | Phase shipped | Where in rebuild |
|---|---|---|
| 5-provider LLM matrix (Claude/Gemini/OpenRouter/Simulated/AgentProxy) | P17/P18/P18b | "BYOK setup" page or Modes page |
| Web Speech STT push-to-talk | P19 | "Three Modes" — Listen demo |
| `mapChatError` + `mapListenError` infra-error UX | P19 fix-pass-2 | implicit — cite as "graceful errors" |
| Cost cap + per-session USD ceiling + audit log | P17/P18b | "BYOK setup" page |
| 30-day llm_logs retention + privacy disclosure | P18b/P19 | "Privacy" section in BYOK page |
| `.heybradley` zip export + sensitive-data strip | P16 | "How it works" page |
| sql.js + IndexedDB cross-tab safe | P16 | "How it works" page |
| AISP Crystal Atom dual-view (system prompt + Blueprints) | P18 + P20 C12 | "AISP" page |
| Path-resolution + CSS-injection guard + site-context sanitize | P19 fix-pass-2 | implicit (security details in SECURITY.md when authored) |

## §D — Rebuild content outline (for A5)

### Required pages (post-rebuild)

1. **Welcome** (`/`) — single screen, 30-second narrative
   - Hero: "Tell Bradley what you want. Watch it appear." (current copy works)
   - Sub: "A whiteboard that listens, builds what you describe in real-time, and writes enterprise specs in the background."
   - 3 CTAs: Try It (→ /onboarding) · Open Core Repo (→ GitHub) · Read the Specs (→ /aisp)
   - 3-mode preview tiles (Builder / Chat / Listen) with one-line each
   - Drop the 8-showcase carousel; replace with single composite preview

2. **What It Does** (`/what-it-does` or rolled into Welcome)
   - 3-mode breakdown: Builder (drag/drop + JSON) / Chat (5-provider BYOK) / Listen (Web Speech STT)
   - Single live demo embed — same app, embedded inline at /demo OR a "Try it" CTA opening /onboarding

3. **AISP** (`/aisp`) — keep, refresh
   - Crystal Atom side-by-side with human-readable spec
   - Cross-link to `bar181/aisp-open-core`
   - Math-first 512-symbol claim; <2% ambiguity research callout

4. **How It Works** (`/how-it-works`)
   - JSON-driven architecture diagram (4-step pipeline: text/voice → AISP intent → JSON patch → live preview)
   - sql.js + IndexedDB local-only persistence
   - `.heybradley` zip export + sensitive-data strip
   - Link to ADRs index

5. **BYOK Setup** (`/byok` or rolled into How-It-Works)
   - 60-second walkthrough
   - 5 providers listed with key-shape examples
   - Cost cap UI screenshot
   - Privacy disclosure (no analytics; no telemetry; no server-side anything)

6. **Open Core vs Commercial** (`/open-core`) — REPURPOSE existing OpenCore.tsx
   - Keep the "55% problem" thesis
   - Add explicit delineation:
     - **Open core (this repo):** local-storage, BYOK, single-page sites, capstone surface
     - **Commercial (separate repo, post-MVP):** Supabase auth, hosted demo without BYOK, multi-page, complex apps, agentic support
   - Clear "see commercial repo" link (separate repo TBD)

7. **About** (`/about`) — keep, light refresh
   - Bradley + capstone framing already solid
   - Add: "Sealed P15-P19 + P18b at composite 88+; MVP defending May 2026"

8. **Docs** (`/docs`) — REFRESH counts
   - 12 themes, 17 examples, 300 media, 16 section types, 38 ADRs
   - Drop the "P1-P11" phase table or replace with current "P11-P20 sealed; P21+ post-MVP"

9. **How I Built This** (`/how-i-built-this`) — REFRESH
   - 38 ADRs (was 33)
   - P1-P19 + P18b sealed actuals
   - 28K LOC TS/TSX (was claimed 100K)
   - 63 tests across 29 specs
   - Update COCOMO estimate or drop

10. **Research** (`/research`) — keep, verify counts
11. **Footer** — repo + LinkedIn + license + AISP open-core link

### Design direction

- **Same theme tokens as the in-product app** (warm cream + orange accent + DM Sans + JetBrains Mono); current site uses `#1a1a1a` dark theme inconsistently — pick ONE direction
- **One-screen scrolling preferred**; minimize jargon
- **Persona target**: Grandma 70+ in 10 seconds; Framer 80+; Capstone 88+
- **No carousels** — single hero, single message
- **Demo embed** in iframe or "Try it" CTA into the actual app

### Constraints to flag for A5

- BYOK demo must work without account
- Open-core-vs-commercial delineation must be explicit (one paragraph)
- Capstone metadata stays prominent (Harvard ALM May 2026 + AISP research)
- NO Supabase mentions beyond "see commercial repo"
- Test additions: visual regression for rebuilt pages + Grandma persona walk

## §E — Recommendations for the rebuild phase (A5)

| Item | Recommendation |
|---|---|
| Phase number | Insert as **P22 (after P20 cleanup)** in sequential Option A; OR as parallel-track Phase β |
| Effort | 2-4 hours at velocity (10 pages, mostly content refresh + drop carousel) |
| Persona gate | Grandma ≥70 required (binding; this is a demo-quality issue) |
| Test additions | +5 cases (visual regression + 1 walk-through per persona) |
| ADR | New ADR-053 — Public site IA (information architecture) |
| Carousel removal | Welcome.tsx 918 LOC → target 250 LOC |
| Theme alignment | Pick ONE: dark like OpenCore.tsx OR warm-cream like in-product app |

## §F — Files I would have read

- `src/pages/{Welcome,Onboarding,OpenCore,Research,Docs,AISP,HowIBuiltThis,About,Builder,NotFound}.tsx`
- `src/components/MarketingNav.tsx`
- `src/data/themes/index.ts`, `src/data/examples/index.ts`
- `CLAUDE.md ## Project Status` (truth-source for capability counts)

---

**Author:** coordinator (Wave-1 agent timed out; report written directly)
**Output:** `plans/implementation/phase-22/wave-1/A3-website-assessment.md`
**Cross-link:** A1 capability audit + A2 sprint plan review
