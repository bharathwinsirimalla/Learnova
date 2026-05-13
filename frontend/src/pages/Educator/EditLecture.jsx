import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiArrowLeft, FiSave, FiTrash2, FiType, FiVideo } from 'react-icons/fi'

function EditLecture() {
  const { courseId, lectureId } = useParams()
  const navigate = useNavigate()
  const [lectureTitle, setLectureTitle] = useState('')
  const [isPreviewFree, setIsPreviewFree] = useState(false)
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    const fetchLecture = async () => {
      setIsLoading(true)

      try {
        const result = await axios.get(`/api/course/lecture/${lectureId}`, {
          withCredentials: true,
        })
        const lecture = result.data || {}

        setLectureTitle(lecture.lectureTitle || '')
        setIsPreviewFree(Boolean(lecture.isPreviewFree))
        setVideoUrl(lecture.videoUrl || '')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load lecture.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLecture()
  }, [lectureId])

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file.')
      return
    }

    setVideoFile(file)
  }

  const handleUpdateLecture = async (event) => {
    event.preventDefault()

    if (!lectureTitle.trim()) {
      toast.error('Lecture title is required.')
      return
    }

    const payload = new FormData()
    payload.append('lectureTitle', lectureTitle.trim())
    payload.append('isPreviewFree', String(isPreviewFree))

    if (videoFile) {
      payload.append('videoUrl', videoFile)
    }

    setIsSaving(true)

    try {
      const result = await axios.post(`/api/course/editlecture/${lectureId}`, payload, {
        withCredentials: true,
      })
      const updatedLecture = result.data || {}

      setVideoFile(null)
      setVideoUrl(updatedLecture.videoUrl || videoUrl)
      toast.success('Lecture updated.')
      navigate(`/create-lecture/${courseId}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update lecture.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveLecture = async () => {
    const shouldRemove = window.confirm('Remove this lecture?')

    if (!shouldRemove) {
      return
    }

    setIsRemoving(true)

    try {
      await axios.post(`/api/course/removelecture/${lectureId}`, null, {
        withCredentials: true,
      })
      toast.success('Lecture removed.')
      navigate(`/create-lecture/${courseId}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove lecture.')
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={`/create-lecture/${courseId}`}
              aria-label="Back"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <FiArrowLeft className="text-xl" />
            </Link>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Educator</p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-950">Edit Lecture</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemoveLecture}
            disabled={isLoading || isSaving || isRemoving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-5 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiTrash2 className="text-lg" />
            {isRemoving ? 'Removing...' : 'Remove Lecture'}
          </button>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {isLoading ? (
            <p className="text-sm font-bold text-slate-500">Loading lecture details...</p>
          ) : (
            <form onSubmit={handleUpdateLecture} className="space-y-6">
              <div>
                <label htmlFor="lectureTitle" className="text-sm font-extrabold text-slate-700">
                  Title
                </label>
                <div className="mt-2 flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                  <FiType className="shrink-0 text-lg text-slate-400" />
                  <input
                    id="lectureTitle"
                    type="text"
                    value={lectureTitle}
                    onChange={(event) => setLectureTitle(event.target.value)}
                    className="min-h-12 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="Lecture title"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="videoUrl" className="text-sm font-extrabold text-slate-700">
                  Video
                </label>
                <div className="mt-2 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <input
                    id="videoUrl"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                  {videoUrl && (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                      <FiVideo className="text-lg" />
                      View Video
                    </a>
                  )}
                </div>
                {videoFile && (
                  <p className="mt-2 text-sm font-semibold text-slate-500">{videoFile.name}</p>
                )}
              </div>

              <label className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={isPreviewFree}
                  onChange={(event) => setIsPreviewFree(event.target.checked)}
                  className="h-4 w-4 accent-blue-700"
                />
                Preview Free
              </label>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  to={`/create-lecture/${courseId}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving || isRemoving}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FiSave className="text-lg" />
                  {isSaving ? 'Updating...' : 'Update Lecture'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}

export default EditLecture
