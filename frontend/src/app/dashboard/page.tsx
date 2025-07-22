"use client"

import { TechnicianMap } from '@/components/maps/TechnicianMap'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Star, Users } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find a Technician</h1>
            <p className="text-gray-600">Connect with verified tech experts near you</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/bookings">
                <Clock className="w-4 h-4 mr-2" />
                My Bookings
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/profile">
                <Users className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Available Technicians</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  Kigali, Rwanda
                </div>
              </div>
              <TechnicianMap className="h-[500px] w-full" />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Available Technicians</span>
                  </div>
                  <span className="font-semibold text-gray-900">15+</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Avg Response Time</span>
                  </div>
                  <span className="font-semibold text-gray-900">2 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-600">Average Rating</span>
                  </div>
                  <span className="font-semibold text-gray-900">4.8</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Computer Repair</span>
                  <span className="text-xs text-gray-500">8 available</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Mobile & Network</span>
                  <span className="text-xs text-gray-500">5 available</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Software & IT</span>
                  <span className="text-xs text-gray-500">3 available</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-red-200 bg-red-50">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Need Urgent Help?</h3>
              <p className="text-sm text-red-700 mb-3">
                For emergency tech issues, contact our 24/7 support line.
              </p>
              <Button variant="destructive" size="sm" className="w-full">
                Emergency Support
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}