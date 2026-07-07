import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

/*
  Public copy centers on the Reference Library (pdf). Profile voice exists but
  is only rendered on the profile detail page itself.
*/

export const taskPageVoices = {
  article: {
    eyebrow: 'Journal',
    headline: 'Field notes and long-reads from the desk.',
    description: 'A slower editorial thread — essays, guides and observations you can settle into.',
    filterLabel: 'Filter by topic',
    secondaryNote: 'Space, hierarchy, and fewer distractions.',
    chips: ['Long-form', 'Essays', 'Editorial'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Open calls, offers and time-limited notes.',
    description: 'Practical, action-oriented posts — quick to scan and easy to answer.',
    filterLabel: 'Filter category',
    secondaryNote: 'Prioritise urgency and short summaries.',
    chips: ['Fast scan', 'Offers', 'Notices'],
  },
  sbm: {
    eyebrow: 'Collections',
    headline: 'Curated links and resources, gathered on a shelf.',
    description: 'A hand-picked shelf of tools, references and things worth revisiting.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Grouped, calm, easy to browse.',
    chips: ['Curated', 'Resources', 'Shelves'],
  },
  profile: {
    // Only surfaced on the profile detail page — never anywhere in the public UI.
    eyebrow: 'Contributor',
    headline: 'A single record for the person behind the work.',
    description: 'A quiet identity page — role, links, and the resources they have added to the archive.',
    filterLabel: 'Filter',
    secondaryNote: 'Identity, credibility and links — no directory.',
    chips: ['Identity', 'Trust', 'Record'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'A slow archive of references, guides and reports.',
    description:
      'The Reference Library gathers reference material worth keeping — reports, guides, primers and long-form briefings — free to read, embed and take with you.',
    filterLabel: 'Filter the library',
    secondaryNote: 'Every entry stays open, downloadable and neatly catalogued.',
    chips: ['References', 'Guides', 'Open to read'],
  },
  listing: {
    eyebrow: 'Places',
    headline: 'Studios, shops and spaces worth a visit.',
    description: 'A short directory of places — with the details you need to decide before you go.',
    filterLabel: 'Filter place',
    secondaryNote: 'Comparison, location, direct paths.',
    chips: ['Directory', 'Places', 'Compare'],
  },
  image: {
    eyebrow: 'Portfolio',
    headline: 'A visual thread of standout frames.',
    description: 'Image-led posts arranged as a portfolio — carousel first, description second.',
    filterLabel: 'Filter visual',
    secondaryNote: 'Let the images breathe.',
    chips: ['Gallery', 'Visual', 'Portfolio'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
