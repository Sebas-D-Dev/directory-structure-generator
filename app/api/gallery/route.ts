import { createClient } from '@supabase/supabase-js'

/**
 * Handles GET requests to fetch all public workspaces for the gallery.
 * This is a public endpoint and does not require authentication.
 */
export async function GET(request: Request) {
  // CORRECT: Initialize the client inside the handler for each serverless invocation.
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select(
        `
        id,
        name,
        updatedAt,
        users (
          name,
          image
        )
      `
      )
      .eq('isPublic', true)
      .order('updatedAt', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Supabase gallery fetch error:', error)
      return new Response(JSON.stringify({ error: 'Failed to fetch public workspaces.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const formattedData = data.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      updatedAt: workspace.updatedAt,
      ownerName: workspace.users?.[0]?.name || 'Unknown User',
      ownerImage: workspace.users?.[0]?.image || '',
    }))

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Unexpected gallery error:', e)
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
