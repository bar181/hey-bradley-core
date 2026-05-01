/**
 * P37 Wave 1 (R2 S3) — ListenTab.
 *
 * Thin orchestrator. Pipeline state lives in `useListenPipeline`; canned-demo
 * + orb-pulse + sim-input plumbing lives in `useListenDemo`; visual surfaces
 * live in sibling components under ./listen/. Target <150 LOC per CLAUDE.md
 * hard cap.
 *
 * P74 / Track B / A4 — highlight applied at chat surface; full text in log.
 * The listen-tab transcript surface is short-form by construction (live STT
 * partials + a single confirmed line via ListenTranscript / ListenReviewCard).
 * If a future revision starts surfacing long bradley replies inline here,
 * wrap the displayed reply in `extractHighlight(text, { minWords: 5,
 * maxWords: 25 })` and keep the raw transcript in pipeline state so the
 * ConversationLogTab can still render the full version.
 */
// P74/A4 — highlight extraction available for future inline reply surface.
import { extractHighlight as _extractHighlight } from '@/lib/highlightExtractor'
void _extractHighlight
import { useEffect, useRef, useState } from 'react'
import listenSequences from '@/data/sequences/listen-sequences.json'
import { useUIStore } from '@/store/uiStore'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { PERSONALITY_IDS, PERSONALITY_PROFILES } from '@/contexts/intelligence/personality/personalityEngine'
import { cn } from '@/lib/cn'
import { type DemoSequenceConfig } from './listen/listenHelpers'
import { useListenPipeline } from './listen/useListenPipeline'
import { useListenDemo } from './listen/useListenDemo'
import { ListenControls } from './listen/ListenControls'
import { ListenTranscript } from './listen/ListenTranscript'
import { ListenOrb } from './listen/ListenOrb'
import { ListenSettings } from './listen/ListenSettings'
import { DemoDialog } from './listen/DemoDialog'

export function ListenTab() {
  const [showSettings, setShowSettings] = useState(false)
  const [showDemoDialog, setShowDemoDialog] = useState(false)
  const viewMode = useUIStore((s) => s.rightPanelTab)
  const { state: listenState, handlers: listenHandlers } = useListenPipeline()
  const { state: demoState, handlers: demoHandlers } = useListenDemo()
  const demoSequences = listenSequences as DemoSequenceConfig[]
  // P66 / Wave 1 / A6 — inline personality mini-picker beside the listen mic.
  const personalityId = useIntelligenceStore((s) => s.personalityId)
  const setPersonality = useIntelligenceStore((s) => s.setPersonality)
  const activeProfile = personalityId ? PERSONALITY_PROFILES[personalityId] : null
  const [popoverOpen, setPopoverOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!popoverOpen) return
    const handler = (e: MouseEvent) => { if (!popoverRef.current?.contains(e.target as Node)) setPopoverOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [popoverOpen])

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--hb-bg,#1a1a1a)] overflow-hidden">
      <ListenOrb
        pulseSpeed={demoState.pulseSpeed}
        blurAmount={demoState.blurAmount}
        glowOpacity={demoState.glowOpacity}
        coreOpacity={demoState.coreOpacity}
        coreBlur={demoState.coreBlur}
        maxSize={demoState.maxSize}
        burstActive={demoState.burstActive}
        simPhase={demoState.simPhase}
        simText={demoState.simText}
      />
      <div className="px-4 pt-2 pb-1 flex flex-col items-center gap-2">
        <ListenControls state={listenState} handlers={listenHandlers} />
        <ListenTranscript state={listenState} handlers={listenHandlers} />
        {activeProfile && (
          <div ref={popoverRef} className="relative inline-flex">
            <button type="button" data-testid="listen-active-personality-chip" data-personality-id={personalityId ?? undefined} aria-haspopup="menu" aria-expanded={popoverOpen} onClick={() => setPopoverOpen((v) => !v)} title={`Change personality (active: ${activeProfile.label})`} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-colors"><span>{activeProfile.emoji ? `${activeProfile.emoji} ` : ''}{activeProfile.label.split(' ')[0]}</span><span aria-hidden className="text-[8px] leading-none">▾</span></button>
            {popoverOpen && (
              <div data-testid="listen-personality-popover" role="menu" className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-30 flex flex-row gap-1 p-1.5 rounded-md bg-[var(--hb-bg,#1a1a1a)] border border-white/20 shadow-lg whitespace-nowrap">
                {PERSONALITY_IDS.map((id) => { const p = PERSONALITY_PROFILES[id]; const isActive = id === personalityId; return (
                  <button key={id} type="button" role="menuitemradio" aria-checked={isActive} data-testid={`listen-personality-popover-${id}`} onClick={() => { setPersonality(id); setPopoverOpen(false) }} className={cn('px-2 py-1 rounded text-[10px] uppercase tracking-wider border transition-colors', isActive ? 'border-white/80 ring-1 ring-white/40 bg-white/10 text-white' : 'border-white/20 bg-transparent text-white/70 hover:border-white/60 hover:text-white')}>{p.emoji ? `${p.emoji} ` : ''}{p.label}</button>
                )})}
              </div>
            )}
          </div>
        )}
        <div className="w-full max-w-[300px] border-t border-white/10 mt-1" />
      </div>
      <ListenSettings
        isExpert={viewMode === 'EXPERT'}
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(!showSettings)}
        pulseSpeed={demoState.pulseSpeed} setPulseSpeed={demoHandlers.setPulseSpeed}
        blurAmount={demoState.blurAmount} setBlurAmount={demoHandlers.setBlurAmount}
        glowOpacity={demoState.glowOpacity} setGlowOpacity={demoHandlers.setGlowOpacity}
        coreOpacity={demoState.coreOpacity} setCoreOpacity={demoHandlers.setCoreOpacity}
        coreBlur={demoState.coreBlur} setCoreBlur={demoHandlers.setCoreBlur}
        maxSize={demoState.maxSize} setMaxSize={demoHandlers.setMaxSize}
        randomMode={demoState.randomMode} setRandomMode={demoHandlers.setRandomMode}
        burstActive={demoState.burstActive} burstRemaining={demoState.burstRemaining}
        simActive={demoState.simActive}
        onWatchDemo={() => setShowDemoDialog(true)}
        onStartListening={demoHandlers.runBurstAnimation}
      />
      <DemoDialog
        open={showDemoDialog}
        demos={demoSequences}
        disabled={demoState.simActive || demoState.burstActive}
        onClose={() => setShowDemoDialog(false)}
        onPick={demoHandlers.runSimulateInput}
      />
      <style>{`
        @keyframes orb-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          25% { opacity: 0.75; transform: scale(1.06); }
          50% { opacity: 1; transform: scale(1.15); }
          75% { opacity: 0.85; transform: scale(1.08); }
        }
        @keyframes orb-breathe {
          0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.8; transform: scale(1.1) rotate(3deg); }
        }
      `}</style>
    </div>
  )
}
