import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiArrowLeft, FiBookOpen, FiPlus, FiUsers } from 'react-icons/fi'
import useCreatorCourses from '../../customHooks/useCreatorCourses'

const getCount = (value) => {
  if (Array.isArray(value)) {
    return value.length
  }

  return Number(value) || 0
}

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

function BarChart({ title, subtitle, icon: Icon, data, colorClass, shadowClass }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{subtitle}</p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-950">{title}</h2>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
          <Icon className="text-xl" />
        </span>
      </div>

      <div className="mt-6 flex h-64 items-end gap-4 rounded-lg bg-slate-50 px-4 pb-4 pt-6">
        {data.map((item) => {
          const height = `${Math.max((item.value / maxValue) * 100, item.value ? 12 : 4)}%`

          return (
            <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-3">
              <div className="flex min-h-6 items-center justify-center text-sm font-extrabold text-slate-700">
                {item.value}
              </div>
              <div className="flex h-full items-end">
                <div
                  className={`w-full rounded-t-lg ${colorClass} shadow-md ${shadowClass} transition hover:opacity-90`}
                  style={{ height }}
                  title={`${item.label}: ${item.value}`}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="mt-4 grid gap-2 text-center text-xs font-bold text-slate-500"
        style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
      >
        {data.map((item) => (
          <span key={item.label} className="truncate" title={item.label}>
            {item.label}
          </span>
        ))}
      </div>
    </section>
  )
}

function Dashboard() {
  const { userData } = useSelector((state) => state.user)
  const { courses, isLoading: isCoursesLoading } = useCreatorCourses()
  const userInitial = userData?.name?.charAt(0).toUpperCase() || 'E'
  const chartCourses = courses.length ? courses : [{ title: 'No courses', lectures: [], enrolledStudents: [] }]
  const totalEarning = courses.reduce((total, course) => {
    return total + (Number(course.price) || 0) * getCount(course.enrolledStudents)
  }, 0)
  const lectureChartData = chartCourses.map((course) => ({
    label: course.title || 'Course',
    value: getCount(course.lectures),
  }))
  const enrollmentChartData = chartCourses.map((course) => ({
    label: course.title || 'Course',
    value: getCount(course.enrolledStudents),
  }))

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-center gap-3">
          <Link
            to="/"
            aria-label="Back"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Educator</p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-950">Dashboard</h1>
          </div>
        </div>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-[linear-gradient(135deg,#006de8_0%,#7c2df0_58%,#10b981_100%)]" />

          <div className="px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {userData?.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    alt={userData.name || 'Educator profile'}
                    className="h-28 w-28 rounded-lg border-4 border-white bg-white object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-lg border-4 border-white bg-blue-50 text-5xl font-extrabold text-blue-700 shadow-sm">
                    {userInitial}
                  </div>
                )}

                <div className="min-w-0 pb-1">
                  <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Educator Dashboard</p>
                  <h1 className="mt-2 truncate text-3xl font-extrabold text-slate-950 sm:text-4xl">
                    Welcome {userData?.name || 'Educator'}
                  </h1>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/courses"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
                >
                  <FiBookOpen className="text-lg" />
                  Courses
                </Link>

                <Link
                  to="/create-course"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <FiPlus className="text-lg" />
                  Create Courses
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <span className="text-sm font-extrabold">INR</span>
                </span>
                <p className="mt-4 text-sm font-semibold text-slate-500">Total Earning</p>
                <p className="mt-1 text-3xl font-extrabold text-slate-950">
                  {formatPrice(totalEarning)}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                  <FiBookOpen className="text-xl" />
                </span>
                <p className="mt-4 text-sm font-semibold text-slate-500">Active Courses</p>
                <p className="mt-1 text-3xl font-extrabold text-slate-950">
                  {isCoursesLoading ? '...' : courses.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <BarChart
            title="Course Progress"
            subtitle="Lectures uploaded per course"
            icon={FiBookOpen}
            data={lectureChartData}
            colorClass="bg-blue-600"
            shadowClass="shadow-blue-200"
          />
          <BarChart
            title="Student Enrollment"
            subtitle="Students enrolled per course"
            icon={FiUsers}
            data={enrollmentChartData}
            colorClass="bg-violet-600"
            shadowClass="shadow-violet-200"
          />
        </div>
      </div>
    </main>
  )
}

export default Dashboard
