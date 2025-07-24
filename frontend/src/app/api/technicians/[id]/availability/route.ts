/**
 * Update Technician Availability API Endpoint
 * Allows technicians to toggle their availability status
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const technicianId = params.id
    const body = await request.json()
    const { is_available } = body
    
    console.log('🔄 Updating technician availability:', { technicianId, is_available })

    if (!technicianId) {
      return NextResponse.json(
        { error: 'Technician ID is required' },
        { status: 400 }
      )
    }

    if (typeof is_available !== 'boolean') {
      return NextResponse.json(
        { error: 'is_available must be a boolean value' },
        { status: 400 }
      )
    }

    // Update technician availability in technician_details table using user_id
    const { data: technician, error } = await supabase
      .from('technician_details')
      .update({
        is_available,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', technicianId) // Use user_id since that's what we pass from dashboard
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating technician availability:', error)
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: `Technician with user ID ${technicianId} not found` },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    if (!technician) {
      return NextResponse.json(
        { error: 'Technician not found after update' },
        { status: 404 }
      )
    }

    console.log('✅ Technician availability updated successfully:', technician.id, '→', technician.is_available)

    return NextResponse.json({
      success: true,
      technician,
      message: `Availability ${is_available ? 'enabled' : 'disabled'}`
    })

  } catch (error) {
    console.error('💥 Technician availability update error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}