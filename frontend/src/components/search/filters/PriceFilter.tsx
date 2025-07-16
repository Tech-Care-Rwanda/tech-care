"use client"

import { Button } from "@/components/ui/button"
import { useSearch } from "@/lib/contexts/SearchContext"
import { DollarSign } from "lucide-react"

export function PriceFilter() {
  const { searchFilters, setSearchFilters } = useSearch()

  const priceOptions = [
    { value: '1', label: '$', description: 'Budget' },
    { value: '2', label: '$$', description: 'Moderate' },
    { value: '3', label: '$$$', description: 'Expensive' },
    { value: '4', label: '$$$$', description: 'Very Expensive' }
  ]

  const handlePriceSelect = (value: string) => {
    if (searchFilters.priceRange === value) {
      // Deselect if already selected
      setSearchFilters({ priceRange: '' })
    } else {
      setSearchFilters({ priceRange: value })
    }
  }

  return (
    <div className="space-y-2">
      {priceOptions.map((option) => (
        <Button
          key={option.value}
          variant={searchFilters.priceRange === option.value ? "default" : "outline"}
          size="sm"
          className={`w-full justify-start text-left h-auto py-2 px-3 ${
            searchFilters.priceRange === option.value 
              ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
              : 'hover:bg-gray-50 border-gray-200'
          }`}
          onClick={() => handlePriceSelect(option.value)}
          aria-pressed={searchFilters.priceRange === option.value}
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs opacity-80">{option.description}</div>
            </div>
            <DollarSign className="w-3 h-3 opacity-60" />
          </div>
        </Button>
      ))}
      <div className="text-xs text-gray-500 mt-1">
        Select maximum price level
      </div>
    </div>
  )
}