/**
 * Setup Test Data Endpoint
 * Creates the missing users that technicians reference
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('🔧 Setting up test data...')

    // Create users that match the technician user_ids
    const testUsers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        full_name: 'John Uwimana',
        phone_number: '+250 788 123 456',
        email: 'john.uwimana@techcare.rw',
        role: 'TECHNICIAN',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002', 
        full_name: 'Marie Mukamana',
        phone_number: '+250 788 234 567',
        email: 'marie.mukamana@techcare.rw',
        role: 'TECHNICIAN',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        full_name: 'Paul Nzeyimana', 
        phone_number: '+250 788 345 678',
        email: 'paul.nzeyimana@techcare.rw',
        role: 'TECHNICIAN',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001', // Test customer ID used in booking
        full_name: 'Test Customer',
        phone_number: '+250 788 999 999',
        email: 'customer@techcare.rw',
        role: 'CUSTOMER',
        is_active: true
      }
    ]

    console.log('Creating users:', testUsers.map(u => `${u.full_name} (${u.role})`))

    // Insert users (ignore conflicts if they already exist)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .upsert(testUsers, { onConflict: 'id' })
      .select()

    if (usersError) {
      console.error('Error creating users:', usersError)
      return NextResponse.json({
        success: false,
        error: `Failed to create users: ${usersError.message}`
      }, { status: 500 })
    }

    console.log(`✅ Created ${users?.length || 0} users`)

    // Create technician_details for the technician users
    const technicianDetails = [
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        specialization: 'Computer Repair',
        experience: 'Over 5 years experience in computer hardware and software repair',
        gender: 'Male',
        age: 32,
        date_of_birth: '1992-03-15',
        rate: 15000,
        is_available: true,
        approval_status: 'APPROVED'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        specialization: 'Network Setup',
        experience: 'Expert in network configuration and wireless setup. 4+ years experience',
        gender: 'Female',
        age: 28,
        date_of_birth: '1996-07-22',
        rate: 18000,
        is_available: true,
        approval_status: 'APPROVED'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440004',
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        specialization: 'Phone Repair',
        experience: 'Specialized in mobile device repair and troubleshooting. 3+ years experience',
        gender: 'Male',
        age: 30,
        date_of_birth: '1994-11-08',
        rate: 12000,
        is_available: true,
        approval_status: 'APPROVED'
      }
    ]

    console.log('Creating technician details:', technicianDetails.map(t => `${t.specialization} (user_id: ${t.user_id})`))

    // Insert technician details (ignore conflicts if they already exist)
    const { data: techDetails, error: techDetailsError } = await supabase
      .from('technician_details')
      .upsert(technicianDetails, { onConflict: 'id' })
      .select()

    if (techDetailsError) {
      console.warn('Warning creating technician details:', techDetailsError)
      // Don't fail the whole operation if technician details fail
    }

    console.log(`✅ Created ${techDetails?.length || 0} technician detail records`)

    return NextResponse.json({
      success: true,
      message: 'Test data setup completed',
      data: {
        users_created: users?.length || 0,
        technician_details_created: techDetails?.length || 0,
        users: users,
        technician_details: techDetails
      }
    })

  } catch (error) {
    console.error('Setup test data error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}