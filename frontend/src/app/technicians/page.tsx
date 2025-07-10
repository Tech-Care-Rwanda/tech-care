"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  Users,
  CheckCircle,
  ArrowRight,
  Briefcase,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TechniciansPage() {
  const featuredTechnicians = [
    {
      id: 1,
      name: "John Mugisha",
      specialty: "Computer Specialist",
      image: "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg",
      rating: 5.0,
      reviews: 318,
      location: "Kigali, Kimisagara",
      experience: "5+ years",
      services: ["Computer Setup", "Network Config", "Hardware Repair", "Data Recovery"],
      verified: true,
      responseTime: "Within 30 min"
    },
    {
      id: 2,
      name: "Marie Uwimana",
      specialty: "Network Expert",
      image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg",
      rating: 4.9,
      reviews: 256,
      location: "Kigali, Nyamirambo",
      experience: "4+ years",
      services: ["WiFi Setup", "Smart Home", "Network Security", "Speed Optimization"],
      verified: true,
      responseTime: "Within 1 hour"
    },
    {
      id: 3,
      name: "Eric Nkurunziza",
      specialty: "Mobile Device Expert",
      image: "/images/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg",
      rating: 4.8,
      reviews: 189,
      location: "Kigali, Kacyiru",
      experience: "3+ years",
      services: ["Mobile Repair", "Screen Replacement", "Data Transfer", "App Setup"],
      verified: true,
      responseTime: "Within 2 hours"
    },
    {
      id: 4,
      name: "Grace Mukandayisenga",
      specialty: "Software Solutions",
      image: "/images/md-riduwan-molla-ZO0weaaDrBs-unsplash.jpg",
      rating: 4.7,
      reviews: 142,
      location: "Kigali, Remera",
      experience: "6+ years",
      services: ["Software Installation", "Virus Removal", "System Updates", "Performance Tuning"],
      verified: true,
      responseTime: "Within 45 min"
    }
  ]

  const benefits = [
    {
      icon: DollarSign,
      title: "Flexible Earning",
      description: "Set your own rates and work schedule. Earn 15,000-50,000 RWF per day."
    },
    {
      icon: Users,
      title: "Growing Customer Base",
      description: "Access thousands of customers across Rwanda who need tech support."
    },
    {
      icon: Shield,
      title: "Insurance Coverage",
      description: "Get protected with liability insurance while working on customer devices."
    },
    {
      icon: Award,
      title: "Professional Growth",
      description: "Build your reputation, gain certifications, and advance your career."
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
            Meet Our Expert Technicians
          </h1>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Certified professionals ready to help with all your tech needs. 
            Join our network and start earning today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/search-results">
              <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Find Technicians
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-3 text-lg">
              Become a Technician
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Technicians */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Technicians</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Highly rated professionals with proven track records of excellent service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {featuredTechnicians.map((technician) => (
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
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{technician.name}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium ml-1">{technician.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({technician.reviews})</span>
                        </div>
                      </div>
                      
                      <p className="text-red-600 font-medium mb-2">{technician.specialty}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {technician.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {technician.responseTime}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {technician.experience} experience
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Specializes in:</p>
                        <div className="flex flex-wrap gap-2">
                          {technician.services.slice(0, 3).map((service, index) => (
                            <span key={index} className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full">
                              {service}
                            </span>
                          ))}
                          {technician.services.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{technician.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Link href={`/dashboard/book/${technician.id}`}>
                        <Button className="w-full bg-red-500 hover:bg-red-600">
                          Book {technician.name.split(' ')[0]}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/search-results">
              <Button variant="outline" className="px-8 py-3">
                View All Technicians
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Become a Technician Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a TechCare Technician</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join Rwanda&apos;s leading tech support platform and start earning while helping others
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              )
            })}
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of technicians already earning on TechCare. 
              Complete your profile, get verified, and start receiving job requests.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button className="bg-red-500 hover:bg-red-600 px-8 py-3">
                Apply to Join
              </Button>
              <Button variant="outline" className="px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Requirements</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Technical Skills</h4>
                    <p className="text-gray-600">Proven experience in computer repair, networking, or mobile devices</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Background Check</h4>
                    <p className="text-gray-600">Clean criminal record and identity verification</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Communication</h4>
                    <p className="text-gray-600">Fluent in Kinyarwanda and English (French is a plus)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Equipment</h4>
                    <p className="text-gray-600">Own basic tools and reliable transportation</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-96">
              <Image
                src="/images/sammyayot254-vIQDv6tUHYk-unsplash.jpg"
                alt="Technician at work"
                fill
                className="object-cover rounded-lg"
              />
            </div>
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
                Connecting skilled technicians with customers across Rwanda.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">For Customers</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/search-results">Find Technicians</Link></li>
                <li>How it Works</li>
                <li>Pricing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">For Technicians</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Apply to Join</li>
                <li>Requirements</li>
                <li>Earnings</li>
                <li>Support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
                <li>Press</li>
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