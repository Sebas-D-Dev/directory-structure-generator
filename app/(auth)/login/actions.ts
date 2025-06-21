'use server'

import { signIn } from '@/auth'
import { createClient } from '@/utils/supabase/server'
import { AuthError } from 'next-auth'

/**
 * Server action to handle user login via credentials.
 * It uses the signIn function from NextAuth.js.
 */
export async function login(prevState: string | undefined, formData: FormData) {
  try {
    // The 'signIn' function from NextAuth.js will handle the credential validation
    // by invoking the 'authorize' function in your Credentials provider.
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    // IMPORTANT: You must re-throw the error for Next.js to redirect automatically.
    // If you don't, the user will stay on the login page.
    throw error
  }
}

/**
 * Server action to handle user signup.
 * It creates a user in Supabase and then programmatically signs them in.
 */
export async function signup(prevState: string | undefined, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // In a real app, you'd want robust validation here.
  if (!email || !password) return 'Email and password are required.'

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    console.error('Supabase signup error:', error)
    return 'Could not create account. The email may already be in use.'
  }

  // After successful signup, automatically sign the user in.
  await signIn('credentials', formData)
}