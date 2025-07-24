"use client"

import { Loader2, AlertCircle, RefreshCw, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', color = '#FF385C', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className || ''}`}
      style={{ color }}
    />
  )
}

// Skeleton Loading Components
export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded h-4 ${className || ''}`} />
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={`p-4 ${className || ''}`}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gray-200 rounded-full w-12 h-12" />
          <div className="flex-1 space-y-2">
            <div className="bg-gray-200 rounded h-4 w-3/4" />
            <div className="bg-gray-200 rounded h-3 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-gray-200 rounded h-3 w-full" />
          <div className="bg-gray-200 rounded h-3 w-5/6" />
          <div className="bg-gray-200 rounded h-3 w-4/6" />
        </div>
      </div>
    </Card>
  )
}

// Full Page Loading
interface PageLoadingProps {
  message?: string
  showLogo?: boolean
}

export function PageLoading({ message = 'Loading...', showLogo = true }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {showLogo && (
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF385C' }}>
              <span className="text-white font-bold text-lg">TC</span>
            </div>
            <span className="ml-3 font-bold text-2xl text-gray-900">TechCare</span>
          </div>
        )}
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  )
}

// Inline Loading for components
interface InlineLoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function InlineLoading({ message = 'Loading...', size = 'md', className }: InlineLoadingProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className || ''}`}>
      <div className="text-center">
        <LoadingSpinner size={size} className="mx-auto mb-2" />
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  )
}

// List Loading Skeleton
export function ListLoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

// Error State Components
interface ErrorStateProps {
  title?: string
  message?: string
  actionLabel?: string
  onRetry?: () => void
  showIcon?: boolean
  className?: string
}

export function ErrorState({ 
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  actionLabel = 'Try Again',
  onRetry,
  showIcon = true,
  className 
}: ErrorStateProps) {
  return (
    <div className={`text-center py-12 ${className || ''}`}>
      {showIcon && (
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="text-white hover:opacity-90"
          style={{ backgroundColor: '#FF385C' }}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// Network Error State
export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Problem"
      message="Please check your internet connection and try again."
      actionLabel="Retry"
      onRetry={onRetry}
      showIcon={false}
      className="py-8"
    >
      <WifiOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
    </ErrorState>
  )
}

// Empty State Component
interface EmptyStateProps {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ComponentType<any>
  className?: string
}

export function EmptyState({ 
  title, 
  message, 
  actionLabel, 
  onAction, 
  icon: Icon,
  className 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className || ''}`}>
      {Icon && (
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="text-white hover:opacity-90"
          style={{ backgroundColor: '#FF385C' }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// Loading Overlay for forms and modals
export function LoadingOverlay({ 
  isVisible, 
  message = 'Processing...' 
}: { 
  isVisible: boolean
  message?: string 
}) {
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 rounded-lg">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-3" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}

// Button Loading State
interface LoadingButtonProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  [key: string]: unknown
}

export function LoadingButton({ 
  isLoading, 
  children, 
  loadingText = 'Loading...', 
  ...props 
}: LoadingButtonProps & Record<string, unknown>) {
  return (
    <Button 
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}

// Progressive Loading Component
interface ProgressiveLoadingProps {
  stages: string[]
  currentStage: number
  className?: string
}

export function ProgressiveLoading({ stages, currentStage, className }: ProgressiveLoadingProps) {
  return (
    <div className={`text-center py-8 ${className || ''}`}>
      <LoadingSpinner size="lg" className="mx-auto mb-6" />
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <p className="text-lg font-medium text-gray-900 mb-2">
            {stages[currentStage] || 'Processing...'}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
            />
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Step {currentStage + 1} of {stages.length}
        </p>
      </div>
    </div>
  )
}