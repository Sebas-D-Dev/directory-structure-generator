import Ably from 'ably'
import { useEffect } from 'react'
import { useAppStore } from '@/store/appStore'

// A debounced function to avoid flooding the channel
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<F>): void => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }
}

export const useAblyChannel = (spaceId: string, accessToken: string) => {
  const { directoryText, setDirectoryText } = useAppStore()

  const ablyClient = new Ably.Realtime({ token: accessToken })
  const channel = ablyClient.channels.get(`directory-planner:${spaceId}`)

  // Debounce the publish function to send updates every 500ms max
  const debouncedPublish = debounce((text: string) => {
    channel.publish('directory-update', { text })
  }, 500)

  useEffect(() => {
    channel.subscribe('directory-update', (message) => {
      // Avoid updating state if we were the one who sent it
      if (ablyClient.connection.id !== message.connectionId) {
        setDirectoryText(message.data.text)
      }
    })

    return () => {
      channel.unsubscribe()
      ablyClient.close()
    }
  }, [channel, setDirectoryText, ablyClient.connection.id])

  const updateDirectory = (newText: string) => {
    setDirectoryText(newText) // Update local state immediately for responsiveness
    debouncedPublish(newText) // Send debounced update to others
  }

  return { currentDirectory: directoryText, updateDirectory }
}
