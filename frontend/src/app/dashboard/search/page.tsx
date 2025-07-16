"use client"

import { useState, useEffect } from "react"
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
import { useSearchTechnicians, useSavedTechnicians } from "@/lib/hooks/useTechnicians"
import { Technician, SearchFilters } from "@/lib/services/technicianService"

interface SavedSearch {
  id: string
  name: string
  query: string
  filters: SearchFilters
  resultCount: number
  lastUpdated: string
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

  // Use real technician data
  const { technicians, loading, error, searchTechnicians } = useSearchTechnicians(filters)
  const { savedIds, saveTechnician, unsaveTechnician, isSaved } = useSavedTechnicians()

  // Update technicians with saved status
  const techniciansWithSavedStatus = technicians.map(tech => ({
    ...tech,
    saved: isSaved(tech.id)
  }))

  // Mock saved searches (TODO: Replace with real saved searches API)
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

  // Filter technicians based on search query
  const filteredTechnicians = techniciansWithSavedStatus.filter(technician => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase()
    return (
      technician.name.toLowerCase().includes(query) ||
      technician.specialties.some(specialty => specialty.toLowerCase().includes(query)) ||
      technician.location.toLowerCase().includes(query) ||
      technician.description.toLowerCase().includes(query)
    )
  })

  const handleSaveToggle = (technicianId: string) => {
    if (isSaved(technicianId)) {
      unsaveTechnician(technicianId)
    } else {
      saveTechnician(technicianId)
    }
  }

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  const clearFilters = () => {
    setFilters({
      location: "",
      specialty: "",
      priceRange: [0, 100000],
      rating: 0,
      availability: "any",
      distance: 50
    })
  }

  const applySearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters)
    searchTechnicians(searchFilters)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Technicians</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search for qualified technicians in your area
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Any Location</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Specialty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                    <select
                      value={filters.specialty}
                      onChange={(e) => handleFilterChange('specialty', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Any Specialty</option>
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                    >
                      <option value={0}>Any Rating</option>
                      <option value={4}>4+ Stars</option>
                      <option value={4.5}>4.5+ Stars</option>
                      <option value={4.8}>4.8+ Stars</option>
                    </select>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <select
                      value={filters.availability}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="any">Any Time</option>
                      <option value="available">Available Now</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Saved Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedSearches.map((search) => (
                  <div key={search.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => applySearch(search.filters)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{search.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{search.resultCount} results</p>
                        <p className="text-xs text-gray-400 mt-1">Updated {formatDate(search.lastUpdated)}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? 'Loading...' : `${filteredTechnicians.length} Technicians Found`}
          </h2>
          {error && (
            <p className="text-red-600 text-sm">
              Error loading data. Showing fallback results.
            </p>
          )}
        </div>

        {/* Technician Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTechnicians.map((technician) => (
            <Card key={technician.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={technician.avatar} alt={technician.name} />
                    <AvatarFallback>{technician.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {technician.name}
                          {technician.verified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium ml-1">{technician.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({technician.reviewCount})</span>
                          </div>
                          <Badge variant={technician.available ? "default" : "secondary"}>
                            {technician.available ? "Available" : "Busy"}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveToggle(technician.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        {technician.saved ? <Bookmark className="h-5 w-5 fill-current" /> : <BookmarkPlus className="h-5 w-5" />}
                      </Button>
                    </div>

                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {technician.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                      {technician.description}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{technician.location}</span>
                          {technician.distance && <span>• {technician.distance}km</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{technician.responseTime}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(technician.hourlyRate)}/hr
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredTechnicians.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No technicians found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or filters to find more results.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 