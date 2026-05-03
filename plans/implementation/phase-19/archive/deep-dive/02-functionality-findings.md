# P19 Deep-Dive — Chunk 2: Functionality Brutal Review (R2)

> **Reviewer:** R2 — Functionality + LLM coverage brutal-honest deep-dive
> **Verdict:** **2/35 realistic prompts work end-to-end (5.7%)**. The 5 starter fixtures are fragile to active-config changes and do not span the narrowed MVP scope.
> **Source:** `/tmp/claude-0/.../tasks/abe487d79423f0a9c.output`
> **Narrowed MVP scope:** theme + hero + images + article (blog section).

---

## 1. Headline numbers

| Bucket | Realistic prompts | Work end-to-end | Coverage |
|---|---:|---:|---:|
| Theme | 8 | 1 (accent color only) | 12.5% |
| Hero | 8 | 1 (heading text replace) | 12.5% |
| Images | 8 | 0 | 0% |
| Article (blog) | 8 | 1 (multi-patch generator) | 12.5% |
| Multi-intent / help / discovery | 3 | 0 | 0% |
| **Total** | **35** | **2** | **5.7%** |

**The two prompts that fully work:**
1. `"Make the hero say 'Welcome to my bakery'"` — IF the active config is `default-config.json` (which has hero at `sections[1]`). FAILS silently on `blog-standard.json` where hero is at `sections[0]`.
2. `"Write a short blog article about gardening"` — works against `blog-standard.json` (article at `sections[1].components[0]`). FAILS silently on `default-config.json`.

Critically, **the two prompts that work each REQUIRE THE OPPOSITE config** to be active. There is no config in which both work.

---

## 2. Prompt-by-prompt coverage matrix

### 2.1 Theme (1/8)

| # | Prompt | Pipeline path | Works? | Failure mode |
|---|---|---|:---:|---|
| T1 | "Change the accent color to forest green" | fixture #2 → `/theme/palette/accentPrimary` ← #14532d | ✅ (only `green/blue/red/orange/purple/black/white`) | Bails to "I don't know the color 'forest'" because regex captures only first word |
| T2 | "Use a softer color palette" | no fixture; canned hint | ❌ | No palette-softening intent handler |
| T3 | "Make it look like Apple's website" | no fixture; canned hint | ❌ | No brand-imitation intent handler (out of MVP scope, document) |
| T4 | "Use a serif font" | partial: fixture #3 expects "Use a serif font for headings" exactly | ❌ | Regex too narrow — "Use a serif font." (no "for headings") falls through |
| T5 | "Make the headings bigger" | no fixture | ❌ | No typography-size intent handler |
| T6 | "Add more whitespace" | no fixture | ❌ | No spacing intent handler |
| T7 | "Use a dark background" | no fixture | ❌ | Could be `/theme/mode` ← `dark` but no fixture exists |
| T8 | "Match my brand colors: #FF5733 and #C70039" | no fixture | ❌ | Hex-color match would need a different regex; not implemented |

**Critical theme finding:** "Change the accent color to forest green" is a real Grandma prompt. Today's regex is `/change\s+the\s+(?:theme|accent)\s+(?:color\s+)?to\s+([a-z]+)\.?\s*$/i` which captures only the first word after "to". The user's phrasing "to forest green" captures `forest`, which is not in the COLOR_HEX map, so the fixture bails. Result: a prompt that LOOKS supported silently goes to the canned fallback.

**Fix:** extend regex to allow multi-word color phrases and add a fuzzy color-name dictionary (light/dark/forest/sky/rose etc. → nearest hex). Defer to P20.

### 2.2 Hero (1/8)

| # | Prompt | Pipeline path | Works? | Failure mode |
|---|---|---|:---:|---|
| H1 | "Make the hero say 'Welcome to my bakery'" | fixture #1 → `/sections/1/components/1/props/text` | ⚠️ partial | **Hardcoded path** — works on default-config; corrupts blog-standard |
| H2 | "Change the hero subheading" | fixture #4 → `/sections/1/components/2/props/text` | ⚠️ partial | Same hardcoding bug |
| H3 | "Make the CTA button red" | no fixture | ❌ | Path `/sections/<n>/components/<m>/props/style` not whitelisted |
| H4 | "Replace the hero image with a sunset" | no fixture | ❌ | Image-MVP fixture missing |
| H5 | "Center the hero text" | no fixture | ❌ | `/sections/<n>/layout/align` not whitelisted |
| H6 | "Make the hero shorter" | no fixture | ❌ | Ambiguous intent (text? padding?); needs LLM |
| H7 | "Add a video to the hero" | no fixture | ❌ | Video out of MVP scope (document) |
| H8 | "Use a different hero layout" | no fixture | ❌ | Variant-switch not in fixture set |

**CRITICAL bug exposed by H1:** The fixture hardcodes `sections[1]` for hero. Active config matters:

```ts
// step-2.ts line 20
const HERO_HEADING_PATH = '/sections/1/components/1/props/text'
```

`blog-standard.json` has:
```json
"sections": [
  { "type": "hero", "id": "hero-01", "order": 0, ... },     // sections[0]
  { "type": "blog", "id": "blog-01", "order": 1, ... },     // sections[1]
  { "type": "footer", "id": "footer-01", "order": 2, ... }  // sections[2]
]
```

So `Make the hero say 'X'` against blog-standard writes the hero text into the BLOG section's `components[1].props.text`, which is the BLOG layout's `style.color` field (different shape entirely). The patchValidator catches the type mismatch only sometimes; in many cases it silently writes a string to a field that the renderer ignores. **Result: the user sees no change AND no error.**

This is the single highest-priority functional bug in the entire P19 deep-dive.

### 2.3 Images (0/8)

| # | Prompt | Pipeline path | Works? | Failure mode |
|---|---|---|:---:|---|
| I1 | "Replace the hero image with a sunset" | no fixture | ❌ | No image-MVP fixture |
| I2 | "Use a darker hero image" | no fixture | ❌ | Subjective; needs image-modifier handler |
| I3 | "Make the article image rounded corners" | no fixture | ❌ | `/sections/<n>/components/<m>/props/style/borderRadius` not whitelisted |
| I4 | "Add a logo to the header" | no fixture | ❌ | No header section in MVP |
| I5 | "Swap the photo for stock food" | no fixture | ❌ | No stock-photo handler (defer post-MVP) |
| I6 | "Make all images black and white" | no fixture | ❌ | Filter-based; defer post-MVP |
| I7 | "Use my own image (uploads)" | UI-only via image picker | ⚠️ | Works VIA UI, NOT chat |
| I8 | "Crop the hero image" | no fixture | ❌ | Crop UI not present; defer |

**Image MVP gap:** The narrowed MVP scope explicitly includes "images" as one of the four pillars (theme + hero + IMAGES + article). 0 of 8 image prompts have a chat fixture. The image flow only works via the existing right-panel image picker — the chat surface is a desert.

**Fix proposal (P20 carryforward, NOT fix-pass scope):** Add 3 image fixtures:
- `Replace the (hero|article|featured) image with <description>` → swap to media-library item by description match
- `Use a darker (hero|article|featured) image` → swap to media-library item with same tag + darker variant
- `Make the (hero|article|featured) image rounded` → patch `borderRadius`

Estimated 4 hours of work + 3 new entries to `IMAGE_PATH_RE` allow-list.

### 2.4 Article / blog (1/8)

| # | Prompt | Pipeline path | Works? | Failure mode |
|---|---|---|:---:|---|
| A1 | "Write a short blog article about <topic>" | fixture #5 → multi-patch | ✅ | But fixed shape (3 patches, fixed structure) |
| A2 | "Make the article title 'X'" | no fixture | ❌ | Should be a single replace; unfixtured |
| A3 | "Write a longer article" | no fixture | ❌ | Length-modifier needs LLM |
| A4 | "Add an excerpt to the article" | no fixture | ❌ | Path `/sections/<n>/components/<m>/props/excerpt` works, but no fixture |
| A5 | "Change the author to Sarah" | no fixture | ❌ | Single replace; unfixtured |
| A6 | "Add tags 'baking, bread'" | no fixture | ❌ | String-replace works; unfixtured |
| A7 | "Set the publish date to 2026-05-01" | no fixture | ❌ | Date-string; unfixtured |
| A8 | "Make the article more conversational" | no fixture | ❌ | Tone-rewrite needs LLM |

**Article gap:** Only the multi-patch generator works. Single-field article edits (title, author, date, tags) are all unfixtured even though the patch path is whitelisted.

**Fix proposal (P20 carryforward):** 4 article fixtures (title, excerpt, author, tags single-field replaces). Estimated 30 min.

### 2.5 Multi-intent + help (0/3)

| # | Prompt | Works? | Failure mode |
|---|---|:---:|---|
| M1 | "Change accent to red and use a serif font" | ❌ | Compound regex wins on first match; silent half-application |
| M2 | "What can you do?" | ❌ | No help/discovery handler; canned hint fires |
| M3 | "Help" / "Hi" / "Hello" | ❌ | No greeting handler |

**Help gap:** "What can you do?" is the most common second-prompt from any new user. There is zero handler. The canned-chat fallback shows "Try one of: …" which is an answer, but feels like a rejection.

**Fix proposal (P20 carryforward):** Add a help/discovery fixture that returns a friendly summary of the 5 starter prompt patterns + the 4 MVP pillars. Estimated 30 min.

---

## 3. Failure-mode taxonomy

Of the 33 prompts that DON'T work end-to-end, the failure modes break down:

| Failure mode | Count | Fix scope |
|---|---:|---|
| No fixture (would work if added) | 17 | P20 — add fixtures |
| Path not whitelisted (validator rejects) | 6 | P20 — extend `patchPaths.ts` |
| Path hardcoded to wrong index (silent corruption) | 2 | **fix-pass NOW** |
| Regex too narrow | 3 | P20 |
| Multi-intent collapse | 2 | post-MVP (LLM tool-use) |
| Out of MVP scope (video, brand-imitation) | 3 | document, defer |

The 2 "silent corruption" items are the must-fix-now-blockers. The 17 "no fixture" items are the P20 expansion target.

---

## 4. Fixture audit (current state)

| Fixture | Path emitted | Active config dependency | Robustness |
|---|---|---|---|
| Hero heading replace | `/sections/1/components/1/props/text` | Hardcoded sections[1] | **FRAGILE** — corrupts on blog-standard |
| Hero subheading replace | `/sections/1/components/2/props/text` | Hardcoded sections[1] | **FRAGILE** — same as above |
| Accent color | `/theme/palette/accentPrimary` | (default-config has this) | **FRAGILE** — `/theme/colors/accent` exists in narrowed schemas; fixture only patches one |
| Heading font serif | `/theme/typography/headingFamily` | universal | OK |
| Blog article generator | `/sections/1/components/0/props/{title\|excerpt\|author}` | Hardcoded sections[1] | **FRAGILE** — corrupts on default-config |

**3 of 5 fixtures are fragile to active-config changes.** This is the architectural smell that R2 flagged. The fix is a `resolveSectionPath(config, sectionType, componentType)` helper that walks the config tree to find the right index.

### 4.1 Proposed `resolvePath.ts` helper

```ts
// src/data/llm-fixtures/resolvePath.ts
import type { MasterConfig } from '@/types/config'

export function findSectionByType(config: MasterConfig, type: string): number {
  return config.sections.findIndex(s => s.type === type && s.enabled !== false)
}

export function findComponentByType(
  config: MasterConfig,
  sectionIdx: number,
  componentType: string,
): number {
  return config.sections[sectionIdx]?.components?.findIndex(c => c.type === componentType) ?? -1
}

export function heroHeadingPath(config: MasterConfig): string | null {
  const s = findSectionByType(config, 'hero')
  if (s < 0) return null
  const c = findComponentByType(config, s, 'heading')
  if (c < 0) return null
  return `/sections/${s}/components/${c}/props/text`
}

export function blogArticlePath(config: MasterConfig, field: 'title' | 'excerpt' | 'author'): string | null {
  const s = findSectionByType(config, 'blog')
  if (s < 0) return null
  const c = findComponentByType(config, s, 'blog-article')
  if (c < 0) return null
  return `/sections/${s}/components/${c}/props/${field}`
}
```

Each fixture envelope reads `useConfigStore.getState().config` and resolves at call time. Empty-patch envelope with friendly summary returned when the requested section/component doesn't exist.

This is the smallest viable fix. **Estimated 30 min total** (helper + 3 fixture call-site updates + 1 unit test).

---

## 5. Error-kind UI mapping audit

`mapListenError` exists at `src/components/left-panel/ListenTab.tsx:19-36` with 6 mapped kinds (unsupported / permission_denied / audio_capture / network / no_speech / unknown). Listen mode shows kind-specific copy.

`ChatInput.tsx` has **zero kind-mapped errors**. All chat failures collapse to:

```ts
// src/components/shell/ChatInput.tsx:236-243
const FALLBACK_HINT = `I'm running on simulated responses. Try one of:
• "Make the hero say 'Welcome to my site'"
• "Change the accent color to blue"
• ...`
```

This collapses 5+ distinct error states into one wall of text:

| Error kind | Source | Current chat copy |
|---|---|---|
| `cost_cap` | `auditedComplete.ts:109` | Generic fallback |
| `timeout` | `auditedComplete.ts` Promise.race | Generic fallback |
| `validation_failed` | `validatePatches` rejects | Generic fallback |
| `precondition_failed` | `LLMPipelineError` from `runLLMPipeline` | Generic fallback |
| `rate_limit` | adapter classifies 429 | Generic fallback |
| (anything else) | global try/catch | Generic fallback |

**Fix proposal (FIX-PASS NOW):** Add `mapChatError(kind)` parallel to `mapListenError`. Surface kind-specific copy. Examples:

| Kind | Copy |
|---|---|
| `cost_cap` | "I've hit today's spending cap. Adjust your cap in Settings → LLM, or try again tomorrow." |
| `timeout` | "Request timed out. Network issue? Try again — your prompt is unchanged." |
| `validation_failed` | "I tried to edit the site but the change wasn't safe to apply. Try a smaller, more specific request." |
| `precondition_failed` | "Something's not configured (missing API key?). Check Settings → LLM." |
| `rate_limit` | "Provider is rate-limiting me. Wait a few seconds and try again." |
| `unknown` | (current FALLBACK_HINT, prefixed conversationally) |

Estimated 30 min including test.

---

## 6. canned-chat handler audit

`src/lib/cannedChat.ts` (read in R2 brutal) handles:

| Pattern | Action |
|---|---|
| `add a section` | Inserts a starter section in DRAFT mode |
| `remove section <n>` | Removes by index |
| `change theme to <name>` | Switches preset |
| (anything else) | Falls through to generic hint |

Coverage is thin and **operates BEFORE the fixture pipeline** for some prefixes. Risk: a future fixture for "change theme" would be shadowed by the canned handler. **Defer to P20** — document the intent priority order in chatPipeline.

---

## 7. End-to-end test plan for the fix-pass

After the path-resolution fix:

```bash
# Targeted Playwright (already exist)
npx playwright test tests/p18-step3.spec.ts        # 5 starters
npx playwright test tests/p19-step3.spec.ts        # PTT pipeline
npx playwright test tests/p19-step3-edges.spec.ts  # PTT edges
npx playwright test tests/p18b-agent-proxy.spec.ts # mock adapter

# New (must add in fix-pass)
tests/p19-fix-hero-on-blog-standard.spec.ts        # 1 spec — hero on blog-standard (R2 critical)
tests/p19-fix-article-on-default.spec.ts           # 1 spec — article on default (R2 critical)
tests/p19-fix-mapchaterror.spec.ts                 # 1 spec — mapChatError 6 kinds × 1 message
```

3 new spec files; ~50 new test LOC; no new fixtures (use existing path-resolution helpers).

---

## 8. Cross-reference

- See `01-ux-findings.md` §3 for how the path-hardcoding bug shows up in Grandma's walk (T+1:30 hero update succeeds; T+2:00 the OPPOSITE prompt should also succeed but doesn't).
- See `03-security-findings.md` §1 for the CSS-injection vector that path-resolution does NOT address (separate severity track).
- See `04-architecture-findings.md` §"Duplication count" for FALLBACK_HINT triplication (related to mapChatError fix).

---

**Author:** R2 brutal review consolidation
**Cross-link:** `00-summary.md` §3 (must-fix-now items 1 + 2)
**Next file:** `03-security-findings.md`
