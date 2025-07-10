"use client"

import { useEffect, useState, Suspense } from "react"
import Image from "next/image"
import { Heart, Star, Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSearch } from "@/lib/contexts/SearchContext"
import { useSearchParams, useRouter } from "next/navigation"
import { URLParamsToFilters } from "@/lib/contexts/SearchContext"
import { Header } from "@/components/layout/header"
import { BaseMap } from "@/components/maps"

function SearchResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { searchFilters, setSearchFilters, isLoading, setIsLoading } = useSearch()
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  // Load filters from URL on component mount
  useEffect(() => {
    const filtersFromURL = URLParamsToFilters(searchParams)
    if (Object.keys(filtersFromURL).length > 0) {
      setSearchFilters(filtersFromURL)
    }
    setIsLoading(false)
  }, [searchParams, setSearchFilters, setIsLoading])

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
      location: { lat: -1.9441, lng: 30.0619, name: "Kigali City Center" }
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
      location: { lat: -1.9506, lng: 30.0588, name: "Nyarugenge District" }
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
      location: { lat: -1.9355, lng: 30.0675, name: "Gasabo District" }
    }
  ]

  const [selectedTechnicianId, setSelectedTechnicianId] = useState<number | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: -1.9441, lng: 30.0619 })

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    )
  }

  const handleBookNow = (technicianId: number) => {
    router.push(`/dashboard/book/${technicianId}`)
  }

  const handleTechnicianClick = (technician: typeof technicians[0]) => {
    setSelectedTechnicianId(technician.id)
    setMapCenter(technician.location)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header userType={null} variant="default" />

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
            {technicians.length} available technicians in {searchFilters.location || 'Kigali'}
          </h1>
          <p className="text-gray-600 mt-1">
            Book professional tech support services near you
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
                        Technicians
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                        {technicians.length}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white p-3 rounded-lg shadow-lg border">
                      <p className="text-xs text-gray-600 mb-2">Click locations to view details</p>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-xs text-gray-700 font-medium">Available Now</span>
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

          {/* Technicians List - Right Side */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {technicians.map((technician) => (
                <Card 
                  key={technician.id} 
                  className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
                    selectedTechnicianId === technician.id 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => handleTechnicianClick(technician)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                    {/* Image */}
                    <div className="relative">
                      <Image
                        src={technician.image}
                        alt={technician.title}
                        className="w-full h-48 md:h-full object-cover rounded-lg"
                        width={300}
                        height={200}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(technician.id)
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favoriteIds.includes(technician.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">{technician.name}</p>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{technician.title}</h3>
                        
                        {/* Services */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {technician.services.map((service, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {technician.features.map((feature, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm font-medium text-gray-900">
                              {technician.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({technician.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Price and Book Button */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {technician.price.toLocaleString()} RWF
                          </div>
                          <div className="text-sm text-gray-500">/hour</div>
                        </div>
                        <Button 
                          className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-medium"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBookNow(technician.id)
                          }}
                        >
                          Book Now
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