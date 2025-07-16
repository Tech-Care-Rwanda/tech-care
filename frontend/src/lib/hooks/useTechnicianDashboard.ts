/**
 * Custom React Hooks for Technician Dashboard
 * Provides hooks for technician-specific data and operations
 */

import { useState, useEffect } from 'react'
import { apiService, ApiResponse } from '@/lib/services/api'

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

            // TODO: Replace with real API call when backend endpoint is ready
            // const response = await apiService.get('/technician/stats')

            // Mock data for now
            const mockStats: TechnicianStats = {
                totalEarnings: 485000,
                monthlyEarnings: 125000,
                completedJobs: 127,
                monthlyJobs: 18,
                rating: 4.8,
                totalReviews: 89,
                responseTime: "< 2 hours",
                acceptanceRate: 94,
                availabilityStatus: true
            }

            setStats(mockStats)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stats')
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

    const fetchBookings = async () => {
        try {
            setLoading(true)
            setError(null)

            // TODO: Replace with real API call when backend endpoint is ready
            // const response = await apiService.get('/technician/bookings')

            // Mock data for now
            const mockBookings: TechnicianBooking[] = [
                {
                    id: "1",
                    customer: {
                        id: "c1",
                        name: "Sarah Mukamana",
                        phone: "+250 788 123 456",
                        email: "sarah@example.com",
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
                        id: "c2",
                        name: "Jean Claude Habimana",
                        phone: "+250 788 987 654",
                        email: "jean@example.com",
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
                }
            ]

            setBookings(mockBookings)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
        } finally {
            setLoading(false)
        }
    }

    const updateBookingStatus = async (bookingId: string, status: TechnicianBooking['status']) => {
        try {
            // TODO: Replace with real API call when backend endpoint is ready
            // const response = await apiService.patch(`/technician/bookings/${bookingId}`, { status })

            // Update local state for now
            setBookings(prev =>
                prev.map(booking =>
                    booking.id === bookingId
                        ? { ...booking, status, updatedAt: new Date().toISOString() }
                        : booking
                )
            )

            return { success: true }
        } catch (err) {
            return {
                success: false,
                error: err instanceof Error ? err.message : 'Failed to update booking'
            }
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    return {
        bookings,
        loading,
        error,
        refetch: fetchBookings,
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
            // const response = await apiService.get('/technician/profile')

            // Mock data for now
            const mockProfile: TechnicianProfile = {
                id: "t1",
                name: "John Mugisha",
                email: "john.mugisha@example.com",
                phone: "+250 788 123 456",
                avatar: "/placeholder-avatar.jpg",
                specialization: "Computer Repair & Network Setup",
                experience: "5+ years",
                hourlyRate: 15000,
                isAvailable: true,
                location: "Kigali, Rwanda",
                bio: "Experienced computer technician specializing in hardware repair, network configuration, and system optimization. Available for both home and office visits.",
                skills: ["Computer Repair", "Network Setup", "Data Recovery", "Hardware Upgrade", "Software Installation"],
                certifications: ["CompTIA A+", "Network+ Certified", "Microsoft Certified"],
                workingHours: {
                    start: "08:00",
                    end: "18:00",
                    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                }
            }

            setProfile(mockProfile)
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

    const updateAvailability = async (isAvailable: boolean) => {
        try {
            // TODO: Replace with real API call when backend endpoint is ready
            // const response = await apiService.patch('/technician/availability', { isAvailable })

            // Update local state for now
            setProfile(prev => prev ? { ...prev, isAvailable } : null)

            return { success: true }
        } catch (err) {
            return {
                success: false,
                error: err instanceof Error ? err.message : 'Failed to update availability'
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