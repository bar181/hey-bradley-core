⟦Ω:Objective⟧
{
  site.purpose ≜ "Showcase design portfolio"
  site.audience ≜ "Potential employers and collaborators"
  winCondition ≜ "Secure new design projects or job opportunities"
}

⟦Σ:Glossary⟧
{
  site.title ≜ "Bradley Ross | Visual Designer"
  site.tagline ≜ "Visual designer portfolio for Bradley Ross"
  site.brandName ≜ ""
  site.author ≜ ""

  theme.mode ≜ 'light'
  palette.bgPrimary ≜ "#fdfaf6"
  palette.bgSecondary ≜ "#f5f0e8"
  palette.textPrimary ≜ "#111"
  palette.textSecondary ≜ "#555"
  palette.accentPrimary ≜ "#80a490"
  palette.accentSecondary ≜ "#a6b9a8"

  typography.fontFamily ≜ "Inter"
  typography.headingFamily ≜ "Outfit"
  typography.baseSize ≜ "16px"
  typography.lineHeight ≜ 1.5

  spacing.sectionPadding ≜ "64px"
  spacing.containerMaxWidth ≜ "1180px"
  spacing.componentGap ≜ "24px"
}

⟦Γ:Constraints⟧
{
  sectionCount ≔ 5

  sections ≜ [
    section[0] ≜ ⟨"menu", "navbar-01", -1⟩,
    section[1] ≜ ⟨"hero", "hero-01", 0⟩,
    section[2] ≜ ⟨"video", "video-01", 1⟩,
    section[3] ≜ ⟨"columns", "projects-01", 2⟩,
    section[4] ≜ ⟨"contact", "contact-01", 99⟩
  ]

  ∀ s ∈ sections. s.id ≜ (section_id). s.type ≜ (section_type). s.order ≜ (section_order)

  navbar-01.type ≜ "menu"
  navbar-01.variant ≜ "simple"
  navbar-01.componentTypes ≜ ["text", "link", "link"]
  navbar-01.componentCount ≜ 3
  ∃ h ∈ navbar-01.headings. h ≜ "Bradley Ross"

  hero-01.type ≜ "hero"
  hero-01.variant ≜ "centered"
  hero-01.componentTypes ≜ ["heading", "text", "text", "text", "button"]
  hero-01.componentCount ≜ 5
  ∃ h ∈ hero-01.headings. h ≜ "Bradley Ross"
  ∃ h ∈ hero-01.headings. h ≜ "Visual Designer"
  ∃ h ∈ hero-01.headings. h ≜ "Crafting thoughtful visual experiences."

  video-01.type ≜ "video"
  video-01.variant ≜ "reel"
  video-01.componentTypes ≜ ["video-embed"]
  video-01.componentCount ≜ 1
  video-01.headings ≜ []

  projects-01.type ≜ "columns"
  projects-01.variant ≜ "project-grid"
  projects-01.componentTypes ≜ ["project-card", "project-card", "project-card", "project-card", "project-card", "project-card"]
  projects-01.componentCount ≜ 6
  projects-01.headings ≜ []

  contact-01.type ≜ "contact"
  contact-01.variant ≜ "simple"
  contact-01.componentTypes ≜ ["link", "link"]
  contact-01.componentCount 2
  contact-01.headings ≜ []
}

⟦Λ:Parameters⟧
{
  LCP_target_ms ≔ 2500
  min_AA_contrast ≔ 4.5
  hero_cta_min ≔ 1
  Ambig(D) < 0.02
}

⟦Ε:Verification⟧
{
  sectionCount ≔ |sections|
  ∀ s ∈ sections. s.order = s.idx - 1 ⊢ s.order = index(s, sections) - 1

  ⊢ ∃ cta_button ∈ hero-01.components. (cta_button.type = "button")
  ⊢ (palette.bgPrimary contrast palette.textPrimary) ≥ min_AA_contrast
  ⊢ (palette.bgPrimary contrast palette.textSecondary) ≥ min_AA_contrast
  ⊢ (palette.bgPrimary contrast palette.accentPrimary) ≥ min_AA_contrast
  ⊢ (palette.bgPrimary contrast palette.accentSecondary) ≥ min_AA_contrast
  ⊢ (palette.bgSecondary contrast palette.textPrimary) ≥ min_AA_contrast
  ⊢ (palette.bgSecondary contrast palette.textSecondary) ≥ min_AA_contrast
  ⊢ (palette.bgSecondary contrast palette.accentPrimary) ≥ min_AA_contrast
  ⊢ (palette.bgSecondary contrast palette.accentSecondary) ≥ min_AA_contrast

  ∎
}
