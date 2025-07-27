/**
 * Custom React Hooks for Technician Dashboard
 * Provides hooks for technician-specific data and operations
 */

import { useState, useEffect, useCallback } from 'react'
import { API_ENDPOINTS } from '@/lib/config/api'
import { BackendBooking, BookingCategory, BookingStatus } from '@/lib/services/bookingService'
import { supabase } from '@/lib/supabase'

// Simple API response interface
interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}

export interface TechnicianStats {
    totalEarnings: number
    monthlyEarnings: number
    completedJobs: number
    monthlyJobs: number
    rating: number
    totalReviews: number
    responseTime: string
    acceptanceRate: number
    availabilityStatus: boolean
}

export interface TechnicianBooking {
    id: string
    customer: {
        id: string
        name: string
        phone: string
        email: string
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
    updatedAt?: string
}

export interface TechnicianProfile {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
    specialization: string
    experience: string
    hourlyRate: number
    isAvailable: boolean
    location: string
    bio: string
    skills: string[]
    certifications: string[]
    workingHours: {
        start: string
        end: string
        days: string[]
    }
}

// Hook for technician dashboard stats
export function useTechnicianStats(technicianId: string | null | undefined) {
    const [stats, setStats] = useState<TechnicianStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStats = useCallback(async () => {
        if (!technicianId) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)

            // Fetch completed bookings and reviews in parallel
            const [bookingsResponse, reviewsResponse] = await Promise.all([
                supabase
                    .from('bookings')
                    .select('id, price_rwf, created_at')
                    .eq('technician_id', technicianId)
                    .eq('status', 'completed'),
                supabase
                    .from('reviews')
                    .select('rating')
                    .eq('technician_id', technicianId)
            ])

            if (bookingsResponse.error) throw bookingsResponse.error
            if (reviewsResponse.error) throw reviewsResponse.error

            const completedBookings = bookingsResponse.data || []
            const reviews = reviewsResponse.data || []

            // Calculate stats
            const totalEarnings = completedBookings.reduce((sum, b) => sum + Number(b.price_rwf || 0), 0)
            const rating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

            const currentMonth = new Date().getMonth()
            const monthlyBookings = completedBookings.filter(b => new Date(b.created_at).getMonth() === currentMonth)
            const monthlyEarnings = monthlyBookings.reduce((sum, b) => sum + Number(b.price_rwf || 0), 0)

            const statsData: TechnicianStats = {
                totalEarnings,
                monthlyEarnings,
                completedJobs: completedBookings.length,
                monthlyJobs: monthlyBookings.length,
                rating,
                totalReviews: reviews.length,
                responseTime: "< 2 hours", // Placeholder
                acceptanceRate: 94, // Placeholder
                availabilityStatus: true // Placeholder
            }

            setStats(statsData)

        } catch (err) {
            console.error('Error fetching technician stats:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch stats')
        } finally {
            setLoading(false)
        }
    }, [technicianId])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    return {
        stats,
        loading,
        error,
        refetch: fetchStats
    }
}

// Hook for technician bookings
export function useTechnicianBookings(userId: string | null | undefined) {
    const [bookings, setBookings] = useState<TechnicianBooking[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Transform database booking to technician booking format
    const transformDatabaseBooking = (databaseBooking: any): TechnicianBooking => {
        return {
            id: databaseBooking.id,
            customer: {
                id: databaseBooking.customer.id,
                name: databaseBooking.customer.full_name,
                phone: databaseBooking.customer.phone_number,
                email: databaseBooking.customer.email,
                image: undefined // Let SafeAvatar component handle fallback
            },
            service: databaseBooking.service_type,
            description: databaseBooking.problem_description,
            date: databaseBooking.scheduled_date ? new Date(databaseBooking.scheduled_date).toLocaleDateString() : 'Not scheduled',
            time: databaseBooking.scheduled_date ? new Date(databaseBooking.scheduled_date).toLocaleTimeString() : '',
            location: {
                address: databaseBooking.customer_location
            },
            price: `${databaseBooking.price_rwf} RWF`,
            status: databaseBooking.status.toLowerCase() as TechnicianBooking['status'],
            urgency: 'medium', // TODO: Add urgency to backend
            estimatedDuration: `${databaseBooking.duration || 60} minutes`,
            deviceInfo: databaseBooking.problem_description.substring(0, 50),
            createdAt: databaseBooking.created_at,
            updatedAt: databaseBooking.updated_at
        }
    }

    // Legacy transform function (kept for backward compatibility)
    const transformBooking = (backendBooking: BackendBooking): TechnicianBooking => {
        return {
            id: backendBooking.id,
            customer: {
                id: backendBooking.customer.id,
                name: backendBooking.customer.fullName,
                phone: backendBooking.customer.phoneNumber,
                email: backendBooking.customer.email,
                image: '/placeholder-avatar.jpg' // Default image
            },
            service: formatCategory(backendBooking.category),
            description: backendBooking.description,
            date: backendBooking.scheduledAt ? new Date(backendBooking.scheduledAt).toLocaleDateString() : 'Not scheduled',
            time: backendBooking.scheduledAt ? new Date(backendBooking.scheduledAt).toLocaleTimeString() : '',
            location: {
                address: backendBooking.location
            },
            price: `${(backendBooking.estimatedHours || 2) * 5000} RWF`,
            status: backendBooking.status.toLowerCase() as TechnicianBooking['status'],
            urgency: 'medium', // TODO: Add urgency to backend
            estimatedDuration: `${backendBooking.estimatedHours || 2} hours`,
            deviceInfo: backendBooking.description.substring(0, 50), // Extract from description
            createdAt: backendBooking.createdAt,
            updatedAt: backendBooking.updatedAt
        }
    }

    // Format category for display
    const formatCategory = (category: BookingCategory): string => {
        return category.split('_').map(word =>
            word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ')
    }

    const fetchBookings = useCallback(async () => {
        // For testing purposes, fetch ALL bookings regardless of technician
        // Later this can be changed back to filter by technician ID
        try {
            setLoading(true)
            setError(null)

            console.log('🔍 Fetching ALL bookings from Supabase for testing...')

            // Fetch ALL bookings with customer information
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    customer:users!bookings_customer_id_fkey (
                        id,
                        full_name,
                        phone_number,
                        email
                    )
                `)
                .order('created_at', { ascending: false });

            if (bookingsError) throw bookingsError

            console.log('✅ Received ALL bookings:', bookingsData)

            if (bookingsData && bookingsData.length > 0) {
                const transformedBookings = bookingsData.map((booking: any) =>
                    transformDatabaseBooking(booking)
                )
                setBookings(transformedBookings)
                console.log('📝 Transformed bookings:', transformedBookings)
            } else {
                setBookings([])
                console.log('📋 No bookings found in database')
            }
        } catch (err) {
            console.error('Error fetching bookings:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
            setBookings([])
        } finally {
            setLoading(false)
        }
    }, []) // Removed userId dependency since we're fetching all bookings

    const updateBookingStatus = async (bookingId: string, status: TechnicianBooking['status'], notes?: string) => {
        try {
            console.log('🔄 Updating booking status:', { bookingId, status, notes })

            // Update the booking status in Supabase
            const { data, error } = await supabase
                .from('bookings')
                .update({ status, notes })
                .eq('id', bookingId)
                .select()

            if (error) {
                console.error('❌ Supabase update failed:', error)

                // Still update local state optimistically
                setBookings(prev =>
                    prev.map(booking =>
                        booking.id === bookingId
                            ? { ...booking, status, updatedAt: new Date().toISOString() }
                            : booking
                    )
                )

                return {
                    success: true,
                    warning: `Database update failed: ${error.message}. Status updated locally only.`
                }
            }

            // Check if any rows were actually updated
            if (!data || data.length === 0) {
                console.warn('⚠️ No rows updated - booking may not exist')

                setBookings(prev =>
                    prev.map(booking =>
                        booking.id === bookingId
                            ? { ...booking, status, updatedAt: new Date().toISOString() }
                            : booking
                    )
                )

                return {
                    success: true,
                    warning: 'Booking not found in database. Status updated locally only.'
                }
            }

            // Success - update local state with real data
            console.log('✅ Booking status updated successfully in database:', data)

            setBookings(prev =>
                prev.map(booking =>
                    booking.id === bookingId
                        ? { ...booking, status, updatedAt: new Date().toISOString() }
                        : booking
                )
            )

            return { success: true }

        } catch (err) {
            console.error('💥 Error updating booking status:', err)

            // Fallback: update local state optimistically
            setBookings(prev =>
                prev.map(booking =>
                    booking.id === bookingId
                        ? { ...booking, status, updatedAt: new Date().toISOString() }
                        : booking
                )
            )

            return {
                success: true,
                warning: `Network error: ${err instanceof Error ? err.message : 'Unknown error'}. Status updated locally only.`
            }
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [fetchBookings])

    return {
        bookings,
        loading,
        error,
        fetchBookings,
        updateBookingStatus
    }
}

// Hook for technician profile management
export function useTechnicianProfile() {
    const [profile, setProfile] = useState<TechnicianProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProfile = async () => {
        try {
            setLoading(true)
            setError(null)

            // For now, we don't fetch a separate technician profile
            // The main profile comes from useSupabaseAuth
            // This hook is mainly used for availability management
            setProfile(null)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch profile')
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (updates: Partial<TechnicianProfile>) => {
        try {
            // TODO: Implement when technician profiles are needed
            // For now, profile updates go through technician_details table
            setProfile(prev => prev ? { ...prev, ...updates } : null)
            return { success: true }
        } catch (err) {
            return {
                success: false,
                error: err instanceof Error ? err.message : 'Failed to update profile'
            }
        }
    }

    const updateAvailability = async (technicianId: string, isAvailable: boolean) => {
        try {
            console.log('🔄 Updating technician availability:', { technicianId, isAvailable })

            // For now, just update local state since we don't have an availability table yet
            // This could be extended to update technician_details table
            console.log('⚠️ Availability update: Currently updating local state only')

            setProfile(prev => prev ? { ...prev, isAvailable } : null)

            return {
                success: true,
                warning: 'Availability updated locally. Database integration pending.'
            }
        } catch (err) {
            console.error('Error updating availability:', err)

            return {
                success: true,
                warning: 'Availability updated locally only due to network/permission issues'
            }
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    return {
        profile,
        loading,
        error,
        refetch: fetchProfile,
        updateProfile,
        updateAvailability
    }
}

// Hook for managing technician earnings
export function useTechnicianEarnings() {
    const [earnings, setEarnings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchEarnings = async (period: 'week' | 'month' | 'year' = 'month') => {
        try {
            setLoading(true)
            setError(null)

            // TODO: Replace with real API call when backend endpoint is ready
            // const response = await apiService.get(`/technician/earnings?period=${period}`)

            // Mock earnings data
            const mockEarnings = {
                total: 485000,
                period: 125000,
                breakdown: [
                    { date: '2024-01-01', amount: 15000, jobs: 2 },
                    { date: '2024-01-02', amount: 12000, jobs: 1 },
                    { date: '2024-01-03', amount: 25000, jobs: 3 },
                    // ... more data
                ],
                pendingPayments: 45000,
                completedPayments: 80000
            }

            setEarnings(mockEarnings)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch earnings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEarnings()
    }, [])

    return {
        earnings,
        loading,
        error,
        refetch: fetchEarnings
    }
} 