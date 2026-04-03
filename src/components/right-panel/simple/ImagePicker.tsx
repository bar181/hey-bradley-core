import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import { Image, X } from 'lucide-react'

// ── Types ──

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

interface CuratedImage {
  url: string
  alt: string
  category: string
}

// ── Curated image library ──

const CATEGORIES = ['All', 'Food & Bakery', 'Nature', 'Business', 'Technology', 'People', 'Creative'] as const

type Category = (typeof CATEGORIES)[number]

const CURATED_IMAGES: CuratedImage[] = [
  // Food & Bakery
  { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff', alt: 'Bread', category: 'Food & Bakery' },
  { url: 'https://images.unsplash.com/photo-1486427944781-dbf45f4823a2', alt: 'Cookies', category: 'Food & Bakery' },
  { url: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a', alt: 'Pastries', category: 'Food & Bakery' },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', alt: 'Food plate', category: 'Food & Bakery' },
  // Nature
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', alt: 'Mountains', category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', alt: 'Forest', category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', alt: 'Beach', category: 'Nature' },
  { url: 'https://images.unsplash.com/photo-1518173946687-a1e23a47452c', alt: 'Sunset', category: 'Nature' },
  // Business
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c', alt: 'Office', category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', alt: 'Dashboard', category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', alt: 'Meeting', category: 'Business' },
  { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', alt: 'Laptop work', category: 'Business' },
  // Technology
  { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', alt: 'Data globe', category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475', alt: 'Circuit', category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', alt: 'Code screen', category: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625', alt: 'Building tech', category: 'Technology' },
  // People
  { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', alt: 'Team', category: 'People' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', alt: 'Portrait', category: 'People' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', alt: 'Woman professional', category: 'People' },
  { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a', alt: 'Man suit', category: 'People' },
  // Creative
  { url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f', alt: 'Art paint', category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b', alt: 'Colorful wall', category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8', alt: 'Neon lights', category: 'Creative' },
  { url: 'https://images.unsplash.com/photo-1493106819501-66d381c466f3', alt: 'Minimal desk', category: 'Creative' },
]

function thumbUrl(base: string) {
  return `${base}?w=200&auto=format&q=60`
}

function fullUrl(base: string) {
  return `${base}?w=800&auto=format&q=80`
}

// ── Component ──

export function ImagePicker({ value, onChange, label = 'Choose a Photo' }: ImagePickerProps) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  const filteredImages =
    activeCategory === 'All' ? CURATED_IMAGES : CURATED_IMAGES.filter((img) => img.category === activeCategory)

  const handleSelect = useCallback(
    (img: CuratedImage) => {
      onChange(fullUrl(img.url))
      setOpen(false)
    },
    [onChange],
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
            src={value}
            alt="Selected"
            className="w-7 h-7 rounded object-cover shrink-0 border border-hb-border/30"
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
                'relative z-10 w-full max-w-[640px] max-h-[480px] rounded-lg border shadow-2xl overflow-hidden',
                'bg-hb-bg border-hb-border flex flex-col',
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-hb-border/40 shrink-0">
                <span className="text-sm font-semibold text-hb-text-primary">{label}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1 rounded hover:bg-hb-surface-hover transition-colors text-hb-text-muted hover:text-hb-text-primary"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-1 min-h-0">
                {/* Category sidebar */}
                <div className="w-[140px] shrink-0 border-r border-hb-border/30 py-2 px-2 overflow-y-auto">
                  {CATEGORIES.map((cat) => (
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
                          onClick={() => handleSelect(img)}
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
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
