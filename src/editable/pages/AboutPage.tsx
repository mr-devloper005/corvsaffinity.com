import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { taskThemes } from '@/editable/theme/task-themes'

const PDF_LABEL = taskThemes.pdf.kicker

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pt-24 sm:pt-32 lg:pt-40`}>
          <EditableReveal index={0}>
            <p className="editable-label text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
          </EditableReveal>
          <EditableReveal index={1} className="mt-8">
            <h1 className="editable-display text-[3rem] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[4.5rem] lg:text-[6.25rem]">
              About {SITE_CONFIG.name}
            </h1>
          </EditableReveal>
          <EditableReveal index={2} className="mt-10 max-w-3xl">
            <p className="text-[1.25rem] leading-[1.55] text-[var(--slot4-muted-text)]">
              {pagesContent.about.description}
            </p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} py-24 sm:py-32 lg:py-40`}>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
            <EditableReveal index={0} className="lg:sticky lg:top-24 lg:self-start">
              <p className="editable-label text-[var(--slot4-accent)]">The story</p>
              <h2 className={`editable-display mt-6 ${dc.type.sectionTitle}`}>
                A quieter home for the references worth keeping.
              </h2>
            </EditableReveal>
            <div className="space-y-8">
              {pagesContent.about.paragraphs.map((paragraph, i) => (
                <EditableReveal key={i} index={i}>
                  <p className="text-[1.1rem] leading-[1.75] text-[var(--slot4-muted-text)]">{paragraph}</p>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--slot4-warm)]">
          <div className={`${dc.shell.section} py-24 sm:py-32`}>
            <EditableReveal index={0}>
              <p className="editable-label text-[var(--slot4-accent)]">What we hold on to</p>
              <h2 className={`editable-display mt-6 ${dc.type.sectionTitle}`}>Three quiet principles.</h2>
            </EditableReveal>
            <div className="mt-16 grid gap-0">
              {pagesContent.about.values.map((value, i) => (
                <EditableReveal key={value.title} index={i}>
                  <div className="grid gap-6 border-b border-[var(--editable-hairline)] py-10 first:border-t sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-16">
                    <span className="editable-display text-[2rem] font-medium leading-none tracking-[-0.02em] text-[var(--slot4-accent)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="editable-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.02em]">
                        {value.title}
                      </h3>
                      <p className="mt-4 text-[1rem] leading-[1.7] text-[var(--slot4-muted-text)]">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </EditableReveal>
              ))}
            </div>
            <EditableReveal index={pagesContent.about.values.length} className="mt-16">
              <Link href="/pdf" className={dc.button.primary}>
                Enter the {PDF_LABEL.toLowerCase()} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
