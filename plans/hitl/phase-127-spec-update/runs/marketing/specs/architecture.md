## Bounded contexts
1.  **Content Presentation** — Manages the display of static informational sections (hero, features, testimonials, logos).
2.  **Navigation** — Handles global site navigation and menu structure (navbar-01).
3.  **Pricing Display** — Renders pricing tiers and associated details (pricing-01).
4.  **Lead Capture** — Manages the display and interaction for contact/inquiry forms (contact-01, contact-02).

## Data flow
User enters site →
  Navbar loads (navigation) →
  Hero content displays (content presentation) →
  User scrolls →
  Features/Logos/Testimonials load (content presentation) →
  Pricing section loads (pricing display) →
  User interacts with "Book a Discovery Call" button (lead capture) →
  User is redirected to external scheduling.

## Dependencies
*   **CDN**: For asset delivery (images, fonts).
*   **External Scheduling Service**: For "Book a Discovery Call" functionality.
*   **Analytics**: For tracking visitor behavior and site performance.
