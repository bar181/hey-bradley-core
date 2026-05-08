import { StrictMode, Suspense, lazy, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Welcome } from '@/pages/Welcome'
import { Builder } from '@/pages/Builder'
import { NotFound } from '@/pages/NotFound'
import { initDB } from '@/contexts/persistence/db'
import { migrateLegacyLocalStorage } from '@/contexts/persistence/legacyMigration'
import { setupAutosave } from '@/contexts/persistence/autosave'
import { useProjectStore } from '@/store/projectStore'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { useListenStore } from '@/store/listenStore'
import { PersistenceErrorBanner } from '@/components/shell/PersistenceErrorBanner'
import './index.css'

// P77 / OC-10 — code-split heavy routes via React.lazy().
// Pages export named components, so we re-map to `default` for lazy().
// EAGER (kept as static imports above): /, /builder, /* (NotFound) — preserves
// LCP on the landing surface and avoids a Suspense flash on the primary tool.
const Onboarding = lazy(() => import('@/pages/Onboarding').then((m) => ({ default: m.Onboarding })))
// About page now redirects to /capstone (P121.5)
// const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })))
const AISP = lazy(() => import('@/pages/AISP').then((m) => ({ default: m.AISP })))
// Research and ForTeams pages now redirect to blog posts (P121.5)
// const Research = lazy(() => import('@/pages/Research').then((m) => ({ default: m.Research })))
const OpenCore = lazy(() => import('@/pages/OpenCore').then((m) => ({ default: m.OpenCore })))
const HowIBuiltThis = lazy(() => import('@/pages/HowIBuiltThis').then((m) => ({ default: m.HowIBuiltThis })))
const Docs = lazy(() => import('@/pages/Docs').then((m) => ({ default: m.Docs })))
const BYOK = lazy(() => import('@/pages/BYOK').then((m) => ({ default: m.BYOK })))
const Blog = lazy(() => import('@/pages/Blog').then((m) => ({ default: m.Blog })))
const BlogPost = lazy(() => import('@/pages/BlogPost').then((m) => ({ default: m.BlogPost })))
const Progress = lazy(() => import('@/pages/Progress').then((m) => ({ default: m.Progress })))
const SharedSpec = lazy(() => import('@/pages/SharedSpec').then((m) => ({ default: m.SharedSpec })))
const ListenModeDemo = lazy(() => import('@/demos/ListenModeDemo').then((m) => ({ default: m.ListenModeDemo })))
const ChatModeDemo = lazy(() => import('@/demos/ChatModeDemo').then((m) => ({ default: m.ChatModeDemo })))
const FullSiteSimulator = lazy(() => import('@/demos/FullSiteSimulator').then((m) => ({ default: m.FullSiteSimulator })))
// P90 / AW-MODE-ARCH (A3) — Planning + Agentics route stubs (per ADR-088 + ADR-116).
const Planning = lazy(() => import('@/pages/Planning').then((m) => ({ default: m.Planning })))
const Agentics = lazy(() => import('@/pages/Agentics').then((m) => ({ default: m.Agentics })))
// P118.5 / WALKTHROUGH (per ADR-147) — section-like story page at /walkthrough.
const Walkthrough = lazy(() => import('@/pages/Walkthrough'))
// P120 / AUDIENCE-ROUTING (per ADR-149) — /for-teams + /contact + /guides redirect.
// const ForTeams = lazy(() => import('@/pages/ForTeams').then((m) => ({ default: m.ForTeams })))
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const ROUTE_FALLBACK = <div style={{ padding: 24, color: '#6b5e4f' }}>Loading…</div>

const rootEl = document.getElementById('root')!
const root = createRoot(rootEl)

root.render(<div>Loading…</div>)

initDB()
  .then(async () => {
    const { migrated } = migrateLegacyLocalStorage()
    if (import.meta.env.DEV && migrated > 0) console.info(`[persistence] migrated ${migrated} legacy projects`)
    setupAutosave()
    await useProjectStore.getState().hydrateLastProjectAfterDB()
    void useIntelligenceStore.getState().init()
    useListenStore.getState().init()
    // FIX 4: close the active session on unload so sessions don't accumulate
    // forever (unbounded `sessions` table growth was R4 HIGH).
    window.addEventListener('beforeunload', () => {
      useIntelligenceStore.getState().endActiveSession()
    })
    root.render(
      <StrictMode>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={ROUTE_FALLBACK}>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/new-project" element={<Onboarding />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/capstone" element={<OpenCore />} />
              <Route path="/open-core" element={<Navigate to="/capstone" replace />} />
              <Route path="/about" element={<Navigate to="/capstone" replace />} />
              <Route path="/aisp" element={<AISP />} />
              <Route path="/research" element={<Navigate to="/blog/research-the-telephone-game" replace />} />
              {/* /open-core redirects to /capstone via route above */}
              <Route path="/how-i-built-this" element={<HowIBuiltThis />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/byok" element={<BYOK />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/spec/:hash" element={<SharedSpec />} />
              <Route path="/demo/listen" element={<ListenModeDemo />} />
              <Route path="/demo/chat" element={<ChatModeDemo />} />
              <Route path="/demo/full-site" element={<FullSiteSimulator />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/agentics" element={<Agentics />} />
              <Route path="/walkthrough" element={<Walkthrough />} />
              <Route path="/for-teams" element={<Navigate to="/blog/teams-spec-handoff-for-product-teams" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/guides" element={<Navigate to="/blog?category=technical" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </StrictMode>,
    )
  })
  .catch((err: unknown) => {
    if (import.meta.env.DEV) console.warn('[persistence] initDB failed; rendering app without local DB', err)
    root.render(
      <StrictMode>
        <BrowserRouter>
          <ScrollToTop />
          <PersistenceErrorBanner />
          <Suspense fallback={ROUTE_FALLBACK}>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/new-project" element={<Onboarding />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/capstone" element={<OpenCore />} />
              <Route path="/open-core" element={<Navigate to="/capstone" replace />} />
              <Route path="/about" element={<Navigate to="/capstone" replace />} />
              <Route path="/aisp" element={<AISP />} />
              <Route path="/research" element={<Navigate to="/blog/research-the-telephone-game" replace />} />
              {/* /open-core redirects to /capstone via route above */}
              <Route path="/how-i-built-this" element={<HowIBuiltThis />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/byok" element={<BYOK />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/spec/:hash" element={<SharedSpec />} />
              <Route path="/demo/listen" element={<ListenModeDemo />} />
              <Route path="/demo/chat" element={<ChatModeDemo />} />
              <Route path="/demo/full-site" element={<FullSiteSimulator />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/agentics" element={<Agentics />} />
              <Route path="/walkthrough" element={<Walkthrough />} />
              <Route path="/for-teams" element={<Navigate to="/blog/teams-spec-handoff-for-product-teams" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/guides" element={<Navigate to="/blog?category=technical" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </StrictMode>,
    )
  })
