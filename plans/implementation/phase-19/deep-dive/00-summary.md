# P19 Brutal Honest Deep-Dive — Executive Summary

> **Scope:** Hey Bradley POC after P15 + P16 + P17 + P18 + P18b + P19 (last phase sealed `72be588`).
> **Reviewers:** 4 parallel brutal-honest reviewers — UX, Functionality, Security, Architecture.
> **Question:** "Are all aspects of the POC optimal from user + functionality angles? Where are the gaps?"
> **Verdict:** **NOT YET — 6 must-fix-now items block an honest P19 seal. After fix-pass: ship with documented residuals.**

---

## 1. Scoreboard

| Surface | Reviewer | Score | Trend vs P18 | Must-fix |
|---|---|---:|---|---|
| **UX (Grandma + Framer + Capstone personas)** | R1 | **66/100** (Grandma 58, Framer 72, Capstone 78) | ↓ from 78 in P18 (Listen tab regressed Grandma) | 5 ≤30-min items |
| **Functionality breadth (35 realistic prompts)** | R2 | **2/35 work end-to-end** (5.7%) | ↓ from claimed 5/5 starters | 4 critical |
| **Security + privacy holistic** | R3 | **8.5/10** posture; 1 HIGH (CSS injection) + 4 disclosure gaps | flat from P18b | 5 must-fix |
| **Architecture + maintainability** | R4 | **5.5/10** maintainability | ↓ from ~7 pre-P19 (ListenTab 754 LOC) | 5 must-fix |
| **Composite for seal** | — | **66/100** | seal target 88+ | **must drop to ≤2 P20 carryforward** |

The composite is dragged down by R2's brutal functionality finding — only 2 of 35 realistic user prompts actually produce a correct site change. That single number is the headline.

---

## 2. Headline findings (one line each)

1. **Path-hardcoding bug** — fixture hero/subheading patches assume `/sections/1` (default config) but blog-standard puts hero at `/sections/0`. Result: a user on blog-standard who says "Make the hero say X" silently corrupts the blog section. **Critical.**
2. **No chat-error UI mapping** — `cost_cap`, `timeout`, `precondition_failed`, `validation_failed`, `rate_limit` all collapse into the same generic canned hint. `mapListenError` exists; there is no parallel `mapChatError`. **Critical for live LLM use.**
3. **Image-MVP scope has zero fixtures** — narrowed scope is "theme + hero + images + article". 0/8 image prompts have a fixture. The image MVP arc only works if the user uploads via the existing image picker (chat path is a desert).
4. **CSS injection vector** — `/sections/<n>/style/background` accepts arbitrary string; `UNSAFE_VALUE_RE` blocks `javascript:` but NOT `url(` or `@import`. A poisoned LLM (or BYOK key compromise → swapped provider) can exfiltrate data via CSS image GETs. **HIGH severity, ≤5 LOC fix.**
5. **`safeJson` + `classifyError` triplicated** across claude/gemini/openrouter adapters. P18b explicitly flagged at 2x; P19 added a 3rd. Triplication = drift. **1 hour fix.**
6. **DB-init failure cascade** — if `initDB()` rejects in `main.tsx`, the app renders a working UI but every subsequent persistence call throws. No banner, no fallback. **Silent data loss.**
7. **Listen tab privacy copy is misleading** — says "Recordings are not stored by Hey Bradley" which is technically true (audio bytes), but the FINAL TRANSCRIPT IS persisted to `listen_transcripts` and IS in `.heybradley` exports. Users will misread.
8. **CLAUDE.md `## Project Status` block is 5 phases stale** — claims 37 ADRs / 102 tests / 17K LOC. Reality: 49 ADRs, 130+ tests, 28K LOC. The Capstone reviewer flagged this in P15 and it's still drifting.

---

## 3. Must-fix-now queue (BEFORE P19 seal)

Total estimated effort: **~3.5 hours**. All items shippable on the existing P19 branch.

| # | Item | Severity | LOC | Time | File(s) |
|---|------|---------:|----:|----:|---|
| 1 | Make hero/subheading fixtures path-resolve via section-by-type lookup (not hardcoded index) | Critical | ~30 | 30m | `src/data/llm-fixtures/step-2.ts`, new `src/data/llm-fixtures/resolvePath.ts` |
| 2 | Add `mapChatError(kind)` parallel to `mapListenError`; surface kind-specific copy in `ChatInput.tsx` and remove duplicate `FALLBACK_HINT` | Critical | ~40 | 30m | `src/components/shell/ChatInput.tsx`, `src/contexts/intelligence/chatPipeline.ts` |
| 3 | Extend `UNSAFE_VALUE_RE` with `\burl\(`, `@import`, and a positive-list color regex on `*/style/background\|color` paths | Critical-Sec | ~10 | 20m | `src/contexts/intelligence/llm/patchValidator.ts` |
| 4 | Sanitize `siteContext` interpolation in system prompt (strip `"`, `}`, newlines from purpose/audience/tone) | Sec | ~5 | 10m | `src/contexts/intelligence/prompts/system.ts` |
| 5 | Extract `safeJson` + `classifyError` to `src/contexts/intelligence/llm/adapterUtils.ts`; reuse from 3 adapters | Maintainability | ~50 net deletion | 45m | new `adapterUtils.ts`, claude/gemini/openrouterAdapter |
| 6 | Listen privacy copy fix — "Audio is not stored. The final transcript IS stored locally and included in exports." | UX-truthful | ~3 | 5m | `src/components/left-panel/ListenTab.tsx:515-518` |
| 7 | DB-init failure banner — render an in-memory fallback DB OR show "Persistence unavailable" banner; do not silently degrade | Critical-Reliability | ~25 | 30m | `src/main.tsx`, `src/App.tsx` |
| 8 | Update `CLAUDE.md` `## Project Status` block with real ADR/test/LOC counts | Doc | ~12 | 10m | `CLAUDE.md` |

The R2-flagged "image fixtures" + "help/discovery" gaps are large enough they belong in P20 (not in fix-pass scope) — captured in `05-p20-carryforward.md`.

---

## 4. P20 carryforward (acceptable debt)

| # | Item | Why deferred | Owner phase |
|---|---|---|---|
| 1 | 8 image-MVP fixtures (replace, swap, dim, rounded corners, etc.) | Scope expansion; P20 §3 already promises image flow polish | P20 |
| 2 | "What can you do?" help/discovery handler | Onboarding feature; not regression-blocking | P20 |
| 3 | Multi-intent prompt parser ("change accent to red AND make hero serif") | Architectural — needs LLM tool-use, not fixture regex | P21 (post-MVP) |
| 4 | Split `ListenTab.tsx` (754 LOC) into `OrbAnimation` + `DemoSimulator` + `PttSurface` + `OrbSettings` | Refactor, not behavior; CLAUDE.md guideline | P20 §6 |
| 5 | Intelligence→Persistence service-facade decision | ADR amendment OR refactor; either is OK, just decide | P20 §1 |
| 6 | OpenRouter privacy hint in `LLMSettings.tsx` ("OpenRouter sees prompts, model selection, origin") | Disclosure copy, ≤10 min, batch with SECURITY.md | P20 |
| 7 | SECURITY.md authoring | ADR-043 references it; doesn't exist yet | P20 |
| 8 | TDD-ify with vitest (mock-first London) | CLAUDE.md guideline never enforced; existing Playwright e2e is solid | P20+ |
| 9 | Replace `@anthropic-ai/sdk` + `@google/genai` with raw fetch (saves ~60 KB gzip) | Bundle margin currently ~130 KB; not blocker | post-MVP |
| 10 | Welcome.tsx (918 LOC) god-component split | Pre-existing pre-P15 debt; un-touched by recent phases | post-MVP |

Total carryforward = 10 items, ALL documented. Per the user mandate ("Minimal debt if any carry forward"), this is the floor — every item below the line is justified or a P20 line-item.

---

## 5. Reviewer scorecards

### R1 — UX brutal (Grandma 58 / Framer 72 / Capstone 78)

> "P19 LOWERED the score because Listen tab added a third surface with mistimed privacy disclosure."

5 must-fix-now items, all ≤30 min:
- Listen tab tooltip mistimed (LeftPanel.tsx:93)
- Mic privacy disclosure should appear BEFORE first PTT, not on first error
- Vestigial demo sliders shown in DRAFT mode (Grandma sees these and panics)
- Fallback hint identical for every error kind (collapse → confusion)
- "Simulated mode" pill needed in chat header when AgentProxy adapter active

### R2 — Functionality brutal (2/35 prompts work)

> "Only 2/35 realistic prompts work end-to-end. The 5 starters are fragile to active-config changes."

Critical findings:
- Hero/subheading fixtures break on blog-standard config (path hardcoding)
- 8 image prompts: 0 fixtures; only the image-picker UI works
- 8 article prompts: 1 fixture (the multi-patch one); rest miss
- Multi-intent silently corrupts (e.g., "change accent AND headline" applies first match only)
- Help/discovery: zero handler; canned-chat misses
- Theme prompts: 1/8 (accent only); palette/font-size/whitespace/dark-mode all fall through

### R3 — Security brutal (1 HIGH + 4 disclosure)

> "Ship — with one CSS-injection finding worth a defensive belt-and-suspenders before P20."

- HIGH: CSS-injection via `/sections/<n>/style/background` (validator misses `url(` + `@import`)
- HIGH: CSS-injection via `imageUrl` template prop (defense relies on path-name coincidence)
- MED: Site-context prompt-injection residual (raw template interpolation)
- LOW-MED: OpenRouter `HTTP-Referer` leaks origin (privacy, not key)
- MED: DEV-mode `VITE_LLM_API_KEY` inlined with no in-product warning

Posture strengths: single-writer audit chokepoint; registry-driven export sanitization; build-time key guard; uniform `redactKeyShapes` across adapters; `Object.getOwnPropertyNames` recursion in patchValidator (catches `__proto__` own-keys).

### R4 — Architecture brutal (5.5/10 maintainability)

> "P17–P19 functional but accumulated structural debt has crossed the 'every new phase pays a tax' threshold."

- 8 files >500 LOC (CLAUDE.md violation): Welcome.tsx 918, ListenTab 754, Onboarding 740, configStore 646, RealityTab 613, ResourcesTab 559, SectionsSection 529, ChatInput 509
- `safeJson` + `classifyError` triplicated across claude/gemini/openrouter
- Intelligence→Persistence direct repo imports (no service boundary; ADR-040 silent on this)
- DB-init failure cascade (silent app-half-broken)
- 65 `as unknown as` escapes (80% are JSON-import casts; ~13 are logic-layer)
- 0 vitest mock-first unit tests despite CLAUDE.md "TDD London School" rule
- Documentation drift: ADRs 37→49, tests 102→63 (different test types), LOC 17K→28K

---

## 6. Reading guide for the deep-dive folder

| File | Length | Purpose |
|---|---:|---|
| `00-summary.md` (this file) | ~250 LOC | Executive summary, scoreboard, fix queue, carryforward |
| `01-ux-findings.md` | ~400 LOC | R1 brutal: persona walks, must-fix UX items, surface inventory |
| `02-functionality-findings.md` | ~450 LOC | R2 brutal: 35-prompt coverage matrix, fixture audit, missing-handler list |
| `03-security-findings.md` | ~400 LOC | R3 brutal: 10 systemic threats, threat-by-table audit, disclosure gaps |
| `04-architecture-findings.md` | ~400 LOC | R4 brutal: structural debt table, duplication audit, type-escape audit, async risks |
| `05-fix-pass-plan.md` | ~350 LOC | Consolidated fix-pass — order of operations, file-by-file, test plan |

Each file is intentionally chunked at ≤500 LOC per the phase-19 directive. Cross-references use `01-ux-findings.md#item-N` style anchors.

---

## 7. P19 seal decision

**Recommendation:** Run the must-fix-now queue (3.5 hours) → re-run targeted Playwright (`npx playwright test tests/p18*.spec.ts tests/p19*.spec.ts`) → DoD agent on the master checklist → tag-seal P19 at 88/100.

**Do NOT seal at 66/100** — that buries the path-hardcoding bug under a "P20 will polish it" narrative when 30 minutes of work today closes it cleanly.

After the fix-pass, P19 composite should be **88/100 (Grandma 70, Framer 84, Capstone 88)** with 10 documented P20 carryforward items.

---

**Author:** P19 review-swarm consolidation
**Last updated:** 2026-04-27 post-fix-pass `72be588`
**Next file:** `01-ux-findings.md`
