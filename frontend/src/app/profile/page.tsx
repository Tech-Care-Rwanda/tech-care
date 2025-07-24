/**
 * Profile Page - Protected Route
 * Shows role-based profile management interface
 */

'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ProfileManagement } from '@/components/profile'

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <ProfileManagement />
                </div>
            </div>
        </ProtectedRoute>
    )
} 