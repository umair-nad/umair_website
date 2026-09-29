'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, registerGsap } from '@/lib/gsap'
import { REDUCED_MOTION_QUERY, COARSE_POINTER_QUERY } from '@/lib/motion-preferences'
import { applyMagneticHover } from '@/lib/magnetic'

registerGsap()

const skillCategories = [
  {
    category: 'Testing Tools',
    skills: [
      'JIRA', 'Trello', 'Postman', 'Apache JMeter', 'Cypress Framework',
      'Cucumber Framework', 'Robot Framework'
    ]
  },
  {
    category: 'Testing Types',
    skills: [
      'Manual Testing', 'Automated Testing', 'Functional Testing', 'Regression Testing',
      'Smoke Testing', 'Performance Testing', 'API Testing', 'Black-Box Testing'
    ]
  },
  {
    category: 'Methodologies',
    skills: [
      'Agile Methodology', 'Test Planning', 'Bug Reporting', 'Test Documentation',
      'Product Management', 'Communication Skills'
    ]
  },
  {
    category: 'Programming & Languages',
    skills: [
      'JavaScript', 'Python', 'SQL', 'HTML/CSS', 'English', 'Urdu'
    ]
  }
]

const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const bringRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        { reduceMotion: REDUCED_MOTION_QUERY, coarsePointer: COARSE_POINTER_QUERY },
        (context) => {
          const { reduceMotion, coarsePointer } = context.conditions as {
            reduceMotion: boolean
            coarsePointer: boolean
          }

          const categories = gsap.utils.toArray<HTMLElement>('[data-skill-category]', gridRef.current)
          const bringCards = gsap.utils.toArray<HTMLElement>('[data-bring-card]', bringRef.current)

          if (reduceMotion) {
            gsap.set([headingRef.current, ...categories, bringRef.current, ...bringCards], {
              autoAlpha: 1,
              y: 0,
            })
            categories.forEach((categoryEl) => {
              gsap.set(gsap.utils.toArray('[data-skill-pill]', categoryEl), { autoAlpha: 1, y: 0 })
            })
            return
          }

          categories.forEach((categoryEl) => {
            const pills = gsap.utils.toArray<HTMLElement>('[data-skill-pill]', categoryEl)

            gsap.from(categoryEl, {
              autoAlpha: 0,
              y: 20,
              duration: 0.5,
              scrollTrigger: { trigger: categoryEl, start: 'top 88%' },
            })

            // "Signal scan": pills light up in sequence rather than the
            // whole category fading in as one block.
            gsap.from(pills, {
              autoAlpha: 0,
              y: 8,
              stagger: 0.04,
              duration: 0.35,
              ease: 'power1.out',
              scrollTrigger: { trigger: categoryEl, start: 'top 85%' },
            })
          })

          gsap.from(bringRef.current, {
            autoAlpha: 0,
            y: 20,
            duration: 0.6,
            scrollTrigger: { trigger: bringRef.current, start: 'top 85%' },
          })

          gsap.from(bringCards, {
            autoAlpha: 0,
            y: 20,
            stagger: 0.15,
            duration: 0.6,
            delay: 0.1,
            scrollTrigger: { trigger: bringRef.current, start: 'top 85%' },
          })

          const magneticCleanups = coarsePointer ? [] : bringCards.map((el) => applyMagneticHover(el))

          document.fonts.ready.then(() => {
            if (context.isReverted || !headingRef.current) return
            context.add(() => {
              const split = SplitText.create(headingRef.current, { type: 'words', aria: 'auto' })
              gsap.from(split.words, {
                autoAlpha: 0,
                y: 16,
                stagger: 0.04,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: { trigger: headingRef.current, start: 'top 90%' },
              })
              return () => split.revert()
            })
          })

          return () => magneticCleanups.forEach((fn) => fn())
        }
      )

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section id="skills" className="py-20">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 ref={headingRef} className="text-3xl font-display font-bold text-fg mb-12 text-center">
          Skills & Technologies
        </h2>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              data-skill-category
              className="bg-muted/5 rounded-lg p-6 border border-muted/20"
            >
              <h3 className="text-xl font-semibold text-fg mb-4">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    data-skill-pill
                    className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium hover:bg-accent/20 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div ref={bringRef} className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-fg mb-4">What I Bring to the Table</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              data-bring-card
              data-magnetic
              className="bg-muted/5 rounded-lg p-6 border border-muted/20"
            >
              <h4 className="text-accent font-semibold mb-2">Quality Assurance</h4>
              <p className="text-muted text-sm">
                Comprehensive testing strategies ensuring defect-free software delivery
              </p>
            </div>
            <div
              data-bring-card
              data-magnetic
              className="bg-muted/5 rounded-lg p-6 border border-muted/20"
            >
              <h4 className="text-accent font-semibold mb-2">Process Improvement</h4>
              <p className="text-muted text-sm">
                Continuous improvement of testing processes and methodologies
              </p>
            </div>
            <div
              data-bring-card
              data-magnetic
              className="bg-muted/5 rounded-lg p-6 border border-muted/20"
            >
              <h4 className="text-accent font-semibold mb-2">Team Collaboration</h4>
              <p className="text-muted text-sm">
                Effective communication and collaboration with cross-functional teams
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
