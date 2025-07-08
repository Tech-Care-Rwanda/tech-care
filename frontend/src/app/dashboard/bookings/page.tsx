"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  MessageSquare, 
  ChevronLeft,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const bookings = [
    {
      id: 1,
      technician: {
        name: "John Mugisha",
        image: "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg",
        rating: 5.0,
        reviews: 318,
        phone: "+250 788 123 456"
      },
      service: "Computer Setup & Network Configuration",
      description: "Complete setup of 2 desktop computers and wireless network configuration for home office",
      date: "Today, January 15, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Kigali, Kimisagara - KG 123 St",
      price: "15,000 RWF",
      status: "confirmed",
      bookingDate: "January 12, 2025",
      devices: ["2 Desktop Computers", "1 Router", "Network Setup"]
    },
    {
      id: 2,
      technician: {
        name: "Marie Uwimana",
        image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
        rating: 4.9,
        reviews: 256,
        phone: "+250 788 654 321"
      },
      service: "WiFi & Smart Home Setup",
      description: "WiFi network setup and smart device configuration including security cameras",
      date: "Tomorrow, January 16, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Kigali, Nyamirambo - KG 456 St",
      price: "12,000 RWF",
      status: "pending",
      bookingDate: "January 13, 2025",
      devices: ["Smart TV", "2 Security Cameras", "Smart Speakers"]
    },
    {
      id: 3,
      technician: {
        name: "Eric Nkurunziza",
        image: "/images/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg",
        rating: 4.8,
        reviews: 189,
        phone: "+250 788 987 654"
      },
      service: "Mobile Device Solutions",
      description: "Screen replacement and data recovery for iPhone 12",
      date: "January 10, 2025",
      time: "3:00 PM - 4:00 PM",
      location: "Kigali, Kacyiru - KG 789 St",
      price: "8,000 RWF",
      status: "completed",
      bookingDate: "January 8, 2025",
      devices: ["iPhone 12", "Data Recovery"]
    },
    {
      id: 4,
      technician: {
        name: "Grace Mukandayisenga",
        image: "/images/md-riduwan-molla-ZO0weaaDrBs-unsplash.jpg",
        rating: 4.7,
        reviews: 142,
        phone: "+250 788 111 222"
      },
      service: "Laptop Repair Service",
      description: "Hardware diagnosis and repair for Dell Latitude laptop",
      date: "January 8, 2025",
      time: "1:00 PM - 2:30 PM",
      location: "Kigali, Remera - KG 321 St",
      price: "10,000 RWF",
      status: "cancelled",
      bookingDate: "January 5, 2025",
      devices: ["Dell Latitude Laptop"]
    }
  ]

  const tabs = [
    { id: "all", label: "All Bookings", count: bookings.length },
    { id: "upcoming", label: "Upcoming", count: bookings.filter(b => b.status === "confirmed" || b.status === "pending").length },
    { id: "completed", label: "Completed", count: bookings.filter(b => b.status === "completed").length },
    { id: "cancelled", label: "Cancelled", count: bookings.filter(b => b.status === "cancelled").length }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredBookings = activeTab === "all" 
    ? bookings 
    : bookings.filter(booking => {
        if (activeTab === "upcoming") return booking.status === "confirmed" || booking.status === "pending"
        return booking.status === activeTab
      })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">TC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TechCare</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your tech support appointments and service history</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-6">You don't have any bookings in this category yet.</p>
                <Link href="/search-results">
                  <Button>Find Technicians</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                    {/* Technician Info */}
                    <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={booking.technician.image} />
                        <AvatarFallback>{booking.technician.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.technician.name}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium ml-1">{booking.technician.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({booking.technician.reviews})</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">{booking.service}</h4>
                          <p className="text-gray-600 mb-3">{booking.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(booking.status)}
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {booking.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {booking.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {booking.location}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Devices & Services:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {booking.devices.map((device, index) => (
                              <li key={index}>• {device}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div>
                          <span className="text-sm text-gray-500">Total Cost:</span>
                          <span className="text-xl font-bold text-gray-900 ml-2">{booking.price}</span>
                        </div>
                        <div className="flex space-x-2">
                          {booking.status === "pending" && (
                            <>
                              <Button variant="outline" size="sm">Cancel</Button>
                              <Button size="sm">Confirm</Button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <>
                              <Button variant="outline" size="sm">Reschedule</Button>
                              <Button variant="outline" size="sm">Cancel</Button>
                            </>
                          )}
                          {booking.status === "completed" && (
                            <>
                              <Button variant="outline" size="sm">Book Again</Button>
                              <Button size="sm">Leave Review</Button>
                            </>
                          )}
                          {booking.status === "cancelled" && (
                            <Button size="sm">Book Again</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* New Booking CTA */}
        <Card className="mt-8 bg-gradient-to-r from-red-500 to-pink-600 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Need More Tech Help?</h3>
            <p className="text-red-100 mb-4">Find expert technicians in your area for any tech support needs</p>
            <Link href="/search-results">
              <Button className="bg-white text-red-600 hover:bg-gray-100">
                Find Technicians
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 