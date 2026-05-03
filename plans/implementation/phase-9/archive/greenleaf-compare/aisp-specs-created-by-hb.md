% AISP 5.1 | Crystal Atom Platinum | <2% ambiguity target
% Site: GreenLeaf Consulting
% Generated: 2026-04-04

⟦
  Ω := {
    Render marketing website "GreenLeaf Consulting": 8 sections,
    theme: "professional",
    mode: light,
    font: "Inter"
  }

  Σ := {
    MasterConfig : 𝕋 := { site: Site, theme: Theme, sections: Section 𝕃 },
    Site : 𝕋 := { title: 𝕊, description: 𝕊, author: 𝕊, domain: 𝕊 },
    Theme : 𝕋 := { preset: 𝕊, mode: 𝕊, palette: Palette, typography: Typography, spacing: Spacing },
    Palette : 𝕋 := { bg₁: 𝕊, bg₂: 𝕊, txt₁: 𝕊, txt₂: 𝕊, acc₁: 𝕊, acc₂: 𝕊 },
    Typography : 𝕋 := { fontFamily: 𝕊, headingFamily: 𝕊, headingWeight: ℕ, baseSize: 𝕊, lineHeight: ℝ },
    Spacing : 𝕋 := { sectionPadding: 𝕊, containerMaxWidth: 𝕊, componentGap: 𝕊 },
    Section : 𝕋 := { type: SectionType, id: 𝕊, variant: 𝕊, heading: 𝕊?, subheading: 𝕊?,
                      layout: Layout, style: Style, components: Component 𝕃 },
    Layout : 𝕋 := { display: 𝕊, direction: 𝕊?, columns: ℕ?, gap: 𝕊, padding: 𝕊 },
    Style : 𝕋 := { background: 𝕊, color: 𝕊, fontFamily: 𝕊?, borderRadius: 𝕊? },
    Component : 𝕋 := { id: 𝕊, type: 𝕊, enabled: 𝔹, props: Map⟨𝕊, Any⟩ },
    SectionType : 𝕋 := {menu, hero, columns, numbers, quotes, questions, action, footer}
  }

  Γ := {
    R1: ∀ s ∈ sections : s.enabled = ⊤ ⟹ render(s),
    R2: ∀ s ∈ sections : s.type ∈ SectionType,
    R3: ∀ c ∈ s.components : c.enabled = ⊤ ⟹ display(c),
    R4: ∀ s ∈ sections : s.style.background ≠ ⊥ ⟹ apply_bg(s),
    R5: □ mobile_responsive(375px, 768px, 1440px),
    R6: □ palette_applied(theme.palette) ∧ □ font_loaded(theme.typography.fontFamily),
    R7: □ sections_ordered(sections.order)
  }

  Λ := {
    site := {
      title: "GreenLeaf Consulting",
      description: "Strategic consulting that grows with your business",
      author: "GreenLeaf Consulting",
      domain: "greenleafconsulting.com"
    },
    theme := "professional",
    mode := light,
    typography := {
      fontFamily: "Inter",
      headingFamily: "Inter",
      headingWeight: 600,
      baseSize: "16px",
      lineHeight: 1.7
    },
    spacing := {
      sectionPadding: "80px",
      containerMaxWidth: "1200px",
      componentGap: "24px"
    },
    borderRadius := "8px",
    palette := ⟨
      bg₁: "#ffffff",
      bg₂: "#f8fafc",
      txt₁: "#0f172a",
      txt₂: "#475569",
      acc₁: "#1e40af",
      acc₂: "#2563eb"
    ⟩,
    sections := [
      ⟨
        type: menu,
        variant: simple,
        background: "#ffffff",
        padding: "0",
        gap: "24px",
        components: [
          ⟨logo: text, text: "GreenLeaf"⟩,
          ⟨cta: button, text: "Schedule a Call", url: "#cta"⟩
        ]
      ⟩,
      ⟨
        type: hero,
        variant: minimal,
        background: "#ffffff",
        padding: "80px 24px",
        gap: "24px",
        components: [
          ⟨eyebrow: badge, text: "Trusted by Fortune 500"⟩,
          ⟨headline: heading, text: "Strategy That Grows With You"⟩,
          ⟨subtitle: text, text: "We partner with ambitious companies to solve their toughest challenges. From market entry to operational excellence, our senior partners deliver measurable results."⟩,
          ⟨primaryCta: button, text: "Schedule a Consultation", url: "#cta"⟩,
          ⟨secondaryCta: button, text: "Our Approach", url: "#features"⟩,
          ⟨backgroundImage: image, url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&q=80", alt: "Modern corporate office with floor-to-ceiling windows overlooking a city skyline"⟩,
          ⟨trustBadges: trust, text: "Partnered with 120+ companies across 14 industries"⟩
        ]
      ⟩,
      ⟨
        type: columns,
        variant: cards,
        heading: "Our Services",
        subheading: "Strategic expertise across growth, operations, and leadership",
        background: "#ffffff",
        columns: 3,
        padding: "64px 24px",
        gap: "32px",
        components: [
          ⟨f1: feature-card, text: "Growth Strategy: Market analysis, competitive positioning, and go-to-market plans that drive measurable revenue growth quarter over quarter."⟩,
          ⟨f2: feature-card, text: "Operational Excellence: Process optimization, technology integration, and organizational design for maximum efficiency at scale."⟩,
          ⟨f3: feature-card, text: "Leadership Advisory: Executive coaching, board advisory, and change management for leaders navigating complex transformation."⟩
        ]
      ⟩,
      ⟨
        type: numbers,
        variant: icons,
        heading: "Results That Speak",
        subheading: "Measurable impact across 120+ engagements",
        background: "#f8fafc",
        columns: 4,
        padding: "64px 24px",
        gap: "32px",
        components: [
          ⟨n-1: value-prop, text: "120+ — Clients"⟩,
          ⟨n-2: value-prop, text: "94% — Retention"⟩,
          ⟨n-3: value-prop, text: "$2.4B — Revenue Impact"⟩,
          ⟨n-4: value-prop, text: "14 — Industries"⟩
        ]
      ⟩,
      ⟨
        type: quotes,
        variant: stars,
        heading: "Client Testimonials",
        subheading: "What our partners say about working with us",
        background: "#ffffff",
        columns: 3,
        padding: "64px 24px",
        gap: "24px",
        components: [
          ⟨t-1: testimonial, text: "GreenLeaf helped us identify a $40M market opportunity we completely missed. Their strategic insight is unmatched.", rating: 5⟩,
          ⟨t-2: testimonial, text: "Our operational costs dropped 30% in six months. The GreenLeaf team didn't just advise — they rolled up their sleeves and delivered.", rating: 5⟩,
          ⟨t-3: testimonial, text: "The best consulting engagement we've ever had. They challenged our assumptions and pushed us to think bigger about what was possible.", rating: 5⟩
        ]
      ⟩,
      ⟨
        type: questions,
        variant: accordion,
        heading: "Common Questions",
        subheading: "How we work, who we serve, and what to expect",
        background: "#f8fafc",
        padding: "64px 24px",
        gap: "0",
        components: [
          ⟨q-1: faq-item, ⟩,
          ⟨q-2: faq-item, ⟩,
          ⟨q-3: faq-item, ⟩,
          ⟨q-4: faq-item, ⟩
        ]
      ⟩,
      ⟨
        type: action,
        variant: split,
        background: "#ffffff",
        padding: "64px 24px",
        gap: "48px",
        components: [
          ⟨heading: heading, text: "Ready to Accelerate Your Growth?"⟩,
          ⟨subtitle: text, text: "Schedule a free 30-minute strategy call with one of our senior partners. No commitment, just actionable insight."⟩,
          ⟨button: button, text: "Schedule a Consultation", url: "#contact"⟩
        ]
      ⟩,
      ⟨
        type: footer,
        variant: multi-column,
        background: "#f8fafc",
        columns: 4,
        padding: "48px 24px",
        gap: "32px",
        components: [
          ⟨brand: footer-brand, text: "GreenLeaf Consulting"⟩,
          ⟨col-1: footer-column, text: "Services", links: "Strategy,Operations,Advisory,Research"⟩,
          ⟨col-2: footer-column, text: "Company", links: "About,Team,Careers,Press"⟩,
          ⟨col-3: footer-column, text: "Resources", links: "Insights,Case Studies,Newsletter"⟩,
          ⟨copyright: footer-copyright, text: "© 2026 GreenLeaf Consulting. New York | London | Singapore."⟩
        ]
      ⟩
    ]
  }

  Ε := {
    V1: VERIFY ∀ s ∈ sections : render(s) ≠ ⊥,
    V2: VERIFY palette_contrast(txt₁, bg₁) ≥ 4.5:1,
    V3: VERIFY responsive(375px) ∧ responsive(768px) ∧ responsive(1440px),
    V4: VERIFY |sections| = 8,
    V5: VERIFY ∀ c ∈ components : c.text ≠ ⊥ ⟹ rendered(c.text),
    V6: VERIFY font_loaded("Inter"),
    V7: VERIFY section_order_preserved(sections)
  }
⟧

% Generated by Hey Bradley | spec: aisp-5.1 | tier: platinum
% Ambiguity target: < 2% | All 5 Crystal Atom components present
