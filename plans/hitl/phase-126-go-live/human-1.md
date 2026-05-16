Good. LLM is healthy. One blocker before promotion: CI is broken. Here are the updated instructions.

---

**SWARM: Hey Bradley — CI fix then promotion**
**Status:** LLM PASS · CI BLOCKED · promotion pending

---

**Step 1 — Fix CI (do this first)**

```
Use Option 3 — .nvmrc + engines + gates.yml update.

Reason: Option 1 fixes today but breaks again next time
you npm install on a different Node version. Option 2
requires manual discipline every session. Option 3 makes
one authoritative source of truth for all environments.

Three file changes:

File 1: .nvmrc (create new)
  Contents: 24

File 2: package.json
  Add or update engines field:
  "engines": { "node": ">=24.0.0" }

File 3: .github/workflows/gates.yml
  Line 19: node-version: '22' → node-version-file: '.nvmrc'
  Line 39: node-version: '22' → node-version-file: '.nvmrc'
  (use node-version-file not node-version so both
   jobs read from .nvmrc automatically)

Commit message:
  "fix(ci): pin Node 24 via .nvmrc + engines + gates.yml"

After committing, confirm CI passes on the branch.
Do not proceed to Step 2 until CI is green.
```

---

**Step 2 — P125.7 retro addendum**

```
Write plans/hitl/phase-125/retrospective-addendum.md

Structure:
  - Date: today
  - Original retro verdict: 63/100 do not seal
  - What shipped after the retro:
      e3af6e3e: Harvard depth + Cormorant + image list
      0cc4fa56: HeroAnimated + D3 atom galaxy + sparklines
      8742a272: Unsplash photography + listen-mode E2E doc
      600a08ad: verification harness + real-browser image load
  - Updated composite score (honest rescore same rubric)
  - Updated verdict: seal or continue
  - Carry-forwards for P126

Commit alongside or after Step 1.
```

---

**Step 3 — ruvector pin decision**

```
ruvector has drifted to feature branch d209fc4c
vs pinned heads/main (1078cc54).

Feature branches are unstable. Recommended action:

  cd upstreams/ruvector
  git checkout main
  git pull origin main
  cd ../..
  git add upstreams/ruvector
  git commit -m "fix: reset ruvector submodule to heads/main"

If owner prefers to defer, document in the P125.7
addendum as an explicit carry-forward. Do not
defer silently.
```

---

**Step 4 — Vercel preview test**

```
Only after Steps 1-3 are committed and CI is green.

Push branch:
  git push origin swarm/p125-visual-overhaul

Vercel auto-deploys a preview URL.

Run smoke test on preview:
  1. Open preview URL /builder
  2. Type: "Change the hero headline to Ship faster"
  3. Verify:
     - Gemini generateContent → 200
     - Valid JSON-Patch applied to preview
     - CostPill increments
     - No key in browser IndexedDB
     (same checks as local, now on Vercel infrastructure)

Pass criteria: identical to local test result.
```

---

**Step 5 — Promote to main**

```
Only after Step 4 passes.

Open PR: swarm/p125-visual-overhaul → main

PR description must include:
  - Summary: P125 through P125.6 visual overhaul
  - LLM local: PASS (gemini-2.5-flash, 569ms, pong)
  - LLM Vercel preview: PASS (confirm after Step 4)
  - CI: PASS (confirm after Step 1)
  - Composite score from P125.7 addendum
  - ruvector pin status

Merge after all gates green.
Run one production smoke test after merge.
```

---

**Completion checklist:**

```
[ ] CI green (Node 24 via .nvmrc)
[ ] P125.7 retro addendum committed
[ ] ruvector pin documented or reset
[ ] Vercel preview LLM smoke: PASS
[ ] PR opened with full description
[ ] Merged to main
[ ] Production smoke test: PASS
```

Report back with CI result after Step 1.