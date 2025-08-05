'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Building } from 'lucide-react'

const Experience = () => {
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
        'Worked closely with product managers, developers, and other stakeholders to clarify requirements and improve product quality'
      ],
      skills: ['Manual Testing', 'Jira', 'Trello', 'Postman', 'API Testing', 'Test Planning']
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
        'Collaborated with development teams to resolve issues and deliver high-quality software products'
      ],
      skills: ['Agile Methodology', 'Automated Testing', 'Test Documentation', 'Project Management', 'Reporting']
    }
  ]

  return (
    <section id="experience" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-light mb-12 text-center"
        >
          Experience
        </motion.h2>
        
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-slate/5 rounded-lg p-8 border border-slate/20 hover:border-primary/30 transition-colors duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-light mb-2">{exp.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-slate">
                    <div className="flex items-center gap-1">
                      <Building size={16} />
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{exp.period}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <ul className="space-y-2 text-slate">
                  {exp.description.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="text-primary mt-1">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience 