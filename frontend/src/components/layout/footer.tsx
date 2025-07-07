import * as React from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { serviceCategories } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const companyLinks = [
    { label: "About TechCare", href: "/about" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ]

  const supportLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Safety", href: "/safety" },
    { label: "Contact Support", href: "/support" },
    { label: "Trust & Safety", href: "/trust-safety" },
    { label: "Community Guidelines", href: "/guidelines" },
  ]

  const legalLinks = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/techcarerwanda", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/techcarerwanda", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/techcarerwanda", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/techcarerwanda", label: "LinkedIn" },
  ]

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">TC</span>
                </div>
                <span className="font-bold">TechCare Rwanda</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connecting Rwandan households with certified technology professionals for reliable, 
                affordable tech support services.
              </p>
              
              {/* Contact Information */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+250 788 123 456</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>support@techcarerwanda.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Kigali, Rwanda</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2">
                {serviceCategories.slice(0, 6).map((service) => (
                  <li key={service.id}>
                    <Link 
                      href={`/services/${service.id}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Social */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 mb-6">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Links */}
              <div>
                <h4 className="font-medium mb-3 text-sm">Follow Us</h4>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <Link 
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
              <p>© {currentYear} TechCare Rwanda. All rights reserved.</p>
              <span className="hidden sm:inline">•</span>
              <p>Proudly serving Rwanda 🇷🇼</p>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Language:</span>
              <select className="border border-input rounded px-2 py-1 bg-background text-sm">
                <option value="en">🇬🇧 English</option>
                <option value="rw">🇷🇼 Kinyarwanda</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 