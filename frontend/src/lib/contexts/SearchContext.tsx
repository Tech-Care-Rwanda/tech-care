"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface SearchFilters {
  location: string
  serviceType: string
  urgency: string
  details: string
  priceRange?: string
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
}

const defaultFilters: SearchFilters = {
  location: '',
  serviceType: '',
  urgency: '',
  details: '',
  priceRange: '',
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

  return (
    <SearchContext.Provider value={{
      searchFilters,
      setSearchFilters,
      clearFilters,
      searchResults,
      setSearchResults,
      isLoading,
      setIsLoading
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
      } else {
        (filters as Record<string, unknown>)[filterKey] = value
      }
    }
  })
  
  return filters
} 