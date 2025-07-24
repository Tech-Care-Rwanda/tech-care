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

    return NextResponse.json({
      success: true,
      message: 'Test data setup completed',
      data: {
        users_created: users?.length || 0,
        users: users
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