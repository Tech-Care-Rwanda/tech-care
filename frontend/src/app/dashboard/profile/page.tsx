"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Edit, MapPin, Phone, Mail, Calendar, Settings } from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  location: string
  memberSince: string
  totalBookings: number
  preferredCategories: string[]
}

export default function ProfilePage() {
  // Mock user data - in real app, this would come from auth context/API
  const [profile] = useState<UserProfile>({
    id: '1',
    name: 'John Uwimana',
    email: 'john.uwimana@gmail.com',
    phone: '+250788123456',
    avatar: '/images/default-avatar.jpg',
    location: 'Kigali, Rwanda',
    memberSince: '2024-01-15',
    totalBookings: 8,
    preferredCategories: ['Computer Repair', 'Mobile Device']
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-lg">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {profile.name}
                  </h2>
                  
                  <p className="text-gray-600 mb-4">{profile.email}</p>
                  
                  <Button size="sm" className="w-full mb-4">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {formatDate(profile.memberSince)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-gray-600">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-gray-600">{profile.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-gray-600">{profile.location}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Booking Statistics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Statistics</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{profile.totalBookings}</p>
                    <p className="text-sm text-blue-800">Total Bookings</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">4.9</p>
                    <p className="text-sm text-green-800">Avg Rating Given</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">3</p>
                    <p className="text-sm text-purple-800">Favorite Technicians</p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">RWF 89K</p>
                    <p className="text-sm text-orange-800">Total Spent</p>
                  </div>
                </div>
              </Card>

              {/* Preferences */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Preferred Service Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredCategories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/bookings">
                      <Calendar className="w-4 h-4 mr-2" />
                      View My Bookings
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard">
                      <MapPin className="w-4 h-4 mr-2" />
                      Find Technicians
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}