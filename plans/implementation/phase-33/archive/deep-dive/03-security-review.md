# Sprint D — R3 Security Review
> **Score:** 82/100
> **Verdict:** PASS (with must-fix items tracked for next phase)

## Summary
Sprint D's data plane is well-parameterized and the CONTENT_ATOM Γ-rule scan is now reasonably tight after fix-pass-2. The real risk surface is the import path: `user_templates` is intentionally NOT in `SENSITIVE_TABLE_OPS`, the C14 sentinel cannot reach a table whose columns are JSON blobs, and `payload_json` is unbounded user-controlled JSON that downstream consumers (registry merge, browse UI) trust by id.

## MUST FIX

- **F1: `exportImport.ts:64-71` + `migrations/003-user-templates.sql:1-25`** — `user_templates` is opt-in shipped in `.heybradley` bundles, but `importBundle()` (line 155-184) replaces the whole DB and re-runs migrations with NO validation of user-supplied rows. A malicious bundle can ship `user_templates` rows with arbitrary `id`, `payload_json`, and `examples_json`. Combined with F2 this becomes a template-poisoning import attack. **Fix:** in `importBundle()` after `runMigrations`, either (a) truncate `user_templates` like the example_prompts re-seed (line 178-182) — most defensive, or (b) validate each imported row's `payload_json` against a Zod schema before trusting it. Recommend (a) plus an explicit user-prompt before merging foreign templates.

- **F2: `userTemplates.ts:37-62` + `registry.ts:203-208`** — `createUserTemplate` accepts any `id` string with no character allowlist or length cap. An imported row can use id `'change-headline'` (collides with registry), `'__proto__'`, `'constructor'`, or 10MB of unicode. Fix-pass-2 says registry-id wins in `listAllForBrowse`, but any code path that walks `user_templates` directly (e.g. `getUserTemplate('change-headline')`, future template runners that lookup by id-then-fallback) is poisoned. **Fix:** add `if (!/^[a-z0-9-]{1,64}$/.test(input.id)) throw new Error(...)` and reject reserved ids matching registry entries via a `RESERVED_IDS` set check.

- **F3: `userTemplates.ts:51,124-125`** — `payload_json` and `examples_json` are unbounded `TEXT NOT NULL` (migration 003 line 21-22). No size cap on `JSON.stringify(input.payload)` before insert, no row-count cap on `user_templates`. A malicious import or a bug-loop in `createTemplateFromConversation` can fill IDB to quota (browser hard-limits ~50% of disk). DoS + corrupt-on-next-write. **Fix:** clamp `JSON.stringify(input.payload).length <= 64_000` and `listUserTemplates().length < 1_000` pre-insert; throw with a clean error.

## SHOULD FIX

- **L1: `tests/p23-sentinel-table-ops.spec.ts:33-56`** — The C14 sentinel parses individual SQL columns and matches them against `SENSITIVE_COL_RE` (`prompt|key|secret|password|token|auth`). It will NEVER catch a future migration that adds e.g. `system_prompt_json TEXT` to `user_templates` because the column NAME contains "prompt" — wait, actually it would. BUT: the column name `payload_json` contains zero sensitive substrings yet stores arbitrary JSON that may include prompts/keys uploaded by the user. The sentinel is structurally blind to JSON-blob columns. **Fix:** add a second sentinel rule — any TEXT column matching `/(_json|_blob|payload|content|body)$/i` MUST be in SENSITIVE_TABLE_OPS unless explicitly whitelisted. Today `user_templates.payload_json` would whitelist; that's the policy decision, but make it explicit.

- **L2: `contentAtom.ts:105`** — The URI scheme regex `/(?:[a-z]+:\/\/|mailto:|tel:|data:|javascript:|file:|ftp:)/i` is good for ASCII but will pass unicode-look-alike schemes (`ｊａｖａｓｃｒｉｐｔ:`, fullwidth). `isCleanContent` is documented as "not a security filter" (line 95-96) so this is informational — but a rendered headline COULD become an XSS vector if downstream rendering ever drops dangerouslySetInnerHTML. **Fix:** NFKC-normalize text once before the regex pass, or document that ADR-045 patch validator is the sole XSS authority.

- **L3: `contentGenerator.ts:39`** — `QUOTED_PHRASE_RE = /["'""]([^"'""]{1,400})["'""]/`. The negated character class lists 4 quote characters but the character class `[^"'""]` repeats `"` twice; the curly-quote U+201C/U+201D are likely intended but will appear identical in source. A user passing `«Foo»` (guillemets) won't match. Bigger issue: backslash-escaped quotes (`\"foo\"`) do match because the regex doesn't honor escapes. Combined with F2, an imported template's `examples_json` could carry an example string that, when re-fed via the user-prompt path, extracts attacker-chosen copy. Low impact post fix-pass-2 since `isCleanContent` runs after extraction. **Fix:** add a no-control-character check (`/[\x00-\x1F]/`) to `isCleanContent` for completeness.

- **L4: `twoStepPipeline.ts:84-102`** — `resolveTargetPath(sectionType, config)` takes `intent.target.type` directly. Path is built via `findSectionByType` (numeric idx) then `headingIdx` (numeric); both are array offsets so prototype-key strings like `__proto__` cannot escape into JSON-Pointer. BUT: there's no allowlist on `sectionType` itself — `findSectionByType` does string equality on `section.type`, so an attacker-crafted intent with `sectionType: "../../etc/passwd"` returns `-1` (safe) but with `sectionType: ""` could match a malformed config row whose type is empty. **Fix:** add `if (!/^[a-z][a-z0-9-]{0,32}$/.test(sectionType)) return null` at the top of `resolveTargetPath` for defense-in-depth.

- **L5: `userTemplates.ts:79`** — `ORDER BY id ASC` is fine, but `listUserTemplates` returns ALL rows with no LIMIT. With F3 unbounded, a malicious import yields O(n) memory blowup at every browse. **Fix:** add `LIMIT 500` and surface a "too many user templates — clean up" error in the UI.

## Acknowledgments

- **A1: `userTemplates.ts:41-54, 79-83, 91-93, 102-105`** — All 5 functions correctly use `?` placeholders + `bind()`/`run()` arrays. No string-concatenation SQL. Clean.
- **A2: `contentAtom.ts:102-111`** — `isCleanContent` post fix-pass-2 covers the seven documented vectors (code blocks, headings, schemed URIs, mentions/hashtags, multi-paragraph, JSON-leading, JSON-embedded). Tight regex set.
- **A3: `contentGenerator.ts:84,98-102,108`** — Defense-in-depth ordering: empty-text reject → length cap → clean-scan → confidence threshold. Each gate is independent.
- **A4: `twoStepPipeline.ts:91`** — Falls through to `null` (caller chains down) when `resolveTargetPath` fails — no exception leak, no half-applied patch.
- **A5: `exportImport.ts:178-182`** — `example_prompts` re-seed pattern from P28 C15 is a strong precedent; F1's recommendation is to apply the same pattern to `user_templates` for symmetry.
- **A6: Privacy:** No code path in the 5 Sprint D files writes `user_templates` content into `llm_logs`. The 2-step pipeline logs at the chat-message layer (P18); generated text is included in `summary` (line 95) which is a UX field, not a privacy vector. Confirmed clean.
- **A7: Migration 003 lines 19-20** — `CHECK (category IN ...)` and `CHECK (kind IN ...)` are enforced at the SQL layer; even if the TS validator is bypassed, the DB rejects bad enums. Belt-and-suspenders done right.

## Score
82/100 — rationale: The Sprint D code itself is clean (parameterized SQL, layered Γ-rules, kind-dispatch typing, FK-deferral consistent with ADR-040b). The 18-point deduction is split: -10 for the F1+F2 import-poisoning chain (real attack, real fix is small), -5 for F3 unbounded TEXT columns (DoS surface), -3 for the sentinel structural blind-spot (L1) which is a process gap not a code bug. PASS because none of the must-fix items are exploitable in the default zero-import flow; user must explicitly accept a `.heybradley` file. With F1-F3 fixed in next phase's first commit, posture moves to ~92/100.
