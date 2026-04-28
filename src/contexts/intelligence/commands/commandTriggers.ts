/**
 * P37 Sprint F P2 — Command Trigger System.
 *
 * Pure-unit (no LLM, no I/O): a single `parseCommand` gate that maps slash
 * commands AND high-confidence voice phrasings to typed CommandTrigger
 * objects. Wired BEFORE the intent classifier in both ChatInput and
 * ListenTab so commands always win over fuzzy NL parsing.
 *
 * Design tenets:
 *   - KISS: no template-router/registry knowledge here; commands are an
 *     EARLIER gate that produces a typed trigger; the host (ChatInput /
 *     ListenTab) owns dispatch.
 *   - Token-boundary anchored, case-insensitive.
 *   - HIGH-confidence only on the voice surface — bare "templates" alone
 *     never fires; the user must say "browse templates" / "show me
 *     templates" or use the slash form.
 *   - Idempotent: parseCommand is a pure function — repeated calls on the
 *     same text return identical triggers.
 *
 * ADR-066 (owned by Wave 1 Agent A3 — do not edit ADR from here).
 */

/**
 * Discriminated union of every first-class command the chat + voice
 * surfaces accept. Hosts switch on `kind` to dispatch.
 *
 *   browse           — open the TemplateBrowsePicker
 *   apply-template   — apply a named template (target = template id/name)
 *   generate         — kick the chat pipeline with a generate-content prefix
 *   design           — design-only scope (style without copy edits)
 *   content          — content-only scope (copy without style edits)
 *   hide / show      — first-class hide/show passthroughs (voice-friendly)
 */
export type CommandKind =
  | 'browse'
  | 'apply-template'
  | 'template-help'
  | 'generate'
  | 'design'
  | 'content'
  | 'hide'
  | 'show'

export interface CommandTrigger {
  /** Discriminator. */
  kind: CommandKind
  /** Optional target identifier (e.g. template name for `apply-template`). */
  target?: string
  /**
   * Original triggering text (verbatim, trimmed). Useful when the host
   * wants to log what was matched without re-running the regex.
   */
  raw: string
}

/**
 * Public list of every command trigger surface. Drives the help UI in
 * ChatExplainer-style components and gives downstream tests a single
 * source of truth for "what voice/slash phrases are first-class".
 *
 * Each entry pairs the slash form with one or more spoken aliases so the
 * voice and chat surfaces document identically.
 */
export interface CommandTriggerSpec {
  kind: CommandKind
  /** Slash form (canonical). */
  slash: string
  /** Spoken / typed aliases (lowercased; matched on whole-phrase boundary). */
  aliases: ReadonlyArray<string>
  /** One-line description for help UIs. */
  description: string
}

export const COMMAND_TRIGGER_LIST: ReadonlyArray<CommandTriggerSpec> = [
  {
    kind: 'browse',
    slash: '/browse',
    aliases: ['/templates', 'browse templates', 'show me templates', 'show templates'],
    description: 'Open the template browser.',
  },
  {
    kind: 'apply-template',
    slash: '/template <name>',
    aliases: ['apply template <name>', 'use template <name>'],
    description: 'Apply a named template (e.g. /template bakery).',
  },
  {
    kind: 'generate',
    slash: '/generate',
    aliases: ['generate content', 'write content', 'write copy'],
    description: 'Generate fresh content for the current page.',
  },
  {
    kind: 'design',
    slash: '/design',
    aliases: ['design only', 'style only'],
    description: 'Restrict next change to design (no copy edits).',
  },
  {
    kind: 'content',
    slash: '/content',
    aliases: ['content only', 'copy only'],
    description: 'Restrict next change to content (no style edits).',
  },
  {
    kind: 'hide',
    slash: '/hide',
    aliases: [],
    description: 'Slash-only passthrough (voice uses NL "hide the X").',
  },
  {
    kind: 'show',
    slash: '/show',
    aliases: [],
    description: 'Slash-only passthrough (voice uses NL "show the X").',
  },
]

/* ───────────── pattern tables ───────────── */

// Bare-slash commands that take no arguments.
const BARE_SLASH: Record<string, CommandKind> = {
  '/browse': 'browse',
  '/templates': 'browse',
  '/generate': 'generate',
  '/design': 'design',
  '/content': 'content',
  '/hide': 'hide',
  '/show': 'show',
}

// Voice phrasings — token-boundary anchored, case-insensitive. Whole-input
// match: we deliberately require the spoken phrase to BE the input (after
// trim+lowercase), or be the prefix followed by whitespace, so "browse
// templates" alone fires but "browse templates and add pricing" does NOT
// (mixing a command with extra prose is genuinely ambiguous; the user
// should split it into two turns).
const VOICE_PHRASES: ReadonlyArray<{ pattern: RegExp; kind: CommandKind }> = [
  { pattern: /^browse\s+templates$/i, kind: 'browse' },
  { pattern: /^show\s+(?:me\s+)?templates$/i, kind: 'browse' },
  // P37 R1 L1 fix-pass — voice idiom expansions ("open"/"pick"/"template browser").
  { pattern: /^open\s+(?:the\s+)?templates?$/i, kind: 'browse' },
  { pattern: /^pick\s+a\s+template$/i, kind: 'browse' },
  { pattern: /^template\s+browser$/i, kind: 'browse' },
  { pattern: /^generate\s+content$/i, kind: 'generate' },
  { pattern: /^write\s+content$/i, kind: 'generate' },
  { pattern: /^write\s+copy$/i, kind: 'generate' },
  { pattern: /^design\s+only$/i, kind: 'design' },
  { pattern: /^style\s+only$/i, kind: 'design' },
  { pattern: /^content\s+only$/i, kind: 'content' },
  { pattern: /^copy\s+only$/i, kind: 'content' },
]

// Templated slash forms with an argument: `/template <name>`.
const SLASH_TEMPLATE_RE = /^\/template\s+(.+)$/i
// Voice forms with an argument: `apply template <name>`, `use template <name>`,
// `load template <name>`, `switch to template <name>`, `try template <name>`.
// P37 R1 L2 fix-pass — broaden the voice apply-template verb set.
const VOICE_TEMPLATE_RE = /^(?:apply|use|load|switch\s+to|try)\s+(?:the\s+)?template\s+(.+)$/i

/**
 * Parse user text into a CommandTrigger; returns null when the text is not
 * a recognised command. Designed to be called BEFORE the intent classifier.
 *
 * Accepts: slash forms (`/browse`, `/template <name>`) and a small set of
 * exact voice phrasings (`browse templates`, `apply template bakery`).
 *
 * Rejects: bare nouns ("templates", "design"), partial matches embedded in
 * sentences ("hey can you browse templates please"), and anything that
 * isn't an exact whole-input match.
 */
export function parseCommand(text: string): CommandTrigger | null {
  if (typeof text !== 'string') return null
  const raw = text.trim()
  if (!raw) return null
  const lower = raw.toLowerCase()

  // 1. Bare slash commands (highest priority — unambiguous).
  if (Object.prototype.hasOwnProperty.call(BARE_SLASH, lower)) {
    return { kind: BARE_SLASH[lower], raw }
  }

  // 2. Slash with argument: /template <name>
  const slashTemplate = raw.match(SLASH_TEMPLATE_RE)
  if (slashTemplate) {
    const target = slashTemplate[1].trim()
    if (target) return { kind: 'apply-template', target, raw }
  }

  // 2b. P37 R1 F1 fix-pass — bare `/template` (no name) is now a hint trigger,
  // not a silent reject. Host dispatches a help message ("Try `/template
  // bakery`. Or use `/browse` to pick a template.") instead of leaving the
  // user with no feedback.
  if (lower === '/template' || lower === '/template ') {
    return { kind: 'template-help', raw }
  }

  // 3. Voice phrasings (whole-input only).
  for (const { pattern, kind } of VOICE_PHRASES) {
    if (pattern.test(raw)) return { kind, raw }
  }

  // 4. Voice apply-template: "apply template X" / "use template X"
  const voiceTemplate = raw.match(VOICE_TEMPLATE_RE)
  if (voiceTemplate) {
    const target = voiceTemplate[1].trim()
    if (target) return { kind: 'apply-template', target, raw }
  }

  return null
}
