"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    CheckCircle,
    Calendar,
    Clock,
    MapPin,
    Phone,
    Mail,
    MessageSquare,
    ArrowRight,
    Home
} from 'lucide-react'
import { supabaseService, Booking } from '@/lib/supabase'
import Link from 'next/link'

export default function BookingConfirmationPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const bookingId = searchParams.get('bookingId')

    const [booking, setBooking] = useState<Booking | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) {
                setError('No booking ID provided')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                console.log('Fetching booking:', bookingId)

                // Fetch actual booking from database
                const bookingData = await supabaseService.getBookingById(parseInt(bookingId))
                setBooking(bookingData)
                setLoading(false)

            } catch (error) {
                console.error('Error fetching booking:', error)
                setError('Failed to load booking details')
                setLoading(false)
            }
        }

        fetchBooking()
    }, [bookingId])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="p-6">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderBottomColor: '#FF385C' }}></div>
                        <span>Loading booking confirmation...</span>
                    </div>
                </Card>
            </div>
        )
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="p-6 text-center max-w-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
                    <p className="text-gray-600 mb-4">{error || 'The requested booking could not be found.'}</p>
                    <Link href="/">
                        <Button className="text-white" style={{ backgroundColor: '#FF385C' }}>
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </Card>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Booking Confirmed!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Your service request has been successfully submitted.
                    </p>
                </div>

                {/* Booking Details */}
                <Card className="p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                        <Badge className="bg-green-100 text-green-800">
                            {booking.status}
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Date & Time</p>
                                <p className="font-medium">
                                    {formatDate(booking.scheduled_date || booking.created_at)} at {formatTime(booking.scheduled_date || booking.created_at)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Clock className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Duration</p>
                                <p className="font-medium">{booking.duration} minutes</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 font-bold text-sm">RWF</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Cost</p>
                                <p className="font-medium">RWF {booking.total_price}</p>
                            </div>
                        </div>

                                    {booking.customer_notes && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="font-medium">{booking.customer_notes}</p>
                </div>
              </div>
            )}
                    </div>
                </Card>

                {/* What's Next */}
                <Card className="p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                1
                            </div>
                            <p className="text-sm text-gray-700">
                                The technician will be notified of your booking request
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                2
                            </div>
                            <p className="text-sm text-gray-700">
                                They will contact you within 2 hours to confirm the appointment
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                3
                            </div>
                            <p className="text-sm text-gray-700">
                                The technician will arrive at your specified location at the scheduled time
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/dashboard">
                        <Button
                            className="w-full text-white py-3"
                            style={{ backgroundColor: '#FF385C' }}
                        >
                            View My Bookings
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>

                    <Link href="/">
                        <Button
                            variant="outline"
                            className="w-full py-3 border-gray-300 hover:bg-gray-50"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Contact Info */}
                <Card className="p-4 mt-6 bg-blue-50 border-blue-200">
                    <div className="text-center">
                        <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                        <p className="text-sm text-blue-800">
                            Contact our support team at{' '}
                            <a href="tel:+250791995143" className="font-medium underline">
                                +250 791 995 143
                            </a>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
} 