'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Linkedin, ExternalLink, Github } from 'lucide-react'

const Contact = () => {
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

  return (
    <section id="contact" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-light mb-12 text-center"
        >
          Get In Touch
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-light mb-6">Let's Connect</h3>
            <p className="text-slate mb-8">
              I'm always interested in new opportunities and exciting projects. 
              Whether you have a question or just want to say hi, feel free to reach out!
            </p>
            
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4"
                >
                  <div className="text-primary">
                    <info.icon size={20} />
                  </div>
                  <div>
                    <p className="text-slate text-sm">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-light hover:text-primary transition-colors duration-200"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-light">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-slate/5 rounded-lg p-8 border border-slate/20"
          >
            <h3 className="text-xl font-semibold text-light mb-6">Connect With Me</h3>
            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-slate hover:text-primary transition-colors duration-200 p-3 rounded-lg hover:bg-slate/10"
                >
                  <link.icon size={20} />
                  <span>{link.name}</span>
                </motion.a>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate/20">
              <h4 className="text-light font-semibold mb-4">Available for:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary">▹</span>
                  <span className="text-slate">Full-time opportunities</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">▹</span>
                  <span className="text-slate">Freelance projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">▹</span>
                  <span className="text-slate">Consulting work</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">▹</span>
                  <span className="text-slate">Open source contributions</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact 