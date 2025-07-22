"use client"

import { useState, useEffect } from 'react'
import { TechnicianMap } from "@/components/maps/TechnicianMap"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Star, Users, Phone, X } from 'lucide-react'
import { supabaseService, TechnicianDetails } from '@/lib/supabase'

const EMERGENCY_NUMBER = "+250791995143"

// Service categories that match technician specializations
const SERVICE_CATEGORIES = [
  {
    id: 'computer-repair',
    name: '💻 Computer Repair',
    description: 'Hardware & software issues',
    specializations: ['Computer Repair', 'Hardware Support', 'Software Installation']
  },
  {
    id: 'mobile-devices', 
    name: '📱 Mobile & Devices',
    description: 'Phone & tablet repairs',
    specializations: ['Mobile & Devices', 'Phone Repair', 'Tablet Support']
  },
  {
    id: 'network-setup',
    name: '🌐 Network Setup', 
    description: 'WiFi & connectivity',
    specializations: ['Network Setup', 'WiFi Installation', 'Network Security']
  }
]

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [technicians, setTechnicians] = useState<TechnicianDetails[]>([])
  const [filteredTechnicians, setFilteredTechnicians] = useState<TechnicianDetails[]>([])
  const [loading, setLoading] = useState(true)

  const handleEmergencyCall = () => {
    window.open(`tel:${EMERGENCY_NUMBER}`)
  }

  // Fetch all technicians on component mount - NO MOCK DATA
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true)
        const data = await supabaseService.getTechnicians(true) // Only approved technicians
        console.log('Fetched technicians from database:', data) // Debug log
        setTechnicians(data || [])
        setFilteredTechnicians(data || [])
      } catch (error) {
        console.error('Error fetching technicians from database:', error)
        // Don't set mock data - show empty state
        setTechnicians([])
        setFilteredTechnicians([])
      } finally {
        setLoading(false)
      }
    }

    fetchTechnicians()
  }, [])

  // Filter technicians when selectedFilter changes
  useEffect(() => {
    if (!selectedFilter) {
      setFilteredTechnicians(technicians)
    } else {
      const category = SERVICE_CATEGORIES.find(cat => cat.id === selectedFilter)
      if (category) {
        const filtered = technicians.filter(tech => 
          category.specializations.some(spec => 
            tech.specialization.toLowerCase().includes(spec.toLowerCase()) ||
            spec.toLowerCase().includes(tech.specialization.toLowerCase())
          )
        )
        setFilteredTechnicians(filtered)
      }
    }
  }, [selectedFilter, technicians])

  // Get count of technicians for each service category
  const getServiceCount = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find(cat => cat.id === categoryId)
    if (!category) return 0
    
    return technicians.filter(tech => 
      category.specializations.some(spec => 
        tech.specialization.toLowerCase().includes(spec.toLowerCase()) ||
        spec.toLowerCase().includes(tech.specialization.toLowerCase())
      )
    ).length
  }

  // Handle service filter click
  const handleServiceClick = (categoryId: string) => {
    if (selectedFilter === categoryId) {
      // If already selected, clear filter
      setSelectedFilter(null)
    } else {
      // Set new filter
      setSelectedFilter(categoryId)
    }
  }

  // Clear filter
  const clearFilter = () => {
    setSelectedFilter(null)
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {loading ? 'Loading Technicians...' : selectedFilter ? `Filtered Technicians` : 'Available Technicians'}
                  </h2>
                  {selectedFilter && !loading && (
                    <p className="text-sm text-gray-600">
                      Showing {filteredTechnicians.length} technicians for {SERVICE_CATEGORIES.find(cat => cat.id === selectedFilter)?.name}
                    </p>
                  )}
                  {!loading && filteredTechnicians.length === 0 && (
                    <p className="text-sm text-red-600">
                      {selectedFilter ? 'No technicians found for this service.' : 'No technicians currently available. Please try again later.'}
                    </p>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  Kigali, Rwanda
                </div>
              </div>
              <TechnicianMap 
                className="h-[500px] lg:h-[600px] w-full" 
                filterSpecialization={selectedFilter ? SERVICE_CATEGORIES.find(cat => cat.id === selectedFilter)?.specializations : undefined}
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Available Now</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF385C' }}></div>
                    <span className="font-semibold text-gray-900">{filteredTechnicians.length}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Avg Response</span>
                  </div>
                  <span className="font-semibold text-gray-900">2 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Avg Rating</span>
                  </div>
                  <span className="font-semibold text-gray-900">4.8</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h3>
              <div className="space-y-3">
                {SERVICE_CATEGORIES.map((category) => {
                  const isActive = selectedFilter === category.id
                  const count = getServiceCount(category.id)
                  
                  return (
                    <div
                      key={category.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        isActive 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleServiceClick(category.id)}
                    >
                      <div>
                        <span className={`text-sm font-medium ${
                          isActive ? 'text-red-900' : 'text-gray-900'
                        }`}>
                          {category.name}
                        </span>
                        <p className={`text-xs ${
                          isActive ? 'text-red-700' : 'text-gray-600'
                        }`}>
                          {category.description}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={isActive 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-200 text-gray-700'
                        }
                      >
                        {count} available
                      </Badge>
                    </div>
                  )
                })}

                {selectedFilter && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilter}
                    className="w-full mt-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Filter
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-4 border-red-200 bg-red-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Urgent Help?</h3>
              <p className="text-sm text-gray-700 mb-4">
                For critical tech emergencies, call our 24/7 support line immediately.
              </p>
              <Button
                size="sm"
                className="w-full text-white hover:opacity-90"
                style={{ backgroundColor: '#FF385C' }}
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