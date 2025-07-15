"use client"

import { useState } from "react"
import { 
  Search,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkPlus,
  Phone,
  MessageSquare,
  Calendar,
  SlidersHorizontal,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/lib/contexts/AuthContext"

interface Technician {
  id: string
  name: string
  avatar?: string
  rating: number
  reviewCount: number
  specialties: string[]
  location: string
  hourlyRate: number
  available: boolean
  responseTime: string
  completedJobs: number
  description: string
  verified: boolean
  distance?: number
  saved?: boolean
}

interface SavedSearch {
  id: string
  name: string
  query: string
  filters: SearchFilters
  resultCount: number
  lastUpdated: string
}

interface SearchFilters {
  location: string
  specialty: string
  priceRange: [number, number]
  rating: number
  availability: string
  distance: number
}

export default function SearchPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    specialty: "",
    priceRange: [0, 100000],
    rating: 0,
    availability: "any",
    distance: 50
  })

  // Mock technicians data
  const [technicians] = useState<Technician[]>([
    {
      id: "1",
      name: "Marie Uwimana",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.8,
      reviewCount: 42,
      specialties: ["Computer Repair", "Network Setup", "Data Recovery"],
      location: "Kigali City",
      hourlyRate: 15000,
      available: true,
      responseTime: "< 1 hour",
      completedJobs: 127,
      description: "Experienced computer technician specializing in hardware repair and network configuration. 5+ years of experience.",
      verified: true,
      distance: 2.5,
      saved: false
    },
    {
      id: "2",
      name: "Jean Baptiste",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.6,
      reviewCount: 38,
      specialties: ["Mobile Repair", "Software Installation", "Virus Removal"],
      location: "Nyamirambo",
      hourlyRate: 12000,
      available: true,
      responseTime: "< 2 hours",
      completedJobs: 89,
      description: "Mobile device specialist with expertise in screen repairs, software troubleshooting, and device optimization.",
      verified: true,
      distance: 5.2,
      saved: true
    },
    {
      id: "3",
      name: "David Nkusi",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.9,
      reviewCount: 67,
      specialties: ["Hardware Upgrade", "Gaming Setup", "Custom Builds"],
      location: "Remera",
      hourlyRate: 20000,
      available: false,
      responseTime: "< 3 hours",
      completedJobs: 156,
      description: "Expert in custom computer builds and gaming setups. Certified in multiple hardware platforms.",
      verified: true,
      distance: 8.1
    }
  ])

  // Mock saved searches
  const [savedSearches] = useState<SavedSearch[]>([
    {
      id: "1",
      name: "Computer Repair Near Me",
      query: "computer repair",
      filters: {
        location: "Kigali",
        specialty: "Computer Repair",
        priceRange: [0, 20000],
        rating: 4,
        availability: "available",
        distance: 10
      },
      resultCount: 12,
      lastUpdated: "2024-01-15"
    },
    {
      id: "2",
      name: "Mobile Repair Specialists",
      query: "mobile phone repair",
      filters: {
        location: "",
        specialty: "Mobile Repair",
        priceRange: [0, 15000],
        rating: 4.5,
        availability: "any",
        distance: 25
      },
      resultCount: 8,
      lastUpdated: "2024-01-10"
    }
  ])

  const specialties = [
    "Computer Repair",
    "Mobile Repair", 
    "Network Setup",
    "Data Recovery",
    "Software Installation",
    "Hardware Upgrade",
    "Gaming Setup",
    "Virus Removal"
  ]

  const locations = [
    "Kigali City",
    "Nyamirambo",
    "Remera",
    "Kimisagara",
    "Kacyiru",
    "Gikondo",
    "Nyarutarama"
  ]

  const filteredTechnicians = technicians.filter(tech => {
    const matchesQuery = !searchQuery || 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLocation = !filters.location || tech.location.includes(filters.location)
    const matchesSpecialty = !filters.specialty || tech.specialties.includes(filters.specialty)
    const matchesPrice = tech.hourlyRate >= filters.priceRange[0] && tech.hourlyRate <= filters.priceRange[1]
    const matchesRating = tech.rating >= filters.rating
    const matchesAvailability = filters.availability === "any" || 
      (filters.availability === "available" && tech.available) ||
      (filters.availability === "busy" && !tech.available)
    const matchesDistance = !tech.distance || tech.distance <= filters.distance

    return matchesQuery && matchesLocation && matchesSpecialty && matchesPrice && 
           matchesRating && matchesAvailability && matchesDistance
  })

  const resetFilters = () => {
    setFilters({
      location: "",
      specialty: "",
      priceRange: [0, 100000],
      rating: 0,
      availability: "any",
      distance: 50
    })
  }

  const saveSearch = () => {
    // TODO: Implement save search functionality
    console.log("Saving search:", { searchQuery, filters })
  }

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setSearchQuery(savedSearch.query)
    setFilters(savedSearch.filters)
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Please sign in to search for technicians</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Technicians</h1>
          <p className="text-gray-600">Search for qualified technicians in your area</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for technicians, services, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </Button>

            <Button className="bg-red-500 hover:bg-red-600">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Any Location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <select
                    value={filters.specialty}
                    onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Any Specialty</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="any">Any</option>
                    <option value="available">Available Now</option>
                    <option value="busy">Busy</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (RWF)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        priceRange: [filters.priceRange[0], parseInt(e.target.value) || 100000]
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters({ ...filters, rating: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>

                {/* Distance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance (km)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={filters.distance}
                    onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{filters.distance} km</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={resetFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>

                <Button onClick={saveSearch} className="bg-red-500 hover:bg-red-600">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save Search
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Saved Searches */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Saved Searches</CardTitle>
            </CardHeader>
            <CardContent>
              {savedSearches.length === 0 ? (
                <p className="text-sm text-gray-500">No saved searches yet</p>
              ) : (
                <div className="space-y-3">
                  {savedSearches.map(saved => (
                    <div
                      key={saved.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => loadSavedSearch(saved)}
                    >
                      <h4 className="font-medium text-sm text-gray-900">{saved.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{saved.resultCount} results</p>
                      <p className="text-xs text-gray-400">{saved.lastUpdated}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredTechnicians.length} technicians found
            </h2>
            
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>Sort by Rating</option>
              <option>Sort by Price (Low to High)</option>
              <option>Sort by Price (High to Low)</option>
              <option>Sort by Distance</option>
              <option>Sort by Availability</option>
            </select>
          </div>

          {filteredTechnicians.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No technicians found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTechnicians.map((tech) => (
                <Card key={tech.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={tech.avatar} />
                        <AvatarFallback>
                          {tech.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
                              {tech.verified && (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  Verified
                                </Badge>
                              )}
                              {tech.available ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  Busy
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span>{tech.rating}</span>
                                <span>({tech.reviewCount} reviews)</span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{tech.location}</span>
                                {tech.distance && (
                                  <span>• {tech.distance} km away</span>
                                )}
                              </div>
                            </div>

                            <p className="text-gray-700 mb-3">{tech.description}</p>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {tech.specialties.map((specialty, index) => (
                                <Badge key={index} variant="outline" className="border-red-200 text-red-600 bg-red-50">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="w-4 h-4" />
                                  <span>RWF {tech.hourlyRate.toLocaleString()}/hour</span>
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>Responds {tech.responseTime}</span>
                                </div>
                                
                                <span>{tech.completedJobs} jobs completed</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col space-y-2 ml-4">
                            <Button className="bg-red-500 hover:bg-red-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              Book Now
                            </Button>
                            
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Message
                              </Button>
                              
                              <Button variant="outline" size="sm">
                                <Phone className="w-4 h-4 mr-1" />
                                Call
                              </Button>
                              
                              <Button variant="outline" size="sm">
                                {tech.saved ? (
                                  <Bookmark className="w-4 h-4 text-red-500 fill-current" />
                                ) : (
                                  <Bookmark className="w-4 h-4" />
                                )}
                              </Button>
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
      </div>
    </DashboardLayout>
  )
} 