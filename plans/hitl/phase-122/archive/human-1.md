# Hey Bradley — Updated To Do List
**Date:** May 8, 2026 · Post screenshot review

---

## Priority 1 — Fix Before Sharing Any URL

### Public Site
- [ ] **Landing preview card** — the skeleton wireframe card below the hero 
  CTAs looks like a broken loading state. Replace with either:
  (a) An actual animated preview showing a real built site, or
  (b) Remove it entirely and let the hero stand alone
  This is the single worst thing on the public site right now.
- [ ] **Nav simplification** — still shows Capstone · Blog · Docs. 
  Run P122: simplify to Try it · Docs · About only.
- [ ] **Remove "Coming from another builder?"** — unnecessary copy, 
  dilutes the hero message.

### Builder — Default Template
- [ ] **Replace "Welcome to Your Website" default** — the analytics 
  stock photo hero is a terrible first impression. Every new user 
  sees this. Options:
  (a) Empty state with a clear prompt to start ("Describe your site...")
  (b) A Hey Bradley-branded default that demonstrates the tool's 
      own aesthetic, not a generic SaaS template
  This is the single worst thing in the builder right now.

### Builder — Layout
- [ ] **Left panel horizontal scroll** — confirmed visible scrollbar. 
  Fix: overflow-x:hidden + min-w-0 on all flex children in left panel.
- [ ] **Chat toolbar clipping** — PROFESSIONAL button cut off at right 
  edge in chat mode. Toolbar row needs overflow handling or 
  wrapping. Use shadcn ScrollArea horizontal on the toolbar.

---

## Priority 2 — High (this week)

### Builder — UX
- [ ] **Panels resizable** — implement shadcn ResizablePanelGroup. 
  Left / preview / right panels all drag-resizable. 
  Default: 25% left · 50% preview · 25% right.
- [ ] **Agentics card grid** — JSON Config card is isolated alone 
  in bottom row. Fix: either add an 8th card to pair it, 
  or change grid to auto-fit so 7 cards fill more naturally. 
  Consider 2-col layout if content warrants it.
- [ ] **Right panel CONTENT fields** — Title, Description, Tag Line, 
  Main Button, Extra Button, Social Proof are all raw inputs. 
  Confirm these are shadcn Input components, not raw HTML inputs.
- [ ] **SIMPLE / EXPERT tabs** — confirm these are shadcn Tabs, 
  not custom styled divs.

### Public Site  
- [ ] **Hero orb** — currently subtle on the landing page. 
  Strengthen the glow — the landing bg looks flat grey, 
  not the dramatic dark + crimson shown in the presentation deck.
- [ ] **Below-fold content** — after the hero there's nothing. 
  Add 3 stats + 3 steps per P122 architecture before footer.
- [ ] **Footer** — missing entirely. Add: 
  Blog · Open Core · GitHub · Built with AISP · Harvard ALM 2026.

### Gemini Demo Mode
- [ ] **Phase 122b** — /api/demo-chat edge function, Gemini 2.5 Flash, 
  server-side key, IP rate limit, dollar cap in Google AI Studio. 
  Required before capstone reviewer URL is shared.

---

## Priority 3 — Before Open Core Launch

### Builder — Polish
- [ ] **Listen mode orb** — already looks great (Image 5). 
  Keep as-is. Confirm it doesn't interfere with panel layout 
  at narrow widths.
- [ ] **AISP Crystal Atom view** — already looks great (Image 1). 
  Keep as-is.
- [ ] **Section list in Builder tab** — left panel shows Hero, 
  QUICK ADD, More Sections. The "More Sections" label is weak — 
  rename to something that communicates action: "Add Section +" 
  or use a proper Add button.
- [ ] **Loading states** — every async action needs a visible indicator.
- [ ] **Error states** — API failure needs toast, not silent fail.
- [ ] **Empty state** — before any voice/chat input, 
  preview panel shows the default template. 
  Should show a "start here" prompt instead.

### Builder — Verification
- [ ] CF#4 BYOK smoke test
- [ ] CF#5 STT calibration (10 voice inputs Chrome)
- [ ] Export bundle — CLAUDE.md, ddd-contexts.md, adr-bundle/, 
  tdd-scaffold.md all generate correctly in ZIP
- [ ] Cost cap — all 4 adapters verified
- [ ] WASM sql.js — copy to public/, update locateFile

### Public Site — Pages
- [ ] /docs rebuild as featured guide (per P122)
- [ ] /about rebuild clean — abstract + bio + 2 repo cards (per P122)

---

## Priority 4 — Post Open Core (signal-gated)

- [ ] Supabase auth + saved projects
- [ ] 100 free prompts per account
- [ ] Shareable preview URL
- [ ] Stripe Pro $99/month
- [ ] Teams $299/month
- [ ] AISP arXiv preprint (time-sensitive — do early)
- [ ] HAI-OS system paper
- [ ] Logan / Google AI Studio outreach
- [ ] Agentics Foundation certification program

---

## What's Actually Working — Don't Touch

| Component | Status | Note |
|---|---|---|
| AISP Crystal Atom view | ✅ Great | Clean, professional, leave it |
| Listen mode UI | ✅ Good | Orb, HOLD TO TALK, clean layout |
| Dark theme consistency | ✅ Good | Crimson nav bar solid |
| Agentics card grid | ✅ Good | Minor alignment fix only |
| Chat mode flow | ✅ Good | Toolbar clip is the only issue |
| Preview rendering engine | ✅ Works | Site builds correctly |
| SAVED indicator | ✅ Good | Top right, visible |

---

## Swarm Directive — P122 Immediate

```
SWARM: Phase 122 — Three fixes, one session.

Fix 1: Landing preview card
Remove the skeleton wireframe card below the hero CTAs.
Replace with: a simple 3-step "how it works" row.
  Step 1: 🎙 Describe — talk through your idea
  Step 2: ⚡ See it — site builds while you speak  
  Step 3: 📄 Ship it — export spec, hand to dev
Dark cards, crimson icons, centered layout.
Do not add a preview frame — no placeholder, no skeleton.

Fix 2: Nav simplification  
MarketingNav.tsx: 
  Remove: Capstone, Blog
  Keep: Docs, Try Builder (rename to "Try it")
  Add: About
  Final: Hey Bradley · Try it · Docs · About
  Remove "Coming from another builder?" text from Welcome.tsx

Fix 3: Default builder template
Replace "Welcome to Your Website" default with either:
  (a) A Hey Bradley demo site: 
      Title: "Hey Bradley"
      Tagline: "Describe it. See it."
      Hero style: dark, crimson accent
      No stock photo — use a gradient or orb visual
  OR
  (b) Empty state: 
      No preview rendered until first input
      Center panel shows: "Describe your site to get started"
      with a subtle orb background

Build must pass. No console errors.
Only touch: Welcome.tsx, MarketingNav.tsx, 
default template config.
Do not touch: builder panels, AISP view, 
listen mode, chat mode.
```