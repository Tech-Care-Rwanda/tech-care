/**
 * Clean Booking API Endpoint
 * Handles booking creation with proper validation
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseBookingService } from '@/lib/services/supabaseBookingService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📨 Booking API received request:', body)

    // Validate required fields
    const requiredFields = [
      'customer_id',
      'technician_id', 
      'service_id',
      'service_type',
      'problem_description',
      'customer_location',
      'price_rwf'
    ]

    const missingFields = requiredFields.filter(field => !body[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Create booking using the service
    const booking = await supabaseBookingService.createBooking(body)

    console.log('✅ Booking created via API:', booking.id)

    return NextResponse.json({
      success: true,
      booking
    })

  } catch (error) {
    console.error('❌ Booking API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Booking API is working',
    endpoints: {
      'POST /api/bookings': 'Create a new booking'
    }
  })
}