"use client"

import React, { useState, useCallback } from 'react'
import { ChevronDown, MapPin, Crosshair, Navigation } from 'lucide-react'
import { BaseMap } from '@/components/maps'
import { useGeolocation } from '@/lib/hooks/useGeolocation'

interface LocationMapPickerProps {
  selectedLocation: string
  onLocationChange: (location: string, coordinates?: { lat: number; lng: number }) => void
  className?: string
}

const rwandaLocations = [
  { name: 'Kigali', lat: -1.9441, lng: 30.0619 },
  { name: 'Huye', lat: -2.5958, lng: 29.7359 },
  { name: 'Musanze', lat: -1.4997, lng: 29.6347 },
  { name: 'Rubavu', lat: -1.6792, lng: 29.2595 },
  { name: 'Nyagatare', lat: -1.2888, lng: 30.3147 }
]

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  selectedLocation,
  onLocationChange,
  className = ""
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [mapCenter, setMapCenter] = useState(rwandaLocations[0]) // Default to Kigali
  const { position: userPosition, getCurrentPosition, loading: locationLoading } = useGeolocation()

  const handleLocationSelect = (location: typeof rwandaLocations[0]) => {
    onLocationChange(location.name, { lat: location.lat, lng: location.lng })
    setMapCenter(location)
    setShowDropdown(false)
  }



  const handleUseMyLocation = () => {
    if (userPosition) {
      onLocationChange('My Current Location', userPosition)
      setMapCenter({ name: 'My Current Location', ...userPosition })
    } else {
      getCurrentPosition()
    }
  }

  return (
    <div className={`relative ${className}`} data-search-dropdown>
      {/* Location Input */}
      <div 
        className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200 transition-colors h-full"
        onClick={(e) => {
          e.stopPropagation()
          setShowDropdown(!showDropdown)
        }}
      >
        <div className="flex items-center space-x-3">
          <Navigation className="w-5 h-5 text-red-500" />
          <div className="text-left">
            <p className="font-semibold text-sm text-gray-900">Location</p>
            <p className="text-gray-700 text-sm">{selectedLocation}</p>
          </div>
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${
            showDropdown ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {/* Dropdown with Map Option */}
      {showDropdown && (
        <div 
          className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-xl border mt-2 z-[100] max-h-96 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-100">
            <button
              onClick={handleUseMyLocation}
              disabled={locationLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors font-medium"
            >
              <Crosshair className="w-4 h-4" />
              {locationLoading ? 'Getting Your Location...' : 'Use My Current Location'}
            </button>
          </div>



          {/* City List */}
          <div className="max-h-48 overflow-y-auto">
            {rwandaLocations.map((location) => (
              <div
                key={location.name}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm flex items-center justify-between transition-colors border-b border-gray-50 last:border-b-0 ${
                  selectedLocation === location.name ? 'bg-red-50 text-red-600' : 'text-gray-700'
                }`}
                onClick={() => handleLocationSelect(location)}
              >
                <span className="font-medium">{location.name}</span>
                {selectedLocation === location.name && (
                  <MapPin className="w-4 h-4 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 