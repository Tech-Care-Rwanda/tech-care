"use client"

import { useState } from "react"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  AlertCircle,
  Eye,
  Download,
  DollarSign,
  Search,
  MessageSquare,
  Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/lib/contexts/AuthContext"

interface ServiceRecord {
  id: string
  date: string
  type: 'booking' | 'service'
  status: 'completed' | 'cancelled' | 'pending' | 'in-progress'
  title: string
  description: string
  provider?: {
    name: string
    avatar?: string
    rating: number
  }
  customer?: {
    name: string
    avatar?: string
  }
  location: string
  duration: string
  amount: number
  rating?: number
  feedback?: string
  tags: string[]
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  // Mock service history data
  const serviceHistory: ServiceRecord[] = user?.role === 'customer' ? [
    {
      id: "1",
      date: "2024-01-15",
      type: "booking",
      status: "completed",
      title: "Computer Repair & Maintenance",
      description: "Fixed laptop overheating issue and performed system cleanup",
      provider: {
        name: "Marie Uwimana",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.8
      },
      location: "Kimisagara, Kigali",
      duration: "2h 30min",
      amount: 25000,
      rating: 5,
      feedback: "Excellent service! Fixed my laptop quickly and professionally.",
      tags: ["Hardware", "Maintenance"]
    },
    {
      id: "2",
      date: "2024-01-10",
      type: "booking",
      status: "completed",
      title: "Network Setup & Configuration",
      description: "Set up home Wi-Fi network and configured security settings",
      provider: {
        name: "Jean Baptiste",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.6
      },
      location: "Nyamirambo, Kigali",
      duration: "1h 45min",
      amount: 18000,
      rating: 4,
      feedback: "Good service, but took a bit longer than expected.",
      tags: ["Network", "Setup"]
    },
    {
      id: "3",
      date: "2024-01-05",
      type: "booking",
      status: "cancelled",
      title: "Mobile Phone Screen Replacement",
      description: "Replace cracked iPhone screen",
      provider: {
        name: "David Nkusi",
        avatar: "/placeholder-avatar.jpg",
        rating: 4.9
      },
      location: "City Center, Kigali",
      duration: "1h",
      amount: 35000,
      tags: ["Mobile", "Repair"]
    }
  ] : [
    // Technician history
    {
      id: "1",
      date: "2024-01-15",
      type: "service",
      status: "completed",
      title: "Computer Repair & Maintenance",
      description: "Fixed laptop overheating issue and performed system cleanup",
      customer: {
        name: "John Doe",
        avatar: "/placeholder-avatar.jpg"
      },
      location: "Kimisagara, Kigali",
      duration: "2h 30min",
      amount: 25000,
      rating: 5,
      feedback: "Excellent service! Fixed my laptop quickly and professionally.",
      tags: ["Hardware", "Maintenance"]
    },
    {
      id: "2",
      date: "2024-01-12",
      type: "service",
      status: "completed",
      title: "Software Installation & Setup",
      description: "Installed and configured business software suite",
      customer: {
        name: "Sarah Mukamana",
        avatar: "/placeholder-avatar.jpg"
      },
      location: "Remera, Kigali",
      duration: "3h",
      amount: 30000,
      rating: 4,
      tags: ["Software", "Installation"]
    }
  ]

  const filteredHistory = serviceHistory.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    
    const matchesDate = dateFilter === "all" || (() => {
      const recordDate = new Date(record.date)
      const now = new Date()
      switch (dateFilter) {
        case "today":
          return recordDate.toDateString() === now.toDateString()
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return recordDate >= weekAgo
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return recordDate >= monthAgo
        default:
          return true
      }
    })()

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'in-progress':
        return <RefreshCw className="w-4 h-4 text-blue-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      'in-progress': "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
    
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return `RWF ${amount.toLocaleString()}`
  }

  const calculateStats = () => {
    const completed = serviceHistory.filter(r => r.status === 'completed')
    const totalAmount = completed.reduce((sum, r) => sum + r.amount, 0)
    const avgRating = completed.reduce((sum, r) => sum + (r.rating || 0), 0) / completed.length
    
    return {
      total: serviceHistory.length,
      completed: completed.length,
      totalAmount,
      avgRating: avgRating || 0
    }
  }

  const stats = calculateStats()

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Please sign in to view your service history</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service History</h1>
          <p className="text-gray-600">
            {user.role === 'customer' 
              ? 'Track your bookings and service requests' 
              : 'View your completed jobs and client feedback'
            }
          </p>
        </div>
        
        <Button className="bg-red-500 hover:bg-red-600">
          <Download className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total {user.role === 'customer' ? 'Bookings' : 'Jobs'}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total {user.role === 'customer' ? 'Spent' : 'Earned'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Service History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : user.role === 'customer' 
                    ? "You haven't booked any services yet. Start by finding a technician!"
                    : "You haven't completed any jobs yet."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg">
                      {getStatusIcon(record.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                        {getStatusBadge(record.status)}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{record.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(record.date)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{record.location}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{record.duration}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatCurrency(record.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    {record.status === 'completed' && !record.rating && user.role === 'customer' && (
                      <Button size="sm" className="bg-red-500 hover:bg-red-600">
                        <Star className="w-4 h-4 mr-2" />
                        Rate Service
                      </Button>
                    )}
                  </div>
                </div>

                {/* Provider/Customer Info */}
                {(record.provider || record.customer) && (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={(record.provider || record.customer)?.avatar} />
                        <AvatarFallback>
                          {(record.provider || record.customer)?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <p className="font-medium text-gray-900">
                          {(record.provider || record.customer)?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.role === 'customer' ? 'Service Provider' : 'Customer'}
                        </p>
                        {record.provider?.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">{record.provider.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                )}

                {/* Rating & Feedback */}
                {record.rating && record.feedback && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < record.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {record.rating}/5 rating
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{record.feedback}"</p>
                  </div>
                )}

                {/* Tags */}
                {record.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {record.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-red-200 text-red-600 bg-red-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  )
} 