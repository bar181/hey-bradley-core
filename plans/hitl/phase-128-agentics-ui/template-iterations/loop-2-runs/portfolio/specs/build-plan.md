| Phase | Scope | Depends on | Effort | DoD |
|---|---|---|---|---|
| 1 | **Project Setup & Core Infrastructure:** Set up Next.js 14 project, integrate Tailwind CSS and shadcn/ui. Configure Vercel deployment. Implement basic SEO metadata. | none | 1.0 day | Vercel deployment returns 2xx for root URL; `npm run dev` starts without errors; `robots.txt` and `sitemap.xml` are accessible; initial JS ≤80 KB gzip. |
| 2 | **Base Layout & Navigation:** Implement `navbar-01` (Site Navigation) and global layout. Define color palette and typography in Tailwind. | 1 | 0.75 day | Navigation links (`Home`, `Projects`, `Contact`) navigate correctly; contrast ratio ≥4.5 for text/background; renders without overflow at 320 / 768 / 1280. |
| 3 | **Hero Section & Contact CTA:** Develop `hero-01` (Designer Introduction, "Get In Touch" Call-to-Action). Style primary button. | 2 | 0.75 day | Hero section content is visible and readable; "Get In Touch" button is clickable and scrolls to `#contact-01`; Lighthouse Perf/A11y/SEO ≥85. |
| 4 | **Portfolio Reel Integration:** Integrate `video-01` (Portfolio Reel Showcase). Use an `<iframe>` for video embed. | 3 | 1.0 day | Embedded video player loads and plays without errors; keyboard tab order traverses the video player controls; LCP ≤2.5s on 4G throttled. |
| 5 | **Project Gallery & Detail Previews:** Implement `projects-01` (Project Gallery, Detailed Project Previews). Create reusable project card component. | 4 | 1.0 day | Project cards display placeholder content; clicking a card does nothing (future scope); renders without overflow at 320 / 768 / 1280; WCAG contrast ≥4.5 for card text. |
| 6 | **Direct Contact Options:** Implement `contact-01` (Direct Contact Options). Include email and social media links. | 3 | 0.75 day | Email link opens default mail client with `mailto:`; social media links open in new tabs; Lighthouse A11y ≥90. |
| 7 | **Accessibility & Performance Pass:** Conduct a comprehensive a11y audit and performance optimization pass. | 5, 6 | 1.0 day | Lighthouse Performance/Accessibility/SEO ≥95; initial JS ≤70 KB gzip; LCP ≤1.8s on 4G throttled; keyboard navigation is flawless across all interactive elements. |
| 8 | **Deployment & Smoke Checks:** Final deployment to Vercel and comprehensive smoke testing across target devices/browsers. | 7 | 0.5 day | Vercel production deployment is successful; all links and buttons are functional; no console errors on production site; renders correctly on Chrome, Firefox, Safari (desktop + mobile). |
Total effort: 6.75–7.5 day(s).
```mermaid
gantt
    title Build plan
    dateFormat  X
    axisFormat %d
    section Phases
    Phase 1 :a1, 0, 1d
    Phase 2 :a2, after a1, 0.75d
    Phase 3 :a3, after a2, 0.75d
    Phase 4 :a4, after a3, 1d
    Phase 5 :a5, after a4, 1d
    Phase 6 :a6, after a3, 0.75d
    Phase 7 :a7, after a5, 1d
    Phase 8 :a8, after a7, 0.5d
