| Phase | Scope | Depends on | Effort | DoD |
|---|---|---|---|---|
| 1 | **Foundation & Core UI:** Set up Next.js, Tailwind CSS, shadcn/ui. Configure Vercel deployment. Implement global `_app.tsx`, `_document.tsx`, and `layout.tsx`. Implement #navbar-01 and #hero-01. Integrate basic Vercel Analytics. | none | 2.5 days | Next.js app deploys to Vercel and serves on a custom domain with HTTP 200. Initial JS bundle ≤100 KB gzip. Lighthouse Perf/A11y/SEO ≥90 on desktop. #navbar-01 links navigate to valid anchors (even if empty). #hero-01 renders without overflow at 320/768/1280. LCP ≤2.5s on 4G throttled. |
| 2 | **Service Offerings:** Implement #features-01 and #logos-01. Ensure responsiveness for these sections. | 1 | 1.0 day | #features-01 displays 3 distinct service cards. #logos-01 displays ≥5 client logos. Both sections render without overflow at 320/768/1280. Contrast ratio of all text ≥4.5:1. |
| 3 | **Pricing & Credibility:** Implement #pricing-01 (3-tier variant) and #testimonials-01. | 2 | 1.0 day | #pricing-01 displays 3 distinct price cards with clear call-to-action buttons. #testimonials-01 displays ≥3 testimonials in a grid. Both sections render without overflow at 320/768/1280. All interactive elements are keyboard-navigable in logical order. |
| 4 | **Contact & Polish:** Implement #contact-01 (booking a call). Conduct a full a11y and Lighthouse pass. Finalize Vercel deployment and smoke checks. | 3 | 2.0 days | #contact-01 button triggers `mailto:` or opens an external booking link. Lighthouse Perf/A11y/SEO ≥95 on desktop and mobile. All external links open in new tabs (`target="_blank"`). Page renders correctly on Vercel after re-deployment. |

Total effort: 6.5–7.8 day(s).

```mermaid
gantt
    title Build plan
    dateFormat  X
    axisFormat %d
    section Phases
    Phase 1 :a1, 0, 2.5d
    Phase 2 :a2, after a1, 1d
    Phase 3 :a3, after a2, 1d
    Phase 4 :a4, after a3, 2d
