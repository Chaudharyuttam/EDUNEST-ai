import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <ThemeProvider>
      <Router>
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
