import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiArrowLeft, FiPlus, FiTag, FiType } from 'react-icons/fi'

const categories = [
  'Development',
  'Design',
  'Data',
  'AI',
  'Cyber Security',
  'Business',
  'Marketing',
]

function CreatorCourses() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    category: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const title = formData.title.trim()
    const category = formData.category.trim()

    if (!title || !category) {
      toast.error('Course title and category are required.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await axios.post('/api/course/create', { title, category }, {
        withCredentials: true,
      })

      toast.success('Course created successfully.')
      navigate(`/edit-course/${result.data._id}`)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create course.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-center gap-3">
          <Link
            to="/courses"
            aria-label="Back"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Educator</p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-950">Create Course</h1>
          </div>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            <div>
              <label htmlFor="title" className="text-sm font-extrabold text-slate-700">
                Course Title
              </label>
              <div className="mt-2 flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                <FiType className="shrink-0 text-lg text-slate-400" />
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  className="min-h-12 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  disabled={isSubmitting}
                />
              </div>
            </div>

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
                  disabled={isSubmitting}
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

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/courses"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiPlus className="text-lg" />
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

export default CreatorCourses
