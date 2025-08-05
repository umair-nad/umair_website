'use client'

import { motion } from 'framer-motion'

const Skills = () => {
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

  return (
    <section id="skills" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-light mb-12 text-center"
        >
          Skills & Technologies
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-slate/5 rounded-lg p-6 border border-slate/20"
            >
              <h3 className="text-xl font-semibold text-light mb-4">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <h3 className="text-xl font-semibold text-light mb-4">What I Bring to the Table</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate/5 rounded-lg p-6 border border-slate/20">
              <h4 className="text-primary font-semibold mb-2">Quality Assurance</h4>
              <p className="text-slate text-sm">
                Comprehensive testing strategies ensuring defect-free software delivery
              </p>
            </div>
            <div className="bg-slate/5 rounded-lg p-6 border border-slate/20">
              <h4 className="text-primary font-semibold mb-2">Process Improvement</h4>
              <p className="text-slate text-sm">
                Continuous improvement of testing processes and methodologies
              </p>
            </div>
            <div className="bg-slate/5 rounded-lg p-6 border border-slate/20">
              <h4 className="text-primary font-semibold mb-2">Team Collaboration</h4>
              <p className="text-slate text-sm">
                Effective communication and collaboration with cross-functional teams
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills 