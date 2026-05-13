import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FaGoogle } from 'react-icons/fa'
import { FiBookOpen, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { setUserData } from '../redux/userSlice'
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from '../../utils/firebase'
import Logo from '../component/Logo'
function SignUp() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    agree: false,
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (formData.password !== formData.confirmPassword) {
      setMessageType('error')
      setMessage('Password and confirm password must match.')
      toast.error('Password and confirm password must match.')
      return
    }

    const signupData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    }

    try {
      setIsSubmitting(true)
      const result = await axios.post('/api/auth/signup', signupData, {
        withCredentials: true,
      })

      dispatch(setUserData(result.data))
      setMessageType('success')
      setMessage('Account created successfully.')
      toast.success('Account created successfully.')
      navigate('/')
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        agree: false,
      })
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.'
      setMessageType('error')
setMessage(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const googleSignUp = async () => {
    setMessage('')

    try {
      setIsGoogleSubmitting(true)
      const response = await signInWithPopup(auth, provider)
      const { user } = response

      const backendResponse = await axios.post('/api/auth/googleauth', {
        name: user.displayName,
        email: user.email,
        role: formData.role,
      }, {
        withCredentials: true,
      })

      dispatch(setUserData(backendResponse.data))
      setMessageType('success')
      setMessage('Signed up with Google successfully.')
      toast.success('Signed up with Google successfully.')
      navigate('/')
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Google signup failed. Please try again.'
      setMessageType('error')
      setMessage(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden bg-[#071b4d] px-12 py-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,124,255,0.36),transparent_34%),radial-gradient(circle_at_80%_28%,rgba(126,54,238,0.32),transparent_30%),linear-gradient(135deg,#071b4d_0%,#14276e_55%,#381ca0_100%)]" />
          <div className="relative flex items-center gap-3">
            <Logo showText framed imageClassName="h-9 w-9" textClassName="text-2xl font-bold tracking-wide text-white" />
          </div>

          <div className="relative max-w-xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-50 backdrop-blur">
              <FiBookOpen className="text-lg" />
              Start learning smarter
            </div>
            <h1 className="text-5xl font-bold leading-tight text-white xl:text-6xl">
              Create your learning space in minutes.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100">
              Join Learnova to organize courses, track progress, and keep every lesson one click away.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-4 text-white">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">24k+</p>
              <p className="mt-1 text-sm text-blue-100">active learners</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">320+</p>
              <p className="mt-1 text-sm text-blue-100">courses</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">98%</p>
              <p className="mt-1 text-sm text-blue-100">completion</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo imageClassName="h-24 w-auto" />
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2563eb]">
                  Join Learnova
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950">Create account</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Build your profile and continue your learning journey.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
                  <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <FiUser className="shrink-0 text-lg text-slate-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      autoComplete="name"
                      required
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
                  <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <FiMail className="shrink-0 text-lg text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      autoComplete="email"
                      required
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </span>
                </label>

                <fieldset>
                  <legend className="mb-2 block text-sm font-medium text-slate-700">Account type</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="student"
                        checked={formData.role === 'student'}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <span className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition peer-checked:border-[#2563eb] peer-checked:bg-blue-50 peer-checked:text-[#2563eb]">
                        Student
                      </span>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="educator"
                        checked={formData.role === 'educator'}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <span className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition peer-checked:border-[#7c2df0] peer-checked:bg-violet-50 peer-checked:text-[#7c2df0]">
                        Educator
                      </span>
                    </label>
                  </div>
                </fieldset>

                <div className="block">
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <FiLock className="shrink-0 text-lg text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-blue-50 hover:text-[#2563eb] focus:outline-none focus:ring-2 focus:ring-blue-200"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                    </button>
                  </span>
                </div>

                <div className="block">
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm password
                  </label>
                  <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <FiLock className="shrink-0 text-lg text-slate-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-blue-50 hover:text-[#2563eb] focus:outline-none focus:ring-2 focus:ring-blue-200"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                    </button>
                  </span>
                </div>

                <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                  <input
                    id="agree"
                    name="agree"
                    type="checkbox"
                    checked={formData.agree}
                    onChange={handleChange}
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#2563eb] accent-[#2563eb]"
                  />
                  <span>I agree to the terms and privacy policy.</span>
                </label>

                {message && (
                  <p
                    className={`rounded-lg px-4 py-3 text-sm font-medium ${
                      messageType === 'error'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-blue-50 text-[#2563eb]'
                    }`}
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <ClipLoader size={18} color="#ffffff" />
                      Creating account...
                    </span>
                  ) : (
                    'Sign up'
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">or</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={googleSignUp}
                disabled={isGoogleSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                {isGoogleSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <ClipLoader size={18} color="#7c2df0" />
                    Connecting...
                  </span>
                ) : (
                  <>
                    <FaGoogle className="text-[#7c2df0]" />
                    Continue with Google
                  </>
                )}
              </button>

              <p className="mt-7 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[#2563eb] hover:text-[#7c2df0]">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default SignUp
