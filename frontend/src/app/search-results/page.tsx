"use client"

import { useEffect, useState, Suspense } from "react"
import Image from "next/image"
import { Heart, Star, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSearch } from "@/lib/contexts/SearchContext"
import { useSearchParams, useRouter } from "next/navigation"
import { filtersToURLParams, URLParamsToFilters } from "@/lib/contexts/SearchContext"
import { Header } from "@/components/layout/header"

function SearchResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { searchFilters, setSearchFilters, clearFilters, isLoading, setIsLoading } = useSearch()

  // Load filters from URL on component mount
  useEffect(() => {
    const filtersFromURL = URLParamsToFilters(searchParams)
    if (Object.keys(filtersFromURL).length > 0) {
      setSearchFilters(filtersFromURL)
    }
    // Clear loading state when page loads
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]) // Remove setter functions from dependencies to prevent infinite loops

  // Update URL when filters change
  useEffect(() => {
    const params = filtersToURLParams(searchFilters)
    const newURL = params ? `/search-results?${params}` : '/search-results'
    window.history.replaceState({}, '', newURL)
  }, [searchFilters])

  const technicians = [
    {
      id: 1,
      name: "Computer specialist in Kigali",
      title: "Complete Tech Setup",
      image: "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg",
      services: ["2-4 devices", "Home Service", "Computer Setup", "Network Config"],
      features: ["Same Day", "Certified", "Free Consultation"],
      rating: 5.0,
      reviews: 318,
      price: 15000,
      liked: false
    },
    {
      id: 2,
      name: "Network specialist in Kigali", 
      title: "WiFi & Smart Home Expert",
      image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
      services: ["2-4 devices", "Home Service", "Network Setup", "Smart Devices"],
      features: ["Same Day", "Certified", "Free Consultation"],
      rating: 5.0,
      reviews: 318,
      price: 12000,
      liked: true
    },
    {
      id: 3,
      name: "Mobile & tablet specialist in Kigali",
      title: "Mobile Device Solutions", 
      image: "/images/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg",
      services: ["Mobile Repair", "Data Recovery", "Screen Replacement", "Software Fix"],
      features: ["Same Day", "Certified", "Warranty"],
      rating: 4.9,
      reviews: 256,
      price: 8000,
      liked: false
    }
  ]

  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: 'under-10k', label: 'Under 10,000 RWF' },
    { value: '10k-20k', label: '10,000 - 20,000 RWF' },
    { value: '20k-30k', label: '20,000 - 30,000 RWF' },
    { value: 'over-30k', label: 'Over 30,000 RWF' }
  ]

  const serviceTypeOptions = [
    { value: '', label: 'All Services' },
    { value: 'computer', label: 'Computer Support' },
    { value: 'mobile', label: 'Mobile Device' },
    { value: 'network', label: 'Network/WiFi' },
    { value: 'software', label: 'Software' },
    { value: 'hardware', label: 'Hardware Repair' }
  ]

  const filterCategories = [
    { key: "priceRange", label: "Price", type: "dropdown", options: priceRanges },
    { key: "serviceType", label: "Service Type", type: "dropdown", options: serviceTypeOptions },
    { key: "sameDay", label: "Same Day", type: "toggle" },
    { key: "remoteSupport", label: "Remote Support", type: "toggle" },
    { key: "computer", label: "Computer", type: "toggle" },
    { key: "smartphone", label: "Smartphone", type: "toggle" },
    { key: "network", label: "Network", type: "toggle" },
    { key: "software", label: "Software", type: "toggle" },
    { key: "homeVisit", label: "Home Visit", type: "toggle" },
    { key: "certified", label: "Certified", type: "toggle" },
    { key: "availableNow", label: "Available Now", type: "toggle" }
  ]

  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({})

  const toggleDropdown = (key: string) => {
    setDropdownStates((prev: Record<string, boolean>) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header userType={null} variant="default" />

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-full border border-gray-200 p-2 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="flex items-center px-4 py-2 rounded-full bg-gray-50">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">{searchFilters.location || 'Location'}</span>
                </div>
              </div>
              <div className="flex items-center px-4 py-2 rounded-full bg-gray-50">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">{searchFilters.urgency || 'When needed'}</span>
                </div>
              </div>
              <div className="flex items-center px-4 py-2 rounded-full bg-gray-50">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">{searchFilters.details || 'Details'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm text-gray-500">Filters</span>
                <Button size="icon" className="bg-red-500 hover:bg-red-600 rounded-full w-8 h-8">
                  <Search className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <Button variant="ghost" size="sm" className="text-gray-500" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
              
              <div className="space-y-4">
                {filterCategories.map((category) => (
                  <div key={category.key} className="relative">
                    <div className="flex items-center justify-between py-2 cursor-pointer">
                      <span className="text-sm text-gray-700">{category.label}</span>
                      {category.type === "toggle" && (
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                          checked={searchFilters[category.key as keyof typeof searchFilters] as boolean}
                          onChange={(e) => setSearchFilters({ [category.key]: e.target.checked })}
                        />
                      )}
                      {category.type === "dropdown" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => toggleDropdown(category.key)}
                        >
                          {dropdownStates[category.key] ? "▲" : "▼"}
                        </Button>
                      )}
                    </div>
                    
                    {/* Dropdown Options */}
                    {category.type === "dropdown" && dropdownStates[category.key] && category.options && (
                      <div className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                        {category.options.map((option: { value: string; label: string }) => (
                          <div
                            key={option.value}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                              searchFilters[category.key as keyof typeof searchFilters] === option.value
                                ? 'bg-red-50 text-red-600'
                                : 'text-gray-700'
                            }`}
                            onClick={() => {
                              setSearchFilters({ [category.key]: option.value })
                              setDropdownStates(prev => ({ ...prev, [category.key]: false }))
                            }}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {category.key !== "availableNow" && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technicians List */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <p className="text-gray-600">50+ technicians in {searchFilters.location || 'your area'}</p>
            </div>
            
            {isLoading ? (
              <div className="space-y-6">
                {/* Loading skeleton */}
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                          <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {technicians.map((technician) => (
                <Card key={technician.id} className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                          <Image
                            src={technician.image}
                            alt={technician.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{technician.name}</p>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{technician.title}</h3>
                            
                            <div className="flex flex-wrap gap-1 mb-2">
                              {technician.services.map((service, index) => (
                                <span key={index} className="text-xs text-gray-600">
                                  {service}{index < technician.services.length - 1 ? " • " : ""}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {technician.features.map((feature, index) => (
                                <span key={index} className="text-xs text-gray-600">
                                  {feature}{index < technician.features.length - 1 ? " • " : ""}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{technician.rating}</span>
                                <span className="text-sm text-gray-500">({technician.reviews} reviews)</span>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <Button 
                                className="bg-red-500 hover:bg-red-600 text-white w-full"
                                onClick={() => router.push(`/dashboard/book/${technician.id}`)}
                              >
                                Book Now
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="mb-2"
                            >
                              <Heart className={`w-5 h-5 ${technician.liked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                            </Button>
                            <div>
                              <div className="text-xl font-bold text-gray-900">{technician.price.toLocaleString()} RWF</div>
                              <div className="text-sm text-gray-500">/hour</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardContent className="p-0">
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    {/* Enhanced Map Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-gray-100">
                      {/* Kigali Roads/Streets simulation */}
                      <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-300 opacity-60 transform rotate-12"></div>
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 opacity-60 transform -rotate-6"></div>
                      <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-300 opacity-60 transform rotate-3"></div>
                      <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-gray-300 opacity-60 transform rotate-12"></div>
                      <div className="absolute top-0 bottom-0 right-1/4 w-1 bg-gray-300 opacity-60 transform -rotate-12"></div>
                      <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-gray-300 opacity-60 transform rotate-6"></div>
                      
                      {/* Kigali Hills */}
                      <div className="absolute bottom-0 left-0 w-32 h-16 bg-green-200 rounded-t-full opacity-70"></div>
                      <div className="absolute bottom-0 right-0 w-24 h-12 bg-green-200 rounded-t-full opacity-70"></div>
                      <div className="absolute bottom-0 left-1/3 w-20 h-10 bg-green-200 rounded-t-full opacity-70"></div>
                    </div>
                    
                    {/* Center location pin */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg relative animate-pulse">
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
                      </div>
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-semibold shadow-lg whitespace-nowrap">
                        {searchFilters.location || 'Kigali'}
                      </div>
                    </div>
                    
                    {/* Interactive Technician price markers */}
                    <div className="absolute top-1/4 left-1/4 group cursor-pointer">
                      <div className="bg-white rounded-full px-3 py-1 text-sm font-semibold shadow-lg border-2 border-red-500 hover:bg-red-50 transition-all duration-200 hover:scale-110">
                        8K RWF
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        John Mugisha - Computer Setup
                      </div>
                    </div>
                    
                    <div className="absolute top-1/3 right-1/4 group cursor-pointer">
                      <div className="bg-white rounded-full px-3 py-1 text-sm font-semibold shadow-lg border-2 border-red-500 hover:bg-red-50 transition-all duration-200 hover:scale-110">
                        10K RWF
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Marie Uwimana - Network Expert
                      </div>
                    </div>
                    
                    <div className="absolute bottom-1/3 left-1/5 group cursor-pointer">
                      <div className="bg-white rounded-full px-3 py-1 text-sm font-semibold shadow-lg border-2 border-red-500 hover:bg-red-50 transition-all duration-200 hover:scale-110">
                        12K RWF
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Eric Nkurunziza - Mobile Expert
                      </div>
                    </div>
                    
                    <div className="absolute bottom-1/4 right-1/3 group cursor-pointer">
                      <div className="bg-white rounded-full px-3 py-1 text-sm font-semibold shadow-lg border-2 border-red-500 hover:bg-red-50 transition-all duration-200 hover:scale-110">
                        15K RWF
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Grace Mukandayisenga - Software
                      </div>
                    </div>
                    
                    {/* Map controls */}
                    <div className="absolute bottom-16 right-4 flex flex-col space-y-2">
                      <button className="w-8 h-8 bg-white rounded border shadow hover:shadow-md transition-all duration-200 hover:scale-110 flex items-center justify-center text-lg font-bold text-gray-700 hover:text-red-500">
                        +
                      </button>
                      <button className="w-8 h-8 bg-white rounded border shadow hover:shadow-md transition-all duration-200 hover:scale-110 flex items-center justify-center text-lg font-bold text-gray-700 hover:text-red-500">
                        −
                      </button>
                    </div>
                    
                    {/* Legend */}
                    <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                      <div className="text-xs font-semibold text-gray-700 mb-2">Technicians</div>
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Available Now</span>
                      </div>
                      <div className="text-xs text-gray-500">Hover markers for details</div>
                    </div>
                    
                    {/* Search as I move checkbox */}
                    <div className="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                      <label className="flex items-center text-xs cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded border-gray-300 text-red-500 focus:ring-red-500" 
                          defaultChecked 
                        />
                        <span className="text-gray-700">Search as I move the map</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
} 