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
