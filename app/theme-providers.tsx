'use client'

import { ThemeProvider } from 'next-themes'
import React from 'react'

/**
 * Wraps the application with the ThemeProvider from next-themes,
 * enabling light/dark/system mode functionality.
 *
 * @param {{ children: React.ReactNode }} { children }
 * @returns {JSX.Element} The rendered ThemeProvider.
 */
export function ThemeProviders({ children }: { children: React.ReactNode }) {
  // The defaultTheme value, previously from siteMetadata, is now set directly.
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
