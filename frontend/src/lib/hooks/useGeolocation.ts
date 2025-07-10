"use client"

import { useState, useEffect } from 'react'

interface GeolocationState {
  loading: boolean
  position: { lat: number; lng: number } | null
  error: string | null
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    position: null,
    error: null
  })

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000
  } = options

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        position: null,
        error: 'Geolocation is not supported by this browser'
      })
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          error: null
        })
      },
      (error) => {
        let errorMessage = 'Failed to get location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }

        setState({
          loading: false,
          position: null,
          error: errorMessage
        })
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    )
  }

  // Auto-get position on mount if browser supports it
  useEffect(() => {
    if (navigator.geolocation) {
      getCurrentPosition()
    }
  }, [])

  return {
    ...state,
    getCurrentPosition,
    isSupported: !!navigator.geolocation
  }
} 