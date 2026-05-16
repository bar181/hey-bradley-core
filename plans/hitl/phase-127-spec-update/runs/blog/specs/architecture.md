## Bounded contexts
1.  **Content Presentation** — Manages rendering of all textual and visual content for sections.
2.  **Navigation** — Handles the menu bar and internal site links.
3.  **Newsletter Subscription** — Manages user input for email sign-ups.

## Data flow
User (Entry)
  ↓
  [navbar-01] (Navigation)
  ↓
  [hero-01] (Headline & CTA)
  ↓
  [articles-01] (Content display)
  ↓
  [author-bio-01] (About author)
  ↓
  [newsletter-01] (Subscription form) → External Newsletter API (Conversion)

## Dependencies
*   Google Fonts CDN (Inter, Cormorant Garamond)
*   External Newsletter API (for [newsletter-01] form submission)
