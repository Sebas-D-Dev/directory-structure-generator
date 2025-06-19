import { getServerSession } from 'next-auth/next';
import { createClient } from '@supabase/supabase-js';
import { authOptions } from '../auth/[...nextauth]/route';

// Initialize the Supabase client.
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Handles GET requests to fetch the workspaces for the currently authenticated user.
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select('id, name, updatedAt')
      .eq('ownerId', session.user.id)
      .order('updatedAt', { ascending: false });

    if (error) {
      console.error('Supabase GET error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch workspaces' }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (e) {
    console.error('Unexpected GET error:', e);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
  }
}


/**
 * Handles POST requests to create a new workspace for the authenticated user.
 * @param {Request} request The incoming request object, expecting a JSON body with a 'name' property.
 * @returns {Response} A JSON response containing the newly created workspace or an error.
 */
export async function POST(request: Request) {
  // 1. Authenticate the user.
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 2. Validate the request body.
  let name: string;
  try {
    const body = await request.json();
    name = body.name;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Workspace name is required.' }), { status: 400 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400 });
  }


  // 3. Insert the new workspace into the database.
  try {
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name: name.trim(),
        ownerId: session.user.id,
        content: `Welcome to ${name.trim()}!\n\n- Getting Started\n  - Add files and folders\n  - Invite collaborators`, // Provide some default content.
      })
      .select('id, name, updatedAt') // Return the newly created record.
      .single(); // We expect to insert and return only one record.

    if (error) {
      console.error('Supabase POST error:', error);
      return new Response(JSON.stringify({ error: 'Failed to create workspace.' }), { status: 500 });
    }

    // 4. Return the newly created workspace data.
    return new Response(JSON.stringify(data), { status: 201 }); // 201 Created

  } catch (e) {
    console.error('Unexpected POST error:', e);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500 });
  }
}
