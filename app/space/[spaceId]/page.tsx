'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAblyChannel } from '@/hooks/useAbly'
import WorkspaceSettings from '@/components/WorkspaceSettings'
import AppLayout from '@/layouts/AppLayout'
import { use } from 'react'

// Expand the Workspace interface to include all necessary fields
interface Workspace {
  id: string
  name: string
  ownerId: string
  isPublic: boolean
  // Add other fields as needed
}

/**
 * The main collaboration page for a single workspace.
 * It now fetches workspace details to control settings visibility.
 */
/**
 * Renders the workspace page for a given space, handling authentication, real-time collaboration,
 * and workspace settings.
 *
 * - Fetches the Ably token for real-time updates and the workspace details on mount.
 * - Redirects unauthenticated users to the home page.
 * - Displays loading and error states as appropriate.
 * - Integrates real-time collaboration via a custom Ably channel hook.
 * - Allows the workspace owner to access workspace settings.
 *
 * @param params - Route parameters containing the `spaceId` of the workspace.
 * @returns The workspace page layout, including a collaborative directory editor and settings panel.
 */

export default function SpacePage({ params }: { params: Promise<{ spaceId: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { spaceId } = use(params)

  // State for the workspace data and the Ably token
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [ablyToken, setAblyToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Custom hook for Ably real-time functionality
  const collaboration = useAblyChannel(spaceId, ablyToken ?? '')

  // This effect runs once to fetch the Ably token and initial workspace data.
  useEffect(() => {
    async function getInitialData() {
      if (status === 'authenticated') {
        try {
          // Fetch the Ably token first
          const tokenRes = await fetch('/api/ably-auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spaceId }),
          })

          if (!tokenRes.ok) throw new Error('Could not authenticate for real-time connection.')
          const { token } = await tokenRes.json()
          setAblyToken(token)

          // Now fetch the workspace details for settings
          const workspaceRes = await fetch(`/api/workspaces/${spaceId}`)
          if (!workspaceRes.ok) throw new Error('Could not load workspace details.')
          const workspaceData: Workspace = await workspaceRes.json()
          setWorkspace(workspaceData)
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message)
          } else {
            setError('An unexpected error occurred.')
          }
        } finally {
          setIsLoading(false)
        }
      } else if (status === 'unauthenticated') {
        router.push('/')
      }
    }
    getInitialData()
  }, [status, spaceId, router])

  if (isLoading || status === 'loading') {
    return (
      <AppLayout>
        <p>Loading Workspace...</p>
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

  // Determine if the current user is the owner of the workspace.
  const isOwner = session?.user?.id === workspace?.ownerId

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-4 text-2xl font-bold">{workspace?.name}</h1>
          <textarea
            className="h-[60vh] w-full rounded-md bg-white p-4 font-mono shadow focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            value={collaboration?.currentDirectory ?? 'Loading content...'}
            onChange={(e) => collaboration?.updateDirectory(e.target.value)}
            disabled={!collaboration}
          />
        </div>
        <div className="space-y-6">
          {/* User Presence Component would go here */}

          {/* The WorkspaceSettings component is only rendered if the user is the owner. */}
          {isOwner && workspace && (
            <WorkspaceSettings workspaceId={workspace.id} initialIsPublic={workspace.isPublic} />
          )}

          {/* Other components like Chat would go here */}
        </div>
      </div>
    </AppLayout>
  )
}

