'use client'

import { useRef } from 'react'
import { Mail, Phone, MapPin, Linkedin, ExternalLink } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, registerGsap } from '@/lib/gsap'
import { REDUCED_MOTION_QUERY, COARSE_POINTER_QUERY } from '@/lib/motion-preferences'
import { applyMagneticHover } from '@/lib/magnetic'

registerGsap()

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'umiiawan06@gmail.com',
    href: 'mailto:umiiawan06@gmail.com'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+92-342-6649899',
    href: 'tel:+923426649899'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Islamabad, Pakistan',
    href: null
  }
]

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/umair-nadeem-qa/',
    icon: Linkedin
  },
  {
    name: 'Upwork',
    url: 'https://www.upwork.com/freelancers/~01862b323ce960e4b6',
    icon: ExternalLink
  }
]

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm'

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

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

          const infoRows = gsap.utils.toArray<HTMLElement>('[data-contact-row]', leftRef.current)
          const socialEls = gsap.utils.toArray<HTMLElement>('[data-social-link]', rightRef.current)

          if (reduceMotion) {
            gsap.set(
              [headingRef.current, leftRef.current, rightRef.current, ...infoRows, ...socialEls],
              { autoAlpha: 1, x: 0, y: 0 }
            )
            return
          }

          gsap.from(headingRef.current, {
            autoAlpha: 0,
            y: 20,
            duration: 0.7,
            scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
          })

          gsap.from(leftRef.current, {
            autoAlpha: 0,
            x: -20,
            duration: 0.7,
            scrollTrigger: { trigger: leftRef.current, start: 'top 85%' },
          })

          gsap.from(infoRows, {
            autoAlpha: 0,
            x: -20,
            stagger: 0.1,
            duration: 0.6,
            delay: 0.15,
            scrollTrigger: { trigger: leftRef.current, start: 'top 80%' },
          })

          gsap.from(rightRef.current, {
            autoAlpha: 0,
            x: 20,
            duration: 0.7,
            scrollTrigger: { trigger: rightRef.current, start: 'top 85%' },
          })

          gsap.from(socialEls, {
            autoAlpha: 0,
            y: 10,
            stagger: 0.1,
            duration: 0.5,
            delay: 0.15,
            scrollTrigger: { trigger: rightRef.current, start: 'top 80%' },
          })

          const magneticEls = gsap.utils.toArray<HTMLElement>('[data-magnetic]', sectionRef.current)
          const cleanups = coarsePointer ? [] : magneticEls.map((el) => applyMagneticHover(el))
          return () => cleanups.forEach((fn) => fn())
        }
      )

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section id="contact" className="py-20">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 ref={headingRef} className="text-3xl font-display font-bold text-fg mb-12 text-center">
          Get In Touch
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div ref={leftRef}>
            <h3 className="text-xl font-semibold text-fg mb-6">Let&apos;s Connect</h3>
            <p className="text-muted mb-8">
              I&apos;m always interested in new opportunities and exciting projects.
              Whether you have a question or just want to say hi, feel free to reach out!
            </p>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} data-contact-row data-magnetic className="flex items-center gap-4">
                  <div className="text-accent">
                    <info.icon size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-muted text-sm">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className={`text-fg hover:text-accent transition-colors duration-200 ${focusRing}`}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-fg">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={rightRef}
            className="bg-muted/5 rounded-lg p-8 border border-muted/20"
          >
            <h3 className="text-xl font-semibold text-fg mb-6">Connect With Me</h3>
            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-social-link
                  data-magnetic
                  className={`flex items-center gap-3 text-muted hover:text-accent transition-colors duration-200 p-3 rounded-lg hover:bg-muted/10 ${focusRing}`}
                >
                  <link.icon size={20} aria-hidden="true" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-muted/20">
              <h4 className="text-fg font-semibold mb-4">Available for:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-accent">▹</span>
                  <span className="text-muted">Full-time opportunities</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">▹</span>
                  <span className="text-muted">Freelance projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">▹</span>
                  <span className="text-muted">Consulting work</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">▹</span>
                  <span className="text-muted">Open source contributions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
