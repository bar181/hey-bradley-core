import { TopBar } from './TopBar'
import { StatusBar } from './StatusBar'
import { PanelLayout } from './PanelLayout'

export function AppShell() {
  return (
    <div className="h-screen flex flex-col bg-hb-bg">
      <TopBar />
      <main className="flex-1 overflow-hidden">
        <PanelLayout />
      </main>
      <StatusBar />
    </div>
  )
}
