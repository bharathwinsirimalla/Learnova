import { Link } from 'react-router-dom'
import { FiPlayCircle, FiStar } from 'react-icons/fi'

const fallbackThumbnail =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&q=80'

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const getReviewRating = (reviews = []) => {
  if (!Array.isArray(reviews) || !reviews.length) {
    return 0
  }

  const ratings = reviews
    .map((review) => Number(review?.rating ?? review))
    .filter((rating) => Number.isFinite(rating) && rating > 0)

  if (!ratings.length) {
    return 0
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0)
  return total / ratings.length
}

function Card({ course = {}, to = '', className = '', inLibrary = false, showWatchStrip = false }) {
  const rating = Number(course.rating ?? course.averageRating ?? getReviewRating(course.reviews))
  const reviewCount = Array.isArray(course.reviews) ? course.reviews.length : Number(course.reviewCount) || 0
  const cardTo = to || (course._id ? `/view-course/${course._id}` : '')

  const content = (
    <article
      className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md ${className}`}
    >
      <div className="aspect-video overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail || fallbackThumbnail}
          alt={course.title || 'Course thumbnail'}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-extrabold text-slate-950">
              {course.title || 'Untitled Course'}
            </h3>
            <p className="mt-1 text-sm font-bold text-blue-700">
              {course.category || 'No category'}
            </p>
          </div>

          {inLibrary ? (
            <span className="inline-flex shrink-0 flex-col items-end gap-1 text-right">
              <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-900">
                In your library
              </span>
              <span className="text-[11px] font-bold text-slate-500">Full access</span>
            </span>
          ) : (
            <p className="shrink-0 text-sm font-extrabold text-slate-950">{formatPrice(course.price)}</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5 text-sm font-extrabold text-amber-500">
            <FiStar className="fill-current text-base" />
            <span>{rating ? rating.toFixed(1) : '0.0'}</span>
          </div>
          <p className="text-xs font-bold text-slate-500">
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {showWatchStrip && inLibrary ? (
          <div className="flex items-center justify-center gap-2 border-t border-emerald-100 bg-emerald-50/90 px-4 py-3 text-sm font-extrabold text-emerald-900">
            <FiPlayCircle className="text-lg text-emerald-700" />
            Watch now
          </div>
        ) : null}
      </div>
    </article>
  )

  if (cardTo) {
    return (
      <Link to={cardTo} className="block focus:outline-none focus:ring-4 focus:ring-blue-100">
        {content}
      </Link>
    )
  }

  return content
}

export default Card
