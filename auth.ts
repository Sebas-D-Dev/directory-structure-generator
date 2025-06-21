import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import { createClient } from '@supabase/supabase-js'

// Your Supabase project's URL and anon key
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub, // Assuming you want to keep GitHub sign-in
    Credentials({
      // You can specify which fields should be submitted, but we'll handle it in the form.
      // credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Supabase must be initialized within the authorize function
        // using the anon key, as this is effectively a client-side call.
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            // This is crucial for Supabase to manage the user session correctly.
            autoRefreshToken: false,
            persistSession: false,
          },
        })

        // Use Supabase to verify the user's credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        })

        if (error || !data.user) {
          return null // Returning null triggers a credentials error
        }

        // If the user is authenticated, return the user object.
        // NextAuth will then create a session.
        return data.user
      },
    }),
  ],
  // You might have an adapter here if you are using one.
  // If you are using the Supabase adapter, make sure it's configured correctly.
  // e.g., adapter: SupabaseAdapter({ ... }),
})