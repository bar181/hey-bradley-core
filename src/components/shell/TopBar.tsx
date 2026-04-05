import { Monitor, Tablet, Smartphone, Undo2, Redo2, Sun, Moon, Menu, X, Eye, PenLine, Check, Lock, Unlock, Shield, ShieldOff, Save } from 'lucide-react'

import { useConfigStore } from '@/store/configStore'
import { useUIStore, type PreviewWidth } from '@/store/uiStore'
import { useProjectStore } from '@/store/projectStore'
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
  const designLocked = useUIStore((s) => s.designLocked)
  const toggleDesignLock = useUIStore((s) => s.toggleDesignLock)
  const brandLocked = useUIStore((s) => s.brandLocked)
  const toggleBrandLock = useUIStore((s) => s.toggleBrandLock)

  // Project management
  const isDirty = useConfigStore((s) => s.isDirty)
  const config = useConfigStore((s) => s.config)
  const markSaved = useConfigStore((s) => s.markSaved)
  const saveProject = useProjectStore((s) => s.saveProject)

  const [saveOpen, setSaveOpen] = useState(false)
  const [saveName, setSaveName] = useState('')
  const saveRef = useRef<HTMLDivElement>(null)

  // Site chrome dark/light mode
  const [chromeLight, setChromeLight] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleShare = useCallback(() => {
    const config = useConfigStore.getState().config
    try {
      localStorage.setItem('hey-bradley-shared', JSON.stringify(config))
    } catch {
      // localStorage full — fall back to current URL
    }
    const shareUrl = `${window.location.origin}/builder?preview=1`
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    })
  }, [])

  // Default save name from site title
  const defaultSaveName = config.site?.title || 'Untitled Project'

  const handleSave = useCallback(() => {
    const name = saveName.trim() || defaultSaveName
    const currentConfig = useConfigStore.getState().config
    saveProject(name, currentConfig)
    // Persist lock state alongside project
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled'
    const uiState = useUIStore.getState()
    try {
      localStorage.setItem(`hb-locks-${slug}`, JSON.stringify({
        designLocked: uiState.designLocked,
        brandLocked: uiState.brandLocked,
      }))
    } catch { /* localStorage full */ }
    markSaved()
    setSaveOpen(false)
    setSaveName('')
  }, [saveName, defaultSaveName, saveProject, markSaved])

  // Close save dropdown on outside click
  useEffect(() => {
    if (!saveOpen) return
    const handler = (e: MouseEvent) => {
      if (saveRef.current && !saveRef.current.contains(e.target as Node)) {
        setSaveOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [saveOpen])

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
        <button
          onClick={toggleDesignLock}
          className={`p-1 transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded ${
            designLocked ? 'text-hb-accent' : 'text-white/60 hover:text-white'
          }`}
          aria-label={designLocked ? 'Unlock design editing' : 'Lock design editing'}
          title={designLocked ? 'Design locked — content editing only' : 'Design unlocked'}
        >
          {designLocked ? <Lock size={16} /> : <Unlock size={16} />}
        </button>
        <button
          onClick={toggleBrandLock}
          className={`p-1 transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded ${
            brandLocked ? 'text-hb-accent' : 'text-white/60 hover:text-white'
          }`}
          aria-label={brandLocked ? 'Unlock brand editing' : 'Lock brand editing'}
          title={brandLocked ? 'Brand locked — SEO & brand fields read-only' : 'Brand unlocked'}
        >
          {brandLocked ? <Shield size={16} /> : <ShieldOff size={16} />}
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
        {/* Save/Load indicator */}
        <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${isDirty ? 'text-amber-400/80' : 'text-green-400/80'}`}>
          {isDirty ? 'Unsaved' : 'Saved'}
        </span>
        <div className="w-px h-4 bg-white/20 mx-1" />

        {/* Save project */}
        <div className="relative" ref={saveRef}>
          <button
            onClick={() => { setSaveOpen(!saveOpen); setSaveName('') }}
            className="p-1 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent rounded"
            aria-label="Save project"
            title="Save project"
          >
            <Save size={16} />
          </button>
          {saveOpen && (
            <div className="absolute top-8 right-0 w-64 bg-hb-surface border border-hb-border rounded-lg shadow-xl z-50 p-3">
              <label className="block text-xs font-medium text-hb-text-muted mb-1.5">Project name</label>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder={defaultSaveName}
                className="w-full px-2 py-1.5 rounded bg-hb-surface-hover border border-hb-border text-sm text-hb-text-primary placeholder:text-hb-text-muted/50 focus:outline-none focus:ring-1 focus:ring-hb-accent"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
                autoFocus
              />
              <button
                onClick={handleSave}
                className="mt-2 w-full px-3 py-1.5 rounded bg-hb-accent text-white text-xs font-mono uppercase tracking-wider hover:bg-hb-accent/90 transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>

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
