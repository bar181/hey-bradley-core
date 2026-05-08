import type { Section } from '@/lib/schemas'

// P115 / A2 — Substack/Medium SOTA: 17px body / 1.7 line-height / mb-6 spacing
// max-w-[68ch] line-length / drop-cap on first paragraph (≥120 chars).
export function TextSingle({ section }: { section: Section }) {
  const comp = section.components.find((c) => c.id === 'content')
  const heading = (comp?.props?.heading as string) || 'About Us'
  const body =
    (comp?.props?.body as string) ||
    'Share your story here. This is a single-column text block perfect for long-form content, blog posts, or about pages. Write something meaningful that connects with your audience.'

  // Split body into paragraphs (preserve line breaks within prose)
  const paragraphs = body.split(/\n\n+|\n(?=\S)/).map((p) => p.trim()).filter(Boolean)
  const [firstPara, ...restParas] = paragraphs
  const useDropCap = firstPara && firstPara.length >= 120

  return (
    <section
      className="py-16 md:py-20 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-[68ch]">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">{heading}</h2>
        )}
        {firstPara && (
          <p
            className={
              useDropCap
                ? "text-[17px] md:text-lg leading-[1.7] opacity-90 mb-6 first-letter:float-left first-letter:text-6xl first-letter:font-bold first-letter:leading-none first-letter:mr-2 first-letter:mt-1"
                : 'text-[17px] md:text-lg leading-[1.7] opacity-90 mb-6'
            }
          >
            {firstPara}
          </p>
        )}
        {restParas.map((p, i) => (
          <p key={i} className="text-[17px] leading-[1.7] opacity-80 mb-6 last:mb-0">
            {p}
          </p>
        ))}
      </div>
    </section>
  )
}
