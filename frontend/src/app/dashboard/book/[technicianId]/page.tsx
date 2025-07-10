"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ChevronLeft,
  Star, 
  MapPin, 
  Clock,
  Check,
  CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function BookTechnicianPage() {
  const params = useParams()
  const router = useRouter()
  const technicianId = params.technicianId as string
  
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    location: '',
    description: '',
    urgency: 'standard',
    deviceCount: 1
  })

  // Mock technician data (in real app, this would be fetched)
  const technician = {
    id: parseInt(technicianId),
    name: technicianId === "1" ? "John Mugisha" : "Marie Uwimana",
    image: technicianId === "1" ? "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg" : "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
    specialty: technicianId === "1" ? "Computer Specialist" : "Network Expert",
    rating: 5.0,
    reviews: 318,
    hourlyRate: technicianId === "1" ? 15000 : 12000,
    location: "Kigali",
    availability: ["Today", "Tomorrow", "This Weekend"],
    services: [
      "Computer Setup & Configuration",
      "Network Installation",
      "Hardware Repair",
      "Software Installation",
      "Data Recovery",
      "System Optimization"
    ]
  }

  const steps = [
    { id: 1, title: "Service Details", description: "What do you need help with?" },
    { id: 2, title: "Schedule", description: "When would you like the service?" },
    { id: 3, title: "Location & Contact", description: "Where should we meet?" },
    { id: 4, title: "Review & Confirm", description: "Review your booking details" }
  ]

  const services = [
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

  const handleBooking = () => {
    // In real app, this would submit to backend
    console.log("Booking submitted:", { technician, bookingData, total: calculateTotal() })
    router.push('/dashboard/bookings?new=true')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/search-results" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Search</span>
              </Link>
            </div>
            
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">TechCare</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step.id <= currentStep ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
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
    </div>
  )
} 