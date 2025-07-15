/**
 * Custom React Hook for Booking Data
 * Provides easy-to-use hooks for booking operations
 */

import { useState, useEffect } from 'react'
import { bookingService, Booking, CreateBookingData, BookingStats } from '@/lib/services/bookingService'

// Hook for getting user's bookings
export function useBookings() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchBookings = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await bookingService.getUserBookings()

            if (response.success && response.data) {
                setBookings(response.data)
            } else {
                setError(response.error || 'Failed to fetch bookings')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    return {
        bookings,
        loading,
        error,
        refetch: fetchBookings
    }
}

// Hook for creating bookings
export function useCreateBooking() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createBooking = async (bookingData: CreateBookingData): Promise<Booking | null> => {
        try {
            setLoading(true)
            setError(null)

            const response = await bookingService.createBooking(bookingData)

            if (response.success && response.data) {
                return response.data
            } else {
                setError(response.error || 'Failed to create booking')
                return null
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
            return null
        } finally {
            setLoading(false)
        }
    }

    return {
        createBooking,
        loading,
        error
    }
}

// Hook for booking operations (update, cancel)
export function useBookingOperations() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateStatus = async (bookingId: string, status: Booking['status']): Promise<boolean> => {
        try {
            setLoading(true)
            setError(null)

            const response = await bookingService.updateBookingStatus(bookingId, status)

            if (response.success) {
                return true
            } else {
                setError(response.error || 'Failed to update booking')
                return false
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
            return false
        } finally {
            setLoading(false)
        }
    }

    const cancelBooking = async (bookingId: string): Promise<boolean> => {
        try {
            setLoading(true)
            setError(null)

            const response = await bookingService.cancelBooking(bookingId)

            if (response.success) {
                return true
            } else {
                setError(response.error || 'Failed to cancel booking')
                return false
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        updateStatus,
        cancelBooking,
        loading,
        error
    }
}

// Hook for booking statistics
export function useBookingStats() {
    const [stats, setStats] = useState<BookingStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStats = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await bookingService.getBookingStats()

            if (response.success && response.data) {
                setStats(response.data)
            } else {
                setError(response.error || 'Failed to fetch booking stats')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
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