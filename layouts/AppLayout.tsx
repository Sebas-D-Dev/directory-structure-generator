import React from 'react'

/**
 * Defines the props for the AppLayout component.
 * @interface AppLayoutProps
 * @property {React.ReactNode} children - The main content to be rendered within the layout.
 */
interface AppLayoutProps {
  children: React.ReactNode
}

/**
 * AppLayout serves as the primary structural component for the authenticated sections of the application.
 * It provides a consistent container for pages like the user dashboard and collaborative workspaces,
 * separating them visually from the public-facing marketing pages.
 *
 * @param {AppLayoutProps} { children }
 * @returns {JSX.Element} The rendered layout component.
 */
const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
  return (
    // The main container for the authenticated view
    // A distinct background color helps differentiate it from the public site.
    <div className="flex-grow bg-gray-50 py-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* The main content area where page-specific components will be rendered. */}
        {children}
      </div>
    </div>
  )
}

export default AppLayout
