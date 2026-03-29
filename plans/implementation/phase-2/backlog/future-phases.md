# Future Phases Backlog — Beyond Phase 2

**Last Updated:** 2026-03-29
**Context:** Items deferred from Phase 1 and Phase 2, organized by future phase.

---

## Phase 3: Full Section Expansion (Grandma Mode)

**Goal:** All common website section types editable in SIMPLE tab.

| # | Section | Variants | SIMPLE Tab Content |
|---|---------|----------|-------------------|
| 3.1 | Pricing | 2-tier, 3-tier, comparison | Tier name, price, features list, CTA, highlight toggle |
| 3.2 | Testimonials | cards, single-quote, carousel | Quote text, author name, role, avatar image |
| 3.3 | FAQ | accordion, two-column | Question/answer pairs, add/remove/reorder |
| 3.4 | Value Props | icons-text, numbers, stats | Icon picker, value/stat, label, description |
| 3.5 | Contact | form, info-card | Form fields config, email, phone, address |
| 3.6 | Gallery | grid, masonry, carousel | Image picker for multiple images, captions |
| 3.7 | Team | grid, list | Photo, name, role, social links |

**Architecture note:** Each section needs a renderer + SIMPLE tab editor + JSON schema. The pattern established in Phase 2 (Layout → Style → Content) applies to all.

---

## Phase 4: Expert Mode

**Goal:** Advanced controls for power users. Every section gets an EXPERT tab.

| # | Feature | Details |
|---|---------|---------|
| 4.1 | Expert tab per section type | Per-component property editors (button size/style, image effects, spacing) |
| 4.2 | AISP viewer per section | Live AISP spec generated per section in expert tab |
| 4.3 | CSS variable viewer | Show resolved values for all theme vars |
| 4.4 | Raw JSON editor per section | Inline JSON editing within expert tab |
| 4.5 | Layout advanced controls | direction, align, justify, gap, padding, margin, max-width |
| 4.6 | Component-level styling | Per-component color, font size, border radius overrides |
| 4.7 | Animation controls | Entrance animations, scroll effects (future) |

---

## Phase 5: LLM Integration + Auth

**Goal:** The "agentic" part of the Agentic Design Platform. Voice and chat control.

| # | Feature | Details | Open Core? |
|---|---------|---------|------------|
| 5.1 | Chat mode | Describe changes in natural language → LLM generates JSON patches | Community |
| 5.2 | Listen mode | Voice-to-spec, real-time preview updates via speech | Community |
| 5.3 | Supabase auth | Login/signup, user profiles, session management | Community |
| 5.4 | Cloud persistence | Save projects to Supabase instead of localStorage | Community |
| 5.5 | Image/video upload | Upload to Supabase storage, thumbnail generation | Community |
| 5.6 | Project sharing | Share a project URL with others (read-only) | Community |
| 5.7 | Multi-project support | User can have multiple projects, switch between them | Community |

---

## MVP: Presentation Mode (Harvard Capstone Demo)

**Goal:** A "wow" demo mode for the capstone presentation. Can be built at any point.

| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| MVP.1 | Full-screen preview mode | P0 | Hide all panels. Just the website. Keyboard/click to navigate sections. |
| MVP.2 | Section transitions | P1 | Smooth scroll or slide animations between sections |
| MVP.3 | Demo data presets | P1 | Pre-built complete websites (not just hero) for demo |
| MVP.4 | Export to static HTML | P2 | Download a standalone HTML file with all styles inlined |
| MVP.5 | QR code for mobile preview | P2 | Generate a QR code linking to the live preview URL |

---

## Phase 6+: Enterprise & Marketplace

**Goal:** Features for the open core business model.

### Open Core (Free)
| Feature | Details |
|---------|---------|
| Core builder | SIMPLE tab for all section types |
| 10 themes | Community themes, open source |
| Local persistence | localStorage, JSON export/import |
| Basic LLM chat | Limited chat commands for editing |

### Pro (Paid)
| Feature | Details |
|---------|---------|
| Expert mode | Full EXPERT tab for all sections |
| Cloud persistence | Supabase projects with versioning |
| Custom themes | Create, save, share custom themes |
| Template marketplace | Browse and install community templates |
| Advanced LLM | Unlimited chat, voice mode, batch generation |
| Team collaboration | Share projects with team members |
| Custom domain | Deploy to custom domain |
| White label | Remove Hey Bradley branding |
| Priority support | Direct access to development team |

### Platform (Enterprise)
| Feature | Details |
|---------|---------|
| API access | REST API for headless CMS integration |
| SSO/SAML | Enterprise authentication |
| Custom AISP rules | Organization-specific specification rules |
| Audit log | Track all changes with user attribution |
| SLA | 99.9% uptime guarantee |

---

## Prioritization Framework

When deciding what to build next:

1. **Does it make the grandma demo better?** → High priority
2. **Does it unblock the capstone presentation?** → High priority
3. **Does it fix a bug that a user reported?** → High priority
4. **Does it add a new section type?** → Medium (Phase 3)
5. **Does it add power-user features?** → Low (Phase 4+)
6. **Does it require backend infrastructure?** → Low (Phase 5+)
7. **Is it a business model feature?** → Deferred (Phase 6+)
