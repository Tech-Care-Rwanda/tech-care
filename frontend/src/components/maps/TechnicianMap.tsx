"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { BaseMap, MapMarker, getMarkerIcons } from '@/components/maps'
import { useGeolocation } from '@/lib/hooks/useGeolocation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MapPin, Clock, Phone, Navigation } from 'lucide-react'
import { API_CONFIG, API_ENDPOINTS } from '@/lib/config/api'

interface Technician {
  id: string
  name: string
  avatar?: string
  rating: number
  specialization: string
  location: { lat: number; lng: number }
  distance: number
  estimatedArrival: string
  isAvailable: boolean
  phoneNumber?: string
}

interface TechnicianMapProps {
  onTechnicianSelect?: (technician: Technician) => void
  className?: string
}

export const TechnicianMap: React.FC<TechnicianMapProps> = ({
  onTechnicianSelect,
  className = "h-[600px]"
}) => {
  const { position: userLocation, getCurrentPosition, loading: locationLoading } = useGeolocation()
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [mapCenter, setMapCenter] = useState({ lat: -1.9441, lng: 30.0619 }) // Default to Kigali
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch nearby technicians from API
  const fetchNearbyTechnicians = useCallback(async (lat: number, lng: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TECHNICIAN.GET_NEARBY(lat, lng, 10, 20)}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch technicians')
      }
      
      const data = await response.json()
      
      // Transform API data to component format
      const transformedTechnicians: Technician[] = data.data.technicians.map((tech: {
        id: number;
        name: string;
        imageUrl?: string;
        rating: string;
        specialization: string;
        latitude: number;
        longitude: number;
        distance: number;
        estimatedArrival: string;
        isAvailable: boolean;
        phone?: string;
      }) => ({
        id: tech.id.toString(),
        name: tech.name,
        avatar: tech.imageUrl,
        rating: parseFloat(tech.rating),
        specialization: tech.specialization,
        location: { lat: tech.latitude, lng: tech.longitude },
        distance: tech.distance,
        estimatedArrival: tech.estimatedArrival,
        isAvailable: tech.isAvailable,
        phoneNumber: tech.phone
      }))
      
      setTechnicians(transformedTechnicians)
    } catch (err) {
      console.error('Error fetching technicians:', err)
      setError(err instanceof Error ? err.message : 'Failed to load technicians')
      
      // Fallback to mock data for development
      const mockTechnicians: Technician[] = [
        {
          id: "1",
          name: "Jean Baptiste",
          avatar: "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg",
          rating: 4.8,
          specialization: "Computer Repair",
          location: { lat: -1.9470, lng: 30.0588 },
          distance: 1.2,
          estimatedArrival: "15 mins",
          isAvailable: true,
          phoneNumber: "+250788123456"
        },
        {
          id: "2", 
          name: "Marie Uwimana",
          avatar: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
          rating: 4.6,
          specialization: "Mobile Repair",
          location: { lat: -1.9390, lng: 30.0740 },
          distance: 2.1,
          estimatedArrival: "25 mins",
          isAvailable: true,
          phoneNumber: "+250788234567"
        }
      ]
      setTechnicians(mockTechnicians)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch technicians when user location is available
  useEffect(() => {
    if (userLocation) {
      fetchNearbyTechnicians(userLocation.lat, userLocation.lng)
    }
  }, [userLocation, fetchNearbyTechnicians])

  // Update map center when user location is available
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation)
    }
  }, [userLocation])

  const handleTechnicianClick = useCallback((technician: Technician) => {
    setSelectedTechnician(technician)
    setMapCenter(technician.location)
    onTechnicianSelect?.(technician)
  }, [onTechnicianSelect])

  const handleBookTechnician = (technician: Technician) => {
    // Navigate to booking flow
    window.location.href = `/dashboard/book/${technician.id}`
  }

  const getDistanceColor = (distance: number) => {
    if (distance <= 2) return "text-green-600 bg-green-50"
    if (distance <= 5) return "text-yellow-600 bg-yellow-50" 
    return "text-red-600 bg-red-50"
  }

  const [markerIcons, setMarkerIcons] = useState<ReturnType<typeof getMarkerIcons>>({
    technician: undefined,
    user: undefined,
    service: undefined
  })

  // Initialize marker icons when Google Maps is loaded
  useEffect(() => {
    const initializeIcons = () => {
      if (typeof google !== 'undefined' && google.maps) {
        setMarkerIcons(getMarkerIcons())
      }
    }

    // Check if Google Maps is already loaded
    if (typeof google !== 'undefined' && google.maps) {
      initializeIcons()
    } else {
      // Wait for Google Maps to load
      const interval = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps) {
          initializeIcons()
          clearInterval(interval)
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [])

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative h-full w-full">
        <BaseMap
          center={mapCenter}
          zoom={13}
          className="w-full h-full"
          onLoad={(map) => {
            console.log('Map loaded', map)
          }}
        >
          {/* User location marker */}
          {userLocation && (
            <MapMarker
              position={userLocation}
              title="Your location"
              icon={markerIcons.user || {
                fillColor: '#3B82F6',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 8,
                path: typeof google !== 'undefined' && google.maps ? google.maps.SymbolPath.CIRCLE : undefined
              }}
            />
          )}

          {/* Technician markers */}
          {technicians.map((technician) => (
            <MapMarker
              key={technician.id}
              position={technician.location}
              title={technician.name}
              icon={markerIcons.technician || {
                fillColor: '#EF4444',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 10,
                path: typeof google !== 'undefined' && google.maps ? google.maps.SymbolPath.CIRCLE : undefined
              }}
              onClick={() => handleTechnicianClick(technician)}
            >
              <div className="font-semibold">{technician.name}</div>
              <div className="text-sm text-gray-600">{technician.specialization}</div>
              <div className="text-sm">⭐ {technician.rating} • {technician.estimatedArrival}</div>
            </MapMarker>
          ))}
        </BaseMap>

        {/* Map Controls */}
        <div className="absolute top-4 left-4 space-y-2">
          <Card className="p-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Available Technicians ({technicians.length})</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Your Location</span>
            </div>
          </Card>

          {!userLocation && !locationLoading && (
            <Button 
              onClick={getCurrentPosition}
              size="sm" 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Find My Location
            </Button>
          )}
        </div>

        {/* Technician Details Popup */}
        {selectedTechnician && (
          <Card className="absolute bottom-4 left-4 right-4 p-4 shadow-xl">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedTechnician.avatar} />
                <AvatarFallback>
                  {selectedTechnician.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedTechnician.name}
                  </h3>
                  <button
                    onClick={() => setSelectedTechnician(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{selectedTechnician.specialization}</p>
                
                <div className="flex items-center space-x-4 text-sm mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{selectedTechnician.rating}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <Badge className={`text-xs ${getDistanceColor(selectedTechnician.distance)}`}>
                      {selectedTechnician.distance}km away
                    </Badge>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">{selectedTechnician.estimatedArrival}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleBookTechnician(selectedTechnician)}
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    Book Now
                  </Button>
                  
                  {selectedTechnician.phoneNumber && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`tel:${selectedTechnician.phoneNumber}`)}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Loading overlay */}
        {(locationLoading || loading) && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm">
                  {locationLoading ? 'Getting your location...' : 'Finding nearby technicians...'}
                </span>
              </div>
            </Card>
          </div>
        )}

        {/* Error message */}
        {error && !loading && (
          <div className="absolute top-4 right-4 max-w-sm">
            <Card className="p-3 border-yellow-200 bg-yellow-50">
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Using demo data</p>
                <p className="text-xs mt-1">Connect to backend to see real technicians</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Card>
  )
}
