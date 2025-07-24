/**
 * Technician Service for TechCare Frontend
 * Handles technician-related API calls using Next.js API routes and Supabase
 */

import { API_ENDPOINTS } from '@/lib/config/api'

// Simple API response interface
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}

export interface Technician {
    id: string
    name: string
    avatar?: string
    rating: number
    reviewCount: number
    specialties: string[]
    location: string
    hourlyRate: number
    available: boolean
    responseTime: string
    completedJobs: number
    description: string
    verified: boolean
    distance?: number
    saved?: boolean
    technicianDetails?: {
        id: number
        gender: string
        age: number
        DateOfBirth: string
        experience: string
        specialization: string
        imageUtl?: string
        certificateUrl: string
        isAvailable: boolean
        rate: number
        approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
    }
}

export interface SearchFilters {
    location?: string
    specialty?: string
    priceRange?: [number, number]
    rating?: number
    availability?: string
    distance?: number
}

export interface SavedTechnician extends Technician {
    category: string
    notes: string
    savedDate: string
    lastBooked?: string
    totalBookings: number
}

class TechnicianService {
    // Get all approved technicians
    async getAllTechnicians(): Promise<ApiResponse<Technician[]>> {
        // Note: This method is deprecated. Use Supabase service directly instead.
        console.warn('getAllTechnicians is deprecated. Use Supabase service directly.')
        return {
            success: false,
            error: 'This method is deprecated. Use Supabase service directly.'
        }
    }

    // Search technicians with filters
    async searchTechnicians(filters: SearchFilters): Promise<ApiResponse<Technician[]>> {
        try {
            // For now, get all technicians and filter client-side
            // TODO: Implement backend filtering
            const response = await this.getAllTechnicians()

            if (response.success && response.data) {
                let filteredTechnicians = response.data

                // Apply filters
                if (filters.specialty) {
                    filteredTechnicians = filteredTechnicians.filter(tech =>
                        tech.specialties.some(spec =>
                            spec.toLowerCase().includes(filters.specialty!.toLowerCase())
                        )
                    )
                }

                if (filters.rating) {
                    filteredTechnicians = filteredTechnicians.filter(tech =>
                        tech.rating >= filters.rating!
                    )
                }

                if (filters.availability === 'available') {
                    filteredTechnicians = filteredTechnicians.filter(tech => tech.available)
                }

                if (filters.priceRange) {
                    filteredTechnicians = filteredTechnicians.filter(tech =>
                        tech.hourlyRate >= filters.priceRange![0] &&
                        tech.hourlyRate <= filters.priceRange![1]
                    )
                }

                if (filters.distance) {
                    filteredTechnicians = filteredTechnicians.filter(tech =>
                        tech.distance && tech.distance <= filters.distance!
                    )
                }

                return {
                    success: true,
                    data: filteredTechnicians
                }
            }

            return response
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to search technicians'
            }
        }
    }

    // Get technician by ID
    async getTechnicianById(id: string): Promise<ApiResponse<Technician>> {
        try {
            const response = await fetch(`${API_ENDPOINTS.ADMIN.GET_TECHNICIAN_DETAILS(id)}`)
            const data = await response.json()

            if (response.ok && data) {
                const tech = data
                const technician: Technician = {
                    id: tech.id.toString(),
                    name: tech.fullName,
                    avatar: tech.technicianDetails?.imageUtl || '/placeholder-avatar.jpg',
                    rating: tech.technicianDetails?.rate || 0,
                    reviewCount: Math.floor(Math.random() * 100) + 10,
                    specialties: tech.technicianDetails?.specialization ? [tech.technicianDetails.specialization] : [],
                    location: 'Kigali',
                    hourlyRate: Math.floor(Math.random() * 15000) + 10000,
                    available: tech.technicianDetails?.isAvailable || false,
                    responseTime: '< 2 hours',
                    completedJobs: Math.floor(Math.random() * 200) + 50,
                    description: `Experienced ${tech.technicianDetails?.specialization} specialist with ${tech.technicianDetails?.experience} of experience.`,
                    verified: tech.technicianDetails?.approvalStatus === 'APPROVED',
                    technicianDetails: tech.technicianDetails
                }

                return {
                    success: true,
                    data: technician
                }
            }

            return {
                success: false,
                error: 'Failed to fetch technician details'
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch technician details'
            }
        }
    }

    // Get mock data for development (until backend endpoints are complete)
    getMockTechnicians(): Technician[] {
        return [
            {
                id: "1",
                name: "Marie Uwimana",
                avatar: "/placeholder-avatar.jpg",
                rating: 4.8,
                reviewCount: 42,
                specialties: ["Computer Repair", "Network Setup", "Data Recovery"],
                location: "Kigali City",
                hourlyRate: 15000,
                available: true,
                responseTime: "< 1 hour",
                completedJobs: 127,
                description: "Experienced computer technician specializing in hardware repair and network configuration. 5+ years of experience.",
                verified: true,
                distance: 2.5,
                saved: false
            },
            {
                id: "2",
                name: "Jean Baptiste",
                avatar: "/placeholder-avatar.jpg",
                rating: 4.6,
                reviewCount: 38,
                specialties: ["Mobile Repair", "Software Installation", "Virus Removal"],
                location: "Nyamirambo",
                hourlyRate: 12000,
                available: true,
                responseTime: "< 2 hours",
                completedJobs: 89,
                description: "Mobile device specialist with expertise in screen repairs, software troubleshooting, and device optimization.",
                verified: true,
                distance: 5.2,
                saved: true
            },
            {
                id: "3",
                name: "David Nkusi",
                avatar: "/placeholder-avatar.jpg",
                rating: 4.9,
                reviewCount: 67,
                specialties: ["Hardware Upgrade", "Gaming Setup", "Custom Builds"],
                location: "Remera",
                hourlyRate: 20000,
                available: false,
                responseTime: "< 3 hours",
                completedJobs: 156,
                description: "Expert in custom computer builds and gaming setups. Certified in multiple hardware platforms.",
                verified: true,
                distance: 8.1
            }
        ]
    }

    // Save/unsave technician (local storage for now)
    saveTechnician(technicianId: string): void {
        const saved = this.getSavedTechnicianIds()
        if (!saved.includes(technicianId)) {
            saved.push(technicianId)
            localStorage.setItem('saved-technicians', JSON.stringify(saved))
        }
    }

    unsaveTechnician(technicianId: string): void {
        const saved = this.getSavedTechnicianIds()
        const updated = saved.filter(id => id !== technicianId)
        localStorage.setItem('saved-technicians', JSON.stringify(updated))
    }

    getSavedTechnicianIds(): string[] {
        try {
            const saved = localStorage.getItem('saved-technicians')
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    }

    isTechnicianSaved(technicianId: string): boolean {
        return this.getSavedTechnicianIds().includes(technicianId)
    }
}

export const technicianService = new TechnicianService()
export default technicianService 