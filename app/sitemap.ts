import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'
import { content } from '@/lib/content'

// sitemap.xml (DESIGN.md section 9): the home page and /book-a-call. Hash
// anchors are not separate URLs, and /credits is noindex, so it is left out
// (11.7). lastModified is the build time (the routes are static).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}${content.bookACall.path}`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
