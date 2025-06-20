import { getServerSession } from 'next-auth/next'
import { createClient } from '@supabase/supabase-js'
import Ably from 'ably'
import { authOptions } from '../auth/[...nextauth]/route' // Assuming authOptions are exported

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY })

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { spaceId } = await request.json()

  // Check if the user has permission to access this workspace
  const { data, error } = await supabase
    .from('workspaces')
    .select('id')
    .eq('id', spaceId)
    .eq('ownerId', session.user.id) // Simplified check for Phase 1
    .single()

  if (error || !data) {
    return new Response('Forbidden', { status: 403 })
  }

  // User has permission, create and return an Ably token
  const tokenRequest = await ably.auth.createTokenRequest({
    clientId: session.user.id,
    capability: {
      [`directory-planner:${spaceId}`]: ['subscribe', 'publish', 'presence'],
    },
  })

  return new Response(JSON.stringify(tokenRequest), { status: 200 })
}
