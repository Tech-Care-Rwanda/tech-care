"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SafeAvatar } from '@/components/ui/safe-avatar'
import { Input } from '@/components/ui/input'
import {
    Search,
    Star,
    MapPin,
    Phone,
    Calendar,
    Filter,
    Grid,
    List,
    Users,
    Clock,
    DollarSign
} from 'lucide-react'
import { supabaseService } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TechnicianCard {
    id: string
    full_name: string
    specialization: string
    experience: string
    phone_number: string
    rate?: number
    is_available: boolean
    rating?: number
    totalJobs?: number
    image_url?: string
    created_at: string
}

const SERVICE_CATEGORIES = [
    'All',
    'Computer Repair',
    'Phone Repair',
    'Network Setup',
    'Laptop Repair',
    'iPhone Repair'
]

export default function AllTechniciansPage() {
    const [technicians, setTechnicians] = useState<TechnicianCard[]>([])
    const [filteredTechnicians, setFilteredTechnicians] = useState<TechnicianCard[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const router = useRouter()

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                setLoading(true)
                setError(null)

                console.log('🔍 Fetching all technicians for directory...')
                const data = await supabaseService.getTechnicians(true)

                if (data && data.length > 0) {
                    console.log('✅ Loaded technicians for directory:', data.length)
                    setTechnicians(data)
                    setFilteredTechnicians(data)
                } else {
                    console.log('⚠️ No technicians found')
                    setTechnicians([])
                    setFilteredTechnicians([])
                }
            } catch (err) {
                console.error('❌ Error fetching technicians:', err)
                setError(err instanceof Error ? err.message : 'Failed to load technicians')
            } finally {
                setLoading(false)
            }
        }

        fetchTechnicians()
    }, [])

    // Filter technicians based on search and category
    useEffect(() => {
        let filtered = technicians

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(tech =>
                tech.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tech.specialization.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Apply category filter
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(tech =>
                tech.specialization.toLowerCase().includes(selectedCategory.toLowerCase())
            )
        }

        setFilteredTechnicians(filtered)
    }, [searchQuery, selectedCategory, technicians])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0
        }).format(amount)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#FF385C' }}></div>
                        <p className="text-gray-600">Loading all technicians...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Technicians</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">All Technicians</h1>
                    <p className="text-gray-600">Browse our network of verified tech experts in Kigali, Rwanda</p>
                </div>

                {/* Filters & Search */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search technicians or specializations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2">
                                {SERVICE_CATEGORIES.map((category) => (
                                    <Button
                                        key={category}
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                        className={selectedCategory === category ? "text-white" : ""}
                                        style={selectedCategory === category ? { backgroundColor: '#FF385C' } : {}}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === 'grid' ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredTechnicians.length} of {technicians.length} technicians
                        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                        {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                </div>

                {/* Technicians Grid/List */}
                {filteredTechnicians.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Technicians Found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchQuery || selectedCategory !== 'All'
                                    ? 'Try adjusting your filters or search terms.'
                                    : 'No technicians are currently available.'
                                }
                            </p>
                            {(searchQuery || selectedCategory !== 'All') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('')
                                        setSelectedCategory('All')
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    }>
                        {filteredTechnicians.map((technician) => (
                            <Card key={technician.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className={viewMode === 'grid' ? "p-6" : "p-4"}>
                                    <div className={viewMode === 'grid' ? "text-center" : "flex items-center space-x-4"}>

                                        {/* Avatar */}
                                        <SafeAvatar
                                            src={technician.image_url}
                                            fallback={technician.full_name?.[0] || 'T'}
                                            className={viewMode === 'grid' ? "w-20 h-20 mx-auto mb-4" : "w-16 h-16"}
                                        />

                                        <div className={viewMode === 'grid' ? "" : "flex-1"}>
                                            {/* Name & Specialization */}
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {technician.full_name}
                                            </h3>
                                            <p className="text-gray-600 mb-2">{technician.specialization}</p>

                                            {/* Stats */}
                                            <div className={`flex items-center gap-4 mb-4 ${viewMode === 'grid' ? 'justify-center' : ''}`}>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="text-sm font-medium">{technician.rating?.toFixed(1) || '4.5'}</span>
                                                </div>

                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{technician.totalJobs || 0} jobs</span>
                                                </div>

                                                {technician.rate && (
                                                    <div className="flex items-center space-x-1">
                                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{formatCurrency(technician.rate)}/hr</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Availability & Experience */}
                                            <div className={`flex items-center gap-2 mb-4 ${viewMode === 'grid' ? 'justify-center' : ''}`}>
                                                <Badge variant={technician.is_available ? "default" : "secondary"}>
                                                    {technician.is_available ? 'Available' : 'Busy'}
                                                </Badge>
                                                <span className="text-sm text-gray-500">{technician.experience}</span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className={`flex gap-2 ${viewMode === 'grid' ? 'justify-center' : ''}`}>
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                >
                                                    <Link href={`/technician/${technician.id}`}>
                                                        View Profile
                                                    </Link>
                                                </Button>

                                                <Button
                                                    asChild
                                                    size="sm"
                                                    disabled={!technician.is_available}
                                                    className="flex-1 text-white hover:opacity-90"
                                                    style={{ backgroundColor: '#FF385C' }}
                                                >
                                                    <Link href={`/book/${technician.id}`}>
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        Book Now
                                                    </Link>
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(`tel:${technician.phone_number}`)}
                                                >
                                                    <Phone className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 