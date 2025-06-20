import 'css/tailwind.css'
import { Space_Grotesk } from 'next/font/google'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import { ThemeProviders } from './theme-providers'
import Providers from './providers'
import { Metadata } from 'next'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

// NEW: Updated metadata to reflect the collaboration platform's identity.
export const metadata: Metadata = {
  title: {
    default: 'Live Collab Directory Planner',
    template: `%s | Live Collab Directory Planner`,
  },
  description:
    'Plan, collaborate, and build your project directory structures in real-time with your team.',
  openGraph: {
    title: 'Live Collab Directory Planner',
    description:
      'Plan, collaborate, and build your project directory structures in real-time with your team.',
    url: './',
    siteName: 'Live Collab Directory Planner',
    images: [
      // You should replace this with a new social banner for your app
      '/static/images/twitter-card.png',
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    title: 'Live Collab Directory Planner',
    card: 'summary_large_image',
    images: [
      // You should replace this with a new social banner for your app
      '/static/images/twitter-card.png',
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html lang="en" className={`${space_grotesk.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Favicon links etc. are fine as they are */}
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`${basePath}/static/favicons/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/static/favicons/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/static/favicons/favicon-16x16.png`}
        />
        <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      </head>
      <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white">
        <ThemeProviders>
          <Providers>
            <SectionContainer>
              <div className="flex h-screen flex-col justify-between font-sans">
                <Header />
                <main className="mb-auto">{children}</main>
                <Footer />
              </div>
            </SectionContainer>
          </Providers>
        </ThemeProviders>
      </body>
    </html>
  )
}
