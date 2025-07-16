"use client"

import { Button } from "@/components/ui/button"
import { useSearch } from "@/lib/contexts/SearchContext"
import { Star } from "lucide-react"

export function RatingFilter() {
  const { searchFilters, setSearchFilters } = useSearch()

  const ratingOptions = [
    { value: 4.5, label: '4.5+', stars: 5 },
    { value: 4.0, label: '4.0+', stars: 4 },
    { value: 3.5, label: '3.5+', stars: 4 },
    { value: 3.0, label: '3.0+', stars: 3 }
  ]

  const handleRatingSelect = (value: number) => {
    if (searchFilters.minRating === value) {
      // Deselect if already selected
      setSearchFilters({ minRating: undefined })
    } else {
      setSearchFilters({ minRating: value })
    }
  }

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < count
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-2">
      {ratingOptions.map((option) => (
        <Button
          key={option.value}
          variant={searchFilters.minRating === option.value ? "default" : "outline"}
          size="sm"
          className={`w-full justify-start text-left h-auto py-2 px-3 ${
            searchFilters.minRating === option.value 
              ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
              : 'hover:bg-gray-50 border-gray-200'
          }`}
          onClick={() => handleRatingSelect(option.value)}
          aria-pressed={searchFilters.minRating === option.value}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{option.label}</span>
              <div className="flex">
                {renderStars(option.stars)}
              </div>
            </div>
          </div>
        </Button>
      ))}
      <div className="text-xs text-gray-500 mt-1">
        Minimum rating required
      </div>
    </div>
  )
}