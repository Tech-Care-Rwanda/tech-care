"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Menu,
  X,
  Phone,
  Home,
  Calendar,
  User,
  HelpCircle,
  LogOut,
  Search,
  Settings,
  ChevronDown
} from 'lucide-react'

const EMERGENCY_NUMBER = "+250791995143"

interface NavigationBarProps {
  className?: string
}

export function NavigationBar({ className = "" }: NavigationBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const pathname = usePathname()
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  // Mock data - in real app, get from auth context
  const user = {
    name: "John Uwimana",
    avatar: "/images/default-avatar.jpg",
    initials: "JU"
  }

  // Mock pending bookings count - in real app, get from API
  const pendingBookingsCount = 2

  const handleCall = () => {
    window.open(`tel:${EMERGENCY_NUMBER}`)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = () => {
    // Handle logout logic here
    setIsProfileDropdownOpen(false)
    // In real app, would call logout function
  }

  const isActivePage = (path: string) => {
    return pathname === path
  }

  const navigationItems = [
    { href: '/', label: 'Find Technicians', icon: Home },
    { href: '/dashboard', label: 'My Bookings', icon: Calendar, badge: pendingBookingsCount }
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo + Primary Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF385C' }}>
                    <span className="text-white font-bold text-sm">TC</span>
                  </div>
                  <span className="font-bold text-xl text-gray-900">TechCare</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isActivePage(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                        ? 'text-white bg-opacity-90'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      style={isActive ? { backgroundColor: '#FF385C' } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs text-white" style={{ backgroundColor: '#FF385C' }}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Center: Search Bar (Desktop only) */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search technicians..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 text-sm"
                  style={{ '--tw-ring-color': '#FF385C' } as any}
                  onFocus={(e) => e.target.style.borderColor = '#FF385C'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              {/* Profile Dropdown (Desktop) */}
              <div className="hidden md:flex items-center relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">john.uwimana@example.com</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </Link>
                    
                    <Link
                      href="/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    
                    <Link
                      href="/help"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <HelpCircle className="w-4 h-4 mr-3" />
                      Help
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={handleMobileMenuToggle}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={handleMobileMenuToggle}
          />

          {/* Mobile Menu */}
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {/* Search Bar (Mobile) */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search technicians..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 text-sm"
                  style={{ '--tw-ring-color': '#FF385C' } as any}
                  onFocus={(e) => e.target.style.borderColor = '#FF385C'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Navigation Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = isActivePage(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleMobileMenuToggle}
                    className={`flex items-center justify-between px-3 py-3 rounded-md text-base font-medium transition-colors ${isActive
                      ? 'text-white bg-opacity-90'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    style={isActive ? { backgroundColor: '#FF385C' } : {}}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs text-white" style={{ backgroundColor: '#FF385C' }}>
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}

              {/* Profile Link (Mobile) */}
              <Link
                href="/profile"
                onClick={handleMobileMenuToggle}
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>

              {/* Help & Support */}
              <Link
                href="/help"
                onClick={handleMobileMenuToggle}
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Help & Support</span>
              </Link>

              {/* Logout */}
              <button
                onClick={() => {
                  // Handle logout logic here
                  handleMobileMenuToggle()
                }}
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NavigationBar