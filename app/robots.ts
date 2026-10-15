import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'

// robots.txt (DESIGN.md section 9): allow everything, point at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
