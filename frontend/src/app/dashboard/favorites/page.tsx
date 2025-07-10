"use client"

import { useState } from "react"
import { 
  Heart,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Calendar,
  Filter,
  Search,
  Trash2,
  Edit,
  Plus,
  Clock,
  DollarSign,
  BookmarkX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/lib/contexts/AuthContext"

interface SavedTechnician {
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
  lastBooked?: string
  totalBookings: number
  category: string
  notes?: string
  savedDate: string
  distance?: number
}

interface Category {
  id: string
  name: string
  color: string
  count: number
}

export default function FavoritesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  // Mock saved technicians data
  const [savedTechnicians, setSavedTechnicians] = useState<SavedTechnician[]>([
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
      lastBooked: "2024-01-10",
      totalBookings: 5,
      category: "computer-repair",
      notes: "Excellent for urgent computer repairs. Very reliable.",
      savedDate: "2024-01-01",
      distance: 2.5
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
      available: false,
      responseTime: "< 2 hours",
      lastBooked: "2024-01-05",
      totalBookings: 3,
      category: "mobile-repair",
      notes: "Best for mobile screen repairs.",
      savedDate: "2023-12-20",
      distance: 5.2
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
      available: true,
      responseTime: "< 3 hours",
      totalBookings: 2,
      category: "hardware",
      notes: "Perfect for gaming setup and hardware upgrades.",
      savedDate: "2023-12-15",
      distance: 8.1
    },
    {
      id: "4",
      name: "Sarah Mukamana",
      avatar: "/placeholder-avatar.jpg", 
      rating: 4.7,
      reviewCount: 29,
      specialties: ["Network Security", "IT Consulting", "Server Setup"],
      location: "Kacyiru",
      hourlyRate: 25000,
      available: true,
      responseTime: "< 4 hours",
      totalBookings: 1,
      category: "network",
      notes: "Expert in business IT solutions.",
      savedDate: "2023-11-30"
    }
  ])

  const [categories] = useState<Category[]>([
    { id: "all", name: "All Favorites", color: "gray", count: savedTechnicians.length },
    { id: "computer-repair", name: "Computer Repair", color: "blue", count: 1 },
    { id: "mobile-repair", name: "Mobile Repair", color: "green", count: 1 },
    { id: "hardware", name: "Hardware", color: "purple", count: 1 },
    { id: "network", name: "Network", color: "orange", count: 1 }
  ])

  const removeFavorite = (technicianId: string) => {
    setSavedTechnicians(prev => prev.filter(tech => tech.id !== technicianId))
  }

  const filteredTechnicians = savedTechnicians.filter(tech => {
    const matchesSearch = !searchTerm || 
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tech.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || tech.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.color || 'gray'
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Please sign in to view your favorites</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Saved Technicians
            <Badge className="ml-3 bg-red-500 text-white">
              {savedTechnicians.length}
            </Badge>
          </h1>
          <p className="text-gray-600">Manage your favorite technicians and quick book services</p>
        </div>
        
        <Button className="bg-red-500 hover:bg-red-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="outline">{category.count}</Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Saved</span>
                <span className="font-semibold">{savedTechnicians.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Now</span>
                <span className="font-semibold text-green-600">
                  {savedTechnicians.filter(t => t.available).length}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Bookings</span>
                <span className="font-semibold">
                  {savedTechnicians.reduce((sum, t) => sum + t.totalBookings, 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Rating</span>
                <span className="font-semibold">
                  {(savedTechnicians.reduce((sum, t) => sum + t.rating, 0) / savedTechnicians.length).toFixed(1)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search & Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search saved technicians..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option>Sort by Name</option>
                  <option>Sort by Rating</option>
                  <option>Sort by Last Booked</option>
                  <option>Sort by Date Saved</option>
                  <option>Sort by Total Bookings</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Technicians Grid */}
          {filteredTechnicians.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Heart className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved technicians</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedCategory !== "all"
                    ? "No technicians match your current filters."
                    : "Start building your list of favorite technicians for quick access."
                  }
                </p>
                <Button className="bg-red-500 hover:bg-red-600">
                  <Search className="w-4 h-4 mr-2" />
                  Find Technicians
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredTechnicians.map((tech) => (
                <Card key={tech.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={tech.avatar} />
                          <AvatarFallback>
                            {tech.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{tech.name}</h3>
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
                          
                          <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span>{tech.rating}</span>
                              <span>({tech.reviewCount})</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{tech.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(tech.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <BookmarkX className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tech.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-600 bg-red-50">
                          {specialty}
                        </Badge>
                      ))}
                      {tech.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{tech.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <DollarSign className="w-3 h-3" />
                        <span>RWF {tech.hourlyRate.toLocaleString()}/hr</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{tech.responseTime}</span>
                      </div>
                      
                      <div className="text-gray-600">
                        <span className="font-medium">{tech.totalBookings}</span> bookings
                      </div>
                      
                      {tech.lastBooked && (
                        <div className="text-gray-600">
                          Last: {formatDate(tech.lastBooked)}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {tech.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 italic">"{tech.notes}"</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-red-500 hover:bg-red-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Metadata */}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Saved on {formatDate(tech.savedDate)}
                      </span>
                      
                      <Badge variant="outline" className={`text-xs border-${getCategoryColor(tech.category)}-200 text-${getCategoryColor(tech.category)}-600 bg-${getCategoryColor(tech.category)}-50`}>
                        {categories.find(c => c.id === tech.category)?.name || tech.category}
                      </Badge>
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