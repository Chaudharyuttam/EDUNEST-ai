import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../utils/themeContext'

const TrustedCompanies = () => {
  const { isDark } = useTheme()
  const companies = [
    { name: 'Google', icon: '🔍' },
    { name: 'Microsoft', icon: '💻' },
    { name: 'OpenAI', icon: '⚡' },
    { name: 'Coursera', icon: '🎓' },
  ]

  return (
    <section className={`relative overflow-hidden py-16 sm:py-20 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_35%)]" />
      <div className="section-shell relative z-10">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Aligned with the best</p>
          <h2 className={`text-3xl font-black sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Trusted by modern learners and teams</h2>
          <p className={`mx-auto mt-4 max-w-2xl text-base sm:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>EduNest AI brings together the depth of elite learning environments with the speed of conversational support.</p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {companies.map((company, index) => (
            <div key={company.name} className="group animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`glass-card cursor-pointer p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-24px_rgba(0,0,0,0.25)] ${isDark ? 'border-white/10 bg-slate-900/70' : 'border-white/80 bg-white/70'}`}>
                <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110 sm:text-5xl">{company.icon}</div>
                <p className={`text-base font-bold sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{company.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center sm:mt-16">
          <Link to="/chat" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1">
            Try the AI tutor now
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TrustedCompanies
