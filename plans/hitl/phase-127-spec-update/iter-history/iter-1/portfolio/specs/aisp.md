⟦Ω⟧
  ⊤ ≜ A site specification.
  SiteSpec ≜ (Site ⊗ Theme ⊗ Vec[Section] ⊗ sectionCount: ℕ)
  Site ≜ ⟨title: 𝕊, tagline: 𝕊, brandName: 𝕊, author: 𝕊, voiceAttributes: Vec[𝕊], tone: 𝕊, audience: 𝕊, purpose: 𝕊⟩
  Theme ≜ ⟨mode: Mode, palette: Palette, typography: Typography, spacing: Spacing⟩
  Palette ≜ ⟨bgPrimary: HexColor, bgSecondary: HexColor, textPrimary: HexColor, textSecondary: HexColor, accentPrimary: HexColor, accentSecondary: HexColor⟩
  Typography ≜ ⟨fontFamily: 𝕊, headingFamily: 𝕊, baseSize: CSSSize, lineHeight: ℝ⟩
  Spacing ≜ ⟨sectionPadding: CSSSize, containerMaxWidth: CSSSize, componentGap: CSSSize⟩
  Section ≜ ⟨idx: ℕ, type: SectionType, id: 𝕊, order: ℤ, variant: 𝕊, componentTypes: Vec[ComponentType], componentCount: ℕ, headings: Vec[𝕊]⟩
  Mode ≜ 𝕊 ("light" ∨ "dark")
  HexColor ≜ 𝕊 (Pattern "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
  CSSSize ≜ 𝕊 (Pattern "^\\d+(px|em|rem|%)$")
  SectionType ≜ 𝕊 ("menu" ∨ "hero" ∨ "video" ∨ "columns" ∨ "contact")
  ComponentType ≜ 𝕊 ("text" ∨ "link" ∨ "heading" ∨ "button" ∨ "video-embed" ∨ "project-card")
  Ambig(D) < 0.02 ∎

⟦Σ⟧
  type SiteSpec
  type Site
  type Theme
  type Palette
  type Typography
  type Spacing
  type Section
  type Mode ≜ 𝕊
  type HexColor ≜ 𝕊
  type CSSSize ≜ 𝕊
  type SectionType ≜ 𝕊
  type ComponentType ≜ 𝕊
  atom "Bradley Ross | Visual Designer" : 𝕊
  atom "Visual designer portfolio for Bradley Ross" : 𝕊
  atom "light" : Mode
  atom "#fdfaf6" : HexColor
  atom "#f5f0e8" : HexColor
  atom "#111" : HexColor
  atom "#555" : HexColor
  atom "#80a490" : HexColor
  atom "#a6b9a8" : HexColor
  atom "Inter" : 𝕊
  atom "Outfit" : 𝕊
  atom "16px" : CSSSize
  atom 1.5 : ℝ
  atom "64px" : CSSSize
  atom "1180px" : CSSSize
  atom "24px" : CSSSize
  atom 0 : ℕ
  atom "menu" : SectionType
  atom "navbar-01" : 𝕊
  atom -1 : ℤ
  atom "simple" : 𝕊
  atom "text" : ComponentType
  atom "link" : ComponentType
  atom 3 : ℕ
  atom "Bradley Ross" : 𝕊
  atom 1 : ℕ
  atom "hero" : SectionType
  atom "hero-01" : 𝕊
  atom 0 : ℤ
  atom "centered" : 𝕊
  atom "heading" : ComponentType
  atom "button" : ComponentType
  atom 5 : ℕ
  atom "Visual Designer" : 𝕊
  atom "Crafting thoughtful visual experiences." : 𝕊
  atom 2 : ℕ
  atom "video" : SectionType
  atom "video-01" : 𝕊
  atom "reel" : 𝕊
  atom "video-embed" : ComponentType
  atom 1 : ℕ
  atom 3 : ℕ
  atom "columns" : SectionType
  atom "projects-01" : 𝕊
  atom "project-grid" : 𝕊
  atom "project-card" : ComponentType
  atom 6 : ℕ
  atom 4 : ℕ
  atom "contact" : SectionType
  atom "contact-01" : 𝕊
  atom 99 : ℤ
  atom 2 : ℕ
  atom 5 : ℕ ∎

⟦Γ⟧
  (S : SiteSpec) ⊢ S.sectionCount = S.sections.length
  (S : SiteSpec) ⊢ ∀(s : S.sections) → s.idx ∈ {0, ..., S.sectionCount - 1}
  (S : SiteSpec) ⊢ S.site.title = "Bradley Ross | Visual Designer"
  (S : SiteSpec) ⊢ S.site.tagline = "Visual designer portfolio for Bradley Ross"
  (S : SiteSpec) ⊢ S.site.brandName = "" ∧ S.site.author = "" ∧ S.site.voiceAttributes = [] ∧ S.site.tone = "" ∧ S.site.audience = "" ∧ S.site.purpose = ""
  (S : SiteSpec) ⊢ S.theme.mode = "light"
  (S : SiteSpec) ⊢ S.theme.palette = ⟨bgPrimary: "#fdfaf6", bgSecondary: "#f5f0e8", textPrimary: "#111", textSecondary: "#555", accentPrimary: "#80a490", accentSecondary: "#a6b9a8"⟩
  (S : SiteSpec) ⊢ S.theme.typography = ⟨fontFamily: "Inter", headingFamily: "Outfit", baseSize: "16px", lineHeight: 1.5⟩
  (S : SiteSpec) ⊢ S.theme.spacing = ⟨sectionPadding: "64px", containerMaxWidth: "1180px", componentGap: "24px"⟩
  (S : SiteSpec) ⊢ ∀(s : S.sections) → s.componentCount = s.componentTypes.length
  (S : SiteSpec) ⊢ ∃! (s : S.sections) → s.idx = 0 ∧ s.type = "menu" ∧ s.id = "navbar-01" ∧ s.order = -1 ∧ s.variant = "simple" ∧ s.componentTypes = ["text", "link", "link"] ∧ s.componentCount = 3 ∧ s.headings = ["Bradley Ross"]
  (S : SiteSpec) ⊢ ∃! (s : S.sections) → s.idx = 1 ∧ s.type = "hero" ∧ s.id = "hero-01" ∧ s.order = 0 ∧ s.variant = "centered" ∧ s.componentTypes = ["heading", "text", "text", "text", "button"] ∧ s.componentCount = 5 ∧ s.headings = ["Bradley Ross", "Visual Designer", "Crafting thoughtful visual experiences."]
  (S : SiteSpec) ⊢ ∃! (s : S.sections) → s.idx = 2 ∧ s.type = "video" ∧ s.id = "video-01" ∧ s.order = 1 ∧ s.variant = "reel" ∧ s.componentTypes = ["video-embed"] ∧ s.componentCount = 1 ∧ s.headings = []
  (S : SiteSpec) ⊢ ∃! (s : S.sections) → s.idx = 3 ∧ s.type = "columns" ∧ s.id = "projects-01" ∧ s.order = 2 ∧ s.variant = "project-grid" ∧ s.componentTypes = ["project-card", "project-card", "project-card", "project-card", "project-card", "project-card"] ∧ s.componentCount = 6 ∧ s.headings = []
  (S : SiteSpec) ⊢ ∃! (s : S.sections) → s.idx = 4 ∧ s.type = "contact" ∧ s.id = "contact-01" ∧ s.order = 99 ∧ s.variant = "simple" ∧ s.componentTypes = ["link", "link"] ∧ s.componentCount = 2 ∧ s.headings = []
  (S : SiteSpec) ⊢ ∀(i : ℕ), (i < S.sections.length - 1) ⇒ S.sections[i].order < S.sections[i+1].order ∎

⟦Λ⟧
  MAX_SECTIONS ≜ 10
  MAX_COMPONENTS_PER_SECTION ≜ 20
  MAX_HEADINGS_PER_SECTION ≜ 5
  MIN_HEX_COLOR_LENGTH ≜ 4
  MAX_HEX_COLOR_LENGTH ≜ 7
  MIN_CSS_SIZE_LENGTH ≜ 3
  MAX_CSS_SIZE_LENGTH ≜ 10
  MIN_LINE_HEIGHT ≜ 1.0
  MAX_LINE_HEIGHT ≜ 2.5
  BRAND_NAME_MAX_LENGTH ≜ 50
  TAGLINE_MAX_LENGTH ≜ 200 ∎

⟦Ε⟧
  check_SiteSpec(S: SiteSpec) ≜
    is_valid_Site(S.site) ∧
    is_valid_Theme(S.theme) ∧
    is_valid_Sections(S.sections) ∧
    (S.sectionCount = S.sections.length) ∧
    (S.sectionCount ≤ MAX_SECTIONS)

  is_valid_Site(site: Site) ≜
    (site.title ≢ "") ∧
    (site.tagline ≢ "") ∧
    (site.brandName.length ≤ BRAND_NAME_MAX_LENGTH) ∧
    (site.tagline.length ≤ TAGLINE_MAX_LENGTH)

  is_valid_Theme(theme: Theme) ≜
    is_valid_Mode(theme.mode) ∧
    is_valid_Palette(theme.palette) ∧
    is_valid_Typography(theme.typography) ∧
    is_valid_Spacing(theme.spacing)

  is_valid_Mode(m: Mode) ≜ (m = "light" ∨ m = "dark")

  is_valid_HexColor(c: HexColor) ≜
    (c.length ≥ MIN_HEX_COLOR_LENGTH) ∧
    (c.length ≤ MAX_HEX_COLOR_LENGTH) ∧
    (c matches Pattern "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")

  is_valid_CSSSize(s: CSSSize) ≜
    (s.length ≥ MIN_CSS_SIZE_LENGTH) ∧
    (s.length ≤ MAX_CSS_SIZE_LENGTH) ∧
    (s matches Pattern "^\\d+(px|em|rem|%)$")

  is_valid_Palette(p: Palette) ≜
    is_valid_HexColor(p.bgPrimary) ∧ is_valid_HexColor(p.bgSecondary) ∧
    is_valid_HexColor(p.textPrimary) ∧ is_valid_HexColor(p.textSecondary) ∧
    is_valid_HexColor(p.accentPrimary) ∧ is_valid_HexColor(p.accentSecondary)

  is_valid_Typography(t: Typography) ≜
    (t.fontFamily ≢ "") ∧ (t.headingFamily ≢ "") ∧
    is_valid_CSSSize(t.baseSize) ∧
    (t.lineHeight ≥ MIN_LINE_HEIGHT) ∧ (t.lineHeight ≤ MAX_LINE_HEIGHT)

  is_valid_Spacing(s: Spacing) ≜
    is_valid_CSSSize(s.sectionPadding) ∧
    is_valid_CSSSize(s.containerMaxWidth) ∧
    is_valid_CSSSize(s.componentGap)

  is_valid_Sections(sections: Vec[Section]) ≜
    ∀(s : sections) →
      (s.idx ≥ 0) ∧
      (s.id ≢ "") ∧
      is_valid_SectionType(s.type) ∧
      (s.componentCount = s.componentTypes.length) ∧
      (s.componentCount ≤ MAX_COMPONENTS_PER_SECTION) ∧
      (s.headings.length ≤ MAX_HEADINGS_PER_SECTION) ∧
      ∀(ct : s.componentTypes) → is_valid_ComponentType(ct) ∧
      ∀(h : s.headings) → (h ≢ "") ∧
    ∀(i : ℕ), (i < sections.length - 1) ⇒ (sections[i].order < sections[i+1].order)

  is_valid_SectionType(t: SectionType) ≜
    (t = "menu" ∨ t = "hero" ∨ t = "video" ∨ t = "columns" ∨ t = "contact")

  is_valid_ComponentType(t: ComponentType) ≜
    (t = "text" ∨ t = "link" ∨ t = "heading" ∨ t = "button" ∨ t = "video-embed" ∨ t = "project-card") ∎
