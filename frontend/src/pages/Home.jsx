import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi'
import About from '../component/About'
import ExploreCourses from '../component/ExploreCourses'
import CardPage from '../component/CardPage'
import ReviewPage from '../component/ReviewPage'

const heroImage =
  'https://images.pexels.com/photos/7742816/pexels-photo-7742816.jpeg?auto=compress&cs=tinysrgb&w=1800'

const mentorImage =
  'https://images.pexels.com/photos/5212655/pexels-photo-5212655.jpeg?auto=compress&cs=tinysrgb&w=900'

const workspaceImage =
  'https://images.pexels.com/photos/20432872/pexels-photo-20432872.jpeg?auto=compress&cs=tinysrgb&w=900'

const platformHighlights = [
  {
    title: 'Organized workspace',
    text: 'Keep study material, updates, and progress signals in one clean learning environment.',
    icon: FiBookOpen,
    color: 'text-[#2563eb]',
    bg: 'bg-blue-50',
  },
  {
    title: 'Progress clarity',
    text: 'Help learners understand what is complete, what needs attention, and what comes next.',
    icon: FiTrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Educator ready',
    text: 'Give educators a professional place to manage learning activity without visual clutter.',
    icon: FiAward,
    color: 'text-[#7c2df0]',
    bg: 'bg-violet-50',
  },
]

const outcomes = [
  'Clean student and educator experiences',
  'Focused dashboards for repeated daily use',
  'A flexible foundation for upcoming creation tools',
]

function Home() {
  const { userData } = useSelector((state) => state.user)
  const primaryLink = userData ? '/all-courses' : '/signup'
  const primaryText = userData ? 'View courses' : 'Get started'

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
        <img
          src={heroImage}
          alt="Students learning with laptops in a classroom"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,13,38,0.92)_0%,rgba(7,27,77,0.82)_45%,rgba(38,24,102,0.48)_100%)]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-50 backdrop-blur">
              <FiBookOpen className="text-base" />
              Learnova LMS
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              A polished learning workspace for students and educators.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-blue-50 sm:text-lg">
              Learnova keeps learning activity focused, organized, and easy to return to every day.
              It is built for calm navigation, clear progress, and a professional classroom feel.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={primaryLink}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                {primaryText}
                <FiArrowRight className="text-base" />
              </Link>
              <Link
                to="/search-courses"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                <FiSearch className="text-base" />
                Search courses
              </Link>
              {!userData && (
                <Link
                  to="/login"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/20"
                >
                  Login
                </Link>
              )}
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 text-white">
              <div className="border-l border-white/25 pl-4">
                <p className="text-2xl font-extrabold">24k+</p>
                <p className="mt-1 text-sm text-blue-100">learners</p>
              </div>
              <div className="border-l border-white/25 pl-4">
                <p className="text-2xl font-extrabold">12 hrs</p>
                <p className="mt-1 text-sm text-blue-100">weekly focus</p>
              </div>
              <div className="border-l border-white/25 pl-4">
                <p className="text-2xl font-extrabold">98%</p>
                <p className="mt-1 text-sm text-blue-100">completion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ExploreCourses />
      <ReviewPage />
      <CardPage />
      <About />

      <section className="border-b border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-[#2563eb]">
              Platform foundation
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
              Designed for learning workflows that feel simple to manage.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The home experience now highlights the product direction without showing unfinished
              builder features.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {platformHighlights.map((item) => {
              const Icon = item.icon

              return (
                <article
                  key={item.title}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bg}`}>
                    <Icon className={`text-xl ${item.color}`} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-[#7c2df0]">
              Learning environment
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-extrabold text-slate-950">
              Built to feel calm, modern, and ready for real academic work.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Learnova keeps the interface quiet and purposeful, so learners can focus and educators
              can work without fighting the layout.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
                    <FiUsers className="text-xl" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Student-first navigation</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Clear routes, familiar actions, and fewer distractions across the main app.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <FiClock className="text-xl" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Daily-use polish</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Balanced spacing, readable hierarchy, and responsive layouts for repeated use.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src={mentorImage}
              alt="Teacher leading an online learning session"
              className="h-72 w-full rounded-lg object-cover shadow-sm sm:h-full"
            />
            <div className="grid gap-4">
              <img
                src={workspaceImage}
                alt="Laptop ready for classroom learning"
                className="h-44 w-full rounded-lg object-cover shadow-sm"
              />
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase text-[#2563eb]">
                  Learnova style
                </p>
                <p className="mt-3 text-3xl font-extrabold text-slate-950">Blue to violet</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The visual system follows the logo glow with crisp white surfaces and focused
                  contrast.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-[#2563eb]">
              What stays ready
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
              A strong base for the next product features.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {outcomes.map((outcome) => (
              <div key={outcome} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <FiCheckCircle className="text-2xl text-emerald-600" />
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
