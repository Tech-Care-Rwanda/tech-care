"use client"

import React, { useEffect, useState } from 'react'

interface MapMarkerProps {
  map?: google.maps.Map
  position: { lat: number; lng: number }
  title?: string
  icon?: string | google.maps.Icon | google.maps.Symbol
  onClick?: () => void
  children?: React.ReactNode
}

export const MapMarker: React.FC<MapMarkerProps> = ({
  map,
  position,
  title,
  icon,
  onClick,
  children
}) => {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    if (!map || typeof google === 'undefined') return

    // Create marker
    const markerInstance = new google.maps.Marker({
      position,
      map,
      title,
      icon,
      animation: google.maps.Animation.DROP
    })

    // Add click listener
    if (onClick) {
      markerInstance.addListener('click', onClick)
    }

    // Create info window if children provided
    let infoWindowInstance: google.maps.InfoWindow | null = null
    if (children) {
      infoWindowInstance = new google.maps.InfoWindow()
      setInfoWindow(infoWindowInstance)

      markerInstance.addListener('click', () => {
        infoWindowInstance?.open(map, markerInstance)
      })
    }

    setMarker(markerInstance)

    // Cleanup
    return () => {
      markerInstance.setMap(null)
      if (infoWindowInstance) {
        infoWindowInstance.close()
      }
    }
  }, [map, position, title, icon, onClick, children])

  // Update info window content when children change
  useEffect(() => {
    if (infoWindow && children) {
      const content = document.createElement('div')
      // For now, we'll use simple text content
      // In a real implementation, you'd want to use ReactDOM.render or similar
      content.innerHTML = typeof children === 'string' ? children : 'Marker Info'
      infoWindow.setContent(content)
    }
  }, [infoWindow, children])

  return null // This component doesn't render anything directly
}

// Predefined marker icons for common use cases
export const getMarkerIcons = () => {
  if (typeof window === 'undefined' || typeof google === 'undefined' || !google.maps) {
    return {
      technician: undefined,
      user: undefined,
      service: undefined
    }
  }

  try {
    // Check if Size constructor is available, otherwise use object literal
    const createIcon = (color: string) => ({
      url: `data:image/svg+xml;charset=UTF-8,%3csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' fill='${color.replace('#', '%23')}'/%3e%3ccircle cx='12' cy='9' r='2.5' fill='white'/%3e%3c/svg%3e`,
      scaledSize: google.maps.Size ? new google.maps.Size(32, 32) : { width: 32, height: 32 },
      anchor: google.maps.Point ? new google.maps.Point(16, 32) : { x: 16, y: 32 }
    })

    return {
      technician: createIcon('#FF385C'),
      user: createIcon('#484848'),
      service: createIcon('#FF385C')
    }
  } catch (error) {
    console.warn('Error creating map icons:', error)
    return {
      technician: undefined,
      user: undefined,
      service: undefined
    }
  }
}

// Backward compatibility
export const MarkerIcons = {
  get technician() { return getMarkerIcons().technician },
  get user() { return getMarkerIcons().user },
  get service() { return getMarkerIcons().service }
} 