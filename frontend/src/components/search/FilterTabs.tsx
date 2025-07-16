"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Filter, Star, DollarSign, Clock, MapPin, Settings, SlidersHorizontal } from "lucide-react"
import { useSearch } from "@/lib/contexts/SearchContext"
import { PriceFilter } from "./filters/PriceFilter"
import { RatingFilter } from "./filters/RatingFilter"
import { AvailabilityFilter } from "./filters/AvailabilityFilter"
import { ServiceFilter } from "./filters/ServiceFilter"
import { LocationFilter } from "./filters/LocationFilter"

interface ActiveFilter {
  key: string
  label: string
  value: string
}

export function FilterTabs() {
  const { searchFilters, setSearchFilters, clearFilters } = useSearch()
  const [isExpanded, setIsExpanded] = useState(false)

  // Get active filters for display
  const getActiveFilters = (): ActiveFilter[] => {
    const active: ActiveFilter[] = []
    
    if (searchFilters.priceRange) {
      active.push({
        key: 'priceRange',
        label: 'Price',
        value: `${'$'.repeat(parseInt(searchFilters.priceRange))} and below`
      })
    }
    
    if (searchFilters.minRating) {
      active.push({
        key: 'minRating',
        label: 'Rating',
        value: `${searchFilters.minRating}+ stars`
      })
    }
    
    if (searchFilters.availableNow) {
      active.push({
        key: 'availableNow',
        label: 'Availability',
        value: 'Open now'
      })
    }
    
    if (searchFilters.selectedServices && searchFilters.selectedServices.length > 0) {
      active.push({
        key: 'selectedServices',
        label: 'Services',
        value: `${searchFilters.selectedServices.length} selected`
      })
    }

    if (searchFilters.maxDistance) {
      active.push({
        key: 'maxDistance',
        label: 'Distance',
        value: `${searchFilters.maxDistance} km`
      })
    }
    
    return active
  }

  const activeFilters = getActiveFilters()

  const removeFilter = (filterKey: string) => {
    switch (filterKey) {
      case 'priceRange':
        setSearchFilters({ priceRange: '' })
        break
      case 'minRating':
        setSearchFilters({ minRating: undefined })
        break
      case 'availableNow':
        setSearchFilters({ availableNow: false })
        break
      case 'selectedServices':
        setSearchFilters({ selectedServices: [] })
        break
      case 'maxDistance':
        setSearchFilters({ maxDistance: '' })
        break
    }
  }

  const hasActiveFilters = activeFilters.length > 0

  // Quick filter options for the horizontal pills
  const getQuickFilterText = (filterType: 'price' | 'rating' | 'availability') => {
    switch (filterType) {
      case 'price':
        return searchFilters.priceRange 
          ? `${'$'.repeat(parseInt(searchFilters.priceRange))} and below`
          : 'Price'
      case 'rating':
        return searchFilters.minRating 
          ? `${searchFilters.minRating}+ stars`
          : 'Rating'
      case 'availability':
        return searchFilters.availableNow 
          ? 'Open now'
          : 'Open now'
    }
  }

  const handleQuickFilterToggle = (filterType: 'price' | 'rating' | 'availability') => {
    switch (filterType) {
      case 'price':
        if (searchFilters.priceRange) {
          setSearchFilters({ priceRange: '' })
        } else {
          setSearchFilters({ priceRange: '2' }) // Default to moderate
        }
        break
      case 'rating':
        if (searchFilters.minRating) {
          setSearchFilters({ minRating: undefined })
        } else {
          setSearchFilters({ minRating: 4.0 }) // Default to 4+ stars
        }
        break
      case 'availability':
        setSearchFilters({ availableNow: !searchFilters.availableNow })
        break
    }
  }

  return (
    <div className="space-y-4">
      {/* Airbnb-style horizontal filter pills */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Essential filters as pills */}
        <Button
          variant={searchFilters.priceRange ? "default" : "outline"}
          size="sm"
          onClick={() => handleQuickFilterToggle('price')}
          className={`h-12 px-6 rounded-full border-2 transition-all ${
            searchFilters.priceRange 
              ? 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800' 
              : 'border-gray-300 hover:border-gray-900 bg-white text-gray-700'
          }`}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          {getQuickFilterText('price')}
        </Button>

        <Button
          variant={searchFilters.minRating ? "default" : "outline"}
          size="sm"
          onClick={() => handleQuickFilterToggle('rating')}
          className={`h-12 px-6 rounded-full border-2 transition-all ${
            searchFilters.minRating 
              ? 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800' 
              : 'border-gray-300 hover:border-gray-900 bg-white text-gray-700'
          }`}
        >
          <Star className="w-4 h-4 mr-2" />
          {getQuickFilterText('rating')}
        </Button>

        <Button
          variant={searchFilters.availableNow ? "default" : "outline"}
          size="sm"
          onClick={() => handleQuickFilterToggle('availability')}
          className={`h-12 px-6 rounded-full border-2 transition-all ${
            searchFilters.availableNow 
              ? 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800' 
              : 'border-gray-300 hover:border-gray-900 bg-white text-gray-700'
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          {getQuickFilterText('availability')}
        </Button>

        {/* More filters button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`h-12 px-6 rounded-full border-2 transition-all border-gray-300 hover:border-gray-900 bg-white text-gray-700 ${
            isExpanded ? 'border-gray-900' : ''
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700 text-xs">
              {activeFilters.length}
            </Badge>
          )}
        </Button>

        {/* Clear all filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-12 px-4 text-gray-600 hover:text-red-600 underline"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="flex items-center space-x-1 pr-1 pl-3 py-1 bg-gray-100 text-gray-700 border border-gray-200"
            >
              <span className="text-xs">
                <span className="font-medium">{filter.label}:</span> {filter.value}
              </span>
              <button
                onClick={() => removeFilter(filter.key)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Expanded Filters Panel */}
      {isExpanded && (
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Price Filter */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-900">Price Level</label>
                </div>
                <PriceFilter />
              </div>

              {/* Rating Filter */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-900">Rating</label>
                </div>
                <RatingFilter />
              </div>

              {/* Availability Filter */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-900">Availability</label>
                </div>
                <AvailabilityFilter />
              </div>

              {/* Service Filter */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-900">Services</label>
                </div>
                <ServiceFilter />
              </div>

              {/* Location Filter */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-900">Distance</label>
                </div>
                <LocationFilter />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}