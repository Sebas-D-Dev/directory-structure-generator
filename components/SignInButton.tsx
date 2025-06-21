'use client'

import { signIn } from 'next-auth/react'
import { Github } from './social-icons/icons' // Reusing your existing icons

/**
 * A button that initiates the OAuth sign-in flow for a specific provider.
 */
export function SignInButton({ provider }: { provider: string }) {
  return (
    <button
      onClick={() => signIn(provider)}
      className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      <Github className="h-5 w-5" />
      <span>Sign in with GitHub</span>
    </button>
  )
}
