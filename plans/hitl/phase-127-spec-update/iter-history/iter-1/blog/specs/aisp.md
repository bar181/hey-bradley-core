⟦Ω⟧
  Ω ≜ SiteSpec
  SiteSpec ⊢ Ambig(D) < 0.02
  SiteSpec ⊢ ∀ s ∈ Site. s ∉ ∅
  SiteSpec ⊢ ∀ s ∈ Site. s.sectionCount = |s.sections|

⟦Σ⟧
  𝔹 ≜ {⊤, ⊥}
  ℕ ≜ {0, 1, 2, ...}
  ℤ ≜ {..., -1, 0, 1, ...}
  ℝ ≜ set of real numbers
  𝕊 ≜ sequence of Unicode characters
  Hash ≜ 𝕊_fixed_length
  Sig ≜ 𝕊_cryptographic_signature

  Vec(α) ≜ List(α)
  Pair(α, β) ≜ ⟨α, β⟩
  Maybe(α) ≜ α ∪ {∅}
  Either(α, β) ≜ (α ∪ β) ∧ (α ∩ β = ∅)

  ColorHex ≜ 𝕊 ⊢ (length=7) ∧ (starts_with='#') ∧ (matches_regex '^[#][0-9a-fA-F]{6}$')
  CSSLength ≜ 𝕊 ⊢ (ends_with 'px') ∧ (starts_with_num)
  Ratio ≜ ℝ ⊢ (x ≥ 0)

  Site ≜ ⟨Title, Tagline, BrandName, Author, VoiceAttributes, Tone, Audience, Purpose, Theme, Sections, SectionCount⟩
  Title ≜ 𝕊
  Tagline 𝕊
  BrandName ≜ 𝕊
  Author ≜ 𝕊
  VoiceAttributes ≜ Vec(𝕊)
  Tone ≜ 𝕊
  Audience ≜ 𝕊
  Purpose ≜ 𝕊

  Theme ≜ ⟨Mode, Palette, Typography, Spacing⟩
  Mode ≜ Either('dark', 'light')
  Palette ≜ ⟨BgPrimary, BgSecondary, TextPrimary, TextSecondary, AccentPrimary, AccentSecondary⟩
  BgPrimary ≜ ColorHex
  BgSecondary ≜ ColorHex
  TextPrimary ≜ ColorHex
  TextSecondary ≜ ColorHex
  AccentPrimary ≜ ColorHex
  AccentSecondary ≜ ColorHex

  Typography ≜ ⟨FontFamily, HeadingFamily, BaseSize, LineHeight⟩
  FontFamily ≜ 𝕊
  HeadingFamily ≜ 𝕊
  BaseSize ≜ CSSLength
  LineHeight ≜ Ratio

  Spacing ≜ ⟨SectionPadding, ContainerMaxWidth, ComponentGap⟩
  SectionPadding ≜ CSSLength
  ContainerMaxWidth ≜ CSSLength
  ComponentGap ≜ CSSLength

  Section ≜ ⟨Idx, Type, Id, Order, Variant, ComponentTypes, ComponentCount, Headings⟩
  Idx ≜ ℕ
  Type ≜ 𝕊
  Id ≜ 𝕊
  Order ≜ ℤ
  Variant ≜ 𝕊
  ComponentTypes ≜ Vec(𝕊)
  ComponentCount ≜ ℕ
  Headings ≜ Vec(𝕊)

  SectionType ≜ {'hero', 'menu', 'columns', 'newsletter'}
  ComponentType ≜ {'badge', 'heading', 'text', 'button', 'link', 'article-card', 'image', 'group', 'input'}

⟦Γ⟧
  Site.title ≔ "Hey Bradley"
  Site.tagline ≔ ""
  Site.brandName ≔ ""
  Site.author ≔ ""
  Site.voiceAttributes ≔ []
  Site.tone ≔ ""
  Site.audience ≔ ""
  Site.purpose ≔ ""

  Site.theme.mode ≔ 'dark'
  Site.theme.palette.bgPrimary ≔ "#1a0000"
  Site.theme.palette.bgSecondary ≔ "#330000"
  Site.theme.palette.textPrimary ≔ "#fefefe"
  Site.theme.palette.textSecondary ≔ "#bbb"
  Site.theme.palette.accentPrimary ≔ "#cc3333"
  Site.theme.palette.accentSecondary ≔ "#ff6666"

  Site.theme.typography.fontFamily ≔ "Inter"
  Site.theme.typography.headingFamily ≔ "Cormorant Garamond"
  Site.theme.typography.baseSize ≔ "16px"
  Site.theme.typography.lineHeight ≔ 1.5

  Site.theme.spacing.sectionPadding ≔ "64px"
  Site.theme.spacing.containerMaxWidth ≔ "1180px"
  Site.theme.spacing.componentGap ≔ "24px"

  Site.sectionCount ≔ 5
  ∀ s ∈ Site.sections. s.Idx ∈ [0, Site.sectionCount - 1]
  ∀ s ∈ Site.sections. s.Type ∈ SectionType
  ∀ s ∈ Site.sections. s.ComponentCount = |s.ComponentTypes|
  ∀ s ∈ Site.sections. ∀ c ∈ s.ComponentTypes. c ∈ ComponentType

  Site.sections[0].idx ≔ 0
  Site.sections[0].type ≔ 'hero'
  Site.sections[0].id ≔ 'hero-01'
  Site.sections[0].order ≔ 0
  Site.sections[0].variant ≔ 'centered'
  Site.sections[0].componentTypes ≔ ['badge', 'heading', 'text', 'button']
  Site.sections[0].componentCount ≔ 4
  Site.sections[0].headings ≔ ["Your ideas, made real.", "The whiteboard that listens", "Unlocking the story behind your next big thing."]

  Site.sections[1].idx ≔ 1
  Site.sections[1].type ≔ 'menu'
  Site.sections[1].id ≔ 'navbar-01'
  Site.sections[1].order ≔ -1
  Site.sections[1].variant ≔ 'simple'
  Site.sections[1].componentTypes ≔ ['text', 'link', 'link', 'link']
  Site.sections[1].componentCount ≔ 4
  Site.sections[1].headings ≔ ["Hey Bradley"]

  Site.sections[2].idx ≔ 2
  Site.sections[2].type ≔ 'columns'
  Site.sections[2].id ≔ 'articles-01'
  Site.sections[2].order ≔ 2
  Site.sections[2].variant ≔ 'default'
  Site.sections[2].componentTypes ≔ ['article-card', 'article-card', 'article-card']
  Site.sections[2].componentCount 3
  Site.sections[2].headings ≔ []

  Site.sections[3].idx ≔ 3
  Site.sections[3].type ≔ 'hero'
  Site.sections[3].id ≔ 'author-bio-01'
  Site.sections[3].order ≔ 97
  Site.sections[3].variant ≔ 'left-aligned'
  Site.sections[3].componentTypes ≔ ['image', 'group']
  Site.sections[3].componentCount ≔ 2
  Site.sections[3].headings ≔ []

  Site.sections[4].idx ≔ 4
  Site.sections[4].type ≔ 'newsletter'
  Site.sections[4].id ≔ 'newsletter-01'
  Site.sections[4].order ≔ 98
  Site.sections[4].variant ≔ 'inline'
  Site.sections[4].componentTypes ≔ ['input', 'button']
  Site.sections[4].componentCount ≔ 2
  Site.sections[4].headings ≔ ["Subscribe"]

⟦Λ⟧
  Λ_MIN_SECTIONS ≜ 1
  Λ_MAX_SECTIONS ≜ 10
  Λ_MAX_COMPONENTS_PER_SECTION ≜ 8
  Λ_MAX_HEADINGS_PER_SECTION ≜ 3
  Λ_MIN_COLOR_HEX_LEN ≜ 7
  Λ_MAX_COLOR_HEX_LEN ≜ 7
  Λ_MIN_LINE_HEIGHT ≜ 1.0
  Λ_MAX_LINE_HEIGHT ≜ 2.0

⟦Ε⟧
  Ε_SiteCount ≜ Site.sectionCount ≥ Λ_MIN_SECTIONS ∧ Site.sectionCount ≤ Λ_MAX_SECTIONS
  Ε_SectionOrderUniqueness ≜ ∀ i, j ∈ Site.sections. (i ≠ j) ⇒ (i.order ≠ j.order)
  Ε_ComponentCountValidity ≜ ∀ s ∈ Site.sections. s.ComponentCount ≥ 0 ∧ s.ComponentCount ≤ Λ_MAX_COMPONENTS_PER_SECTION
  Ε_HeadingCountValidity ≜ ∀ s ∈ Site.sections. |s.Headings| ≤ Λ_MAX_HEADINGS_PER_SECTION
  Ε_PaletteColorFormat ≜ ∀ c ∈ {Site.theme.palette.bgPrimary, Site.theme.palette.bgSecondary, Site.theme.palette.textPrimary, Site.theme.palette.textSecondary, Site.theme.palette.accentPrimary, Site.theme.palette.accentSecondary}.
    (length(c) = Λ_MIN_COLOR_HEX_LEN) ∧ (first(c) = '#') ∧ (∀ char ∈ rest(c). char ∈ '0123456789abcdefABCDEF')
  Ε_LineHeightRange ≜ Site.theme.typography.lineHeight ≥ Λ_MIN_LINE_HEIGHT ∧ Site.theme.typography.lineHeight ≤ Λ_MAX_LINE_HEIGHT
  Ε_CSSLengthFormat ≜ ∀ l ∈ {Site.theme.typography.baseSize, Site.theme.spacing.sectionPadding, Site.theme.spacing.containerMaxWidth, Site.theme.spacing.componentGap}.
    (ends_with(l, "px")) ∧ (is_numeric(substring(l, 0, length(l)-2)))
  Ε_UniqueSectionIDs ≜ ∀ s1, s2 ∈ Site.sections. (s1.Id = s2.Id) ⇒ (s1.Idx = s2.Idx)

  Ε_All_Valid ≜ Ε_SiteCount ∧ Ε_SectionOrderUniqueness ∧ Ε_ComponentCountValidity ∧ Ε_HeadingCountValidity ∧ Ε_PaletteColorFormat ∧ Ε_LineHeightRange ∧ Ε_CSSLengthFormat ∧ Ε_UniqueSectionIDs
