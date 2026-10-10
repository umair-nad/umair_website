'use client'

import { useRef } from 'react'
import { Calendar, MapPin, Building } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { REDUCED_MOTION_QUERY } from '@/lib/motion-preferences'

registerGsap()

const experiences = [
  {
    title: 'Senior QA Engineer',
    company: 'Adrem Technologies',
    location: 'Islamabad',
    period: 'November 2023 — Present',
    description: [
      'Conducted functional, regression, smoke, and usability testing for web and mobile applications to ensure defect-free releases',
      'Developed comprehensive test plans, test cases, and test scripts aligned with project requirements and deadlines',
      'Identified, documented, and tracked bugs using tools like Jira and Trello, collaborating with developers for timely resolution',
      'Performed API validations using Postman to ensure proper integration and data flow between services',
      'Worked closely with product managers, developers, and other stakeholders to clarify requirements and improve product quality',
    ],
    skills: ['Manual Testing', 'Jira', 'Trello', 'Postman', 'API Testing', 'Test Planning'],
  },
  {
    title: 'Senior QA Analyst',
    company: 'Workbox Pvt Ltd',
    location: 'Peshawar',
    period: 'August 2021 — October 2023',
    description: [
      'Led QA efforts, including standup and retrospective meetings, to ensure effective team communication and collaboration',
      'Prepared detailed bug reports using tools like Jira, identifying and documenting UI/UX and functional issues',
      'Developed and executed end-to-end test cases and scenarios to validate application functionality',
      'Wrote and maintained automated test scripts in various frameworks, improving testing efficiency',
      'Created technical documentation, including test plans and workflows, to support project goals',
      'Managed workflows using project management tools, ensuring timely task completion',
      'Generated weekly and monthly project progress reports to track milestones and communicate updates',
      'Collaborated with development teams to resolve issues and deliver high-quality software products',
    ],
    skills: ['Agile Methodology', 'Automated Testing', 'Test Documentation', 'Project Management', 'Reporting'],
  },
]

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        { isDesktop: '(min-width: 1024px)', reduceMotion: REDUCED_MOTION_QUERY },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean
            reduceMotion: boolean
          }
          const cards = gsap.utils.toArray<HTMLElement>('[data-exp-card]', trackRef.current)

          if (reduceMotion) {
            gsap.set(cards, { autoAlpha: 1, x: 0, y: 0 })
            return
          }

          if (!isDesktop) {
            gsap.from(cards, {
              autoAlpha: 0,
              y: 30,
              stagger: 0.15,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: { trigger: trackRef.current, start: 'top 85%' },
            })
            return
          }

          // Desktop: horizontal pin. Distance is computed from the track's
          // actual content width (not a fixed number) and invalidateOnRefresh
          // forces that computation to re-run on resize/refresh rather than
          // reusing a stale value - both the tween's `x` and the
          // ScrollTrigger's `end` are functions for exactly this reason.
          const track = trackRef.current
          const pinEl = pinRef.current
          if (!track || !pinEl) return

          const getScrollDistance = () => Math.max(track.scrollWidth - pinEl.clientWidth, 0)

          const tween = gsap.to(track, {
            x: () => -getScrollDistance(),
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              end: () => '+=' + getScrollDistance(),
            },
          })

          // Card text affects track width, and fonts affect card text width -
          // refresh once the final fonts are in so the pin distance isn't
          // computed against fallback-font metrics.
          document.fonts.ready.then(() => {
            if (!context.isReverted) ScrollTrigger.refresh()
          })

          return () => {
            // ScrollTrigger.kill() reverts its own pin-related inline
            // styles automatically, but tween.kill() does NOT revert the
            // transform it already applied - without clearProps, crossing
            // back below 1024px mid-scroll would leave the track visibly
            // shifted by its last translateX under the vertical layout.
            tween.scrollTrigger?.kill()
            tween.kill()
            gsap.set(track, { clearProps: 'x' })
          }
        }
      )

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section id="experience" ref={sectionRef} className="py-20 lg:py-0 lg:h-screen lg:overflow-hidden">
      <div
        ref={pinRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 lg:h-full lg:flex lg:flex-col lg:justify-center lg:overflow-hidden"
      >
        <h2 className="text-3xl font-display font-bold text-fg mb-12 text-center lg:mb-10">Experience</h2>

        <div
          ref={trackRef}
          className="space-y-12 lg:space-y-0 lg:flex lg:items-stretch lg:gap-8 lg:w-max"
        >
          {experiences.map((exp, index) => (
            <div
              key={index}
              data-exp-card
              className="bg-muted/5 rounded-lg p-8 border border-muted/20 hover:border-accent/30 transition-colors duration-300 lg:w-xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-fg mb-2">{exp.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-muted">
                    <div className="flex items-center gap-1">
                      <Building size={16} aria-hidden="true" />
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} aria-hidden="true" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} aria-hidden="true" />
                      <span className="font-mono text-sm">{exp.period}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <ul className="space-y-2 text-muted">
                  {exp.description.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="text-accent mt-1">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
