import Link from 'next/link'
import Image from 'next/image'
import AppLayout from '@/layouts/AppLayout'

// Define the shape of the data we expect from our profile API.
interface ProfileWorkspace {
  id: string
  name: string
  updatedAt: string
}

interface UserProfile {
  id: string
  name: string
  image: string
  workspaces: ProfileWorkspace[]
}

/**
 * The public profile page for a single user, showcasing their public workspaces.
 */
export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const userId = params.userId

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/users/${userId}/profile`, {
    cache: 'no-store',
  })

  let profile: UserProfile | null = null
  let error: string | null = null

  if (!response.ok) {
    if (response.status === 404) {
      error = 'User not found.'
    } else {
      error = 'Could not load user profile.'
    }
  } else {
    profile = await response.json()
  }

  if (error) {
    return (
      <AppLayout>
        <p className="text-center text-red-500">{error}</p>
      </AppLayout>
    )
  }

  if (!profile) {
    return (
      <AppLayout>
        <p className="text-center">Profile could not be loaded.</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 border-b border-gray-200 pb-8 dark:border-gray-700">
          <Image
            src={profile.image || `https://source.boringavatars.com/beam/120/${profile.id}`}
            alt={`${profile.name}'s avatar`}
            width={120}
            height={120}
            className="rounded-full bg-gray-300 shadow-md"
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {profile.name}&apos;s Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Showcasing {profile.workspaces.length} public workspace(s).
          </p>
        </div>

        {/* List of Public Workspaces */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Public Workspaces
          </h2>
          <ul className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200 dark:divide-gray-700 dark:border-gray-700">
            {profile.workspaces.length > 0 ? (
              profile.workspaces.map((workspace) => (
                <li key={workspace.id}>
                  <Link
                    href={`/space/${workspace.id}`}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="px-4 py-4 sm:px-6 flex items-center gap-4">
                      <Image
                        src={profile.image && profile.image.trim() !== '' ? profile.image : `https://source.boringavatars.com/beam/120/${profile.id}`}
                        alt={`${profile.name}'s avatar`}
                        width={48}
                        height={48}
                        className="rounded-full bg-gray-300 shadow-md"
                      />
                      <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{workspace.name}</p>
                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          Last updated on {new Date(workspace.updatedAt).toLocaleDateString('en-US')}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 text-center text-sm text-gray-500">
                This user has not made any workspaces public yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}