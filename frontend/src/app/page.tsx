"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from "@/components/layout/header"
import { TechnicianMap } from "@/components/maps/TechnicianMap"

export default function Home() {
  const router = useRouter()

  // For now, just redirect to dashboard - in a real app, check auth state
  useEffect(() => {
    // Temporary: Auto-redirect to dashboard for MVP demo
    // In production, check authentication state here
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find a technician near you
          </h1>
          <p className="text-gray-600 mb-4">
            Available technicians are shown on the map below. Click on a marker to see more details.
          </p>
          <p className="text-sm text-blue-600">
            Redirecting to dashboard in 2 seconds...
          </p>
        </div>
        <TechnicianMap className="h-[calc(100vh-250px)]" />
      </main>
    </div>
  )
}
