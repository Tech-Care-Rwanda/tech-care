"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, User, LogOut, Settings, Bell } from "lucide-react"
import { cn, UserRole, Language } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

interface HeaderProps {
  userType?: UserRole
  variant?: "default" | "transparent"
}

const navigationItems = {
  guest: [
    { label: "Services", href: "/services" },
    { label: "Find Technicians", href: "/technicians" },
    { label: "How it Works", href: "/learn" },
  ],
  customer: [
    { label: "Find Technicians", href: "/technicians" },
    { label: "My Bookings", href: "/dashboard/bookings" },
    { label: "Services", href: "/services" },
  ],
  technician: [
    { label: "My Jobs", href: "/dashboard/jobs" },
    { label: "Calendar", href: "/dashboard/calendar" },
    { label: "Earnings", href: "/dashboard/earnings" },
    { label: "Profile", href: "/dashboard/profile" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    { label: "Technicians", href: "/admin/technicians" },
    { label: "Reports", href: "/admin/reports" },
  ],
}

export function Header({ userType = null, variant = "default" }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [currentLang, setCurrentLang] = React.useState<Language>("en")
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false)

  // Initialize language from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('techcare-language') as Language
      if (savedLang && (savedLang === 'en' || savedLang === 'rw' || savedLang === 'fr')) {
        setCurrentLang(savedLang)
      }
    }
  }, [])

  // Handle language change with proper synchronization
  const handleLanguageChange = React.useCallback((newLang: Language) => {
    setCurrentLang(newLang)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('techcare-language', newLang)
      }
    } catch (error) {
      console.warn('Failed to save language preference:', error)
    }
  }, [])

  const navItems = userType ? navigationItems[userType] : navigationItems.guest
  const isAuthenticated = Boolean(userType)

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-profile-dropdown]')) {
        setIsProfileDropdownOpen(false)
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isProfileDropdownOpen])

  // Handle escape key to close mobile menu and dropdowns
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false)
        }
        if (isProfileDropdownOpen) {
          setIsProfileDropdownOpen(false)
        }
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [isMobileMenuOpen, isProfileDropdownOpen])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full",
      variant === "transparent" 
        ? "bg-transparent border-none" 
        : "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className={cn(
              "font-semibold text-lg sm:text-xl",
              variant === "transparent" ? "text-white" : "text-foreground"
            )}>TechCare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  variant === "transparent"
                    ? "text-white hover:text-gray-200"
                    : "text-foreground hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden sm:flex">
              <LanguageSwitcher
                currentLanguage={currentLang}
                onLanguageChange={handleLanguageChange}
                variant="dropdown"
              />
            </div>

            {/* Authenticated User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                <div className="relative" data-profile-dropdown>
                  <button 
                    className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    aria-label="User menu"
                    aria-expanded={isProfileDropdownOpen}
                    aria-haspopup="menu"
                    aria-controls="profile-dropdown-menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>
                        {userType === "customer" ? "C" : userType === "technician" ? "T" : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground capitalize">{userType}</p>
                    </div>
                  </button>
                  
                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div 
                      id="profile-dropdown-menu"
                      className="absolute right-0 top-full mt-2 w-64 bg-background border rounded-lg shadow-lg z-[60]"
                      role="menu"
                      aria-labelledby="user-menu-button"
                    >
                      <div className="p-4 border-b">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder-avatar.jpg" />
                            <AvatarFallback>
                              {userType === "customer" ? "C" : userType === "technician" ? "T" : "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-muted-foreground">john.doe@email.com</p>
                            <p className="text-xs text-muted-foreground capitalize">{userType}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2" role="none">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link href="/dashboard/profile" role="menuitem" onClick={() => setIsProfileDropdownOpen(false)}>
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link href="/dashboard" role="menuitem" onClick={() => setIsProfileDropdownOpen(false)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" role="menuitem">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Separator className="my-2" />
                        <Button variant="ghost" className="w-full justify-start text-destructive" role="menuitem">
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Guest Actions */
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  asChild 
                  className={cn(
                    "hidden sm:inline-flex",
                    variant === "transparent" 
                      ? "text-white hover:bg-white/10 hover:text-white" 
                      : ""
                  )}
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden",
                variant === "transparent" 
                  ? "text-white hover:bg-white/10 hover:text-white" 
                  : ""
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/20" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div 
            id="mobile-navigation"
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-background p-6 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                </>
              )}
              
              {isAuthenticated && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </>
              )}

              <Separator className="my-4" />
              
              {/* Mobile Language Switcher */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Language</p>
                <LanguageSwitcher
                  currentLanguage={currentLang}
                  onLanguageChange={handleLanguageChange}
                  variant="dropdown"
                  className="w-full"
                />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
} 