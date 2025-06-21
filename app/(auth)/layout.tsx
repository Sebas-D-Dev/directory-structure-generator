import AppLayout from '@/layouts/AppLayout'
import { ReactNode } from 'react'

/**
 * This layout wraps all authentication-related pages (like login and sign-up)
 * with the main AppLayout, ensuring a consistent look and feel.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}