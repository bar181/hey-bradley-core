# Sprint H End-of-Sprint — R1 UX+Func Review (Lean)
> **Score:** 88/100
> **Verdict:** PASS (Grandma 84 / Framer 88 / Capstone 96)

## Summary
Sprint H ships a clean reference lifecycle (upload → store → inject → manage) with manifest-only reads keeping the drawer cheap and a privacy footer that earns trust. Discoverability is the dominant Grandma drag — the drawer is "Settings" but the References panel is the most product-shaping affordance in the app, and there is no chat-side surfacing of upload state, no empty-state nudge explaining *why* you'd upload, and the AISP "voice: brand-aware" / `ctx=saas-app` rationales remain inside an EXPERT panel most users will never open.

## MUST FIX
- F1: `BrandContextUpload.tsx:160-163` — Grandma copy gap: "The first 4 KB is injected into the system prompt to steer tone & voice" reads like dev-speak. ADR-067:59 itself says "must be documented in the Settings UI" but the current copy doesn't tell a 50KB-uploader their guide will be silently truncated. Fix: add "Only the first ~1,000 words steer the AI today; the rest is saved for later" alongside the upload affordance, and surface a yellow chip on the manifest row when `totalBytes > 4096`.
- F2: `CodebaseContextUpload.tsx:228-231` — 5MB ZIP cap reject is visible (good) but the message "ZIP must be under 5 MB." is silent about *why* and gives no path forward. Pair with "Try uploading just README + package.json + your config file instead" since `extractFiles` already supports multi-file mode. Same for `MAX_FILE_BYTES` skip on line 121 which is silent (continue with no UX feedback).
- F3: `ReferenceManagement.tsx:111-114` empty state — "No references uploaded yet." is the single biggest Grandma-discoverability hole in the sprint. It does not tell the user *why* they would upload anything. Fix: add one sentence: "Upload a brand voice doc to keep the AI on-tone, or a codebase ZIP to make suggestions match your stack." This is the only place a first-time user will read about what these channels do.
- F4: `chatPipeline.ts:303-320` content-route dead-end shows a generic hint when AISP routes to content. When `brandContext` is uploaded but the route gates the request, the user gets no signal that their brand voice is loaded but unused for *this* turn. Fix: when `aispRoute === 'content'` AND a brand manifest is present, surface "Your brand voice is loaded — try 'change the headline to X' for tone-aware copy" so the upload doesn't feel like a black hole.

## SHOULD FIX
- L1: `ReferenceManagement.tsx:36-38` + `BrandContextUpload.tsx:46-49` — `Math.ceil(byteLen / 4)` is duplicated and is misleading for non-English content (Asian text ≈ bytes/2 → 50% under-estimate). Add a tiny disclaimer in the row tooltip ("approx — varies by language") and DRY the helper into `lib/tokenEstimate.ts`. Low risk, raises Capstone trust.
- L2: `intentClassifier.ts:168-169` — `ctxTrace = ' ctx=saas-app'` lands inside `rationale` as a free-text fragment. The AISPTranslationPanel parses this to render "Used template: X" but `ctx=` is unstructured. Promote to a first-class field on `ClassifiedIntent` (`projectContext?: ProjectType`) so the panel can render a labeled chip ("Project: SaaS / Next.js") instead of asking Framer to read regex output.
- L3: `BrandContextUpload.tsx:22` — accept-attr advertises `.pdf,.docx` MIME types, then rejects them at line 92-98 with a "shipping next phase" string. Either remove from `ACCEPT_ATTR` or render a disabled-explanation chip BEFORE the picker opens. Today the user pays a full file-pick round-trip to learn it's blocked.
- L4: `ReferenceManagement.tsx:78-83` — refresh counter pattern means the upload widget below holds a stale `manifest` after a clear from the summary panel until the drawer remounts. Symmetrically: clearing in the upload widget doesn't refresh the summary above. Both directions of staleness are real. Either lift to a tiny zustand slice or have both components subscribe to a `kvChangeEvent`. ADR-069:89-91 acknowledges this — closing it is a 20-line fix, not a Sprint I deferral.
- L5: `CodebaseContextUpload.tsx:107` — `isInteresting()` skips binary entries silently inside the ZIP loop. A ZIP with no matching patterns hits the line 235 friendly error, but a ZIP with ALL-skipped entries silently succeeds with `summary.text.length === 0` only after `buildSummary`. Earlier exit with a clearer "no readable text files in ZIP" would help.
- L6: `SettingsDrawer.tsx:9` — drawer label is `Settings` but the most powerful surface inside is References. Consider `Settings & References` or a top-level surfacing of "References (0)" in the header so Grandma sees the affordance without scrolling past Theme + Project + LLM panels.

## Acknowledgments
- A1: ADR-069 manifest-only reads (lines 41-45) is genuinely good architecture — O(2) drawer-open cost regardless of upload size. This pattern should be the documented motif for every future kv-chunked surface.
- A2: `chatPipeline.ts:202-224` defensive dynamic import of `codebaseContext` is exemplary — three independent failure modes (module miss, function miss, manifest miss) all collapse to byte-identical P44 behavior. ADR-068's "no new CHECK constraints, no new tables" promise holds.
- A3: `intentAtom.ts:104-110` — `PROJECT_TYPE_TARGET_BIAS` 'unknown' = empty array is the right default — keeps P44 byte-identical and makes the "no codebase = no behavior change" contract auditable in 5 lines of TypeScript.
- A4: `contentAtom.ts:152-183` `validateGeneratedContent` keeps Σ width strictly P31-compatible while still re-asserting V5 when brand is active. Σ-width preservation is the discipline that makes the 4-atom AISP architecture safe to extend.
- A5: `ReferenceManagement.tsx:179-181` privacy footer — "stored locally only and stripped from .heybradley exports" — is exactly the right plain-language copy. Earns trust on first read.
- A6: ADR-067:46-50 trade-offs section is honest about the 4KB injection cap, the no-embedding choice, and the replace-on-upload contract. The "must be documented in the Settings UI" self-assigned MUST is what F1 is collecting on.

## Persona scores (sprint-cumulative)
- Grandma: 84 (P37 baseline 82; +2 for References summary panel and privacy footer; held back by F1/F3 discoverability)
- Framer: 88 (P37 baseline 90; -2 for L2 unstructured `ctx=` rationale and L4 cross-component staleness; rebounds when those ship)
- Capstone: 96 (P37 baseline 99; -3 for sprint-cumulative regression risk in L4 + missing chat-side brand-aware indicator; the 4-atom architecture is otherwise capstone-grade)

## Score
88/100

Composite calc: Grandma 84 × 0.30 + Framer 88 × 0.30 + Capstone 96 × 0.40 = 25.2 + 26.4 + 38.4 = 90.0 raw; -2 sprint-cohesion penalty for L4 dual-direction staleness across the three Wave components = **88/100**. Sprint H target was composite ≥96 — we are 8 points short, primarily because F1+F3+F4 collectively leave Grandma without a story for *what these uploads buy her* on the chat surface itself. Fix-pass on F1-F4 should land us at ~94 composite; closing L1+L2+L4 brings the sprint within target at ~96.
