'use client'

import { useEffect, useState } from 'react'
import WorkspaceCard from '@/components/WorkspaceCard'
import AppLayout from '@/layouts/AppLayout' // Using AppLayout for a consistent feel

// Define the shape of a single workspace object for the gallery.
interface GalleryWorkspace {
  id: string
  name: string
  updatedAt: string
  ownerName: string
  ownerImage: string
}

/**
 * The public gallery page, showcasing all user-submitted public workspaces.
 */
export default function GalleryPage() {
  const [workspaces, setWorkspaces] = useState<GalleryWorkspace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Effect to fetch the public workspaces when the component mounts.
  useEffect(() => {
    const fetchPublicWorkspaces = async () => {
      try {
        const response = await fetch('/api/gallery')
        if (!response.ok) {
          throw new Error('Could not load the gallery. Please try again later.')
        }
        const data: GalleryWorkspace[] = await response.json()
        setWorkspaces(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublicWorkspaces()
  }, []) // Empty dependency array ensures this runs only once on mount.

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500 dark:text-gray-400">Loading gallery...</p>
    }

    if (error) {
      return <p className="text-center text-red-500">{error}</p>
    }

    if (workspaces.length === 0) {
      return (
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            The Gallery is Empty
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to make a workspace public to have it featured here!
          </p>
        </div>
      )
    }

    return (
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} {...workspace} />
        ))}
      </ul>
    )
  }

  return (
    <AppLayout>
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
          Workspace Gallery
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          Discover useful project structures and templates shared by the community.
        </p>
      </div>
      <div>{renderContent()}</div>
    </AppLayout>
  )
}
