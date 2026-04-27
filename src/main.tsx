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
import { NotFound } from '@/pages/NotFound'
import { initDB } from '@/contexts/persistence/db'
import { migrateLegacyLocalStorage } from '@/contexts/persistence/legacyMigration'
import { setupAutosave } from '@/contexts/persistence/autosave'
import { useProjectStore } from '@/store/projectStore'
import { useIntelligenceStore } from '@/store/intelligenceStore'
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
            <Route path="*" element={<NotFound />} />
          </Routes>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StrictMode>,
    )
  })
