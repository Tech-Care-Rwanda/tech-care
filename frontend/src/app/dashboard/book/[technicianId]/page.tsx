"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ChevronLeft,
  Star, 
  MapPin, 
  Clock,
  Check,
  CreditCard,
  Loader2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/lib/contexts/AuthContext"
import apiService from "@/lib/services/api"
import bookingService from "@/lib/services/bookingService"

interface Technician {
  id: string
  name: string
  avatar?: string
  specialty: string
  rating: number
  reviews: number
  hourlyRate: number
  location: string
  responseTime: string
  isAvailable: boolean
}

interface Service {
  id: string
  name: string
  price: number
  duration: string
}

export default function BookTechnicianPage() {
  const params = useParams()
  const router = useRouter()
  const { } = useAuth() // user not needed for now
  const technicianId = params.technicianId as string
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [technician, setTechnician] = useState<Technician | null>(null)
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    location: '',
    description: '',
    urgency: 'standard',
    deviceCount: 1
  })

  // Fetch technician data
  useEffect(() => {
    async function fetchTechnician() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiService.technician.getTechnician(technicianId)
        
        if (response.success && response.data) {
          // Transform API response to match component expectations
          const techData = response.data
          setTechnician({
            id: techData.id.toString(),
            name: techData.fullName || techData.name || 'Technician',
            specialty: techData.technicianDetails?.specialization || 'Tech Support',
            rating: 4.8, // TODO: Calculate from reviews
            reviews: 0, // TODO: Get actual review count
            hourlyRate: techData.technicianDetails?.rate || 15000,
            location: techData.technicianDetails?.address || 'Kigali',
            responseTime: '~15 min',
            isAvailable: techData.technicianDetails?.isAvailable || false,
            avatar: techData.technicianDetails?.imageUrl
          })
        } else {
          setError('Failed to load technician data')
        }
      } catch (err) {
        console.error('Error fetching technician:', err)
        setError('Failed to load technician data')
      } finally {
        setLoading(false)
      }
    }

    if (technicianId) {
      fetchTechnician()
    }
  }, [technicianId])

  const steps = [
    { id: 1, title: "Service Details", description: "What do you need help with?" },
    { id: 2, title: "Schedule", description: "When would you like the service?" },
    { id: 3, title: "Location & Contact", description: "Where should we meet?" },
    { id: 4, title: "Review & Confirm", description: "Review your booking details" }
  ]

  const services: Service[] = [
    { id: "computer-setup", name: "Computer Setup & Configuration", price: 15000, duration: "2-3 hours" },
    { id: "network-install", name: "Network Installation", price: 12000, duration: "1-2 hours" },
    { id: "hardware-repair", name: "Hardware Repair", price: 10000, duration: "1-2 hours" },
    { id: "software-install", name: "Software Installation", price: 8000, duration: "1 hour" },
    { id: "data-recovery", name: "Data Recovery", price: 20000, duration: "2-4 hours" },
    { id: "system-optimization", name: "System Optimization", price: 12000, duration: "1-2 hours" }
  ]

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ]

  const calculateTotal = () => {
    const selectedService = services.find(s => s.id === bookingData.service)
    const basePrice = selectedService?.price || 0
    const urgencyMultiplier = bookingData.urgency === 'urgent' ? 1.5 : 1
    return Math.round(basePrice * urgencyMultiplier)
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBooking = async () => {
    try {
      setLoading(true)
      
      // Get the selected service name
      const selectedService = services.find(s => s.id === bookingData.service)
      
      // Create booking via backend API
      const response = await bookingService.createBooking({
        technicianId: technicianId,
        service: selectedService?.name || 'Consultation',
        description: bookingData.description,
        date: bookingData.date,
        time: bookingData.time,
        location: bookingData.location,
        urgency: bookingData.urgency,
        deviceCount: bookingData.deviceCount
      })

      if (response.success) {
        // Redirect to bookings page with success message
        router.push('/dashboard/bookings?new=true&success=true')
      } else {
        setError(response.error || 'Failed to create booking')
      }
    } catch (err) {
      console.error('Error creating booking:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading technician information...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show error state
  if (error || !technician) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-medium mb-2">Error Loading Technician</p>
            <p className="text-gray-600 mb-4">{error || 'Technician not found'}</p>
            <Button onClick={() => router.push('/dashboard/search')}>
              Back to Search
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/dashboard/search" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Search</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Technician Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={technician.image} />
                    <AvatarFallback>{technician.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-gray-900">{technician.name}</h3>
                  <p className="text-gray-600">{technician.specialty}</p>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{technician.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({technician.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span>Based in {technician.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span>Available {technician.availability.join(", ")}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                    <span>From {technician.hourlyRate.toLocaleString()} RWF/hour</span>
                  </div>
                </div>
                
                {bookingData.service && (
                  <>
                    <Separator className="my-4" />
                    <div className="text-sm">
                      <h4 className="font-medium mb-2">Booking Summary</h4>
                      <div className="space-y-1 text-gray-600">
                        <div>Service: {services.find(s => s.id === bookingData.service)?.name}</div>
                        {bookingData.date && <div>Date: {bookingData.date}</div>}
                        {bookingData.time && <div>Time: {bookingData.time}</div>}
                        <div className="pt-2 border-t">
                          <span className="font-semibold">Total: {calculateTotal().toLocaleString()} RWF</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      step.id <= currentStep ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    <div className={`mt-2 text-xs text-center max-w-[80px] ${
                      step.id <= currentStep ? 'text-red-600 font-medium' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {step.id < steps.length && (
                    <div className={`w-12 h-1 mx-2 ${
                      step.id < currentStep ? 'bg-red-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                <p className="text-gray-600">{steps[currentStep - 1].description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Service Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Select Service</label>
                      <div className="grid grid-cols-1 gap-3">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              bookingData.service === service.id
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setBookingData({ ...bookingData, service: service.id })}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{service.name}</h4>
                                <p className="text-sm text-gray-600">{service.duration}</p>
                              </div>
                              <span className="font-semibold">{service.price.toLocaleString()} RWF</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Device Count</label>
                      <select 
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={bookingData.deviceCount}
                        onChange={(e) => setBookingData({ ...bookingData, deviceCount: parseInt(e.target.value) })}
                      >
                        {[1,2,3,4,5].map(count => (
                          <option key={count} value={count}>{count} device{count > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className={`p-3 border rounded-lg cursor-pointer text-center ${
                            bookingData.urgency === 'standard'
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setBookingData({ ...bookingData, urgency: 'standard' })}
                        >
                          <div className="font-medium">Standard</div>
                          <div className="text-sm text-gray-600">Regular price</div>
                        </div>
                        <div
                          className={`p-3 border rounded-lg cursor-pointer text-center ${
                            bookingData.urgency === 'urgent'
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setBookingData({ ...bookingData, urgency: 'urgent' })}
                        >
                          <div className="font-medium">Urgent</div>
                          <div className="text-sm text-gray-600">+50% fee</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Scheduling */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                      <input
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Time</label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            className={`p-2 text-sm border rounded transition-colors ${
                              bookingData.time === time
                                ? 'border-red-500 bg-red-50 text-red-600'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setBookingData({ ...bookingData, time })}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Location & Contact */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Location</label>
                      <input
                        type="text"
                        placeholder="Enter your address (e.g., Kigali, Kimisagara - KG 123 St)"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={bookingData.location}
                        onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Problem Description</label>
                      <textarea
                        placeholder="Please describe the technical issue or what you need help with..."
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={bookingData.description}
                        onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Booking Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Service:</span> {services.find(s => s.id === bookingData.service)?.name}</div>
                        <div><span className="font-medium">Date:</span> {bookingData.date}</div>
                        <div><span className="font-medium">Time:</span> {bookingData.time}</div>
                        <div><span className="font-medium">Location:</span> {bookingData.location}</div>
                        <div><span className="font-medium">Devices:</span> {bookingData.deviceCount}</div>
                        <div><span className="font-medium">Urgency:</span> {bookingData.urgency}</div>
                        {bookingData.description && (
                          <div><span className="font-medium">Description:</span> {bookingData.description}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Cost:</span>
                        <span className="text-xl font-bold text-red-600">{calculateTotal().toLocaleString()} RWF</span>
                      </div>
                      {bookingData.urgency === 'urgent' && (
                        <p className="text-sm text-red-600 mt-1">Includes 50% urgency fee</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    Back
                  </Button>
                  
                  {currentStep < 4 ? (
                    <Button 
                      onClick={handleNext}
                      disabled={
                        (currentStep === 1 && !bookingData.service) ||
                        (currentStep === 2 && (!bookingData.date || !bookingData.time)) ||
                        (currentStep === 3 && (!bookingData.location || !bookingData.description))
                      }
                    >
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleBooking} className="bg-red-500 hover:bg-red-600">
                      Confirm Booking
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 