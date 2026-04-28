/**
 * P37 Wave 1 (R2 S3) — ListenSettings.
 *
 * EXPERT-only orb-tuning sliders + bottom controls (Watch a Demo + Start
 * Listening). Extracted from ListenTab so the orchestrator stays under the
 * CLAUDE.md 150-LOC target. Pure presentational — host owns state + handlers.
 */
import { Play, Settings, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SliderRow } from './SliderRow'

export interface ListenSettingsProps {
  isExpert: boolean
  showSettings: boolean
  onToggleSettings: () => void
  pulseSpeed: number
  setPulseSpeed: (n: number) => void
  blurAmount: number
  setBlurAmount: (n: number) => void
  glowOpacity: number
  setGlowOpacity: (n: number) => void
  coreOpacity: number
  setCoreOpacity: (n: number) => void
  coreBlur: number
  setCoreBlur: (n: number) => void
  maxSize: number
  setMaxSize: (n: number) => void
  randomMode: boolean
  setRandomMode: (b: boolean) => void
  burstActive: boolean
  burstRemaining: number
  simActive: boolean
  onWatchDemo: () => void
  onStartListening: () => void
}

export function ListenSettings(props: ListenSettingsProps) {
  const {
    isExpert,
    showSettings,
    onToggleSettings,
    pulseSpeed,
    setPulseSpeed,
    blurAmount,
    setBlurAmount,
    glowOpacity,
    setGlowOpacity,
    coreOpacity,
    setCoreOpacity,
    coreBlur,
    setCoreBlur,
    maxSize,
    setMaxSize,
    randomMode,
    setRandomMode,
    burstActive,
    burstRemaining,
    simActive,
    onWatchDemo,
    onStartListening,
  } = props
  return (
    <div className="mt-auto px-4 pb-4 space-y-2 flex flex-col items-center">
      <div className="w-full max-w-[300px] space-y-2">
        <Button
          variant="ghost"
          onClick={onWatchDemo}
          disabled={simActive || burstActive}
          className="w-full flex items-center justify-center gap-2 h-auto py-2 text-xs text-white/50 hover:text-[#C1283E] hover:bg-[#A51C30]/5 transition-colors disabled:opacity-40"
          data-testid="watch-demo-btn"
        >
          <Mic size={14} />
          Watch a Demo
        </Button>
        {isExpert && (
          <Button
            variant="ghost"
            onClick={onToggleSettings}
            className="flex items-center gap-1.5 h-auto text-xs text-white/30 hover:text-white/50 transition-colors mx-auto pt-1"
          >
            <Settings size={11} />
            {showSettings ? 'Hide' : 'Show'} settings
          </Button>
        )}
        {showSettings && isExpert && (
          <div className="space-y-2 pt-1 border-t border-white/10">
            <SliderRow label="Speed" value={pulseSpeed} min={0.5} max={15} step={0.5} suffix="s" leftHint="Fast" rightHint="Slow" onChange={setPulseSpeed} disabled={randomMode} />
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-white/40">Random drift</span>
              <button
                type="button"
                onClick={() => setRandomMode(!randomMode)}
                className={`w-8 h-4 rounded-full relative transition-colors ${randomMode ? 'bg-[#A51C30]' : 'bg-white/20'}`}
                aria-label="Toggle random mode"
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${randomMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <SliderRow label="Blur" value={blurAmount} min={0} max={80} step={1} suffix="px" onChange={setBlurAmount} disabled={randomMode} />
            <SliderRow label="Glow" value={glowOpacity} min={5} max={60} step={1} suffix="%" onChange={setGlowOpacity} disabled={randomMode} />
            <SliderRow label="Core" value={coreOpacity} min={10} max={100} step={5} suffix="%" onChange={setCoreOpacity} />
            <SliderRow label="Soft" value={coreBlur} min={0} max={40} step={1} suffix="px" onChange={setCoreBlur} />
            <SliderRow label="Size" value={maxSize} min={100} max={400} step={10} suffix="px" onChange={setMaxSize} />
          </div>
        )}
        <Button
          variant="outline"
          onClick={onStartListening}
          disabled={burstActive}
          className="w-full flex items-center justify-center gap-2 h-auto py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm tracking-wider uppercase hover:bg-white/15 transition-colors border border-white/10 disabled:opacity-60"
        >
          <Play size={16} fill="currentColor" />
          {burstActive ? `Listening ${Math.ceil(burstRemaining)}s` : 'Start Listening'}
        </Button>
      </div>
    </div>
  )
}
