import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Settings, Wand2 } from 'lucide-react'

const DEFAULTS = {
  pulseSpeed: 3, // seconds (3000ms)
  blurAmount: 23,
  glowOpacity: 52,
  coreOpacity: 85,
  coreBlur: 13,
  maxSize: 400,
}

const SIM_USER_TEXT = "lets make a website for grandma and her amazing cookies"
const SIM_AI_TEXT = "updating to light mode, increasing font ... adjusting for a personal website ... updating the hero and features section, removing marketing sections"

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

  // Simulate Input: burst + typewriter user text then AI reply
  const runSimulateInput = useCallback(() => {
    if (simActiveRef.current || burstActiveRef.current) return
    simActiveRef.current = true
    setSimActive(true)
    runBurstAnimation()

    // Phase 1: Typewriter user text
    setSimPhase('user')
    setSimText('')
    let charIdx = 0
    const typeUser = () => {
      if (charIdx < SIM_USER_TEXT.length) {
        setSimText(SIM_USER_TEXT.slice(0, charIdx + 1))
        charIdx++
        const t = setTimeout(typeUser, 40)
        simTimersRef.current.push(t)
      } else {
        // User text stays 5 seconds then switch to AI
        const t = setTimeout(() => {
          setSimPhase('ai')
          setSimText('')
          let aiIdx = 0
          const typeAi = () => {
            if (aiIdx < SIM_AI_TEXT.length) {
              setSimText(SIM_AI_TEXT.slice(0, aiIdx + 1))
              aiIdx++
              const t2 = setTimeout(typeAi, 25)
              simTimersRef.current.push(t2)
            } else {
              // AI text stays 5 seconds then clear
              const t3 = setTimeout(() => {
                setSimPhase('idle')
                setSimText('')
                simActiveRef.current = false
                setSimActive(false)
              }, 5000)
              simTimersRef.current.push(t3)
            }
          }
          typeAi()
        }, 5000)
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
    <div className="flex-1 flex flex-col bg-[var(--hb-bg,#1a1a1a)] relative overflow-hidden">
      {/* Sim overlay text */}
      {simPhase !== 'idle' && (
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
          <div className={`rounded-xl px-4 py-3 backdrop-blur-md ${
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
        </div>
      )}

      {/* Orb area — fills panel */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Layer 3: Ambient glow — fills 90% of available space */}
        <div
          className="absolute rounded-full transition-all duration-[2000ms] ease-in-out"
          style={{
            width: `min(${maxSize}px, 90%)`,
            height: `min(${maxSize}px, 90%)`,
            maxWidth: '90%',
            background: `radial-gradient(circle, rgba(165, 28, 48, ${glowOpacity / 100}) 0%, transparent 70%)`,
            filter: `blur(${blurAmount}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
        {/* Layer 2: Mid glow */}
        <div
          className="absolute rounded-full transition-all duration-[2000ms] ease-in-out"
          style={{
            width: `min(${maxSize * 0.58}px, 55%)`,
            height: `min(${maxSize * 0.58}px, 55%)`,
            maxWidth: '55%',
            background: `radial-gradient(circle, rgba(165, 28, 48, ${Math.min(glowOpacity * 2.5, 80) / 100}) 0%, transparent 70%)`,
            filter: `blur(${blurAmount * 0.5}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
            animationDelay: `${pulseSpeed * 0.1}s`,
          }}
        />
        {/* Layer 1: Core — larger default */}
        <div
          className="relative rounded-full transition-all duration-[2000ms] ease-in-out"
          style={{
            width: Math.max(maxSize * 0.35, 50),
            height: Math.max(maxSize * 0.35, 50),
            background: `radial-gradient(circle, rgba(193, 40, 62, ${coreOpacity / 100}) 0%, rgba(165, 28, 48, ${coreOpacity * 0.6 / 100}) 50%, transparent 100%)`,
            boxShadow: `0 0 ${blurAmount * 0.75}px rgba(165, 28, 48, ${coreOpacity * 0.5 / 100}), 0 0 ${blurAmount * 1.5}px rgba(165, 28, 48, ${coreOpacity * 0.3 / 100})`,
            filter: `blur(${coreBlur}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
      </div>

      {/* Controls */}
      <div className="px-4 pb-4 space-y-3 flex flex-col items-center">
        <div className="w-full max-w-[300px] space-y-3">
          <SliderRow label="Speed" value={pulseSpeed} min={0.5} max={15} step={0.5} suffix="s" leftHint="Fast" rightHint="Slow" onChange={setPulseSpeed} disabled={randomMode} />

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors mx-auto"
          >
            <Settings size={11} />
            {showSettings ? 'Hide' : 'Show'} settings
          </button>

          {showSettings && (
            <div className="space-y-2 pt-1 border-t border-white/10">
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

          <button
            type="button"
            onClick={runSimulateInput}
            disabled={simActive || burstActive}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#A51C30]/15 backdrop-blur-sm text-[#C1283E] font-semibold text-xs tracking-wider uppercase hover:bg-[#A51C30]/25 transition-colors border border-[#A51C30]/25 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Wand2 size={14} />
            {simActive ? 'Playing Demo...' : 'Watch a Demo'}
          </button>

          <button
            type="button"
            onClick={runBurstAnimation}
            disabled={burstActive}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm tracking-wider uppercase hover:bg-white/15 transition-colors border border-white/10 disabled:opacity-60"
          >
            <Play size={16} fill="currentColor" />
            {burstActive ? `Listening ${Math.ceil(burstRemaining)}s` : 'Start Listening'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes orb-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
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
