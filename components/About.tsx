'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, registerGsap } from '@/lib/gsap'
import { REDUCED_MOTION_QUERY } from '@/lib/motion-preferences'

registerGsap()

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const paragraphsRef = useRef<HTMLDivElement>(null)
  const factsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ reduceMotion: REDUCED_MOTION_QUERY }, (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean }

        const paragraphs = gsap.utils.toArray<HTMLElement>('p', paragraphsRef.current)
        const factRows = gsap.utils.toArray<HTMLElement>('[data-fact-row]', factsRef.current)

        if (reduceMotion) {
          gsap.set([headingRef.current, ...paragraphs, factsRef.current, ...factRows], {
            autoAlpha: 1,
            x: 0,
            y: 0,
          })
          return
        }

        gsap.from(paragraphs, {
          autoAlpha: 0,
          y: 24,
          stagger: 0.15,
          ease: 'none',
          scrollTrigger: {
            trigger: paragraphsRef.current,
            start: 'top 90%',
            end: 'top 55%',
            scrub: true,
          },
        })

        gsap.from(factsRef.current, {
          autoAlpha: 0,
          x: 20,
          duration: 0.7,
          scrollTrigger: { trigger: factsRef.current, start: 'top 85%' },
        })

        gsap.from(factRows, {
          autoAlpha: 0,
          y: 12,
          stagger: 0.08,
          duration: 0.5,
          delay: 0.2,
          scrollTrigger: { trigger: factsRef.current, start: 'top 85%' },
        })

        // SplitText needs final font metrics for accurate word measurement,
        // so the heading reveal waits for fonts.ready. Wrapped in
        // context.add() because gsap.matchMedia()'s automatic tracking only
        // covers work created synchronously in this callback - anything
        // created later (here, after a promise resolves) needs to be
        // registered into the context explicitly so mm.revert() still
        // cleans it up.
        document.fonts.ready.then(() => {
          if (context.isReverted || !headingRef.current) return
          context.add(() => {
            const split = SplitText.create(headingRef.current, {
              type: 'words',
              aria: 'auto', // default: aria-label on the heading (full text), aria-hidden on each word span
            })
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
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section id="about" className="py-20">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 ref={headingRef} className="text-3xl font-display font-bold text-fg mb-8">
              About Me
            </h2>

            <div ref={paragraphsRef} className="space-y-4 text-muted">
              <p>
                I&apos;m a passionate Software Quality Assurance Engineer with over 3 years of experience
                in ensuring the delivery of high-quality software solutions. My expertise lies in
                creating comprehensive test cases, performing cross-browser compatibility checks,
                and validating APIs using tools like Postman.
              </p>

              <p>
                I specialize in manual testing, test planning, and bug tracking across web and
                mobile applications. I&apos;m adept at collaborating with cross-functional teams in
                Agile environments to meet tight deadlines and deliver defect-free products.
              </p>

              <p>
                My passion lies in enhancing user experiences and continuously improving testing
                processes to align with project goals and client expectations. I believe in
                creating robust, scalable testing strategies that ensure software quality
                while maintaining efficiency.
              </p>

              <p>
                Currently based in Islamabad, Pakistan, I&apos;m always eager to take on new
                challenges and contribute to innovative projects that push the boundaries
                of software quality assurance.
              </p>
            </div>
          </div>

          <div ref={factsRef} className="bg-muted/10 rounded-lg p-8 border border-muted/20">
            <h3 className="text-xl font-semibold text-fg mb-6">Quick Facts</h3>
            <div className="space-y-4">
              <div data-fact-row className="flex justify-between">
                <span className="text-muted">Experience:</span>
                <span className="text-accent font-mono">3+ Years</span>
              </div>
              <div data-fact-row className="flex justify-between">
                <span className="text-muted">Location:</span>
                <span className="text-accent font-mono">Islamabad, Pakistan</span>
              </div>
              <div data-fact-row className="flex justify-between">
                <span className="text-muted">Education:</span>
                <span className="text-accent font-mono">BS, Islamia College University</span>
              </div>
              <div data-fact-row className="flex justify-between">
                <span className="text-muted">Languages:</span>
                <span className="text-accent font-mono">English, Urdu</span>
              </div>
              <div data-fact-row className="flex justify-between">
                <span className="text-muted">Interests:</span>
                <span className="text-accent font-mono">Cricket, Technology</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
