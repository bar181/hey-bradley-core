## Bounded contexts
1.  **Navigation** — Manages site-wide persistent navigation links and branding.
2.  **Hero Display** — Presents the primary introduction, branding, and call-to-action.
3.  **Portfolio Media** — Showcases design work via embedded video content.
4.  **Project Catalog** — Displays individual project summaries in a grid format.
5.  **Contact Information** — Provides external links for user outreach.

## Data flow
User Entry (via URL)
  ↓
  [Navigation (navbar-01)]
  ↓
  [Hero Display (hero-01)]
  ↓
  [Portfolio Media (video-01)]
  ↓
  [Project Catalog (projects-01)]
  ↓
  [Contact Information (contact-01)]
  ↓
  (User engages with external contact/project links)

## Dependencies
*   YouTube/Vimeo (for video-01 embed)
*   Google Fonts (Inter, Outfit)
