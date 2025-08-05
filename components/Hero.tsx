'use client'

import Image from 'next/image'

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
              <Image
                src="/muhammad.jpg"
                alt="Umair Nadeem"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <p className="text-primary text-lg mb-4">
            Hi, my name is
          </p>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-light mb-4">
            Umair Nadeem
          </h1>
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate mb-8">
            SQA Engineer
          </h2>
          
          <p className="text-lg text-slate max-w-3xl mx-auto mb-12">
            Dedicated and detail-oriented Software Quality Assurance Tester with over 3 years 
            of experience in ensuring the delivery of high-quality software solutions. 
            Proficient in manual testing, test planning, and bug tracking across web and mobile applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#contact"
              className="bg-primary text-dark px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
            >
              Get In Touch
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/umair-nadeem-qa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate hover:text-primary transition-colors duration-200 p-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://www.upwork.com/freelancers/~01862b323ce960e4b6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate hover:text-primary transition-colors duration-200 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 