"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const router = useRouter()
  
  // Redirect to bookings page since dashboard is simplified
  useEffect(() => {
    router.replace('/dashboard/bookings')
  }, [router])

  return null
} 