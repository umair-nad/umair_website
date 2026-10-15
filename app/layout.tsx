import type { Metadata, Viewport } from 'next'
import { Alata, EB_Garamond, Source_Code_Pro } from 'next/font/google'
import ThemeScript from '@/components/theme/ThemeScript'
import { THEME_COLOR } from '@/lib/theme'
import { content } from '@/lib/content'
import { SITE_URL } from '@/lib/site-url'
import './globals.css'

// The three faces from DESIGN.md section 4, all self-hosted by next/font.
// EB Garamond loads its real italic (the reference only synthesizes one).
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

// Alata ships a single weight.
const alata = Alata({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-alata',
  display: 'swap',
})

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
  display: 'swap',
})

// All metadata lives here plus the Next.js file conventions (DESIGN.md
// section 9): copy from content.seo, absolute URLs from SITE_URL.
const { title, description } = content.seo

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: content.name,
  authors: [{ name: content.name, url: SITE_URL }],
  creator: content.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: content.name,
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

// One theme-color per OS scheme; ThemeToggle re-points both at the active
// theme when the visitor's choice differs from the OS (lib/theme.ts).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: THEME_COLOR.light },
    { media: '(prefers-color-scheme: dark)', color: THEME_COLOR.dark },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning: ThemeScript sets the `dark` class and
    // color-scheme on <html> before React hydrates.
    <html
      lang="en"
      className={`${ebGaramond.variable} ${alata.variable} ${sourceCodePro.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      {/* suppressHydrationWarning: browser extensions and security tools
          stamp attributes on <body> before React hydrates (seen in dev on
          2026-10-12: __processed_<uuid>__="true"), which React reports as a
          hydration mismatch. This only ignores attribute differences on
          <body> itself; mismatches inside the page are still reported. */}
      <body className="bg-bg text-fg antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
