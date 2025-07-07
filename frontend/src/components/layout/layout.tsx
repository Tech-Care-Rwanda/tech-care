import * as React from "react"
import { cn } from "@/lib/utils"
import { UserRole } from "@/lib/utils"
import { Header } from "./header"
import { Footer } from "./footer"

interface LayoutProps {
  children: React.ReactNode
  userType?: UserRole
  showHeader?: boolean
  showFooter?: boolean
  containerSize?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
}

export function Layout({
  children,
  userType = null,
  showHeader = true,
  showFooter = true,
  containerSize = "xl",
  className,
}: LayoutProps) {
  const containerClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    full: "max-w-full",
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showHeader && <Header userType={userType} />}
      
      <main className="flex-1 flex flex-col">
        <div
          className={cn(
            "mx-auto w-full px-4 sm:px-6 lg:px-8",
            containerClasses[containerSize],
            className
          )}
        >
          {children}
        </div>
      </main>
      
      {showFooter && <Footer />}
    </div>
  )
}

// Page wrapper for consistent spacing
interface PageWrapperProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export function PageWrapper({
  children,
  title,
  description,
  className,
}: PageWrapperProps) {
  return (
    <div className={cn("py-6 space-y-6", className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-lg text-muted-foreground text-balance">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
} 