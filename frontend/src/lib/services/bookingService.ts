/**
 * Booking Service for TechCare Frontend
 * Handles booking-related API calls using Next.js API routes and Supabase
 */

import { API_ENDPOINTS } from '@/lib/config/api'

// Simple API response interface
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}

// Simple ApiError class
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public code?: string,
        public details?: Record<string, any>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Backend booking categories
export type BookingCategory =
    | 'COMPUTER_REPAIR' | 'LAPTOP_REPAIR' | 'PHONE_REPAIR' | 'TABLET_REPAIR'
    | 'NETWORK_SETUP' | 'SOFTWARE_INSTALLATION' | 'DATA_RECOVERY'
    | 'VIRUS_REMOVAL' | 'HARDWARE_UPGRADE' | 'CONSULTATION'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

// Backend booking response format
export interface BackendBooking {
    id: string
    customerId: string
    technicianId: string | null
    title: string
    description: string
    category: BookingCategory
    status: BookingStatus
    scheduledAt: string | null
    location: string
    estimatedHours: number | null
    completedAt: string | null
    createdAt: string
    updatedAt: string
    customer: {
        id: string
        fullName: string
        email: string
        phoneNumber: string
    }
    technician: {
        id: string
        fullName: string
        email: string
        phoneNumber: string
    } | null
}

// Frontend booking format (for backward compatibility)
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

// Backend create booking format
export interface BackendCreateBookingData {
    technicianId?: string
    title: string
    description: string
    category: BookingCategory
    scheduledAt?: string
    location: string
    estimatedHours?: number
}

export interface BookingStats {
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
}

class BookingService {
    // Transform backend booking to frontend format
    private transformBooking(backendBooking: BackendBooking): Booking {
        return {
            id: backendBooking.id,
            technicianId: backendBooking.technicianId || '',
            customerId: backendBooking.customerId,
            technician: backendBooking.technician ? {
                name: backendBooking.technician.fullName,
                image: '/images/thisisengineering-hnXf73-K1zo-unsplash.jpg', // Default image
                rating: 4.8, // TODO: Get from reviews when implemented
                reviews: 100, // TODO: Get actual review count
                phone: backendBooking.technician.phoneNumber
            } : {
                name: 'Unassigned',
                image: '/images/thisisengineering-hnXf73-K1zo-unsplash.jpg',
                rating: 0,
                reviews: 0,
                phone: ''
            },
            service: this.formatCategory(backendBooking.category),
            description: backendBooking.description,
            date: backendBooking.scheduledAt ? new Date(backendBooking.scheduledAt).toLocaleDateString() : 'Not scheduled',
            time: backendBooking.scheduledAt ? new Date(backendBooking.scheduledAt).toLocaleTimeString() : '',
            location: backendBooking.location,
            price: `${(backendBooking.estimatedHours || 1) * 5000} RWF`, // TODO: Get actual pricing
            status: backendBooking.status.toLowerCase() as Booking['status'],
            bookingDate: new Date(backendBooking.createdAt).toLocaleDateString(),
            devices: [] // TODO: Extract from description or add to backend
        }
    }

    // Format category for display
    private formatCategory(category: BookingCategory): string {
        return category.split('_').map(word =>
            word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ')
    }

    // Map frontend service to backend category
    private mapServiceToCategory(service: string): BookingCategory {
        const serviceMap: Record<string, BookingCategory> = {
            'computer repair': 'COMPUTER_REPAIR',
            'laptop repair': 'LAPTOP_REPAIR',
            'phone repair': 'PHONE_REPAIR',
            'tablet repair': 'TABLET_REPAIR',
            'network setup': 'NETWORK_SETUP',
            'wifi setup': 'NETWORK_SETUP',
            'software installation': 'SOFTWARE_INSTALLATION',
            'data recovery': 'DATA_RECOVERY',
            'virus removal': 'VIRUS_REMOVAL',
            'hardware upgrade': 'HARDWARE_UPGRADE',
            'consultation': 'CONSULTATION'
        }

        const normalizedService = service.toLowerCase()
        for (const [key, value] of Object.entries(serviceMap)) {
            if (normalizedService.includes(key)) {
                return value
            }
        }

        return 'CONSULTATION' // Default category
    }

    // Get user's bookings
    async getUserBookings(): Promise<ApiResponse<Booking[]>> {
        try {
            const response = await fetch(API_ENDPOINTS.BOOKING.GET_ALL)
            const data: ApiResponse<BackendBooking[]> = await response.json()

            if (data.success && data.data) {
                const transformedBookings = data.data.map(booking =>
                    this.transformBooking(booking)
                )
                return {
                    success: true,
                    data: transformedBookings
                }
            }

            // ⚠️ FALLBACK LOGIC COMMENTED OUT - REAL API ONLY
            // console.warn('Failed to fetch bookings from API, using mock data')
            // const mockBookings = this.getMockBookings()
            // return {
            //     success: true,
            //     data: mockBookings
            // }

            return {
                success: false,
                error: data.error || 'Failed to fetch bookings'
            }
        } catch (error) {
            console.error('Error fetching bookings:', error)

            // ⚠️ FALLBACK LOGIC COMMENTED OUT - REAL API ONLY
            // const mockBookings = this.getMockBookings()
            // return {
            //     success: true,
            //     data: mockBookings
            // }

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch bookings'
            }
        }
    }

    // Create new booking
    async createBooking(bookingData: CreateBookingData): Promise<ApiResponse<Booking>> {
        try {
            // Prepare backend format
            const backendData: BackendCreateBookingData = {
                technicianId: bookingData.technicianId || undefined,
                title: bookingData.service,
                description: bookingData.description,
                category: this.mapServiceToCategory(bookingData.service),
                scheduledAt: this.combineDateAndTime(bookingData.date, bookingData.time),
                location: bookingData.location,
                estimatedHours: bookingData.urgency === 'urgent' ? 2 : 4 // Estimate based on urgency
            }

            const response = await fetch(API_ENDPOINTS.BOOKING.CREATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backendData)
            })
            const data: ApiResponse<{ booking: BackendBooking }> = await response.json()

            if (data.success && data.data) {
                const transformedBooking = this.transformBooking(data.data.booking)
                return {
                    success: true,
                    data: transformedBooking
                }
            }

            return {
                success: false,
                error: data.error || 'Failed to create booking'
            }
        } catch (error) {
            console.error('Error creating booking:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create booking'
            }
        }
    }

    // Helper to combine date and time strings
    private combineDateAndTime(date: string, time: string): string {
        try {
            // Parse date (assumes format like "2025-01-15")
            const datePart = new Date(date)

            // Extract time (assumes format like "2:00 PM - 4:00 PM", take start time)
            const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/)
            if (timeMatch) {
                let hours = parseInt(timeMatch[1])
                const minutes = parseInt(timeMatch[2])
                const period = timeMatch[3]

                if (period === 'PM' && hours !== 12) hours += 12
                if (period === 'AM' && hours === 12) hours = 0

                datePart.setHours(hours, minutes, 0, 0)
            }

            return datePart.toISOString()
        } catch {
            // Return current time if parsing fails
            return new Date().toISOString()
        }
    }

    // Update booking status
    async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<ApiResponse<Booking>> {
        try {
            // Convert frontend status to backend format
            const backendStatus = status.toUpperCase() as BookingStatus

            const response = await fetch(API_ENDPOINTS.BOOKING.UPDATE_STATUS(bookingId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: backendStatus })
            })
            const data: ApiResponse<{ booking: BackendBooking }> = await response.json()

            if (data.success && data.data) {
                const transformedBooking = this.transformBooking(data.data.booking)
                return {
                    success: true,
                    data: transformedBooking
                }
            }

            return {
                success: false,
                error: data.error || 'Failed to update booking status'
            }
        } catch (error) {
            console.error('Error updating booking status:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update booking'
            }
        }
    }

    // Cancel booking
    async cancelBooking(bookingId: string): Promise<ApiResponse<void>> {
        try {
            const response = await fetch(API_ENDPOINTS.BOOKING.UPDATE_STATUS(bookingId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'CANCELLED' })
            })
            const data: ApiResponse<void> = await response.json()

            if (data.success) {
                return {
                    success: true,
                    data: undefined
                }
            }

            return {
                success: false,
                error: data.error || 'Failed to cancel booking'
            }
        } catch (error) {
            console.error('Error cancelling booking:', error)
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

    // Get mock bookings data (fallback only)
    private getMockBookings(): Booking[] {
        // Default mock data for fallback
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

}

export const bookingService = new BookingService()
export default bookingService 