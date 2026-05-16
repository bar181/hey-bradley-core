# Baseline — North Star template

## Scores (iter-0, against P127 iter-3.1 outputs)

| Site | Score |
|---|---|
| Blog | 42 |
| Portfolio | 58 |
| Marketing | 55 |
| **Composite** | **51.7** |

Gate (≥75): **FAIL** by 23.3.

## Per-site verdicts

- **Blog (42):** Pitch is meta-fluff ("dynamic whiteboard platform"). Source is a personal blog about Bradley building Hey Bradley with named article cards, an author bio, and a newsletter. Spec hallucinated a product concept; missed Bradley as author, missed newsletter as conversion.
- **Portfolio (58):** Captures the gist (visual designer → inquiry) but audience is generic, win condition is vague ("initiates a direct inquiry") with no measurable verb (email click? form submit?). Ignores the reel video and 6-project grid signal.
- **Marketing (55):** Names the brand (Atlas AI), but win condition is comprehension ("understands how Atlas AI can transform...") not action — source clearly wants `Book a Discovery Call` (the hero CTA + pricing tiers). Audience says "Businesses" — useless.

## Top 3 weaknesses (across all 3 sites)

1. **Win condition isn't measurable.** "Understands," "initiates an inquiry," "transforms a nascent idea" — all unobservable. None reference the CTA button text already in the source config (`Book a Discovery Call`, `View Projects`, `Subscribe`).
2. **Audience is a demographic, not a persona.** "Creators and innovators," "Prospective clients," "Businesses seeking..." — no role, stage, or trigger. Owner's bar requires a *named* persona.
3. **No differentiator / competitor anchor.** Zero of three specs mention what this site does that a Squarespace/Webflow/Medium equivalent doesn't. The template doesn't even ask for it.

## Concrete template revision (proposed)

Edit `templates/north-star.json`:

- **Add required section** `Differentiator:` to `allowedSections` + `validation.mustContain`: `"<1 sentence. Named competitor + what this site does they don't.>"`
- **Rewrite `systemPrompt` win-condition rule:** Win condition MUST contain (a) a measurable verb tied to a CTA from `structuralSummary.sections[].components[].text` (e.g., "clicks Book a Discovery Call", "submits newsletter email"), and (b) a time/count bound.
- **Rewrite audience rule:** Audience MUST name a persona archetype (role + stage + trigger), e.g., "Series-A CTO evaluating AI vendors after a failed internal pilot". Reject "general users", "businesses", "creators".
- **Update `exampleOutput`** to model all four sections including a concrete competitor ("...unlike Squarespace, ships a spec bundle a coding agent can execute").

Predicted lift: composite to ~78 by forcing CTA-grounded win conditions and persona specificity.
