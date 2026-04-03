import { Monitor, Tablet, Smartphone, Undo2, Redo2, Sun, Moon, Menu, X, Eye, PenLine, PanelRightClose, PanelRightOpen, Check } from 'lucide-react'

import { useConfigStore } from '@/store/configStore'
import { useUIStore, type PreviewWidth } from '@/store/uiStore'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const DEVICE_BUTTONS: { icon: typeof Monitor; width: PreviewWidth; label: string }[] = [
  { icon: Monitor, width: 'desktop', label: 'Desktop' },
  { icon: Tablet, width: 'tablet', label: 'Tablet' },
  { icon: Smartphone, width: 'mobile', label: 'Mobile' },
]

export function TopBar() {
  const navigate = useNavigate()
  const undo = useConfigStore((s) => s.undo)
  const redo = useConfigStore((s) => s.redo)
  const canUndo = useConfigStore((s) => s.canUndo())
  const canRedo = useConfigStore((s) => s.canRedo())
  const previewWidth = useUIStore((s) => s.previewWidth)
  const setPreviewWidth = useUIStore((s) => s.setPreviewWidth)
  const isPreviewMode = useUIStore((s) => s.isPreviewMode)
  const setPreviewMode = useUIStore((s) => s.setPreviewMode)
  const rightPanelVisible = useUIStore((s) => s.rightPanelVisible)
  const setRightPanelVisible = useUIStore((s) => s.setRightPanelVisible)

  // Site chrome dark/light mode
  const [chromeLight, setChromeLight] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    })
  }, [])

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
      >
        <span className="font-mono font-bold text-lg">Hey Bradley</span>
      </button>

      {/* Center spacer */}
      <div className="flex items-center" />

      {/* Right: Desktop controls (hidden below md) */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={() => setChromeLight(!chromeLight)}
          className="p-1 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded"
          aria-label={chromeLight ? 'Switch to dark mode' : 'Switch to light mode'}
          title={chromeLight ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {chromeLight ? <Moon size={14} /> : <Sun size={14} />}
        </button>
        <div className="w-px h-4 bg-white/20 mx-1" />
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-1 transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded ${canUndo ? 'text-white/60 hover:text-white' : 'opacity-30 cursor-not-allowed text-white/40'}`}
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-1 transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded ${canRedo ? 'text-white/60 hover:text-white' : 'opacity-30 cursor-not-allowed text-white/40'}`}
          aria-label="Redo"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={16} />
        </button>
        <div className="w-px h-4 bg-white/20 mx-1" />
        {DEVICE_BUTTONS.map(({ icon: Icon, width, label }) => (
          <button
            key={width}
            onClick={() => handleDeviceClick(width)}
            className={`p-1 transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded ${
              previewWidth === width
                ? 'text-white'
                : 'text-white/60 hover:text-white'
            }`}
            aria-label={`Preview at ${label}`}
            title={`Preview at ${label}`}
          >
            <Icon size={16} />
          </button>
        ))}
        <div className="w-px h-4 bg-white/20 mx-1" />
        {/* Toggle right panel */}
        <button
          onClick={() => setRightPanelVisible(!rightPanelVisible)}
          className="p-1 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded"
          aria-label={rightPanelVisible ? 'Hide right panel' : 'Show right panel'}
          title={rightPanelVisible ? 'Hide right panel' : 'Show right panel'}
        >
          {rightPanelVisible ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
        </button>
        <div className="w-px h-4 bg-white/20 mx-1" />
        <button
          onClick={() => setPreviewMode(!isPreviewMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent ${
            isPreviewMode
              ? 'bg-hb-accent text-white'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          aria-label={isPreviewMode ? 'Exit preview' : 'Preview site'}
          title={isPreviewMode ? 'Exit preview (Esc)' : 'Preview full site'}
        >
          {isPreviewMode ? <><PenLine size={14} /> Edit</> : <><Eye size={14} /> Preview</>}
        </button>
        <button
          onClick={handleShare}
          className="ml-1 border border-white/20 text-white/80 font-mono text-xs uppercase px-3 py-1 rounded hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent flex items-center gap-1"
        >
          {shareCopied ? <><Check size={12} /> Copied!</> : 'Share'}
        </button>
      </div>

      {/* Right: Hamburger button (visible below md) */}
      <div className="md:hidden" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 text-white/70 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {menuOpen && (
          <div className="absolute top-12 right-0 w-56 bg-hb-surface border border-hb-border rounded-lg shadow-xl z-50 py-2">
            <div className="flex items-center gap-2 px-3 py-2">
              <button
                onClick={() => { undo(); setMenuOpen(false) }}
                disabled={!canUndo}
                className={`flex items-center gap-2 flex-1 px-2 py-1.5 rounded text-sm transition-colors ${canUndo ? 'text-hb-text-primary hover:bg-hb-surface-hover' : 'opacity-30 text-hb-text-muted cursor-not-allowed'}`}
              >
                <Undo2 size={14} /> Undo
              </button>
              <button
                onClick={() => { redo(); setMenuOpen(false) }}
                disabled={!canRedo}
                className={`flex items-center gap-2 flex-1 px-2 py-1.5 rounded text-sm transition-colors ${canRedo ? 'text-hb-text-primary hover:bg-hb-surface-hover' : 'opacity-30 text-hb-text-muted cursor-not-allowed'}`}
              >
                <Redo2 size={14} /> Redo
              </button>
            </div>
            <div className="h-px bg-hb-border mx-3 my-1" />
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
            >
              {chromeLight ? <Moon size={14} /> : <Sun size={14} />}
              {chromeLight ? 'Dark Mode' : 'Light Mode'}
            </button>
            <button
              onClick={() => { setPreviewMode(!isPreviewMode); setMenuOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-hb-text-primary hover:bg-hb-surface-hover transition-colors"
            >
              {isPreviewMode ? <><PenLine size={14} /> Exit Preview</> : <><Eye size={14} /> Preview Site</>}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
