# Baseline — CSS / Design Tokens template

## Scores (iter-0)

| Site | Score |
|---|---|
| Blog | 72 |
| Portfolio | 64 |
| Marketing | 70 |
| **Composite** | **69.0** |

Gate (≥75): **FAIL** by 6. Closest baseline of the 6.

## Per-site verdicts

- **Blog (72):** clean valid JSON, hex with `#`, fidelity to source perfect, but template-minimum only.
- **Portfolio (64):** hex values **missing `#` prefix** (`fdfaf6` not `#fdfaf6`). Renderer will choke or coerce. Also `textPrimary: "#111"` source got expanded to `111111`.
- **Marketing (70):** valid hex, but `theme.mode: "light"` in source while palette is clearly dark (`#0A1128` bg + white text). Spec faithfully echoes the contradiction instead of flagging it.

## Top 3 weaknesses

1. **No responsive breakpoints** — single `sectionPadding: 64px` and `baseSize: 16px` ship to every viewport. Mobile/tablet/desktop indistinguishable.
2. **No motion-reduce / a11y branch** — `motion.transitionMs` is a scalar with no `prefers-reduced-motion` fallback. Fails WCAG 2.3.3.
3. **No light/dark variant pairing + hex-format drift** — palette is single flat object, no `light`/`dark` sub-objects. Portfolio dropped `#` entirely; marketing claims `light` but ships dark values.

## Concrete template revision

Extend the JSON schema to require:

```json
{
  "palette": { "light": {...6 keys}, "dark": {...6 keys} },
  "breakpoints": { "sm":"640px","md":"768px","lg":"1024px","xl":"1280px" },
  "responsive": { "sectionPadding": {"sm":"32px","md":"48px","lg":"64px"}, "baseSize": {"sm":"15px","md":"16px","lg":"17px"} },
  "motion": { "transitionMs": 200, "easing":"...", "reducedMotion": {"transitionMs":0,"easing":"linear"} }
}
```

Add system-prompt rule: *"If source theme.mode contradicts palette luminance, emit both `light` and `dark` and flag in a `_warnings` array."*

Predicted lift: Blog→82, Portfolio→78, Marketing→80, composite ~80.
