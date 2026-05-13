import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiBookOpen, FiEdit3, FiMail, FiShield, FiUser } from 'react-icons/fi'

function Profile() {
  const { userData } = useSelector((state) => state.user)
  const userInitial = userData?.name?.charAt(0).toUpperCase() || 'U'
  const enrolledCoursesCount = userData?.enrolledCourses?.length || 0

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex items-center gap-3">
          <Link
            to="/"
            aria-label="Back"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Account</p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-900">My Profile</h1>
          </div>
        </div>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-[linear-gradient(135deg,#006de8_0%,#7c2df0_58%,#10b981_100%)]" />

          <div className="px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {userData?.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    alt={userData.name || 'Profile'}
                    className="h-32 w-32 rounded-lg border-4 border-white bg-white object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-lg border-4 border-white bg-blue-50 text-5xl font-extrabold text-blue-700 shadow-sm">
                    {userInitial}
                  </div>
                )}

                <div className="min-w-0 pb-1">
                  <h2 className="truncate text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    {userData?.name || 'User Name'}
                  </h2>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold capitalize text-blue-700">
                    <FiShield className="text-base" />
                    {userData?.role || 'student'}
                  </div>
                </div>
              </div>

              <Link
                to="/edit-profile"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <FiEdit3 className="text-base" />
                Edit Profile
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <FiMail className="text-xl" />
                </span>
                <p className="mt-4 text-sm font-semibold text-slate-500">Email</p>
                <p className="mt-1 break-words text-base font-bold text-slate-800">
                  {userData?.email || 'email@example.com'}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <FiBookOpen className="text-xl" />
                </span>
                <p className="mt-4 text-sm font-semibold text-slate-500">Enrolled Courses</p>
                <p className="mt-1 text-3xl font-extrabold text-slate-900">
                  {enrolledCoursesCount}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                  <FiUser className="text-xl" />
                </span>
                <p className="mt-4 text-sm font-semibold text-slate-500">Role</p>
                <p className="mt-1 text-base font-bold capitalize text-slate-800">
                  {userData?.role || 'student'}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-500">Bio</p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                {userData?.description ||
                  'No bio added yet. Share a short description about your learning goals, interests, or teaching focus.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Profile
