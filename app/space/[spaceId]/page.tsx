// app/space/[spaceId]/page.tsx (Revised)

'use client';

import { useState, useEffect } from 'react';
import { useAblyChannel } from '@/hooks/useAbly';
import { PasswordModal } from '@/components/PasswordModal'; // A new UI component

export default function SpacePage({ params }: { params: { spaceId: string } }) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(true);

  // This will be null until the user authenticates and we get a token
  const collaboration = token ? useAblyChannel(params.spaceId, token) : null;

  const handleAuth = async (password: string) => {
    try {
      const response = await fetch('/api/ably-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spaceId: params.spaceId, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed. Please check the password.');
      }
      
      const { token: authToken } = await response.json();
      setToken(authToken);
      setShowModal(false);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Render different UI for different states
  if (showModal) {
    return <PasswordModal spaceId={params.spaceId} onAuthenticate={handleAuth} error={error} />;
  }

  if (!collaboration) {
    return <div>Loading workspace...</div>;
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Workspace: {params.spaceId}</h1>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <h2 className="text-lg font-semibold">Directory Structure</h2>
          <textarea
            className="w-full h-96 p-2 font-mono bg-gray-100 dark:bg-gray-800 rounded-md focus:ring-2 focus:ring-blue-500"
            value={collaboration.currentDirectory}
            onChange={(e) => collaboration.updateDirectory(e.target.value)}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Chat</h2>
          {/* Chat box will be another component using the same token */}
        </div>
      </div>
    </div>
  );
}