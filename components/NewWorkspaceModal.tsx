'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

/**
 * Defines the props for the NewWorkspaceModal component.
 * @interface NewWorkspaceModalProps
 * @property {boolean} isOpen - Controls whether the modal is visible.
 * @property {() => void} onClose - Function to call when the modal should be closed.
 * @property {(name: string) => Promise<void>} onCreate - Async function to call when the user submits the form.
 */
interface NewWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

/**
 * A modal dialog component for creating a new workspace.
 * It provides a form for the user to enter a name for their new workspace.
 */
export default function NewWorkspaceModal({ isOpen, onClose, onCreate }: NewWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isCreating) return;

    setIsCreating(true);
    setError(null);

    try {
      await onCreate(name);
      // The parent component will be responsible for closing the modal on success.
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsCreating(false);
    }
  };
  
  // Reset form state when the modal is closed.
  const handleClose = () => {
    setName('');
    setError(null);
    setIsCreating(false);
    onClose();
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Create a New Workspace
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  <div className="mt-4">
                    <label htmlFor="workspace-name" className="sr-only">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      name="workspace-name"
                      id="workspace-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                      placeholder="e.g., My Awesome Project"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                  )}
                  <div className="mt-6 flex justify-end gap-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
                      disabled={isCreating}
                    >
                      {isCreating ? 'Creating...' : 'Create Workspace'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
