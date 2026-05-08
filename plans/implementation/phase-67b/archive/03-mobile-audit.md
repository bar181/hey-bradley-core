# P67b / A3 — Mobile Audit Findings

> **Date:** 2026-04-30 · Source: code-only audit (no real device testing)
> **Viewports audited:** 375px / 390px / 428px (iPhone SE / 13 / 14 Pro Max)
> **Reference:** Tailwind breakpoints `sm: 640px`, `md: 768px` (mobile = `<md`)
> **Owner:** P67b A3

---

## Per-surface findings

### ListenModeDemo (`src/demos/ListenModeDemo.tsx`)
- **375px:** FIX — top header `flex items-center justify-between` had no wrap; eyebrow chip "Listen mode demo · scripted" + back link was tight (~310px content / 327px usable). Grid `gap-8 py-10` chunky on mobile.
- **390px:** PASS post-fix.
- **428px:** PASS.
- **Mic button:** `w-24 h-24` (96px) — prominent, no clipping. PASS.
- **Transcript:** `text-lg md:text-xl` (≥18px) — legible. PASS.
- **Preview panel:** `grid md:grid-cols-2` — stacks below mic on mobile. PASS.
- **Bottom controls:** already `flex flex-wrap` — no clipping. PASS.
- **Fix applied:** `flex flex-wrap gap-x-3 gap-y-2` on header; `gap-6 md:gap-8 py-6 md:py-10` on main grid.

### ChatModeDemo (`src/demos/ChatModeDemo.tsx`)
- **375px:** FIX — top header `px-6 py-4 flex items-center justify-between gap-4` no flex-wrap; back link + chip risked overflow. Outer container `px-6 py-8` chunky.
- **390px:** PASS post-fix.
- **428px:** PASS.
- **Chat thread:** bubbles `max-w-[85%]`/`max-w-[92%]` wrap text correctly. PASS.
- **Input field:** dashed-border preview bubble — readable at 375px. PASS.
- **AISP trace strip:** already `flex flex-wrap gap-1` — chips wrap to multi-line. PASS.
- **Preview panel:** `grid md:grid-cols-2` — stacks below chat. PASS.
- **Fix applied:** header → `px-4 md:px-6 py-3 md:py-4 flex flex-wrap gap-x-3 gap-y-2`; main grid → `px-4 md:px-6 py-6 md:py-8 gap-4 md:gap-6`; quick-ref + footer rows → `px-4 md:px-6`.

### MobileFirstRunCard (`src/components/shell/MobileFirstRunCard.tsx`)
- **375px:** PASS.
- **390px:** PASS.
- **428px:** PASS.
- **Heading + subtext:** `text-base` + `text-sm` — readable, no clipping. PASS.
- **2 CTA buttons:** `w-full min-h-[44px]` — full-width, ≥44px tall, `gap-3` separation. PASS.
- **Skip link:** `min-h-[44px]`, bottom-right via `flex justify-end`. PASS.
- **Fix applied:** none (already mobile-clean from P66/A3 work).

### MobileLayout (`src/components/shell/MobileLayout.tsx`)
- **375px:** PASS.
- **390px:** PASS.
- **428px:** PASS.
- **3-tab nav:** `flex items-stretch` with `flex-1 py-3` — each tab ~125px at 375px, fits horizontally. PASS.
- **Hamburger:** `p-1.5 rounded` trigger; toggles MobileMenu via `z-[9100]` — no z-index conflict with first-run card (card lives in `<main>`, menu portals over entire viewport). PASS.
- **Builder hidden:** root `md:hidden` wrapper confirmed (line 80). PASS.
- **Fix applied:** none.

### MobileMenu (`src/components/shell/MobileMenu.tsx`)
- **375px:** PASS.
- **390px:** PASS.
- **428px:** PASS.
- **Drawer:** `w-[85%] max-w-sm` — at 375px renders as ~319px wide; clean slide-in via Tailwind transition. PASS.
- **Touch targets:** close button `min-h-[44px] min-w-[44px]`; conversation-log button `min-h-[44px]`. PASS (per P66/A3 audit).
- **Close button:** visible top-right of drawer header, reachable. PASS.
- **Fix applied:** none.

---

## Summary

- Surfaces audited: 5
- Surfaces requiring fix: 2 (ListenModeDemo + ChatModeDemo top headers + spacing)
- Surfaces PASS as-is: 3 (MobileFirstRunCard, MobileLayout, MobileMenu — all already clean from P66/A3 + Sprint J P53 mobile work)
- Mobile polish score: **7/10 → 8.5/10** estimated post-fix
- All fixes Tailwind-only; no new deps; no Framer/GSAP/Lottie
