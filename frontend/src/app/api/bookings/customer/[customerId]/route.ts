/**
 * Get Bookings by Customer ID API Endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const customerId = params.customerId
    
    console.log('🔍 Fetching bookings for customer:', customerId)

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Fetch bookings from Supabase for this customer
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching customer bookings:', error)
      
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log(`✅ Found ${bookings?.length || 0} bookings for customer ${customerId}`)

    return NextResponse.json({
      success: true,
      bookings: bookings || []
    })

  } catch (error) {
    console.error('💥 Customer bookings fetch error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}