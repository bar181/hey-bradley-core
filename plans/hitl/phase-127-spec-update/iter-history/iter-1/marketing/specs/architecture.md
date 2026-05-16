## Bounded contexts
1.  **Content Presentation** — Manages the display of all static content sections (Hero, Features, Pricing, Testimonials).
2.  **Navigation** — Handles the menu structure and inter-page/section linking.
3.  **Theming** — Dictates the visual style, palette, and typography across the entire site.
4.  **Lead Capture** — Facilitates visitor conversion through contact forms and call-to-action buttons.

## Data flow
Visitor → Load Site HTML & Assets
          → Render Navigation (Navbar)
          → Display Hero Section
          → Scroll → View Features → View Logos → View Testimonials → View Pricing
          → Click "Book a Discovery Call" (Contact)
          → External Scheduling Page

## Dependencies
*   **Google Fonts**: Inter font family for typography.
*   **Calendar API**: For "Book a Discovery Call" button to integrate with a scheduling service.
