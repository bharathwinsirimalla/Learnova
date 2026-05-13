import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCamera, FiFileText, FiMail, FiSave, FiTrash2, FiUser } from 'react-icons/fi'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { setUserData } from '../redux/userSlice'

function EditProfile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const photoInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    description: userData?.description || '',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(userData?.photoUrl || '')
  const [previewObjectUrl, setPreviewObjectUrl] = useState('')
  const [shouldRemovePhoto, setShouldRemovePhoto] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const userInitial = formData.name?.charAt(0).toUpperCase() || 'U'
  const canClearPhoto = Boolean(previewUrl || userData?.photoUrl || photoFile)

  useEffect(() => {
    setFormData({
      name: userData?.name || '',
      description: userData?.description || '',
    })
    setPreviewUrl(userData?.photoUrl || '')
    setShouldRemovePhoto(false)
  }, [userData])

  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl)
      }
    }
  }, [previewObjectUrl])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl)
    }

    setPhotoFile(file)
    setPreviewUrl(objectUrl)
    setPreviewObjectUrl(objectUrl)
    setShouldRemovePhoto(false)
  }

  const handleClearPhoto = () => {
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl)
    }

    setPhotoFile(null)
    setPreviewUrl('')
    setPreviewObjectUrl('')
    setShouldRemovePhoto(true)

    if (photoInputRef.current) {
      photoInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Full name is required.')
      return
    }

    const payload = new FormData()
    payload.append('name', formData.name.trim())
    payload.append('description', formData.description.trim())

    if (photoFile) {
      payload.append('photoUrl', photoFile)
    } else if (shouldRemovePhoto) {
      payload.append('removePhoto', 'true')
    }

    try {
      setIsSubmitting(true)
      const result = await axios.post('/api/user/profile', payload, {
        withCredentials: true,
      })

      try {
        const currentUser = await axios.get('/api/user/getcurrentuser', {
          withCredentials: true,
        })
        dispatch(setUserData(currentUser.data))
      } catch {
        dispatch(setUserData(result.data))
      }

      toast.success('Profile updated successfully.')
      navigate('/profile')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Account</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Edit Profile</h1>
          </div>

          <Link
            to="/profile"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <FiArrowLeft className="text-base" />
            Back to Profile
          </Link>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <form className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]" onSubmit={handleSubmit}>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">

              <div className="mt-5 flex flex-col items-center text-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={formData.name || 'Profile preview'}
                    className="h-36 w-36 rounded-lg border-4 border-white bg-white object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-lg border-4 border-white bg-blue-50 text-5xl font-extrabold text-blue-700 shadow-sm">
                    {userInitial}
                  </div>
                )}

                <label
                  htmlFor="photoUrl"
                  className="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus-within:outline-none focus-within:ring-4 focus-within:ring-blue-100"
                >
                  <FiCamera className="text-base" />
                  Choose Photo
                  <input
                    ref={photoInputRef}
                    id="photoUrl"
                    name="photoUrl"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                </label>

                {photoFile && (
                  <p className="mt-3 max-w-full truncate text-sm font-medium text-slate-500">
                    {photoFile.name}
                  </p>
                )}

                {canClearPhoto && (
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-100 bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                  >
                    <FiTrash2 className="text-base" />
                    Clear Photo
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Full Name</span>
                <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-700 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                  <FiUser className="shrink-0 text-lg text-slate-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500">
                  <FiMail className="shrink-0 text-lg text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={userData?.email || ''}
                    disabled
                    className="w-full cursor-not-allowed bg-transparent text-sm text-slate-500 outline-none"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
                <span className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-700 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                  <FiFileText className="mt-0.5 shrink-0 text-lg text-slate-400" />
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write a short profile description"
                    rows={5}
                    className="w-full resize-none bg-transparent text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <ClipLoader size={18} color="#ffffff" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="text-base" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

export default EditProfile
