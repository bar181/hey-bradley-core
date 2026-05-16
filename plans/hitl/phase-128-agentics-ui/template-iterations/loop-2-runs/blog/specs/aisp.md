⟦Ω:Objective⟧ {
  brand.purpose ≜ "Transforming ideas into reality through intuitive storytelling and AI-driven insights."
  brand.audience ≜ "Creators, innovators, and individuals looking to bridge conceptual vision with technical execution."
  brand.winCondition ≜ "To empower new creations and continuously adapt, truly listening to user ideas and bringing them to life with unprecedented ease and power."
}

⟦Σ:Glossary⟧ {
  brand.title ≜ "Hey Bradley"
  brand.tagline ≜ ""
  brand.author ≜ ""

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

  theme.mode ≜ "dark"
  theme.borderRadius ≜ "8px"
  theme.spacing.sectionPadding ≜ "64px"
  theme.spacing.containerMaxWidth ≜ "1180px"
  theme.spacing.componentGap ≜ "24px"
}

⟦Γ:Constraints⟧ {
  section[0] ≜ ⟨"hero", "hero-01", 0⟩
  section[0].variant ≜ "centered"
  section[0].componentTypes ≜ ["badge", "heading", "text", "button"]
  section[0].componentCount ≜ 4
  section[0].headings ≜ ["Your ideas, made real.", "The whiteboard that listens", "Unlocking the story behind your next big thing."]

  section[1] ≜ ⟨"menu", "navbar-01", -1⟩
  section[1].variant ≜ "simple"
  section[1].componentTypes ≜ ["text", "link", "link", "link"]
  section[1].componentCount 4
  section[1].headings ≜ ["Hey Bradley"]

  section[2] ≜ ⟨"columns", "articles-01", 2⟩
  section[2].variant ≜ "default"
  section[2].componentTypes ≜ ["article-card", "article-card", "article-card"]
  section[2].componentCount 3
  section[2].headings ≜ []

  section[3] ≜ ⟨"hero", "author-bio-01", 97⟩
  section[3].variant ≜ "left-aligned"
  section[3].componentTypes ≜ ["image", "group"]
  section[3].componentCount 2
  section[3].headings ≜ []

  section[4] ≜ ⟨"newsletter", "newsletter-01", 98⟩
  section[4].variant ≜ "inline"
  section[4].componentTypes ≜ ["input", "button"]
  section[4].componentCount 2
  section[4].headings ≜ ["Subscribe"]
}

⟦Δ:Content⟧ {
  section.hero-01.content.heading ≜ "The whiteboard that listens"
  section.hero-01.content.subheading ≜ "Unlocking the story behind your next big thing."
  section.hero-01.eyebrow.props.text ≜ "Your ideas, made real."
  section.hero-01.headline.props.text ≜ "The whiteboard that listens"
  section.hero-01.headline.props.level ≜ 1
  section.hero-01.headline.props.size ≜ "96px"
  section.hero-01.headline.props.weight ≜ 300
  section.hero-01.subtitle.props.text ≜ "Unlocking the story behind your next big thing."
  section.hero-01.primaryCta.props.text ≜ "Read the Stories"
  section.hero-01.primaryCta.props.url ≜ "#articles"
  section.hero-01.primaryCta.props.style ≜ "filled"
  section.hero-01.primaryCta.props.size ≜ "lg"

  section.navbar-01.logo.props.text ≜ "Hey Bradley"
  section.navbar-01.nav-1.props.text ≜ "Articles"
  section.navbar-01.nav-1.props.url ≜ "#articles"
  section.navbar-01.nav-2.props.text ≜ "About"
  section.navbar-01.nav-2.props.url ≜ "#about"
  section.navbar-01.nav-3.props.text ≜ "Contact"
  section.navbar-01.nav-3.props.url ≜ "#contact"

  section.articles-01.content.heading ≜ "The Stories Behind the Product"
  section.articles-01.content.subheading ≜ "Discover the narrative arc of Hey Bradley, from its humble beginnings to its ambitious future."
  section.articles-01.article-1.props.title ≜ "The Spark: How Hey Bradley Began"
  section.articles-01.article-1.props.image ≜ ""
  section.articles-01.article-1.props.alt ≜ "Abstract image representing an idea forming"
  section.articles-01.article-1.props.hook ≜ "Every great idea starts with a simple sketch, but turning that sketch into a living product often feels like speaking different languages."
  section.articles-01.article-1.props.problem ≜ "I struggled to bridge the gap between my conceptual vision and the technical execution, watching good ideas falter in translation."
  section.articles-01.article-1.props.resolution ≜ "Hey Bradley emerged from this frustration: a tool designed to understand your intent, making the leap from thought to prototype seamless and intuitive."
  section.articles-01.article-1.props.tags ≜ ["Origin", "Idea", "Vision"]
  section.articles-01.article-2.props.title ≜ "Crafting the Core: Hey Bradley's Product Philosophy"
  section.articles-01.article-2.props.image ≜ ""
  section.articles-01.article-2.props.alt ≜ "Image representing product development and iteration"
  section.articles-01.article-2.props.hook ≜ "In a world flooded with complex tools, the true challenge isn't adding more features, but making them profoundly simple and effective."
  section.articles-01.article-2.props.problem ≜ "Building Hey Bradley meant constantly fighting the urge to over-engineer, risking feature bloat that would betray its core promise of intuitive creation."
  section.articles-01.article-2.props.resolution ≜ "We committed to a 'less but better' philosophy, meticulously refining each interaction to ensure Hey Bradley feels like a natural extension of your creative flow."
  section.articles-01.article-2.props.tags ≜ ["Product", "Design", "Philosophy"]
  section.articles-01.article-3.props.title ≜ "The Grand Vision: Hey Bradley's Capstone Journey"
  section.articles-01.article-3.props.image ≜ ""
  section.articles-01.article-3.props.alt ≜ "Image representing a finished project or journey's end"
  section.articles-01.article-3.props.hook ≜ "Looking ahead, the ultimate test of any innovation is its ability to empower new creations we haven't even imagined yet."
  section.articles-01.article-3.props.problem ≜ "As Hey Bradley evolves, the challenge is to expand its capabilities without compromising the magical simplicity that defines it, ensuring it grows with its users."
  section.articles-01.article-3.props.resolution ≜ "Our capstone is an ongoing journey to build a platform that continuously learns and adapts, truly listening to your ideas and bringing them to life with unprecedented ease and power."
  section.articles-01.article-3.props.tags ≜ ["Future", "Vision", "Innovation"]

  section.author-bio-01.bio-image.props.src ≜ "https://via.placeholder.com/250x250/cc3333/fefefe?text=Bradley"
  section.author-bio-01.bio-image.props.alt ≜ "Portrait of Bradley Ross"
  section.author-bio-01.bio-image.props.width ≜ "250px"
  section.author-bio-01.bio-image.props.height ≜ "250px"
  section.author-bio-01.bio-image.props.borderRadius ≜ "50%"
  section.author-bio-01.bio-content.bio-heading.props.text ≜ "About Bradley Ross"
  section.author-bio-01.bio-content.bio-heading.props.level ≜ 2
  section.author-bio-01.bio-content.bio-text.props.text ≜ "Bradley Ross holds an ALM from Harvard University, where he specialized in the intersection of technology and narrative design. He is the creator of Hey Bradley, a platform dedicated to transforming ideas into reality through intuitive storytelling and AI-driven insights."

  section.newsletter-01.content.heading ≜ "Join the Journey"
  section.newsletter-01.content.subheading ≜ "Get updates on AI, narrative design, and the future of creation."
  section.newsletter-01.email-input.props.placeholder ≜ "your@email.com"
  section.newsletter-01.email-input.props.name ≜ "email"
  section.newsletter-01.submit.props.text ≜ "Subscribe"
  section.newsletter-01.submit.props.style ≜ "filled"
}

⟦Λ:Parameters⟧ {
  lcp_target_ms ≜ 2500
  aa_contrast_min ≜ 4.5
  section_count ≜ 5
}

⟦Ε:Verification⟧ {
  ∀ s ∈ sections. ⊢ valid(s)
  ⊢ contrast(palette.bgPrimary, palette.textPrimary) ≥ aa_contrast_min
  ⊢ ∃ cta ∈ section.hero-01.components
  ∎
}
