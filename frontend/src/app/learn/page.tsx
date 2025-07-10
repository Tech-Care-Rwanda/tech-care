"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { 
  Search, 
  UserCheck, 
  Calendar, 
  CheckCircle,
  Shield,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LearnPage() {
  const steps = [
    {
      number: 1,
      title: "Search & Browse",
      description: "Tell us what you need help with, when, and where. Browse through vetted technicians in your area.",
      icon: Search,
      image: "/images/thisisengineering-hnXf73-K1zo-unsplash.jpg"
    },
    {
      number: 2,
      title: "Choose Your Technician",
      description: "Compare ratings, reviews, and prices. Select the technician that best fits your needs and budget.",
      icon: UserCheck,
      image: "/images/samsung-memory-KTF38UTEKR4-unsplash.jpg"
    },
    {
      number: 3,
      title: "Book & Schedule",
      description: "Choose your preferred time and confirm your booking. Get instant confirmation and technician contact details.",
      icon: Calendar,
      image: "/images/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg"
    },
    {
      number: 4,
      title: "Get Help & Pay",
      description: "Your technician arrives on time, fixes your issue, and you pay securely through the platform.",
      icon: CheckCircle,
      image: "/images/md-riduwan-molla-ZO0weaaDrBs-unsplash.jpg"
    }
  ]

  const faqs = [
    {
      question: "How do I know if a technician is qualified?",
      answer: "All TechCare technicians go through a rigorous vetting process including background checks, skill assessments, and identity verification. Look for the verification badge on their profiles."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We offer a satisfaction guarantee. If you're not happy with the service, contact our support team within 24 hours and we'll work to make it right, including potential refunds."
    },
    {
      question: "How much does TechCare cost?",
      answer: "Pricing varies by service type and technician. Most services range from 5,000-25,000 RWF. You'll see exact pricing before booking, with no hidden fees."
    },
    {
      question: "Is it safe to let technicians into my home?",
      answer: "Yes. All technicians are background-checked and insured. You can also view their ratings, reviews, and contact them directly before they arrive."
    },
    {
      question: "What areas do you serve?",
      answer: "We currently serve all major areas in Kigali, with plans to expand to other cities in Rwanda soon. Check availability in your area when searching."
    },
    {
      question: "Can I get help urgently?",
      answer: "Yes! Many technicians offer same-day service. When booking, select 'Urgent' for faster response times (additional fees may apply)."
    }
  ]

  const tips = [
    {
      title: "Prepare for Your Technician's Visit",
      content: "Clear the workspace, have your devices ready, and prepare a list of issues you're experiencing."
    },
    {
      title: "Ask Questions",
      content: "Don't hesitate to ask your technician to explain what they're doing or for tips to prevent future issues."
    },
    {
      title: "Keep Important Data Backed Up",
      content: "Always backup important files before any repair work. Our technicians can help you set up automatic backups."
    },
    {
      title: "Be Specific About Issues",
      content: "The more details you provide about the problem, the better prepared your technician will be."
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
            How TechCare Works
          </h1>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Get tech support in 4 simple steps. Learn how to get the most out of TechCare 
            and keep your devices running smoothly.
          </p>
          <Link href="/search-results">
            <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Try It Now
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Getting tech help has never been easier. Follow these simple steps to connect with expert technicians.
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 1
              
              return (
                <div key={step.number} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={`${isEven ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                        {step.number}
                      </div>
                      <Icon className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                  </div>
                  
                  <div className={`${isEven ? 'lg:col-start-1' : ''}`}>
                    <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Safety is Our Priority</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We take safety seriously with comprehensive vetting and insurance coverage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Background Checks</h3>
              <p className="text-gray-600">All technicians undergo thorough background checks and identity verification before joining our platform.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Reviews</h3>
              <p className="text-gray-600">Read genuine reviews from real customers to make informed decisions about your technician.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Insurance Coverage</h3>
              <p className="text-gray-600">All work is covered by insurance, giving you peace of mind during every service call.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pro Tips</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get the most out of your TechCare experience with these helpful tips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{tip.title}</h3>
                  <p className="text-gray-600">{tip.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-lg">
              Everything you need to know about using TechCare
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust TechCare for their tech support needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/search-results">
              <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Find Help Now
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-3 text-lg">
                Browse Services
              </Button>
            </Link>
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
                Learn how to get the most out of your technology with expert help when you need it.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Getting Started</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/learn">How it Works</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/search-results">Find Technicians</Link></li>
                <li>Pricing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Help Center</li>
                <li>Safety</li>
                <li>Contact Us</li>
                <li>Trust & Safety</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>About Us</li>
                <li><Link href="/technicians">Become a Technician</Link></li>
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