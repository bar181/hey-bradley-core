#!/usr/bin/env node
/**
 * P110 / A1 — ADR Linter (commit-time enforcement).
 *
 * Reads `git diff --name-only HEAD` (or `--cached` when invoked from the
 * pre-commit hook), maps each changed file to its governing ADR(s) via a
 * static rule table, and either PASSes (clean diff or all touched paths
 * have at least one mapped ADR) or VIOLATES (the diff touches a path
 * mapped to ADRs that the commit message does not cite).
 *
 * Run modes:
 *   - Pre-commit (default): inspects staged diff via `git diff --cached --name-only`.
 *     Requires the commit message file when `--commit-msg <path>` is passed
 *     (husky + commit-msg hook chain). Without `--commit-msg`, ADR citation
 *     check is skipped — only the rule-coverage map runs.
 *   - Manual: `node --experimental-strip-types scripts/adr-lint.ts` inspects
 *     `HEAD..` working-tree diff so the owner can preview before committing.
 *
 * Exit codes:
 *   0 = PASS (clean diff OR all rules satisfied)
 *   1 = VIOLATION (one or more rule mismatches)
 *
 * Wiring (recommended): chained AFTER scripts/check-secrets.sh in
 *   .husky/pre-commit so secret-shape leaks block first.
 *
 * No new dependencies — Node stdlib only (child_process + fs).
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

interface Rule {
  pattern: RegExp
  adrs: string[]
  reason: string
}

const ADR_RULES: Rule[] = [
  {
    pattern: /^src\/components\/.*\.tsx?$/,
    adrs: ['ADR-087', 'ADR-091'],
    reason: 'design tokens + canonical component quality',
  },
  {
    pattern: /^src\/contexts\/intelligence\/aisp\/.*\.ts$/,
    adrs: ['ADR-118', 'ADR-119', 'ADR-120', 'ADR-134'],
    reason: 'atom-pure module discipline + no view-layer imports',
  },
  {
    pattern: /^src\/contexts\/intelligence\/llm\/.*\.ts$/,
    adrs: ['ADR-042', 'ADR-046', 'ADR-047'],
    reason: 'multi-provider LLM abstraction + observability',
  },
  {
    pattern: /^src\/contexts\/persistence\/migrations\/.*\.sql$/,
    adrs: ['ADR-040', 'ADR-041', 'ADR-126'],
    reason: 'schema versioning + log enum + retention',
  },
  {
    pattern: /^src\/contexts\/specification\/exporters?\/.*\.ts$/,
    adrs: ['ADR-122', 'ADR-138'],
    reason: 'export bundle completeness + Claude Code markdown contract',
  },
  {
    pattern: /^src\/contexts\/specification\/(exportClaudeCode|shareSpecBundle|staticHtmlExport)\.ts$/,
    adrs: ['ADR-081', 'ADR-101', 'ADR-122'],
    reason: 'spec export quality + share/static HTML',
  },
  {
    pattern: /^src\/contexts\/intelligence\/personality\/.*\.ts$/,
    adrs: ['ADR-073'],
    reason: 'personality engine — composition over Σ; no LLM call',
  },
  {
    pattern: /^src\/contexts\/intelligence\/(chatPipeline|applyPatches|listenPipeline)\.ts$/,
    adrs: ['ADR-044', 'ADR-126', 'ADR-127'],
    reason: 'pipeline patch contract + comprehensive logging + format-verify',
  },
  {
    pattern: /^src\/lib\/schemas\/.*\.ts$/,
    adrs: ['ADR-100', 'ADR-104'],
    reason: 'section type completeness + page-aware target taxonomy',
  },
  {
    pattern: /^docs\/adr\/.*\.md$/,
    adrs: ['ADR-137'],
    reason: 'ADR ledger truth-up — README counter must stay in sync',
  },
  {
    pattern: /^playwright\.config\.ts$/,
    adrs: ['ADR-090', 'ADR-102', 'ADR-136'],
    reason: 'mobile viewports + perf/a11y + test runtime shift',
  },
  {
    pattern: /^package\.json$/,
    adrs: ['ADR-102'],
    reason: 'dependency baseline — new deps require ADR + bundle audit',
  },
]

interface MatchResult {
  file: string
  adrs: string[]
  reason: string
}

function getChangedFiles(staged: boolean): string[] {
  try {
    const flag = staged ? '--cached' : 'HEAD'
    const out = execSync(`git diff ${flag} --name-only`, { encoding: 'utf8' })
    return out.split('\n').map((s) => s.trim()).filter(Boolean)
  } catch {
    return []
  }
}

function matchRules(files: string[]): MatchResult[] {
  const out: MatchResult[] = []
  for (const file of files) {
    for (const rule of ADR_RULES) {
      if (rule.pattern.test(file)) {
        out.push({ file, adrs: rule.adrs, reason: rule.reason })
      }
    }
  }
  return out
}

function readCommitMsg(argv: string[]): string | null {
  const idx = argv.indexOf('--commit-msg')
  if (idx === -1 || idx + 1 >= argv.length) return null
  const file = argv[idx + 1]
  if (!existsSync(file)) return null
  return readFileSync(file, 'utf8')
}

function citedAdrs(commitMsg: string | null): Set<string> {
  if (!commitMsg) return new Set()
  const matches = commitMsg.match(/ADR-\d{3}/g) ?? []
  return new Set(matches)
}

function main(): number {
  const argv = process.argv.slice(2)
  const staged = !argv.includes('--head')
  const files = getChangedFiles(staged)

  if (files.length === 0) {
    console.log('[adr-lint] PASS — no changed files in diff')
    return 0
  }

  const matches = matchRules(files)
  if (matches.length === 0) {
    console.log(`[adr-lint] PASS — ${files.length} files changed; no rule mappings`)
    return 0
  }

  const commitMsg = readCommitMsg(argv)
  const cited = citedAdrs(commitMsg)
  const violations: string[] = []
  const advisories: string[] = []

  for (const m of matches) {
    const matched = m.adrs.filter((a) => cited.has(a))
    if (commitMsg === null) {
      // Advisory mode — no commit message available. Print the mapping but
      // do NOT block the commit (e.g. owner ran the script manually).
      advisories.push(`  • ${m.file} → ${m.adrs.join(', ')} (${m.reason})`)
    } else if (matched.length === 0) {
      // Hard violation — file under governance but no ADR cited.
      violations.push(
        `  ✗ ${m.file}\n     governed by: ${m.adrs.join(', ')} (${m.reason})\n     commit cites: ${[...cited].join(', ') || '(none)'}`,
      )
    }
  }

  if (advisories.length > 0) {
    console.log('[adr-lint] ADVISORY — files touched are governed by ADRs:')
    for (const a of advisories) console.log(a)
    console.log('  (re-invoke with --commit-msg <path> to enforce citation)')
  }

  if (violations.length > 0) {
    console.error('[adr-lint] VIOLATION — commit message does not cite governing ADRs:')
    for (const v of violations) console.error(v)
    console.error('\n  Cite the relevant ADR(s) in the commit message body, OR add a successor ADR.')
    return 1
  }

  console.log(`[adr-lint] PASS — ${matches.length} matched rules, ${cited.size} ADR citation(s)`)
  return 0
}

process.exit(main())
