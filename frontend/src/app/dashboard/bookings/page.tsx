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
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useBookings, useBookingOperations } from "@/lib/hooks/useBookings"
import { Booking } from "@/lib/services/bookingService"

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const { bookings, loading, error, refetch } = useBookings()
  const { updateStatus, cancelBooking, loading: operationLoading } = useBookingOperations()

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "all") return true
    return booking.status === activeTab
  })

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    const success = await updateStatus(bookingId, newStatus)
    if (success) {
      refetch() // Refresh the bookings list
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    const success = await cancelBooking(bookingId)
    if (success) {
      refetch() // Refresh the bookings list
    }
  }

  const getTabCount = (status: string) => {
    if (status === "all") return bookings.length
    return bookings.filter(booking => booking.status === status).length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your service appointments and bookings
            </p>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "all", label: "All Bookings", count: getTabCount("all") },
              { id: "pending", label: "Pending", count: getTabCount("pending") },
              { id: "confirmed", label: "Confirmed", count: getTabCount("confirmed") },
              { id: "completed", label: "Completed", count: getTabCount("completed") },
              { id: "cancelled", label: "Cancelled", count: getTabCount("cancelled") }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                {tab.label}
                <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${activeTab === tab.id ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                  }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>Error loading bookings: {error}</p>
            <Button variant="outline" size="sm" onClick={refetch} className="mt-2">
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading bookings...</span>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === "all" ? "No bookings yet" : `No ${activeTab} bookings`}
                </h3>
                <p className="text-gray-500 mb-4">
                  {activeTab === "all"
                    ? "Start by searching for technicians and booking a service"
                    : `You don't have any ${activeTab} bookings at the moment`
                  }
                </p>
                {activeTab === "all" && (
                  <Link href="/dashboard/search">
                    <Button>Find Technicians</Button>
                  </Link>
                )}
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Technician Avatar */}
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={booking.technician.image} alt={booking.technician.name} />
                        <AvatarFallback>{booking.technician.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      {/* Booking Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {booking.service}
                            </h3>

                            {/* Technician Info */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600">with</span>
                              <span className="text-sm font-medium text-gray-900">
                                {booking.technician.name}
                              </span>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-500 ml-1">
                                  {booking.technician.rating} ({booking.technician.reviews})
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {booking.description}
                            </p>

                            {/* Booking Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{booking.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">{booking.location}</span>
                              </div>
                              <div className="text-lg font-bold text-gray-900">
                                {booking.price}
                              </div>
                            </div>

                            {/* Devices */}
                            {booking.devices && booking.devices.length > 0 && (
                              <div className="mt-3">
                                <div className="flex flex-wrap gap-2">
                                  {booking.devices.map((device, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {device}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Status and Actions */}
                          <div className="flex flex-col items-end gap-3">
                            <Badge className={`flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {booking.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                    disabled={operationLoading}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    disabled={operationLoading}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}

                              {booking.status === 'confirmed' && (
                                <>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Chat
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Phone className="h-4 w-4 mr-1" />
                                    Call
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    disabled={operationLoading}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}

                              {booking.status === 'completed' && (
                                <Button variant="outline" size="sm">
                                  Leave Review
                                </Button>
                              )}

                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Booking Date */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Booked on {booking.bookingDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 