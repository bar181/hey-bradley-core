# ADR-017: Theme Names Use Invisible Design (Familiar Category Names)

**Date:** 2026-03-29 | **Status:** ACCEPTED

## Context

The original 10 theme names -- "Stripe Flow", "Neon Terminal", "Linear Sharp", "Vercel Prism" -- are designer shorthand that means nothing to non-technical users. A grandmother building a personal website, a yoga instructor launching a booking page, or a freelance photographer choosing a portfolio layout should never have to decode design jargon to pick a theme.

Template marketplaces that serve millions of users (Webflow, Squarespace, ThemeForest, Wix) all categorize by use case, not by design aesthetic. Users search for "portfolio template" or "SaaS landing page", not "minimalist gradient theme". The naming convention should match this established mental model.

Abstract names also create a selection bottleneck. When every name is an unfamiliar compound ("studio-bold", "pastel-playful", "loom-friendly"), users must click into each theme to understand what it is for. This turns a 2-second decision into a 2-minute exploration. For a builder tool targeting non-technical users, that friction is unacceptable.

## Decision

Theme names use the website category they serve, not abstract design names. The 10 themes are:

| # | Name | Use Case | Why This Name |
|---|------|----------|---------------|
| 1 | SaaS | Software products, dev tools | Users searching for SaaS templates |
| 2 | Agency | Design studios, creative agencies | Most popular Webflow category |
| 3 | Portfolio | Photographers, designers, artists | Universal portfolio term |
| 4 | Blog | Writers, publishers, newsletters | Self-explanatory content-first |
| 5 | Startup | Launch pages, coming soon, MVPs | High-energy launch context |
| 6 | Personal | Personal brands, resumes, freelancers | Most approachable name |
| 7 | Professional | Consulting, law, finance, B2B | Trust-focused business contexts |
| 8 | Wellness | Health, yoga, meditation, coaching | Growing niche category |
| 9 | Creative | Music, entertainment, events, art | Expressive, bold contexts |
| 10 | Minimalist | Any -- stripped to essentials | Universal design philosophy |

Previous names and their replacements:

- `stripe-flow` -> SaaS
- `studio-bold` -> Agency
- `vercel-prism` -> Portfolio
- `notion-warm` -> Blog
- `video-ambient` -> Startup
- `loom-friendly` -> Personal
- `linear-sharp` -> Professional (was Minimalist-adjacent, repurposed)
- `nature-calm` -> Wellness
- `pastel-playful` -> Creative
- `neon-terminal` -> Minimalist

Slug format: lowercase, single word (e.g., `saas`, `agency`, `portfolio`).

## Consequences

**Positive:**

- Users instantly understand which theme is for them
- Matches how template marketplaces organize themes
- No design vocabulary required
- Theme selection becomes a 2-second decision
- SEO-friendly category names align with how people search for templates

**Negative:**

- Less "creative" naming (acceptable tradeoff for usability)
- Some themes may serve multiple use cases (e.g., Professional works for consulting AND law)

**Risks:**

- None significant. This is a naming convention change, not an architectural change. Theme JSON files, design tokens, and rendering logic are unaffected -- only the user-facing label and slug change.
