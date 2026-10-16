// The tools that have a logo on the Skills & Tools wall. This tiny list
// ships with the page so logo tiles keep their square from the first
// paint; the logo paths themselves (lib/tool-icons.ts) load on demand.
export const TOOL_LOGO_NAMES = [
  'Apache JMeter',
  'Appium',
  'Bitbucket',
  'Charles Proxy',
  'Confluence',
  'Cucumber',
  'Cypress',
  'Datadog',
  'Docker',
  'Figma',
  'Git',
  'GitHub',
  'GitHub Actions',
  'GitLab',
  'Google Analytics',
  'Insomnia',
  'Jenkins',
  'Jira',
  'k6',
  'Linear',
  'Notion',
  'PostHog',
  'Postman',
  'Pytest',
  'Sauce Labs',
  'Selenium',
  'Sentry',
  'Swagger',
  'TestRail',
  'Trello',
  'WebdriverIO',
] as const

export type ToolLogoName = (typeof TOOL_LOGO_NAMES)[number]

// Logos shown as the owner's own file, unaltered, because their terms
// forbid redrawing or recoloring (served from public/logos/). Robot
// Framework: the Foundation's white mark (Visual Identity License 2.0;
// black and white are its only allowed colors), whose canvas already holds
// the required clear space: the mark is the middle 60%.
export const TOOL_LOGO_FILES: Record<string, string> = {
  'Robot Framework': '/logos/robot-framework-white.png',
}
