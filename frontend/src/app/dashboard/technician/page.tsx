"use client"

import { useState, useEffect } from "react"
import {
    Calendar,
    Clock,
    Star,
    TrendingUp,
    Users,
    MapPin,
    Check,
    X,
    Phone,
    MessageCircle,
    Settings,
    BarChart3,
    DollarSign,
    AlertCircle,
    CheckCircle,
    Wrench
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useBookings } from "@/lib/hooks/useBookings"

interface TechnicianStats {
    totalEarnings: number
    monthlyEarnings: number
    completedJobs: number
    monthlyJobs: number
    rating: number
    totalReviews: number
    responseTime: string
    acceptanceRate: number
}

interface TechnicianBooking {
    id: string
    customer: {
        name: string
        phone: string
        image?: string
    }
    service: string
    description: string
    date: string
    time: string
    location: {
        address: string
        coordinates?: { lat: number; lng: number }
    }
    price: string
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
    urgency: 'low' | 'medium' | 'high'
    estimatedDuration: string
    deviceInfo?: string
    createdAt: string
}

export default function TechnicianDashboard() {
    const { user } = useAuth()
    const { bookings, loading: bookingsLoading, updateBookingStatus } = useBookings()
    const [isAvailable, setIsAvailable] = useState(true)
    const [stats, setStats] = useState<TechnicianStats>({
        totalEarnings: 485000,
        monthlyEarnings: 125000,
        completedJobs: 127,
        monthlyJobs: 18,
        rating: 4.8,
        totalReviews: 89,
        responseTime: "< 2 hours",
        acceptanceRate: 94
    })

    // Mock technician bookings (TODO: Replace with real API)
    const [technicianBookings, setTechnicianBookings] = useState<TechnicianBooking[]>([
        {
            id: "1",
            customer: {
                name: "Sarah Mukamana",
                phone: "+250 788 123 456",
                image: "/placeholder-avatar.jpg"
            },
            service: "Computer Setup & Network Config",
            description: "Need help setting up new laptop and connecting to office network. Also require data transfer from old computer.",
            date: "2024-01-16",
            time: "14:00",
            location: {
                address: "KG 15 Ave, Kigali, Kimisagara"
            },
            price: "15,000 RWF",
            status: "pending",
            urgency: "high",
            estimatedDuration: "2-3 hours",
            deviceInfo: "Dell Laptop, Windows 11",
            createdAt: "2024-01-15T10:30:00Z"
        },
        {
            id: "2",
            customer: {
                name: "Jean Claude Habimana",
                phone: "+250 788 987 654",
                image: "/placeholder-avatar.jpg"
            },
            service: "Computer Repair",
            description: "Computer won't start up. Screen stays black and there are beeping sounds.",
            date: "2024-01-16",
            time: "16:30",
            location: {
                address: "KN 5 Ave, Kigali, Nyamirambo"
            },
            price: "12,000 RWF",
            status: "confirmed",
            urgency: "medium",
            estimatedDuration: "1-2 hours",
            deviceInfo: "HP Desktop, Windows 10",
            createdAt: "2024-01-15T08:15:00Z"
        },
        {
            id: "3",
            customer: {
                name: "Marie Uwimana",
                phone: "+250 788 555 123",
                image: "/placeholder-avatar.jpg"
            },
            service: "Mobile Phone Repair",
            description: "Screen is cracked and touch not responding properly. Need urgent repair.",
            date: "2024-01-17",
            time: "10:00",
            location: {
                address: "KG 7 Ave, Kigali, Remera"
            },
            price: "8,000 RWF",
            status: "in_progress",
            urgency: "high",
            estimatedDuration: "1 hour",
            deviceInfo: "iPhone 12 Pro",
            createdAt: "2024-01-14T16:45:00Z"
        }
    ])

    const pendingBookings = technicianBookings.filter(booking => booking.status === 'pending')
    const todayBookings = technicianBookings.filter(booking => {
        const today = new Date().toISOString().split('T')[0]
        return booking.date === today || booking.status === 'confirmed' || booking.status === 'in_progress'
    })

    const handleBookingAction = async (bookingId: string, action: 'accept' | 'reject' | 'complete') => {
        setTechnicianBookings(prev =>
            prev.map(booking => {
                if (booking.id === bookingId) {
                    switch (action) {
                        case 'accept':
                            return { ...booking, status: 'confirmed' as const }
                        case 'reject':
                            return { ...booking, status: 'cancelled' as const }
                        case 'complete':
                            return { ...booking, status: 'completed' as const }
                        default:
                            return booking
                    }
                }
                return booking
            })
        )

        // TODO: Update backend
        // await updateBookingStatus(bookingId, action === 'accept' ? 'confirmed' : action === 'reject' ? 'cancelled' : 'completed')
    }

    const toggleAvailability = () => {
        setIsAvailable(!isAvailable)
        // TODO: Update backend availability status
    }

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high': return 'text-red-600 bg-red-50'
            case 'medium': return 'text-yellow-600 bg-yellow-50'
            case 'low': return 'text-green-600 bg-green-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-50'
            case 'confirmed': return 'text-blue-600 bg-blue-50'
            case 'in_progress': return 'text-purple-600 bg-purple-50'
            case 'completed': return 'text-green-600 bg-green-50'
            case 'cancelled': return 'text-red-600 bg-red-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    if (!user || user.role !== 'TECHNICIAN') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
                        <p className="text-gray-600 mb-4">This dashboard is only available for technicians.</p>
                        <Button onClick={() => window.location.href = '/dashboard'}>
                            Go to Customer Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Technician Dashboard</h1>
                                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Available</span>
                                <Switch
                                    checked={isAvailable}
                                    onCheckedChange={toggleAvailability}
                                />
                                <Badge variant={isAvailable ? "default" : "secondary"}>
                                    {isAvailable ? "Online" : "Offline"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.totalEarnings.toLocaleString()} RWF</p>
                                    <p className="text-xs text-gray-500">+{stats.monthlyEarnings.toLocaleString()} this month</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.completedJobs}</p>
                                    <p className="text-xs text-gray-500">+{stats.monthlyJobs} this month</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Rating</p>
                                    <div className="flex items-center space-x-1">
                                        <p className="text-2xl font-bold text-yellow-600">{stats.rating}</p>
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <p className="text-xs text-gray-500">{stats.totalReviews} reviews</p>
                                </div>
                                <Star className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Response Time</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.responseTime}</p>
                                    <p className="text-xs text-gray-500">{stats.acceptanceRate}% acceptance rate</p>
                                </div>
                                <Clock className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pending Requests */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                        <AlertCircle className="h-5 w-5 text-orange-500" />
                                        <span>Pending Requests ({pendingBookings.length})</span>
                                    </span>
                                    {pendingBookings.length > 0 && (
                                        <Badge variant="destructive">{pendingBookings.length} new</Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pendingBookings.length === 0 ? (
                                    <div className="text-center py-8">
                                        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No pending requests</p>
                                        <p className="text-sm text-gray-400">New booking requests will appear here</p>
                                    </div>
                                ) : (
                                    pendingBookings.map((booking) => (
                                        <div key={booking.id} className="border rounded-lg p-4 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={booking.customer.image} alt={booking.customer.name} />
                                                        <AvatarFallback>{booking.customer.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{booking.customer.name}</h4>
                                                        <p className="text-sm text-gray-600">{booking.customer.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge className={`text-xs ${getUrgencyColor(booking.urgency)}`}>
                                                        {booking.urgency} priority
                                                    </Badge>
                                                    <Badge className="text-xs bg-gray-100 text-gray-700">
                                                        {booking.price}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="font-medium text-gray-900 mb-1">{booking.service}</h5>
                                                <p className="text-sm text-gray-600 mb-2">{booking.description}</p>

                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{booking.estimatedDuration}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 col-span-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{booking.location.address}</span>
                                                    </div>
                                                    {booking.deviceInfo && (
                                                        <div className="flex items-center space-x-2 col-span-2">
                                                            <Wrench className="h-4 w-4" />
                                                            <span>{booking.deviceInfo}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                    >
                                                        <MessageCircle className="h-4 w-4 mr-1" />
                                                        Message
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                                    >
                                                        <Phone className="h-4 w-4 mr-1" />
                                                        Call
                                                    </Button>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                        onClick={() => handleBookingAction(booking.id, 'reject')}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Decline
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleBookingAction(booking.id, 'accept')}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Accept
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Today's Schedule */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    <span>Today's Schedule</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {todayBookings.length === 0 ? (
                                    <div className="text-center py-6">
                                        <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No bookings today</p>
                                    </div>
                                ) : (
                                    todayBookings.map((booking) => (
                                        <div key={booking.id} className="border rounded-lg p-3 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h5 className="font-medium text-sm text-gray-900">{booking.customer.name}</h5>
                                                <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                                                    {booking.status.replace('_', ' ')}
                                                </Badge>
                                            </div>

                                            <p className="text-xs text-gray-600">{booking.service}</p>

                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="flex items-center space-x-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{booking.time}</span>
                                                </span>
                                                <span className="font-medium text-green-600">{booking.price}</span>
                                            </div>

                                            {booking.status === 'in_progress' && (
                                                <Button
                                                    size="sm"
                                                    className="w-full mt-2"
                                                    onClick={() => handleBookingAction(booking.id, 'complete')}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Mark Complete
                                                </Button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-sm">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Update Profile
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Analytics
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <Users className="h-4 w-4 mr-2" />
                                    Customer Reviews
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
} 