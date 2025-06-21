'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AppLayout from '@/layouts/AppLayout'
import Link from 'next/link'
import NewWorkspaceModal from '@/components/NewWorkspaceModal'

// Define the shape of a workspace object.
interface Workspace {
  id: string
  name: string
  updatedAt: string
}

/**
 * The user dashboard page, now with functionality to create new workspaces.
 */
export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Effect to handle session status and redirect unauthenticated users.
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Effect to fetch the user's workspaces.
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchWorkspaces = async () => {
        setIsLoading(true)
        try {
          const response = await fetch('/api/workspaces')
          if (!response.ok) throw new Error('Failed to fetch workspaces.')
          const data: Workspace[] = await response.json()
          setWorkspaces(data)
        } catch (err) {
          setError('Could not load your workspaces.')
        } finally {
          setIsLoading(false)
        }
      }
      fetchWorkspaces()
    }
  }, [status])

  /**
   * Handles the creation of a new workspace.
   * This function is passed to the NewWorkspaceModal.
   * @param {string} name The name for the new workspace.
   */
  const handleCreateWorkspace = async (name: string) => {
    const response = await fetch('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      const { error } = await response.json()
      throw new Error(error || 'Failed to create workspace.')
    }

    const newWorkspace: Workspace = await response.json()

    // Optimistically update the UI before redirecting.
    setWorkspaces((prev) => [newWorkspace, ...prev])
    setIsModalOpen(false)

    // Redirect the user to their newly created workspace.
    router.push(`/space/${newWorkspace.id}`)
  }

  if (status === 'loading' || isLoading) {
    return (
      <AppLayout>
        <p>Loading...</p>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <p className="text-red-500">{error}</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Workspaces</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          New Workspace
        </button>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {workspaces.map((workspace) => (
                <li key={workspace.id} className="py-4">
                  <Link
                    href={`/space/${workspace.id}`}
                    className="block rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {workspace.name}
                        </p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          Last updated on {new Date(workspace.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-700 dark:text-gray-200">
                          Edit
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {workspaces.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">You haven&apos;t created any workspaces yet.</p>
                <p className="mt-1 text-sm text-gray-500">
                  Click &quot;New Workspace&quot; to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
