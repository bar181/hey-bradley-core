import { Link } from 'react-router-dom'
import { Key, Shield, Zap, ArrowRight } from 'lucide-react'
import { MarketingNav } from '@/components/MarketingNav'

interface Provider {
  name: string
  keyShape: string
  whereLabel: string
  whereUrl: string | null
  cost: string
  note: string
}

const PROVIDERS: Provider[] = [
  {
    name: 'Claude (Anthropic)',
    keyShape: 'sk-ant-...',
    whereLabel: 'console.anthropic.com/settings/keys',
    whereUrl: 'https://console.anthropic.com/settings/keys',
    cost: '~$0.002 per chat (Haiku)',
    note: 'Recommended default. Best instruction-following for AISP-style structured output.',
  },
  {
    name: 'Gemini (Google AI Studio)',
    keyShape: 'AIza...',
    whereLabel: 'aistudio.google.com/apikey',
    whereUrl: 'https://aistudio.google.com/apikey',
    cost: 'Free tier: 2.0-flash; paid: 2.5-flash ~$0.001 per chat',
    note: 'Free tier is generous. Good for quick iteration; paid tier matches Claude on quality.',
  },
  {
    name: 'OpenRouter',
    keyShape: 'sk-or-v1-...',
    whereLabel: 'openrouter.ai/keys',
    whereUrl: 'https://openrouter.ai/keys',
    cost: 'Free model: mistral-7b-instruct ($0); paid models priced per provider',
    note: 'OpenRouter sees your prompts, the model you chose, and your origin. Use for cheap experimentation.',
  },
  {
    name: 'Simulated',
    keyShape: '(no key required)',
    whereLabel: 'Built-in',
    whereUrl: null,
    cost: '$0',
    note: 'Returns canned responses for the 5 starter prompts. No real LLM call. Useful for offline demos.',
  },
  {
    name: 'AgentProxy (mock)',
    keyShape: '(no key required)',
    whereLabel: 'Built-in',
    whereUrl: null,
    cost: '$0',
    note: 'Reads from a local 18-prompt corpus seeded into IndexedDB. Realistic responses without API cost.',
  },
]

export function BYOK() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2d1f12]">
      <MarketingNav />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <p className="text-xs uppercase tracking-[0.2em] text-[#e8772e] mb-4 font-medium">Bring Your Own Key</p>
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
          No account. Your key. Your machine.
        </h1>
        <p className="text-xl text-[#6b5e4f] leading-relaxed">
          Hey Bradley runs entirely in your browser. No backend. No analytics. When
          you bring a key, it stays in your browser&rsquo;s memory. When you finish, you
          can forget it with one click.
        </p>
      </section>

      {/* The Problem */}
      <article className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold mb-4">Why BYOK?</h2>
        <p className="text-[#6b5e4f] leading-relaxed mb-4">
          Most AI tools collect your prompts. Some sell them. Most need an account
          before you can try anything. None of that is required to build a website
          spec.
        </p>
        <p className="text-[#6b5e4f] leading-relaxed">
          Hey Bradley flips it. The whole app is a single-page React application
          that runs locally. You bring a key from one of the providers below, and
          the app talks directly to that provider. The key never goes anywhere
          else &mdash; not to my server (I don&rsquo;t have one), not to analytics, not to
          any third party.
        </p>
      </article>

      {/* Provider Table */}
      <article className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold mb-6">Five providers. Pick one.</h2>
        <div className="space-y-4">
          {PROVIDERS.map((p) => (
            <div key={p.name} className="bg-white border border-[#e8772e]/20 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <span className="text-xs font-mono bg-[#f1ece4] text-[#6b5e4f] px-2 py-1 rounded">{p.keyShape}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-[#6b5e4f] mb-3">
                <div>
                  <strong className="text-[#2d1f12]">Get a key:</strong>{' '}
                  {p.whereUrl ? (
                    <a href={p.whereUrl} target="_blank" rel="noopener noreferrer" className="text-[#e8772e] underline hover:no-underline">{p.whereLabel}</a>
                  ) : (
                    p.whereLabel
                  )}
                </div>
                <div><strong className="text-[#2d1f12]">Cost:</strong> {p.cost}</div>
              </div>
              <p className="text-sm text-[#6b5e4f] italic">{p.note}</p>
            </div>
          ))}
        </div>
      </article>

      {/* The 60-Second Walkthrough */}
      <article className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold mb-4">The 60-second setup</h2>
        <ol className="space-y-4 text-[#6b5e4f] leading-relaxed">
          <li><strong className="text-[#2d1f12]">1.</strong> Open the builder. Click the cog icon top-right.</li>
          <li><strong className="text-[#2d1f12]">2.</strong> Pick a provider. Paste your key.</li>
          <li><strong className="text-[#2d1f12]">3.</strong> Optional: tick &ldquo;Remember on this device&rdquo; to persist locally (otherwise key clears on tab close).</li>
          <li><strong className="text-[#2d1f12]">4.</strong> Click Save. Click Test Connection.</li>
          <li><strong className="text-[#2d1f12]">5.</strong> Start chatting. The default cost cap is $1.00 per session. Adjust in Settings (range $0.10&ndash;$20).</li>
        </ol>
      </article>

      {/* Privacy Promise */}
      <article className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold mb-4">What we do and don&rsquo;t store</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-emerald-300 rounded-2xl p-6">
            <Shield className="w-6 h-6 text-emerald-600 mb-3" />
            <h3 className="font-semibold mb-3">Stays in your browser</h3>
            <ul className="text-sm text-[#6b5e4f] space-y-2 leading-relaxed">
              <li>Your site config (the JSON behind everything)</li>
              <li>Chat messages and responses</li>
              <li>Listen-mode transcripts (final text only; no audio)</li>
              <li>LLM call logs (30-day retention; auto-pruned)</li>
              <li>Your BYOK key (in-memory or IndexedDB if you tick &ldquo;Remember&rdquo;)</li>
            </ul>
          </div>
          <div className="bg-white border border-amber-300 rounded-2xl p-6">
            <Key className="w-6 h-6 text-amber-600 mb-3" />
            <h3 className="font-semibold mb-3">Goes to your provider</h3>
            <ul className="text-sm text-[#6b5e4f] space-y-2 leading-relaxed">
              <li>Your prompt (system prompt + user message)</li>
              <li>Token counts (for billing on their end)</li>
              <li>OpenRouter only: also your origin URL</li>
              <li>Web Speech: voice → browser&rsquo;s STT vendor (Apple/Google)</li>
              <li><strong>Nothing else, ever.</strong> No analytics. No telemetry.</li>
            </ul>
          </div>
        </div>
      </article>

      {/* Cost Cap */}
      <article className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold mb-4">The cost cap that stops surprises</h2>
        <p className="text-[#6b5e4f] leading-relaxed mb-4">
          Real LLM keys can rack up real bills if a loop goes wrong. Every chat
          call in Hey Bradley is metered against a per-session USD cap. Default:
          $1.00. When you hit 80%, the cost pill turns amber. At 100%, calls stop
          and the chat tells you so.
        </p>
        <p className="text-[#6b5e4f] leading-relaxed">
          Adjust the cap in Settings. The check is pre-call &mdash; we project the
          maximum cost of the next call before it fires. So you can&rsquo;t exceed the
          cap by accident.
        </p>
      </article>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <Link
          to="/onboarding"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#e8772e] text-white font-semibold rounded-xl hover:bg-[#c45f1c] transition-colors shadow-lg text-lg"
        >
          <Zap className="w-5 h-5" />
          Open the builder
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-sm text-[#6b5e4f] mt-4">
          No key required to try Simulated or AgentProxy mode. BYOK only when you want a real LLM.
        </p>
      </section>
    </main>
  )
}
