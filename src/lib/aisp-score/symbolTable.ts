// src/lib/aisp-score/symbolTable.ts
//
// AISP v5.1 symbol set (subset) — heuristic stopgap per P112 / ADR-140.
//
// **Stopgap notice.** The canonical 512-symbol Σ table lives in the upstream
// `aisp` Rust crate (see ADR-C07 D1, Wave 4). This subset covers the ~40
// most-common Crystal-Atom symbols across the 8 core categories so the
// `validate_aisp` MCP tool, web app, and NPX `score` command can return
// honest δ density + Ambig numbers today without waiting on the WASM build.
//
// When ADR-C07 ships (60-day upstream window), this file is REPLACED by a
// thin re-export of the crate's symbol table — the regex stays as a fallback
// for environments where WASM cannot load.
//
// Categories covered:
//  - Block markers     ⟦ ⟧ Ω Σ Γ Λ Ε Χ
//  - Quantifiers       ∀ ∃ ∈ ∉ ⊆ ⊂
//  - Set operations    ∪ ∩ ∅
//  - Comparators       ≥ ≤ ≠
//  - Implication       ⇒ ⇔ → ↔ ↦
//  - Sequencing        ≫
//  - Brackets          ⟨ ⟩
//  - Type literals     𝕊 𝔹 ℕ ℝ 𝕋 𝔼 𝔄 𝔸
//  - Multi-char        := ::

export const AISP_SYMBOLS = [
  // Block markers
  '⟦', '⟧', 'Ω', 'Σ', 'Γ', 'Λ', 'Ε', 'Χ',
  // Quantifiers
  '∀', '∃', '∈', '∉', '⊆', '⊂',
  // Set ops
  '∪', '∩', '∅',
  // Comparators
  '≥', '≤', '≠',
  // Implication / arrows
  '⇒', '⇔', '→', '↔', '↦', '≫',
  // Brackets
  '⟨', '⟩',
  // Type symbols
  '𝕊', '𝔹', 'ℕ', 'ℝ', '𝕋', '𝔼', '𝔄', '𝔸',
  // Multi-char operators
  ':=', '::',
] as const;

/**
 * Single regex for δ density scoring. Matches one AISP symbol or one
 * multi-char operator (`:=` / `::`) per hit.
 *
 * The `gu` flags are LOAD-BEARING:
 *   - `g` — global; required for `String.prototype.match()` to return all hits
 *           rather than just the first match groups.
 *   - `u`  — unicode; required because most AISP symbols (𝕊, ⟦, Σ, …) are
 *           outside the BMP or use unicode codepoints that need full-mode
 *           parsing.
 *
 * Order matters: multi-char operators (`:=`, `::`) appear before the
 * single-char alternation so they match as one token, not two.
 */
export const SYMBOL_REGEX =
  /:=|::|[⟦⟧ΩΣΓΛΕΧ∀∃∈∉⊆⊂∪∩∅≥≤≠⇒⇔→↔↦≫⟨⟩𝕊𝔹ℕℝ𝕋𝔼𝔄𝔸]/gu;
