import Link from 'next/link'
import { content } from '@/lib/content'
import Logo from '@/components/brand/Logo'
import ProfileLink from '@/components/ProfileLink'
import ResumeButton from '@/components/ResumeButton'
import CurrentYear from '@/components/footer/CurrentYear'
import FooterSections from '@/components/footer/FooterSections'
import FooterWaveform from '@/components/footer/FooterWaveform'

// Footer (DESIGN.md 11.6), after the reference's footer, measured
// 2026-10-12: same width as the contact panel; the logo, one role sentence,
// and the resume button on the left; link columns under Alata uppercase
// micro-labels on the right; a hairline, then the copyright line with the
// Credits link, centered. Below md the extra bottom padding keeps the last
// line clear of the floating mobile nav's toggle at the end of the page.

// Footer link (measured: Source Code Pro 14px semibold, underlined, 60%
// ink; ours brightens to fg on hover).
const link =
  'inline-flex min-h-6 touch-manipulation items-center font-mono text-sm font-semibold text-muted underline decoration-fg/30 underline-offset-4 transition-[color,text-decoration-color] hover:text-fg hover:decoration-fg'
const label = 'mb-5 font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase'

// A phrase that never splits across lines.
const keep = (s: string) => <span className="whitespace-nowrap">{s}</span>

const [ROLE_A, ROLE_B] = content.footerRole.split(' | ')

export default function Footer() {
  return (
    <footer className="mx-auto max-w-360 px-4 pt-12 pb-28 sm:px-6 md:px-8 md:pb-10">
      <FooterWaveform />

      <div className="mt-10 flex flex-col gap-12 border-b border-line pb-12 md:flex-row md:justify-between md:gap-8">
        <div className="max-w-sm">
          <Logo className="h-10 w-auto text-fg" label={content.name} />
          {/* Each part stays whole, so narrow screens break at the separator. */}
          <p className="mt-4 font-sans text-sm leading-relaxed text-muted">
            {keep(ROLE_A)} | {keep(ROLE_B)}
          </p>
          <div className="mt-6">
            <ResumeButton />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:gap-x-24 md:pr-12">
          <nav aria-labelledby="footer-sections">
            <h2 id="footer-sections" className={label}>
              Sections
            </h2>
            <FooterSections linkClassName={link} />
          </nav>
          <div>
            <h2 id="footer-profiles" className={label}>
              Profiles
            </h2>
            <ul aria-labelledby="footer-profiles" className="space-y-4">
              {content.links.map((profile) => (
                <li key={profile.label}>
                  <ProfileLink link={profile} className={link} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* The logo credits live on /credits (user decision 2026-10-16); this
          line only links there, small and in muted ink. */}
      <div className="mt-8 flex flex-col items-center text-center">
        <p className="font-mono text-xs tracking-wide text-text">
          © <CurrentYear initial={new Date().getFullYear()} /> <span translate="no">{content.name}</span>. All rights
          reserved.
          {/* The line doesn't fit one row below sm: there Credits starts its
              own line, without the separator dot. */}
          <br className="sm:hidden" />
          <span aria-hidden="true" className="hidden text-muted sm:inline">
            {' · '}
          </span>
          <Link
            href="/credits"
            className="text-muted underline decoration-fg/30 underline-offset-4 transition-[color,text-decoration-color] hover:text-fg hover:decoration-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Credits
          </Link>
        </p>
      </div>
    </footer>
  )
}
