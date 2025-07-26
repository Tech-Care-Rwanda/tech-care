"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'

interface SafeAvatarProps {
  src?: string | null
  alt?: string
  fallback?: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Safe Avatar component that handles missing images gracefully
 * Provides consistent fallback behavior across the application
 */
export function SafeAvatar({ 
  src, 
  alt = 'User avatar', 
  fallback, 
  className,
  size = 'md' 
}: SafeAvatarProps) {
  // Generate initials from alt text or fallback
  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const initials = fallback || getInitials(alt)

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ''}`}>
      {src && (
        <AvatarImage 
          src={src} 
          alt={alt}
          onError={(e) => {
            // Hide broken image
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      <AvatarFallback className="bg-gray-100 text-gray-600">
        {initials.length > 0 ? initials : <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  )
}

/**
 * Hook for generating consistent avatar URLs
 */
export function useAvatarUrl(user?: { avatar_url?: string | null, full_name?: string | null, email?: string }) {
  const getAvatarUrl = () => {
    if (user?.avatar_url) {
      return user.avatar_url
    }
    
    // Generate Gravatar URL as fallback
    if (user?.email) {
      const hash = btoa(user.email.toLowerCase().trim()).replace(/=/g, '')
      return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`
    }
    
    return null
  }

  const getFallbackText = () => {
    return user?.full_name || user?.email
  }

  return {
    avatarUrl: getAvatarUrl(),
    fallbackText: getFallbackText()
  }
}