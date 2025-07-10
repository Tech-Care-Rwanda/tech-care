"use client"

import { useState } from "react"
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3,
  Camera,
  Save,
  X,
  Shield,
  Star,
  TrendingUp,
  Target,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    specialties: user?.specialties || []
  })

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Please sign in to view your profile</p>
        </div>
      </DashboardLayout>
    )
  }

  const handleSave = () => {
    updateUser({
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      specialties: editForm.specialties
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      specialties: user?.specialties || []
    })
    setIsEditing(false)
  }

  const getProfileStats = () => {
    switch (user.role) {
      case 'customer':
        return [
          { label: "Total Bookings", value: user.totalBookings || 0, icon: Calendar },
          { label: "Completed Services", value: user.completedServices || 0, icon: CheckCircle },
          { label: "Saved Technicians", value: user.savedTechnicians || 0, icon: User },
          { label: "Total Spent", value: `RWF ${(user.totalSpent || 0).toLocaleString()}`, icon: TrendingUp }
        ]
      case 'technician':
        return [
          { label: "Rating", value: `${user.rating || 0}/5`, icon: Star },
          { label: "Total Jobs", value: user.totalJobs || 0, icon: Target },
          { label: "Monthly Earnings", value: `RWF ${(user.monthlyEarnings || 0).toLocaleString()}`, icon: TrendingUp },
          { label: "Available", value: user.isAvailable ? "Yes" : "No", icon: CheckCircle }
        ]
      default:
        return []
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-red-500 hover:bg-red-600">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={user.avatar || "/placeholder-avatar.jpg"} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600">
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                <div className="mt-4">
                  <Badge variant="outline" className="border-red-200 text-red-600 bg-red-50">
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Full Name"
                      />
                    ) : (
                      <span className="text-sm">{user.name}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Email Address"
                      />
                    ) : (
                      <span className="text-sm">{user.email}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="+250 788 123 456"
                      />
                    ) : (
                      <span className="text-sm">{user.phone || "Not provided"}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Kigali, Rwanda</span>
                  </div>
                </div>
              </div>

              {/* Specialties for Technicians */}
              {user.role === 'technician' && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {(user.specialties || []).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="border-red-200 text-red-600 bg-red-50">
                          {specialty}
                        </Badge>
                      ))}
                      {(!user.specialties || user.specialties.length === 0) && (
                        <p className="text-sm text-gray-500">No specialties added yet</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getProfileStats().map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <Icon className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive updates about your bookings and account</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Privacy Settings</h4>
                  <p className="text-sm text-gray-500">Control who can see your profile information</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Security</h4>
                  <p className="text-sm text-gray-500">Password and two-factor authentication</p>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>

              {user.role === 'technician' && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Availability Status</h4>
                      <p className="text-sm text-gray-500">Currently {user.isAvailable ? 'available' : 'unavailable'} for new jobs</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={user.isAvailable ? "border-red-200 text-red-600 bg-red-50" : ""}
                    >
                      {user.isAvailable ? 'Available' : 'Unavailable'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Profile updated</p>
                    <p className="text-xs text-gray-500">Today at 2:30 PM</p>
                  </div>
                </div>
                
                {user.lastLogin && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Last login</p>
                      <p className="text-xs text-gray-500">{formatDate(user.lastLogin)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Account created</p>
                    <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 