# P15-P22 Deep Review — Chunk 3: Fix-Pass Plan

> File-by-file decomposition for MF1-MF9 (consolidated from R1+R2+R3+R4).
> Implementation order: security-critical → UX → code-quality → docs.
> ≤600 LOC.

## Implementation order

1. **MF1** SECURITY.md (HIGH; closes S1, F1, CU1; 30m)
2. **MF2** ErrorBoundary console gate (HIGH; closes A1; 2m)
3. **MF3** AISPDualView render-order (MED; closes F2, FU2, CU2; 5m)
4. **MF4** OpenCoreVsCommercial render-order (MED; closes F3; 5m)
5. **MF5** phase-21/MEMORY.md flip (MED; closes A3; 5m)
6. **MF6** STATE.md §2 P21 row dedup + CLAUDE.md count refresh (MED; closes A2 + A6; 10m)
7. **MF7** ADR-053 §"Theme alignment" amendment (MED; closes A4; 5m)
8. **MF8** BYOK provider URLs clickable (LOW; closes S2, FU1; 5m)
9. **MF9** About.tsx "Sealed P15-P22" callout (LOW; closes U2, GU1; 5m)

**Total: ~70m.**

## Per-item file changes

### MF1 — SECURITY.md (NEW at repo root)

**File:** `SECURITY.md` (~200 LOC)

Sections per ADR-043 + P20 §3.4 outline:
1. Trust boundary (frontend-only SPA; no backend; same-origin trust model)
2. BYOK contract (where the key lives; what we send; what we never store)
3. Per-provider data flow (Claude / Gemini / OpenRouter / Simulated / AgentProxy)
4. What leaves the browser (LLM calls; STT vendor for voice)
5. What stays in the browser (config / chat / transcripts / llm_logs / BYOK key)
6. What .heybradley exports include + what's stripped
7. Multi-tab same-origin visibility
8. Reporting (GitHub issues with `security` label)

Cross-references: ADR-029 (no backend), ADR-040 (export sanitization), ADR-043 (BYOK), ADR-046 (provider matrix), ADR-047 (logging), ADR-048 (STT).

### MF2 — ErrorBoundary console gate

**File:** `src/components/ui/ErrorBoundary.tsx` line 24

Before:
```ts
console.error('Section render error:', error, errorInfo)
```

After:
```ts
if (import.meta.env.DEV) console.error('Section render error:', error, errorInfo)
```

### MF3 — AISPDualView render-order

**File:** `src/pages/AISP.tsx` (post P22 fix-pass-1)

The `<AISPDualView />` is currently rendered AFTER `</footer>` and BEFORE `</main>`. Move it BEFORE the footer block so it's part of the main content flow, not appended below.

Find:
```tsx
        </div>
      </footer>
      <AISPDualView />
    </main>
```

Replace with:
```tsx
      <AISPDualView />
        </div>
      </footer>
    </main>
```

(Move the block; verify the footer's parent wrapper is intact.)

### MF4 — OpenCoreVsCommercial render-order

**File:** `src/pages/OpenCore.tsx`

Same fix pattern as MF3.

### MF5 — phase-21/MEMORY.md flip

**File:** `plans/implementation/phase-21/MEMORY.md`

Replace the YAML state block:
```yaml
phase: 21
title: Sprint B Phase 1 — Simple Chat
status: PREFLIGHT-SCAFFOLDED
```

With:
```yaml
phase: 21
title: Cleanup + ADR/DDD gap-fill
status: SEALED
seal_commit: 1129cea
composite: 95
deliverables_completed:
  - 5_sealed_phase_folders_archived (P15-P19 _archive/)
  - 5_adr_drift_amendments (040/043/044/047/048)
  - 4_adr_stubs (050/051/052/053)
  - adr_054_ddd_bounded_contexts_full
  - state_md_runway_re-organized
  - claude_md_phase_roadmap_re-organized
  - standard_phase_process_documented
note: "Phase 21 was Cleanup, NOT Sprint B Phase 1 (that was a stale draft). Sprint B starts at P23 per current sequencing."
```

Update DECISION LOG section to reflect post-Wave-2 ratification.

### MF6 — STATE.md §2 P21 row dedup + CLAUDE.md counts

**File:** `plans/implementation/mvp-plan/STATE.md` §2

Remove the row:
```
| **P21** *(NEW — Cleanup)* | Cleanup + ADR/DDD gap-fill (archive sealed phases + 5 ADR amendments + 4 stubs + ADR-054 DDD + doc accuracy pass) | `phase-21/preflight/00-summary.md` + `phase-22/A6-cleanup-plan.md` | 1-2h | 1-2h | $0 |
```

(P21 is sealed; row already in §1 Done. §2 is for upcoming work.)

Also remove the "P22 (NEW — Website rebuild)" row from §2 (P22 sealed at b024d1c → 49a109e).

**File:** `CLAUDE.md ## Project Status` block

Update counts:
- ADRs: 38 → 44 (highest 054)
- Source files: 227 → 230
- LOC: ~28,400 → ~29K (light touch; precise count not required)

### MF7 — ADR-053 amendment

**File:** `docs/adr/ADR-053-public-site-ia.md` §"Theme alignment"

Drop:
> Marketing pages adopt warm-cream tokens matching the in-product app... OpenCore.tsx + HowIBuiltThis.tsx retain dark theme for the "55% problem" thesis hero and the build-story trajectory respectively (intentional dark-island exceptions).

Replace with:
> Marketing pages adopt warm-cream tokens matching the in-product app: `#faf8f5` bg, `#f1ece4` surface, `#e8772e` accent, `#2d1f12` text. **Universal across all marketing pages post-P22 fix-pass-1 F2.** The earlier "intentional dark island" caveat for OpenCore + HowIBuiltThis is withdrawn — they now match the warm-cream baseline.

Also update the §"Status as of P22 seal" appendix at bottom to reflect this change.

### MF8 — BYOK provider URLs clickable

**File:** `src/pages/BYOK.tsx`

Change PROVIDERS const so `where` field is a `ReactNode` (or use `whereUrl` string):

Option A — split into label + URL:
```tsx
const PROVIDERS = [
  { name: 'Claude (Anthropic)', keyShape: 'sk-ant-...', whereLabel: 'console.anthropic.com/settings/keys', whereUrl: 'https://console.anthropic.com/settings/keys', cost: '~$0.002 per chat (Haiku)', note: '...' },
  ...
]
```

In JSX render `<a href={p.whereUrl} target="_blank" rel="noopener noreferrer" className="text-[#e8772e] underline">{p.whereLabel}</a>`.

Apply to all 5 providers (Simulated + AgentProxy mock have no URL — keep as plain text).

### MF9 — About.tsx "Sealed P15-P22" callout

**File:** `src/pages/About.tsx`

Add a section after "The Insight" (or before "The Capstone"):

```tsx
<section className="py-12 max-w-3xl mx-auto px-6">
  <div className="bg-white border border-[#e8772e]/20 rounded-2xl p-6">
    <p className="text-xs uppercase tracking-[0.2em] text-[#e8772e] mb-2 font-medium">As of P22 (April 2026)</p>
    <p className="text-[#6b5e4f] leading-relaxed">
      Hey Bradley has sealed 22 phases through P22 — POC foundation, local
      persistence, real LLM chat across 5 providers, voice mode, public-website
      rebuild — at composite 81+ across Grandma / Framer / Capstone personas.
      Defending May 2026 at Harvard.
    </p>
  </div>
</section>
```

## Post-fix verification

| Check | Expected |
|---|---|
| `tsc --noEmit` | exit 0 |
| `npm run build` | green; bundle delta ≤ +5 KB gzip |
| `bash scripts/check-secrets.sh` | "no key-shape patterns found" |
| All P15-P22 source intact | no behavioral regressions |
| 9 must-fix items closed | confirmed via `git diff --stat` |

## Composite forecast

Pre-fix: **84/100**
Post-fix: **89/100** (+5)

| Persona | Pre | Post | Δ |
|---|---:|---:|---:|
| Grandma | 73 | 75 | +2 (About callout) |
| Framer | 84 | 86 | +2 (BYOK URLs + render-order) |
| Capstone | 86 | 90 | +4 (SECURITY.md visible + AISP placement) |
| **Composite** | **84** | **89** | **+5** |

## Pass-2 trigger conditions

Run pass-2 IF after fix-pass:
- Any persona regresses
- Build red OR tsc red
- New HIGH-severity surfaces
- Any of MF1-MF7 fails to land cleanly

Otherwise: pass-1 → final-seal.
