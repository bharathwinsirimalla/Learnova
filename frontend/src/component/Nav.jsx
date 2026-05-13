import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiBookOpen, FiGrid, FiLogIn, FiLogOut, FiMenu, FiSearch, FiUser, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { setUserData } from '../redux/userSlice'
import Logo from './Logo'

function Nav() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const userInitial = userData?.name?.charAt(0).toUpperCase() || 'U'

  const closeMenus = () => {
    setShowProfileMenu(false)
    setShowMobileMenu(false)
  }

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout', {
        withCredentials: true,
      })

      dispatch(setUserData(null))
      closeMenus()
      toast.success('Logged out successfully.')
      navigate('/')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Logout failed. Please try again.'
      toast.error(errorMessage)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="flex h-12 w-20 shrink-0 justify-center" imageClassName="h-full w-full" />
        </Link>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/search-courses"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-900"
          >
            <FiSearch className="text-base" />
            Search courses
          </Link>
          {userData ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition hover:ring-4 hover:ring-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  aria-label="Open profile menu"
                >
                  {userData.photoUrl ? (
                    <img
                      src={userData.photoUrl}
                      alt={userData.name || 'Profile'}
                      className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-sm font-bold text-[#2563eb]">
                      {userInitial}
                    </span>
                  )}
                </button>

                <div
                  className={`absolute right-0 top-12 w-44 origin-top-right overflow-hidden rounded-lg border border-slate-200 bg-white py-2 shadow-md transition-all duration-200 ease-out ${
                    showProfileMenu
                      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                      : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
                  }`}
                >
                  <Link
                    to="/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-[#2563eb]"
                  >
                    <FiUser className="text-base" />
                    My Profile
                  </Link>
                  <Link
                    to={userData.role === 'educator' ? '/courses' : '/my-courses'}
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-[#7c2df0]"
                  >
                    <FiBookOpen className="text-base" />
                    {userData.role === 'educator' ? 'Courses' : 'My Courses'}
                  </Link>
                </div>
              </div>

              {userData.role === 'educator' && (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563eb]"
                  >
                    <FiGrid className="text-base" />
                    Dashboard
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#2563eb] focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <FiLogOut className="text-base" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2563eb] focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <FiLogIn className="text-base" />
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setShowMobileMenu((prev) => !prev)
            setShowProfileMenu(false)
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563eb] focus:outline-none focus:ring-4 focus:ring-blue-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          {showMobileMenu ? (
            <FiX className="text-xl transition-transform duration-200 rotate-90" />
          ) : (
            <FiMenu className="text-xl transition-transform duration-200" />
          )}
        </button>
      </nav>

      <div
        className={`fixed left-0 right-0 top-16 overflow-hidden bg-white px-4 shadow-md transition-all duration-300 ease-out lg:hidden ${
          showMobileMenu
            ? 'pointer-events-auto max-h-[520px] border-t border-slate-200 py-4 opacity-100'
            : 'pointer-events-none max-h-0 border-t-0 border-transparent py-0 opacity-0'
        }`}
      >
          <div className="mx-auto max-w-7xl space-y-3">
            <Link
              to="/search-courses"
              onClick={closeMenus}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-900"
            >
              <FiSearch className="text-base" />
              Search courses
            </Link>
            {userData ? (
              <>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-3">
                  {userData.photoUrl ? (
                    <img
                      src={userData.photoUrl}
                      alt={userData.name || 'Profile'}
                      className="h-11 w-11 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-sm font-bold text-[#2563eb]">
                      {userInitial}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-950">{userData.name || 'User'}</p>
                    <p className="truncate text-xs font-medium capitalize text-slate-500">{userData.role}</p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-[#2563eb]"
                >
                  <FiUser className="text-base" />
                  My Profile
                </Link>

                <Link
                  to={userData.role === 'educator' ? '/courses' : '/my-courses'}
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-[#7c2df0]"
                >
                  <FiBookOpen className="text-base" />
                  {userData.role === 'educator' ? 'Courses' : 'My Courses'}
                </Link>

                {userData.role === 'educator' && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-[#2563eb]"
                    >
                      <FiGrid className="text-base" />
                      Dashboard
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                >
                  <FiLogOut className="text-base" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenus}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-[#2563eb]"
              >
                <FiLogIn className="text-base" />
                Login
              </Link>
            )}
          </div>
        </div>
    </header>
  )
}

export default Nav
