/**
 * P38 Sprint F end-of-sprint fix-pass — shared command dispatcher.
 *
 * R4 F1 (architecture): the two surfaces (ChatInput + useListenPipeline) had
 * duplicated switch statements that already drifted (the P37 R1 F1 `template-help`
 * kind landed in chat but not in listen → R2 F2 voice dead-end). This module
 * consolidates the dispatch into a single switch keyed by `kind`, returning a
 * directive the host applies via small adapters.
 *
 * Hosts pass a `DispatchHost` adapter so the switch stays UI-agnostic. Pure
 * function; testable without a browser.
 *
 * ADR-066 follow-up.
 */
import type { CommandTrigger } from './commandTriggers'

/**
 * Directive returned by dispatchCommand. The host translates these into UI
 * effects (open the picker, prefill the input, type a help reply, etc.).
 *
 * KISS: a small union of effect descriptors; host adapter applies them.
 */
export type DispatchDirective =
  | { kind: 'open-browse-picker' }
  | { kind: 'prefill-and-focus'; text: string }
  | { kind: 'help-reply'; markdown: string }
  | { kind: 'fallthrough' }

/**
 * Compute the directive for a given CommandTrigger. Stateless / synchronous
 * so both ChatInput's handleSend and useListenPipeline's submitListenFinal
 * can call it with confidence.
 */
export function dispatchCommand(cmd: CommandTrigger): DispatchDirective {
  switch (cmd.kind) {
    case 'browse':
      return { kind: 'open-browse-picker' }
    case 'apply-template':
      return { kind: 'prefill-and-focus', text: `build me a ${cmd.target ?? ''}`.trim() }
    case 'template-help':
      return {
        kind: 'help-reply',
        markdown:
          "Try `/template bakery` (or any template name). Or use the **browse templates** button below to pick one.",
      }
    case 'generate':
      return { kind: 'prefill-and-focus', text: 'generate content for this page' }
    case 'design':
      return { kind: 'prefill-and-focus', text: 'design only: ' }
    case 'content':
      return { kind: 'prefill-and-focus', text: 'content only: ' }
    case 'hide':
    case 'show':
      // Slash-only passthroughs — fall through to canned/LLM path.
      return { kind: 'fallthrough' }
  }
}
