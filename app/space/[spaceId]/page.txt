'use client';

import { useEffect, useState } from 'react';
import Ably from 'ably';

// This component takes 'params' from the URL, e.g. /space/my-cool-space
export default function SpacePage({ params }: { params: { spaceId: string } }) {
  const [directoryText, setDirectoryText] = useState('project-root/\n  - folder1/\n  - file1.txt');
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    // I put this here so it runs when the page loads
    const password = prompt("Please enter the password for this space:");

    // We need to get a token from our own backend to use Ably
    const getToken = async () => {
      const response = await fetch('/api/ably-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spaceId: params.spaceId, password: password }),
      });
      const { token } = await response.json();

      const ablyClient = new Ably.Realtime({ token: token });
      setAbly(ablyClient);

      const channel = ablyClient.channels.get(`directory-planner:${params.spaceId}`);
      
      // Subscribe to directory changes
      channel.subscribe('directory-update', (message) => {
        setDirectoryText(message.data.text);
      });
    };

    getToken();
  }, []); // I added the empty array so it only runs once

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setDirectoryText(newText);
    // Send the update to other users
    ably?.channels.get(`directory-planner:${params.spaceId}`).publish('directory-update', { text: newText });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Workspace: {params.spaceId}</h1>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <h2 className="text-lg font-semibold">Directory Structure</h2>
          <textarea
            className="w-full h-96 p-2 font-mono bg-gray-100 dark:bg-gray-800 rounded-md"
            value={directoryText}
            onChange={handleTextChange}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Chat</h2>
          {/* Chat box will go here */}
        </div>
      </div>
    </div>
  );
}