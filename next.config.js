import withBundleAnalyzer from '@next/bundle-analyzer'

// Define a secure and relevant Content Security Policy (CSP) for our platform
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: avatars.githubusercontent.com api.dicebear.com;
  font-src 'self';
  connect-src 'self' https://vjpbqcvnfgrlcdiwoxnb.supabase.co *.ably.io wss://*.ably.io;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove obsolete page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  eslint: {
    // Update ESLint to scan our new directory structure
    dirs: ['app', 'components', 'hooks', 'store', 'layouts'],
  },
  images: {
    // Add GitHub avatars to the list of allowed image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // This is fine, we can keep it.
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

// We only need the bundle analyzer now.
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig)
