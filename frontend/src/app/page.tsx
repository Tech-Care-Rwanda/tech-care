"use client"

import { TechnicianMap } from "@/components/maps/TechnicianMap"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Star, Users, Filter, Phone } from 'lucide-react'

const EMERGENCY_NUMBER = "+250791995143"

export default function Home() {
  const handleEmergencyCall = () => {
    window.open(`tel:${EMERGENCY_NUMBER}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Find a technician near you
              </h1>
              <p className="text-gray-600">
                Connect with verified tech experts in Kigali, Rwanda. Get instant support for computers, mobile devices, and networks.
              </p>
            </div>
            
            <div className="hidden lg:flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleEmergencyCall}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Phone className="w-4 h-4 mr-2" />
                Emergency
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Available Technicians</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  Kigali, Rwanda
                </div>
              </div>
              <TechnicianMap className="h-[500px] lg:h-[600px] w-full" />
            </Card>
          </div>

          <div className="space-y-6">
            <div className="lg:hidden">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEmergencyCall}
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency
                </Button>
              </div>
            </div>

            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Available Now</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-gray-900">12</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Avg Response</span>
                  </div>
                  <span className="font-semibold text-gray-900">2 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-600">Avg Rating</span>
                  </div>
                  <span className="font-semibold text-gray-900">4.8</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                  <div>
                    <span className="text-sm font-medium text-blue-900">💻 Computer Repair</span>
                    <p className="text-xs text-blue-700">Hardware & software issues</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                    8 available
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors">
                  <div>
                    <span className="text-sm font-medium text-green-900">📱 Mobile & Devices</span>
                    <p className="text-xs text-green-700">Phone & tablet repairs</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-200 text-green-800">
                    5 available
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors">
                  <div>
                    <span className="text-sm font-medium text-purple-900">🌐 Network Setup</span>
                    <p className="text-xs text-purple-700">WiFi & connectivity</p>
                  </div>
                  <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                    3 available
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-red-200 bg-red-50">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Need Urgent Help?</h3>
              <p className="text-sm text-red-700 mb-4">
                For critical tech emergencies, call our 24/7 support line immediately.
              </p>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={handleEmergencyCall}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call {EMERGENCY_NUMBER}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}