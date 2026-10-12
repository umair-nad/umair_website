// Single typed content source for the portfolio.
// Every string here must be traceable to an approved source (see CLAUDE.md):
// data/Profile.pdf (LinkedIn export), the pre-redesign site copy, or facts the
// user stated in chat. Never add projects, metrics, dates, tools, or claims
// that are not in those sources.
// Site text rule: no em dashes anywhere in string values.

export interface Role {
  company: string;
  title: string;
  /** One-line company context, only when a source provides it. */
  summary?: string;
  location: string;
  /** Month-name form, e.g. "May 2025". Render ranges with a hyphen or "to". */
  start: string;
  end: string | "Present";
  highlights: string[];
  tags: string[];
}

export interface EducationEntry {
  school: string;
  degree: string;
  field?: string;
  start?: string;
  end?: string;
}

export interface Project {
  name: string;
  summary: string;
  tools: string[];
  link?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year?: string;
}

export type SkillGroupId =
  | "testing-types"
  | "automation-frameworks"
  | "tools"
  | "languages"
  | "practices"
  | "ci-cd";

export interface SkillGroup {
  id: SkillGroupId;
  label: string;
  items: string[];
}

export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteContent {
  name: string;
  title: string;
  bio: string;
  location: string;
  /** Standard time zone of `location`; drives the local clocks. */
  timeZone: { iana: string; abbr: string; label: string };
  spokenLanguages: string[];
  experience: Role[];
  education: EducationEntry[];
  projects: Project[];
  skills: SkillGroup[];
  /** Headline QA specializations for the About bento (DESIGN.md 11.2). */
  specializations: string[];
  certifications: Certification[];
  links: SiteLink[];
  contact: { email: string };
  /** Public resume PDF, served from public/. */
  resume: { href: string };
  seo: { title: string; description: string };
}

export const content = {
  name: "Umair Nadeem",
  title: "QA Engineer",
  // Voice: LinkedIn summary, near verbatim (user decision 2026-10-04).
  bio: "I break things so your users don't have to. 5+ years in QA hunting bugs, writing tight test cases, and keeping releases from turning into dumpster fires. Manual, regression, UAT, smoke, API, edge cases no one else thinks about: that's my lane.",
  location: "Islamabad, Pakistan",
  // Derived from the location, not a claim about Umair's working hours
  // (DESIGN.md 11.2). Pakistan observes no daylight saving time.
  timeZone: { iana: "Asia/Karachi", abbr: "PKT", label: "PKT (UTC+5)" },
  spokenLanguages: ["English", "Urdu"],

  experience: [
    {
      company: "Smart In Media",
      title: "Senior QA Engineer",
      summary:
        "Smart In Media develops the PathoZoom product family of digital pathology software.",
      location: "Cologne, Germany",
      // Dates exactly as LinkedIn lists them; the May-Sep 2025 overlap with
      // Adrem Technologies is in the source, not an error.
      start: "May 2025",
      end: "Present",
      // Facts provided by the user in chat (2026-10-04). Product names follow
      // smartinmedia.com; no (R) symbol in body text. Do not extend these
      // bullets with tools, metrics, or responsibilities not stated there.
      highlights: [
        "Tested digital pathology software across multiple PathoZoom projects",
        "Worked on full test automation for PathoZoom Digital Lab",
        "Tested PathoZoom Scan & LiveView",
      ],
      tags: ["Digital Pathology", "Healthcare Software", "Test Automation"],
    },
    {
      company: "Adrem Technologies",
      title: "Senior QA Engineer",
      location: "Islamabad, Pakistan",
      start: "October 2023",
      end: "September 2025",
      highlights: [
        "Conducted functional, regression, smoke, and usability testing for web and mobile applications to ensure defect-free releases",
        "Developed comprehensive test plans, test cases, and test scripts aligned with project requirements and deadlines",
        "Identified, documented, and tracked bugs using tools like Jira and Trello, collaborating with developers for timely resolution",
        "Performed API validations using Postman to ensure proper integration and data flow between services",
        "Worked closely with product managers, developers, and other stakeholders to clarify requirements and improve product quality",
      ],
      tags: ["Manual Testing", "Jira", "Trello", "Postman", "API Testing", "Test Planning"],
    },
    {
      company: "Workbox Pvt Ltd",
      title: "Senior Software Quality Assurance Engineer",
      location: "Peshawar, Pakistan",
      start: "August 2021",
      end: "October 2023",
      highlights: [
        "Led QA efforts, including standup and retrospective meetings, to ensure effective team communication and collaboration",
        "Prepared detailed bug reports using tools like Jira, identifying and documenting UI/UX and functional issues",
        "Developed and executed end-to-end test cases and scenarios to validate application functionality",
        "Wrote and maintained automated test scripts in various frameworks, improving testing efficiency",
        "Created technical documentation, including test plans and workflows, to support project goals",
        "Managed workflows using project management tools, ensuring timely task completion",
        "Generated weekly and monthly project progress reports to track milestones and communicate updates",
        "Collaborated with development teams to resolve issues and deliver high-quality software products",
      ],
      tags: [
        "Agile Methodology",
        "Automated Testing",
        "Test Documentation",
        "Project Management",
        "Reporting",
      ],
    },
  ],

  education: [
    {
      school: "Islamia College Peshawar",
      degree: "Bachelor of Science (BS)",
      field: "Computer Software Engineering",
      start: "October 2017",
      end: "February 2021",
    },
  ],

  // Empty on purpose: no projects or certifications exist in any approved
  // source as of 2026-10-04 (audit question 10). Do not invent entries.
  projects: [],
  certifications: [],

  skills: [
    {
      id: "testing-types",
      label: "Testing Types",
      items: [
        "Manual Testing",
        "Automated Testing",
        "Functional Testing",
        "Regression Testing",
        "Smoke Testing",
        "Sanity Testing",
        "UAT & Exploratory Testing",
        "API Testing",
        "E2E Testing",
        "AI & LLM Testing",
        "Performance Testing",
        "Cross-browser & Cross-device Testing",
        "Black-Box Testing",
      ],
    },
    {
      id: "automation-frameworks",
      label: "Automation Frameworks",
      items: ["Cypress", "Cucumber", "Robot Framework"],
    },
    {
      id: "tools",
      label: "Tools",
      items: [
        "Jira",
        "Linear",
        "Trello",
        "TestRail",
        "Zephyr",
        "Postman",
        "Swagger",
        "Apache JMeter",
        "Chrome DevTools",
        "Confluence",
      ],
    },
    {
      id: "practices",
      label: "Practices",
      items: [
        "Agile Methodology",
        "Test Planning",
        "Bug Reporting",
        "Test Documentation",
        "Team Leadership",
        "Project Coordination",
        "Communication Skills",
      ],
    },
    // No "ci-cd" group yet: no CI/CD tool appears in any approved source.
  ],

  // Four headline items, approved in DESIGN.md 11.2 (2026-10-10). Each one
  // maps to the skills above or a role tag: Manual Testing + UAT &
  // Exploratory Testing, Test Automation (Smart In Media tag), API Testing,
  // Regression Testing. "AI & LLM Testing" stays out until Umair confirms it.
  specializations: ["Manual and Exploratory", "Test Automation", "API Testing", "Regression Testing"],

  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/umair-nadeem-qa/" },
    { label: "Upwork", href: "https://www.upwork.com/freelancers/~01862b323ce960e4b6" },
  ],

  // Email per LinkedIn (user decision 2026-10-04: LinkedIn wins conflicts).
  // No phone number anywhere on the site (user decision 2026-10-04).
  contact: {
    email: "uminadeem06@gmail.com",
  },

  // Umair approved publishing this PDF as is, phone number included
  // (user decision 2026-10-10). Site text still never shows the phone.
  resume: {
    href: "/umair-nadeem-qa-engineer-resume.pdf",
  },

  seo: {
    title: "Umair Nadeem - QA Engineer",
    description:
      "Software Quality Assurance Engineer with 5+ years of experience in manual, API, and automated testing across web and mobile applications.",
  },
} satisfies SiteContent;
