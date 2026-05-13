import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Card from './Card'

function CardPage() {
  const { userData } = useSelector((state) => state.user)
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPublishedCourses = async () => {
      setIsLoading(true)
      setError('')

      try {
        const result = await axios.get('/api/course/getpublished')
        setCourses(Array.isArray(result.data) ? result.data : [])
      } catch (requestError) {
        setCourses([])
        setError(requestError.response?.data?.message || 'Failed to load popular courses.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublishedCourses()
  }, [])

  const enrolledCourseIds = useMemo(() => {
    const list = userData?.enrolledCourses
    if (!Array.isArray(list)) {
      return new Set()
    }
    return new Set(list.map((entry) => String(entry?._id ?? entry)))
  }, [userData?.enrolledCourses])

  return (
    <section className="border-b border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase text-[#2563eb]">Popular learning</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Our Popular Courses
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Explore top-rated courses designed to boost your skills, enhance careers, and unlock
            opportunities in tech, AI, business, and beyond.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-sm font-bold text-slate-500">Loading popular courses...</p>
          </div>
        ) : error ? (
          <div className="mt-10 rounded-lg border border-rose-100 bg-rose-50 p-8 text-center">
            <p className="text-sm font-bold text-rose-600">{error}</p>
          </div>
        ) : courses.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <Card
                key={course._id || course.title}
                course={course}
                to={`/view-course/${course._id}`}
                inLibrary={enrolledCourseIds.has(String(course._id))}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <h3 className="text-xl font-extrabold text-slate-950">No published courses yet</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Published courses will appear here for learners to explore.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CardPage
