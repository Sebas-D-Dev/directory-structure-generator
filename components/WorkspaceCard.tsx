'use client'

import Link from 'next/link'
import Image from 'next/image'

/**
 * Defines the props for the WorkspaceCard component.
 * This represents the flattened data structure from our gallery API.
 * @interface WorkspaceCardProps
 * @property {string} id - The unique ID of the workspace.
 * @property {string} name - The name of the workspace.
 * @property {string} updatedAt - The ISO string of the last update time.
 * @property {string} ownerName - The name of the workspace's owner.
 * @property {string} ownerImage - The URL for the owner's avatar image.
 */
interface WorkspaceCardProps {
  id: string
  name: string
  updatedAt: string
  ownerName: string
  ownerImage: string
}

/**
 * A card component designed to display a single public workspace in a gallery.
 * It shows the workspace name, owner information, and links to the public view.
 */
export default function WorkspaceCard({
  id,
  name,
  updatedAt,
  ownerName,
  ownerImage,
}: WorkspaceCardProps) {
  return (
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition-transform duration-200 hover:scale-105 dark:divide-gray-700 dark:bg-gray-800">
      <Link href={`/space/${id}`} className="block h-full">
        <div className="flex h-full w-full items-center justify-between space-x-6 p-6">
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">{name}</h3>
            </div>
            <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
              Last updated on {new Date(updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Image
              className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
              src={ownerImage || `https://source.boringavatars.com/beam/40/${id}`}
              alt={`${ownerName}'s avatar`}
              width={40}
              height={40}
            />
            <p className="truncate text-xs text-gray-500 dark:text-gray-400" title={ownerName}>
              By {ownerName}
            </p>
          </div>
        </div>
      </Link>
    </li>
  )
}
