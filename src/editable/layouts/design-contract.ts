import type { CSSProperties } from 'react'

/*
  Design contract — Reference: stillness.webflow.io

  Warm cream editorial with a burnt-orange accent. Manrope everywhere, pill
  buttons, generous section rhythm (padding-xxl 5rem / xxxl 10rem). Every
  downstream component consumes CSS vars declared below.
*/

export const editableRootStyle = {
  // Palette (stillness reference)
  '--slot4-page-bg': '#ebe0d1',            // warm cream
  '--slot4-page-text': '#241b19',          // deep warm ink
  '--slot4-panel-bg': '#edeceb',           // near-white cream
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#616161',
  '--slot4-soft-muted-text': '#888888',
  '--slot4-accent': '#c64900',             // burnt orange
  '--slot4-accent-fill': '#c64900',
  '--slot4-accent-soft': '#f5e6d8',
  '--slot4-on-accent': '#ffffff',
  '--slot4-dark-bg': '#241b19',
  '--slot4-dark-text': '#eaded4',
  '--slot4-dark-muted': '#bcbcbc',
  '--slot4-media-bg': '#e5d8c5',
  '--slot4-cream': '#ebe0d1',
  '--slot4-warm': '#edeceb',
  '--slot4-warm-mid': '#c28755',
  '--slot4-lavender': '#f5e6d8',
  '--slot4-gray': '#edeceb',
  '--slot4-body-gradient': 'none',

  // Editable shell tokens
  '--editable-page-bg': '#ebe0d1',
  '--editable-page-text': '#241b19',
  '--editable-container': '1360px',
  '--editable-border': '#c0c0c099',
  '--editable-hairline': '#241b1926',
  '--editable-nav-bg': '#ebe0d1',
  '--editable-nav-text': '#241b19',
  '--editable-nav-active': '#c64900',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#c64900',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#241b19',
  '--editable-footer-text': '#eaded4',

  // Section rhythm (reference: 5rem / 10rem)
  '--editable-section-y-sm': '3.5rem',
  '--editable-section-y-md': '5rem',
  '--editable-section-y-lg': '7.5rem',
  '--editable-section-y-xl': '10rem',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  darkMuted: 'text-[var(--slot4-dark-muted)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  hairline: 'border-[var(--editable-hairline)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_1px_2px_rgba(36,27,25,0.06)]',
  shadowStrong: 'shadow-[0_24px_60px_-24px_rgba(36,27,25,0.28)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(36,27,25,0.00),rgba(36,27,25,0.60))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-12',
    sectionY: 'py-20 sm:py-24 lg:py-32',
    sectionYSm: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    // Uppercase tracked label — 0.05em+ tracking to match reference labels.
    eyebrow: 'text-[0.75rem] font-medium uppercase tracking-[0.18em] text-[var(--slot4-accent)]',
    // Hero display — 3.25/5/6.25rem across breakpoints (from reference h1 scale).
    heroTitle: 'text-[3.25rem] font-medium leading-[1.02] tracking-[-0.03em] sm:text-[5rem] lg:text-[6.25rem]',
    // Display XL for hero words / marquee
    displayXl: 'text-[3.5rem] font-medium leading-[0.95] tracking-[-0.035em] sm:text-[6rem] lg:text-[8.5rem]',
    sectionTitle: 'text-[2.45rem] font-medium leading-[1.08] tracking-[-0.025em] sm:text-[2.8rem] lg:text-[3.25rem]',
    h3: 'text-[2rem] font-medium leading-[1.15] tracking-[-0.02em] lg:text-[2.375rem]',
    h4: 'text-[1.5rem] font-medium leading-[1.2] tracking-[-0.015em] lg:text-[1.75rem]',
    lead: 'text-[1.125rem] leading-[1.6] text-[var(--slot4-muted-text)]',
    body: 'text-[1rem] leading-[1.7]',
    small: 'text-[0.876rem] leading-[1.55] text-[var(--slot4-muted-text)]',
    emphasis: 'italic text-[var(--slot4-page-text)]',
  },
  surface: {
    // Cards: soft cream panel + hairline border, subtle radius.
    card: `rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--slot4-surface-bg)]`,
    soft: `rounded-[0.4em] border border-[var(--editable-hairline)] bg-[var(--slot4-warm)]`,
    dark: `rounded-[0.4em] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]`,
    inset: `rounded-[0.4em] bg-[var(--slot4-panel-bg)]`,
  },
  button: {
    // Pill buttons (rounded-full — reference uses 100em radius on primary CTAs).
    primary: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-500 hover:bg-[var(--slot4-page-text)] active:scale-[0.98]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-[var(--slot4-page-text)] bg-transparent px-7 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)] active:scale-[0.98]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-page-bg)] transition duration-500 hover:bg-[var(--slot4-accent)] active:scale-[0.98]`,
    ghost: `inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-page-text)] underline decoration-transparent underline-offset-4 transition hover:decoration-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]`,
    pillDark: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-dark-text)] transition duration-500 hover:bg-[var(--slot4-accent)]`,
  },
  badge: {
    pill: 'inline-flex items-center gap-2 rounded-full border border-[var(--editable-hairline)] bg-transparent px-3.5 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]',
    accentPill: 'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3.5 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[var(--slot4-accent)]',
    solid: 'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-3.5 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[var(--slot4-page-bg)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[0.4em] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
    ratioWide: 'aspect-[16/10]',
  },
  motion: {
    lift: 'transition duration-700 hover:-translate-y-1',
    fade: 'transition duration-700 hover:opacity-85',
    zoom: 'transition duration-[1200ms] group-hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Full palette + fonts come from editableRootStyle + editable-global.css — never hardcode colors or fonts in JSX.',
  'Use dc.shell.section + dc.shell.sectionY for consistent rhythm; page structure stays in HomeSections.tsx.',
  'Pill buttons only (rounded-full). Uppercase tracked labels for eyebrows.',
  'Cards use hairline borders and soft cream backgrounds; no drop-shadow bounces.',
  'Wrap section headers and grid items in EditableReveal with index={i} for stagger.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
