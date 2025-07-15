/**
 * Notification Service for TechCare Frontend
 * Handles real-time notifications using WebSocket and browser notifications
 */

import { apiService } from './api'

export interface Notification {
    id: string
    type: 'booking_request' | 'booking_update' | 'payment' | 'review' | 'system'
    title: string
    message: string
    data?: any
    read: boolean
    createdAt: string
    priority: 'low' | 'medium' | 'high'
    actionUrl?: string
}

export interface NotificationSettings {
    browser: boolean
    email: boolean
    sms: boolean
    types: {
        booking_requests: boolean
        booking_updates: boolean
        payments: boolean
        reviews: boolean
        system: boolean
    }
}

class NotificationService {
    private ws: WebSocket | null = null
    private subscribers: Map<string, Function[]> = new Map()
    private notifications: Notification[] = []
    private isConnected = false
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000 // Start with 1 second

    constructor() {
        this.initializeWebSocket()
        this.requestBrowserPermission()
        this.loadStoredNotifications()
    }

    // Initialize WebSocket connection
    private initializeWebSocket() {
        try {
            const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'
            this.ws = new WebSocket(wsUrl)

            this.ws.onopen = () => {
                console.log('WebSocket connected')
                this.isConnected = true
                this.reconnectAttempts = 0
                this.reconnectDelay = 1000

                // Send authentication token
                const token = localStorage.getItem('techcare-token')
                if (token) {
                    this.ws?.send(JSON.stringify({
                        type: 'auth',
                        token
                    }))
                }

                this.emit('connected', true)
            }

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    this.handleWebSocketMessage(data)
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error)
                }
            }

            this.ws.onclose = () => {
                console.log('WebSocket disconnected')
                this.isConnected = false
                this.emit('connected', false)
                this.attemptReconnect()
            }

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error)
                this.emit('error', error)
            }
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error)
            this.attemptReconnect()
        }
    }

    // Handle incoming WebSocket messages
    private handleWebSocketMessage(data: any) {
        switch (data.type) {
            case 'notification':
                this.addNotification(data.notification)
                break
            case 'booking_request':
                this.handleBookingRequest(data)
                break
            case 'booking_update':
                this.handleBookingUpdate(data)
                break
            case 'availability_update':
                this.handleAvailabilityUpdate(data)
                break
            case 'ping':
                // Respond to ping to keep connection alive
                this.ws?.send(JSON.stringify({ type: 'pong' }))
                break
            default:
                console.log('Unknown WebSocket message type:', data.type)
        }
    }

    // Attempt to reconnect WebSocket
    private attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached')
            return
        }

        setTimeout(() => {
            console.log(`Attempting to reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`)
            this.reconnectAttempts++
            this.reconnectDelay *= 2 // Exponential backoff
            this.initializeWebSocket()
        }, this.reconnectDelay)
    }

    // Request browser notification permission
    private async requestBrowserPermission() {
        if (!('Notification' in window)) {
            console.warn('Browser does not support notifications')
            return false
        }

        if (Notification.permission === 'granted') {
            return true
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission()
            return permission === 'granted'
        }

        return false
    }

    // Load stored notifications from localStorage
    private loadStoredNotifications() {
        try {
            const stored = localStorage.getItem('techcare-notifications')
            if (stored) {
                this.notifications = JSON.parse(stored)
                this.emit('notifications_updated', this.notifications)
            }
        } catch (error) {
            console.error('Error loading stored notifications:', error)
        }
    }

    // Store notifications to localStorage
    private storeNotifications() {
        try {
            localStorage.setItem('techcare-notifications', JSON.stringify(this.notifications))
        } catch (error) {
            console.error('Error storing notifications:', error)
        }
    }

    // Add new notification
    addNotification(notification: Notification) {
        this.notifications.unshift(notification)

        // Limit to last 100 notifications
        if (this.notifications.length > 100) {
            this.notifications = this.notifications.slice(0, 100)
        }

        this.storeNotifications()
        this.emit('notification_received', notification)
        this.emit('notifications_updated', this.notifications)

        // Show browser notification
        this.showBrowserNotification(notification)

        // Play notification sound for high priority
        if (notification.priority === 'high') {
            this.playNotificationSound()
        }
    }

    // Show browser notification
    private showBrowserNotification(notification: Notification) {
        if (Notification.permission === 'granted') {
            const browserNotification = new Notification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: notification.id,
                requireInteraction: notification.priority === 'high'
            })

            browserNotification.onclick = () => {
                window.focus()
                if (notification.actionUrl) {
                    window.location.href = notification.actionUrl
                }
                browserNotification.close()
            }

            // Auto-close after 5 seconds for non-high priority
            if (notification.priority !== 'high') {
                setTimeout(() => {
                    browserNotification.close()
                }, 5000)
            }
        }
    }

    // Play notification sound
    private playNotificationSound() {
        try {
            const audio = new Audio('/sounds/notification.mp3')
            audio.volume = 0.3
            audio.play().catch(() => {
                // Ignore audio play errors (user interaction required)
            })
        } catch (error) {
            // Ignore audio errors
        }
    }

    // Handle booking request notification
    private handleBookingRequest(data: any) {
        const notification: Notification = {
            id: `booking_${data.booking.id}_${Date.now()}`,
            type: 'booking_request',
            title: 'New Booking Request',
            message: `${data.booking.customer.name} requested ${data.booking.service}`,
            data: data.booking,
            read: false,
            createdAt: new Date().toISOString(),
            priority: data.booking.urgency === 'high' ? 'high' : 'medium',
            actionUrl: '/dashboard/technician'
        }

        this.addNotification(notification)
    }

    // Handle booking update notification
    private handleBookingUpdate(data: any) {
        const notification: Notification = {
            id: `booking_update_${data.booking.id}_${Date.now()}`,
            type: 'booking_update',
            title: 'Booking Updated',
            message: `Booking with ${data.booking.customer.name} has been ${data.booking.status}`,
            data: data.booking,
            read: false,
            createdAt: new Date().toISOString(),
            priority: 'medium',
            actionUrl: '/dashboard/bookings'
        }

        this.addNotification(notification)
    }

    // Handle availability update
    private handleAvailabilityUpdate(data: any) {
        this.emit('availability_changed', data)
    }

    // Subscribe to events
    subscribe(event: string, callback: Function) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, [])
        }
        this.subscribers.get(event)!.push(callback)

        // Return unsubscribe function
        return () => {
            const callbacks = this.subscribers.get(event) || []
            const index = callbacks.indexOf(callback)
            if (index > -1) {
                callbacks.splice(index, 1)
            }
        }
    }

    // Emit events to subscribers
    private emit(event: string, data: any) {
        const callbacks = this.subscribers.get(event) || []
        callbacks.forEach(callback => {
            try {
                callback(data)
            } catch (error) {
                console.error(`Error in event callback for ${event}:`, error)
            }
        })
    }

    // Get all notifications
    getNotifications(): Notification[] {
        return this.notifications
    }

    // Get unread notifications
    getUnreadNotifications(): Notification[] {
        return this.notifications.filter(n => !n.read)
    }

    // Mark notification as read
    markAsRead(notificationId: string) {
        const notification = this.notifications.find(n => n.id === notificationId)
        if (notification) {
            notification.read = true
            this.storeNotifications()
            this.emit('notifications_updated', this.notifications)
        }
    }

    // Mark all notifications as read
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true)
        this.storeNotifications()
        this.emit('notifications_updated', this.notifications)
    }

    // Delete notification
    deleteNotification(notificationId: string) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId)
        this.storeNotifications()
        this.emit('notifications_updated', this.notifications)
    }

    // Clear all notifications
    clearAllNotifications() {
        this.notifications = []
        this.storeNotifications()
        this.emit('notifications_updated', this.notifications)
    }

    // Update availability status (for technicians)
    async updateAvailability(isAvailable: boolean) {
        try {
            // TODO: Replace with real API call when backend endpoint is ready
            // const response = await apiService.patch('/technician/availability', { isAvailable })

            // Send via WebSocket for real-time update
            if (this.isConnected && this.ws) {
                this.ws.send(JSON.stringify({
                    type: 'availability_update',
                    isAvailable
                }))
            }

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update availability'
            }
        }
    }

    // Get notification settings
    async getNotificationSettings(): Promise<NotificationSettings> {
        try {
            // TODO: Replace with real API call when backend endpoint is ready
            // const response = await apiService.get('/user/notification-settings')

            // Return default settings for now
            return {
                browser: true,
                email: true,
                sms: false,
                types: {
                    booking_requests: true,
                    booking_updates: true,
                    payments: true,
                    reviews: true,
                    system: true
                }
            }
        } catch (error) {
            // Return default settings on error
            return {
                browser: true,
                email: false,
                sms: false,
                types: {
                    booking_requests: true,
                    booking_updates: true,
                    payments: false,
                    reviews: false,
                    system: false
                }
            }
        }
    }

    // Update notification settings
    async updateNotificationSettings(settings: NotificationSettings) {
        try {
            // TODO: Replace with real API call when backend endpoint is ready
            // const response = await apiService.patch('/user/notification-settings', settings)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update settings'
            }
        }
    }

    // Check connection status
    isConnectedToWebSocket(): boolean {
        return this.isConnected
    }

    // Manually reconnect
    reconnect() {
        if (this.ws) {
            this.ws.close()
        }
        this.reconnectAttempts = 0
        this.initializeWebSocket()
    }

    // Disconnect
    disconnect() {
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
        this.isConnected = false
    }
}

// Export singleton instance
export const notificationService = new NotificationService()
export default notificationService 