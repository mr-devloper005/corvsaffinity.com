import Link from 'next/link'
import { ArrowUpRight, FileText } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

/*
  Card visual language — stillness reference.

  Bordered soft-cream surfaces, editorial hierarchy: kicker label → serif-scale
  title → small muted lead. Slow hover (700ms) with a subtle lift; images zoom
  gently inside their frames.

  Public UI never surfaces profile cards — the components below are used for
  documents / entries only.
*/

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=1200&width=1600'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Reference'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/*
  EditorialFeatureCard — hero-scale document card.
  Reference: stillness features huge display type over a warm image plane, with
  a pill CTA in the corner.
*/
export function EditorialFeatureCard({ post, href, label = 'Featured entry' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group relative block min-w-0 overflow-hidden rounded-[0.4em] ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] bg-[var(--slot4-dark-bg)] lg:min-h-[640px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover opacity-60 ${dc.motion.zoom}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,27,25,0.15),rgba(36,27,25,0.75))]" />
        <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between p-8 sm:p-12 lg:min-h-[640px] lg:p-16">
          <span className="editable-label text-[var(--slot4-accent-soft)]">{label}</span>
          <div>
            <p className="editable-label mb-6 text-white/60">{getEditableCategory(post)}</p>
            <h3 className="editable-display max-w-3xl text-[2.5rem] font-medium leading-[1.02] tracking-[-0.03em] text-white sm:text-[3.5rem] lg:text-[4.75rem]">
              {post.title}
            </h3>
            <p className="mt-6 max-w-xl text-[0.95rem] leading-[1.7] text-white/75">{getEditableExcerpt(post, 190)}</p>
            <span className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[var(--slot4-page-text)]">
              Read entry <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/*
  RailPostCard — used in horizontal rails. Portrait media frame with a large
  editorial title below.
*/
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
        />
        <span className={`absolute left-5 top-5 ${dc.badge.solid}`}>№ {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-6">
        <p className="editable-label text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-4 line-clamp-3 text-[1.5rem] font-medium leading-[1.15] tracking-[-0.02em] ${pal.panelText}`}>
          {post.title}
        </h3>
        <p className={`mt-4 line-clamp-2 text-[0.9rem] leading-[1.6] ${pal.mutedText}`}>{getEditableExcerpt(post, 120)}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-[var(--slot4-page-text)]">
          Read <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

/*
  CompactIndexCard — a numbered index row. Used in list-style sections.
*/
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group block min-w-0 border-b border-[var(--editable-hairline)] py-8 transition duration-500 hover:pl-2`}
    >
      <div className="flex items-start gap-6">
        <span className="editable-label mt-1 shrink-0 text-[var(--slot4-accent)]">
          {String(index + 1).padStart(2, '0')} / {getEditableCategory(post)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={`editable-display line-clamp-2 text-[1.5rem] font-medium leading-[1.2] tracking-[-0.02em] ${pal.panelText} sm:text-[1.75rem]`}>
            {post.title}
          </h3>
          <p className={`mt-3 line-clamp-2 text-[0.95rem] leading-[1.6] ${pal.mutedText}`}>{getEditableExcerpt(post, 140)}</p>
        </div>
        <ArrowUpRight className="mt-2 hidden h-5 w-5 shrink-0 text-[var(--slot4-page-text)] transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-accent)] sm:block" />
      </div>
    </Link>
  )
}

/*
  ArticleListCard — image + copy row. Used in editorial grids and archive pages.
*/
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-8 overflow-hidden ${dc.surface.card} p-6 ${dc.motion.lift} sm:grid-cols-[260px_minmax(0,1fr)] sm:p-8`}>
      <div className={`${dc.media.frame} aspect-[4/5] sm:aspect-auto sm:min-h-[240px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
        />
      </div>
      <div className="min-w-0 py-1">
        <p className="editable-label text-[var(--slot4-accent)]">
          Entry {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}
        </p>
        <h2 className={`editable-display mt-5 line-clamp-3 text-[1.75rem] font-medium leading-[1.15] tracking-[-0.02em] ${pal.panelText} sm:text-[2.25rem]`}>
          {post.title}
        </h2>
        <p className={`mt-5 line-clamp-3 text-[0.95rem] leading-[1.7] ${pal.mutedText}`}>{getEditableExcerpt(post, 190)}</p>
        <span className="mt-8 inline-flex items-center gap-2 text-[0.85rem] font-medium text-[var(--slot4-page-text)]">
          Open <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/*
  DocumentTileCard — small tile with a document glyph. Used in related-strips
  on the PDF detail page.
*/
export function DocumentTileCard({ post, href }: { post: SitePost; href: string }) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const fileSize = typeof content.fileSize === 'string' ? content.fileSize : ''
  const category = getEditableCategory(post)
  return (
    <Link href={href} className={`group flex flex-col justify-between overflow-hidden ${dc.surface.card} p-6 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-page-text)]`}>
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="editable-display flex h-16 w-14 items-end justify-center rounded-[0.2em] bg-[var(--slot4-warm)] text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
            <span className="mb-1.5">PDF</span>
          </div>
          <FileText className="h-4 w-4 text-[var(--slot4-muted-text)]" />
        </div>
        <p className="editable-label mt-6 text-[var(--slot4-accent)]">{category}</p>
        <h3 className="editable-display mt-3 line-clamp-3 text-[1.15rem] font-medium leading-[1.2] tracking-[-0.015em]">
          {post.title}
        </h3>
      </div>
      <div className="mt-6 flex items-center justify-between text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
        <span>{fileSize || 'Free'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--slot4-page-text)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-accent)]" />
      </div>
    </Link>
  )
}
