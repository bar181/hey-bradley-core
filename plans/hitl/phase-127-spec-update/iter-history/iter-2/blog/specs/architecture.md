## Bounded contexts
1. **Content Presentation** — Manages rendering of all textual and visual elements across sections.
2. **Navigation** — Handles global site navigation and in-page anchor linking.
3. **Article Display** — Specifically responsible for rendering article cards and associated content.
4. **Subscription Management** — Processes user input for newsletter sign-ups.

## Data flow
User enters URL
  → `navbar-01` (Menu) renders
  → `hero-01` (Hero) renders with primary call to action
  → Scroll to `articles-01` (Articles)
  → Scroll to `author-bio-01` (Author Bio)
  → Scroll to `newsletter-01` (Newsletter)
  → User inputs email & clicks "Subscribe"
  → External Newsletter API receives subscription request

## Dependencies
*   **CDN:** For static asset delivery (images, fonts, CSS, JS).
*   **Analytics Provider:** For site traffic monitoring (e.g., Google Analytics).
*   **Newsletter Service API:** External service for handling email subscriptions.
