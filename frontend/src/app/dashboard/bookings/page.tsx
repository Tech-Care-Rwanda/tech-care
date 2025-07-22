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
  ArrowLeft,
  Filter,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { bookingService } from '@/lib/services/bookingService'

interface Booking {
  id: string
  technician: {
    id: string
    name: string
    avatar?: string
    rating: number
    specialization: string
    phone?: string
  }
  serviceType: string
  description: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  urgency: 'low' | 'medium' | 'high'
  createdAt: string
  scheduledDate?: string
  completedAt?: string
  estimatedCost?: number
  actualCost?: number
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
}

const URGENCY_CONFIG = {
  low: { color: 'bg-green-100 text-green-800' },
  medium: { color: 'bg-yellow-100 text-yellow-800' },
  high: { color: 'bg-red-100 text-red-800' }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all')

  // Load bookings
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await bookingService.getUserBookings('1') // TODO: Get from auth context
        if (response.success && response.data) {
          // Transform API data to component format
          const transformedBookings: Booking[] = response.data.map((booking: any) => ({
            id: booking.id.toString(),
            technician: {
              id: booking.technician?.id?.toString() || '1',
              name: booking.technician?.name || 'Unknown Technician',
              avatar: booking.technician?.avatar,
              rating: booking.technician?.rating || 4.5,
              specialization: booking.serviceType || 'General Tech',
              phone: '+250788123456' // Mock phone
            },
            serviceType: booking.serviceType,
            description: booking.description,
            status: booking.status,
            urgency: booking.urgency || 'medium',
            createdAt: booking.createdAt,
            scheduledDate: booking.scheduledDate,
            completedAt: booking.completedAt,
            estimatedCost: booking.estimatedCost,
            actualCost: booking.actualCost
          }))
          setBookings(transformedBookings)
        } else {
          // Mock data for demonstration
          setBookings([
            {
              id: '1',
              technician: {
                id: '1',
                name: 'Marie Uwimana',
                avatar: '/images/thisisengineering-hnXf73-K1zo-unsplash.jpg',
                rating: 4.8,
                specialization: 'Computer Repair',
                phone: '+250788123456'
              },
              serviceType: 'Computer Repair',
              description: 'Laptop won\'t boot up, blue screen error',
              status: 'confirmed',
              urgency: 'high',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
              scheduledDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // in 4 hours
              estimatedCost: 15000
            },
            {
              id: '2',
              technician: {
                id: '2',
                name: 'Jean Baptiste',
                avatar: '/images/md-riduwan-molla-ZO0weaaDrBs-unsplash.jpg',
                rating: 4.6,
                specialization: 'Mobile Device',
                phone: '+250788234567'
              },
              serviceType: 'Mobile Repair',
              description: 'Phone screen cracked, touchscreen not responsive',
              status: 'completed',
              urgency: 'medium',
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
              completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
              actualCost: 25000
            },
            {
              id: '3',
              technician: {
                id: '3',
                name: 'David Nkusi',
                avatar: '/images/samsung-memory-KTF38UTEKR4-unsplash.jpg',
                rating: 4.9,
                specialization: 'Network Setup',
                phone: '+250788345678'
              },
              serviceType: 'Network Setup',
              description: 'Setup WiFi network for office, 20 devices',
              status: 'pending',
              urgency: 'low',
              createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
              estimatedCost: 50000
            }
          ])
        }
      } catch (error) {
        console.error('Failed to load bookings:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadBookings()
  }, [])

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600">Track your service requests and appointments</p>
            </div>
          </div>
          
          <Button asChild>
            <Link href="/dashboard">
              Book New Service
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              {[
                { key: 'all', label: 'All Bookings' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'completed', label: 'Completed' }
              ].map((option) => (
                <Button
                  key={option.key}
                  variant={filter === option.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(option.key as any)}
                >
                  {option.label}
                  {option.key !== 'all' && (
                    <span className="ml-2 text-xs">
                      ({bookings.filter(b => b.status === option.key).length})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? "You haven't made any bookings yet." 
                  : `No ${filter} bookings at the moment.`
                }
              </p>
              <Button asChild>
                <Link href="/dashboard">Find a Technician</Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={booking.technician.avatar} />
                          <AvatarFallback>
                            {booking.technician.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">
                              {booking.technician.name}
                            </h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{booking.technician.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{booking.technician.specialization}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge className={STATUS_CONFIG[booking.status].color}>
                            {STATUS_CONFIG[booking.status].label}
                          </Badge>
                          <Badge className={URGENCY_CONFIG[booking.urgency].color}>
                            {booking.urgency} priority
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Service:</strong> {booking.serviceType}
                        </p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                          {booking.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Created {getTimeAgo(booking.createdAt)}</span>
                        </div>
                        
                        {booking.scheduledDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Scheduled for {formatDate(booking.scheduledDate)}</span>
                          </div>
                        )}
                        
                        {booking.completedAt && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Completed {formatDate(booking.completedAt)}</span>
                          </div>
                        )}

                        {(booking.estimatedCost || booking.actualCost) && (
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">
                              RWF {(booking.actualCost || booking.estimatedCost)?.toLocaleString()}
                              {booking.estimatedCost && !booking.actualCost && ' (estimated)'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {booking.technician.phone && (
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      
                      {booking.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}