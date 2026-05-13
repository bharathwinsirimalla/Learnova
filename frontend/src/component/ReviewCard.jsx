import { Link } from 'react-router-dom'
import { FiStar } from 'react-icons/fi'

function formatReviewDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function ReviewCard({ review, showCourse = false }) {
  const user = review?.user || {}
  const course = review?.course
  const rating = Math.min(5, Math.max(0, Number(review?.rating) || 0))
  const comment = typeof review?.comment === 'string' ? review.comment.trim() : ''
  const displayName = user.name?.trim() || 'Learner'
  const initial = displayName.charAt(0).toUpperCase() || '?'
  const when = formatReviewDate(review?.reviewedAt || review?.createdAt)

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-extrabold text-white">
          {user.photoUrl ? (
            <img src={user.photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-extrabold text-slate-950">{displayName}</p>
            {when ? <span className="text-xs font-semibold text-slate-400">{when}</span> : null}
          </div>
          <div className="mt-1 flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                className={`text-sm ${
                  star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {showCourse && course?._id ? (
        <Link
          to={`/view-course/${course._id}`}
          className="mt-4 line-clamp-2 text-sm font-bold text-blue-700 transition hover:text-violet-700"
        >
          {course.title || 'Course'}
        </Link>
      ) : null}

      {comment ? (
        <p className="mt-3 flex-1 text-sm font-medium leading-6 text-slate-600">{comment}</p>
      ) : (
        <p className="mt-3 flex-1 text-sm font-semibold italic text-slate-400">No written comment.</p>
      )}
    </article>
  )
}

export default ReviewCard
