import React from 'react'
import { useTheme } from '../utils/themeContext'

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const { isDark } = useTheme()

  return (
    <div className="group animate-fadeIn" style={{ animationDelay: `${delay}s` }}>
      <div className={`glass-card relative h-full overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-24px_rgba(15,23,42,0.45)] ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-fuchsia-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
          <Icon size={28} />
        </div>
        <h3 className="mb-3 text-xl font-bold sm:text-2xl">{title}</h3>
        <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{description}</p>
        <div className="mt-8 h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300 group-hover:w-full" />
      </div>
    </div>
  )
}

export default FeatureCard
