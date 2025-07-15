"use client"

import { useEffect, useState, Suspense, useMemo } from "react"
import Image from "next/image"
import { Heart, Star, Search, MapPin, Clock, Phone, Globe, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSearch } from "@/lib/contexts/SearchContext"
import { useSearchParams, useRouter } from "next/navigation"
import { URLParamsToFilters } from "@/lib/contexts/SearchContext"
import { Header } from "@/components/layout/header"
import { BaseMap } from "@/components/maps"
import { useComputerShops } from "@/lib/hooks/useComputerShops"

function SearchResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { searchFilters, setSearchFilters, isLoading: searchLoading, setIsLoading } = useSearch()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  
  // Fetch real computer shops from Google Places
  // Use useMemo to stabilize the location object and prevent infinite re-renders
  const kigaliLocation = useMemo(() => ({ lat: -1.9441, lng: 30.0619 }), []);
  
  const { shops, loading: shopsLoading, error } = useComputerShops({
    location: kigaliLocation, // Stable location object
    radius: 10000 // 10km radius
  })

  // Load filters from URL on component mount
  useEffect(() => {
    const filtersFromURL = URLParamsToFilters(searchParams)
    if (Object.keys(filtersFromURL).length > 0) {
      setSearchFilters(filtersFromURL)
    }
    setIsLoading(false)
  }, [searchParams, setSearchFilters, setIsLoading])

  const [selectedShopId, setSelectedShopId] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: -1.9441, lng: 30.0619 })

  const isLoading = searchLoading || shopsLoading

  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    )
  }

  const handleBookNow = (shopId: string) => {
    router.push(`/dashboard/book/${shopId}`)
  }

  const handleShopClick = (shop: typeof shops[0]) => {
    setSelectedShopId(shop.id)
    setMapCenter(shop.location)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding computer shops near you...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600">Unable to load computer shops. Using demo data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header variant="default" />

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center px-4 py-3 rounded-lg bg-gray-50">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">{searchFilters.location || 'Kigali'}</span>
                </div>
              </div>
              <div className="flex items-center px-4 py-3 rounded-lg bg-gray-50">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">{searchFilters.serviceType || 'Computer'}</span>
                </div>
              </div>
              <div className="flex items-center px-4 py-3 rounded-lg bg-gray-50">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">{searchFilters.urgency || 'Today'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">{searchFilters.details || '2 devices'}</span>
                <Button size="icon" className="bg-red-500 hover:bg-red-600 rounded-lg w-8 h-8">
                  <Search className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {shops.length} computer shops in {searchFilters.location || 'Kigali'}
          </h1>
          <p className="text-gray-600 mt-1">
            Book professional tech support services from real local businesses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Map Section - Left Side */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <Card className="p-0 overflow-hidden">
                <div className="h-[600px] w-full relative">
                  <BaseMap
                    center={mapCenter}
                    zoom={13}
                    className="w-full h-full"
                    onClick={(event) => {
                      // Handle map clicks to show technician details
                      console.log('Map clicked at:', event)
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg border">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-900">
                        Computer Shops
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                        {shops.length}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white p-3 rounded-lg shadow-lg border">
                      <p className="text-xs text-gray-600 mb-2">Click locations to view details</p>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-xs text-gray-700 font-medium">Open Now</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-gray-700 font-medium">Selected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Computer Shops List - Right Side */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {shops.map((shop) => (
                <Card 
                  key={shop.id} 
                  className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
                    selectedShopId === shop.id 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => handleShopClick(shop)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                    {/* Image */}
                    <div className="relative">
                      <Image
                        src={shop.photo}
                        alt={shop.name}
                        className="w-full h-48 md:h-full object-cover rounded-lg"
                        width={300}
                        height={200}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(shop.id)
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favoriteIds.includes(shop.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </button>
                      {/* Open/Closed Status */}
                      <div className="absolute top-3 left-3">
                        <Badge variant={shop.isOpen ? "default" : "secondary"} className={`text-xs ${
                          shop.isOpen 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                          {shop.isOpen ? 'Open Now' : 'Closed'}
                        </Badge>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{shop.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {shop.address}
                        </p>
                        
                        {/* Services */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {shop.services.slice(0, 4).map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {shop.services.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{shop.services.length - 4} more
                            </Badge>
                          )}
                        </div>

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {shop.specialties.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        {/* Rating and Stats */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 text-sm font-medium text-gray-900">
                                {shop.rating.toFixed(1)}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">
                                ({shop.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {shop.phone && (
                              <Phone className="w-4 h-4 text-gray-400" />
                            )}
                            {shop.website && (
                              <Globe className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Experience and Response Time */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {shop.experience} years experience
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {shop.responseTime}
                          </div>
                        </div>
                      </div>

                      {/* Price Level and Book Button */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500">
                            Price Level: {'$'.repeat(shop.priceLevel)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {shop.completedJobs} jobs completed
                          </div>
                        </div>
                        <Button 
                          className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-medium"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBookNow(shop.id)
                          }}
                        >
                          Book Service
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
} 