// Static security headers on every route (DESIGN.md 10.2). The CSP is
// decided separately (10.1). Strict-Transport-Security is not set here:
// Vercel sends it on every deployment (max-age=63072000, plus
// includeSubDomains and preload on *.vercel.app), and a header set here
// would replace that default rather than add to it.
const securityHeaders = [
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
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

module.exports = nextConfig
