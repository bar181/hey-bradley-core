## Bounded contexts
1.  **Marketing Content** — Manages display of promotional text, images, and brand messaging. (e.g., `hero`, `columns`, `logos`, `testimonials`)
2.  **Navigation** — Controls site structure and user movement. (e.g., `menu`)
3.  **Pricing Presentation** — Displays service tiers and associated features/costs. (e.g., `pricing`)
4.  **Lead Generation** — Facilitates visitor contact and inquiry submission. (e.g., `contact`)

## Data flow
Visitor → Static Site CDN
  → Hero Section (pitch)
  → Features Section (details)
  → Pricing Section (offerings)
  → Contact Section (conversion CTA)

## Dependencies
*   **CDN:** For static asset delivery (HTML, CSS, JS, images).
*   **Google Fonts:** For `Inter` typography.
