/**
 * Update Booking Status API Endpoint
 * Allows technicians to update booking status (Accept/Decline/Start/Complete)
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id
    const body = await request.json()
    const { status, notes } = body
    
    console.log('🔄 Updating booking status:', { bookingId, status, notes })

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status values
    const validStatuses = ['pending', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled', 'expired']
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      status: status.toLowerCase(),
      updated_at: new Date().toISOString()
    }

    // Add status-specific timestamps
    if (status.toLowerCase() === 'confirmed') {
      updateData.confirmed_at = new Date().toISOString()
    } else if (status.toLowerCase() === 'completed') {
      updateData.completed_at = new Date().toISOString()
    } else if (status.toLowerCase() === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString()
    } else if (status.toLowerCase() === 'scheduled') {
      updateData.scheduled_at = new Date().toISOString()
    }

    // Add technician notes if provided
    if (notes) {
      updateData.technician_notes = notes
    }

    // Check if booking exists first
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, status, technician_id')
      .eq('id', bookingId)
      .single()

    if (fetchError) {
      console.error('❌ Error fetching booking for update:', fetchError)
      return NextResponse.json(
        { error: `Booking not found: ${fetchError.message}` },
        { status: 404 }
      )
    }

    console.log('📋 Found booking for update:', existingBooking)

    // Update booking in Supabase
    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating booking status:', error)
      
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
        { error: 'Booking not found after update' },
        { status: 404 }
      )
    }

    console.log('✅ Booking status updated successfully:', booking.id, '→', booking.status)

    return NextResponse.json({
      success: true,
      booking,
      message: `Booking status updated to ${status}`
    })

  } catch (error) {
    console.error('💥 Booking status update error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}