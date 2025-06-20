import Link from './Link'
import SocialIcon from '@/components/social-icons'

/**
 * The main site footer.
 * It contains essential copyright information and a minimal set of relevant links.
 */
export default function Footer() {
  const author = 'Your Team Name'
  const title = 'Live Collab'
  const githubUrl = 'https://github.com' // Replace with your project's GitHub URL

  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          {/* We can add relevant social links here later if needed */}
          <SocialIcon kind="github" href={githubUrl} size={6} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{title}</Link>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          {/* This can be updated or removed as desired */}
          <p>Built with Next.js and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
