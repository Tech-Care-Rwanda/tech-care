/**
 * Booking Service for TechCare Frontend
 * Handles booking-related API calls and mock data until backend is ready
 */

import { apiService, ApiResponse } from './api'

export interface Booking {
    id: string
    technicianId: string
    customerId: string
    technician: {
        name: string
        image: string
        rating: number
        reviews: number
        phone: string
    }
    service: string
    description: string
    date: string
    time: string
    location: string
    price: string
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
    bookingDate: string
    devices?: string[]
}

export interface CreateBookingData {
    technicianId: string
    service: string
    description: string
    date: string
    time: string
    location: string
    urgency: 'standard' | 'urgent'
    deviceCount: number
}

export interface BookingStats {
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
}

class BookingService {
    // Get user's bookings
    async getUserBookings(): Promise<ApiResponse<Booking[]>> {
        try {
            // TODO: Implement real API call when backend is ready
            // const response = await apiService.get('/bookings')

            // For now, return mock data
            const mockBookings = this.getMockBookings()

            return {
                success: true,
                data: mockBookings
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch bookings'
            }
        }
    }

    // Create new booking
    async createBooking(bookingData: CreateBookingData): Promise<ApiResponse<Booking>> {
        try {
            // TODO: Implement real API call when backend is ready
            // const response = await apiService.post('/bookings', bookingData)

            // For now, create mock booking
            const mockBooking: Booking = {
                id: Date.now().toString(),
                technicianId: bookingData.technicianId,
                customerId: 'current-user', // TODO: Get from auth context
                technician: {
                    name: 'John Mugisha', // TODO: Get from technician data
                    image: '/images/thisisengineering-hnXf73-K1zo-unsplash.jpg',
                    rating: 5.0,
                    reviews: 318,
                    phone: '+250 788 123 456'
                },
                service: bookingData.service,
                description: bookingData.description,
                date: bookingData.date,
                time: bookingData.time,
                location: bookingData.location,
                price: '15,000 RWF',
                status: 'pending',
                bookingDate: new Date().toISOString(),
                devices: [`${bookingData.deviceCount} device(s)`]
            }

            // Store in localStorage for now
            this.storeBookingLocally(mockBooking)

            return {
                success: true,
                data: mockBooking
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create booking'
            }
        }
    }

    // Update booking status
    async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<ApiResponse<Booking>> {
        try {
            // TODO: Implement real API call when backend is ready
            // const response = await apiService.put(`/bookings/${bookingId}`, { status })

            // For now, update mock data
            const bookings = this.getMockBookings()
            const booking = bookings.find(b => b.id === bookingId)

            if (!booking) {
                return {
                    success: false,
                    error: 'Booking not found'
                }
            }

            booking.status = status

            return {
                success: true,
                data: booking
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update booking'
            }
        }
    }

    // Cancel booking
    async cancelBooking(bookingId: string): Promise<ApiResponse<void>> {
        try {
            // TODO: Implement real API call when backend is ready
            // const response = await apiService.delete(`/bookings/${bookingId}`)

            return this.updateBookingStatus(bookingId, 'cancelled')
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to cancel booking'
            }
        }
    }

    // Get booking statistics
    async getBookingStats(): Promise<ApiResponse<BookingStats>> {
        try {
            const bookingsResponse = await this.getUserBookings()

            if (!bookingsResponse.success || !bookingsResponse.data) {
                return {
                    success: false,
                    error: 'Failed to get booking data'
                }
            }

            const bookings = bookingsResponse.data
            const stats: BookingStats = {
                total: bookings.length,
                pending: bookings.filter(b => b.status === 'pending').length,
                confirmed: bookings.filter(b => b.status === 'confirmed').length,
                completed: bookings.filter(b => b.status === 'completed').length,
                cancelled: bookings.filter(b => b.status === 'cancelled').length
            }

            return {
                success: true,
                data: stats
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get booking stats'
            }
        }
    }

    // Get mock bookings data
    getMockBookings(): Booking[] {
        // Try to get from localStorage first
        const stored = this.getStoredBookings()
        if (stored.length > 0) {
            return stored
        }

        // Default mock data
        return [
            {
                id: "1",
                technicianId: "1",
                customerId: "current-user",
                technician: {
                    name: "John Mugisha",
                    image: "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg",
                    rating: 5.0,
                    reviews: 318,
                    phone: "+250 788 123 456"
                },
                service: "Computer Setup & Network Configuration",
                description: "Complete setup of 2 desktop computers and wireless network configuration for home office",
                date: "Today, January 15, 2025",
                time: "2:00 PM - 4:00 PM",
                location: "Kigali, Kimisagara - KG 123 St",
                price: "15,000 RWF",
                status: "confirmed",
                bookingDate: "January 12, 2025",
                devices: ["2 Desktop Computers", "1 Router", "Network Setup"]
            },
            {
                id: "2",
                technicianId: "2",
                customerId: "current-user",
                technician: {
                    name: "Marie Uwimana",
                    image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
                    rating: 4.9,
                    reviews: 256,
                    phone: "+250 788 654 321"
                },
                service: "WiFi & Smart Home Setup",
                description: "WiFi network setup and smart device configuration including security cameras",
                date: "Tomorrow, January 16, 2025",
                time: "10:00 AM - 12:00 PM",
                location: "Kigali, Nyamirambo - KG 456 St",
                price: "12,000 RWF",
                status: "pending",
                bookingDate: "January 13, 2025",
                devices: ["Smart TV", "2 Security Cameras", "Smart Speakers"]
            },
            {
                id: "3",
                technicianId: "3",
                customerId: "current-user",
                technician: {
                    name: "Eric Nkurunziza",
                    image: "/images/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg",
                    rating: 4.8,
                    reviews: 189,
                    phone: "+250 788 987 654"
                },
                service: "Mobile Device Solutions",
                description: "Screen replacement and data recovery for iPhone 12",
                date: "January 10, 2025",
                time: "3:00 PM - 4:00 PM",
                location: "Kigali, Kacyiru - KG 789 St",
                price: "8,000 RWF",
                status: "completed",
                bookingDate: "January 8, 2025",
                devices: ["iPhone 12", "Data Recovery"]
            },
            {
                id: "4",
                technicianId: "4",
                customerId: "current-user",
                technician: {
                    name: "Grace Mukandayisenga",
                    image: "/images/md-riduwan-molla-ZO0weaaDrBs-unsplash.jpg",
                    rating: 4.7,
                    reviews: 142,
                    phone: "+250 788 111 222"
                },
                service: "Laptop Repair Service",
                description: "Hardware diagnosis and repair for Dell Latitude laptop",
                date: "January 8, 2025",
                time: "1:00 PM - 2:30 PM",
                location: "Kigali, Remera - KG 321 St",
                price: "10,000 RWF",
                status: "cancelled",
                bookingDate: "January 5, 2025",
                devices: ["Dell Latitude Laptop"]
            }
        ]
    }

    // Local storage helpers
    private storeBookingLocally(booking: Booking): void {
        const stored = this.getStoredBookings()
        stored.push(booking)
        localStorage.setItem('techcare-bookings', JSON.stringify(stored))
    }

    private getStoredBookings(): Booking[] {
        try {
            const stored = localStorage.getItem('techcare-bookings')
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    }
}

export const bookingService = new BookingService()
export default bookingService 