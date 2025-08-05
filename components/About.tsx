'use client'

import { motion } from 'framer-motion'

const About = () => {
  return (
    <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-light mb-8"
            >
              About Me
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4 text-slate"
            >
              <p>
                I'm a passionate Software Quality Assurance Engineer with over 3 years of experience 
                in ensuring the delivery of high-quality software solutions. My expertise lies in 
                creating comprehensive test cases, performing cross-browser compatibility checks, 
                and validating APIs using tools like Postman.
              </p>
              
              <p>
                I specialize in manual testing, test planning, and bug tracking across web and 
                mobile applications. I'm adept at collaborating with cross-functional teams in 
                Agile environments to meet tight deadlines and deliver defect-free products.
              </p>
              
              <p>
                My passion lies in enhancing user experiences and continuously improving testing 
                processes to align with project goals and client expectations. I believe in 
                creating robust, scalable testing strategies that ensure software quality 
                while maintaining efficiency.
              </p>
              
              <p>
                Currently based in Islamabad, Pakistan, I'm always eager to take on new 
                challenges and contribute to innovative projects that push the boundaries 
                of software quality assurance.
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-slate/10 rounded-lg p-8 border border-slate/20"
          >
            <h3 className="text-xl font-semibold text-light mb-6">Quick Facts</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate">Experience:</span>
                <span className="text-primary font-medium">3+ Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Location:</span>
                <span className="text-primary font-medium">Islamabad, Pakistan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Education:</span>
                <span className="text-primary font-medium">BS, Islamia College University</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Languages:</span>
                <span className="text-primary font-medium">English, Urdu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Interests:</span>
                <span className="text-primary font-medium">Cricket, Technology</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About 