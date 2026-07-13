import React from 'react'
import TestimonialCard from './TestimonialCard'
import { useTheme } from '../utils/themeContext'

const TestimonialsSection = () => {
  const { isDark } = useTheme()
  const testimonials = [
    { name: 'Sarah Johnson', role: 'Software Engineer', content: 'EduNest AI transformed my learning journey. The personalized approach helped me master React in just two months.', avatar: 'SJ', color: 'from-blue-400 to-blue-600' },
    { name: 'Michael Chen', role: 'Data Scientist', content: 'The quality of courses and community support is unmatched. I landed my dream job thanks to this experience.', avatar: 'MC', color: 'from-violet-400 to-violet-600' },
    { name: 'Emily Rodriguez', role: 'Product Manager', content: 'Best investment I made for my career. The hands-on projects and real-world applications made all the difference.', avatar: 'ER', color: 'from-pink-400 to-pink-600' },
  ]

  return (
    <section id="testimonials" className={`relative overflow-hidden py-20 sm:py-24 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white'}`}>
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="section-shell relative z-10">
        <div className="mb-16 text-center sm:mb-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Student success stories</p>
          <h2 className={`text-4xl font-black sm:text-5xl ${isDark ? 'text-white' : 'bg-gradient-to-r from-blue-700 via-violet-700 to-fuchsia-700 bg-clip-text text-transparent'}`}>What our students say</h2>
          <p className={`mx-auto mt-6 max-w-2xl text-lg sm:text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Join thousands of learners who have transformed their careers with clarity and momentum.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} {...testimonial} delay={index * 0.15} />
          ))}
        </div>

        <div className="mt-16 text-center sm:mt-20">
          <p className={`mb-6 text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Ready to join our community of learners?</p>
          <button className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-blue-600/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            Start your journey today
          </button>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
