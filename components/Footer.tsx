'use client'

import { motion } from 'framer-motion'
import { Linkedin, ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="py-8 border-t border-slate/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-slate text-sm mb-4 md:mb-0">
            © 2024 Umair Nadeem. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/umair-nadeem-qa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate hover:text-primary transition-colors duration-200"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://www.upwork.com/freelancers/~01862b323ce960e4b6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate hover:text-primary transition-colors duration-200"
            >
              <ExternalLink size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer 