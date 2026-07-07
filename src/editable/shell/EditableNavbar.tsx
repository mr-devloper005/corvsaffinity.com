'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Nav rules (per brief):
  - No task-page links at all (no directory, library, profile, or task labels).
  - Center/left: About + Contact only.
  - Right: search icon → /search, then auth actions.
  - Mobile menu mirrors the same links.
*/

const staticLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 bg-[var(--editable-nav-bg)]/85 text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[84px] w-full max-w-[var(--editable-container)] items-center gap-8 px-6 sm:px-8 lg:px-12">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center bg-[var(--slot4-page-text)] transition group-hover:bg-[var(--slot4-accent)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="editable-display block max-w-[220px] truncate text-[1.125rem] font-medium leading-none tracking-[-0.01em]">
              {SITE_CONFIG.name}
            </span>
            <span className="mt-1 block max-w-[220px] truncate text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {staticLinks.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[0.85rem] font-medium tracking-[0.02em] transition duration-500 ${
                  active ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]'
                }`}
              >
                {item.label}
                {active ? (
                  <span className="absolute -bottom-1.5 left-0 h-[1px] w-full bg-[var(--slot4-accent)]" />
                ) : null}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-hairline)] text-[var(--slot4-page-text)] transition duration-500 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)]"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-[0.8rem] font-medium text-[var(--slot4-page-bg)] transition duration-500 hover:bg-[var(--slot4-accent)] sm:inline-flex"
              >
                Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 text-[0.8rem] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-[0.85rem] font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-[0.8rem] font-medium text-[var(--slot4-page-bg)] transition duration-500 hover:bg-[var(--slot4-accent)] sm:inline-flex"
              >
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-hairline)] text-[var(--slot4-page-text)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <div className="h-px bg-[var(--editable-hairline)]" />

      {open ? (
        <div className="border-t border-[var(--editable-hairline)] bg-[var(--editable-nav-bg)] px-6 py-6 lg:hidden">
          <div className="grid gap-1">
            {[
              { label: 'Home', href: '/' },
              ...staticLinks,
              ...(session
                ? [
                    { label: 'Submit', href: '/create' },
                  ]
                : [
                    { label: 'Sign in', href: '/login' },
                    { label: 'Get started', href: '/signup' },
                  ]),
            ].map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border-b border-[var(--editable-hairline)] py-4 text-[1.5rem] font-medium tracking-[-0.02em] ${
                    active ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  logout()
                }}
                className="py-4 text-left text-[1.5rem] font-medium tracking-[-0.02em] text-[var(--slot4-muted-text)]"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
