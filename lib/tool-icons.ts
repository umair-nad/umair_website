import {
  siApachejmeter,
  siAppium,
  siBitbucket,
  siCharles,
  siConfluence,
  siCucumber,
  siCypress,
  siDatadog,
  siDocker,
  siFigma,
  siGit,
  siGithub,
  siGithubactions,
  siGitlab,
  siGoogleanalytics,
  siInsomnia,
  siJenkins,
  siJira,
  siK6,
  siLinear,
  siNotion,
  siPosthog,
  siPostman,
  siPytest,
  siSaucelabs,
  siSelenium,
  siSentry,
  siSwagger,
  siTestrail,
  siTrello,
  siWebdriverio,
  type SimpleIcon,
} from 'simple-icons'
import type { ToolLogoName } from '@/lib/tool-logo-names'

// Brand marks for the Skills & Tools wall, from Simple Icons 16 (CC0 as a
// project; each mark stays its owner's trademark). Named imports only, so
// the build keeps just these 31 paths. Loaded on demand by components/
// Skills.tsx (about 20 KB gzip), keyed by lib/tool-logo-names.ts.
//
// No logo here, shown as text tiles instead (never drawn or invented):
// Playwright, Zephyr, Xray, qTest, Azure DevOps, Fiddler, Chrome DevTools,
// BrowserStack, LambdaTest, Slack, Microsoft Teams, SQL (not in Simple
// Icons), and Robot Framework (in Simple Icons, but its logo is licensed
// CC BY-NC-SA 4.0, non-commercial only; a text tile until the user decides).
// Marks with attribution licenses are credited at the page bottom, in
// components/LogoCredits.tsx (Git CC BY
// 3.0, Jenkins CC BY-SA 3.0, Apache JMeter Apache-2.0).
export const TOOL_ICONS: Record<ToolLogoName, SimpleIcon> = {
  'Apache JMeter': siApachejmeter,
  Appium: siAppium,
  Bitbucket: siBitbucket,
  'Charles Proxy': siCharles,
  Confluence: siConfluence,
  Cucumber: siCucumber,
  Cypress: siCypress,
  Datadog: siDatadog,
  Docker: siDocker,
  Figma: siFigma,
  Git: siGit,
  GitHub: siGithub,
  'GitHub Actions': siGithubactions,
  GitLab: siGitlab,
  'Google Analytics': siGoogleanalytics,
  Insomnia: siInsomnia,
  Jenkins: siJenkins,
  Jira: siJira,
  k6: siK6,
  Linear: siLinear,
  Notion: siNotion,
  PostHog: siPosthog,
  Postman: siPostman,
  Pytest: siPytest,
  'Sauce Labs': siSaucelabs,
  Selenium: siSelenium,
  Sentry: siSentry,
  Swagger: siSwagger,
  TestRail: siTestrail,
  Trello: siTrello,
  WebdriverIO: siWebdriverio,
}
