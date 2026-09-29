import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import Script from 'next/script'
import './globals.css'

// Must decide overlay visibility before first paint, so it runs via
// next/script's beforeInteractive strategy rather than a useEffect.
// Keep this literal 'preloader-shown' key in sync with
// components/Preloader.tsx's SESSION_KEY.
const PRELOADER_DECISION_SCRIPT = `(function () {
  try {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var shown = window.sessionStorage.getItem('preloader-shown');
    document.documentElement.setAttribute('data-preloader', (reduce || shown) ? 'skip' : 'show');
  } catch (e) {
    document.documentElement.setAttribute('data-preloader', 'skip');
  }
})();`

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const satoshi = localFont({
  src: [
    { path: './fonts/Satoshi-Variable.woff2', weight: '300 900', style: 'normal' },
    { path: './fonts/Satoshi-VariableItalic.woff2', weight: '300 900', style: 'italic' },
  ],
  variable: '--font-satoshi',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0C10',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${jetbrainsMono.variable} ${satoshi.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-fg">
        <Script id="preloader-decision" strategy="beforeInteractive">
          {PRELOADER_DECISION_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  )
} 