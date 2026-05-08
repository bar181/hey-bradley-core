/**
 * P37 Wave 1 (R2 S3) — useListenDemo.
 *
 * Owns the canned-demo + orb-pulse + sim-input plumbing that previously
 * lived inline in ListenTab. The orb visual values + sim caption stay as
 * state so the parent can render them; refs/timers/sequencing live here.
 *
 * Returned shape mirrors useListenPipeline so the orchestrator stays small.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useUIStore } from '@/store/uiStore'
import { buildDemoFromCaptions, runDemo } from '@/lib/demoSimulator'
import { EXAMPLE_SITES } from '@/data/examples'
import { DEFAULTS, type DemoSequenceConfig } from './listenHelpers'

export interface ListenDemoState {
  pulseSpeed: number
  blurAmount: number
  glowOpacity: number
  coreOpacity: number
  coreBlur: number
  maxSize: number
  randomMode: boolean
  burstActive: boolean
  burstRemaining: number
  simActive: boolean
  simPhase: 'idle' | 'user' | 'ai'
  simText: string
}

export interface ListenDemoHandlers {
  setPulseSpeed: (n: number) => void
  setBlurAmount: (n: number) => void
  setGlowOpacity: (n: number) => void
  setCoreOpacity: (n: number) => void
  setCoreBlur: (n: number) => void
  setMaxSize: (n: number) => void
  setRandomMode: (b: boolean) => void
  runBurstAnimation: () => void
  runSimulateInput: (demo: DemoSequenceConfig) => void
}

export function useListenDemo(): { state: ListenDemoState; handlers: ListenDemoHandlers } {
  const [pulseSpeed, setPulseSpeed] = useState(DEFAULTS.pulseSpeed)
  const [blurAmount, setBlurAmount] = useState(DEFAULTS.blurAmount)
  const [glowOpacity, setGlowOpacity] = useState(DEFAULTS.glowOpacity)
  const [coreOpacity, setCoreOpacity] = useState(DEFAULTS.coreOpacity)
  const [coreBlur, setCoreBlur] = useState(DEFAULTS.coreBlur)
  const [maxSize, setMaxSize] = useState(DEFAULTS.maxSize)
  const [randomMode, setRandomMode] = useState(true)
  const [burstActive, setBurstActive] = useState(false)
  const [burstRemaining, setBurstRemaining] = useState(0)
  const burstActiveRef = useRef(false)
  const burstTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const burstCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [simActive, setSimActive] = useState(false)
  const simActiveRef = useRef(false)
  const [simPhase, setSimPhase] = useState<'idle' | 'user' | 'ai'>('idle')
  const [simText, setSimText] = useState('')
  const simTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const demoCleanupRef = useRef<(() => void) | null>(null)

  const burstTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    burstTimersRef.current.push(id)
    return id
  }

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
    setPulseSpeed(2)
    setGlowOpacity(55)
    burstTimeout(() => setPulseSpeed(1), 1000)
    burstTimeout(() => setGlowOpacity(5), 4000)
    burstTimeout(() => {
      setPulseSpeed(DEFAULTS.pulseSpeed)
      setGlowOpacity(DEFAULTS.glowOpacity)
    }, 7000)
    burstTimeout(() => {
      burstActiveRef.current = false
      setBurstActive(false)
      setBurstRemaining(0)
      setRandomMode(true)
      if (burstCountdownRef.current) clearInterval(burstCountdownRef.current)
    }, 10000)
  }, [])

  const runSimulateInput = useCallback(
    (demoConfig: DemoSequenceConfig) => {
      if (simActiveRef.current || burstActiveRef.current) return
      simActiveRef.current = true
      setSimActive(true)
      runBurstAnimation()
      const example =
        EXAMPLE_SITES.find((e) => e.name === demoConfig.exampleName) ?? EXAMPLE_SITES[0]
      const userText = 'build me a ' + example.name.toLowerCase()
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
          const t = setTimeout(() => {
            const sequence = buildDemoFromCaptions(example.config, example.name, demoConfig.captions)
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
      // P19 Fix-Pass 2 (F16): refs intentional in deps.
    },
    [runBurstAnimation],
  )

  // Unmount cleanup.
  useEffect(() => {
    return () => {
      burstTimersRef.current.forEach(clearTimeout)
      if (burstCountdownRef.current) clearInterval(burstCountdownRef.current)
      simTimersRef.current.forEach(clearTimeout)
      if (demoCleanupRef.current) demoCleanupRef.current()
    }
  }, [])

  // Random drift mode.
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

  return {
    state: {
      pulseSpeed,
      blurAmount,
      glowOpacity,
      coreOpacity,
      coreBlur,
      maxSize,
      randomMode,
      burstActive,
      burstRemaining,
      simActive,
      simPhase,
      simText,
    },
    handlers: {
      setPulseSpeed,
      setBlurAmount,
      setGlowOpacity,
      setCoreOpacity,
      setCoreBlur,
      setMaxSize,
      setRandomMode,
      runBurstAnimation,
      runSimulateInput,
    },
  }
}
