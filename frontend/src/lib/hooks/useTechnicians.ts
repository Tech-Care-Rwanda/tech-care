/**
 * Custom React Hook for Technician Data
 * Provides easy-to-use hooks for technician operations
 */

import { useState, useEffect } from 'react'
import { technicianService, Technician, SearchFilters } from '@/lib/services/technicianService'

// Hook for getting all technicians
export function useTechnicians() {
    const [technicians, setTechnicians] = useState<Technician[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchTechnicians = async () => {
        try {
            setLoading(true)
            setError(null)

            // Try to get real data from backend first
            const response = await technicianService.getAllTechnicians()

            if (response.success && response.data && response.data.length > 0) {
                setTechnicians(response.data)
            } else {
                // ⚠️ FALLBACK LOGIC COMMENTED OUT - REAL API ONLY
                // console.warn('Backend not available, using mock data')
                // setTechnicians(technicianService.getMockTechnicians())
                
                setError('Failed to load technicians from API')
            }
        } catch (err) {
            console.warn('Error fetching technicians:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch technicians')
            // ⚠️ FALLBACK LOGIC COMMENTED OUT - REAL API ONLY
            // setTechnicians(technicianService.getMockTechnicians())
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTechnicians()
    }, [])

    return {
        technicians,
        loading,
        error,
        refetch: fetchTechnicians
    }
}

// Hook for searching technicians with filters
export function useSearchTechnicians(filters: SearchFilters) {
    const [technicians, setTechnicians] = useState<Technician[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const searchTechnicians = async (searchFilters: SearchFilters) => {
        try {
            setLoading(true)
            setError(null)

            // Try to get real data from backend first
            const response = await technicianService.searchTechnicians(searchFilters)

            if (response.success && response.data) {
                setTechnicians(response.data)
            } else {
                // ⚠️ FALLBACK LOGIC COMMENTED OUT - REAL API ONLY
                // console.warn('Backend search not available, using mock data')
                // const mockData = technicianService.getMockTechnicians()
                // let filtered = mockData

                // // Apply basic filters to mock data
                // if (searchFilters.specialty) {
                //     filtered = filtered.filter(tech =>
                //         tech.specialties.some(spec =>
                //             spec.toLowerCase().includes(searchFilters.specialty!.toLowerCase())
                //         )
                //     )
                // }

                // if (searchFilters.availability === 'available') {
                //     filtered = filtered.filter(tech => tech.available)
                // }

                // setTechnicians(filtered)
                
                setError('Search failed - no data from API')
            }
        } catch (err) {
            console.warn('Error searching technicians:', err)
            setError(err instanceof Error ? err.message : 'Search failed')
            // ⚠️ FALLBACK LOGIC COMMENTED OUT - REAL API ONLY
            // setTechnicians(technicianService.getMockTechnicians())
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        searchTechnicians(filters)
    }, [filters.specialty, filters.availability, filters.rating, filters.distance])

    return {
        technicians,
        loading,
        error,
        searchTechnicians
    }
}

// Hook for getting a single technician by ID
export function useTechnician(id: string) {
    const [technician, setTechnician] = useState<Technician | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchTechnician = async () => {
        if (!id) return

        try {
            setLoading(true)
            setError(null)

            // Try to get real data from backend first
            const response = await technicianService.getTechnicianById(id)

            if (response.success && response.data) {
                setTechnician(response.data)
            } else {
                // Fallback to mock data
                console.warn('Backend not available, using mock data')
                const mockData = technicianService.getMockTechnicians()
                const mockTechnician = mockData.find(tech => tech.id === id)
                setTechnician(mockTechnician || null)
            }
        } catch (err) {
            console.warn('Error fetching technician, using mock data:', err)
            const mockData = technicianService.getMockTechnicians()
            const mockTechnician = mockData.find(tech => tech.id === id)
            setTechnician(mockTechnician || null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTechnician()
    }, [id])

    return {
        technician,
        loading,
        error,
        refetch: fetchTechnician
    }
}

// Hook for managing saved technicians
export function useSavedTechnicians() {
    const [savedIds, setSavedIds] = useState<string[]>([])

    useEffect(() => {
        setSavedIds(technicianService.getSavedTechnicianIds())
    }, [])

    const saveTechnician = (technicianId: string) => {
        technicianService.saveTechnician(technicianId)
        setSavedIds(technicianService.getSavedTechnicianIds())
    }

    const unsaveTechnician = (technicianId: string) => {
        technicianService.unsaveTechnician(technicianId)
        setSavedIds(technicianService.getSavedTechnicianIds())
    }

    const isSaved = (technicianId: string) => {
        return technicianService.isTechnicianSaved(technicianId)
    }

    return {
        savedIds,
        saveTechnician,
        unsaveTechnician,
        isSaved
    }
} 