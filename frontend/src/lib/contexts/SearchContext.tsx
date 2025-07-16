"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface SearchFilters {
  location: string
  serviceType: string
  urgency: string
  details: string
  priceRange?: string
  minRating?: number
  maxDistance?: string
  selectedServices?: string[]
  sameDay: boolean
  remoteSupport: boolean
  computer: boolean
  smartphone: boolean
  network: boolean
  software: boolean
  homeVisit: boolean
  certified: boolean
  availableNow: boolean
}

interface TechnicianResult {
  id: number
  name: string
  title: string
  [key: string]: unknown
}

interface SearchContextType {
  searchFilters: SearchFilters
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  clearFilters: () => void
  searchResults: TechnicianResult[]
  setSearchResults: (results: TechnicianResult[]) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  applyFilters: <T extends { rating: number; priceLevel: number; isOpen: boolean; services: string[] }>(items: T[]) => T[]
}

const defaultFilters: SearchFilters = {
  location: '',
  serviceType: '',
  urgency: '',
  details: '',
  priceRange: '',
  minRating: undefined,
  maxDistance: '',
  selectedServices: [],
  sameDay: false,
  remoteSupport: false,
  computer: false,
  smartphone: false,
  network: false,
  software: false,
  homeVisit: false,
  certified: false,
  availableNow: false
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchFilters, setSearchFiltersState] = useState<SearchFilters>(defaultFilters)
  const [searchResults, setSearchResults] = useState<TechnicianResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const setSearchFilters = useCallback((filters: Partial<SearchFilters>) => {
    setSearchFiltersState(prev => ({ ...prev, ...filters }))
  }, [])

  const clearFilters = useCallback(() => {
    setSearchFiltersState(defaultFilters)
    setSearchResults([])
  }, [])

  const applyFilters = useCallback(<T extends { rating: number; priceLevel: number; isOpen: boolean; services: string[] }>(items: T[]): T[] => {
    return items.filter(item => {
      // Price Level Filter
      if (searchFilters.priceRange) {
        const maxPriceLevel = parseInt(searchFilters.priceRange)
        if (item.priceLevel > maxPriceLevel) {
          return false
        }
      }

      // Rating Filter
      if (searchFilters.minRating) {
        if (item.rating < searchFilters.minRating) {
          return false
        }
      }

      // Availability Filter
      if (searchFilters.availableNow && !item.isOpen) {
        return false
      }

      // Service Filter
      if (searchFilters.selectedServices && searchFilters.selectedServices.length > 0) {
        const hasMatchingService = searchFilters.selectedServices.some(selectedService => 
          item.services.some(service => 
            service.toLowerCase().includes(selectedService.toLowerCase()) ||
            selectedService.toLowerCase().includes(service.toLowerCase())
          )
        )
        if (!hasMatchingService) {
          return false
        }
      }

      return true
    })
  }, [searchFilters])

  return (
    <SearchContext.Provider value={{
      searchFilters,
      setSearchFilters,
      clearFilters,
      searchResults,
      setSearchResults,
      isLoading,
      setIsLoading,
      applyFilters
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

// Helper function to convert search filters to URL parameters
export function filtersToURLParams(filters: SearchFilters): string {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== false && value !== undefined && value !== null) {
      params.append(key, String(value))
    }
  })
  
  return params.toString()
}

// Helper function to convert URL parameters to search filters
export function URLParamsToFilters(searchParams: URLSearchParams): Partial<SearchFilters> {
  const filters: Partial<SearchFilters> = {}
  
  searchParams.forEach((value, key) => {
    if (key in defaultFilters) {
      const filterKey = key as keyof SearchFilters
      if (typeof defaultFilters[filterKey] === 'boolean') {
        (filters as Record<string, unknown>)[filterKey] = value === 'true'
      } else if (filterKey === 'selectedServices') {
        // Handle array fields
        (filters as Record<string, unknown>)[filterKey] = value ? value.split(',') : []
      } else if (filterKey === 'minRating') {
        // Handle number fields
        (filters as Record<string, unknown>)[filterKey] = value ? parseFloat(value) : undefined
      } else {
        (filters as Record<string, unknown>)[filterKey] = value
      }
    }
  })
  
  return filters
} 