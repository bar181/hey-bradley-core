| Phase | Scope | Depends on | Effort | DoD |
|---|---|---|---|---|
| 1 | **Setup & Core Infrastructure:** Initialize Next.js project with Tailwind CSS and shadcn/ui. Configure Vercel deployment. Implement global styles, typography, and color palette. | none | 0.5 | Project initializes via `npm run dev` and serves on `localhost:3000`. Vercel deployment completes successfully with 2xx status. `globals.css` applies specified fonts and colors. `package.json` includes `next`, `react`, `tailwindcss`, `shadcn-ui`. |
| 2 | **Brand & Navigation (`#navbar-01`):** Develop the primary navigation component, including brand name and main navigation links. | 1 | 0.25 | Brand name "Bradley Ross" renders in `Outfit` font. Navigation links "Work" and "Contact" are present. Header renders without overflow at 320 / 768 / 1280. Contrast ratio of text against background ≥4.5. |
| 3 | **Hero Section (`#hero-01`):** Implement the main hero section displaying the designer's name, title, value proposition, and a call-to-action button. | 1 | 0.5 | Main heading "Bradley Ross" and sub-heading "Visual Designer" render prominently. Tagline "Crafting thoughtful visual experiences." is visible. "Get in Touch" button is clickable and styled. Lighthouse Performance ≥85, Accessibility ≥95. |
| 4 | **Portfolio Video Reel (`#video-01`):** Embed a video reel (e.g., YouTube/Vimeo embed) showcasing work. | 1 | 1 | Embedded video player loads and is playable. Video player scales responsively across 320 / 768 / 1280 breakpoints. `<iframe>` has a descriptive `title` attribute. LCP ≤2.5s on 4G throttled. |
| 5 | **Design Projects Grid (`#projects-01`):** Build the project grid component with placeholder project cards. Each card should have an image, title, and brief description. | 1 | 0.5 | Six project cards render in a grid layout. Each card displays a placeholder image and text. Grid layout adapts at 320 / 768 / 1280. Initial JS bundle size ≤100 KB gzip. |
| 6 | **Contact Section (`#contact-01`):** Implement a simple contact section with email and social media links. | 2, 3, 4, 5 | 0.25 | Email link opens default mail client with `mailto:` link. Social media links open in new tabs. Section renders without overflow at 320 / 768 / 1280. Keyboard tab order traverses all interactive elements. |
| 7 | **A11y & Performance Pass:** Conduct a thorough accessibility and performance review, addressing identified issues. | 6 | 1 | Lighthouse Accessibility ≥98, Performance ≥90, SEO ≥95. All interactive elements are keyboard navigable. Contrast ratio for all text elements ≥4.5. |
| 8 | **Final Deployment & Smoke Checks:** Deploy the complete site to Vercel and perform final smoke testing. | 7 | 0.5 | Vercel deployment successful with no build errors. All links and buttons are functional. Site loads correctly on major browsers (Chrome, Firefox, Safari). |
Total effort: 4.5–5 day(s).
```mermaid
gantt
    title Build plan
    dateFormat  X
    axisFormat %d
    section Phases
    Phase 1 :a1, 0, 0.5d
    Phase 2 :a2, after a1, 0.25d
    Phase 3 :a3, after a1, 0.5d
    Phase 4 :a4, after a1, 1d
    Phase 5 :a5, after a1, 0.5d
    Phase 6 :a6, after a2, a3, a4, a5, 0.25d
    Phase 7 :a7, after a6, 1d
    Phase 8 :a8, after a7, 0.5d
