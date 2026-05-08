/**
 * P37 Wave 1 (A2) — Carryforward fixes from P36 brutal-honest review.
 *
 * Pure-unit (source-level + module-import). Verifies:
 *   - R1 L3: ChatInput surfaces a user-visible message when generateAssumptionsLLM
 *            returns 0 assumptions (no more silent fallthrough)
 *   - R2 S1: uiStore.setPendingChatPrefill clamps to MAX_PREFILL_LENGTH (1024),
 *            rejects BYOK shapes, rejects non-string types defensively
 *   - R2 S4: pendingMessage envelope (target='chat', text) is the source of
 *            truth; pendingChatPrefill is a derived selector for backward
 *            compat with existing ChatInput consumer
 *   - R2 S5: ADR-065 acknowledges EXPERT trace pane stays chat-only
 *
 * Cross-ref: phase-36/deep-dive/01-ux-func-review.md (R1 L3),
 *            phase-36/deep-dive/02-sec-arch-review.md (R2 S1, S4, S5)
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const CHAT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const STORE = join(process.cwd(), 'src/store/uiStore.ts')
const ADR = join(process.cwd(), 'docs/adr/ADR-065-listen-aisp-unification.md')

test.describe('R1 L3 — ChatInput surfaces a message when LLM returns 0 assumptions', () => {
  test('source contains the friendly fallthrough message string', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toContain("Hmm — I'm a little unsure")
    expect(src).toContain('/browse')
  })

  test('source cites R1 L3 in a 1-line fix comment', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toMatch(/R1 L3/)
  })

  test('fallthrough sits inside the shouldRequestAssumptions branch (after the > 0 happy-path)', () => {
    const src = readFileSync(CHAT, 'utf8')
    // The implementation pattern: outer `if (shouldRequestAssumptions)` block
    // contains an `if (llmResult.assumptions.length > 0)` happy-path early-return
    // followed by an unconditional R1 L3 fallthrough message. We assert the
    // canonical structure rather than a literal `=== 0` predicate.
    expect(src).toMatch(/shouldRequestAssumptions/)
    expect(src).toMatch(/llmResult\.assumptions\.length\s*>\s*0/)
    const happyIdx = src.indexOf('llmResult.assumptions.length > 0')
    const fallthroughIdx = src.indexOf("Hmm — I'm a little unsure")
    expect(fallthroughIdx).toBeGreaterThan(happyIdx)
  })
})

test.describe('R2 S1 — uiStore prefill envelope hardening', () => {
  test('MAX_PREFILL_LENGTH constant declared and exported', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toMatch(/MAX_PREFILL_LENGTH\s*=\s*1024/)
    expect(src).toContain('UI_STORE_LIMITS')
  })

  test('BYOK_KEY_SHAPES regex set mirrors assumptionStore.ts', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toContain('BYOK_KEY_SHAPES')
    // Mirror the 5 shapes from assumptionStore.ts
    expect(src).toMatch(/sk-\[a-zA-Z0-9_-\]\{20,\}/)
    expect(src).toMatch(/AIza\[0-9A-Za-z_-\]\{35\}/)
    expect(src).toMatch(/ghp_\[A-Za-z0-9\]\{36\}/)
  })

  test('sanitizePendingText clamps + rejects non-string + rejects secret shapes', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toMatch(/function sanitizePendingText/)
    expect(src).toMatch(/typeof text !== 'string'/)
    expect(src).toMatch(/looksLikeSecret/)
    expect(src).toMatch(/text\.slice\(0, MAX_PREFILL_LENGTH\)/)
  })

  test('setPendingChatPrefill is a thin wrapper that delegates to setPendingMessage', () => {
    const src = readFileSync(STORE, 'utf8')
    // It must call setPendingMessage with target: 'chat'
    expect(src).toMatch(/setPendingMessage\(\{\s*target:\s*'chat',\s*text\s*\}\)/)
  })
})

test.describe('R2 S4 — pendingMessage directed-message envelope', () => {
  test('PendingMessage type declared with target discriminator', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toMatch(/export type PendingMessage\s*=\s*\{\s*target:\s*'chat';\s*text:\s*string\s*\}/)
  })

  test('UIStore declares pendingMessage + pendingChatPrefill fields', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toMatch(/pendingMessage:\s*PendingMessage \| null/)
    expect(src).toMatch(/pendingChatPrefill:\s*string \| null/)
  })

  test('setPendingMessage sanitizes via sanitizePendingText + mirrors to pendingChatPrefill', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toMatch(/setPendingMessage:\s*\(msg\)/)
    expect(src).toMatch(/sanitizePendingText\(msg\.text\)/)
    expect(src).toMatch(/pendingChatPrefill:\s*next\.target === 'chat' \? next\.text : null/)
  })

  test('Setting null clears both pendingMessage and pendingChatPrefill', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toMatch(/if \(msg === null\)[\s\S]*?set\(\{\s*pendingMessage:\s*null,\s*pendingChatPrefill:\s*null\s*\}\)/)
  })

  test('Existing ChatInput selector keeps working (backward-compat)', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toMatch(/useUIStore\(\(s\)\s*=>\s*s\.pendingChatPrefill\)/)
  })
})

test.describe('R2 S5 — ADR-065 doc claim correction', () => {
  test('ADR-065 acknowledges EXPERT trace pane stays chat-only', () => {
    const adr = readFileSync(ADR, 'utf8')
    expect(adr).toContain('EXPERT pipeline trace pane')
    expect(adr).toMatch(/chat-only at P36 seal|chat-only at P36 seal\.|chat-only/i)
    expect(adr).toContain('R2 S5')
  })

  test('ADR-065 retracts overstated "every AISP UX surface" claim', () => {
    const adr = readFileSync(ADR, 'utf8')
    // The corrected language uses "most" or explicitly retracts the original claim
    expect(adr).toMatch(/share \*\*most\*\* AISP UX surfaces|share most AISP UX surfaces|original ADR claim that voice \+ chat share "every"/i)
  })
})
