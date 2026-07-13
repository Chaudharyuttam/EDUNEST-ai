import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import AuthShell from '../components/AuthShell'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    setMessage(`A reset link has been prepared for ${data.email}. Redirecting to OTP verification...`)
    setTimeout(() => navigate('/otp-verification'), 700)
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we’ll guide you through a secure reset process."
      footerText="Remembered your password?"
      footerLink="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <Mail size={18} className="mr-3 text-slate-400" />
            <input type="email" placeholder="you@example.com" className="w-full bg-transparent outline-none" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} />
          </div>
          {errors.email && <p className="mt-2 text-sm text-rose-500">{errors.email.message}</p>}
        </div>

        <button type="submit" className="btn-primary w-full justify-center">Send reset code</button>
        {message && <p className="rounded-2xl bg-blue-500/10 px-4 py-3 text-sm text-blue-600 dark:text-blue-400">{message}</p>}
      </form>
    </AuthShell>
  )
}

export default ForgotPassword
