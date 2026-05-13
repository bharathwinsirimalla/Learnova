import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiMessageCircle } from 'react-icons/fi'
import ReviewCard from './ReviewCard'

function ReviewPage() {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const { data } = await axios.get('/api/review/recent?limit=6')
        setReviews(Array.isArray(data) ? data : [])
      } catch {
        setReviews([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#7c2df0]">
              <FiMessageCircle className="text-base" />
              Community voices
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              What learners are saying
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Recent reviews from published courses—honest ratings and notes from people who studied
              on Learnova.
            </p>
          </div>
          <Link
            to="/all-courses"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 md:self-auto"
          >
            Browse courses
            <FiArrowRight className="text-base" />
          </Link>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((key) => (
                <div
                  key={key}
                  className="h-48 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : reviews.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((item) => (
                <ReviewCard key={item._id} review={item} showCourse />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <p className="text-sm font-bold text-slate-600">No public reviews yet.</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Reviews will appear here as learners complete courses.
              </p>
              <Link
                to="/all-courses"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-violet-700"
              >
                Explore catalog
                <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ReviewPage
