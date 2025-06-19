'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />;
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
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="px-4 py-1 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-black"
    >
      Sign In
    </button>
  );
}