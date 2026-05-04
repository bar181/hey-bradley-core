# AISP and the Handoff Problem (or: Why Your AI Keeps Building the Wrong Thing)

> Eight Crystal Atoms. 512 native LLM symbols. Ambiguity gate at less than 0.02.
> Why the bridge between "what to build" and "the AI building it" is broken without one.
> Date: 2026-05-04 · Hey Bradley team

You wrote a prompt. The AI returned code. The code does the wrong thing.

You re-wrote the prompt. The AI returned different code. It does a slightly different wrong thing. You add detail. You add examples. You add constraints. By the seventh round you are essentially writing pseudocode in English, hoping the AI translates it correctly.

This is not a model problem. The frontier models read your prompt fine. The problem is that English is ambiguous and your prompt is leaking ambiguity into the build.

The handoff between "what you want" and "the AI building it" needs a contract, not a conversation. That contract has a name. It is called AISP.

---

AISP stands for AI Symbolic Protocol. It is a math-first neural-symbolic language with 512 symbols that frontier LLMs already understand natively. No prompt engineering required. No "you are an expert software architect" preamble. The symbols are the language. The language is unambiguous on purpose.

The creator is Bradley Ross — the same person who designed Hey Bradley. The public spec lives at https://github.com/bar181/aisp-open-core. We use it as the contract layer between the design stage of a project (someone has an idea) and the dev stage (an AI is building it).

The hard ambiguity gate for production AISP is `Ambig < 0.02`. Lower is better. Platinum tier is 0.75 or above on the quality axis. We measure against both at every Crystal Atom output.

Here's why this matters in concrete terms. We ran a brutal-honest review of our own pipeline at P100 — checked AgentProxy response shapes against the AISP Zod schema, traced the pipeline through real submission paths, scored against the SOTA. The first composite came back at 88 out of 100. We were proud of it. Then we ran the format-verification phase (P100 W2 / FMT-VERIFY) and discovered that three helpers we'd documented as "wired" were dead code in production. Revised the score honestly down to 79 out of 100. Wired the helpers in the next sprint. Came back to 84 out of 100.

That swing from 88 to 79 to 84 is what happens when you measure your AI handoff against an unambiguous contract. The contract caught us. Without it, we would have shipped the 88 and never known.

---

The AISP contract for Hey Bradley breaks down into eight Crystal Atoms. Each atom is a small typed module with four blocks: Σ for structure, Γ for grounding rules, Λ for logistics and fallbacks, Ε for evaluation gates. The atoms are bounded fan-out by design. No atom does too much. Each one has a single, clearly-named job.

**PATCH** is the atom that turns intent into a JSON Patch — the actual change the website preview applies. It has eighteen canonical section types in its enum. Adding a nineteenth would require touching five source files plus a regression test (we wrote that test at P109, ADR-137).

**INTENT** classifies what the user actually wants. Verb. Target. Ordinal. It is the front door of the chat pipeline.

**SELECTION** picks which template best matches the intent. The original LLM-driven version (ADR-057) was superseded twice — first by template intelligence (ADR-098 / P72), then by a deterministic matcher (ADR-134 / P106) that deleted the orphan code we'd been carrying for forty phases.

**CONTENT** generates the section content. Tone. Length. Voice. Section-aware defaults.

**ASSUMPTIONS** lifts unstated constraints. If the user says "make it pop," ASSUMPTIONS turns that into measurable axes (saturation, contrast, weight) that the rest of the pipeline can act on.

**DECOMP** is the front-of-pipeline multi-clause splitter. The user says "make the hero brighter and the testimonials pop and add a contact form." DECOMP splits that into three todos with their own confidence scores and routes each one through the rest of the pipeline.

**PROCESS** turns a project description into phases, sprints, waves, and agents. It is the math behind the process map you see in Planning mode at heybradley.app.

**DDD** turns a project description into bounded contexts and the relationships between them. Domain-driven design as a typed output, not a methodology document.

**AGENT** takes a wave of work and produces ordered AgentSpec entries with disjoint file ownership and concrete Definition-of-Done checklists. This is the atom that makes the AI handoff actually trustworthy — every agent in the wave knows exactly which files it owns, exactly what it has to deliver, and the disjoint-ownership invariant guarantees the parallel dispatch will merge cleanly.

That's the whole suite. PATCH plus INTENT plus SELECTION plus CONTENT plus ASSUMPTIONS plus DECOMP plus PROCESS plus DDD plus AGENT. Five baseline atoms shipped through Sprints C, D, and E. Three more added in the Agentic Workbench arc (P92 through P94). The suite closed at P94 with AGENT — no further atoms planned for open-core.

---

You expected this post to say AISP solves the handoff problem. It doesn't quite. Here is what it actually does.

We thought AISP would make AI agents stop building the wrong thing. We found AISP makes us stop *asking for* the wrong thing.

The Crystal Atom shape forces specificity at the design stage. You cannot leave a Σ block with TBD. You cannot ship a Γ rule that does not constrain anything. You cannot pretend the Ε evaluation gates do not exist when the build fails them. The atoms force the spec author — human or AI — to commit to typed shapes before code gets written.

That is the part most prompt engineering misses. The AI was not the bottleneck. The ambiguity in the prompt was the bottleneck. AISP closes the ambiguity at the source.

When we run the Hey Bradley pipeline against the same prompt twice, we get the same Crystal Atom output twice. When we hand the bundle to Claude Code, the implementation choices it makes are bounded by the Σ contracts, not by whatever vibe the model happened to be in that day. The pipeline is deterministic where it can be (the rule-based classifiers, the deterministic matcher, the disjoint-fan-out PROCESS atom) and AISP-bounded where it cannot (the LLM enrichment paths, gated by `Ambig < 0.02` on output).

The handoff is no longer "here is what I want, please figure out the rest." The handoff is "here is the markdown bundle, here are eight Crystal Atoms, here is the process map, here is the domain model, here are the AgentSpec entries with their disjoint file ownership, please execute the wave." That is a contract, not a conversation.

---

The stakes if you don't do this are the iteration spiral nobody finishes. You and the AI in a loop. You re-explain. The AI re-builds. Three sessions later, the project is half-done in three different directions and you are tired.

The stakes if you do do this are not zero either. You have to actually write the spec. You have to commit. AISP forces specificity in the same way TypeScript forces type discipline — it is annoying right up until it is the thing keeping your project shippable.

The choice is real. We made it. We shipped 109 sealed phases against an AISP-bounded contract layer with a 237-test cumulative regression at the seal gate, both tsc strict configs clean, and zero new dependencies after P104. The discipline is reproducible. The numbers are what they are.

---

If you want to try the contract, the simplest move is the plugin.

`/plugin install bar181/hey-bradley` in your Claude Code session. Then `/spec-init` against any project idea you have rattling around. The plugin runs the project through the Crystal Atom suite and emits the spec bundle. Hand the bundle to Claude Code in your own repo. Watch what gets built.

If the spec is right, the build is right. If the spec is wrong, the build is wrong, and now you can see exactly which Crystal Atom output was wrong about which assumption. You can fix the spec. The cost of one fix at the spec layer is a tenth of the cost of three rounds of re-prompting at the build layer.

That is the bridge AISP gives you. Not a faster AI. A more honest contract.

---

The full AISP reference is open. Read it at https://github.com/bar181/aisp-open-core. The 512-symbol legend is in the spec. The Crystal Atom contracts for Hey Bradley are in `connections/docs/specs/aisp/` if you want to see how a real production pipeline uses the protocol — eighteen atom specs, all `Ambig < 0.02` at gate, all greppable from the connections layer.

If you build something with AISP and learn something we got wrong, tell us. The protocol is open core. The supersession chain is open. The thing nobody can do alone is figure out what the right contract layer between humans and AI actually looks like — that takes a community, and we are at the start of having one.

---

*Hey Bradley is open core. Try the workbench at https://heybradley.app · Plugin: `/plugin install bar181/hey-bradley` · GitHub: https://github.com/bar181/hey-bradley-core*
