| Phase | Scope | Depends on | Effort | DoD |
| :---- | :---- | :--------- | :----- | :-- |
| 1 | **Project Setup & Base Architecture** <br> Next.js project initialization, Tailwind CSS + shadcn/ui configuration, Vercel deployment setup, directory structure, global dark mode theme implementation. Newsletter form handler (e.g., Formspree). | none | 1.5 days | Vercel deployment succeeds (HTTP 200); Global dark mode active on all pages; `next.config.js` and `tailwind.config.js` configured; `package.json` includes required dependencies; Lighthouse Perf/A11y/SEO ≥80 on blank page. |
| 2 | **Core Layout & Navigation** <br> Implement `#navbar-01` and establish base layout structure (header/main/footer). Develop responsive header with site title and navigation links. | 1 | 0.75 days | `#navbar-01` renders without overflow at 320/768/1280px; Keyboard tab order traverses all navigation links; Site title links to homepage (HTTP 200); WCAG contrast ≥4.5 for text/background. |
| 3 | **Main Call to Action (Hero)** <br> Implement `#hero-01` section with badge, heading, text, and button components. Ensure responsiveness and adherence to theme. | 2 | 0.5 days | `#hero-01` renders without overflow at 320/768/1280px; Button click triggers a `mailto:` link (opens default client); WCAG contrast ≥4.5 for text/background; LCP ≤2.5s on 4G throttled. |
| 4 | **Explore Articles Section** <br> Implement `#articles-01` section using a columns layout with three `article-card` components. Placeholder content for cards. | 2 | 0.75 days | `#articles-01` renders without overflow at 320/768/1280px; Each `article-card` has a clickable link (HTTP 200); Initial JS bundle ≤150KB gzip; WCAG contrast ≥4.5 for text/background. |
| 5 | **Author Introduction** <br> Implement `#author-bio-01` section with image and grouped text content. | 2 | 0.5 days | `#author-bio-01` renders without overflow at 320/768/1280px; Image has `alt` attribute; WCAG contrast ≥4.5 for text/background. |
| 6 | **Newsletter Subscription** <br> Implement `#newsletter-01` section with input field and button, integrating with the Formspree handler. | 3, 5 | 1 day | `#newsletter-01` renders without overflow at 320/768/1280px; Form submission returns HTTP 2xx response from Formspree; Input field has `label` and `type="email"`; Button is keyboard navigable and activates on Enter. |
| 7 | **Accessibility & Performance Audit + Final Deployment** <br> Full Lighthouse audit and remediate identified issues. Final deployment to Vercel and smoke testing. | 6 | 1.5 days | Lighthouse Perf/A11y/SEO ≥90; Initial JS bundle ≤180KB gzip; LCP ≤2.0s on 4G throttled; All interactive elements are keyboard accessible; Site renders correctly on target browsers; Vercel deployment succeeds and passes smoke tests. |
Total effort: 6.5–7.5 day(s)

```mermaid
gantt
    title Build plan
    dateFormat  X
    axisFormat %d
    section Phases
    Phase 1 :a1, 0, 1.5d
    Phase 2 :a2, after a1, 0.75d
    Phase 3 :a3, after a2, 0.5d
    Phase 4 :a4, after a2, 0.75d
    Phase 5 :a5, after a2, 0.5d
    Phase 6 :a6, after a3, a5, 1d
    Phase 7 :a7, after a6, 1.5d
