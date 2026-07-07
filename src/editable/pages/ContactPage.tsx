'use client'

import { FileText, MessageSquare, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const lanes = [
  { icon: FileText, title: 'Suggest a reference', body: 'Send us a report, primer or guide that belongs in the archive.' },
  { icon: MessageSquare, title: 'Corrections & notes', body: 'Spotted a bad link, wrong citation, or missing metadata? Tell us.' },
  { icon: Sparkles, title: 'Editorial collaborations', body: 'For guest chapters, mirrored archives and partnerships.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pt-24 sm:pt-32 lg:pt-40`}>
          <EditableReveal index={0}>
            <p className="editable-label text-[var(--slot4-accent)]">{pagesContent.contact.eyebrow}</p>
          </EditableReveal>
          <EditableReveal index={1} className="mt-8">
            <h1 className="editable-display text-[3rem] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[4.5rem] lg:text-[5.5rem]">
              {pagesContent.contact.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2} className="mt-10 max-w-3xl">
            <p className="text-[1.15rem] leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} py-24 sm:py-32 lg:py-40`}>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-0">
              {lanes.map((lane, i) => (
                <EditableReveal key={lane.title} index={i}>
                  <div className="flex gap-6 border-b border-[var(--editable-hairline)] py-8 first:border-t">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <lane.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="editable-display text-[1.35rem] font-medium leading-[1.2] tracking-[-0.02em]">{lane.title}</h2>
                      <p className="mt-3 text-[0.95rem] leading-[1.65] text-[var(--slot4-muted-text)]">{lane.body}</p>
                    </div>
                  </div>
                </EditableReveal>
              ))}
             
            </div>

            <EditableReveal index={0}>
              <div className="rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--slot4-surface-bg)] p-8 sm:p-12">
                <h2 className={`editable-display ${dc.type.h4}`}>{pagesContent.contact.formTitle}</h2>
                <div className="mt-6">
                  <EditableContactLeadForm />
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
