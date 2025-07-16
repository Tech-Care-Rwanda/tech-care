"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSearch } from "@/lib/contexts/SearchContext"
import { Monitor, Smartphone, Wifi, HardDrive, Home, Settings } from "lucide-react"

export function ServiceFilter() {
  const { searchFilters, setSearchFilters } = useSearch()

  const serviceOptions = [
    { 
      value: 'Computer Repair',
      label: 'Computer Repair',
      icon: Monitor,
      description: 'Hardware & software repair'
    },
    { 
      value: 'Phone Repair',
      label: 'Phone Repair',
      icon: Smartphone,
      description: 'Mobile device repair'
    },
    { 
      value: 'Network Setup',
      label: 'Network Setup',
      icon: Wifi,
      description: 'Wi-Fi & network configuration'
    },
    { 
      value: 'Data Recovery',
      label: 'Data Recovery',
      icon: HardDrive,
      description: 'Recover lost files'
    },
    { 
      value: 'Home Service',
      label: 'Home Service',
      icon: Home,
      description: 'On-site repairs'
    },
    { 
      value: 'General Tech Support',
      label: 'Tech Support',
      icon: Settings,
      description: 'General assistance'
    }
  ]

  const selectedServices = searchFilters.selectedServices || []

  const handleServiceToggle = (serviceValue: string) => {
    const isSelected = selectedServices.includes(serviceValue)
    let newServices: string[]
    
    if (isSelected) {
      newServices = selectedServices.filter(s => s !== serviceValue)
    } else {
      newServices = [...selectedServices, serviceValue]
    }
    
    setSearchFilters({ selectedServices: newServices })
  }

  const clearAllServices = () => {
    setSearchFilters({ selectedServices: [] })
  }

  return (
    <div className="space-y-3">
      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <div className="bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">
              {selectedServices.length} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllServices}
              className="text-xs h-auto p-1 text-red-600 hover:text-red-700"
            >
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedServices.slice(0, 2).map((service) => (
              <Badge key={service} variant="secondary" className="text-xs px-1 py-0">
                {service.split(' ')[0]}
              </Badge>
            ))}
            {selectedServices.length > 2 && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                +{selectedServices.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Service Options */}
      <div className="max-h-48 overflow-y-auto space-y-1">
        {serviceOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedServices.includes(option.value)
          
          return (
            <Button
              key={option.value}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`w-full justify-start text-left h-auto py-2 px-2 text-xs ${
                isSelected 
                  ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
              onClick={() => handleServiceToggle(option.value)}
              aria-pressed={isSelected}
            >
              <div className="flex items-start space-x-2 w-full">
                <Icon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className={`text-xs ${isSelected ? 'opacity-80' : 'text-gray-500'}`}>
                    {option.description}
                  </div>
                </div>
              </div>
            </Button>
          )
        })}
      </div>
      
      <div className="text-xs text-gray-500">
        Select service types needed
      </div>
    </div>
  )
}