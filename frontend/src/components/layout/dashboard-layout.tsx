"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  User,
  Search,
  Menu,
  FileText,
  Users,
  DollarSign,
  Wrench,
  TrendingUp,
  Shield
} from "lucide-react"
import { cn, UserRole } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "./header"
import { useAuth } from "@/lib/contexts/AuthContext"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType?: UserRole // Made optional, will use auth context
  userInfo?: {
    full_name: string
    email: string
    avatar?: string
    status?: string
  }
}

const navigationMenus = {
  customer: [
    { icon: Search, label: "Find Technicians", href: "/" },
    { icon: Calendar, label: "My Bookings", href: "/dashboard/bookings" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ],
  technician: [
    { icon: Calendar, label: "Dashboard", href: "/technician/dashboard" },
    { icon: Wrench, label: "My Jobs", href: "/technician/dashboard" },
    { icon: User, label: "Profile", href: "/technician/profile" },
  ],
  admin: [
    { icon: Search, label: "Map View", href: "/" },
    { icon: Calendar, label: "Bookings", href: "/dashboard/bookings" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ],
}

export function DashboardLayout({
  children,
  userType,
  userInfo
}: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const pathname = usePathname()

  // Use auth context user role
  const effectiveUserType = user?.role
  const effectiveUserInfo = {
    full_name: user?.full_name || "User",
    email: user?.email || "",
    avatar: user?.avatar_url,
    status: user?.is_active ? "Active" : "Inactive"
  }

  if (!isAuthenticated || !effectiveUserType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">Please sign in to access the dashboard</p>
          <Button asChild className="bg-red-500 hover:bg-red-600">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  const menuItems = effectiveUserType && effectiveUserType in navigationMenus
    ? navigationMenus[effectiveUserType as keyof typeof navigationMenus]
    : []

  const UserBadge = () => (
    <div className="p-4 border-b">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={effectiveUserInfo.avatar} />
          <AvatarFallback>
            {(effectiveUserInfo.full_name || '').split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{effectiveUserInfo.full_name}</p>
          <p className="text-xs text-muted-foreground truncate">{effectiveUserInfo.email}</p>
          <p className="text-xs text-red-600 capitalize font-medium">{effectiveUserType}</p>
        </div>
      </div>
    </div>
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <UserBadge />

      <nav className="flex-1 p-4 space-y-2">
        {menuItems && menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-red-50 text-red-600 font-medium"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Conditionally render Header */}
      {effectiveUserType !== 'TECHNICIAN' && <Header />}

      <div className={`flex ${effectiveUserType === 'TECHNICIAN' ? 'h-screen' : 'h-[calc(100vh-4rem)]'}`}>
        {/* Desktop Sidebar */}
        <aside className={`hidden md:flex md:w-64 md:flex-col md:fixed md:left-0 border-r bg-card ${effectiveUserType === 'TECHNICIAN' ? 'md:inset-y-0' : 'md:inset-y-16'}`}>
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-black/20"
              onClick={() => setSidebarOpen(false)}
            />
            <div className={`fixed left-0 top-0 bottom-0 w-64 bg-card border-r`}>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-64">
          <div className="p-6">
            {/* Mobile Menu Button */}
            <div className="md:hidden mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

// Quick stats cards for different user types
interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ComponentType<{ className?: string }>
}

export function StatsCard({ title, value, change, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className="text-sm text-green-600">
              {change}
            </p>
          )}
        </div>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
    </div>
  )
}

// Dashboard stats for different user types
export const dashboardStats = {
  customer: [
    { title: "Active Bookings", value: 2, icon: Calendar },
    { title: "Completed Services", value: 15, icon: FileText },
    { title: "Saved Technicians", value: 8, icon: Users },
    { title: "Total Spent", value: "RWF 125,000", icon: DollarSign },
  ],
  technician: [
    { title: "Active Jobs", value: 5, icon: Wrench },
    { title: "This Month Earnings", value: "RWF 85,000", icon: DollarSign },
    { title: "Completed Jobs", value: 42, icon: FileText },
    { title: "Rating", value: "4.8/5", icon: TrendingUp },
  ],
  admin: [
    { title: "Total Users", value: "1,247", icon: Users },
    { title: "Active Technicians", value: 89, icon: Wrench },
    { title: "Monthly Revenue", value: "RWF 2.4M", icon: DollarSign },
    { title: "Support Tickets", value: 23, icon: Shield },
  ],
} 