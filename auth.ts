import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    session({ session, user }) {
      // Add the user's ID to the session object for server-side access
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)