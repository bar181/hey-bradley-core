# Pre-Launch Human Todo List — v2.0.0-RC1

> Step-by-step ordered actions for the human review session.
> Companion: `docs/launch/pre-launch-status.md` (full context).
> Generated at P120.5 seal — 2026-05-06.

Each step is numbered, sequential, action-oriented. Don't skip — each step assumes the previous step completed cleanly.

---

## 1. Read the status doc end-to-end (10 min)

```bash
$EDITOR docs/launch/pre-launch-status.md
```

**Expected outcome**: you've internalized the 13-branch stack shape, the 5 human-only actions, and the 6 honest known gaps.

**Decision criterion**: if anything in Section 8 ("Honest known gaps") is a launch blocker for you, stop here and queue another sprint. Otherwise proceed.

---

## 2. Start the local dev server (1 min)

```bash
git checkout swarm/p120.5-under-the-hood
npm install                       # if you haven't recently
npm run dev
```

**Expected outcome**: dev server up at `http://localhost:5173/` (or the port printed in the terminal).

---

## 3. Walk every public page in light mode (15-20 min)

In a fresh browser tab, visit each in order:

- `/` (Welcome — Apple-style scroll story)
- `/about` (Don Miller voice; AISP research finding paragraph)
- `/blog` (3-category filter — Story / Technical / For teams; 15 posts)
- `/blog/describe-it-see-it` (P118 relocation target with comparison table)
- `/blog/the-handoff-that-changes-everything` (technical moat blog)
- `/research` (engineer-track home; check the new "Real time, not rebuild" section after Start-here strip)
- `/for-teams` (product-team audience; check the new "Real time, not rebuild" section between Section 2 and Section 3)
- `/contact` (LinkedIn + GitHub + Capstone)
- `/open-core` ("For everyone else, start here →" link to /)
- `/walkthrough` (6-scene scroll story; brand invisible until Scene 6)
- `/aisp` (Geek-mode landing — full AISP detail)
- `/docs` (technical docs)
- `/new-project` (the actual builder entry — verify it loads cleanly)

**Expected outcome**: every page renders without console errors; no 404s; nav links work top-to-bottom.

**Decision criterion**: if any page renders broken, halt here and triage. Otherwise note any copy / spacing nits in a scratch file and continue.

---

## 4. Toggle dark mode and walk every page again (10 min)

Open browser DevTools → Console → run:

```js
document.documentElement.classList.add('dark')
```

Walk the same 13 pages from Step 3. Flip back to light with:

```js
document.documentElement.classList.remove('dark')
```

**Expected outcome**: parchment palette flips to dark surfaces (paper #faf8f5 → #1a1a1a; ink #2d1f12 → #f3f3f1). Brand-locked Crimson `#A51C30` retained. Two intentional dark-band CTA gradients on About + Research stay dark in both modes (they're deliberate visual hierarchy in light mode).

**Decision criterion**: any text on dark mode that's unreadable (low contrast) is a P121 carry-forward, not a launch blocker. The mode-toggle UI itself is Tier-2.

---

## 5. Verify the Walkthrough on a real mobile device (10 min)

On your actual iPhone or Android:

- Open `http://<your-laptop-LAN-IP>:5173/walkthrough` (or use `ngrok http 5173` for tunneling)
- Walk the 6 scenes by scrolling
- Verify the scroll-snap behavior
- Verify the "Watch the walkthrough →" CTAs load correctly
- Verify reduced-motion: enable iOS Settings → Accessibility → Motion → Reduce Motion; reload; animations should be neutralized

**Expected outcome**: walkthrough story works on real-device viewport (375px / 390px / 428px); CTAs are tappable (44px floor); reduced-motion disables animations cleanly.

**Decision criterion**: if walkthrough is broken on real mobile, halt and queue a P121.5. The walkthrough is P118.5's whole point.

---

## 6. Make the calibration call (5 min)

You've now seen everything in light + dark + mobile. Decide:

- **Do you want any P120.5 calibrations?** Examples: rename "Under the hood" to something else? Tweak "Real time, not rebuild" copy? Adjust nav order?

**Decision criterion**:
- If YES → spawn one more single-agent closer (≤30 LOC delta) before launching. Document the change as a P120.7 calibration.
- If NO → proceed to merge.

---

## 7. Run the merge sequence (15-30 min)

Per Section 4 of `docs/launch/pre-launch-status.md`. Sequential merge from `main`:

```bash
git checkout main
git pull origin main

git merge swarm/p110-adr-export
git merge swarm/p111-dogfood-gates
git merge swarm/p112-gap-closure
git merge swarm/p113-quality-push
git merge swarm/p114-feature-audit-fix
git merge swarm/p115-visual-quality
git merge swarm/p116-final-polish
git merge swarm/p117-section-capability
git merge swarm/p118-simple-messaging
git merge swarm/p118.5-walkthrough
git merge swarm/p119-site-polish
git merge swarm/p120-audience-routing
git merge swarm/p120.5-under-the-hood
```

**Expected outcome**: 13 merge commits land on main; tree state matches `swarm/p120.5-under-the-hood`.

**Decision criterion**: if any merge surfaces a conflict, the resolution rule (per Section 4 of pre-launch-status.md) is **keep the most recent phase's version** for CLAUDE.md and `docs/adr/README.md`. If conflicts surface anywhere else, halt and triage.

---

## 8. Run the full test suite locally (5-10 min)

```bash
npx playwright test --project=chromium
```

**Expected outcome**: all ~1729+ tests GREEN. No mobile project tests run by default (they're opt-in via `testMatch` per ADR-136 / P108).

**Decision criterion**: any RED test halts launch. Triage and fix-pass before proceeding.

---

## 9. Verify tsc clean (1 min)

```bash
npx tsc --noEmit
npx tsc -p tsconfig.app.json --noEmit
```

**Expected outcome**: both exit 0 with no output.

**Decision criterion**: if either reports errors, halt and fix.

---

## 10. Tag v2.0.0-RC1 (30 sec)

```bash
git tag v2.0.0-RC1
```

**Expected outcome**: tag created locally pointing at the merged main tip.

**Decision criterion**: if you want to reconsider the version number (e.g., v2.0.0-RC2, v2.0.0-beta.1), do it now — `git tag -d v2.0.0-RC1` reverts.

---

## 11. Push to remote (1 min)

```bash
git push origin main
git push origin --tags
```

**Expected outcome**: GitHub remote `bar181/hey-bradley-core` shows the new commits + the v2.0.0-RC1 tag.

**Decision criterion**: this is the point of no return for the merge structure. After push, any rollback is a force-push or a revert commit.

---

## 12. Live BYOK smoke test (15 min, $0.05)

1. Open the deployed Vercel/Netlify URL OR `npm run dev` again on the freshly-merged main
2. Click "Try Builder"
3. Add your Anthropic / OpenAI / Gemini API key in the BYOK panel
4. Submit 5 prompts × 3 providers = 15 calls total
5. Verify in browser DevTools → Network: each call returns; cost cap doesn't fire spuriously; latency badge shows real numbers
6. Open the Conversation Log tab in EXPERT mode; verify `request_id` drill-down works; verify BYOK redaction (no `sk-` / `AIza` shapes leak into log_events rows)

**Expected outcome**: cost cap correctness from P114/F3 holds with real models; production write paths from P107/A5 emit log_events; storytelling preset wire from P114/F2 fires; voice extraction from P113/A4 emits voiceAttributes when chat-mode submit on whole-site/initial prompt.

**Decision criterion**: any cost-cap bypass, BYOK leak, or 5xx halts launch — that's CF#4 not converging. Document the failure and queue P121.

---

## 13. Record the demo video (60-90 min)

Use the script at `docs/launch/demo-video-script.md`.

- Tool: Loom / OBS / QuickTime
- Length: 2-3 min
- Voice: founder-direct (Don Miller voice per ADR-091)
- Path: describe → see → export → handoff

**Expected outcome**: shareable video URL; uploaded to YouTube / Vimeo / Loom; embed-ready for Show HN post.

**Decision criterion**: if the video reveals a bug not caught by tests (UX nit, copy wrongness, render glitch), pause launch and queue P121. The video is the final visual review.

---

## 14. Draft Show HN copy (15 min)

Open `docs/launch/show-hn-post.md` (P84 / OC-18 / ADR-109 owner-launch-checklist). Customize:

- Title hook: "Show HN: Hey Bradley — describe your site, see it built, export the spec for any AI coding assistant"
- 55%-problem framing
- AISP differentiator
- Open-core MIT-licensed badge
- Demo video link (from Step 13)
- Links to the 3 P118 blog posts (`/blog/describe-it-see-it`, `/blog/why-we-built-this-the-honest-version`, `/blog/the-handoff-that-changes-everything`)

**Expected outcome**: post copy ready in clipboard / draft.

---

## 15. Schedule Product Hunt launch (30 min)

1. Use copy from `docs/launch/product-hunt-tagline.md`
2. Submit on producthunt.com → Submit a product
3. Schedule for next available Tuesday or Wednesday (highest-traffic days for technical products)
4. Tagline: "The website builder that finally works the way you talk."
5. Description from `docs/launch/release-notes-v2.0.0-rc1.md`
6. Demo video link
7. GitHub link: https://github.com/bar181/hey-bradley-core
8. AISP link: https://github.com/bar181/aisp-open-core

**Expected outcome**: PH launch scheduled; you'll get email reminder ~24h before.

---

## 16. Post to LinkedIn / X / Reddit (30 min)

LinkedIn:
- Long-form (Don Miller voice)
- 3 paragraphs: the 55% problem → the AISP solution → the open-core invitation
- Embed demo video

X / Twitter:
- Thread (8-12 tweets)
- Open with: "I built a website builder that finally works the way you talk. Here's why every AI builder you've tried regenerates instead of patches — and why that one architectural choice is the entire difference."
- End with GitHub link + demo video link

Reddit:
- r/programming (technical depth — link the JSON-patch handoff blog post)
- r/SideProject (founder narrative — link the why-we-built-this blog post)
- r/LocalLLaMA (BYOK angle — link the Open Core page)

**Expected outcome**: 3 social channels posted; track inbound clicks via UTM tags if possible.

---

## 17. Announce to Agentics Foundation beta (15 min)

Use copy from `docs/launch/agentics-foundation-beta.md`. Channel: Agentics Foundation Slack / Discord (whichever the foundation uses for beta announcements).

**Expected outcome**: 20-50 beta users notified; capture feedback channel for the first week.

---

## 18. Confirm launch metrics tracking is in place — OR note that it isn't (5 min)

The open-core build does NOT ship analytics by design (ADR-043 BYOK trust boundary; no telemetry leaves the user's browser).

**Decision**:
- If you want launch metrics, add `posthog` / `plausible` / similar in a Tier-2 commercial fork — NOT in the open-core repo
- If you don't, accept that you'll measure launch via GitHub stars + Show HN comments + Product Hunt upvotes + manual social engagement

**Expected outcome**: you've made the conscious choice; it's documented in the launch retrospective.

---

## 19. (Optional) Wire husky pre-commit hook (5 min)

If you want local pre-commit gates (CI gates run automatically on every PR via `.github/workflows/gates.yml`):

```bash
echo "" >> .husky/pre-commit
echo "bash scripts/run-gates.sh || exit 1" >> .husky/pre-commit
git add .husky/pre-commit
git commit -m "Wire husky pre-commit to run gates locally"
git push
```

**Expected outcome**: every local commit now runs check-secrets + invariants + adr-lint before allowing the commit.

**Decision criterion**: skip if you prefer fast local commits — CI catches the same issues at PR time.

---

## 20. Launch retrospective (Day 7 — schedule a calendar reminder now)

One week after launch, write a launch retrospective at `plans/implementation/launch-v2.0.0-RC1/retrospective.md` covering:

- What worked
- What broke
- Inbound signal (stars / comments / inquiries / Tier-2 commercial leads)
- The first 3 things to fix in v2.0.0-RC2 / v2.1.0

**Expected outcome**: closure on the open-core arc P11 → v2.0.0-RC1.

---

**Total estimated time**: 4-6 hours of focused work, spread across 1-2 days. The slowest steps are the demo video (60-90 min) and the social rollout (30+ min × 4 channels). Everything else is gated by terminal speed.

Good luck. Ship the thing.
