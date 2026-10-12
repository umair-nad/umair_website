'use client'

import { useRef, type ReactNode } from 'react'
import { BriefcaseBusiness, Check, GraduationCap, type LucideIcon } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { ALWAYS_QUERY, REDUCED_MOTION_QUERY } from '@/lib/motion-preferences'
import { content, type SkillGroupId } from '@/lib/content'
import { Chip } from '@/components/about/BentoCard'

registerGsap()

// Experience timeline (DESIGN.md 11.3), after the reference's "Growth &
// Experience" layout, measured 2026-10-12: a 2px spine down the left, a
// 40px circled glyph per entry whose 4px page-colored ring cuts the spine,
// and a 1fr / 2fr split per entry (meta left, evidence card and chips
// right) that stacks below md. Everything comes from lib/content.ts: the
// three roles, education, and after the timeline the testing types and
// practices, which no source ties to one role.

const [HEAD_BEFORE, HEAD_ACCENT, HEAD_AFTER] = content.experienceHeadline
const INTRO = content.bio.split(/(?<=\.)\s+/)[1] ?? '' // bio sentence 2, verbatim
// The two non-tool skill groups, shown after the timeline.
const GROUPS: SkillGroupId[] = ['testing-types', 'practices']
// Role tags that are tool names stay untranslated (auto-translate would
// turn "Postman" into a word for mail carrier); skill tags translate.
const TOOL_NAMES = new Set(content.skills.filter((g) => !GROUPS.includes(g.id)).flatMap((g) => g.items))

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// "May 2025" -> "2025-05" for <time dateTime>.
function isoMonth(date: string) {
  const [month, year] = date.split(' ')
  const i = MONTHS.indexOf(month)
  return i === -1 ? undefined : `${year}-${String(i + 1).padStart(2, '0')}`
}

// Ranges use a spaced hyphen (no em dashes, CLAUDE.md).
function DateRange({ start, end }: { start: string; end: string }) {
  return (
    <p>
      <time dateTime={isoMonth(start)}>{start}</time> -{' '}
      {end === 'Present' ? end : <time dateTime={isoMonth(end)}>{end}</time>}
    </p>
  )
}

function Entry({
  icon: Icon,
  title,
  org,
  meta,
  children,
}: {
  icon: LucideIcon
  title: string
  org: string
  meta: ReactNode
  children?: ReactNode
}) {
  return (
    <li className="relative pb-16 pl-13 last:pb-0 md:pb-20">
      <span
        data-reveal
        aria-hidden="true"
        className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-full border-4 border-bg bg-node text-node-icon"
      >
        <Icon size={16} strokeWidth={1.75} />
      </span>
      <div className="grid grid-cols-1 gap-y-5 md:grid-cols-[1fr_2fr] md:gap-x-8">
        <div data-reveal className="pt-1.5">
          {/* The organization is repeated for screen readers so the heading
              list tells the two "Senior QA Engineer" roles apart. */}
          <h3 className="font-sans text-lg leading-7 text-balance text-fg md:text-xl">
            {title}
            <span className="sr-only">, {org}</span>
          </h3>
          <div className="mt-2 flex flex-col gap-1 font-mono text-sm leading-6 text-text md:text-[15px]">
            <p translate="no" className="font-semibold text-fg">
              {org}
            </p>
            {meta}
          </div>
        </div>
        {children && <div>{children}</div>}
      </div>
    </li>
  )
}

export default function Experience() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ always: ALWAYS_QUERY, reduceMotion: REDUCED_MOTION_QUERY }, (ctx) => {
        const { reduceMotion } = ctx.conditions as { reduceMotion: boolean }
        const all = gsap.utils.toArray<HTMLElement>('[data-reveal]', rootRef.current)
        const spine = rootRef.current?.querySelector<HTMLElement>('[data-spine]')

        // Undo the pre-paint hiding (globals.css [data-reveal]).
        gsap.set(all, { autoAlpha: 1 })
        if (reduceMotion) return // static final state: full spine, all entries

        // The spine draws down as you read: its tip follows a line 70% down
        // the viewport (the reference's tip sits about 64% down). The
        // trigger is the list, not the spine: a spine scaled to 0 would
        // measure 0px tall and collapse start and end into one point.
        if (spine?.parentElement) {
          gsap.fromTo(
            spine,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: spine.parentElement, start: 'top 70%', end: 'bottom 70%', scrub: true },
            }
          )
        }

        // Heading, intro, then each entry's node, meta, card, and chips rise
        // in reading order as they scroll in, once. fromTo with explicit end
        // values (Hero pattern).
        const items = all.filter((el) => el !== spine)
        const from = { autoAlpha: 0, y: 16 }
        gsap.set(items, from)
        ScrollTrigger.batch(items, {
          start: 'top 85%',
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(batch, from, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08, overwrite: true }),
        })
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id="experience" aria-labelledby="experience-heading" className="px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-4xl">
        <h2 id="experience-heading" data-reveal className="max-w-3xl font-display text-4xl leading-tight text-balance text-fg lg:text-[56px]">
          {HEAD_BEFORE} <em className="text-gradient-accent pr-[0.06em] italic">{HEAD_ACCENT}</em> {HEAD_AFTER}
        </h2>
        {INTRO && (
          <p data-reveal className="mt-6 max-w-2xl font-mono text-base leading-relaxed text-text md:text-lg">
            {INTRO}
          </p>
        )}

        <ol className="relative mt-16 md:mt-20">
          {/* Spine: centered under the 40px nodes, fading out past the last
              one. Decorative; the list order carries the sequence. */}
          <span
            data-spine
            data-reveal
            aria-hidden="true"
            className="absolute top-5 bottom-0 left-4.75 w-0.5 origin-top rounded-full bg-[linear-gradient(to_bottom,var(--line-strong)_calc(100%-4rem),transparent)]"
          />

          {content.experience.map((role) => (
            <Entry
              key={`${role.company}-${role.start}`}
              icon={BriefcaseBusiness}
              title={role.title}
              org={role.company}
              meta={
                <>
                  <DateRange start={role.start} end={role.end} />
                  <p className="text-muted">{role.location}</p>
                </>
              }
            >
              <div
                data-reveal
                className="rounded-card border border-line-card bg-surface p-5 shadow-lg shadow-black/5 transition-[translate,border-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong md:p-6 dark:shadow-none"
              >
                {role.summary && <p className="mb-4 font-mono text-sm leading-6 text-muted">{role.summary}</p>}
                <ul className="space-y-3">
                  {role.highlights.map((item) => (
                    <li key={item} className="flex gap-3 font-mono text-sm leading-6 text-text">
                      <Check size={16} strokeWidth={2} aria-hidden="true" className="mt-1 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <ul data-reveal aria-label="Skills" className="mt-4 flex flex-wrap gap-2">
                {role.tags.map((tag) => (
                  <li key={tag} translate={TOOL_NAMES.has(tag) ? 'no' : undefined}>
                    <Chip>{tag}</Chip>
                  </li>
                ))}
              </ul>
            </Entry>
          ))}

          {content.education.map((edu) => (
            <Entry
              key={edu.school}
              icon={GraduationCap}
              title={edu.field ? `${edu.degree}, ${edu.field}` : edu.degree}
              org={edu.school}
              meta={edu.start && edu.end && <DateRange start={edu.start} end={edu.end} />}
            />
          ))}
        </ol>

        {/* Testing types and practices: across the whole career, so they
            sit after the timeline, on the entries' text column (full width
            below md, where the longest chip needs the room). */}
        <div className="mt-20 space-y-10 border-t border-line pt-12 md:mt-24 md:ml-13">
          {GROUPS.map((id) => {
            const group = content.skills.find((g) => g.id === id)
            if (!group) return null
            return (
              <div key={id} className="grid grid-cols-1 gap-y-4 md:grid-cols-[1fr_2fr] md:gap-x-8">
                <h3 data-reveal id={`exp-${id}`} className="font-sans text-lg leading-7 text-fg md:text-xl">
                  {group.label}
                </h3>
                <ul data-reveal aria-labelledby={`exp-${id}`} className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="max-w-full">
                      <Chip wrap>{item}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
