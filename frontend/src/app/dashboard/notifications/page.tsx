"use client"

import { useState } from "react"
import { 
  Bell,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  MessageSquare,
  DollarSign,
  Trash2,
  MarkAsUnread,
  Settings,
  Filter,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/lib/contexts/AuthContext"

interface Notification {
  id: string
  type: 'booking' | 'payment' | 'review' | 'system' | 'message' | 'reminder'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
  metadata?: {
    amount?: number
    rating?: number
    sender?: string
    avatar?: string
  }
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "booking",
      title: "New Booking Request",
      message: "John Doe has requested a computer repair service for tomorrow at 2:00 PM",
      timestamp: "2024-01-15T14:30:00Z",
      read: false,
      priority: "high",
      actionUrl: "/dashboard/bookings/1",
      metadata: {
        sender: "John Doe",
        avatar: "/placeholder-avatar.jpg"
      }
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Received",
      message: "You've received payment of RWF 25,000 for computer repair service",
      timestamp: "2024-01-15T10:15:00Z",
      read: false,
      priority: "medium",
      metadata: {
        amount: 25000
      }
    },
    {
      id: "3",
      type: "review",
      title: "New Review",
      message: "Sarah Mukamana left a 5-star review for your network setup service",
      timestamp: "2024-01-14T16:45:00Z",
      read: true,
      priority: "medium",
      metadata: {
        rating: 5,
        sender: "Sarah Mukamana"
      }
    },
    {
      id: "4",
      type: "system",
      title: "Profile Updated",
      message: "Your technician profile has been successfully updated with new certifications",
      timestamp: "2024-01-14T09:20:00Z",
      read: true,
      priority: "low"
    },
    {
      id: "5",
      type: "message",
      title: "New Message",
      message: "Marie Uwimana sent you a message about the upcoming service appointment",
      timestamp: "2024-01-13T18:30:00Z",
      read: false,
      priority: "medium",
      metadata: {
        sender: "Marie Uwimana",
        avatar: "/placeholder-avatar.jpg"
      }
    },
    {
      id: "6",
      type: "reminder",
      title: "Appointment Reminder",
      message: "You have a scheduled service appointment tomorrow at 10:00 AM",
      timestamp: "2024-01-13T12:00:00Z",
      read: true,
      priority: "high"
    }
  ])

  const [filter, setFilter] = useState<string>("all")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-500" />
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-500" />
      case 'review':
        return <Star className="w-5 h-5 text-yellow-500" />
      case 'system':
        return <Settings className="w-5 h-5 text-gray-500" />
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-500" />
      case 'reminder':
        return <Bell className="w-5 h-5 text-orange-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500'
      case 'medium':
        return 'border-l-4 border-l-yellow-500'
      case 'low':
        return 'border-l-4 border-l-green-500'
      default:
        return 'border-l-4 border-l-gray-300'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: false } : notif
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const filteredNotifications = notifications.filter(notif => {
    const matchesType = filter === "all" || notif.type === filter
    const matchesRead = !showUnreadOnly || !notif.read
    return matchesType && matchesRead
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Please sign in to view notifications</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-red-500 text-white">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-gray-600">Stay updated with your latest activities and updates</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button className="bg-red-500 hover:bg-red-600">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All" },
                { value: "booking", label: "Bookings" },
                { value: "payment", label: "Payments" },
                { value: "review", label: "Reviews" },
                { value: "message", label: "Messages" },
                { value: "system", label: "System" },
                { value: "reminder", label: "Reminders" }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(option.value)}
                  className={filter === option.value ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Unread only</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Bell className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">
                {showUnreadOnly 
                  ? "You're all caught up! No unread notifications."
                  : "You don't have any notifications yet."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                !notification.read ? 'bg-red-50 border-red-100' : 'bg-white'
              } ${getPriorityColor(notification.priority)}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Icon & Avatar */}
                  <div className="flex-shrink-0">
                    {notification.metadata?.avatar ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.metadata.avatar} />
                        <AvatarFallback>
                          {notification.metadata.sender?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>

                        {/* Metadata */}
                        {notification.metadata && (
                          <div className="flex items-center space-x-4 mt-2">
                            {notification.metadata.amount && (
                              <div className="flex items-center space-x-1 text-xs text-green-600">
                                <DollarSign className="w-3 h-3" />
                                <span>RWF {notification.metadata.amount.toLocaleString()}</span>
                              </div>
                            )}

                            {notification.metadata.rating && (
                              <div className="flex items-center space-x-1 text-xs text-yellow-600">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{notification.metadata.rating}/5</span>
                              </div>
                            )}

                            {notification.metadata.sender && !notification.metadata.avatar && (
                              <span className="text-xs text-gray-500">
                                from {notification.metadata.sender}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 ml-4">
                        {!notification.read ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsUnread(notification.id)}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <MarkAsUnread className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Action Button */}
                    {notification.actionUrl && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  )
} 