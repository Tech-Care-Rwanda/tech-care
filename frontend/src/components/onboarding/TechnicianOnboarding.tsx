"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  ArrowRight,
  Wrench,
  FileText,

  DollarSign,
  Clock,
  X,
  AlertCircle,
  Users,
  TrendingUp
} from 'lucide-react'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import Link from 'next/link'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  completed: boolean
  status?: 'pending' | 'approved' | 'rejected'
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

interface TechnicianOnboardingProps {
  onDismiss?: () => void
  className?: string
}

/**
 * Technician Onboarding Component
 * Guides new technicians through the professional onboarding process
 */
export function TechnicianOnboarding({ onDismiss, className }: TechnicianOnboardingProps) {
  const { profile } = useSupabaseAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')

  // Define technician onboarding steps
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to TechCare Pro!',
      description: 'You\'ve joined Rwanda\'s premier platform for tech professionals. Let\'s get you set up to start earning.',
      icon: Wrench,
      completed: true,
      action: {
        label: 'Get Started',
        onClick: () => setCurrentStep(1)
      }
    },
    {
      id: 'profile',
      title: 'Complete Your Professional Profile',
      description: 'Add your skills, experience, and certifications to attract more customers.',
      icon: FileText,
      completed: false,
      action: {
        label: 'Complete Profile',
        href: '/technician/profile'
      }
    },
    {
      id: 'approval',
      title: 'Awaiting Admin Approval',
      description: 'Our team is reviewing your application. This usually takes 1-2 business days.',
      icon: Clock,
      completed: false,
      status: approvalStatus,
      action: approvalStatus === 'approved' ? {
        label: 'Start Working',
        onClick: () => setCurrentStep(3)
      } : undefined
    },
    {
      id: 'availability',
      title: 'Set Your Availability',
      description: 'Configure your working hours and service areas to start receiving job requests.',
      icon: Users,
      completed: false,
      action: {
        label: 'Set Availability',
        href: '/technician/dashboard'
      }
    },
    {
      id: 'first-job',
      title: 'Land Your First Job',
      description: 'Start earning! Accept your first job request and provide excellent service.',
      icon: TrendingUp,
      completed: false,
      action: {
        label: 'View Jobs',
        href: '/technician/dashboard'
      }
    }
  ])

  // Simulate approval status check
  useEffect(() => {
    const shouldShowOnboarding = () => {
      if (!profile || profile.role !== 'TECHNICIAN') return false

      const profileCreated = new Date(profile.created_at)
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)

      return profileCreated > fourteenDaysAgo
    }

    if (profile && shouldShowOnboarding()) {
      // In real implementation, this would check the technician's approval status from the database
      // For now, we'll simulate different states
      const mockApprovalCheck = setTimeout(() => {
        setApprovalStatus('approved') // or 'rejected' for demo
        setSteps(prev => prev.map(step =>
          step.id === 'approval'
            ? { ...step, completed: true, status: 'approved' }
            : step
        ))
      }, 3000)

      return () => clearTimeout(mockApprovalCheck)
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
  if (dismissed) {
    return null
  }

  const shouldShow = () => {
    if (!profile || profile.role !== 'TECHNICIAN') return false
    const profileCreated = new Date(profile.created_at)
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    return profileCreated > fourteenDaysAgo
  }

  if (!shouldShow()) {
    return null
  }

  const currentStepData = steps[currentStep]
  const completedSteps = steps.filter(s => s.completed).length
  const progress = (completedSteps / steps.length) * 100

  const getApprovalStatusBadge = () => {
    switch (approvalStatus) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">✓ Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">✗ Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ Pending Review</Badge>
    }
  }

  return (
    <Card className={`border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 ${className || ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Professional Setup</h3>
            <Badge variant="outline" className="text-green-600 border-green-300">
              New Technician
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

        {/* Approval Status Banner */}
        {currentStep === 2 && (
          <div className={`mb-4 p-3 rounded-lg border ${approvalStatus === 'approved'
            ? 'bg-green-50 border-green-200'
            : approvalStatus === 'rejected'
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
            }`}>
            <div className="flex items-center space-x-2">
              {approvalStatus === 'approved' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : approvalStatus === 'rejected' ? (
                <X className="w-5 h-5 text-red-600" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-600" />
              )}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">Application Status:</span>
                  {getApprovalStatusBadge()}
                </div>
                {approvalStatus === 'rejected' && (
                  <p className="text-sm text-red-700 mt-1">
                    Please review your profile and contact support for assistance.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Onboarding Progress</span>
            <span>{completedSteps} of {steps.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-6">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-full ${currentStepData.completed
              ? 'bg-green-100'
              : currentStepData.status === 'rejected'
                ? 'bg-red-100'
                : 'bg-green-100'
              }`}>
              {currentStepData.completed ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : currentStepData.status === 'rejected' ? (
                <AlertCircle className="w-6 h-6 text-red-600" />
              ) : (
                <currentStepData.icon className="w-6 h-6 text-green-600" />
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
                      style={{ backgroundColor: '#10B981' }}
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
                      style={{ backgroundColor: '#10B981' }}
                      disabled={currentStepData.id === 'approval' && approvalStatus === 'pending'}
                    >
                      {currentStepData.action.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                  {currentStep < steps.length - 1 && currentStepData.id !== 'approval' && (
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

        {/* Earning Potential Info */}
        {currentStep >= 3 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h5 className="font-semibold text-green-900">Start Earning Today</h5>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700 font-medium">Average Technician:</span>
                <p className="text-green-600">RWF 50,000 - 150,000/month</p>
              </div>
              <div>
                <span className="text-green-700 font-medium">Top Performers:</span>
                <p className="text-green-600">RWF 200,000+/month</p>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${step.completed
                  ? 'bg-green-500'
                  : step.status === 'rejected'
                    ? 'bg-red-500'
                    : index === currentStep
                      ? 'bg-green-500'
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
            {currentStep < steps.length - 1 && currentStepData.id !== 'approval' && (
              <Button
                size="sm"
                onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: '#10B981' }}
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
 * Hook for tracking technician onboarding progress
 */
export function useTechnicianOnboarding() {
  const { profile } = useSupabaseAuth()
  const [onboardingVisible, setOnboardingVisible] = useState(false)

  useEffect(() => {
    if (profile && profile.role === 'TECHNICIAN') {
      const profileCreated = new Date(profile.created_at)
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)

      setOnboardingVisible(profileCreated > fourteenDaysAgo)
    }
  }, [profile])

  return {
    shouldShowOnboarding: onboardingVisible,
    hideOnboarding: () => setOnboardingVisible(false)
  }
}