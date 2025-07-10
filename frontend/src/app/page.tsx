"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSearch } from "@/lib/contexts/SearchContext"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { LocationMapPicker } from "@/components/maps"

export default function Home() {
  const router = useRouter()
  const { setSearchFilters, setIsLoading } = useSearch()
  const [searchData, setSearchData] = useState({
    location: 'Kigali',
    coordinates: { lat: -1.9441, lng: 30.0619 },
    serviceType: 'Computer',
    urgency: 'Today',
    details: '2 devices'
  })
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const [showUrgencyDropdown, setShowUrgencyDropdown] = useState(false)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-search-dropdown]')) {
        setShowServiceDropdown(false)
        setShowUrgencyDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const serviceTypes = ['Computer', 'Mobile Device', 'Network/WiFi', 'Software', 'All Services']
  const urgencyOptions = ['Today', 'Tomorrow', 'This Week', 'Flexible']

  const handleLocationChange = (location: string, coordinates?: { lat: number; lng: number }) => {
    setSearchData(prev => ({
      ...prev,
      location,
      coordinates: coordinates || prev.coordinates
    }))
  }

  const handleSearch = () => {
    setIsLoading(true)
    // Set search parameters from form state
    setSearchFilters({
      location: searchData.location,
      serviceType: searchData.serviceType,
      urgency: searchData.urgency,
      details: searchData.details
    })
    router.push('/search-results')
  }
  const services = [
    {
      title: "Tech support",
      description: "At your location",
      gradient: "from-green-400 to-blue-500",
      image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
      serviceId: "computer"
    },
    {
      title: "Remote help",
      description: "Get Online Help from Experts",
      gradient: "from-purple-400 to-pink-500",
      image: "/images/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg",
      serviceId: "consultation"
    },
    {
      title: "Training",
      description: "Get trainings on proper usage",
      gradient: "from-red-400 to-pink-500",
      image: "/images/sxriptx-7Kehl5idKbU-unsplash.jpg",
      serviceId: "consultation"
    },
    {
      title: "24/7 Support",
      description: "Anytime, anywhere faster",
      gradient: "from-orange-400 to-red-500",
      image: "/images/md-riduwan-molla-ZO0weaaDrBs-unsplash.jpg",
      serviceId: "software"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Header variant="transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="absolute inset-0">
          <Image
            src="/images/thisisengineering-hnXf73-K1zo-unsplash.jpg"
            alt="Engineering and technology workspace"
            className="w-full h-full object-cover opacity-70"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center space-y-6 sm:space-y-8 px-4 sm:px-6">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-4 max-w-5xl mx-auto shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location Map Picker */}
              <div className="md:col-span-1">
                <LocationMapPicker
                  selectedLocation={searchData.location}
                  onLocationChange={handleLocationChange}
                />
              </div>
              
              {/* Service Type Dropdown */}
              <div className="relative" data-search-dropdown>
                <div 
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200 transition-colors h-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowServiceDropdown(!showServiceDropdown)
                    setShowUrgencyDropdown(false)
                  }}
                >
                  <div className="text-left">
                    <p className="font-semibold text-sm text-gray-900">Service Type</p>
                    <p className="text-gray-700 text-sm">{searchData.serviceType}</p>
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      showServiceDropdown ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
                {showServiceDropdown && (
                  <div 
                    className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border mt-2 z-[100] max-h-60 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {serviceTypes.map((service) => (
                      <div
                        key={service}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSearchData({ ...searchData, serviceType: service })
                          setShowServiceDropdown(false)
                        }}
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Urgency Dropdown */}
              <div className="relative" data-search-dropdown>
                <div 
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200 transition-colors h-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUrgencyDropdown(!showUrgencyDropdown)
                    setShowServiceDropdown(false)
                  }}
                >
                  <div className="text-left">
                    <p className="font-semibold text-sm text-gray-900">Urgency</p>
                    <p className="text-gray-700 text-sm">{searchData.urgency}</p>
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      showUrgencyDropdown ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
                {showUrgencyDropdown && (
                  <div 
                    className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border mt-2 z-[100] max-h-60 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {urgencyOptions.map((urgency) => (
                      <div
                        key={urgency}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSearchData({ ...searchData, urgency })
                          setShowUrgencyDropdown(false)
                        }}
                      >
                        {urgency}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Details Input and Search Button */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors h-full">
                  <div className="text-left">
                    <p className="font-semibold text-sm text-gray-900">Details</p>
                    <input
                      type="text"
                      placeholder="Describe issue"
                      value={searchData.details}
                      onChange={(e) => setSearchData({ ...searchData, details: e.target.value })}
                      className="text-gray-700 text-sm bg-transparent border-none outline-none w-full"
                    />
                  </div>
                </div>
                <Button 
                  size="icon" 
                  className="bg-red-500 hover:bg-red-600 rounded-lg w-12 h-12 flex-shrink-0"
                  onClick={handleSearch}
                >
                  <Search className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-8 sm:space-y-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight px-2">
              Need tech help? We&apos;ve got you covered.
            </h1>
            <Button 
              className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold"
              onClick={handleSearch}
            >
              Find help now
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-12 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 px-2">Discover TechCare Services</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                onClick={() => router.push(`/services/${service.serviceId}`)}
              >
                <div className="relative h-40 sm:h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={200}
                  />
                </div>
                <CardContent className={`p-4 sm:p-6 bg-gradient-to-br ${service.gradient} text-white`}>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-white/90 text-sm sm:text-base">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Cards Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Shop TechCare
                <br />
                gift cards
              </h2>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-lg px-6 py-3 text-sm sm:text-base">
                Learn more
              </Button>
            </div>
            <div className="relative">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center justify-center lg:justify-start">
                <Image
                  src="/images/Big Card.png"
                  alt="TechCare Gift Card"
                  className="rounded-lg shadow-lg transform rotate-6 w-48 sm:w-auto"
                  width={250}
                  height={166}
                />
                <div className="hidden sm:flex flex-col space-y-4">
                  <Image
                    src="/images/sammyayot254-vIQDv6tUHYk-unsplash.jpg"
                    alt="TechCare Services"
                    className="rounded-lg shadow-lg transform -rotate-3 w-32 md:w-40"
                    width={180}
                    height={120}
                  />
                  <Image
                    src="/images/samsung-memory-KTF38UTEKR4-unsplash.jpg"
                    alt="Tech Support"
                    className="rounded-lg shadow-lg transform rotate-2 w-32 md:w-40"
                    width={180}
                    height={120}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-tight">
                Questions
                <br />
                about
                <br />
                TechCare?
              </h2>
              <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 text-sm sm:text-base">
                Ask a Supertechnician
              </Button>
            </div>
            <div className="relative order-1 lg:order-2">
              <Image
                src="/images/thisisengineering-hnXf73-K1zo-unsplash.jpg"
                alt="Professional technician working with technology"
                className="rounded-lg shadow-2xl w-full h-64 sm:h-80 lg:h-96 object-cover"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">Support</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Safety information</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Cancellation options</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Supporting people with disabilities</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Report a neighborhood concern</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">Technician</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Become a Technician</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">GadgetsCover: protection for Technicians</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Explore technician resources</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Visit our community forum</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">How to help responsibly</Link></li>
              </ul>
            </div>
            
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">About</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Newsroom</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Learn about new features</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Letter from our founders</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Investors</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Standard Search</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
              <span>© 2025 TechCare, Inc.</span>
              <div className="flex items-center space-x-4">
                <Link href="#" className="hover:text-gray-900 transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-gray-900 transition-colors">Terms</Link>
                <Link href="#" className="hover:text-gray-900 transition-colors">Sitemap</Link>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm px-2 py-1">
                  🌐 English (US)
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm px-2 py-1">
                  RWF
                </Button>
              </div>
              <div className="flex space-x-3">
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">📘</Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">🐦</Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">📷</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
