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
                image: '/placeholder-avatar.jpg' // Default image
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

            // Call our new status update API
            const response = await supabase
                .from('bookings')
                .update({ status, notes })
                .eq('id', bookingId)
                .select()
                .single();

            if (response.error) {
                console.warn('⚠️ Supabase update failed, updating local state only:', response.error.message)

                setBookings(prev =>
                    prev.map(booking =>
                        booking.id === bookingId
                            ? { ...booking, status, updatedAt: new Date().toISOString() }
                            : booking
                    )
                )

                return {
                    success: true,
                    warning: 'Status updated locally. Database update may require additional permissions.'
                }
            }

            // If API update succeeds, update local state with real data
            console.log('✅ Booking status updated successfully')

            setBookings(prev =>
                prev.map(booking =>
                    booking.id === bookingId
                        ? { ...booking, status, updatedAt: new Date().toISOString() }
                        : booking
                )
            )

            return { success: true }
        } catch (err) {
            console.error('Error updating booking status:', err)

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
                warning: 'Status updated locally only due to network/permission issues'
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

            // TODO: Replace with real API call when backend endpoint is ready
            const response = await supabase
                .from('technicians')
                .select('*')
                .eq('id', 't1') // Mock ID for now
                .single();

            if (response.data) {
                setProfile(response.data as TechnicianProfile);
            } else {
                // ⚠️ FALLBACK LOGIC COMMENTED OUT - REAL API ONLY
                // const mockProfile: TechnicianProfile = {
                //     id: "t1",
                //     name: "John Mugisha",
                //     email: "john.mugisha@example.com",
                //     phone: "+250 788 123 456",
                //     avatar: "/placeholder-avatar.jpg",
                //     specialization: "Computer Repair & Network Setup",
                //     experience: "5+ years",
                //     hourlyRate: 15000,
                //     isAvailable: true,
                //     location: "Kigali, Rwanda",
                //     bio: "Experienced computer technician specializing in hardware repair, network configuration, and system optimization. Available for both home and office visits.",
                //     skills: ["Computer Repair", "Network Setup", "Data Recovery", "Hardware Upgrade", "Software Installation"],
                //     certifications: ["CompTIA A+", "Network+ Certified", "Microsoft Certified"],
                //     workingHours: {
                //         start: "08:00",
                //         end: "18:00",
                //         days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                //     }
                // }
                // setProfile(mockProfile)

                setError('Failed to load profile data')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch profile')
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (updates: Partial<TechnicianProfile>) => {
        try {
            // TODO: Replace with real API call when backend endpoint is ready
            // const response = await apiService.patch('/technician/profile', updates)

            // Update local state for now
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

            // Call our availability update API
            const response = await supabase
                .from('technicians')
                .update({ is_available: isAvailable })
                .eq('id', technicianId)
                .select()
                .single();

            if (response.error) {
                console.warn('⚠️ Supabase availability update failed, updating local state only:', response.error.message)

                // Update local state optimistically
                setProfile(prev => prev ? { ...prev, isAvailable } : null)

                return {
                    success: true,
                    warning: 'Availability updated locally. Database update may require additional permissions.'
                }
            }

            // If API update succeeds, update local state
            console.log('✅ Technician availability updated successfully')
            setProfile(prev => prev ? { ...prev, isAvailable } : null)

            return { success: true }
        } catch (err) {
            console.error('Error updating availability:', err)

            // Fallback: update local state optimistically
            setProfile(prev => prev ? { ...prev, isAvailable } : null)

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