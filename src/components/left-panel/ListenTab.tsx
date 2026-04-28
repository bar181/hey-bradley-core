/**
 * P37 Wave 1 (R2 S3) — ListenTab.
 *
 * Thin orchestrator. Pipeline state lives in `useListenPipeline`; canned-demo
 * + orb-pulse + sim-input plumbing lives in `useListenDemo`; visual surfaces
 * live in sibling components under ./listen/. Target <150 LOC per CLAUDE.md
 * hard cap.
 */
import { useState } from 'react'
import listenSequences from '@/data/sequences/listen-sequences.json'
import { useUIStore } from '@/store/uiStore'
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
