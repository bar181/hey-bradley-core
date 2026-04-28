import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Welcome } from '@/pages/Welcome'
import { Onboarding } from '@/pages/Onboarding'
import { Builder } from '@/pages/Builder'
import { About } from '@/pages/About'
import { AISP } from '@/pages/AISP'
import { Research } from '@/pages/Research'
import { OpenCore } from '@/pages/OpenCore'
import { HowIBuiltThis } from '@/pages/HowIBuiltThis'
import { Docs } from '@/pages/Docs'
import { BYOK } from '@/pages/BYOK'
import { NotFound } from '@/pages/NotFound'
import { initDB } from '@/contexts/persistence/db'
import { migrateLegacyLocalStorage } from '@/contexts/persistence/legacyMigration'
import { setupAutosave } from '@/contexts/persistence/autosave'
import { useProjectStore } from '@/store/projectStore'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { useListenStore } from '@/store/listenStore'
import { PersistenceErrorBanner } from '@/components/shell/PersistenceErrorBanner'
import './index.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

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
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/new-project" element={<Onboarding />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/about" element={<About />} />
            <Route path="/aisp" element={<AISP />} />
            <Route path="/research" element={<Research />} />
            <Route path="/open-core" element={<OpenCore />} />
            <Route path="/how-i-built-this" element={<HowIBuiltThis />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/byok" element={<BYOK />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StrictMode>,
    )
  })
  .catch((err: unknown) => {
    // P19 Fix-Pass 2 (F14): render the existing app surface AND a persistent
    // dismissable banner so the user is told that local persistence is broken.
    // The rest of the app keeps working in-memory; refresh = retry.
    if (import.meta.env.DEV) console.warn('[persistence] initDB failed; rendering app without local DB', err)
    root.render(
      <StrictMode>
        <BrowserRouter>
          <ScrollToTop />
          <PersistenceErrorBanner />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/new-project" element={<Onboarding />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/about" element={<About />} />
            <Route path="/aisp" element={<AISP />} />
            <Route path="/research" element={<Research />} />
            <Route path="/open-core" element={<OpenCore />} />
            <Route path="/how-i-built-this" element={<HowIBuiltThis />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/byok" element={<BYOK />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StrictMode>,
    )
  })
