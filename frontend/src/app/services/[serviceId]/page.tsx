"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  Monitor, 
  Smartphone, 
  Tv, 
  Wifi, 
  Settings, 
  Users,
  Star, 
  MapPin, 
  Clock, 
  Shield,
  CheckCircle,
  ArrowRight,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"

// Service data with detailed information
const serviceDetails = {
  computer: {
    title: "Computer Support & Repair",
    description: "Expert computer setup, repair, troubleshooting, and optimization services",
    icon: Monitor,
    heroImage: "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg",
    priceRange: "8,000 - 25,000 RWF",
    duration: "1-4 hours",
    features: [
      "Hardware Setup & Installation",
      "Software Installation & Updates", 
      "Virus Removal & Security",
      "Data Recovery & Backup",
      "Performance Optimization",
      "Hardware Diagnostics"
    ],
    description_long: "Professional computer support services including hardware setup, software installation, troubleshooting, and performance optimization. Our certified technicians can help with desktop computers, laptops, and peripherals."
  },
  phone: {
    title: "Mobile Device Support",
    description: "Smartphone and tablet repair, setup, and optimization services",
    icon: Smartphone,
    heroImage: "/images/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg",
    priceRange: "5,000 - 15,000 RWF",
    duration: "30min - 2 hours",
    features: [
      "Screen Repair & Replacement",
      "Data Transfer & Migration",
      "App Installation & Setup",
      "Performance Optimization",
      "Battery Replacement",
      "Software Troubleshooting"
    ],
    description_long: "Complete mobile device support for smartphones and tablets. From screen repairs to data transfer, our technicians ensure your mobile devices work perfectly."
  },
  tv: {
    title: "TV & Electronics Support",
    description: "Television setup, repair, and smart TV configuration services",
    icon: Tv,
    heroImage: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
    priceRange: "10,000 - 30,000 RWF",
    duration: "1-3 hours",
    features: [
      "TV Setup & Installation",
      "Smart TV Configuration",
      "Cable & Streaming Setup",
      "Sound System Integration",
      "Gaming Console Setup",
      "Remote Control Programming"
    ],
    description_long: "Professional TV and electronics support including installation, configuration, and repair services for televisions, sound systems, and entertainment centers."
  },
  networking: {
    title: "Network & WiFi Services",
    description: "Internet setup, WiFi optimization, and network security services",
    icon: Wifi,
    heroImage: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
    priceRange: "10,000 - 35,000 RWF",
    duration: "1-4 hours",
    features: [
      "WiFi Setup & Optimization",
      "Network Security Configuration",
      "Speed Optimization",
      "Router Configuration",
      "Smart Home Integration",
      "Network Troubleshooting"
    ],
    description_long: "Comprehensive networking services including WiFi setup, security configuration, and smart home integration to ensure fast and secure internet connectivity."
  },
  software: {
    title: "Software Support",
    description: "Software installation, updates, and troubleshooting services",
    icon: Settings,
    heroImage: "/images/md-riduwan-molla-ZO0weaaDrBs-unsplash.jpg",
    priceRange: "6,000 - 20,000 RWF",
    duration: "30min - 3 hours",
    features: [
      "Software Installation",
      "System Updates & Patches",
      "License Management",
      "Performance Tuning",
      "Database Setup",
      "Custom Software Support"
    ],
    description_long: "Professional software support including installation, configuration, troubleshooting, and optimization of various software applications and operating systems."
  },
  consultation: {
    title: "Tech Consultation",
    description: "Expert technology advice and planning services",
    icon: Users,
    heroImage: "/images/sxriptx-7Kehl5idKbU-unsplash.jpg",
    priceRange: "15,000 - 50,000 RWF",
    duration: "1-2 hours",
    features: [
      "Technology Assessment",
      "System Planning & Design",
      "Security Consulting",
      "Upgrade Recommendations",
      "Training & Education",
      "Long-term Support Planning"
    ],
    description_long: "Expert technology consultation services to help plan, design, and optimize your technology infrastructure for personal or business use."
  }
}

// Mock technicians data for each service
const serviceTechnicians = {
  computer: [
    {
      id: 1,
      name: "John Mugisha",
      specialty: "Computer Specialist",
      image: "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg",
      rating: 5.0,
      reviews: 318,
      location: "Kigali, Kimisagara",
      experience: "5+ years",
      price: 15000,
      responseTime: "Within 30 min",
      verified: true
    },
    {
      id: 4,
      name: "David Nshimiyimana",
      specialty: "Hardware Expert", 
      image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
      rating: 4.9,
      reviews: 201,
      location: "Kigali, Gisozi",
      experience: "4+ years",
      price: 12000,
      responseTime: "Within 1 hour",
      verified: true
    }
  ],
  phone: [
    {
      id: 3,
      name: "Eric Nkurunziza",
      specialty: "Mobile Device Expert",
      image: "/images/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg",
      rating: 4.8,
      reviews: 189,
      location: "Kigali, Kacyiru",
      experience: "3+ years",
      price: 10000,
      responseTime: "Within 2 hours",
      verified: true
    }
  ],
  networking: [
    {
      id: 2,
      name: "Marie Uwimana",
      specialty: "Network Expert",
      image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
      rating: 4.9,
      reviews: 256,
      location: "Kigali, Nyamirambo",
      experience: "4+ years",
      price: 18000,
      responseTime: "Within 1 hour",
      verified: true
    }
  ],
  // Add other service technicians as needed
  tv: [],
  software: [],
  consultation: []
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.serviceId as string
  
  // Get service data
  const service = serviceDetails[serviceId as keyof typeof serviceDetails]
  const technicians = serviceTechnicians[serviceId as keyof typeof serviceTechnicians] || []
  
  // If service doesn't exist, redirect to services page
  if (!service) {
    router.push('/services')
    return null
  }
  
  const Icon = service.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header userType={null} variant="default" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-red-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">{service.title}</h1>
              </div>
              <p className="text-xl text-red-100 mb-6">{service.description_long}</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3"
                  onClick={() => router.push('/search-results')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Technicians
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-3"
                  onClick={() => router.push('/services')}
                >
                  View All Services
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-80 rounded-lg overflow-hidden">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Info Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Pricing Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Duration</h3>
                <p className="text-2xl font-bold text-red-600">{service.duration}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Price Range</h3>
                <p className="text-2xl font-bold text-red-600">{service.priceRange}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Available Technicians</h3>
                <p className="text-2xl font-bold text-red-600">{technicians.length}+</p>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What&apos;s Included</h2>
              <div className="space-y-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose TechCare?</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-700">Verified & Background-checked Technicians</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-700">Fast Response Times</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-700">Guaranteed Quality Service</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-700">Service Across Rwanda</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Technicians Section */}
      {technicians.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Technicians</h2>
              <p className="text-gray-600 text-lg">
                Top-rated professionals specializing in {service.title.toLowerCase()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {technicians.map((technician) => (
                <Card key={technician.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden">
                          <Image
                            src={technician.image}
                            alt={technician.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        {technician.verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{technician.name}</h3>
                        <p className="text-red-600 font-medium mb-2">{technician.specialty}</p>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{technician.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({technician.reviews} reviews)</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {technician.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            Response: {technician.responseTime}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">{technician.price.toLocaleString()} RWF</span>
                            <span className="text-sm text-gray-500">/hour</span>
                          </div>
                          <Link href={`/dashboard/book/${technician.id}`}>
                            <Button className="bg-red-500 hover:bg-red-600">
                              Book Now
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                className="px-8 py-3"
                onClick={() => router.push('/search-results')}
              >
                View All {service.title} Technicians
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Help?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Book a qualified technician for {service.title.toLowerCase()} and get your tech working perfectly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              className="bg-red-500 hover:bg-red-600 px-8 py-3"
              onClick={() => router.push('/search-results')}
            >
              Find Technicians Now
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3"
              onClick={() => router.push('/services')}
            >
              Browse Other Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 