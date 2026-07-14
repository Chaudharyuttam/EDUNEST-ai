import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import OtpVerification from './pages/OtpVerification'
import ChatAssistant from './pages/ChatAssistant'
import RoadmapGenerator from './pages/RoadmapGenerator'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import { ThemeProvider } from './utils/themeContext'

const ScrollToHash = () => {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    const scrollToTarget = () => {
      const targetId = hash.replace('#', '')
      const target = targetId && document.getElementById(targetId)

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (!hash) {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }

    // Wait until the route's sections have rendered before looking up the ID.
    const frame = requestAnimationFrame(scrollToTarget)
    return () => cancelAnimationFrame(frame)
  }, [hash, pathname])

  return null
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToHash />
        <div className="flex min-h-screen flex-col bg-transparent transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/otp-verification" element={<OtpVerification />} />
              <Route path="/chat" element={<ChatAssistant />} />
              <Route path="/roadmap" element={<RoadmapGenerator />} />
              <Route path="/resume" element={<ResumeAnalyzer />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
