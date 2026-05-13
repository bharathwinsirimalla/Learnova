import { Link } from 'react-router-dom'
import {
  FiActivity,
  FiBarChart2,
  FiCode,
  FiCpu,
  FiDatabase,
  FiFigma,
  FiLayers,
  FiLock,
  FiSmartphone,
  FiZap,
} from 'react-icons/fi'

const categories = [
  {
    title: 'Web Development',
    icon: FiCode,
    color: 'text-[#2563eb]',
    bg: 'bg-blue-50',
  },
  {
    title: 'UI/UX Designing',
    icon: FiFigma,
    color: 'text-[#7c2df0]',
    bg: 'bg-violet-50',
  },
  {
    title: 'App Development',
    icon: FiSmartphone,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Ethical Hacking',
    icon: FiLock,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    title: 'AI/ML',
    icon: FiCpu,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    title: 'Data Science',
    icon: FiDatabase,
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
  },
  {
    title: 'Data Analytics',
    icon: FiBarChart2,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    title: 'AI Tools',
    icon: FiZap,
    color: 'text-fuchsia-600',
    bg: 'bg-fuchsia-50',
  },
]

function ExploreCourses() {
  return (
    <section className="border-b border-slate-200 bg-white py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div>
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
            <FiLayers className="text-2xl" />
          </div>
          <p className="text-sm font-semibold uppercase text-[#2563eb]">
            Course categories
          </p>
          <h2 className="mt-3 max-w-lg text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
            Explore courses built for today&apos;s digital skills.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Find focused learning paths across development, design, cyber security, AI, and data.
            Pick a category and move into practical, career-ready coursework.
          </p>
          <Link
            to="/all-courses"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Explore courses
            <FiActivity className="text-base" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon

            return (
              <article
                key={category.title}
                className="group rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${category.bg}`}
                >
                  <Icon className={`text-xl ${category.color}`} />
                </span>
                <h3 className="mt-5 min-h-12 text-base font-bold leading-6 text-slate-950">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-slate-400 transition group-hover:text-[#2563eb]">
                  View category
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ExploreCourses
