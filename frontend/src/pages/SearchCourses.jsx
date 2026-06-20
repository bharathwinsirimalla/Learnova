import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FiArrowLeft, FiBookOpen, FiMic, FiSearch, FiSquare, FiVolume2 } from 'react-icons/fi'
import Card from '../component/Card'

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

const SPEECH_LANG = 'en-US'

const READ_ALOUD_PHRASE = 'Following courses are found.'

const SEARCH_DEBOUNCE_MS = 320

function SearchCourses() {
  const [searchParams] = useSearchParams()
  const { userData } = useSelector((state) => state.user)
  const [query, setQuery] = useState(() => searchParams.get('q')?.trim() || '')
  const [results, setResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeakResults, setAutoSpeakResults] = useState(true)
  const recognitionRef = useRef(null)
  const searchAbortRef = useRef(null)
  const searchSeqRef = useRef(0)

  const autoSpeakResultsRef = useRef(true)
  useEffect(() => {
    autoSpeakResultsRef.current = autoSpeakResults
  }, [autoSpeakResults])

  const enrolledCourseIds = useMemo(() => {
    const list = userData?.enrolledCourses
    if (!Array.isArray(list)) {
      return new Set()
    }
    return new Set(list.map((entry) => String(entry?._id ?? entry)))
  }, [userData?.enrolledCourses])

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  const speakFoundPhrase = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return false
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(READ_ALOUD_PHRASE)
    utterance.lang = SPEECH_LANG
    utterance.rate = 0.92
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    return true
  }, [])

  const speakResults = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast.error('Read aloud is not supported in this browser.')
      return
    }
    if (!results.length) {
      toast.info('Run a search with results first.')
      return
    }

    speakFoundPhrase()
  }, [results.length, speakFoundPhrase])

  const fetchCourseSearch = useCallback(
    async (rawInput, { announce = false } = {}) => {
      const input = String(rawInput ?? '').trim()

      if (!input) {
        searchAbortRef.current?.abort()
        searchAbortRef.current = null
        searchSeqRef.current += 1
        setResults([])
        setError('')
        setHasSearched(false)
        setIsLoading(false)
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel()
        }
        setIsSpeaking(false)
        return
      }

      setIsLoading(true)
      setError('')
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      setIsSpeaking(false)

      const seq = ++searchSeqRef.current
      searchAbortRef.current?.abort()
      const controller = new AbortController()
      searchAbortRef.current = controller

      try {
        const { data } = await axios.post('/api/course/search', { input }, { signal: controller.signal })
        if (seq !== searchSeqRef.current) {
          return
        }
        const list = Array.isArray(data) ? data : []
        setResults(list)
        setHasSearched(true)

        const shouldAutoSpeak =
          announce &&
          typeof window !== 'undefined' &&
          window.speechSynthesis &&
          autoSpeakResultsRef.current &&
          list.length > 0

        if (shouldAutoSpeak) {
          queueMicrotask(() => {
            speakFoundPhrase()
          })
        }
      } catch (requestError) {
        if (requestError?.code === 'ERR_CANCELED' || requestError?.name === 'CanceledError') {
          return
        }
        if (seq !== searchSeqRef.current) {
          return
        }
        setResults([])
        setError(requestError.response?.data?.message || 'Search failed. Try again.')
        setHasSearched(true)
      } finally {
        if (seq === searchSeqRef.current) {
          setIsLoading(false)
        }
      }
    },
    [speakFoundPhrase],
  )

  useEffect(() => {
    const q = searchParams.get('q')?.trim()
    if (q) {
      setQuery(q)
    }
  }, [searchParams])

  useEffect(() => {
    const trimmed = query.trim()
    const timer = window.setTimeout(() => {
      void fetchCourseSearch(trimmed, { announce: false })
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [query, fetchCourseSearch])

  useEffect(() => {
    return () => {
      searchAbortRef.current?.abort()
      try {
        recognitionRef.current?.abort?.()
      } catch {
        /* ignore */
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch {
      /* ignore */
    }
    setIsListening(false)
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition()
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser. Try Chrome or Edge.')
      return
    }

    try {
      recognitionRef.current?.abort?.()
    } catch {
      /* ignore */
    }

    const recognition = new SpeechRecognition()
    recognition.lang = SPEECH_LANG
    recognition.interimResults = false
    recognition.continuous = false
    recognitionRef.current = recognition

    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript?.trim()
      if (text) {
        setQuery(text)
      }
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        toast.error('Could not capture speech. Check the microphone permission.')
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      setIsListening(true)
      recognition.start()
    } catch {
      setIsListening(false)
      toast.error('Could not start the microphone.')
    }
  }, [])

  const toggleMic = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      toast.error('Enter a topic or keyword to search.')
      return
    }
    void fetchCourseSearch(trimmed, { announce: true })
  }

  const voiceSupported = typeof window !== 'undefined' && Boolean(getSpeechRecognition())
  const speechSupported = typeof window !== 'undefined' && Boolean(window.speechSynthesis)

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 px-4 py-14 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 80% 55% at 20% 0%, rgba(37, 99, 235, 0.45), transparent 55%), radial-gradient(ellipse 60% 50% at 85% 20%, rgba(124, 45, 240, 0.35), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-4xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-blue-100 transition hover:text-white"
          >
            <FiArrowLeft className="text-base" />
            Back to home
          </Link>

          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-100">
            <FiBookOpen className="text-sm" />
            Published courses
          </div>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            AI course search
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-blue-100 sm:text-base">
            Describe what you want to learn in natural language. Gemini expands your intent into
            useful course keywords while results still filter as you type.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search courses</span>
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. React, UI design, beginner Python…"
                autoComplete="off"
                className="h-14 w-full rounded-xl border border-white/20 bg-white/95 pl-12 pr-14 text-sm font-semibold text-slate-900 shadow-lg outline-none ring-0 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-300/40"
              />
              <button
                type="button"
                onClick={toggleMic}
                disabled={!voiceSupported}
                title={
                  voiceSupported
                    ? isListening
                      ? 'Stop listening'
                      : 'Search by voice'
                    : 'Voice input not available in this browser'
                }
                className={`absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg border transition focus:outline-none focus:ring-4 focus:ring-blue-300/50 disabled:cursor-not-allowed disabled:opacity-40 ${
                  isListening
                    ? 'border-rose-300 bg-rose-50 text-rose-600 ring-2 ring-rose-200 animate-pulse'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                }`}
                aria-pressed={isListening}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              >
                <FiMic className="text-lg" />
              </button>
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 text-sm font-extrabold text-white shadow-lg transition hover:from-blue-500 hover:to-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-300/50 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[11rem]"
            >
              {isLoading ? (
                'Searching…'
              ) : (
                <>
                  <FiSearch className="text-lg" />
                  Search
                </>
              )}
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/15 bg-white/5 p-4 sm:flex-row sm:items-center">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-white">
              <input
                type="checkbox"
                checked={autoSpeakResults}
                onChange={(e) => setAutoSpeakResults(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
              />
              Say “Following courses are found.” when you press Search (not while typing)
            </label>
          </div>

          <p className="mt-4 text-xs font-semibold text-blue-200/90">
            Tip: results update while you type. Read aloud only says “Following courses are found.”
            Use Search or Read again to hear it when there are matches.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">Results</h2>
            {hasSearched && !isLoading && !error && (
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {results.length} {results.length === 1 ? 'course' : 'courses'} matched
              </p>
            )}
          </div>
          <Link
            to="/all-courses"
            className="text-sm font-bold text-blue-700 transition hover:text-violet-700"
          >
            Browse full catalog →
          </Link>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-500">Finding courses…</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-rose-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-extrabold text-rose-600">{error}</p>
            <button
              type="button"
              onClick={() => void fetchCourseSearch(query.trim(), { announce: false })}
              className="mt-4 text-sm font-bold text-blue-700 hover:text-violet-700"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && hasSearched && results.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
            <FiSearch className="mx-auto text-3xl text-slate-300" />
            <p className="mt-4 text-base font-extrabold text-slate-800">No courses matched</p>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Try different keywords, a shorter phrase, or browse all published courses.
            </p>
          </div>
        )}

        {!isLoading && !error && results.length > 0 && (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Audio
              </span>
              <button
                type="button"
                onClick={speakResults}
                disabled={!speechSupported}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiVolume2 className="text-lg text-violet-600" />
                Read again
              </button>
              <button
                type="button"
                onClick={stopSpeaking}
                disabled={!speechSupported || !isSpeaking}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiSquare className="text-base text-rose-600" />
                Stop
              </button>
              {!speechSupported && (
                <span className="text-xs font-semibold text-slate-400">
                  Read aloud is not supported here.
                </span>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((course) => (
                <Card
                  key={course._id || course.title}
                  course={course}
                  to={`/view-course/${course._id}`}
                  inLibrary={enrolledCourseIds.has(String(course._id))}
                />
              ))}
            </div>
          </>
        )}

        {!isLoading && !hasSearched && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-600">
              Use the search bar above to find published courses.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Popular starting points
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['Web development', 'UI design', 'Data analytics'].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setQuery(topic)
                    void fetchCourseSearch(topic, { announce: true })
                  }}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default SearchCourses
