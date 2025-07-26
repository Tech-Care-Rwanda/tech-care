/**
 * Get Booking by ID API Endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params?.id
    
    console.log('🔍 Fetching booking by ID:', bookingId)

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Fetch booking from Supabase (without joins to avoid ambiguity)
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (error) {
      console.error('❌ Error fetching booking:', error)
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: `Booking with ID ${bookingId} not found` },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    console.log('✅ Booking fetched successfully:', booking.id)

    return NextResponse.json({
      success: true,
      booking
    })

  } catch (error) {
    console.error('💥 Booking fetch error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}