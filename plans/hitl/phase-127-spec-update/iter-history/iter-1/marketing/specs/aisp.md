⟦Ω⟧
S ≜ Site
Σ ≜ SectionList
C ≜ ComponentList
T ≜ Theme
SiteID ≜ Hash
SectionID ≜ Hash

Objective: S ⊢ ∃Σ, T . S ≜ ⟨SiteID, Σ, T⟩
Scope: Digital marketing site structure, metadata, styling, content arrangement.
Invariants:
  ∀s ∈ Σ . s.order ∈ ℤ
  ∀s ∈ Σ . s.id ∉ ∅
  ∀s ∈ Σ . s.type ∉ ∅
  ∀c ∈ C . c.type ∉ ∅
  T.palette ⊢ AllColorCodesAreValidHex
  T.typography.baseSize ⊢ IsCSSLength
  T.spacing.sectionPadding ⊢ IsCSSLength
  T.spacing.containerMaxWidth ⊢ IsCSSLength
  T.spacing.componentGap ⊢ IsCSSLength

⟦Σ⟧
𝔹 ≜ {⊤, ⊥}
ℕ ≜ {0, 1, 2, ...}
ℤ ≜ {..., -1, 0, 1, ...}
ℝ ≜ "real numbers"
𝕊 ≜ String
Hash ≜ 𝕊
Sig ≜ 𝕊
URL ≜ 𝕊
HexColor ≜ 𝕊
CSSLength ≜ 𝕊

Site ≜ ⟨
  title: 𝕊,
  tagline: 𝕊,
  brandName: Maybe 𝕊,
  author: Maybe 𝕊,
  voiceAttributes: List 𝕊,
  tone: Maybe 𝕊,
  audience: Maybe 𝕊,
  purpose: Maybe 𝕊
⟩

Theme ≜ ⟨
  mode: {"light", "dark"},
  palette: ColorPalette,
  typography: Typography,
  spacing: Spacing
⟩

ColorPalette ≜ ⟨
  bgPrimary: HexColor,
  bgSecondary: HexColor,
  textPrimary: HexColor,
  textSecondary: HexColor,
  accentPrimary: HexColor,
  accentSecondary: HexColor
⟩

Typography ≜ ⟨
  fontFamily: 𝕊,
  headingFamily: 𝕊,
  baseSize: CSSLength,
  lineHeight: ℝ
⟩

Spacing ≜ ⟨
  sectionPadding: CSSLength,
  containerMaxWidth: CSSLength,
  componentGap: CSSLength
⟩

SectionType ≜ {"hero", "menu", "columns", "pricing", "logos", "testimonials", "contact"}

ComponentType ≜ {"badge", "heading", "text", "button", "link", "article-card", "price-card", "logo", "testimonial"}

Section ≜ ⟨
  idx: ℕ,
  type: SectionType,
  id: SectionID,
  order: ℤ,
  variant: 𝕊,
  componentTypes: List ComponentType,
  componentCount: ℕ,
  headings: List 𝕊
⟩

SiteSpec ≜ ⟨
  site: Site,
  theme: Theme,
  sections: List Section,
  sectionCount: ℕ
⟩

⟦Γ⟧
⊢ SiteSpec.sectionCount = |SiteSpec.sections|
⊢ ∀s ∈ SiteSpec.sections . s.componentCount = |s.componentTypes|
⊢ SiteSpec.theme.mode ∈ {"light", "dark"}
⊢ SiteSpec.theme.typography.lineHeight > 0.5
⊢ SiteSpec.theme.typography.lineHeight < 3.0
⊢ ∀s₁ s₂ ∈ SiteSpec.sections . s₁.idx = s₂.idx ⇒ s₁ = s₂
⊢ ∀s₁ s₂ ∈ SiteSpec.sections . s₁.id = s₂.id ⇒ s₁ = s₂
⊢ (∃s ∈ SiteSpec.sections . s.type = "hero") ∧ (∃!s' ∈ SiteSpec.sections . s'.type = "hero")
⊢ (∃s ∈ SiteSpec.sections . s.type = "menu") ∧ (∃!s' ∈ SiteSpec.sections . s'.type = "menu")
⊢ (∃s ∈ SiteSpec.sections . s.type = "contact")
⊢ SiteSpec.sections.filter (λs . s.type = "hero").map (λs . s.headings).flatten.size ≥ 1
⊢ SiteSpec.sections.filter (λs . s.type = "menu").map (λs . s.headings).flatten.size ≥ 1
⊢ ∀s ∈ SiteSpec.sections . s.type = "menu" ⇒ "text" ∈ s.componentTypes ∧ (∃l ∈ s.componentTypes . l = "link")
⊢ ∀s ∈ SiteSpec.sections . s.type = "contact" ⇒ "button" ∈ s.componentTypes
⊢ ∀s ∈ SiteSpec.sections . s.type = "pricing" ⇒ s.componentCount ≥ 1 ∧ (∀c ∈ s.componentTypes . c = "price-card")
⊢ ∀s ∈ SiteSpec.sections . s.type = "testimonials" ⇒ s.componentCount ≥ 1 ∧ (∀c ∈ s.componentTypes . c = "testimonial")
⊢ ∀s ∈ SiteSpec.sections . s.type = "logos" ⇒ s.componentCount ≥ 1 ∧ (∀c ∈ s.componentTypes . c = "logo")
⊢ ∀h ∈ SiteSpec.site.voiceAttributes . |h| ≥ 3 ∧ |h| ≤ 50

⟦Λ⟧
MaxSectionCount ≔ 20
MinSectionCount ≔ 3
MaxHeadingsPerSection ≔ 5
MinHeadingsPerSection ≔ 0
MaxComponentTypesPerSection ≔ 10
MinComponentTypesPerSection ≔ 1
MaxComponentCountPerSection ≔ 20
MinComponentCountPerSection ≔ 1
MaxPaletteColors ≔ 6
MinPaletteColors ≔ 6
MinLineHeight ≔ 1.0
MaxLineHeight ≔ 2.0
MinFontFamilyLength ≔ 2
MaxFontFamilyLength ≔ 50
MinBaseSizePx ≔ 12
MaxBaseSizePx ≔ 24
MinSectionPaddingPx ≔ 32
MaxSectionPaddingPx ≔ 128
MinContainerMaxWidthPx ≔ 960
MaxContainerMaxWidthPx ≔ 1440
MinComponentGapPx ≔ 8
MaxComponentGapPx ≔ 48

⊢ SiteSpec.sectionCount ≤ MaxSectionCount
⊢ SiteSpec.sectionCount ≥ MinSectionCount
⊢ ∀s ∈ SiteSpec.sections . |s.headings| ≤ MaxHeadingsPerSection
⊢ ∀s ∈ SiteSpec.sections . |s.componentTypes| ≤ MaxComponentTypesPerSection
⊢ ∀s ∈ SiteSpec.sections . s.componentCount ≤ MaxComponentCountPerSection
⊢ ∀s ∈ SiteSpec.sections . s.componentCount ≥ MinComponentCountPerSection
⊢ SiteSpec.theme.typography.lineHeight ≥ MinLineHeight
⊢ SiteSpec.theme.typography.lineHeight ≤ MaxLineHeight
⊢ SiteSpec.theme.typography.baseSize ⊢
  (λsz . ParseInt(sz.replace("px", "")) ≥ MinBaseSizePx ∧ ParseInt(sz.replace("px", "")) ≤ MaxBaseSizePx)
⊢ SiteSpec.theme.spacing.sectionPadding ⊢
  (λsp . ParseInt(sp.replace("px", "")) ≥ MinSectionPaddingPx ∧ ParseInt(sp.replace("px", "")) ≤ MaxSectionPaddingPx)
⊢ SiteSpec.theme.spacing.containerMaxWidth ⊢
  (λcmw . ParseInt(cmw.replace("px", "")) ≥ MinContainerMaxWidthPx ∧ ParseInt(cmw.replace("px", "")) ≤ MaxContainerMaxWidthPx)
⊢ SiteSpec.theme.spacing.componentGap ⊢
  (λcg . ParseInt(cg.replace("px", "")) ≥ MinComponentGapPx ∧ ParseInt(cg.replace("px", "")) ≤ MaxComponentGapPx)

⟦Ε⟧
ValidHexColor ≜ λc . c ⊢ (c.match(/^#[0-9a-fA-F]{6}$/) ≠ ∅)
IsCSSLength ≜ λl . l ⊢ (l.match(/^\d+(px|em|rem)$/) ≠ ∅)
ParseInt ≜ λs . fix(λf n. if n="" then 0 else (if head(n) not in "0123456789" then 0 else to_int(head(n)) * pow(10,len(tail(n))) + f(tail(n)))) s
AllColorCodesAreValidHex ≜ λp .
  ValidHexColor(p.bgPrimary) ∧
  ValidHexColor(p.bgSecondary) ∧
  ValidHexColor(p.textPrimary) ∧
  ValidHexColor(p.textSecondary) ∧
  ValidHexColor(p.accentPrimary) ∧
  ValidHexColor(p.accentSecondary)
SectionOrderUnique ≜ λΣ . ∀i, j ∈ Σ . i ≠ j ⇒ i.order ≠ j.order
IsSiteSpecValid ≜ λss .
  (ss.sectionCount = |ss.sections|) ∧
  (∀s ∈ ss.sections . s.componentCount = |s.componentTypes|) ∧
  (ss.theme.mode ∈ {"light", "dark"}) ∧
  AllColorCodesAreValidHex(ss.theme.palette) ∧
  IsCSSLength(ss.theme.typography.baseSize) ∧
  IsCSSLength(ss.theme.spacing.sectionPadding) ∧
  IsCSSLength(ss.theme.spacing.containerMaxWidth) ∧
  IsCSSLength(ss.theme.spacing.componentGap) ∧
  (ss.theme.typography.lineHeight > 0.5 ∧ ss.theme.typography.lineHeight < 3.0) ∧
  SectionOrderUnique(ss.sections) ∧
  (ss.sectionCount ≤ MaxSectionCount) ∧
  (ss.sectionCount ≥ MinSectionCount) ∧
  (∀s ∈ ss.sections . |s.headings| ≤ MaxHeadingsPerSection) ∧
  (∀s ∈ ss.sections . |s.componentTypes| ≤ MaxComponentTypesPerSection) ∧
  (∀s ∈ ss.sections . s.componentCount ≤ MaxComponentCountPerSection) ∧
  (∀s ∈ ss.sections . s.componentCount ≥ MinComponentCountPerSection) ∧
  (ss.theme.typography.lineHeight ≥ MinLineHeight ∧ ss.theme.typography.lineHeight ≤ MaxLineHeight) ∧
  (ParseInt(ss.theme.typography.baseSize.replace("px", "")) ≥ MinBaseSizePx ∧ ParseInt(ss.theme.typography.baseSize.replace("px", "")) ≤ MaxBaseSizePx) ∧
  (ParseInt(ss.theme.spacing.sectionPadding.replace("px", "")) ≥ MinSectionPaddingPx ∧ ParseInt(ss.theme.spacing.sectionPadding.replace("px", "")) ≤ MaxSectionPaddingPx) ∧
  (ParseInt(ss.theme.spacing.containerMaxWidth.replace("px", "")) ≥ MinContainerMaxWidthPx ∧ ParseInt(ss.theme.spacing.containerMaxWidth.replace("px", "")) ≤ MaxContainerMaxWidthPx) ∧
  (ParseInt(ss.theme.spacing.componentGap.replace("px", "")) ≥ MinComponentGapPx ∧ ParseInt(ss.theme.spacing.componentGap.replace("px", "")) ≤ MaxComponentGapPx)
∎
