'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Image
          src={session.user?.image!}
          alt={session.user?.name || 'User Avatar'}
          width={32}
          height={32}
          className="rounded-full"
        />
        <button
          onClick={() => signOut()}
          className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="rounded-md bg-gray-800 px-4 py-1 text-sm font-medium text-white hover:bg-black"
    >
      Sign In
    </button>
  )
}
