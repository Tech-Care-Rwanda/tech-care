"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle, Upload, X, Eye, EyeOff, Loader2, Users, Wrench } from 'lucide-react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { getPostSignupRedirect } from '@/lib/utils/authUtils'

type UserType = 'customer' | 'technician'

interface CustomerFormData {
  fullName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

interface TechnicianFormData extends CustomerFormData {
  gender: string
  age: number
  DateOfBirth: string
  experience: string
  specialization: string
  profileImage?: File
  certificateDocument?: File
}

export default function SignupPage() {
  const router = useRouter()
  const { customerRegister, technicianRegister, isLoading } = useAuth()

  const [userType, setUserType] = useState<UserType | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const [customerData, setCustomerData] = useState<CustomerFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  })

  const [technicianData, setTechnicianData] = useState<TechnicianFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    gender: '',
    age: 0,
    DateOfBirth: '',
    experience: '',
    specialization: ''
  })

  const specializations = [
    'Computer Repair', 'Phone Repair', 'Software Installation',
    'Network Setup', 'Data Recovery', 'Virus Removal',
    'Hardware Installation', 'TV Setup', 'Audio Systems',
    'Smart Home Setup', 'Gaming Console Repair', 'Printer Setup'
  ]

  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleTechnicianInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setTechnicianData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
    if (error) setError('')
  }

  const handleFileUpload = (name: string, file: File) => {
    setTechnicianData(prev => ({ ...prev, [name]: file }))
  }

  const validateCustomerForm = (): boolean => {
    if (!customerData.fullName || !customerData.email || !customerData.phoneNumber || !customerData.password) {
      setError('Please fill in all required fields')
      return false
    }

    if (customerData.password !== customerData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (customerData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    return true
  }

  const validateTechnicianForm = (): boolean => {
    if (!technicianData.fullName || !technicianData.email || !technicianData.phoneNumber ||
      !technicianData.password || !technicianData.gender || !technicianData.age ||
      !technicianData.DateOfBirth || !technicianData.experience || !technicianData.specialization) {
      setError('Please fill in all required fields')
      return false
    }

    if (technicianData.password !== technicianData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (technicianData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (technicianData.age < 18 || technicianData.age > 100) {
      setError('Age must be between 18 and 100')
      return false
    }

    return true
  }

  const handleCustomerSubmit = async () => {
    if (!validateCustomerForm()) return

    try {
      const result = await customerRegister({
        fullName: customerData.fullName,
        email: customerData.email,
        phoneNumber: customerData.phoneNumber,
        password: customerData.password
      })

      if (result.success) {
        // Redirect to customer dashboard after successful registration
        const redirectPath = getPostSignupRedirect('CUSTOMER')
        router.push(redirectPath)
      } else {
        setError(result.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleTechnicianSubmit = async () => {
    if (!validateTechnicianForm()) return

    try {
      const result = await technicianRegister({
        fullName: technicianData.fullName,
        email: technicianData.email,
        phoneNumber: technicianData.phoneNumber,
        password: technicianData.password,
        gender: technicianData.gender,
        age: technicianData.age,
        DateOfBirth: technicianData.DateOfBirth,
        experience: technicianData.experience,
        specialization: technicianData.specialization,
        profileImage: technicianData.profileImage,
        certificateDocument: technicianData.certificateDocument
      })

      if (result.success) {
        // Redirect to pending approval page since technicians need admin approval
        const redirectPath = getPostSignupRedirect('TECHNICIAN')
        router.push(redirectPath)
      } else {
        setError(result.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const getStepClass = (step: number) => {
    if (step < currentStep) return 'bg-green-500 text-white'
    if (step === currentStep) return 'bg-red-500 text-white'
    return 'bg-gray-200 text-gray-500'
  }

  const renderUserTypeSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Account Type</h2>
        <p className="text-gray-600">Select how you'd like to use TechCare</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => {
            setUserType('customer')
            setCurrentStep(2)
          }}
          className="p-8 border-2 border-gray-200 rounded-2xl hover:border-red-500 hover:bg-red-50 transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Customer</h3>
            <p className="text-gray-600">Get help with your technology needs from qualified technicians</p>
            <div className="mt-4 space-y-2">
              <div className="text-sm text-green-600">✓ Book technician services</div>
              <div className="text-sm text-green-600">✓ Track service history</div>
              <div className="text-sm text-green-600">✓ Rate and review technicians</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            setUserType('technician')
            setCurrentStep(2)
          }}
          className="p-8 border-2 border-gray-200 rounded-2xl hover:border-red-500 hover:bg-red-50 transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200">
              <Wrench className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Technician</h3>
            <p className="text-gray-600">Offer your technical skills and earn money helping others</p>
            <div className="mt-4 space-y-2">
              <div className="text-sm text-green-600">✓ Earn flexible income</div>
              <div className="text-sm text-green-600">✓ Set your own schedule</div>
              <div className="text-sm text-green-600">✓ Build your reputation</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )

  const renderCustomerForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Registration</h2>
        <p className="text-gray-600">Create your customer account to get started</p>
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          value={customerData.fullName}
          onChange={handleCustomerInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Enter your full name"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={customerData.email}
          onChange={handleCustomerInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="your.email@example.com"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          required
          value={customerData.phoneNumber}
          onChange={handleCustomerInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="+250 7XX XXX XXX"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            required
            value={customerData.password}
            onChange={handleCustomerInputChange}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Create a secure password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            required
            value={customerData.confirmPassword}
            onChange={handleCustomerInputChange}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => {
            setUserType(null)
            setCurrentStep(1)
          }}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          disabled={isLoading}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleCustomerSubmit}
          disabled={isLoading}
          className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </div>
    </div>
  )

  const renderTechnicianStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Technician Registration - Step 1</h2>
        <p className="text-gray-600">Personal Information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={technicianData.fullName}
            onChange={handleTechnicianInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter your full name"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={technicianData.email}
            onChange={handleTechnicianInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="your.email@example.com"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            required
            value={technicianData.phoneNumber}
            onChange={handleTechnicianInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="+250 7XX XXX XXX"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={technicianData.gender}
            onChange={handleTechnicianInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            type="number"
            id="age"
            name="age"
            required
            min="18"
            max="100"
            value={technicianData.age || ''}
            onChange={handleTechnicianInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Your age"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="DateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            id="DateOfBirth"
            name="DateOfBirth"
            required
            value={technicianData.DateOfBirth}
            onChange={handleTechnicianInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            required
            value={technicianData.password}
            onChange={handleTechnicianInputChange}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Create a secure password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            required
            value={technicianData.confirmPassword}
            onChange={handleTechnicianInputChange}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => {
            setUserType(null)
            setCurrentStep(1)
          }}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          disabled={isLoading}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
          disabled={isLoading}
        >
          Next Step
        </button>
      </div>
    </div>
  )

  const renderTechnicianStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Technician Registration - Step 2</h2>
        <p className="text-gray-600">Professional Information & Documents</p>
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
          Years of Experience *
        </label>
        <select
          id="experience"
          name="experience"
          required
          value={technicianData.experience}
          onChange={handleTechnicianInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          disabled={isLoading}
        >
          <option value="">Select experience level</option>
          <option value="0-1 years">0-1 years (Beginner)</option>
          <option value="1-3 years">1-3 years (Intermediate)</option>
          <option value="3-5 years">3-5 years (Advanced)</option>
          <option value="5+ years">5+ years (Expert)</option>
        </select>
      </div>

      <div>
        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
          Primary Specialization *
        </label>
        <select
          id="specialization"
          name="specialization"
          required
          value={technicianData.specialization}
          onChange={handleTechnicianInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          disabled={isLoading}
        >
          <option value="">Select your specialization</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Image
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload('profileImage', file)
            }}
            className="hidden"
            id="profileImage"
            disabled={isLoading}
          />
          <label htmlFor="profileImage" className="cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {technicianData.profileImage ? technicianData.profileImage.name : 'Upload profile image (optional)'}
            </p>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certificate/Qualification Document
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload('certificateDocument', file)
            }}
            className="hidden"
            id="certificateDocument"
            disabled={isLoading}
          />
          <label htmlFor="certificateDocument" className="cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {technicianData.certificateDocument ? technicianData.certificateDocument.name : 'Upload certificate/qualification (optional)'}
            </p>
          </label>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          disabled={isLoading}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleTechnicianSubmit}
          disabled={isLoading}
          className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Creating Account...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </div>
  )

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
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          {/* Progress Steps for Technician */}
          {userType === 'technician' && currentStep > 1 && (
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getStepClass(2)}`}>
                    {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : '1'}
                  </div>
                  <span className="ml-2 text-sm font-medium">Personal Info</span>
                </div>
                <div className="w-12 h-1 bg-gray-200 rounded" />
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getStepClass(3)}`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">Professional</span>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Form Content */}
            {currentStep === 1 && renderUserTypeSelection()}
            {currentStep === 2 && userType === 'customer' && renderCustomerForm()}
            {currentStep === 2 && userType === 'technician' && renderTechnicianStep1()}
            {currentStep === 3 && userType === 'technician' && renderTechnicianStep2()}

            {/* Already have account link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-red-600 hover:text-red-700">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 