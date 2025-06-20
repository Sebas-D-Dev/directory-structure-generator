'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import Link from './Link'
import { useSession } from 'next-auth/react'

// Define the navigation links directly within the component.
// This removes the dependency on the deleted 'headerNavLinks.ts' file.
const navLinks = [
  { href: '/dashboard', title: 'Dashboard' },
  { href: '/gallery', title: 'Gallery' },
  // We can add more links here later, like '/pricing' or '/about'
]

/**
 * A mobile-first navigation menu that slides out.
 * It now handles its own navigation links and displays links conditionally
 * based on the user's authentication status.
 */
const MobileNav = () => {
  const { data: session } = useSession()
  const [navShow, setNavShow] = useState(false)
  const navRef = useRef(null)

  const onToggleNav = () => {
    setNavShow((prev: boolean) => {
      if (prev) {
        if (navRef.current) enableBodyScroll(navRef.current)
      } else {
        if (navRef.current) disableBodyScroll(navRef.current)
      }
      return !prev
    })
  }

  useEffect(() => {
    // Clean up the body scroll lock when the component unmounts.
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [])

  return (
    <>
      <button aria-label="Toggle Menu" onClick={onToggleNav} className="sm:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-gray-900 hover:text-blue-500 dark:text-gray-100 dark:hover:text-blue-400"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Transition appear show={navShow} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onToggleNav}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed right-0 top-0 z-50 h-full w-full max-w-xs bg-white/95 shadow-xl backdrop-blur-sm dark:bg-gray-950/95">
              <nav ref={navRef} className="mt-8 flex h-full flex-col p-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-3 text-2xl font-bold tracking-widest text-gray-900 hover:text-blue-500 dark:text-gray-100 dark:hover:text-blue-400"
                    onClick={onToggleNav}
                  >
                    {link.title}
                  </Link>
                ))}
              </nav>

              <button
                className="absolute right-4 top-4 h-8 w-8 text-gray-900 dark:text-gray-100"
                aria-label="Close Menu"
                onClick={onToggleNav}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileNav
