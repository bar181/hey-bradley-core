/**
 * Sprint F end-of-sprint (P38) fix-pass — addresses must-fix items from
 * the 4-reviewer cumulative review (R1 UX 92 / R2 Func 86 / R3 Sec 92 /
 * R4 Arch 91).
 *
 * Pure-unit (source-level + module-import). Verifies:
 *   - R2 F1: importBundle DROPs example_prompts before re-seed (handles
 *            old-bundle 6-category CHECK constraint)
 *   - R2 F2 / R4 F1: dispatchCommand shared helper consolidates the
 *            ChatInput + useListenPipeline switches; voice now handles
 *            template-help correctly
 *   - R1 F1: ListenControls renders a voice command discovery hint
 *   - R4 L1: ADR-066 cross-references ADR-045 / ADR-050 / ADR-051
 *
 * Cross-ref: phase-38/deep-dive/{01-ux,02-func,03-sec,04-arch}-review.md
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  dispatchCommand,
  type DispatchDirective,
} from '../src/contexts/intelligence/commands/dispatchCommand'
import { parseCommand } from '../src/contexts/intelligence/commands/commandTriggers'

const EXPORT_IMPORT = join(process.cwd(), 'src/contexts/persistence/exportImport.ts')
const CONTROLS = join(process.cwd(), 'src/components/left-panel/listen/ListenControls.tsx')
const CHAT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const HOOK = join(process.cwd(), 'src/components/left-panel/listen/useListenPipeline.ts')
const ADR = join(process.cwd(), 'docs/adr/ADR-066-command-system-and-route-split.md')

test.describe('R2 F1 — importBundle drops example_prompts before re-seed', () => {
  test('exportImport.ts uses DROP TABLE IF EXISTS before re-running 001 SQL', () => {
    const src = readFileSync(EXPORT_IMPORT, 'utf8')
    expect(src).toMatch(/DROP TABLE IF EXISTS example_prompts/)
    expect(src).toMatch(/DROP TABLE IF EXISTS example_prompt_runs/)
  })

  test('DROP statements run BEFORE the SQL module import', () => {
    const src = readFileSync(EXPORT_IMPORT, 'utf8')
    const dropIdx = src.indexOf('DROP TABLE IF EXISTS example_prompts')
    const sqlImportIdx = src.indexOf('001-example-prompts.sql?raw')
    expect(dropIdx).toBeGreaterThan(0)
    expect(sqlImportIdx).toBeGreaterThan(dropIdx)
  })
})

test.describe('R2 F2 / R4 F1 — dispatchCommand consolidates the switch', () => {
  test('dispatchCommand handles all 8 CommandKind cases', () => {
    const browse = dispatchCommand({ kind: 'browse', raw: '/browse' })
    expect(browse.kind).toBe('open-browse-picker')

    const apply = dispatchCommand({ kind: 'apply-template', target: 'bakery', raw: '/template bakery' })
    expect(apply.kind).toBe('prefill-and-focus')
    if (apply.kind === 'prefill-and-focus') expect(apply.text).toContain('bakery')

    const help = dispatchCommand({ kind: 'template-help', raw: '/template' })
    expect(help.kind).toBe('help-reply')

    const generate = dispatchCommand({ kind: 'generate', raw: '/generate' })
    expect(generate.kind).toBe('prefill-and-focus')

    const design = dispatchCommand({ kind: 'design', raw: '/design' })
    expect(design.kind).toBe('prefill-and-focus')

    const content = dispatchCommand({ kind: 'content', raw: '/content' })
    expect(content.kind).toBe('prefill-and-focus')

    const hide = dispatchCommand({ kind: 'hide', raw: '/hide' })
    expect(hide.kind).toBe('fallthrough')

    const show = dispatchCommand({ kind: 'show', raw: '/show' })
    expect(show.kind).toBe('fallthrough')
  })

  test('parseCommand + dispatchCommand compose end-to-end', () => {
    const cmd = parseCommand('/template')
    expect(cmd?.kind).toBe('template-help')
    if (cmd) {
      const directive: DispatchDirective = dispatchCommand(cmd)
      expect(directive.kind).toBe('help-reply')
    }
  })

  test('ChatInput uses dispatchCommand', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toContain("import { dispatchCommand }")
    expect(src).toMatch(/const directive = dispatchCommand\(cmd\)/)
  })

  test('useListenPipeline uses dispatchCommand (R2 F2: voice template-help now handled)', () => {
    const src = readFileSync(HOOK, 'utf8')
    expect(src).toContain("import { dispatchCommand }")
    expect(src).toMatch(/const directive = dispatchCommand\(cmd\)/)
    // The help-reply branch must hand off to chat (so the typewriter renders)
    expect(src).toMatch(/case 'help-reply'/)
  })

  test('Switch drift impossible — both surfaces dispatch on the same DispatchDirective union', () => {
    const chatSrc = readFileSync(CHAT, 'utf8')
    const hookSrc = readFileSync(HOOK, 'utf8')
    // Each surface must handle the 4 directive kinds at minimum
    for (const kind of ['open-browse-picker', 'prefill-and-focus', 'help-reply', 'fallthrough']) {
      expect(chatSrc, `ChatInput missing case '${kind}'`).toContain(`'${kind}'`)
    }
    // Listen handles open-browse-picker / prefill-and-focus / help-reply (fallthrough is implicit)
    for (const kind of ['open-browse-picker', 'prefill-and-focus', 'help-reply']) {
      expect(hookSrc, `useListenPipeline missing case '${kind}'`).toContain(`'${kind}'`)
    }
  })
})

test.describe('R1 F1 — Listen voice command discovery hint', () => {
  test('ListenControls renders the listen-command-hint chip', () => {
    const src = readFileSync(CONTROLS, 'utf8')
    expect(src).toContain('data-testid="listen-command-hint"')
  })

  test('Hint mentions concrete voice phrasings', () => {
    const src = readFileSync(CONTROLS, 'utf8')
    expect(src).toMatch(/browse templates/)
    expect(src).toMatch(/use template/)
  })

  test('Hint only renders when surface is idle (not recording / busy / review / clarification)', () => {
    const src = readFileSync(CONTROLS, 'utf8')
    expect(src).toMatch(/!pttRecording && !pttBusy && !pttReview && !pttClarification/)
  })
})

test.describe('R4 L1 — ADR-066 cross-references expanded', () => {
  test('ADR-066 cites ADR-045 / ADR-050 / ADR-051', () => {
    const adr = readFileSync(ADR, 'utf8')
    expect(adr).toContain('ADR-045')
    expect(adr).toContain('ADR-050')
    expect(adr).toContain('ADR-051')
  })
})
