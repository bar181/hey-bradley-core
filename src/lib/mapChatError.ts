// P19 Fix-Pass 2 (F2): map a chat-pipeline error kind onto user-facing copy.
// Parallel to the listen-tab `mapListenError` helper. The chat surface used to
// collapse every adapter/pipeline failure into a single FALLBACK_HINT wall of
// text; this gives each kind its own short, actionable line.

export type ChatErrorKind =
  | 'cost_cap'
  | 'timeout'
  | 'validation_failed'
  | 'precondition_failed'
  | 'rate_limit'
  | 'unknown'

const FALLBACK_HINT =
  "Hmm, I didn't catch that. Try one of: " +
  "Make the hero say 'Bake Joy Daily' · " +
  'Change to dark mode · ' +
  'Add a pricing section · ' +
  'Build me a bakery website · ' +
  'Make it professional'

export function mapChatError(kind: ChatErrorKind): string {
  switch (kind) {
    case 'cost_cap':
      return "I've hit today's spending cap. Adjust your cap in Settings → LLM, or try again tomorrow."
    case 'timeout':
      return 'Request timed out. Network issue? Try again — your prompt is unchanged.'
    case 'validation_failed':
      return "I tried to edit the site but the change wasn't safe to apply. Try a smaller, more specific request."
    case 'precondition_failed':
      return "Something's not configured (missing API key?). Check Settings → LLM."
    case 'rate_limit':
      return 'Provider is rate-limiting me. Wait a few seconds and try again.'
    case 'unknown':
    default:
      return FALLBACK_HINT
  }
}
