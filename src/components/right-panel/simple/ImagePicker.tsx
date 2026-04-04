import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import {
  Image,
  X,
  Play,
  Layers,
  Film,
  Camera,
  Maximize,
  ZoomIn,
  ArrowDownUp,
  Blend,
  Sparkles,
} from 'lucide-react'

// ── Types ──

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  onEffectChange?: (effect: string) => void
  currentEffect?: string
  label?: string
  mode?: 'image' | 'video' | 'both'
}

interface CuratedImage {
  url: string
  alt: string
  category: string
}

interface CuratedVideo {
  name: string
  thumbnail: string
  url: string
}

interface EffectOption {
  id: string
  name: string
  description: string
  icon: typeof Layers
}

type TabId = 'photos' | 'videos' | 'effects'

// ── Curated image library ──

const PHOTO_CATEGORIES = [
  'All',
  'Food & Bakery',
  'Nature',
  'Business',
  'Technology',
  'People',
  'Creative',
  'Architecture',
  'Abstract',
] as const

type PhotoCategory = (typeof PHOTO_CATEGORIES)[number]

const CURATED_IMAGES: CuratedImage[] = [
  // Food & Bakery (7)
  { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff', alt: 'Bread', category: 'Food & Bakery' },
  { url: 'https://images.unsplash.com/photo-1486427944781-dbf45f4823a2', alt: 'Cookies', category: 'Food & Bakery' },
  { url: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a', alt: 'Pastries', category: 'Food & Bakery' },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', alt: 'Food plate', category: 'Food & Bakery' },
  { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', alt: 'Pizza', category: 'Food & Bakery' },
  { url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543', alt: 'Plated dish', category: 'Food & Bakery' },
  { url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327', alt: 'Gourmet meal', category: 'Food & Bakery' },
  // Nature (7)
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', alt: 'Mountains', category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', alt: 'Forest', category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', alt: 'Beach', category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1518173946687-a1e23a47452c', alt: 'Sunset', category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', alt: 'Valley mist', category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716', alt: 'Waterfall', category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', alt: 'Green hills', category: 'Nature' },
  // Business (7)
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c', alt: 'Office', category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', alt: 'Dashboard', category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', alt: 'Meeting', category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', alt: 'Laptop work', category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984', alt: 'Presentation', category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', alt: 'Analytics', category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0', alt: 'Coworking', category: 'Business' },
  // Technology (7)
  { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', alt: 'Data globe', category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475', alt: 'Circuit', category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', alt: 'Code screen', category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625', alt: 'Building tech', category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', alt: 'Matrix code', category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd', alt: 'Coding', category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c', alt: 'Dev setup', category: 'Technology' },
  // People (7)
  { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', alt: 'Team', category: 'People' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', alt: 'Portrait', category: 'People' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', alt: 'Woman professional', category: 'People' },
  { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a', alt: 'Man suit', category: 'People' },
  { url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac', alt: 'Friends group', category: 'People' },
  { url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846', alt: 'Students', category: 'People' },
  { url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce', alt: 'Smiling woman', category: 'People' },
  // Creative (7)
  { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f', alt: 'Art paint', category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b', alt: 'Colorful wall', category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8', alt: 'Neon lights', category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1493106819501-66d381c466f3', alt: 'Minimal desk', category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8', alt: 'Watercolor', category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9', alt: 'Color splash', category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208', alt: 'Design tools', category: 'Creative' },
  // Architecture (4)
  { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e', alt: 'Modern building', category: 'Architecture' },
  { url: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2', alt: 'Skyscraper', category: 'Architecture' },
  { url: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8', alt: 'Staircase', category: 'Architecture' },
  { url: 'https://images.unsplash.com/photo-1448630360428-65456659c696', alt: 'Bridge', category: 'Architecture' },
  // Abstract (4)
  { url: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3', alt: 'Fluid art', category: 'Abstract' },
  { url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1', alt: 'Color blend', category: 'Abstract' },
  { url: 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6', alt: 'Geometric', category: 'Abstract' },
  { url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead', alt: '3D shapes', category: 'Abstract' },
]

// ── Curated video library ──

const CURATED_VIDEOS: CuratedVideo[] = [
  {
    name: 'Ocean Waves',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200',
    url: 'https://videos.pexels.com/video-files/1093662/1093662-uhd_2560_1440_30fps.mp4',
  },
  {
    name: 'City Timelapse',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200',
    url: 'https://videos.pexels.com/video-files/2795173/2795173-uhd_2560_1440_25fps.mp4',
  },
  {
    name: 'Forest Canopy',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
    url: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
  },
  {
    name: 'Mountain Clouds',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
    url: 'https://videos.pexels.com/video-files/1851190/1851190-uhd_2560_1440_24fps.mp4',
  },
  {
    name: 'Rain Drops',
    thumbnail: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=200',
    url: 'https://videos.pexels.com/video-files/2491284/2491284-uhd_2560_1440_24fps.mp4',
  },
  {
    name: 'Night Sky',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200',
    url: 'https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_25fps.mp4',
  },
  {
    name: 'Coffee Pour',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200',
    url: 'https://videos.pexels.com/video-files/2836220/2836220-hd_1920_1080_24fps.mp4',
  },
  {
    name: 'Abstract Flow',
    thumbnail: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=200',
    url: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4',
  },
  {
    name: 'Street Walk',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200',
    url: 'https://videos.pexels.com/video-files/1721294/1721294-uhd_2560_1440_24fps.mp4',
  },
  {
    name: 'Aerial Landscape',
    thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200',
    url: 'https://videos.pexels.com/video-files/3194277/3194277-uhd_2560_1440_30fps.mp4',
  },
]

// ── Effects library ──

const EFFECTS: EffectOption[] = [
  { id: 'overlay-gradient', name: 'Overlay Gradient', description: 'Tinted gradient overlay on image', icon: Blend },
  { id: 'fade-to-bg', name: 'Fade to Background', description: 'Image fades to page background color', icon: Layers },
  { id: 'ken-burns', name: 'Ken Burns', description: 'Slow zoom animation on image', icon: Sparkles },
  { id: 'zoom-hover', name: 'Zoom on Hover', description: 'Image scales up when mouse hovers', icon: ZoomIn },
  { id: 'parallax', name: 'Parallax', description: 'Image scrolls at different speed than content', icon: ArrowDownUp },
  { id: 'full-bleed', name: 'Full Bleed', description: 'Image fills entire section edge-to-edge', icon: Maximize },
]

// ── Helpers ──

function thumbUrl(base: string) {
  return `${base}?w=200&auto=format&q=60`
}

function fullUrl(base: string) {
  return `${base}?w=800&auto=format&q=80`
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
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('All')

  const filteredImages =
    activeCategory === 'All' ? CURATED_IMAGES : CURATED_IMAGES.filter((img) => img.category === activeCategory)

  const handleSelectImage = useCallback(
    (img: CuratedImage) => {
      onChange(fullUrl(img.url))
      setOpen(false)
    },
    [onChange],
  )

  const handleSelectVideo = useCallback(
    (video: CuratedVideo) => {
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

  // Determine available tabs
  const tabs: { id: TabId; label: string; icon: typeof Camera }[] = []
  if (mode === 'image' || mode === 'both') {
    tabs.push({ id: 'photos', label: 'Photos', icon: Camera })
  }
  if (mode === 'video' || mode === 'both') {
    tabs.push({ id: 'videos', label: 'Videos', icon: Film })
  }
  // Effects tab always available
  tabs.push({ id: 'effects', label: 'Effects', icon: Sparkles })

  // Ensure activeTab is valid for current mode
  const resolvedTab = tabs.some((t) => t.id === activeTab) ? activeTab : tabs[0]?.id ?? 'photos'

  // Check if the current value matches a curated image
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
              {/* Header with tabs */}
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
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-1 rounded hover:bg-hb-surface-hover transition-colors text-hb-text-muted hover:text-hb-text-primary"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 min-h-0">
                {/* ── Photos tab ── */}
                {resolvedTab === 'photos' && (
                  <>
                    {/* Category sidebar */}
                    <div className="w-[140px] shrink-0 border-r border-hb-border/30 py-2 px-2 overflow-y-auto">
                      {PHOTO_CATEGORIES.map((cat) => (
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
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Image grid */}
                    <div className="flex-1 overflow-y-auto p-3">
                      <div className="grid grid-cols-3 gap-2">
                        {filteredImages.map((img) => {
                          const isSelected = currentBase === img.url
                          return (
                            <button
                              key={img.url}
                              type="button"
                              onClick={() => handleSelectImage(img)}
                              className={cn(
                                'relative aspect-[4/3] rounded-md overflow-hidden border-2 transition-all',
                                'hover:scale-[1.03] hover:shadow-lg',
                                isSelected
                                  ? 'border-[hsl(348,83%,47%)] ring-1 ring-[hsl(348,83%,47%)]'
                                  : 'border-transparent hover:border-hb-accent/40',
                              )}
                              title={img.alt}
                            >
                              <img
                                src={thumbUrl(img.url)}
                                alt={img.alt}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                              />
                              {/* Label overlay */}
                              <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1">
                                <span className="text-[10px] text-white font-medium">{img.alt}</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* ── Videos tab ── */}
                {resolvedTab === 'videos' && (
                  <div className="flex-1 overflow-y-auto p-3">
                    <div className="grid grid-cols-3 gap-2">
                      {CURATED_VIDEOS.map((video) => {
                        const isSelected = value === video.url
                        return (
                          <button
                            key={video.url}
                            type="button"
                            onClick={() => handleSelectVideo(video)}
                            className={cn(
                              'relative aspect-[4/3] rounded-md overflow-hidden border-2 transition-all group',
                              'hover:scale-[1.03] hover:shadow-lg',
                              isSelected
                                ? 'border-[hsl(348,83%,47%)] ring-1 ring-[hsl(348,83%,47%)]'
                                : 'border-transparent hover:border-hb-accent/40',
                            )}
                            title={video.name}
                          >
                            <img
                              src={video.thumbnail}
                              alt={video.name}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
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
                            {/* Label overlay */}
                            <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1">
                              <span className="text-[10px] text-white font-medium">{video.name}</span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* ── Effects tab ── */}
                {resolvedTab === 'effects' && (
                  <div className="flex-1 overflow-y-auto p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {EFFECTS.map((effect) => {
                        const Icon = effect.icon
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
                            <Icon
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
                              {effect.name}
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
