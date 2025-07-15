"use client"

import { useState } from "react"
import {
    Bell,
    Check,
    X,
    Trash2,
    Settings,
    Wifi,
    WifiOff,
    Calendar,
    DollarSign,
    Star,
    AlertTriangle,
    CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { useNotifications, useRealtimeConnection } from "@/lib/hooks/useNotifications"
import { Notification } from "@/lib/services/notificationService"

interface NotificationCenterProps {
    className?: string
}

export function NotificationCenter({ className }: NotificationCenterProps) {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll
    } = useNotifications()

    const { isConnected, reconnecting, reconnect } = useRealtimeConnection()
    const [open, setOpen] = useState(false)

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'booking_request':
                return <Calendar className="h-4 w-4 text-blue-500" />
            case 'booking_update':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'payment':
                return <DollarSign className="h-4 w-4 text-green-500" />
            case 'review':
                return <Star className="h-4 w-4 text-yellow-500" />
            case 'system':
                return <AlertTriangle className="h-4 w-4 text-orange-500" />
            default:
                return <Bell className="h-4 w-4 text-gray-500" />
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-l-red-500 bg-red-50'
            case 'medium':
                return 'border-l-yellow-500 bg-yellow-50'
            case 'low':
                return 'border-l-green-500 bg-green-50'
            default:
                return 'border-l-gray-300 bg-gray-50'
        }
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString()
    }

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            markAsRead(notification.id)
        }

        if (notification.actionUrl) {
            window.location.href = notification.actionUrl
        }

        setOpen(false)
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={`relative ${className}`}>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-96 p-0">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                            {isConnected ? (
                                <Wifi className="h-4 w-4 text-green-500" />
                            ) : (
                                <WifiOff className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-xs text-gray-500">
                                {isConnected ? 'Live' : reconnecting ? 'Connecting...' : 'Offline'}
                            </span>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={markAllAsRead} disabled={unreadCount === 0}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark all as read
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={clearAll} disabled={notifications.length === 0}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear all
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={reconnect} disabled={isConnected || reconnecting}>
                                    <Wifi className="h-4 w-4 mr-2" />
                                    Reconnect
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-sm">No notifications yet</p>
                            <p className="text-gray-400 text-xs">You'll see new notifications here</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${!notification.read ? getPriorityColor(notification.priority) : 'border-l-gray-200 bg-white'
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'
                                                    }`}>
                                                    {notification.title}
                                                </h4>
                                                <div className="flex items-center space-x-2">
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteNotification(notification.id)
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'
                                                }`}>
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-400">
                                                    {formatTime(notification.createdAt)}
                                                </span>

                                                {notification.priority === 'high' && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Urgent
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Show booking-specific data */}
                                            {notification.type === 'booking_request' && notification.data && (
                                                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={notification.data.customer?.image} />
                                                            <AvatarFallback className="text-xs">
                                                                {notification.data.customer?.name?.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{notification.data.service}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {notification.data.price}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="p-3 border-t bg-gray-50">
                        <Button variant="ghost" size="sm" className="w-full text-xs">
                            View all notifications
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NotificationCenter 