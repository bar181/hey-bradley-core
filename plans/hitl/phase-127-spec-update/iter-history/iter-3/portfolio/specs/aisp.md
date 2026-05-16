aisp
⟦Ω:Objective⟧
{
  site.purpose ≜ "Showcase visual design portfolio"
  site.audience ≜ "Prospective clients and collaborators"
  site.winCondition ≜ "Secure new design projects and networking opportunities"
}

⟦Σ:Glossary⟧
{
  brand.title ≜ "Bradley Ross | Visual Designer"
  brand.tagline ≜ "Visual designer portfolio for Bradley Ross"
  brand.author ≜ ""

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

  theme.mode ≜ "light"
}

⟦Γ:Constraints⟧
{
  section[0] ≜ ⟨"menu", "navbar-01", -1⟩
  section[1] ≜ ⟨"hero", "hero-01", 0⟩
  section[2] ≜ ⟨"video", "video-01", 1⟩
  section[3] ≜ ⟨"columns", "projects-01", 2⟩
  section[4] ≜ ⟨"contact", "contact-01", 99⟩
}

⟦Δ:Content⟧
{
  section.navbar-01.logo.props.text ≜ "Bradley Ross"
  section.navbar-01.nav-1.props.text ≜ "Projects"
  section.navbar-01.nav-1.props.url ≜ "#projects"
  section.navbar-01.nav-2.props.text ≜ "Contact"
  section.navbar-01.nav-2.props.url ≜ "#contact"

  section.hero-01.headline.props.text ≜ "Bradley Ross"
  section.hero-01.headline.props.level ≜ 1
  section.hero-01.headline.props.size ≜ "96px"
  section.hero-01.headline.props.weight ≜ 300
  section.hero-01.subtitle.props.text ≜ "Visual Designer"
  section.hero-01.tagline.props.text ≜ "Crafting thoughtful visual experiences."
  section.hero-01.primaryCta.props.text ≜ "View Projects"
  section.hero-01.primaryCta.props.url ≜ "#projects"
  section.hero-01.primaryCta.props.style ≜ "filled"
  section.hero-01.primaryCta.props.size ≜ "lg"

  section.video-01.reel.props.url ≜ "https://www.youtube.com/embed/dQw4w9WgXcQ?si=Rj3DkXh2vM1v6D9q"
  section.video-01.reel.props.autoplay ≜ false
  section.video-01.reel.props.loop ≜ true
  section.video-01.reel.props.alt ≜ "Bradley Ross portfolio reel"

  section.projects-01.project-1.props.title ≜ "Aura Branding Redesign"
  section.projects-01.project-1.props.image ≜ "https://bradleyross.co/images/aura-thumb.jpg"
  section.projects-01.project-1.props.alt ≜ "Aura branding project thumbnail"
  section.projects-01.project-1.props.tags ≜ ["Branding", "UI/UX", "Packaging"]
  section.projects-01.project-1.props.effects ≜ ["hover-zoom", "scroll-reveal"]
  section.projects-01.project-1.props.url ≜ "#"
  section.projects-01.project-2.props.title ≜ "Zenith Mobile App"
  section.projects-01.project-2.props.image ≜ "https://bradleyross.co/images/zenith-thumb.jpg"
  section.projects-01.project-2.props.alt ≜ "Zenith mobile app project thumbnail"
  section.projects-01.project-2.props.tags ≜ ["UI/UX", "Mobile", "Product Design"]
  section.projects-01.project-2.props.effects ≜ ["hover-zoom", "scroll-reveal"]
  section.projects-01.project-2.props.url ≜ "#"
  section.projects-01.project-3.props.title ≜ "Equinox Website"
  section.projects-01.project-3.props.image ≜ "https://bradleyross.co/images/equinox-thumb.jpg"
  section.projects-01.project-3.props.alt ≜ "Equinox website project thumbnail"
  section.projects-01.project-3.props.tags ≜ ["Web Design", "UI/UX", "Branding"]
  section.projects-01.project-3.props.effects ≜ ["hover-zoom", "scroll-reveal"]
  section.projects-01.project-3.props.url ≜ "#"
  section.projects-01.project-4.props.title ≜ "Nova Creative Campaigns"
  section.projects-01.project-4.props.image ≜ "https://bradleyross.co/images/nova-thumb.jpg"
  section.projects-01.project-4.props.alt ≜ "Nova creative campaigns thumbnail"
  section.projects-01.project-4.props.tags ≜ ["Marketing", "Visuals", "Advertising"]
  section.projects-01.project-4.props.effects ≜ ["hover-zoom", "scroll-reveal"]
  section.projects-01.project-4.props.url ≜ "#"
  section.projects-01.project-5.props.title ≜ "Solstice Editorial Design"
  section.projects-01.project-5.props.image ≜ "https://bradleyross.co/images/solstice-thumb.jpg"
  section.projects-01.project-5.props.alt ≜ "Solstice editorial design thumbnail"
  section.projects-01.project-5.props.tags ≜ ["Print", "Editorial", "Layout"]
  section.projects-01.project-5.props.effects ≜ ["hover-zoom", "scroll-reveal"]
  section.projects-01.project-5.props.url ≜ "#"
  section.projects-01.project-6.props.title ≜ "Luna Packaging Concepts"
  section.projects-01.project-6.props.image ≜ "https://bradleyross.co/images/luna-thumb.jpg"
  section.projects-01.project-6.props.alt ≜ "Luna packaging concepts thumbnail"
  section.projects-01.project-6.props.tags ≜ ["Packaging", "3D Render", "Product"]
  section.projects-01.project-6.props.effects ≜ ["hover-zoom", "scroll-reveal"]
  section.projects-01.project-6.props.url ≜ "#"

  section.contact-01.email.props.text ≜ "hello@bradleyross.co"
  section.contact-01.email.props.url ≜ "mailto:hello@bradleyross.co"
  section.contact-01.twitter.props.text ≜ "@bradleyross"
  section.contact-01.twitter.props.url ≜ "https://x.com/bradleyross"
}

⟦Λ:Parameters⟧
{
  lcp_target_ms ≜ 2500
  aa_contrast_min ≜ 4.5
  section_count ≜ 5
}

⟦Ε:Verification⟧
{
  ∀ s ∈ sections. ⊢ valid(s)
  ⊢ contrast(palette.bgPrimary, palette.textPrimary) ≥ aa_contrast_min
  ⊢ ∃ cta ∈ hero-01.components
}
∎
