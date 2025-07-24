"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Calendar, 
  Phone, 
  MessageCircle, 
  MapPin,
  Clock,
  ArrowRight,
  Star,
  Share2
} from 'lucide-react'
import { SafeAvatar } from '@/components/ui/safe-avatar'
import Link from 'next/link'

interface BookingSuccessProps {
  booking?: {
    id: string
    technician: {
      name: string
      avatar?: string
      phone?: string
      specialization: string
      rating: number
    }
    service: string
    scheduledDate?: string
    location: string
    estimatedDuration: string
    price: string
  }
  onClose?: () => void
}

/**
 * Booking Success Component
 * Shown after a successful booking to guide customers on next steps
 */
export function BookingSuccess({ booking, onClose }: BookingSuccessProps) {
  const [showNextSteps, setShowNextSteps] = useState(false)

  useEffect(() => {
    // Auto-show next steps after a brief delay
    const timer = setTimeout(() => {
      setShowNextSteps(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!booking) return null

  const handleCall = () => {
    if (booking.technician.phone) {
      window.open(`tel:${booking.technician.phone}`)
    }
  }

  const handleMessage = () => {
    if (booking.technician.phone) {
      window.open(`sms:${booking.technician.phone}?body=Hi ${booking.technician.name}, I just booked a ${booking.service} service with you...`)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My TechCare Booking',
          text: `I just booked a ${booking.service} service with ${booking.technician.name} on TechCare!`,
          url: window.location.origin
        })
      } catch {
        console.log('Share cancelled')
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`I just booked a ${booking.service} service with ${booking.technician.name} on TechCare! ${window.location.origin}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <div className="p-6">
          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">Your service request has been sent to the technician</p>
          </div>

          {/* Booking Details */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-4 mb-4">
              <SafeAvatar 
                src={booking.technician.avatar} 
                alt={booking.technician.name}
                size="lg"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{booking.technician.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{booking.technician.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{booking.technician.specialization}</p>
                <Badge className="mt-2 bg-green-100 text-green-800">
                  Verified Technician
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{booking.service}</span>
              </div>
              {booking.scheduledDate && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Scheduled: {new Date(booking.scheduledDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{booking.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Duration: {booking.estimatedDuration}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          {showNextSteps && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">What happens next?</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <p className="text-gray-600">The technician will review your request and confirm availability</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <p className="text-gray-600">You&apos;ll receive a confirmation with final details</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <p className="text-gray-600">Track your booking progress in your dashboard</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCall}
                className="flex-1"
                disabled={!booking.technician.phone}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMessage}
                className="flex-1"
                disabled={!booking.technician.phone}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <Button 
              asChild 
              className="w-full text-white hover:opacity-90" 
              style={{ backgroundColor: '#FF385C' }}
            >
              <Link href="/dashboard">
                View in Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={onClose}
            >
              Continue Browsing
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

/**
 * Hook for managing booking success state
 */
export function useBookingSuccess() {
  const [successBooking, setSuccessBooking] = useState<BookingSuccessProps['booking'] | null>(null)

  const showBookingSuccess = (booking: BookingSuccessProps['booking']) => {
    setSuccessBooking(booking)
  }

  const hideBookingSuccess = () => {
    setSuccessBooking(null)
  }

  return {
    successBooking,
    showBookingSuccess,
    hideBookingSuccess,
    isVisible: !!successBooking
  }
}
