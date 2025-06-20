import { createClient } from '@supabase/supabase-js'
import { auth } from '@/auth'

/**
 * Defines the shape of the route parameters for dynamic segments.
 */
interface RouteParams {
  workspaceId: string;
}

/**
 * Handles GET requests to fetch a single workspace by its ID.
 * This endpoint has special logic to handle public vs. private workspaces.
 */
export async function GET(request: Request, { params }: { params: Promise<RouteParams> }) {
  const { workspaceId } = await params;

  // Initialize the client inside the handler for serverless compatibility.
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const session = await auth() // CORRECT: Use the new `auth()` helper
  const userId = session?.user?.id

  try {
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .select('id, name, content, isPublic, ownerId')
      .eq('id', workspaceId)
      .single()

    if (error || !workspace) {
      return new Response(JSON.stringify({ error: 'Workspace not found.' }), { status: 404 })
    }

    if (workspace.isPublic) {
      return new Response(JSON.stringify(workspace), { status: 200 })
    }

    if (!userId || userId !== workspace.ownerId) {
      return new Response(JSON.stringify({ error: 'Permission denied.' }), { status: 403 })
    }

    return new Response(JSON.stringify(workspace), { status: 200 })
  } catch (e) {
    console.error('Unexpected GET error:', e)
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500 })
  }
}

/**
 * Handles PATCH requests to update a specific workspace.
 * This is used to change properties like the 'isPublic' status.
 */
export async function PATCH(request: Request, { params }: { params: Promise<RouteParams> }) {
  const { workspaceId } = await params;

  // Initialize the client inside the handler.
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const session = await auth(); // CORRECT: Use the new `auth()` helper
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  const userId = session.user.id

  let isPublic: boolean
  try {
    const body = await request.json()
    isPublic = body.isPublic
    if (typeof isPublic !== 'boolean') {
      return new Response(JSON.stringify({ error: "Invalid 'isPublic' value." }), { status: 400 })
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('workspaces')
      .update({
        isPublic: isPublic,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', workspaceId)
      .eq('ownerId', userId)
      .select('id, isPublic')
      .single()

    if (error) {
      console.error('Supabase PATCH error:', error)
      return new Response(JSON.stringify({ error: 'Workspace not found or permission denied.' }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (e) {
    console.error('Unexpected PATCH error:', e)
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500 })
  }
}
