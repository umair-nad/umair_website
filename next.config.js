// Static security headers on every route (DESIGN.md 10.1 and 10.2).
// Strict-Transport-Security is not set here: Vercel sends it on every
// deployment (max-age=63072000, plus includeSubDomains and preload on
// *.vercel.app), and a header set here would replace that default rather
// than add to it.

// Static CSP (option B, user decision 2026-10-15). The page stays
// prerendered and CDN-cached, so there is no per-request nonce, and
// script-src needs 'unsafe-inline' for Next's inline flight-data scripts
// and the no-flash theme script. 'unsafe-eval' only in development (React
// dev tooling). Everything else is same-origin only:
// - img-src data: the cobe globe's world map is an embedded data: PNG.
// - style-src 'unsafe-inline': React style attributes and GSAP inline styles.
// - no blob:: the star burst uses its own main-thread confetti instance.
// Adding a form, login, or anything sensitive means switching to the nonce
// CSP in proxy.ts first (CLAUDE.md, Security). The Cal.com booking form on
// /book-a-call is not one: it is Cal.com's own page inside a frame, and
// this site never receives or handles its data (DESIGN.md 10.1).
const isDev = process.env.NODE_ENV === 'development'
const csp = ({ scriptSrc = [], frameSrc = [] } = {}) =>
  [
    "default-src 'self'",
    ["script-src 'self' 'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : []), ...scriptSrc].join(' '),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    ...(frameSrc.length ? [`frame-src ${frameSrc.join(' ')}`] : []),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ')

const contentSecurityPolicy = csp()

// /book-a-call only (user decision 2026-10-16): Cal.com's official embed
// script and the booking frame it creates, both from app.cal.com (tested:
// zero violations with exactly this). A CSP belongs to the document it was
// loaded with, so links into /book-a-call must be full page loads (a plain
// <a>, never next/link), or the frame would meet the previous page's CSP.
const bookACallPolicy = csp({ scriptSrc: ['https://app.cal.com'], frameSrc: ['https://app.cal.com'] })

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Features the site never uses. clipboard-write stays allowed: the
  // copy-email button uses navigator.clipboard.writeText.
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'serial=()',
      'hid=()',
      'midi=()',
      'display-capture=()',
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()',
      'browsing-topics=()',
    ].join(', '),
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Drops the X-Powered-By: Next.js header.
  poweredByHeader: false,
  // Next's default, stated so it can't be flipped on by accident (10.4).
  productionBrowserSourceMaps: false,
  // Next's default device sizes plus 384. The About portrait's `sizes`
  // includes 85vw for phones, which makes Next drop every width under
  // 0.85 x the smallest device size; without 384 its 312px desktop slot
  // downloaded the 640px file.
  images: { deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840] },
  // When two entries set the same header for a path, the later one wins,
  // so /book-a-call gets its own CSP and keeps every other header.
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      { source: '/book-a-call', headers: [{ key: 'Content-Security-Policy', value: bookACallPolicy }] },
    ]
  },
}

module.exports = nextConfig
