## Bounded contexts
1.  **Content Presentation** — Manages the display of static informational elements like headings, text, and images.
2.  **Navigation Management** — Handles primary site navigation and internal linking.
3.  **Feature Highlights** — Displays service offerings and key value propositions via article cards.
4.  **Pricing Display** — Presents service package tiers and associated benefits.
5.  **Social Proof** — Showcases client logos and testimonials to build credibility.
6.  **Call to Action** — Facilitates lead generation through clear contact prompts and buttons.

## Data flow
User Entry → Navbar (Navigation)
              ↓
              Hero (Value Proposition)
              ↓
              Features (Service Details)
              ↓
              Logos (Trust)
              ↓
              Pricing (Offerings)
              ↓
              Testimonials (Social Proof)
              ↓
              Contact (Lead Conversion)

## Dependencies
*   **CDN:** For optimized delivery of static assets (images, fonts, CSS, JS).
*   **Analytics:** Google Analytics (or similar) for visitor tracking and behavior insights.
*   **External Scheduling API:** For "Book a Discovery Call" button to integrate with a calendar service (e.g., Calendly).
