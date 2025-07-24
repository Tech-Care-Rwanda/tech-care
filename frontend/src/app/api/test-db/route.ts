/**
 * Database Test Endpoint
 * Tests foreign key relationships and available data
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Testing database relationships...')

    // Test 1: Get sample users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, full_name, role')
      .limit(3)

    // Test 2: Get sample technicians
    const { data: technicians, error: techError } = await supabase
      .from('technician_details')
      .select('id, user_id, specialization, is_available')
      .limit(3)

    // Test 3: Get sample services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, serviceName, price')
      .limit(3)

    // Test 4: Get sample bookings to see current structure
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1)

    return NextResponse.json({
      success: true,
      data: {
        users: {
          data: users,
          error: usersError?.message,
          count: users?.length || 0
        },
        technicians: {
          data: technicians,
          error: techError?.message,
          count: technicians?.length || 0
        },
        services: {
          data: services,
          error: servicesError?.message,
          count: services?.length || 0
        },
        bookings: {
          data: bookings,
          error: bookingsError?.message,
          count: bookings?.length || 0,
          structure: bookings?.[0] ? Object.keys(bookings[0]) : []
        }
      },
      validation: {
        foreign_keys: {
          users_exist: users && users.length > 0,
          technicians_exist: technicians && technicians.length > 0,
          services_exist: services && services.length > 0,
          technician_user_link: technicians && technicians.some(t => t.user_id)
        }
      }
    })

  } catch (error) {
    console.error('Database test error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}