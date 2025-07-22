"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MapPin, Clock, Phone, ArrowLeft, CheckCircle } from 'lucide-react'
import { technicianService, type Technician } from '@/lib/services/technicianService'
import { bookingService } from '@/lib/services/bookingService'

const SERVICE_TYPES = [
  { id: 'computer', name: 'Computer Repair', description: 'Hardware & software issues', icon: '💻' },
  { id: 'mobile', name: 'Mobile Device', description: 'Phone & tablet repairs', icon: '📱' },
  { id: 'network', name: 'Network Setup', description: 'WiFi & connectivity issues', icon: '🌐' }
]

type BookingStep = 'service' | 'details' | 'confirm' | 'success'

export default function BookTechnicianPage() {
  const params = useParams()
  const router = useRouter()
  const technicianId = params.technicianId as string
  
  const [technician, setTechnician] = useState<Technician | null>(null)
  const [currentStep, setCurrentStep] = useState<BookingStep>('service')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Booking form state
  const [selectedService, setSelectedService] = useState('')
  const [problemDescription, setProblemDescription] = useState('')
  const [urgency, setUrgency] = useState<'standard' | 'urgent'>('standard')

  // Load technician data
  useEffect(() => {
    const loadTechnician = async () => {
      if (!technicianId) return
      
      try {
        const response = await technicianService.getTechnicianById(technicianId)
        if (response.success && response.data) {
          setTechnician(response.data)
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Failed to load technician:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    
    loadTechnician()
  }, [technicianId, router])

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    setCurrentStep('details')
  }

  const handleDetailsSubmit = () => {
    if (problemDescription.trim()) {
      setCurrentStep('confirm')
    }
  }

  const handleBookingConfirm = async () => {
    if (!technician) return
    
    setSubmitting(true)
    try {
      const response = await bookingService.createBooking({
        technicianId: technician.id,
        service: selectedService,
        description: problemDescription,
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        location: 'Kigali, Rwanda',
        urgency,
        deviceCount: 1
      })
      
      if (response.success) {
        setCurrentStep('success')
      } else {
        alert('Failed to create booking. Please try again.')
      }
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading technician details...</p>
        </div>
      </div>
    )
  }

  if (!technician) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Technician not found</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Book Technician</h1>
            <p className="text-gray-600">Schedule a service appointment</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep === 'service' ? 'text-blue-600' : currentStep === 'details' || currentStep === 'confirm' || currentStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'service' ? 'bg-blue-100' : currentStep === 'details' || currentStep === 'confirm' || currentStep === 'success' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {currentStep === 'details' || currentStep === 'confirm' || currentStep === 'success' ? '✓' : '1'}
                </div>
                <span className="font-medium">Choose Service</span>
              </div>
              <div className={`w-8 h-0.5 ${currentStep === 'details' || currentStep === 'confirm' || currentStep === 'success' ? 'bg-green-200' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'details' ? 'text-blue-600' : currentStep === 'confirm' || currentStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'details' ? 'bg-blue-100' : currentStep === 'confirm' || currentStep === 'success' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {currentStep === 'confirm' || currentStep === 'success' ? '✓' : '2'}
                </div>
                <span className="font-medium">Describe Issue</span>
              </div>
              <div className={`w-8 h-0.5 ${currentStep === 'confirm' || currentStep === 'success' ? 'bg-green-200' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'confirm' ? 'text-blue-600' : currentStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'confirm' ? 'bg-blue-100' : currentStep === 'success' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {currentStep === 'success' ? '✓' : '3'}
                </div>
                <span className="font-medium">Confirm</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Technician Info Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <div className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={technician.avatar} />
                    <AvatarFallback>
                      {technician.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {technician.name}
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{technician.rating}</span>
                    <span className="text-gray-500">({technician.reviewCount} reviews)</span>
                  </div>
                  
                  <Badge variant="secondary" className="mb-4">
                    {technician.specialties[0] || 'General Tech'}
                  </Badge>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{technician.location}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{technician.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <span className="font-medium">RWF {technician.hourlyRate.toLocaleString()}/hour</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Choose Service */}
              {currentStep === 'service' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    What type of service do you need?
                  </h2>
                  <div className="space-y-3">
                    {SERVICE_TYPES.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{service.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{service.name}</h3>
                            <p className="text-sm text-gray-600">{service.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Step 2: Problem Description */}
              {currentStep === 'details' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Describe your problem
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Problem Description *
                      </label>
                      <textarea
                        value={problemDescription}
                        onChange={(e) => setProblemDescription(e.target.value)}
                        placeholder="Please describe the issue you're experiencing in detail..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level
                      </label>
                      <div className="flex space-x-2">
                        {[
                          { id: 'standard', label: 'Standard', color: 'blue' },
                          { id: 'urgent', label: 'Urgent', color: 'red' }
                        ].map((level) => (
                          <button
                            key={level.id}
                            onClick={() => setUrgency(level.id as any)}
                            className={`px-4 py-2 rounded-md border ${
                              urgency === level.id
                                ? `border-${level.color}-300 bg-${level.color}-50 text-${level.color}-700`
                                : 'border-gray-300 bg-white text-gray-700'
                            }`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('service')}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleDetailsSubmit}
                        disabled={!problemDescription.trim()}
                        className="flex-1"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 'confirm' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Confirm your booking
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Booking Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Type:</span>
                          <span className="text-gray-900">
                            {SERVICE_TYPES.find(s => s.id === selectedService)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Urgency:</span>
                          <Badge variant={urgency === 'urgent' ? 'destructive' : 'default'}>
                            {urgency}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated Rate:</span>
                          <span className="text-gray-900">RWF {technician.hourlyRate.toLocaleString()}/hour</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Problem Description</h3>
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                        {problemDescription}
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('details')}
                        disabled={submitting}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleBookingConfirm}
                        disabled={submitting}
                        className="flex-1"
                      >
                        {submitting ? 'Booking...' : 'Confirm Booking'}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 4: Success */}
              {currentStep === 'success' && (
                <Card className="p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Booking Confirmed!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your booking request has been sent to {technician.name}. 
                    They will contact you within {technician.responseTime}.
                  </p>
                  
                  <div className="space-y-3">
                    <Button onClick={() => router.push('/dashboard/bookings')} className="w-full">
                      View My Bookings
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/dashboard')}
                      className="w-full"
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}