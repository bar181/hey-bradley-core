## Bounded contexts
1.  **Site Content** — Manages the immutable presentation data for all sections (text, links, media URLs).
2.  **Navigation** — Handles mapping section IDs to viewable content and scroll-to-section logic.
3.  **Visual Presentation** — Governs rendering of theme, typography, and component layouts.

## Data flow
Visitor entry (URL)
  ↓
  Site Content (initial payload)
  ↓
  Visual Presentation (renders Navbar, Hero)
  ↓
  User scrolls / clicks link
  ↓
  Navigation (scrolls to section / updates URL)
  ↓
  Visual Presentation (renders Video, Projects, Contact)
  ↓
  User clicks external link (e.g., email, social)
  ↓
  Conversion (external site)

## Dependencies
*   Google Fonts CDN (Inter, Outfit)
*   YouTube Embed API (for video section)
*   External social/portfolio platforms (LinkedIn, Behance)
