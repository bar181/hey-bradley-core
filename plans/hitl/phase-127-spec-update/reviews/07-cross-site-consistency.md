# Reviewer 7 — Cross-site AISP consistency audit

**Consistency Score: 58/100**

All three use the 5-block header skeleton, but syntax, naming, and section-enumeration conventions drift enough that a single parser would need three branches.

## Top 3 Consistency Wins
1. All 3 use identical block headers in identical order: `⟦Ω:Objective⟧ → ⟦Σ:Glossary⟧ → ⟦Γ:Constraints⟧ → ⟦Λ:Parameters⟧ → ⟦Ε:Verification⟧`, each closing with `∎` in Verification.
2. Glossary palette/typography/spacing keys are byte-identical schema (`palette.bgPrimary`, `typography.fontFamily`, `spacing.sectionPadding`...) across all 3.
3. Definition operator `≜` for assignments and `≔` for parameter constants is used consistently in 3/3.

## Top 3 Divergences
1. **Section enumeration syntax drift** — blog/Γ uses flat `section[i] ≜ ⟨type,id,order⟩` + dotted `section.hero-01.variant`; portfolio/Γ wraps them in a `sections ≜ [...]` array + bare `hero-01.variant`; marketing/Γ uses `section[i]` tuples PLUS a parallel `sections.hero_01 ≜ {...}` object literal (underscore, not hyphen). Three different shapes.
2. **Objective namespace drift** — blog & portfolio use `site.purpose / site.audience / winCondition`; marketing/Ω uses `Σ_purpose / Σ_audience / Σ_winCondition`. Brand naming also drifts: blog/portfolio use `brand.title` vs portfolio's `site.title`.
3. **Parameter vocabulary drift** — blog/Λ: `lcpTarget`, `minAALuminanceContrast`; portfolio/Λ: `LCP_target_ms`, `min_AA_contrast`; marketing/Λ: `Σ_lcpTargetMs`, `Σ_minAABrightnessContrast`. Same concept, three names. Also: marketing/Γ has `componentCount 2` (missing `≜`, syntax error) and a stray `aisp` token on line 1.

## Recommendation
Lock a canonical AISP template (single section-enum form, single Ω namespace, single Λ vocabulary) before P127 ships. Re-emit all 3 specs from that template — current drift breaks the "parse once, reuse" contract.
