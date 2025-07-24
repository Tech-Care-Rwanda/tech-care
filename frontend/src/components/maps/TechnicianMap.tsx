"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { BaseMap, MapMarker, getMarkerIcons } from '@/components/maps'
import { useGeolocation } from '@/lib/hooks/useGeolocation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MapPin, Clock, Phone, Navigation } from 'lucide-react'
import { supabaseService, TechnicianDetails } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface TechnicianWithDistance {
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
  rate: number
}

interface TechnicianMapProps {
  className?: string
  filterSpecialization?: string[]
}

export const TechnicianMap: React.FC<TechnicianMapProps> = ({
  className = "h-[600px]",
  filterSpecialization
}) => {
  const router = useRouter()
  const { position: userLocation, getCurrentPosition, loading: locationLoading } = useGeolocation()
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianWithDistance | null>(null)
  const [technicians, setTechnicians] = useState<TechnicianWithDistance[]>([])
  const [mapCenter, setMapCenter] = useState({ lat: -1.9441, lng: 30.0619 }) // Default to Kigali
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize marker icons once when component mounts
  const [markerIcons, setMarkerIcons] = useState<ReturnType<typeof getMarkerIcons>>({
    technician: undefined,
    user: undefined,
    service: undefined
  })
  const [iconsInitialized, setIconsInitialized] = useState(false)

  // Initialize icons only once when Google Maps is available
  useEffect(() => {
    if (iconsInitialized) return

    const initializeIcons = () => {
      if (typeof google !== 'undefined' && google.maps) {
        const icons = getMarkerIcons()
        if (icons.technician) {
          setMarkerIcons(icons)
          setIconsInitialized(true)
        }
      }
    }

    if (typeof google !== 'undefined' && google.maps) {
      initializeIcons()
    } else {
      const checkInterval = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps) {
          initializeIcons()
          clearInterval(checkInterval)
        }
      }, 500) // Check every 500ms instead of 100ms

      return () => clearInterval(checkInterval)
    }
  }, [iconsInitialized]) // Dependency on iconsInitialized to prevent re-running

  // Fetch nearby technicians from Supabase
  const fetchNearbyTechnicians = useCallback(async (lat: number, lng: number) => {
    setLoading(true)
    setError(null)

    try {
      const techniciansData = await supabaseService.getTechnicians(true) // Get available technicians

      console.log('Raw technician data from Supabase:', techniciansData) // Debug log

      // Transform Supabase data to map format
      let filteredData = techniciansData.filter(tech => tech.is_available)

      // Apply specialization filter if provided
      if (filterSpecialization && filterSpecialization.length > 0) {
        filteredData = filteredData.filter(tech =>
          filterSpecialization.some(spec =>
            tech.specialization.toLowerCase().includes(spec.toLowerCase()) ||
            spec.toLowerCase().includes(tech.specialization.toLowerCase())
          )
        )
      }

      const transformedTechnicians: TechnicianWithDistance[] = filteredData
        .map((tech) => {
          // Only use technicians with valid coordinates - NO MOCK DATA
          if (!tech.latitude || !tech.longitude) {
            return null
          }

          const location = { lat: tech.latitude, lng: tech.longitude }

          const distance = Math.sqrt(
            Math.pow(location.lat - lat, 2) + Math.pow(location.lng - lng, 2)
          ) * 111 // Rough km conversion

          // Debug the user data
          console.log('Technician:', tech.id, 'User data:', tech.user)

          return {
            id: tech.id.toString(),
            name: tech.user?.full_name || tech.specialization || 'Technician',
            avatar: tech.image_url,
            rating: tech.rate / 10, // Convert rate to 5-star scale
            specialization: tech.specialization,
            location,
            distance: Math.round(distance * 10) / 10,
            estimatedArrival: `${Math.ceil(distance / 0.5)} min`,
            isAvailable: tech.is_available,
            phoneNumber: tech.user?.phone_number,
            rate: tech.rate
          }
        })
        .filter(Boolean) as TechnicianWithDistance[] // Remove null entries

      console.log('Transformed technicians:', transformedTechnicians) // Debug log
      setTechnicians(transformedTechnicians)

      // If no technicians found, show message
      if (transformedTechnicians.length === 0) {
        setError('No available technicians found in your area.')
      }
    } catch (err) {
      console.error('Error fetching technicians from Supabase:', err)
      setError('Failed to load technicians from database.')
      setTechnicians([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch technicians when user location is available
  useEffect(() => {
    if (userLocation) {
      fetchNearbyTechnicians(userLocation.lat, userLocation.lng)
    } else {
      // Load all technicians with default location when no user location
      fetchNearbyTechnicians(-1.9441, 30.0619) // Default to Kigali center
    }
  }, [userLocation, fetchNearbyTechnicians, filterSpecialization])

  // Update map center when user location is available
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation)
    }
  }, [userLocation])

  const handleTechnicianClick = useCallback((technician: TechnicianWithDistance) => {
    setSelectedTechnician(technician)
    setMapCenter(technician.location)
  }, [])


  const getDistanceColor = (distance: number) => {
    if (distance <= 2) return "text-green-600 bg-green-50"
    if (distance <= 5) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

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
              icon={markerIcons.user || (typeof google !== 'undefined' && google.maps && google.maps.SymbolPath ? {
                fillColor: '#3B82F6',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 8,
                path: google.maps.SymbolPath.CIRCLE
              } : undefined)}
            />
          )}

          {/* Technician markers */}
          {technicians.map((technician) => (
            <MapMarker
              key={technician.id}
              position={technician.location}
              title={technician.name}
              icon={markerIcons.technician || (typeof google !== 'undefined' && google.maps && google.maps.SymbolPath ? {
                fillColor: '#EF4444',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 10,
                path: google.maps.SymbolPath.CIRCLE
              } : undefined)}
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
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF385C' }}></div>
              <span className="text-sm font-medium">Available Technicians ({technicians.length})</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              <span className="text-sm">Your Location</span>
            </div>
          </Card>

          {!userLocation && !locationLoading && (
            <Button
              onClick={getCurrentPosition}
              size="sm"
              className="w-full text-white hover:opacity-90"
              style={{ backgroundColor: '#FF385C' }}
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
                    size="sm"
                    onClick={() => router.push(`/book/${selectedTechnician.id}`)}
                    className="flex-1 text-white hover:opacity-90"
                    style={{ backgroundColor: '#FF385C' }}
                  >
                    Book Now
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:+250791995143`)}
                    title="Call technician"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderBottomColor: '#FF385C' }}></div>
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
            <Card className="p-3 border-red-200 bg-red-50">
              <div className="text-sm text-red-800">
                <p className="font-medium">Error loading technicians</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Card>
  )
}
