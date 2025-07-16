"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Calendar, 
  Search, 
  User, 
  Heart, 
  Bell, 
  Settings, 
  MapPin, 
  Clock, 
  Star,
  ChevronRight,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function CustomerDashboard() {
  const router = useRouter()

  const upcomingBookings = [
    {
      id: 1,
      technician: "John Mugisha",
      service: "Computer Setup & Network Config",
      date: "Today, 2:00 PM",
      location: "Kigali, Kimisagara",
      price: "15,000 RWF",
      status: "confirmed",
      image: "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg"
    },
    {
      id: 2,
      technician: "Marie Uwimana",
      service: "WiFi & Smart Home Setup",
      date: "Tomorrow, 10:00 AM", 
      location: "Kigali, Nyamirambo",
      price: "12,000 RWF",
      status: "pending",
      image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg"
    }
  ]

  const recentSearches = [
    { query: "Computer repair in Kigali", date: "2 hours ago", results: 25 },
    { query: "Network setup Nyamirambo", date: "Yesterday", results: 18 },
    { query: "Mobile phone repair", date: "3 days ago", results: 32 }
  ]

  const savedTechnicians = [
    {
      id: 1,
      name: "John Mugisha",
      specialty: "Computer Specialist",
      rating: 5.0,
      reviews: 318,
      image: "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg"
    },
    {
      id: 2,
      name: "Marie Uwimana", 
      specialty: "Network Expert",
      rating: 4.9,
      reviews: 256,
      image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg"
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-red-100 mb-4">Ready to get tech help? Search for technicians or manage your bookings.</p>
          <Button 
            className="bg-white text-red-600 hover:bg-gray-100"
            onClick={() => router.push('/dashboard/search')}
          >
            <Search className="w-4 h-4 mr-2" />
            Find Technicians
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-gray-500">Upcoming Bookings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">7</div>
              <div className="text-sm text-gray-500">Completed Services</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-gray-500">Saved Technicians</div>
            </CardContent>
          </Card>
        </div>

            {/* Upcoming Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Upcoming Bookings</CardTitle>
                <Link href="/dashboard/bookings">
                  <Button variant="ghost" size="sm">
                    View all <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={booking.image}
                          alt={booking.technician}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{booking.technician}</h4>
                      <p className="text-sm text-gray-600">{booking.service}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {booking.date}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {booking.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{booking.price}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Book New Service
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Searches */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Recent Searches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentSearches.map((search, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{search.query}</p>
                        <p className="text-xs text-gray-500">{search.results} technicians found</p>
                      </div>
                      <span className="text-xs text-gray-400">{search.date}</span>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    View Search History
                  </Button>
                </CardContent>
              </Card>

              {/* Saved Technicians */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Saved Technicians</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {savedTechnicians.map((tech) => (
                    <div key={tech.id} className="flex items-center space-x-3 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={tech.image} />
                        <AvatarFallback>{tech.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{tech.name}</p>
                        <p className="text-xs text-gray-500">{tech.specialty}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {tech.rating} ({tech.reviews})
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    View All Favorites
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
      </DashboardLayout>
    )
  } 