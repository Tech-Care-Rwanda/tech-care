"use client"

import { useState, useEffect } from 'react'
import { CustomerRoute } from '@/components/auth/ProtectedRoute'
import { testSupabaseConnection } from '@/lib/supabase'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SafeAvatar } from '@/components/ui/safe-avatar'
import {
  Clock,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Calendar,
  Plus,
  ArrowRight,
  User
} from 'lucide-react'
import Link from 'next/link'
import { CustomerOnboarding } from '@/components/onboarding/CustomerOnboarding'

const EMERGENCY_NUMBER = "+250791995143"

interface DisplayBooking {
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

function DashboardPageContent() {
  const [bookings, setBookings] = useState<DisplayBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get authentication state
  const { profile, loading: authLoading } = useSupabaseAuth()
  
  // User data from authentication context
  const [user, setUser] = useState({
    name: profile?.full_name || "User",
    avatar: profile?.avatar_url,
    totalBookings: 0,
    memberSince: profile?.created_at ? new Date(profile.created_at).toISOString().slice(0, 7) : "2024-01"
  })

  const handleCall = (phoneNumber?: string) => {
    window.open(`tel:${phoneNumber || EMERGENCY_NUMBER}`)
  }

  const handleMessage = (phoneNumber?: string) => {
    window.open(`sms:${phoneNumber || EMERGENCY_NUMBER}?body=Hi, I need technical support...`)
  }

  // Load real bookings from database
  useEffect(() => {
    if (!profile || authLoading) return // Wait for authentication to complete
    
    const loadBookings = async () => {
      try {
        setLoading(true)
        setError(null)

        // Test Supabase connection first
        const connectionTest = await testSupabaseConnection()
        console.log('Dashboard connection test:', connectionTest)
        
        if (!connectionTest.success) {
          throw new Error(`Supabase connection failed: ${connectionTest.error}`)
        }

        // Use authenticated user's ID
        if (!profile?.id) {
          throw new Error('User not authenticated')
        }
        const customerId = profile.id
        
        // Fetch bookings via API
        const response = await fetch(`/api/bookings/customer/${customerId}`)
        const result = await response.json()
        
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to fetch bookings')
        }
        
        const databaseBookings = result.bookings

        // Transform database bookings to display format
        const displayBookings: DisplayBooking[] = databaseBookings.map((booking: Record<string, unknown>) => ({
          id: String(booking.id),
          technician: {
            id: String(booking.technician_id) || 'unknown',
            name: 'Technician', // Simplified for now since we don't have joined data
            avatar: undefined,
            rating: 4.8, // Default rating
            specialization: String(booking.service_type) || 'Technical Service'
          },
          serviceType: String(booking.service_type) || 'Service',
          status: String(booking.status).toLowerCase() as DisplayBooking['status'],
          createdAt: String(booking.created_at),
          scheduledDate: booking.scheduled_date ? String(booking.scheduled_date) : undefined,
          urgency: 'standard'
        }))

        setBookings(displayBookings)
        setUser(prev => ({ 
          ...prev, 
          name: profile?.full_name || "User",
          avatar: profile?.avatar_url,
          memberSince: profile?.created_at ? new Date(profile.created_at).toISOString().slice(0, 7) : "2024-01",
          totalBookings: displayBookings.length 
        }))
      } catch (err) {
        console.error('Error loading bookings:', err)
        setError('Failed to load bookings')
        setBookings([]) // Show empty state instead of mock data
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [profile, authLoading])

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
      {/* Customer Onboarding */}
      <CustomerOnboarding className="mb-6" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">Manage your service appointments and history</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button asChild className="text-white hover:opacity-90" style={{ backgroundColor: '#FF385C' }}>
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

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#FF385C' }}></div>
                <p className="text-gray-600">Loading your bookings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading bookings</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="text-white hover:opacity-90"
                  style={{ backgroundColor: '#FF385C' }}
                >
                  Try Again
                </Button>
              </div>
            ) : activeBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active bookings</h3>
                <p className="text-gray-600 mb-4">Ready to get tech support? Book a service with verified technicians in your area.</p>
                <Button asChild className="text-white hover:opacity-90" style={{ backgroundColor: '#FF385C' }}>
                  <Link href="/">
                    <Plus className="w-4 h-4 mr-2" />
                    Book Your First Service
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <SafeAvatar 
                          src={booking.technician.avatar} 
                          alt={booking.technician.name}
                          size="lg"
                        />

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
                    <SafeAvatar 
                      src={booking.technician.avatar} 
                      alt={booking.technician.name}
                      size="md"
                    />

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
              <SafeAvatar 
                src={user.avatar} 
                alt={user.name}
                size="xl"
                className="mx-auto mb-3"
              />

              <h3 className="font-semibold text-gray-900 mb-1">{user.name}</h3>
              <p className="text-sm text-gray-600 mb-4">Member since {user.memberSince}</p>

              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF2F2' }}>
                <p className="text-2xl font-bold" style={{ color: '#FF385C' }}>{user.totalBookings}</p>
                <p className="text-sm" style={{ color: '#B91C1C' }}>Total Services</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start hover:bg-red-50" style={{ borderColor: '#FF385C', color: '#FF385C' }} asChild>
                <Link href="/">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Technicians
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-red-50" style={{ borderColor: '#FF385C', color: '#FF385C' }} asChild>
                <Link href="/profile">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
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
              size="sm"
              className="w-full text-white hover:opacity-90"
              style={{ backgroundColor: '#FF385C' }}
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

export default function DashboardPage() {
  return (
    <CustomerRoute>
      <DashboardPageContent />
    </CustomerRoute>
  )
}