# Getting Started — Hey Bradley (open core)

> **60-second setup.** No account. BYOK. Local-only. MIT license.

## Prerequisites

- Node 18+ (or 20+; tested on 22.x)
- `npm` 10+
- A modern browser (Chrome / Edge / Safari for full Listen-mode support)

## 1. Clone + install

```bash
git clone https://github.com/bar181/hey-bradley-core.git
cd hey-bradley-core
npm install
```

## 2. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Welcome page loads.

**Without a key:** click "Try it now" → builder opens in Simulated or AgentProxy mode → canned responses for the 5 starter prompts. $0 spend. Useful for offline demos.

## 3. Bring Your Own Key (BYOK) — optional, for real LLM responses

1. Click the **cog icon** (top right) → Settings drawer opens.
2. Pick a provider:
   - **Claude (Anthropic)** — `sk-ant-...` from [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys). Recommended default.
   - **Gemini (Google AI Studio)** — `AIza...` from [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Free tier available.
   - **OpenRouter** — `sk-or-v1-...` from [openrouter.ai/keys](https://openrouter.ai/keys). Free model: mistral-7b-instruct.
3. Paste your key. Optionally tick "Remember on this device" to persist locally (otherwise key clears on tab close).
4. Click **Save** → **Test connection**.
5. Confirm the cost cap (default $1.00 per session; range $0.10–$20). Adjust in the same Settings panel if needed.

The BYOK key never leaves your browser. Read the full security policy in [SECURITY.md](../SECURITY.md).

## 4. Try a starter prompt

In the chat panel:

- "Make the hero say 'Welcome to my bakery'"
- "Change the accent color to blue"
- "Use a serif font for headings"
- "Replace the hero image with a sunset"
- "Write a short blog article about gardening"

Or hit the mic icon (Listen tab) and **push-to-talk** the same prompts.

## 5. Export your work

When you're done, click **Export → .heybradley zip**. The zip contains your full project (config + chat history + transcripts) **with sensitive data stripped** (BYOK key + raw LLM logs).

You can re-import a `.heybradley` zip later, or hand the AISP spec inside it to your favorite AI coding tool.

## Troubleshooting

| Issue | Fix |
|---|---|
| Listen mode says "not supported" | Use Chrome / Edge / Safari. Firefox does not support Web Speech API by default. |
| Cost pill goes red | You hit your session cap. Adjust in Settings → LLM cost cap. |
| "Persistence unavailable" banner | IndexedDB unavailable or quota exceeded. Try a different browser profile or clear browser storage for this origin. |
| Build fails with `VITE_LLM_API_KEY assertion` | A real key is set in `.env.local`. Production builds ship NO key — clear `.env.local` before `npm run build`. |
| Chat says "I'm running on simulated responses" | Either no BYOK key configured OR key invalid. Check Settings → LLM → Test connection. |

## Architecture in 30 seconds

- **Frontend-only SPA** (Vite + React 19 + TypeScript). No backend.
- **State:** Zustand (configStore + intelligenceStore + listenStore + projectStore).
- **Persistence:** sql.js + IndexedDB locally; cross-tab Web Locks coordinate writes.
- **LLM:** 6 adapters (Claude / Gemini / OpenRouter / Simulated / AgentProxy / Fixture) behind a single `LLMAdapter` interface. Cost cap pre-call. AbortSignal plumb-through to SDKs.
- **Voice:** Web Speech API push-to-talk → same chat pipeline as text.
- **AISP:** Crystal Atom in system prompt — math-first 512-symbol vocabulary; under 2% ambiguity. See `bar181/aisp-open-core` for the full spec.

## Next steps

- Read the [README](../README.md) for the full feature inventory.
- Read [SECURITY.md](../SECURITY.md) for the BYOK contract + privacy promises.
- Browse [docs/adr/](../docs/adr/) for the 44 architecture decision records.
- File issues at [github.com/bar181/hey-bradley-core/issues](https://github.com/bar181/hey-bradley-core/issues).

---

*Last updated: 2026-04-27 (P20 MVP-close).*
