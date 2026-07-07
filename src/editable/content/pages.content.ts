import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A quiet reference library',
      description:
        'A slow, editorial archive of references, guides and reports — free to read, embed and download.',
      openGraphTitle: 'A quiet reference library',
      openGraphDescription:
        'References, guides and reports worth keeping — carefully catalogued and free to read.',
      keywords: ['reference library', 'archive', 'guides', 'downloads', 'resources'],
    },
    hero: {
      badge: 'The reference library',
      title: ['A quiet place', 'for the references', 'worth keeping.'],
      description:
        'Reports, guides and reference material — carefully catalogued, calmly presented, and free to read or download.',
      primaryCta: { label: 'Enter the library', href: '/pdf' },
      secondaryCta: { label: 'How it works', href: '/about' },
      searchPlaceholder: 'Search references, guides and reports',
      focusLabel: 'What we archive',
      featureCardBadge: 'Fresh in the archive',
      featureCardTitle: 'Recent entries shape the front page.',
      featureCardDescription:
        'The newest entries in the library set the tone of the home page each time you land here.',
    },
    intro: {
      badge: 'The library',
      title: 'Built for slow, purposeful reading — not for endless scrolling.',
      paragraphs: [
        'The Reference Library is a single, quiet destination for reference material worth returning to: reports, primers, long-form guides and briefing notes.',
        'Every entry is catalogued, previewable in-page, and free to take with you as the original file. Nothing is gated. Nothing is designed to rush you along.',
        'The archive grows slowly, on purpose. New entries appear only when there is something genuinely useful to add.',
      ],
      sideBadge: 'What to expect',
      sidePoints: [
        'A single archive surface — no side directories, no clutter.',
        'Full in-page preview and one-tap download on every entry.',
        'Editorial rhythm, generous whitespace, no dark patterns.',
        'Everything free to read, no accounts required.',
      ],
      primaryLink: { label: 'Enter the library', href: '/pdf' },
      secondaryLink: { label: 'Read the story', href: '/about' },
    },
    cta: {
      badge: 'Open archive',
      title: 'Read, save, share — the library is always open.',
      description:
        'Enter the Reference Library and browse the full catalogue, or send us something worth adding.',
      primaryCta: { label: 'Enter the library', href: '/pdf' },
      secondaryCta: { label: 'Suggest an entry', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest in the library',
      descriptionSuffix: 'The newest entries in the archive.',
    },
  },
  about: {
    badge: 'The story',
    title: 'A calmer, quieter place to read the references worth keeping.',
    description: `${slot4BrandConfig.siteName} is a small, editorial reference library — a single, unhurried surface for reports, guides and reference material we think is worth returning to.`,
    paragraphs: [
      'Nothing here shouts. The library grows slowly, one entry at a time, and every piece of writing is treated as a text first and a file second.',
      'You can read every entry in the browser, take the original file with you, or share the URL with anyone — no account, no wall, no tracking dashboards.',
    ],
    values: [
      {
        title: 'Read-first, always',
        description: 'Every entry opens fully in the browser with a clean preview and generous typography.',
      },
      {
        title: 'One quiet archive',
        description: 'Everything sits in a single reference library rather than being scattered across half a dozen surfaces.',
      },
      {
        title: 'Open and shareable',
        description: 'No account walls, no tracking dashboards — just references that are easy to link, cite and pass along.',
      },
    ],
  },
  contact: {
    eyebrow: `Talk to ${slot4BrandConfig.siteName}`,
    title: 'Have an entry to add, or something to correct?',
    description:
      'Tell us what you would like to see in the library — a reference to submit, a broken link, a citation that needs fixing. We reply personally.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search the library',
      description: 'Search the full reference library — references, guides and reports.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find the entry you are looking for.',
      description: 'Type a keyword, topic or title to browse the full reference library.',
      placeholder: 'Search by keyword, topic or title',
    },
    resultsTitle: 'Latest in the archive',
  },
  create: {
    metadata: {
      title: 'Submit a resource',
      description: 'Submit an entry to the reference library.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit an entry.',
      description:
        'The contributor workspace lets you add a new entry to the reference library — sign in to open it.',
    },
    hero: {
      badge: 'Contributor workspace',
      title: 'Add a new entry to the reference library.',
      description:
        'Upload the file, add a title, description and category. We will review and publish it into the archive.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit for review',
    successTitle: 'Entry submitted for review.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to the reference library.',
      badge: 'Contributor access',
      title: 'Welcome back to the archive.',
      description: 'Sign in to submit new entries and manage the ones you have added to the library.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'We could not find an account with those details.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account to contribute to the library.',
      badge: 'Contributor access',
      title: 'Join the archive as a contributor.',
      description: 'Create an account to submit references to the library.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More in the archive',
      fallbackTitle: 'Entry details',
    },
    listing: {
      relatedTitle: 'More entries',
      fallbackTitle: 'Entry details',
    },
    image: {
      relatedTitle: 'More frames',
      fallbackTitle: 'Frame details',
    },
    // Kept for internal reference — only rendered on the direct-URL contributor page.
    profile: {
      relatedTitle: 'From this contributor',
      fallbackDescription: 'Details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
