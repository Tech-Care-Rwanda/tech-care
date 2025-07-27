"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function TechnicianProfilePage() {
    const { profile } = useSupabaseAuth()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [formData, setFormData] = useState({
        specialization: '',
        bio: '',
        experience: '',
        hourly_rate: ''
    })

    useEffect(() => {
        const fetchProfileDetails = async () => {
            if (!profile?.id) {
                setInitialLoading(false)
                return
            }
            try {
                console.log('Fetching technician details for user:', profile.id)
                const { data, error } = await supabase
                    .from('technician_details')
                    .select('*')
                    .eq('user_id', profile.id)
                    .single()

                if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
                    console.error('Error fetching technician details:', error)
                    toast.error('Failed to load profile details: ' + error.message)
                } else if (data) {
                    console.log('Found technician details:', data)
                    setFormData({
                        specialization: data.specialization || '',
                        bio: data.bio || '',
                        experience: data.experience || '',
                        hourly_rate: data.hourly_rate?.toString() || ''
                    })
                } else {
                    console.log('No technician details found - this is normal for new technicians')
                }
            } catch (error) {
                console.error('Error fetching technician details:', error)
                toast.error('Failed to load profile details.')
            } finally {
                setInitialLoading(false)
            }
        }

        fetchProfileDetails()
    }, [profile])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile?.id) {
            toast.error('User profile not loaded. Please refresh the page.')
            return
        }

        setLoading(true)
        try {
            console.log('Saving technician profile:', formData)
            const dataToSave = {
                user_id: profile.id,
                specialization: formData.specialization,
                bio: formData.bio,
                experience: formData.experience,
                hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null
            }

            const { data, error } = await supabase
                .from('technician_details')
                .upsert(dataToSave, { onConflict: 'user_id' })
                .select()

            if (error) {
                console.error('Error saving technician details:', error)
                throw error
            }

            console.log('Successfully saved technician details:', data)
            toast.success('Profile updated successfully!')
        } catch (error: any) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile: ' + (error.message || 'Unknown error'))
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#FF385C' }}></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Your Professional Profile</CardTitle>
                        <p className="text-gray-600">Update your professional information to attract more customers.</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="specialization">Specialization *</Label>
                                <Input
                                    id="specialization"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Computer Repair, Network Setup"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="experience">Years of Experience</Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 5+ years"
                                />
                            </div>
                            <div>
                                <Label htmlFor="hourly_rate">Hourly Rate (RWF)</Label>
                                <Input
                                    id="hourly_rate"
                                    name="hourly_rate"
                                    type="number"
                                    value={formData.hourly_rate}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 15000"
                                    min="0"
                                    step="100"
                                />
                            </div>
                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell customers a bit about your skills and experience."
                                    rows={5}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white hover:opacity-90"
                                style={{ backgroundColor: '#FF385C' }}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
} 