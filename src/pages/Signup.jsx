import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import AuthShell from '../components/AuthShell'
import { saveAuthToken } from '../utils/auth'

const Signup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password', '')

  const onSubmit = (data) => {
    saveAuthToken({ email: data.email, name: data.name })
    setMessage('Account created successfully. Redirecting to your workspace...')
    setTimeout(() => navigate('/'), 600)
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join thousands of learners using EduNest AI for personalized learning and smarter progress tracking."
      footerText="Already have an account?"
      footerLink="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Full name</label>
          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <User size={18} className="mr-3 text-slate-400" />
            <input type="text" placeholder="Ava Carter" className="w-full bg-transparent outline-none" {...register('name', { required: 'Name is required' })} />
          </div>
          {errors.name && <p className="mt-2 text-sm text-rose-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <Mail size={18} className="mr-3 text-slate-400" />
            <input type="email" placeholder="you@example.com" className="w-full bg-transparent outline-none" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} />
          </div>
          {errors.email && <p className="mt-2 text-sm text-rose-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <Lock size={18} className="mr-3 text-slate-400" />
            <input type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" className="w-full bg-transparent outline-none" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="ml-2 text-slate-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-2 text-sm text-rose-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm password</label>
          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <Lock size={18} className="mr-3 text-slate-400" />
            <input type="password" placeholder="Repeat your password" className="w-full bg-transparent outline-none" {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === password || 'Passwords do not match' })} />
          </div>
          {errors.confirmPassword && <p className="mt-2 text-sm text-rose-500">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="btn-primary w-full justify-center">Create account</button>
        {message && <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}
      </form>
    </AuthShell>
  )
}

export default Signup
