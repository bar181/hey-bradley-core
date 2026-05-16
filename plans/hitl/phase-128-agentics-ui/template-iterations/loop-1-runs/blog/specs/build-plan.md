| Phase | Scope | Depends on | Effort | DoD |
|---|---|---|---|---|
| 1 | **Project Setup & Core Infrastructure:** Initialize Next.js project with Tailwind CSS, shadcn/ui. Configure Vercel deployment. Implement dark mode theme variables and global typography. Establish basic folder structure. | none | 1.0 day | Vercel deployment completes successfully, serving a blank Next.js page; `next dev` runs without errors; `npm run build` completes without errors; initial JS ≤80 KB gzip; Lighthouse Perf/A11y/SEO ≥90 on `localhost`. |
| 2 | **P0: Introduce the product's core value (#hero-01) & Site Navigation (#navbar-01):** Implement the `hero-01` section and `navbar-01`. Ensure responsiveness and basic styling. | 1 | 1.0 day | `hero-01` renders with correct content and styling; `navbar-01` links navigate to relevant sections (even if sections are empty placeholders); renders without overflow at 320 / 768 / 1280; keyboard tab order traverses all interactive elements in navbar; LCP ≤2.5s on 4G throttled. |
| 3 | **P1: Showcase Latest Articles (#articles-01):** Develop the `articles-01` section. Implement responsive grid layout for article cards. | 2 | 0.5 day | `articles-01` displays at least 3 article cards with placeholder content; cards maintain layout without overflow at 320 / 768 / 1280; all text elements have contrast ≥4.5. |
| 4 | **P1: Offer a Subscription Option (#newsletter-01):** Build the `newsletter-01` section. Integrate a basic form handler (e.g., Formspree, Resend, or a simple `mailto:` for now). | 2 | 1.0 day | `newsletter-01` form input and button are functional; form submission (or `mailto:` link click) triggers expected action (e.g., email client opens, API call returns 2xx); renders without overflow at 320 / 768 / 1280. |
| 5 | **P2: Learn About the Author (#author-bio-01):** Create the `author-bio-01` section with image and text content. | 2 | 0.5 day | `author-bio-01` displays author image and biographical text; image is optimized (e.g., using `next/image`); renders without overflow at 320 / 768 / 1280. |
| 6 | **Accessibility, Performance, and Deployment Polish:** Conduct a comprehensive Lighthouse audit, fix identified issues (Perf/A11y/SEO), ensure keyboard navigation throughout, and perform final cross-browser checks. Deploy to Vercel and conduct smoke tests. | 3, 4, 5 | 1.5 days | Lighthouse Perf/A11y/SEO ≥95 on Vercel deployment; initial JS ≤100 KB gzip; LCP ≤1.5s on 4G throttled; keyboard tab order traverses all interactives on all pages; all form elements are correctly labeled; all images have alt text; all links have discernible text; Vercel deployment passes smoke tests (all pages load, all forms submit, all links navigate). |

Total effort: 5.5–6.5 day(s).
```mermaid
gantt
    title Build plan
    dateFormat  X
    axisFormat %d
    section Phases
    Phase 1 :a1, 0, 1d
    Phase 2 :a2, after a1, 1d
    Phase 3 :a3, after a2, 0.5d
    Phase 4 :a4, after a2, 1d
    Phase 5 :a5, after a2, 0.5d
    Phase 6 :a6, after a3, a4, a5, 1.5d
