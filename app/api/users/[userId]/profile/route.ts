import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

interface RouteParams {
  userId: string;
}

/**
 * Handles GET requests to fetch a user's public profile and their public workspaces.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<RouteParams> }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { data: userProfile, error } = await supabase
      .from('users')
      .select(
        `
         id,
         name,
         image,
         workspaces (
           id,
           name,
           updatedAt
         )
       `
      )
      .eq('id', userId)
      .eq('workspaces.isPublic', true)
      .single();

    if (error || !userProfile) {
      console.error('Supabase profile fetch error:', error);
      return NextResponse.json(
        { error: 'User profile not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(userProfile);
  } catch (e) {
    console.error('Unexpected profile fetch error:', e);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

/**
 * Handles PATCH requests to update a user's profile.
 * A user can only update their own profile.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<RouteParams> }
) {
  const { userId } = await params;
  const session = await auth();

  // Authorization check: Ensure the logged-in user is the one being updated.
  if (!session?.user || session.user.id !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await request.json();
    // Assuming we can update 'name' and 'image'
    const { name, image } = body;

    const updateData: { name?: string; image?: string } = {};
    if (name && typeof name === 'string') updateData.name = name;
    if (image && typeof image === 'string') updateData.image = image;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid update data provided.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, name, image')
      .single();

    if (error) {
      console.error('Supabase profile update error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile.' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}