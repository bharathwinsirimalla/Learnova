import { Link } from 'react-router-dom'
import { FiArrowLeft, FiEdit3, FiPlus } from 'react-icons/fi'
import useCreatorCourses from '../../customHooks/useCreatorCourses'

const coursePlaceholderImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=480&q=80'

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

function Courses() {
  const { courses, isLoading, error } = useCreatorCourses()

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              aria-label="Back"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <FiArrowLeft className="text-xl" />
            </Link>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Educator</p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-950">Courses</h1>
            </div>
          </div>

          <Link
            to="/create-course"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <FiPlus className="text-lg" />
            Create Course
          </Link>
        </div>

        {isLoading ? (
          <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-500">Loading courses...</p>
          </section>
        ) : error ? (
          <section className="rounded-lg border border-rose-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-950">Could not load courses</h2>
            <p className="mt-2 text-sm font-medium text-rose-600">{error}</p>
          </section>
        ) : courses.length ? (
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Course
                    </th>
                    <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Price
                    </th>
                    <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {courses.map((course) => (
                    <tr key={course._id || course.title} className="transition hover:bg-blue-50/40">
                      <td className="min-w-[22rem] px-5 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={course.thumbnail || coursePlaceholderImage}
                            alt={course.title || 'Course thumbnail'}
                            className="h-16 w-24 shrink-0 rounded-lg border border-slate-200 bg-slate-50 object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-extrabold text-slate-950">
                              {course.title || 'Untitled Course'}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                              <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                                {course.category || 'No category'}
                              </span>
                              <span className="rounded-lg bg-slate-100 px-2.5 py-1 capitalize">
                                {course.level || 'Level not set'}
                              </span>
                              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-blue-700">
                                {getCount(course.lectures)} lectures
                              </span>
                              <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-violet-700">
                                {getCount(course.enrolledStudents)} students
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-extrabold text-slate-900">
                        {formatPrice(course.price)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-lg px-3 py-1 text-xs font-extrabold ${
                            course.isPublished
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <Link
                          to={`/edit-course/${course._id}`}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                        >
                          <FiEdit3 className="text-base" />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-950">No courses created yet</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Create your first course to start adding lectures and enrolling students.
            </p>
            <Link
              to="/create-course"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <FiPlus className="text-lg" />
              Create Course
            </Link>
          </section>
        )}
      </div>
    </main>
  )
}

export default Courses
