| Phase | Scope | Depends on | Effort | DoD |
| :---- | :---- | :--------- | :----- | :-- |
| 1     | Project Setup (Next.js, Tailwind, shadcn, Vercel). Implement base layout, global styling, and responsive utilities. Integrate Calendly for discovery calls. | none | 2.5 days | Next.js app renders a blank page on Vercel; Tailwind JIT compiles; shadcn components importable; global Inter font applied; base.css loaded; Calendly embed renders with 2xx status; initial JS ≤80 KB gzip. |
| 2     | Implement #navbar-01 and #hero-01. | 1 | 1.0 day | #navbar-01 and #hero-01 render without overflow at 320 / 768 / 1280px; text contrast ≥4.5 for all elements; keyboard tab order traverses navigation links; Lighthouse Perf/A11y/SEO ≥90; LCP ≤2.5s on 4G throttled. |
| 3     | Implement #features-01 and #logos-01. | 2 | 1.0 day | #features-01 and #logos-01 render without overflow at 320 / 768 / 1280px; text contrast ≥4.5 for all elements; Lighthouse A11y ≥90. |
| 4     | Implement #testimonials-01 and #pricing-01. | 3 | 1.0 day | #testimonials-01 and #pricing-01 render without overflow at 320 / 768 / 1280px; text contrast ≥4.5 for all elements; Lighthouse A11y ≥90. |
| 5     | Implement #contact-01 using Calendly embed. Final Accessibility and Performance pass. | 4 | 1.5 days | #contact-01 renders Calendly iframe with 2xx status; entire page renders without overflow at 320 / 768 / 1280px; all interactive elements are keyboard navigable with visible focus states; Lighthouse Perf/A11y/SEO ≥95; LCP ≤2.0s on 4G throttled; initial JS ≤120 KB gzip. |
| 6     | Deploy to Vercel and smoke testing. | 5 | 0.5 day | Site is publicly accessible on Vercel with custom domain; all links navigate correctly; Calendly widget loads successfully; console logs are clear of errors. |

Total effort: 7.5–8.0 day(s).

```mermaid
gantt
    title Build plan
    dateFormat  X
    axisFormat %d
    section Phases
    Phase 1 :a1, 0, 2.5d
    Phase 2 :a2, after a1, 1d
    Phase 3 :a3, after a2, 1d
    Phase 4 :a4, after a3, 1d
    Phase 5 :a5, after a4, 1.5d
    Phase 6 :a6, after a5, 0.5d
