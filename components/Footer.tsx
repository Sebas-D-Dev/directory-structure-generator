import Link from './Link'
import SocialIcon from '@/components/social-icons'

/**
 * The main site footer.
 * It contains essential copyright information and a minimal set of relevant links.
 */
export default function Footer() {
  const author = 'Sebas-D-Dev'
  const title = 'DirectLiveCollab'
  const githubUrl = 'https://github.com/Sebas-D-Dev/directory-structure-generator'

  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          {/* Social media links & icons */}
          <SocialIcon kind="mail" href={`mailto:${author}@gmail.com`} size={4} />
          <SocialIcon kind="github" href={githubUrl} size={4} />
          <SocialIcon kind="twitter" href="https://twitter.com/Sebas_D_Dev" size={4} />
          <SocialIcon kind="linkedin" href="https://www.linkedin.com/in/sebas-d-dev/" size={4} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{title}</Link>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Built with Next.js and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
