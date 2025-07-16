"use client"

import { Button } from "@/components/ui/button"
import { useSearch } from "@/lib/contexts/SearchContext"
import { Clock, CheckCircle2 } from "lucide-react"

export function AvailabilityFilter() {
  const { searchFilters, setSearchFilters } = useSearch()

  const availabilityOptions = [
    { 
      key: 'availableNow',
      label: 'Open Now',
      description: 'Currently open',
      icon: CheckCircle2
    },
    { 
      key: 'sameDay',
      label: 'Same Day',
      description: 'Available today',
      icon: Clock
    }
  ]

  const handleAvailabilityToggle = (key: string) => {
    const currentValue = searchFilters[key as keyof typeof searchFilters] as boolean
    setSearchFilters({ [key]: !currentValue })
  }

  return (
    <div className="space-y-2">
      {availabilityOptions.map((option) => {
        const Icon = option.icon
        const isSelected = searchFilters[option.key as keyof typeof searchFilters] as boolean
        
        return (
          <Button
            key={option.key}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={`w-full justify-start text-left h-auto py-2 px-3 ${
              isSelected 
                ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                : 'hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => handleAvailabilityToggle(option.key)}
            aria-pressed={isSelected}
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium text-sm flex items-center space-x-1">
                  <Icon className="w-3 h-3" />
                  <span>{option.label}</span>
                </div>
                <div className="text-xs opacity-80">{option.description}</div>
              </div>
            </div>
          </Button>
        )
      })}
      <div className="text-xs text-gray-500 mt-1">
        Filter by availability
      </div>
    </div>
  )
}