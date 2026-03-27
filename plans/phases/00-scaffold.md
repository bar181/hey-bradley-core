# Phase 0: Project Scaffold & Tooling

**Status:** NOT STARTED
**Estimated Agents:** 2 (sequential)
**Blocked By:** None
**Unblocks:** Phase 1.0

---

## Checklist

### 0.1 — Vite Project Init
- [ ] Run `npm create vite@latest . -- --template react-ts` in src workspace
- [ ] Verify `package.json` exists with React 18 + TypeScript
- [ ] `npm run dev` shows default Vite page

### 0.2 — Install Approved Dependencies
- [ ] `npm install zustand zod react-router-dom react-resizable-panels`
- [ ] `npm install clsx tailwind-merge class-variance-authority`
- [ ] `npm install lucide-react uuid`
- [ ] `npm install -D tailwindcss postcss autoprefixer tailwindcss-animate`
- [ ] `npm install -D @types/uuid`
- [ ] NO unapproved packages installed

### 0.3 — Tailwind Configuration
- [ ] `npx tailwindcss init -p` creates config files
- [ ] `tailwind.config.ts` extended with full HB token system:
  - 28 custom colors (`hb-bg`, `hb-surface`, `hb-accent`, etc.)
  - Font families (`font-ui: DM Sans`, `font-mono: JetBrains Mono`)
  - Orb animations (`orb-pulse`, `orb-breathe`, `orb-active`)
- [ ] `postcss.config.js` configured
- [ ] `@tailwind` directives in CSS entry point

### 0.4 — Path Aliases
- [ ] `tsconfig.json` has `paths: { "@/*": ["./src/*"] }`
- [ ] `vite.config.ts` has matching resolve aliases
- [ ] Import `@/lib/cn` resolves correctly

### 0.5 — Design Tokens
- [ ] `src/styles/tokens.css` — CSS custom properties from Design Bible
- [ ] `src/styles/fonts.css` — Google Fonts import (DM Sans + JetBrains Mono)
- [ ] `src/lib/cn.ts` — clsx + tailwind-merge utility

### 0.6 — shadcn/ui Init
- [ ] `npx shadcn-ui@latest init` with Tailwind config
- [ ] Base components installed: Button, Input, Accordion, Tabs, Toggle

### 0.7 — Entry Points
- [ ] `index.html` with root div
- [ ] `src/main.tsx` renders App
- [ ] `src/App.tsx` with React Router

### 0.8 — Build Verification
- [ ] `npm run dev` — no errors
- [ ] `npm run build` — clean build
- [ ] `npm run lint` — no warnings (if configured)

---

## Design References
- **Vite Setup**: [Vite React TS Template](https://vitejs.dev/guide/)
- **shadcn/ui**: [shadcn/ui Installation](https://ui.shadcn.com/docs/installation/vite)
- **Tailwind Config**: Design Bible Doc 4 §8

## Exit Criteria
App runs at localhost. All tokens/aliases work. Ready for shell components.
