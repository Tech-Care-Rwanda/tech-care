/**
 * Custom React Hooks for Technician Dashboard
 * Provides hooks for technician-specific data and operations
 */

import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '@/lib/config/api'
import { BackendBooking, BookingCategory, BookingStatus } from '@/lib/services/bookingService'

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
export function useTechnicianStats() {
    const [stats, setStats] = useState<TechnicianStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStats = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch bookings to calculate stats
            const response = await apiService.get<BackendBooking[]>(API_ENDPOINTS.BOOKING.GET_ALL)

            if (response.success && response.data) {
                const bookings = response.data

                // Calculate stats from real bookings
                const currentMonth = new Date().getMonth()
                const currentYear = new Date().getFullYear()

                const completedBookings = bookings.filter(b => b.status === 'COMPLETED')
                const monthlyBookings = bookings.filter(b => {
                    const bookingDate = new Date(b.createdAt)
                    return bookingDate.getMonth() === currentMonth &&
                        bookingDate.getFullYear() === currentYear
                })

                const monthlyCompleted = monthlyBookings.filter(b => b.status === 'COMPLETED')

                // Calculate earnings (5000 RWF per hour as base rate)
                const calculateEarnings = (bookingList: BackendBooking[]) => {
                    return bookingList.reduce((total, booking) => {
                        const hours = booking.estimatedHours || 2
                        return total + (hours * 5000)
                    }, 0)
                }

                const stats: TechnicianStats = {
                    totalEarnings: calculateEarnings(completedBookings),
                    monthlyEarnings: calculateEarnings(monthlyCompleted),
                    completedJobs: completedBookings.length,
                    monthlyJobs: monthlyBookings.length,
                    rating: 4.8, // TODO: Calculate from reviews when implemented
                    totalReviews: 89, // TODO: Get from reviews
                    responseTime: "< 2 hours", // TODO: Calculate from response times
                    acceptanceRate: 94, // TODO: Calculate from accepted/rejected bookings
                    availabilityStatus: true // TODO: Get from technician profile
                }

                setStats(stats)
            } else {
                // ⚠️ FALLBACK LOGIC COMMENTED OUT - REAL API ONLY
                // const mockStats: TechnicianStats = {
                //     totalEarnings: 485000,
                //     monthlyEarnings: 125000,
                //     completedJobs: 127,
                //     monthlyJobs: 18,
                //     rating: 4.8,
                //     totalReviews: 89,
                //     responseTime: "< 2 hours",
                //     acceptanceRate: 94,
                //     availabilityStatus: true
                // }
                // setStats(mockStats)

                setError('No booking data available')
            }
        } catch (err) {
            console.error('Error fetching technician stats:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch stats')

            // ⚠️ FALLBACK LOGIC COMMENTED OUT - REAL API ONLY
            // const mockStats: TechnicianStats = {
            //     totalEarnings: 485000,
            //     monthlyEarnings: 125000,
            //     completedJobs: 127,
            //     monthlyJobs: 18,
            //     rating: 4.8,
            //     totalReviews: 89,
            //     responseTime: "< 2 hours",
            //     acceptanceRate: 94,
            //     availabilityStatus: true
            // }
            // setStats(mockStats)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    return {
        stats,
        loading,
        error,
        refetch: fetchStats
    }
}

// Hook for technician bookings
export function useTechnicianBookings() {
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

    const fetchBookings = async (technicianId: string) => {
        try {
            setLoading(true)
            setError(null)

            console.log('🔍 Fetching bookings for technician:', technicianId)

            // Fetch real bookings from our new API endpoint
            const response = await fetch(`/api/bookings/technician/${technicianId}`)
            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to fetch bookings')
            }

            console.log('✅ Received technician bookings:', result.bookings)

            if (result.bookings && result.bookings.length > 0) {
                const transformedBookings = result.bookings.map((booking: any) =>
                    transformDatabaseBooking(booking)
                )
                setBookings(transformedBookings)
                console.log('📝 Transformed bookings:', transformedBookings)
            } else {
                setBookings([])
                console.log('📋 No bookings found for technician')
            }
        } catch (err) {
            console.error('Error fetching technician bookings:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
            setBookings([])
        } finally {
            setLoading(false)
        }
    }

    const updateBookingStatus = async (bookingId: string, status: TechnicianBooking['status'], notes?: string) => {
        try {
            console.log('🔄 Updating booking status:', { bookingId, status, notes })

            // Call our new status update API
            const response = await fetch(`/api/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status, notes })
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                // If API update fails due to RLS, update local state optimistically
                console.warn('⚠️ API update failed, updating local state only:', result.error)

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
        // Don't auto-fetch on mount, wait for technician ID
    }, [])

    return {
        bookings,
        loading,
        error,
        fetchBookings, // Now requires technicianId parameter
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
            const response = await apiService.get('/technician/profile')

            if (response.success && response.data) {
                setProfile(response.data)
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
            const response = await fetch(`/api/technicians/${technicianId}/availability`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_available: isAvailable })
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                console.warn('⚠️ API availability update failed, updating local state only:', result.error)

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