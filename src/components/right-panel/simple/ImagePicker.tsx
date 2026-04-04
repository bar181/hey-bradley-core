import { useState, useCallback, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import {
  Image,
  X,
  Play,
  Layers,
  Film,
  Camera,
  Search,
  Clock,
  Sparkles,
} from 'lucide-react'

import imageData from '@/data/media/images.json'
import videoData from '@/data/media/videos.json'
import effectData from '@/data/media/effects.json'

// ── Types ──

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  onEffectChange?: (effect: string) => void
  currentEffect?: string
  label?: string
  mode?: 'image' | 'video' | 'both'
}

type TabId = 'photos' | 'videos' | 'effects'

// ── Category display names ──

const CATEGORY_DISPLAY: Record<string, string> = {
  food: 'Food',
  technology: 'Technology',
  nature: 'Nature',
  business: 'Business',
  creative: 'Creative',
  fitness: 'Fitness',
  architecture: 'Architecture',
  people: 'People',
  abstract: 'Abstract',
  products: 'Products',
}

const ALL_CATEGORIES = ['all', ...imageData.categories] as const
type PhotoCategory = (typeof ALL_CATEGORIES)[number]

// ── Helpers ──

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `0:${s.toString().padStart(2, '0')}`
}

// ── Component ──

export function ImagePicker({
  value,
  onChange,
  onEffectChange,
  currentEffect,
  label = 'Choose Media',
  mode = 'both',
}: ImagePickerProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('photos')
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter images by category and search
  const filteredImages = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    let images = imageData.images

    if (activeCategory !== 'all') {
      images = images.filter((img) => img.category === activeCategory)
    }

    if (query) {
      images = images.filter((img) => {
        const matchesTags = img.tags.some((t) => t.toLowerCase().includes(query))
        const matchesDesc = img.description.toLowerCase().includes(query)
        const matchesMood = img.mood.toLowerCase().includes(query)
        return matchesTags || matchesDesc || matchesMood
      })
    }

    return images
  }, [activeCategory, searchQuery])

  // Filter videos by search
  const filteredVideos = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return videoData.videos
    return videoData.videos.filter((v) => {
      const matchesTags = v.tags.some((t) => t.toLowerCase().includes(query))
      const matchesDesc = v.description.toLowerCase().includes(query)
      const matchesMood = v.mood.toLowerCase().includes(query)
      return matchesTags || matchesDesc || matchesMood
    })
  }, [searchQuery])

  const handleSelectImage = useCallback(
    (img: (typeof imageData.images)[number]) => {
      onChange(img.url)
      setOpen(false)
    },
    [onChange],
  )

  const handleSelectVideo = useCallback(
    (video: (typeof videoData.videos)[number]) => {
      onChange(video.url)
      setOpen(false)
    },
    [onChange],
  )

  const handleSelectEffect = useCallback(
    (effectId: string) => {
      onEffectChange?.(effectId)
    },
    [onEffectChange],
  )

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) setSearchQuery('')
  }, [open])

  // Determine available tabs
  const tabs: { id: TabId; label: string; icon: typeof Camera }[] = []
  if (mode === 'image' || mode === 'both') {
    tabs.push({ id: 'photos', label: 'Photos', icon: Camera })
  }
  if (mode === 'video' || mode === 'both') {
    tabs.push({ id: 'videos', label: 'Videos', icon: Film })
  }
  tabs.push({ id: 'effects', label: 'Effects', icon: Sparkles })

  // Ensure activeTab is valid for current mode
  const resolvedTab = tabs.some((t) => t.id === activeTab) ? activeTab : tabs[0]?.id ?? 'photos'

  // Check if the current value matches a library image
  const currentBase = value.split('?')[0]

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md border transition-all text-left',
          'bg-hb-surface border-hb-border/50 hover:border-hb-accent/40 hover:bg-hb-surface-hover',
        )}
      >
        {value ? (
          <img
            src={value.endsWith('.mp4') ? '' : value}
            alt="Selected"
            className="w-7 h-7 rounded object-cover shrink-0 border border-hb-border/30"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <span className="w-7 h-7 rounded bg-hb-bg border border-hb-border/30 flex items-center justify-center shrink-0">
            <Image size={12} className="text-hb-text-muted" />
          </span>
        )}
        <span className="text-xs font-medium text-hb-text-muted truncate">{label}</span>
      </button>

      {/* Dialog overlay via portal */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Dialog */}
            <div
              className={cn(
                'relative z-10 w-full max-w-[720px] max-h-[560px] rounded-lg border shadow-2xl overflow-hidden',
                'bg-hb-bg border-hb-border flex flex-col',
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with tabs and search */}
              <div className="shrink-0 border-b border-hb-border/40">
                <div className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
                            resolvedTab === tab.id
                              ? 'bg-hb-accent/15 text-hb-accent'
                              : 'text-hb-text-muted hover:bg-hb-surface-hover hover:text-hb-text-primary',
                          )}
                        >
                          <Icon size={13} />
                          {tab.label}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Search input */}
                    {resolvedTab !== 'effects' && (
                      <div className="relative">
                        <Search
                          size={12}
                          className="absolute left-2 top-1/2 -translate-y-1/2 text-hb-text-muted pointer-events-none"
                        />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search tags, mood..."
                          className={cn(
                            'w-[160px] pl-6 pr-2 py-1 rounded-md text-xs transition-all',
                            'bg-hb-surface border border-hb-border/50 text-hb-text-primary placeholder:text-hb-text-muted/50',
                            'focus:outline-none focus:border-hb-accent/40',
                          )}
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="p-1 rounded hover:bg-hb-surface-hover transition-colors text-hb-text-muted hover:text-hb-text-primary"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 min-h-0">
                {/* ── Photos tab ── */}
                {resolvedTab === 'photos' && (
                  <>
                    {/* Category sidebar */}
                    <div className="w-[140px] shrink-0 border-r border-hb-border/30 py-2 px-2 overflow-y-auto">
                      {ALL_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveCategory(cat)}
                          className={cn(
                            'w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-all mb-0.5',
                            activeCategory === cat
                              ? 'bg-hb-accent/15 text-hb-accent'
                              : 'text-hb-text-muted hover:bg-hb-surface-hover hover:text-hb-text-primary',
                          )}
                        >
                          {cat === 'all' ? 'All' : CATEGORY_DISPLAY[cat] ?? cat}
                        </button>
                      ))}
                    </div>

                    {/* Image grid */}
                    <div className="flex-1 overflow-y-auto p-3">
                      {filteredImages.length === 0 ? (
                        <p className="text-xs text-hb-text-muted text-center py-8">
                          No images match your search.
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {filteredImages.map((img) => {
                            const isSelected = currentBase === img.url.split('?')[0]
                            return (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => handleSelectImage(img)}
                                className={cn(
                                  'relative aspect-[4/3] rounded-md overflow-hidden border-2 transition-all',
                                  'hover:scale-[1.03] hover:shadow-lg',
                                  isSelected
                                    ? 'border-[hsl(348,83%,47%)] ring-1 ring-[hsl(348,83%,47%)]'
                                    : 'border-transparent hover:border-hb-accent/40',
                                )}
                                title={img.description}
                              >
                                <img
                                  src={img.thumbnail}
                                  alt={img.description}
                                  loading="lazy"
                                  className="absolute inset-0 w-full h-full object-cover"
                                  onError={(e) => {
                                    ;(e.target as HTMLImageElement).style.display = 'none'
                                  }}
                                />
                                {/* Label overlay */}
                                <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1">
                                  <span className="text-[10px] text-white font-medium">
                                    {img.description.length > 30
                                      ? img.description.slice(0, 30) + '...'
                                      : img.description}
                                  </span>
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ── Videos tab ── */}
                {resolvedTab === 'videos' && (
                  <div className="flex-1 overflow-y-auto p-3">
                    {filteredVideos.length === 0 ? (
                      <p className="text-xs text-hb-text-muted text-center py-8">
                        No videos match your search.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {filteredVideos.map((video) => {
                          const isSelected = value === video.url
                          return (
                            <button
                              key={video.id}
                              type="button"
                              onClick={() => handleSelectVideo(video)}
                              className={cn(
                                'relative aspect-[4/3] rounded-md overflow-hidden border-2 transition-all group',
                                'hover:scale-[1.03] hover:shadow-lg',
                                isSelected
                                  ? 'border-[hsl(348,83%,47%)] ring-1 ring-[hsl(348,83%,47%)]'
                                  : 'border-transparent hover:border-hb-accent/40',
                              )}
                              title={video.description}
                            >
                              <img
                                src={video.thumbnail}
                                alt={video.description}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                              {/* Play icon overlay */}
                              <span className="absolute inset-0 flex items-center justify-center">
                                <span
                                  className={cn(
                                    'w-9 h-9 rounded-full flex items-center justify-center',
                                    'bg-black/50 group-hover:bg-black/70 transition-colors',
                                    'backdrop-blur-sm',
                                  )}
                                >
                                  <Play size={16} className="text-white ml-0.5" fill="white" />
                                </span>
                              </span>
                              {/* Duration badge */}
                              <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/70 text-white text-[9px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm">
                                <Clock size={9} />
                                {formatDuration(video.duration_seconds)}
                              </span>
                              {/* Label overlay */}
                              <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1">
                                <span className="text-[10px] text-white font-medium">
                                  {video.description.length > 30
                                    ? video.description.slice(0, 30) + '...'
                                    : video.description}
                                </span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Effects tab ── */}
                {resolvedTab === 'effects' && (
                  <div className="flex-1 overflow-y-auto p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {effectData.effects.map((effect) => {
                        const isSelected = currentEffect === effect.id
                        return (
                          <button
                            key={effect.id}
                            type="button"
                            onClick={() => handleSelectEffect(effect.id)}
                            className={cn(
                              'flex flex-col items-center gap-1.5 p-4 rounded-lg border-2 transition-all text-center',
                              'hover:shadow-md',
                              isSelected
                                ? 'border-[hsl(348,83%,47%)] bg-hb-accent/10'
                                : 'border-hb-border/40 hover:border-hb-accent/40 bg-hb-surface hover:bg-hb-surface-hover',
                            )}
                          >
                            <Layers
                              size={22}
                              className={cn(
                                'transition-colors',
                                isSelected ? 'text-[hsl(348,83%,47%)]' : 'text-hb-text-muted',
                              )}
                            />
                            <span
                              className={cn(
                                'text-xs font-semibold',
                                isSelected ? 'text-[hsl(348,83%,47%)]' : 'text-hb-text-primary',
                              )}
                            >
                              {effect.label}
                            </span>
                            <span className="text-[10px] text-hb-text-muted leading-tight">
                              {effect.description}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
