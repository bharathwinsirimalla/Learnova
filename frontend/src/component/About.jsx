import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheckCircle, FiHeart, FiTarget, FiUsers } from 'react-icons/fi'

const aboutImage =
  'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1200'

const pillars = [
  {
    title: 'Learners stay oriented',
    text: 'Clear course pages, previews, and progress cues so students always know what to do next.',
    icon: FiUsers,
  },
  {
    title: 'Educators stay in control',
    text: 'Publishing, lectures, and pricing live in one calm workspace—without noisy dashboards.',
    icon: FiTarget,
  },
  {
    title: 'Trust by design',
    text: 'Straightforward enrollment and payments, with a classroom experience that feels familiar.',
    icon: FiHeart,
  },
]

function About() {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/40 to-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:items-center lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]">
              <img
                src={aboutImage}
                alt="Collaborative learning with peers around a laptop"
                className="aspect-[4/3] w-full object-cover sm:aspect-[5/4]"
              />
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:absolute sm:-bottom-5 sm:-right-4 sm:mt-0 sm:max-w-[16rem] sm:border-white/80 sm:bg-white/95 sm:p-5 sm:shadow-lg sm:backdrop-blur">
              <p className="text-xs font-extrabold uppercase tracking-wide text-blue-700">Why Learnova</p>
              <p className="mt-2 text-sm font-bold leading-snug text-slate-900">
                One platform for discovery, enrollment, and day-to-day learning.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#7c2df0]">About Learnova</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              We built an LMS that respects how people actually learn.
            </h2>
            <p className="mt-5 text-base font-medium leading-7 text-slate-600">
              Learnova is a learning management system focused on clarity: students can explore
              courses, preview lessons, and enroll with confidence. Educators get structured tools to
              publish content and grow an audience—without sacrificing a polished, professional look.
            </p>
            <p className="mt-4 text-base font-medium leading-7 text-slate-600">
              Whether you are upskilling after work or running a full catalog, the experience stays
              consistent, responsive, and easy to return to every day.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                'Course discovery with categories and rich detail pages',
                'Secure enrollment and payments with Razorpay checkout',
                'Dedicated lesson view for focused watching and outlines',
              ].map((line) => (
                <li key={line} className="flex gap-3 text-sm font-semibold leading-6 text-slate-700">
                  <FiCheckCircle className="mt-0.5 shrink-0 text-lg text-emerald-600" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                to="/all-courses"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Browse the catalog
                <FiArrowRight className="text-base" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {pillars.map((item) => {
            const Icon = item.icon
            return (
              <article
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                  <Icon className="text-xl" />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{item.text}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default About
