import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Get started', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} grid min-h-[calc(100vh-12rem)] items-center gap-16 py-24 lg:grid-cols-[0.9fr_1fr] lg:py-32`}>
          <div className="rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--slot4-surface-bg)] p-8 sm:p-12">
            <h1 className={`editable-display ${dc.type.h4}`}>{pagesContent.auth.signup.formTitle}</h1>
            <div className="mt-6">
              <EditableLocalSignupForm />
            </div>
            <p className="mt-8 text-[0.9rem] text-[var(--slot4-muted-text)]">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-[var(--slot4-page-text)] underline underline-offset-4 hover:text-[var(--slot4-accent)]">
                {pagesContent.auth.signup.loginCta}
              </Link>
            </p>
          </div>
          <div>
            <p className="editable-label text-[var(--slot4-accent)]">{pagesContent.auth.signup.badge}</p>
            <h2 className="editable-display mt-8 text-[2.75rem] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[4rem] lg:text-[5rem]">
              {pagesContent.auth.signup.title}
            </h2>
            <p className="mt-8 max-w-lg text-[1.05rem] leading-[1.65] text-[var(--slot4-muted-text)]">
              {pagesContent.auth.signup.description}
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
