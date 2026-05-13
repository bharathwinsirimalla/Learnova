import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiArrowLeft, FiEdit3, FiPlus, FiTrash2, FiVideo } from 'react-icons/fi'

function CreateLecture() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [lectureTitle, setLectureTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const lectures = course?.lectures || []

  const fetchLectures = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await axios.get(`/api/course/courselecture/${courseId}`, {
        withCredentials: true,
      })
      setCourse(result.data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load lectures.')
    } finally {
      setIsLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    fetchLectures()
  }, [fetchLectures])

  const handleCreateLecture = async (event) => {
    event.preventDefault()

    if (!lectureTitle.trim()) {
      toast.error('Lecture title is required.')
      return
    }

    setIsSaving(true)

    try {
      await axios.post(
        `/api/course/createlecture/${courseId}`,
        { lectureTitle: lectureTitle.trim() },
        { withCredentials: true },
      )
      setLectureTitle('')
      toast.success('Lecture created.')
      await fetchLectures()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create lecture.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveLecture = async (lectureId) => {
    const shouldRemove = window.confirm('Remove this lecture?')

    if (!shouldRemove) {
      return
    }

    setIsSaving(true)

    try {
      await axios.post(`/api/course/removelecture/${lectureId}`, null, {
        withCredentials: true,
      })
      toast.success('Lecture removed.')
      await fetchLectures()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove lecture.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex items-center gap-3">
          <Link
            to={`/edit-course/${courseId}`}
            aria-label="Back"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Educator</p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-950">Create Lecture</h1>
          </div>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 border-b border-slate-100 pb-6">
            <h2 className="text-2xl font-extrabold text-slate-950">
              {course?.title || 'Course Lectures'}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {lectures.length} {lectures.length === 1 ? 'lecture' : 'lectures'}
            </p>
          </div>

          <form onSubmit={handleCreateLecture} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <input
              type="text"
              value={lectureTitle}
              onChange={(event) => setLectureTitle(event.target.value)}
              className="min-h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="Lecture title"
            />
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiPlus className="text-lg" />
              Create Lecture
            </button>
          </form>

          <div className="mt-8 space-y-4">
            {isLoading ? (
              <p className="text-sm font-bold text-slate-500">Loading lectures...</p>
            ) : lectures.length ? (
              lectures.map((lecture) => (
                <div key={lecture._id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-extrabold text-slate-950">
                        {lecture.lectureTitle}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
                        <span>{lecture.isPreviewFree ? 'Free preview' : 'Locked preview'}</span>
                        {lecture.videoUrl && (
                          <a
                            href={lecture.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-700 hover:text-slate-950"
                          >
                            <FiVideo />
                            Video
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/edit-lecture/${courseId}/${lecture._id}`}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                        aria-label="Edit lecture"
                      >
                        <FiEdit3 className="text-lg" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemoveLecture(lecture._id)}
                        disabled={isSaving}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                        aria-label="Remove lecture"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm font-bold text-slate-500">
                No lectures added yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default CreateLecture
