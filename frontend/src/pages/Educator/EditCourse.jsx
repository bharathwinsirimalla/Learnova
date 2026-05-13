import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FiArrowLeft,
  FiBookOpen,
  FiImage,
  FiSave,
  FiTag,
  FiTrash2,
  FiType,
} from 'react-icons/fi'

const categories = [
  'Development',
  'Design',
  'Data',
  'AI',
  'Cyber Security',
  'Business',
  'Marketing',
]

const levels = [
  { label: 'Beginner', value: 'begineer' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
]

const initialFormData = {
  title: '',
  subTitle: '',
  description: '',
  category: '',
  level: '',
  price: '',
  isPublished: false,
  whatYouWillLearn: '',
  requirements: '',
  whoIsThisCourseFor: '',
  perks: '',
}

const listToText = (value) => (Array.isArray(value) ? value.join('\n') : '')

const editCourseBackTarget = (raw) => {
  if (typeof raw !== 'string' || !raw.startsWith('/') || raw.startsWith('//')) {
    return null
  }
  const path = raw.split('?')[0]
  if (!path.startsWith('/view-course/')) {
    return null
  }
  return path
}

function EditCourse() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo')
  const coursePageBack = editCourseBackTarget(returnTo)
  const backTarget = coursePageBack || '/courses'
  const backLabel = coursePageBack ? 'Back to course page' : 'Back to courses'

  const [formData, setFormData] = useState(initialFormData)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true)

      try {
        const result = await axios.get(`/api/course/getcoursebyid/${courseId}`, {
          withCredentials: true,
        })
        const course = result.data || {}

        setFormData({
          title: course.title || '',
          subTitle: course.subTitle || '',
          description: course.description || '',
          category: course.category || '',
          level: course.level || '',
          price: course.price ?? '',
          isPublished: Boolean(course.isPublished),
          whatYouWillLearn: listToText(course.whatYouWillLearn),
          requirements: listToText(course.requirements),
          whoIsThisCourseFor: listToText(course.whoIsThisCourseFor),
          perks: listToText(course.perks),
        })
        setThumbnailPreview(course.thumbnail || '')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load course.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  useEffect(() => {
    if (!thumbnailFile) {
      return undefined
    }

    const previewUrl = URL.createObjectURL(thumbnailFile)
    setThumbnailPreview(previewUrl)

    return () => URL.revokeObjectURL(previewUrl)
  }, [thumbnailFile])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.')
      return
    }

    setThumbnailFile(file)
  }

  const buildPayload = (nextPublished = formData.isPublished) => {
    const payload = new FormData()

    payload.append('title', formData.title.trim())
    payload.append('subTitle', formData.subTitle.trim())
    payload.append('description', formData.description.trim())
    payload.append('category', formData.category)
    payload.append('level', formData.level)
    payload.append('price', formData.price)
    payload.append('isPublished', String(nextPublished))
    payload.append('whatYouWillLearn', formData.whatYouWillLearn)
    payload.append('requirements', formData.requirements)
    payload.append('whoIsThisCourseFor', formData.whoIsThisCourseFor)
    payload.append('perks', formData.perks)

    if (thumbnailFile) {
      payload.append('thumbnail', thumbnailFile)
    }

    return payload
  }

  const saveCourse = async (nextPublished = formData.isPublished, shouldNavigate = false) => {
    if (!formData.title.trim() || !formData.category) {
      toast.error('Course title and category are required.')
      return null
    }

    setIsSaving(true)

    try {
      const result = await axios.post(`/api/course/editcourse/${courseId}`, buildPayload(nextPublished), {
        withCredentials: true,
      })

      const updatedCourse = result.data || {}
      setFormData((prev) => ({
        ...prev,
        isPublished: Boolean(updatedCourse.isPublished),
        price: updatedCourse.price ?? prev.price,
      }))
      setThumbnailFile(null)
      setThumbnailPreview(updatedCourse.thumbnail || thumbnailPreview)
      toast.success('Course saved successfully.')
      if (shouldNavigate) {
        navigate('/courses')
      }
      return updatedCourse
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save course.')
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await saveCourse(formData.isPublished, true)
  }

  const handlePublishToggle = async () => {
    setFormData((prev) => ({
      ...prev,
      isPublished: !prev.isPublished,
    }))
  }

  const handleRemoveCourse = async () => {
    const shouldRemove = window.confirm('Remove this course? This action cannot be undone.')

    if (!shouldRemove) {
      return
    }

    setIsRemoving(true)

    try {
      await axios.delete(`/api/course/remove/${courseId}`, {
        withCredentials: true,
      })

      toast.success('Course removed.')
      navigate('/courses')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove course.')
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={backTarget}
              aria-label={backLabel}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <FiArrowLeft className="text-xl" />
            </Link>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Educator</p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-950">
                Add detail information regarding course
              </h1>
            </div>
          </div>

          <Link
            to={`/create-lecture/${courseId}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <FiBookOpen className="text-lg" />
            Go to Lecture Page
          </Link>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">Basic Courses Information</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {formData.isPublished ? 'Published' : 'Draft'}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handlePublishToggle}
                disabled={isLoading || isSaving || isRemoving}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {formData.isPublished ? 'Click to unpublish' : 'Click to publish'}
              </button>
              <button
                type="button"
                onClick={handleRemoveCourse}
                disabled={isLoading || isSaving || isRemoving}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-5 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiTrash2 className="text-lg" />
                {isRemoving ? 'Removing...' : 'Remove Course'}
              </button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm font-bold text-slate-500">Loading course details...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <label htmlFor="title" className="text-sm font-extrabold text-slate-700">
                    Title
                  </label>
                  <div className="mt-2 flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                    <FiType className="shrink-0 text-lg text-slate-400" />
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      className="min-h-12 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                      placeholder="Course title"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subTitle" className="text-sm font-extrabold text-slate-700">
                    Subtitle
                  </label>
                  <div className="mt-2 flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                    <FiType className="shrink-0 text-lg text-slate-400" />
                    <input
                      id="subTitle"
                      name="subTitle"
                      type="text"
                      value={formData.subTitle}
                      onChange={handleChange}
                      className="min-h-12 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                      placeholder="Short course subtitle"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-extrabold text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Describe what students will learn"
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div>
                  <label htmlFor="category" className="text-sm font-extrabold text-slate-700">
                    Category
                  </label>
                  <div className="mt-2 flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                    <FiTag className="shrink-0 text-lg text-slate-400" />
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="min-h-12 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="level" className="text-sm font-extrabold text-slate-700">
                    Course Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="mt-2 min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select level</option>
                    {levels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="text-sm font-extrabold text-slate-700">
                    Price (INR)
                  </label>
                  <div className="mt-2 flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                    <span className="shrink-0 text-xs font-extrabold text-slate-400">INR</span>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      className="min-h-12 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="thumbnail" className="text-sm font-extrabold text-slate-700">
                  Course Thumbnail
                </label>
                <div className="mt-2 grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-center">
                  <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Course thumbnail preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiImage className="text-4xl text-slate-300" />
                    )}
                  </div>
                  <input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="mb-5">
                  <h3 className="text-xl font-extrabold text-slate-950">Course Page Details</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Add one item per line. These appear on the learner-facing course page.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <ListTextarea
                    id="whatYouWillLearn"
                    label="What you'll learn"
                    value={formData.whatYouWillLearn}
                    onChange={handleChange}
                    placeholder={'Build production-ready React interfaces\nUnderstand API integration patterns'}
                  />
                  <ListTextarea
                    id="requirements"
                    label="Requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder={'Basic JavaScript knowledge\nA laptop with internet access'}
                  />
                  <ListTextarea
                    id="whoIsThisCourseFor"
                    label="Who is this course for"
                    value={formData.whoIsThisCourseFor}
                    onChange={handleChange}
                    placeholder={'Students preparing for web roles\nDevelopers improving frontend skills'}
                  />
                  <ListTextarea
                    id="perks"
                    label="Course perks"
                    value={formData.perks}
                    onChange={handleChange}
                    placeholder={'10+ hours video content\nLifetime access to course materials'}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  to="/courses"
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
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}

function ListTextarea({ id, label, value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-extrabold text-slate-700">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        rows={5}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        placeholder={placeholder}
      />
    </div>
  )
}

export default EditCourse
