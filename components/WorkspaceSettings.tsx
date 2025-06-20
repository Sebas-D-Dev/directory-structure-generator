'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'

/**
 * Defines the props for the WorkspaceSettings component.
 * @interface WorkspaceSettingsProps
 * @property {string} workspaceId - The ID of the current workspace.
 * @property {boolean} initialIsPublic - The initial public status of the workspace.
 */
interface WorkspaceSettingsProps {
  workspaceId: string
  initialIsPublic: boolean
}

/**
 * A component that provides settings controls for a workspace,
 * starting with a toggle to make the workspace public or private.
 */
export default function WorkspaceSettings({
  workspaceId,
  initialIsPublic,
}: WorkspaceSettingsProps) {
  // State to manage the toggle's on/off status. It's initialized with the prop.
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  // State to handle the loading/pending state of the API call.
  const [isLoading, setIsLoading] = useState(false)
  // State to display feedback to the user.
  const [statusMessage, setStatusMessage] = useState('')

  /**
   * Toggles the public status of the workspace.
   * This function is called when the user clicks the switch.
   * @param {boolean} checked The new value from the Switch component.
   */
  const handleToggle = async (checked: boolean) => {
    setIsLoading(true)
    setStatusMessage('')

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: checked }),
      })

      if (!response.ok) {
        throw new Error('Failed to update workspace status.')
      }

      // Update the local state to match the new status from the server.
      const updatedWorkspace = await response.json()
      setIsPublic(updatedWorkspace.isPublic)

      // Provide positive feedback to the user.
      setStatusMessage('Visibility updated successfully!')
      setTimeout(() => setStatusMessage(''), 3000) // Clear message after 3 seconds.
    } catch (error) {
      console.error(error)
      // Revert the toggle optimistic UI change on failure.
      setStatusMessage('Error: Could not update visibility.')
      setTimeout(() => setStatusMessage(''), 3000)
      setIsPublic(!checked) // Revert the switch to its original state.
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Settings</h3>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Public Workspace</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Allow anyone with the link to view this workspace.
          </p>
        </div>
        <Switch
          checked={isPublic}
          onChange={handleToggle}
          disabled={isLoading}
          className={`${
            isPublic ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50`}
        >
          <span className="sr-only">Make workspace public</span>
          <span
            aria-hidden="true"
            className={`${
              isPublic ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>
      {statusMessage && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{statusMessage}</p>
      )}
    </div>
  )
}
