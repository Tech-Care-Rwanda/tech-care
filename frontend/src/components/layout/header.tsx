"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, User, LogOut, Settings, Bell, ChevronDown } from "lucide-react"
import { cn, UserRole } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/contexts/AuthContext"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  userType?: UserRole
  variant?: "default" | "transparent"
}

const navigationItems = {
  guest: [
    { label: "Find Technicians", href: "/" },
  ],
  customer: [
    { label: "Find Technicians", href: "/" },
    { label: "My Bookings", href: "/dashboard/bookings" },
  ],
  technician: [
    { label: "Dashboard", href: "/technician/dashboard" },
    { label: "Find Clients", href: "/" },
    { label: "My Jobs", href: "/technician/dashboard" },
  ],
  admin: [
    { label: "Map View", href: "/" },
    { label: "Bookings", href: "/dashboard/bookings" },
  ],
}

export function Header({ userType = null, variant = "default" }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Use auth context user role, fallback to prop
  const effectiveUserType = user?.role || userType

  // Ensure effectiveUserType is a valid key of navigationItems, fallback to 'guest'
  const navItems =
    effectiveUserType && Object.prototype.hasOwnProperty.call(navigationItems, effectiveUserType)
      ? navigationItems[effectiveUserType as keyof typeof navigationItems]
      : navigationItems.guest

  // Handle escape key to close mobile menu
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false)
        }
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [isMobileMenuOpen])

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

            {/* Authenticated User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* Profile Dropdown using shadcn DropdownMenu with auth integration */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-accent">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || "/placeholder-avatar.jpg"} />
                        <AvatarFallback>
                          {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block text-left">
                        <p className={cn(
                          "text-sm font-medium",
                          variant === "transparent" ? "text-white" : "text-foreground"
                        )}>{user?.name || "User"}</p>
                        <p className={cn(
                          "text-xs capitalize",
                          variant === "transparent" ? "text-gray-200" : "text-muted-foreground"
                        )}>{user?.role}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => window.location.href = '/dashboard/profile'}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/dashboard/bookings'}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>My Bookings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
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
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </>
              )}

            </nav>
          </div>
        </div>
      )}
    </header>
  )
} 