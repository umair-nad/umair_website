// The site's absolute origin (DESIGN.md section 9), with no trailing slash.
// Every absolute URL (metadataBase, canonical, sitemap, robots, JSON-LD,
// Open Graph) is built from this one value; no URL is hard-coded anywhere
// else. NEXT_PUBLIC_* values are inlined at build time, so changing the
// variable on Vercel needs a redeploy. The localhost fallback is for
// development only.

const FALLBACK = 'http://localhost:3000'
const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()

export const SITE_URL = (fromEnv || FALLBACK).replace(/\/+$/, '')

if (!fromEnv && process.env.NODE_ENV === 'production') {
  console.warn(
    `[site-url] NEXT_PUBLIC_SITE_URL is not set; absolute URLs fall back to ${FALLBACK}. Set it for production builds.`
  )
}
