'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { taskThemes } from '@/editable/theme/task-themes'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Footer discovery: ONLY the Reference Library (pdf) is surfaced. No profiles,
  no other task labels. Nav stays clean; footer acts as the single discovery
  door into the public library.
*/

const pdfTask = SITE_CONFIG.tasks.find((t) => t.key === 'pdf' && t.enabled)
const pdfLabel = taskThemes.pdf.kicker
const pdfRoute = pdfTask?.route || '/pdf'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-24 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip */}
      <div className="border-b border-white/8">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-start gap-8 px-6 py-20 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-28">
          <div className="max-w-2xl">
            <p className="editable-label text-[var(--slot4-accent)]">Read, save, share</p>
            <h2 className="editable-display mt-5 text-[2.25rem] font-medium leading-[1.05] tracking-[-0.025em] text-white sm:text-[3rem] lg:text-[3.75rem]">
              A quieter place for the references worth keeping.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={pdfRoute}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-4 text-sm font-medium text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-page-text)]"
            >
              Browse the {pdfLabel.toLowerCase()}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-4 text-sm font-medium text-white transition duration-500 hover:border-white hover:bg-white/5"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-14 px-6 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center bg-white/10">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
            </span>
            <span className="editable-display text-[1.35rem] font-medium tracking-[-0.01em] text-white">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="mt-6 max-w-md text-[0.95rem] leading-[1.75] text-white/70">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>
        </div>

        <div>
          <h3 className="editable-label text-white/50">Discover</h3>
          <div className="mt-6 grid gap-3">
            <Link
              href={pdfRoute}
              className="group inline-flex items-center gap-2 text-[0.95rem] font-medium text-white transition hover:text-[var(--slot4-accent)]"
            >
              {pdfLabel}
              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="editable-label text-white/50">Resources</h3>
          <div className="mt-6 grid gap-3">
            <Link href="/about" className="text-[0.95rem] font-medium text-white/80 transition hover:text-white">About</Link>
            <Link href="/contact" className="text-[0.95rem] font-medium text-white/80 transition hover:text-white">Contact</Link>
            <Link href="/search" className="text-[0.95rem] font-medium text-white/80 transition hover:text-white">Search</Link>
          </div>
        </div>

        <div>
          <h3 className="editable-label text-white/50">Account</h3>
          <div className="mt-6 grid gap-3">
            {session ? (
              <>
                <Link href="/create" className="text-[0.95rem] font-medium text-white/80 transition hover:text-white">Submit a resource</Link>
                <button type="button" onClick={logout} className="text-left text-[0.95rem] font-medium text-white/80 transition hover:text-white">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[0.95rem] font-medium text-white/80 transition hover:text-white">Sign in</Link>
                <Link href="/signup" className="text-[0.95rem] font-medium text-white/80 transition hover:text-white">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-start justify-between gap-4 px-6 py-8 text-[0.8rem] font-medium text-white/50 sm:flex-row sm:items-center sm:px-8 lg:px-12">
          <span>© {year} {SITE_CONFIG.name}. All rights reserved.</span>
          <span className="editable-label text-white/40">A quiet archive</span>
        </div>
      </div>
    </footer>
  )
}
