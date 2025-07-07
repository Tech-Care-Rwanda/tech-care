import { Layout } from "@/components/layout/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const services = [
    {
      title: "Tech support",
      description: "At your location",
      gradient: "from-green-400 to-blue-500",
      image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg"
    },
    {
      title: "Remote help",
      description: "Get Online Help from Experts",
      gradient: "from-purple-400 to-pink-500",
      image: "/images/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg"
    },
    {
      title: "Training",
      description: "Get trainings on proper usage",
      gradient: "from-red-400 to-pink-500",
      image: "/images/sxriptx-7Kehl5idKbU-unsplash.jpg"
    },
    {
      title: "24/7 Support",
      description: "Anytime, anywhere faster",
      gradient: "from-orange-400 to-red-500",
      image: "/images/md-riduwan-molla-ZO0weaaDrBs-unsplash.jpg"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">TC</span>
            </div>
            <span className="text-white font-semibold text-lg sm:text-xl">TechCare</span>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/services" className="text-white hover:text-gray-200 transition-colors">Services</Link>
            <Link href="/technicians" className="text-white hover:text-gray-200 transition-colors">Technicians</Link>
            <Link href="/learn" className="text-white hover:text-gray-200 transition-colors">Learn</Link>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" className="hidden sm:flex text-white hover:bg-white/10 text-sm px-3 py-2">
              Become a Technician
            </Button>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 w-8 h-8 sm:w-10 sm:h-10">
                🌐
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 w-8 h-8 sm:w-10 sm:h-10">
                ☰
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

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
          <div className="bg-white rounded-2xl sm:rounded-full p-3 sm:p-2 max-w-4xl mx-auto shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-full hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-left">
                  <p className="font-semibold text-xs sm:text-sm text-gray-900">Location</p>
                  <p className="text-gray-500 text-xs sm:text-sm">Where are you?</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-full hover:bg-gray-50 cursor-pointer sm:border-l border-gray-200 transition-colors">
                <div className="text-left">
                  <p className="font-semibold text-xs sm:text-sm text-gray-900">Service Type</p>
                  <p className="text-gray-500 text-xs sm:text-sm">Select Service</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-full hover:bg-gray-50 cursor-pointer md:border-l border-gray-200 transition-colors">
                <div className="text-left">
                  <p className="font-semibold text-xs sm:text-sm text-gray-900">Urgency</p>
                  <p className="text-gray-500 text-xs sm:text-sm">When Needed</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-full hover:bg-gray-50 cursor-pointer md:border-l border-gray-200 transition-colors">
                <div className="flex-1 text-left">
                  <p className="font-semibold text-xs sm:text-sm text-gray-900">Details</p>
                  <p className="text-gray-500 text-xs sm:text-sm">Describe Issue</p>
                </div>
                <Button size="icon" className="bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight px-2">
              Need tech help? We've got you covered.
            </h1>
            <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold">
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
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
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
