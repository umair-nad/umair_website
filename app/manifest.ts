import type { MetadataRoute } from 'next'
import { content } from '@/lib/content'

// Web app manifest (served as /manifest.webmanifest), replacing the favicon
// generator's site.webmanifest. Colors are the light theme's `bg` from
// DESIGN.md section 3: a manifest can't follow the viewer's theme, and light
// is the site default.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: content.seo.title,
    short_name: content.name,
    description: content.seo.description,
    start_url: '/',
    display: 'standalone',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
