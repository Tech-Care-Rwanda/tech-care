"use client"

import { Button } from "@/components/ui/button"
import { useSearch } from "@/lib/contexts/SearchContext"
import { MapPin } from "lucide-react"

export function LocationFilter() {
  const { searchFilters, setSearchFilters } = useSearch()

  const distanceOptions = [
    { value: '5', label: '5 km', description: 'Nearby' },
    { value: '10', label: '10 km', description: 'Close' },
    { value: '25', label: '25 km', description: 'Moderate' },
    { value: '50', label: '50 km', description: 'Wider area' }
  ]

  const handleDistanceSelect = (value: string) => {
    if (searchFilters.maxDistance === value) {
      // Deselect if already selected
      setSearchFilters({ maxDistance: '' })
    } else {
      setSearchFilters({ maxDistance: value })
    }
  }

  return (
    <div className="space-y-2">
      {distanceOptions.map((option) => (
        <Button
          key={option.value}
          variant={searchFilters.maxDistance === option.value ? "default" : "outline"}
          size="sm"
          className={`w-full justify-start text-left h-auto py-2 px-3 ${
            searchFilters.maxDistance === option.value 
              ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
              : 'hover:bg-gray-50 border-gray-200'
          }`}
          onClick={() => handleDistanceSelect(option.value)}
          aria-pressed={searchFilters.maxDistance === option.value}
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="font-medium text-sm flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{option.label}</span>
              </div>
              <div className="text-xs opacity-80">{option.description}</div>
            </div>
          </div>
        </Button>
      ))}
      <div className="text-xs text-gray-500 mt-1">
        Maximum distance from location
      </div>
    </div>
  )
}