import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'

// sitemap.xml (DESIGN.md section 9): the home page only. Hash anchors are
// not separate URLs, and /credits is noindex, so it is left out (11.7).
// lastModified is the build time (the route is static).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }]
}
