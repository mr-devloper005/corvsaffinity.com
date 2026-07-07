import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Bookmark,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Link2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle, taskThemes } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'
import { DocumentTileCard } from '@/editable/cards/PostCards'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]
const PDF_LABEL = taskThemes.pdf.kicker
const PROFILE_LABEL = taskThemes.profile.kicker

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  // For profile pages, related items surface DOCUMENTS from the Reference
  // Library (never other profiles). For all other tasks, related items come
  // from the same task feed.
  const relatedTask: TaskKey = task === 'profile' ? 'pdf' : task
  const related = (await fetchTaskPosts(relatedTask, 8)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`,
  )

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'),
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) =>
  post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <GenericDetail post={post} related={related} task="listing" /> : null}
        {task === 'classified' ? <GenericDetail post={post} related={related} task="classified" /> : null}
        {task === 'image' ? <GenericDetail post={post} related={related} task="image" /> : null}
        {task === 'sbm' ? <GenericDetail post={post} related={related} task="sbm" /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ========================= Shared building blocks ======================= */

function BackLink({ task }: { task: TaskKey }) {
  // For profile detail, back link points to Home (never surface a profile
  // archive publicly). For all other tasks, back-link points to task route.
  if (task === 'profile') {
    return (
      <Link href="/" className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
        <ArrowLeft className="h-4 w-4" /> Back home
      </Link>
    )
  }
  const taskConfig = getTaskConfig(task)
  const label = task === 'pdf' ? PDF_LABEL : taskConfig?.label || 'entries'
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {label}
    </Link>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.05rem] leading-[1.8]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

/* =============================== Article ================================ */
function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-0 lg:py-40">
        <BackLink task="article" />
        <p className="editable-label mt-12 text-[var(--tk-accent)]">{categoryOf(post, 'Journal')}</p>
        <h1 className="editable-display mt-6 text-balance text-[2.5rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-[3.5rem] lg:text-[4.5rem]">
          {post.title}
        </h1>
        {leadText(post) ? <p className="mt-8 text-[1.25rem] leading-[1.55] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {images[0] ? (
          <img src={images[0]} alt="" className="mt-14 aspect-[16/10] w-full rounded-[0.4em] border border-[var(--editable-hairline)] object-cover" />
        ) : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ============================= Generic detail =========================== */
function GenericDetail({ post, related, task }: { post: SitePost; related: SitePost[]; task: TaskKey }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const price = getField(post, ['price', 'amount', 'budget'])
  const mapSrc = mapSrcFor(post)
  const theme = getTaskTheme(task)
  return (
    <section className={`${dc.shell.section} py-20 sm:py-28 lg:py-32`}>
      <BackLink task={task} />
      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="min-w-0">
          <p className="editable-label text-[var(--tk-accent)]">{theme.kicker}</p>
          <h1 className="editable-display mt-6 text-[2.5rem] font-medium leading-[1.03] tracking-[-0.03em] sm:text-[3.5rem]">
            {post.title}
          </h1>
          {leadText(post) ? <p className="mt-6 text-[1.15rem] leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
          {price ? (
            <p className="editable-display mt-8 text-[2.5rem] font-medium tracking-[-0.03em] text-[var(--tk-accent)]">{price}</p>
          ) : null}
          {images[0] ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {images.slice(0, 4).map((img, i) => (
                <img key={`${img}-${i}`} src={img} alt="" className="aspect-[4/3] rounded-[0.4em] border border-[var(--editable-hairline)] object-cover" />
              ))}
            </div>
          ) : null}
          <BodyContent post={post} />
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <ContactPanel address={address} phone={phone} email={email} website={website} />
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
        </aside>
      </div>
      <RelatedStrip task={task} related={related} />
    </section>
  )
}

function ContactPanel({ address, phone, email, website }: { address?: string; phone?: string; email?: string; website?: string }) {
  if (!address && !phone && !email && !website) return null
  return (
    <div className="rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--tk-surface)] p-7">
      <p className="editable-label text-[var(--tk-muted)]">Contact</p>
      <div className="mt-5 grid gap-4 text-[0.95rem]">
        {address ? (
          <a href="#" className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-[var(--tk-accent)]" />
            <span className="min-w-0 break-words">{address}</span>
          </a>
        ) : null}
        {phone ? (
          <a href={`tel:${phone}`} className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 text-[var(--tk-accent)]" />
            <span className="min-w-0 break-words">{phone}</span>
          </a>
        ) : null}
        {email ? (
          <a href={`mailto:${email}`} className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 text-[var(--tk-accent)]" />
            <span className="min-w-0 break-words">{email}</span>
          </a>
        ) : null}
        {website ? (
          <a href={website} target="_blank" rel="noreferrer" className="flex items-start gap-3">
            <Globe2 className="mt-0.5 h-4 w-4 text-[var(--tk-accent)]" />
            <span className="min-w-0 break-words">Website</span>
          </a>
        ) : null}
      </div>
    </div>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 border-b border-[var(--editable-hairline)] p-4 text-[0.85rem] font-medium">
        <MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

/* ============================================================
   V2 detail layout — "long-read canvas"

   A distinctly new shape shared by PDF + Profile:
   - Split hero canvas (giant artifact left · sticky index rail right)
   - Inverted dark metadata strip that reverses page contrast
   - Full-container actions row
   - Full-bleed preview / portrait (no sidebar)
   - Asymmetric body with anchored chapter markers
   - Inline modules ROW (three side-by-side panels — not a sticky column)
   - Repeated dark CTA callout
   - Ad row
   - Horizontal snap-rail of related entries (replaces the earlier grid)
   ============================================================ */

const detailAnchors = [
  { id: 'overview', label: 'Overview' },
  { id: 'preview', label: 'Preview' },
  { id: 'about', label: 'About' },
  { id: 'more', label: 'More' },
]

function DetailIndexRail({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="grid gap-0 border-l border-[var(--tk-accent)] pl-8">
      {items.map((item, i) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="group flex items-baseline justify-between gap-6 border-b border-[var(--editable-hairline)] py-4 text-[0.85rem] font-medium tracking-[0.02em] transition duration-500 hover:text-[var(--tk-accent)]"
        >
          <span className="flex items-baseline gap-4">
            <span className="editable-label text-[var(--tk-accent)]">{String(i + 1).padStart(2, '0')}</span>
            <span>{item.label}</span>
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 -rotate-45 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
        </a>
      ))}
    </nav>
  )
}

function DetailMetaBar({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className={`${dc.shell.section} grid gap-8 py-8 sm:py-10 md:grid-cols-3 lg:grid-cols-5`}>
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-2">
            <span className="editable-label text-white/50">{item.label}</span>
            <span className="editable-display text-[1.35rem] font-medium leading-none tracking-[-0.02em] text-white">
              {item.value || '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DetailModuleCard({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow: string
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--tk-surface)] p-7">
      <div>
        <p className="editable-label text-[var(--tk-accent)]">{eyebrow}</p>
        {title ? (
          <h3 className="editable-display mt-3 text-[1.25rem] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--tk-text)]">
            {title}
          </h3>
        ) : null}
      </div>
      <div className="mt-6 flex-1">{children}</div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  )
}

function DetailRelatedRail({
  eyebrow,
  title,
  seeAllHref,
  items,
}: {
  eyebrow: string
  title: string
  seeAllHref: string
  items: SitePost[]
}) {
  if (!items.length) return null
  return (
    <section id="more" className="bg-[var(--tk-raised)]">
      <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-28`}>
        <EditableReveal index={0} className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="editable-label text-[var(--tk-accent)]">{eyebrow}</p>
            <h2 className="editable-display mt-5 text-[2rem] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[2.5rem]">
              {title}
            </h2>
          </div>
          <Link href={seeAllHref} className={dc.button.ghost}>
            See the full archive <ArrowUpRight className="h-4 w-4" />
          </Link>
        </EditableReveal>
        <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => (
            <EditableReveal key={item.id || item.slug} index={i} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
              <DocumentTileCard post={item} href={`/pdf/${item.slug}`} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================== PDF (Reference Library) — v2 canvas ================= */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const pages = getField(post, ['pages', 'pageCount'])
  const fileSize = getField(post, ['fileSize', 'size'])
  const updated = getField(post, ['updated', 'updatedAt', 'revised'])
  const category = categoryOf(post, 'Reference')
  const filename = getField(post, ['fileName', 'filename']) || `${post.slug || 'document'}.pdf`
  const contributor = getField(post, ['author', 'contributor', 'uploadedBy']) || SITE_CONFIG.name
  const sections = (() => {
    const content = getContent(post)
    if (Array.isArray(content.sections)) return content.sections.filter((s): s is string => typeof s === 'string').slice(0, 6)
    if (Array.isArray(content.toc)) return content.toc.filter((s): s is string => typeof s === 'string').slice(0, 6)
    return ['Introduction', 'Key concepts', 'Working examples', 'References']
  })()

  return (
    <>
      {/* ============ Section 01 — Hero canvas (split, no sidebar) ============ */}
      <section id="overview" className="border-b border-[var(--editable-hairline)] bg-[var(--tk-bg)]">
        <div className={`${dc.shell.section} pt-14 sm:pt-20`}>
          <BackLink task="pdf" />
        </div>
        <div className={`${dc.shell.section} grid gap-16 pb-20 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28 lg:pt-14`}>
          {/* Left — enormous typographic artifact (no photography) */}
          <EditableReveal index={0} className="order-2 lg:order-1">
            <div className="relative flex h-full min-h-[520px] items-end overflow-hidden rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--tk-raised)] p-10 sm:min-h-[620px]">
              <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
                <div className="editable-display absolute -left-6 -top-10 text-[18rem] leading-none tracking-[-0.06em] text-[var(--tk-text)]">
                  .pdf
                </div>
              </div>
              <div className="relative flex w-full flex-col gap-8">
                <div className="flex items-baseline justify-between">
                  <span className={dc.badge.accentPill}>{PDF_LABEL}</span>
                  <span className="editable-label text-[var(--tk-muted)]">{category}</span>
                </div>
                <div>
                  <p className="editable-display mt-6 max-w-md break-words text-[1.75rem] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--tk-text)]">
                    {filename}
                  </p>
                </div>
              </div>
            </div>
          </EditableReveal>

          {/* Right — kicker + huge h1 + lead + index rail */}
          <div className="order-1 flex flex-col justify-between lg:order-2">
            <div>
              <EditableReveal index={0}>
                <p className="editable-label text-[var(--tk-accent)]">{PDF_LABEL} · Entry</p>
              </EditableReveal>
              <EditableReveal index={1} className="mt-6">
                <h1 className="editable-display text-[2.75rem] font-medium leading-[0.98] tracking-[-0.035em] text-[var(--tk-text)] sm:text-[3.75rem] lg:text-[4.75rem]">
                  {post.title}
                </h1>
              </EditableReveal>
              {leadText(post) ? (
                <EditableReveal index={2} className="mt-8">
                  <p className="max-w-xl text-[1.15rem] leading-[1.55] text-[var(--tk-muted)]">{leadText(post)}</p>
                </EditableReveal>
              ) : null}
            </div>
            <EditableReveal index={3} className="mt-12">
              <p className="editable-label mb-4 text-[var(--tk-muted)]">On this page</p>
              <DetailIndexRail items={detailAnchors} />
            </EditableReveal>
          </div>
        </div>
      </section>

      {/* ============ Section 02 — Inverted dark metadata strip ============ */}
      <DetailMetaBar
        items={[
        
          { label: 'Format', value: 'PDF' },
          { label: 'Access', value: 'Open · Free' },
          { label: 'Contributor', value: contributor },
        ]}
      />

      {/* ============ Section 03 — Actions row ============ */}
      {fileUrl ? (
        <section className={`${dc.shell.section} py-12`}>
          <EditableReveal index={0} className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              <a href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.primary}>
                Download <Download className="h-4 w-4" />
              </a>
              <a href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.secondary}>
                Open in new tab <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <span className="editable-label text-[var(--tk-muted)]">
              Free, no account · {filename}
            </span>
          </EditableReveal>
        </section>
      ) : null}

      {/* ============ Section 04 — Full-width preview ============ */}
      {fileUrl ? (
        <section id="preview" className="bg-[var(--tk-bg)]">
          <div className={`${dc.shell.section} pb-24 pt-8 sm:pb-32`}>
            <EditableReveal index={0} className="mb-8 flex items-baseline justify-between border-b border-[var(--editable-hairline)] pb-4">
              <span className="editable-label text-[var(--tk-accent)]">02 · Preview</span>
              <span className="editable-label text-[var(--tk-muted)]">{filename}</span>
            </EditableReveal>
            <EditableReveal index={1}>
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                title={post.title}
                className="h-[85vh] w-full rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--tk-raised)]"
              />
            </EditableReveal>
          </div>
        </section>
      ) : null}

      {/* ============ Section 05 — Asymmetric body (anchored) ============ */}
      <section id="about" className="bg-[var(--tk-raised)]">
        <div className={`${dc.shell.section} py-24 sm:py-32`}>
          <EditableReveal index={0} className="mb-16 flex items-baseline justify-between border-b border-[var(--editable-hairline)] pb-4">
            <span className="editable-label text-[var(--tk-accent)]">03 · About</span>
            <span className="editable-label text-[var(--tk-muted)]">Reading time varies</span>
          </EditableReveal>
          <div className="grid gap-16 lg:grid-cols-[0.28fr_0.72fr]">
            <EditableReveal index={0}>
              <h2 className="editable-display text-[2rem] font-medium leading-[1.1] tracking-[-0.025em] text-[var(--tk-text)] lg:text-[2.5rem]">
                Inside this reference
              </h2>
              {post.tags?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.slice(0, 6).map((tag) => (
                    <span key={tag} className={dc.badge.pill}>{tag}</span>
                  ))}
                </div>
              ) : null}
              <ul className="mt-10 space-y-3 border-t border-[var(--editable-hairline)] pt-6 text-[0.9rem] leading-[1.55] text-[var(--tk-text)]">
                {sections.map((section, i) => (
                  <li key={`${section}-${i}`} className="flex items-start gap-3">
                    <span className="editable-label mt-0.5 shrink-0 text-[var(--tk-accent)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{section}</span>
                  </li>
                ))}
              </ul>
            </EditableReveal>
            <EditableReveal index={1}>
              {leadText(post) ? (
                <blockquote className="editable-display border-l-2 border-[var(--tk-accent)] pl-8 text-[1.6rem] font-medium leading-[1.35] tracking-[-0.02em] text-[var(--tk-text)]">
                  {leadText(post)}
                </blockquote>
              ) : null}
              <BodyContent post={post} />
            </EditableReveal>
          </div>
        </div>
      </section>

      {/* ============ Section 06 — Inline modules row (3 columns) ============ */}
      <section className={`${dc.shell.section} py-20 sm:py-24`}>
        <EditableReveal index={0} className="mb-10">
          <p className="editable-label text-[var(--tk-accent)]">Reference dossier</p>
        </EditableReveal>
        <div className="grid gap-6 md:grid-cols-3">
          <EditableReveal index={0}>
            <DetailModuleCard
              eyebrow="Identity"
              title="Reference file"
              footer={
                fileUrl ? (
                  <a href={fileUrl} target="_blank" rel="noreferrer" className={`${dc.button.primary} w-full`}>
                    Download <Download className="h-4 w-4" />
                  </a>
                ) : null
              }
            >
              <div className="editable-display flex h-32 w-full items-end justify-center rounded-[0.2em] bg-[var(--tk-raised)] pb-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[2.5rem] leading-none tracking-[-0.03em] text-[var(--tk-text)]">.pdf</span>
                  <span className="editable-label text-[var(--tk-muted)]">Open format</span>
                </div>
              </div>
              <p className="editable-label mt-6 truncate text-[var(--tk-text)]">{filename}</p>
            </DetailModuleCard>
          </EditableReveal>

          <EditableReveal index={1}>
            <DetailModuleCard eyebrow="Cataloguing" title="At a glance">
              <dl className="grid gap-4 text-[0.9rem]">
                <FactRow label="Category" value={category} />
                <FactRow label="Contributor" value={contributor} />
                {updated ? <FactRow label="Updated" value={updated} /> : null}
              </dl>
            </DetailModuleCard>
          </EditableReveal>

          <EditableReveal index={2}>
            <DetailModuleCard eyebrow="Trust" title="Why this stays online">
              <ul className="grid gap-4 text-[0.9rem]">
                <TrustRow icon={ShieldCheck} label="Open access, no walls" />
                <TrustRow icon={CheckCircle2} label="Original file, unmodified" />
                <TrustRow icon={Sparkles} label={`Kept in the ${PDF_LABEL}`} />
              </ul>
            </DetailModuleCard>
          </EditableReveal>
        </div>
      </section>

      {/* ============ Section 07 — Repeated CTA (dark band) ============ */}
      {fileUrl ? (
        <section className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
          <div className={`${dc.shell.section} flex flex-col items-start gap-8 py-20 lg:flex-row lg:items-center lg:justify-between lg:py-24`}>
            <EditableReveal index={0}>
              <p className="editable-label text-[var(--slot4-accent-soft)]">Take it with you</p>
              <p className="editable-display mt-6 max-w-2xl text-[2rem] font-medium leading-[1.1] tracking-[-0.025em] text-white sm:text-[2.75rem]">
                Take the full file with you to read later.
              </p>
            </EditableReveal>
            <EditableReveal index={1}>
              <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-8 py-4 text-sm font-medium text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-page-text)]">
                Download file <Download className="h-4 w-4" />
              </a>
            </EditableReveal>
          </div>
        </section>
      ) : null}

      {/* ============ Section 08 — Article-bottom ad ============ */}
      <section className={`${dc.shell.section} py-12`}>
        <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
      </section>

      {/* ============ Section 09 — Related horizontal snap-rail ============ */}
      <DetailRelatedRail
        eyebrow="More from the archive"
        title={`Other entries in the ${PDF_LABEL.toLowerCase()}`}
        seeAllHref="/pdf"
        items={related}
      />
    </>
  )
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="editable-label text-[var(--tk-muted)]">{label}</dt>
      <dd className="text-right text-[0.9rem] font-medium text-[var(--tk-text)]">{value}</dd>
    </div>
  )
}

/* ================= Profile — v2 canvas (direct-URL-only) ================ */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'title'])
  const location = getField(post, ['location', 'address', 'city'])
  const website = getField(post, ['website', 'url', 'link'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone'])
  const org = getField(post, ['company', 'organization', 'organisation'])
  const links = (() => {
    const raw = getContent(post).links
    if (Array.isArray(raw)) return raw.filter((l): l is string => typeof l === 'string' && isUrl(l)).slice(0, 5)
    return [website].filter((l): l is string => Boolean(l))
  })()
  const mapSrc = mapSrcFor(post)
  const verified = Boolean(getContent(post).verified) || Boolean(getContent(post).isVerified)
  const firstName = post.title.split(' ')[0]
  const profileAnchors = [
    { id: 'overview', label: 'Overview' },
    { id: 'portrait', label: 'Portrait' },
    { id: 'about', label: `About ${firstName}` },
    { id: 'more', label: 'Their work' },
  ]

  return (
    <>
      {/* ============ Section 01 — Hero canvas (split, no sidebar) ============ */}
      <section id="overview" className="border-b border-[var(--editable-hairline)] bg-[var(--tk-bg)]">
        <div className={`${dc.shell.section} pt-14 sm:pt-20`}>
          <BackLink task="profile" />
        </div>
        <div className={`${dc.shell.section} grid gap-16 pb-20 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28 lg:pt-14`}>
          {/* Left — square portrait card (no round crop; editorial framing) */}
          <EditableReveal index={0} className="order-2 lg:order-1">
            <div className="relative flex h-full min-h-[520px] items-end overflow-hidden rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--tk-raised)] sm:min-h-[620px]">
              {avatar ? (
                <img src={avatar} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <UserRound className="h-32 w-32 text-[var(--tk-muted)]" />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(36,27,25,0.75))]" />
              <div className="relative flex w-full items-end justify-between p-8 sm:p-10">
                <div>
                  <span className={`${dc.badge.accentPill} !bg-white/95`}>{PROFILE_LABEL}</span>
                  {role ? (
                    <p className="editable-display mt-4 max-w-[280px] text-[1.1rem] font-medium leading-[1.25] tracking-[-0.015em] text-white">
                      {role}{org ? <span className="text-white/70"> · {org}</span> : null}
                    </p>
                  ) : null}
                </div>
                {verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-accent)] px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-white">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                ) : null}
              </div>
            </div>
          </EditableReveal>

          {/* Right — kicker + huge h1 + lead + index rail */}
          <div className="order-1 flex flex-col justify-between lg:order-2">
            <div>
              <EditableReveal index={0}>
                <p className="editable-label text-[var(--tk-accent)]">{PROFILE_LABEL} · Record</p>
              </EditableReveal>
              <EditableReveal index={1} className="mt-6">
                <h1 className="editable-display text-[2.75rem] font-medium leading-[0.98] tracking-[-0.035em] text-[var(--tk-text)] sm:text-[3.75rem] lg:text-[4.75rem]">
                  {post.title}
                </h1>
              </EditableReveal>
              {leadText(post) ? (
                <EditableReveal index={2} className="mt-8">
                  <p className="max-w-xl text-[1.15rem] leading-[1.55] text-[var(--tk-muted)]">{leadText(post)}</p>
                </EditableReveal>
              ) : null}
            </div>
            <EditableReveal index={3} className="mt-12">
              <p className="editable-label mb-4 text-[var(--tk-muted)]">On this page</p>
              <DetailIndexRail items={profileAnchors} />
            </EditableReveal>
          </div>
        </div>
      </section>

      {/* ============ Section 02 — Inverted dark metadata strip ============ */}
      <DetailMetaBar
        items={[
          { label: 'Location', value: location },
          { label: 'Links', value: String(links.length || 0) },
          { label: 'Status', value: verified ? 'Verified' : 'Contributor' },
        ]}
      />

      {/* ============ Section 03 — Actions row ============ */}
      {(email || website) ? (
        <section className={`${dc.shell.section} py-12`}>
          <EditableReveal index={0} className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              {email ? (
                <a href={`mailto:${email}`} className={dc.button.primary}>
                  Send a message <Mail className="h-4 w-4" />
                </a>
              ) : null}
              {website ? (
                <a href={website} target="_blank" rel="noreferrer" className={dc.button.secondary}>
                  Visit official site <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
            <span className="editable-label text-[var(--tk-muted)]">
              {links.length ? `${links.length} listed channel${links.length === 1 ? '' : 's'}` : 'Contactable record'}
            </span>
          </EditableReveal>
        </section>
      ) : null}

      {/* ============ Section 04 — Full-width portrait band (secondary) ============ */}
      {avatar ? (
        <section id="portrait" className="bg-[var(--tk-bg)]">
          <div className={`${dc.shell.section} pb-24 pt-8 sm:pb-32`}>
            <EditableReveal index={0} className="mb-8 flex items-baseline justify-between border-b border-[var(--editable-hairline)] pb-4">
              <span className="editable-label text-[var(--tk-accent)]">02 · Portrait</span>
              <span className="editable-label text-[var(--tk-muted)]">Composite frame</span>
            </EditableReveal>
            <EditableReveal index={1}>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--tk-raised)]">
                <img src={avatar} alt="" className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(36,27,25,0.55))]" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8 sm:p-12">
                  <div>
                    <p className="editable-label text-white/70">{PROFILE_LABEL}</p>
                    <p className="editable-display mt-3 text-[1.5rem] font-medium leading-[1.15] tracking-[-0.02em] text-white sm:text-[2rem]">
                      {post.title}
                    </p>
                  </div>
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      ) : null}

      {/* ============ Section 05 — Asymmetric body (anchored) ============ */}
      <section id="about" className="bg-[var(--tk-raised)]">
        <div className={`${dc.shell.section} py-24 sm:py-32`}>
          <EditableReveal index={0} className="mb-16 flex items-baseline justify-between border-b border-[var(--editable-hairline)] pb-4">
            <span className="editable-label text-[var(--tk-accent)]">03 · About {firstName}</span>
            <span className="editable-label text-[var(--tk-muted)]">A single record</span>
          </EditableReveal>
          <div className="grid gap-16 lg:grid-cols-[0.28fr_0.72fr]">
            <EditableReveal index={0}>
              <h2 className="editable-display text-[2rem] font-medium leading-[1.1] tracking-[-0.025em] text-[var(--tk-text)] lg:text-[2.5rem]">
                About {firstName}
              </h2>
              {post.tags?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.slice(0, 8).map((tag) => (
                    <span key={tag} className={dc.badge.pill}>{tag}</span>
                  ))}
                </div>
              ) : null}
              <ul className="mt-10 space-y-3 border-t border-[var(--editable-hairline)] pt-6 text-[0.9rem] leading-[1.55] text-[var(--tk-text)]">
                {location ? (
                  <li className="flex items-start gap-3">
                    <span className="editable-label mt-0.5 shrink-0 text-[var(--tk-accent)]">01</span>
                    <span>Based in {location}</span>
                  </li>
                ) : null}
                {org ? (
                  <li className="flex items-start gap-3">
                    <span className="editable-label mt-0.5 shrink-0 text-[var(--tk-accent)]">02</span>
                    <span>With {org}</span>
                  </li>
                ) : null}
                <li className="flex items-start gap-3">
                  <span className="editable-label mt-0.5 shrink-0 text-[var(--tk-accent)]">03</span>
                  <span>Publishes to the {PDF_LABEL}</span>
                </li>
              </ul>
            </EditableReveal>
            <EditableReveal index={1}>
              {leadText(post) ? (
                <blockquote className="editable-display border-l-2 border-[var(--tk-accent)] pl-8 text-[1.6rem] font-medium leading-[1.35] tracking-[-0.02em] text-[var(--tk-text)]">
                  {leadText(post)}
                </blockquote>
              ) : null}
              <BodyContent post={post} />
            </EditableReveal>
          </div>
        </div>
      </section>

      {/* ============ Section 06 — Inline modules row (contact / trust / map) ============ */}
      <section className={`${dc.shell.section} py-20 sm:py-24`}>
        <EditableReveal index={0} className="mb-10">
          <p className="editable-label text-[var(--tk-accent)]">Contributor dossier</p>
        </EditableReveal>
        <div className="grid gap-6 md:grid-cols-3">
          <EditableReveal index={0}>
            <DetailModuleCard
              eyebrow="Get in touch"
              title="Contact channels"
              footer={
                (email || website) ? (
                  <a
                    href={email ? `mailto:${email}` : website}
                    target={website && !email ? '_blank' : undefined}
                    rel={website && !email ? 'noreferrer' : undefined}
                    className={`${dc.button.primary} w-full`}
                  >
                    {email ? 'Send a message' : 'Visit official site'} <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null
              }
            >
              <div className="grid gap-1">
                {location ? <ContactRow icon={MapPin} label={location} href={mapSrc ? `#map` : undefined} /> : null}
                {phone ? <ContactRow icon={Phone} label={phone} href={`tel:${phone}`} /> : null}
                {email ? <ContactRow icon={Mail} label={email} href={`mailto:${email}`} /> : null}
                {website ? <ContactRow icon={Globe2} label={cleanDomain(website)} href={website} external /> : null}
                {links.filter((l) => l !== website).map((link) => (
                  <ContactRow key={link} icon={Link2} label={cleanDomain(link)} href={link} external />
                ))}
              </div>
            </DetailModuleCard>
          </EditableReveal>

          <EditableReveal index={1}>
            <DetailModuleCard eyebrow="Trust signals" title="Why this record is here">
              <ul className="grid gap-4 text-[0.9rem]">
                <TrustRow icon={ShieldCheck} label={verified ? 'Identity verified' : 'Independent contributor'} />
                <TrustRow icon={CheckCircle2} label="Reachable via listed channels" />
                <TrustRow icon={Sparkles} label={`Publishes to the ${PDF_LABEL}`} />
              </ul>
            </DetailModuleCard>
          </EditableReveal>

          <EditableReveal index={2}>
            <DetailModuleCard eyebrow="Location" title={location ? location : 'On the record'}>
              {mapSrc ? (
                <div id="map" className="overflow-hidden rounded-[0.2em] border border-[var(--editable-hairline)]">
                  <iframe src={mapSrc} title="Map" loading="lazy" className="h-56 w-full border-0" />
                </div>
              ) : (
                <p className="text-[0.9rem] leading-[1.55] text-[var(--tk-muted)]">
                  No physical address on file. Reach out through the contact channels for anything else.
                </p>
              )}
            </DetailModuleCard>
          </EditableReveal>
        </div>
      </section>

      {/* ============ Section 07 — Repeated CTA (dark band) ============ */}
      <section className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
        <div className={`${dc.shell.section} flex flex-col items-start gap-8 py-20 lg:flex-row lg:items-center lg:justify-between lg:py-24`}>
          <EditableReveal index={0}>
            <p className="editable-label text-[var(--slot4-accent-soft)]">Reach out</p>
            <p className="editable-display mt-6 max-w-2xl text-[2rem] font-medium leading-[1.1] tracking-[-0.025em] text-white sm:text-[2.75rem]">
              Prefer a longer note? {firstName} reads every message.
            </p>
          </EditableReveal>
          <EditableReveal index={1}>
            {email ? (
              <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-8 py-4 text-sm font-medium text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-page-text)]">
                Send a message <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : (
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-8 py-4 text-sm font-medium text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-page-text)]">
                Contact the archive <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </EditableReveal>
        </div>
      </section>

      {/* ============ Section 08 — Sidebar ad (inline, full-width row) ============ */}
      <section className={`${dc.shell.section} py-12`}>
        <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="mx-auto w-full" />
      </section>

      {/* ============ Section 09 — Their entries — horizontal snap-rail ============ */}
      <DetailRelatedRail
        eyebrow="From this contributor"
        title={`Their entries in the ${PDF_LABEL.toLowerCase()}`}
        seeAllHref="/pdf"
        items={related}
      />
    </>
  )
}

function ContactRow({
  icon: Icon,
  label,
  href,
  external,
}: {
  icon: typeof Mail
  label: string
  href?: string
  external?: boolean
}) {
  const inner = (
    <span className="group flex items-center justify-between gap-3 border-b border-[var(--editable-hairline)] py-3.5 last:border-0">
      <span className="flex min-w-0 items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
        <span className="min-w-0 truncate text-[0.9rem] font-medium">{label}</span>
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--tk-muted)] transition group-hover:text-[var(--tk-text)]" />
    </span>
  )
  if (!href) return inner
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      {inner}
    </a>
  )
}

function TrustRow({ icon: Icon, label }: { icon: typeof ShieldCheck; label: string }) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
      <span className="leading-[1.5]">{label}</span>
    </li>
  )
}

function cleanDomain(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

/* =============================== Related strip ========================== */
function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className={`${dc.shell.section} mt-24 border-t border-[var(--editable-hairline)] pt-16`}>
      <div className="flex items-end justify-between gap-6">
        <h2 className="editable-display text-[2rem] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[2.5rem]">
          More entries
        </h2>
        <Link href={taskConfig?.route || '/'} className={dc.button.ghost}>
          View all <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((item, i) => (
          <EditableReveal key={item.id || item.slug} index={i}>
            <RelatedCard task={task} post={item} />
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <Link href={href} className="group block overflow-hidden rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1">
      <div className="aspect-[4/5] overflow-hidden bg-[var(--tk-raised)]">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.05]" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="h-8 w-8 text-[var(--tk-muted)]" />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="editable-display line-clamp-2 text-[1.05rem] font-medium leading-[1.2] tracking-[-0.015em]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-[0.85rem] leading-[1.55] text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}

// Silence unused-var lints in bookmark path
const _bookmarkUsed = Bookmark
void _bookmarkUsed
