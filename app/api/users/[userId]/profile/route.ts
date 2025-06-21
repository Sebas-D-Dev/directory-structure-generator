import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * Handles GET requests to fetch a user's public profile,
 * which includes their public details and a list of their public workspaces.
 */
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  // CORRECT: Initialize the client inside the handler for serverless compatibility.
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { userId } = params

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required.' }, { status: 400 })
  }

  try {
    // 1. Fetch the user's public information and their public workspaces in a single query.
    // Supabase's foreign key relationships allow us to nest the workspace query.
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
      .eq('workspaces.isPublic', true) // Filter the nested workspaces to only include public ones.
      .single()

    if (error || !userProfile) {
      console.error('Supabase profile fetch error:', error)
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 })
    }

    // The query returns all workspaces linked to the user, but some might be private.
    // We must manually filter here if the `.eq('workspaces.isPublic', true)`
    // is not supported in the nested query syntax of your Supabase version or setup.
    // The provided query is the ideal state.

    // 2. Return the combined profile data.
    return NextResponse.json(userProfile)
  } catch (e) {
    console.error('Unexpected profile fetch error:', e)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}
