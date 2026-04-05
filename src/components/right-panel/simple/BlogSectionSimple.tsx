import { useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Switch } from '@/components/ui/switch'
import { RightAccordion } from '../RightAccordion'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps, setComponentEnabled } from '@/lib/componentHelpers'
import { LayoutGrid, List, Star, Type, Plus, Trash2 } from 'lucide-react'
import { SectionHeadingEditor } from './SectionHeadingEditor'
import { ImagePicker } from './ImagePicker'

const INPUT =
  'bg-hb-surface border border-hb-border rounded-md px-2.5 py-1.5 text-sm text-hb-text-primary w-full focus:border-hb-accent focus:outline-none transition-colors'

const BLOG_LAYOUTS = [
  { v: 'card-grid', label: 'Card Grid', Icon: LayoutGrid },
  { v: 'list-excerpts', label: 'List', Icon: List },
  { v: 'featured-grid', label: 'Featured', Icon: Star },
  { v: 'minimal', label: 'Minimal', Icon: Type },
] as const

const MIN_ARTICLES = 1
const MAX_ARTICLES = 12

export function BlogSectionSimple({ sectionId }: { sectionId: string }) {
  const config = useConfigStore((s) => s.config)
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const section = config.sections.find((s) => s.id === sectionId)

  if (!section) return null

  const currentVariant = section.variant || 'card-grid'

  const blogItems = section.components
    .filter((c) => c.type === 'blog-article')
    .sort((a, b) => a.order - b.order)

  const applyLayout = useCallback(
    (variant: string) => {
      setSectionConfig(sectionId, { variant })
    },
    [sectionId, setSectionConfig],
  )

  const handleToggle = useCallback(
    (componentId: string, checked: boolean) => {
      setSectionConfig(sectionId, {
        components: setComponentEnabled(section, componentId, checked),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  const updateProp = useCallback(
    (componentId: string, key: string, value: string) => {
      setSectionConfig(sectionId, {
        components: updateComponentProps(section, componentId, { [key]: value }),
      })
    },
    [sectionId, section, setSectionConfig],
  )

  const handleToggleOption = useCallback(
    (key: string, value: boolean) => {
      setSectionConfig(sectionId, {
        content: { ...(section.content ?? {}), [key]: value },
      })
    },
    [sectionId, section, setSectionConfig],
  )

  const addArticle = useCallback(() => {
    if (blogItems.length >= MAX_ARTICLES) return
    const existingIds = new Set(section.components.map((c) => c.id))
    let counter = blogItems.length + 1
    let id = `article-${counter}`
    while (existingIds.has(id)) {
      counter++
      id = `article-${counter}`
    }
    const newComponent = {
      id,
      type: 'blog-article',
      enabled: true,
      order: blogItems.length,
      props: {
        title: 'New Article',
        excerpt: 'A brief description of this article.',
        author: 'Author',
        date: new Date().toISOString().split('T')[0],
        tags: '',
        featuredImage: '',
      },
    }
    setSectionConfig(sectionId, {
      components: [...section.components, newComponent],
    })
  }, [sectionId, section, blogItems, setSectionConfig])

  const removeArticle = useCallback(
    (componentId: string) => {
      if (blogItems.length <= MIN_ARTICLES) return
      const updated = section.components
        .filter((c) => c.id !== componentId)
        .map((c, i) => (c.type === 'blog-article' ? { ...c, order: i } : c))
      setSectionConfig(sectionId, { components: updated })
    },
    [sectionId, section, blogItems, setSectionConfig],
  )

  return (
    <div className="divide-y divide-hb-border/30">
      <SectionHeadingEditor sectionId={sectionId} />

      {/* Layout variant */}
      <RightAccordion id={`blog-layout-${sectionId}`} label="Style">
        <div className="grid grid-cols-2 gap-2">
          {BLOG_LAYOUTS.map(({ v, label, Icon }) => (
            <button
              key={v}
              type="button"
              onClick={() => applyLayout(v)}
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 h-16 rounded-lg transition-all',
                currentVariant === v
                  ? 'border-2 border-hb-accent bg-hb-accent/5'
                  : 'border border-hb-border/40 hover:border-hb-accent/30',
              )}
            >
              <Icon size={18} className={currentVariant === v ? 'text-hb-accent' : 'text-hb-text-muted'} />
              <span className={cn('text-xs font-medium', currentVariant === v ? 'text-hb-accent' : 'text-hb-text-primary')}>{label}</span>
            </button>
          ))}
        </div>

        {/* Display toggles */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Show Dates</span>
            <Switch
              checked={section.content?.showDates !== false}
              onCheckedChange={(v) => handleToggleOption('showDates', v)}
              className="scale-[0.6]"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Show Tags</span>
            <Switch
              checked={section.content?.showTags !== false}
              onCheckedChange={(v) => handleToggleOption('showTags', v)}
              className="scale-[0.6]"
            />
          </div>
        </div>
      </RightAccordion>

      {/* Articles */}
      <RightAccordion id={`blog-articles-${sectionId}`} label="Articles">
        <div className="space-y-3">
          {blogItems.map((item, idx) => {
            const title = (item.props?.title as string) ?? ''
            const excerpt = (item.props?.excerpt as string) ?? ''
            const author = (item.props?.author as string) ?? ''
            const date = (item.props?.date as string) ?? ''
            const tags = (item.props?.tags as string) ?? ''
            const featuredImage = (item.props?.featuredImage as string) ?? ''

            return (
              <div
                key={item.id}
                className="rounded-lg border border-hb-border/40 bg-hb-surface/40 p-2.5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-hb-text-muted uppercase tracking-wide flex-1">
                    Article {idx + 1}
                  </span>
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(v) => handleToggle(item.id, v)}
                    className="scale-[0.6] shrink-0"
                  />
                  {blogItems.length > MIN_ARTICLES && (
                    <button
                      type="button"
                      onClick={() => removeArticle(item.id)}
                      className="text-hb-text-muted hover:text-red-400 transition-colors p-0.5"
                      title="Remove article"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <div className={cn(!item.enabled && 'opacity-25 pointer-events-none', 'space-y-2')}>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Title</span>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => updateProp(item.id, 'title', e.target.value)}
                      placeholder="Article title"
                      className={cn(INPUT, 'text-xs')}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Excerpt</span>
                    <input
                      type="text"
                      value={excerpt}
                      onChange={(e) => updateProp(item.id, 'excerpt', e.target.value)}
                      placeholder="Short description"
                      className={cn(INPUT, 'text-xs')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Author</span>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => updateProp(item.id, 'author', e.target.value)}
                        placeholder="Author name"
                        className={cn(INPUT, 'text-xs')}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Date</span>
                      <input
                        type="text"
                        value={date}
                        onChange={(e) => updateProp(item.id, 'date', e.target.value)}
                        placeholder="2026-01-15"
                        className={cn(INPUT, 'text-xs')}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Tags (comma-separated)</span>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => updateProp(item.id, 'tags', e.target.value)}
                      placeholder="recipe, healthy, quick"
                      className={cn(INPUT, 'text-xs')}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-hb-text-muted uppercase tracking-wide">Featured Image</span>
                    <ImagePicker
                      value={featuredImage}
                      onChange={(url) => updateProp(item.id, 'featuredImage', url)}
                      label="Choose Image"
                      mode="both"
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {blogItems.length < MAX_ARTICLES && (
            <button
              type="button"
              onClick={addArticle}
              className={cn(
                'flex items-center justify-center gap-1.5 w-full py-2 rounded-md text-xs font-medium',
                'border border-dashed border-hb-border text-hb-text-muted',
                'hover:border-hb-accent/50 hover:text-hb-accent transition-colors',
              )}
            >
              <Plus size={14} />
              Add Article
            </button>
          )}
        </div>
      </RightAccordion>
    </div>
  )
}
