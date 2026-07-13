import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import AuthShell from '../components/AuthShell'
import { saveAuthToken } from '../utils/auth'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    saveAuthToken({ email: data.email, name: data.email.split('@')[0] })
    setMessage('Signed in successfully. Redirecting to your dashboard...')
    setTimeout(() => navigate('/'), 600)
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue learning with AI-guided courses, mentors, and personalized study plans."
      footerText="New here?"
      footerLink="/signup"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <Mail size={18} className="mr-3 text-slate-400" />
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-transparent outline-none"
              {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
            />
          </div>
          {errors.email && <p className="mt-2 text-sm text-rose-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <Lock size={18} className="mr-3 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full bg-transparent outline-none"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
            />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="ml-2 text-slate-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-2 text-sm text-rose-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <input type="checkbox" className="rounded border-slate-300" />
            Remember me
          </label>
          <a href="/forgot-password" className="font-semibold text-blue-600 hover:text-violet-600">Forgot password?</a>
        </div>

        <button type="submit" className="btn-primary w-full justify-center">Continue</button>
        {message && <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}
      </form>
    </AuthShell>
  )
}

export default Login
