## Bounded contexts
1.  **Navigation** — Manages site structure, menu links, and brand identity (e.g., "Bradley Ross"). (Anchored by `navbar-01`)
2.  **Hero Display** — Presents the primary introductory content, designer's name, title, and core message. (Anchored by `hero-01`)
3.  **Portfolio Showcase** — Organizes and displays project cards and embedded video content. (Anchored by `video-01` and `projects-01`)
4.  **Contact & Engagement** — Facilitates visitor outreach through contact links. (Anchored by `contact-01`)

## Data flow
Visitor Entry → Hero Display (intro)
  ↓
  → Portfolio Showcase (video reel)
  ↓
  → Portfolio Showcase (project grid)
  ↓
  → Contact & Engagement (reach out)

## Dependencies
*   Google Fonts (for Inter, Outfit)
*   Embedded video platform (e.g., YouTube/Vimeo for `video-embed`)
