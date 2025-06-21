'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { login, signup } from './actions'
import { SignInButton } from '@/components/SignInButton'

/**
 * A modern, styled login page that provides options for both credential-based
 * and social (GitHub) authentication. It now uses useFormState for error handling.
 */
export default function LoginPage() {
  const [loginErrorMessage, loginDispatch] = useFormState(login, undefined)
  const [signupErrorMessage, signupDispatch] = useFormState(signup, undefined)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>

        {/* Credential Login Form */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <form action={loginDispatch} className="space-y-2">
            <LoginButton />
            {loginErrorMessage && <p className="text-sm text-red-500">{loginErrorMessage}</p>}
          </form>

          <form action={signupDispatch} className="space-y-2">
            <SignUpButton />
            {signupErrorMessage && <p className="text-sm text-red-500">{signupErrorMessage}</p>}
          </form>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="mx-4 flex-shrink text-sm text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Social Login */}
        <div>
          <SignInButton provider="github" />
        </div>
      </div>
    </div>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Signing In...' : 'Sign In'}
    </button>
  )
}

function SignUpButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Signing Up...' : 'Sign Up'}
    </button>
  )
}
