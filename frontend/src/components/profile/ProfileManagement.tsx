/**
 * Profile Management Components for TechCare
 * Handles profile viewing and editing for all user types
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit3,
    Save,
    X,
    Shield,
    Briefcase,
    Star,
    Clock
} from 'lucide-react'

interface TechnicianDetails {
    id: number
    gender: string
    age: number
    date_of_birth: string
    experience: string
    specialization: string
    image_url?: string
    certificate_url?: string
    is_available: boolean
    rate: number
    approval_status: 'PENDING' | 'APPROVED' | 'REJECTED'
    latitude?: number
    longitude?: number
    address?: string
    district?: string
    bio?: string
}

interface ProfileFormData {
    full_name: string
    phone_number: string
    // Technician specific
    experience?: string
    specialization?: string
    rate?: number
    is_available?: boolean
    address?: string
    district?: string
    bio?: string
}

export function ProfileManagement() {
    const { user, isCustomer, isTechnician, isAdmin } = useAuth()

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <p className="text-gray-500">Please log in to view your profile</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
                    <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
                </div>
                <Badge variant={user.is_active ? "default" : "secondary"}>
                    {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
            </div>

            {/* Basic Profile Information */}
            <BasicProfileCard />

            {/* Role-specific sections */}
            {isTechnician && <TechnicianProfileCard />}
            {isCustomer && <CustomerProfileCard />}
            {isAdmin && <AdminProfileCard />}

            {/* Security Settings */}
            <SecuritySettingsCard />
        </div>
    )
}

function BasicProfileCard() {
    const { user, updateUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<ProfileFormData>({
        full_name: user?.full_name || '',
        phone_number: user?.phone_number || '',
    })
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        try {
            const result = await updateUser(formData)
            if (result.success) {
                setIsEditing(false)
            }
        } catch (error) {
            console.error('Failed to update profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setFormData({
            full_name: user?.full_name || '',
            phone_number: user?.phone_number || '',
        })
        setIsEditing(false)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Basic Information
                    </CardTitle>
                    <CardDescription>Your personal account details</CardDescription>
                </div>
                {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCancel}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                            />
                        ) : (
                            <p className="text-gray-900">{user?.full_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <p className="text-gray-900">{user?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={formData.phone_number}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <p className="text-gray-900">{user?.phone_number || 'Not provided'}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Role</label>
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-400" />
                            <Badge variant="outline">
                                {user?.role?.toLowerCase()}
                            </Badge>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(user?.created_at || '').toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Last updated {new Date(user?.updated_at || '').toLocaleDateString()}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function TechnicianProfileCard() {
    const { user } = useAuth()
    const [technicianDetails, setTechnicianDetails] = useState<TechnicianDetails | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTechnicianDetails = async () => {
            if (!user) return

            try {
                const { data, error } = await supabase
                    .from('technician_details')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

                if (error) {
                    console.error('Error fetching technician details:', error)
                } else {
                    setTechnicianDetails(data)
                }
            } catch (error) {
                console.error('Failed to fetch technician details:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTechnicianDetails()
    }, [user])

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF385C]"></div>
                </CardContent>
            </Card>
        )
    }

    if (!technicianDetails) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Technician Profile
                    </CardTitle>
                    <CardDescription>Professional information and settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Technician details not found</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Technician Profile
                        </CardTitle>
                        <CardDescription>Professional information and settings</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={technicianDetails.approval_status === 'APPROVED' ? 'default' :
                                technicianDetails.approval_status === 'PENDING' ? 'secondary' : 'destructive'}
                        >
                            {technicianDetails.approval_status}
                        </Badge>
                        {technicianDetails.is_available && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                                Available
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Specialization</label>
                        <p className="text-gray-900">{technicianDetails.specialization}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Experience</label>
                        <p className="text-gray-900">{technicianDetails.experience}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Rate</label>
                        <p className="text-gray-900 flex items-center gap-1">
                            <span className="font-semibold">{technicianDetails.rate} RWF</span>
                            <span className="text-sm text-gray-500">per service</span>
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <p className="text-gray-900">{technicianDetails.district || 'Not specified'}</p>
                        </div>
                    </div>
                </div>

                {technicianDetails.bio && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Bio</label>
                        <p className="text-gray-900">{technicianDetails.bio}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function CustomerProfileCard() {
    const { user } = useAuth()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Profile
                </CardTitle>
                <CardDescription>Your booking history and preferences</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-[#FF385C]">0</div>
                        <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-sm text-gray-600">Completed Services</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">0 RWF</div>
                        <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function AdminProfileCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Admin Profile
                </CardTitle>
                <CardDescription>Administrative tools and system overview</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-[#FF385C]">0</div>
                        <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">0</div>
                        <div className="text-sm text-gray-600">Pending Technicians</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-sm text-gray-600">Active Bookings</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function SecuritySettingsCard() {
    const { updatePassword } = useSupabaseAuth()
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handlePasswordUpdate = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('Passwords do not match')
            return
        }

        if (passwordData.newPassword.length < 6) {
            setMessage('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        try {
            const result = await updatePassword(passwordData.newPassword)
            if (result.success) {
                setMessage('Password updated successfully')
                setPasswordData({ newPassword: '', confirmPassword: '' })
                setShowPasswordForm(false)
            } else {
                setMessage(result.error || 'Failed to update password')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!showPasswordForm ? (
                    <Button
                        variant="outline"
                        onClick={() => setShowPasswordForm(true)}
                    >
                        Change Password
                    </Button>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                            />
                        </div>

                        {message && (
                            <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </p>
                        )}

                        <div className="flex gap-2">
                            <Button onClick={handlePasswordUpdate} disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowPasswordForm(false)
                                    setPasswordData({ newPassword: '', confirmPassword: '' })
                                    setMessage('')
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 