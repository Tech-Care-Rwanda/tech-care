"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Upload, X } from 'lucide-react'

interface FormData {
  // Step 1: Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  location: string
  profilePicture?: File
  
  // Step 2: Skills & Experience
  skills: string[]
  experience: string
  certifications: string[]
  portfolio: string
  availability: string[]
  serviceAreas: string[]
  
  // Step 3: Verification
  idDocument?: File
  resume?: File
  references: string
  backgroundCheck: boolean
  termsAccepted: boolean
}

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    skills: [],
    experience: '',
    certifications: [],
    portfolio: '',
    availability: [],
    serviceAreas: [],
    references: '',
    backgroundCheck: false,
    termsAccepted: false
  })

  const availableSkills = [
    'Computer Repair', 'Phone Repair', 'Software Installation', 
    'Network Setup', 'Data Recovery', 'Virus Removal',
    'Hardware Installation', 'TV Setup', 'Audio Systems',
    'Smart Home Setup', 'Gaming Console Repair', 'Printer Setup'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleFileUpload = (name: string, file: File) => {
    setFormData(prev => ({ ...prev, [name]: file }))
  }

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log('Form submitted:', formData)
  }

  const getStepClass = (step: number) => {
    if (step < currentStep) return 'step-completed bg-gradient-to-r from-green-500 to-green-600 text-white'
    if (step === currentStep) return 'step-active bg-gradient-to-r from-red-500 to-red-600 text-white'
    return 'step-inactive bg-gray-200 text-gray-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">TechCare</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors">Services</Link>
              <Link href="/technicians" className="text-gray-600 hover:text-gray-900 transition-colors">Technicians</Link>
              <Link href="/learn" className="text-gray-600 hover:text-gray-900 transition-colors">Learn</Link>
              <Link href="/login" className="text-red-500 hover:text-red-600 transition-colors font-medium">Sign In</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-element absolute top-20 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-20" />
          <div className="floating-element absolute top-40 right-20 w-12 h-12 bg-green-200 rounded-full opacity-20" style={{ animationDelay: '-2s' }} />
          <div className="floating-element absolute bottom-20 left-20 w-20 h-20 bg-purple-200 rounded-full opacity-20" style={{ animationDelay: '-4s' }} />
          <div className="floating-element absolute bottom-40 right-10 w-14 h-14 bg-pink-200 rounded-full opacity-20" style={{ animationDelay: '-1s' }} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Technician Network</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Help Rwanda's households and businesses with their technology needs while earning flexible income</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${getStepClass(1)}`}>
                  {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Personal Info</span>
              </div>
              <div className="w-12 h-1 bg-gray-200 rounded" />
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${getStepClass(2)}`}>
                  {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Skills & Experience</span>
              </div>
              <div className="w-12 h-1 bg-gray-200 rounded" />
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${getStepClass(3)}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Verification</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-3 focus:ring-red-500/10"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-3 focus:ring-red-500/10"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-3 focus:ring-red-500/10"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-3 focus:ring-red-500/10"
                        placeholder="+250 7XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-3 focus:ring-red-500/10"
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-3 focus:ring-red-500/10"
                        placeholder="Kigali, Rwanda"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Skills & Experience */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Experience</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Technical Skills *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                            formData.skills.includes(skill)
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                    <select
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-3 focus:ring-red-500/10"
                    >
                      <option value="">Select experience level</option>
                      <option value="0-1">0-1 years (Beginner)</option>
                      <option value="1-3">1-3 years (Intermediate)</option>
                      <option value="3-5">3-5 years (Advanced)</option>
                      <option value="5+">5+ years (Expert)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website</label>
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-3 focus:ring-red-500/10"
                      placeholder="https://your-portfolio.com"
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Verification */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification & Documents</h2>
                  
                  <div>
                    <label htmlFor="references" className="block text-sm font-medium text-gray-700 mb-2">Professional References</label>
                    <textarea
                      id="references"
                      name="references"
                      rows={4}
                      value={formData.references}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-3 focus:ring-red-500/10"
                      placeholder="List any professional references (name, company, contact)"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="backgroundCheck"
                        name="backgroundCheck"
                        type="checkbox"
                        checked={formData.backgroundCheck}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="backgroundCheck" className="ml-3 text-sm text-gray-700">
                        I consent to a background check
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="termsAccepted"
                        name="termsAccepted"
                        type="checkbox"
                        required
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="termsAccepted" className="ml-3 text-sm text-gray-700">
                        I agree to the <Link href="/terms" className="text-red-500 hover:text-red-600">Terms of Service</Link> and <Link href="/privacy" className="text-red-500 hover:text-red-600">Privacy Policy</Link> *
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Submit Application
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <style jsx>{`
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
} 