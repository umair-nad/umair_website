import { BriefcaseBusiness } from 'lucide-react'
import { content } from '@/lib/content'
import { BentoCard, CardLockup, Chip, IconChip } from '@/components/about/BentoCard'

const role = content.experience[0] // the role with end "Present"

// Current role (DESIGN.md 11.2): wide card. The first highlight is quoted
// verbatim as the focal line; the company line names the company's own
// location so it doesn't read as Umair's.
export default function RoleCard({ className = '' }: { className?: string }) {
  return (
    <BentoCard className={className}>
      <div className="flex items-start justify-between gap-4">
        <IconChip icon={BriefcaseBusiness} />
        <p className="pt-2.5 font-mono text-xs text-muted">
          {role.start} - {role.end}
        </p>
      </div>

      <p className="mt-6 max-w-[32ch] font-display text-2xl leading-snug text-balance text-fg md:text-[28px]">
        {role.highlights[0]}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Focus areas">
        {role.tags.map((tag) => (
          <li key={tag}>
            <Chip>{tag}</Chip>
          </li>
        ))}
      </ul>

      <CardLockup
        caption={
          <>
            <span translate="no">{role.company}</span> ({role.location})
          </>
        }
        title={role.title}
      />
    </BentoCard>
  )
}
