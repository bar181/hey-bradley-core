import { Monitor, Tablet, Smartphone, Sun, Moon, Menu, X, Eye, PenLine, Lock, Unlock, Shield, ShieldOff, Settings } from 'lucide-react'

import { useConfigStore } from '@/store/configStore'
import { useUIStore, type PreviewWidth } from '@/store/uiStore'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from '@/components/ui/Tooltip'

const DEVICE_BUTTONS: { icon: typeof Monitor; width: PreviewWidth; label: string }[] = [
  { icon: Monitor, width: 'desktop', label: 'Desktop' },
  { icon: Tablet, width: 'tablet', label: 'Tablet' },
  { icon: Smartphone, width: 'mobile', label: 'Mobile' },
]

export function TopBar() {
  const navigate = useNavigate()
  const previewWidth = useUIStore((s) => s.previewWidth)
  const setPreviewWidth = useUIStore((s) => s.setPreviewWidth)
  const isPreviewMode = useUIStore((s) => s.isPreviewMode)
  const setPreviewMode = useUIStore((s) => s.setPreviewMode)
  const designLocked = useUIStore((s) => s.designLocked)
  const toggleDesignLock = useUIStore((s) => s.toggleDesignLock)
  const brandLocked = useUIStore((s) => s.brandLocked)
  const toggleBrandLock = useUIStore((s) => s.toggleBrandLock)
  const toggleSettingsDrawer = useUIStore((s) => s.toggleSettingsDrawer)
  // DRAFT mode = SIMPLE right-panel tab (see plans/implementation/mvp-plan/01-phase-15-polish-kitchen-sink.md §1.1).
  // DRAFT-mode top-bar control budget: ≤ 6 interactive elements
  // (logo, mode toggle, save, export, settings, theme picker). EXPERT keeps all controls.

  const isDirty = useConfigStore((s) => s.isDirty)

  const handleSettingsClick = () => {
    toggleSettingsDrawer()
  }

  // Site chrome dark/light mode
  const [chromeLight, setChromeLight] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('light-chrome', chromeLight)
  }, [chromeLight])

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleDeviceClick = (width: PreviewWidth) => {
    setPreviewWidth(previewWidth === width ? 'full' : width)
  }

  return (
    <header
      role="banner"
      className="h-12 flex items-center justify-between px-3 sm:px-4 border-b border-hb-border shrink-0 transition-colors relative"
      style={{ backgroundColor: 'var(--hb-nav-bg, #8C1515)' }}
    >
      {/* Left: Logo linking to home */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2 shrink-0 text-white hover:text-white/80 transition-colors"
        aria-label="Go to home page"
        title="Go back to the home page."
      >
        <span className="font-mono font-bold text-lg">Hey Bradley</span>
      </button>

      {/* Center spacer */}
      <div className="flex items-center" />

      {/* Right: Desktop controls (hidden below md) */}
      <div className="hidden md:flex items-center gap-2">
        <Tooltip content="Switch light/dark editor chrome" position="bottom">
          <button
            onClick={() => setChromeLight(!chromeLight)}
            className="p-1 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded"
            aria-label={chromeLight ? 'Switch to dark mode' : 'Switch to light mode'}
            title="Switch the editor between light and dark colors."
          >
            {chromeLight ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </Tooltip>
        {/* DRAFT-mode top-bar control budget: device + lock controls are EXPERT-only. */}
        {!isDraft && (
          <>
            <div className="w-px h-4 bg-white/20 mx-1" />
            {DEVICE_BUTTONS.map(({ icon: Icon, width, label }) => (
              <Tooltip key={width} content={`Preview at ${label.toLowerCase()} size`} position="bottom">
                <button
                  onClick={() => handleDeviceClick(width)}
                  className={`p-1 transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded ${
                    previewWidth === width
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                  aria-label={`Preview at ${label}`}
                  title={`See how your page looks on a ${label.toLowerCase()} screen.`}
                >
                  <Icon size={16} />
                </button>
              </Tooltip>
            ))}
            <div className="w-px h-4 bg-white/20 mx-1" />
            <Tooltip content="Lock design — content editing only" position="bottom">
              <button
                onClick={toggleDesignLock}
                className={`p-1 transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded ${
                  designLocked ? 'text-hb-accent' : 'text-white/60 hover:text-white'
                }`}
                aria-label={designLocked ? 'Unlock design editing' : 'Lock design editing'}
                title="Lock the layout so only the words can be changed."
              >
                {designLocked ? <Lock size={16} /> : <Unlock size={16} />}
              </button>
            </Tooltip>
            <Tooltip content="Lock brand — SEO fields read-only" position="bottom">
              <button
                onClick={toggleBrandLock}
                className={`p-1 transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded ${
                  brandLocked ? 'text-hb-accent' : 'text-white/60 hover:text-white'
                }`}
                aria-label={brandLocked ? 'Unlock brand editing' : 'Lock brand editing'}
                title="Lock your site name and search info from being changed."
              >
                {brandLocked ? <Shield size={16} /> : <ShieldOff size={16} />}
              </button>
            </Tooltip>
          </>
        )}
        <div className="w-px h-4 bg-white/20 mx-1" />
        <Tooltip content="Toggle between preview and edit mode" position="bottom">
          <button
            onClick={() => setPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent ${
              isPreviewMode
                ? 'bg-hb-accent text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            aria-label={isPreviewMode ? 'Exit preview' : 'Preview site'}
            title="Switch between editing and previewing your page."
          >
            {isPreviewMode ? <><PenLine size={14} /> Edit</> : <><Eye size={14} /> Preview</>}
          </button>
        </Tooltip>
        <Tooltip content="Open settings" position="bottom">
          <button
            onClick={handleSettingsClick}
            className="p-1 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded"
            aria-label="Open settings"
            title="Open settings."
          >
            <Settings size={16} />
          </button>
        </Tooltip>
        {/* Save status indicator */}
        <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${isDirty ? 'text-amber-400/80' : 'text-green-400/80'}`}>
          {isDirty ? 'Unsaved' : 'Saved'}
        </span>
      </div>

      {/* Right: Hamburger button (visible below md) */}
      <div className="md:hidden" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 text-white/70 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          title="Open or close the menu."
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {menuOpen && (
          <div className="absolute top-12 right-0 w-56 bg-hb-surface border border-hb-border rounded-lg shadow-xl z-50 py-2">
            <div className="px-3 py-2">
              <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Preview</span>
              <div className="flex gap-1 mt-1.5">
                {DEVICE_BUTTONS.map(({ icon: Icon, width, label }) => (
                  <button
                    key={width}
                    onClick={() => { handleDeviceClick(width); setMenuOpen(false) }}
                    className={`flex items-center gap-1.5 flex-1 px-2 py-1.5 rounded text-xs transition-colors ${
                      previewWidth === width
                        ? 'bg-hb-accent/15 text-hb-accent'
                        : 'text-hb-text-muted hover:bg-hb-surface-hover'
                    }`}
                    title={`See how your page looks on a ${label.toLowerCase()} screen.`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-px bg-hb-border mx-3 my-1" />
            <button
              onClick={() => { setChromeLight(!chromeLight); setMenuOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-hb-text-primary hover:bg-hb-surface-hover transition-colors"
              title="Switch the editor between light and dark colors."
            >
              {chromeLight ? <Moon size={14} /> : <Sun size={14} />}
              {chromeLight ? 'Dark Mode' : 'Light Mode'}
            </button>
            <button
              onClick={() => { setPreviewMode(!isPreviewMode); setMenuOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-hb-text-primary hover:bg-hb-surface-hover transition-colors"
              title="Switch between editing and previewing your page."
            >
              {isPreviewMode ? <><PenLine size={14} /> Exit Preview</> : <><Eye size={14} /> Preview Site</>}
            </button>
            <button
              onClick={() => { handleSettingsClick(); setMenuOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-hb-text-primary hover:bg-hb-surface-hover transition-colors"
              title="Open settings."
            >
              <Settings size={14} /> Settings
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
