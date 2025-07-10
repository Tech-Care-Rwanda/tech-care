"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { 
  Monitor, 
  Smartphone, 
  Wifi, 
  Settings, 
  Shield, 
  Wrench,
  Clock,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ServicesPage() {
  const router = useRouter()
  
  const services = [
    {
      id: 1,
      title: "Computer Support",
      description: "Complete computer setup, repair, and optimization services",
      icon: Monitor,
      price: "From 8,000 RWF",
      duration: "1-4 hours",
      features: ["Hardware Setup", "Software Installation", "Troubleshooting", "Data Recovery"],
      image: "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg",
      serviceId: "computer"
    },
    {
      id: 2,
      title: "Mobile Device Help",
      description: "Smartphone and tablet repair, setup, and optimization",
      icon: Smartphone,
      price: "From 5,000 RWF",
      duration: "30min-2 hours",
      features: ["Screen Repair", "Data Transfer", "App Setup", "Performance Optimization"],
      image: "/images/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg",
      serviceId: "phone"
    },
    {
      id: 3,
      title: "Network & WiFi",
      description: "Internet setup, WiFi optimization, and network security",
      icon: Wifi,
      price: "From 10,000 RWF",
      duration: "1-3 hours",
      features: ["WiFi Setup", "Network Security", "Speed Optimization", "Smart Home Integration"],
      image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
      serviceId: "networking"
    },
    {
      id: 4,
      title: "Software Solutions",
      description: "Software installation, updates, and troubleshooting",
      icon: Settings,
      price: "From 6,000 RWF",
      duration: "30min-2 hours",
      features: ["Software Installation", "System Updates", "Virus Removal", "Performance Tuning"],
      image: "/images/md-riduwan-molla-ZO0weaaDrBs-unsplash.jpg",
      serviceId: "software"
    },
    {
      id: 5,
      title: "Security & Backup",
      description: "Data protection, security setup, and backup solutions",
      icon: Shield,
      price: "From 12,000 RWF",
      duration: "1-3 hours",
      features: ["Antivirus Setup", "Data Backup", "Security Audits", "Password Management"],
      image: "/images/sammyayot254-vIQDv6tUHYk-unsplash.jpg",
      serviceId: "software"
    },
    {
      id: 6,
      title: "Maintenance & Repair",
      description: "Regular maintenance and hardware repair services",
      icon: Wrench,
      price: "From 15,000 RWF",
      duration: "2-4 hours",
      features: ["Hardware Diagnostics", "Component Replacement", "System Cleaning", "Performance Testing"],
      image: "/images/sxriptx-7Kehl5idKbU-unsplash.jpg",
      serviceId: "computer"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header userType={null} variant="default" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Tech Support Services
          </h1>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Get expert help with all your technology needs. From computer setup to network security, 
            our certified technicians are here to help you.
          </p>
          <Link href="/search-results">
            <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Find Technicians
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive tech support solutions for individuals and businesses in Rwanda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-red-500" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.duration}
                        </div>
                        <div className="text-lg font-semibold text-red-600">
                          {service.price}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">What&apos;s included:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full bg-red-500 hover:bg-red-600"
                      onClick={() => router.push(`/services/${service.serviceId}`)}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Custom Tech Support?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Don&apos;t see what you&apos;re looking for? Our technicians can help with custom solutions 
            tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/search-results">
              <Button className="bg-red-500 hover:bg-red-600 px-8 py-3">
                Find Technicians
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TC</span>
                </div>
                <span className="text-xl font-bold text-gray-900">TechCare</span>
              </div>
              <p className="text-gray-600">
                Professional tech support services across Rwanda. Get help when you need it.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Computer Support</li>
                <li>Mobile Device Help</li>
                <li>Network & WiFi</li>
                <li>Software Solutions</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/learn">How it Works</Link></li>
                <li><Link href="/technicians">Become a Technician</Link></li>
                <li>About Us</li>
                <li>Contact</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Help Center</li>
                <li>Safety</li>
                <li>Trust & Safety</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 TechCare Rwanda. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 