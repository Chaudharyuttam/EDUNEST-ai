/**
 * CTASection.jsx
 * Final call-to-action — clear, bold, placement-focused.
 * Replaces Newsletter + old CTA sections.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../utils/themeContext'
import { Sparkles, ArrowRight, Bot, Map } from 'lucide-react'

const CTASection = () => {
  const { isDark } = useTheme()

  return (
    <section className="relative overflow-hidden py-24">
      {/* Full-bleed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-violet-700 to-fuchsia-700" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)]" />
      <div className="absolute left-[-5rem] top-[-4rem] h-80 w-80 animate-blob rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-[-4rem] right-[-3rem] h-80 w-80 animate-blob animation-delay-2000 rounded-full bg-white/5 blur-3xl" />

      <div className="section-shell relative z-10 text-center text-white">
        <div className="mx-auto max-w-3xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold backdrop-blur">
            <Sparkles size={14} />
            Join 50,000+ Students Already Preparing
          </div>

          <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Your Placement Dream is
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Closer Than You Think
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
            Stop wasting time figuring out what to study next. Let EduNest AI build your roadmap, coach your prep, and guide you to the offer letter.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/roadmap"
              className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-black text-violet-700 shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl"
            >
              <Map size={18} /> Generate My Roadmap
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
            >
              <Bot size={18} /> Talk to AI Mentor <ArrowRight size={16} />
            </Link>
          </div>

          {/* Social proof micro-line */}
          <p className="mt-8 text-sm text-white/50">
            Free to start · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTASection
