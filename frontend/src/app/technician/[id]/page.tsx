"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SafeAvatar } from '@/components/ui/safe-avatar'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    MapPin,
    Star,
    Phone,
    MessageCircle,
    Calendar,
    Award,
    Clock,
    DollarSign,
    User,
    Wrench
} from 'lucide-react'
import { supabaseService } from '@/lib/supabase'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import Link from 'next/link'

interface TechnicianProfile {
    id: string
    full_name: string
    email: string
    phone_number: string
    specialization: string
    experience: string
    bio?: string
    hourly_rate?: number
    rate?: number
    is_available: boolean
    rating?: number
    totalJobs?: number
    image_url?: string
    created_at: string
}

export default function TechnicianProfilePage() {
    const params = useParams()
    const router = useRouter()
    const { profile: currentUser } = useSupabaseAuth()
    const [technician, setTechnician] = useState<TechnicianProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const technicianId = params.id as string

    useEffect(() => {
        const fetchTechnicianProfile = async () => {
            if (!technicianId) return

            try {
                setLoading(true)
                setError(null)

                console.log('🔍 Fetching technician profile for ID:', technicianId)

                const technicianData = await supabaseService.getTechnicianById(technicianId)

                if (!technicianData) {
                    throw new Error('Technician not found')
                }

                console.log('✅ Technician profile loaded:', technicianData)
                setTechnician(technicianData)

            } catch (err) {
                console.error('❌ Error fetching technician profile:', err)
                setError(err instanceof Error ? err.message : 'Failed to load technician profile')
            } finally {
                setLoading(false)
            }
        }

        fetchTechnicianProfile()
    }, [technicianId])

    const handleBookNow = () => {
        if (!currentUser) {
            // Redirect to login if not authenticated
            router.push(`/login?redirect=/book/${technicianId}`)
            return
        }

        // Redirect to booking page
        router.push(`/book/${technicianId}`)
    }

    const handleCall = () => {
        if (technician?.phone_number) {
            window.open(`tel:${technician.phone_number}`)
        }
    }

    const handleMessage = () => {
        if (technician?.phone_number) {
            window.open(`sms:${technician.phone_number}?body=Hi, I'm interested in your technical services.`)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0
        }).format(amount)
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#FF385C' }}></div>
                        <p className="text-gray-600">Loading technician profile...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !technician) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Technician Not Found</h2>
                        <p className="text-gray-600 mb-4">{error || 'The technician you are looking for does not exist.'}</p>
                        <Button asChild variant="outline">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Back Button */}
                <div className="mb-6">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Technicians
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Card */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Header */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
                                    <SafeAvatar
                                        src={technician.image_url}
                                        fallback={technician.full_name?.[0] || 'T'}
                                        className="w-24 h-24 mx-auto sm:mx-0 mb-4 sm:mb-0"
                                    />

                                    <div className="flex-1 text-center sm:text-left">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{technician.full_name}</h1>
                                        <p className="text-lg text-gray-600 mb-3">{technician.specialization}</p>

                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-4">
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="font-medium">{technician.rating?.toFixed(1) || '4.5'}</span>
                                                <span className="text-gray-500">({technician.totalJobs || 0} jobs)</span>
                                            </div>

                                            <Badge variant={technician.is_available ? "default" : "secondary"}>
                                                {technician.is_available ? 'Available' : 'Busy'}
                                            </Badge>

                                            <div className="flex items-center space-x-1 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">Kigali, Rwanda</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Button
                                                onClick={handleBookNow}
                                                disabled={!technician.is_available}
                                                className="text-white hover:opacity-90"
                                                style={{ backgroundColor: '#FF385C' }}
                                            >
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {technician.is_available ? 'Book Now' : 'Currently Unavailable'}
                                            </Button>

                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={handleCall}>
                                                    <Phone className="w-4 h-4 mr-1" />
                                                    Call
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={handleMessage}>
                                                    <MessageCircle className="w-4 h-4 mr-1" />
                                                    Message
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* About Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    About {technician.full_name?.split(' ')[0]}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">
                                    {technician.bio || `Experienced ${technician.specialization.toLowerCase()} specialist with ${technician.experience} in the field. Dedicated to providing high-quality technical support and solutions for all your needs.`}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Experience & Skills */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Award className="w-5 h-5 mr-2" />
                                    Experience & Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                                    <p className="text-gray-700">{technician.experience}</p>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Specialization</h4>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        {technician.specialization}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Star className="w-4 h-4 text-yellow-400" />
                                        <span className="text-sm text-gray-600">Rating</span>
                                    </div>
                                    <span className="font-semibold">{technician.rating?.toFixed(1) || '4.5'}/5</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Wrench className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Jobs Completed</span>
                                    </div>
                                    <span className="font-semibold">{technician.totalJobs || 0}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Response Time</span>
                                    </div>
                                    <span className="font-semibold">~2 hours</span>
                                </div>

                                {(technician.rate || technician.hourly_rate) && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">Rate</span>
                                        </div>
                                        <span className="font-semibold">
                                            {formatCurrency(technician.rate || technician.hourly_rate || 15000)}/hr
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{technician.phone_number}</span>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">Kigali, Rwanda</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Availability Notice */}
                        <Card className={`border-2 ${technician.is_available ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
                            <CardContent className="p-4">
                                <h3 className={`font-semibold text-sm mb-2 ${technician.is_available ? 'text-green-800' : 'text-orange-800'}`}>
                                    {technician.is_available ? 'Available for Booking' : 'Currently Unavailable'}
                                </h3>
                                <p className={`text-xs ${technician.is_available ? 'text-green-700' : 'text-orange-700'}`}>
                                    {technician.is_available
                                        ? 'This technician is currently accepting new service requests.'
                                        : 'This technician is currently busy but may become available soon.'
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
} 