'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { taskThemes } from '@/editable/theme/task-themes'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'
const PDF_LABEL = taskThemes.pdf.kicker

const fieldClass =
  'w-full border-b border-[var(--editable-hairline)] bg-transparent py-3 text-[0.95rem] font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  // Public Create UI centers on submitting a Reference Library entry — the
  // profile task is intentionally excluded from the visible picker.
  const submittableTasks = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile'),
    [],
  )
  const pdfTask = submittableTasks.find((t) => t.key === 'pdf')
  const [task, setTask] = useState<TaskKey>((pdfTask?.key || submittableTasks[0]?.key || 'pdf') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className={`${dc.shell.section} grid min-h-[calc(100vh-12rem)] items-center gap-16 py-24 lg:grid-cols-[0.9fr_1.1fr]`}>
            <div className="flex h-full min-h-72 items-center justify-center rounded-[0.4em] bg-[var(--slot4-dark-bg)] p-16 text-[var(--slot4-dark-text)]">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div>
              <p className="editable-label text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</p>
              <h1 className="editable-display mt-8 text-[2.75rem] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[4rem]">
                {pagesContent.create.locked.title}
              </h1>
              <p className="mt-8 max-w-xl text-[1.05rem] leading-[1.65] text-[var(--slot4-muted-text)]">
                {pagesContent.create.locked.description}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/login" className={dc.button.primary}>
                  Sign in <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/signup" className={dc.button.secondary}>
                  Get started
                </Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} py-24 sm:py-32 lg:py-40`}>
          <EditableReveal index={0}>
            <p className="editable-label text-[var(--slot4-accent)]">{pagesContent.create.hero.badge}</p>
          </EditableReveal>
          <EditableReveal index={1} className="mt-8">
            <h1 className="editable-display text-[3rem] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[4.5rem] lg:text-[5.5rem]">
              {pagesContent.create.hero.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2} className="mt-8 max-w-2xl">
            <p className={dc.type.lead}>{pagesContent.create.hero.description}</p>
          </EditableReveal>

          <EditableReveal index={3} className="mt-16 grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="editable-label text-[var(--slot4-muted-text)]">Contribute to</p>
              <div className="mt-6 grid gap-3">
                {submittableTasks.map((item) => {
                  const active = item.key === task
                  const publicLabel = item.key === 'pdf' ? PDF_LABEL : item.label
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`flex items-start justify-between gap-4 rounded-[0.4em] border p-5 text-left transition duration-500 ${
                        active
                          ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]'
                          : 'border-[var(--editable-hairline)] bg-transparent hover:border-[var(--slot4-page-text)]'
                      }`}
                    >
                      <div>
                        <FileText className="h-5 w-5" />
                        <span className="editable-display mt-3 block text-[1.15rem] font-medium tracking-[-0.02em]">{publicLabel}</span>
                        <span className="mt-1.5 block text-[0.85rem] opacity-70">{item.description}</span>
                      </div>
                      {active ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : null}
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--slot4-surface-bg)] p-8 sm:p-12">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--editable-hairline)] pb-6">
                <div>
                  <p className="editable-label text-[var(--slot4-accent)]">{pagesContent.create.formTitle}</p>
                  <h2 className="editable-display mt-3 text-[1.5rem] font-medium tracking-[-0.02em]">Entry details</h2>
                </div>
                <span className="editable-label text-[var(--slot4-muted-text)]">{session.name}</span>
              </div>

              <div className="mt-8 grid gap-8">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Entry title" required />
                <div className="grid gap-8 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24 resize-y`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48 resize-y`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, notes, description" required />
              </div>

              {created ? (
                <div className="mt-8 flex items-start gap-3 rounded-[0.4em] border border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] p-5 text-[var(--slot4-page-text)]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
                  <div>
                    <p className="editable-label text-[var(--slot4-accent)]">{pagesContent.create.successTitle}</p>
                    <p className="mt-1 text-[0.9rem] font-medium">{created.title}</p>
                  </div>
                </div>
              ) : null}

              <button type="submit" className={`${dc.button.primary} mt-10 w-full`}>
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
