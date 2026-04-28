/**
 * P35 fix-pass (R1 F2) — AISPSurface dispatcher.
 *
 * Picks ONE AISP panel per bradley reply based on UI mode:
 *   • SIMPLE mode → AISPTranslationPanel (Grandma-friendly: intent + template)
 *   • EXPERT mode → AISPPipelineTracePane (full 5-atom trace)
 *
 * Eliminates the visual stacking / duplicate-info smell flagged by R1 in the
 * P35 brutal-honest review. Single-source-of-truth render selection.
 */
import { useUIStore } from '@/store/uiStore'
import { AISPTranslationPanel } from '@/components/shell/AISPTranslationPanel'
import { AISPPipelineTracePane } from '@/components/shell/AISPPipelineTracePane'
import type { ClassifiedIntent, Assumption } from '@/contexts/intelligence/aisp'

export interface AISPSurfaceProps {
  userText: string
  intent: ClassifiedIntent | null
  intentSource: 'rules' | 'llm' | 'fallthrough'
  templateId: string | null
  assumptions?: readonly Assumption[]
  assumptionsSource?: 'llm' | 'rules' | 'empty'
  patches?: number | null
  summary?: string | null
  generated?: { text: string; tone: string; length: string; confidence: number } | null
  /**
   * P44 Sprint H Wave 1 (A2 / ADR-067) — brand-voice flag passthrough. When
   * `undefined`, AISPTranslationPanel falls back to a defensive kv probe so
   * the chip works the moment A1's upload lands without a ChatInput rewire.
   */
  brandActive?: boolean
}

export function AISPSurface(props: AISPSurfaceProps) {
  const isDraft = useUIStore((s) => s.rightPanelTab) === 'SIMPLE'
  if (isDraft) {
    return (
      <AISPTranslationPanel
        intent={props.intent}
        source={props.intentSource}
        userText={props.userText}
        templateId={props.templateId}
        brandActive={props.brandActive}
      />
    )
  }
  return (
    <AISPPipelineTracePane
      userText={props.userText}
      intent={props.intent}
      intentSource={props.intentSource}
      templateId={props.templateId}
      assumptions={props.assumptions}
      assumptionsSource={props.assumptionsSource}
      generated={props.generated}
      patches={props.patches}
      summary={props.summary}
    />
  )
}
