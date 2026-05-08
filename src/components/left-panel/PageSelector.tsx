import { useEffect, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'
import { useConfigStore } from '@/store/configStore'

/**
 * P78 / OC-11 (ADR-085, ADR-103) — Page selector strip.
 * Click activates, double-click renames (Enter commits, Escape cancels),
 * × deletes (with confirm guard). Empty `pages` collapses to a single
 * "+ Add page" CTA so single-page projects render identically to today.
 */
export function PageSelector() {
  const pages = useConfigStore((s) => s.config.pages)
  const addPage = useConfigStore((s) => s.addPage)
  const removePage = useConfigStore((s) => s.removePage)
  const renamePage = useConfigStore((s) => s.renamePage)
  // configStore.activePage is set by addPage(); we read it back to discover
  // the newly-created page id so we can mirror it into uiStore view state.
  const configActivePage = useConfigStore((s) => s.activePage)

  const activePageId = useUIStore((s) => s.activePageId)
  const setActivePageId = useUIStore((s) => s.setActivePageId)

  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Initial active-page sync: when pages exist but no view-state activePageId
  // is set, default to the first page id.
  useEffect(() => {
    if (activePageId == null && pages && pages.length > 0) {
      setActivePageId(pages[0].id)
    }
  }, [activePageId, pages, setActivePageId])

  // Focus + select the rename input when entering rename mode.
  useEffect(() => {
    if (renamingId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [renamingId])

  const handleAddPage = () => {
    addPage('Untitled Page')
    // After addPage, configStore.activePage holds the new page id.
    const next = useConfigStore.getState().activePage
    if (next) setActivePageId(next)
  }

  const addBtnClass =
    'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-hb-text-muted hover:bg-hb-surface-hover hover:text-hb-text-primary transition-colors duration-200 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)]'

  // Empty state: no pages array or empty array — render only the "+ Add page" CTA.
  if (!pages || pages.length === 0) {
    return (
      <div className="flex items-center border-b border-hb-border px-2 py-1.5">
        <button
          type="button"
          data-testid="page-add-button"
          aria-label="Add new page"
          onClick={handleAddPage}
          className={addBtnClass}
          title="Add a new page to your site"
        >
          <Plus size={12} />
          Add page
        </button>
      </div>
    )
  }

  const commitRename = (pageId: string) => {
    const next = draftTitle.trim()
    if (next) renamePage(pageId, next)
    setRenamingId(null)
    setDraftTitle('')
  }

  const cancelRename = () => {
    setRenamingId(null)
    setDraftTitle('')
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-hb-border px-2 py-1.5">
      {pages.map((page) => {
        const isActive = page.id === activePageId
        const isRenaming = renamingId === page.id
        return (
          <div
            key={page.id}
            data-testid={`page-tab-${page.id}`}
            className={cn(
              'flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors duration-200 cursor-pointer flex-shrink-0',
              isActive
                ? 'bg-[var(--hb-accent)] text-white'
                : 'text-hb-text-muted hover:bg-hb-surface-hover hover:text-hb-text-primary'
            )}
            onClick={() => {
              if (!isRenaming) setActivePageId(page.id)
            }}
          >
            {isRenaming ? (
              <input
                ref={inputRef}
                data-testid="page-rename-input"
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={() => commitRename(page.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    commitRename(page.id)
                  } else if (e.key === 'Escape') {
                    e.preventDefault()
                    cancelRename()
                  }
                }}
                className="bg-transparent border-b border-white/40 outline-none text-xs w-24 focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)]"
                aria-label="Rename page"
              />
            ) : (
              <span
                className="font-medium select-none"
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  setRenamingId(page.id)
                  setDraftTitle(page.title)
                }}
              >
                {page.title}
              </span>
            )}
            {!page.isHome && !isRenaming && (
              <button
                type="button"
                data-testid={`page-delete-${page.id}`}
                aria-label="Delete page"
                onClick={(e) => {
                  e.stopPropagation()
                  if (window.confirm(`Delete page "${page.title}"?`)) {
                    removePage(page.id)
                    if (activePageId === page.id) setActivePageId(configActivePage)
                  }
                }}
                className={cn(
                  'rounded p-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)]',
                  isActive ? 'hover:bg-white/20' : 'hover:bg-hb-surface-hover'
                )}
              >
                <X size={10} />
              </button>
            )}
          </div>
        )
      })}
      <button
        type="button"
        data-testid="page-add-button"
        aria-label="Add new page"
        onClick={handleAddPage}
        className={addBtnClass}
        title="Add a new page to your site"
      >
        <Plus size={12} />
        Add page
      </button>
    </div>
  )
}
