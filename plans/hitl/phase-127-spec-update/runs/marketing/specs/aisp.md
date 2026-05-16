aisp
⟦Ω:Objective⟧
{
  site.purpose ≜ "Expert AI consulting for strategic implementation, development, and training to transform your business."
  site.audience ≜ "Businesses seeking to implement AI for growth and efficiency."
  site.winCondition ≜ "Client engagement through discovery calls and service uptake."
}

⟦Σ:Glossary⟧
{
  brand.title ≜ "Atlas AI Consulting"
  brand.tagline ≜ "Expert AI consulting for strategic implementation, development, and training to transform your business."
  brand.author ≜ ""

  palette.bgPrimary ≜ "#0A1128"
  palette.bgSecondary ≜ "#151D38"
  palette.textPrimary ≜ "#FFFFFF"
  palette.textSecondary ≜ "#A0A7B4"
  palette.accentPrimary ≜ "#007BFF"
  palette.accentSecondary ≜ "#3399FF"

  typography.fontFamily ≜ "Inter"
  typography.headingFamily ≜ "Inter"
  typography.baseSize ≜ "16px"
  typography.lineHeight ≜ 1.5

  theme.mode ≜ "light"
  theme.spacing.sectionPadding ≜ "64px"
  theme.spacing.containerMaxWidth ≜ "1180px"
  theme.spacing.componentGap ≜ "24px"
  theme.borderRadius ≜ "8px"
}

⟦Γ:Constraints⟧
{
  section[0] ≜ ⟨"hero", "hero-01", 0⟩
  section[0].variant ≜ "centered"
  section[0].componentCount ≜ 4
  section[0].componentTypes ≜ ["badge", "heading", "text", "button"]

  section[1] ≜ ⟨"menu", "navbar-01", -1⟩
  section[1].variant ≜ "simple"
  section[1].componentCount ≜ 5
  section[1].componentTypes ≜ ["text", "link", "link", "link", "link"]

  section[2] ≜ ⟨"columns", "features-01", 2⟩
  section[2].variant ≜ "default"
  section[2].componentCount ≜ 3
  section[2].componentTypes ≜ ["article-card", "article-card", "article-card"]

  section[3] ≜ ⟨"pricing", "pricing-01", 4⟩
  section[3].variant ≜ "3tier"
  section[3].componentCount ≜ 3
  section[3].componentTypes ≜ ["price-card", "price-card", "price-card"]

  section[4] ≜ ⟨"pricing", "pricing-01", 4⟩
  section[4].variant ≜ "3tier"
  section[4].componentCount ≜ 3
  section[4].componentTypes ≜ ["price-card", "price-card", "price-card"]

  section[5] ≜ ⟨"logos", "logos-01", 3⟩
  section[5].variant ≜ "bar"
  section[5].componentCount ≜ 5
  section[5].componentTypes ≜ ["logo", "logo", "logo", "logo", "logo"]

  section[6] ≜ ⟨"logos", "logos-01", 3⟩
  section[6].variant ≜ "bar"
  section[6].componentCount ≜ 5
  section[6].componentTypes ≜ ["logo", "logo", "logo", "logo", "logo"]

  section[7] ≜ ⟨"testimonials", "testimonials-01", 5⟩
  section[7].variant ≜ "grid"
  section[7].componentCount ≜ 3
  section[7].componentTypes ≜ ["testimonial", "testimonial", "testimonial"]

  section[8] ≜ ⟨"contact", "contact-01", 99⟩
  section[8].variant ≜ "simple"
  section[8].componentCount ≜ 2
  section[8].componentTypes ≜ ["text", "button"]

  section[9] ≜ ⟨"contact", "contact-02", 99⟩
  section[9].variant ≜ "simple"
  section[9].componentCount ≜ 2
  section[9].componentTypes ≜ ["text", "button"]
}

⟦Δ:Content⟧
{
  section.hero-01.components.eyebrow.props.text ≜ "Elevate Your Business with AI"
  section.hero-01.components.headline.props.text ≜ "Ship AI features customers actually use"
  section.hero-01.components.headline.props.level ≜ 1
  section.hero-01.components.headline.props.size ≜ "96px"
  section.hero-01.components.headline.props.weight ≜ 300
  section.hero-01.components.subtitle.props.text ≜ "Unlock unprecedented growth and efficiency with expert AI strategy and implementation."
  section.hero-01.components.primaryCta.props.text ≜ "Book a Discovery Call"
  section.hero-01.components.primaryCta.props.url ≜ "#contact-01"
  section.hero-01.components.primaryCta.props.style ≜ "filled"
  section.hero-01.components.primaryCta.props.size ≜ "lg"

  section.navbar-01.components.logo.props.text ≜ "Atlas AI Consulting"
  section.navbar-01.components.nav-1.props.text ≜ "Services"
  section.navbar-01.components.nav-1.props.url ≜ "#features-01"
  section.navbar-01.components.nav-2.props.text ≜ "Pricing"
  section.navbar-01.components.nav-2.props.url ≜ "#pricing-01"
  section.navbar-01.components.nav-3.props.text ≜ "Testimonials"
  section.navbar-01.components.nav-3.props.url ≜ "#testimonials-01"
  section.navbar-01.components.nav-4.props.text ≜ "Contact"
  section.navbar-01.components.nav-4.props.url ≜ "#contact-01"

  section.features-01.content.heading ≜ "Our Core Services"
  section.features-01.content.subheading ≜ "Guiding your journey from concept to AI-driven reality."
  section.features-01.layout.columns ≜ 3
  section.features-01.components.feature-1.props.title ≜ "AI Strategy & Roadmap"
  section.features-01.components.feature-1.props.alt ≜ "AI strategy planning"
  section.features-01.components.feature-1.props.hook ≜ "Define a clear path to AI success tailored to your business goals."
  section.features-01.components.feature-1.props.problem ≜ "Many businesses struggle to identify impactful AI applications and a coherent strategy."
  section.features-01.components.feature-1.props.resolution ≜ "We help you pinpoint opportunities, assess readiness, and build a phased roadmap for sustainable AI integration."
  section.features-01.components.feature-1.props.tags ≜ ["Strategy", "Consulting", "Planning"]
  section.features-01.components.feature-2.props.title ≜ "Seamless AI Implementation"
  section.features-01.components.feature-2.props.alt ≜ "AI implementation process"
  section.features-01.components.feature-2.props.hook ≜ "Bring your AI vision to life with expert development and deployment."
  section.features-01.components.feature-2.props.problem ≜ "Implementing AI solutions can be complex, requiring specialized skills and robust infrastructure."
  section.features-01.components.feature-2.props.resolution ≜ "Our team handles everything from model development to system integration, ensuring smooth and effective deployment."
  section.features-01.components.feature-2.props.tags ≜ ["Development", "Deployment", "Integration"]
  section.features-01.components.feature-3.props.title ≜ "Empowering AI Training"
  section.features-01.components.feature-3.props.alt ≜ "AI training and workshops"
  section.features-01.components.feature-3.props.hook ≜ "Equip your team with the knowledge and skills to master AI technologies."
  section.features-01.components.feature-3.props.problem ≜ "Adopting AI requires a skilled workforce, often leading to internal knowledge gaps."
  section.features-01.components.feature-3.props.resolution ≜ "We provide customized training programs and workshops to empower your employees to confidently leverage AI tools and strategies."
  section.features-01.components.feature-3.props.tags ≜ ["Training", "Workshops", "Upskilling"]

  section.pricing-01.content.heading ≜ "Flexible Pricing for Every Scale"
  section.pricing-01.content.subheading ≜ "Choose the plan that fits your ambition."
  section.pricing-01.layout.columns ≜ 3
  section.pricing-01.components.tier-starter.props.name ≜ "Starter"
  section.pricing-01.components.tier-starter.props.price ≜ "$5,000/mo"
  section.pricing-01.components.tier-starter.props.features ≜ ["Initial AI readiness assessment", "Basic strategy workshop", "Prioritized use case identification"]
  section.pricing-01.components.tier-starter.props.cta ≜ "Get Started"
  section.pricing-01.components.tier-growth.props.name ≜ "Growth"
  section.pricing-01.components.tier-growth.props.price ≜ "$15,000/mo"
  section.pricing-01.components.tier-growth.props.features ≜ ["Comprehensive strategy & roadmap", "Pilot AI project implementation", "Team training session", "Dedicated technical support"]
  section.pricing-01.components.tier-growth.props.cta ≜ "Accelerate Growth"
  section.pricing-01.components.tier-enterprise.props.name ≜ "Enterprise"
  section.pricing-01.components.tier-enterprise.props.price ≜ "Contact us"
  section.pricing-01.components.tier-enterprise.props.features ≜ ["Full-scale AI transformation", "Multiple custom AI solutions", "Ongoing maintenance & optimization", "Executive-level workshops", "24/7 priority support"]
  section.pricing-01.components.tier-enterprise.props.cta ≜ "Talk to Sales"

  section.logos-01.content.heading ≜ "Trusted by Industry Leaders"
  section.logos-01.components.logo-1.props.name ≜ "InnovateFlow"
  section.logos-01.components.logo-1.props.image ≜ "https://via.placeholder.com/150x50/cccccc/000000?text=InnovateFlow"
  section.logos-01.components.logo-1.props.alt ≜ "InnovateFlow logo"
  section.logos-01.components.logo-2.props.name ≜ "QuantumLeap"
  section.logos-01.components.logo-2.props.image ≜ "https://via.placeholder.com/150x50/cccccc/000000?text=QuantumLeap"
  section.logos-01.components.logo-2.props.alt ≜ "QuantumLeap logo"
  section.logos-01.components.logo-3.props.name ≜ "SynergyTech"
  section.logos-01.components.logo-3.props.image ≜ "https://via.placeholder.com/150x50/cccccc/000000?text=SynergyTech"
  section.logos-01.components.logo-3.props.alt ≜ "SynergyTech logo"
  section.logos-01.components.logo-4.props.name ≜ "ApexSolutions"
  section.logos-01.components.logo-4.props.image ≜ "https://via.placeholder.com/150x50/cccccc/000000?text=ApexSolutions"
  section.logos-01.components.logo-4.props.alt ≜ "ApexSolutions logo"
  section.logos-01.components.logo-5.props.name ≜ "VisionaryAI"
  section.logos-01.components.logo-5.props.image ≜ "https://via.placeholder.com/150x50/cccccc/000000?text=VisionaryAI"
  section.logos-01.components.logo-5.props.alt ≜ "VisionaryAI logo"
  section.logos-01.components.logo-1.props.name ≜ "TechInnovate"
  section.logos-01.components.logo-1.props.image ≜ "https://via.placeholder.com/150x50/cccccc/000000?text=TechInnovate"
  section.logos-01.components.logo-1.props.alt ≜ "TechInnovate logo"
  section.logos-01.components.logo-2.props.name ≜ "GlobalCorp"
  section.logos-01.components.logo-2.props.image ≜ "https://via.placeholder.com/150x50/cccccc/000000?text=GlobalCorp"
  section.logos-01.components.logo-2.props.alt ≜ "GlobalCorp logo"
  section.logos-01.components.logo-3.props.name ≜ "FutureMakers"
  section.logos-01.components.logo-3.props.image ≜ "https://via.placeholder.com/150x50/cccccc/000000?text=FutureMakers"
  section.logos-01.components.logo-3.props.alt ≜ "FutureMakers logo"
  section.logos-01.components.logo-4.props.name ≜ "DataGenius"
  section.logos-01.components.logo-4.props.image ≜ "https://via.placeholder.com/150x50/cccccc/000000?text=DataGenius"
  section.logos-01.components.logo-4.props.alt ≜ "DataGenius logo"
  section.logos-01.components.logo-5.props.name ≜ "InnovateX"
  section.logos-01.components.logo-5.props.image ≜ "https://via.placeholder.com/150x50/cccccc/000000?text=InnovateX"
  section.logos-01.components.logo-5.props.alt ≜ "InnovateX logo"

  section.testimonials-01.content.heading ≜ "What Our Clients Say"
  section.testimonials-01.content.subheading ≜ "Hear from businesses that have thrived with Atlas AI."
  section.testimonials-01.layout.columns ≜ 3
  section.testimonials-01.components.q1.props.quote ≜ "Atlas AI Consulting transformed our data analysis capabilities. Their strategic guidance was invaluable, and the implementation was flawless."
  section.testimonials-01.components.q1.props.author ≜ "Jane Doe"
  section.testimonials-01.components.q1.props.role ≜ "CTO at TechInnovate"
  section.testimonials-01.components.q2.props.quote ≜ "The training provided by Atlas AI empowered our team to confidently integrate new AI tools. We've seen a significant boost in productivity."
  section.testimonials-01.components.q2.props.author ≜ "John Smith"
  section.testimonials-01.components.q2.props.role ≜ "Head of Operations at GlobalCorp"
  section.testimonials-01.components.q3.props.quote ≜ "Working with Atlas AI was a game-changer. They delivered a custom AI solution that directly addressed our unique challenges, exceeding all expectations."
  section.testimonials-01.components.q3.props.author ≜ "Alice Johnson"
  section.testimonials-01.components.q3.props.role ≜ "VP of Product at FutureMakers"

  section.contact-01.content.heading ≜ "Connect with Atlas AI Consulting"
  section.contact-01.components.cta-text.props.text ≜ "Ready to unlock the power of AI for your business? Let's talk about your vision."
  section.contact-01.components.cta-text.props.size ≜ "lg"
  section.contact-01.components.cta-button.props.text ≜ "Book a Discovery Call"
  section.contact-01.components.cta-button.props.url ≜ "mailto:info@atlasai.com"
  section.contact-01.components.cta-button.props.style ≜ "filled"
  section.contact-01.components.cta-button.props.size ≜ "xl"

  section.contact-02.content.heading ≜ "Connect with Atlas AI Consulting"
  section.contact-02.components.cta-text.props.text ≜ "Ready to unlock the power of AI for your business? Let's talk about your vision."
  section.contact-02.components.cta-text.props.size ≜ "lg"
  section.contact-02.components.cta-button.props.text ≜ "Book a Discovery Call"
  section.contact-02.components.cta-button.props.url ≜ "mailto:info@atlasai.com"
  section.contact-02.components.cta-button.props.style ≜ "filled"
  section.contact-02.components.cta-button.props.size ≜ "xl"
}

⟦Λ:Parameters⟧
{
  lcp_target_ms ≜ 2500
  aa_contrast_min ≜ 4.5
  section_count ≜ 10
}

⟦Ε:Verification⟧
{
  ∀ s ∈ sections. ⊢ valid(s)
  ⊢ contrast(palette.bgPrimary, palette.textPrimary) ≥ aa_contrast_min
  ⊢ ∃ cta ∈ hero-01.components
}
