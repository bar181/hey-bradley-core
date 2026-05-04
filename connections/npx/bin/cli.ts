#!/usr/bin/env node
/**
 * Hey Bradley CLI — spec-first planning workbench.
 * Per ADR-C05.
 */

import { runInit } from '../commands/init.js';
import { runSpec } from '../commands/spec.js';
import { runExport } from '../commands/export.js';
import { runScore } from '../commands/score.js';

const VERSION = '0.1.0';

function printHelp(): void {
  console.log(`hey-bradley v${VERSION} — spec-first planning workbench

Usage:
  hey-bradley init                       Scaffold .heybradley/ in current dir
  hey-bradley spec [--prompt <text>]     Generate or refresh spec
  hey-bradley export --claude-code       Emit CLAUDE.md bundle
  hey-bradley score [--strict]           Score current spec (CI-friendly)

Flags:
  --tier <bronze|silver|gold|platinum>   Tier target (default: silver)
  --offline                              Use rules-only classifier
  --output <path>                        Custom output path
  --json                                 Machine-readable JSON output
  --force                                Overwrite (init only)
  --strict                               Require gold tier (score only)

Exit codes:
  0  success
  1  CI gate failed (score below tier OR ambig too high)
  2  spec missing / unparseable / write fail

Docs: https://github.com/bar181/hey-bradley-core/tree/main/connections`);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const cmd = argv[0];
  const rest = argv.slice(1);

  switch (cmd) {
    case 'init': {
      const code = await runInit(rest);
      process.exit(code);
    }
    case 'spec': {
      const code = await runSpec(rest);
      process.exit(code);
    }
    case 'export': {
      const code = await runExport(rest);
      process.exit(code);
    }
    case 'score': {
      const code = await runScore(rest);
      process.exit(code);
    }
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      printHelp();
      process.exit(0);
    case '--version':
    case '-v':
      console.log(VERSION);
      process.exit(0);
    default:
      console.error(`Unknown command: ${cmd}\n`);
      printHelp();
      process.exit(2);
  }
}

main().catch((err) => {
  console.error('hey-bradley failed:', err);
  process.exit(2);
});
