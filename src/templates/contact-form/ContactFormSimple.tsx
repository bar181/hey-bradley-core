import { useState, type FormEvent } from 'react'
import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'

/* --------------------------------------------------------------------- */
/*  ContactFormSimple — single-column contact form (visual-only).         */
/*                                                                        */
/*  P75 / OC-7 / Agent A1 — contact-form section type.                    */
/*                                                                        */
/*  IMPORTANT: this is the OPEN-CORE form. There is NO real submission;   */
/*  the submit button logs to console + sets a transient confirmation     */
/*  banner. Real form submission requires a server and ships with the     */
/*  Tier-2 commercial runtime.                                            */
/*                                                                        */
/*  Renders any number of form-input components (fieldType = text /      */
/*  email / textarea) followed by a single form-button. Padding/radius/   */
/*  shadow are token-derived per ADR-091.                                 */
/* --------------------------------------------------------------------- */

interface FormInput {
  id: string
  fieldType: 'text' | 'email' | 'textarea'
  label: string
  placeholder: string
  required: boolean
}

interface FormButton {
  id: string
  label: string
}

function parseInputs(section: Section): FormInput[] {
  return section.components
    .filter((c) => c.type === 'form-input' && c.enabled)
    .sort((a, b) => a.order - b.order)
    .map((c) => {
      const ft = (c.props?.fieldType as string) || 'text'
      const fieldType: FormInput['fieldType'] =
        ft === 'email' || ft === 'textarea' ? ft : 'text'
      return {
        id: c.id,
        fieldType,
        label: (c.props?.label as string) || 'Field',
        placeholder: (c.props?.placeholder as string) || '',
        required: Boolean(c.props?.required ?? false),
      }
    })
}

function parseButton(section: Section): FormButton | null {
  const btn = section.components
    .filter((c) => c.type === 'form-button' && c.enabled)
    .sort((a, b) => a.order - b.order)[0]
  if (!btn) return null
  return {
    id: btn.id,
    label: (btn.props?.label as string) || 'Send message',
  }
}

export function ContactFormSimple({ section }: { section: Section }) {
  const [submitted, setSubmitted] = useState(false)
  const inputs = parseInputs(section)
  const button = parseButton(section)
  const accent = section.style.color
    ? `color-mix(in srgb, ${section.style.color} 60%, transparent)`
    : '#6366f1'
  const fieldBorder = section.style.color
    ? `color-mix(in srgb, ${section.style.color} 22%, transparent)`
    : 'rgba(99,102,241,0.22)'

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Visual-only — open-core has no server. Real submission is Tier-2.
    // eslint-disable-next-line no-console
    console.log('[contact-form] saved (demo) — no real submission in open-core')
    setSubmitted(true)
    window.setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{
        background: section.style.background,
        color: section.style.color,
        fontFamily: 'var(--theme-font)',
      }}
    >
      <div className="mx-auto max-w-xl">
        {getStr(section, 'heading') && (
          <div className="text-center mb-8">
            <div
              className="w-10 h-1 rounded-full mx-auto mb-4"
              style={{ background: accent }}
            />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {getStr(section, 'heading')}
            </h2>
            {getStr(section, 'subheading') && (
              <p className="text-lg mt-3 opacity-70">
                {getStr(section, 'subheading')}
              </p>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          aria-label="Contact form"
          className="rounded-2xl shadow-md p-6 md:p-8 space-y-4 transition-all duration-300 hover:shadow-lg"
          style={{
            background: section.style.background,
            border: `1px solid ${fieldBorder}`,
          }}
        >
          {inputs.map((field) => {
            const fieldId = `cf-${section.id}-${field.id}`
            const isTextarea = field.fieldType === 'textarea'
            return (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={fieldId}
                  className="text-sm font-medium opacity-80"
                >
                  {field.label}
                  {field.required && (
                    <span aria-hidden className="ml-0.5 opacity-70">
                      *
                    </span>
                  )}
                </label>
                {isTextarea ? (
                  <textarea
                    id={fieldId}
                    name={field.id}
                    placeholder={field.placeholder}
                    required={field.required}
                    aria-required={field.required}
                    rows={4}
                    className="rounded-lg px-3 py-2 text-sm bg-transparent transition-colors focus:outline-none focus:ring-2"
                    style={{
                      border: `1px solid ${fieldBorder}`,
                      color: section.style.color,
                    }}
                  />
                ) : (
                  <input
                    id={fieldId}
                    name={field.id}
                    type={field.fieldType}
                    placeholder={field.placeholder}
                    required={field.required}
                    aria-required={field.required}
                    className="rounded-lg px-3 py-2 text-sm bg-transparent transition-colors focus:outline-none focus:ring-2"
                    style={{
                      border: `1px solid ${fieldBorder}`,
                      color: section.style.color,
                    }}
                  />
                )}
              </div>
            )
          })}

          {button && (
            <button
              type="submit"
              className="inline-flex items-center justify-center w-full mt-2 px-6 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: accent, color: section.style.background }}
            >
              {button.label}
            </button>
          )}

          {submitted && (
            <p
              role="status"
              aria-live="polite"
              className="text-center text-sm opacity-80 pt-2"
            >
              Thanks — message logged (demo). Real submission ships with Tier-2.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
