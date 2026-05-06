import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppShell } from '@/components/shell/AppShell'
import { MobileLayout } from '@/components/shell/MobileLayout'
import { useProjectStore } from '@/store/projectStore'
import { useConfigStore } from '@/store/configStore'

export function Builder() {
  // P114 / A1 fix #2 — `?project=<slug>` query-param recall (per audit Q3
  // Option B — lowest LOC; reuses existing /builder route + Suspense bundle).
  // If `project=<slug>` is present and resolves in the projects table, hydrate
  // configStore from that row. If the slug is missing or invalid the existing
  // hydrateLastProjectAfterDB() boot path remains the source of truth — no
  // navigation away (avoids loops on stale bookmarks).
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const slug = searchParams.get('project')
    if (!slug) return
    const cfg = useProjectStore.getState().loadProject(slug)
    if (cfg) useConfigStore.getState().loadConfig(cfg)
    // Effect runs on mount and when the query param changes; intentional
    // dependency on searchParams keeps deep-link recall working when the user
    // navigates between projects without unmounting Builder.
  }, [searchParams])

  return (
    <>
      {/* Desktop tri-pane — ≥768px (locked D7: Builder hidden on mobile). */}
      <div className="hidden md:flex md:flex-col md:h-screen">
        <AppShell />
      </div>
      {/* Mobile shell — <768px (own md:hidden internal wrapper). */}
      <MobileLayout />
    </>
  )
}
