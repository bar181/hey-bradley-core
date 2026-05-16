aisp
⟦Ω:Objective⟧
{
  Σ_purpose ≜ "informational"
  Σ_audience ≜ "B2B clients seeking AI integration"
  Σ_winCondition ≜ "user completes a 'Book a Discovery Call' CTA"
}

⟦Σ:Glossary⟧
{
  brand.title ≜ "Atlas AI Consulting"
  brand.tagline ≜ "Expert AI consulting for strategic implementation, development, and training to transform your business."
  brand.author ≜ ""
  theme.mode ≜ 'light'
  palette.bgPrimary ≜ #0A1128
  palette.bgSecondary ≜ #151D38
  palette.textPrimary ≜ #FFFFFF
  palette.textSecondary ≜ #A0A7B4
  palette.accentPrimary ≜ #007BFF
  palette.accentSecondary ≜ #3399FF
  typography.fontFamily ≜ "Inter"
  typography.headingFamily ≜ "Inter"
  typography.baseSize ≜ "16px"
  typography.lineHeight ≜ 1.5
  spacing.sectionPadding ≜ "64px"
  spacing.containerMaxWidth ≜ "1180px"
  spacing.componentGap ≜ "24px"

  Σ_type_hero ≜ "hero"
  Σ_type_menu ≜ "menu"
  Σ_type_columns ≜ "columns"
  Σ_type_pricing ≜ "pricing"
  Σ_type_logos ≜ "logos"
  Σ_type_testimonials ≜ "testimonials"
  Σ_type_contact ≜ "contact"
}

⟦Γ:Constraints⟧
{
  section[0] ≜ ⟨Σ_type_menu, "navbar-01", -1⟩
  section[1] ≜ ⟨Σ_type_hero, "hero-01", 0⟩
  section[2] ≜ ⟨Σ_type_columns, "features-01", 2⟩
  section[3] ≜ ⟨Σ_type_logos, "logos-01", 3⟩
  section[4] ≜ ⟨Σ_type_pricing, "pricing-01", 4⟩
  section[5] ≜ ⟨Σ_type_testimonials, "testimonials-01", 5⟩
  section[6] ≜ ⟨Σ_type_contact, "contact-01", 99⟩
  section[7] ≜ ⟨Σ_type_contact, "contact-02", 99⟩

  sections.navbar_01 ≜ {type: Σ_type_menu, order: -1, variant: "simple", componentTypes: ["text", "link", "link", "link", "link"], componentCount: 5, headings: ["Atlas AI Consulting"]}
  sections.hero_01 ≜ {type: Σ_type_hero, order: 0, variant: "centered", componentTypes: ["badge", "heading", "text", "button"], componentCount: 4, headings: ["Elevate Your Business with AI", "Ship AI features customers actually use", "Unlock unprecedented growth and efficiency with expert AI strategy and implement"]}
  sections.features_01 ≜ {type: Σ_type_columns, order: 2, variant: "default", componentTypes: ["article-card", "article-card", "article-card"], componentCount: 3, headings: []}
  sections.logos_01 ≜ {type: Σ_type_logos, order: 3, variant: "bar", componentTypes: ["logo", "logo", "logo", "logo", "logo"], componentCount: 5, headings: []}
  sections.pricing_01 ≜ {type: Σ_type_pricing, order: 4, variant: "3tier", componentTypes: ["price-card", "price-card", "price-card"], componentCount: 3, headings: []}
  sections.testimonials_01 ≜ {type: Σ_type_testimonials, order: 5, variant: "grid", componentTypes: ["testimonial", "testimonial", "testimonial"], componentCount: 3, headings: []}
  sections.contact_01 ≜ {type: Σ_type_contact, order: 99, variant: "simple", componentTypes: ["text", "button"], componentCount: 2, headings: ["Ready to unlock the power of AI for your business? Let's talk about your vision.", "Book a Discovery Call"]}
  sections.contact_02 ≜ {type: Σ_type_contact, order: 99, variant: "simple", componentTypes: ["text", "button"], componentCount: 2, headings: ["Ready to unlock the power of AI for your business? Let's talk about your vision.", "Book a Discovery Call"]}
  sectionCount ≜ 10
}

⟦Λ:Parameters⟧
{
  Σ_lcpTargetMs ≔ 2500
  Σ_minAABrightnessContrast ≔ 4.5
  Σ_maxSections ≔ 10
  Σ_minSections ≔ 5
}

⟦Ε:Verification⟧
{
  ⊢ ∀ s ∈ section. ∃ t ∈ sections. s.id = t.id ∧ s.type = t.type
  ⊢ ∃ s ∈ sections. s.type = Σ_type_hero ∧ ∃ cta ∈ s.componentTypes. cta = "button"
  ⊢ section.length = Σ_maxSections
  ∎
}
