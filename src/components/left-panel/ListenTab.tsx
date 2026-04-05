import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Settings, Mic, X } from 'lucide-react'
import { buildDemoFromCaptions, runDemo } from '@/lib/demoSimulator'
import { EXAMPLE_SITES } from '@/data/examples'
import listenSequences from '@/data/sequences/listen-sequences.json'
import { useUIStore } from '@/store/uiStore'
import { Button } from '@/components/ui/button'

interface DemoSequenceConfig {
  id: string
  label: string
  exampleSlug: string
  exampleName: string
  swatchColors: string[]
  captions: { text: string; delay: number }[]
}

const DEFAULTS = {
  pulseSpeed: 3, // seconds (3000ms)
  blurAmount: 23,
  glowOpacity: 52,
  coreOpacity: 85,
  coreBlur: 13,
  maxSize: 250,
}

export function ListenTab() {
  const [pulseSpeed, setPulseSpeed] = useState(DEFAULTS.pulseSpeed)
  const [blurAmount, setBlurAmount] = useState(DEFAULTS.blurAmount)
  const [glowOpacity, setGlowOpacity] = useState(DEFAULTS.glowOpacity)
  const [coreOpacity, setCoreOpacity] = useState(DEFAULTS.coreOpacity)
  const [coreBlur, setCoreBlur] = useState(DEFAULTS.coreBlur)
  const [maxSize, setMaxSize] = useState(DEFAULTS.maxSize)
  const [showSettings, setShowSettings] = useState(false)
  const [randomMode, setRandomMode] = useState(true)
  const [burstActive, setBurstActive] = useState(false)
  const [burstRemaining, setBurstRemaining] = useState(0)
  const burstActiveRef = useRef(false)
  const burstTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const burstCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Simulate input state
  const [simActive, setSimActive] = useState(false)
  const simActiveRef = useRef(false)
  const [simPhase, setSimPhase] = useState<'idle' | 'user' | 'ai'>('idle')
  const [simText, setSimText] = useState('')
  const simTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const demoCleanupRef = useRef<(() => void) | null>(null)

  const [showDemoDialog, setShowDemoDialog] = useState(false)

  // Demo sequences from JSON
  const demoSequences = listenSequences as DemoSequenceConfig[]

  // Helper to track burst timeouts
  const burstTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    burstTimersRef.current.push(id)
    return id
  }

  // Burst animation: 10s sequence
  const runBurstAnimation = useCallback(() => {
    if (burstActiveRef.current) return
    burstActiveRef.current = true
    setBurstActive(true)
    setBurstRemaining(10)
    setRandomMode(false)

    const countdownStart = Date.now()
    burstCountdownRef.current = setInterval(() => {
      const elapsed = (Date.now() - countdownStart) / 1000
      setBurstRemaining(Math.max(0, 10 - elapsed))
    }, 1000)

    // Phase 1: Speed up + high glow (0-4s)
    setPulseSpeed(2)
    setGlowOpacity(55)
    burstTimeout(() => setPulseSpeed(1), 1000)

    // Phase 2: Drop glow (4-7s)
    burstTimeout(() => setGlowOpacity(5), 4000)

    // Phase 3: Return to defaults (7-10s)
    burstTimeout(() => {
      setPulseSpeed(DEFAULTS.pulseSpeed)
      setGlowOpacity(DEFAULTS.glowOpacity)
    }, 7000)

    // End burst
    burstTimeout(() => {
      burstActiveRef.current = false
      setBurstActive(false)
      setBurstRemaining(0)
      setRandomMode(true)
      if (burstCountdownRef.current) clearInterval(burstCountdownRef.current)
    }, 10000)
  }, [])

  // Simulate Input: burst + typewriter user text then demo simulator
  const runSimulateInput = useCallback((demoConfig: DemoSequenceConfig) => {
    if (simActiveRef.current || burstActiveRef.current) return
    simActiveRef.current = true
    setSimActive(true)
    runBurstAnimation()

    // Find the matching example site
    const example = EXAMPLE_SITES.find(e =>
      e.name === demoConfig.exampleName,
    ) ?? EXAMPLE_SITES[0]
    const userText = 'build me a ' + example.name.toLowerCase()

    // Phase 1: Typewriter user text
    setSimPhase('user')
    setSimText('')
    let charIdx = 0
    const typeUser = () => {
      if (charIdx < userText.length) {
        setSimText(userText.slice(0, charIdx + 1))
        charIdx++
        const t = setTimeout(typeUser, 40)
        simTimersRef.current.push(t)
      } else {
        // User text stays 3 seconds then start demo simulator with custom captions
        const t = setTimeout(() => {
          const sequence = buildDemoFromCaptions(
            example.config,
            example.name,
            demoConfig.captions,
          )
          demoCleanupRef.current = runDemo(
            sequence,
            (caption) => {
              setSimPhase('ai')
              setSimText(caption)
            },
            () => {
              setSimPhase('idle')
              setSimText('')
              simActiveRef.current = false
              setSimActive(false)
              demoCleanupRef.current = null
              useUIStore.getState().setLeftPanelTab('builder')
              useUIStore.getState().setRightPanelVisible(true)
            },
          )
        }, 3000)
        simTimersRef.current.push(t)
      }
    }
    typeUser()
  }, [simActive, burstActive, runBurstAnimation])

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      burstTimersRef.current.forEach(clearTimeout)
      if (burstCountdownRef.current) clearInterval(burstCountdownRef.current)
      simTimersRef.current.forEach(clearTimeout)
      if (demoCleanupRef.current) demoCleanupRef.current()
    }
  }, [])

  // Random drift
  const randomize = useCallback(() => {
    const rng = (base: number, variance: number, min: number, max: number) =>
      Math.min(max, Math.max(min, base + (Math.random() - 0.5) * 2 * variance))

    setPulseSpeed(Math.round(rng(DEFAULTS.pulseSpeed, 1.5, 0.5, 6) * 10) / 10)
    setBlurAmount(Math.round(rng(DEFAULTS.blurAmount, 15, 5, 60)))
    setGlowOpacity(Math.round(rng(DEFAULTS.glowOpacity, 20, 15, 60)))
  }, [])

  useEffect(() => {
    if (!randomMode) return
    randomize()
    const interval = setInterval(randomize, 10000)
    return () => clearInterval(interval)
  }, [randomMode, randomize])

  useEffect(() => {
    if (!randomMode) {
      setPulseSpeed(DEFAULTS.pulseSpeed)
      setBlurAmount(DEFAULTS.blurAmount)
      setGlowOpacity(DEFAULTS.glowOpacity)
    }
  }, [randomMode])

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--hb-bg,#1a1a1a)] overflow-hidden">
      {/* A) Orb area — top section */}
      <div className="flex-1 flex items-center justify-center p-6 relative min-h-0">
        {/* Layer 4: Outer halo */}
        <div
          className="absolute rounded-full"
          style={{
            width: `min(${(burstActive ? maxSize * 1.2 : maxSize) * 1.2}px, 95%)`,
            height: `min(${(burstActive ? maxSize * 1.2 : maxSize) * 1.2}px, 95%)`,
            background: `radial-gradient(circle, rgba(165, 28, 48, ${glowOpacity * 0.15 / 100}) 0%, transparent 60%)`,
            filter: `blur(${blurAmount * 1.5}px)`,
            animation: `orb-pulse ${pulseSpeed * 1.5}s ease-in-out infinite`,
          }}
        />
        {/* Layer 3: Ambient glow */}
        <div
          className="absolute rounded-full transition-all duration-2000 ease-in-out"
          style={{
            width: `min(${(burstActive ? maxSize * 1.2 : maxSize)}px, 90%)`,
            height: `min(${(burstActive ? maxSize * 1.2 : maxSize)}px, 90%)`,
            maxWidth: '90%',
            background: `radial-gradient(circle, rgba(165, 28, 48, ${glowOpacity / 100}) 0%, transparent 70%)`,
            filter: `blur(${blurAmount}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
        {/* Layer 2: Mid glow */}
        <div
          className="absolute rounded-full transition-all duration-2000 ease-in-out"
          style={{
            width: `min(${(burstActive ? maxSize * 1.2 : maxSize) * 0.58}px, 55%)`,
            height: `min(${(burstActive ? maxSize * 1.2 : maxSize) * 0.58}px, 55%)`,
            maxWidth: '55%',
            background: `radial-gradient(circle, rgba(165, 28, 48, ${Math.min(glowOpacity * 2.5, 80) / 100}) 0%, transparent 70%)`,
            filter: `blur(${blurAmount * 0.5}px)`,
            animation: `orb-breathe ${pulseSpeed * 1.2}s ease-in-out infinite`,
            animationDelay: `${pulseSpeed * 0.1}s`,
          }}
        />
        {/* Layer 1: Core */}
        <div
          className="relative rounded-full transition-all duration-2000 ease-in-out"
          style={{
            width: Math.max((burstActive ? maxSize * 1.2 : maxSize) * 0.35, 50),
            height: Math.max((burstActive ? maxSize * 1.2 : maxSize) * 0.35, 50),
            background: `radial-gradient(circle, rgba(193, 40, 62, ${coreOpacity / 100}) 0%, rgba(165, 28, 48, ${coreOpacity * 0.6 / 100}) 50%, transparent 100%)`,
            boxShadow: `0 0 ${blurAmount * 0.75}px rgba(165, 28, 48, ${coreOpacity * 0.5 / 100}), 0 0 ${blurAmount * 1.5}px rgba(165, 28, 48, ${coreOpacity * 0.3 / 100})`,
            filter: `blur(${coreBlur}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
      </div>

      {/* B) Caption area — middle, grows to fill */}
      <div className="min-h-[80px] px-4 flex items-center justify-center">
        {simPhase !== 'idle' ? (
          <div className={`w-full rounded-xl px-4 py-3 backdrop-blur-md ${
            simPhase === 'user'
              ? 'bg-white/10 border border-white/20'
              : 'bg-[#A51C30]/15 border border-[#A51C30]/30'
          }`}>
            <div className={`text-xs uppercase tracking-wider mb-1 ${
              simPhase === 'user' ? 'text-white/40' : 'text-[#C1283E]/60'
            }`}>
              {simPhase === 'user' ? 'You' : 'Hey Bradley'}
            </div>
            <p className={`text-lg lg:text-xl font-medium leading-relaxed ${
              simPhase === 'user' ? 'text-white' : 'text-[#C1283E]'
            }`}>
              {simText}
              <span className="inline-block w-0.5 h-5 ml-0.5 align-middle bg-current animate-pulse" />
            </p>
          </div>
        ) : (
          <p className="text-sm text-white/25 italic">Ready to listen...</p>
        )}
      </div>

      {/* C) Bottom controls — pushed to bottom */}
      <div className="mt-auto px-4 pb-4 space-y-2 flex flex-col items-center">
        <div className="w-full max-w-[300px] space-y-2">
          {/* Watch a Demo button */}
          <Button
            variant="ghost"
            onClick={() => setShowDemoDialog(true)}
            disabled={simActive || burstActive}
            className="w-full flex items-center justify-center gap-2 h-auto py-2 text-xs text-white/50 hover:text-[#C1283E] hover:bg-[#A51C30]/5 transition-colors disabled:opacity-40"
            data-testid="watch-demo-btn"
          >
            <Mic size={14} />
            Watch a Demo
          </Button>

          {/* Settings toggle */}
          <Button
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 h-auto text-xs text-white/30 hover:text-white/50 transition-colors mx-auto pt-1"
          >
            <Settings size={11} />
            {showSettings ? 'Hide' : 'Show'} settings
          </Button>

          {showSettings && (
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

          {/* LISTENING button — very bottom */}
          <Button
            variant="outline"
            onClick={runBurstAnimation}
            disabled={burstActive}
            className="w-full flex items-center justify-center gap-2 h-auto py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm tracking-wider uppercase hover:bg-white/15 transition-colors border border-white/10 disabled:opacity-60"
          >
            <Play size={16} fill="currentColor" />
            {burstActive ? `Listening ${Math.ceil(burstRemaining)}s` : 'Start Listening'}
          </Button>
        </div>
      </div>

      {/* Demo dialog */}
      {showDemoDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowDemoDialog(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setShowDemoDialog(false) }}
          role="dialog"
          aria-modal="true"
          aria-label="Demo options"
        >
          <div
            className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white">Watch a Demo</h2>
              <button
                type="button"
                onClick={() => setShowDemoDialog(false)}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {demoSequences.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => {
                    setShowDemoDialog(false)
                    runSimulateInput(demo)
                  }}
                  disabled={simActive || burstActive}
                  className="w-full group flex items-center gap-3 rounded-xl px-4 py-3 bg-white/5 border border-white/10 hover:bg-[#A51C30]/15 hover:border-[#A51C30]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-left"
                >
                  <div className="flex gap-0.5 shrink-0">
                    {demo.swatchColors.map((color, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full border border-white/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-white/70 group-hover:text-[#C1283E] transition-colors">
                    {demo.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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

function SliderRow({ label, value, min, max, step, suffix, leftHint, rightHint, onChange, disabled }: {
  label: string; value: number; min: number; max: number; step: number; suffix: string
  leftHint?: string; rightHint?: string; onChange: (v: number) => void; disabled?: boolean
}) {
  return (
    <div className={`flex items-center gap-2 ${disabled ? 'opacity-40' : ''}`}>
      <span className="text-xs text-white/40 w-10 shrink-0">{leftHint || label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#A51C30]"
        aria-label={label}
      />
      <span className="text-xs text-white/40 w-14 text-right shrink-0">{rightHint || `${value}${suffix}`}</span>
    </div>
  )
}
