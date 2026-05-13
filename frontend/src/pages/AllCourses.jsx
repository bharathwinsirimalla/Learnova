import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiSearch } from 'react-icons/fi'
import Card from '../component/Card'

const defaultCategories = [
  'Development',
  'Design',
  'Data',
  'AI',
  'Cyber Security',
  'Business',
  'Marketing',
]

function AllCourses() {
  const { userData } = useSelector((state) => state.user)
  const [courses, setCourses] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const enrolledCourseIds = useMemo(() => {
    const list = userData?.enrolledCourses
    if (!Array.isArray(list)) {
      return new Set()
    }
    return new Set(list.map((entry) => String(entry?._id ?? entry)))
  }, [userData?.enrolledCourses])

  useEffect(() => {
    const fetchPublishedCourses = async () => {
      setIsLoading(true)
      setError('')

      try {
        const result = await axios.get('/api/course/getpublished')
        setCourses(Array.isArray(result.data) ? result.data : [])
      } catch (requestError) {
        setCourses([])
        setError(requestError.response?.data?.message || 'Failed to load courses.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublishedCourses()
  }, [])

  const categories = useMemo(() => {
    const courseCategories = courses.map((course) => course.category).filter(Boolean)
    return [...new Set([...defaultCategories, ...courseCategories])]
  }, [courses])

  const filteredCourses = useMemo(() => {
    if (!selectedCategories.length) {
      return courses
    }

    return courses.filter((course) => selectedCategories.includes(course.category))
  }, [courses, selectedCategories])

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category)
      }

      return [...prev, category]
    })
  }

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
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Courses</p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-950">All Courses</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-extrabold text-slate-950">Filter by Category</h2>

            <Link
              to="/search-courses"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-violet-200 bg-gradient-to-r from-blue-50 to-violet-50 px-4 py-3 text-sm font-bold text-violet-900 shadow-sm transition hover:border-blue-300 hover:from-blue-100 hover:to-violet-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <FiSearch className="text-base" />
              Search courses
            </Link>

            <div className="mt-6 space-y-3">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm font-bold text-slate-700 transition hover:bg-blue-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>

            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedCategories([])}
                className="mt-6 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Clear Filters
              </button>
            )}
          </aside>

          <section>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950">Published Courses</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-bold text-slate-500">Loading courses...</p>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-rose-100 bg-white p-8 text-center shadow-sm">
                <h3 className="text-xl font-extrabold text-slate-950">Could not load courses</h3>
                <p className="mt-2 text-sm font-medium text-rose-600">{error}</p>
              </div>
            ) : filteredCourses.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map((course) => (
                  <Card
                    key={course._id || course.title}
                    course={course}
                    to={`/view-course/${course._id}`}
                    inLibrary={enrolledCourseIds.has(String(course._id))}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <h3 className="text-xl font-extrabold text-slate-950">No courses found</h3>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Try clearing filters or checking back after more courses are published.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default AllCourses
