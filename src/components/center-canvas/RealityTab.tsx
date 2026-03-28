import { Sparkles, Hexagon, Triangle, Pentagon, Circle } from 'lucide-react'

export function RealityTab() {
  return (
    <div className="min-h-full bg-slate-950">
      {/* Gradient overlay */}
      <div
        className="min-h-full"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.06) 30%, transparent 60%)',
        }}
      >
        <div className="flex flex-col items-center justify-center text-center px-8 py-24">
          {/* Eyebrow badge */}
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5" />
              Hey Bradley 2.0 is Live
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400">
            Ship Code at the
            <br />
            Speed of Thought
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto mt-6 leading-relaxed">
            Build AI-native experiences that transform how we create.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-500/30">
              Get Started
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-slate-300 px-8 py-3 rounded-lg font-semibold text-sm border border-white/10 transition-all">
              View my work
            </button>
          </div>

          {/* Trust bar */}
          <div className="text-slate-500 text-[11px] font-semibold uppercase tracking-[0.15em] mt-16">
            TRUSTED BY 214 INSTITUTIONS
          </div>
          <div className="flex items-center gap-8 mt-4">
            <Hexagon className="h-5 w-5 text-slate-700 opacity-40" />
            <Triangle className="h-5 w-5 text-slate-700 opacity-40" />
            <Pentagon className="h-5 w-5 text-slate-700 opacity-40" />
            <Circle className="h-5 w-5 text-slate-700 opacity-40" />
          </div>
        </div>
      </div>
    </div>
  )
}
