'use client'

import { SessionProvider } from 'next-auth/react'
import React from 'react'

/**
 * Defines the props for the Providers component.
 * @interface ProvidersProps
 * @property {React.ReactNode} children - The child components to be wrapped by the providers.
 */
interface ProvidersProps {
  children: React.ReactNode
}

/**
 * A central component to wrap the entire application with necessary context providers.
 * Currently, it only includes the SessionProvider for NextAuth.js.
 *
 * @param {ProvidersProps} { children }
 * @returns {JSX.Element} The rendered providers wrapping the application.
 */
export default function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>
}
