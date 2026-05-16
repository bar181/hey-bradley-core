| Phase | Scope | Depends on | Effort | DoD |
| :---- | :---- | :--------- | :----- | :-- |
| 1 | **Project Setup & Base Architecture**<br>Next.js, Tailwind CSS, shadcn/ui, Vercel hosting. Base layout, global styles, typography. | none | 1.0 day | Initial JS bundle ≤75KB gzip; Lighthouse Perf/A11y/SEO ≥90 on default page; `npm run dev` and `npm run build` complete without errors; all theme colors and fonts applied as per spec; renders without overflow at 320 / 768 / 1280. |
| 2 | **Core UI: Navbar & Hero**<br>Implement `#navbar-01` and `#hero-01` sections. Responsive design for both. | 1 | 0.75 day | `#navbar-01` links navigate correctly (e.g., `#articles-01`); `#hero-01` primary button `mailto:` opens default client; WCAG contrast ≥4.5 for all text elements; keyboard tab order traverses all interactive elements in both sections; renders without overflow at 320 / 768 / 1280. |
| 3 | **Newsletter Integration**<br>Implement `#newsletter-01` section with a third-party form handler (e.g., Formspree/Resend). | 2 | 1.0 day | Newsletter form POST returns 2xx; Lighthouse Perf/A11y/SEO ≥90 for page with section; WCAG contrast ≥4.5 for all text/input elements; renders without overflow at 320 / 768 / 1280. |
| 4 | **Content Sections: Articles & Author Bio**<br>Implement `#articles-01` and `#author-bio-01` sections. | 2 | 1.0 day | `#articles-01` displays 3 distinct article cards; `#author-bio-01` image renders at expected size; Lighthouse Perf/A11y/SEO ≥90 for page with sections; WCAG contrast ≥4.5 for all text; renders without overflow at 320 / 768 / 1280. |
| 5 | **Accessibility, Performance, and Deployment**<br>Comprehensive a11y & Lighthouse pass, final Vercel deployment, and smoke checks. | 3, 4 | 1.5 day | All Lighthouse scores (Perf/A11y/SEO/BP) ≥95; LCP ≤2.5s on 4G throttled (WebPageTest); keyboard navigation on all pages covers all interactive elements; initial JS bundle ≤80KB gzip; site deploys to Vercel and loads without console errors; all links and forms function correctly post-deployment. |
Total effort: 5.25–5.75 day(s).
```mermaid
gantt
    title Build plan
    dateFormat  X
    axisFormat %d
    section Phases
    Phase 1 :a1, 0, 1d
    Phase 2 :a2, after a1, 0.75d
    Phase 3 :a3, after a2, 1d
    Phase 4 :a4, after a2, 1d
    Phase 5 :a5, after a3, a4, 1.5d
