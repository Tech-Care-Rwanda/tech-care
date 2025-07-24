/**
 * Get Bookings for Technician API Endpoint
 * Fetches all bookings assigned to a specific technician
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { technicianId: string } }
) {
  try {
    const technicianId = params.technicianId
    
    console.log('🔍 Fetching bookings for technician:', technicianId)

    if (!technicianId) {
      return NextResponse.json(
        { error: 'Technician ID is required' },
        { status: 400 }
      )
    }

    // Fetch bookings from Supabase where technician_id matches
    // Note: technician_id in bookings table should match the user_id of the technician
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('technician_id', technicianId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching technician bookings:', error)
      
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    // Also fetch customer details for each booking to display in dashboard
    let bookingsWithCustomers = []
    
    if (bookings && bookings.length > 0) {
      // Get unique customer IDs
      const customerIds = [...new Set(bookings.map(b => b.customer_id))]
      
      // Fetch customer details (might fail due to RLS, but we'll try)
      const { data: customers } = await supabase
        .from('users')
        .select('id, full_name, phone_number, email')
        .in('id', customerIds)
      
      // Combine booking data with customer info
      bookingsWithCustomers = bookings.map(booking => ({
        ...booking,
        customer: customers?.find(c => c.id === booking.customer_id) || {
          id: booking.customer_id,
          full_name: 'Anonymous Customer',
          phone_number: '+250 000 000 000',
          email: 'anonymous@techcare.rw'
        }
      }))
    } else {
      bookingsWithCustomers = bookings || []
    }

    console.log(`✅ Found ${bookingsWithCustomers.length} bookings for technician ${technicianId}`)

    return NextResponse.json({
      success: true,
      bookings: bookingsWithCustomers,
      count: bookingsWithCustomers.length
    })

  } catch (error) {
    console.error('💥 Technician bookings fetch error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}