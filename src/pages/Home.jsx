import React from 'react'
import HeroSection from '../components/HeroSection'
import HowItWorksSection from '../components/HowItWorksSection'
import FeaturesSection from '../components/FeaturesSection'
import StudentJourneySection from '../components/StudentJourneySection'
import CTASection from '../components/CTASection'

/**
 * Home page — EduNest AI
 *
 * Story flow:
 *   Hero → How It Works → AI Features → Student Journey → CTA
 *
 * Removed: TrustedCompanies (fake logos), PlatformSection (generic),
 *          Newsletter (off-topic), TestimonialsSection (generic).
 */
const Home = () => {
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <StudentJourneySection />
      <CTASection />
    </main>
  )
}

export default Home
