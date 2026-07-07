import Link from 'next/link'
import {
  ArrowUpRight,
  ChevronDown,
  Download,
  FileText,
  Search,
  UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const getCategory = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) =>
  stripHtml(
    post.summary ||
      asText(getContent(post).description) ||
      asText(getContent(post).excerpt) ||
      asText(getContent(post).body),
  )
const getFileSize = (post: SitePost) => asText(getContent(post).fileSize) || asText(getContent(post).size)

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-6 xl:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* Editorial header */}
        <header className="border-b border-[var(--editable-hairline)]">
          <div className={`${dc.shell.section} py-24 sm:py-32 lg:py-40`}>
            <EditableReveal index={0}>
              <p className="editable-label text-[var(--tk-accent)]">{theme.kicker}</p>
            </EditableReveal>
            <EditableReveal index={1} className="mt-8">
              <h1 className="editable-display text-[3rem] font-medium leading-[0.98] tracking-[-0.035em] text-[var(--tk-text)] sm:text-[4.5rem] lg:text-[6rem]">
                {voice?.headline || theme.note}
              </h1>
            </EditableReveal>
            <EditableReveal index={2} className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
              <p className="max-w-2xl text-[1.125rem] leading-[1.65] text-[var(--tk-muted)]">
                {voice?.description || theme.note}
              </p>
              {voice?.chips?.length ? (
                <div className="flex flex-wrap gap-2.5 lg:justify-end">
                  {voice.chips.map((chip) => (
                    <span key={chip} className={dc.badge.pill}>
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
            </EditableReveal>

            {/* Ad slot for the Reference Library archive header */}
            {task === 'pdf' ? (
              <EditableReveal index={3} className="mt-12">
                <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel className="mx-auto w-full" />
              </EditableReveal>
            ) : null}

            <EditableReveal
              index={4}
              className="mt-16 flex flex-col gap-6 border-t border-[var(--editable-hairline)] pt-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="editable-label text-[var(--tk-muted)]">
                <span className="text-[var(--tk-text)]">{posts.length}</span> {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
              </p>
              <form action={basePath} className="flex items-center gap-3">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-12 appearance-none rounded-full border border-[var(--editable-hairline)] bg-transparent pl-5 pr-10 text-[0.85rem] font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-text)]"
                    aria-label={voice?.filterLabel || 'Filter'}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                </div>
                <button className={dc.button.accent}>Apply</button>
              </form>
            </EditableReveal>
          </div>
        </header>

        <section className={`${dc.shell.section} py-20 sm:py-28 lg:py-32`}>
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index}>
                  <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl border-y border-[var(--editable-hairline)] px-8 py-20 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-6 text-[1.75rem] font-medium tracking-[-0.02em]">The shelf is quiet today</h2>
              <p className="mt-3 text-[0.95rem] leading-[1.65] text-[var(--tk-muted)]">
                Try another category, or come back when new entries have been catalogued.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-20 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link href={pageHref(basePath, category, page - 1)} className={dc.button.secondary}>
                  Previous
                </Link>
              ) : null}
              <span className="rounded-full border border-[var(--editable-hairline)] px-6 py-3.5 text-sm font-medium text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link href={pageHref(basePath, category, page + 1)} className={dc.button.secondary}>
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} index={index} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  return <GenericArchiveCard post={post} href={href} index={index} />
}

function CardOpen({ label }: { label: string }) {
  return (
    <span className="mt-6 inline-flex items-center gap-2 text-[0.85rem] font-medium text-[var(--tk-text)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

function GenericArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImages(post)[0]
  const category = getCategory(post, 'Entry')
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-text)]"
    >
      {image ? (
        <div className="aspect-[4/5] overflow-hidden bg-[var(--tk-raised)]">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.05]" />
        </div>
      ) : null}
      <div className="p-7">
        <p className="editable-label text-[var(--tk-accent)]">
          {String(index + 1).padStart(2, '0')} · {category}
        </p>
        <h2 className="editable-display mt-4 text-[1.35rem] font-medium leading-[1.2] tracking-[-0.02em]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-[0.95rem] leading-[1.6] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <CardOpen label="Read entry" />
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getCategory(post, 'Reference')
  const fileSize = getFileSize(post)
  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between overflow-hidden rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--tk-surface)] p-7 transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-text)]"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          {/* Document glyph — no photography, just typographic identity */}
          <div className="editable-display relative flex h-24 w-20 items-end justify-center rounded-[0.2em] border border-[var(--editable-hairline)] bg-[var(--tk-raised)] text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">
            <span className="mb-2">PDF</span>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--tk-accent)]" />
          </div>
          <FileText className="h-4 w-4 text-[var(--tk-muted)]" />
        </div>
        <p className="editable-label mt-7 text-[var(--tk-accent)]">
          №{String(index + 1).padStart(2, '0')} · {category}
        </p>
        <h2 className="editable-display mt-3 line-clamp-3 text-[1.2rem] font-medium leading-[1.2] tracking-[-0.015em]">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-2 text-[0.9rem] leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-[var(--editable-hairline)] pt-5">
        <span className="editable-label text-[var(--tk-muted)]">{fileSize || 'Free · PDF'}</span>
        <span className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-[var(--tk-text)]">
          Open <Download className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImages(post)[0] || '/placeholder.svg?height=900&width=1200'
  return (
    <Link href={href} className="group mb-6 block break-inside-avoid overflow-hidden rounded-[0.4em] transition duration-500 hover:-translate-y-1">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.05]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(36,27,25,0.75))]" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h2 className="editable-display line-clamp-2 text-[1.15rem] font-medium leading-[1.2] tracking-[-0.02em] text-white">
            {post.title}
          </h2>
        </div>
      </div>
    </Link>
  )
}

/*
  Profile archive card — kept in code so any residual routing that referenced
  the profile task doesn't blow up, but NEVER surfaced publicly. The public
  archive route for `profile` should not be linked from anywhere in the UI.
*/
function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  return (
    <Link
      href={href}
      className="group flex flex-col items-center rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--tk-surface)] p-7 text-center transition duration-500 hover:-translate-y-1"
    >
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--editable-hairline)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-5 text-[1.15rem] font-medium tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-3 line-clamp-2 text-[0.9rem] leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
