import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { content } from '@/lib/content'

// Credits (DESIGN.md 11.7): the notices the Skills & Tools logos' licenses
// require, moved here from the footer line (user decision 2026-10-16).
// Minimal and static, in the site's theme (the root layout's fonts, tokens,
// and theme script). Not indexed and left out of the sitemap; reached from
// the footer's "Credits" link.

const { title, description, intro, entries } = content.credits
const pageTitle = `${title} | ${content.name}`

// Nested metadata objects replace the root's, so each is complete here.
export const metadata: Metadata = {
  title: pageTitle,
  description,
  alternates: { canonical: '/credits' },
  robots: { index: false, follow: true },
  openGraph: { type: 'website', url: '/credits', siteName: content.name, title: pageTitle, description },
  twitter: { card: 'summary_large_image', title: pageTitle, description },
}

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const link = `underline decoration-fg/30 underline-offset-4 transition-[color,text-decoration-color] hover:text-fg hover:decoration-fg ${focusRing}`

export default function CreditsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
      <Link href="/" className={`inline-flex min-h-6 items-center gap-2 font-mono text-sm text-muted ${link}`}>
        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
        Back to the portfolio
      </Link>

      <h1 className="mt-12 font-display text-4xl leading-tight text-fg lg:text-[56px]">{title}</h1>
      <p className="mt-6 max-w-2xl font-mono text-base leading-relaxed text-text">{intro}</p>

      <ul className="mt-12 divide-y divide-line border-y border-line">
        {entries.map((entry) => (
          <li key={entry.mark} className="py-6">
            <h2 translate="no" className="font-sans text-lg leading-7 text-fg">
              {entry.mark}
            </h2>
            <p className="mt-2 font-mono text-sm leading-relaxed text-text">{entry.notice}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm text-muted">
              {entry.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={`inline-flex min-h-6 items-center ${link}`}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  )
}
