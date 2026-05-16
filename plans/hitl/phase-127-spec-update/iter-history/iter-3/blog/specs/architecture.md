## Bounded contexts
1. **Navigation** — Manages site menu (navbar-01) and internal routing.
2. **HeroContent** — Displays primary call to action and introductory messaging (hero-01).
3. **ArticleDisplay** — Presents structured content, e.g., blog articles (articles-01).
4. **AuthorProfile** — Showcases author's bio and related information (author-bio-01).
5. **Subscription** — Handles newsletter signup functionality (newsletter-01).

## Data flow
User (entry)
  ↓
Navbar (navigation & branding)
  ↓
Hero (initial engagement)
  ↓
Articles (content consumption)
  ↓
Author Bio (trust & context)
  ↓
Newsletter (conversion: signup)
