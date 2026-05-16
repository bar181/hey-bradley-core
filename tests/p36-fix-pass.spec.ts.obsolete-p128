/**
 * P36+ fix-pass — addresses must-fix items from the brutal-honest review.
 *
 * Pure-unit (source-level + module-import). Verifies:
 *   - R1 F1: ChatInput subscribes to uiStore.pendingChatPrefill (not mount-only)
 *   - R1 F2: handleListenApprove guarded by approveInFlightRef (double-click safe)
 *   - R1 F3: PTT button disabled while review/clarification card is open
 *   - R1 L1: Enter approves / Escape cancels in ListenReviewCard
 *   - R1 L2: friendlier copy in listenActionPreview generic fallback
 *   - R1 L4: text-white/45 → /65 contrast bump
 *
 * Cross-ref: phase-36/deep-dive/01-ux-func-review.md, 02-sec-arch-review.md
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const CHAT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const TAB = join(process.cwd(), 'src/components/left-panel/ListenTab.tsx')
const CARD = join(process.cwd(), 'src/components/left-panel/listen/ListenReviewCard.tsx')
const PREVIEW = join(process.cwd(), 'src/components/left-panel/listen/listenActionPreview.ts')
// P37 R2 S3 — post-split: F2 + F3 patterns now live in useListenPipeline + ListenControls.
const PIPELINE = join(process.cwd(), 'src/components/left-panel/listen/useListenPipeline.ts')
const CONTROLS = join(process.cwd(), 'src/components/left-panel/listen/ListenControls.tsx')

test.describe('R1 F1 — ChatInput subscribes to pendingChatPrefill (not mount-only)', () => {
  test('useUIStore selector reads pendingChatPrefill', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toMatch(/useUIStore\(\(s\)\s*=>\s*s\.pendingChatPrefill\)/)
  })

  test('useEffect depends on pendingPrefill (re-fires on store change)', () => {
    const src = readFileSync(CHAT, 'utf8')
    // useEffect dep array contains pendingPrefill, not bare []
    expect(src).toMatch(/\}, \[pendingPrefill\]\)/)
  })

  test('Consumer clears the field after consume (single-shot semantics)', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toMatch(/setPendingChatPrefill\(null\)/)
  })
})

test.describe('R1 F2 — handleListenApprove double-click guard', () => {
  test('approveInFlightRef declared + checked on entry', () => {
    // Post-split: pipeline lifecycle lives in useListenPipeline.
    const src = readFileSync(PIPELINE, 'utf8')
    expect(src).toContain('approveInFlightRef')
    expect(src).toMatch(/if \(!pttReview \|\| approveInFlightRef\.current\) return/)
  })

  test('approveInFlightRef toggled in try/finally (releases on error)', () => {
    const src = readFileSync(PIPELINE, 'utf8')
    expect(src).toMatch(/approveInFlightRef\.current\s*=\s*true/)
    expect(src).toMatch(/finally\s*\{[\s\S]*?approveInFlightRef\.current\s*=\s*false/)
  })
})

test.describe('R1 F3 — PTT button disabled during review/clarification', () => {
  test('disabled prop checks pttReview + pttClarification', () => {
    // Post-split: PTT button JSX lives in ListenControls.
    const src = readFileSync(CONTROLS, 'utf8')
    expect(src).toMatch(/disabled=\{pttBusy \|\| pttReview !== null \|\| pttClarification !== null\}/)
  })

  test('Button label reflects review/clarification state', () => {
    const src = readFileSync(CONTROLS, 'utf8')
    expect(src).toContain('Review first ↑')
    expect(src).toContain('Clarify ↑')
  })

  test('aria-label communicates the gate to SR users', () => {
    const src = readFileSync(CONTROLS, 'utf8')
    expect(src).toContain("'Resolve review first'")
  })
})

test.describe('R1 L1 — keyboard shortcuts on ListenReviewCard', () => {
  test('Enter triggers onApprove', () => {
    const src = readFileSync(CARD, 'utf8')
    expect(src).toMatch(/if \(e\.key === 'Enter'\)/)
    expect(src).toMatch(/onApprove\(\)/)
  })

  test('Escape triggers onCancel', () => {
    const src = readFileSync(CARD, 'utf8')
    expect(src).toMatch(/else if \(e\.key === 'Escape'\)/)
    expect(src).toMatch(/onCancel\(\)/)
  })

  test('Approve button auto-focuses on mount (hands-free Enter)', () => {
    const src = readFileSync(CARD, 'utf8')
    expect(src).toContain('approveBtnRef')
    expect(src).toMatch(/approveBtnRef\.current\?\.focus\(\)/)
  })
})

test.describe('R1 L2 — friendlier fallback copy in listenActionPreview', () => {
  test('Generic fallback uses Grandma-friendly language', () => {
    const src = readFileSync(PREVIEW, 'utf8')
    expect(src).toContain("I'll figure it out")
    // Old jargon copy should be gone.
    expect(src).not.toContain('Run the chat pipeline on this transcript')
  })
})

test.describe('R1 L4 — review card text contrast bumped (WCAG AA)', () => {
  test('ListenReviewCard no longer uses text-white/45', () => {
    const src = readFileSync(CARD, 'utf8')
    expect(src).not.toContain('text-white/45')
  })

  test('ListenReviewCard uses text-white/65 or higher for label rows', () => {
    const src = readFileSync(CARD, 'utf8')
    // Verify the label classes are upgraded
    expect(src).toContain('text-white/65')
  })
})
