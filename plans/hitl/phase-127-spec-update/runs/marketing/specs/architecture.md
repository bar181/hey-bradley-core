## Site class: static-brochure

## Stack
Astro 4 — zero-JS by default, target LCP ≤1.5 s, ~30 KB initial JS. Tailwind CSS 4.

## Routing & rendering
MPA static routes. All routes SSG. Navigation collapses at `min-width: 768px` (desktop breakpoint).

## Hosting & build
Cloudflare Pages — global CDN, good for static sites.
Build command: `astro build`
Output directory: `dist`
Deployment: Edge

## Integrations
*   Formspree: `@formspree/core@latest`, fallback to mailto link. Handles contact forms.
*   Plausible Analytics: `script src="https://plausible.io/js/script.js" data-domain="YOUR_DOMAIN" async defer`, fallback to no analytics.
*   Cloudinary: `@cloudinary/html@latest` for image optimization and delivery, fallback to raw `<img>` tags.

## Runtime states
*   Newsletter signup (if present, derived from generic contact form with single email input): { idle, submitting, success-200, fail-4xx, fail-5xx, network-timeout }.
*   Button: { idle, loading (disabled state) }.

## Quality budgets
*   LCP target: 1200 ms
*   INP target: 150 ms
*   CLS: ≤ 0.05
*   Initial JS: ≤ 15 KB
*   WCAG level: 2.2 AA
*   Reduced-motion: yes
*   Focus ring: yes

## SEO & social
*   Title pattern: `[Page Title] | Atlas AI Consulting`
*   Meta description rule: Max 160 characters, relevant keywords. Default to `Expert AI consulting for strategic implementation, development, and training to transform your business.`
*   OG image strategy: Default image `og-image.jpg` (1200x630px) for all pages, generated from a template with logo and tagline.
*   JSON-LD types: `Organization`, `WebSite`.
*   sitemap.xml: Automatically generated.
*   robots.txt: Disallow `/admin`, allow `/`.

## Data flow
```mermaid
flowchart LR
    A[Visitor Entry] --> B{Homepage / Landing}
    B -- Explore Sections --> C[Hero]
    B -- Explore Sections --> D[Features]
    B -- Explore Sections --> E[Logos]
    B -- Explore Sections --> F[Pricing]
    B -- Explore Sections --> G[Testimonials]
    C --> H[Call to Action Button]
    D --> H
    F --> H
    G --> H
    H --> I[Contact Form]
    I -- Submission --> J[Formspree]
    J -- Success / Failure --> K[Confirmation / Error Message]
    K --> L[Conversion Complete]
