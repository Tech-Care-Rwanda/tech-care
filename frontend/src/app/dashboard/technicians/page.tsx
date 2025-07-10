"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TechniciansPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the search page
    router.replace("/dashboard/search")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h2>
        <p className="text-gray-600">Taking you to the technician search page</p>
      </div>
    </div>
  )
} 