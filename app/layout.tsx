import type { Metadata, Viewport } from 'next'
import { Alata, EB_Garamond, Source_Code_Pro } from 'next/font/google'
import ThemeScript from '@/components/theme/ThemeScript'
import { THEME_COLOR } from '@/lib/theme'
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

const title = 'Umair Nadeem - SQA Engineer'
const description =
  'Software Quality Assurance Engineer with over 3 years of experience in ensuring high-quality software solutions.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
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
      <body className="bg-bg text-fg antialiased">{children}</body>
    </html>
  )
}
