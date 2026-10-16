// "Skip to content" (DESIGN.md section 9): the first focusable element on
// every page with the navbar, jumping to <main id="main-content">.
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg focus:outline-hidden focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
    >
      Skip to content
    </a>
  )
}
