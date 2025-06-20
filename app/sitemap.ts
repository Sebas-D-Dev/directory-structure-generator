import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

// This is a server-side-only file, so we can securely use the service role key.
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

/**
 * Generates the sitemap.xml file for the application.
 * This helps search engines discover and index the platform's pages.
 * @returns {Promise<MetadataRoute.Sitemap>} The sitemap object.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  // 1. Define the static routes of your application.
  const staticRoutes = ['', '/gallery', '/dashboard'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamically fetch all public workspaces to add them to the sitemap.
  const { data: publicWorkspaces } = await supabase
    .from('workspaces')
    .select('id, updatedAt')
    .eq('isPublic', true);
  
  const workspaceRoutes = (publicWorkspaces || []).map(({ id, updatedAt }) => ({
    url: `${siteUrl}/space/${id}`,
    lastModified: new Date(updatedAt).toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 3. Dynamically fetch all users to create links to their profile pages.
  const { data: users } = await supabase.from('users').select('id')

  const profileRoutes = (users || []).map(({ id }) => ({
    url: `${siteUrl}/u/${id}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // 4. Combine all routes into a single sitemap.
  return [...staticRoutes, ...workspaceRoutes, ...profileRoutes];
}
