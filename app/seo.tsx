import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata' // We'll still use this for general site info for now

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  // Allows passing any other valid Metadata properties
  [key: string]: unknown
}

/**
 * Generates SEO metadata for a given page.
 * @param {PageSEOProps} { title, description, image, ...rest }
 * @returns {Metadata} The generated metadata object for a Next.js page.
 */
export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  const pageTitle = `${title} | ${siteMetadata.title}`
  const pageDescription = description || siteMetadata.description
  const ogImage = image || siteMetadata.socialBanner

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: './', // Relative URL is fine here
      siteName: siteMetadata.title,
      images: ogImage ? [ogImage] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: ogImage ? [ogImage] : [],
    },
    ...rest,
  }
}
