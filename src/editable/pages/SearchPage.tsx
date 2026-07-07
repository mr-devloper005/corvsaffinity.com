import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'
import { taskThemes } from '@/editable/theme/task-themes'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]
const PDF_LABEL = taskThemes.pdf.kicker

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => (typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : '')
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  // Do NOT surface profile records in public search results.
  if (derivedTask === 'profile') return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [
    post.title,
    post.summary,
    content.description,
    content.body,
    content.excerpt,
    content.category,
    Array.isArray(post.tags) ? post.tags.join(' ') : '',
  ].some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'pdf'}`}/${post.slug}`
  const summary = summaryOf(post)
  const publicLabel = task === 'pdf' ? PDF_LABEL : SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Entry'

  return (
    <Link
      href={href}
      className="group flex flex-col border-b border-[var(--editable-hairline)] py-10 transition duration-500 hover:pl-2"
    >
      <p className="editable-label text-[var(--slot4-accent)]">
        {String(index + 1).padStart(2, '0')} · {publicLabel}
      </p>
      <h2 className="editable-display mt-4 line-clamp-2 text-[1.75rem] font-medium leading-[1.2] tracking-[-0.02em] sm:text-[2.25rem]">
        {post.title}
      </h2>
      {summary ? (
        <p className="mt-4 line-clamp-2 text-[0.95rem] leading-[1.65] text-[var(--slot4-muted-text)]">{stripHtml(summary)}</p>
      ) : null}
      <span className="mt-6 inline-flex items-center gap-2 text-[0.85rem] font-medium text-[var(--slot4-page-text)]">
        Open result <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.filter((item) => item.enabled && item.key !== 'profile').flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pt-24 sm:pt-32 lg:pt-40`}>
          <EditableReveal index={0}>
            <p className="editable-label text-[var(--slot4-accent)]">{pagesContent.search.hero.badge}</p>
          </EditableReveal>
          <EditableReveal index={1} className="mt-8">
            <h1 className="editable-display text-[3rem] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[4.5rem] lg:text-[6rem]">
              {pagesContent.search.hero.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2} className="mt-8 max-w-2xl">
            <p className={dc.type.lead}>{pagesContent.search.hero.description}</p>
          </EditableReveal>

          <EditableReveal index={3} className="mt-12">
            <form action="/search" className="flex flex-col gap-4 border-t border-[var(--editable-hairline)] pt-8 sm:flex-row sm:items-center">
              <input type="hidden" name="master" value="1" />
              <label className="flex flex-1 items-center gap-3 border-b border-[var(--editable-hairline)] pb-3 focus-within:border-[var(--slot4-page-text)]">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-[1.1rem] font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
              </label>
              <button type="submit" className={dc.button.primary}>
                Search
              </button>
            </form>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} py-16 sm:py-20`}>
          <div className="flex items-end justify-between gap-6 border-b border-[var(--editable-hairline)] pb-6">
            <div>
              <p className="editable-label text-[var(--slot4-accent)]">{results.length} results</p>
              <h2 className={`editable-display mt-4 ${dc.type.h3}`}>
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/pdf" className={dc.button.ghost}>
              Browse the {PDF_LABEL.toLowerCase()} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-4">
              {results.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index}>
                  <SearchResultCard post={post} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mt-12 border-y border-[var(--editable-hairline)] py-20 text-center">
              <p className="editable-display text-[1.75rem] font-medium tracking-[-0.02em]">No matching entries.</p>
              <p className="mt-3 text-[0.95rem] leading-[1.65] text-[var(--slot4-muted-text)]">
                Try another keyword, or browse the {PDF_LABEL.toLowerCase()}.
              </p>
            </div>
          )}

          <div className="mt-16">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
