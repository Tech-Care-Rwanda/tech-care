/**
 * Custom React Hooks for Notifications
 * Provides easy-to-use hooks for notification management
 */

import { useState, useEffect } from 'react'
import { notificationService, Notification, NotificationSettings } from '@/lib/services/notificationService'

// Hook for managing notifications
export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        // Initialize with stored notifications
        setNotifications(notificationService.getNotifications())
        setUnreadCount(notificationService.getUnreadNotifications().length)
        setIsConnected(notificationService.isConnectedToWebSocket())

        // Subscribe to notification updates
        const unsubscribeNotifications = notificationService.subscribe(
            'notifications_updated',
            (updatedNotifications: Notification[]) => {
                setNotifications(updatedNotifications)
                setUnreadCount(updatedNotifications.filter(n => !n.read).length)
            }
        )

        // Subscribe to connection status
        const unsubscribeConnection = notificationService.subscribe(
            'connected',
            (connected: boolean) => {
                setIsConnected(connected)
            }
        )

        // Subscribe to new notifications
        const unsubscribeNew = notificationService.subscribe(
            'notification_received',
            (notification: Notification) => {
                // Custom handling for new notifications if needed
                console.log('New notification received:', notification)
            }
        )

        // Cleanup subscriptions
        return () => {
            unsubscribeNotifications()
            unsubscribeConnection()
            unsubscribeNew()
        }
    }, [])

    const markAsRead = (notificationId: string) => {
        notificationService.markAsRead(notificationId)
    }

    const markAllAsRead = () => {
        notificationService.markAllAsRead()
    }

    const deleteNotification = (notificationId: string) => {
        notificationService.deleteNotification(notificationId)
    }

    const clearAll = () => {
        notificationService.clearAllNotifications()
    }

    const reconnect = () => {
        notificationService.reconnect()
    }

    return {
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        reconnect
    }
}

// Hook for real-time booking notifications (technician-specific)
export function useBookingNotifications() {
    const [pendingRequests, setPendingRequests] = useState<any[]>([])
    const [bookingUpdates, setBookingUpdates] = useState<any[]>([])

    useEffect(() => {
        // Subscribe to booking requests
        const unsubscribeRequests = notificationService.subscribe(
            'notification_received',
            (notification: Notification) => {
                if (notification.type === 'booking_request') {
                    setPendingRequests(prev => [...prev, notification.data])
                } else if (notification.type === 'booking_update') {
                    setBookingUpdates(prev => [...prev, notification.data])
                }
            }
        )

        return () => {
            unsubscribeRequests()
        }
    }, [])

    return {
        pendingRequests,
        bookingUpdates
    }
}

// Hook for technician availability management
export function useAvailabilityStatus() {
    const [isAvailable, setIsAvailable] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        // Subscribe to availability updates
        const unsubscribe = notificationService.subscribe(
            'availability_changed',
            (data: any) => {
                setIsAvailable(data.isAvailable)
            }
        )

        return () => {
            unsubscribe()
        }
    }, [])

    const updateAvailability = async (available: boolean) => {
        setUpdating(true)
        try {
            const result = await notificationService.updateAvailability(available)
            if (result.success) {
                setIsAvailable(available)
            }
            return result
        } finally {
            setUpdating(false)
        }
    }

    return {
        isAvailable,
        updating,
        updateAvailability
    }
}

// Hook for notification settings
export function useNotificationSettings() {
    const [settings, setSettings] = useState<NotificationSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            setLoading(true)
            const fetchedSettings = await notificationService.getNotificationSettings()
            setSettings(fetchedSettings)
        } catch (error) {
            console.error('Error loading notification settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateSettings = async (newSettings: NotificationSettings) => {
        try {
            setSaving(true)
            const result = await notificationService.updateNotificationSettings(newSettings)
            if (result.success) {
                setSettings(newSettings)
            }
            return result
        } finally {
            setSaving(false)
        }
    }

    return {
        settings,
        loading,
        saving,
        updateSettings,
        refetch: loadSettings
    }
}

// Hook for real-time connection status
export function useRealtimeConnection() {
    const [isConnected, setIsConnected] = useState(false)
    const [reconnecting, setReconnecting] = useState(false)

    useEffect(() => {
        setIsConnected(notificationService.isConnectedToWebSocket())

        const unsubscribe = notificationService.subscribe(
            'connected',
            (connected: boolean) => {
                setIsConnected(connected)
                if (connected) {
                    setReconnecting(false)
                }
            }
        )

        return () => {
            unsubscribe()
        }
    }, [])

    const reconnect = async () => {
        setReconnecting(true)
        notificationService.reconnect()

        // Reset reconnecting state after a delay
        setTimeout(() => {
            setReconnecting(false)
        }, 3000)
    }

    return {
        isConnected,
        reconnecting,
        reconnect
    }
}

// Hook for notification sound preferences
export function useNotificationSounds() {
    const [soundEnabled, setSoundEnabled] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('techcare-notification-sounds') !== 'false'
        }
        return true
    })

    const toggleSound = () => {
        const newValue = !soundEnabled
        setSoundEnabled(newValue)
        localStorage.setItem('techcare-notification-sounds', newValue.toString())
    }

    return {
        soundEnabled,
        toggleSound
    }
} 