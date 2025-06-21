import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server'
import { auth } from '@/auth';

// This API route handles user profile updates.
export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  // Initialize the Supabase client
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json({ error: 'Supabase environment variables are not set.' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Get the current user's session
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch (err) {
    // Log generic error message instead of error details
    console.error('Invalid JSON in request body.');
    return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Request body must be a valid JSON object.' }, { status: 400 });
  }

  const { name, bio } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }

  try {
    // Update the user's profile in the database
    const { data, error } = await supabase
      .from('users')
      .update({ name, bio })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      // Log generic error message instead of error details
      console.error('Supabase PATCH error occurred.');
      return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    // Log only the error message to avoid exposing sensitive information
    console.error('Unexpected PATCH error:', (e instanceof Error ? e.message : e));
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}