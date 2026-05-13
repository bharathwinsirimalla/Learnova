import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setUserData } from '../redux/userSlice'
import {
  FiArrowLeft,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiLock,
  FiPlayCircle,
  FiSend,
  FiStar,
  FiUser,
  FiVideo,
} from 'react-icons/fi'
import Card from '../component/Card'
import ReviewCard from '../component/ReviewCard'

const fallbackThumbnail =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Could not load Razorpay checkout'))
    document.body.appendChild(script)
  })

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const getRating = (reviews = []) => {
  if (!Array.isArray(reviews) || !reviews.length) {
    return 0
  }

  const ratings = reviews
    .map((review) => Number(review?.rating ?? review))
    .filter((rating) => Number.isFinite(rating) && rating > 0)

  if (!ratings.length) {
    return 0
  }

  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
}

const getList = (value, fallback) => {
  if (Array.isArray(value)) {
    const cleanedItems = value.map((item) => String(item).trim()).filter(Boolean)
    if (cleanedItems.length) {
      return cleanedItems
    }
  }

  return fallback
}

function ViewCourse() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const [course, setCourse] = useState(null)
  const [otherCourses, setOtherCourses] = useState([])
  const [selectedLectureId, setSelectedLectureId] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [reviewList, setReviewList] = useState([])
  const [isReviewsLoading, setIsReviewsLoading] = useState(false)
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const fetchCourse = async () => {
      setIsLoading(true)
      setError('')

      try {
        const result = await axios.get(`/api/course/viewcourse/${courseId}`)
        const nextCourse = result.data?.course || {}
        const lectures = Array.isArray(nextCourse.lectures) ? nextCourse.lectures : []
        const firstPreviewLecture = lectures.find((lecture) => lecture.isPreviewFree)

        setCourse(nextCourse)
        setOtherCourses(Array.isArray(result.data?.otherCourses) ? result.data.otherCourses : [])
        setSelectedLectureId(firstPreviewLecture?._id || '')
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load course.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  useEffect(() => {
    const loadReviews = async () => {
      if (!courseId) return
      setIsReviewsLoading(true)
      try {
        const { data } = await axios.get(`/api/review/getreviews/${courseId}`)
        setReviewList(Array.isArray(data) ? data : [])
      } catch {
        setReviewList([])
      } finally {
        setIsReviewsLoading(false)
      }
    }
    loadReviews()
  }, [courseId])

  const lectures = useMemo(() => (Array.isArray(course?.lectures) ? course.lectures : []), [course])
  const rating = reviewList.length
    ? getRating(reviewList)
    : Number(course?.rating ?? course?.averageRating ?? getRating(course?.reviews))
  const reviewCount = reviewList.length
    ? reviewList.length
    : Array.isArray(course?.reviews)
      ? course.reviews.length
      : Number(course?.reviewCount) || 0
  const educator = course?.creator || {}

  const fallbackLearningItems = [
    `Build confidence in ${course?.category || 'the subject'} through guided lessons.`,
    'Understand core ideas with practical examples and structured progression.',
    'Apply the concepts through focused course material and lecture practice.',
  ]

  const fallbackRequirements = [
    'A stable internet connection for video lessons.',
    'Basic curiosity and time to practice after each lecture.',
    course?.level ? `Comfort with ${course.level} level learning.` : 'No advanced setup required.',
  ]

  const fallbackAudience = [
    'Students who want a clear learning path.',
    'Professionals improving practical skills.',
    'Beginners revisiting fundamentals before deeper projects.',
  ]

  const fallbackPerks = [
    '10+ hours video content',
    'Lifetime access to course materials',
    'Preview selected free lectures before enrolling',
  ]

  const learningItems = getList(course?.whatYouWillLearn, fallbackLearningItems)
  const requirements = getList(course?.requirements, fallbackRequirements)
  const audience = getList(course?.whoIsThisCourseFor, fallbackAudience)
  const perks = getList(course?.perks, fallbackPerks)

  const isAlreadyEnrolled = useMemo(() => {
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
    return Boolean(creatorId && String(creatorId) === String(userData?._id))
  }, [course, userData?._id, userData?.role])

  const hasFullCourseAccess = isAlreadyEnrolled || isCourseCreator

  const canSubmitReview = Boolean(userData && isAlreadyEnrolled && !isCourseCreator)

  const enrolledCourseIds = useMemo(() => {
    const list = userData?.enrolledCourses
    if (!Array.isArray(list)) {
      return new Set()
    }
    return new Set(list.map((entry) => String(entry?._id ?? entry)))
  }, [userData?.enrolledCourses])

  const selectedLecture = lectures.find((lecture) => lecture._id === selectedLectureId)
  const canAccessLecture = (lecture) =>
    Boolean(isAlreadyEnrolled || isCourseCreator || lecture?.isPreviewFree)
  const canWatchSelected = Boolean(selectedLecture && canAccessLecture(selectedLecture))

  const refreshUser = async () => {
    try {
      const result = await axios.get('/api/user/getcurrentuser', { withCredentials: true })
      dispatch(setUserData(result.data))
    } catch {
      /* ignore */
    }
  }

  const handleContinueLearning = () => {
    const firstWithVideo = lectures.find((lecture) => lecture.videoUrl)
    const targetId = firstWithVideo?._id || lectures[0]?._id
    if (targetId) {
      navigate(`/view-lecture/${courseId}/${targetId}`)
    }
  }

  const handleEnroll = async () => {
    if (!userData?._id) {
      toast.error('Please log in to enroll.')
      navigate('/login')
      return
    }

    if (hasFullCourseAccess) {
      handleContinueLearning()
      return
    }

    const price = Number(course?.price) || 0
    if (price <= 0) {
      toast.error('This course has no paid price set. Contact support to enroll.')
      return
    }

    if (!RAZORPAY_KEY_ID) {
      toast.error('Payment is not configured (missing Razorpay key).')
      return
    }

    setIsEnrolling(true)

    try {
      await loadRazorpayScript()
    } catch {
      toast.error('Could not load payment checkout. Try again.')
      setIsEnrolling(false)
      return
    }

    let order

    try {
      const { data } = await axios.post(
        '/api/order/razorpay-order',
        { courseId },
        { withCredentials: true },
      )
      order = data
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Could not start checkout.')
      setIsEnrolling(false)
      return
    }

    if (!order?.id) {
      toast.error('Invalid order response from server.')
      setIsEnrolling(false)
      return
    }

    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      order_id: order.id,
      name: course?.title || 'Course enrollment',
      description: course?.subTitle || 'Complete your enrollment',
      currency: order.currency || 'INR',
      amount: order.amount,
      prefill: {
        name: userData?.name || '',
        email: userData?.email || '',
      },
      theme: { color: '#1d4ed8' },
      handler: async (response) => {
        try {
          await axios.post(
            '/api/order/verifypayment',
            {
              courseId,
              userId: userData._id,
              razorpay_order_id: response.razorpay_order_id,
            },
            { withCredentials: true },
          )
          toast.success('Payment successful. You are enrolled!')
          await refreshUser()
          const firstWithVideo = lectures.find((lecture) => lecture.videoUrl)
          const firstId = firstWithVideo?._id || lectures[0]?._id
          if (firstId) {
            navigate(`/view-lecture/${courseId}/${firstId}`)
          }
        } catch (verifyError) {
          toast.error(verifyError.response?.data?.message || 'Payment verification failed.')
        } finally {
          setIsEnrolling(false)
        }
      },
      modal: {
        ondismiss: () => setIsEnrolling(false),
      },
    })

    rzp.on('payment.failed', () => {
      toast.error('Payment failed or was cancelled.')
      setIsEnrolling(false)
    })

    rzp.open()
  }

  const handleReviewSubmit = async (event) => {
    event.preventDefault()

    if (!canSubmitReview) {
      toast.error('Only enrolled learners can submit a review.')
      return
    }
    if (!reviewRating) {
      toast.error('Please select a star rating.')
      return
    }

    setIsReviewSubmitting(true)
    try {
      await axios.post(
        '/api/review/createreview',
        { courseId, rating: reviewRating, comment: reviewText },
        { withCredentials: true }
      )
      toast.success('Thanks—your review was posted.')
      setReviewRating(0)
      setReviewText('')
      const { data } = await axios.get(`/api/review/getreviews/${courseId}`)
      setReviewList(Array.isArray(data) ? data : [])
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Could not submit review.')
    } finally {
      setIsReviewSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-500">Loading course...</p>
        </div>
      </main>
    )
  }

  if (error || !course) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-rose-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-950">Could not load course</h1>
          <p className="mt-2 text-sm font-semibold text-rose-600">{error}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Go Back
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(23rem,0.92fr)]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Back"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <FiArrowLeft className="text-xl" />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Course Details</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">{course.category || 'Professional Learning'}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <img
                src={course.thumbnail || fallbackThumbnail}
                alt={course.title || 'Course thumbnail'}
                className="aspect-video w-full object-cover"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoPanel title="What you'll learn" items={learningItems} className="md:col-span-2" />
              <InfoPanel title="Requirements" items={requirements} />
              <InfoPanel title="Who is this course for" items={audience} />
            </div>
          </div>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 sm:p-8">
            <p className="inline-flex rounded-md bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
              {course.category || 'Course'}
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              {course.title || 'Untitled Course'}
            </h1>
            {course.subTitle && (
              <p className="mt-3 text-base font-semibold leading-7 text-slate-600">{course.subTitle}</p>
            )}
            <p className="mt-5 whitespace-pre-line border-t border-slate-100 pt-5 text-sm font-medium leading-6 text-slate-600">
              {course.description || 'Course description will be updated soon.'}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Stat icon={<FiStar />} label={`${rating ? rating.toFixed(1) : '0.0'} rating`} />
              <Stat icon={<FiAward />} label={`${reviewCount} reviews`} />
              <Stat icon={<FiBookOpen />} label={`${lectures.length} lectures`} />
            </div>

            <div className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              {perks.map((perk, index) => (
                <Perk
                  key={perk}
                  icon={index === 0 ? <FiClock /> : index === 1 ? <FiVideo /> : <FiCheckCircle />}
                  text={perk}
                />
              ))}
            </div>

            {hasFullCourseAccess ? (
              isCourseCreator ? (
                <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                  <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                        <FiEdit2 className="text-xl" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-violet-950">Your course (instructor view)</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-violet-900/90">
                          Learners see pricing and enroll on this page. You always have full access to review
                          lessons—no checkout required.
                        </p>
                        {Number(course.price) > 0 ? (
                          <p className="mt-2 text-xs font-bold text-slate-600">
                            Student list price: {formatPrice(course.price)}
                          </p>
                        ) : (
                          <p className="mt-2 text-xs font-bold text-slate-600">This course is not priced for checkout yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                    <button
                      type="button"
                      onClick={handleContinueLearning}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                      <FiPlayCircle className="text-lg" />
                      Preview lessons
                    </button>
                    <Link
                      to={`/edit-course/${courseId}`}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-800 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-900 focus:outline-none focus:ring-4 focus:ring-violet-100"
                    >
                      <FiEdit2 className="text-lg" />
                      Edit course
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                  <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <FiCheckCircle className="text-xl" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-emerald-900">You have full access</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-emerald-800/90">
                          Start or resume lessons anytime. Progress is saved to your account.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleContinueLearning}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <FiPlayCircle className="text-lg" />
                    Watch now
                  </button>
                </div>
              )
            ) : (
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-3xl font-extrabold text-slate-950">{formatPrice(course.price)}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">One-time purchase · Instant access after payment</p>
                </div>
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEnrolling ? 'Opening checkout…' : 'Enroll now'}
                </button>
              </div>
            )}
          </aside>
        </section>

        <section
          id="course-learning"
          className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,1.05fr)]"
        >
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading eyebrow="Program" title="Course Curriculum" />
            <div className="mt-5 space-y-3">
              {lectures.length ? (
                lectures.map((lecture, index) => {
                  const unlocked = canAccessLecture(lecture)
                  const isActive = selectedLecture?._id === lecture._id
                  return (
                  <Link
                    key={lecture._id || lecture.lectureTitle}
                    to={`/view-lecture/${courseId}/${lecture._id}`}
                    className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-lg border px-4 py-3 text-left transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                      isActive
                        ? 'border-blue-200 bg-blue-50 text-blue-800'
                        : !unlocked
                          ? 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold">
                        {index + 1}. {lecture.lectureTitle || 'Untitled Lecture'}
                      </span>
                      <span className="mt-1 block text-xs font-bold">
                        {lecture.isPreviewFree
                          ? 'Free preview'
                          : hasFullCourseAccess
                            ? isCourseCreator
                              ? 'Your lesson'
                              : 'Included with your enrollment'
                            : 'Enroll to unlock'}
                      </span>
                    </span>
                    {unlocked ? (
                      <FiPlayCircle className="shrink-0 text-lg" />
                    ) : (
                      <FiLock className="shrink-0 text-lg" />
                    )}
                  </Link>
                  )
                })
              ) : (
                <p className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm font-bold text-slate-500">
                  No lectures are available yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading
              eyebrow={
                hasFullCourseAccess ? (isCourseCreator ? 'Instructor preview' : 'Classroom') : 'Preview'
              }
              title={
                hasFullCourseAccess ? (isCourseCreator ? 'Lesson preview' : 'Course player') : 'Selected lecture'
              }
            />
            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
              {selectedLecture?.videoUrl && canWatchSelected ? (
                <video
                  key={selectedLecture.videoUrl}
                  src={selectedLecture.videoUrl}
                  controls
                  className="aspect-video w-full bg-slate-950"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center text-slate-300">
                  <div className="text-center">
                    <FiVideo className="mx-auto text-4xl" />
                    <p className="mt-3 text-sm font-bold">
                      {selectedLecture && !canWatchSelected
                        ? 'Enroll to watch this lesson'
                        : selectedLecture && canWatchSelected && !selectedLecture.videoUrl
                          ? 'Video for this lesson is not available yet'
                          : 'Select a lesson from the curriculum'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-slate-950">
              {selectedLecture?.lectureTitle || 'Select a lecture'}
            </h3>
            {selectedLecture && (
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {canWatchSelected
                  ? hasFullCourseAccess
                    ? isCourseCreator
                      ? 'Author preview — not a student purchase'
                      : 'Streaming with your enrollment'
                    : 'Free preview'
                  : 'Available after enrollment'}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <div>
              <SectionHeading eyebrow="Feedback" title="Write a Review" />
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                Share a concise review to help other learners understand the course quality.
              </p>
            </div>
            {canSubmitReview ? (
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      aria-label={`${star} star`}
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border transition focus:outline-none focus:ring-4 focus:ring-amber-100 ${
                        reviewRating >= star
                          ? 'border-amber-300 bg-amber-50 text-amber-500'
                          : 'border-slate-200 bg-white text-slate-300 hover:bg-amber-50 hover:text-amber-500'
                      }`}
                    >
                      <FiStar className="fill-current text-xl" />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Share what helped you learn from this course"
                />
                <button
                  type="submit"
                  disabled={isReviewSubmitting}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiSend className="text-lg" />
                  {isReviewSubmitting ? 'Posting…' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-6 text-sm font-semibold leading-6 text-slate-600">
                {!userData
                  ? 'Log in and enroll in this course to post a review.'
                  : isCourseCreator
                    ? 'Student reviews for your course appear below. Instructors do not submit learner reviews here.'
                    : 'Enroll in this course to post a review once you have access.'}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-8">
            <SectionHeading eyebrow="Community" title="Learner reviews" />
            <p className="mt-2 text-sm font-medium text-slate-500">
              Ratings and comments from people who took this course.
            </p>
            {isReviewsLoading ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="h-36 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-36 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ) : reviewList.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {reviewList.map((item) => (
                  <ReviewCard key={item._id} review={item} />
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-lg border border-dashed border-slate-200 px-4 py-10 text-center text-sm font-bold text-slate-500">
                No reviews yet. Be the first to share feedback after enrolling.
              </p>
            )}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading eyebrow="Instructor" title="Educator" />
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-blue-700">
                {educator.photoUrl ? (
                  <img src={educator.photoUrl} alt={educator.name || 'Educator'} className="h-full w-full object-cover" />
                ) : (
                  <FiUser className="text-3xl" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-extrabold text-slate-950">
                  {educator.name || 'Educator'}
                </h3>
                <p className="truncate text-sm font-semibold text-slate-500">
                  {educator.email || 'Course creator'}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm font-medium leading-6 text-slate-600">
              {educator.description || 'This educator is building practical courses for learners.'}
            </p>
          </aside>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading eyebrow="More from educator" title="Other Courses" />
            {otherCourses.length ? (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {otherCourses.map((item) => (
                  <Card
                    key={item._id || item.title}
                    course={item}
                    to={`/view-course/${item._id}`}
                    inLibrary={enrolledCourseIds.has(String(item._id))}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm font-bold text-slate-500">
                No other published courses from this educator yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function InfoPanel({ title, items, className = '' }) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <h2 className="text-base font-extrabold text-slate-950">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-slate-600">
            <FiCheckCircle className="mt-1 shrink-0 text-blue-700" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Stat({ icon, label }) {
  return (
    <div className="flex min-h-12 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
      <span className="text-amber-500">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function Perk({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
      <span className="text-blue-700">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-extrabold text-slate-950">{title}</h2>
    </div>
  )
}

export default ViewCourse
