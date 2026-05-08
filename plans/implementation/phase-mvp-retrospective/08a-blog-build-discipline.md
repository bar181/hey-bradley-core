# How We Built a Spec-First Workbench in 109 Phases (And What Almost Broke Us)

> Six weeks of working sessions. 109 sealed phases. 128 ADRs. 237 regression tests at the gate.
> Five times we caught ourselves lying — at the seal, in writing.
> Date: 2026-05-04 · Hey Bradley team

You have a project. You have an AI agent. You have a CLAUDE.md and a vague sense that you should write things down.

A week in, the AI is doing weird things. It deleted a file you didn't ask it to delete. It re-introduced a bug you fixed two sessions ago. It cheerfully claims "all tests passing" while one of your specs has been silently skipped for three commits. You are not sure what just happened. Neither is the AI.

This is the part nobody talks about. Agentic engineering at speed is a discipline problem, not a tooling problem. We learned that the hard way over six weeks and 109 phases.

---

The discipline we landed on is small. There are only four pieces.

The first piece is the **End-of-Phase triplet**. Every phase folder ships three files: a preflight that names what's about to be built, a session-log that records what actually happened, and a retrospective that says what to keep, drop, or reframe. The triplet is non-negotiable. It is the smallest unit of memory the next phase can read without re-deriving context.

The second piece is the **ADR per architectural decision**. Every time we had to pick between two roads, we wrote a 120-line markdown file capping the answer. Status header. Decision section. Cross-references in both directions — predecessors AND supersessions. The chain is greppable. ADR-057 became ADR-098 became ADR-134, and each one points at the others. You can read the build by following the pointers.

The third piece is **disjoint-scope parallel agents with a closer**. Three to seven agents in Wave 1, each with non-overlapping file ownership. One closer agent in Wave 2 who touches only the ADR, the test, the EOP triplet, and the CLAUDE.md sync. Zero merge conflicts across hundreds of dispatches. The pattern existed as convention from P74 onward; we promoted it to a Crystal Atom contract guarantee at P94 (ADR-120, Γ R3 + Ε V1 — the "disjoint ownedFiles" invariant).

The fourth piece is the **brutal-honest review**. Four reviewer perspectives — UX, Functionality, Security, Architecture — running in parallel against the same artifact. PASS / PARTIAL / FAIL verdicts with three to five specific findings each. We ran this pattern at every Sprint seal from P38 onward. It worked because nobody was diplomatic. The reviewers were named perspectives, not people, and the perspectives had no career interest in pretending the work was clean.

That's it. Triplet, ADR, disjoint-scope dispatch, brutal review.

---

Here's the part where you expect the post to say "and it all went perfectly." It didn't.

We thought we had a clean process. We found we had five self-inflicted regressions hiding inside it.

The first one we caught at P104. The phase sealed claiming a runtime validator was "wired" into production. Someone — maybe an agent, maybe a closer, definitely a mistake — wrote that down. P105 went looking for the call sites. There were zero. The validator existed as a function. It had not been imported anywhere except its own tests. The seal was honest in intent and wrong in fact. We fixed it in the next sprint and codified the rule: "wired" now requires a hard test asserting at least one production import plus invocation. P105.4 and P105.5 enforce it.

The second was bigger. ADR-127 declared `cleanTranscript` "wired" too. It was wired only for log payload — the transcript was being cleaned, then logged, then the *uncleaned* version was being sent to the classifier and decomposer and template matcher. Disfluencies and all. P105 / A3 threaded `effectiveText` through fourteen consumers. The audit caught the gap, not the seal.

The third was the audit-grep itself. P108 found a spec the audit had declared empty. The audit had grepped for `^\s*test\(` to count test cases. The spec had `const it = test;` aliased at the top and 24 cases all using `it()`. The audit's regex was the bug. Six P1 items reduced to five P1 plus one audit-error. ADR-136 documents the correction. Future audits test their own grep patterns against known positives and known negatives before they count as findings.

The fourth was the README. `docs/adr/README.md` claimed 38 ADRs. The disk had 127. Eighty-nine ADRs of doc-vs-reality drift. Sixty-plus phases stale. We rebuilt it from disk at P109 and added a regression guard so the next drift is impossible to merge silently.

The fifth was the test culture. We had 1,038 `existsSync` calls across 131 spec files. About 85% of post-P75 specs were filesystem-read regex matchers — they checked whether a file existed and whether a string was inside it. They did not check whether the surface actually worked. Only 26 of 131 specs ever called `page.goto`. We had a documentation suite that called itself a test suite. P108 added behavioral coverage and mobile viewport projects. The systematic prune is still on the carry-forward list.

---

Notice what those five failures have in common.

None of them came from a missing tool. None of them came from a slow model or a flaky API. All five came from places where the discipline almost held but didn't quite — where a claim got into the seal that the next phase had to walk back.

The fix in every case was the same. Name it in the retrospective. Name it in the ADR. Make the next phase's first scope item the closure. Don't paper. Don't round up. Don't move the goalpost. Re-score against the same rubric.

The discipline that mattered wasn't the swarm. It was the willingness to admit, at every seal, what wasn't done. P101 sealed with three persona-floor breaches in writing. P104 declared something wired that turned out to have zero callers. P106 deleted 123 lines of orphan code we'd been carrying for forty phases. P109 rebuilt a README that had been 89 ADRs stale.

None of that was visible from the outside until we wrote it down.

---

If you're starting an agentic build, the practical version of all this is short.

Steal the EOP triplet. Three files per phase folder. No exceptions. The session-log is for what happened; the retrospective is for what to do differently next.

Steal the ADR-per-decision rule. 120 lines max. Status header. Cross-refs in both directions. Future-you needs to be able to grep the supersession chain.

Steal the disjoint-scope wave dispatch. Carve by file ownership. The closer touches only the ADR, the test, and the sync surfaces. Never the agent outputs.

Steal the brutal review. Four perspectives, named not personalized. Three to five findings each. PASS / PARTIAL / FAIL.

And steal the discipline of admitting what's broken at the gate. The reframe that made our build defensible was not anything we shipped. It was the practice of writing the truth down at every seal and fixing it in the next sprint.

---

If you want to see what falls out the other end of this discipline, try the workbench. Type a project description into the Planning mode chat bar. Watch the process map render. Switch to Agentics. Click "Export Claude Code." A markdown bundle drops out — one file with file markers, six logical files inside, ready to hand to your AI agent in your own repo.

That bundle is the real product. The workbench is the spec factory; the bundle is the spec. The discipline above is what makes the spec trustworthy. We earned the right to say it works because we wrote down every place it didn't.

The next post in this series is about the reframe — three times we changed our minds about what we were actually building, and what we learned about each one being wrong about something the next one fixed.

---

*Hey Bradley is open core. Try the workbench at https://heybradley.app · Plugin: `/plugin install bar181/hey-bradley` · GitHub: https://github.com/bar181/hey-bradley-core*
