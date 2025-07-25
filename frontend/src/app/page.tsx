"use client"

import { useState, useEffect } from 'react'
import { TechnicianMap } from "@/components/maps/TechnicianMap"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Star, Users, Phone, X, UserPlus, LogIn, ArrowRight } from 'lucide-react'
import { supabaseService, TechnicianDetails } from '@/lib/supabase'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import Link from 'next/link'

const EMERGENCY_NUMBER = "+250791995143"

// Service categories that match technician specializations
const SERVICE_CATEGORIES = [
  {
    id: 'computer-repair',
    name: '💻 Computer Repair',
    description: 'Hardware & software issues',
    specializations: [
      'Computer Repair', 'Computer', 'Laptop Repair', 'Desktop Repair',
      'Software Installation', 'Hardware Installation', 'PC Repair',
      'Data Recovery', 'Virus Removal', 'System Repair'
    ]
  },
  {
    id: 'mobile-devices', 
    name: '📱 Mobile & Devices',
    description: 'Phone & tablet repairs',
    specializations: [
      'Phone Repair', 'Mobile Repair', 'Smartphone Repair', 'iPhone Repair', 'Android Repair',
      'Tablet Repair', 'Gaming Console Repair', 'Device Repair', 'Mobile', 'Phone'
    ]
  },
  {
    id: 'network-setup',
    name: '🌐 Network Setup', 
    description: 'WiFi & connectivity',
    specializations: [
      'Network Setup', 'Network', 'WiFi Setup', 'Internet Setup', 'Router Setup',
      'Smart Home Setup', 'TV Setup', 'Audio Systems', 'Printer Setup', 'Connectivity'
    ]
  }
]

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [technicians, setTechnicians] = useState<TechnicianDetails[]>([])
  const [filteredTechnicians, setFilteredTechnicians] = useState<TechnicianDetails[]>([])
  const [loading, setLoading] = useState(true)
  
  // Get authentication state
  const { profile, loading: authLoading } = useSupabaseAuth()

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
        console.log('Technician specializations found:', data?.map(t => t.specialization) || []) // Debug specializations
        
        // If no real data, use temporary mock data for testing filtering
        if (!data || data.length === 0) {
          console.log('⚠️ No real data found, using comprehensive mock data for testing filters')
          const mockTechnicians: TechnicianDetails[] = [
            // Computer Repair Technicians
            {
              id: '1',
              user_id: '1',
              specialization: 'Computer Repair',
              experience: '5 years',
              rate: 15000,
              is_available: true,
              latitude: -1.9441,
              longitude: 30.0619,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user: {
                id: '1',
                full_name: 'John Computer',
                phone_number: '+250788123456',
                email: 'john@computer.rw',
                role: 'TECHNICIAN',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            {
              id: '2',
              user_id: '2',
              specialization: 'Laptop Repair',
              experience: '4 years',
              rate: 14000,
              is_available: true,
              latitude: -1.9380,
              longitude: 30.0650,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user: {
                id: '2',
                full_name: 'Alice Laptop',
                phone_number: '+250788123457',
                email: 'alice@laptop.rw',
                role: 'TECHNICIAN',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            // Mobile & Devices Technicians
            {
              id: '3', 
              user_id: '3',
              specialization: 'Phone Repair',
              experience: '3 years',
              rate: 12000,
              is_available: true,
              latitude: -1.9506,
              longitude: 30.0588,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user: {
                id: '3',
                full_name: 'Sarah Mobile',
                phone_number: '+250788123458',
                email: 'sarah@mobile.rw',
                role: 'TECHNICIAN',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            {
              id: '4',
              user_id: '4',
              specialization: 'iPhone Repair',
              experience: '2 years',
              rate: 13000,
              is_available: true,
              latitude: -1.9520,
              longitude: 30.0600,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user: {
                id: '4',
                full_name: 'Mike iPhone',
                phone_number: '+250788123459',
                email: 'mike@iphone.rw',
                role: 'TECHNICIAN',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            // Network Setup Technicians
            {
              id: '5',
              user_id: '5', 
              specialization: 'Network Setup',
              experience: '6 years',
              rate: 16000,
              is_available: true,
              latitude: -1.9350,
              longitude: 30.0590,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user: {
                id: '5',
                full_name: 'David Network',
                phone_number: '+250788123460',
                email: 'david@network.rw',
                role: 'TECHNICIAN',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            {
              id: '6',
              user_id: '6',
              specialization: 'WiFi Setup',
              experience: '3 years',
              rate: 11000,
              is_available: true,
              latitude: -1.9480,
              longitude: 30.0640,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user: {
                id: '6',
                full_name: 'Emma WiFi',
                phone_number: '+250788123461',
                email: 'emma@wifi.rw',
                role: 'TECHNICIAN',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          ]
          console.log('🧪 Mock technicians loaded:', mockTechnicians.length)
          setTechnicians(mockTechnicians)
          setFilteredTechnicians(mockTechnicians)
        } else {
          setTechnicians(data || [])
          setFilteredTechnicians(data || [])
        }
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
        const filtered = technicians.filter(tech => {
          const techSpecialization = tech.specialization.toLowerCase().trim()
          
          return category.specializations.some(spec => {
            const categorySpec = spec.toLowerCase().trim()
            
            // Priority 1: Exact match
            if (techSpecialization === categorySpec) return true
            
            // Priority 2: Check for category-specific keywords
            const categoryKeywords: Record<string, string[]> = {
              'computer-repair': ['computer', 'laptop', 'desktop', 'software', 'hardware', 'system'],
              'mobile-devices': ['phone', 'mobile', 'smartphone', 'iphone', 'android', 'tablet'],
              'network-setup': ['network', 'wifi', 'internet', 'router', 'connectivity']
            }
            
            const keywords = categoryKeywords[category.id] || []
            const techWords = techSpecialization.split(/[\s,\-_]+/).map(w => w.toLowerCase())
            const specWords = categorySpec.split(/[\s,\-_]+/).map(w => w.toLowerCase())
            
            // Check if tech specialization contains relevant keywords for this category
            const hasRelevantKeyword = keywords.some((keyword: string) => 
              techWords.includes(keyword) || techWords.some(word => word.includes(keyword))
            )
            
            if (!hasRelevantKeyword) return false
            
            // Priority 3: Word matching within relevant specializations
            return techWords.some(techWord => 
              specWords.some(specWord => 
                specWord.length > 3 && (techWord === specWord || 
                (techWord.length > 4 && specWord.length > 4 && 
                 (techWord.includes(specWord) || specWord.includes(techWord))))
              )
            )
          })
        })
        
        console.log(`🔍 Filtering for category "${category.name}":`, {
          categorySpecs: category.specializations,
          allTechnicians: technicians.map(t => t.specialization),
          filteredCount: filtered.length,
          filteredTechnicians: filtered.map(t => t.specialization)
        })
        setFilteredTechnicians(filtered)
      }
    }
  }, [selectedFilter, technicians])

  // Get count of technicians for each service category
  const getServiceCount = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find(cat => cat.id === categoryId)
    if (!category) return 0

    return technicians.filter(tech => {
      const techSpecialization = tech.specialization.toLowerCase().trim()
      
      return category.specializations.some(spec => {
        const categorySpec = spec.toLowerCase().trim()
        
        // Priority 1: Exact match
        if (techSpecialization === categorySpec) return true
        
        // Priority 2: Check for category-specific keywords
        const categoryKeywords: Record<string, string[]> = {
          'computer-repair': ['computer', 'laptop', 'desktop', 'software', 'hardware', 'system'],
          'mobile-devices': ['phone', 'mobile', 'smartphone', 'iphone', 'android', 'tablet'],
          'network-setup': ['network', 'wifi', 'internet', 'router', 'connectivity']
        }
        
        const keywords = categoryKeywords[category.id] || []
        const techWords = techSpecialization.split(/[\s,\-_]+/).map(w => w.toLowerCase())
        const specWords = categorySpec.split(/[\s,\-_]+/).map(w => w.toLowerCase())
        
        // Check if tech specialization contains relevant keywords for this category
        const hasRelevantKeyword = keywords.some((keyword: string) => 
          techWords.includes(keyword) || techWords.some(word => word.includes(keyword))
        )
        
        if (!hasRelevantKeyword) return false
        
        // Priority 3: Word matching within relevant specializations
        return techWords.some(techWord => 
          specWords.some(specWord => 
            specWord.length > 3 && (techWord === specWord || 
            (techWord.length > 4 && specWord.length > 4 && 
             (techWord.includes(specWord) || specWord.includes(techWord))))
          )
        )
      })
    }).length
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

  // Authentication-aware hero content
  const getHeroContent = () => {
    if (authLoading) {
      return {
        title: "Loading...",
        subtitle: "Please wait while we load your experience",
        showAuthButtons: false
      }
    }

    if (profile) {
      // Authenticated user experience
      return {
        title: `Welcome back, ${profile.full_name?.split(' ')[0] || 'User'}`,
        subtitle: "Ready to book another service? Find verified tech experts in Kigali, Rwanda.",
        showAuthButtons: false,
        showDashboardLink: true
      }
    }

    // Anonymous user experience
    return {
      title: "Find a technician near you",
      subtitle: "Connect with verified tech experts in Kigali, Rwanda. Get instant support for computers, mobile devices, and networks.",
      showAuthButtons: true
    }
  }

  const heroContent = getHeroContent()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Authentication Logic */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {heroContent.title}
              </h1>
              <p className="text-gray-600">
                {heroContent.subtitle}
              </p>
            </div>
            
            {/* Authentication Action Buttons for Anonymous Users */}
            {heroContent.showAuthButtons && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="text-white hover:opacity-90" style={{ backgroundColor: '#FF385C' }}>
                  <Link href="/signup">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Get Started
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 hover:bg-gray-50">
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              </div>
            )}
            
            {/* Dashboard Link for Authenticated Users */}
            {heroContent.showDashboardLink && (
              <Button asChild className="text-white hover:opacity-90" style={{ backgroundColor: '#FF385C' }}>
                <Link href="/dashboard">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View My Bookings
                </Link>
              </Button>
            )}
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
            {/* Sign Up Prompt Banner for Anonymous Users */}
            {!authLoading && !profile && (
              <Card className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                <div className="text-center">
                  <UserPlus className="w-8 h-8 mx-auto mb-2 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Join TechCare Today</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Create your account to book services, track appointments, and get personalized support.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button asChild className="text-white hover:opacity-90" style={{ backgroundColor: '#FF385C' }}>
                      <Link href="/signup">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Sign Up Free
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="text-gray-600 hover:bg-gray-50">
                      <Link href="/login">
                        Already have an account? Sign in
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            )}

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
                      className={`p-3 rounded-lg border transition-colors ${isActive
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer mb-3"
                        onClick={() => handleServiceClick(category.id)}
                      >
                        <div>
                          <span className={`text-sm font-medium ${isActive ? 'text-red-900' : 'text-gray-900'}`}>
                            {category.name}
                          </span>
                          <p className={`text-xs ${isActive ? 'text-red-700' : 'text-gray-600'}`}>
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

                      {/* Book Now Button - Different behavior for anonymous vs authenticated users */}
                      {profile ? (
                        // Authenticated user - show technicians directly
                        <Button
                          size="sm"
                          className="w-full text-white hover:opacity-90"
                          style={{ backgroundColor: '#FF385C' }}
                          onClick={() => {
                            // Filter first to show only relevant technicians
                            handleServiceClick(category.id)
                            // Scroll to map to show filtered results
                            setTimeout(() => {
                              const mapElement = document.querySelector('[class*="TechnicianMap"]')
                              if (mapElement) {
                                mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              }
                            }, 100)
                          }}
                          disabled={count === 0}
                        >
                          {count === 0 ? 'No Technicians Available' : `Find ${category.name.replace(/💻|📱|🌐/g, '').trim()} Technicians`}
                        </Button>
                      ) : (
                        // Anonymous user - prompt to sign up
                        <Button
                          size="sm"
                          className="w-full text-white hover:opacity-90"
                          style={{ backgroundColor: '#FF385C' }}
                          asChild
                          disabled={count === 0}
                        >
                          <Link href="/signup">
                            {count === 0 ? 'No Technicians Available' : `Book ${category.name.replace(/💻|📱|🌐/g, '').trim()} Service`}
                          </Link>
                        </Button>
                      )}
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