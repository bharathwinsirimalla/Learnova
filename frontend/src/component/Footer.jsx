import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiBookOpen, FiGrid, FiLayers, FiLogIn, FiMail, FiUser } from 'react-icons/fi'
import Logo from './Logo'

const footerLink =
  'text-sm font-semibold text-slate-400 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-sm'

function Footer() {
  const { userData } = useSelector((state) => state.user)
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50">
              <Logo className="flex h-11 w-[5.5rem] shrink-0 justify-center" imageClassName="h-full w-full object-contain" />
            </Link>
            <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-slate-400">
              Learnova is a focused LMS for browsing courses, enrolling with confidence, and learning in
              a calm, modern classroom experience.
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Learn</p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className={footerLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/all-courses" className={footerLink}>
                  All courses
                </Link>
              </li>
              {userData && userData.role !== 'educator' ? (
                <li>
                  <Link to="/my-courses" className={footerLink}>
                    My courses
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Account</p>
            <ul className="mt-4 space-y-3">
              {userData ? (
                <>
                  <li>
                    <Link to="/profile" className={footerLink}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/edit-profile" className={footerLink}>
                      Edit profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className={`${footerLink} inline-flex items-center gap-2`}>
                      <FiLogIn className="text-base opacity-80" />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className={footerLink}>
                      Create account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Teach</p>
            <ul className="mt-4 space-y-3">
              {userData?.role === 'educator' ? (
                <>
                  <li>
                    <Link to="/dashboard" className={`${footerLink} inline-flex items-center gap-2`}>
                      <FiGrid className="text-base opacity-80" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/courses" className={`${footerLink} inline-flex items-center gap-2`}>
                      <FiBookOpen className="text-base opacity-80" />
                      Your courses
                    </Link>
                  </li>
                  <li>
                    <Link to="/create-course" className={`${footerLink} inline-flex items-center gap-2`}>
                      <FiLayers className="text-base opacity-80" />
                      Create course
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/signup" className={footerLink}>
                      Become an educator
                    </Link>
                  </li>
                  <li>
                    <span className="text-sm font-medium leading-6 text-slate-500">
                      Publish lessons, set pricing, and reach learners from one workspace.
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Legal</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className={footerLink}>
                  Privacy
                </a>
              </li>
              <li>
  <a
    href="mailto:studyatlearnova@gmail.com"
    className={`${footerLink} inline-flex items-center gap-2`}
  >
    <FiMail className="text-base opacity-80" />
    studyatlearnova@gmail.com
  </a>
</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-slate-500">
            © {year} Learnova. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <FiUser className="text-slate-600" aria-hidden />
            <span>Built for students and educators.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
