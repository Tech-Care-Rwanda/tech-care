"use client"

import { useState } from 'react'
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
  Search
} from 'lucide-react'

const EMERGENCY_NUMBER = "+250791995143"

interface NavigationBarProps {
  className?: string
}

export function NavigationBar({ className = "" }: NavigationBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
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
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
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
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            
            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              {/* Emergency Call Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCall}
                className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                title={`Call emergency support: ${EMERGENCY_NUMBER}`}
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Emergency</span>
              </Button>
              
              {/* Profile Avatar (Desktop) */}
              <div className="hidden md:flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                    className={`flex items-center justify-between px-3 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
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
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              
              {/* Emergency Call (Mobile) */}
              <button
                onClick={handleCall}
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 w-full text-left"
              >
                <Phone className="w-5 h-5" />
                <span>Emergency: {EMERGENCY_NUMBER}</span>
              </button>
              
              {/* Help & Support */}
              <Link
                href="/help"
                onClick={handleMobileMenuToggle}
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
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