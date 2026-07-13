import React from 'react'
import { Star } from 'lucide-react'
import { useTheme } from '../utils/themeContext'

const TestimonialCard = ({ name, role, content, avatar, color = 'from-blue-400 to-blue-600', delay = 0 }) => {
  const { isDark } = useTheme()

  return (
    <div className="animate-fadeIn" style={{ animationDelay: `${delay}s` }}>
      <div className={`glass-card group h-full p-8 transition-all duration-300 hover:-translate-y-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        <div className="mb-6 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} className="fill-amber-400 text-amber-400 transition-transform duration-300 group-hover:scale-110" style={{ transitionDelay: `${i * 0.05}s` }} />
          ))}
        </div>
        <p className={`mb-8 text-base leading-relaxed italic sm:text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>“{content}”</p>
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300 group-hover:w-full" />
        <div className="mt-6 flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${color} text-lg font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
            {avatar}
          </div>
          <div>
            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{name}</p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
