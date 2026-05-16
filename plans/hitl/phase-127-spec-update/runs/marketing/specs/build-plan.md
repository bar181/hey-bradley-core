| Phase | Scope | Depends on | Effort | DoD |
|---|---|---|---|---|
| 1 | **Project Setup & Core Infrastructure:** Initialize Next.js project with Tailwind CSS and shadcn/ui. Configure Vercel deployment. Implement global styles, typography, and color palette. Set up `_app.tsx` and `_document.tsx`. Integrate Google Analytics. | none | 1.0 day | Vercel deployment completes successfully with a `200` status for the root URL. Initial JS bundle size ≤ 50 KB gzip. Global styles for `Inter` font family and specified color palette are applied correctly. Google Analytics script loads without errors. |
| 2 | **Header & Hero Section:** Implement the `#navbar-01` component with navigation links. Implement the `#hero-01` component including heading, tagline, and CTA button. | 1 | 0.75 day | `#navbar-01` and `#hero-01` render without overflow at 320/768/1280px. All navigation links are functional and open target sections (or `mailto:` client for contact). Hero CTA button opens `mailto:` client with pre-filled subject. Lighthouse Performance ≥ 85, A11y ≥ 90 for initial view. |
| 3 | **Features & Social Proof:** Implement the `#features-01` section with multiple article cards. Implement the `#logos-01` section displaying client logos. | 2 | 0.75 day | `#features-01` and `#logos-01` render without overflow at 320/768/1280px. All interactive elements (if any) in `#features-01` are keyboard navigable. Images in `#logos-01` have appropriate `alt` attributes. Lighthouse A11y ≥ 90. |
| 4 | **Pricing & Testimonials:** Implement the `#pricing-01` section with three pricing tiers and call-to-action buttons. Implement the `#testimonials-01` section with client testimonials. | 2 | 0.75 day | `#pricing-01` and `#testimonials-01` render without overflow at 320/768/1280px. Pricing CTA buttons initiate `mailto:` or link to a contact form. Contrast ratio for text in pricing cards is ≥ 4.5:1. |
| 5 | **Contact Section & Polish:** Implement the `#contact-01` section with a call to action and a button (e.g., `mailto:`). Conduct a full accessibility audit. Perform Lighthouse performance and SEO optimization pass. | 3, 4 | 1.5 day | `#contact-01` button opens `mailto:` client. Lighthouse Performance ≥ 90, A11y ≥ 95, SEO ≥ 90. All interactive elements are keyboard navigable with logical tab order. LCP ≤ 2.5s on 4G throttled. Initial JS bundle size ≤ 75 KB gzip. |
| 6 | **Deployment & Smoke Checks:** Final deployment to Vercel. Conduct comprehensive cross-browser and device smoke tests. Verify all links, forms, and dynamic content. | 5 | 0.5 day | Vercel deployment completes successfully. All links return `200` HTTP status. All form submissions return `2xx` HTTP status. Site renders correctly on Chrome, Firefox, Safari (latest stable versions) and mobile/tablet devices. |
Total effort: 5.25–6.5 day(s)
```mermaid
gantt
    title Build plan
    dateFormat  X
    axisFormat %d
    section Phases
    Phase 1 :a1, 0, 1d
    Phase 2 :a2, after a1, 0.75d
    Phase 3 :a3, after a2, 0.75d
    Phase 4 :a4, after a2, 0.75d
    Phase 5 :a5, after a3, a4, 1.5d
    Phase 6 :a6, after a5, 0.5d
