'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Mail, Linkedin, ExternalLink } from 'lucide-react'

const ParticleCanvas = dynamic(() => import('./hero/ParticleCanvas'), { ssr: false })

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm'

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="mb-8 flex justify-start">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-accent/20 shadow-2xl">
                <Image
                  src="/muhammad.jpg"
                  alt="Umair Nadeem"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <p className="text-accent text-lg mb-4">
              Hi, my name is
            </p>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-fg mb-4">
              Umair Nadeem
            </h1>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-muted mb-8">
              SQA Engineer
            </h2>

            <p className="text-lg text-muted max-w-3xl mb-12">
              Dedicated and detail-oriented Software Quality Assurance Tester with over 3 years
              of experience in ensuring the delivery of high-quality software solutions.
              Proficient in manual testing, test planning, and bug tracking across web and mobile applications.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <a
                href="#contact"
                data-magnetic
                className={`bg-accent text-bg px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors duration-200 flex items-center gap-2 ${focusRing}`}
              >
                Get In Touch
                <Mail className="w-5 h-5" aria-hidden="true" />
              </a>

              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/in/umair-nadeem-qa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  data-magnetic
                  className={`text-muted hover:text-accent transition-colors duration-200 p-2 ${focusRing}`}
                >
                  <Linkedin className="w-6 h-6" aria-hidden="true" />
                </a>
                <a
                  href="https://www.upwork.com/freelancers/~01862b323ce960e4b6"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Upwork"
                  data-magnetic
                  className={`text-muted hover:text-accent transition-colors duration-200 p-2 ${focusRing}`}
                >
                  <ExternalLink className="w-6 h-6" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 lg:h-[28rem]">
            <ParticleCanvas />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
