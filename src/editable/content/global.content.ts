import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A quiet reference library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'A quiet reference library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Sign in', href: '/login' },
    },
  },
  footer: {
    tagline: 'A slow archive of documents worth keeping.',
    description:
      'A calm, editorial home for the documents, reports and references we want to come back to — carefully catalogued and free to read.',
    // Kept for the content contract test — the shell only renders the Reference
    // Library discovery column, but the structure remains as source of truth.
    columns: [
      {
        title: 'Discover',
        links: [{ label: 'Reference Library', href: '/pdf' }],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Account',
        links: [
          { label: 'Sign in', href: '/login' },
          { label: 'Get started', href: '/signup' },
        ],
      },
    ],
    bottomNote: 'Built for quiet, purposeful reading.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Added',
  },
} as const
