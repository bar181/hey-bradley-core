That's the right architecture and the right sequencing. Two-track approach:

**Track 1 — Now (2 days)**
Vercel deploy with a preset Gemini key, hard dollar cap set in Google AI Studio (e.g. $10-20 max spend), URL shared with capstone reviewers. No auth, no accounts, no persistence. Just works. If someone burns through it, you top up or revoke. Acceptable risk for a known small audience.

**Track 2 — heybradley.app proper**
Supabase auth + 100 free prompts per account + BYOK. This is the real product. Build it properly after the open core signal, not under time pressure.

**The key insight:** don't conflate the two. The Vercel URL is a demo link for people you trust. heybradley.app is the product. They can coexist — different URLs, different configs, different expectations.

**Immediate swarm directive:**

```
SWARM: Phase 122 — Gemini demo mode for Vercel deploy.
Timebox: 1 session. Ship today.

One deliverable only:
- Vercel API route /api/demo-chat
- Calls Gemini 2.5 Flash
- GEMINI_API_KEY from Vercel environment (server-side)
- Simple IP rate limit: 20 req/hour
- UI: pre-filled demo mode, no key required
- Dollar cap: set in Google AI Studio dashboard (not code)

Do not build: auth, accounts, prompt counting, 
Supabase, session management, BYOK switching UI.
Those are Track 2.

Exit: capstone reviewers can use the site 
without providing any key.
```

Then separately, once open core has signal:

```
Track 2 trigger conditions:
- 30-day beta data collected
- BYOK friction confirmed as drop-off point
- OR capstone URL has burned through demo budget
  and conversion to accounts makes sense

Track 2 scope:
- Supabase auth (email or Google OAuth)
- 100 free prompts per account (server-side counter)
- BYOK for unlimited
- Stripe when ready
- Migrate to heybradley.app
```

The dollar cap in Google AI Studio is your safety net — set it before the swarm starts, not after. What budget are you comfortable with for the capstone window?