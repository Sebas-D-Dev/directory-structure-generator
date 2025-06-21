import Ably from 'ably';
import { auth } from '@/auth';
import { createClient } from '@supabase/supabase-js';

/**
 * This API route handles Ably token authentication.
 * It verifies a user's session and their permission to access a specific workspace
 * before issuing a temporary, secure token for the Ably client-side SDK.
 */
export async function POST(request: Request) {
  // 1. Get the current user's session using the new Auth.js v5 helper.
  const session = await auth();

  if (!session || !session.user?.id) {
    // If there's no session, the user is not authenticated.
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Parse the workspace ID from the request body.
  const { spaceId } = await request.json();
  if (!spaceId) {
    return new Response(JSON.stringify({ error: 'Workspace ID is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // 3. Verify that the user has permission to access this workspace.
  // We initialize the Supabase client here for serverless compatibility.
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('workspaces')
    .select('id')
    .eq('id', spaceId)
    .eq('ownerId', session.user.id) // Ensure the authenticated user owns the workspace
    .single();

  if (error || !data) {
    // If the query fails or returns no data, the user does not have permission.
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. If all checks pass, create a secure Ably token request.
  const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
  const tokenRequest = await ably.auth.createTokenRequest({
    clientId: session.user.id,
    capability: {
      // Grant permission to publish, subscribe, and be present on this specific channel.
      [`directory-planner:${spaceId}`]: ['subscribe', 'publish', 'presence'],
    },
  });

  return new Response(JSON.stringify(tokenRequest), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
