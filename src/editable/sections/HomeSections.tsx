import Link from 'next/link'
import { ArrowUpRight, FileText } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { postHref, EditorialFeatureCard, CompactIndexCard, DocumentTileCard } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { taskThemes } from '@/editable/theme/task-themes'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const PDF_LABEL = taskThemes.pdf.kicker // "Reference Library"
const container = dc.shell.section

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ============================== Hero =================================== */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = pool[0]
  const heroWords = pagesContent.home.hero.title || ['A quiet place', 'for the references', 'worth keeping.']

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      <div className={`${container} pt-16 sm:pt-24 lg:pt-32`}>
        <EditableReveal index={0}>
          <p className="editable-label text-[var(--slot4-accent)]">{pagesContent.home.hero.badge}</p>
        </EditableReveal>

        <EditableReveal index={1} className="mt-8">
          <h1 className="editable-display text-[3rem] font-medium leading-[0.98] tracking-[-0.035em] text-[var(--slot4-page-text)] sm:text-[5rem] lg:text-[7rem]">
            {heroWords.map((line, i) => (
              <span key={i} className="block">
                {i === heroWords.length - 1 ? (
                  <span>
                    {line}
                    <span className="ml-3 inline-block h-3 w-3 translate-y-[-0.4em] rounded-full bg-[var(--slot4-accent)] align-middle sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                  </span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
        </EditableReveal>

        <EditableReveal index={2} className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <p className="max-w-xl text-[1.125rem] leading-[1.65] text-[var(--slot4-muted-text)]">
            {pagesContent.home.hero.description}
          </p>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href={primaryRoute} className={dc.button.accent}>
              {pagesContent.home.hero.primaryCta.label}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href={pagesContent.home.hero.secondaryCta.href} className={dc.button.secondary}>
              {pagesContent.home.hero.secondaryCta.label}
            </Link>
          </div>
        </EditableReveal>
      </div>

      {/* Feature card — the newest entry, oversized */}
      {featured ? (
        <div className={`${container} mt-16 sm:mt-24 lg:mt-32`}>
          <EditableReveal index={0}>
            <EditorialFeatureCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} label={`Latest in the ${PDF_LABEL.toLowerCase()}`} />
          </EditableReveal>
        </div>
      ) : null}

      {/* Search / discover strip */}
      <div className={`${container} mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--editable-hairline)] pt-6`}>
        <form action="/search" className="flex w-full max-w-lg items-center gap-3 border-b border-[var(--editable-hairline)] pb-3 focus-within:border-[var(--slot4-page-text)]">
          <FileText className="h-4 w-4 text-[var(--slot4-muted-text)]" />
          <input
            name="q"
            placeholder={pagesContent.home.hero.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-[0.95rem] font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
          />
          <button className="editable-label text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Search</button>
        </form>
        <span className="editable-label text-[var(--slot4-muted-text)]">
          {SITE_CONFIG.name} · {PDF_LABEL}
        </span>
      </div>
    </section>
  )
}

/* ======================= What you'll find (chapters) ==================== */
export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  const chapters = [
    { n: '01', title: 'Reports & primers', copy: 'Long-form reference material worth returning to, again and again.' },
    { n: '02', title: 'Guides & manuals', copy: 'Step-by-step walkthroughs with the working files attached.' },
    { n: '03', title: 'Essays & briefs', copy: 'Shorter pieces that argue a point clearly, in one sitting.' },
    { n: '04', title: 'Open archives', copy: 'Public references rescued from broken links, mirrored for the long term.' },
  ]
  return (
    <section className={`${container} py-24 sm:py-32 lg:py-40`}>
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <EditableReveal index={0} className="lg:sticky lg:top-24">
          <p className="editable-label text-[var(--slot4-accent)]">The chapters</p>
          <h2 className={`editable-display mt-6 ${dc.type.sectionTitle}`}>
            What lives inside the {PDF_LABEL.toLowerCase()}.
          </h2>
          <p className="mt-6 max-w-md text-[1rem] leading-[1.7] text-[var(--slot4-muted-text)]">
            Every entry is catalogued into one of four quiet chapters. Nothing is behind a wall.
          </p>
          <Link href={primaryRoute} className={`${dc.button.primary} mt-10`}>
            Browse the {PDF_LABEL.toLowerCase()} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </EditableReveal>

        <div>
          {chapters.map((chapter, i) => (
            <EditableReveal key={chapter.n} index={i}>
              <div className="grid gap-6 border-b border-[var(--editable-hairline)] py-10 first:border-t sm:grid-cols-[80px_minmax(0,1fr)]">
                <span className="editable-display text-[2rem] font-medium leading-none tracking-[-0.02em] text-[var(--slot4-accent)]">
                  {chapter.n}
                </span>
                <div>
                  <h3 className="editable-display text-[1.5rem] font-medium leading-[1.2] tracking-[-0.02em] sm:text-[1.75rem]">
                    {chapter.title}
                  </h3>
                  <p className="mt-3 text-[1rem] leading-[1.65] text-[var(--slot4-muted-text)]">
                    {chapter.copy}
                  </p>
                </div>
              </div>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ========================= Index — recent entries ======================= */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const entries = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 6)
  if (!entries.length) return null
  return (
    <section className="bg-[var(--slot4-warm)]">
      <div className={`${container} py-24 sm:py-32 lg:py-40`}>
        <EditableReveal index={0} className="flex flex-col gap-6 border-b border-[var(--editable-hairline)] pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="editable-label text-[var(--slot4-accent)]">The index</p>
            <h2 className={`editable-display mt-5 ${dc.type.sectionTitle}`}>Recently added to the archive.</h2>
          </div>
          <Link href={primaryRoute} className={dc.button.ghost}>
            See the full index <ArrowUpRight className="h-4 w-4" />
          </Link>
        </EditableReveal>

        <div className="mt-4">
          {entries.map((post, i) => (
            <EditableReveal key={post.id || post.slug} index={i}>
              <CompactIndexCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================ Time collections ========================== */
const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'This week', title: 'Freshly catalogued' },
  browse: { eyebrow: 'This month', title: 'Reading the room' },
  index: { eyebrow: 'Evergreen', title: 'From the archive' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, sectionIndex) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More in the library' }
        const isWarm = sectionIndex % 2 === 1
        return (
          <section key={section.key} className={isWarm ? 'bg-[var(--slot4-warm)]' : 'bg-[var(--slot4-page-bg)]'}>
            <div className={`${container} py-24 sm:py-28 lg:py-32`}>
              <EditableReveal index={0} className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="editable-label text-[var(--slot4-accent)]">{copy.eyebrow}</p>
                  <h2 className={`editable-display mt-5 ${dc.type.sectionTitle}`}>{copy.title}</h2>
                </div>
                <Link href={section.href || primaryRoute} className={dc.button.ghost}>
                  See all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </EditableReveal>

              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i}>
                    <DocumentTileCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ============================== About strip ============================= */
export function EditableAboutStrip() {
  const points = pagesContent.home.intro.sidePoints
  return (
    <section className={`${container} py-24 sm:py-32 lg:py-40`}>
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <EditableReveal index={0}>
          <p className="editable-label text-[var(--slot4-accent)]">{pagesContent.home.intro.badge}</p>
          <h2 className={`editable-display mt-6 ${dc.type.sectionTitle}`}>
            {pagesContent.home.intro.title}
          </h2>
        </EditableReveal>
        <div className="space-y-8">
          {pagesContent.home.intro.paragraphs.map((paragraph, i) => (
            <EditableReveal key={i} index={i}>
              <p className="text-[1.05rem] leading-[1.75] text-[var(--slot4-muted-text)]">{paragraph}</p>
            </EditableReveal>
          ))}
          <EditableReveal index={pagesContent.home.intro.paragraphs.length}>
            <ul className="mt-6 grid gap-4 border-t border-[var(--editable-hairline)] pt-8 sm:grid-cols-2">
              {points.map((point, i) => (
                <li key={i} className="flex gap-3 text-[0.95rem] leading-[1.6] text-[var(--slot4-page-text)]">
                  <span className="editable-label mt-1 shrink-0 text-[var(--slot4-accent)]">{String(i + 1).padStart(2, '0')}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* =============================== CTA band =============================== */
export function EditableHomeCta() {
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className={`${container} flex flex-col items-start gap-10 py-24 sm:py-32 lg:flex-row lg:items-end lg:justify-between lg:py-40`}>
        <EditableReveal index={0} className="max-w-2xl">
          <p className="editable-label text-[var(--slot4-accent-soft)]">{pagesContent.home.cta.badge}</p>
          <h2 className="editable-display mt-6 text-[2.5rem] font-medium leading-[1.05] tracking-[-0.025em] text-white sm:text-[3.5rem] lg:text-[4.5rem]">
            {pagesContent.home.cta.title}
          </h2>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.65] text-white/70">
            {pagesContent.home.cta.description}
          </p>
        </EditableReveal>
        <EditableReveal index={1} className="flex flex-wrap gap-3">
          <Link href={pagesContent.home.cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-4 text-sm font-medium text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-page-text)]">
            {pagesContent.home.cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href={pagesContent.home.cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-4 text-sm font-medium text-white transition duration-500 hover:bg-white/5">
            {pagesContent.home.cta.secondaryCta.label}
          </Link>
        </EditableReveal>
      </div>
    </section>
  )
}
