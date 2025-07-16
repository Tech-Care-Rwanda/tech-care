"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Filter, Star, DollarSign, Clock, MapPin, Settings } from "lucide-react"
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
    }
  }

  const hasActiveFilters = activeFilters.length > 0

  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {activeFilters.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear all
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-700"
            >
              {isExpanded ? 'Hide' : 'Show'} filters
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.key}
                  variant="secondary"
                  className="flex items-center space-x-1 pr-1 pl-3 py-1"
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
          </div>
        )}

        {/* Filter Options */}
        {isExpanded && (
          <div className="space-y-4">
            <Separator />
            
            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Price Filter */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Price Level</label>
                </div>
                <PriceFilter />
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Rating</label>
                </div>
                <RatingFilter />
              </div>

              {/* Availability Filter */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Availability</label>
                </div>
                <AvailabilityFilter />
              </div>

              {/* Service Filter */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Services</label>
                </div>
                <ServiceFilter />
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Distance</label>
                </div>
                <LocationFilter />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}