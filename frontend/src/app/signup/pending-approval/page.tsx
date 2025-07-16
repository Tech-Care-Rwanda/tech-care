"use client"

import React from 'react'
import Link from 'next/link'
import { CheckCircle, Clock, Mail, Home, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PendingApprovalPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900">TechCare</span>
                        </Link>
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors">Services</Link>
                            <Link href="/technicians" className="text-gray-600 hover:text-gray-900 transition-colors">Technicians</Link>
                            <Link href="/learn" className="text-gray-600 hover:text-gray-900 transition-colors">Learn</Link>
                            <Link href="/login" className="text-red-500 hover:text-red-600 transition-colors font-medium">Sign In</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full">
                    <Card className="bg-white shadow-xl">
                        <CardHeader className="text-center pb-6">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-10 h-10 text-yellow-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                                Application Submitted Successfully!
                            </CardTitle>
                            <p className="text-gray-600">
                                Your technician application is now under review by our admin team.
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Success Message */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-medium text-green-800 mb-1">Registration Complete</h3>
                                        <p className="text-sm text-green-700">
                                            We've received your application and all required documents.
                                            You'll be notified once the review process is complete.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* What's Next */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                                    <Mail className="w-5 h-5 mr-2" />
                                    What's Next?
                                </h3>
                                <ul className="space-y-2 text-sm text-blue-700">
                                    <li className="flex items-start">
                                        <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                        Our admin team will review your application and credentials
                                    </li>
                                    <li className="flex items-start">
                                        <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                        You'll receive an email notification with the review result
                                    </li>
                                    <li className="flex items-start">
                                        <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                        If approved, you can sign in and start accepting jobs
                                    </li>
                                </ul>
                            </div>

                            {/* Timeline */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                <h3 className="font-medium text-gray-800 mb-3">Review Timeline</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Typical review time:</span>
                                        <span className="text-sm font-medium text-gray-900">2-3 business days</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Maximum review time:</span>
                                        <span className="text-sm font-medium text-gray-900">5 business days</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <Button asChild className="bg-red-500 hover:bg-red-600 flex-1">
                                    <Link href="/">
                                        <Home className="w-4 h-4 mr-2" />
                                        Go to Homepage
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="flex-1">
                                    <Link href="/login">
                                        Sign In Later
                                    </Link>
                                </Button>
                            </div>

                            {/* Help Section */}
                            <div className="border-t pt-6">
                                <p className="text-sm text-gray-600 text-center">
                                    Need help or have questions about your application?{' '}
                                    <Link href="/contact" className="text-red-600 hover:text-red-700 font-medium">
                                        Contact our support team
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
} 