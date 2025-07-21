'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import {
  Monitor,
  Smartphone,
  Wifi,
  Settings,
  Shield,
  Wrench,
  Clock,
  ArrowRight,
  Hammer,
  Zap,
  Wind,
  PaintBucket,
  Refrigerator,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Helper functions for data transformation
const Icons = {
  'Computer Repair': Monitor,
  'Internet/WiFi': Wifi,
  Plumbing: Wrench,
  Electrical: Zap,
  HVAC: Wind,
  Carpentry: Hammer,
  Painting: PaintBucket,
  'Appliance Repair': Refrigerator,
  Cleaning: Sparkles,
};

const getCategoryFeatures = (categoryName: string) => {
  const featureMap: Record<string, string[]> = {
    'Computer Repair': [
      'Hardware Setup',
      'Software Installation',
      'Troubleshooting',
      'Data Recovery',
    ],
    'Internet/WiFi': [
      'WiFi Setup',
      'Network Security',
      'Speed Optimization',
      'Smart Home Integration',
    ],
    Plumbing: ['Leak Repairs', 'Pipe Installation', 'Drain Cleaning', 'Emergency Service'],
    Electrical: ['Wiring', 'Outlet Installation', 'Circuit Repairs', 'Safety Inspections'],
    HVAC: ['AC Repair', 'Heating Systems', 'Ventilation', 'Maintenance'],
    Carpentry: ['Custom Furniture', 'Repairs', 'Installation', 'Woodworking'],
    Painting: ['Interior Painting', 'Exterior Painting', 'Touch-ups', 'Color Consultation'],
    'Appliance Repair': ['Refrigerator Repair', 'Washing Machine', 'Oven Repair', 'Dishwasher'],
    Cleaning: ['Deep Cleaning', 'Regular Maintenance', 'Sanitization', 'Organization'],
  };
  return (
    featureMap[categoryName] || [
      'Professional Service',
      'Quality Guaranteed',
      'Expert Technicians',
      'Fast Response',
    ]
  );
};

const getDefaultImage = (categoryName: string) => {
  const imageMap: Record<string, string> = {
    'Computer Repair': '/images/thisisengineering-hnXf73-K1zo-unsplash.jpg',
    'Internet/WiFi': '/images/samsung-memory-KTF38UTEKR4-unsplash.jpg',
    Cleaning: '/images/sammyayot254-vIQDv6tUHYk-unsplash.jpg',
  };
  return imageMap[categoryName] || '/images/sxriptx-7Kehl5idKbU-unsplash.jpg';
};

const getCategorySlug = (categoryName: string) => {
  const slugMap: Record<string, string> = {
    'Computer Repair': 'computer',
    'Internet/WiFi': 'networking',
    Plumbing: 'plumbing',
    Electrical: 'electrical',
    HVAC: 'hvac',
    Carpentry: 'carpentry',
    Painting: 'painting',
    'Appliance Repair': 'appliances',
    Cleaning: 'cleaning',
  };
  return slugMap[categoryName] || 'general';
};

export default function ServicesPage() {
  const router = useRouter();

  const [services, setServices] = useState([]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/services/all');
        const data = await response.json();
        console.log('Fetched services:', data);
        setServices(
          data.data.services.map(
            (service) => ({
              id: service.id,
              title: service.serviceName,
              description: service.description,
              icon: Icons[service.category.name] || Monitor, // Use mapping for icons
              price: `From ${service.price * 1000} RWF`, // Assume price conversion from database
              duration: service.duration || 'Varies',
              features: getCategoryFeatures(service.category.name), // Existing helper function
              image: service.imageUrl || getDefaultImage(service.category.name),
              serviceId: getCategorySlug(service.category.name),
            }),
          ),
        );
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header userType={null} variant="default" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-pink-600 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Professional Tech Support Services
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-red-100">
            Get expert help with all your technology needs. From computer setup to network security,
            our certified technicians are here to help you.
          </p>
          <Link href="/search-results">
            <Button className="bg-white px-8 py-3 text-lg text-red-600 hover:bg-gray-100">
              Find Technicians
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Comprehensive tech support solutions for individuals and businesses in Rwanda
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.id}
                  className="overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="relative h-48">
                    <Image src={service.image} alt={service.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute left-4 top-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                        <Icon className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{service.title}</h3>
                    <p className="mb-4 text-gray-600">{service.description}</p>

                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-4 w-4" />
                          {service.duration}
                        </div>
                        <div className="text-lg font-semibold text-red-600">{service.price}</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="mb-2 font-medium text-gray-900">What&apos;s included:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500"></div>
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
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">Need Custom Tech Support?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
            Don&apos;t see what you&apos;re looking for? Our technicians can help with custom
            solutions tailored to your specific needs.
          </p>
          <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/search-results">
              <Button className="bg-red-500 px-8 py-3 hover:bg-red-600">Find Technicians</Button>
            </Link>
            <Button
              variant="outline"
              className="border-white px-8 py-3 text-white hover:bg-white hover:text-gray-900"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                  <span className="text-sm font-bold text-white">TC</span>
                </div>
                <span className="text-xl font-bold text-gray-900">TechCare</span>
              </div>
              <p className="text-gray-600">
                Professional tech support services across Rwanda. Get help when you need it.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Computer Support</li>
                <li>Mobile Device Help</li>
                <li>Network & WiFi</li>
                <li>Software Solutions</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/learn">How it Works</Link>
                </li>
                <li>
                  <Link href="/technicians">Become a Technician</Link>
                </li>
                <li>About Us</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Help Center</li>
                <li>Safety</li>
                <li>Trust & Safety</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>&copy; 2025 TechCare Rwanda. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
