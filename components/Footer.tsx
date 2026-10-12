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
// micro-labels on the right; a hairline, then the copyright line and the
// logo credits, centered. Below md the extra bottom padding keeps the last
// line clear of the floating mobile nav's toggle at the end of the page.

// Footer link (measured: Source Code Pro 14px semibold, underlined, 60%
// ink; ours brightens to fg on hover).
const link =
  'inline-flex min-h-6 items-center font-mono text-sm font-semibold text-muted underline decoration-fg/30 underline-offset-4 transition-[color,text-decoration-color] hover:text-fg hover:decoration-fg'
const label = 'mb-5 font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase'

export default function Footer() {
  return (
    <footer className="mx-auto max-w-360 px-4 pt-12 pb-28 sm:px-6 md:px-8 md:pb-10">
      <FooterWaveform />

      <div className="mt-10 flex flex-col gap-12 border-b border-line pb-12 md:flex-row md:justify-between md:gap-8">
        <div className="max-w-sm">
          <Logo className="h-10 w-auto text-fg" label={content.name} />
          <p className="mt-4 font-sans text-sm leading-relaxed text-muted">{content.seo.description}</p>
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

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <p className="font-mono text-xs tracking-wide text-text">
          © <CurrentYear initial={new Date().getFullYear()} /> <span translate="no">{content.name}</span>. All rights
          reserved.
        </p>
        {/* License-required credits for the Skills & Tools logos (Simple
            Icons marks whose licenses require attribution; CLAUDE.md). */}
        <p className="max-w-3xl font-mono text-[11px] leading-relaxed text-muted">
          Tool logos via Simple Icons; all marks belong to their owners. Git logo by Jason Long, CC BY 3.0. Jenkins
          logo, CC BY-SA 3.0. Apache JMeter logo, Apache License 2.0.
        </p>
      </div>
    </footer>
  )
}
