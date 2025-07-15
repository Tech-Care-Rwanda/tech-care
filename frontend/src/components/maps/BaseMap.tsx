"use client"

import React, { useCallback, useRef, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

interface BaseMapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  className?: string
  children?: React.ReactNode
  onLoad?: (map: google.maps.Map) => void
  onClick?: (event: google.maps.MapMouseEvent) => void
}

// Default center: Kigali, Rwanda
const DEFAULT_CENTER = { lat: -1.9441, lng: 30.0619 }
const DEFAULT_ZOOM = 12

const MapComponent: React.FC<BaseMapProps> = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = "w-full h-96",
  children,
  onLoad,
  onClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const initializeMap = useCallback(() => {
    if (!mapRef.current || map) return

    const mapInstance = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    })

    if (onClick) {
      mapInstance.addListener('click', onClick)
    }

    setMap(mapInstance)
    onLoad?.(mapInstance)
  }, [center, zoom, onLoad, onClick, map])

  React.useEffect(() => {
    initializeMap()
  }, [initializeMap])

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {map && React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map } as any)
        }
        return child
      })}
    </div>
  )
}

const LoadingComponent = () => (
  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
      <p className="text-gray-600">Loading map...</p>
    </div>
  </div>
)

const FallbackMapComponent: React.FC<BaseMapProps> = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = "w-full h-96",
  onClick
}) => {
  const rwandaLocations = [
    { name: 'Kigali', lat: -1.9441, lng: 30.0619, isCenter: true },
    { name: 'Huye', lat: -2.5958, lng: 29.7359, isCenter: false },
    { name: 'Musanze', lat: -1.4997, lng: 29.6347, isCenter: false },
    { name: 'Rubavu', lat: -1.6792, lng: 29.2595, isCenter: false },
    { name: 'Nyagatare', lat: -1.2888, lng: 30.3147, isCenter: false }
  ]

  return (
    <div className={`${className} relative bg-gradient-to-br from-green-100 via-blue-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200`}>
      {/* Background pattern to simulate map */}
      <div className="absolute inset-0">
        {/* Road-like lines */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-300 opacity-60 transform rotate-12"></div>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 opacity-60 transform -rotate-6"></div>
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-300 opacity-60 transform rotate-3"></div>
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-gray-300 opacity-60"></div>
        <div className="absolute top-0 bottom-0 right-1/4 w-px bg-gray-300 opacity-60"></div>
        
        {/* Hills simulation */}
        <div className="absolute bottom-0 left-0 w-32 h-16 bg-green-200 rounded-t-full opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-24 h-12 bg-green-200 rounded-t-full opacity-70"></div>
        <div className="absolute bottom-0 left-1/3 w-20 h-10 bg-green-200 rounded-t-full opacity-70"></div>
      </div>

      {/* Location markers */}
      {rwandaLocations.map((location, index) => {
        const x = 20 + (index * 15) + (index % 2 ? 10 : 0)
        const y = 30 + (index * 12) + (index % 3 ? 8 : 0)
        
        return (
          <div
            key={location.name}
            className="absolute group cursor-pointer"
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={() => onClick?.({ latLng: { lat: () => location.lat, lng: () => location.lng } } as any)}
          >
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
              location.isCenter ? 'bg-blue-500' : 'bg-red-500'
            } hover:scale-125 transition-transform`}>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {location.name}
            </div>
          </div>
        )
      })}

      {/* Center indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse">
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded text-sm font-semibold shadow-lg">
          Rwanda Map
        </div>
      </div>

      {/* Map-like controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-1">
        <button className="w-8 h-8 bg-white rounded border shadow hover:shadow-md transition-all flex items-center justify-center text-lg font-bold text-gray-700">
          +
        </button>
        <button className="w-8 h-8 bg-white rounded border shadow hover:shadow-md transition-all flex items-center justify-center text-lg font-bold text-gray-700">
          −
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg">
        <div className="text-xs font-semibold text-gray-700 mb-2">Rwanda Locations</div>
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Cities</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Current</span>
        </div>
      </div>
    </div>
  )
}

const ErrorComponent = ({ error }: { error: Status }) => (
  <FallbackMapComponent />
)

export const BaseMap: React.FC<BaseMapProps> = (props) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return <FallbackMapComponent {...props} />
  }

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingComponent />
      case Status.FAILURE:
        return <ErrorComponent error={status} />
      case Status.SUCCESS:
        return <MapComponent {...props} />
      default:
        return <LoadingComponent />
    }
  }

  return (
    <Wrapper 
      apiKey={apiKey}
      render={render}
      libraries={['places', 'geometry']}
    />
  )
} 