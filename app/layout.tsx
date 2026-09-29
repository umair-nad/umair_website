import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

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
    >
      <body className="bg-dark text-light">
        {children}
      </body>
    </html>
  )
} 