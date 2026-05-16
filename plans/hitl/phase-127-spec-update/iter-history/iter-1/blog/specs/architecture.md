## Bounded contexts
1. **Site Configuration** — Manages global site metadata, theme, and structural layout.
2. **Page Section Rendering** — Renders individual content blocks based on their type, variant, and ordered components.
3. **Content Presentation** — Displays textual content (headings, paragraphs) and interactive elements (buttons, links).
4. **Article Display** — Specifically renders article cards within a columnar layout.
5. **Newsletter Integration** — Handles the display of subscription input fields and submission buttons.

## Data flow
User (Browser)
  ↓ requests site.com/
Static CDN
  ↓ serves index.html, assets
Browser
  ↓ renders Hero (initial view)
  → scrolls down
  ↓ renders Article Cards
  → scrolls further
  ↓ renders Author Bio
  → reaches bottom
  ↓ renders Newsletter CTA
  → User inputs email
  → User clicks 'Subscribe'
External Newsletter API
