import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  One shared visual language — warm cream + burnt-orange (stillness reference).
  Only kicker/note copy varies per task. Public UI centers on the Reference
  Library (pdf); the profile kicker exists but is only surfaced on the profile
  detail page itself.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const REF_FONT = "'Manrope', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: REF_FONT,
  fontBody: REF_FONT,
  bg: '#ebe0d1',
  surface: '#ffffff',
  raised: '#edeceb',
  text: '#241b19',
  muted: '#616161',
  line: '#c0c0c099',
  accent: '#c64900',
  accentSoft: '#f5e6d8',
  onAccent: '#ffffff',
  glow: 'rgba(198,73,0,0.10)',
  radius: '0.4em',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Journal', note: 'Field notes, essays and long-reads from the desk.' },
  listing: { ...base, kicker: 'Places', note: 'Studios, shops and spaces worth a visit.' },
  classified: { ...base, kicker: 'Notice board', note: 'Timely offers and open calls, ready to act on.' },
  image: { ...base, kicker: 'Portfolio', note: 'A visual thread of standout frames.' },
  sbm: { ...base, kicker: 'Collections', note: 'Curated resources and links worth saving.' },
  // pdf → "Reference Library" (public label — all public surfaces use this).
  pdf: { ...base, kicker: 'Reference Library', note: 'A slow archive of references, guides and reports — free to read and take with you.' },
  // profile → "Contributor" (only rendered on the profile detail page).
  profile: { ...base, kicker: 'Contributor', note: 'A single record card for the people behind the archive.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.pdf
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
