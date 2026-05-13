import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiBookOpen } from 'react-icons/fi'
import Card from '../component/Card'

const getCourseWatchPath = (course) => {
  const list = course?.lectures
  if (!Array.isArray(list) || list.length === 0) {
    return course?._id ? `/view-course/${course._id}` : ''
  }
  const first = list[0]
  const lectureId = first?._id ?? first
  if (!course?._id || !lectureId) {
    return course?._id ? `/view-course/${course._id}` : ''
  }
  return `/view-lecture/${course._id}/${lectureId}`
}

function MyCourses() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEnrolled = async () => {
      setIsLoading(true)
      setError('')

      try {
        const result = await axios.get('/api/user/enrolled-courses', { withCredentials: true })
        setCourses(Array.isArray(result.data) ? result.data : [])
      } catch (requestError) {
        setCourses([])
        setError(requestError.response?.data?.message || 'Failed to load your courses.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnrolled()
  }, [])

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label="Back to home"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <FiArrowLeft className="text-xl" />
            </Link>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Student workspace</p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-950">My courses</h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
                Continue where you left off. Each card opens your classroom on the first lesson—use your course
                page anytime for the full overview.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-500">Loading your courses…</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-100 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-950">Could not load courses</h2>
            <p className="mt-2 text-sm font-medium text-rose-600">{error}</p>
            <Link
              to="/all-courses"
              className="mt-6 inline-block text-sm font-bold text-blue-700 underline-offset-2 hover:underline"
            >
              Browse all courses
            </Link>
          </div>
        ) : courses.length ? (
          <section>
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-extrabold text-slate-950">Your enrollments</h2>
              <p className="text-sm font-semibold text-slate-500">
                {courses.length} {courses.length === 1 ? 'course' : 'courses'}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => {
                const watchPath = getCourseWatchPath(course)
                return (
                <Card
                  key={course._id || course.title}
                  course={course}
                  to={watchPath}
                  inLibrary
                  showWatchStrip={watchPath.includes('/view-lecture/')}
                />
                )
              })}
            </div>
          </section>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <FiBookOpen className="text-2xl" />
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-slate-950">No enrollments yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-600">
              When you purchase a course, it will show up here so you can jump back in anytime.
            </p>
            <Link
              to="/all-courses"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Explore courses
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

export default MyCourses
