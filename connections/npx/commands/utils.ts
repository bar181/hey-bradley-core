// connections/npx/commands/utils.ts
// Shared helpers for the hey-bradley CLI per ADR-C05 D6.

import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export interface ParsedFlags {
  positional: string[];
  flags: Record<string, string | boolean>;
}

/** Minimal arg parser — `--key value` or `--flag`; positional otherwise. */
export function parseFlags(argv: string[]): ParsedFlags {
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a && a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else if (a !== undefined) {
      positional.push(a);
    }
  }
  return { positional, flags };
}

/** Read .heybradley/spec.aisp from cwd; returns string or null if missing. */
export function readSpec(cwd: string = process.cwd()): string | null {
  const path = join(cwd, '.heybradley', 'spec.aisp');
  if (!existsSync(path)) return null;
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

/** Strip BYOK key shapes (sk-/AIza/Bearer) per ADR-043 + ADR-126 D3. */
export function redactKeyShapes(s: string): string {
  if (typeof s !== 'string') return s;
  return s
    .replace(/sk-[A-Za-z0-9_-]{8,}/g, 'sk-[REDACTED]')
    .replace(/AIza[A-Za-z0-9_-]{8,}/g, 'AIza[REDACTED]')
    .replace(/Bearer\s+[A-Za-z0-9_.-]+/g, 'Bearer [REDACTED]');
}

/** Fire-and-forget JSON-line log per ADR-126 D4 + ADR-C05 D6. */
export function logEvent(cwd: string, event: Record<string, unknown>): void {
  try {
    const dir = join(cwd, '.heybradley');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const safe = JSON.parse(redactKeyShapes(JSON.stringify({ ts: new Date().toISOString(), ...event })));
    appendFileSync(join(dir, 'log.json'), JSON.stringify(safe) + '\n');
  } catch {
    // fire-and-forget — never throw
  }
}
