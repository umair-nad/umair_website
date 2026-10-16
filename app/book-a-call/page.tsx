import type { Metadata } from 'next'
import { content } from '@/lib/content'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SkipLink from '@/components/SkipLink'
import CopyEmail from '@/components/hero/CopyEmail'
import ProfileLink from '@/components/ProfileLink'
import MoonAtmosphere from '@/components/book/MoonAtmosphere'
import CalEmbed from '@/components/book/CalEmbed'

// Book a Call (DESIGN.md 11.8), after the reference's /book-a-call page,
// measured 2026-10-16: a centered header over the moon atmosphere (eyebrow
// 176px from the top, then the h1, the copy-email row, and the profile
// links), then Umair's Cal.com calendar 40px below. Same navbar and footer
// as the home page; no ScrollSmoother here (like /credits), so the frame
// scrolls with the page natively. This route has its own CSP, which allows
// Cal.com's embed (next.config.js).

const { eyebrow, headline, seo } = content.bookACall
const [HEAD_PLAIN, HEAD_ACCENT] = headline

// Nested metadata objects replace the root's, so each is complete here.
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: content.bookACall.path },
  openGraph: { type: 'website', url: content.bookACall.path, siteName: content.name, title: seo.title, description: seo.description },
  twitter: { card: 'summary_large_image', title: seo.title, description: seo.description },
}

export default function BookACallPage() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" className="relative isolate">
        <MoonAtmosphere />

        <div className="mx-auto max-w-2xl px-4 pt-44 text-center">
          <p className="h-7 font-sans text-lg text-text">{eyebrow}</p>
          <h1 className="min-h-18 font-display text-4xl leading-tight text-fg lg:text-5xl">
            {HEAD_PLAIN} <em className="text-gradient-aurora pr-[0.06em] italic">{HEAD_ACCENT}</em>
          </h1>
          <div className="mt-2 mb-10 flex flex-col items-center gap-5">
            <CopyEmail email={content.contact.email} compact />
            <ul aria-label="Profiles" className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {content.links.map((link) => (
                <li key={link.label}>
                  <ProfileLink link={link} className="font-mono text-sm font-semibold text-fg hover:underline" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section aria-label="Booking calendar" className="mx-auto max-w-7xl px-4 pb-28 md:px-6 md:pb-40">
          <CalEmbed />
        </section>
      </main>
      <Footer />
    </>
  )
}
