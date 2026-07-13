import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'

const OtpVerification = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [message, setMessage] = useState('')

  const handleChange = (value, index) => {
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) {
      setMessage('Please enter the full 6-digit code.')
      return
    }

    setMessage('Code verified. You can now continue to your secure account.')
    setTimeout(() => navigate('/login'), 800)
  }

  return (
    <AuthShell
      title="Verify your identity"
      subtitle="Enter the 6-digit code we sent to your email to continue securely."
      footerText="Need a new code?"
      footerLink="/forgot-password"
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="flex justify-between gap-2">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              className="h-12 w-12 rounded-2xl border border-slate-200 bg-white text-center text-lg font-semibold outline-none ring-0 dark:border-slate-700 dark:bg-slate-800"
            />
          ))}
        </div>

        <button type="submit" className="btn-primary w-full justify-center">Verify code</button>
        {message && <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}
      </form>
    </AuthShell>
  )
}

export default OtpVerification
