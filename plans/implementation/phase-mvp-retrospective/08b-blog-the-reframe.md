# The Reframe That Changed What We Were Building

> We built a website builder. We were wrong.
> We built a spec factory. We were also wrong.
> We built a top-of-funnel for a web app. That one might stick.
> Date: 2026-05-04 · Hey Bradley team

You have a product idea. You write a North Star document. You commit to it. You start shipping.

Six weeks later, the thing you're shipping no longer matches the thing you wrote down. You have a choice. You can drag the build back to the original North Star and ship something that doesn't quite make sense to the people using it. Or you can update the North Star and ship the thing that the build is telling you it wants to be.

We did the second one. Three times. Each reframe was wrong about something the next one fixed.

This is the post about that.

---

The first North Star was written in March. Verbatim from `plans/initial-plans/01.north-star.md`:

> "A whiteboard that listens, builds what you describe in real-time, and secretly writes enterprise specs behind the scenes."

It made sense at the time. The pitch was simple — pour your idea in one end, get a marketing site out the other, and somewhere in the middle a bunch of math-symbol AISP documents would quietly accumulate for the AI agents downstream. The PMF formula was three things: Builder mode plus Listen mode plus Spec documents. All three required.

We shipped that. P11 through P60 was Builder, Listen, and Specs. The center canvas had four tabs. The two-axis UI was BUILD↔LISTEN crossed with DRAFT↔EXPERT. Everything the original plan promised was in there.

But we noticed something while building it. The interesting artifact was not the website. It was the spec.

People who came in for the website were impressed by the website. People who came in already thinking in agentic-system terms — Claude Code users, Cursor power users, the developers building tools — looked right past the website and asked about the AISP bundle. *Can I export this? Can my AI read this? Does the spec round-trip?*

The website was the surface. The spec was the substance. We were holding the product backwards.

---

We thought we'd built a website builder. We found we'd built a spec factory.

The reframe came at P95, during a planning sprint for the Claude Code export feature. The original design was a ZIP file. Cleaner separation of concerns. One spec per file. The owner asked a question we hadn't asked ourselves: *what's the simplest thing that an AI agent can actually consume?*

The answer was a single markdown file. File markers between sections. Readable, git-versionable, LLM-ingestible, zero dependencies. ADR-122 made it official: the bundle is a markdown file. The bundle IS the canonical Hey Bradley OUTPUT. The website preview is one of three lenses on the same JSON.

The decision changed what the product was. Everything after P96 made more sense because of it. The Spec Workbench (P95, ADR-121) wasn't a feature in a website builder anymore — it was the main interface of a spec factory that happened to also render a website. The Agentic Workbench arc (P85-P101) added three more Crystal Atoms — PROCESS, DDD, AGENT — that turned the spec from a marketing-site description into a full architectural handoff. Process map. Domain model. Agent waves with disjoint file ownership. The bundle stopped being the export and started being the product.

That was reframe two. We were a spec factory.

---

We thought we were a spec factory. We were almost right.

What we missed was the connections layer. The plugin. The MCP server. The npx CLI. We started building those as if they were a co-equal product with the web app — same feature surface, same depth, both shipping at parity. Halfway through the connections sprint, we realized that wasn't right.

If the plugin had Builder mode, why would anyone go to the web app? If the plugin had Listen mode and process maps and the Workbench, the web app became redundant. We were about to compete with ourselves on our own funnel.

So we cut scope hard. The plugin generates specs. It does not preview them. Visualization, iteration, the Builder mode, the Listen mode, the Workbench, the export bundle preview — all of that lives at heybradley.app. By design. The plugin is intentionally incomplete because completion would cannibalize the web app.

The pre-launch sprint at `e506913` made that real with funnel CTAs across three surface patterns — a 30-line-of-code change with strategic weight punching way above its line count. Three surfaces, all pointing at heybradley.app. The plugin sells the web app. The web app sells the spec discipline. Three layers, one funnel, each one pointing at the next.

Reframe three. We are top-of-funnel for the web app.

---

Here's what each reframe got wrong about itself.

Reframe one — "website builder that secretly writes specs" — was wrong about the audience. We thought the audience was non-technical founders who needed a website. The actual audience was developers who needed a spec they could hand to an AI agent. The website was a demo for the spec, not the other way around.

Reframe two — "spec factory whose markdown bundle is the output" — was right about the artifact and wrong about the distribution. We were building one product and treating it as one product. The connections sprint forced us to see that distribution surfaces have different jobs. The plugin's job is acquisition. The web app's job is conversion. The bundle's job is satisfaction.

Reframe three — "top-of-funnel for the web app" — is the one we're testing now. We're not sure it's right either. The signal that will tell us is whether L3 to L5 developers — Cursor power users, Claude Code regulars — pull on the plugin and end up at the web app and end up exporting bundles that survive in their own repos. If they do, the funnel works. If they don't, we'll find out what we got wrong about it the same way we found out about the first two: by shipping it, watching, and writing down what doesn't match.

Each reframe corrected a specific blindness. Reframe one assumed the artifact was the website. Reframe two assumed the product was a single experience. Reframe three assumes the bridge between design stage and dev stage is the actual market — that the spec is the shared handoff between two stages that previously had no handoff at all.

---

The lesson, if there is one, is that the right product is rarely the one you started with.

The North Star matters because you need a direction. The reframe matters because directions are not destinations. You write down what you think you're building, you ship some version of it, you watch what users actually do with it, you write down what changed, and the new North Star supersedes the old one with a cross-reference both ways. ADR-style. Greppable. The whole history is there if you want it; the current state is what's load-bearing.

We have ADRs that are SUPERSEDED. ADR-076 was the three-tab mobile nav from Sprint J / P53. ADR-090 superseded it at P69 with a different mobile UX. ADR-057 was the original SELECTION_ATOM LLM-driven 2-step pipeline from Sprint C / P28. ADR-098 superseded it at P72 with template intelligence. ADR-134 superseded it again at P106 by deleting the orphan code that the supersession should have removed forty phases earlier.

The supersession chain is the build. The current product is the leaf node. The reframe is what happens when the leaf moves.

---

If you're shipping something and the thing you're shipping no longer matches the document you wrote two months ago, you don't have a problem. You have data.

The data is telling you which assumption was wrong. Update the North Star. Mark the old one SUPERSEDED. Cross-reference in both directions. Keep the chain greppable.

Then ship the thing the build is telling you it wants to be.

---

If you want to see the reframe in action, try the plugin first. Hand it a project description. Watch what falls out — a spec bundle, ready for your AI agent. Then come to heybradley.app and see what the bundle looks like rendered as a website preview, a process map, a domain model, and the eight Crystal Atoms that make the handoff trustworthy.

That round trip — plugin to web app to bundle to your repo — is the funnel we built reframe three around. We'll know within a few months whether the funnel is right. Until then, the supersession chain stays open.

The next post in this series is about AISP — the math-first symbolic protocol that makes the spec trustworthy enough to hand to an AI agent in the first place. Without AISP, the bundle is just markdown. With AISP, it's a contract.

---

*Hey Bradley is open core. Try the workbench at https://heybradley.app · Plugin: `/plugin install bar181/hey-bradley` · GitHub: https://github.com/bar181/hey-bradley-core*
