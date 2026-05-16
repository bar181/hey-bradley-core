| Phase | Scope | Depends on | Effort | DoD |
|---|---|---|---|---|
| 1 | **Project Setup & Core Infrastructure:** Initialize Next.js project with Tailwind CSS and shadcn/ui. Configure Vercel deployment. Implement basic theming (colors, typography). Establish site metadata. | none | 0.75 day | Next.js app renders a blank page on Vercel; Initial JS bundle ≤ 100 KB gzip; `_app.tsx` and `tailwind.config.js` configured with theme variables; `package.json` includes `next`, `react`, `tailwindcss`, `postcss`, `autoprefixer`, `shadcn-ui`. |
| 2 | **Navigation & Hero (P0 features):** Develop `navbar-01` (basic navigation) and `hero-01` (title, tagline, profession). Ensure responsiveness and accessibility for core elements. | 1 | 1.0 day | `navbar-01` links navigate to sections (e.g., `#projects`) with smooth scroll; `hero-01` heading and text present; Lighthouse Perf/A11y/SEO ≥ 90 on desktop; Renders without overflow at 320 / 768 / 1280; Keyboard tab order traverses all `navbar-01` links. |
| 3 | **Video Reel & Project Grid (P0 features):** Implement `video-01` (video embed) and `projects-01` (project cards). Ensure video player functions correctly and project cards are visually distinct. | 2 | 1.0 day | Embedded video plays on click; `projects-01` displays 6 distinct project cards with placeholder content; Lighthouse Perf ≥ 85 (video lazy-loaded); LCP ≤ 2.5s on 4G throttled; All project cards render without overflow at 320 / 768 / 1280. |
| 4 | **Contact Section & Hero Enhancements (P1 features):** Implement `contact-01` (social/contact links). Add secondary text content to `hero-01` (unique value proposition) and a placeholder button for portfolio download. | 2 | 0.75 day | `contact-01` displays 2 clickable links (e.g., `mailto:` opens default client, social links return 2xx); `hero-01` secondary text visible; Button in `hero-01` is clickable and accessible (WCAG contrast ≥ 4.5); Renders without overflow at 320 / 768 / 1280. |
| 5 | **Accessibility, Performance, and Deployment:** Conduct a comprehensive a11y audit, Lighthouse pass, and final deployment checks. | 3, 4 | 1.5 days | Lighthouse Perf/A11y/SEO ≥ 95 on desktop and mobile; All interactive elements have correct ARIA attributes and keyboard focus styling; Site successfully deployed to Vercel with all features functional; Initial JS bundle ≤ 150 KB gzip; LCP ≤ 2.0s on 4G throttled. |

Total effort: 5.0–5.0 day(s).

```mermaid
gantt
    title Build plan
    dateFormat  X
    axisFormat %d
    section Phases
    Phase 1 :a1, 0, 0.75d
    Phase 2 :a2, after a1, 1d
    Phase 3 :a3, after a2, 1d
    Phase 4 :a4, after a2, 0.75d
    Phase 5 :a5, after a3, 1.5d
