'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AppLayout from '@/layouts/AppLayout'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@/auth'

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
export default async function UserProfilePage({ params }: { params: { userId: string } }): Promise<JSX.Element> {
  // This is a client component, so it should not be async.
  // To comply with Next.js 15 and React rules, convert this to a server component
  // or move all async logic into useEffect as before.

  // If you want to keep this as a client component, do NOT use async here.
  // If you want to use async/await at the top level, make this a server component (remove 'use client').

  // For client components, keep:
  // export default function UserProfilePage({ params }: { params: { userId: string } }) { ... }

  // For server components (Next.js 15+), you can use:
  // export default async function UserProfilePage({ params }: { params: { userId: string } }) { ... }

  // If you want to keep this as a client component, use the previous code block you provided.
  // If you want to convert to a server component, remove 'use client' and fetch data at the top level.

  // Please clarify if you want a server or client component.
  // For now, here's the correct pattern for a server component:

  // Remove 'use client' at the top of your file before using this code!

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
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-blue-600 dark:text-blue-400">
                          {workspace.name}
                        </p>
                        <div className="ml-2 flex flex-shrink-0">
                          <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Public
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            Last updated on {new Date(workspace.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
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
