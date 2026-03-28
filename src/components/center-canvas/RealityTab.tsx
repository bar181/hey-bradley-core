import { Sparkles } from 'lucide-react'

export function RealityTab() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.08) 30%, transparent 70%), #0a0a0f',
      }}
    >
      <div className="w-full max-w-3xl px-6 py-20 text-center">
        {/* Eyebrow badge */}
        <div className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Hey Bradley 2.0 is Live
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl font-bold leading-tight md:text-6xl"
          style={{
            background:
              'linear-gradient(to right, #ffffff, #bfdbfe, #d8b4fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Ship Code at the
          <br />
          Speed of Thought
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
          Build AI-native experiences that transform how we create.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button className="rounded-lg bg-hb-accent px-6 py-2.5 font-medium text-white shadow-lg shadow-blue-500/25 transition-colors hover:bg-hb-accent-hover">
            Get Started
          </button>
          <button className="rounded-lg border border-white/20 bg-white/10 px-6 py-2.5 text-white/80 transition-colors hover:bg-white/15">
            View my work
          </button>
        </div>

        {/* Trust bar */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-sm text-white/40">
            Used at 214 institutions
          </p>
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-white/20"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
