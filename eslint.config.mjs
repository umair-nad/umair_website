import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

// Flat config (Next.js 16 removed `next lint`; ESLint runs directly via
// `npm run lint`). Same rule set as the old .eslintrc.json: Next's
// core-web-vitals preset plus one override.
const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'warn',
    },
  },
  globalIgnores([
    // eslint-config-next defaults
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Gitignored local folders (personal data, design reference, review shots)
    'data/**',
    'refrence/**',
    'review/**',
  ]),
])

export default eslintConfig
