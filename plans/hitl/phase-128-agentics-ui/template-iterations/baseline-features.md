# Baseline — Features template

## Scores (iter-0)

| Site | Score |
|---|---|
| Blog | 58 |
| Portfolio | 52 |
| Marketing | 64 |
| **Composite** | **58.0** |

Gate (≥75): **FAIL** by 17.

## Per-site verdicts

- **Blog (58):** 5 items, hits floor. "Compelling Hero Section" is structural padding. No section IDs. No deps. Missing the article-card narrative arc (hook/problem/resolution) which is the actual differentiating feature in the config.
- **Portfolio (52):** 7 items but bloated with overlap: items #2/#3/#5/#6 all describe the hero+grid trivially. "Individual Project Cards" duplicates "Project Grid Display." Six of seven items P0 = no prioritization signal. No section IDs.
- **Marketing (64):** Best of three: pricing + testimonials + logos correctly identified. Still has "Compelling above-the-fold message" padding. Misses that config has duplicate pricing/logos/contact sections. No deps.

## Top 3 weaknesses

1. **Structural restatement as features.** "Compelling Hero Section — Presents a centered headline, text, and call-to-action button" describes layout, not user value. Template's example warns against this but the prompt fails to enforce.
2. **No section ID anchoring.** Zero outputs reference `#hero-01`, `#articles-01`, `#pricing-01`. Engineers can't trace a feature to the config slice that implements it.
3. **No dependencies, no ordering rationale.** Portfolio assigns P0 to six of seven items; Blog gives newsletter the same P1 as author bio despite very different impact. No `depends_on` makes the list unactionable for wave planning.

## Concrete template revision

Replace the format line in `systemPrompt`:

```
N. **<Name>** — <User-value, ≤120 chars> _Priority: <P0|P1|P2>_ _Section: #<id>_ _Depends: <#id,#id|none>_
```

Add rule: *"Reject any feature whose description starts with 'Compelling', 'Has a', 'Presents', 'Provides', or names a layout primitive (hero/nav/grid). Describe what the user gets, not what the page contains. Each P0 must have Depends: none or only other P0s."*

Predicted lift: composite ~78.
