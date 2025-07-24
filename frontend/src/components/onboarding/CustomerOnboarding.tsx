"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  ArrowRight, 
  User, 
  Search, 
  Calendar, 
  Star,
  X,
  Lightbulb
} from 'lucide-react'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import Link from 'next/link'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  completed: boolean
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

interface CustomerOnboardingProps {
  onDismiss?: () => void
  className?: string
}

/**
 * Customer Onboarding Component
 * Guides new customers through their first experience with the platform
 */
export function CustomerOnboarding({ onDismiss, className }: CustomerOnboardingProps) {
  const { profile } = useSupabaseAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  // Check if user should see onboarding based on activity
  const shouldShowOnboarding = () => {
    if (!profile) return false
    
    // Show onboarding for new users (created within last 7 days)
    const profileCreated = new Date(profile.created_at)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    return profileCreated > sevenDaysAgo
  }

  // Define onboarding steps
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to TechCare!',
      description: 'You\'re now part of Rwanda\'s premier tech support community. Let\'s get you started.',
      icon: User,
      completed: true,
      action: {
        label: 'Let\'s Go!',
        onClick: () => setCurrentStep(1)
      }
    },
    {
      id: 'explore',
      title: 'Explore Available Technicians',
      description: 'Browse our verified tech experts and see who\'s available in your area.',
      icon: Search,
      completed: false,
      action: {
        label: 'Browse Technicians',
        href: '/'
      }
    },
    {
      id: 'book',
      title: 'Book Your First Service',
      description: 'Found a technician? Book your first service and experience seamless tech support.',
      icon: Calendar,
      completed: false,
      action: {
        label: 'Book Service',
        href: '/'
      }
    },
    {
      id: 'track',
      title: 'Track Your Booking',
      description: 'Monitor your service request and communicate with your technician in real-time.',
      icon: Star,
      completed: false,
      action: {
        label: 'View Dashboard',
        href: '/dashboard'
      }
    }
  ])

  // Auto-advance steps or mark completed based on user actions
  useEffect(() => {
    // This would integrate with actual user activity tracking
    // For now, we'll simulate step completion based on time
    if (profile && shouldShowOnboarding()) {
      // Mark explore step as completed if user has navigated around
      // Mark book step as completed if user has made a booking
      // Mark track step as completed if user has viewed dashboard
    }
  }, [profile])

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  const handleStepAction = (step: OnboardingStep) => {
    if (step.action?.onClick) {
      step.action.onClick()
    }
    
    // Mark current step as completed and advance
    setSteps(prev => prev.map((s) => 
      s.id === step.id ? { ...s, completed: true } : s
    ))
  }

  // Don't show if dismissed or user doesn't need onboarding
  if (dismissed || !shouldShowOnboarding()) {
    return null
  }

  const currentStepData = steps[currentStep]
  const completedSteps = steps.filter(s => s.completed).length
  const progress = (completedSteps / steps.length) * 100

  return (
    <Card className={`border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 ${className || ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Getting Started</h3>
            <Badge variant="outline" className="text-red-600 border-red-300">
              New Customer
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{completedSteps} of {steps.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-6">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-full ${
              currentStepData.completed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {currentStepData.completed ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <currentStepData.icon className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {currentStepData.title}
              </h4>
              <p className="text-gray-600 mb-4">
                {currentStepData.description}
              </p>
              
              {currentStepData.action && (
                <div className="flex items-center space-x-3">
                  {currentStepData.action.href ? (
                    <Button 
                      asChild 
                      className="text-white hover:opacity-90" 
                      style={{ backgroundColor: '#FF385C' }}
                    >
                      <Link href={currentStepData.action.href}>
                        {currentStepData.action.label}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleStepAction(currentStepData)}
                      className="text-white hover:opacity-90" 
                      style={{ backgroundColor: '#FF385C' }}
                    >
                      {currentStepData.action.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  
                  {currentStep < steps.length - 1 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
                    >
                      Skip Step
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step.completed 
                    ? 'bg-green-500' 
                    : index === currentStep 
                      ? 'bg-red-500' 
                      : 'bg-gray-300'
                }`}
                title={step.title}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
              >
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button 
                size="sm"
                onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
                className="text-white hover:opacity-90" 
                style={{ backgroundColor: '#FF385C' }}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Hook for tracking customer onboarding progress
 */
export function useCustomerOnboarding() {
  const { profile } = useSupabaseAuth()
  const [onboardingVisible, setOnboardingVisible] = useState(false)

  useEffect(() => {
    if (profile && profile.role === 'CUSTOMER') {
      const profileCreated = new Date(profile.created_at)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      
      setOnboardingVisible(profileCreated > sevenDaysAgo)
    }
  }, [profile])

  return {
    shouldShowOnboarding: onboardingVisible,
    hideOnboarding: () => setOnboardingVisible(false)
  }
}