import Link from 'next/link'
import { auth } from '@/auth'

/**
 * A custom 404 page tailored for the collaboration platform.
 * It provides relevant links based on the user's authentication status.
 */
export default async function NotFound() {
  const session = await auth()

  return (
    <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
      <div className="space-x-2 pb-8 pt-6 md:space-y-5">
        <h1 className="md:leading-14 text-6xl font-extrabold leading-9 tracking-tight text-gray-900 md:border-r-2 md:px-6 md:text-8xl dark:text-gray-100">
          404
        </h1>
      </div>
      <div className="max-w-md">
        <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">Workspace Not Found</p>
        <p className="mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved,
          deleted, or you may not have permission to view it.
        </p>
        {session ? (
          <Link
            href="/dashboard"
            className="focus:shadow-outline-blue inline rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium leading-5 text-white shadow-sm transition-colors duration-150 hover:bg-blue-700 focus:outline-none dark:hover:bg-blue-500"
          >
            Back to your Dashboard
          </Link>
        ) : (
          <Link
            href="/"
            className="focus:shadow-outline-blue inline rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium leading-5 text-white shadow-sm transition-colors duration-150 hover:bg-blue-700 focus:outline-none dark:hover:bg-blue-500"
          >
            Back to Homepage
          </Link>
        )}
      </div>
    </div>
  )
}
