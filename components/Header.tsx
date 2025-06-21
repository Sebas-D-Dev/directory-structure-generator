import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import AuthButton from './AuthButton'

/**
 * The main site header.
 * Configuration values that were previously in siteMetadata.js are now managed here
 * or passed as props if they need to be dynamic.
 */
const Header = () => {
  // Configuration for the header.
  const headerTitle = 'Direct Live Collab'
  const isNavSticky = false // Set to true if you want a sticky navbar.

  let headerClass = 'flex items-center w-full justify-between py-6'
  if (isNavSticky) {
    headerClass += ' sticky top-0 z-50 bg-white dark:bg-gray-950'
  }

  return (
    <header className={headerClass}>
      <div>
        <Link href="/" aria-label={headerTitle}>
          <div className="flex items-center justify-between">
            {/* You can add a logo SVG component here if you have one */}
            <div className="hidden h-6 text-2xl font-semibold sm:block">{headerTitle}</div>
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        {/* We can add dynamic nav links here later if needed */}
        <ThemeSwitch />
        <AuthButton />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
