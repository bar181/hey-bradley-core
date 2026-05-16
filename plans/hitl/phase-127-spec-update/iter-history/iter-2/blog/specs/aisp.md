⟦Ω:Objective⟧ {
  site.purpose ≜ "To present information and engage users."
  site.audience ≜ "General web users."
  winCondition ≜ "Successful information delivery and user interaction."
}

⟦Σ:Glossary⟧ {
  Color ≜ Σ_512.HexCode
  Font ≜ Σ_512.String
  SectionType ≜ Σ_512.String
  SectionId ≜ Σ_512.String
  ThemeMode ≜ "dark" | "light"

  brand.title ≜ "Hey Bradley"
  brand.tagline ≜ ""
  brand.author ≜ ""

  theme.mode ≜ "dark"
  palette.bgPrimary ≜ "#1a0000"
  palette.bgSecondary ≜ "#330000"
  palette.textPrimary ≜ "#fefefe"
  palette.textSecondary ≜ "#bbb"
  palette.accentPrimary ≜ "#cc3333"
  palette.accentSecondary ≜ "#ff6666"

  typography.fontFamily ≜ "Inter"
  typography.headingFamily ≜ "Cormorant Garamond"
  typography.baseSize ≜ "16px"
  typography.lineHeight ≜ 1.5

  spacing.sectionPadding ≜ "64px"
  spacing.containerMaxWidth ≜ "1180px"
  spacing.componentGap ≜ "24px"
}

⟦Γ:Constraints⟧ {
  section[0] ≜ ⟨"hero", "hero-01", 0⟩
  section[1] ≜ ⟨"menu", "navbar-01", -1⟩
  section[2] ≜ ⟨"columns", "articles-01", 2⟩
  section[3] ≜ ⟨"hero", "author-bio-01", 97⟩
  section[4] ≜ ⟨"newsletter", "newsletter-01", 98⟩

  ∀ s ∈ Section. s.type ∈ {"hero", "menu", "columns", "newsletter"}
  ∀ s ∈ Section. s.id ∈ {"hero-01", "navbar-01", "articles-01", "author-bio-01", "newsletter-01"}

  section.hero-01.variant ≜ "centered"
  section.hero-01.componentTypes ≜ ["badge", "heading", "text", "button"]
  section.hero-01.componentCount ≜ 4
  section.hero-01.headings ≜ ["Your ideas, made real.", "The whiteboard that listens", "Unlocking the story behind your next big thing."]

  section.navbar-01.variant ≜ "simple"
  section.navbar-01.componentTypes ≜ ["text", "link", "link", "link"]
  section.navbar-01.componentCount ≜ 4
  section.navbar-01.headings ≜ ["Hey Bradley"]

  section.articles-01.variant ≜ "default"
  section.articles-01.componentTypes ≜ ["article-card", "article-card", "article-card"]
  section.articles-01.componentCount ≜ 3
  section.articles-01.headings ≜ []

  section.author-bio-01.variant ≜ "left-aligned"
  section.author-bio-01.componentTypes ≜ ["image", "group"]
  section.author-bio-01.componentCount ≜ 2
  section.author-bio-01.headings ≜ []

  section.newsletter-01.variant ≜ "inline"
  section.newsletter-01.componentTypes ≜ ["input", "button"]
  section.newsletter-01.componentCount ≜ 2
  section.newsletter-01.headings ≜ ["Subscribe"]
}

⟦Λ:Parameters⟧ {
  lcpTarget ≔ 2.5 Σ_512.Second
  minAALuminanceContrast ≔ 4.5
  maxSectionCount ≔ 5
  minSectionCount ≔ 5
  sectionCount ≔ 5
}

⟦Ε:Verification⟧ {
  (∀ s ∈ Section. ⊢ valid(s)) ∧ (sectionCount ≥ minSectionCount) ∧
  (sectionCount ≤ maxSectionCount) ∧ (∃ cta ∈ section.hero-01.componentTypes. (cta ≜ "button")) ∎
}
