import { AppShell } from '@/components/shell/AppShell'
import { MobileLayout } from '@/components/shell/MobileLayout'

export function Builder() {
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
