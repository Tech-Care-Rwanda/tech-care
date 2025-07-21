"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Wrench, Smartphone, Wifi, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { TechnicianMap } from "@/components/maps/TechnicianMap"

export default function Home() {
  const router = useRouter()
  const [selectedServiceType, setSelectedServiceType] = useState('')
  const [problemDescription, setProblemDescription] = useState('')
  const [selectedTechnician, setSelectedTechnician] = useState(null)
  const [currentStep, setCurrentStep] = useState(1) // 1: Map, 2: Service, 3: Book

  const serviceOptions = [
    { id: 'computer', icon: Wrench, name: 'Computer Repair', description: 'Hardware, software, virus removal' },
    { id: 'mobile', icon: Smartphone, name: 'Mobile Device', description: 'Phone, tablet repairs & setup' },
    { id: 'network', icon: Wifi, name: 'Network/WiFi', description: 'Internet, router, WiFi setup' },
  ]

  const handleServiceSelect = (serviceId) => {
    setSelectedServiceType(serviceId)
    if (selectedTechnician && serviceId) {
      setCurrentStep(3)
    }
  }

  const handleTechnicianSelect = (technician) => {
    setSelectedTechnician(technician)
    if (selectedServiceType && technician) {
      setCurrentStep(3)
    } else if (technician) {
      setCurrentStep(2)
    }
  }

  const handleBooking = () => {
    if (selectedTechnician && selectedServiceType && problemDescription) {
      router.push(`/dashboard/book/${selectedTechnician.id}?service=${selectedServiceType}&problem=${encodeURIComponent(problemDescription)}`)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep >= 1 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Find Technician</span>
              {currentStep > 1 && <CheckCircle className="w-4 h-4" />}
            </div>
            <div className={`h-px w-8 ${
              currentStep >= 2 ? 'bg-red-500' : 'bg-gray-200'
            }`}></div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep >= 2 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              <Wrench className="w-4 h-4" />
              <span className="font-medium">Choose Service</span>
              {currentStep > 2 && <CheckCircle className="w-4 h-4" />}
            </div>
            <div className={`h-px w-8 ${
              currentStep >= 3 ? 'bg-red-500' : 'bg-gray-200'
            }`}></div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              currentStep >= 3 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Book</span>
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Find a technician near you
              </h1>
              <p className="text-gray-600">
                Select a technician from the map to continue
              </p>
            </div>
            <TechnicianMap 
              onTechnicianSelect={handleTechnicianSelect}
              className="h-[600px]"
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                What do you need help with?
              </h1>
              <p className="text-gray-600">
                Choose the type of service you need
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serviceOptions.map((service) => {
                const IconComponent = service.icon
                const isSelected = selectedServiceType === service.id
                
                return (
                  <Card 
                    key={service.id}
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-red-500 bg-red-50' : 'hover:border-red-300'
                    }`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <div className="text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Describe your problem
              </h1>
              <p className="text-gray-600">
                Help {selectedTechnician?.name} understand what you need
              </p>
            </div>
            
            <Card className="p-6 max-w-2xl mx-auto">
              <div className="space-y-6">
                {selectedTechnician && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedTechnician.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{selectedTechnician.name}</p>
                      <p className="text-sm text-gray-600">{selectedTechnician.specialization}</p>
                      <p className="text-sm text-gray-500">⭐ {selectedTechnician.rating} • {selectedTechnician.estimatedArrival}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe the problem
                  </label>
                  <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="What's going wrong? Be as specific as possible..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <Button 
                  onClick={handleBooking}
                  disabled={!problemDescription.trim()}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold"
                >
                  Book {selectedTechnician?.name} - {selectedTechnician?.estimatedArrival}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
