import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiBookOpen, FiEye, FiEyeOff, FiLock, FiMail, FiShield } from 'react-icons/fi'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import Logo from '../component/Logo'

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const stepContent = {
    1: {
      eyebrow: 'Forgot password',
      title: 'Forgot your password?',
      description: 'Enter your email address and we will send a 4 digit OTP to help you reset it.',
      button: 'Send OTP',
      loading: 'Sending OTP...',
    },
    2: {
      eyebrow: 'Verify OTP',
      title: 'Enter OTP',
      description: 'Please enter the 4 digit code sent to your email.',
      button: 'Verify OTP',
      loading: 'Verifying OTP...',
    },
    3: {
      eyebrow: 'Reset password',
      title: 'Reset your password',
      description: 'Enter a new password below to regain access to your account.',
      button: 'Reset Password',
      loading: 'Resetting...',
    },
  }

  const activeStep = stepContent[step]

  const setStatus = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)

    if (type === 'error') {
      toast.error(text)
    } else {
      toast.success(text)
    }
  }

  const getErrorMessage = (error, fallback) => error.response?.data?.message || fallback

  const handleSendOtp = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const result = await axios.post('/api/auth/sendotp', {
        email: email.trim(),
      })

      setStatus(result.data?.message || `OTP sent to ${email.trim()}.`)
      setStep(2)
    } catch (error) {
      setStatus(getErrorMessage(error, 'Failed to send OTP. Please try again.'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    setMessage('')

    if (otp.length !== 4) {
      setStatus('Please enter the 4 digit OTP.', 'error')
      return
    }

    try {
      setIsSubmitting(true)
      const result = await axios.post('/api/auth/verifyotp', {
        email: email.trim(),
        otp,
      })

      setStatus(result.data?.message || 'OTP verified successfully.')
      setStep(3)
    } catch (error) {
      setStatus(getErrorMessage(error, 'OTP verification failed. Please try again.'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordChange = (event) => {
    const { name, value } = event.target

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    setMessage('')

    if (passwordData.password.length < 8) {
      setStatus('Password must be at least 8 characters.', 'error')
      return
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      setStatus('New password and confirm password must match.', 'error')
      return
    }

    try {
      setIsSubmitting(true)
      const result = await axios.post('/api/auth/resetpassword', {
        email: email.trim(),
        password: passwordData.password,
      })

      setStatus(result.data?.message || 'Password reset successfully. You can now login.')
    } catch (error) {
      setStatus(getErrorMessage(error, 'Failed to reset password. Please try again.'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderMessage = () => {
    if (!message) {
      return null
    }

    return (
      <p
        className={`rounded-lg px-4 py-3 text-sm font-medium ${
          messageType === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#2563eb]'
        }`}
      >
        {message}
      </p>
    )
  }

  const renderSubmitButton = () => (
    <button
      type="submit"
      disabled={isSubmitting}
      className="flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <ClipLoader size={18} color="#ffffff" />
          {activeStep.loading}
        </span>
      ) : (
        activeStep.button
      )}
    </button>
  )

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden bg-[#071b4d] px-12 py-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(20,124,255,0.34),transparent_34%),radial-gradient(circle_at_78%_30%,rgba(126,54,238,0.3),transparent_30%),linear-gradient(135deg,#071b4d_0%,#14276e_55%,#381ca0_100%)]" />
          <div className="relative flex items-center gap-3">
            <Logo showText framed imageClassName="h-9 w-9" textClassName="text-2xl font-bold tracking-wide text-white" />
          </div>

          <div className="relative max-w-xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-50 backdrop-blur">
              <FiBookOpen className="text-lg" />
              Account recovery
            </div>
            <h1 className="text-5xl font-bold leading-tight text-white xl:text-6xl">
              Get back to your courses.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100">
              Verify your email, confirm the OTP, and set a new password to recover your account.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-4 text-white">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">24k+</p>
              <p className="mt-1 text-sm text-blue-100">learners</p>
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
              <Link
                to="/login"
                className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb] transition hover:text-[#7c2df0]"
              >
                <FiArrowLeft />
                Back to login
              </Link>

              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2563eb]">
                  {activeStep.eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950">{activeStep.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{activeStep.description}</p>
              </div>

              <div className="mb-7 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className={`h-1.5 rounded-full transition ${
                      item <= step ? 'bg-[#2563eb]' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {step === 1 && (
                <form className="space-y-5" onSubmit={handleSendOtp}>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
                    <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                      <FiMail className="shrink-0 text-lg text-slate-400" />
                      <input
                        id="forgot-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                        className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </span>
                  </label>

                  {renderMessage()}
                  {renderSubmitButton()}
                </form>
              )}

              {step === 2 && (
                <form className="space-y-5" onSubmit={handleVerifyOtp}>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">OTP code</span>
                    <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                      <FiShield className="shrink-0 text-lg text-slate-400" />
                      <input
                        id="forgot-otp"
                        name="otp"
                        type="text"
                        value={otp}
                        onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="0000"
                        inputMode="numeric"
                        maxLength={4}
                        required
                        className="w-full bg-transparent text-sm tracking-[0.35em] text-slate-900 outline-none placeholder:tracking-normal placeholder:text-slate-400"
                      />
                    </span>
                  </label>

                  {renderMessage()}
                  {renderSubmitButton()}
                </form>
              )}

              {step === 3 && (
                <form className="space-y-5" onSubmit={handleResetPassword}>
                  <div className="block">
                    <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700">
                      New password
                    </label>
                    <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                      <FiLock className="shrink-0 text-lg text-slate-400" />
                      <input
                        id="new-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.password}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
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
                    <label htmlFor="confirm-new-password" className="mb-2 block text-sm font-medium text-slate-700">
                      Confirm password
                    </label>
                    <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                      <FiLock className="shrink-0 text-lg text-slate-400" />
                      <input
                        id="confirm-new-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
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

                  {renderMessage()}
                  {renderSubmitButton()}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ForgotPassword
