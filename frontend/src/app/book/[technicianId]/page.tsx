"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    MapPin,
    Clock,
    Star,
    ArrowLeft,
    Calendar,
    User,
    Phone,
    Mail,
    MessageSquare,
    CreditCard
} from 'lucide-react'
import { supabaseService, TechnicianDetails } from '@/lib/supabase'
import { bookingService } from '@/lib/services/bookingService'
import Link from 'next/link'

interface BookingFormData {
    serviceId: number
    scheduledDate: string
    scheduledTime: string
    duration: number
    customerNotes: string
    customerName: string
    customerEmail: string
    customerPhone: string
    customerAddress: string
    urgency: 'standard' | 'urgent'
}

export default function BookTechnicianPage() {
    const router = useRouter()
    const params = useParams()
    const technicianId = params.technicianId as string

    const [technician, setTechnician] = useState<TechnicianDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<BookingFormData>({
        serviceId: 0,
        scheduledDate: '',
        scheduledTime: '',
        duration: 60, // Default 1 hour
        customerNotes: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        urgency: 'standard'
    })

    // Fetch technician details
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                console.log('Booking page - fetching data for technician ID:', technicianId)

                // Validate technicianId
                if (!technicianId || technicianId.trim() === '') {
                    throw new Error('Invalid technician ID')
                }

                // Fetch technician details using Supabase service
                console.log('Calling supabaseService.getTechnicianById with ID:', technicianId)
                const technicianData = await supabaseService.getTechnicianById(parseInt(technicianId))

                console.log('Received technician data:', technicianData)
                setTechnician(technicianData)

            } catch (error) {
                console.error('Error fetching technician data:', {
                    message: error instanceof Error ? error.message : 'Unknown error',
                    stack: error instanceof Error ? error.stack : undefined,
                    error: error
                })
                setError(`Failed to load technician information: ${error instanceof Error ? error.message : 'Unknown error'}`)
            } finally {
                setLoading(false)
            }
        }

        if (technicianId) {
            fetchData()
        }
    }, [technicianId])

    // Get available service options based on technician specialization
    const getServiceOptions = () => {
        if (!technician) return []

        const specialty = technician.specialization || 'Technical Service'

        const baseServices = [
            { id: 1, name: 'Basic Service', description: 'Standard service call', price: '5000' },
            { id: 2, name: 'Advanced Service', description: 'Complex technical work', price: '8000' },
            { id: 3, name: 'Emergency Service', description: 'Urgent technical support', price: '12000' }
        ]

        return baseServices.map(service => ({
            ...service,
            name: `${specialty} - ${service.name}`,
            description: `${service.description} for ${specialty.toLowerCase()}`
        }))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }))
        if (error) setError(null)
    }

    const validateForm = (): boolean => {
        if (!formData.serviceId) {
            setError('Please select a service')
            return false
        }
        if (!formData.scheduledDate) {
            setError('Please select a date')
            return false
        }
        if (!formData.scheduledTime) {
            setError('Please select a time')
            return false
        }
        if (!formData.customerName.trim()) {
            setError('Please enter your name')
            return false
        }
        if (!formData.customerEmail.trim()) {
            setError('Please enter your email')
            return false
        }
        if (!formData.customerPhone.trim()) {
            setError('Please enter your phone number')
            return false
        }
        if (!formData.customerAddress.trim()) {
            setError('Please enter your address')
            return false
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.customerEmail)) {
            setError('Please enter a valid email address')
            return false
        }

        // Validate date is not in the past
        const selectedDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
        if (selectedDateTime <= new Date()) {
            setError('Please select a future date and time')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            setSubmitting(true)
            setError(null)

            // Create booking data
            const selectedService = getServiceOptions().find(s => s.id === formData.serviceId)

            const bookingData = {
                technicianId: technicianId,
                service: selectedService?.name || 'Technical Service',
                description: formData.customerNotes.trim() || 'Service request',
                date: formData.scheduledDate,
                time: formData.scheduledTime,
                location: formData.customerAddress,
                urgency: formData.urgency,
                deviceCount: 1 // Default for now
            }

            console.log('Creating booking:', bookingData)

            // Save booking using the booking service
            const response = await bookingService.createBooking(bookingData)

            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to create booking')
            }

            console.log('Booking created successfully:', response.data)

            // Redirect to confirmation page
            router.push(`/book/confirmation?bookingId=${response.data.id}`)

        } catch (error) {
            console.error('Error creating booking:', error)
            setError('Failed to create booking. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const getTomorrowDate = () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().split('T')[0]
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="p-6">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderBottomColor: '#FF385C' }}></div>
                        <span>Loading booking information...</span>
                    </div>
                </Card>
            </div>
        )
    }

    if (!technician) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Technician Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested technician could not be found.</p>
                    <Link href="/">
                        <Button className="text-white" style={{ backgroundColor: '#FF385C' }}>
                            Back to Home
                        </Button>
                    </Link>
                </Card>
            </div>
        )
    }

    const serviceOptions = getServiceOptions()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="mr-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Map
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Book Technician</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Technician Info */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-6">
                            <div className="text-center">
                                <Avatar className="h-20 w-20 mx-auto mb-4">
                                    <AvatarImage src={technician.image_url} />
                                    <AvatarFallback>
                                        {(technician.user?.full_name || technician.specialization || 'T').split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>

                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    {technician.user?.full_name || technician.specialization || 'Technician'}
                                </h2>

                                <Badge className="mb-3">
                                    {technician.specialization || 'Technician'}
                                </Badge>

                                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                        <span>{(technician.rate / 10).toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <span>{technician.address || technician.district || 'Kigali'}</span>
                                    </div>
                                </div>

                                {technician.bio && (
                                    <p className="text-sm text-gray-600 mb-4">{technician.bio}</p>
                                )}

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Experience:</span>
                                        <span className="font-medium">{technician.experience || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Rate:</span>
                                        <span className="font-medium">RWF {technician.rate}/hour</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Availability:</span>
                                        <Badge variant={technician.is_available ? "default" : "secondary"}>
                                            {technician.is_available ? 'Available' : 'Busy'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Phone:</span>
                                        <span className="font-medium">{technician.user?.phone_number || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Book Service</h3>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Service Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Service *
                                    </label>
                                    <select
                                        name="serviceId"
                                        value={formData.serviceId}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Choose a service...</option>
                                        {serviceOptions.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.name} - RWF {service.price}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date and Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="scheduledDate"
                                            value={formData.scheduledDate}
                                            onChange={handleInputChange}
                                            min={getTomorrowDate()}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="scheduledTime"
                                            value={formData.scheduledTime}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Duration and Urgency */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration (minutes)
                                        </label>
                                        <select
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <option value={30}>30 minutes</option>
                                            <option value={60}>1 hour</option>
                                            <option value={90}>1.5 hours</option>
                                            <option value={120}>2 hours</option>
                                            <option value={180}>3 hours</option>
                                            <option value={240}>4 hours</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Urgency
                                        </label>
                                        <select
                                            name="urgency"
                                            value={formData.urgency}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <option value="standard">Standard</option>
                                            <option value="urgent">Urgent (+50% fee)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="border-t pt-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Your Information
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                placeholder="Your full name"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Phone className="w-4 h-4 inline mr-1" />
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="customerPhone"
                                                value={formData.customerPhone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                placeholder="+250 xxx xxx xxx"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="w-4 h-4 inline mr-1" />
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <MapPin className="w-4 h-4 inline mr-1" />
                                            Service Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="customerAddress"
                                            value={formData.customerAddress}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Where should the technician come?"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MessageSquare className="w-4 h-4 inline mr-1" />
                                        Additional Notes
                                    </label>
                                    <textarea
                                        name="customerNotes"
                                        value={formData.customerNotes}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Describe the issue or any specific requirements..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="border-t pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Estimated Cost: <span className="font-semibold">RWF {
                                                    serviceOptions.find(s => s.id === formData.serviceId)?.price || '0'
                                                }</span>
                                                {formData.urgency === 'urgent' && (
                                                    <span className="text-red-600"> + 50% urgent fee</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={submitting || !technician.is_available}
                                        className="w-full text-white py-3 font-medium"
                                        style={{ backgroundColor: '#FF385C' }}
                                    >
                                        {submitting ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creating Booking...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                Confirm Booking
                                            </div>
                                        )}
                                    </Button>

                                    {!technician.is_available && (
                                        <p className="text-sm text-red-600 mt-2 text-center">
                                            This technician is currently unavailable for bookings.
                                        </p>
                                    )}
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
} 