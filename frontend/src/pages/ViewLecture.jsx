import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiLock,
  FiPlayCircle,
  FiVideo,
} from 'react-icons/fi'

const fallbackThumbnail =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'

function ViewLecture() {
  const { courseId, lectureId } = useParams()
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)

  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const result = await axios.get(`/api/course/viewcourse/${courseId}`)
        const next = result.data?.course
        if (!next?._id) {
          setError('Course not found.')
          setCourse(null)
        } else {
          setCourse(next)
        }
      } catch (requestError) {
        setCourse(null)
        setError(requestError.response?.data?.message || 'Failed to load course.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [courseId])

  const lectures = useMemo(() => (Array.isArray(course?.lectures) ? course.lectures : []), [course])

  const isEnrolled = useMemo(() => {
    const list = userData?.enrolledCourses
    if (!Array.isArray(list) || !courseId) {
      return false
    }
    return list.some((entry) => String(entry?._id ?? entry) === String(courseId))
  }, [userData?.enrolledCourses, courseId])

  const isCourseCreator = useMemo(() => {
    if (userData?.role !== 'educator' || !course) {
      return false
    }
    const creatorId = course.creator?._id ?? course.creator
    return Boolean(creatorId && String(creatorId) === String(userData._id))
  }, [course, userData?._id, userData?.role])

  const canWatch = (lecture) => Boolean(isEnrolled || isCourseCreator || lecture?.isPreviewFree)

  const activeLecture = useMemo(
    () => lectures.find((lecture) => String(lecture._id) === String(lectureId)),
    [lectures, lectureId],
  )

  const canWatchActive = Boolean(activeLecture && canWatch(activeLecture))

  useEffect(() => {
    if (!course || !lectures.length || !lectureId) {
      return
    }
    const exists = lectures.some((lecture) => String(lecture._id) === String(lectureId))
    if (!exists) {
      const fallback = lectures[0]
      if (fallback?._id) {
        navigate(`/view-lecture/${courseId}/${fallback._id}`, { replace: true })
      }
    }
  }, [course, courseId, lectureId, lectures, navigate])

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-500">Loading lesson…</p>
        </div>
      </main>
    )
  }

  if (error || !course) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-rose-100 bg-white p-10 text-center shadow-sm">
          <h1 className="text-xl font-extrabold text-slate-950">Could not open this lesson</h1>
          <p className="mt-2 text-sm font-semibold text-rose-600">{error}</p>
          <Link
            to="/all-courses"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Browse courses
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back to previous page"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Course</p>
            <p className="truncate text-sm font-extrabold text-slate-700">{course.title || 'Untitled course'}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
          {/* Left: lecture preview / player */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Now playing</p>
                <h1 className="mt-1 text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
                  {activeLecture?.lectureTitle || 'Select a lesson'}
                </h1>
              </div>
              {isEnrolled ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-emerald-900">
                  <FiCheckCircle className="text-sm" />
                  Enrolled
                </span>
              ) : isCourseCreator ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-violet-900">
                  Instructor
                </span>
              ) : activeLecture?.isPreviewFree ? (
                <span className="inline-flex shrink-0 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-blue-800">
                  Free preview
                </span>
              ) : null}
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-inner">
              {activeLecture?.videoUrl && canWatchActive ? (
                <video
                  key={activeLecture.videoUrl}
                  src={activeLecture.videoUrl}
                  controls
                  playsInline
                  className="aspect-video w-full bg-slate-950"
                />
              ) : (
                <div className="relative flex aspect-video flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-900 to-slate-950 px-6 text-center text-slate-200">
                  <img
                    src={course.thumbnail || fallbackThumbnail}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-25"
                  />
                  <div className="relative z-[1] flex flex-col items-center gap-2">
                    {activeLecture && !canWatchActive ? (
                      <FiLock className="text-4xl text-amber-400/90" />
                    ) : (
                      <FiVideo className="text-4xl text-slate-400" />
                    )}
                    <p className="max-w-sm text-sm font-bold leading-6">
                      {activeLecture && !canWatchActive
                        ? 'This lesson is included with the full course. Enroll to unlock every lecture.'
                        : activeLecture && canWatchActive && !activeLecture.videoUrl
                          ? 'Video is not available for this lesson yet.'
                          : 'Choose a lesson from the list on the right.'}
                    </p>
                    {activeLecture && !canWatchActive ? (
                      <Link
                        to={`/view-course/${courseId}`}
                        replace
                        className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
                      >
                        View course & enroll
                      </Link>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <p className="mt-4 text-sm font-medium leading-6 text-slate-600">
              {canWatchActive
                ? 'Use the course outline to jump between lessons. Your place is saved in this course.'
                : 'Free previews help you evaluate quality before you purchase full access.'}
            </p>
          </div>

          {/* Right: curriculum list */}
          <aside className="lg:sticky lg:top-24">
            <div className="flex max-h-[min(70vh,calc(100vh-7rem))] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/90 px-4 py-4 sm:px-5">
                <div className="flex items-center gap-2 text-blue-700">
                  <FiBookOpen className="text-lg" />
                  <p className="text-xs font-extrabold uppercase tracking-wide">Course content</p>
                </div>
                <p className="mt-1 text-sm font-bold text-slate-600">
                  {lectures.length} {lectures.length === 1 ? 'lesson' : 'lessons'}
                </p>
              </div>
              <nav className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4" aria-label="Lessons in this course">
                <ul className="space-y-2">
                  {lectures.map((lecture, index) => {
                    const unlocked = canWatch(lecture)
                    const isCurrent = String(lecture._id) === String(lectureId)
                    return (
                      <li key={lecture._id || index}>
                        <Link
                          to={`/view-lecture/${courseId}/${lecture._id}`}
                          className={`flex min-h-[3.25rem] w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                            isCurrent
                              ? 'border-blue-300 bg-blue-50 text-blue-950 shadow-sm'
                              : 'border-transparent bg-slate-50/80 text-slate-800 hover:border-slate-200 hover:bg-white'
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-extrabold ${
                              isCurrent ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-extrabold leading-snug">
                              {lecture.lectureTitle || 'Untitled lesson'}
                            </span>
                            <span className="mt-1 flex flex-wrap items-center gap-2">
                              {lecture.isPreviewFree ? (
                                <span className="inline-flex rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-blue-800">
                                  Free
                                </span>
                              ) : isEnrolled || isCourseCreator ? (
                                <span className="inline-flex rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-700">
                                  Full course
                                </span>
                              ) : (
                                <span className="inline-flex rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-900">
                                  Paid
                                </span>
                              )}
                            </span>
                          </span>
                          {unlocked ? (
                            <FiPlayCircle
                              className={`mt-0.5 shrink-0 text-lg ${isCurrent ? 'text-blue-700' : 'text-slate-400'}`}
                            />
                          ) : (
                            <FiLock className="mt-0.5 shrink-0 text-lg text-slate-400" />
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default ViewLecture
