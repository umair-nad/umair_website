import { Mail } from 'lucide-react'
import { content } from '@/lib/content'
import CopyEmail from '@/components/hero/CopyEmail'
import ProfileLink from '@/components/ProfileLink'
import { BentoCard, CardLockup, IconChip } from '@/components/about/BentoCard'

// Contact teaser (DESIGN.md 11.2): the copy-email bar in an inset mono
// panel, plus the LinkedIn and Upwork links. Email is the only direct
// contact method; no phone (CLAUDE.md).
export default function ContactCard({ className = '' }: { className?: string }) {
  return (
    <BentoCard className={className}>
      <IconChip icon={Mail} />

      <div className="my-auto pt-6">
        <div className="flex justify-center rounded-inset border border-line bg-surface-2 p-1">
          <CopyEmail email={content.contact.email} />
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 px-1">
          {content.links.map((link) => (
            <li key={link.label}>
              <ProfileLink link={link} className="font-mono text-sm font-semibold text-fg hover:underline" />
            </li>
          ))}
        </ul>
      </div>

      <CardLockup title="Contact" />
    </BentoCard>
  )
}
