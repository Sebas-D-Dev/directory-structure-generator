import { MetadataRoute } from 'next'

/**
 * Generates the robots.txt file for the application.
 * This file provides instructions to web crawlers.
 * @returns {MetadataRoute.Robots} The robots.txt configuration.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*', // Applies to all web crawlers
        allow: '/', // Allow crawling of all pages by default
        disallow: '/api/', // Disallow crawling of our API routes
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
