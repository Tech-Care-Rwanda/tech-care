"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Clock, 
  MapPin, 
  Star, 
  Phone, 
  MessageCircle, 
  Calendar,
  Filter,
  Plus,
  ArrowRight,
  User
} from 'lucide-react'
import Link from 'next/link'

const EMERGENCY_NUMBER = "+250791995143"

interface Booking {
  id: string
  technician: {
    id: string
    name: string
    avatar?: string
    rating: number
    specialization: string
  }
  serviceType: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
  scheduledDate?: string
  urgency: 'standard' | 'urgent'
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  // Mock user data
  const user = {
    name: "John Uwimana",
    avatar: "/images/default-avatar.jpg",
    totalBookings: 8,
    memberSince: "2024-01"
  }

  const handleCall = (phoneNumber?: string) => {
    window.open(`tel:${phoneNumber || EMERGENCY_NUMBER}`)
  }

  const handleMessage = (phoneNumber?: string) => {
    window.open(`sms:${phoneNumber || EMERGENCY_NUMBER}?body=Hi, I need technical support...`)
  }

  // Load bookings - using mock data for now
  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: '1',
        technician: {
          id: '1',
          name: 'Marie Uwimana',
          avatar: '/images/thisisengineering-hnXf73-K1zo-unsplash.jpg',
          rating: 4.8,
          specialization: 'Computer Repair'
        },
        serviceType: 'Computer Repair',
        status: 'confirmed',
        urgency: 'urgent',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        scheduledDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        technician: {
          id: '2',
          name: 'Jean Baptiste',
          avatar: '/images/md-riduwan-molla-ZO0weaaDrBs-unsplash.jpg',
          rating: 4.6,
          specialization: 'Mobile Device'
        },
        serviceType: 'Mobile Repair',
        status: 'completed',
        urgency: 'standard',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    setBookings(mockBookings)
    setLoading(false)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const activeBookings = bookings.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status))
  const recentBookings = bookings.filter(b => b.status === 'completed').slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">Manage your service appointments and history</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild>
              <Link href="/">
                <Plus className="w-4 h-4 mr-2" />
                Book New Service
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Bookings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Active Bookings</h2>
              <Badge variant="secondary">{activeBookings.length}</Badge>
            </div>
            
            {activeBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active bookings</h3>
                <p className="text-gray-600 mb-4">Ready to get tech support? Find a technician near you.</p>
                <Button asChild>
                  <Link href="/">Find Technicians</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={booking.technician.avatar} />
                          <AvatarFallback>
                            {booking.technician.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{booking.technician.name}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{booking.technician.rating}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{booking.serviceType}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Created {formatDate(booking.createdAt)}</span>
                            </div>
                            {booking.scheduledDate && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>Scheduled {formatDate(booking.scheduledDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={STATUS_CONFIG[booking.status].color}>
                            {STATUS_CONFIG[booking.status].label}
                          </Badge>
                          {booking.urgency === 'urgent' && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCall(EMERGENCY_NUMBER)}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMessage(EMERGENCY_NUMBER)}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Bookings */}
          {recentBookings.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent History</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={booking.technician.avatar} />
                      <AvatarFallback>
                        {booking.technician.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{booking.technician.name}</p>
                      <p className="text-sm text-gray-600">{booking.serviceType}</p>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={`${STATUS_CONFIG[booking.status].color} text-xs`}>
                        {STATUS_CONFIG[booking.status].label}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(booking.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card className="p-4">
            <div className="text-center">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <h3 className="font-semibold text-gray-900 mb-1">{user.name}</h3>
              <p className="text-sm text-gray-600 mb-4">Member since {user.memberSince}</p>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{user.totalBookings}</p>
                <p className="text-sm text-blue-800">Total Services</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Technicians
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </Card>

          {/* Emergency Support */}
          <Card className="p-4 border-red-200 bg-red-50">
            <h3 className="font-semibold text-red-800 mb-2">Emergency Support</h3>
            <p className="text-sm text-red-700 mb-3">
              Need immediate help? Call our 24/7 support line.
            </p>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full"
              onClick={() => handleCall(EMERGENCY_NUMBER)}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call {EMERGENCY_NUMBER}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}